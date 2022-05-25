import setupInsights from './azureAppInsights';

import 'babel-polyfill';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';
import hapi from '@hapi/hapi';

import { autoEnrollUserForService } from './idm';
import config, { getCacheCookieTtl, getIdmCacheExpiry, generateNonce, getSHA } from './config';
import { setupOrchestrationServiceProxy } from './proxy/orchestration-service.proxy';
import { setupReferenceServiceProxy } from './proxy/reference-service.proxy';
import { setupDynamixProxy } from './proxy/dynamix.proxy';
import { setupAzureStorageProxy } from './proxy/azure-storage.proxy';
import { getCredentialsFromIdm, getContactsAccountLinksFromIdmWithCreds } from './helpers/idm';
import KeyVaultService from './helpers/keyVaultService';
import { setupAADAuth, setupAADRoutes } from './aad';
import Scooter from '@hapi/scooter';
import Blankie from 'blankie';
import logger from './logger';

setupInsights();

// TODO: This singleton was setup to enable tests, but not used atm - probably worth cleaning it up
const HapiServer = hapi.Server({
  port: config.PORT
});

const setupDefaultRoutes = (appConfig, server) => {
  server.route([
    {
      method: 'GET',
      path: '/timed-out',
      config: {
        auth: false,
        plugins: {
          blankie: {
            scriptSrc: [
              'self',
              `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaAnalyticsSearch}'`,
              `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaAnalyticsCookie}'`,
              `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaSearch}'`,
              `'nonce-${appConfig.CSP_SCRIPT_NONCE.initialState}'`,
              `'nonce-${appConfig.CSP_SCRIPT_NONCE.jsEnabled}'`,
              'az416426.vo.msecnd.net'
            ],
            styleSrc: ['self', 'unsafe-inline'],
            connectSrc: ['self', 'dc.services.visualstudio.com'],
            fontSrc: 'self',
            frameAncestors: 'none',
            generateNonces: false
          }
        },
      },
      handler: (request, h) => {
        if (server.methods.idm) {
          // TODO: Use next from query param when available?
          const redirectUrl = server.methods.idm.generateAuthenticationUrl('/');
          const store = createStore(request, redirectUrl);
          const response = renderer(request, store, {}, appConfig.gaParams, appConfig.CSP_SCRIPT_NONCE);
          return h.response(response);

        } else {
          return h.response('');
        }
      }
    },
    {
      method: 'GET',
      path: '/login-error',
      config: {
        auth: false
      },
      handler: (request, h) => {
        if (server.methods.idm) {
          const search = request.query.next.split('?')[1];
          const isBrowserReq = request.headers.accept.split(',').indexOf('text/html') >= 0;
          const reqHeaderAccept = request.headers.accept.split(', ');
          const isSortSiteReq = reqHeaderAccept.includes('application/x-ms-application') && reqHeaderAccept.includes('application/x-ms-xbap');
          const redirectUrl = server.methods.idm.generateAuthenticationUrl('/')+'&'+search;
          const notRedirectedFromRoot = request.raw.req.headers.referer && request.raw.req.headers.referer !== '/';
          const browserReqNotFromRoot = isBrowserReq && notRedirectedFromRoot;
          const browserReqFromRoot = isBrowserReq && request.raw.req.headers.referer === '/';
          const notRedirectedReqFromBrowser = isBrowserReq && !request.raw.req.headers.referer;

          //update config with ga values
          createStore(request, redirectUrl, search);

          if (browserReqNotFromRoot) {
            // Paths to which we should allow a redirect to the authentication URL
            const paths = [
              '/create-processing-statement/processing-statements',
              '/create-storage-document/storage-documents',
              '/create-catch-certificate/catch-certificates'
            ];

            const browserReqFromAuthRoot = paths.some(path => request.query.next.includes(path)) || ['/', `/?${search}`].some(path => path === request.query.next);
            const idmPluginRedirect = request.query && request.query.notLoggedInErr === 'yes' && browserReqFromAuthRoot;
            if (idmPluginRedirect) {
              return h.redirect(redirectUrl);
            }

            // User is logged in so in the event of an error log user out
            return h.redirect('/logout?backToPath=/server-logout');
          } else if (browserReqFromRoot) {
            return h.redirect(redirectUrl);

          } else if (notRedirectedReqFromBrowser) {
            return h.redirect(redirectUrl);
          }
          // Allow log in throug SortSite
          if (isSortSiteReq){
            return h.redirect(redirectUrl);
          }
          // Custom error code 599 to indicate session timeout to JS requests
          return h.response().code(599);

        } else {
          return h.response('');
        }
      }
    },
    {
      method: 'GET',
      path: '/health',
      config: {
        auth: false
      },
      handler: (request, h) => {
        return h.response({ status: 'UP' });
      }
    },
    {
      method: 'GET',
      path: '/favicon.ico',
      config: {
        auth: false
      },
      handler: (request, h) => {
        return h.response();
      }
    },
    {
      // TODO: Once DISABLE_IDM removal stabilizes remove this route
      method: 'GET',
      path: '/dynamix-local/{path*}',
      handler: (request, h) => {
        // Mock data
        return h.response({}).code(400);
      },
      options: {
        security: true
      }
    },
    {
      method: 'GET',
      path: '/{path*}',
      options: {
        auth: appConfig.authStrategies(),
        security: true
      },
      handler: async (request, h) => {
        let credentials = {}; // User details and any other info that the FE app might need
        let contactsAccountLinks; // Account Id for the logged in user (if any)
        let store, gaSearch, documentNumber, accountId;
        const { idm } = request.server.methods;
        if (idm) {
          logger.info('[IDM][handler][STARTED]');
          try {
            credentials = await getCredentialsFromIdm(idm, request);
            const logSanitisedCredentials = {
              tokenSet : credentials.tokenSet? {
                token_type : credentials.tokenSet.token_type,
                not_before : credentials.tokenSet.not_before,
                id_token_expires_in : credentials.tokenSet.id_token_expires_in,
                scope : credentials.tokenSet.scope,
                refresh_token_expires_in : credentials.tokenSet.refresh_token_expires_in
              } : undefined
            };
            logger.info(`[IDM][handler][sanitised credentials for logged user : ${JSON.stringify(logSanitisedCredentials)}]`);
            contactsAccountLinks = await getContactsAccountLinksFromIdmWithCreds(idm, credentials);
            accountId = (contactsAccountLinks && contactsAccountLinks.length > 0 && contactsAccountLinks[0].accountId) ?
              contactsAccountLinks[0].accountId : undefined;
            logger.info(`[IDM][handler][Account Id for logged user : ${accountId}]`);
            await autoEnrollUserForService(idm, credentials, request, appConfig);
          }
          catch (err) {
            logger.error(`[IDM][handler][ERROR : An error occurred while communicating with the idm -- ${err}]`);
          }

          if (appConfig.gaParams) {
            gaSearch = appConfig.gaParams;
          }

          const redirectUrl = server.methods.idm.generateAuthenticationUrl('/');
          store = createStore(request, redirectUrl, '', accountId);
        } else {
          store = createStore(request, null);
        }

        const promises = matchRoutes(Routes, request.path)
          .map(({ route, match }) => {
            route.queryParams = request.query;
            documentNumber = route.documentNumber = match.params.documentNumber;
            return { route };
          })
          .map(({ route }) => {
            return route.loadData ? route.loadData(store, route.journey, request.query) : null;
          })
          .map(promise => {
            if (promise) {
              return new Promise((resolve) => {
                promise.then(resolve).catch(resolve);
              });
            }
          });

        await Promise.all(promises);
        const context = {};
        const content = renderer(request, store, context, gaSearch, appConfig.CSP_SCRIPT_NONCE, documentNumber);

        if (context.url) {
          return h.redirect(context.url);
        }

        let responseObj = h.response(content);
        const isPrivacyNoticePage = request.path.indexOf('privacy-notice') >= 0;
        if (isPrivacyNoticePage) {
          responseObj.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          responseObj.header('Expires', '-1');
          responseObj.header('Pragma', 'no-cache');
        }

        if (context.notFound) {
          responseObj.code(404);
        }

        logger.info('Outgoing response', request.path);
        return responseObj;
      }
    }]);
};

const setupUnauthorisedSourceMapRouteHandler = (server) => {
  server.route({
    method: ['GET'],
    config: {
      auth: false
    },
    path: '/static/sourceMap/{param*}',
    handler: {
      directory: {
        path: 'public/sourceMap'
      }
    }
  });
  logger.info('Added sourcemap route handler');
};

const setupStaticContentHandler = (appConfig, server) => {
  server.route({
    method: ['GET'],
    path: '/static/assets/{param*}',
    options: {
      auth: false, //appConfig.authStrategies(),
      //security: true
    },
    handler: {
      directory: {
        path: 'public/assets'
      }
    }
  });
  logger.info('Added static content handler');
};

const setupServerLogoutHandler = (appConfig, server) => {
  server.route({
    method: ['GET'],
    path: '/server-logout',
    options: {
      auth: false, //appConfig.authStrategies(),
      //security: true
    },
    handler: (req, h) => {
      const idmLogoutUrl = `${appConfig.IDENTITY_APP_URL}/logout`;
      h.response('Clearing cookie').unstate('id');
      return h.redirect(idmLogoutUrl);
    }
  });
  logger.info('Added static handler');
};

const setupReverseProxy = async (appConfig, server) => {
  setupAzureStorageProxy(appConfig, server);
  await setupReferenceServiceProxy(appConfig, server);
  await setupOrchestrationServiceProxy(appConfig, server);
  setupDynamixProxy(appConfig, HapiServer);
  logger.info('Proxy setup complete');
};

const setupIdmPlugin = async (appConfig, server) => {
  logger.info('build setupIdmPlugin for', appConfig.IDENTITY_APPDOMAIN);
  await server.register({
    plugin: require('@envage/defra-identity-hapi-plugin'),
    options: {
      appDomain: appConfig.IDENTITY_APPDOMAIN,
      identityAppUrl: appConfig.IDENTITY_APP_URL,
      serviceId: appConfig.IDENTITY_SERVICEID,
      cookiePassword: appConfig.IDENTITY_COOKIEPASSWORD,
      clientId: appConfig.IDENTITY_CLIENTID,
      clientSecret: appConfig.IDENTITY_CLIENTSECRET,
      defaultPolicy: appConfig.IDENTITY_DEFAULT_POLICY,
      defaultJourney: appConfig.IDENTITY_DEFAULT_JOURNEY,
      isSecure: appConfig.APP_USES_HTTPS,
      aad: {
        authHost: appConfig.AAD_AUTHHOST,
        tenantName: appConfig.AAD_TENANTNAME
      },
      dynamics: {
        clientId: appConfig.DYNAMICS_AADCLIENTID,
        clientSecret: appConfig.DYNAMICS_AADCLIENTSECRET,
        resourceUrl: appConfig.DYNAMICS_RESOURCEURL,
        endpointBase: appConfig.DYNAMICS_ENDPOINTBASE
      },
      cache: appConfig.IDM_CACHE,
      cacheCookieTtlMs: getCacheCookieTtl(),
      // We're allowing automatic redirection - if you want to raise an error
      // and handle redirection that way set this to false and
      // set redirect path (disallowedRedirectPath) accordingly
      loginOnDisallow: false,
      disallowedRedirectPath: '/login-error',
      callbacks: {
        onError: (err) => {
          if (err) {
            logger.error(err);
          }
        }
      }
    }
  });
  logger.info('IDM plugin initialized for', appConfig.IDENTITY_APPDOMAIN);
};

const buildIdmCache = async (appConfig, server) => {
  const serverCacheOptions = {
    name: 'redisCache',
    provider: {
      constructor: require('@hapi/catbox-redis'),
      options: appConfig.REDIS_OPTIONS
    }
  };

  await server.cache.provision(serverCacheOptions);

  const idmCache = server.cache({
    cache: 'redisCache',
    // TODO: check cache cookie timeout setting as well and tweak this to correct time?
    expiresIn: getIdmCacheExpiry(),
    segment: 'idm-cache'
  });

  return idmCache;
};

const loadSecrets = async (conf) => {
  if (conf.USE_BASIC_AUTH) {
    const [refServiceBasicAuthUser,
      refServiceBasicAuthPassword,
      orchServiceBasicAuthUser,
      orchServiceBasicAuthPassword] = await Promise.all([
        KeyVaultService.getSecretByName(conf.REF_SVC_USER_SECRET),
        KeyVaultService.getSecretByName(conf.REF_SVC_PASS_SECRET),
        KeyVaultService.getSecretByName(conf.ORCH_SVC_USER_SECRET),
        KeyVaultService.getSecretByName(conf.ORCH_SVC_PASS_SECRET)
      ]);

    conf.MMO_ECC_REFERENCE_SVC_USER = refServiceBasicAuthUser;
    conf.MMO_ECC_REFERENCE_SVC_PASSWORD = refServiceBasicAuthPassword;
    conf.MMO_ECC_ORCHESTRATION_SVC_USER = orchServiceBasicAuthUser;
    conf.MMO_ECC_ORCHESTRATION_SVC_PASSWORD = orchServiceBasicAuthPassword;
  }

  if (process.env.APP_USES_LOCAL_IDM) {
    /* Use local settings for local dev */
    conf.IDENTITY_CLIENTID = '2f88b531-ef2b-43a6-9759-31a3fcff9fe8';
    conf.IDENTITY_CLIENTSECRET = 'O/3v03QiLjv:^&2GTdyPAO2D';
  } else {
    const [idmClientId,
      idmClientSecret] = await Promise.all([
        KeyVaultService.getSecretByName(conf.IDM_CLIENTID),
        KeyVaultService.getSecretByName(conf.IDM_CLIENTSECRET)
      ]);

    conf.IDENTITY_CLIENTID = idmClientId;
    conf.IDENTITY_CLIENTSECRET = idmClientSecret;
  }

  if (process.env.APP_USES_LOCAL_DYM) {
    /* Use local settings for local dev */
    conf.DYNAMICS_AADCLIENTID = '1484e2fa-8f5a-44d4-b61b-dda422f5a480';
    conf.DYNAMICS_AADCLIENTSECRET = 'NdYIfYMb5wg9TlvsbaGBNX5SyUUoWrsMl4bK967gv5g=';
  } else {
    const [dynAadClientId,
      dynAadClientSecret] = await Promise.all([
        KeyVaultService.getSecretByName(conf.DYN_AADCLIENTID),
        KeyVaultService.getSecretByName(conf.DYN_ADDCLIENTSECRET)
      ]);

    conf.DYNAMICS_AADCLIENTID = dynAadClientId;
    conf.DYNAMICS_AADCLIENTSECRET = dynAadClientSecret;
  }

  conf.AAD_CLIENTID = await KeyVaultService.getSecretByName(conf.AAD_CLIENTID);
  conf.AAD_CLIENTSECRET = await KeyVaultService.getSecretByName(conf.AAD_CLIENTSECRET);
  conf.AAD_TENANTID = await KeyVaultService.getSecretByName(conf.AAD_TENANTID);

  conf.BLOB_STORAGE_CONNECTION = process.env.AZURE_STORAGE_CONNECTION_STRING
    ? process.env.AZURE_STORAGE_CONNECTION_STRING
    : await KeyVaultService.getSecretByName(conf.BLOB_STORAGE_CONNECTION);

  conf.REDIS_OPTIONS.password = await KeyVaultService.getSecretByName(conf.REDIS_PASSWORD_SECRET);
  conf.IDENTITY_COOKIEPASSWORD = await KeyVaultService.getSecretByName(conf.IDENTITY_COOKIEPASSWORD_SECRET);

  conf.CSP_SCRIPT_NONCE = generateNonce();
  conf.CSP_SCRIPT_SHA = getSHA();
};

const refreshTokenOnAllRoutesIfExpired = server => {
  // Refresh our token if it has expired
  server.ext('onPreAuth', async (request, h) => {
    const { idm } = request.server.methods;
    logger.info({
      data: {
        method: request.method,
        path: request.path,
      }
    }, 'on-pre-auth');
    if (idm) {
      logger.info('[IDM][onPreAuth - getCredentials]');
      const creds = await idm.getCredentials(request);
      logger.info(`[IDM][onPreAuth - getCredentials][EXPIRED][${creds && creds.isExpired()}]`);
      if (creds && creds.isExpired()) {
        try {
          logger.info('[IDM][Refreshing expired token]');
          await idm.refreshToken(request);
          logger.info('[IDM][Refreshing expired token][SUCCESS]');
        } catch (error) {
          logger.error(error);
          logger.error('[IDM][Refreshing expired token][ERROR]', error);
        }
      }
      logger.info('[IDM][onPreAuth - getCredentials][SUCCESS]');
    }

    return h.continue;
  });

  server.ext('onPostAuth', (request, h) => {
    logger.info({
      data: {
        method: request.method,
        path: request.path,
        requestBody: request.payload || '',
        requestParams: request.params || '',
      }
    }, 'on-post-auth');

    return h.continue;
  });

  server.ext('onPreHandler', (request, h) => {
    logger.info({
      data: {
        method: request.method,
        path: request.path,
        requestBody: request.payload || '',
        requestParams: request.params || '',
      }
    }, 'on-pre-handler');

    return h.continue;
  });

  server.ext('onPostHandler', (request, h) => {
    logger.info({
      data: {
        method: request.method,
        path: request.path,
        requestBody: request.payload || '',
        requestParams: request.params || '',
      }
    }, 'on-post-handler');

    return h.continue;
  });
};

const initApp = async (appConfig) => {
  try {
    // plugins
    await HapiServer.register(require('@hapi/inert'));
    await HapiServer.register(require('@hapi/h2o2'));
    await HapiServer.register([Scooter, {
      plugin: Blankie,
      options: {
        scriptSrc: [
          'self', 'unsafe-eval',
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaAnalytics}'`,
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaAnalyticsTag}'`,
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaAnalyticsCookie}'`,
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.gaAnalyticsSearch}'`,
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.jsEnabled}'`,
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.initialState}'`,
          `'nonce-${appConfig.CSP_SCRIPT_NONCE.eccServiceRedirect}'`,
          `'sha256-${appConfig.CSP_SCRIPT_SHA.gaAnalyticsSHA}'`,
          'https://www.googletagmanager.com/',
          'https://www.google-analytics.com',
          'http://tagmanager.google.com'
        ],
        styleSrc: ['self', 'unsafe-inline', 'tagmanager.google.com', 'fonts.googleapis.com'],
        connectSrc: ['self', 'https://www.google-analytics.com'],
        fontSrc: ['self', 'data:', 'fonts.gstatic.com'],
        imgSrc: ['self', 'data:', 'ssl.gstatic.com', ' www.gstatic.com', 'www.google-analytics.com'],
        frameAncestors: 'none',
        generateNonces: false
      }
    }]);

    if (appConfig.DISABLE_IDM) {
      logger.info('Starting without IDM');

    } else {
      // By default all routes are authenticated - TODO: If IDM is enabled again (DISABLE_IDM) add a guard
      logger.info('Enabling IDM for all routes with redis cache');
      const idmCache = await buildIdmCache(appConfig, HapiServer);
      appConfig.IDM_CACHE = idmCache;

      setupAADRoutes(HapiServer);
      await setupIdmPlugin(appConfig, HapiServer);
      await setupAADAuth(HapiServer);
      await setupServerLogoutHandler(appConfig, HapiServer);
      HapiServer.auth.default('idm');
    }

    await setupReverseProxy(appConfig, HapiServer);
    setupStaticContentHandler(appConfig, HapiServer);
    setupUnauthorisedSourceMapRouteHandler(HapiServer);
    setupDefaultRoutes(appConfig, HapiServer);

    refreshTokenOnAllRoutesIfExpired(HapiServer);

    await HapiServer.ext('onPreResponse', (request, reply) => {
      logger.info({
        data: {
          method: request.method,
          path: request.path,
        }
      },
      'on-pre-response');

      if (request.response.isBoom) {
        logger.error(`[BOOM][${request.response}][ERROR][${request.response.isBoom}][REDIRECT: there-is-a-problem-with-the-service]`);
        if (appConfig.ENABLE_ERROR_PAGE) {
          // TODO This should serve static content.
          return reply.redirect('/there-is-a-problem-with-the-service');
        }
      } else {
        request.response.headers['Pragma'] = 'no-cache';
        return reply.continue;
      }
    });


    logger.info(`Server successfully started on ${appConfig.PORT}`);
    await HapiServer.start();

  } catch (e) {
    logger.error('Could not start the server. The error is', e);
  }
};

(async () => {
  await loadSecrets(config);
  await initApp(config);
})();

export default HapiServer;
