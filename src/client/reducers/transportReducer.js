import {
  ADD_TRANSPORT,
  ADD_TRANSPORT_DETAILS,
  CLEAR_TRANSPORT_DETAILS,
  ADD_TRANSPORT_DETAILS_UNAUTHORISED,
  SAVE_TRANSPORT_DETAILS_UNAUTHORISED,
  SAVE_TRANSPORT_DETAILS_WAF_ERROR
} from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case ADD_TRANSPORT:
      return { ...state, ...action.payload.data };
    case ADD_TRANSPORT_DETAILS:
      return action.payload.data? { ...state, ...action.payload.data } : {};
    case ADD_TRANSPORT_DETAILS_UNAUTHORISED:
      return { ...state, unauthorised: true, supportID: undefined };
    case SAVE_TRANSPORT_DETAILS_UNAUTHORISED:
      return { ...state, unauthorised: true };
    case SAVE_TRANSPORT_DETAILS_WAF_ERROR:
      return { ...state, unauthorised: true, supportID: action.supportID };
    case CLEAR_TRANSPORT_DETAILS:
      return { supportID: state.supportID };
    default:
      return state;
  }
};
