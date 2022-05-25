import { isError, showFullPageError } from './index';

export const GET_SUMMARY_DOCUMENT = 'GET_SUMMARY_DOCUMENT';
export const SHOW_SUMMARY_DOCUMENT_ERRORS = 'SHOW_SUMMARY_DOCUMENT_ERRORS';
export const GET_SUMMARY_UNAUTHORISED = 'GET_SUMMARY_DOCUMENT_UNAUTHORISED';

export function showSummaryCertificateErrors(data) {
  return { type: SHOW_SUMMARY_DOCUMENT_ERRORS, payload: { validationErrors: data } };
}

export const getSummaryCertificate = (journey, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};

  await orchestrationApi.get(`/certificate/${journey}`, config)
    .then(
      res => {
        dispatch({ type: GET_SUMMARY_DOCUMENT, payload: res.data });
      },
      error => {
        if (isError(error)) {
          dispatch(showFullPageError());
        } else {
          dispatch(unauthorised());
        }
      });

    function unauthorised() { return { type: GET_SUMMARY_UNAUTHORISED }; }
};