import {setupProxy, addAuthToUrl} from './proxyUtils';

const proxyBasePath = '/reference/api/v1/';
const serviceBasePath = '/v1/';

export const setupReferenceServiceProxy = async (config, server) => {
  let serviceUrl = config.MMO_ECC_REFERENCE_SVC_URL + serviceBasePath;
  if (config.USE_BASIC_AUTH) {
    serviceUrl = addAuthToUrl(serviceUrl,
                              config.MMO_ECC_REFERENCE_SVC_USER,
                              config.MMO_ECC_REFERENCE_SVC_PASSWORD);
  }
  await setupProxy(server, serviceUrl, proxyBasePath, false, [
   'species',
   'presentations',
   'states',
   'speciesStateLookup',
   'commodities',
   'vessels',
   'countries',
   'addresses'
  ]);
};


// used by createStore which sets up the axios instances with the base url for this service's proxy
export const getProxiedReferenceServiceUrl = config => {
  let url = config.MMO_ECC_FE_LOCAL_URL + proxyBasePath;
  // TODO: Reference service URL is currently going through proxy - this will be gone once service URLs are normalized.
  // Reference service has basic auth enabled always, so no checks
  return addAuthToUrl(url);
};
