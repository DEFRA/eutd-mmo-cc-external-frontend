import React, { Component } from 'react';
import {
  InputField,
  GridRow,
  GridCol,
  Label
} from 'govuk-react';

import SecondaryButton from './elements/SecondaryButton';
import AccessibleAutoComplete from '../components/AccessibleAutocomplete';
import ErrorText from '@govuk-react/error-text';
import {withTranslation} from 'react-i18next';

export default withTranslation() (class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subBuildingName: '',
      buildingNumber: '',
      buildingName: '',
      streetName: '',
      townCity: '',
      county: '',
      postcode: '',
      country: ''
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: (e.target.value),
    });
  };

  countrySearch = (countries) => (searchQuery) => {
    return countries.filter(country => country.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  onConfirm = (country) => {
    if (!country) {
      let el = document.getElementById('country');
      if (el) {
        this.setState({
          country: el.value
        });
      }
      return;
    }
    this.setState({
      country
    });
  };

  componentDidMount() {
    const { preSelected } = this.props;

    this.setState({
      buildingNumber: preSelected ? preSelected.building_number : '',
      subBuildingName: preSelected ? preSelected.sub_building_name : '',
      buildingName: preSelected ? preSelected.building_name : '',
      streetName: preSelected ? preSelected.street_name : '',
      townCity: preSelected ? preSelected.city : '',
      county: preSelected ? preSelected.county : '',
      postcode: preSelected ? preSelected.postCode : '',
      country: preSelected ? preSelected.country : ''
    });
  }

  render() {
    const {
      subBuildingName,
      buildingNumber,
      buildingName,
      streetName,
      townCity,
      county,
      postcode,
      country,
    } = this.state;

    const { onSubmit, errors, countries, t } = this.props;

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(this.state);
      }}>
        <GridRow>
          <GridCol>
            <InputField
              meta={{
                error: t(errors.subBuildingNameError),
                touched: true
              }}
              htmlFor={'subBuildingName'}
              input={{
                id: 'subBuildingName',
                className: 'mediumInput',
                name: 'subBuildingName',
                value: subBuildingName,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
              hint={t('commonWhatExportersAddressSubBuildingNameHint')}
            >
              {t('commonWhatExportersAddressSubBuildingName')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <InputField
              meta={{
                error: t(errors.buildingNumberError),
                touched: true
              }}
              htmlFor={'buildingNumber'}
              input={{
                id: 'buildingNumber',
                className: 'smallInput',
                name: 'buildingNumber',
                value: buildingNumber,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
            >
            {t('commonWhatExportersAddressBuildingNumber')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <InputField
              meta={{
                error: t(errors.buildingNameError),
                touched: true
              }}
              htmlFor={'buildingName'}
              input={{
                id: 'buildingName',
                className: 'mediumInput',
                name: 'buildingName',
                value: buildingName,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
            >
              {t('commonWhatExportersAddressBuildingName')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol >
            <InputField
              meta={{
                error: t(errors.streetNameError),
                touched: true
              }}
              htmlFor={'streetName'}
              input={{
                id: 'streetName',
                className: 'mediumInput',
                name: 'streetName',
                value: streetName,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
            >
               {t('commonWhatExportersAddressStreetName')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol >
            <InputField
              meta={{
                error: t(errors.townCityError),
                touched: true
              }}
              htmlFor={'townCity'}
              input={{
                id: 'townCity',
                className: 'mediumInput',
                name: 'townCity',
                value: townCity,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
            >
              {t('commonWhatExportersAddressTownOrCity')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <InputField
              meta={{
                error: t(errors.countyError),
                touched: true
              }}
              htmlFor={'county'}
              input={{
                id: 'county',
                className: 'mediumInput',
                name: 'county',
                value: county,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
            >
              {t('commonWhatExportersAddressCountyStateProvince')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <InputField
              meta={{
                error: t(errors.postcodeError),
                touched: true
              }}
              htmlFor={'postcode'}
              input={{
                id: 'postcode',
                className: 'smallInput',
                name: 'postcode',
                value: postcode,
                onChange: e => this.onChange(e),
                onBlur: e => this.onChange(e)
              }}
            >
              {t('commonWhatExportersAddressPostcode')}
            </InputField>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol >
            <Label htmlFor={'Country'} error={errors.countryError}>
              {t('commonWhatExportersAddressCountry')}
              <div style={{ maxWidth: '23em' }}>
                {errors && <ErrorText>{t(errors.countryError)}</ErrorText>}
                <AccessibleAutoComplete
                  error={errors.countryError}
                  id={'country'}
                  name='country'
                  defaultSelectMessage={''}
                  defaultValue={country || ''}
                  nojsValues={countries}
                  displayMenu="overlay"
                  search={this.countrySearch(countries)}
                  onConfirm={this.onConfirm}
                />

              </div>
            </Label>

          </GridCol>
        </GridRow>

        <GridRow>
          <SecondaryButton
            type="button"
            id="cancel"
            name="cancel"
            value="cancel"
            onClick={this.props.handleCancelButton}
          >
            {t('commonSecondaryButtonCancelButton')}
          </SecondaryButton>
          <GridCol>
            <button
              id="submit"
              className="button"
            >
             {t('commonContinueButtonContinueButtonText')}
            </button>
          </GridCol>
        </GridRow>
      </form>
    );
  }
});

