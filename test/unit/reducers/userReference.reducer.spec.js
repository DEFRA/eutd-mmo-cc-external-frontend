import userReferenceReducer from '../../../src/client/reducers/userReference.reducer';

describe('User Reference Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {};
        const action = {
            type : ''
        };

        expect(userReferenceReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = {};
      const action = {
          type : ''
      };

      expect(userReferenceReducer(undefined, action)).toEqual(initialState);
  });

    it('should save user reference to state', () => {
        const initialState = {};
        const action = {
          payload: { userReference: 'My Reference' },
          type: 'save_user_reference'
        };

        const expectedResult = {
          userReference: 'My Reference',
          error: undefined
        };

        expect(userReferenceReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update user reference to state', () => {
      const initialState = {
        userReference: 'My Reference'
      };
      const action = {
        payload: { userReference: 'My New Reference' },
        type : 'save_user_reference'
      };

      const expectedResult = {
        userReference: 'My New Reference',
        error: undefined
      };

      expect(userReferenceReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update failed user reference action to state', () => {
      const initialState = {
        userReference: 'My Reference'
      };
      const action = {
        error: { status: 500 },
        type : 'failed_user_reference'
      };

      const expectedResult = {
        userReference: 'My Reference',
        error: { status: 500 }
      };

      expect(userReferenceReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update unauthorised user reference action to state', () => {
      const initialState = {
        userReference: 'My Reference'
      };
      const action = {
        error: { status: 500 },
        type : 'unauthorised_user_reference'
      };

      const expectedResult = {
        userReference: 'My Reference',
        unauthorised: true
      };

      expect(userReferenceReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update support ID and unauthorised user reference to state', () => {
      const initialState = {
        userReference: 'My Reference'
      };
      const action = {
        error: { status: 403 },
        type : 'waf_error_user_reference',
        supportID: '1234567'
      };

      const expectedResult = {
        userReference: 'My Reference',
        unauthorised: true,
        supportID: '1234567'
      };

      expect(userReferenceReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update clear user reference action to state', () => {
      const initialState = {
        userReference: 'My Reference',
        unauthorised: true,
        supportID:'1234567'
      };
      const action = {
        type : 'clear_user_reference'
      };

      const expectedResult = {
        supportID: '1234567'
      };

      expect(userReferenceReducer(initialState, action)).toEqual(expectedResult);
    });
});