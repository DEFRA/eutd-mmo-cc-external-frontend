import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  Main,
  Header,
  MultiChoice,
  GridRow,
  GridCol
} from 'govuk-react';

import SelectRadio from '../../../components/elements/SelectRadio';

import PageTitle from '../../../components/PageTitle';
import {
  addTransport,
  getTransportDetails,
  clearTransportDetails,
  saveTransport,
  dispatchApiCallFailed,
  dispatchClearErrors,
  getExportCountry,
  getStorageNotesFromRedis
} from '../../../actions';

import {
  getLandingType
} from '../../../actions/landingsType.actions';

import { camelCaseToSpacedUpperCase } from '../../../helpers/string';
import { forwardUri } from '../../../helpers/vehicleRouteLookup';
import BackLinkWithErrorClearOut from '../../../components/elements/BackLinkWithErrorClearOut';
import { scrollToErrorIsland, onHandleErrorClick } from '../../utils';
import PageTemplateWrapper from '../../../components/PageTemplateWrapper';
import HelpLink from '../../../components/HelpLink';
import SaveAsDraftButton from '../../../components/SaveAsDraftButton';
import ContinueButton from '../../../components/elements/ContinueButton';
import ErrorIsland from '../../../components/elements/ErrorIsland';
import { catchCertificateJourney } from '../../../helpers/journeyConfiguration';
import displayProgressPage from './helpers/displayProgressPage';
import BackToProgressLink from '../../../components/BackToProgressLink';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

class TransportSelectionPage extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.props.clearTransportDetails();
    this.props.addTransport({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();

    try {
      const { path, journey } = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];
      const transport = await this.props.saveTransport(path, journey, false, documentNumber);

      // TODO - need to investigate dynamic routing here
      let to = forwardUri(transport.vehicle, this.props.route);

      this.props.history.push(to.replace(':documentNumber', documentNumber));
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    try {
      const { path, journey, saveAsDraftUri } = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];
      const isTransportSavedAsDraft = true;
      await this.props.saveTransport(path, journey, isTransportSavedAsDraft, documentNumber);
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
    this.props.history.push(landingsEntryUri.replace(':documentNumber', documentNumber));
  }

  hasLandingEntryOption() {
    const { getAddedLandingsType } = this.props;
    return getAddedLandingsType && getAddedLandingsType.landingsEntryOption !== null && getAddedLandingsType.generatedByContent === false;
  }

  componentDidMount = async () => {
    const { journey } = this.props.route;
    const documentNumber = this.props.match.params['documentNumber'];

    window.scrollTo(0, 0);
    try {
      await this.props.getTransportDetails(this.props.route.journey, documentNumber);
      await this.props.getExportCountry(documentNumber);
      await this.props.getFromRedis(documentNumber);

      if (journey === catchCertificateJourney) {
        await this.props.getLandingType(documentNumber);

        const isDirectLanding = this.props.getAddedLandingsType || {};

        if (isDirectLanding.landingsEntryOption === 'directLanding') {
          displayProgressPage(this.props);
          return;
        }

        if (!this.hasLandingEntryOption()) {
          this.displayLandingEntryOptions();
          return;
        }
      }

    } catch (e) {
      console.error(e);
    }
  };

  componentWillUnmount() {
    this.props.clearTransportDetails();
  }

  componentDidUpdate = () => {
    const { transport } = this.props;

    if (transport.unauthorised === true) {
      this.unauthorised();
    }


  };

  renderTransportOptions = () => {
    return this.props.route.vehicleTypes.map(type => {
      const typeInCaps = camelCaseToSpacedUpperCase(type);
      const label = {
        'Direct landing': 'Fishing vessel'
      }[typeInCaps] || typeInCaps;

      if (
        this.props.transport.vehicle &&
        type.toLowerCase() === this.props.transport.vehicle.toLowerCase()
      ) {
        return (
          <SelectRadio
            key={'vehicleType' + type}
            id={type}
            value={type}
            name="vehicle"
            defaultChecked
          >
            {t(label)}
          </SelectRadio>
        );
      }
      return (
        <SelectRadio
          key={'vehicleType' + type}
          id={type}
          value={type}
          name="vehicle"
        >
          {t(label)}
        </SelectRadio>
      );
    });
  };

  render = () => {
    const { vehicleError, errors } = this.props.errors;
    const { dispatchClearErrors: _dispatchClearErrors, history } = this.props;

    const saveAsDraftFormActionUrl = '/orchestration/api/v1/transport/add/saveAsDraft';

    const {
      title,
      previousUri,
      truckCmrUri,
      planeDetailsUri,
      trainDetailsUri,
      containerVesselDetailsUri,
      summaryUri,
      progressUri,
      journey,
      path,
      saveAsDraftUri
    } = this.props.route;

    const documentNumber = (this.props.match && this.props.match.params)
      ? this.props.match.params['documentNumber']
      : '';

    return (
      <Main>
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('commonTransportSelectionPageTitle')} - ${t(title)}`} />
        {errors && (
          <ErrorIsland
            errors={errors.map(err => ({
              message: t(err.text),
              key: err.targetName
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
              {t('commonTransportSelectionPageTitle')}
            </Header>
          </GridCol>
        </GridRow>

        <form
          action="/orchestration/api/v1/transport/add"
          method="POST"
          onSubmit={this.onSubmit}
        >
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="truckCmrUri" value={truckCmrUri} />
          <input type="hidden" name="planeDetailsUri" value={planeDetailsUri} />
          <input type="hidden" name="trainDetailsUri" value={trainDetailsUri} />
          <input
            type="hidden"
            name="containerVesselDetailsUri"
            value={containerVesselDetailsUri}
          />
          <input type="hidden" name="summaryUri" value={summaryUri} />
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />

          <GridRow>
            <GridCol>
              <div id="vehicle">
                <MultiChoice label={t('commonTransportSelectionSelectTypeTransportLabel')}
                  meta={{ touched: vehicleError, error: t(vehicleError) }}
                  onChange={this.onChange}
                >
                  <fieldset>
                    <legend className="visually-hidden">{t('commonTransportSelectionSelectTypeTransportLabel')}</legend>
                    {this.renderTransportOptions()}
                  </fieldset>
                </MultiChoice>
              </div>
            </GridCol>
          </GridRow>
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

function mapStateToProps(state) {
  return {
    errors: state.errors,
    transport: state.transport,
    exportLocation: state.exportLocation,
    exportPayload: state.exportPayload,
    storageNotes: state.storageNotes,
    getAddedLandingsType: state.landingsType,
  };
}

function loadData(store, journey) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }

  return store.dispatch(getTransportDetails(journey, this.documentNumber))
    .then(() => store.dispatch(getExportCountry(this.documentNumber)))
    .then(() => store.dispatch(getStorageNotesFromRedis(this.documentNumber)))
    .then(() => {
      if (journey === catchCertificateJourney) {
        store.dispatch(getLandingType(this.documentNumber));
      }
    });
}

export const component = withTranslation()(connect(
  mapStateToProps,
  {
    addTransport,
    dispatchClearErrors,
    getTransportDetails,
    saveTransport,
    clearTransportDetails,
    getExportCountry,
    getLandingType,
    getFromRedis: getStorageNotesFromRedis
  }
)(TransportSelectionPage));

TransportSelectionPage.propTypes = {
  transport: PropTypes.object.isRequired,
  errors: PropTypes.object,
  exportLocation: PropTypes.object
};

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
