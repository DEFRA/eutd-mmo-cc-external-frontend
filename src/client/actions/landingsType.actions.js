import { apiCallFailed, beginApiCall } from '../actions';
export const landingsType = {
  LANDINGS_TYPE_CHANGE_UNAUTHORISED: 'landingsType/landings_type/unauthorised',
  LANDINGS_TYPE_CHANGE_FAILED: 'landingsType/landings_type/failed',
  LANDINGS_TYPE_CHANGE_CLEAR: 'landingsType/landings_type/clear',
  LANDINGS_TYPE_SAVE: 'landingsType/landings_type/save'
};
export const SAVE_CHANGED_LANDINGS_TYPE = 'save_changed_landings_type';
export const CLEAR_CHANGED_LANDINGS_TYPE= 'clear_changed_landings_type';

export const getLandingType = (documentNumber = undefined) => (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};
  return orchestrationApi.get('/export-certificates/landings-type', config)
    .then(
      res => {
        dispatch({ type: landingsType.LANDINGS_TYPE_SAVE, payload: res.data });
      },
      error => {
        if (error.response.status === 403) {
          dispatch(unauthorised());
        } else {
          dispatch(apiCallFailed(error.response));
          throw error;
        }
      })
    .catch((err) => {
      dispatch(getLandingTypeFailed(err));
      throw err;
    });

  function unauthorised() { return { type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED }; }
  function getLandingTypeFailed(errorRes) { return { type: landingsType.LANDINGS_TYPE_CHANGE_FAILED, errorRes }; }
};

export const confirmChangeLandingsType = (landingsEntryConfirmationData, journey, path, documentNumber = undefined) => (dispatch, getState, { orchestrationApi }) => {
  const config = documentNumber ? { headers: { documentnumber: documentNumber } } : {};
  dispatch(beginApiCall());
  return orchestrationApi.post('/export-certificates/confirm-change-landings-type', { ...landingsEntryConfirmationData, journey, currentUri: path }, config)
    .then(
      res => {
        dispatch(success(res.data));
      },
      error => {
        if (error.response.status === 403) {
          dispatch(unauthorised());
        }
        else {
          dispatch(apiCallFailed(error.response));
          throw (new Error('confirm-change-landings-type error'));
        }
      })
    .catch((err) => {
      dispatch(failed(err));
      throw (err);
    });
  function success(data) { return { type: landingsType.LANDINGS_TYPE_SAVE, payload: data }; }
  function failed(error) { return { type: landingsType.LANDINGS_TYPE_CHANGE_FAILED, error }; }
  function unauthorised() { return { type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED }; }
};

export const validateLandingType = (landingsEntryOption, documentNumber = undefined) => (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};
  dispatch(beginApiCall());
  return orchestrationApi.post('/export-certificates/landings-type', { landingsEntryOption }, config)
    .then(
      res => {
        dispatch(success(res.data));
      },
      error => {
        if (error.response.status === 403) {
          dispatch(unauthorised());
        }
        else {
          dispatch(apiCallFailed(error.response));
          throw (new Error('validate-landings-type error'));
        }
      })
    .catch((err) => {
      dispatch(apiCallFailed(err.response));
      throw (new Error('validate-landings-type error'));
    });
  function success(data) { return { type: landingsType.LANDINGS_TYPE_SAVE, payload: data }; }
  function unauthorised() { return { type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED }; }
};
export const clearLandingsType = () => ({ type: landingsType.LANDINGS_TYPE_CHANGE_CLEAR });
export const onLoadComponentRedirect = () => (dispatch) => dispatch({ type: landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED });
export const saveLandingsEntryType = (landingsEntryOption) => (dispatch) => dispatch({ type: landingsType.LANDINGS_TYPE_SAVE, payload: { landingsEntryOption } });

export const dispatchSaveChangedLandingsType = (data) => (dispatch) => {
  return dispatch({type: SAVE_CHANGED_LANDINGS_TYPE, payload: data});
};

export const clearChangedLandingsType = () => ({ type: CLEAR_CHANGED_LANDINGS_TYPE });