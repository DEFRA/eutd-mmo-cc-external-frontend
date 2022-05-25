import { GET_SPECIES_PRESENTATIONS, GET_SPECIES_PRESENTATIONS_FAILED, CLEAR_SPECIES_PRESENTATIONS } from '../actions';
import humaniseErrors from '../../helpers/humaniseErrors';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case GET_SPECIES_PRESENTATIONS:
      return action.payload.data;
    case GET_SPECIES_PRESENTATIONS_FAILED:
      return humaniseErrors(action.payload.data.message);
    case CLEAR_SPECIES_PRESENTATIONS:
      return [];
    default:
      return state;
  }
};
