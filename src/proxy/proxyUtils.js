import Iron from '@hapi/iron';
// path is the relative path to be proxied
// anything after the path becomes 'req.params.service' i guess
// serviceUrl is the 'real' url of the service
import urlParser from 'url-parse';
import config from '../config';
import { getCredentials } from '../helpers/idm';
import logger from '../logger';

export const setupProxy = (server, serviceUrl, proxyBasePath, useIdToken=false, whitelist=[]) => {
  server.route({
    method: ['POST', 'GET', 'PUT', 'DELETE'],
    path: proxyBasePath + '{service*}',
    options: {
      auth: config.authStrategies()
    },
    handler: defaultHandler(serviceUrl, useIdToken, whitelist)
  });
};

export const defaultHandler = (serviceUrl, useIdToken=false, whitelist=[], apiPath = null) => ({
  proxy: {
    passThrough: true,
    mapUri: async (req) => {
      const query = req.url.search ? req.url.search : '';
      const servicePath = apiPath || req.params.service;
      logger.info('received the following request', `[SERVICE-URI][${serviceUrl}][SERVICE-PATH][${servicePath}]`);
      const uri = serviceUrl + servicePath + query;
      const documentNumber = req.query ? req.query.documentNumber : undefined;

      if (whitelist.length > 0 && whitelist.findIndex((s) => servicePath.startsWith(s)) === -1)
        return {uri: serviceUrl + 'notfound', headers: {}};

      let headers = {};

      if (useIdToken) {
        try {
          const idToken = req.state.id;
          if(idToken) {
            const unencrypted = await Iron.unseal(idToken, config.IDENTITY_COOKIEPASSWORD, Iron.defaults);
            headers = {
              'Authorization': `Bearer ${unencrypted}`
            };

          } else {
            const creds = await getCredentials(req);
            const { tokenSet } = creds;
            const { id_token } = tokenSet;
            headers = {
              'Authorization': `Bearer ${id_token}`
            };
          }
        } catch(e) {
          console.error('Not setting id token in the header');
          console.error(e);
        }
      }

      if (documentNumber) {
        headers['documentnumber'] = documentNumber;
      }

      logger.info({ data: { uri }}, 'handler');
      return { uri, headers };
    }
  }
});

export const addAuthToUrl = (url, username, password) => {
  if (username === undefined || password === undefined)
    return url;

  const parsed = urlParser(url);
  parsed.set('username', username);
  parsed.set('password', password);
  return parsed.toString();
};
