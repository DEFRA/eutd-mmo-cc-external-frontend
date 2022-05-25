import { exportPayloadActionTypes } from '../actions';

const initialState = { items: []};

export default(state, action) => {
  state = state || initialState;
  switch (action.type) {
    case exportPayloadActionTypes.EXPORT_PAYLOAD_REQUESTED:
    case exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_REQUESTED:
      return {
        ...state,
        busy: true,
        errors: undefined
      };

    case exportPayloadActionTypes.EXPORT_PAYLOAD_LOADED:
      return {
        ...state,
        items: action.exportPayload.items,
        busy: false,
        errors: action.errors || action.exportPayload.errors
      };

    case exportPayloadActionTypes.EXPORT_PAYLOAD_FAILED:
      return {
        ...state,
        busy: false,
        errors: [{
          targetName: 'exportPayloadFailed',
          text: 'Communication failure with server please check your connection and refresh the page'
        }]
      };

    case exportPayloadActionTypes.EXPORT_PAYLOAD_UNAUTHORISED:
    case exportPayloadActionTypes.PRODUCT_REMOVED_UNAUTHORISED:
    case exportPayloadActionTypes.LANDING_UPSERT_UNAUTHORISED:
    case exportPayloadActionTypes.LANDING_UPDATE_UNAUTHORISED:
    case exportPayloadActionTypes.LANDING_REMOVE_UNAUTHORISED:
      return {
        ...state,
        unauthorised: true,
        supportID: undefined
      };

    case exportPayloadActionTypes.EXPORT_PAYLOAD_WAF_ERROR:
    case exportPayloadActionTypes.LANDING_UPSERT_WAF_ERROR:
      return {
        ...state,
        unauthorised: true,
        supportID: action.supportID
      };

    case exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_SUCCESS:
    case exportPayloadActionTypes.PRODUCT_ADDED:
    case exportPayloadActionTypes.PRODUCT_REMOVED:
    case exportPayloadActionTypes.LANDING_UPSERTED:
    case exportPayloadActionTypes.LANDING_UPDATED:
    case exportPayloadActionTypes.LANDING_REMOVED:
      return {
        ...state,
        items: action.exportPayload.items,
        busy: false,
        errors: action.errors,
      };

    case exportPayloadActionTypes.EXPORT_PAYLOAD_VALIDATE_FAILED:
      return {
        ...state,
        busy: false,
        errors: action.errors
      };

    case exportPayloadActionTypes.PRODUCT_UPDATE_FAILED:
    case exportPayloadActionTypes.LANDING_UPDATE_FAILED:
      return {
        ...state,
        busy: false,
        errors: action.error
      };

    case exportPayloadActionTypes.LANDING_UPSERT_FAILED:
    case exportPayloadActionTypes.LANDING_REMOVE_FAILED:
      return {
        ...state,
        items: action.exportPayload.items,
        busy: false,
        errors: action.error
      };

    case exportPayloadActionTypes.EXPORT_CERT_CLEAR:
      return {
        ...state,
        unauthorised: undefined,
        busy: undefined,
        items: []
      };

    case exportPayloadActionTypes.EXPORT_CERT_CLEAR_ERRORS:
      return {
        ...state,
        busy: false,
        errors: undefined
      };

    default:
      return state;
  }
};
