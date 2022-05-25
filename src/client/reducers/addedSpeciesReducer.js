import * as _ from 'lodash';

import {
  GET_ADDED_SPECIES_PER_USER,
  GET_ADDED_SPECIES_UNAUTHORISED,
  ADD_SPECIES_PER_USER,
  ADD_SPECIES_PER_USER_UNAUTHORISED,
  ADDED_TO_FAVOURITES,
  HIDE_ADDED_TO_FAVOURITES_NOTIFICATION,
  REMOVED_SPECIES_PER_USER,
  CLEAR_ADDED_SPECIES_PER_USER,
  EDIT_ADDED_SPECIES_PER_USER,
  EDIT_ADDED_SPECIES_PER_USER_UNAUTHORISED
} from '../actions';

const initialState = {
  species: []
};

export default (state, action) => {
  let stuff;
  let record;
  state = state || initialState;

  switch (action.type) {
    case GET_ADDED_SPECIES_PER_USER:
      return {
        species: action.payload.data.species,
        partiallyFilledProductRemoved: action.payload.data.partiallyFilledProductRemoved
      };

    case EDIT_ADDED_SPECIES_PER_USER:
      return {
        ...state,
        species: action.payload.data.products,
      };

    case ADD_SPECIES_PER_USER:
      stuff = state.species.slice(0);
      record = _.findIndex(stuff, (f) => {
        return f.id === action.payload.data.id;
      });
      if (record !== -1) {
        Object.assign(stuff[record], {...action.payload.data});
        return {
          ...state,
          species: stuff
        };
      }
      stuff.push(action.payload.data);
      return {...state,
        species: stuff
      };

    case ADDED_TO_FAVOURITES:
      return {
        ...state,
        addedFavouriteProduct : action.payload.addedFavouriteProduct
      };

    case EDIT_ADDED_SPECIES_PER_USER_UNAUTHORISED:
    case ADD_SPECIES_PER_USER_UNAUTHORISED:
      return { ...state, unauthorised: true };

    case REMOVED_SPECIES_PER_USER:
      return {
        species: _.reject(state.species.slice(0), (f) => {
          return f.id === action.payload.data.cancel;
        })
      };

    case CLEAR_ADDED_SPECIES_PER_USER:
      return initialState;

    case GET_ADDED_SPECIES_UNAUTHORISED:
      return { ...state, unauthorised: true };

    case HIDE_ADDED_TO_FAVOURITES_NOTIFICATION:
      return { ...state, addedFavouriteProduct: {} };

    default:
      return state;
  }
};
