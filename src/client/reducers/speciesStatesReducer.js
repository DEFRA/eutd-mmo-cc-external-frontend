import { GET_SPECIES_STATES, GET_SPECIES_STATES_FAILED, CLEAR_SPECIES_STATES } from '../actions';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case GET_SPECIES_STATES:
      return action.payload.data;
    case GET_SPECIES_STATES_FAILED:
      return [];
    case CLEAR_SPECIES_STATES:
      return [];
    default:
      return state;
  }
};
