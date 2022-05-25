import {
  GET_PROGRESS_ERROR,
  GET_PROGRESS_SUCCESS,
  GET_PROGRESS_UNAUTHORISED,
  CLEAR_PROGRESS_DATA
} from '../../../src/client/actions/progress.actions';
import progressReducer from '../../../src/client/reducers/progress.reducer';

describe('Progress Reducer', () => {
  const initialState = {};

  it('will reduce an undefined state on success', () => {
    const payload = { hello: 'world' };
    const action = { type: GET_PROGRESS_SUCCESS, payload };

    expect(progressReducer(undefined, action)).toEqual({
      ...payload
    });
  });

  it('will reduce a success state on success', () => {
    const payload = { hello: 'world' };
    const action = { type: GET_PROGRESS_SUCCESS, payload };

    expect(progressReducer(initialState, action)).toEqual({
      ...payload
    });
  });

  it('will set an unauthorised flag on unauthorised', () => {
    const action = { type: GET_PROGRESS_UNAUTHORISED };

    expect(progressReducer(initialState, action)).toEqual({ unauthorised: true });
  });

  it('will reduce an error state', () => {
    const action = {
      type: GET_PROGRESS_ERROR,
      error: [{ someError: 'some-error' }]
    };
    const expected = { errors: [{ someError: 'some-error' }] };

    expect(progressReducer(initialState, action)).toEqual(expected);
  });

  it('will maintain state for any other action', () => {
    const state = { test: 'test' };
    const action = { type: 'anything_else' };

    expect(progressReducer(state, action)).toEqual(state);
  });

  it('should reduce an clear state', () => {
    const initialState = {
      errors: [{ someError: 'some-error' }],
      unauthorised: true,
    };
    const action = {
      type: CLEAR_PROGRESS_DATA
    };

    const expected = {};

    expect(progressReducer(initialState, action)).toEqual(expected);
  });
});
