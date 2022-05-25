import {
  dispatchClearErrors,
  showFullPageError,
  isError,
  isForbidden,
} from './index';

export const CLEAR_ERRORS = 'clear_errors';

export const favouriteActionTypes = {
  FAVOURITE_REMOVED: 'favourite_removed',
  FAVOURITE_REMOVE_FAILED: 'favourite_remove_failed',
  FAVOURITE_REMOVED_UNAUTHORISED: 'favourite_removed_unauthorised',
  FAVOURITE_ADD: 'favourite_add',
  FAVOURITE_ADD_UNAUTHORISED: 'favourite_add_unauthorised',
  FAVOURITE_ADD_FAILED: 'favourite_add_failed',
  GET_ADDED_FAVOURITES_PER_USER: 'get_added_favourites_per_user',
  GET_ADDED_FAVOURITES_PER_USER_FAILED:'get_added_favourites_per_user_failed',
  GET_ADDED_FAVOURITES_UNAUTHORISED: 'get_added_favourites_unauthorised',
  CLEAR_ADDED_FAVOURITES_PER_USER: 'clear_added_favourites_per_user'
};

export const clearAddedFavouritesPerUser = () => ({
  type: favouriteActionTypes.CLEAR_ADDED_FAVOURITES_PER_USER,
});

export const addFavourite =
  (favourite) =>
  async (dispatch, _getState, { orchestrationApi }) => {
    try {
      const res = await orchestrationApi.post('/favourites', favourite);
      dispatch({ type:favouriteActionTypes.FAVOURITE_ADD, payload: res.data });
      return res.data;
    } catch (e) {
      if (isError(e)) dispatch(showFullPageError());
      else if (isForbidden(e)) {
        dispatch({ type: favouriteActionTypes.FAVOURITE_ADD_UNAUTHORISED });
      } else {
        dispatch({ type: favouriteActionTypes.FAVOURITE_ADD_FAILED, error: e.response.data});
        throw e;
      }
    }
  };

export const getAddedFavouritesPerUser =
  () =>
  async (dispatch, getState, { orchestrationApi }) => {
    dispatch(dispatchClearErrors());

    let res;
    try {
      res = await orchestrationApi.get('/favourites');

      dispatch({ type: favouriteActionTypes.GET_ADDED_FAVOURITES_PER_USER, payload: res });
    } catch (e) {
      if (isError(e)) dispatch(showFullPageError());
      else if (isForbidden(e)) {
        dispatch({ type: favouriteActionTypes.GET_ADDED_FAVOURITES_UNAUTHORISED });
      } else {
        return dispatch({
          type: favouriteActionTypes.GET_ADDED_FAVOURITES_PER_USER_FAILED,
          payload: e.response,
        });
      }
    }
  };

export const removeFavourite =
  (favouriteId) =>
  (dispatch, getState, { orchestrationApi }) => {
    return orchestrationApi
      .delete(`/favourites/${favouriteId}`)
      .then(
        (res) => {
          let payload = res.data;
          dispatch(favouriteRemoved(payload));
        },
        (error) => {
          if (isForbidden(error)) {
            dispatch(favouriteUnauthorised());
          } else {
            dispatch(favouriteRemoveFailed(error.toString()));
          }
        }
      )
      .catch((err) => {
        dispatch(favouriteRemoveFailed(err));
        throw err;
      });

    function favouriteRemoved(payload) {
      return { type: favouriteActionTypes.FAVOURITE_REMOVED, payload };
    }
    function favouriteRemoveFailed(errorRes) {
      return { type: favouriteActionTypes.FAVOURITE_REMOVE_FAILED, errorRes };
    }
    function favouriteUnauthorised() {
      return { type: favouriteActionTypes.FAVOURITE_REMOVED_UNAUTHORISED };
    }
  };
