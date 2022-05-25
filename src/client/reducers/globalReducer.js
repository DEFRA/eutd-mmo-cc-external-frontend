import { SAVE } from '../actions/index';

const initialState = {
  allFish: [],
  allVessels: [],
  allCountries: []
};

export default (state, action) => {
  state = state || initialState;

  const data = {...action.payload};

  return (action.type === SAVE) ? {...state, ...data } : state;

};
