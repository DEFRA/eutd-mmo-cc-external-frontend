import {
  SAVE_LANDING_ROWS,
  UPLOAD_LANDING_ROWS,
  UNAUTHORISED_LANDING_ROWS,
  CLEAR_LANDING_ROWS
} from '../actions/upload-file.actions';

const initialState = {
  landings: []
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case SAVE_LANDING_ROWS:
    case UPLOAD_LANDING_ROWS:
      return { ...state, landings: action.payload, unauthorised: undefined };
    case UNAUTHORISED_LANDING_ROWS:
      return { ...state, unauthorised: true };
    case CLEAR_LANDING_ROWS:
      return { ...initialState };
    default:
      return state;
  }
};