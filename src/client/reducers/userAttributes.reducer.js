import { UPDATED_USER_ATTRIBUTES, GOT_ALL_USER_ATTRIBUTES } from '../actions/userAttributes.actions';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    // Both end points return all user attributes
    case UPDATED_USER_ATTRIBUTES:
      return action.payload;

    case GOT_ALL_USER_ATTRIBUTES:
      return action.payload;

    default:
      return state;
  }

};
