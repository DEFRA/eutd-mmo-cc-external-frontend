// actions
import {isError, showFullPageError} from './index';

export const GOT_ALL_DOCUMENTS          = 'GOT_ALL_DOCUMENTS';
export const GET_ALL_DOCUMENTS_FAILED   = 'GET_ALL_DOCUMENTS_FAILED';
export const GET_COMPLETED_DOCUMENT = 'GET_COMPLETED_DOCUMENT';
export const GET_PENDING_DOCUMENT = 'GET_PENDING_DOCUMENT';


// action creators
export const getAllDocuments = (type, month, year) => async (dispatch, getState, { orchestrationApi }) => {
  try {
    const res = await orchestrationApi.get(`/documents/${year}/${month}?type=${type}`);
    return dispatch({ type: GOT_ALL_DOCUMENTS, payload: res.data });

  } catch(e) {
    if( isError(e) ) dispatch(showFullPageError());
    //throw new Error(e.response);
  }
};

export const getCompletedDocument = (documentNumber) => async (dispatch, getState, { orchestrationApi }) => {
  try {
    const res = await orchestrationApi.get(`/document/${documentNumber}`);
    if (res.data && res.data.documentStatus === 'COMPLETE') {
      return dispatch({ type: GET_COMPLETED_DOCUMENT, payload: res.data });
    }
    return dispatch({ type: GET_COMPLETED_DOCUMENT, payload: null });
  }
  catch (e) {
    return dispatch({ type: GET_COMPLETED_DOCUMENT, payload: null });
  }
};

export const getPendingDocument = (documentNumber) => async (dispatch, getState, { orchestrationApi }) => {
  try {
    const res = await orchestrationApi.get(`/document/${documentNumber}`);
    if (res.data && res.data.documentStatus === 'PENDING') {
      return dispatch({ type: GET_PENDING_DOCUMENT, payload: res.data });
    }
    return dispatch({ type: GET_PENDING_DOCUMENT, payload: null });
  }
  catch (e) {
    return dispatch({ type: GET_PENDING_DOCUMENT, payload: null });
  }
};