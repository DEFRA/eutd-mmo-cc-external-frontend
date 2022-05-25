import transportDetailsErrorsReducer from '../../../src/client/reducers/transportDetailsErrorsReducer';

describe('transportDetailsErrorsReducer', () => {

    it('should reduce to initial state', () => {
      const initialState = [];
      const action = {type: ''};

      expect(transportDetailsErrorsReducer(initialState, action)).toEqual([]);
    });

    it('should reduce to initial state with an authorised', () => {
      const action = {type: ''};

      expect(transportDetailsErrorsReducer(undefined, action)).toEqual({});
    });

    it('should add get transport errors to initial state', () => {
        const initialState = [];

        const payload = {
          data : 'No transport details found'
        };

        const action = {type: 'add_transport_details_failed', payload: payload};

        expect(transportDetailsErrorsReducer(initialState, action)).toEqual({'No transport details found': true});
    });
});