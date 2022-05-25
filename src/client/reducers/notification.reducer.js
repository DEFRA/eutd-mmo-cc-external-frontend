import { notificationActionTypes } from '../actions/notification.actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case notificationActionTypes.GET_NOTIFICATION:
      return { ...state, ...action.payload };
    case notificationActionTypes.GET_NOTIFICATION_UNAUTHORISED:
      return { ...state, unauthorised: true };
    case notificationActionTypes.CLEAR_NOTIFICATION:
      return {};
    default:
      return state;
  }
};
