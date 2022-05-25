
import { GET_PENDING_DOCUMENT } from '../actions/document.actions';
const initialState = null;
export default (state, action) => {
  state = state || initialState;
  return (action.type === GET_PENDING_DOCUMENT) ? action.payload : state;
};