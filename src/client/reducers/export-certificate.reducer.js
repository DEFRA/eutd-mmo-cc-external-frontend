import {exportCertificateActionTypes} from '../actions/export-certificate.actions';

const initialState = {
  validationErrors: [{}]
};

export default (state, action) => {
  state = state || initialState;

  if (action.type === exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS)
    return action.payload.data;
  else
    return state;
};
