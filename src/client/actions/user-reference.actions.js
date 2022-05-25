import { isError, showFullPageError, beginApiCall, isForbidden, isSilverLineError } from './index';

export const SAVE_USER_REFERENCE            = 'save_user_reference';
export const FAILED_USER_REFERENCE          = 'failed_user_reference';
export const UNAUTHORISED_USER_REFERENCE    = 'unauthorised_user_reference';
export const CLEAR_USER_REFERENCE           = 'clear_user_reference';
export const WAF_ERROR_USER_REFERENCE       = 'waf_error_user_reference';

export const getUserReference =
  (documentNumber) =>
  async (dispatch, getState, { orchestrationApi }) => {
    const config = {
      headers: {
        documentnumber: documentNumber,
      },
    };

    try {
      dispatch(beginApiCall());
      const res = await orchestrationApi.get('/userReference', config);
      success(dispatch, res);
    } catch (e) {
      failure(e, dispatch);
    }
  };

export const saveUserReference =
  (data, documentNumber) =>
  async (dispatch, getState, { orchestrationApi }) => {
    const config = {
      headers: {
        documentnumber: documentNumber,
      },
    };

    try {
      dispatch(beginApiCall());
      const res = await orchestrationApi.post('/userReference', data, config);
      success(dispatch, res);
    } catch (e) {
      failure(e, dispatch);
    }
  };

export const clearUserReference = () => (dispatch) => dispatch({ type: CLEAR_USER_REFERENCE });
const success = (dispatch, res = {}) => {
  const reference = {
    userReference: res.data,
  };

  dispatch({ type: SAVE_USER_REFERENCE, payload: reference });
};

const failure = (e, dispatch) => {
  if (isSilverLineError(e)) {
    dispatch({ type: WAF_ERROR_USER_REFERENCE, supportID: e.response.data.match(/\d+/)[0] });
    throw new Error(`unauthorised access ${e.response.status}`);
  } else if (isForbidden(e)) {
    dispatch({ type: UNAUTHORISED_USER_REFERENCE });
    throw new Error(`unauthorised access ${e.response.status}`);
  } else if (isError(e)) {
    dispatch(showFullPageError());
  } else {
    dispatch({ type: FAILED_USER_REFERENCE, error: e.response.data});
    throw new Error(
      `An error has occurred ${e.response.status} (${e.response.statusText})`
    );
  }
};
