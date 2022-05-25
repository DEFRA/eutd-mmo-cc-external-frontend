# This assumes that the parent image has been built locally using production and development build configuration as defra-node
# and defra-node-development tagged with a version.

ARG DEFRA_BASE_IMAGE_TAG=latest-14
FROM defradigital/node-development:$DEFRA_BASE_IMAGE_TAG as base

# We have production dependencies requiring node-gyp builds which don't
#   install cleanly with the defradigital/node image. So we'll install them here
#   and set NODE_ENV to production before copying them to the production image.
ENV NODE_ENV production
# Set the port that is going to be exposed later on in the Dockerfile as well.
ARG PORT=3001
ENV PORT=${PORT}

ARG GIT_HASH=""

# This installs the exact versions of the packages
#   listed in package-lock.json, and does not update either the package-lock.json
#   or the package.json file.
COPY --chown=node:node package*.json ./
RUN npm ci


# Using the development image (which has NODE_ENV=development) we will install
#   all devDependencies & build the project.
FROM defradigital/node-development:$DEFRA_BASE_IMAGE_TAG as development
COPY --chown=node:node . .
COPY --from=base --chown=node:node /home/node/node_modules/ ./node_modules/
RUN npm ci
RUN npm run prod:build-server
RUN npm run prod:build-client


# The test image will be used as part of the CI process
FROM development as test
CMD ["npm", "run", "test"]

# Production stage exposes service port, copies in built app code and declares the Node app as the default command
FROM defradigital/node:$DEFRA_BASE_IMAGE_TAG as production

# Copy in the files that we built using the tools in the development stage. The final production stage will have the built files,
#   but none of the tools required to build those files. This reduces the attack surface, and also the size of the final production image
COPY --from=base --chown=node:node /home/node/node_modules/ node_modules/
COPY --from=development --chown=node:node /home/node/build/ build/
COPY --from=development --chown=node:node /home/node/public/ public/
RUN echo $GIT_HASH > githash

# Again, be explict about the permissions we want for this stage
USER node
WORKDIR /home/node

# Expose the PORT passed in at the start of the file
EXPOSE ${PORT}

#The base node image sets a very verbose log level, we're just going to warn
ENV NPM_CONFIG_LOGLEVEL=info

# This is the command that is run for the production service. The parent image has an ENTRYPOINT that uses a lightweight
#   init program "tini" that handles signals. As long as we don't override the ENTRYPOINT the "tini" routine will handle signals and
#   orphaned processes
CMD ["node", "build/bundle.js"]