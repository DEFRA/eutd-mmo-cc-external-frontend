import { showSummaryCertificateErrors } from './certificate.actions';

export const exportCertificateActionTypes = {
  EXPORT_CERT_CREATE_REQUEST: 'export-certificate/create',
  EXPORT_CERT_CREATE_REQUEST_SUCCESS: 'export-certificate/create/success',
  EXPORT_CERT_CREATE_REQUEST_FAILED: 'export-certificate/create/failed'
};

export const createExportCertificate = (currentUri, journey, noOfVessels, documentNumber) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentNumber: documentNumber}}
    : {};

  const { data } = await orchestrationApi.get('/client-ip');

  return await orchestrationApi.post('/export-certificates/create', { journey, data },config)
    .then(
      res => {
        let certDetails = res.data;
        if (certDetails.status && certDetails.status === 'invalid catch certificate') {
          return 'ERROR';
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'completedCatchCertificate',
          'numberOfVessels': noOfVessels
        });
        return dispatch(exportCertificateCreated(certDetails));
      },
      error => {
        dispatch(exportCertificateCreateFailed(error.toString()));
        if(error.response && error.response.data) {
          return dispatch(showSummaryCertificateErrors(error.response.data));
        }
      })
    .catch((err) => {
      dispatch(exportCertificateCreateFailed(err));
      throw(err);
    });

  function exportCertificateCreated(certDetails) { return { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS,  payload: { data: certDetails } }; }
  function exportCertificateCreateFailed(errorRes) { return { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_FAILED, errorRes }; }
};

export const getExportCertificateFromParams = (params) => (dispatch) => {
  return dispatch({type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS, payload: {data: params }});
};