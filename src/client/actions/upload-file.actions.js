import { isError, showFullPageError, beginApiCall, apiCallFailed, isForbidden, dispatchClearErrors } from './index';

export const UPLOAD_LANDING_ROWS = 'upload_landing_rows';
export const SAVE_LANDING_ROWS = 'save_landing_rows';
export const CLEAR_LANDING_ROWS = 'clear_landings_rows';
export const UNAUTHORISED_LANDING_ROWS = 'unauthorised_landing_rows';

export const clearLandings = () => (dispatch) => {
  dispatch(dispatchClearErrors());
  dispatch({ type: CLEAR_LANDING_ROWS });
};

export const uploadLandingsFile =
  (file, documentNumber) =>
  async (dispatch, getState, { orchestrationApi }) => {
    const config = {
      headers: {
        documentnumber: documentNumber
      },
    };

    const data = new FormData();
    data.append('file', file);

    try {
      dispatch(beginApiCall());
      const res = await orchestrationApi.post('/uploads/landings', data, config);
      const landingsRows = res.data;
      dispatch({ type: UPLOAD_LANDING_ROWS, payload: landingsRows });
    } catch (e) {
      dispatch({ type: CLEAR_LANDING_ROWS });
      failure(e, dispatch);
    }
  };

export const saveLandings =
  (data, documentNumber) =>
  async (dispatch, getState, { orchestrationApi }) => {
    const config = {
      headers: {
        documentnumber: documentNumber,
      },
    };

    try {
      dispatch(beginApiCall());
      const res = await orchestrationApi.post('/save/landings', data, config);
      const landingsRows = res.data;
      dispatch({ type: SAVE_LANDING_ROWS, payload: landingsRows });
    } catch (e) {
      failure(e, dispatch);
    }
  };

const failure = (e, dispatch) => {
  if (isForbidden(e)) {
    dispatch({ type: UNAUTHORISED_LANDING_ROWS });
    throw new Error(`unauthorised access ${e.response.status}`);
  } else {
    if (isError(e)) {
      dispatch(showFullPageError());
    } else {
      dispatch(apiCallFailed(e.response));
    }

    throw new Error(`An error has occurred ${e.response.status} (${e.response.statusText})`);
  }
};
