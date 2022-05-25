import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

 const LookupAddress = ({
  addressOne,
  townCity,
  postcode,
  addressType,
  changeAddressLink,
  changeAddressHandler,
  unsavedFacilityName
}) => {
  const {t} = useTranslation();
  return (
  _.isEmpty(addressOne) && _.isEmpty(postcode) ? (
    <>
      <p id="lookup-address">{t('sdAddStorageFacilityDetailsAddressText', {addressType: addressType})}</p>
      <p id="address-link-wrapper">
        <Link
          id="add-lookup-address-link"
          className="change-address-link"
          to={changeAddressLink}
           onClick={() => changeAddressHandler({unsavedFacilityName}) }
        >
          {t('sdAddStorageFacilityDetailsAddAddressText', {addressType: addressType})}
        </Link>
      </p>
    </>
  ) : (
    <>
        <p id="lookup-address">
        {addressOne}
        <br />
        {townCity}
        <br />
        {postcode}
      </p>
      <p id="address-link-wrapper">
        <Link
            id="change-lookup-address-link"
          className="change-address-link"
          to={changeAddressLink}
         onClick={() => changeAddressHandler() }
        >
          {t('commonWhatExportersAddressChangeLink')}
          <span className="govuk-visually-hidden">{t('sdFacilityDetailsVHiddenChangeText')} {t('sdFacilityDetailsVHiddenAddressText')}</span>
        </Link>
      </p>
    </>
  )
 )  
}

export default LookupAddress