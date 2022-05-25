import { monitoringController } from '../../../src/client/controller/monitoring-controller';
import * as MonitoringService from '../../../src/client/service/MonitoringService';
import logger from '../../../src/logger';

describe('monitoringController()', () => {
  const CATCH_CERTIFICATE_KEY = 'catchCert';
  const PROCESSING_STATEMENT_KEY = 'processingStatement';
  const STORAGE_DOCUMENT_KEY = 'storageDocument';
  const MESSAGE_STORAGE_DOCUMENT = 'storage document';

  let mockPostEventData;

  beforeAll(() => {
    mockPostEventData = jest.spyOn(MonitoringService, 'postEventData');
    mockPostEventData.mockReturnValue({ catch: () => {} });
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should sign correct values to variables when journey is CATCH_CERTIFICATE_KEY', async () => {
    await monitoringController(
      CATCH_CERTIFICATE_KEY,
      'document-number',
      '1',
      'client-ip',
      'info',
      'description',
      'sessionid',
      'transactionMessage'
    );

    expect(mockPostEventData).toHaveBeenCalledWith(
      'USER UNIDENTIFIED',
      'description catch certificate',
      'info/catch certificate/dn:document-number',
      'client-ip',
      '1',
      'sessionid',
      'transactionMessage'
    );
  });

  it('should sign correct values to variables when journey is PROCESSING_STATEMENT_KEY', async () => {
    await monitoringController(
      PROCESSING_STATEMENT_KEY,
      'document-number',
      '1',
      'client-ip',
      'info',
      'description',
      'sessionid',
      'transactionMessage'
    );

    expect(mockPostEventData).toHaveBeenCalledWith(
      'USER UNIDENTIFIED',
      'description processing statement',
      'info/processing statement/dn:document-number',
      'client-ip',
      '1',
      'sessionid',
      'transactionMessage'
    );
  });

  it('should sign correct values to variables when journey is STORAGE_DOCUMENT_KEY', async () => {
    await monitoringController(
      STORAGE_DOCUMENT_KEY,
      'document-number',
      '1',
      'client-ip',
      'info',
      'description',
      'sessionid',
      'transactionMessage'
    );

    expect(mockPostEventData).toHaveBeenCalledWith(
      'USER UNIDENTIFIED',
      'description storage document',
      'info/storage document/dn:document-number',
      'client-ip',
      '1',
      'sessionid',
      'transactionMessage'
    );
  });

  it('should sign correct values to variables when journey is MESSAGE_STORAGE_DOCUMENT', async () => {
    await monitoringController(
      MESSAGE_STORAGE_DOCUMENT,
      'document-number',
      '1',
      'client-ip',
      'info',
      'description',
      'sessionid',
      'transactionMessage'
    );

    expect(mockPostEventData).toHaveBeenCalledWith(
      'USER UNIDENTIFIED',
      'description storage document',
      'info/storage document/dn:document-number',
      'client-ip',
      '1',
      'sessionid',
      'transactionMessage'
    );
  });

  it('should sign correct values to variables', async () => {
    await monitoringController(
      'my journey',
      'document-number',
      '1',
      'client-ip',
      'info',
      'description',
      'sessionid',
      'transactionMessage'
    );

    expect(mockPostEventData).toHaveBeenCalledWith(
      'USER UNIDENTIFIED',
      'description my journey',
      'info/my journey/dn:document-number',
      'client-ip',
      '1',
      'sessionid',
      'transactionMessage'
    );
  });
});

describe('monitoringController() error handling', () => {
  const CATCH_CERTIFICATE_KEY = 'catchCert';

  let mockPostEventData;
  let mockError;

  beforeAll(() => {
    mockPostEventData = jest.spyOn(MonitoringService, 'postEventData');
    mockPostEventData.mockRejectedValue(new Error('some-error'));

    mockError = jest.spyOn(logger, 'error');
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should throw and catch an error', async () => {
    await monitoringController(
      CATCH_CERTIFICATE_KEY,
      'document-number',
      '1',
      'client-ip',
      'info',
      'description',
      'sessionid',
      'transactionMessage'
    );

    expect(mockPostEventData).toHaveBeenCalledWith(
      'USER UNIDENTIFIED',
      'description catch certificate',
      'info/catch certificate/dn:document-number',
      'client-ip',
      '1',
      'sessionid',
      'transactionMessage'
    );

    expect(mockError).toHaveBeenCalledWith('Protective Monitoring data has not been sent: Error: some-error');
  });
});
