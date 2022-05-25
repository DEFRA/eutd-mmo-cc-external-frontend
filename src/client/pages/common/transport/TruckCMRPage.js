import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import HintText from '@govuk-react/hint-text';
import { isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';

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
  addTransportDetails,
  saveTruckCMR,
  dispatchClearErrors,
  dispatchApiCallFailed,
  getTransportDetails,
  clearTransportDetails
} from '../../../actions';

import {
  getLandingType
} from '../../../actions/landingsType.actions';

import BackLinkWithErrorClearOut from '../../../components/elements/BackLinkWithErrorClearOut';
import { scrollToErrorIsland, onHandleErrorClick} from '../../utils';
import PageTemplateWrapper from '../../../components/PageTemplateWrapper';
import HelpLink from '../../../components/HelpLink';
import SaveAsDraftButton from '../../../components/SaveAsDraftButton';
import ContinueButton from '../../../components/elements/ContinueButton';
import ErrorIsland from '../../../components/elements/ErrorIsland';
import { catchCertificateJourney } from '../../../helpers/journeyConfiguration';
import BackToProgressLink from '../../../components/BackToProgressLink';
class TruckCMRPage extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.props.addTransportDetails({ [e.target.name]: e.target.value });
  };

  onContinue = async e => {
    e.preventDefault();
    try {
      const { summaryUri, truckDetailsUri, path, journey } = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];
      const transport = await this.props.saveTruckCMR(path, journey, false, documentNumber);
      if (transport.cmr === 'true') {
        this.props.history.push(summaryUri.replace(':documentNumber', documentNumber));
      } else {
        this.props.history.push(truckDetailsUri.replace(':documentNumber', documentNumber));
      }
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    try {
      const { path, journey, saveAsDraftUri } = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];

      const isTruckCMRSavedAsDraft = true;
      await this.props.saveTruckCMR(path, journey, isTruckCMRSavedAsDraft, documentNumber);

      this.props.history.push(saveAsDraftUri);
    } catch (error) {
      scrollToErrorIsland();
    }
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  displayDashboardOptions() {
    this.props.history.push(this.props.route.saveAsDraftUri);
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

  hasRequiredData() {
    const { transport } = this.props;
    return !isEmpty(transport);
  }

  isDirectLanding() {
    return !isEmpty(this.props.getAddedLandingsType) && this.props.getAddedLandingsType.landingsEntryOption === 'directLanding';
  }

  componentWillUnmount() {
    this.props.clearTransportDetails();
  }

  componentDidMount = async () => {
    const { journey, progressUri } = this.props.route;
    const documentNumber = this.props.match.params['documentNumber'];
    window.scrollTo(0, 0);

    try {
      await this.props.getTransportDetails(this.props.route.journey, documentNumber);

      // requiredData for the last page in the journey
      if (!this.hasRequiredData() || this.props.transport.vehicle != 'truck') {
        this.props.history.push(progressUri.replace(':documentNumber', documentNumber));
        return;
      }

      if (journey === catchCertificateJourney) {
        await this.props.getLandingType(documentNumber);

        if (!this.hasLandingEntryOption()) {
          this.displayLandingEntryOptions();
          return;
        }

        if (this.isDirectLanding()) {
          this.displayDashboardOptions();
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  componentDidUpdate() {
    const { transport } = this.props;

    if (transport.unauthorised === true) {
      this.unauthorised();
    }
  }

  render = () => {
    const documentNumber = this.props.match.params['documentNumber'];

    const { errors, cmrError } = this.props.errors;
    const {
      cmr,
      nationalityOfVehicle,
      registrationNumber,
      departurePlace,
      vehicle } = this.props.transport;
    const { dispatchClearErrors: _dispatchClearErrors, history, t } = this.props;

    const saveAsDraftFormActionUrl = '/orchestration/api/v1/transport/truck/cmr/saveAsDraft';

    const {
      title,
      previousUri,
      summaryUri,
      truckDetailsUri,
      journey,
      path,
      saveAsDraftUri,
      progressUri
    } = this.props.route;

    return (
      <Main>
        <PageTitle
          title={`${!isEmpty(errors) ? 'Error: ' : ''}${t('commonDoYouHaveaRoadTransportDocumentTitle')} - ${t(title)}`}
        />
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
            ></BackLinkWithErrorClearOut>
            <Header>{t('sdDoYouHaveaRoadTransportDocumentHeader')}</Header>
            <br />
            <HintText>{t('sdDoYouHaveaRoadTransportDocumentHint')}</HintText>
          </GridCol>
        </GridRow>
        <form
          action="/orchestration/api/v1/transport/truck/cmr"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="hidden" name="summaryUri" value={summaryUri} />
          <input type="hidden" name="truckDetailsUri" value={truckDetailsUri} />
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="vehicle" value={vehicle} />
          <input
            type="hidden"
            name="nationalityOfVehicle"
            value={nationalityOfVehicle}
          />
          <input
            type="hidden"
            name="registrationNumber"
            value={registrationNumber}
          />
          <input type="hidden" name="departurePlace" value={departurePlace} />
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />

          <GridRow>
            <GridCol>
              <div id="cmr">
                <MultiChoice
                  meta={{ touched: t(cmrError), error: t(cmrError) }}
                  onChange={this.onChange}
                >
                  <fieldset>
                    <legend className="visually-hidden">
                      {t('sdDoYouHaveaRoadTransportDocumentHeader')}
                    </legend>
                    <SelectRadio
                      id="separateCmrTrue"
                      value={true}
                      name="cmr"
                      inline
                      checked={cmr === 'true'}
                      onChange={this.onChange}
                    >
                      {t('Yes')}
                    </SelectRadio>
                    <SelectRadio
                      id="separateCmrFalse"
                      value={false}
                      name="cmr"
                      inline
                      checked={cmr === 'false'}
                      onChange={this.onChange}
                    >
                      {t('No')}
                    </SelectRadio>
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
            <ContinueButton
              type="submit"
              id="continue"
              onClick={this.onContinue}
            >
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
    getAddedLandingsType: state.landingsType
  };
}

function loadData(store, journey) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }

  return store.dispatch(getTransportDetails(journey, this.documentNumber))
    .then(() => {
      if (journey === catchCertificateJourney) {
        store.dispatch(getLandingType(this.documentNumber));
      }
    });
}

export const component = connect(
  mapStateToProps,
  {
    addTransportDetails,
    saveTruckCMR,
    getTransportDetails,
    dispatchClearErrors,
    clearTransportDetails,
    getLandingType
  }
)(withRouter(withTranslation() (TruckCMRPage)));

TruckCMRPage.propTypes = {
  transport: PropTypes.object.isRequired,
  errors: PropTypes.object
};

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
