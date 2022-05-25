import { SEARCH_FISH, CLEAR_SPECIES_SEARCH_RESULTS } from '../actions';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case SEARCH_FISH:
      return action.payload.data;
    case CLEAR_SPECIES_SEARCH_RESULTS:
      return [];
    default:
      return state;
  }
};
