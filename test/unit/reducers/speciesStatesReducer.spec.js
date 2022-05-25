import speciesStatesReducer from '../../../src/client/reducers/speciesStatesReducer';

describe('Species States Reducer', () => {

  it('should reduce to initial state', () => {
    const initialState = [];
    const action = {
      type : ''
    };

    expect(speciesStatesReducer(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state with an undefined state', () => {
    const initialState = [];
    const action = {
        type : ''
    };

    expect(speciesStatesReducer(undefined, action)).toEqual(initialState);
  });

  it('should reduce to a clear state', () => {
    const initialState = [];
    const action = {
        type : 'get_species_states_clear'
    };

    expect(speciesStatesReducer(undefined, action)).toEqual(initialState);
  });

  it('should reduce initial state when getting species states', () => {
    const initialState = [];

    const action = {
      type : 'get_species_states',
      payload : {
          data : [
              {'value':'ALI','label':'Alive'},
              {'value':'BOI','label':'Boiled'},
              {'value':'DRI','label':'Dried'},
              {'value':'FRE','label':'Fresh'},
              {'value':'FRO','label':'Frozen'},
              {'value':'SAL','label':'Salted'},
              {'value':'SMO','label':'Smoked'}
          ]
      }
    };

    const expectedResult = action.payload.data;

    expect(speciesStatesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should reduce initial state when get species states fails', () => {
    const initialState = [];
    const expectedResult = [];

    const action = {
        type : 'get_species_states_failed'
    };

    expect(speciesStatesReducer(initialState, action)).toEqual(expectedResult);
  });
});