import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, upperFirst } from 'lodash';

import {
  addTransportDetails,
  saveTransportationDetails,
  dispatchApiCallFailed,
  getTransportDetails,
  dispatchClearErrors,
  clearTransportDetails,
} from '../../../actions';

import { getLandingType } from '../../../actions/landingsType.actions';

import { Main, Header, InputField, GridRow, GridCol } from 'govuk-react';

import PageTitle from '../../../components/PageTitle';
import BackLinkWithErrorClearOut from '../../../components/elements/BackLinkWithErrorClearOut';

import { scrollToErrorIsland, onHandleErrorClick } from '../../utils';
import PageTemplateWrapper from '../../../components/PageTemplateWrapper';
import HelpLink from '../../../components/HelpLink';
import SaveAsDraftButton from '../../../components/SaveAsDraftButton';
import ContinueButton from '../../../components/elements/ContinueButton';
import ErrorIsland from '../../../components/elements/ErrorIsland';
import DateFieldWithPicker from '../../../components/DateFieldWithPicker';
import { catchCertificateJourney } from '../../../helpers/journeyConfiguration';
import displayProgressPage from './helpers/displayProgressPage';
import BackToProgressLink from '../../../components/BackToProgressLink';
import { withTranslation } from 'react-i18next';

class TransportDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportDateString: '',
    };
  }

  onChange = (e) => {
    this.props.addTransportDetails({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { path, nextUri, journey, transportType } = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];

      await this.props.saveTransportationDetails(transportType, path, nextUri, journey, false, documentNumber);

      this.props.history.push(
        nextUri.replace(':documentNumber', documentNumber)
      );
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    try {
      const { path, nextUri, journey, saveAsDraftUri, transportType } =
        this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];

      await this.props.saveTransportationDetails(transportType, path, nextUri, journey, true, documentNumber);

      this.props.history.push(saveAsDraftUri);
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  displayLandingEntryOptions() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { landingsEntryUri } = this.props.route;
    this.props.history.push(
      landingsEntryUri.replace(':documentNumber', documentNumber)
    );
  }

  hasLandingEntryOption() {
    const { getAddedLandingsType } = this.props;
    return (
      getAddedLandingsType &&
      getAddedLandingsType.landingsEntryOption !== null &&
      getAddedLandingsType.generatedByContent === false
    );
  }

  hasRequiredData() {
    const { transportType } = this.props.route;

    if (transportType === 'truck') {
      return (
        !isEmpty(this.props.transport) && !isEmpty(this.props.transport.cmr)
      );
    } else {
      return !isEmpty(this.props.transport);
    }
  }

  isDirectLanding() {
    return (
      !isEmpty(this.props.getAddedLandingsType) &&
      this.props.getAddedLandingsType.landingsEntryOption === 'directLanding'
    );
  }

  componentDidMount = async () => {
    const { journey } = this.props.route;
    const documentNumber = this.props.match.params['documentNumber'];
    window.scrollTo(0, 0);

    try {
      await this.props.getTransportDetails(journey, documentNumber);

      this.setState({
        exportDateString: this.props.transport.exportDate,
      });

      if (journey === catchCertificateJourney) {
        await this.props.getLandingType(documentNumber);

        if (!this.hasLandingEntryOption()) {
          this.displayLandingEntryOptions();
          return;
        }

        if (this.isDirectLanding()) {
          displayProgressPage(this.props);
          return;
        }
      }

      if (!this.hasRequiredData()) {
        displayProgressPage(this.props);
      }
    } catch (e) {
      console.error(e);
    }
  };

  componentWillUnmount() {
    this.props.clearTransportDetails();
    this.props.dispatchClearErrors();
  }

  componentDidUpdate() {
    const { transport } = this.props;

    if (transport.unauthorised === true) {
      this.unauthorised();
    }
  }

  render = () => {
    const {
      errors,
      flightNumberError,
      containerNumberError,
      railwayBillNumberError,
      vesselNameError,
      flagStateError,
      departurePlaceError,
      exportDateError,
      nationalityOfVehicleError,
      registrationNumberError,
      njEditError,
    } = checkProps(this.props.errors);

    let {
      flightNumber,
      containerNumber,
      nationalityOfVehicle,
      registrationNumber,
      departurePlace,
      cmr,
      railwayBillNumber,
      vesselName,
      flagState,
    } = this.props.transport;

    const { vehicle } = this.props.transport;

    const {
      tempFlightNumberError,
      tempContainerNumberError,
      tempRailwayBillNumberError,
      tempVesselNameError,
      tempFlagStateError,
      tempNationalityOfVehicleError,
      tempRegistrationNumberError,
      tempDeparturePlaceError,
    } = this.props.errors;

    const { exportDateString } = this.state;
    const {
      dispatchClearErrors: _dispatchClearErrors,
      history,
      t,
    } = this.props;
    const {
      title,
      previousUri,
      path,
      nextUri,
      journey,
      showExportDate,
      saveAsDraftUri,
      progressUri,
      transportType,
    } = this.props.route;
    const { documentNumber } = this.props.match.params;

    const transportTypeText = transportType === 'containerVessel' ? 'commonAddTransportationDetailsContainerVessel' : `commonAddTransportationDetails${upperFirst(transportType)}`;
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/transport/${transportType}/details/saveAsDraft`;
    const postUrl = `/orchestration/api/v1/transport/${transportType}/details`;
    const labelTextClass = `label-${upperFirst(transportType)}DetailPage-form`;

    if (njEditError) {
      if (tempFlightNumberError !== null) {
        flightNumber = tempFlightNumberError;
      }
      if (tempContainerNumberError !== null) {
        containerNumber = tempContainerNumberError;
      }
      if (tempNationalityOfVehicleError !== null) {
        nationalityOfVehicle = tempNationalityOfVehicleError;
      }
      if (tempRegistrationNumberError !== null) {
        registrationNumber = tempRegistrationNumberError;
      }
      if (tempRailwayBillNumberError !== null) {
        railwayBillNumber = tempRailwayBillNumberError;
      }
      if (tempVesselNameError !== null) {
        vesselName = tempVesselNameError;
      }
      if (tempFlagStateError !== null) {
        flagState = tempFlagStateError;
      }
      if (tempDeparturePlaceError !== null) {
        departurePlace = tempDeparturePlaceError;
      }
    }

    return (
      <Main>
        <PageTitle
          title={`${
            !isEmpty(errors) ? `${t('commonPageTitleErrorText')} ` : ''
          }${t('commonAddTransportationDetailsTransportDetailsTitle')} ${t(
            transportTypeText
          )} - ${t(title)}`}
        />

        {errors && (
          <ErrorIsland
            errors={errors.map((err) => ({
              message: t(err.text),
              key: err.targetName,
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}

        <GridRow>
          <GridCol>
            <BackLinkWithErrorClearOut
              backUri={previousUri.replace(':documentNumber', documentNumber)}
              clearErrors={_dispatchClearErrors}
              history={history}
              labeltext={t('commonBackLinkBackButtonLabel')}
            />
            <Header>
              {t('commonAddTransportationDetailsTransportDetailsTitle')}{' '}{t(transportTypeText)}
            </Header>
          </GridCol>
        </GridRow>

        <form action={postUrl} method="POST" onSubmit={this.onSubmit}>
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="nextUri" value={nextUri} />
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="vehicle" value={vehicle} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />
          {transportType === 'truck' && (
            <input type="hidden" name="cmr" value={cmr} />
          )}

          {transportType === 'containerVessel' && (
            <>
              <GridRow>
                <GridCol>
                  <InputField
                    input={{
                      id: 'vesselName',
                      name: 'vesselName',
                      value: vesselName,
                      autoComplete: 'off',
                    }}
                    htmlFor={'vesselName'}
                    meta={{
                      touched: t(vesselNameError),
                      error: t(vesselNameError),
                    }}
                    onChange={this.onChange}
                  >
                    {t('commonAddTransportationDetailsVesselNameText')}
                  </InputField>
                </GridCol>
              </GridRow>
              <GridRow>
                <GridCol>
                  <InputField
                    input={{
                      id: 'flagState',
                      name: 'flagState',
                      value: flagState,
                      autoComplete: 'off',
                    }}
                    htmlFor={'flagState'}
                    meta={{
                      touched: t(flagStateError),
                      error: t(flagStateError),
                    }}
                    onChange={this.onChange}
                  >
                    {t('commonAddTransportationDetailsFlagStateText')}
                  </InputField>
                </GridCol>
              </GridRow>
            </>
          )}

          {transportType === 'plane' && (
            <GridRow>
              <GridCol>
                <InputField
                  input={{
                    id: 'flightNumber',
                    name: 'flightNumber',
                    value: flightNumber,
                    autoComplete: 'off',
                  }}
                  htmlFor={'flightNumber'}
                  meta={{
                    touched: t(flightNumberError),
                    error: t(flightNumberError),
                  }}
                  onChange={this.onChange}
                >
                  {t('commonAddTransportationDetailsFlightnumber')}
                </InputField>
              </GridCol>
            </GridRow>
          )}

          {(transportType === 'plane' ||
            transportType === 'containerVessel') && (
            <GridRow>
              <GridCol>
                <InputField
                  input={{
                    id: 'containerNumber',
                    name: 'containerNumber',
                    value: containerNumber,
                    autoComplete: 'off',
                    className:'largeInput'
                  }}
                  htmlFor={'containerNumber'}
                  meta={{
                    touched: t(containerNumberError),
                    error: t(containerNumberError),
                  }}
                  onChange={this.onChange}
                >
                  {t(
                    'commonAddTransportationDetailsContainerIdentificationText'
                  )}
                </InputField>
              </GridCol>
            </GridRow>
          )}

          {transportType === 'truck' && (
            <>
              <GridRow>
                <GridCol>
                  <InputField
                    input={{
                      autoComplete: 'off',
                      id: 'nationalityOfVehicle',
                      name: 'nationalityOfVehicle',
                      value: nationalityOfVehicle,
                    }}
                    meta={{
                      touched: t(nationalityOfVehicleError),
                      error: t(nationalityOfVehicleError),
                    }}
                    onChange={this.onChange}
                    htmlFor={'nationalityOfVehicle'}
                  >
                    {t('sdAddTransportationDetailsTruckNationality')}
                  </InputField>
                </GridCol>
              </GridRow>
              <GridRow>
                <GridCol>
                  <InputField
                    input={{
                      autoComplete: 'off',
                      id: 'registrationNumber',
                      name: 'registrationNumber',
                      value: registrationNumber,
                    }}
                    meta={{
                      touched: t(registrationNumberError),
                      error: t(registrationNumberError),
                    }}
                    onChange={this.onChange}
                    htmlFor={'registrationNumber'}
                  >
                    {t('sdAddTransportationDetailsRegistrationNumber')}
                  </InputField>
                </GridCol>
              </GridRow>
            </>
          )}

          {transportType === 'train' && (
            <GridRow>
              <GridCol>
                <InputField
                  input={{
                    id: 'railwayBillNumber',
                    name: 'railwayBillNumber',
                    value: railwayBillNumber,
                    autoComplete: 'off',
                  }}
                  htmlFor={'railwayBillNumber'}
                  meta={{
                    touched: t(railwayBillNumberError),
                    error: t(railwayBillNumberError),
                  }}
                  onChange={this.onChange}
                >
                  {t('sdAddTransportationDetailsRailwayBillNumber')}
                </InputField>
              </GridCol>
            </GridRow>
          )}

          <GridRow>
            <GridCol>
              <InputField
                input={{
                  id: 'departurePlace',
                  name: 'departurePlace',
                  value: departurePlace,
                  autoComplete: 'off',
                }}
                htmlFor={'departurePlace'}
                meta={{
                  touched: t(departurePlaceError),
                  error: t(departurePlaceError),
                }}
                onChange={this.onChange}
                hint={[t('commonAddTransportationDetailsForExampleHint')]}
              >
                {t('commonAddTransportationDetailsPlaceExportLeavesUK')}
              </InputField>
            </GridCol>
          </GridRow>
          {showExportDate && (
            <GridRow>
              <GridCol columnTwoThirds>
                <DateFieldWithPicker
                  id="exportDate"
                  name="exportDate"
                  errors={t(exportDateError)}
                  onDateChange={this.onChange}
                  dateFormat="DD/MM/YYYY"
                  date={exportDateString || ''}
                  labelText={t('commonAddTransportationDetailsExportDate')}
                  labelTextClass={labelTextClass}
                />
              </GridCol>
            </GridRow>
          )}
          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            />
            <ContinueButton id="continue" type="submit">
              {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey} />
      </Main>
    );
  };
}

function checkProps(data) {
  let { errors, njEditError, njEdit } = data;

  if (errors !== undefined && (njEditError || njEdit)) {
    const tempDetails = [
      'tempFlightNumber',
      'tempDeparturePlace',
      'tempContainerNumber',
      'tempNationalityOfVehicle',
      'tempRegistrationNumber',
      'tempRailwayBillNumber',
      'tempVesselName',
      'tempFlagState',
      'tempExportDate',
    ];

    errors.map((item) => {
      if (
        tempDetails.includes(item.targetName) ||
        item.targetName === 'njEdit' ||
        item.targetName === 'undefined'
      ) {
        delete item.text;
        delete item.targetName;
      }
    });
  }

  return data;
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    transport: state.transport,
    getAddedLandingsType: state.landingsType,
  };
}

function loadData(store, journey) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }
  return store
    .dispatch(getTransportDetails(journey, this.documentNumber))
    .then(() => {
      if (journey === catchCertificateJourney) {
        store.dispatch(getLandingType(this.documentNumber));
      }
    });
}

export const component = connect(mapStateToProps, {
  addTransportDetails,
  saveTransportationDetails,
  getTransportDetails,
  dispatchApiCallFailed,
  dispatchClearErrors,
  clearTransportDetails,
  getLandingType,
})(withTranslation()(TransportDetailsPage));

TransportDetailsPage.propTypes = {
  transport: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
