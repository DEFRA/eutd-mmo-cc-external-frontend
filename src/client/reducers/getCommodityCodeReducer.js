import { GET_COMMODITY_CODE } from '../actions';

const initialState = [];

export default (state, action) => {
  state = state || initialState;

  return action.type === GET_COMMODITY_CODE
    ? action.payload.data
      ? action.payload.data.map((r) => ({
          value: r.code,
          label: `${r.code} - ${r.description}`,
        }))
      : []
    : state;
};
