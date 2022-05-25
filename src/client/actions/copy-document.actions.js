import { showFullPageError, apiCallFailed, isError, CLEAR_ERRORS } from './index';
export const CONFIRM_COPY_DOCUMENT            = 'confirm_copy_document';
export const UNAUTHORISED_COPY_DOCUMENT       = 'unauthorised_copy_document';
export const CLEAR_COPY_DOCUMENT              = 'clear_copy_document';
export const REMOVE_CONFIRM_COPY_CERTIFICATE  = 'remove_confirm_copy_certificate';
export const ADD_ERROR_COPY_CERTIFICATE       = 'add_error_copy_certificate';
export const REMOVE_ERROR_COPY_CERTIFICATE    = 'remove_error_copy_certificate';

export const submitCopyCertificate = (payload) => async (dispatch, _getState, {orchestrationApi}) => {
  const {documentNumber, copyDocumentAcknowledged, voidOriginal, excludeLandings, journey} = payload;
  const config = {headers: {documentnumber: documentNumber}};

  try {
    let ipAddress;
    if (voidOriginal) {
      const ip = await orchestrationApi.get('/client-ip');
      ipAddress = ip.data;
    }

    return await orchestrationApi.post('/confirm-copy-certificate', { copyDocumentAcknowledged, voidOriginal, excludeLandings, journey, ipAddress }, config)
    .then(res => {
      dispatch({ type: CONFIRM_COPY_DOCUMENT, payload: {
        documentNumber: res.data.documentNumber,
        copyDocumentAcknowledged: res.data.copyDocumentAcknowledged,
        voidDocumentConfirm: res.data.voidOriginal
      }});
      return res.data.newDocumentNumber;
    });
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (e.response && e.response.status === 403) {
      dispatch({ type: UNAUTHORISED_COPY_DOCUMENT }); return;
    } else {
      dispatch(apiCallFailed(e.response));
    }
  }
};

export const checkCopyCertificate = (documentNumber) => async (dispatch, _getState, {orchestrationApi}) => {
  const config = {
    headers: {
      documentnumber: documentNumber
    }
  };

  try {
    const res = await orchestrationApi.get('/check-copy-certificate', config);
    const { canCopy } = res.data;
    if (!canCopy) {
      dispatch(unauthorised());
    }
  } catch(e) {
    if (isError(e)) dispatch(showFullPageError());
    if (e.response && e.response.status === 403) {
      dispatch(unauthorised());
      throw new Error(`Unauthorised access ${e.response.status}`);
    } else {
      dispatch(apiCallFailed(e.response));
      throw new Error(`An error has occurred ${e.response.status} (${e.response.statusText})`);
    }
  }

  function unauthorised() { return { type: UNAUTHORISED_COPY_DOCUMENT }; }
};

export const addCopyDocument = (data) => (dispatch) => dispatch({ type: CONFIRM_COPY_DOCUMENT, payload: data });
export const clearErrors = () => (dispatch) =>  dispatch({ type: CLEAR_ERRORS });
export const clearCopyDocument = () => (dispatch) => dispatch({ type: CLEAR_COPY_DOCUMENT });
export const unauthorisedCopyDocument = () => (dispatch) => dispatch({ type: UNAUTHORISED_COPY_DOCUMENT });