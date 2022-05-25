import React, {Fragment} from 'react';

export * from './errorUtils';


export function formatAddress( ...adresssLines) {
  return adresssLines.filter( a => a ).map( (a, index) => <Fragment key={index}>{a}<br/></Fragment> );
}

export function constructAddress(addressArray) {
  let address = '';
  if (addressArray.length === 4) {
    if (addressArray[0]) {
      address += addressArray[0];
    }
    if (addressArray[0] && addressArray[1]) {
      address += ' ';
    }
    if (addressArray[1]) {
      address += addressArray[1];
    }
    if (addressArray[2]) {
      address += ', ' + addressArray[2];
    }
    if (addressArray[3]) {
      address += '. ' + addressArray[3];
    }
  }
  return address;
}

export const hasAdminOverride = (exportPayload) => {
  const isLandingOverridden = (landing) =>
    landing &&
    landing.model &&
    landing.model.vessel &&
    landing.model.vessel.vesselOverriddenByAdmin;

  return exportPayload &&
    exportPayload.items &&
    exportPayload.items.some(
      (item) =>
        item.landings &&
        item.landings.some((landing) => isLandingOverridden(landing))
    )
    ? true
    : false;
};