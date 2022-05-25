import { API_CALL_FAILED, BEGIN_API_CALL, CLEAR_ERRORS } from '../actions';
import errorTransformer  from '../helpers/errorTransformer';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case API_CALL_FAILED:
      return errorTransformer(action.payload.data, state);
    case BEGIN_API_CALL:
      return {};
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
};
