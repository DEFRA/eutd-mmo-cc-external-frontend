import {ADD_SPECIES_PER_USER_FAILED, ADD_SPECIES_PER_USER } from '../actions';
import humaniseErrors from '../../helpers/humaniseErrors';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case ADD_SPECIES_PER_USER_FAILED:
      return humaniseErrors(action.payload.data.message);
    case ADD_SPECIES_PER_USER:
      return [];
    default:
      return state;
  }
};
