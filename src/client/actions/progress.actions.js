import { isForbidden, isError, apiCallFailed, beginApiCall, showFullPageError, CLEAR_ERRORS } from '.';

export const GET_PROGRESS_UNAUTHORISED = 'get_progress_unauthorised';
export const GET_PROGRESS_SUCCESS = 'get_progress_success';
export const GET_PROGRESS_ERROR = 'get_progress_error';
export const CLEAR_PROGRESS_DATA = 'clear_progress_data';

export const getProgress =
  (documentNumber, journey) =>
  async (dispatch, _getState, { orchestrationApi }) =>
   await orchestrationApi
      .get(`/progress/${journey}`, {
        headers: {
          documentnumber: documentNumber,
        },
      })
      .then((res) => {
        const payload = res.data || { progress: null };

        dispatch({ type: GET_PROGRESS_SUCCESS, payload });
      },
      error => {
        if (isForbidden(error)) {
          dispatch(unauthorised());
        } else {
          dispatch(apiCallFailed(error.response));
          throw error;
        }
      }
      )
      .catch((e) => {
        dispatch(getProgressFailed(e));
        throw e;
      });


  function unauthorised() { return { type: GET_PROGRESS_UNAUTHORISED }; }
  function getProgressFailed(errorRes) { return { type: GET_PROGRESS_ERROR, errorRes }; }

  export const clearProgress = () => ({
    type: CLEAR_PROGRESS_DATA,
  });

  export const clearErrors = () => ({
    type: CLEAR_ERRORS,
  });

  export const checkProgress = (documentNumber, journey) => async (dispatch, getState, { orchestrationApi }) => {
    const config = {
      headers: {
        documentnumber: documentNumber,
      },
    };

    try {
      dispatch(beginApiCall());
      await orchestrationApi.get(`/progress/complete/${journey}`, config);
    } catch (e) {
      if (isForbidden(e)) {
        dispatch(unauthorised());
      } else if (isError(e)) {
        dispatch(showFullPageError());
      } else {
        dispatch(apiCallFailed(e.response));
      }
      throw e;
    }
  };