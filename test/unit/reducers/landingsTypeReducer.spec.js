import landingsTypeReducer from '../../../src/client/reducers/landingsTypeReducer';

describe('Landings Type', () => {

  it('should reduce to initial state', () => {
    const initialState = {};
    const action = {
      type: ''
    };

    expect(landingsTypeReducer(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state when undefined', () => {
    const initialState = {};
    const action = {
      type: ''
    };

    expect(landingsTypeReducer(undefined, action)).toEqual(initialState);
  });

  it('should reduce a success state', () => {
    const initialState = {};
    const action = {
      type: 'landingsType/landings_type/save',
      payload: { landingsEntryOption: 'directLanding', generatedByContent: false }
    };

    const expected = { landingsEntryOption: 'directLanding', generatedByContent: false };

    expect(landingsTypeReducer(initialState, action)).toEqual(expected);
  });
  it('should reduce a success state when saving', () => {
    const initialState = {};
    const action = {
      type: 'landingsType/landings_type/save',
      payload: { landingsEntryOption: 'directLanding', generatedByContent: false }
    };

    const expected = { landingsEntryOption: 'directLanding', generatedByContent: false };

    expect(landingsTypeReducer(initialState, action)).toEqual(expected);
  });

  it('should reduce an error state', () => {
    const initialState = {};
    const action = {
      type: 'landingsType/landings_type/failed',
      error: [{ confirmLandingsTypeChange: 'some-error' }]
    };

    const expected = { errors: [{ confirmLandingsTypeChange: 'some-error' }] };

    expect(landingsTypeReducer(initialState, action)).toEqual(expected);
  });

  it('should reduce an unauthorised state', () => {
    const initialState = {};
    const action = {
      type: 'landingsType/landings_type/unauthorised'
    };

    const expected = { unauthorised: true };

    expect(landingsTypeReducer(initialState, action)).toEqual(expected);
  });

  it('should reduce an clear state', () => {
    const initialState = {
      errors: [{ confirmLandingsTypeChange: 'some-error' }],
      unauthorised: true,
      landingsEntryOption: 'directLanding'
    };
    const action = {
      type: 'landingsType/landings_type/clear'
    };

    const expected = {};

    expect(landingsTypeReducer(initialState, action)).toEqual(expected);
  });

});