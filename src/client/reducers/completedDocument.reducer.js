import { GET_COMPLETED_DOCUMENT } from '../actions/document.actions';

const initialState = null;

export default (state, action) => {
  state = state || initialState;

  return (action.type === GET_COMPLETED_DOCUMENT) ? action.payload : state;

};
