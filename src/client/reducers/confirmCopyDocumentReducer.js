import {
  CONFIRM_COPY_DOCUMENT,
  UNAUTHORISED_COPY_DOCUMENT,
  CLEAR_COPY_DOCUMENT,
} from '../actions/copy-document.actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case CONFIRM_COPY_DOCUMENT:
      return {...state, ...action.payload};
    case UNAUTHORISED_COPY_DOCUMENT:
      return {
        ...state,
        unauthorised: true
      };
    case CLEAR_COPY_DOCUMENT:
      return {};
    default:
      return state;
  }
};
