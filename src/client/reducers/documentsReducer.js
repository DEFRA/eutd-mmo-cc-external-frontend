import { GOT_ALL_DOCUMENTS } from '../actions/document.actions';

const initialState = {
  inProgress: [],
  completed: []
};

export default (state, action) => {
  state = state || initialState;

  return (action.type === GOT_ALL_DOCUMENTS) ? action.payload : state;

};
