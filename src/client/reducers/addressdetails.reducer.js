import {dynamicsActionTypes} from '../actions';

const initialState = { model: {}};

export default(state, action) => {
  state = state || initialState;
  switch (action.type) {
    case dynamicsActionTypes.ADDRESS_DETAILS_REQUESTED:
      return {
        ...state,
        busy: true,
        error: undefined
      };
    case dynamicsActionTypes.ADDRESS_DETAILS_LOADED:
      return {
        ...state,
        model: action.addresses,
        error: undefined,
        busy: false
      };
    case dynamicsActionTypes.ADDRESS_DETAILS_FAILED:
      return {
        ...state,
        error: action.error,
        busy: false,
      };
    default:
      return state;
  }
};
