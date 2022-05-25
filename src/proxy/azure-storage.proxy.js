const Wreck = require('@hapi/wreck');
import appConfig from '../config';
import azureStorage from 'azure-storage';
import { addAuthToUrl } from './proxyUtils';
import { monitoringController } from '../client/controller/monitoring-controller';

const proxyBasePath = '/pdf/';
const qrProxyBasePath = '/qr/';
const PROTECTIVE_MONITORING_PRIORITY_NORMAL = 0;
const PROTECTIVE_MONITORING_PRIORITY_EXCEPTION = 9;
const PROTECTIVE_MONITORING_QR_VOID = 'VOID';
const PROTECTIVE_MONITORING_QR_404 = '404';
const DOCUMENT_NUMBER_INDICATOR_POSITION = [9, 11];
const documentInfo = {};

export const setupAzureStorageProxy = (config, server) => {
  if (config.DISABLE_IDM) {
    setupProxy(server, proxyBasePath, false);
    setupProxy(server, qrProxyBasePath, false);

  } else {
    // This should be default
    setupProxy(server, proxyBasePath, true);
    setupProxy(server, qrProxyBasePath, false);
  }
};


const setupProxy = (server, basePath, shouldAuth = true) => {
  server.route({
    method: ['GET'],
    path: basePath + '{service*}',
    options: { auth: getAuthOptions(shouldAuth) },
    handler: {
      proxy: {
        mapUri: async (req) => {
          const urlParts = req.path.split('/');
          const blobName = urlParts[3];
          const container = urlParts[2];
          const uri = await generateUrl(blobName, container);
          return { uri };
        },

        onResponse: async function (err, res, request, h /*, settings, ttl*/) {
          try {
            const urlParts = request.path.split('/');
            const blobName = urlParts[3];
            const { auth } = request;

            if (!blobName) {
              console.error(
                `[AZURE-STORAGE-PROXY]Can't find blobname from [${request.path}]`
              );
              return h.response().code(404);
            }

            const requestByAdmin = auth.strategy === 'admin';
            const requestByUser =
              auth.credentials && !requestByAdmin
                ? auth.credentials.claims.sub
                : null;
            const ipAaddress = getIPaddress(request);
            const sessionId =
              auth.credentials && !requestByAdmin
                ? `${auth.credentials.claims.auth_time}:${auth.credentials.claims.contactId}`
                : undefined;
            const {
              documentStatus,
              documentType,
              documentNumber,
              createdBy,
              contactId,
            } = await getDocumentInfo(blobName);
            const claimsContactId = auth.credentials?.claims?.contactId;

            if (
              !requestByAdmin &&
              (basePath !== qrProxyBasePath) &&
              !appConfig.DISABLE_IDM &&
              !validateOwnership(
                requestByUser,
                claimsContactId,
                contactId,
                createdBy
              )
            ) {
              return h.response(`You are not authorised to view this document.
                                 For further enquiries please contact ukiuuslo@marinemanagement.org.uk`);
            }

            if (documentStatus === 'COMPLETE') {
              const payload = await Wreck.read(res, {});
              const response = h.response(payload);

              response.headers = res.headers;
              response.headers['content-disposition'] = 'inline';
              response.headers['content-type'] = 'application/pdf';

              if (basePath === qrProxyBasePath) {
                await fireProtectiveMonitoringEvent(
                  documentType,
                  documentNumber,
                  PROTECTIVE_MONITORING_PRIORITY_NORMAL,
                  ipAaddress,
                  sessionId
                );
              }

              return response;
            }

            console.log(
              `[AZURE-STORAGE-PROXY]Blocking access to document with status [${documentStatus}]`
            );

            if (documentStatus === 'VOID') {
              if (basePath === qrProxyBasePath) {
                await fireProtectiveMonitoringEvent(
                  documentType,
                  documentNumber,
                  PROTECTIVE_MONITORING_PRIORITY_NORMAL,
                  ipAaddress,
                  sessionId,
                  PROTECTIVE_MONITORING_QR_VOID
                );
              }

              return h.response(`The certificate number entered is not valid.
The certificate number entered refers to a VOID certificate.
For further enquiries please contact ukiuuslo@marinemanagement.org.uk`);
            }

            // Case where something exists in COSMOS that has a matching document_url
            // but isn't a complete document in that it doesn't have a status
            // e.g. documents created via the manual process
            return h
              .response(
                `Please use <a href="${appConfig.BUSINESS_CONTINUITY_URL}">${appConfig.BUSINESS_CONTINUITY_URL}</a>
to check the validation status of this document`
              )
              .type('text/html');
          } catch (e) {
            console.error(
              `[AZURE-STORAGE-PROXY]Error in [ON-RESPONSE]${e.message}`
            );

            if (e.isBoom) {
              if (e.output.statusCode === 404) {
                if (basePath === qrProxyBasePath) {
                  const ipAddress = getIPaddress(request);
                  const { auth } = request;
                  const requestByAdmin = auth.strategy === 'admin';
                  const sessionId =
                    auth.credentials && !requestByAdmin
                      ? `${auth.credentials.claims.auth_time}:${auth.credentials.claims.contactId}`
                      : undefined;
                  await fireProtectiveMonitoringEvent(
                    'journey type is unknown',
                    `[document uuid:${documentInfo.uuid}]`,
                    PROTECTIVE_MONITORING_PRIORITY_EXCEPTION,
                    ipAddress,
                    sessionId,
                    PROTECTIVE_MONITORING_QR_404
                  );
                }

                return h
                  .response(
                    `Please use <a href="${appConfig.BUSINESS_CONTINUITY_URL}">${appConfig.BUSINESS_CONTINUITY_URL}</a>
to check the validation status of this document`
                  )
                  .type('text/html');
              } else {
                return h.response().code(e.output.statusCode);
              }
            } else return h.response().code(500);
          }
        },
      },
    },
  });
};



export const validateOwnership = (userPrincipal, contactId, docContactId, docUserPrincipal) => {
  if((userPrincipal && docUserPrincipal) && (userPrincipal === docUserPrincipal)) {
    return true;
  }

  if((contactId && docContactId) && (contactId === docContactId)) {
    return true;
  }

  return false;
};

const getIPaddress = (req) => {
  const xFF = req.headers['x-forwarded-for'];
  return xFF ? xFF.split(',')[0] : req.info.remoteAddress;
};

const generateUrl = (blobName, container) => {
  // Get blobName from URL ("documentName")
  // const blobName = '';
  // Get container name from URL ("service")
  // const container = '';
  // Get Connection String
  const connectionString = appConfig.BLOB_STORAGE_CONNECTION;
  // Get Blob Service
  const blobService = azureStorage.createBlobService(connectionString);
  // Create Shared Access Policy
  const sharedAccessPolicy = createSharedAccessPolicy();
  // Create SAS Token
  const sasToken = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
  // Get URL
  const url = blobService.getUrl(container, blobName, sasToken, true);
  return url;
};

const createSharedAccessPolicy = () => {
  const permissions = azureStorage.BlobUtilities.SharedAccessPermissions.READ;
  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - 5);
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 30);

  return {
      AccessPolicy: {
          Permissions: permissions,
          Start: startDate,
          Expiry: expiryDate
      }
  };
};

const fireProtectiveMonitoringEvent = async (productType, documentNumber, priority, ip, sessionId, messageType) => {
  let info, description, transactionMessage;
  switch (messageType) {
    case PROTECTIVE_MONITORING_QR_VOID :
        info = 'VOID document QR code scanned';
        description = 'User scanned the QR code of a VOID';
        transactionMessage = `QR-VOID-${getServiceNameFromDocumentNumber(documentNumber)}`;
    break;
    case PROTECTIVE_MONITORING_QR_404 :
        info = 'QR code scanned but document does not exist';
        description = 'User scanned the QR code of a non-existent document -';
        transactionMessage = `QR-404-${getServiceNameFromDocumentNumber(documentNumber)}`;
    break;
    default :
        info = 'QR code scanned';
        description = 'User successfully scanned the QR code of a';
        transactionMessage = `QR-${getServiceNameFromDocumentNumber(documentNumber)}`;
    break;
  }

  await monitoringController(productType, documentNumber, priority, ip, info, description, sessionId, transactionMessage)
    .catch(err => 'Error in submitting Protective Monitoring Event: '+err);
};

const getAuthOptions = shouldAuth => {
  return shouldAuth ? appConfig.authStrategies() : false;
};

// used by createStore which sets up the axios instances with the base url for this service's proxy
export const getProxiedAzureStorageUrl = config => {
  return config.MMO_ECC_FE_LOCAL_URL + proxyBasePath;
};


export const getDocumentInfo = async (blobName) => {
  /*
   * get the document status via the blobName from internal service
   * the blobName will be {guid}.pdf
   */

  const uuid = blobName.substring(0, blobName.lastIndexOf('.')) || blobName;
  documentInfo.uuid = uuid;

  const serviceBasePath = '/v1/';
  let serviceUrl = appConfig.MMO_ECC_REFERENCE_SVC_URL + serviceBasePath;

  if (appConfig.USE_BASIC_AUTH) {
    serviceUrl = addAuthToUrl(serviceUrl,
                              appConfig.MMO_ECC_REFERENCE_SVC_USER,
                              appConfig.MMO_ECC_REFERENCE_SVC_PASSWORD);
  }

  const url = `${serviceUrl}certificates?pdfReference=${uuid}`;
  console.log(`[AZURE-STORAGE-PROXY][GET-DOCUMENT-STATUS]Calling[${url}]`);

  const { payload } = await Wreck.get(url, {json: true});

    if (payload !== undefined) {
      console.log(`[AZURE-STORAGE-PROXY][GET-DOCUMENT-STATUS]Got payload[${JSON.stringify(payload)}]`);

      documentInfo.documentStatus = payload.status;
      documentInfo.documentType   = payload.__t;
      documentInfo.documentNumber = payload.documentNumber;
      documentInfo.createdBy      = payload.createdBy;
      documentInfo.uuid           = uuid;
      documentInfo.contactId      = payload.contactId;
    }

  return documentInfo;
};

export const getServiceNameFromDocumentNumber = (documentNumber) => {
  if (documentNumber && documentNumber.length > DOCUMENT_NUMBER_INDICATOR_POSITION[1]) {
    switch (documentNumber.substring(DOCUMENT_NUMBER_INDICATOR_POSITION[0], DOCUMENT_NUMBER_INDICATOR_POSITION[1])) {
      case 'CC': return 'CC';
      case 'PS': return 'PS';
      case 'SD': return 'SD';
      default  : return 'UNKNOWN';
    }
  }

  return 'UNKNOWN';
};
