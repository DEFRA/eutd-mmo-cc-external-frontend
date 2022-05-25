import getCommodityCodeReducer from '../../../src/client/reducers/getCommodityCodeReducer';

describe('Get Commodity Code Reducer', () => {
  it('should reduce to initial state', () => {
    const initialState = [];
    const action = { type: '' };

    expect(getCommodityCodeReducer(initialState, action)).toEqual([]);
  });

  it('should reduce to initial state with an unauthorised', () => {
    const action = { type: '' };

    expect(getCommodityCodeReducer(undefined, action)).toEqual([]);
  });

  it('should reduce new commodity code to store', () => {
    const initialState = [];

    const payload = {
      data: [{
        code: '03047190',
        description: 'Frozen fillets of cod \'Gadus morhua, Gadus ogac\'"'
      }]
    };

    const expected = [
        {
          label: '03047190 - Frozen fillets of cod \'Gadus morhua, Gadus ogac\'"',
          value: '03047190',
        },
      ];

    const action = { type: 'get_commodity_code', payload: payload };

    expect(getCommodityCodeReducer(initialState, action)).toEqual(expected);
  });

  it('should reduce intial state to store', () => {
    const initialState = [];

    const payload = {};

    const expected = [];

    const action = { type: 'get_commodity_code', payload: payload };

    expect(getCommodityCodeReducer(initialState, action)).toEqual(expected);
  });
});
