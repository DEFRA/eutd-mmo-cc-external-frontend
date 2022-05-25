const { EventHubClient } = require('@azure/event-hubs');
import ApplicationConfig from '../../../src/config';
import logger from '../../../src/logger';
import * as SUT from '../../../src/client/service/MonitoringService';

jest.mock('moment', () => {
  return {
    utc: () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z')
  };
});

ApplicationConfig.BASE_URL = 'http://localhost:3001';

describe('postEventData', () => {
  const user = 'user',
  message = 'message',
  info = 'info',
  ipAddress = 'ip-address',
  priorityCode = 9,
  sessionid = 'sessionId',
  transactionMessage = 'VIEW-CC';

  const mockSend = jest.fn();
  const mockClose = jest.fn();

  let mockCreateFromConnectionString;
  let mockError;

  beforeEach(() => {
    mockCreateFromConnectionString = jest.spyOn(EventHubClient, 'createFromConnectionString');
    mockCreateFromConnectionString.mockImplementation(() => ({
      send: mockSend,
      close: mockClose,
    }));

    mockError = jest.spyOn(logger, 'error');
  });

  afterEach(() => {
    mockSend.mockRestore();
    mockClose.mockRestore();

    jest.restoreAllMocks();
  });

  it('should call `createFromConnectionString` with the correct parameters', async () => {

    const expected = {
      body: {
        'user': 'IDM/user',
        'datetime': '2020-01-01T00:00:00.000Z',
        'sessionid': 'sessionId',
        'application': 'FI001',
        'component': 'external app',
        'ip': 'ip-address',
        'pmccode':'0703',
        'priority': '9',
        'details': {
            'transactioncode': '0706-VIEW-CC',
            'message': 'message',
            'additionalinfo': 'info'
        },
        'environment': 'localhost',
        'version':'1.1'
      }
    };

    await SUT.postEventData(user, message, info, ipAddress, priorityCode, sessionid, transactionMessage);

    expect(mockCreateFromConnectionString).toHaveBeenCalled();
    expect(mockCreateFromConnectionString).toHaveBeenCalledWith(
      ApplicationConfig.EVENT_HUB_CONNECTION_STRING,
      ApplicationConfig.EVENT_HUB_NAMESPACE
    );

    expect(mockSend).toHaveBeenCalledWith(expected);
    expect(mockClose).toHaveBeenCalled();
  });

  it('should catch any errors thrown when calling createFromConnectionString', async () => {

    mockCreateFromConnectionString.mockImplementation(() => {
      throw 'error';
    });

    await SUT.postEventData(user, message, info, ipAddress, priorityCode, sessionid, transactionMessage);

    expect(mockError).toHaveBeenCalledWith('[MONITORING-SERVICE][CREATING-EVENT-HUB-CLIENT][ERROR][error]');
  });
});

describe('getEnvironment', () => {
  it('will return `localhost` as an environment', () => {
    expect(SUT.getEnvironment('localhost')).toBe('localhost');
  });

  it('will return `SND` as an environment', () => {
      expect(SUT.getEnvironment('https://ukecc-snd.azure.defra.cloud/')).toBe('SND');
  });

  it('will return `TST` as an environment', () => {
    expect(SUT.getEnvironment('https://ukecc-tst.azure.defra.cloud/')).toBe('TST');
    expect(SUT.getEnvironment('https://ukecc-tst-blue.azure.defra.cloud/')).toBe('TST');
    expect(SUT.getEnvironment('https://ukecc-tst-green.azure.defra.cloud/')).toBe('TST');
  });

  it('will return `PRE` as an environment', () => {
    expect(SUT.getEnvironment('https://ukecc-PRE.azure.defra.cloud/')).toBe('PRE');
    expect(SUT.getEnvironment('https://ukecc-PREMO.azure.defra.cloud/')).toBe('PRE');
  });

  it('will return `PRD` as an environment', () => {
    expect(SUT.getEnvironment('https://ukecc.azure.defra.cloud/')).toBe('PRD');
  });
});