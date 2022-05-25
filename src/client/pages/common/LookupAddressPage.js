import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Main, Header } from 'govuk-react';
import _ from 'lodash';
import ErrorIsland from '../../components/elements/ErrorIsland';
import { onHandleErrorClick, scrollToErrorIsland } from '../utils';
import { findExporterAddress, clearErrors, saveManualLookupAddress } from '../../actions/postcode-lookup.actions';
import { getAllCountries } from '../../actions';
import { getLandingType } from '../../actions/landingsType.actions';
import HelpLink from '../../components/HelpLink';
import PageTitle from '../../components/PageTitle';
import AddAddressForm from '../../components/AddAddressForm';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import ExporterPostcodeLookUp from '../../components/ExporterPostcodeLookUp';
import SelectAddress from '../../components/SelectAddress';
import { catchCertificateJourney } from '../../helpers/journeyConfiguration';
import { withTranslation } from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

export const postcodeLookupContexts = {
  EXPORTER_ADDRESS: 'EXPORTER ADDRESS',
  PROCESSING_PLANT_ADDRESS: 'PROCESSING STATEMENT PLANT ADDRESS',
  STORAGE_FACILITY_ADDRESS: 'STORAGE DOCUMENT STORAGE FACILITY ADDRESS',
};

export const NAVIGATION_STAGES = {
  SEARCH_POSTCODE: 'searchPostCode',
  SELECTED_ADDRESS: 'selectedAddress',
  MANUAL_ADDRESS: 'manualAddress',
};

export const STAGES = {
  NEXT: 'NEXT',
  PREV: 'PREV',
  SKIP: 'SKIP'
};

class LookupAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postcode: '',
      steps: NAVIGATION_STAGES.SEARCH_POSTCODE,
      addresses: [],
      selectedAddress: '',
      selectedAddressError: {},
    };
  }

  // will find a uk postcode address
  async handleExporterAddressClick(postCode) {
    try {
      const addresses = await this.props.findExporterAddress(postCode);
      this.setState({ steps: NAVIGATION_STAGES.SELECTED_ADDRESS, addresses });
    } catch (err) {
      scrollToErrorIsland();
    }
  }

  handleManualAddressSubmit = async (state) => {
    const removeTrailingComma = (str) =>
      (str) ? str.replace(/,\s*$/, '') : str;

    for (const [key, value] of Object.entries(state)) {
      state[key] = removeTrailingComma(value);
    }

    const {nextUri, postcodeLookupContext } = this.props.route;

    const {documentNumber, facilityIndex } = this.props.match.params;
    const { history } = this.props;
    const { country = '' } = state;
    const countryData = this.props.countriesData.find(c => c.officialCountryName.toLowerCase() === country.toLowerCase());

    let manualAddressPayload = {
      state: {
        ...state,
        isoCodeAlpha2: countryData ? countryData.isoCodeAlpha2 : undefined,
        isoCodeAlpha3: countryData ? countryData.isoCodeAlpha3 : undefined,
        isoNumericCode: countryData ? countryData.isoNumericCode : undefined
      },
      documentNumber,
      context: postcodeLookupContext
    };

    let payload = await this.props.saveManualLookupAddress(manualAddressPayload);
    let nextLocation = _.isEmpty(facilityIndex)?
            nextUri.replace(':documentNumber', documentNumber)
          : nextUri.replace(':documentNumber', documentNumber).replace(':facilityIndex', facilityIndex);

    if (payload) {
      history.push(nextLocation);
    } else {
      scrollToErrorIsland();
    }
  }

  handleSelectAddressNavigation(direction) {
    const { selectedAddress } = this.state;
    switch (direction) {
      case STAGES.SKIP:
        this.props.clearErrors();
        this.setState({
          selectedAddressError: '',
          steps: NAVIGATION_STAGES.MANUAL_ADDRESS,
        });
        break;

      case STAGES.NEXT:
        if (selectedAddress === '') {
          this.setState({
            selectedAddressError: {
              errors: [
                {
                  text: 'commonLookupAddressPageErrorSelectedAddress',
                  targetName: 'selectAddress',
                },
              ],
              addressError: 'commonLookupAddressPageErrorSelectedAddress',
            },
          }, () => scrollToErrorIsland());
        } else {
          this.setState({
            selectedAddressError: '',
            steps: NAVIGATION_STAGES.MANUAL_ADDRESS,
          });
        }
        break;

      case STAGES.PREV:
        this.setState({
          selectedAddressError: '',
          selectedAddress: '',
          steps: NAVIGATION_STAGES.SEARCH_POSTCODE,
        });
        break;
    }
  }

  handleManualAddressClick() {
    this.props.clearErrors();
    this.setState({ ...this.state, steps: NAVIGATION_STAGES.MANUAL_ADDRESS });
  }

  handleInputChange(postcode) {
    this.setState({ postcode });
  }

  hasErrors() {
    const { exporter = {} } = this.props;
    const { errors } = exporter;
    if (errors !== undefined) {
      return errors.errors && errors.errors.length > 0;
    }
    return false;
  }

  selectedAddressHandler = (selectedAddress) => this.setState({ selectedAddress });

  displayLandingEntryOptions() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { landingsEntryUri } = this.props.route;
    this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
  }

  hasLandingEntryOption() {
    const { landingsType } = this.props;
    return landingsType && landingsType.landingsEntryOption !== null && landingsType.generatedByContent === false;
  }

  async componentDidMount() {
    if (this.props.route.journey === catchCertificateJourney) {
      const { documentNumber } = this.props.match.params;

      await this.props.getLandingType(documentNumber);

      if (!this.hasLandingEntryOption()) {
        this.displayLandingEntryOptions();
      }
    }

    await this.props.getAllCountries();
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.unauthorised === true) {
      this.unauthorised();
    }

    if (prevState.selectedAddress != this.state.selectedAddress) {
      const { selectedAddress, addresses } = this.state;
      const addressFound = addresses.find(addr => addr.address_line === selectedAddress);

      this.setState({ selectedAddressForEdit: addressFound });
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render = () => {
    const {
      route,
      errors = {},
      match: {
        params: { documentNumber, facilityIndex },
      },
      history,
      countries,
      t
    } = this.props;
    const {
      journey,
      previousUri,
      postcodeLookupAddressTitle,
      title,
      progressUri
    } = route;

    const { steps, postcode, addresses, selectedAddressError } = this.state;

    const renderPage = () => {
      switch (steps) {
        case NAVIGATION_STAGES.SEARCH_POSTCODE:
          return (
            <ExporterPostcodeLookUp
              onSubmit={(e) => this.handleExporterAddressClick(e)}
              postCodeError={errors}
              handleManualAddressClick={(e) => {
                e.preventDefault();
                this.handleManualAddressClick();
              }}
              handleInputChange={this.handleInputChange.bind(this)}
              handleCancelButton={(e) => {
                e.preventDefault();
                !_.isEmpty(facilityIndex) ?
                  history.push(previousUri.replace(':documentNumber', documentNumber).replace(':facilityIndex', facilityIndex)) :
                  history.push(previousUri.replace(':documentNumber', documentNumber));
              }}
              postcode={postcode}
              errors={errors}
            />
          );
        case NAVIGATION_STAGES.SELECTED_ADDRESS:
          return (
            <SelectAddress
              postcode={postcode}
              errors={selectedAddressError}
              addresses={addresses}
              setSelectedAddress={this.selectedAddressHandler.bind(this)}
              handleCancelButton={(e) => {
                e.preventDefault();
                !_.isEmpty(facilityIndex) ?
                  history.push(previousUri.replace(':documentNumber', documentNumber).replace(':facilityIndex', facilityIndex)) :
                  history.push(previousUri.replace(':documentNumber', documentNumber));
              }}
              handleSelectAddressNavigation={this.handleSelectAddressNavigation.bind(
                this
              )}
            />
          );
        case NAVIGATION_STAGES.MANUAL_ADDRESS:
          return <AddAddressForm
            errors={errors}
            onSubmit={this.handleManualAddressSubmit}
            countries={countries}
            preSelected={this.state.selectedAddressForEdit}
            handleCancelButton={(e) => {
              e.preventDefault();
              !_.isEmpty(facilityIndex) ?
              history.push(previousUri.replace(':documentNumber', documentNumber).replace(':facilityIndex', facilityIndex)):
              history.push(previousUri.replace(':documentNumber', documentNumber));
            }} />;
      }
    };

    return (
      <Main>
        <PageTitle
          title={`${this.hasErrors() ? 'Error: ' : ''}${t(postcodeLookupAddressTitle)} - ${t(title)}`}
        />
        {errors &&
          !_.isEmpty(errors) &&
          errors.errors &&
          errors.errors.length > 0 && (
            <ErrorIsland
              errors={errors.errors.map((err) => ({
                message: t(err.text),
                key: err.targetName,
              }))}
              onHandleErrorClick={onHandleErrorClick}
            />
          )}
          {selectedAddressError &&
          !_.isEmpty(selectedAddressError) &&
          selectedAddressError.errors &&
          selectedAddressError.errors.length > 0 && (
            <ErrorIsland
              errors={selectedAddressError.errors.map((err) => ({
                message: t(err.text),
                key: err.targetName,
              }))}
              onHandleErrorClick={onHandleErrorClick}
            />
          )}
        <Header>{t(postcodeLookupAddressTitle)}</Header>
        {renderPage()}
          <BackToProgressLink
            progressUri={progressUri}
            documentNumber={documentNumber}
          />
        <HelpLink journey={journey} />
      </Main>
    );
  };
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    countries: state.global.allCountries,
    countriesData: state.global.allCountriesData,
    postcodeLookup: state.postcodeLookup,
    unauthorised: state.postcodeLookup.unauthorised,
    landingsType: state.landingsType,
  };
}

function loadData(store) {
  return store.dispatch(getAllCountries());
}

export const component = withRouter(
  connect(mapStateToProps, {
    findExporterAddress,
    clearErrors,
    getAllCountries,
    saveManualLookupAddress,
    getLandingType,
  })(withTranslation()(LookupAddressPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
