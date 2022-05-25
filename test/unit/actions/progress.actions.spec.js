import {
  getProgress,
  clearProgress,
  checkProgress,
  clearErrors,
  GET_PROGRESS_SUCCESS,
  GET_PROGRESS_ERROR,
  GET_PROGRESS_UNAUTHORISED,
  CLEAR_PROGRESS_DATA,
} from '../../../src/client/actions/progress.actions';

import { CLEAR_ERRORS } from '../../../src/client/actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const data = {
  reference: 'OPTIONAL',
  exporter: 'COMPLETED',
  products: 'INCOMPLETE',
  landings: 'CANNOT START',
  conservation: 'INCOMPLETE',
  exportJourney: 'INCOMPLETE',
  transportType: 'INCOMPLETE',
  transportDetails: 'CANNOT START',
};

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

const mockStore = (respondWith = { data }, rejectWith = undefined) =>
  configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            if (rejectWith !== undefined) {
              rej(rejectWith);
            } else {
              res(respondWith);
            }
          });
        },
      },
    }),
  ]);

describe('getProgress', () => {
  describe('if the orchestrator call succeeds', () => {
    it('should dispatch any progress data', async () => {
      const store = mockStore()();

      await store.dispatch(getProgress());

      expect(store.getActions()).toEqual([
        {
          type: GET_PROGRESS_SUCCESS,
          payload: data,
        },
      ]);
    });

    it('should dispatch null if there is no progress data', async () => {
      const store = mockStore({ data: '' })();

      await store.dispatch(getProgress());

      expect(store.getActions()).toEqual([
        {
          type: GET_PROGRESS_SUCCESS,
          payload: {
            progress: null
          },
        },
      ]);
    });
  });

  describe('if the orchestrator call errors', () => {
    it('should dispatch a forbidden response if its a forbidden error', async () => {
      const response = {
        status: 403,
      };

      const store = mockStore(undefined, { response })();

      await store.dispatch(getProgress());

      expect(store.getActions()).toEqual([
        {
          type: GET_PROGRESS_UNAUTHORISED,
        },
      ]);
    });

    it('should fail to get progress data', async () => {
      const expectedActions = [
        {
          type: 'api_call_failed',
          payload: { data: 'some_error', status: 400 },
        },
        {
          type: GET_PROGRESS_ERROR,
          errorRes: {
            response: { data: 'some_error', status: 400 }
          },
        }
      ];

      const store = mockStore(null, {
        response: { data: 'some_error', status: 400 },
      })();

      return await catchExpectedWithError(
        expectedActions,
        store,
        getProgress
      );
    });
  });
});

describe('checkProgress', () => {
  it('should dispatch actions to begin an api call', () => {
    const store = mockStore()();

    store.dispatch(checkProgress());

    expect(store.getActions()).toEqual([{
      type: 'begin_api_call'
    }]);
  });

  it('should dispatch a forbidden response if an forbidden error occurs', () => {
    const response = { status: 403, statusText: 'Forbidden'};

    const store = mockStore(undefined, { response })();

    return store.dispatch(checkProgress())
      .catch((err) => {
        expect(err).toEqual({ response });
        expect(store.getActions()).toEqual([
          { type: 'begin_api_call' },
          { type: GET_PROGRESS_UNAUTHORISED }
        ]);
      });
  });

  it('should dispatch a full page error response if a service error occurs', () => {
    const response = { status: 500, statusText: 'Internal Service Error'};

    const store = mockStore(undefined, { response })();

    return store.dispatch(checkProgress())
      .catch((err) => {
        expect(err).toEqual({ response });
        expect(store.getActions()).toEqual([
          { type: 'begin_api_call' },
          { type: 'save', payload: { showFullPageError: true } }
        ]);
      });
  });

  it('should dispatch a api called failed error response if the request fails', () => {
    const response = {
      status: 400,
      statusText: 'Bad Request',
      data: {
        conservation: 'error.conservation.incomplete',
        exportJourney: 'error.exportJourney.incomplete'
     }
    };

    const store = mockStore(undefined, { response })();

    return store.dispatch(checkProgress())
      .catch((err) => {
        expect(err).toEqual({ response });
        expect(store.getActions()).toEqual([
          { type: 'begin_api_call' },
          { type: 'api_call_failed', payload: response }
        ]);
      });
  });
});

describe('clearProgress', () => {
  it('Should clear progress', () => {
    const expectedActions = [{ type: CLEAR_PROGRESS_DATA }];

    const store = configureStore([thunk])({});
    store.dispatch(clearProgress());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('clearErrors', () => {
  it('Should clear errors', () => {
    const expectedActions = [{ type: CLEAR_ERRORS }];

    const store = configureStore([thunk])({});
    store.dispatch(clearErrors());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
