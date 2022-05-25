import dotenv from 'dotenv';

dotenv.config();

const fs = require('fs');
const uuidv4 = require('uuid');

const MILLISECONDS_FACTOR = 1000;
const DAY_IN_SECONDS      = 86400;

function gitHash() {
  try {
    return fs.readFileSync('./githash', 'utf8').trim();
  }
  catch( err) {
    return '';
  }
}

const CONFIG = {
  // The basic auth is only used for talking to orchestration/reference service
  // This layer uses DEFRA IDM for managing authentication
  // When running locally please swap it with commented settings for now till ARM templates are sorted
  USE_BASIC_AUTH                : process.env.USE_BASIC_AUTH === 'true',
  DISABLE_IDM                   : process.env.DISABLE_IDM === 'true',
  MMO_ECC_REFERENCE_SVC_URL     : process.env.MMO_ECC_REFERENCE_SVC_URL || 'http://localhost:9000',
  MMO_ECC_ORCHESTRATION_SVC_URL : process.env.MMO_ECC_ORCHESTRATION_SVC_URL || 'http://localhost:5500',
  PORT                          : process.env.PORT || 3001,
  MMO_ECC_FE_LOCAL_URL          : `http://localhost:${process.env.PORT || 3001}`,
  BUSINESS_CONTINUITY_URL       : process.env.BUSINESS_CONTINUITY_URL || 'https://dev-check-export-certificate.marineservices.org.uk',
  // IDM Plugin config
  IDENTITY_APP_URL              : process.env.IDENTITY_APP_URL,
  IDENTITY_SERVICEID            : process.env.IDENTITY_SERVICEID,
  // IDM Service Role ID
  IDENTITY_SERVICEROLEID        : process.env.IDENTITY_SERVICEROLEID,
  IDENTITY_DEFAULT_POLICY       : process.env.IDENTITY_DEFAULT_POLICY,
  // TODO: Verify if chemicals is right default
  IDENTITY_DEFAULT_JOURNEY      : process.env.IDENTITY_DEFAULT_JOURNEY || 'chemicals',
  AAD_AUTHHOST                  : process.env.AAD_AUTHHOST,
  AAD_TENANTNAME                : process.env.AAD_TENANTNAME,
  DYNAMICS_RESOURCEURL          : process.env.DYNAMICS_RESOURCEURL,
  DYNAMICS_ENDPOINTBASE         : process.env.DYNAMICS_ENDPOINTBASE,
  IDENTITY_APPDOMAIN            : process.env.IDENTITY_APPDOMAIN,
  APP_USES_HTTPS                : process.env.APP_USES_HTTPS === 'true',
  INSTRUMENTATION_KEY           : process.env.INSTRUMENTATION_KEY,
  INSTRUMENTATION_CLOUD_ROLE    : process.env.INSTRUMENTATION_CLOUD_ROLE || 'mmo-cc-fe',
  GOOGLE_TAG_MANAGER_ID         : process.env.GOOGLE_TAG_MANAGER_ID,
  MAX_SESSION_LENGTH_IN_SECONDS : process.env.MAX_SESSION_LENGTH_IN_SECONDS || '172800',
  IDLE_TIME_OUT_IN_MILLISECONDS : process.env.IDLE_TIME_OUT_IN_MILLISECONDS || '300000',
  WARNING_T0_TIME_OUT_IN_MILLISECONDS: process.env.WARNING_T0_TIME_OUT_IN_MILLISECONDS || '180000',
  LIMIT_ADD_LANDINGS            : parseInt(process.env.LIMIT_ADD_LANDINGS) || 100,
  LIMIT_ADD_SPECIES             : parseInt(process.env.LIMIT_ADD_SPECIES) || 100,
  LANDING_LIMIT_DAYS_IN_THE_FUTURE: process.env.LANDING_LIMIT_DAYS_IN_THE_FUTURE || 7,
  OFFLINE_PROCESSING_TIME_IN_MINUTES: process.env.OFFLINE_PROCESSING_TIME_IN_MINUTES || '30',
  AZURE_STORAGE_URL             : process.env.AZURE_STORAGE_URL,
  // REDIS cache for IDM
  REDIS_OPTIONS                 : getRedisOptions(),
  KEY_VAULT_URL                 : process.env.KEY_VAULT_URL,
  CLIENT_ID                     : process.env.CLIENT_ID,
  CLIENT_SECRET                 : process.env.CLIENT_SECRET,
  REF_SVC_USER_SECRET             : 'REF-SERVICE-BASIC-AUTH-USER',
  REF_SVC_PASS_SECRET             : 'REF-SERVICE-BASIC-AUTH-PASSWORD',
  ORCH_SVC_USER_SECRET            : 'ORCH-BASIC-AUTH-USER',
  ORCH_SVC_PASS_SECRET            : 'ORCH-BASIC-AUTH-PASSWORD',
  REDIS_PASSWORD_SECRET           : 'ORCH-REDIS-PASSWORD',
  IDM_CLIENTID                    : 'IDM-CLIENTID',
  IDM_CLIENTSECRET                : 'IDM-CLIENTSECRET',
  DYN_AADCLIENTID                 : 'DYN-AADCLIENTID',
  DYN_ADDCLIENTSECRET             : 'DYN-AACLIENTSECRET',
  IDENTITY_APP_MGT_URL            : process.env.IDENTITY_APP_MGT_URL || 'https://idm-dev-public.azure.defra.cloud/account-management/me',
  IDENTITY_COOKIEPASSWORD_SECRET  : 'IDENTITY-COOKIEPASSWORD',
  CATCH_CERT_HELP_URL             : process.env.CATCH_CERT_HELP_URL || 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal',
  STORAGE_DOC_HELP_URL            : process.env.STORAGE_DOC_HELP_URL || 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal',
  PROCESSING_STATEMENT_HELP_URL   : process.env.PROCESSING_STATEMENT_HELP_URL || 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal',
  FEEDBACK_URL                    : process.env.FEEDBACK_URL || 'https://defragroup.eu.qualtrics.com/jfe/form/SV_3q6Yrf53I3bdoCa',
  AAD_CLIENTID                    : 'AAD-CLIENTID',
  AAD_CLIENTSECRET                : 'AAD-CLIENTSECRET',
  AAD_TENANTID                    : 'AAD-TENANTID',
  AXIOS_TIMEOUT                   : +process.env.AXIOS_TIMEOUT || 60000,
  BASE_URL                        : process.env.BASE_URL || 'http://localhost:3001',
  ENABLE_ERROR_PAGE               : process.env.ENABLE_ERROR_PAGE && ['yes', 'true'].includes((process.env.ENABLE_ERROR_PAGE).toLowerCase()),
  GIT_HASH                        : gitHash(),
  BLOB_STORAGE_CONNECTION         : 'BLOB-STORAGE-CONNECTION',
  EVENT_HUB_CONNECTION_STRING     : process.env.eventHubConnectionString,
  EVENT_HUB_NAMESPACE             : process.env.eventHubNamespace || 'insights-application-logs',
  MAXIMUM_CONCURRENT_DRAFTS       : parseInt(process.env.MAXIMUM_CONCURRENT_DRAFTS) || 50,
  ENABLE_TRANSLATION              : process.env.ENABLE_TRANSLATION === 'true',
  languages                       : { english: 'en_UK', welsh: 'cy_UK' },
  authStrategies                  : () => {
    if (CONFIG.DISABLE_IDM) {
      return false;
    }
    return {
      strategies: [
        'admin',
        'idm',
      ]
    };
  },
  KEY_VAULT_ENCRYPTION_KEY        : process.env.KEY_VAULT_ENCRYPTION_KEY || 'myTotalySecretKey',
  MAX_UPLOAD_FILE_SIZE            : process.env.MAX_UPLOAD_FILE_SIZE || 10000,
  GA_ANALYTICS_SHA                : process.env.GA_ANALYTICS_SHA,
};


function getRedisOptions() {
  let options = {
    host: process.env.REDIS_HOST_NAME,
    port: process.env.REDIS_HOST_PORT || 6380,
  };

  // if tls host is provided use TLS setting otherwise don't add it
  if (process.env.REDIS_TLS_HOST_NAME) {
    options.tls = {
      host: process.env.REDIS_TLS_HOST_NAME
    };
  }
  return options;
}

export const getCacheCookieTtlInMilliSeconds = n => {
  return parseInt(n) * MILLISECONDS_FACTOR;
};

export const getIdmCacheExpiryInMilliseconds = n => {
  // Adding one extra day to cookie ttl as buffer so that we don't leave user logged in
  return parseInt(n) * MILLISECONDS_FACTOR + DAY_IN_SECONDS * MILLISECONDS_FACTOR;
};

export const getCacheCookieTtl = () => {
  // Defaulting to 2 days
  return getCacheCookieTtlInMilliSeconds(CONFIG.MAX_SESSION_LENGTH_IN_SECONDS);
};

export const getIdmCacheExpiry = () => {
  // Defaulting to 3 days - 3 days is how long IDM cache's TTL
  return getIdmCacheExpiryInMilliseconds(CONFIG.MAX_SESSION_LENGTH_IN_SECONDS);
};

export const generateNonce = () => {
  const generate = () => {
    return Buffer.from(uuidv4()).toString('base64');
  };

  return {
    gaAnalytics: generate(),
    gaAnalyticsTag: generate(),
    gaAnalyticsCookie: generate(),
    gaAnalyticsSearch: generate(),
    jsEnabled: generate(),
    initialState: generate(),
    eccServiceRedirect: generate()
  };
};

export const getSHA = () => {
  return {
    gaAnalyticsSHA: CONFIG.GA_ANALYTICS_SHA
  };
};

export default CONFIG;
