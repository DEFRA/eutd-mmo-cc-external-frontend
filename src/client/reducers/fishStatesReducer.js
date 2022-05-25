import { SEARCH_FISH_STATES } from '../actions';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  return (action.type === SEARCH_FISH_STATES) ? action.payload.data : state;

};
