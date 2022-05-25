import { postEventData } from '../service/MonitoringService';
import logger from '../../logger';

const CATCH_CERTIFICATE_KEY = 'catchCert';
const PROCESSING_STATEMENT_KEY = 'processingStatement';
const STORAGE_DOCUMENT_KEY = 'storageDocument';

const MESSAGE_CATCH_CERTIFICATE = 'catch certificate';
const MESSAGE_PROCESSING_STATEMENT = 'processing statement';
const MESSAGE_STORAGE_DOCUMENT = 'storage document';

export const monitoringController = async (journey, documentNumber, priorityCode, clientip, info, description, sessionId, transactionMessage) => {

    let monitoringInfo, message;
    const userPrincipal = 'USER UNIDENTIFIED';

    if (journey === CATCH_CERTIFICATE_KEY) {
        monitoringInfo = `${info}/${MESSAGE_CATCH_CERTIFICATE}/dn:${documentNumber}`;
        message = `${description} ${MESSAGE_CATCH_CERTIFICATE}`;

    } else if (journey === PROCESSING_STATEMENT_KEY) {
        monitoringInfo = `${info}/${MESSAGE_PROCESSING_STATEMENT}/dn:${documentNumber}`;
        message = `${description} ${MESSAGE_PROCESSING_STATEMENT}`;

    } else if (journey === STORAGE_DOCUMENT_KEY){
        monitoringInfo = `${info}/${MESSAGE_STORAGE_DOCUMENT}/dn:${documentNumber}`;
        message = `${description} ${MESSAGE_STORAGE_DOCUMENT}`;
    } else {
        monitoringInfo = `${info}/${journey}/dn:${documentNumber}`;
        message = `${description} ${journey}`;
    }

    await postEventData(userPrincipal, message, monitoringInfo, clientip, priorityCode, sessionId, transactionMessage)
      .catch(err => logger.error(`Protective Monitoring data has not been sent: ${err}`));
};