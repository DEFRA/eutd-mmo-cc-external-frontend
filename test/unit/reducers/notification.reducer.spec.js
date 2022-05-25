import notificationReducer from '../../../src/client/reducers/notification.reducer';

describe('Notification Reducer', () => {

  it('should reduce to initial state', () => {
    const initialState = {};
    const action = {
        type: ''
    };

    expect(notificationReducer(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state with an authorised undefined', () => {
    const initialState = {};
    const action = {
        type: ''
    };

    expect(notificationReducer(undefined, action)).toEqual(initialState);
  });

  it('should add notification to state', () => {
    const initialState = {};
    const action = {
        type: 'GET_NOTIFICATION',
        payload : {
          title : 'this is a title',
          message : 'this is a message'
        }
    };

    const expectedResult = action.payload;
    expect(notificationReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should reduce notification to unauthorised', () => {
    const initialState = {};
    const action = { type: 'GET_NOTIFICATION_UNAUTHORISED' };

    expect(notificationReducer(initialState, action)).toEqual({ unauthorised: true });
  });

  it('should reduce notification to empty', () => {
    const initialState = {
      title : 'this is a title',
      message : 'this is a message'
    };
    const action = { type: 'CLEAR_NOTIFICATION' };

    expect(notificationReducer(initialState, action)).toEqual({});
  });


});