import { landingsType } from '../actions/landingsType.actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case landingsType.LANDINGS_TYPE_SAVE:
      return { ...state, ...action.payload };
    case landingsType.LANDINGS_TYPE_CHANGE_FAILED:
      return { ...state, errors: action.error };
    case landingsType.LANDINGS_TYPE_CHANGE_UNAUTHORISED:
      return { ...state, unauthorised: true };
    case landingsType.LANDINGS_TYPE_CHANGE_CLEAR:
      return {};
    default:
      return state;
  }
};