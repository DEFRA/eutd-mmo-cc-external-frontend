import {GET_DOCUMENT} from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;

  return (action.type === GET_DOCUMENT)? {...state, ...action.payload.data} : state;

};
