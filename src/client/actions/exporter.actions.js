
import {
  isError,
  isForbidden,
  showFullPageError,
  apiCallFailed,
  dispatchClearErrors,
  isSilverLineError,
} from './index';

export const exporterActionTypes = {
  EXPORTER_REQUESTED: 'export-certificate/exporter-requested',
  EXPORTER_LOADED: 'export-certificate/exporter-loaded',
  EXPORTER_FAILED: 'export-certificate/exporter-failed',
  EXPORTER_CHANGED: 'export-certificate/exporter-changed',
  EXPORTER_SAVED: 'export-certificate/exporter-saved',
  EXPORTER_INVALID: 'export-certificate/exporter-invalid',
  EXPORTER_UNAUTHORISED: 'export-certificate/exporter-unauthorised',
  EXPORTER_CHANGE_ADDRESS: 'export-certificate/exporter-change-address',
  EXPORTER_CLEAR_CHANGE_ADDRESS: 'export-certificate/exporter-clear-change-address',
  EXPORTER_CLEAR_UNAUTHORISED: 'export-certificate/exporter-clear-unauthorised',
  EXPORTER_ADDRESS_LOOKUP_SAVED: 'export-certificate/exporter-address-lookup-saved',
  EXPORTER_CLEAR_ERRORS: 'export-certificate/exporter-clear-errors',
  EXPORTER_WAF_ERROR: 'export-certificate/waf-error'
};

export const changeAddressExporter = () => (dispatch) =>
  dispatch({type: exporterActionTypes.EXPORTER_CHANGE_ADDRESS});

export const clearChangeAddressExporter = () => (dispatch) =>
  dispatch({type: exporterActionTypes.EXPORTER_CLEAR_CHANGE_ADDRESS});

export const clearUnauthorisedExporter = () => (dispatch) =>
  dispatch({type: exporterActionTypes.EXPORTER_CLEAR_UNAUTHORISED});

export const saveExporter = (data) => (dispatch) => {
  dispatch({type: exporterActionTypes.EXPORTER_CHANGED, exporter: data});
};
export const clearErrors = () => (dispatch) =>  dispatch(dispatch({type: exporterActionTypes.EXPORTER_CLEAR_ERRORS}));

export const saveManuallyAddedAddress = (state, documentNumber) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};

  try {
    return await orchestrationApi.post('/exporter-validate', state, config)
      .then(res => {
        dispatch({type: exporterActionTypes.EXPORTER_ADDRESS_LOOKUP_SAVED, exporter: res.data});
        dispatch(dispatchClearErrors());
        return res.data;
      });
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type: exporterActionTypes.EXPORTER_UNAUTHORISED });
      throw new Error(`An error has occurred ${e.response.status} (${e.response.statusText})`);
    } else {
      dispatch(apiCallFailed(e.response));
    }
  }
};

export const getExporterFromMongo = (journey, documentNumber = undefined) => (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  return orchestrationApi.get(`/exporter/${journey}`, config)
    .then(
      res => {
        let exporter = res.data;
        exporter.error = '';
        exporter.errors = {};
        if(exporter.model !== undefined) {
          exporter.model.preLoadedName = true;
          exporter.model.preLoadedAddress = true;
          exporter.model.preLoadedCompanyName = true;
        }
        dispatch(success(exporter));
      },
      error => {
        if (isForbidden(error)) {
          dispatch(unauthorised());
        }
        else {
          dispatch(failed(error.toString()));
        }
      })
    .catch((err) => {
      dispatch(failed(err));
      throw(err);
    });

  function success(exporter) { return { type: exporterActionTypes.EXPORTER_LOADED, exporter }; }
  function failed(error) { return { type: exporterActionTypes.EXPORTER_FAILED, error }; }
  function unauthorised() { return { type: exporterActionTypes.EXPORTER_UNAUTHORISED }; }
};

export const saveExporterToMongo = (data, journey, currentUri, nextUri, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    const res = await orchestrationApi.post(`/exporter/${journey}`, {...data, journey, currentUri, nextUri}, config);
    dispatch(success(res.data));
  }
  catch(errorRes) {
    if (isSilverLineError(errorRes)) {
      dispatch(wafError(errorRes));
    } else if (isForbidden(errorRes)) {
      dispatch(unauthorised());
    } else if (errorRes.response.data) {
      dispatch(invalid(errorRes.response.data));
    } else {
      dispatch(failed(errorRes));
    }
    if (!data.isExporterDetailsSavedAsDraft) throw Error();
  }

  function success(exporter) { return { type: exporterActionTypes.EXPORTER_SAVED, exporter }; }
  function failed(error) { return { type: exporterActionTypes.EXPORTER_FAILED, error }; }
  function invalid(exporter) { return { type: exporterActionTypes.EXPORTER_INVALID, exporter, journey }; }
  function unauthorised() { return { type: exporterActionTypes.EXPORTER_UNAUTHORISED }; }
  function wafError(e) { return { type: exporterActionTypes.EXPORTER_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] }; }
};

export const exporterActions = {
  getExporterFromMongo,
  saveExporterToMongo,
  saveExporter,
  saveManuallyAddedAddress
};