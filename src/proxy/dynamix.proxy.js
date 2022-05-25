import dnsCache from 'dnscache';

import { getCredentialsFromIdm, getContactsAccountLinksFromIdmWithCreds } from '../helpers/idm';
import { fetchDynamicsToken } from '../idm';
import config from '../config';

const Boom = require('@hapi/boom');
const querystring = require('querystring');
const proxyBasePath = '/dynamix/';

const getHostFromUrl = url => {
  if(url.startsWith('http')) {
    const allParts = url.split('://');
    if (allParts && allParts.length >= 2) {
      return allParts[1];
    } else {
      console.warn('Cannot find host in dynamics URL');
    }
  } else {
    console.warn('Cannot find host in dynamics URL');
  }
};

export const setupDynamixProxy = (conf, server) => {
  const cache = dnsCache({
    enable: true,
    ttl: 300,
    cachesize: 1000
  });

  const dynamicsHost = getHostFromUrl(conf.DYNAMICS_RESOURCEURL);

  if (dynamicsHost) {
    cache.lookup(dynamicsHost, (err, result) => {
      if(err) {
        console.warn('Cannot cache dynamics host name');
        console.error(err);
      } else {
        console.info('Successfully resolved dynamics resource url and cached it', result);
      }
    });
  }

  let serviceUrl = conf.DYNAMICS_RESOURCEURL + conf.DYNAMICS_ENDPOINTBASE;
  setupProxy(server, serviceUrl, proxyBasePath);
};

const setupProxy = (server, serviceUrl, proxyPath) => {
  server.route({
    method: ['GET'],
    path: proxyPath + '{service*}',
    options: {
      auth: config.authStrategies(),
      security: true
    },
    handler: {
      proxy: {
        passThrough: false,
        timeout: 5000,
        mapUri: async (req) => {

          try {
            let credentials = {};
            let dynamicsToken;
            let contactsAccountLinks;
            // let query = req.url.search ? req.url.search : '';
            let servicePath = req.params.service;
            let params;

            const { idm } = req.server.methods;
            if (idm) {
                credentials = await getCredentialsFromIdm(idm, req);
                contactsAccountLinks = await getContactsAccountLinksFromIdmWithCreds(idm, credentials);
                dynamicsToken = await fetchDynamicsToken(idm);
                switch(servicePath) {
                  case 'user-details': {
                    const {claims} = credentials;
                    if (claims && claims.sub) {
                      params = {
                        '$filter': `defra_b2cobjectid eq '${claims.sub}'`,
                        '$select': 'contactid,defra_b2cobjectid,defra_addrcoruprn,defra_addrcorbuildingnumber,defra_addrcorbuildingname,'
                          + 'defra_addrcorsubbuildingname,defra_addrcorlocality,defra_addrcordependentlocality,'
                          + 'defra_addrcorpostcode,defra_addrcorinternationalpostalcode,defra_addrcortown,defra_addrcorcounty,'
                          + '_defra_addrcorcountry_value,defra_addrcorstreet,firstname,lastname,emailaddress1,telephone1,'
                          + 'defra_tacsacceptedversion,defra_tacsacceptedon'
                      };
                      servicePath = 'contacts';
                    }
                    break;
                  }
                  case 'accounts':{
                      if (contactsAccountLinks && contactsAccountLinks.length > 0 && contactsAccountLinks[0].accountId) {
                        params = {
                          '$filter': `accountid eq '${contactsAccountLinks[0].accountId}'`,
                          '$select': 'accountid,defra_addrreguprn,defra_addrregbuildingnumber,defra_addrregbuildingname,defra_addrregsubbuildingname,'
                            + 'defra_addrreglocality,defra_addrregdependentlocality,defra_addrregpostcode,defra_addrreginternationalpostalcode,'
                            + 'defra_addrregtown,defra_addrregcounty,_defra_addrregcountry_value,defra_addrregstreet,name,emailaddress1'
                        };
                      }
                      break;
                    }
                  case 'addresses':{
                      const {claims} = credentials;
                      if (contactsAccountLinks && contactsAccountLinks.length > 0 && contactsAccountLinks[0].accountId) {
                        params = {
                          '$filter': `defra_addresstype eq 1 and statecode eq 0 and _defra_customer_value eq '${contactsAccountLinks[0].accountId}'`,
                          '$select': '_defra_address_value,_defra_customer_value',
                          '$expand': 'defra_Address($select=defra_uprn,defra_buildingname,defra_subbuildingname,defra_premises,'
                            + 'defra_street,defra_locality,defra_dependentlocality,defra_towntext,defra_county,defra_postcode,'
                            + '_defra_country_value,defra_internationalpostalcode,defra_fromcompanieshouse)'
                        };
                        servicePath = 'defra_addressdetailses';
                      } else if (claims && claims.contactId) {
                        params = {
                          '$filter': `defra_addresstype eq 3 and statecode eq 0 and _defra_customer_value eq '${claims.contactId}'`,
                          '$select': '_defra_address_value,_defra_customer_value',
                          '$expand': 'defra_Address($select=defra_uprn,defra_buildingname,defra_subbuildingname,defra_premises,'
                            + 'defra_street,defra_locality,defra_dependentlocality,defra_towntext,defra_county,defra_postcode,'
                            + '_defra_country_value,defra_internationalpostalcode,defra_fromcompanieshouse)'
                        };
                        servicePath = 'defra_addressdetailses';
                      }
                      break;
                    }
                  default:
                    // No recognised route - we will 404
                    throw Boom.notFound('Cannot find the requested page');
                }
            }
            if (params) {
              const uri = serviceUrl + servicePath + '?' + querystring.stringify(params);
              const headers = buildHeaders(dynamicsToken);
              return {uri: uri, headers: headers};
            } else {
              throw Boom.unauthorized('not authorised');
            }

          } catch (e) {
            console.log(`[DYNAMIX-PROXY][ERROR]${e} ${e.stack}`);
            throw e;
          }
        }
      }
    }
  });
};

const buildHeaders = (dynamicsToken) => {
  return {
    'Authorization': 'Bearer ' + dynamicsToken,
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=utf-8',
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    'Prefer': 'odata.maxpagesize=500, odata.include-annotations="*"'
  };
};

// used by createStore which sets up the axios instances with the base url for this service's proxy
export const getProxiedDynamixServiceUrl = conf => {
  return conf.MMO_ECC_FE_LOCAL_URL + '/dynamix/';
};
