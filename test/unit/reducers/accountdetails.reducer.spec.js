import accountdetailsReducer from '../../../src/client/reducers/accountdetails.reducer';

describe('Account Details Reducer', () => {

    it('should reduce to initial state', () => {

      const initialState = {
          model: {
          }
      };

      const action = {
          type: ''
      };

      expect(accountdetailsReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined state', () => {

      const initialState = {
          model: {
          }
      };

      const action = {
          type: ''
      };

      expect(accountdetailsReducer(undefined, action)).toEqual(initialState);
    });


    it('should update state when account details are requested', () => {
        const initialState = {
            model: {
            }
        };

        const payload = {
            data : {
            }
        };

        const action = {type: 'account-details/requested', payload: payload};

        const expectedAction = {
            model : {},
            busy  : true
        };

        expect(accountdetailsReducer(initialState, action)).toEqual(expectedAction);
    });

    it('should update state when an account details are returned', () => {
        const initialState = {
            model: {},
            busy  : true
        };

        const action = {
            type     : 'account-details/loaded',
            accounts : [
                         {
                            accountId: '123456',
                            name: 'One Pound Fish',
                            email: 'onepound.fish@gmail.com'
                        }
            ]
        };

        const expectedAction = {
            model : [{accountId:'123456',name:'One Pound Fish',email:'onepound.fish@gmail.com'}],
            busy  : false,
            error : undefined
        };

        expect(accountdetailsReducer(initialState, action)).toEqual(expectedAction);
    });

    it('should update state when an account details request has failed', () => {
        const initialState = {
            model: {},
            busy  : true
        };

        const action = {
            type  : 'account-details/failed',
            error : 'The API call failed'
        };

        const expectedAction = {
            model : {},
            busy  : false,
            error : 'The API call failed'
        };

        expect(accountdetailsReducer(initialState, action)).toEqual(expectedAction);
    });

});