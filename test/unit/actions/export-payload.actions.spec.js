import {
    validateExportPayload,
    addLanding,
    removeLanding,
    validateLanding,
    removeProduct,
    getExportPayload,
    clearExportPayload,
    clearErrorsExportPayload,
    addProduct,
    exportPayloadActionTypes
} from '../../../src/client/actions/export-payload.actions';
import * as exportPayloadActions from '../../../src/client/actions/export-payload.actions';
import { API_CALL_FAILED, CLEAR_ERRORS } from '../../../src/client/actions/index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const exporterMockStore = (data, rejectWith = false) => configureStore([thunk.withExtraArgument({
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
    put: () => {
        return new Promise((res, rej) => {
            if (rejectWith) {
                rej(rejectWith);
            } else {
                res({ data });
            }
        });
    },
    delete: () => {
        return new Promise((res, rej) => {
            if (rejectWith) {
                rej(rejectWith);
            } else {
                res({ data });
            }
        });
    }
    }
})]);

const catchExpectedWithError = async (expectedActions, store, action) => {
    let error = null;

    try {
        await store.dispatch(action(null, null));
    } catch (err) {
        error = err;
    }
    expect(store.getActions()).toEqual(expectedActions);
    expect(error).not.toBeNull();
};

const catchExpectedWithNoError = async (expectedActions, store, action) => {
  let error = null;

  try {
      await store.dispatch(action(null, null, true));
  } catch (err) {
      error = err;
  }
  expect(store.getActions()).toEqual(expectedActions);
  expect(error).toBeNull();
};

describe('Export Payload Action creators', () => {

    describe('#validateExportPayload', () => {

        it('should validate export payload', () => {

            const data = {
                result: 'Data is valid'
            };

            const currentUri = '/back';
            const nextUri = '/save';

            const expectedActions = [
                {type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_SUCCESS, exportPayload: {result: 'Data is valid' }},
                {type: CLEAR_ERRORS }

            ];

            const store = exporterMockStore(data)({validateExportPayload: data});

            return store.dispatch(validateExportPayload(currentUri, nextUri)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });

        });

        it('should validate export payload with a given document number', () => {
            const data = {
                result: 'Data is valid'
            };

            const currentUri = '/back';
            const nextUri = '/save';
            const isLandingSaveAsDraft = false;
            const documentNumber = 'GBR-2020-CC-112C0C902';

            const expectedActions = [
                {type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_SUCCESS, exportPayload: {result: 'Data is valid' }},
                {type: CLEAR_ERRORS }
            ];

            const store = exporterMockStore(data)({validateExportPayload: data});

            return store.dispatch(validateExportPayload(currentUri, nextUri, isLandingSaveAsDraft, documentNumber)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should validate, fail and parse an array of errors in the response data and not throw', async () => {
          const expectedActions = [
              {type: API_CALL_FAILED, payload: {
                      data: { 0: 'error1', 1: 'error2' }
                  }
              }
          ];

          const store = exporterMockStore(null, { response : { data : { errors: ['error1', 'error2']} } })();

          return await catchExpectedWithNoError(expectedActions, store, validateExportPayload);

      });

        it('should validate, fail and parse an array of errors in the response data', async () => {
            const expectedActions = [
                {type: API_CALL_FAILED, payload: {
                        data: { 0: 'error1', 1: 'error2' }
                    }
                }
            ];

            const store = exporterMockStore(null, { response : { data : { errors: ['error1', 'error2']} } })();

            return await catchExpectedWithError(expectedActions, store, validateExportPayload);

        });

        it('should validate, fail and parse an error object in the response data', async () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors: [{
                    targetName: 'validateExportPayload()',
                    text: 'validate_error'
                }] }
            ];

            const store = exporterMockStore(null, { response : { data : { error: 'validate_error' } } })();

            return await catchExpectedWithError(expectedActions, store, validateExportPayload);
        });

        it('should validate, fail and return default error text', async () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors: [{
                    targetName: 'validateExportPayload()',
                    text: 'Failed to validate'
                }] }
            ];

            const store = exporterMockStore(null, { response : { data : {} } })();

            return await catchExpectedWithError(expectedActions, store, validateExportPayload);
        });

        it('should validate, fail and return the unparsed error object', async () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors: [{
                    targetName: 'validateExportPayload()',
                    text: { response : 'generic_error' }
                }] }
            ];

            const store = exporterMockStore(null, { response : 'generic_error' })();

            return await catchExpectedWithError(expectedActions, store, validateExportPayload);
        });

        it('should validate, fail and return unauthorised for 403 error', async () => {
          const expectedActions = [
            {type: exportPayloadActionTypes.EXPORT_PAYLOAD_UNAUTHORISED }
          ];

          const store = exporterMockStore(null, { response : { status: 403 }})();

          return await catchExpectedWithError(expectedActions, store, validateExportPayload);

      });

        it('should validate, fail and return waf error', async () => {
          const expectedActions = [
            {
              type: exportPayloadActionTypes.EXPORT_PAYLOAD_WAF_ERROR,
              supportID: '2732698712327933848',
            },
          ];

          const store = exporterMockStore(null, {
            response: {
              status: 403,
              data: '<html><head><title>Request Rejected</title></head><body>The requested URL was rejected. Please consult with your administrator.<br><br>Your support ID is: 2732698712327933848</body></html>',
            },
          })();

          return await catchExpectedWithError(
            expectedActions,
            store,
            validateExportPayload
          );
        });
    });

    describe('#addLanding', () => {

      it('should add a landing', () => {
        const exportPayload = {
          items: [
            {
              product: { id: 1234 },
              landings: []
            },
            {
              product: { id: 5678 },
              landings: []
            }
          ]
        };

        const productId = 1234;

        const expectedResult = {
          type: exportPayloadActionTypes.LANDING_UPDATED,
          exportPayload: {
            items: [
              {
                product: { id: 1234 },
                landings: [
                  {
                    addMode: true,
                    editMode: false,
                    model: {}
                  }
                ]
              },
              {
                product: { id: 5678 },
                landings: []
              }
            ]
          }
        };

        const store = exporterMockStore(null)({exportPayload: exportPayload});

        store.dispatch(addLanding(productId));

        expect(store.getActions()).toEqual([expectedResult]);
      });

    });

    describe('#removeLanding', () => {

        it('Should remove a landing', () => {
            const data = {
                result: 'Landing removed'
            };

            const productId = 1234;
            const landingId = 5678;

            const expectedActions = [
                {type: exportPayloadActionTypes.LANDING_REMOVED,  exportPayload: {}}
            ];

            const store = exporterMockStore({})({removeLanding: data});

            return store.dispatch(removeLanding(productId, landingId)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('Should remove a landing with a given document number', () => {
            const data = {
                result: 'Landing removed'
            };

            const productId = 1234;
            const landingId = 5678;
            const documentNumber = 'GBR-2020-CC-112C0C902';

            const expectedActions = [
                {type: exportPayloadActionTypes.LANDING_REMOVED,  exportPayload: {}}
            ];

            const store = exporterMockStore({})({removeLanding: data});

            return store.dispatch(removeLanding(productId, landingId, documentNumber)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should fail to remove a landing', () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.LANDING_REMOVE_FAILED,  errorRes: 'Error: a' }
            ];

            const error = new Error('a');
            error.response = {
              status: 400
            };

            const store = exporterMockStore(null, error)();

            return store.dispatch(removeLanding(null, null)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should fail to remove a landing and throw an error', async () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.LANDING_REMOVE_FAILED,  errorRes: new Error('some_error') }
            ];

            const errorString = new String('a');
            errorString.toString = jest.fn().mockImplementation(() => {
                throw new Error('some_error');
            });
            errorString.response = {
              status: 400
            };

            const store = exporterMockStore(null, errorString)();

            return await catchExpectedWithError(expectedActions, store, removeLanding);
        });

        it('should fail to remove a landing with the error data when status === 403', () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.LANDING_REMOVE_UNAUTHORISED}
            ];

            const store = exporterMockStore(null, { response : { data : 'some_error', status: 403 }})();

            return store.dispatch(removeLanding(null, null)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe('#validateLanding', () => {

      it('should validate a landing', () => {
          const data = {
              result: 'Landing upserted'
          };

          const productId = 1234;
          const landingId = 5678;

          const expectedActions = [
              {type: exportPayloadActionTypes.LANDING_UPSERTED,  exportPayload: {result: 'Landing upserted'}}
          ];

          const store = exporterMockStore(data)({upsertLanding: data});

          return store.dispatch(validateLanding(productId, landingId)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should validate a landing with a document number', () => {
        const data = {
            result: 'Landing upserted'
        };

        const productId = 1234;
        const landingId = 5678;
        const documentNumber = 'GBR-2020-CC-112C0C902';

        const expectedActions = [
            {type: exportPayloadActionTypes.LANDING_UPSERTED,  exportPayload: {result: 'Landing upserted'}}
        ];

        const store = exporterMockStore(data)({upsertLanding: data});

        return store.dispatch(validateLanding(productId, landingId, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

      it('should validate a landing with the error data when status === 400', async () => {
          const expectedActions = [
              { type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors: { message: 'some-error' } },
              { type: exportPayloadActionTypes.LANDING_UPSERT_FAILED,  errorRes: new Error('landingValidateFailed') }
          ];

          const store = exporterMockStore(null, { response : { status: 400, data: { errors: { message: 'some-error' }}}})();
          return await catchExpectedWithError(expectedActions, store, validateLanding);
      });

      it('should fail to validate a landing with the error data when status !== 400', async () => {
          const expectedActions = [
            { type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors: { message: 'some-error' } },
            { type: exportPayloadActionTypes.LANDING_UPSERT_FAILED,  errorRes: new Error('landingValidateFailed')}
          ];

          const store = exporterMockStore(null, { message : 'some_error', response: { status: 500, data: { errors: { message: 'some-error' }} } })();

          return await catchExpectedWithError(expectedActions, store, validateLanding);
      });

      it('should fail to validate a landing if an error is thrown within the promise', async () => {
          const expectedActions = [
            {type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors: ['this-is-an-error']},
            {type: exportPayloadActionTypes.LANDING_UPSERT_FAILED,  errorRes: new Error('landingValidateFailed') }
          ];

          const store = exporterMockStore(null, { response: { data: { errors: ['this-is-an-error']}}})();

          return await catchExpectedWithError(expectedActions, store, validateLanding);
      });

      it('should fail to upsert a landing with the error data when status === 403', () => {
          const expectedActions = [
            {type: exportPayloadActionTypes.LANDING_UPSERT_UNAUTHORISED}
          ];

          const store = exporterMockStore(null, { response : { data : 'some_error', status: 403 }})();

          return store.dispatch(validateLanding(null, null)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should fail to upsert a landing with the error data when status === 403 and is a Silverline error', () => {
          const expectedActions = [
            {   type: exportPayloadActionTypes.LANDING_UPSERT_WAF_ERROR,
                supportID: '2732698712327933848'
            }
          ];

          const store = exporterMockStore(null, { response : { data : '<html><head><title>Request Rejected</title></head><body>The requested URL was rejected. Please consult with your administrator.<br><br>Your support ID is: 2732698712327933848</body></html>', status: 403 }})();

          return store.dispatch(validateLanding(null, null)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });
  });

    describe('#addProduct', () => {

        it('Should add a product', () => {

            const data = {
                result: 'Product added'
            };

            const expectedActions = [
                { type: exportPayloadActionTypes.PRODUCT_ADDED,  exportPayload: data }
            ];

            const store = exporterMockStore(data)({addProduct: data});

            return store.dispatch(addProduct('test')).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('Should add a product with a document number', () => {

          const data = {
              result: 'Product added'
          };

          const expectedActions = [
              { type: exportPayloadActionTypes.PRODUCT_ADDED,  exportPayload: data }
          ];

          const store = exporterMockStore(data)({addProduct: data});

          return store.dispatch(addProduct('test','document-number')).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

        it('should fail to add a product', () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.PRODUCT_UPDATE_FAILED,  errorRes: 'Error: a' }
            ];

            const store = exporterMockStore(null, new Error('a'))();

            return store.dispatch(addProduct(null)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should fail to add a product if an error is thrown within the promise', async () => {
            const expectedActions = [
                {type: exportPayloadActionTypes.PRODUCT_UPDATE_FAILED,  errorRes: new Error('some_error') }
            ];

            const toStringError = new String('a');
            toStringError.toString = jest.fn().mockImplementation(() => {
                throw new Error('some_error');
            });

            const store = exporterMockStore(null, toStringError)();

            return await catchExpectedWithError(expectedActions, store, addProduct);
        });

    });

    describe('#removeProduct', () => {
        let mockRemoveProductFn;

        beforeAll(() => {
          mockRemoveProductFn = jest.spyOn(exportPayloadActions, 'removeProduct');
        });

        afterAll(() => {
          mockRemoveProductFn.mockRestore();
        });

      it('Should remove a product', () => {
          const data = {
              result: 'Product removed'
          };

          const productId = 1234;

          const expectedActions = [
              {type: exportPayloadActionTypes.PRODUCT_REMOVED,  exportPayload: {result: 'Product removed'}}
          ];

          const store = exporterMockStore(data)({removeProduct: data});

          return store.dispatch(removeProduct(productId)).then(() => {
              expect(mockRemoveProductFn).toHaveBeenCalledWith(productId);
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should remove a product with a given document number', () => {

          const data = {
            result: 'Product removed'
          };

          const productId = 1234;
          const documentNumber = 'GBR-2020-CC-8EEB74308';

          const expectedActions = [
            {type: exportPayloadActionTypes.PRODUCT_REMOVED,  exportPayload: {result: 'Product removed'}}
          ];

          const store = exporterMockStore(data)({removeProduct: data});

          return store.dispatch(removeProduct(productId, documentNumber)).then(() => {
            expect(mockRemoveProductFn).toHaveBeenCalledWith(productId, documentNumber);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should fail to remove a product', () => {
          const expectedActions = [
              {type: exportPayloadActionTypes.PRODUCT_UPDATE_FAILED,  errorRes: 'Error: a' }
          ];

          const store = exporterMockStore(null, new Error('a'))();

          return store.dispatch(removeProduct(null)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should fail to remove a product if an error is thrown within the promise', async () => {
          const expectedActions = [
              {type: exportPayloadActionTypes.PRODUCT_UPDATE_FAILED,  errorRes: new Error('some_error') }
          ];

          const toStringError = new String('a');
          toStringError.toString = jest.fn().mockImplementation(() => {
              throw new Error('some_error');
          });

          const store = exporterMockStore(null, toStringError)();

          return await catchExpectedWithError(expectedActions, store, removeProduct);
      });

      it('should fail to remove a product if status code equals 403', () => {
          const expectedActions = [
            {type: exportPayloadActionTypes.PRODUCT_REMOVED_UNAUTHORISED}
          ];

          const error = new Error('a');
          error.response = {
            status: 403
          };

          const store = exporterMockStore(null, error)();

          return store.dispatch(removeProduct(null)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('#getExportPayload', () => {

      it('Should get export payload', () => {
          const data = [
              {
                  landings: [
                      {
                          model: {
                              dateLanded: '2019-03-08T00:00:00.000Z',
                              exportWeight: 150,
                              id: '95e4ce32-dd78-4599-b2c0-51be6c7c7d5e'
                          },
                          vessel: {
                              domId: 'ANNISABELLA-LO61',
                              homePort: 'LOWESTOFT',
                              imoNumber: '',
                              label: 'ANN ISABELLA (LO61)',
                              licenceNumber: '20178',
                              pln: 'LO61',
                              registrationNumber: '',
                              vesselName: 'ANN ISABELLA'
                          }
                      }
                  ],
                  product: {
                      commodityCode: '03047190',
                      id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
                      presentation: {
                          code: 'FIL',
                          label: 'Filleted'
                      },
                      species: {
                          code: 'COD',
                          label: 'Atlantic cod (COD)'
                      },
                      state: {
                          code: 'FRO',
                          label: 'Frozen'

                      }
                  }
              }
          ];

          const expectedActions = [
              { type: 'clear_errors' },
              { type: exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED },
              {type: exportPayloadActionTypes.EXPORT_PAYLOAD_LOADED,  exportPayload: data}
          ];

          const store = exporterMockStore(data)({getExportPayload : data});

          return store.dispatch(getExportPayload()).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should fail to get export payload', () => {
          const error = {response: {status: 500}};
          const store = exporterMockStore(null, error)();
          const expectedActions = [
              { type: 'clear_errors' },
              { type: exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED },
              { type: exportPayloadActionTypes.EXPORT_PAYLOAD_FAILED,  error: error.toString() }
          ];

          return store.dispatch(getExportPayload()).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should fail to get the export payload if an error is thrown within the promise', async () => {
          const expectedActions = [
              { type: 'clear_errors' },
              { type: exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED },
              { type: exportPayloadActionTypes.EXPORT_PAYLOAD_FAILED,  error: new Error('some_error') }
          ];

          const toStringError = new String('a');
          toStringError.toString = jest.fn().mockImplementation(() => {
              throw new Error('some_error');
          });
          toStringError.response = {
            status: 400
          };

          const store = exporterMockStore(null, toStringError)();

          return await catchExpectedWithError(expectedActions, store, getExportPayload);
      });

    it('should get export payload with a given document number for an authorised user', () => {
        const data = [
            {
                landings: [
                    {
                        model: {
                            dateLanded: '2019-03-08T00:00:00.000Z',
                            exportWeight: 150,
                            id: '95e4ce32-dd78-4599-b2c0-51be6c7c7d5e'
                        },
                        vessel: {
                            domId: 'ANNISABELLA-LO61',
                            homePort: 'LOWESTOFT',
                            imoNumber: '',
                            label: 'ANN ISABELLA (LO61)',
                            licenceNumber: '20178',
                            pln: 'LO61',
                            registrationNumber: '',
                            vesselName: 'ANN ISABELLA'
                        }
                    }
                ],
                product: {
                    commodityCode: '03047190',
                    id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
                    presentation: {
                        code: 'FIL',
                        label: 'Filleted'
                    },
                    species: {
                        code: 'COD',
                        label: 'Atlantic cod (COD)'
                    },
                    state: {
                        code: 'FRO',
                        label: 'Frozen'
                    }
                },
                unauthorised: false
            }
        ];

        const expectedActions = [
            { type: 'clear_errors' },
            { type: exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED },
            {type: exportPayloadActionTypes.EXPORT_PAYLOAD_LOADED, exportPayload: data}
        ];

        const store = exporterMockStore(data)({getExportPayload : data});
        return store.dispatch(getExportPayload('GBR-2020-CC-112C0C902')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

      it('should fail to get export payload for an unauthorised user', () => {
          const error = {response: {status: 403}};

          const expectedActions = [
            { type: 'clear_errors' },
            { type: exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED },
            {type: exportPayloadActionTypes.EXPORT_PAYLOAD_UNAUTHORISED }
          ];

          const store = exporterMockStore(null, error)();

          return store.dispatch(getExportPayload('GBR-2020-CC-112C0C902')).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    describe('#clearExportPayload', () => {
      it('Should clear export payload', () => {
        const expectedActions = [
            { type: 'export-certificate/export-payload/clear' },
        ];

        const store = configureStore([thunk])({});
        store.dispatch(clearExportPayload());
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('#clearExportPayloadErrors', () => {
      it('Should clear export payload', () => {
        const expectedActions = [
            { type: 'export-certificate/export-payload/clear-errors' },
        ];

        const store = configureStore([thunk])({});
        store.dispatch(clearErrorsExportPayload());
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
});