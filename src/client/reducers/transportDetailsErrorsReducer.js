import { ADD_TRANSPORT_DETAILS_FAILED } from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;

  return (action.type === ADD_TRANSPORT_DETAILS_FAILED)? action.payload.data.split(',').reduce((acc, curr) => {
    acc[curr] = true; return acc;
  }, {}) : state;

};
