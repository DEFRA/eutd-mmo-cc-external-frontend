import { SEARCH_VESSELS, CLEAR_VESSELS_SEARCH_RESULTS } from '../actions';

const initialState = [];

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case SEARCH_VESSELS:
      return action.payload.data;
    case CLEAR_VESSELS_SEARCH_RESULTS:
      return [];
    default:
      return state;
  }
};
