import React from 'react';
import { InputField, GridRow, GridCol } from 'govuk-react';
import SecondaryButton from './elements/SecondaryButton';
import { withTranslation } from 'react-i18next';

const ExporterPostcodeLookUp = ({
  onSubmit,
  errors,
  handleCancelButton,
  handleManualAddressClick,
  handleInputChange,
  postcode,
  t
}) => {

  const handleChange = (evt) => handleInputChange(evt.currentTarget.value);
  return (
    <>
      <GridRow>
        <GridCol>
          <InputField
            meta={{ error: t(errors.postcodeError), touched: true }}
            htmlFor={'postcode'}
            input={{
              id: 'postcode',
              className: 'smallInput',
              name: 'postcode',
              value: postcode,
              onChange: handleChange,
              onBlur: handleChange,
            }}
            hint={t('commonWhatExportersAddressEnterPostCodeHelpText')}
          >
            {t('commonWhatExportersAddressEnterPostCode')}
          </InputField>
        </GridCol>
      </GridRow>
      <GridRow>
        <SecondaryButton
          id="cancel"
          name="cancel"
          value="cancel"
          onClick={handleCancelButton}
        >
          {t('commonSecondaryButtonCancelButton')}
        </SecondaryButton>
        <GridCol>
          <button
            id="findAddress"
            className="button"
            onClick={() => { onSubmit(postcode); }}
          >
            {t('commonWhatExportersAddressFindAddress')}
          </button>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol columnTwoThirds>
          <button
              id="enter-address-manually-link"
              className="button-dressed-as-link enter-address-manually-link"
              onClick={(evt) => handleManualAddressClick(evt)}
            >
              {t('commonWhatExportersAddressEnterAddressManuallyLink')}
            </button>
        </GridCol>
      </GridRow>
    </>
  );
};

export default (withTranslation()(ExporterPostcodeLookUp));