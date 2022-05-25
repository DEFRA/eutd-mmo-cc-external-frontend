import userdetailsReducer from '../../../src/client/reducers/userdetails.reducer';

describe('User Details Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = { model: {}};
        const action = {
            type : ''
        };

        expect(userdetailsReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = { model: {}};
      const action = {
          type : ''
      };

      expect(userdetailsReducer(undefined, action)).toEqual(initialState);
  });

    it('should reduce to initial state when user details are requested', () => {
        const initialState = { model: {}};
        const action = {
            type : 'user-details/requested'
        };

        const expectedResult = {
            model: {
            },
            busy: true,
            error: undefined
        };

        expect(userdetailsReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce to initial state when user details fail', () => {
        const initialState = { model: {}};
        const action = {
            type  : 'user-details/failed',
            error : 'User details failed to load'
        };

        const expectedResult = {
            model: {
            },
            busy: false,
            error: 'User details failed to load'
        };

        expect(userdetailsReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce to initial state when user details are loaded', () => {
        const initialState = { model: {}};
        const action = {
            type  : 'user-details/loaded',
            userdetails : [
                {
                    sub: 1,
                    dynamicsContactId: 2,
                    firstName: 'Fishy',
                    lastName: 'McFishFace',
                    email: 'fishy.mcfishface@gmail.com',
                    telephoneNumber: '1234567',
                    mobileNumber: '1234567',
                    termsAcceptedVersion: 1,
                    termsAcceptedOn: '01-03-2019'
                }
            ]
        };

        const expectedResult = {
            model: [
                {
                    sub: 1,
                    dynamicsContactId: 2,
                    firstName: 'Fishy',
                    lastName: 'McFishFace',
                    email: 'fishy.mcfishface@gmail.com',
                    telephoneNumber: '1234567',
                    mobileNumber: '1234567',
                    termsAcceptedVersion: 1,
                    termsAcceptedOn: '01-03-2019'
                }
            ],
            busy: false,
            error: undefined
        };

        expect(userdetailsReducer(initialState, action)).toEqual(expectedResult);
    });
});