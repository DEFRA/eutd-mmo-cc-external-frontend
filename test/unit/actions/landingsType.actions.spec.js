import {
  clearLandingsType,
  validateLandingType,
  confirmChangeLandingsType,
  getLandingType,
  landingsType,
  onLoadComponentRedirect,
  saveLandingsEntryType,
  dispatchSaveChangedLandingsType,
  clearChangedLandingsType,
} from '../../../src/client/actions/landingsType.actions';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

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

const MockStore = (data, rejectWith = false) =>
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

describe('#getLandingsType', () => {

  const data = {
    isDirectLanding: false
  };

  it('should get the export landings type', () => {

    const documentNumber = 'GBR-2020-CC-2345-3453';
    const expectedActions = [{
      type : 'landingsType/landings_type/save',
      payload: { isDirectLanding: false }
    }];

    const store = MockStore(data)({ payload: data });

    return store.dispatch(getLandingType(documentNumber)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should get the export landings type with no document number', () => {

    const documentNumber = undefined;
    const expectedActions = [{
      type : 'landingsType/landings_type/save',
      payload: { isDirectLanding: false }
    }];

    const store = MockStore(data)({ payload: data });

    return store.dispatch(getLandingType(documentNumber)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should fail to get landings type', async () => {
    const expectedActions = [
      {
        type: 'api_call_failed',
        payload: { data: 'some_error', status: 400 },
      },
      {
        type: landingsType.LANDINGS_TYPE_CHANGE_FAILED,
        errorRes: {
          response: { data: 'some_error', status: 400 }
        },
      }
    ];

    const store = MockStore(null, {
      response: { data: 'some_error', status: 400 },
    })();

    return await catchExpectedWithError(
      expectedActions,
      store,
      getLandingType
    );
  });

  it('should unauthorised attempt to get landings type', () => {
    const documentNumber = 'GBR-2020-CC-2345-3453';
    const expectedActions = [{ type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED }];
    const store = MockStore(null, {
      response: { data: 'some_error', status: 403 },
    })();

    return store.dispatch(getLandingType(documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('#confirmChangeLandingsType', () => {

  it('should confirm a change in landings type', () => {
    const data = {
      result: 'Product added',
    };

    const expectedActions = [
      { type: 'begin_api_call' },
      { type: landingsType.LANDINGS_TYPE_SAVE, payload: data },
    ];

    const store = MockStore(data)({ payload: data });

    return store.dispatch(confirmChangeLandingsType('Yes')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should confirm a change in landings type with document number', () => {
    const documentNumber = '123-CC-XX';
    const path = '/:documentNumber/currentPath';
    const journey = 'catchCertificates';
    const data = {
      result: 'Product added',
    };

    const expectedActions = [
      { type: 'begin_api_call' },
      { type: landingsType.LANDINGS_TYPE_SAVE, payload: data },
    ];

    const store = MockStore(data)({ payload: data });

    return store
      .dispatch(confirmChangeLandingsType('Yes', journey, path, documentNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should fail to confirm a change in landings type', async () => {
    const expectedActions = [
      { type: 'begin_api_call' },
      {
        type: 'api_call_failed',
        payload: {
          data: 'some_error',
          status: 400,
        },
      },
      {
        type: landingsType.LANDINGS_TYPE_CHANGE_FAILED,
        error: new Error('confirm-change-landings-type error'),
      },
    ];

    const store = MockStore(null, {
      response: { data: 'some_error', status: 400 },
    })();

    return await catchExpectedWithError(
      expectedActions,
      store,
      confirmChangeLandingsType
    );
  });

  it('should unauthorise to confirm a change in landings type', () => {
    const expectedActions = [
      { type: 'begin_api_call' },
      { type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED },
    ];

    const store = MockStore(null, {
      response: { data: 'some_error', status: 403 },
    })();

    return store.dispatch(confirmChangeLandingsType('Yes', null)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should catch errors when confirming landings type change', async () => {
    const expectedActions = [
      { type: 'begin_api_call' },
      {
        type: 'landingsType/landings_type/failed',
        error: new TypeError('Cannot read property \'status\' of undefined'),
      },
    ];

    const store = MockStore(null, {})();

    return await catchExpectedWithError(
      expectedActions,
      store,
      confirmChangeLandingsType
    );
  });
});

describe('#onLoadComponentRedirect`', () => {
  it('should  redirect to CC home page on page load', () => {
    const expectedActions = [{ type: 'landingsType/landings_type/unauthorised' }];

    const store = configureStore([thunk])({});
    store.dispatch(onLoadComponentRedirect());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('#saveLandingsEntryType', () => {

  it ('should save a LandingsEntryType', () => {
    const expectedActions = [
      {
        'payload': { landingsEntryOption: {landingsEntryOption: 'manualEntry'}},
        'type': 'landingsType/landings_type/save',
      }
    ];

    const store = configureStore([thunk])({});

    store.dispatch(saveLandingsEntryType({ landingsEntryOption: 'manualEntry'}));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('#clearLandingsType', () => {
  it('Should clear landings type', () => {
    const expectedActions = [{ type: 'landingsType/landings_type/clear' }];

    const store = configureStore([thunk])({});
    store.dispatch(clearLandingsType());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('#validateLandingsType', () => {

  it('should validate a landings type', () => {
    const data = { isDirectLanding: 'Yes' };
    const expectedActions = [
      { type: 'begin_api_call' },
      { type: landingsType.LANDINGS_TYPE_SAVE, payload: data }
    ];

    const store = MockStore(data)({ payload: data });

    return store.dispatch(validateLandingType('Yes')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should validate landing type with document number', () => {
    const documentNumber = 'GB-123-CC-XX';
    const journey = 'catchCertificates';
    const data = { isDirectLanding: 'Yes' };
    const expectedActions = [
      { type: 'begin_api_call' },
      { type: landingsType.LANDINGS_TYPE_SAVE, payload: data }
    ];

    const store = MockStore(data)({ payload: data });

    return store
      .dispatch(validateLandingType('Yes', journey, documentNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should fail to validate a landings type', async () => {
    const expectedActions = [
      { type: 'begin_api_call' },
      {
        type: 'api_call_failed',
        payload: { data: 'some_error', status: 400 }
      },
      {
        type: 'api_call_failed',
        payload: {}
      }
    ];

    const store = MockStore(null, { response: { data: 'some_error', status: 400 }})();

    return await catchExpectedWithError(
      expectedActions,
      store,
      validateLandingType
    );
  });

  it('should unauthorise to validate a landings type', () => {
    const expectedActions = [
      { type: 'begin_api_call' },
      { type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED },
    ];

    const store = MockStore(null, { response: { data: 'some_error', status: 403 }})();

    return store.dispatch(validateLandingType('Yes', null)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should catch errors when validating a landing type', async () => {
    const expectedActions = [
      { type: 'begin_api_call' },
      {
        type: 'api_call_failed',
        payload: {},
      }
    ];

    const store = MockStore(null, {})();

    return await catchExpectedWithError(
      expectedActions,
      store,
      validateLandingType
    );
  });
});

describe('Changed Landings Type Actions',()=> {
  it('should save the changed landings type', () => {
    const expectedActions = [{
      type : 'save_changed_landings_type',
      payload: 'manualEntry'
    }];

    const store = configureStore([thunk])({});

    store.dispatch(dispatchSaveChangedLandingsType('manualEntry'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should clear the changed landings type', ()=> {
    const expectedActions = [{ type: 'clear_changed_landings_type' }];

    const store = configureStore([thunk])({});
    store.dispatch(clearChangedLandingsType());
    expect(store.getActions()).toEqual(expectedActions);
  });
});