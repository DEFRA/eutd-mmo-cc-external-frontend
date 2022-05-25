import changedLandingsTypeReducer from '../../../src/client/reducers/changedLandingsTypeReducer';

describe('Landings Type', () => {

  it('should reduce to initial state', () => {
    const initialState = '';
    const action = {
      type: ''
    };

    expect(changedLandingsTypeReducer(initialState, action)).toEqual(initialState);
  });

  it('should reduce a success state when saving', () => {
    const initialState = '';
    const action = {
      type: 'save_changed_landings_type',
      payload: 'directLanding'
    };

    const expected = 'directLanding';

    expect(changedLandingsTypeReducer(initialState, action)).toEqual(expected);
  });

  it('should reduce an clear state', () => {
    const initialState = 'uploadEntry';
    const action = {
      type: 'clear_changed_landings_type'
    };

    const expected = '';

    expect(changedLandingsTypeReducer(initialState, action)).toEqual(expected);
  });

});