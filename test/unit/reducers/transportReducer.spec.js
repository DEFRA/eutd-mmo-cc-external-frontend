import transportReducer from '../../../src/client/reducers/transportReducer';

describe('transportReducer', () => {

  it('should reduce to initial state', () => {
    const initialState = [];
    const action = {type: ''};

    expect(transportReducer(initialState, action)).toEqual([]);
  });

  it('should reduce to initial state with an undefined', () => {
    const action = {type: ''};

    expect(transportReducer(undefined, action)).toEqual({});
  });

  it('should add transport to initial state', () => {
    const initialState = [];

    const payload = {
      data : {
        vehicle: 'truck',
        departurePlace: 'North Shields'
      }
    };

    const action = {type: 'add_transport', payload: payload};

    expect(transportReducer(initialState, action)).toEqual({'departurePlace': 'North Shields', 'vehicle': 'truck'});
  });

  it('should add transport truck details to transport state', () => {
    const initialState = {'departurePlace': 'North Shields', 'vehicle': 'truck'};

    const payload = {
      data : {
        nationalityOfVehicle: 'GB',
        registrationNumber: '123456789',
        crm: 'true'
      }
    };

    const action = {type: 'add_transport_details', payload: payload};

    expect(transportReducer(initialState, action)).toEqual({'departurePlace': 'North Shields', 'nationalityOfVehicle': 'GB', 'registrationNumber': '123456789', 'vehicle': 'truck', 'crm': 'true'});
  });

  it('should add transport truck details to transport state with no data', () => {
    const initialState = {'departurePlace': 'North Shields', 'vehicle': 'truck'};

    const payload = {};

    const action = {type: 'add_transport_details', payload: payload};

    expect(transportReducer(initialState, action)).toEqual({});
  });

  it('should add transport train details to transport state', () => {
    const initialState = {'departurePlace': 'North Shields', 'vehicle': 'train'};

    const payload = {
      data : {
        railwayBillNumber: '123456'
      }
    };

    const action = {type: 'add_transport_details', payload: payload};

    expect(transportReducer(initialState, action)).toEqual({'departurePlace': 'North Shields', 'railwayBillNumber': '123456', 'vehicle': 'train'});
  });

  it('should add transport plane details to transport state', () => {
    const initialState = {'departurePlace': 'North Shields', 'vehicle': 'plane'};

    const payload = {
      data : {
        flightNumber: '123456',
        containerNumber: '7891090'
      }
    };

    const action = {type: 'add_transport_details', payload: payload};

    expect(transportReducer(initialState, action)).toEqual({'departurePlace': 'North Shields',
                                                            'flightNumber': '123456',
                                                            'containerNumber': '7891090',
                                                            'vehicle': 'plane'});
  });

  it('should add transport container vessel details to transport state', () => {
    const initialState = {'departurePlace': 'North Shields', 'vehicle': 'containerVessel'};

    const payload = {
      data : {
        vesselName: 'Vessel III',
        flagState: 'xyz',
        containerNumber: '123456'
      }
    };

    const action = {type: 'add_transport_details', payload: payload};

    expect(transportReducer(initialState, action)).toEqual({'departurePlace': 'North Shields',
                                                            'vesselName': 'Vessel III',
                                                            'flagState': 'xyz',
                                                            'containerNumber': '123456',
                                                            'vehicle': 'containerVessel'});
  });

  it('should unauthorise get transport details by adding unauthorised to transport state', () => {
    const initialState = {
      'departurePlace': 'London',
      'vehicle': 'truck'
    };

    const action = {type: 'add_transport_details_unauthorised'};

    expect(transportReducer(initialState, action)).toEqual({
      'departurePlace': 'London',
      'vehicle': 'truck',
      'unauthorised': true
    });
  });

  it('should unauthorise save transport details by adding unauthorised to transport state', () => {
    const initialState = {
      'departurePlace': 'London',
      'vehicle': 'truck'
    };

    const action = {type: 'save_transport_details_unauthorised'};

    expect(transportReducer(initialState, action)).toEqual({
      'departurePlace': 'London',
      'vehicle': 'truck',
      'unauthorised': true
    });
  });

  it('should reduce transport state to unauthorised and with supportID when it is a WAF rule violation', () => {
    const initialState = {
      'departurePlace': 'London',
      'vehicle': 'truck'
    };

    const action = {type: 'save_transport_details_waf_error', supportID: '123456'};

    expect(transportReducer(initialState, action)).toEqual({
      'departurePlace': 'London',
      'vehicle': 'truck',
      'unauthorised': true,
      'supportID': '123456'
    });
  });

  it('should clear transport details from state', () => {
    const initialState = {'departurePlace': 'North Shields', 'vehicle': 'containerVessel'};
    const action = {type: 'clearTransportDetails'};

    expect(transportReducer(initialState, action)).toEqual({});
  });
});