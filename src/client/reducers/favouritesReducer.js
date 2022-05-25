import { favouriteActionTypes } from '../actions/favourites.actions';

const initialState = {
  favourites: [],
};

export default (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case favouriteActionTypes.FAVOURITE_ADD:
    case favouriteActionTypes.FAVOURITE_REMOVED:
      return {
        ...state,
        favourites: action.payload,
        errors: action.errors,
      };

    case favouriteActionTypes.FAVOURITE_REMOVE_FAILED:
      return {
        ...state,
        favourites: action.payload,
        errors: action.error,
      };

    case favouriteActionTypes.FAVOURITE_REMOVED_UNAUTHORISED:
    case favouriteActionTypes.FAVOURITE_ADD_UNAUTHORISED:
    case favouriteActionTypes.GET_ADDED_FAVOURITES_UNAUTHORISED:
      return {
        ...state,
        unauthorised: true,
      };

    case favouriteActionTypes.FAVOURITE_ADD_FAILED:
      return {
        ...state,
        errors: action.error,
      };

    case favouriteActionTypes.GET_ADDED_FAVOURITES_PER_USER:
      return { ...state, favourites: action.payload.data };
    case favouriteActionTypes.CLEAR_ADDED_FAVOURITES_PER_USER:
      return initialState;

    default:
      return state;
  }
};
