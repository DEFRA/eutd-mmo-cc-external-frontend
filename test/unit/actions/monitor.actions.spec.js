import { monitorEvent } from '../../../src/client/actions/monitor.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('monitorEvent action creators', () => {
  const data = 'some-ip-address';
  const mockStore = (rejectWith = false) => configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({ data });
        });
      },
      post: () => {
        return new Promise((res, rej) => {
          if (rejectWith) {
            rej(rejectWith);
          } else {
            res();
          }
        });
      }
    }
  })]);

  it('monitorEvent successful', () => {
    const store = mockStore()({});

    return store.dispatch(monitorEvent()).then(() => {
      expect(store.getActions()).toEqual([]);
    });
  });

  it('monitorEvent failing with a 500 error', () => {
    const response = {
      status: 500,
      statusText: 'Internal Server Error'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);

    const store = mockFailureStore();

    return store.dispatch(monitorEvent()).then(() => {
      expect(store.getActions()).toEqual([
        { type: 'save', payload: { showFullPageError: true } }
      ]);
    });
  });

  it('monitorEvent failing with a 400 error', () => {
    const response = {
      status: 400,
      statusText: 'Bad Request'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);

    const store = mockFailureStore();

    return store.dispatch(monitorEvent()).then(() => {
      expect(store.getActions()).not.toContain([
        { type: 'save', payload: { showFullPageError: true } }
      ]);
    });
  });
});