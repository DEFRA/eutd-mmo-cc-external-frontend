import {setupProxy, addAuthToUrl, defaultHandler} from './proxyUtils';

const proxyBasePath = '/orchestration/api/v1/';
const serviceBasePath = '/v1/';

export const setupOrchestrationServiceProxy = async (config, server) => {

  const serviceUrl = config.MMO_ECC_ORCHESTRATION_SVC_URL + serviceBasePath;
  const useIdToken = !config.DISABLE_IDM;
  const landingUploadUri = 'uploads/landings';

  server.route({
    method: 'POST',
    path: proxyBasePath + landingUploadUri,
    options: {
      auth: config.authStrategies(),
      payload: {
        maxBytes: config.MAX_UPLOAD_FILE_SIZE,
        failAction: function(_req, h) {
          return h.response({
            file: {
              key: 'error.upload.max-file-size',
              params: {
                maxBytes: config.MAX_UPLOAD_FILE_SIZE
              }
            }
          }).code(400).takeover();
        }
      }
    },
    handler: defaultHandler(serviceUrl, useIdToken, [], landingUploadUri)
  });

  await setupProxy(server, serviceUrl, proxyBasePath, useIdToken);
};

// used by createStore which sets up the axios instances with the base url for this service's proxy
export const getProxiedOrchestrationServiceUrl = config => {
  let url = config.MMO_ECC_FE_LOCAL_URL + proxyBasePath;
  // TODO: Reference service URL is currently going through proxy - this will be gone once service URLs are normalized.
  // Reference service has basic auth enabled always, so no checks
  return addAuthToUrl(url);
};
