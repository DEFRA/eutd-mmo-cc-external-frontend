import {dynamicsActionTypes} from '../actions';

const initialState = { model: {}};

export default(state, action) => {
  state = state || initialState;
  switch (action.type) {
    case dynamicsActionTypes.USER_DETAILS_REQUESTED:
      return {
        ...state,
        busy: true,
        error: undefined
      };
    case dynamicsActionTypes.USER_DETAILS_LOADED:
      return {
        ...state,
        model: action.userdetails,
        error: undefined,
        busy: false
      };
    case dynamicsActionTypes.USER_DETAILS_FAILED:
      return {
        ...state,
        error: action.error,
        busy: false,
      };
    default:
      return state;
  }
};
