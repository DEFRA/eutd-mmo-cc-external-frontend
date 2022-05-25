import React from 'react';
import HintText from '@govuk-react/hint-text';
import AccessibleAutoComplete from './AccessibleAutocomplete';
import Label from '@govuk-react/label';
import ErrorText from '@govuk-react/error-text';
import { useTranslation } from 'react-i18next';

const ExportDestination = (props) => {
  const {t} = useTranslation();

  const { name, defaultSelectMessage, exportDestination, countries, error, onChange } = props;

  const onConfirm = (country) => {
    if (!country) {
      let el = document.getElementById(name);
      if (el) {
        country = el.value;
      }
    }

    onChange(country);
  };

  return (
    <Label htmlFor={name} error={error}>
      {t('psWhatExportDestinationSelectTheDestinationCountry')}
      <HintText>
        {t('psWhatExportDestinationHintSelectTheDestinationCountry')}
      </HintText>

      { error && <ErrorText>{t(error)}</ErrorText>}

      <AccessibleAutoComplete
        id={name}
        name={name}
        defaultSelectMessage={defaultSelectMessage || ''}
        defaultValue={exportDestination?.officialCountryName || ''}
        nojsValues={countries}
        displayMenu="overlay"
        search={countrySearch(countries)}
        onConfirm={onConfirm}
      />
    </Label>
  );

};

export const countrySearch = (countries) => (searchQuery) => {
  return countries.filter(country => country.toLowerCase().includes(searchQuery.toLowerCase()));
};

export default ExportDestination;
