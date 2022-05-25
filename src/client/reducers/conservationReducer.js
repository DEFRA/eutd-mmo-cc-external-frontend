import { ADD_CONSERVATION, CLEAR_CONSERVATION, ADD_CONSERVATION_UNAUTHORISED, ADD_CONSERVATION_WAF_ERROR } from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case ADD_CONSERVATION:
      return {...state, ...action.payload.data};
    case CLEAR_CONSERVATION:
      return { supportID: state.supportID };
    case ADD_CONSERVATION_UNAUTHORISED:
      return { ...state, unauthorised: true, supportID: undefined };
    case ADD_CONSERVATION_WAF_ERROR:
      return { ...state, unauthorised: true, supportID: action.supportID };
    default:
      return state;
  }
};
