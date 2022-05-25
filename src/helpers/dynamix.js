const querystring = require('querystring');
const _ = require('lodash');

export const buildUrl = (baseUrl, endpointBase, endpoint, params) => {
  return baseUrl + endpointBase + endpoint +
    (params ? '?' + querystring.stringify(params) : '');
};

export const parseContactsResponse = function (res) {
  let data = decodeResponse(res);
  data = Array.isArray(data.value) ? data.value : [data];
  // Put into databuckets
  const databuckets = data.map(d => {
    return {
      sub: d.defra_b2cobjectid,
      contactId: d.contactid,
      firstName: d.firstname,
      lastName: d.lastname,
      email: d.emailaddress1,
      telephoneNumber: d.telephone1, // @fixme This may be the mobile number if this is the only number supplied
      mobileNumber: d.telephone1,
      buildingname: d.defra_addrcorbuildingname,
      buildingnumber: d.defra_addrcorbuildingnumber,
      county: d.defra_addrcorcounty,
      dependentlocality: d.defra_addrcordependentlocality,
      internationalpostalcode: d.defra_addrcorinternationalpostalcode,
      locality: d.defra_addrcorlocality,
      postcode: d.defra_addrcorpostcode,
      street: d.defra_addrcorstreet,
      subbuildingname: d.defra_addrcorsubbuildingname,
      town: d.defra_addrcortown,
      uprn: d.defra_addrcoruprn,
      termsAcceptedVersion: parseOptionalInteger(d.defra_tacsacceptedversion),
      termsAcceptedOn: dateTimeStringToDate(d.defra_tacsacceptedon),
    };
  });
  return databuckets;
};

export const parseAddressResponse = function (res) {
  let data = decodeResponse(res);
  data = Array.isArray(data.value) ? data.value : [data];
  // Put into databuckets
  const databuckets = data.map(d => {

    let prem = d.defra_Address.defra_premises;
    if (prem && prem === 'null') {
      prem = null;
    }

    let newKeyName ;
    Object.keys(d.defra_Address).forEach(keyName => {
      newKeyName = keyName.replace(/\.|@/g,'_');
      d.defra_Address[newKeyName] = d.defra_Address[keyName];
      if (keyName !== newKeyName) delete d.defra_Address[keyName];
    });

    return {
      uprn: d.defra_Address.defra_uprn,
      buildingname: d.defra_Address.defra_buildingname,
      subbuildingname: d.defra_Address.defra_subbuildingname,
      premises: prem,
      street: d.defra_Address.defra_street,
      locality: d.defra_Address.defra_locality,
      dependentlocality: d.defra_Address.defra_dependentlocality,
      towntext: d.defra_Address.defra_towntext,
      county: d.defra_Address.defra_county,
      postcode: d.defra_Address.defra_postcode,
      countryId: d.defra_Address._defra_country_value,
      country: d.defra_Address._defra_country_value_OData_Community_Display_V1_FormattedValue,
      internationalpostalcode: d.defra_Address.defra_internationalpostalcode,
      fromcompanieshouse: d.defra_Address.defra_fromcompanieshouse,
      _dynamicsAddress: d.defra_Address
    };
  });
  return databuckets;
};

export const parseAccountsResponse = function (res) {
  let data = decodeResponse(res);
  data = Array.isArray(data.value) ? data.value : [data];
  // Put into databuckets
  const databuckets = data.map(d => {
    return {
      accountId: d.accountid,
      name: d.name,
      email: d.emailaddress1,
      uprn: d.defra_addrreguprn,
      buildingname: d.defra_addrregbuildingname,
      subbuildingname: d.defra_addrregsubbuildingname,
      buildingnumber: d.defra_addrregbuildingnumber,
      street: d.defra_addrregstreet,
      locality: d.defra_addrreglocality,
      towntext: d.defra_addrregtown,
      county: d.defra_addrregcounty,
      postcode: d.defra_addrregpostcode,
      countryId: d._defra_addrregcountry_value,
      country: 'blah',
      internationalpostalcode: d.defra_addrreginternationalpostalcode
    };
  });
  return databuckets;
};

const decodeResponse = (res) => {
  // First check the HTTP response
  if (!_.inRange(res.status, 200, 300)) {
    const message = `${res.request.path} - ${_.get(res, ['data', 'error', 'message'], res.statusText)}`;
    throw new Error(message);
  }
  // Check for unexpected response format
  let decodedPayload = {};

  try {
    // DELETE has an empty response
    if (res.data) {
      if (typeof res.data === 'string') {
        decodedPayload = JSON.parse(res.data);
      } else if (typeof res.data === 'object') {
        decodedPayload = res.data;
      }
    }
  } catch (err) {
    throw new Error(`Unrecognised JSON response from Dynamics: ${err.message}`);
  }

  // Check if there is a Dynamics error
  if (decodedPayload.error) {
    const errJson = decodedPayload.error;
    // @todo Parse Dynamics response to say something more specific e.g. Duplicated record
    throw new Error(errJson.message);
  }

  // Finally return the Dynamics
  return decodedPayload;
};

const parseOptionalInteger = (input) => {
  try {
    return Number.parseInt(input);
  } catch (err) {
    return undefined;
  }
};

/**
 * Parse a string in the format expected from Dynamics into a Javascript Date object
 * @param {string} input String in the expected format for a Dynamics datetime
 */
const dateTimeStringToDate = (input) => {
  // @fixme API actually returns date in ISO8601 rather than specified format so use native date parsing
  return new Date(input);
};