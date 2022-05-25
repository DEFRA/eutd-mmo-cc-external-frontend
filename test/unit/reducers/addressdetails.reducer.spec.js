import addressDetailsReducer from '../../../src/client/reducers/addressdetails.reducer';

describe('Address Details Reducer', () => {

    it('should reduce to initial state', () => {

      const initialState = {
          model: {
          }
      };

      const action = {
          type: ''
      };

      expect(addressDetailsReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {

      const initialState = {
          model: {
          }
      };

      const action = {
          type: ''
      };

      expect(addressDetailsReducer(undefined, action)).toEqual(initialState);
    });


    it('should update state when address details are requested', () => {
        const initialState = {
            model: {
            }
        };

        const payload = {
            data : {
            }
        };

        const action = {type: 'address-details/requested', payload: payload};

        const expectedAction = {
            model : {},
            busy  : true,
            error : undefined
        };

        expect(addressDetailsReducer(initialState, action)).toEqual(expectedAction);
    });

    it('should update state when address details are returned', () => {
        const initialState = {
            model: {},
            busy  : false
        };

        const action = {
            type     : 'address-details/loaded',
            addresses : {
                uprn: '123456',
                buildingname: 'Building Name',
                subbuildingname: 'Sub-building name',
                premises: 'Premises',
                street: '1 The Street',
                locality: 'Locality',
                dependentlocality: 'Dependent Locality',
                towntext: 'Town',
                county: 'County',
                postcode: 'Post code',
                countryId: 'EN',
                internationalpostalcode: 'EN',
                fromcompanieshouse: '1234567'
            }
        };

        const expectedAction = {
            model : {
                uprn: '123456',
                buildingname: 'Building Name',
                subbuildingname: 'Sub-building name',
                premises: 'Premises',
                street: '1 The Street',
                locality: 'Locality',
                dependentlocality: 'Dependent Locality',
                towntext: 'Town',
                county: 'County',
                postcode: 'Post code',
                countryId: 'EN',
                internationalpostalcode: 'EN',
                fromcompanieshouse: '1234567'
            },
            busy  : false,
            error : undefined
        };

        expect(addressDetailsReducer(initialState, action)).toEqual(expectedAction);
    });

    it('should update state when an address details request has failed', () => {
        const initialState = {
            model: {},
            busy  : true
        };

        const action = {
            type  : 'address-details/failed',
            error : 'The API call failed'
        };

        const expectedAction = {
            model : {},
            busy  : false,
            error : 'The API call failed'
        };

        expect(addressDetailsReducer(initialState, action)).toEqual(expectedAction);
    });

});


/*
const initialState = { model: {}};

export default(state = initialState, action) => {
  switch (action.type) {
    case dynamicsActionTypes.ADDRESS_DETAILS_REQUESTED:
      return {
        ...state,
        busy: true,
        error: undefined
      };
    case dynamicsActionTypes.ADDRESS_DETAILS_LOADED:
      return {
        ...state,
        model: action.addresses,
        error: undefined,
        busy: false
      };
    case dynamicsActionTypes.ADDRESS_DETAILS_FAILED:
      return {
        ...state,
        error: action.error,
        busy: false,
      };
    default:
      return state;
  }
};
*/