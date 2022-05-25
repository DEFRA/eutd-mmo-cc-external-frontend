import {
  GET_PROGRESS_ERROR,
  GET_PROGRESS_SUCCESS,
  GET_PROGRESS_UNAUTHORISED,
  CLEAR_PROGRESS_DATA
} from '../actions/progress.actions';

const initialState = {};

export default (state, action) => {

  state = state || initialState;
  switch (action.type) {
    case GET_PROGRESS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case GET_PROGRESS_ERROR:
      return {
        ...state,
        errors: action.error
      };
    case GET_PROGRESS_UNAUTHORISED:
      return {
        ...state,
        unauthorised: true
      };
    case CLEAR_PROGRESS_DATA:
      return initialState;
    default:
      return state;
  }
};