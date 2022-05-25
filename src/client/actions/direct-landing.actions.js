import { beginApiCall, apiCallFailed, isForbidden, showFullPageError, CLEAR_ERRORS, isSilverLineError } from './index';
import { exportPayloadActionTypes } from '../actions';


export const GET_DIRECT_LANDING_PRODUCTS = 'get_direct_landing_products';
export const CLEAR_DIRECT_LANDING = 'clear_direct_landing';
export const DIRECT_LANDING_PRODUCTS_FAILED = 'direct_landing_products_failed';
export const POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED = 'post_direct_landing_products_unauthorised';
export const GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED = 'get_direct_landing_products_unauthorised';
export const POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR = 'post_direct_landing_prodcts_waf_error';

export const getDirectLandings =
  (documentNumber) =>
  async (dispatch, _getState, { orchestrationApi }) => {
    const config = { headers: { documentnumber: documentNumber } };

    try {
      dispatch(beginApiCall());

      const res = await orchestrationApi.get(
        '/export-certificates/export-payload/direct-landings',
        config
      );

      await dispatch({ type: GET_DIRECT_LANDING_PRODUCTS, payload: res.data });
    } catch (e) {
      if (isForbidden(e)) {
        dispatch({ type: GET_DIRECT_LANDING_PRODUCTS_UNAUTHORISED });
      } else {
        dispatch(apiCallFailed(e.response));
        throw new Error(
          `An error has occurred ${e.response.status} (${e.response.statusText})`
        );
      }
    }
  };

export const clearDirectLanding = () => ({ type: CLEAR_DIRECT_LANDING });

export const upsertDirectLanding = (landing, documentNumber = undefined) => (dispatch, getState, { orchestrationApi } ) => {
  const config = (documentNumber)
    ? {
        headers: {
          documentnumber: documentNumber
        }
    }
    : {};

  return orchestrationApi.post('/export-certificates/direct-landing/validate', landing, config)
    .then(
      res => {
        dispatch(landingUpserted(res.data));
        dispatch(clearErrors());
      },
      error => {
        if (error.response.status === 400) {
          dispatch(landingUpserted(error.response.data));
          throw new Error();
        } else if (isSilverLineError(error)) {
          dispatch({ type: POST_DIRECT_LANDING_PRODUCTS_WAF_ERROR, supportID: error.response.data.match(/\d+/)[0] });
        } else if (isForbidden(error)) {
          dispatch({ type: POST_DIRECT_LANDING_PRODUCTS_UNAUTHORISED });
        } else {
          dispatch(showFullPageError());
        }
      });

  function landingUpserted(exportPayload) { return { type: exportPayloadActionTypes.LANDING_UPSERTED, exportPayload, errors: exportPayload.errors }; }
  function clearErrors() { return { type: CLEAR_ERRORS }; }
};
