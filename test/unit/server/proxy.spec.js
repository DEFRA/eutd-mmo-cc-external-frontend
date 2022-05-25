import 'core-js';
import hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Wreck from '@hapi/wreck';
import azureStorage from 'azure-storage';
import * as monitoringController from '../../../src/client/controller/monitoring-controller';

import config from '../../../src/config';
import { setupProxy } from '../../../src/proxy/proxyUtils';
import { setupAzureStorageProxy, validateOwnership } from '../../../src/proxy/azure-storage.proxy';
import { setupOrchestrationServiceProxy } from '../../../src/proxy/orchestration-service.proxy';

describe('the proxyUtils', () => {

  let server;
  let upstream;
  const requestHeaderLogger = jest.fn();

  config.authStrategies = () => false;

  beforeAll( async () => {
    upstream = hapi.Server({ port: 9998 });
    upstream.route([
      {
        method: ['GET'],
        path: '/bobservice/api/bob/{mrbob?}',
        handler: (r, h) => { return h.response(r.params.mrbob).code(200); }
      },
      {
        method: ['POST'],
        path: '/bobservice/api/bob/{mrbob?}',
        handler: (r, h) => {
          requestHeaderLogger(r.headers);
          return h.response(r.params.mrbob).code(200);
        }
      },
      {
        method: ['GET'],
        path: '/bobservice/api/{myresource}',
        handler: (r, h) => {
          if (r.params.myresource === 'notfound')
            return h.response().code(404);
          else
            return h.response(r.params.myresource).code(200); }
      }
    ]);
    await upstream.start();
  });

  afterAll( async () => {
    await upstream.stop();
    await server.stop();
  });

  beforeEach( async () => {
    server = hapi.Server({ port: 9999 });
    await server.register(require('@hapi/h2o2'));
    requestHeaderLogger.mockReset();
  });

  it('can bootstrap test environment', async () => {

    server.route({
      method: ['GET'],
      path: '/myresource',
      handler: (r, h) => { return h.response('BOB'); }
    });

    const req = { method: 'GET', url: '/myresource' };

    const res = await server.inject(req);

    expect(res.statusCode).toBe(200);

  });

  it('can set up a proxy', async () => {

    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false, []);

    const res = await server.inject({ method: 'GET', url: '/external/bobservice/api/bobresource' });
    expect(res.statusCode).toBe(200);

  });

  it('when whitelist is empty then all routes are open', async () => {

    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false, []);
    let res;
    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/fred' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('fred');

  });

  it('when whitelist is not passed in then all routes are open', async () => {

    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false);

    let res;
    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/fred' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('fred');

  });

  it('when whitelist is non empty then only whitelisted urls as open', async () => {

    const whitelist = ['jimmyjames', 'jimmyjames.json'];

    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false, whitelist);

    let res;

    // sanity check that we can access endpoints interally
    //
    res = await upstream.inject({ method: 'GET', url: '/bobservice/api/bob' } );
    expect(res.statusCode).toBe(200);
    res = await upstream.inject({ method: 'GET', url: '/bobservice/api/bob.json' } );
    expect(res.statusCode).toBe(200);
    res = await upstream.inject({ method: 'GET', url: '/bobservice/api/fred' } );
    expect(res.statusCode).toBe(200);

    // and now check from the outside
    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/jimmyjames' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('jimmyjames');

    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/jimmyjames.json' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('jimmyjames.json');

    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/fred' } );
    expect(res.statusCode).toBe(404);

  });

  it('whitelist applies to the root of the url (all child urls are automatically whitelisted)', async () => {

    const whitelist = ['bob'];

    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false, whitelist);

    let res;

    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/bob' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('');

    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/bob/' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('');

    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/bob/999' } );
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('999');

    res = await server.inject({ method: 'GET', url: '/external/bobservice/api/fred' } );
    expect(res.statusCode).toBe(404);

  });

  it('will add the documentNumber to the headers if one exists in the query string', async () => {
    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false);

    await server.inject({
      method: 'POST',
      url: '/external/bobservice/api/bob?documentNumber=BOBDOC',
    });

    expect(requestHeaderLogger).toHaveBeenCalledWith(expect.objectContaining({documentnumber: 'BOBDOC'}));
  });

  it('will not add a documentNumber to the headers if one does not exist in the query string', async () => {
    setupProxy(server, 'http://localhost:9998/bobservice/api/', '/external/bobservice/api/', false);

    await server.inject({
      method: 'POST',
      url: '/external/bobservice/api/bob',
    });

    expect(requestHeaderLogger).toHaveBeenCalledWith(expect.not.objectContaining({documentnumber: expect.any(String)}));
  });

});

describe('the blob storage proxy', () => {

  let mockMonitoringController;
  let server;
  let azure;

  config.authStrategies = () => false;

  const mockGet = jest.spyOn(Wreck, 'get');

  const mockAzureStorage = jest.spyOn(azureStorage, 'createBlobService');
  mockAzureStorage.mockReturnValue({
    generateSharedAccessSignature: () => undefined,
    getUrl: (container, blobname) => `http://localhost:9998/${container}/${blobname}`
  });

  beforeAll( async () => {
    azure = hapi.Server({ port: 9998 });
    azure.route({
      method: ['GET'],
      path: '/export-certificates/{blobname}',
      handler: (r, h) => { return h.response(r.params.blobname); }
    });
    await azure.start();

    server = hapi.Server({ port: 9999 });
    await server.register(require('@hapi/h2o2'));

    setupAzureStorageProxy({
      DISABLE_IDM: false,
      AZURE_STORAGE_URL: 'http://localhost:9998/blob/'
    }, server);
  });

  beforeEach(() => {
    mockMonitoringController = jest.spyOn(monitoringController, 'monitoringController');
    mockMonitoringController.mockResolvedValue(null);
  });

  afterEach(() => {
    mockMonitoringController.mockRestore();
  });

  afterAll( async () => {
    await azure.stop();
    await server.stop();
  });

  it('can get the pdf when the document status is COMPLETE', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'COMPLETE', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });
    const req = {
      method: 'GET',
      url: '/pdf/export-certificates/99.pdf',
      auth: {
        strategy: 'default',
        credentials: {
          claims: {
            sub: 'bob',
          },
        },
        payload: false,
      },
    };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('99.pdf');
    expect(res.headers['content-type']).toBe('application/pdf');

  });

  it('will get message when the document status is VOID', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'VOID', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });
    const req = { method: 'GET', url: '/pdf/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    }};
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('The certificate number entered is not valid');

  });

  it('will get message when the document status is anything other than VOID / COMPLETE', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'BOB', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });
    const req = { method: 'GET', url: '/pdf/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    } };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('Please use');

  });

  it('will get message when the document status is missing', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {createdBy: 'bob'}
    });
    const req = { method: 'GET', url: '/pdf/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    } };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('Please use');

  });

  it('will get message when there is a 404 error from reference data', async () => {

    mockGet.mockImplementationOnce(() => {
      throw Boom.notFound();
    });
    const req = { method: 'GET', url: '/pdf/export-certificates/99.pdf' };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('Please use');

  });

  it('will get 500 when there is an error', async () => {

    mockGet.mockImplementationOnce(() => {
      throw new Error('bad');
    });
    const req = { method: 'GET', url: '/pdf/export-certificates/99.pdf' };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(500);

  });

  it('can get the qr when the document status is COMPLETE', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'COMPLETE', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });
    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    }  };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('99.pdf');
    expect(res.headers['content-type']).toBe('application/pdf');

  });

  it('will get error message from qr when the document status is VOID', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'VOID', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });
    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    }  };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('The certificate number entered is not valid');

  });

  it('will get message from qr when the document status is missing', async () => {

    mockGet.mockReturnValueOnce({
      res: {},
      payload: {createdBy: 'bob'}
    });
    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    }  };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('Please use');

  });

  it('will get message from qr when there is a 404 error from reference data', async () => {

    mockGet.mockImplementationOnce(() => {
      throw Boom.notFound();
    });
    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf' };
    const res = await server.inject(req);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatch('Please use');

  });

  it('will raise a protective monitoring event when there is a 404 qr', async () => {
    mockGet.mockImplementationOnce(() => {
      throw Boom.notFound();
    });

    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf' };
    const res = await server.inject(req);

    expect(res.statusCode).toBe(200);

    expect(mockMonitoringController).toHaveBeenCalledTimes(1);

    expect(mockMonitoringController.mock.calls[0][0]).toBe('journey type is unknown');
    expect(mockMonitoringController.mock.calls[0][1]).toBe('[document uuid:99]');
    expect(mockMonitoringController.mock.calls[0][4]).toBe('QR code scanned but document does not exist');
  });

  it('will raise a protective monitoring event when there is a COMPLETE qr', async () => {
    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'COMPLETE', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });

    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    } };
    const res = await server.inject(req);

    expect(res.statusCode).toBe(200);

    expect(mockMonitoringController).toHaveBeenCalledTimes(1);

    expect(mockMonitoringController.mock.calls[0][0]).toBe('catchCert');
    expect(mockMonitoringController.mock.calls[0][1]).toBe('GBR-2020-CC-7CBCECEB3');
    expect(mockMonitoringController.mock.calls[0][4]).toBe('QR code scanned');
  });

  it('will raise a protective monitoring event when there is a VOID qr', async () => {
    mockGet.mockReturnValueOnce({
      res: {},
      payload: {status : 'VOID', documentNumber: 'GBR-2020-CC-7CBCECEB3', __t: 'catchCert', createdBy: 'bob'}
    });

    const req = { method: 'GET', url: '/qr/export-certificates/99.pdf', auth: {
      strategy: 'default',
      credentials: {
        claims: {
          sub: 'bob',
        },
      },
      payload: false,
    }  };
    const res = await server.inject(req);

    expect(res.statusCode).toBe(200);

    expect(mockMonitoringController).toHaveBeenCalledTimes(1);

    expect(mockMonitoringController.mock.calls[0][0]).toBe('catchCert');
    expect(mockMonitoringController.mock.calls[0][1]).toBe('GBR-2020-CC-7CBCECEB3');
    expect(mockMonitoringController.mock.calls[0][4]).toBe('VOID document QR code scanned');
  });

});

describe('validateOwnership', () => {
  it('return true if userPrincipal and contactId are correct', () => {
    const result = validateOwnership('bob', 'contactBob', 'contactBob', 'bob');
    expect(result).toBe(true);
  });

  it('return true if userPrincipal is correct', () => {
    const result = validateOwnership('bob', undefined, undefined, 'bob');
    expect(result).toBe(true);
  });

  it('return true if contactId is correct', () => {
    const result = validateOwnership(undefined, 'contactBob', 'contactBob', undefined);
    expect(result).toBe(true);
  });

  it('return true if document does not have contactId correct', () => {
    const result = validateOwnership('bob', 'contactBob', undefined, 'bob');
    expect(result).toBe(true);
  });

  it('return false if userPrincipal & contactId are incorrect', () => {
    const result = validateOwnership('bob1', 'contactBob1', 'contactBob2', 'bob2');
    expect(result).toBe(false);
  });

  it('return false if userPrincipal & contactId are not provided', () => {
    const result = validateOwnership(undefined, undefined, undefined, undefined);
    expect(result).toBe(false);
  });
});

describe('the orchestration proxy', () => {

  let server;
  let upstream;

  beforeAll( async () => {
    upstream = hapi.Server({ port: 9998 });
    upstream.route([
      {
        method: 'POST',
        path: '/v1/uploads/landings',
        handler: (_r, h) => {
          return h.response('uploaded');
        }
      }
    ]);
    await upstream.start();
  });

  afterAll(async () => {
    await upstream.stop();
    await server.stop();
  });

  beforeEach( async () => {
    server = hapi.Server({ port: 9999 });
    await server.register(require('@hapi/h2o2'));
  });

  const config = {
    MMO_ECC_ORCHESTRATION_SVC_URL: 'http://localhost:9998',
    DISABLE_IDM: true,
    MAX_UPLOAD_FILE_SIZE: 100,
    authStrategies: () => false
  };

  it('will setup an explicit route for the file upload', async () => {
    await setupOrchestrationServiceProxy(config, server);

    const res = await server.inject({
      method: 'POST',
      url: '/orchestration/api/v1/uploads/landings'
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toBe('uploaded');
  });

  it('will return an error if the payload is larger than the max file size from config', async () => {
    await setupOrchestrationServiceProxy(config, server);

    const res = await server.inject({
      method: 'POST',
      url: '/orchestration/api/v1/uploads/landings',
      payload: {
        file: 'x'.repeat(config.MAX_UPLOAD_FILE_SIZE + 1)
      }
    });

    expect(res.statusCode).toBe(400);
    expect(res.result).toStrictEqual({
      file: {
        key: 'error.upload.max-file-size',
        params: {
          maxBytes: config.MAX_UPLOAD_FILE_SIZE
        }
      }
    });
  });

});