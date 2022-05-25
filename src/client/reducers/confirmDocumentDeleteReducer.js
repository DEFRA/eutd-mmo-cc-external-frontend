import {
  ADD_CONFIRM_DOCUMENT_DELETE,
  CLEAR_CONFIRM_DOCUMENT_DELETE } from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case ADD_CONFIRM_DOCUMENT_DELETE:
      return {...state, ...action.payload};
    case CLEAR_CONFIRM_DOCUMENT_DELETE:
      return {};
    default:
      return state;
  }
};
