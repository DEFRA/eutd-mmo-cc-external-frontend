import {
  changeAddressExporter,
  clearChangeAddressExporter,
  clearUnauthorisedExporter,
  saveExporter,
  getExporterFromMongo,
  saveExporterToMongo,
  saveManuallyAddedAddress,
  clearErrors,
} from '../../../src/client/actions/exporter.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const exporterMockStore = (data, rejectWith = false) =>
  configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res({ data });
            }
          });
        },
        post: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res({ data });
            }
          });
        },
      },
    }),
  ]);

describe('Exporter Action creators', () => {
  it('should save the exporter', () => {
    const data = {
      model: {
        addressOne: '1 The Road',
        currentUri: '/create-storage-document/add-exporter-details',
        exporterCompanyName: 'Phils Fishing',
        journey: 'storageNotes',
        nextUri: '/create-storage-document/add-product-to-this-consignment',
        postcode: 'NE30 2TR',
        townCity: 'North Shields',
        user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
      },
    };

    const expectedActions = [
      { type: 'export-certificate/exporter-changed', exporter: data },
    ];

    const store = mockStore({ saveExporter: data });

    store.dispatch(saveExporter(data));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should reduce the exporter state to change address', () => {
    const data = {
      model: {
        addressOne: '1 The Road',
        currentUri: '/create-storage-document/add-exporter-details',
        exporterCompanyName: 'Phils Fishing',
        journey: 'storageNotes',
        nextUri: '/create-storage-document/add-product-to-this-consignment',
        postcode: 'NE30 2TR',
        townCity: 'North Shields',
        user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
      },
    };

    const expectedActions = [
      { type: 'export-certificate/exporter-change-address' },
    ];

    const store = mockStore({ saveExporter: data });

    store.dispatch(changeAddressExporter());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should reduce the exporter state to clear change address', () => {
    const data = {
      model: {
        addressOne: '1 The Road',
        currentUri: '/create-storage-document/add-exporter-details',
        exporterCompanyName: 'Phils Fishing',
        journey: 'storageNotes',
        nextUri: '/create-storage-document/add-product-to-this-consignment',
        postcode: 'NE30 2TR',
        townCity: 'North Shields',
        user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
      },
    };

    const expectedActions = [
      { type: 'export-certificate/exporter-clear-change-address' },
    ];

    const store = mockStore({ saveExporter: data });

    store.dispatch(clearChangeAddressExporter());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should reduce the exporter errors when clearErrors is dispatched', () => {
    const expectedResult = [
      { type: 'export-certificate/exporter-clear-errors' },
      { type: 'export-certificate/exporter-clear-errors' },
    ];
    const store = mockStore();

    store.dispatch(clearErrors());

    expect(store.getActions()).toEqual(expectedResult);
  });

  it('should reduce the exporter state to clear unauthorised', () => {
    const data = {
      model: {
        addressOne: '1 The Road',
        currentUri: '/create-storage-document/add-exporter-details',
        exporterCompanyName: 'Phils Fishing',
        journey: 'storageNotes',
        nextUri: '/create-storage-document/add-product-to-this-consignment',
        postcode: 'NE30 2TR',
        townCity: 'North Shields',
        user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
      },
    };

    const expectedActions = [
      { type: 'export-certificate/exporter-clear-unauthorised' },
    ];

    const store = mockStore({ saveExporter: data });

    store.dispatch(clearUnauthorisedExporter());
    expect(store.getActions()).toEqual(expectedActions);
  });

  describe('#getExporterFromMongo', () => {
    it('should add errors and preloaded flags if data is fetched', () => {
      const journey = 'catchCertificate';

      const fetchedData = {
        model: {
          somedata: {},
        },
      };

      const result = {
        error: '',
        errors: {},
        model: Object.assign(
          {
            preLoadedAddress: true,
            preLoadedCompanyName: true,
            preLoadedName: true,
          },
          JSON.parse(JSON.stringify(fetchedData.model))
        ),
      };

      const expectedActions = [
        { type: 'export-certificate/exporter-loaded', exporter: result },
      ];

      const store = exporterMockStore(fetchedData)({
        getExporterFromMongo: fetchedData,
      });

      return store.dispatch(getExporterFromMongo(journey)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should add errors and preloaded flags if data is fetched with a document number', () => {
      const journey = 'catchCertificate';
      const documentNumber = 'document-cc-number';

      const fetchedData = {
        model: {
          somedata: {},
        },
      };

      const result = {
        error: '',
        errors: {},
        model: Object.assign(
          {
            preLoadedAddress: true,
            preLoadedCompanyName: true,
            preLoadedName: true,
          },
          JSON.parse(JSON.stringify(fetchedData.model))
        ),
      };

      const expectedActions = [
        { type: 'export-certificate/exporter-loaded', exporter: result },
      ];

      const store = exporterMockStore(fetchedData)({
        getExporterFromMongo: fetchedData,
      });

      return store
        .dispatch(getExporterFromMongo(journey, documentNumber))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should not add preloaded flags if there is not exporter data', () => {
      const journey = 'catchCertificate';

      const fetchedData = {};

      const result = {
        error: '',
        errors: {},
      };

      const expectedActions = [
        { type: 'export-certificate/exporter-loaded', exporter: result },
      ];

      const store = exporterMockStore(fetchedData)({
        getExporterFromMongo: fetchedData,
      });

      store.dispatch(getExporterFromMongo(journey)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should return the exported details as fetched', () => {
      const journey = 'catchCertificate';

      const fetchedData = {
        model: {
          addressOne: '1 The Road',
          currentUri: '/create-storage-document/add-exporter-details',
          exporterCompanyName: 'Phils Fishing',
          journey: 'storageNotes',
          nextUri: '/create-storage-document/add-product-to-this-consignment',
          postcode: 'NE30 2TR',
          townCity: 'North Shields',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      };

      const result = {
        error: '',
        errors: {},
        model: Object.assign(
          {
            preLoadedAddress: true,
            preLoadedCompanyName: true,
            preLoadedName: true,
          },
          JSON.parse(JSON.stringify(fetchedData.model))
        ),
      };

      const expectedActions = [
        { type: 'export-certificate/exporter-loaded', exporter: result },
      ];

      const store = exporterMockStore(fetchedData)({
        getExporterFromMongo: fetchedData,
      });

      store.dispatch(getExporterFromMongo(journey)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should fail to get the exporter from redis', () => {
      const error = { response: { status: 500 } };
      const store = exporterMockStore(null, error)();

      store.dispatch(getExporterFromMongo()).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: 'export-certificate/exporter-failed',
            error: error.toString(),
          },
        ]);
      });
    });

    it('should throw unauthorised for a 403', () => {
      const error = { response: { status: 403 } };
      const store = exporterMockStore(null, error)();

      store.dispatch(getExporterFromMongo()).then(() => {
        expect(store.getActions()).toEqual([
          { type: 'export-certificate/exporter-unauthorised' },
        ]);
      });
    });

    it('should fail to get the exporter from redis throw', async () => {
      const toStringError = new String('a');
      toStringError.toString = jest.fn().mockImplementation(() => {
        throw new Error('some_error');
      });

      const store = exporterMockStore(null, toStringError)();
      let error = null;

      try {
        await store.dispatch(getExporterFromMongo()).then(() => {
          expect(store.getActions()).toEqual([
            {
              type: 'export-certificate/exporter-failed',
              error: error.toString(),
            },
          ]);
        });
      } catch (err) {
        error = err;
      }

      expect(error).not.toBeNull();
      expect(error).toEqual(new Error('some_error'));
    });
  });

  describe('#saveExporterToMongo', () => {
    it('should save the exporter to redis', () => {
      const journey = 'catchCertificate';
      const data = {
        model: {
          addressOne: '1 The Road',
          currentUri: '/create-storage-document/add-exporter-details',
          exporterCompanyName: 'Phils Fishing',
          journey: 'storageNotes',
          nextUri: '/create-storage-document/add-product-to-this-consignment',
          postcode: 'NE30 2TR',
          townCity: 'North Shields',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      };
      const currentUri = '/back';
      const nextUri = '/save';
      const expectedActions = [
        {
          exporter: {
            model: {
              addressOne: '1 The Road',
              currentUri: '/create-storage-document/add-exporter-details',
              exporterCompanyName: 'Phils Fishing',
              journey: 'storageNotes',
              nextUri:
                '/create-storage-document/add-product-to-this-consignment',
              postcode: 'NE30 2TR',
              townCity: 'North Shields',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            },
          },
          type: 'export-certificate/exporter-saved',
        },
      ];

      const store = exporterMockStore(data)({ saveExporterToMongo: data });

      return store
        .dispatch(saveExporterToMongo(data, journey, currentUri, nextUri))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should save the exporter to redis with a document number', () => {
      const journey = 'catchCertificate';
      const documentNumber = 'document-cc-number';
      const data = {
        model: {
          addressOne: '1 The Road',
          currentUri: '/create-storage-document/add-exporter-details',
          exporterCompanyName: 'Phils Fishing',
          journey: 'storageNotes',
          nextUri: '/create-storage-document/add-product-to-this-consignment',
          postcode: 'NE30 2TR',
          townCity: 'North Shields',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      };
      const currentUri = '/back';
      const nextUri = '/save';
      const expectedActions = [
        {
          exporter: {
            model: {
              addressOne: '1 The Road',
              currentUri: '/create-storage-document/add-exporter-details',
              exporterCompanyName: 'Phils Fishing',
              journey: 'storageNotes',
              nextUri:
                '/create-storage-document/add-product-to-this-consignment',
              postcode: 'NE30 2TR',
              townCity: 'North Shields',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            },
          },
          type: 'export-certificate/exporter-saved',
        },
      ];

      const store = exporterMockStore(data)({ saveExporterToMongo: data });

      return store
        .dispatch(
          saveExporterToMongo(
            data,
            journey,
            currentUri,
            nextUri,
            documentNumber
          )
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should fail to save invalid exporter data to redis', () => {
      const store = exporterMockStore(null, { response: { data: 'test' } })();

      store.dispatch(saveExporterToMongo()).catch((err) => {
        expect(store.getActions()).toEqual([
          { type: 'export-certificate/exporter-invalid', exporter: 'test' },
        ]);
        expect(err).toBeDefined();
      });
    });

    it('should fail to save invalid exporter data to redis and throw', () => {
      const store = exporterMockStore(null, { response: { data: 'test' } })();

      return store
        .dispatch(
          saveExporterToMongo({
            isExporterDetailsSavedAsDraft: false,
          })
        )
        .catch((err) => {
          expect(store.getActions()).toEqual([
            { type: 'export-certificate/exporter-invalid', exporter: 'test' },
          ]);
          expect(err).toBeDefined();
        });
    });

    it('should fail to save invalid exporter data to redis and not throw', () => {
      const store = exporterMockStore(null, { response: { data: 'test' } })();

      return store
        .dispatch(
          saveExporterToMongo({
            isExporterDetailsSavedAsDraft: true,
          })
        )
        .catch((err) => {
          expect(store.getActions()).toEqual([
            { type: 'export-certificate/exporter-invalid', exporter: 'test' },
          ]);
          expect(err).toBeDefined();
        });
    });

    it('should fail to save the exporter to redis', () => {
      const store = exporterMockStore(null, { response: { data: false } })();

      store.dispatch(saveExporterToMongo()).catch((err) => {
        expect(store.getActions()).toEqual([
          {
            type: 'export-certificate/exporter-failed',
            error: { response: { data: false } },
          },
        ]);
        expect(err).toBeDefined();
      });
    });

    it('should fail and dispatch showForbiddenPage when error status is 403', () => {
      const store = exporterMockStore(null, {
        response: { status: 403, statusText: 'Forbidden', data: '' },
      })();

      return store
        .dispatch(
          saveExporterToMongo({
            isExporterDetailsSavedAsDraft: false,
          })
        )
        .catch((err) => {
          expect(store.getActions()).toEqual([
            { type: 'export-certificate/exporter-unauthorised' },
          ]);
          expect(err).toBeDefined();
        });
    });

    it('should fail and dispatch waf error when error status is 403 and is a Silverline error', () => {
      const store = exporterMockStore(null, {
        response: { status: 403, statusText: 'Forbidden', data: '<html><head><title>Request Rejected</title></head><body>The requested URL was rejected. Please consult with your administrator.<br><br>Your support ID is: 2732698712327933848</body></html>' },
      })();

      return store
        .dispatch(
          saveExporterToMongo({
            isExporterDetailsSavedAsDraft: false,
          })
        )
        .catch((err) => {
          expect(store.getActions()).toEqual([
            { type: 'export-certificate/waf-error',
              supportID: '2732698712327933848' },
          ]);
          expect(err).toBeDefined();
        });
    });
  });
});

describe('Add Address Manually', () => {
  let postFn = jest.fn();
  let store;

  const documentNumber = 'document1';

  let payload = {
    subBuildingName: '12',
    buildingNumber: '2',
    streetName: '12',
    buildingName: '12',
    townCity: '12',
    county: '12',
    postcode: 'SE16 5HL',
    country: '12',
  };

  beforeEach(() => {
    postFn.mockReset();

    store = configureStore([
      thunk.withExtraArgument({
        orchestrationApi: {
          post: postFn,
        },
      }),
    ])({});
  });

  it('will call the orchestrator without a document number', async () => {
    postFn.mockResolvedValue({ status: 200, data: payload });

    await store.dispatch(saveManuallyAddedAddress(payload));

    expect(postFn).toHaveBeenCalledWith(
      '/exporter-validate',
      {
        subBuildingName: '12',
        buildingNumber: '2',
        streetName: '12',
        buildingName: '12',
        townCity: '12',
        county: '12',
        postcode: 'SE16 5HL',
        country: '12',
      },
      {}
    );
  });

  it('will call the orchestrator with the correct details', async () => {
    postFn.mockResolvedValue({ status: 200, data: payload });

    await store.dispatch(saveManuallyAddedAddress(payload, documentNumber));

    expect(postFn).toHaveBeenCalledWith(
      '/exporter-validate',
      {
        subBuildingName: '12',
        buildingNumber: '2',
        streetName: '12',
        buildingName: '12',
        townCity: '12',
        county: '12',
        postcode: 'SE16 5HL',
        country: '12',
      },
      {
        headers: {
          documentnumber: documentNumber,
        },
      }
    );
  });

  it('will call the update exporter details action if the call is successful', async () => {
    postFn.mockResolvedValue({ status: 200, data: payload });
    const expectedActions = [
      {
        type: 'export-certificate/exporter-address-lookup-saved',
        exporter: payload,
      },
      {
        type: 'clear_errors',
      },
    ];

    await store
      .dispatch(saveManuallyAddedAddress(payload, documentNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('will return an error if the postcode is in the wrong format', async () => {
    let payload2 = {
      subBuildingName: '12',
      buildingNumber: '2',
      streetName: '12',
      buildingName: '12',
      townCity: '12',
      county: '12',
      postcode: 'SE16 5HLsdsaddfdsfd',
      country: '12',
    };

    postFn.mockRejectedValue({ response: { status: 400 } });
    const expectedActions = [
      {
        type: 'api_call_failed',
        payload: { status: 400 },
      },
    ];

    await store
      .dispatch(saveManuallyAddedAddress(payload2, documentNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('will return an error if the request is unauthorised', () => {
    const payload = {
      subBuildingName: '12',
      buildingNumber: '2',
      streetName: '12',
      buildingName: '12',
      townCity: '12',
      county: '12',
      postcode: 'SE16 5HLsdsaddfdsfd',
      country: '12',
    };

    postFn.mockRejectedValue({
      response: { status: 403, statusText: 'Unauthorised Access' },
    });
    const expectedActions = [
      { type: 'export-certificate/exporter-unauthorised' },
    ];

    return store
      .dispatch(saveManuallyAddedAddress(payload, documentNumber))
      .catch((err) => {
        expect(err).toEqual(
          new Error('An error has occurred 403 (Unauthorised Access)')
        );
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('will return undefined for an unsuccessful api call', async () => {
    const error = new Error('broken');

    postFn.mockRejectedValue(error);

    const res = await store.dispatch(
      saveManuallyAddedAddress(payload, documentNumber)
    );

    expect(res).toBeUndefined();
  });
});
