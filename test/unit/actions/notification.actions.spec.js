import { getNotification, clearNotification } from '../../../src/client/actions/notification.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const data = {
  title: 'This is a title',
  message: 'This is a message'
};

const mockStore = (rejectWith = false) => configureStore([thunk.withExtraArgument({
    orchestrationApi: {
        get: () => {
            return new Promise((res, rej) => {
              if (rejectWith) {
                rej(rejectWith);
              } else {
                res({ data });
              }
            });
        },
        post: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res({ data });
            }
          });
        }
    }
})]);

const itShouldFailAndDispatchClear = (service) => it('Should fail and dispatch a clear notification', () => {
  const store = mockStore({ response : { status: 500, statusText: 'Internal Server Error' }})();

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error({ status: 500, statusText: 'Internal Server Error' }));
    expect(store.getActions()).toEqual([{ type: 'CLEAR_NOTIFICATION' }]);
  });
});

const itShouldFailAndDispatchUnauthorised = (service) => it('Should fail and dispatch an unauthorised', () => {
  const store = mockStore({ response : { status: 403 }})();

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('Unauthorised access 403'));
    expect(store.getActions()).toEqual([{ type: 'GET_NOTIFICATION_UNAUTHORISED' }]);
  });
});

const itShouldFailAndNotDispatchClear = (service) => it('Should fail and not dispatch an unauthorised', () => {
  const store = mockStore({ response : { status: 400, statusText: 'Bad Request' }})();

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error({ status: 400, statusText: 'Bad Request' }));
    expect(store.getActions()).toEqual([]);
  });
});

describe('Notificaiton action creators', () => {

  describe('#getNotification', () => {

    it('Get Notification', () => {

      const expectedActions = [
        {
          type : 'GET_NOTIFICATION',
          payload: data
        }
      ];

      const store = mockStore()({
        notification: {}
      });

      return store.dispatch(getNotification()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });

    itShouldFailAndDispatchUnauthorised(getNotification);
    itShouldFailAndDispatchClear(getNotification);
    itShouldFailAndNotDispatchClear(getNotification);
  });

  describe('#clearNotification', () => {

    it('should clear the Notification', () => {

      const expectedActions = [{ type : 'CLEAR_NOTIFICATION' }];

      const store = mockStore()({
        notification: data
      });

      store.dispatch(clearNotification());

      expect(store.getActions()).toEqual(expectedActions);

    });

  });
});