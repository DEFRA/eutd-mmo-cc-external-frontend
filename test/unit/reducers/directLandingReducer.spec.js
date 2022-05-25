import {
  CLEAR_DIRECT_LANDING,
  GET_DIRECT_LANDING_PRODUCTS,
  GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED,
  POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED,
  POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR
} from '../../../src/client/actions/direct-landing.actions';
import directLandingReducer from '../../../src/client/reducers/directLandingReducer';

describe('Direct Landing Reducer', () => {
  const initialState = {};

  it('will reduce to initial state if no state is provided', () => {
    const state = null;
    const action = { type: '' };

    expect(directLandingReducer(state, action)).toEqual(initialState);
  });

  it('will return the passed in state if no action can be found', () => {
    const state = { test: 'test' };
    const action = { type: '' };

    expect(directLandingReducer(state, action)).toEqual(state);
  });

  describe('GET_DIRECT_LANDING_PRODUCTS action', () => {
    it('will include the payload into state', () => {
      const payload = { product: 'test' };
      const state = { test: 'test' };
      const action = { type: GET_DIRECT_LANDING_PRODUCTS, payload };

      expect(directLandingReducer(state, action)).toEqual({
        ...state,
        ...payload,
      });
    });
  });

  describe('CLEAR_DIRECT_LANDING action', () => {
    it('will reduce back to the initial state and keep supportID if there is', () => {
      const state = { test: 'test', supportID: '1234' };
      const action = { type: CLEAR_DIRECT_LANDING };

      expect(directLandingReducer(state, action)).toEqual({...initialState, supportID: state.supportID});
    });

    it('will reduce back to the initial state', () => {
      const state = { test: 'test' };
      const action = { type: CLEAR_DIRECT_LANDING };

      expect(directLandingReducer(state, action)).toEqual(initialState);
    });
  });

  describe('POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED action', () => {
    it('will reduce the state to unauthorised', () => {
      const state = { test: 'test' };
      const unauthorised = true;
      const action = { type: POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED };

      expect(directLandingReducer(state, action)).toEqual({
        ...state,
        unauthorised,
        supportID: undefined
      });
    });
  });

  describe('POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR action', () => {
    it('will reduce the state to unauthorised and set supportID', () => {
      const state = { test: 'test' };
      const unauthorised = true;
      const action = { type: POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR, supportID: '123456' };

      expect(directLandingReducer(state, action)).toEqual({
        ...state,
        unauthorised,
        supportID: '123456'
      });
    });
  });

  describe('GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED action', () => {
    it('will reduce the state to unauthorised', () => {
      const state = { test: 'test' };
      const unauthorised = true;
      const action = { type: GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED };

      expect(directLandingReducer(state, action)).toEqual({
        ...state,
        unauthorised,
      });
    });
  });
});
