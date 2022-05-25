import React from 'react';
import { GridRow, GridCol } from 'govuk-react';
import Select from '../../../node_modules/govuk-react-components/components/forms/select.js';
import SecondaryButton from './elements/SecondaryButton';
import ContinueButton from './elements/ContinueButton';
import { withTranslation } from 'react-i18next';

const steps = {
  NEXT: 'NEXT',
  PREV: 'PREV',
  SKIP: 'SKIP'
};

const SelectAddress = ({
  postcode,
  addresses,
  setSelectedAddress,
  handleCancelButton,
  handleSelectAddressNavigation,
  errors,
  t
}) => {
  const [address, setAddress] = React.useState('');

  const options = addresses && addresses.map(addr => addr.address_line);

  const nullOption = addresses && addresses.length
    ? `${addresses.length} ${addresses.length > 1 ? t('commonWhatExportersAddressMultipleAddressesFound') : t('commonWhatExportersAddressSingleAddressFound')}`
    : t('commonWhatExportersAddressNoAddressesFound');

  const handleChange = (evt) => {
    setAddress(evt.currentTarget.value);
    setSelectedAddress(evt.currentTarget.value);
  };

  return (
    <>
      <GridRow>
        <GridCol>
          <label className="heading-small">{t('commonWhatExportersAddressPostcode')}</label>
          <p>
            {postcode}
            <button
              id="selectAddressNavigationPrev"
              className="button-dressed-as-link"
              onClick={() => handleSelectAddressNavigation('PREV')}
            >
              {t('commonWhatExportersAddressChangeLink')}
            </button>
          </p>
          <span className="prop-dropdown state">
            <Select
              label={t('commonWhatExportersAddressSelectAddress')}
              name="selectAddress"
              id="selectAddress"
              value={address}
              error={t(errors.addressError)}
              defaultValue={address}
              options={options}
              onChange={handleChange}
              nullOption={nullOption}
              key={address}
            />
          </span>
        </GridCol>
      </GridRow>
      <GridRow>
        <SecondaryButton
          id="cancelSelectAddress"
          name="cancelSelectAddress"
          value="cancel"
          onClick={handleCancelButton}
        >
          {t('commonSecondaryButtonCancelButton')}
        </SecondaryButton>

        <ContinueButton
          id="continueSelectAddress"
          name="continueSelectAddress"
          label="Continue"
          onClick={() => handleSelectAddressNavigation(steps.NEXT)}
        >
          {t('commonContinueButtonContinueButtonText')}
        </ContinueButton>
      </GridRow>
      <GridRow>
        <GridCol>
          <p>
            <button
              id="selectAddressNavigationSkip"
              className="button-dressed-as-link"
              onClick={() => handleSelectAddressNavigation(steps.SKIP)}
            >
              {t('commonWhatExportersAddressAddressNotFoundText')}
            </button>
          </p>
        </GridCol>
      </GridRow>
    </>
  );
};

export default (withTranslation()(SelectAddress));