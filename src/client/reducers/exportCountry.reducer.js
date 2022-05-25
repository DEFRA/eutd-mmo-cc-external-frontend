import {
  ADD_SELECTED_EXPORT_COUNTRY,
  GET_EXPORT_COUNTRY,
  GET_EXPORT_COUNTRY_UNAUTHORISED,
  SAVE_EXPORT_COUNTRY_UNAUTHORISED,
  CLEAR_EXPORT_COUNTRY } from '../actions';

const initialState = {};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case ADD_SELECTED_EXPORT_COUNTRY:
    case GET_EXPORT_COUNTRY:
      return {...state, ...action.payload, loaded: true};
    case GET_EXPORT_COUNTRY_UNAUTHORISED:
      return {...state, unauthorised: true};
    case SAVE_EXPORT_COUNTRY_UNAUTHORISED:
      return {...state, unauthorised: true};
    case CLEAR_EXPORT_COUNTRY:
      return {};
    default:
      return state;
  }
};
