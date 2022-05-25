import {
  addFavourite,
  removeFavourite,
  getAddedFavouritesPerUser,
  favouriteActionTypes,
} from '../../../src/client/actions/favourites.actions';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as favouriteActions from '../../../src/client/actions/favourites.actions';

const buildResponse = (status, data, errors) => {
  return { response: { status, data: { ...data, errors } } };
};

const err400Response = buildResponse(400, ['error']);
const err500Response = buildResponse(500, ['error']);
const err403Response = buildResponse(403, ['error']);

const resolveOrReject = (data, rejectWith) => {
  return new Promise((res, rej) => {
    if (rejectWith) {
      rej(rejectWith);
    } else {
      res({ data });
    }
  });
};

const mockStore = (respondWith = {}, rejectWith = null) =>
  configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        post: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res(respondWith);
            }
          });
        },
        delete: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res(respondWith);
            }
          });
        },
      },
    }),
  ]);

const mockStoreWithApi = (data, rejectWith = false) =>
  configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        post: () => resolveOrReject(data, rejectWith),
        get: () => resolveOrReject(data, rejectWith),
        put: () => resolveOrReject(data, rejectWith),
      },
      referenceServiceApi: {
        post: () => resolveOrReject(data, rejectWith),
        get: () => resolveOrReject(data, rejectWith),
      },
    }),
  ]);

const itShouldFailAndDispatchShowFullPageError = (
  service,
  payload,
  beforeActions = [],
  afterActions = [],
  storeInfo = {}
) =>
  it('Should fail and dispatch a showFullPageError', () => {
    const store = mockStoreWithApi(null, err500Response)({ ...storeInfo });

    return store.dispatch(service(payload)).catch(() => {
      expect(store.getActions()).toEqual([
        ...beforeActions,
        { type: 'save', payload: { showFullPageError: true } },
        ...afterActions,
      ]);
    });
  });

describe('Favourites actions', () => {
  describe('addFavourite', () => {
    it('should return a response to the caller if successful', async () => {
      const res = {
        data: ['FISH1']
      };

      const store = mockStore(res, null)();

      const result = await store.dispatch(addFavourite());

      expect(result).toEqual(res.data);
    });
    it('should dispatch FAVOURITE_ADD with the API response if successful', async () => {
      const res = {
        data: ['FISH1', 'FISH2'],
      };

      const expectedActions = [{type: 'favourite_add', payload: res.data}];

      const store = mockStore(res, null)();

      await store.dispatch(addFavourite());

      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should dispatch FAVOURITE_ADD_FAILED with the API response if there is a bad request error', async () => {
      const errorRes = {
        response: {
          status: 400,
          data: { commodity_code: 'select a commodity code' }
        },
      };

      const expectedActions = [{type: 'favourite_add_failed', error: errorRes.response.data}];

      const store = mockStore(null, errorRes)();

      return await store.dispatch(addFavourite()).catch((e) => {
        expect(e.response.data).toEqual(errorRes.response.data);
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
  describe('remove favourites', () => {
    let mockRemoveFavouriteFn;

    beforeAll(() => {
      mockRemoveFavouriteFn = jest.spyOn(favouriteActions, 'removeFavourite');
    });

    afterAll(() => {
      mockRemoveFavouriteFn.mockRestore();
    });

    it('Should remove a favourite', () => {
      const res = {
        data: 'Favourite removed',
      };

      const favouriteId = 'PRD234';

      const expectedActions = [
        {
          type: favouriteActionTypes.FAVOURITE_REMOVED,
          payload: 'Favourite removed',
        },
      ];

      const store = mockStore(res, null)();

      return store.dispatch(removeFavourite(favouriteId)).then(() => {
        expect(mockRemoveFavouriteFn).toHaveBeenCalledWith(favouriteId);
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should fail to remove a favourite', () => {
      const expectedActions = [
        { type: 'favourite_remove_failed', errorRes: 'Error: a' },
      ];

      const store = mockStore(null, new Error('a'))();

      return store.dispatch(removeFavourite(null)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should fail to remove a favourite with the error data when status === 403', () => {
      const expectedActions = [
        { type: favouriteActionTypes.FAVOURITE_REMOVED_UNAUTHORISED },
      ];

      const store = mockStore(null, {
        response: { data: 'some_error', status: 403 },
      })();

      return store.dispatch(removeFavourite(null)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should throw an error when promise is rejected while trying to remove', async () => {
      const toStringError = new String('a');
      toStringError.toString = jest.fn().mockImplementation(() => {
        throw new Error('some_error');
      });

      const store = mockStore(null, toStringError)();
      let error = null;

      try {
        await store.dispatch(removeFavourite()).then(() => {
          expect(store.getActions()).toEqual([
            {
              type: favouriteActionTypes.FAVOURITE_REMOVE_FAILED,
              error: error.toString(),
            },
          ]);
        });
      } catch (err) {
        error = err;
      }

      expect(error).not.toBeNull();
      expect(error).toEqual(new Error('some_error'));
    });
  });
});

describe('#getAddedProductFavouritesPerUser', () => {
  it('should get added product favourites per user', () => {
    const data = [
      {
        id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
        species: 'Atlantic cod (COD)',
        speciesCode: 'COD',
        scientificName: 'Zoarces viviparus',
        state: 'FRO',
        stateLabel: 'Frozen',
        presentation: 'FIL',
        presentationLabel: 'Filleted',
        commodity_code: '03047190',
        commodity_code_description: 'Frozen fish, n.e.s.',
      },
      {
        id: '1de25edf-8f04-425b-a558-c4037afcfe7c',
        species: 'Atlantic cod (COD)',
        speciesCode: 'COD',
        scientificName: 'Zoarces viviparus1',
        state: 'FRO',
        stateLabel: 'Frozen',
        presentation: 'FIL',
        presentationLabel: 'Filleted',
        commodity_code: '03047190',
        commodity_code_description: 'Frozen fish, n.e.s.',
      },
    ];

    const expectedActions = [
      { type: 'clear_errors' },
      { type: 'get_added_favourites_per_user', payload: { data } },
    ];
    const store = mockStoreWithApi(data)({ getAddedFavouritesPerUser: data });

    return store.dispatch(getAddedFavouritesPerUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  itShouldFailAndDispatchShowFullPageError(getAddedFavouritesPerUser, {});

  it('Should fail to get added favourites per user', () => {
    const data = [
      {
        species: 'Atlantic cod (COD)',
        id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
        speciesCode: 'COD',
      },
    ];

    const expectedActions = [
      { type: 'clear_errors' },
      {
        type: 'get_added_favourites_per_user_failed',
        payload: { ...err400Response.response },
      },
    ];

    const store = mockStoreWithApi(data, err400Response)();

    return store.dispatch(getAddedFavouritesPerUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch an unauthorised error', ()=> {
    const data = [
      {
        species: 'Atlantic cod (COD)',
        id: 'PRD234',
        speciesCode: 'COD',
      },
    ];

    const expectedActions = [
      { type: 'clear_errors' },
      {
        type: 'get_added_favourites_unauthorised',
      },
    ];

    const store = mockStoreWithApi(data, err403Response)();

    return store.dispatch(getAddedFavouritesPerUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
