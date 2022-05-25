import { findExporterAddress, saveManualLookupAddress, clearErrors, clearPostcodeLookupAddress, addressOneTransformer } from '../../../src/client/actions/postcode-lookup.actions';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const data = {};

describe('when the exporter is finding addresses of a postcode', () => {

  const mockStore = (rejectWith = false) => configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      post: () => {
        return new Promise((res, rej) => {
          if (rejectWith) {
            rej(rejectWith);
          } else {
            res({ 'data':'data' });
          }
        });
      }
    },
    referenceServiceApi: {
      get: () => {
        return new Promise((res, rej) => {
          if (rejectWith) {
            rej(rejectWith);
          } else {
            res({ 'data': data });
          }
        });
      }
    }
  })]);

  let getFn = jest.fn();
  let store;
  const postcode = 'B203PD';

  beforeEach(() => {
    getFn.mockReset();
    getFn.mockResolvedValue({ status: 200, data: postcode });

    store = configureStore([thunk.withExtraArgument({
      referenceServiceApi: {
        get: getFn
      }
    })])({});
  });



  it('will call the reference service with the correct details', async () => {
    await store.dispatch(findExporterAddress(postcode));

    expect(getFn).toHaveBeenCalledWith(`/addresses/search?postcode=${postcode}`);
  });

  it('will return the addresses of the postcode from a successful api call and clear the state errors after', async () => {
    await store.dispatch(findExporterAddress(postcode));

    expect(store.getActions()).toEqual([{ 'payload': 'B203PD', 'type': 'GET_POSTCODE_ADDRESSES' }, { 'type': 'clear_errors' }]);
  });

  it('will empty the postcodeLookupAddress', async () => {
    await store.dispatch(clearPostcodeLookupAddress());
    expect(store.getActions()).toEqual([{'type': 'CLEAR_POSTCODE_LOOKUP_ADDRESS'}]);
  });

  it('will return undefined for an unsuccessful api call with status 400', async () => {
    const error = new Error('An error has occurred');
    getFn.mockRejectedValue(error);

    const res = await store.dispatch(findExporterAddress(postcode));

    expect(res).toBeUndefined();
    expect(store.getActions()).toEqual([
      { type: 'save', payload: { showFullPageError: true }},
      { type: 'api_call_failed', payload: {} }]);
  });

  it('will return undefined for an unsuccessful api call with status 500', async () => {
    const error = new Error('An error has occurred');

    getFn.mockRejectedValue(error);

    const res = await store.dispatch(findExporterAddress(postcode));

    expect(res).toBeUndefined();
    expect(store.getActions()).toEqual([
      { type: 'save', payload: { showFullPageError: true }},
      { payload: {}, type: 'api_call_failed' }
    ]);
  });

  it('will dispatch showFullPageError() if the reference service call fails', async () => {
    const error = new Error('An error has occurred');

    getFn.mockRejectedValue(error);

    await store.dispatch(findExporterAddress(postcode));

    expect(store.getActions()).toEqual([
      { type: 'save', payload: { showFullPageError: true }},
      { type: 'api_call_failed', payload: {} }
    ]);
  });


  it('will return undefined for an unsuccessful api call', async () => {
    const error = new Error('An error has occurred');

    getFn.mockRejectedValue(error);

    const res = await store.dispatch(findExporterAddress(postcode));

    expect(res).toBeUndefined();
  });

  it('will dispatch an failed API call with a 400 Bad Request', () => {
    const store = mockStore({ response: { status: 400, statusText: 'Bad Request' } })();

    return store.dispatch(findExporterAddress(postcode)).catch((err) => {
      expect(err).toEqual(new Error('An error has occurred 400 (Bad Request)'));
      expect(store.getActions()).toEqual([
        { type: 'api_call_failed', payload: { status: 400, statusText: 'Bad Request' } }
      ]);
    });
  });

  it('will dispatch unauthorised with a 403 error', () => {
    const store = mockStore({ response: { status: 403, statusText: 'Forbidden' } })();

    return store.dispatch(findExporterAddress(postcode)).catch((err) => {
      expect(err).toEqual(new Error('Unauthorised access 403 Forbidden'));
      expect(store.getActions()).toEqual([
        { type: 'POSTCODE_LOOKUP_UNAUTHORISED' }
      ]);
    });
  });

  it('will dispatch an failed API call with a 500 Internal Server Error', () => {
    const store = mockStore({ response: { status: 500, statusText: 'Internal Server Error' } })();

    return store.dispatch(findExporterAddress(postcode)).catch((err) => {
      expect(err).toEqual(new Error('An error has occurred 500 (Internal Server Error)'));
      expect(store.getActions()).toEqual([
        { type: 'save', payload: { showFullPageError: true } },
        { type: 'api_call_failed', payload: { status: 500, statusText: 'Internal Server Error' } }
      ]);
    });
  });

});

describe('exporter postcode lookup actions', () => {

  const mockStore = configureStore([thunk]);
  const store = mockStore({ exporterPostcodeLookUp: {}, errors: [] });
  let getFn = jest.fn();
  const postcode = 'B203PD';

  beforeEach(() => {
    store.clearActions();
    getFn.mockResolvedValue({ status: 200, data: postcode });
  });

  it('should dispatch findExporterAddress', () => {
    const expectedActions = [];
    store.dispatch(findExporterAddress(postcode));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should clear errors state and unauthorised', () => {
    const expectedActions = [{ 'type': 'CLEAR_POSTCODE_LOOKUP_UNAUTHORISED' }, { 'type': 'clear_errors' }];
    store.dispatch(clearErrors());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('saveManualLookupAddress', () => {
  let postFn = jest.fn();
  let store;

  const mockStore = (rejectWith = false) => configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      post: () => {
        return new Promise((res, rej) => {
          if (rejectWith) {
            rej(rejectWith);
          } else {
            res({ 'data':'data' });
          }
        });
      }
    }
  })]);

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
    documentNumber: 'some-document-number',
    context: 'EXPORTER ADDRESS'
  };

  beforeEach(() => {
    postFn.mockReset();

    store = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        post: postFn,
      }
    })])({});
  });

  it('will call the orchestrator with the correct details with a document number', async () => {
    postFn.mockResolvedValue({ status: 200, data: payload });

    await store.dispatch(saveManualLookupAddress(payload));
    expect(postFn).toHaveBeenCalled();
  });

  it('will call the orchestrator with the correct details without a document number', async () => {
    const manualAddressArgs = {
      ...payload
    };

    delete manualAddressArgs.documentNumber;

    postFn.mockResolvedValue({ status: 200, data: payload });

    await store.dispatch(saveManualLookupAddress(manualAddressArgs));
    expect(postFn).toHaveBeenCalled();
  });

  it('will call the orchestrator with the correct details without a context', async () => {
    const manualAddressArgs = {
      ...payload
    };

    delete manualAddressArgs.context;

    postFn.mockResolvedValue({ status: 200, data: payload });

    await store.dispatch(saveManualLookupAddress(manualAddressArgs));
    expect(postFn).toHaveBeenCalled();
  });

  it('will call the update exporter details action if the call is successful', async () => {
    postFn.mockResolvedValue({ status: 200, data: payload });
    const expectedActions = [{
      type: 'SAVE_POSTCODE_LOOKUP_ADDRESS',
      payload: payload
    }, {
      type: 'clear_errors',
    }];

    await store.dispatch(saveManualLookupAddress(payload, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('will call the update exporter details action if payload is not defined and context is PROCESSING STATEMENT PLANT ADDRESS', async () => {
    const manualAddressArgs = {
      ...payload,
      context: 'PROCESSING STATEMENT PLANT ADDRESS'
    };

    postFn.mockResolvedValue({ status: 200, data: undefined });
    const expectedActions = [{
      type: 'SAVE_POSTCODE_LOOKUP_ADDRESS',
      payload: undefined
    }, {
      type: 'clear_errors',
    }];

    await store.dispatch(saveManualLookupAddress(manualAddressArgs, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('will call the update exporter details action if payload is defined and context is PROCESSING STATEMENT PLANT ADDRESS', async () => {
    const manualAddressArgs = {
      ...payload,
      context: 'PROCESSING STATEMENT PLANT ADDRESS'
    };

    postFn.mockResolvedValue({ status: 200, data: payload });
    const expectedActions = [{
      type: 'SAVE_POSTCODE_LOOKUP_ADDRESS',
      payload: {
        'plantAddressOne': '2, 12, 12, 12',
        'plantBuildingName': '12',
        'plantBuildingNumber': '2',
        'plantCountry': '12',
        'plantCounty': '12',
        'plantPostcode': 'SE16 5HL',
        'plantStreetName': '12',
        'plantSubBuildingName': '12',
        'plantTownCity': '12',
      }
    }, {
      type: 'clear_errors',
    }];

    await store.dispatch(saveManualLookupAddress(manualAddressArgs, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('will call the update exporter details action if payload is empty and context is PROCESSING STATEMENT PLANT ADDRESS', async () => {
    const manualAddressArgs = {
      context: 'PROCESSING STATEMENT PLANT ADDRESS'
    };

    postFn.mockResolvedValue({ status: 200, data: manualAddressArgs });
    const expectedActions = [{
      type: 'SAVE_POSTCODE_LOOKUP_ADDRESS',
      payload: {
        'plantAddressOne': '',
        'plantBuildingName': '',
        'plantBuildingNumber': '',
        'plantCountry': '',
        'plantCounty': '',
        'plantPostcode': '',
        'plantStreetName': '',
        'plantSubBuildingName': '',
        'plantTownCity': '',
      }
    }, {
      type: 'clear_errors',
    }];

    await store.dispatch(saveManualLookupAddress(manualAddressArgs, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('will call the save post code look action if payload is empty and context is STORAGE DOCUMENT STORAGE FACILITY ADDRESS', async () => {
    const manualAddressArgs = {
      context: 'STORAGE DOCUMENT STORAGE FACILITY ADDRESS'
    };

    postFn.mockResolvedValue({ status: 200, data: manualAddressArgs });
    const expectedActions = [{
      type: 'SAVE_POSTCODE_LOOKUP_ADDRESS',
      payload: {
        facilityAddressOne: '',
        facilityBuildingName:  '',
        facilityBuildingNumber:  '',
        facilitySubBuildingName: '',
        facilityStreetName: '',
        facilityTownCity:  '',
        facilityCounty: '',
        facilityCountry:  '',
        facilityPostcode: ''
      }
    }, {
        type: 'clear_errors',
      }];

    await store.dispatch(saveManualLookupAddress(manualAddressArgs, documentNumber)).then(() => {
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
      postcode: 'SE16 5HL',
      country: '12',
    };

    postFn.mockRejectedValue({ response: { status: 400 } });
    const expectedActions = [{ type: 'api_call_failed', payload: { status: 400 } }];

    await store.dispatch(saveManualLookupAddress(payload2, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('will return an error if unauthorised', () => {
    let payload2 = {
      subBuildingName: '12',
      buildingNumber: '2',
      streetName: '12',
      buildingName: '12',
      townCity: '12',
      county: '12',
      postcode: 'SE16 5HL',
      country: '12',
    };

    postFn.mockRejectedValue({ response: { status: 403, statusText: 'Unauthorised Access' } });
    const expectedActions = [{ type: 'POSTCODE_LOOKUP_UNAUTHORISED' }];

    return store.dispatch(saveManualLookupAddress(payload2, documentNumber)).catch((err) => {
      expect(err).toEqual(new Error('An error has occurred 403 (Unauthorised Access)'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('will return undefined for an unsuccessful api call', async () => {
    const error = new Error('broken');

    postFn.mockRejectedValue(error);

    const res = await store.dispatch(saveManualLookupAddress(payload, documentNumber));

    expect(res).toBeUndefined();
  });

  it('saveManualLookupAddress failing', () => {
    const store = mockStore({ response: { status: 500, statusText: 'Internal Server Error' } })();

    return store.dispatch(saveManualLookupAddress(payload, documentNumber)).catch((err) => {
      expect(err).toEqual(new Error('An error has occurred 500 (Internal Server Error)'));
      expect(store.getActions()).toEqual([
        { type: 'save', payload: { showFullPageError: true } },
        { type: 'api_call_failed', payload: { status: 500, statusText: 'Internal Server Error' } }
      ]);
    });
  });
});

describe('addressOneTransformer', () => {
  const facilityBuildingName = 'Sherlock Holmes home';
  const facilityBuildingNumber = '221B';
  const facilitySubBuildingName = 'Secret';
  const facilityStreetName = 'Baker Street';

  it('when calling addressOneTransformer with all the fields', () => {
    const res = addressOneTransformer(facilityBuildingName, facilityBuildingNumber, facilitySubBuildingName, facilityStreetName);

    expect(res).toBe('Sherlock Holmes home, 221B, Secret, Baker Street');
  });


  it('when calling addressOneTransformer with an empty string as parameter', () => {
    const res = addressOneTransformer('', facilityBuildingNumber, '', facilityStreetName);

    expect(res).toBe('221B, Baker Street');
  });

  it('when calling addressOneTransformer with an undefined and null as parameter', () => {
    const res = addressOneTransformer(undefined, facilityBuildingNumber, null, facilityStreetName);

    expect(res).toBe('221B, Baker Street');
  });
});