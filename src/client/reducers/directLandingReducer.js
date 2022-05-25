import {
  GET_DIRECT_LANDING_PRODUCTS,
  CLEAR_DIRECT_LANDING,
  GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED,
  POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED,
  POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR
} from '../actions/direct-landing.actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case GET_DIRECT_LANDING_PRODUCTS:
      return { ...state, ...action.payload };
    case GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED:
    case POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED:
      return { ...state, unauthorised: true, supportID: undefined };
    case POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR:
      return {...state, unauthorised: true, supportID: action.supportID};
    case CLEAR_DIRECT_LANDING:
      return {...initialState, supportID: state.supportID};
    default:
      return state;
  }
};