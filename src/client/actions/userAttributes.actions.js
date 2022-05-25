import { beginApiCall, apiCallFailed } from './index';

// actions
export const UPDATED_USER_ATTRIBUTES                = 'UPDATED_USER_ATTRIBUTES';
export const GOT_ALL_USER_ATTRIBUTES                = 'GOT_ALL_USER_ATTRIBUTES';
export const UPDATE_USER_ATTRIBUTES_FAILED          = 'UPDATE_USER_ATTRIBUTES_FAILED';

// action creators
export const saveUserAttribute = (payload) => async (dispatch, getState, { orchestrationApi }) => {
  try {
    const res = await orchestrationApi.post('/userAttributes', payload);
    return dispatch({ type: UPDATED_USER_ATTRIBUTES, payload: res.data });

  } catch(e) {
    console.error(e);
    return dispatch(apiCallFailed(e.response));
  }
};

export const getAllUserAttributes = () => async (dispatch, getState, { orchestrationApi }) => {
  try {
    dispatch(beginApiCall());
    const res = await orchestrationApi.get('/userAttributes');
    return dispatch({ type: GOT_ALL_USER_ATTRIBUTES, payload: res.data });
  } catch(e) {
    console.error(e);
    return dispatch(apiCallFailed(e.response));
  }

};