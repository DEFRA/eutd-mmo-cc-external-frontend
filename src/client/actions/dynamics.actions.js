const {parseContactsResponse, parseAddressResponse, parseAccountsResponse} = require('../../helpers/dynamix');

export const dynamicsActionTypes = {
  USER_DETAILS_REQUESTED: 'user-details/requested',
  USER_DETAILS_LOADED: 'user-details/loaded',
  USER_DETAILS_FAILED: 'user-details/failed',
  ADDRESS_DETAILS_REQUESTED: 'address-details/requested',
  ADDRESS_DETAILS_LOADED: 'address-details/loaded',
  ADDRESS_DETAILS_FAILED: 'address-details/failed',
  ACCOUNT_DETAILS_REQUESTED: 'account-details/requested',
  ACCOUNT_DETAILS_LOADED: 'account-details/loaded',
  ACCOUNT_DETAILS_FAILED: 'account-details/failed',
  EXPORTER_NAME_PRE_LOADED: 'export-certificate/exporter-name-preloaded',
  EXPORTER_ADDRESS_PRE_LOADED: 'export-certificate/exporter-address-preloaded',
  EXPORTER_ADDRESS_PRE_LOAD_FAILED: 'export-certificate/exporter-address-preload-failed',
  EXPORTER_COMPANY_NAME_PRE_LOADED: 'export-certificate/exporter-company-name-preloaded'
};


export const fetchUserDetailsFromDynamics = () => async (dispatch, getState, { dynamixApi } ) => {
  const url = '/user-details';
  try {
    const res = await dynamixApi.get(url);
    let userdetails = parseContactsResponse(res);
    dispatch(success(userdetails));
    if (userdetails && userdetails.length > 0) {
      dispatch(exporterNamePreloaded(userdetails[0].firstName, userdetails[0].lastName, userdetails[0].contactId));
    }
  } catch(error) {
    dispatch(failed('Failed server call to get user details'));
  }

  function success(userdetails) { return { type: dynamicsActionTypes.USER_DETAILS_LOADED, userdetails }; }
  function failed(error) { return { type: dynamicsActionTypes.USER_DETAILS_FAILED, error }; }
  function exporterNamePreloaded(firstName, lastName, contactId) { return { type: dynamicsActionTypes.EXPORTER_NAME_PRE_LOADED, firstName, lastName, contactId }; }
};

export const fetchAccountDetailsFromDynamics = () => async (dispatch, getState, { dynamixApi } ) => {
  function success(accounts) { return { type: dynamicsActionTypes.ACCOUNT_DETAILS_LOADED, accounts }; }
  function failed(error) { return { type: dynamicsActionTypes.ACCOUNT_DETAILS_FAILED, error }; }
  function exporterCompanyNamePreloaded(name, accountId) { return { type: dynamicsActionTypes.EXPORTER_COMPANY_NAME_PRE_LOADED, name, accountId }; }
  const url = '/accounts';

  try {
    const res = await dynamixApi.get(url);
    let accounts = parseAccountsResponse(res);
    dispatch(success(accounts));
    if (accounts && accounts.length > 0) {
      dispatch(exporterCompanyNamePreloaded(accounts[0].name, accounts[0].accountId));
    }
  } catch(error) {
    dispatch(failed('Failed server call to get account details'));
  }
};

export const fetchAddressDetailsFromDynamics = () => (dispatch, getState, { dynamixApi } ) => {
  const url = '/addresses';
  return dynamixApi.get(url)
    .then(
      res => {
        let addresses = parseAddressResponse(res);
        dispatch(success(addresses));
        if (addresses && addresses.length > 0) {
          dispatch(exporterAddressPreloaded(addresses[0]));
        }
      }
    )
    .catch((error) => {
      console.error(error);
      dispatch(failed('Failed server call to get address details'));
      dispatch(exporterAddressPreloadFailed());
    });

  function success(addresses) { return { type: dynamicsActionTypes.ADDRESS_DETAILS_LOADED, addresses }; }
  function failed(error) { return { type: dynamicsActionTypes.ADDRESS_DETAILS_FAILED, error }; }
  function exporterAddressPreloaded(address) { return { type: dynamicsActionTypes.EXPORTER_ADDRESS_PRE_LOADED, address }; }
  function exporterAddressPreloadFailed() { return { type: dynamicsActionTypes.EXPORTER_ADDRESS_PRE_LOAD_FAILED }; }
};

export const getAddressArrayFromDynamicsResponse = function(dynamicsResponse) {

  let addressArray = [];
  let addrOne = '';

  if (dynamicsResponse.address.premises && dynamicsResponse.address.premises !== null && dynamicsResponse.address.premises.length > 0) {
    addrOne += dynamicsResponse.address.premises;
    addrOne += ', ';
  }

  if (dynamicsResponse.address.subbuildingname && dynamicsResponse.address.subbuildingname !== null && dynamicsResponse.address.subbuildingname.length > 0) {
    addrOne += dynamicsResponse.address.subbuildingname;
    addrOne += ', ';
  }

  if (dynamicsResponse.address.buildingname && dynamicsResponse.address.buildingname !== null && dynamicsResponse.address.buildingname.length > 0) {
    addrOne += dynamicsResponse.address.buildingname;
    addrOne += ', ';
  }

  if (dynamicsResponse.address.street && dynamicsResponse.address.street !== null && dynamicsResponse.address.street.length > 0) {
    var partsOfStr = dynamicsResponse.address.street.split(',');
    if (partsOfStr.length > 1) {
      addrOne += partsOfStr[0].trim();
      addressArray.push(addrOne);
      addressArray.push(dynamicsResponse.address.street.slice(partsOfStr[0].length + 1).trim());
    } else {
      addrOne += dynamicsResponse.address.street;
      addressArray.push(addrOne);
    }
  } else {
    addressArray.push(addrOne);
  }

  if (dynamicsResponse.address.locality && dynamicsResponse.address.locality != null && dynamicsResponse.address.locality.length > 0) {
    addressArray.push(dynamicsResponse.address.locality);
  }
  if (dynamicsResponse.address.dependantLocality && dynamicsResponse.address.dependantLocality != null && dynamicsResponse.address.dependantLocality.length > 0) {
    addressArray.push(dynamicsResponse.address.dependantLocality);
  }
  if (dynamicsResponse.address.towntext && dynamicsResponse.address.towntext != null && dynamicsResponse.address.towntext.length > 0) {
    addressArray.push(dynamicsResponse.address.towntext);
  }
  if (dynamicsResponse.address.county && dynamicsResponse.address.county != null && dynamicsResponse.address.county.length > 0) {
    addressArray.push(dynamicsResponse.address.county);
  }

  return addressArray;
};

export const getAddressModelFromDynamicsResponse = function(dynamicsResponse) {

  let addressArray = getAddressArrayFromDynamicsResponse(dynamicsResponse);
  let model = {};
  model.addressOne = addressArray[0];

  if (dynamicsResponse.address.postcode && dynamicsResponse.address.postcode != null && dynamicsResponse.address.postcode.length > 0) {
    model.postcode = dynamicsResponse.address.postcode;
  } else if (dynamicsResponse.address.internationalpostalcode && dynamicsResponse.address.internationalpostalcode != null
    && dynamicsResponse.address.internationalpostalcode.length > 0) {
    model.postcode = dynamicsResponse.address.internationalpostalcode;
  }

  model._dynamicsAddress = dynamicsResponse.address._dynamicsAddress;

  let arrLength = addressArray.length;
  if (arrLength > 1) {
    model.townCity = addressArray[arrLength - 1];
    arrLength = arrLength - 1;
  }

  let addrTwo = '';
  if (arrLength > 1) {
    for (let idx = 1; idx < arrLength; idx++) {
      addrTwo += addressArray[idx];
      if (idx < arrLength - 1) {
        addrTwo += ', ';
      }
    }
  }
  model.addressTwo = addrTwo;
  model.buildingNumber = dynamicsResponse.address.premises;
  model.subBuildingName = dynamicsResponse.address.subbuildingname;
  model.buildingName = dynamicsResponse.address.buildingname;
  model.streetName = dynamicsResponse.address.street;
  model.townCity = dynamicsResponse.address.towntext || dynamicsResponse.address.locality;
  model.county = dynamicsResponse.address.county;
  model.country = dynamicsResponse.address.country;

  return model;
};

export const dynamicsActions = {
  fetchUserDetailsFromDynamics,
  fetchAccountDetailsFromDynamics,
  fetchAddressDetailsFromDynamics
};

