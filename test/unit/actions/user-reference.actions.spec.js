import { getUserReference, saveUserReference, clearUserReference } from '../../../src/client/actions/user-reference.actions';
import { isError } from '../../../src/client/actions/index';
import { isForbidden, isSilverLineError } from '../../../src/client/actions/user-reference.actions';

jest.mock('../../../src/client/actions/index', () => ({
  ...jest.requireActual('../../../src/client/actions/index'),
  isError: jest.fn()
}));
jest.mock('../../../src/client/actions/user-reference.actions', () => ({
  ...jest.requireActual('../../../src/client/actions/user-reference.actions'),
  isForbidden: jest.fn(),
  isSilverLineError: jest.fn()
}));

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const data = 'My Reference';


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

const itShouldFailAndShowFullPageError = (service) => it('Should fail, showFullPageError and then throw an error', () => {
  const store = mockStore({ response: { status: 500, statusText: 'Internal Server Error' }})();
  isError.mockReturnValue(true);

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('An error has occurred 500 (Internal Server Error)'));
    expect(store.getActions()).toEqual([
      { type: 'begin_api_call' },
      { type: 'save',  payload: { showFullPageError: true } },
      { type: 'failed_user_reference', errorRes: { response: { data: 'some_error', status: 400 } } }
    ]);
  });
});

const itShouldFailAndThrowAnError = (service) => it('Should fail and then throw an error', () => {
  const store = mockStore({ response: { status: 400, statusText: 'Bad Request' }})();
  isError.mockReturnValue(false);

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('An error has occurred 400 (Bad Request)'));
    expect(store.getActions()).toEqual([
      { type: 'begin_api_call' },
      { type: 'failed_user_reference', error: undefined }
    ]);
  });
});

const itShouldFailAndThrowAnErrorOtherThanForbidden = (service) => it('Should fail and then throw an error other than forbidden', () => {
  const store = mockStore({ response: { status: 400, statusText: 'Bad Request' }})();
  isForbidden.mockReturnValue(false);

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('An error has occurred 400 (Bad Request)'));
    expect(store.getActions()).toEqual([
      { type: 'begin_api_call' },
      { type: 'failed_user_reference',  error: undefined}
    ]);
  });
});

const itShouldFailAndDispatchUnauthorised = (service) => it('Should fail and dispatch an unauthorised', () => {
  const store = mockStore({ response : { status: 403, statusText: 'Forbidden', data: '' }})();
  isForbidden.mockReturnValue(true);

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('unauthorised access 403'));
    expect(store.getActions()).toEqual([{ type: 'begin_api_call' }, { type: 'unauthorised_user_reference' }]);
  });
});

const itShouldFailAndDispatchWafError = (service) => it('Should fail and dispatch waf error', () => {
  const store = mockStore({ response : { status: 403, statusText: 'Forbidden', data: '<html><head><title>Request Rejected</title></head><body>The requested URL was rejected. Please consult with your administrator.<br><br>Your support ID is: 2732698712327933848</body></html>' }})();
  isSilverLineError.mockReturnValue(true);

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('unauthorised access 403'));
    expect(store.getActions()).toEqual([{ type: 'begin_api_call' }, { type: 'waf_error_user_reference', supportID: '2732698712327933848' }]);
  });
});

describe('User reference action creators', () => {
  describe('#getUserReference', () => {
    it('should get a userReference', () => {

      const documentNumber = 'GBR-2020-CC-2345-3453';
      const expectedActions = [{ type: 'begin_api_call'},{
        type : 'save_user_reference',
        payload: { userReference: 'My Reference' }
      }];

      const store = mockStore()({
        reference: data
      });

      return store.dispatch(getUserReference(documentNumber)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });

    itShouldFailAndShowFullPageError(getUserReference);
    itShouldFailAndThrowAnError(getUserReference);
    itShouldFailAndDispatchUnauthorised(getUserReference);
    itShouldFailAndThrowAnErrorOtherThanForbidden(getUserReference);
    itShouldFailAndDispatchWafError(getUserReference);
  });

  describe('#saveUserReference', () => {
    it('should save a userReference', () => {
        const expectedActions = [{
          type : 'begin_api_call'
        },
        {
          payload: {
            userReference: 'My Reference'
          },
          type: 'save_user_reference'
        }];

        const documentNumber = 'GBR-2020-CC-2344-2423';

        const store = mockStore()({
            response: data
        });

        return store.dispatch(saveUserReference(data, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });

    });

    itShouldFailAndShowFullPageError(saveUserReference);
    itShouldFailAndThrowAnError(saveUserReference);
    itShouldFailAndDispatchUnauthorised(saveUserReference);
    itShouldFailAndDispatchWafError(getUserReference);
  });

  describe('#clearUserReference', () => {
    it('should clear a userReference', () => {
      const expectedActions = [{type: 'clear_user_reference'}];

      const store = mockStore()({
        response: data
      });

      store.dispatch(clearUserReference());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
