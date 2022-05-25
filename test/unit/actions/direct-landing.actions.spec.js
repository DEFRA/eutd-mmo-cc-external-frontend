import { BEGIN_API_CALL, API_CALL_FAILED } from '../../../src/client/actions';
import {
  clearDirectLanding,
  getDirectLandings,
  upsertDirectLanding,
  CLEAR_DIRECT_LANDING,
  GET_DIRECT_LANDING_PRODUCTS,
} from '../../../src/client/actions/direct-landing.actions';

import { exportPayloadActionTypes } from '../../../src/client/actions/export-payload.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('Direct Landing Actions', () => {
  const mockGet = jest.fn();

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: mockGet,
      },
    }),
  ]);

  beforeEach(() => {
    mockGet.mockReset();
  });

  describe('getDirectLandings', () => {
    const documentNumber = 'document123';

    it('will call the orchestrator api correctly', async () => {
      const store = mockStore();

      mockGet.mockResolvedValue({ vessel: 'WIRON 5' });

      return await store
        .dispatch(getDirectLandings(documentNumber))
        .then(() => {
          expect(mockGet).toHaveBeenCalledWith(
            '/export-certificates/export-payload/direct-landings',
            {
              headers: {
                documentnumber: documentNumber,
              },
            }
          );
        });
    });

    it('will dispatch the right actions on success', async () => {
      const data = { vessel: 'WIRON 5' };
      const store = mockStore();

      mockGet.mockResolvedValue({ data });

      return await store
        .dispatch(getDirectLandings(documentNumber))
        .then(() => {
          expect(store.getActions()).toEqual([
            {
              type: BEGIN_API_CALL,
            },
            {
              type: GET_DIRECT_LANDING_PRODUCTS,
              payload: data,
            },
          ]);
        });
    });

    it('will dispatch the right actions on error', async () => {
      const response = { status: 500, statusText: 'Internal Server Error' };
      const store = mockStore();

      mockGet.mockRejectedValue({ response });

      return await store
        .dispatch(getDirectLandings(documentNumber))
        .catch((e) => {
          expect(store.getActions()).toStrictEqual([
            {
              type: BEGIN_API_CALL,
            },
            {
              type: API_CALL_FAILED,
              payload: response,
            },
          ]);

          expect(e).toEqual(
            new Error(
              `An error has occurred ${response.status} (${response.statusText})`
            )
          );
        });
    });

    it('will dispatch the right actions on forbidden', async () => {
      const response = { status: 403, statusText: 'Unauthorised' };
      const store = mockStore();

      mockGet.mockRejectedValue({ response });

      return await store
        .dispatch(getDirectLandings(documentNumber))
        .catch((e) => {
          expect(store.getActions()).toStrictEqual([
            {
              type: BEGIN_API_CALL,
            },
            {
              type: 'save',
              payload: { showForbiddenError: true}
            }
          ]);

          expect(e).toEqual(
            new Error(
              `An error has occurred ${response.status} (${response.statusText})`
            )
          );
        });
    });
  });

  describe('clearDirectLanding', () => {
    it('will dispatch the correct action', () => {
      const store = mockStore();

      store.dispatch(clearDirectLanding());

      expect(store.getActions()).toEqual([{ type: CLEAR_DIRECT_LANDING }]);
    });
  });

  describe('upsertDirectLanding', () => {
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

    it('should upsert a landing', () => {
      const data = {
          result: 'Landing upserted'
      };

      const productId = 1234;
      const landingId = 5678;

      const expectedActions = [
          {type: exportPayloadActionTypes.LANDING_UPSERTED,  exportPayload: {result: 'Landing upserted'}},
          { type: 'clear_errors' }
      ];

      const store = exporterMockStore(data)({upsertLanding: data});

      return store.dispatch(upsertDirectLanding(productId, landingId)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });

  it('should upsert a landing with a document number', () => {
    const data = {
        result: 'Landing upserted'
    };

    const productId = 1234;
    const landingId = 5678;
    const documentNumber = 'GBR-2020-CC-112C0C902';

    const expectedActions = [
        {type: exportPayloadActionTypes.LANDING_UPSERTED,  exportPayload: {result: 'Landing upserted'}},
        { type: 'clear_errors' }
    ];

    const store = exporterMockStore(data)({upsertLanding: data});

    return store.dispatch(upsertDirectLanding(productId, landingId, documentNumber)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should upsert a landing with the error data when status === 400', async () => {
      const expectedActions = [
        {type: exportPayloadActionTypes.LANDING_UPSERTED,  exportPayload: { errors: { vessel: 'some_error' } }, errors: { vessel: 'some_error' }}
      ];

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

      const store = exporterMockStore(null, { response : { data: { errors: { vessel: 'some_error'} }, status: 400  } })();

      return await catchExpectedWithError(expectedActions, store, upsertDirectLanding);
  });

  it('should fail to upsert a landing with the error data when status !== 400', () => {
      const expectedActions = [
          {type: 'save',  payload: { showFullPageError: true } }
      ];

      const store = exporterMockStore(null, { message : 'some_error', response: { status: 500 } })();

      return store.dispatch(upsertDirectLanding(null, null)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should fail to upsert a landing if an error is thrown within the promise', () => {
      const expectedActions = [
          {type: 'save',  payload: { showFullPageError: true } }
      ];

      const store = exporterMockStore(null, { response : { data: { errors: { vessel: 'some_error'} }, status: 500 }, message: 'some_message' })();

      return store.dispatch(upsertDirectLanding(null, null)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should fail to upsert a landing with the error data when status === 403', () => {
      const expectedActions = [ {type: 'post_direct_landing_products_unauthorised' } ];

      const store = exporterMockStore(null, { response : { data : 'some_error', status: 403 }})();

      return store.dispatch(upsertDirectLanding(null, null)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should fail to upsert a landing with the error data when status === 403 and is a WAF rule violation', () => {
      const expectedActions = [ {type: 'post_direct_landing_prodcts_waf_error', supportID: '12345678' } ];

      const store = exporterMockStore(null, { response : { data : 'Your support ID is 12345678', status: 403 }})();

      return store.dispatch(upsertDirectLanding(null, null)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
  });
  });
});
