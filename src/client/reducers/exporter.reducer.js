import {exporterActionTypes} from '../actions/exporter.actions';
import {dynamicsActionTypes, getAddressModelFromDynamicsResponse} from '../actions/dynamics.actions';
import errorTransformer  from '../helpers/errorTransformer';

const initialState = { model: {}};

export default(state, action) => {
  state = state || initialState;

  switch (action.type) {
    case exporterActionTypes.EXPORTER_REQUESTED:
      return {
        ...state,
        busy: true,
        error: undefined,
        errors: undefined
      };
    case exporterActionTypes.EXPORTER_LOADED: {
      let exporter = {...state};
      exporter.model = {...action.exporter.model};
      exporter.error = action.exporter.error;
      exporter.errors = errorTransformer(action.exporter.errors);
      exporter.busy = false;
      exporter.saved = false;
      return exporter;
    }
    case dynamicsActionTypes.EXPORTER_NAME_PRE_LOADED: {
      if (state.model.preLoadedName) {
        return state;
      } else {
        return {
          ...state,
          model: Object.assign({}, state.model, {
            contactId : action.contactId,
            exporterFullName: `${action.firstName} ${action.lastName}`,
            _dynamicsUser: {
              firstName: action.firstName,
              lastName: action.lastName,
            },
          })
        };
      }
    }
    case dynamicsActionTypes.EXPORTER_ADDRESS_PRE_LOADED: {
      if (state.model.preLoadedAddress) {
        return state;
      } else {
        let model = getAddressModelFromDynamicsResponse(action);
        return {
          ...state,
          model: {
            ...state.model,
            ...model
          }
        };
      }
    }
    case dynamicsActionTypes.EXPORTER_ADDRESS_PRE_LOAD_FAILED: {
      return {
        ...state,
        model: {
          ...state.model,
          preLoadedAddress: true
        }
      };
    }
    case dynamicsActionTypes.EXPORTER_COMPANY_NAME_PRE_LOADED: {
      if (state.model.preLoadedCompanyName) {
        return state;
      } else {
        return {
          ...state,
          model: Object.assign({}, state.model, {
            accountId : action.accountId,
            exporterCompanyName: action.name,
          })
        };
      }
    }
    case exporterActionTypes.EXPORTER_CHANGED:
      return {
        ...state,
        model: action.exporter,
        saved: false
      };
    case exporterActionTypes.EXPORTER_SAVED:
      return {
        ...state,
        model: action.exporter.model,
        busy: false,
        error: undefined,
        errors: undefined,
        saved: true
      };
    case exporterActionTypes.EXPORTER_ADDRESS_LOOKUP_SAVED:
      return {
        ...state,
        model: Object.assign(state.model, action.payload),
        error: undefined,
        errors: undefined
      };
    case exporterActionTypes.EXPORTER_INVALID:
      return {
        ...state,
        busy: false,
        model: action.exporter.model,
        error: action.exporter.error,
        errors: flattenAddressErrors(action.exporter.errors),
        saved: false
      };
    case exporterActionTypes.EXPORTER_FAILED:
      return {
        ...state,
        busy: false,
        error: action.error,
        saved: false
      };
    case exporterActionTypes.EXPORTER_UNAUTHORISED: {
      return {
        ...state,
        unauthorised: true,
        supportID: undefined
      };
    }
    case exporterActionTypes.EXPORTER_WAF_ERROR: {
      return {
        ...state,
        unauthorised: true,
        supportID: action.supportID
      };
    }
    case exporterActionTypes.EXPORTER_CLEAR_UNAUTHORISED:
      return {
        ...state,
        unauthorised: undefined
      };
    case exporterActionTypes.EXPORTER_CHANGE_ADDRESS: {
      return {
        ...state,
        error: undefined,
        errors: undefined,
        model: {
          ...state.model,
          changeAddress: true
        }
      };
    }
    case exporterActionTypes.EXPORTER_CLEAR_CHANGE_ADDRESS: {
      return {
        ...state,
        model: {
          ...state.model,
          changeAddress: undefined
        }
      };
    }
    default:
      return state;
  }
};

const flattenAddressErrors = (errors) => {
  const hasAddressErrors = ('postcode' in errors || 'townCity' in errors);
  let result = {...errors};
  if (hasAddressErrors) {
    result.address = 'error.address.any.required';

    delete result.postcode;
    delete result.townCity;
  }

  return errorTransformer(result);
};