import {
  ADD_CONFIRM_DOCUMENT_VOID,
  CLEAR_CONFIRM_DOCUMENT_VOID} from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case ADD_CONFIRM_DOCUMENT_VOID:
      return {...state, ...action.payload};
    case CLEAR_CONFIRM_DOCUMENT_VOID:
      return {};
    default:
      return state;
  }
};
