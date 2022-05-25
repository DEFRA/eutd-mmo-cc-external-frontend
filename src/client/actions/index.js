import { addProduct, removeProduct } from './export-payload.actions';
import { getAddedFavouritesPerUser } from './favourites.actions';

export const SEARCH_VESSELS = 'search_vessels';
export const SEARCH_FISH = 'search_fish';
export const SEARCH_FISH_STATES = 'search_fish_states';
export const SELECT_FISH = 'select_fish';
export const SEARCH_CATCHES = 'search_catches';
export const SEARCH_CATCHES_FAILED = 'search_catches_failed';
export const ADD_SELECTED_CATCHES = 'add_selected_catches';
export const GET_SELECTED_CATCHES = 'get_selected_catches';
export const AUGMENT_SELECTED_CATCH_VESSELS = 'augment_selected_catch_vessels';
export const DELETE_SINGLE_SELECTED_CATCH = 'delete_single_selected_catch';
export const DELETE_SELECTED_CATCHES = 'delete_selected_catches';
export const EDIT_SELECTED_CATCHES = 'edit_selected_catches';
export const SEARCH_COMMODITIES = 'search_commodities';
export const GET_ADDED_SPECIES_PER_USER = 'get_added_species_per_user';
export const EDIT_ADDED_SPECIES_PER_USER = 'edit_added_species_per_user';
export const EDIT_ADDED_SPECIES_PER_USER_UNAUTHORISED = 'edit_added_species_per_user_unauthorised';
export const GET_ADDED_SPECIES_PER_USER_FAILED = 'get_added_species_per_user_failed';
export const GET_ADDED_SPECIES_UNAUTHORISED = 'get_added_species_unauthorised';
export const CLEAR_ADDED_SPECIES_PER_USER = 'clear_added_species_per_user';
export const REMOVED_SPECIES_PER_USER = 'removed_species_per_user';
export const ADD_SPECIES_PER_USER = 'add_species_per_user';
export const ADD_SPECIES_PER_USER_FAILED = 'add_species_per_user_failed';
export const ADD_SPECIES_PER_USER_UNAUTHORISED = 'add_species_per_user_unauthorised';
export const ADDED_TO_FAVOURITES = 'added_to_favourites';
export const HIDE_ADDED_TO_FAVOURITES_NOTIFICATION = 'hide_added_to_favourites_notification';
export const CREATE_CATCHES_FAILED = 'create_catches_failed';
export const ADD_TRANSPORT = 'add_transport';
export const ADD_TRANSPORT_DETAILS = 'add_transport_details';
export const ADD_TRANSPORT_DETAILS_FAILED = 'add_transport_details_failed';
export const ADD_TRANSPORT_DETAILS_UNAUTHORISED = 'add_transport_details_unauthorised';
export const SAVE_TRANSPORT_DETAILS_UNAUTHORISED = 'save_transport_details_unauthorised';
export const SAVE_TRANSPORT_DETAILS_WAF_ERROR = 'save_transport_details_waf_error';
export const CLEAR_TRANSPORT_DETAILS = 'clearTransportDetails';
export const GET_SPECIES_STATES_FAILED = 'get_species_states_failed';
export const GET_SPECIES_STATES = 'get_species_states';
export const CLEAR_SPECIES_STATES = 'get_species_states_clear';
export const GET_SPECIES_PRESENTATIONS_FAILED = 'get_species_presentations_failed';
export const CLEAR_SPECIES_PRESENTATIONS = 'get_species_presentations_clear';
export const GET_SPECIES_PRESENTATIONS = 'get_species_presentations';
export const GET_COMMODITY_CODE = 'get_commodity_code';
export const CLEAR_ERRORS_PLANT_ADDRESS = 'CLEAR_ERRORS_PLANT_ADDRESS';
export const GET_POSTCODE_ADDRESSES = 'GET_POSTCODE_ADDRESSES';
export const SAVE_POSTCODE_LOOKUP_ADDRESS = 'SAVE_POSTCODE_LOOKUP_ADDRESS';
export const CLEAR_POSTCODE_LOOKUP_ADDRESS = 'CLEAR_POSTCODE_LOOKUP_ADDRESS';
export const POSTCODE_LOOKUP_UNAUTHORISED = 'POSTCODE_LOOKUP_UNAUTHORISED';
export const CLEAR_POSTCODE_LOOKUP_UNAUTHORISED = 'CLEAR_POSTCODE_LOOKUP_UNAUTHORISED';
export const SAVE_PROCESSING_STATEMENT = 'SAVE_PROCESSING_STATEMENT';
export const SAVE_PROCESSING_STATEMENT_UNAUTHORISED = 'SAVE_PROCESSING_STATEMENT_UNAUTHORISED';
export const SAVE_PROCESSING_STATEMENT_WAF_ERROR = 'SAVE_PROCESSING_STATEMENT_WAF_ERROR';
export const CLEAR_PROCESSING_STATEMENT = 'CLEAR_PROCESSING_STATEMENT';
export const SAVE_STORAGE_NOTES = 'SAVE_STORAGE_NOTES';
export const SAVE_STORAGE_NOTES_UNAUTHORISED = 'SAVE_STORAGE_NOTES_UNAUTHORISED';
export const SAVE_STORAGE_NOTES_WAF_ERROR = 'SAVE_STORAGE_NOTES_WAF_ERROR';
export const CLEAR_STORAGE_NOTES = 'CLEAR_STORAGE_NOTES';
export const ADD_TRUCK_CMR = 'add_truck_cmr';
export const ADD_CONSERVATION = 'add_conservation';
export const ADD_CONSERVATION_UNAUTHORISED = 'add_conservation_unauthorised';
export const ADD_CONSERVATION_WAF_ERROR = 'add_conservation_waf_error';
export const CLEAR_CONSERVATION = 'clear_conservation';
export const API_CALL_FAILED = 'api_call_failed';
export const BEGIN_API_CALL = 'begin_api_call';
export const CLEAR_ERRORS = 'clear_errors';
export const CLEAR_SPECIES_SEARCH_RESULTS = 'clear_species_search_results';
export const CLEAR_VESSELS_SEARCH_RESULTS = 'clear_vessels_search_results';
export const SAVE = 'save';
export const GET_DOCUMENT = 'get_document';
export const ADD_CONFIRM_DOCUMENT_DELETE = 'add_confirm_document_delete';
export const CLEAR_CONFIRM_DOCUMENT_DELETE = 'clear_confirm_document_delete';
export const CLEAR_CONFIRM_DOCUMENT_VOID = 'clear_confirm_document_void';
export const ADD_CONFIRM_DOCUMENT_VOID = 'add_confirm_document_void';
export const SHOW_INLINE_SUMMARY_ERRORS = 'show_inline_summary_errors';
export const ADD_SELECTED_EXPORT_COUNTRY = 'add_selected_export_country';
export const GET_EXPORT_COUNTRY = 'get_export_country';
export const GET_EXPORT_COUNTRY_UNAUTHORISED = 'get_export_country_unauthorised';
export const SAVE_EXPORT_COUNTRY_UNAUTHORISED = 'save_export_country_unauthorised';
export const CLEAR_EXPORT_COUNTRY = 'clear_export_country';
export const SHOW_INLINE_SUMMARY_ERRORS_PS_SD = 'show_inline_summary_errors_ps_sd';
export const CHANGE_PLANT_ADDRESS = 'change_plant_address';
export const CLEAR_CHANGE_PLANT_ADDRESS = 'clear_change_plant_address';
export const CHANGE_STORAGE_FACILITY_ADDRESS = 'change_storage_facility_address';

export * from './exporter.actions';
export * from './dynamics.actions';
export * from './export-certificate.actions';
export * from './export-payload.actions';

export const beginApiCall = () => {
  return {
    type: BEGIN_API_CALL
  };
};

export const apiCallFailed = (params) => {
  return {
    type: API_CALL_FAILED,
    payload: {
      ...params
    }
  };
};

export const dispatchClearErrors = () => (dispatch) => {
  return dispatch({
    type: CLEAR_ERRORS
  });
};

export const dispatchApiCallFailed = (params) => (dispatch) => {
  return dispatch({
    type: API_CALL_FAILED, payload: {
      data: params
    }
  });
};

export const saveProcessingStatement = (data) => (dispatch) => {
  dispatch({ type: SAVE_PROCESSING_STATEMENT, payload: data });
};

export const changePlantAddress = () => (dispatch) => {
  return dispatch({type: CHANGE_PLANT_ADDRESS});
};


export const clearChangePlantAddress = () => (dispatch) => {
  dispatch({type: CLEAR_CHANGE_PLANT_ADDRESS});
};

export const clearErrorsForPlantAddress = () => (dispatch) => {
  dispatch({type: CLEAR_ERRORS_PLANT_ADDRESS});
};

export const saveProcessingStatementToRedis = ({ data, currentUrl, saveToRedisIfErrors = true, saveAsDraft = false, documentNumber = undefined }) =>
  async (dispatch, getState, { orchestrationApi }) => {
  let res;
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};

  try {
    res = await orchestrationApi.post(`/processingStatement/saveAndValidate?c=${currentUrl}&saveToRedisIfErrors=${saveToRedisIfErrors}`, data, config);
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isSilverLineError(e)) {
      dispatch({ type: SAVE_PROCESSING_STATEMENT_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] });
      throw new Error(`Unauthorised access ${e.response.status}`);
    }
    if (isForbidden(e)) {
      dispatch({ type: SAVE_PROCESSING_STATEMENT_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response.status}`);
    } else {
      throw new Error(e.response);
    }
  }

  if (!res.data.errors) res.data.errors = {};

  if (saveAsDraft) {
    res.data.errors = {};
    res.data.error = '';
  }

  dispatch({ type: SAVE_PROCESSING_STATEMENT, payload: res.data });
  return res.data;
};

export const getProcessingStatementFromRedis = (documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  let res;
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};

  try {
    res = await orchestrationApi.get('/processingStatement', config);
    res.data.errors = {};
    res.data.error = '';
    dispatch({ type: SAVE_PROCESSING_STATEMENT, payload: res.data });

  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type: SAVE_PROCESSING_STATEMENT_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response.status}`);
    } else {
      throw new Error(e.response);
    }
  }

};

export const generateProcessingStatementPdf = (currentUrl, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  let res;
  const config = (documentNumber)
  ? { headers: { documentnumber: documentNumber } }
  : {};

  try {
    const clientip = await orchestrationApi.get('/client-ip');

    res = await orchestrationApi.post('/processingStatement/generatePdf', clientip, config);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event' : 'completedProcessingStatement'
    });
  } catch (e) {
    if (e.response.data.length > 0) {
      dispatch(showInlineSummaryErrorsPSSD(e.response.data));
    } else if( isError(e) ) dispatch(showFullPageError());
    throw new Error(e.response);
  }
  dispatch({ type: CLEAR_PROCESSING_STATEMENT });
  dispatch({ type: SAVE_PROCESSING_STATEMENT, payload: res.data });
};

//will call the reducers for PS and SD
export function showInlineSummaryErrorsPSSD(data) {
  return {type: SHOW_INLINE_SUMMARY_ERRORS_PS_SD, payload: { validationErrors: data} };
}

export const clearProcessingStatement = () => (dispatch) => {
  dispatch({ type: CLEAR_PROCESSING_STATEMENT });
};

export const saveStorageNotes = (data) => (dispatch) => {
  dispatch({ type: SAVE_STORAGE_NOTES, payload: data });
};

export const changeStorageFacilityAddress = (data) => (dispatch) => {
   return dispatch({type: CHANGE_STORAGE_FACILITY_ADDRESS, payload: data});
};


export const saveStorageNotesToRedis = ({ data, currentUrl, saveToRedisIfErrors = true, documentNumber = undefined }) => async (dispatch, getState, { orchestrationApi }) => {
  let res;
  const config = (documentNumber)
  ? { headers: { documentnumber: documentNumber }}
  : {};

  try {
    res = await orchestrationApi.post(`/storageNotes/saveAndValidate?c=${currentUrl}&saveToRedisIfErrors=${saveToRedisIfErrors}`, data, config);
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    if (isSilverLineError(e)) {
      dispatch({ type: SAVE_STORAGE_NOTES_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] });
      throw new Error(`Unauthorised access ${e.response}`);
    }
    if (isForbidden(e)) {
      dispatch({ type: SAVE_STORAGE_NOTES_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response}`);
    } else {
      throw new Error(e.response);
    }
  }

  if (!res.data.errors) res.data.errors = {};

  dispatch({ type: SAVE_STORAGE_NOTES, payload: res.data });
  return res.data;
};

export function isError(e) {
  return !(e.response && e.response.status === 400) && !(isForbidden(e));
}

export const isForbidden = (e) => (e.response && e.response.status === 403);
export const isSilverLineError = (e) => (isForbidden(e) && e.response.data.includes('Your support ID is'));

export const getStorageNotesFromRedis = (documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  let res;
  const config = (documentNumber)
  ? { headers: { documentnumber: documentNumber }}
  : {};

  try {
    res = await orchestrationApi.get('/storageNotes', config);
    res.data.errors = {};
    res.data.errorsUrl = '';
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type:SAVE_STORAGE_NOTES_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response}`);
    } else {
      throw new Error(e.response);
    }
  }

  dispatch({ type: SAVE_STORAGE_NOTES, payload: res.data });
  return res.data;
};

export const clearStorageNotes = (obj) => (dispatch) => {
  dispatch({ type: CLEAR_STORAGE_NOTES, payload: obj });
};

export const generateStorageNotesPdf = (currentUrl, documentNumber) => async (dispatch, getState, { orchestrationApi }) => {
  let res;
  const config = (documentNumber)
  ? { headers: { documentnumber: documentNumber } }
  : {};

  try {
    const clientip = await orchestrationApi.get('/client-ip');

    res = await orchestrationApi.post('/storageNotes/generatePdf', clientip, config);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event' : 'completedStorageDocs'
    });
  } catch (e) {
    if (e.response.data.length > 0) {
      dispatch(showInlineSummaryErrorsPSSD(e.response.data));
    } else if( isError(e) ) dispatch(showFullPageError());
    throw new Error(e.response);
  }
  dispatch({ type: SAVE_STORAGE_NOTES, payload: { pdf: res.data } });
};

export const searchVessels = (param, landedDate) => async (dispatch, getState, { referenceServiceApi }) => {
  const landedDateFormatted = landedDate ? landedDate.format().slice(0, 10) : '';

  const res = await referenceServiceApi.get('/vessels/search?searchTerm=' + (param || '') + '&landedDate=' + landedDateFormatted);
  dispatch({ type: SEARCH_VESSELS, payload: res });
};

export const getAllVessels = () => async (dispatch, getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get('/vessels');
  dispatch({ type: SEARCH_VESSELS, payload: res });
};

export const vesselSelectedFromSearchResult = () => (dispatch) => {
  dispatch({ type: CLEAR_VESSELS_SEARCH_RESULTS });
};


export const getAllUkFish = () => async (dispatch, getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get('/species?uk=Y');
  dispatch({ type: SAVE, payload: { allFish: res.data } });
  return res.data;
};

export const getAllFish = () => async (dispatch, getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get('/species');
  dispatch({ type: SAVE, payload: { allFish: res.data } });
  return res.data;
};

export const getAllCountries = () => async (dispatch, _getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get('/countries');
  let countries;

  if (res.data) {
     countries = res.data.map(country => country.officialCountryName);

    dispatch({
      type: SAVE, payload: {
        allCountries: countries
      }
    });

    dispatch({
      type: SAVE, payload: {
        allCountriesData: res.data
      }
    });
  }

  return countries;
};

export const searchFish = (param) => async (dispatch, getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get('/species/search?searchTerm=' + (param || ''));
  dispatch({ type: SEARCH_FISH, payload: res });
};

export const speciesSelectedFromSearchResult = () => (dispatch) => {
  dispatch({ type: CLEAR_SPECIES_SEARCH_RESULTS });
};

export const searchFishStates = (faoCode) => async (dispatch, getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get(`/speciesStateLookup?faoCode=${faoCode}`);

  if (res.data) {
    res.data = res.data.map(r => {
      const state = { value: r.state.code, label: r.state.description };
      const presentations = r.presentations.map(p => ({ value: p.code, label: p.description }));
      return { state, presentations };
    });
  }

  dispatch({ type: SEARCH_FISH_STATES, payload: res });
};

export const addSpeciesPerUser = (params, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  let res;

  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  if (params) {
    try {
      dispatch(beginApiCall());
      dispatch({ type: HIDE_ADDED_TO_FAVOURITES_NOTIFICATION });
      res = await orchestrationApi.post('/fish/add', params, config);
    } catch (e) {
      if (isError(e)) dispatch(showFullPageError());
      if (e.response.status === 403) {
        dispatch({ type: ADD_SPECIES_PER_USER_UNAUTHORISED });
      } else {
        if (params.addToFavourites) {
          dispatch(getAddedFavouritesPerUser());
        }
        dispatch(apiCallFailed(e.response));
        throw Error(e);
      }
    }
  }

  if (res && res.data && res.data.cancel) {
    // presently the species cancel button works by some generated id which could become out of sync :(
    // Need to do extra work in the orch service to make this work for the landings page
    dispatch(removeProduct(res.data.cancel, documentNumber));
    return dispatch({ type: REMOVED_SPECIES_PER_USER, payload: res });
  } else {
    if (res && res.data.commodity_code) {
      let prd = {
        id: res.data.id,
        commodityCode: res.data.commodity_code,
        presentation: {
          code: res.data.presentation,
          label: res.data.presentationLabel
        },
        state: {
          code: res.data.state,
          label: res.data.stateLabel
        },
        species: {
          code: res.data.speciesCode,
          label: res.data.species
        },
        scientificName: res.data.scientificName
      };
      dispatch(addProduct(prd, documentNumber));
    }

    if(res && res.data && res.data.addedToFavourites !== undefined) {
      dispatch({
        type: ADDED_TO_FAVOURITES,
        payload : {
          addedFavouriteProduct : res.data
        }
      });

      if (res.data.addedToFavourites) {
        dispatch(getAddedFavouritesPerUser());
      }
    }

    return dispatch({ type: ADD_SPECIES_PER_USER, payload: res });
  }
};

export const dispatchAddSpeciesPerUserError = (params) => (dispatch) => {
  return dispatch({
    type: ADD_SPECIES_PER_USER_FAILED, payload: {
      data: {
        message: '[' + params + ']'
      }
    }
  });
};

export const getAddedSpeciesPerUser = (documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  dispatch(dispatchClearErrors());

  let res;
  try {
    res = await orchestrationApi.get('/fish/added', config);

    dispatch({ type: GET_ADDED_SPECIES_PER_USER, payload: res });
  }
  catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (e.response.status === 403) {
      dispatch({ type: GET_ADDED_SPECIES_UNAUTHORISED });
    } else {
      return dispatch({ type: GET_ADDED_SPECIES_PER_USER_FAILED, payload: e.response });
    }
  }


  if (res.data && res.data.length > 0) {
    const species = res.data[res.data.length - 1];

    if (species.state) {
      return;
    }
  }

  dispatch({ type: CLEAR_SPECIES_STATES });
  dispatch({ type: CLEAR_SPECIES_PRESENTATIONS });
};

export const editAddedSpeciesPerUser = (productId, params, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  dispatch(dispatchClearErrors());
  dispatch({ type: HIDE_ADDED_TO_FAVOURITES_NOTIFICATION });
  let res;
  try {
    res = await orchestrationApi.put(`/fish/add/${productId}`, params, config);
  } catch (e) {
    if(isError(e))
      dispatch(showFullPageError());
    else {
      if (isForbidden(e)) {
        dispatch({ type: EDIT_ADDED_SPECIES_PER_USER_UNAUTHORISED });
      } else {
        dispatch(apiCallFailed(e.response));
      }
    }

    throw new Error(e.response);
  }
  if (res) {

    if(res.data.favourite !== undefined) {
      dispatch({
        type: ADDED_TO_FAVOURITES,
        payload : {
          addedFavouriteProduct : res.data.favourite
        }
      });

      if (res.data.favourite.addedToFavourites) {
        dispatch(getAddedFavouritesPerUser());
      }
    }

    return dispatch({ type: EDIT_ADDED_SPECIES_PER_USER, payload: res});
  }

};

export const saveAddedSpeciesPerUser = (documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    await orchestrationApi.post('/fish/added', {}, config)
      .then(() => {
        dispatch(dispatchClearErrors());
      });
  }
  catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (e.response.status === 403) {
      dispatch({ type: GET_ADDED_SPECIES_UNAUTHORISED });
      throw new Error(`Unauthorised access ${e.response.status}`);
    } else {
      dispatch(apiCallFailed(e.response));
      throw new Error(e);
    }
  }

};

export const clearAddedSpeciesPerUser = () => ({ type: CLEAR_ADDED_SPECIES_PER_USER });

export const getStatesFromReferenceService = () => async (dispatch, getState, { referenceServiceApi }) => {
  let listOfStates;
  try {
    listOfStates = await referenceServiceApi.get('/states');
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    dispatch({ type: GET_SPECIES_STATES_FAILED, payload: e.response });
  }
  dispatch({ type: GET_SPECIES_STATES, payload: listOfStates });

};

export const getPresentationsFromReferenceService = () => async (dispatch, getState, { referenceServiceApi }) => {
  let listOfPresentations;
  try {
    listOfPresentations = await referenceServiceApi.get('/presentations');
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    return dispatch({ type: GET_SPECIES_PRESENTATIONS_FAILED, payload: e.response });
  }
  return dispatch({ type: GET_SPECIES_PRESENTATIONS, payload: listOfPresentations });
};

export const getVersionInfo = () => async (dispatch, getState, { orchestrationApi }) => {
  const resp = await orchestrationApi.get('/version-info');
  await dispatch({type: SAVE, payload: {orchestrationVersionInfo: resp.data}});
};

export const getReferenceDataReaderVersionInfo = () => async (dispatch, getState, { referenceServiceApi }) => {
  const resp = await referenceServiceApi.get('/version-info');
  await dispatch({type: SAVE, payload: {referenceDataReaderVersionInfo: resp.data}});
};

export const addSelectedExportCountry = (data) => (dispatch, getState) => {
  data.exportedTo = getState().global.allCountriesData.find(
    (country) => country.officialCountryName === data.exportedTo
  );

  dispatch({ type: ADD_SELECTED_EXPORT_COUNTRY, payload: data });
};

export const saveExportCountry = (currentUri, nextUri, documentNumber = undefined, isSaveAsDraft = false) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  const path = isSaveAsDraft ? '/export-location/saveAsDraft' : '/export-location';

  try {
    await dispatch(beginApiCall());
    const exportLocation = await getState().exportLocation;
    await orchestrationApi.post(path, { ...exportLocation, currentUri, nextUri }, config);
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({type: SAVE_EXPORT_COUNTRY_UNAUTHORISED});
      throw new Error(`Unauthorised access ${e.response.status}`);
    } else {
      await dispatch(apiCallFailed(e.response));
    }

    if (!isSaveAsDraft) {
      throw new Error(e);
    }
  }
};

export const getExportCountry = (documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  let res;

  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    res = await orchestrationApi.get('/export-location', config);
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    if (isForbidden(e))
      dispatch({type: GET_EXPORT_COUNTRY_UNAUTHORISED});

    throw new Error(e.response);
  }
  return dispatch({ type: GET_EXPORT_COUNTRY, payload: res.data });
};

export const clearExportCountry = () => {
  return {
    type: CLEAR_EXPORT_COUNTRY
  };
};

export const getCommodityCode = (params) => async (dispatch, getState, { referenceServiceApi }) => {
  let commodityUrl = `/commodities/search?speciesCode=${params.speciesCode}&state=${params.state}&presentation=${params.presentation}`;
  let res = await referenceServiceApi.get(commodityUrl);

  return dispatch({ type: GET_COMMODITY_CODE, payload: res});
};

export const addConservation = (data) => (dispatch) => dispatch({ type: ADD_CONSERVATION, payload: { data } });
export const clearConservation = () => ({type: CLEAR_CONSERVATION});

export const saveConservation = (currentUri, nextUri, isConservationSavedAsDraft, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    await dispatch(beginApiCall());
    const conservation = await getState().conservation;

    await orchestrationApi.post('/conservation', { ...conservation, currentUri, nextUri }, config);
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isSilverLineError(e)) {
      dispatch({ type: ADD_CONSERVATION_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] });
    } else if (isForbidden(e)){
      dispatch({ type: ADD_CONSERVATION_UNAUTHORISED });
    } else {
      await dispatch(apiCallFailed(e.response));
    }
    if (!isConservationSavedAsDraft) throw new Error(e);
  }
};

export const getConservation = (documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  let res;

  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};
  try {
    res = await orchestrationApi.get('/conservation', config);
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type: ADD_CONSERVATION_UNAUTHORISED });
    }
    throw new Error(e.response);
  }
  return dispatch({ type: ADD_CONSERVATION, payload: res });
};

export const saveTransport = (currentUri, journey, isTransportSavedAsDraft = false, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    const { transport } = getState();
    await dispatch(beginApiCall());
    await orchestrationApi.post('/transport/add', { ...transport, currentUri, journey }, config);
    return transport;
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({type: SAVE_TRANSPORT_DETAILS_UNAUTHORISED});
      throw new Error(e);
    } else {
      await dispatch(apiCallFailed(e.response));
      if (!isTransportSavedAsDraft) throw new Error(e);
    }
  }
};

export const addTransport = (data) => (dispatch) => {
  dispatch({ type: ADD_TRANSPORT_DETAILS, payload: {} });
  dispatch({ type: ADD_TRANSPORT, payload: { data } });
};


export const saveConfirmDocumentDelete = (currentUri, nextUri, journey, documentNumber = undefined) => async (dispatch, getState, {orchestrationApi}) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    const { confirmDocumentDelete } = getState();
    const { documentDelete } = confirmDocumentDelete;
    await dispatch(beginApiCall());
    await orchestrationApi.post('/confirm-document-delete', { nextUri, journey, documentDelete }, config);
    await dispatch({ type: CLEAR_CONFIRM_DOCUMENT_DELETE});
    switch (journey) {
      case 'catchCertificate':
        await dispatch({ type: CLEAR_EXPORT_COUNTRY });
        await dispatch({ type: CLEAR_TRANSPORT_DETAILS });
        await dispatch({ type: CLEAR_CONSERVATION });
        break;
      case 'processingStatement':
        await dispatch({ type: CLEAR_PROCESSING_STATEMENT });
        break;
      case 'storageNotes':
        await dispatch({ type: CLEAR_STORAGE_NOTES });
        await dispatch({ type: CLEAR_TRANSPORT_DETAILS });
    }

    return documentDelete;
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    await dispatch(apiCallFailed(e.response));
    throw new Error(e);
  }
};

export const saveConfirmDocumentVoid = (documentNumber, currentUri, nextUri, journey) => async (dispatch, getState, {orchestrationApi}) => {
  const config = (documentNumber) ? { headers: { documentnumber: documentNumber }} : {};

  try {
    await dispatch(beginApiCall());
    const { confirmDocumentVoid } = getState();
    const { documentVoid } = confirmDocumentVoid;
    const ip = await orchestrationApi.get('/client-ip');
    const ipAddress = ip.data;
    await orchestrationApi.post('/void-certificate', { documentNumber, nextUri, journey, documentVoid:documentVoid, ipAddress}, config);
    await dispatch({ type: CLEAR_CONFIRM_DOCUMENT_VOID});
    return documentVoid;
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    await dispatch(apiCallFailed(e.response));
    throw new Error(e);
  }
};

export const addConfirmDocumentDelete = (data) => (dispatch) => {
  dispatch({ type: ADD_CONFIRM_DOCUMENT_DELETE, payload: data });
};

export const addConfirmDocumentVoid = (data) => (dispatch) => {
  dispatch({ type: ADD_CONFIRM_DOCUMENT_VOID, payload: data });
};

export const saveTruckCMR = (currentUri, journey, isTruckCMRSavedAsDraft=false, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? {headers: {documentnumber: documentNumber}}
    : {};

  try {
    await dispatch(beginApiCall());
    const transport = await getState().transport;
    await orchestrationApi.post('/transport/truck/cmr', { ...transport, currentUri, journey }, config);
    return transport;
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    await dispatch(apiCallFailed(e.response));
    if (!isTruckCMRSavedAsDraft) throw new Error(e.response);
  }
};

export const clearTransportDetails = () => {
  return {
    type: CLEAR_TRANSPORT_DETAILS
  };
};

export const addTransportDetails = (data) => (dispatch) => dispatch({ type: ADD_TRANSPORT_DETAILS, payload: { data } });

export function showFullPageError() {
  return {type: SAVE, payload: {showFullPageError: true} };
}

export function hideFullPageError() {
  return {type: SAVE, payload: {showFullPageError: false} };
}

export const saveTransportationDetails = (transportType, currentUri, nextUri, journey, isSaveAsDraft, documentNumber) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};

  try {
    await dispatch(beginApiCall());
    const transport = await getState().transport;

    await orchestrationApi.post(`/transport/${transportType}/details`, { ...transport, currentUri, nextUri, journey }, config);
  } catch (e) {
    if (isError(e)) dispatch(showFullPageError());
    if (isSilverLineError(e)) {
      dispatch({ type: SAVE_TRANSPORT_DETAILS_WAF_ERROR, supportID: e.response.data.match(/\d+/)[0] });
      throw new Error(e.response);
    }
    if (isForbidden(e))
      dispatch({ type: SAVE_TRANSPORT_DETAILS_UNAUTHORISED });
    else
      await dispatch(apiCallFailed(e.response));
    if (!isSaveAsDraft) throw new Error(e.response);
  }
};

export const getTransportDetails = (journey, documentNumber = undefined) => async (dispatch, getState, { orchestrationApi }) => {
  const config = (documentNumber)
    ? { headers: { documentnumber: documentNumber } }
    : {};

  try {
    let res = await orchestrationApi.get(`/transport/details/${journey}`, config);
    dispatch({ type: ADD_TRANSPORT_DETAILS, payload: res });
  } catch (e) {
    if(isError(e)) dispatch(showFullPageError());
    if (isForbidden(e)) {
      dispatch({ type: ADD_TRANSPORT_DETAILS_UNAUTHORISED });
    } else {
      await dispatch({ type: ADD_TRANSPORT_DETAILS_FAILED, payload: e.response });
    }

    throw new Error(e.response);
  }
};

export const searchUkFish = (param) => async (dispatch, getState, { referenceServiceApi }) => {
  const res = await referenceServiceApi.get('/species/search?uk=Y&searchTerm=' + (param || ''));
  dispatch({ type: SEARCH_FISH, payload: res });
};

export const getDocument = (service) => async (dispatch, getState, { orchestrationApi }) => {
  let res;
  try {
    res = await orchestrationApi.get(`/document?service=${service}`);
  } catch (e) {
    if( isError(e) ) dispatch(showFullPageError());
    throw new Error(e.response);
  }
  dispatch({ type: GET_DOCUMENT, payload: res });
};