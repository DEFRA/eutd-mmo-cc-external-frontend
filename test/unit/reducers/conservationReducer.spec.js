import conservationReducer from '../../../src/client/reducers/conservationReducer';

describe('conservationReducer', () => {

  it('should reduce to initial state', () => {
    const initialState = {};
    const action = {type: ''};

    expect(conservationReducer(initialState, action)).toEqual({});
  });

  it('should reduce to initial state with an undefined state', () => {
    const initialState = undefined;
    const action = {type: ''};

    expect(conservationReducer(initialState, action)).toEqual({});
  });

  it('should add conservation to initial state', () => {
    const initialState = [];

    const payload = {
      data : {
        conservationReference: 'Common fisheries policy'
      }
    };

    const action = {type: 'add_conservation', payload: payload};

    expect(conservationReducer(initialState, action)).toEqual({'conservationReference': 'Common fisheries policy'});
  });

  it('should clear conservation to initial state', () => {
    const initialState = [];
    const action = {type: 'clear_conservation'};
    expect(conservationReducer(initialState, action)).toEqual({});
  });

  it('should clear conservation state and keep supportID if it exists', () => {
    const state = { supportID: '123456', conservationReference: 'Common fisheries policy' };
    const action = {type: 'clear_conservation'};
    expect(conservationReducer(state, action)).toEqual({ supportID: '123456' });
  });

  it('should reduce to unauthorised state', () => {
    const initialState = {};
    const action = {type: 'add_conservation_unauthorised'};

    expect(conservationReducer(initialState, action)).toEqual({ unauthorised: true });
  });

  it('should reduce to unauthorised state and reset supportID if it existed before', () => {
    const initialState = { supportID: '12345'};
    const action = {type: 'add_conservation_unauthorised'};

    expect(conservationReducer(initialState, action)).toEqual({ unauthorised: true });
  });

  it('should reduce to unauthorised state and set supportID if it is a waf error', () => {
    const initialState = {};
    const action = {type: 'add_conservation_waf_error', supportID: '12345'};

    expect(conservationReducer(initialState, action)).toEqual({ unauthorised: true, supportID: '12345' });
  });

});