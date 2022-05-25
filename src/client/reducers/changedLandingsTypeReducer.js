import { SAVE_CHANGED_LANDINGS_TYPE, CLEAR_CHANGED_LANDINGS_TYPE } from '../actions/landingsType.actions';

const initialState = '';

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case SAVE_CHANGED_LANDINGS_TYPE:
      return action.payload;
    case CLEAR_CHANGED_LANDINGS_TYPE:
      return initialState;
    default:
      return state;
  }
};
