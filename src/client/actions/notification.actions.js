import { isError } from './index';

export const notificationActionTypes = {
  GET_NOTIFICATION              : 'GET_NOTIFICATION',
  GET_NOTIFICATION_UNAUTHORISED : 'GET_NOTIFICATION_UNAUTHORISED',
  CLEAR_NOTIFICATION            : 'CLEAR_NOTIFICATION'
};

export const getNotification = () => async (dispatch, getState, { orchestrationApi }) => {
  try {
    const res = await orchestrationApi.get('/notification');
    dispatch({ type: notificationActionTypes.GET_NOTIFICATION, payload: res.data } );
  } catch (e) {
    if (isError(e)) {
      dispatch({ type: notificationActionTypes.CLEAR_NOTIFICATION });
      throw new Error(e.response);
    } else if (e.response && e.response.status === 403) {
      dispatch({ type: notificationActionTypes.GET_NOTIFICATION_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response.status}`);
    }
  }
};

export const clearNotification = () => (dispatch) => dispatch({ type: notificationActionTypes.CLEAR_NOTIFICATION });