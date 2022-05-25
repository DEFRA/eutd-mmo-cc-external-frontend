import postcodeLookupReducer from '../../../src/client/reducers/postcodeLookupReducer';

describe('Postcode Lookup Reducer', () => {
  it('should reduce to initial state when there is no action type despatched', () => {
    const initialState = {};
    const action = {
      type: '',
    };
    expect(postcodeLookupReducer(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state with an authorised', () => {
    const initialState = {};
    const action = {
      type: '',
    };
    expect(postcodeLookupReducer(undefined, action)).toEqual(initialState);
  });

  it('should save the addresses of the postcode to state', () => {
    const initialState = {};
    const action = {
      payload: { postcode: 'B203PD' },
      type: 'GET_POSTCODE_ADDRESSES',
    };
    const expectedResult = { postcode: 'B203PD' };
    expect(postcodeLookupReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should add the postcode lookup address to the state', () => {
    const initialState = {};
    const action = {
      type: 'SAVE_POSTCODE_LOOKUP_ADDRESS',
      payload: {
        subBuildingName: 'Some Building',
        buildingNumber: '110',
        buildingName: 'LANCASTER HOUSE',
        streetName: 'HAMPSHIRE COURT',
        townCity: 'NEWCASTLE UPON TYNE',
        county: 'TYNESIDE',
        postcode: 'NE4 7YH',
        country: 'ENGLAND',
        addressOne: '110, Some Building, LANCASTER HOUSE, HAMPSHIRE COURT',
      },
    };
    const expectedResult = {
      postcodeLookupAddress: {
        subBuildingName: 'Some Building',
        buildingNumber: '110',
        buildingName: 'LANCASTER HOUSE',
        streetName: 'HAMPSHIRE COURT',
        townCity: 'NEWCASTLE UPON TYNE',
        county: 'TYNESIDE',
        postcode: 'NE4 7YH',
        country: 'ENGLAND',
        addressOne: '110, Some Building, LANCASTER HOUSE, HAMPSHIRE COURT',
      },
    };
    expect(postcodeLookupReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should empty the postcodeLookupAddress', () => {
    const initialState = {};
    const action = {
      type: 'CLEAR_POSTCODE_LOOKUP_ADDRESS',
    };
    const expectedResult = {
      postcodeLookupAddress: {},
    };
    expect(postcodeLookupReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should add unauthorised to the state', () => {
    const initialState = {};
    const action = { type: 'POSTCODE_LOOKUP_UNAUTHORISED' };
    const expectedResult = { unauthorised: true };

    expect(postcodeLookupReducer(initialState, action)).toEqual(expectedResult);
  });
});
