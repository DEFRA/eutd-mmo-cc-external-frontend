import { API_CALL_FAILED, CLEAR_ERRORS, dispatchClearErrors, isForbidden, isSilverLineError } from './index';

export const exportPayloadActionTypes = {
  PRODUCT_ADDED: 'export-certificate/export-payload/product-added',
  PRODUCT_REMOVED: 'export-certificate/export-payload/product-removed',
  PRODUCT_REMOVED_UNAUTHORISED: 'export-certificate/export-payload/product-update-unauthorised',
  PRODUCT_UPDATE_FAILED: 'export-certificate/export-payload/product-update-failed',
  LANDING_UPSERTED: 'export-certificate/export-payload/landing_upserted',
  LANDING_UPSERT_FAILED: 'export-certificate/export-payload/landing_upsert-failed',
  LANDING_UPSERT_UNAUTHORISED: 'export-certificate/export-payload/landing_upsert-unauthorised',
  LANDING_UPSERT_WAF_ERROR: 'export-certificate/export-payload/landing_upsert-waf-error',
  LANDING_UPDATED: 'export-certificate/export-payload/landing_updated',
  LANDING_UPDATE_UNAUTHORISED: 'export-certificate/export-payload/landing_updated_unauthorised',
  LANDING_UPDATE_FAILED: 'export-certificate/export-payload/landing_update-failed',
  LANDING_REMOVED: 'export-certificate/export-payload/landing_removed',
  LANDING_REMOVE_FAILED: 'export-certificate/export-payload/landing_remove-failed',
  LANDING_REMOVE_UNAUTHORISED: 'export-certificate/export-payload/landing_remove-unauthorised',
  EXPORT_PAYLOAD_REQUESTED: 'export-certificate/export-payload/requested',
  EXPORT_PAYLOAD_LOADED: 'export-certificate/export-payload/loaded',
  EXPORT_PAYLOAD_FAILED: 'export-certificate/export-payload/failed',
  EXPORT_PAYLOAD_UNAUTHORISED: 'export-certificate/export-payload/unauthorised',
  EXPORT_PAYLOAD_WAF_ERROR: 'export-certificate/export-payload/waf-error',
  EXPORT_PAYLOAD_VALIDATE_REQUESTED: 'export-certificate/export-payload/validate/requested',
  EXPORT_PAYLOAD_VALIDATE_SUCCESS: 'export-certificate/export-payload/validate/success',
  EXPORT_PAYLOAD_VALIDATE_FAILED: 'export-certificate/export-payload/validate/failed',
  EXPORT_CERT_CLEAR: 'export-certificate/export-payload/clear',
  EXPORT_CERT_CLEAR_ERRORS: 'export-certificate/export-payload/clear-errors',
  EXPORT_CERT_CREATE: 'export-certificate/create'
};

export const validateExportPayload = (currentUri, nextUri, isLandingsSavedAsDraft = false, documentNumber = undefined) => (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  return orchestrationApi.post('/export-certificates/export-payload/validate', { currentUri, nextUri }, config)
    .then(
      res => {
        let exportPayload = res.data;
        dispatch(success(exportPayload));
        dispatch(clearErrors());
      },
      error => {
        if (error.response.data) {
          if (error.response.data.errors && Object.keys(error.response.data.errors).length > 0) {
            dispatch(apiCallFailed(error.response.data.errors));
          } else if (error.response.data.error) {
            dispatch(failed([{
              targetName: 'validateExportPayload()',
              text: error.response.data.error
            }]));
          } else if (isSilverLineError(error)) {
            dispatch(wafError(error));
          } else {
            dispatch(failed([{
              targetName: 'validateExportPayload()',
              text: 'Failed to validate'
            }]));
          }
        } else if (isForbidden(error)) {
          dispatch(unauthorised());
        } else {
          dispatch(failed([{
            targetName: 'validateExportPayload()',
            text: error
          }]));
        }
        if (!isLandingsSavedAsDraft) throw Error(); // This is what prevents navigation to the next page
    });

  function success(exportPayload) { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_SUCCESS, exportPayload }; }
  function failed(errors) { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors }; }
  function unauthorised() { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_UNAUTHORISED};}
  function wafError(e) { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] }; }
  function clearErrors() { return { type: CLEAR_ERRORS }; }
};

export const addLanding = (productId) => (dispatch, getState) => {
  const exportPayload = getState().exportPayload;

  exportPayload.items.map(item => {
    if (item.product.id === productId) {
      item.landings.push({addMode: true, editMode: false, model: {}});
    }
  });

  return dispatch({ type: exportPayloadActionTypes.LANDING_UPDATED, exportPayload });
};

export const removeLanding = (productId, landingId, documentNumber = undefined) => (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  return orchestrationApi.delete(`/export-certificates/export-payload/product/${productId}/landing/${landingId}`, config)
    .then(
      res => {
        let exportPayload = res.data;
        dispatch(productLandingRemoved(exportPayload));
      },
      error => {
        if (isForbidden(error)) {
          dispatch(productLandingRemoveUnauthorised());
        } else {
          dispatch(productLandingRemoveFailed(error.toString()));
        }
      })
    .catch((err) => {
      dispatch(productLandingRemoveFailed(err));
      throw(err);
    });

  function productLandingRemoved(exportPayload) { return { type: exportPayloadActionTypes.LANDING_REMOVED, exportPayload }; }
  function productLandingRemoveFailed(errorRes) { return { type: exportPayloadActionTypes.LANDING_REMOVE_FAILED, errorRes }; }
  function productLandingRemoveUnauthorised() { return { type: exportPayloadActionTypes.LANDING_REMOVE_UNAUTHORISED};}
};

export const validateLanding = (productId, landing, documentNumber = undefined) => (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
      : {};

  return orchestrationApi.post('/export-certificates/landing/validate', {...landing, product: productId}, config)
    .then(
      res => {
        let exportPayload = res.data;
        dispatch(landingUpserted(exportPayload));
      },
      error => {
        if (isSilverLineError(error)) {
          dispatch(landingUpsertWafError(error));
        } else if (isForbidden(error)) {
          dispatch(landingUpsertUnauthorised());
        } else {
          dispatch(landingValidateFailed(error.response.data.errors));
          throw new Error('landingValidateFailed');
        }
      })
    .catch((err) => {
      dispatch(landingUpsertFailed(err));
      throw(err);
    });

  function landingValidateFailed(errors) { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED, errors }; }
  function landingUpserted(exportPayload) { return { type: exportPayloadActionTypes.LANDING_UPSERTED, exportPayload }; }
  function landingUpsertFailed(errorRes) { return { type: exportPayloadActionTypes.LANDING_UPSERT_FAILED, errorRes }; }
  function landingUpsertUnauthorised() { return { type: exportPayloadActionTypes.LANDING_UPSERT_UNAUTHORISED }; }
  function landingUpsertWafError(e) { return { type: exportPayloadActionTypes.LANDING_UPSERT_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] }; }
};

export const addProduct = (product, documentNumber = undefined) => (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  return orchestrationApi.post('/export-certificates/export-payload/product', product, config)
    .then(
      res => {
        let exportPayload = res.data;
        dispatch(productAdded(exportPayload));
      },
      error => {
        dispatch(productAddFailed(error.toString()));
      })
    .catch((err) => {
      dispatch(productAddFailed(err));
      throw(err);
    });

  function productAdded(exportPayload) { return { type: exportPayloadActionTypes.PRODUCT_ADDED, exportPayload }; }
  function productAddFailed(errorRes) { return { type: exportPayloadActionTypes.PRODUCT_UPDATE_FAILED, errorRes }; }
};

export const removeProduct = (productId, documentNumber) => (dispatch, getState, { orchestrationApi } ) => {
   const config = (documentNumber)
     ? {headers: {documentnumber: documentNumber}}
     : {};

  return orchestrationApi.delete(`/export-certificates/export-payload/product/${productId}`, config)
    .then(
      res => {
        let exportPayload = res.data;
        dispatch(productRemoved(exportPayload));
      },
      error => {
        if (isForbidden(error)) {
          dispatch(productUnauthorised());
        } else {
          dispatch(productRemoveFailed(error.toString()));
        }
      })
    .catch((err) => {
      dispatch(productRemoveFailed(err));
      throw(err);
    });

  function productRemoved(exportPayload) { return { type: exportPayloadActionTypes.PRODUCT_REMOVED, exportPayload }; }
  function productRemoveFailed(errorRes) { return { type: exportPayloadActionTypes.PRODUCT_UPDATE_FAILED, errorRes }; }
  function productUnauthorised() { return { type: exportPayloadActionTypes.PRODUCT_REMOVED_UNAUTHORISED };}
};

export const getExportPayload = (documentNumber = undefined) => (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
      : {};

  dispatch(dispatchClearErrors());
  dispatch(requested());
  return orchestrationApi.get('/export-certificates/export-payload', config)
    .then(
      res => {
        dispatch(success(res.data));
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

  function requested() { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED }; }
  function success(exportPayload) { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_LOADED, exportPayload }; }
  function failed(error) { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_FAILED, error }; }
  function unauthorised() { return { type: exportPayloadActionTypes.EXPORT_PAYLOAD_UNAUTHORISED}; }
};

export const clearExportPayload = () => ({ type: exportPayloadActionTypes.EXPORT_CERT_CLEAR });
export const clearErrorsExportPayload = () => ({ type: exportPayloadActionTypes.EXPORT_CERT_CLEAR_ERRORS });

export const apiCallFailed = (params) => {
  return {
    type: API_CALL_FAILED,
    payload: {
      data: { ...params }
    }
  };
};
