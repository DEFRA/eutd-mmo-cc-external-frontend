import userAttributesReducer from '../../../src/client/reducers/userAttributes.reducer';

describe('User Attributes Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = [];
        const action = {
            type : ''
        };

        expect(userAttributesReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = [];
      const action = {
          type : ''
      };

      expect(userAttributesReducer(undefined, action)).toEqual(initialState);
  });

    it('should reduce initial state when user attributes are updated', () => {
        const initialState = [];

        const payloadData = [
            {
                name: 'Attribute 1',
                value: 'Value 1',
                modifiedAt: '01-03-2019'
            },
            {
                name: 'Attribute 2',
                value: 'Value 2',
                modifiedAt: '01-03-2019'
            }
        ];


        const action = {
            type : 'UPDATED_USER_ATTRIBUTES',
            payload : payloadData
        };

        const expectedResult = payloadData;

        expect(userAttributesReducer(initialState, action)).toEqual(expectedResult);
    });


    it('should reduce initial state when all user attributes are fetched', () => {
        const initialState = [];

        const payloadData = [
            {
                name: 'Attribute 1',
                value: 'Value 1',
                modifiedAt: '01-03-2019'
            },
            {
                name: 'Attribute 2',
                value: 'Value 2',
                modifiedAt: '01-03-2019'
            }
        ];


        const action = {
            type : 'GOT_ALL_USER_ATTRIBUTES',
            payload : payloadData
        };

        const expectedResult = payloadData;

        expect(userAttributesReducer(initialState, action)).toEqual(expectedResult);
    });
});