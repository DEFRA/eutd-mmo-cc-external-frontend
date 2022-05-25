import {GET_POSTCODE_ADDRESSES, SAVE_POSTCODE_LOOKUP_ADDRESS, CLEAR_POSTCODE_LOOKUP_ADDRESS, POSTCODE_LOOKUP_UNAUTHORISED, CLEAR_POSTCODE_LOOKUP_UNAUTHORISED} from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case GET_POSTCODE_ADDRESSES:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_POSTCODE_LOOKUP_ADDRESS:
      return {
        ...state,
        postcodeLookupAddress: action.payload
      };
    case CLEAR_POSTCODE_LOOKUP_ADDRESS:
      return {
        ...state,
        postcodeLookupAddress: {}
      };
    case POSTCODE_LOOKUP_UNAUTHORISED:
      return {
        ...state,
        unauthorised: true
      };
    case CLEAR_POSTCODE_LOOKUP_UNAUTHORISED:
    return {
      ...state,
      unauthorised: undefined
    };
    default:
      return state;
  }
};
