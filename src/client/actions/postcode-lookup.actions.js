import {
  isError,
  isForbidden,
  showFullPageError,
  apiCallFailed,
  dispatchClearErrors,
  CLEAR_POSTCODE_LOOKUP_ADDRESS,
  CLEAR_POSTCODE_LOOKUP_UNAUTHORISED
} from './index';

import {GET_POSTCODE_ADDRESSES, SAVE_POSTCODE_LOOKUP_ADDRESS, POSTCODE_LOOKUP_UNAUTHORISED } from '../actions';
import {postcodeLookupContexts} from '../../../src/client/pages/common/LookupAddressPage';

export const findExporterAddress = (postcode) => async (dispatch, _getState, { referenceServiceApi }) => {

  try {
    const res = await referenceServiceApi.get(`/addresses/search?postcode=${postcode}`);
    dispatch({ type: GET_POSTCODE_ADDRESSES, payload: res.data });
    await dispatch(dispatchClearErrors());
    return res.data;
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type: POSTCODE_LOOKUP_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response.status} ${e.response.statusText}`);
    } else {
      dispatch(apiCallFailed(e.response));
    }
  }
};

export const clearErrors = () => (dispatch) =>  {
  dispatch({ type: CLEAR_POSTCODE_LOOKUP_UNAUTHORISED });
  dispatch(dispatchClearErrors());
};

export const clearPostcodeLookupAddress = () => (dispatch) =>  dispatch({type:CLEAR_POSTCODE_LOOKUP_ADDRESS});

export const saveManualLookupAddress = (manualAddressArgs) => async (dispatch, getState, {orchestrationApi}) => {
  const {state, documentNumber, context } = manualAddressArgs;
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    return await orchestrationApi.post('/exporter-validate', state, config)
      .then(res => {
        let payload = res.data;
        if (context === postcodeLookupContexts.PROCESSING_PLANT_ADDRESS && payload) {
          payload = {
            plantAddressOne: addressOneTransformer(
              payload.buildingNumber, payload.subBuildingName,
              payload.buildingName,
              payload.streetName),
            plantBuildingName: payload.buildingName || '',
            plantBuildingNumber: payload.buildingNumber || '',
            plantSubBuildingName: payload.subBuildingName || '',
            plantStreetName: payload.streetName || '',
            plantTownCity: payload.townCity || '',
            plantCounty: payload.county || '',
            plantCountry: payload.country || '',
            plantPostcode: payload.postcode || '',
          };
        }
        if (context === postcodeLookupContexts.STORAGE_FACILITY_ADDRESS && payload) {
          payload = {
            facilityAddressOne: addressOneTransformer(
              payload.buildingNumber, payload.subBuildingName,
              payload.buildingName,
              payload.streetName),
            facilityBuildingName: payload.buildingName || '',
            facilityBuildingNumber: payload.buildingNumber || '',
            facilitySubBuildingName: payload.subBuildingName || '',
            facilityStreetName: payload.streetName || '',
            facilityTownCity: payload.townCity || '',
            facilityCounty: payload.county || '',
            facilityCountry: payload.country || '',
            facilityPostcode: payload.postcode || '',
          };
        }

        const action = { payload, type: SAVE_POSTCODE_LOOKUP_ADDRESS };
        dispatch(action);
        dispatch(dispatchClearErrors());
        return payload;
      });
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type: POSTCODE_LOOKUP_UNAUTHORISED });
      throw new Error(`An error has occurred ${e.response.status} (${e.response.statusText})`);
    } else {
      await dispatch(apiCallFailed(e.response));
    }
  }
};

export const addressOneTransformer = (buildingNumber, subBuildingName, buildingName, streetName) => {
    const addressOne = [
    buildingNumber,
    subBuildingName,
    buildingName,
    streetName].filter(part => part !== undefined && part !== null && part !== '' && part.trim() !== '')
    .join(', ');

  return addressOne;
};
