import exportReducer from '../../../src/client/reducers/exportCountry.reducer';

describe('exportReducer', () => {

  it('should reduce to initial state', () => {
    const state = null;
    const action = {type: ''};

    expect(exportReducer(state, action)).toEqual({});
  });

  it('should add export location to initial state', () => {
    const state = {};

    const payload = {
      exportedFrom: 'Jersey'
    };

    const action = {type: 'add_selected_export_country', payload: payload};

    expect(exportReducer(state, action)).toEqual({'exportedFrom': 'Jersey', loaded: true});
  });

  it('should get export country', () => {
    const state = {};
    const payload = {
      exportedFrom: 'Jersey'
    };

    const action = {type: 'get_export_country', payload: payload};
    expect(exportReducer(state, action)).toEqual({'exportedFrom': 'Jersey', loaded: true});
  });

  it('should reduce get export country to unauthorised', () => {
    const state = {
      'exportedFrom': 'United Kingdom'
    };

    const action = {type: 'get_export_country_unauthorised'};

    expect(exportReducer(state, action)).toEqual({
      'exportedFrom': 'United Kingdom',
      'unauthorised': true
    });
  });

  it('should reduce save export country to unauthorised', () => {
    const state = {
      'exportedFrom': 'United Kingdom'
    };

    const action = {type: 'save_export_country_unauthorised'};

    expect(exportReducer(state, action)).toEqual({
      'exportedFrom': 'United Kingdom',
      'unauthorised': true
    });
  });

  it('should clear export country', () => {
    const state = {
      'exportedFrom': 'United Kingdom'
    };

    const action = {type: 'clear_export_country'};

    expect(exportReducer(state, action)).toEqual({});
  });
});