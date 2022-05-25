import React from 'react';
import { withTranslation } from 'react-i18next';
import { LabelText, ErrorText } from 'govuk-react';
import DateFieldWithPicker from '../../../components/DateFieldWithPicker';
import Details from '../../../components/elements/Details';
import GovukVesselsAutocomplete from '../../../components/GovukVesselsAutocomplete';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

function AddVesselForm(props) {
  const faoAreas = [
    'FAO18',
    'FAO21',
    'FAO27',
    'FAO31',
    'FAO34',
    'FAO37',
    'FAO41',
    'FAO47',
    'FAO48',
    'FAO51',
    'FAO57',
    'FAO58',
    'FAO61',
    'FAO67',
    'FAO71',
    'FAO77',
    'FAO81',
    'FAO87',
    'FAO88',
  ];
  const {t} = useTranslation();

  const {
    dateLanded,
    onDateChange,
    dateLandedValue,
    faoArea,
    onFaoChange,
    vessel,
    vesselOptions,
    searchVessels,
    onVesselChange,
    clearSearchResults,
    errors = {}
  } = props;


  const splitErrorParams = (error) => {
    const isErrorWithParams = error.includes('-');
    const splitError = error.split('-');
    return isErrorWithParams ? t(splitError[0], {dynamicValue :splitError[1]}) : t(error);
  };


  const errorTranslate = (errs) => {
    let errorData = {};
    if(!isEmpty(errs)) {
      for (const key of Object.keys(errs)) {
        errorData[key] = splitErrorParams(errs[key]);
      }
    }
    return errorData;
  };

  const errorsData = errorTranslate(errors);

  let dateLandedRestrictionError;
  if (errors.dateLandedError) {
    let params = {};
    const dateLandedErrArray = errors.dateLandedError.split('-');
    if (dateLandedErrArray[0] == 'ccAddLandingDateLandedRestrictedError') {
      params = { product: dateLandedErrArray[1] };
    } else if (
      dateLandedErrArray[0] ==
      'ccUploadFilePageTableDateLandedFutureMaximumDaysError'
    ) {
      params = { dynamicValue: dateLandedErrArray[1] };
    }

    dateLandedRestrictionError = t(dateLandedErrArray[0], params);
  }


  const parsedDate = moment(dateLanded, ['YYYY-M-D', 'YYYY-MM-DD'], true);

  const vesselLandedDate = parsedDate.isValid() ? parsedDate : null;

  const setVessel = (term, item) => {
    if (term !== t('ccAddVesselFormVesselQueryPrompt') && term !== t('ccAddVesselFormVesselDateQueryPrompt')) {
      if (item && item.vesselName) {
        onVesselChange({ ...item });
      } else {
        onVesselChange({ label: term });
      }
    }
  };

  const getItems = (vessels) => {
    if (!vesselLandedDate) {
      vessels = [];
    }

    if (
      Array.isArray(vessels) &&
      vessels.length === 0 &&
      (!vessel.label || vessel.label.length < 2)
    ) {
      vessels.push({
        label: vesselLandedDate ? t('ccAddVesselFormVesselQueryPrompt') : t('ccAddVesselFormVesselDateQueryPrompt'),
      });
    }
    return vessels;
  };

  return (
    <div className="add-landings-form">
       <DateFieldWithPicker
        id='dateLanded'
        errors={dateLandedRestrictionError || errorsData.dateLandedError}
        onDateChange={onDateChange}
        dateFormat='YYYY-MM-DD'
        labelText={t('ccAddLandingDateLandedLabel')}
        labelTextClass='label-landings-form'
        date={dateLandedValue}
      />
      <LabelText className="label-landings-form">{t('ccAddLandingCatchAreaLabel')}</LabelText>
      {errorsData.faoAreaError && <ErrorText>{errorsData.faoAreaError}</ErrorText>}
      <select
        className={`autocomplete__input--default faoArea ${errorsData.faoAreaError ? 'autocomplete__error' : 'autocomplete__input'}`}
        id="select-faoArea"
        name="faoArea"
        value={faoArea}
        onChange={onFaoChange}
        style={{ backgroundColor: 'white' }}
      >
        {faoAreas.map((area) => (
          <option key={area} id={'faoArea_' + area} value={area}>
            {area}
          </option>
        ))}
      </select>
      <LabelText className="label-landings-form">{t('ccAddLandingVesselNameLabel')}</LabelText>
      <GovukVesselsAutocomplete
        onChange={setVessel}
        error={errorsData}
        hideErrorMessage={false}
        search={searchVessels}
        selectedItemName={vessel.label || ''}
        searchResults={getItems(vesselOptions || [])}
        getItem={(item) => item.label}
        clearSearchResults={clearSearchResults}
        controlName="vessel.vesselName"
        controlId="select-vessel"
        dateLanded={vesselLandedDate}
        hideBorder={true}
        translate={t}
      />
      <Details
        summary={t('ccAddLandingHelpSectionLinkText')}
        details={t('ccAddLandingHelpSectionContent')}
      />
    </div>
  );
}

export default withTranslation() (AddVesselForm);
