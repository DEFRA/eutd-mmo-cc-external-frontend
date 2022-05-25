/**
 * Using https://github.com/Azure/azure-sdk-for-js to provide the mechanism to interact with Azure EventHubs
 * Using @azure/event-hubs library
 */
const { EventHubClient } = require('@azure/event-hubs');
import * as moment from 'moment';
import config from '../../config';
import logger from '../../logger';

export const postEventData = async(user, message, info, ipAddress, priorityCode, sessionId, transactionMessage) => {
  try {
    const client = EventHubClient.createFromConnectionString(config.EVENT_HUB_CONNECTION_STRING, config.EVENT_HUB_NAMESPACE);

    const eventData = {
      body: {
        'user': `IDM/${user}`,
        'datetime': moment.utc().toISOString(),
        'sessionid': sessionId,
        'application': 'FI001',
        'component': 'external app',
        'ip': ipAddress,
        'pmccode':'0703',
        'priority': priorityCode.toString(),
        'details': {
            'transactioncode': `0706-${transactionMessage}`,
            'message': message,
            'additionalinfo': info
        },
        'environment': getEnvironment(config.BASE_URL),
        'version':'1.1'
      }
    };

    await client.send(eventData);
    await client.close();

  } catch(err) {
    logger.error(`[MONITORING-SERVICE][CREATING-EVENT-HUB-CLIENT][ERROR][${err}]`);
  }
};

export const getEnvironment = baseUrl => {
  const host = baseUrl.toLocaleLowerCase();

  if(host.includes('localhost'))
    return 'localhost';
  else if (host.includes('snd'))
    return 'SND';
  else if(host.includes('tst'))
    return 'TST';
  else if(host.includes('pre'))
    return 'PRE';
  else
    return 'PRD';
};