import {
  SAVE_USER_REFERENCE,
  FAILED_USER_REFERENCE,
  UNAUTHORISED_USER_REFERENCE,
  CLEAR_USER_REFERENCE,
  WAF_ERROR_USER_REFERENCE
} from '../actions/user-reference.actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case SAVE_USER_REFERENCE:
      return {
        ...state,
        ...action.payload
      };
    case FAILED_USER_REFERENCE:
      return {
        ...state,
        error: action.error
      };
    case UNAUTHORISED_USER_REFERENCE:
      return {
        ...state,
        unauthorised: true,
        supportID: undefined
      };
    case WAF_ERROR_USER_REFERENCE:
      return {
        ...state,
        unauthorised: true,
        supportID: action.supportID
      };
    case CLEAR_USER_REFERENCE:
      return {
        ...state,
        unauthorised: undefined,
        userReference: undefined
      };
    default:
      return state;
  }
};
