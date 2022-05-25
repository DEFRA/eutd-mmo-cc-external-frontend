import React, { Component } from 'react';
import HintText from '@govuk-react/hint-text';
import { connect } from 'react-redux';
import _ from 'lodash';

import Form from '../../components/elements/Form';

import {
  Main,
  Header,
  GridRow,
  GridCol,
  MultiChoice
} from 'govuk-react';
import {
  addSelectedExportCountry,
  saveExportCountry,
  getExportCountry,
  dispatchClearErrors,
  getAllCountries,
  clearExportCountry
} from '../../actions';
import {
  getLandingType
} from '../../actions/landingsType.actions';

import SelectRadio from '../../components/elements/SelectRadio';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import BackLinkWithErrorClearOut from '../../components/elements/BackLinkWithErrorClearOut';
import ExportDestination from '../../components/ExportDestination';
import ErrorIsland from '../../components/elements/ErrorIsland';
import BackToProgressLink from '../../components/BackToProgressLink';
import { onHandleErrorClick } from '../utils/errorUtils';
import PageTitle from '../../components/PageTitle';
import {withTranslation} from 'react-i18next';
class WhereAreYouExportingFrom extends Component {
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

  componentWillUnmount() {
    this.props.clearExportCountry();
  }

  async componentDidMount() {
    this.setState({ jsEnabled: true });

    const documentNumber = this.props.match.params['documentNumber'];

    try {
      await this.props.getExportCountry(documentNumber);
      await this.props.getLandingType(documentNumber);
      await this.props.getAllCountries();

      if (!this.hasLandingEntryOption()) {
        this.displayLandingEntryOptions();
      }
    } catch (e) {
      console.error(e);
    }
  }

  componentDidUpdate() {
    const { exportLocation } = this.props;

    if (exportLocation.unauthorised === true) {
      this.unauthorised();
    }
  }

  onDepartureChange = (e) => {
    const exportLocation = _.cloneDeep(this.props.exportLocation || {});
    exportLocation.exportedFrom = e.target.value;
    if (exportLocation.exportedTo) {
      exportLocation.exportedTo = exportLocation.exportedTo.officialCountryName;
    }
    this.props.addSelectedExportCountry(exportLocation);
  };

  onDestinationChange = (countryName) => {
    const exportLocation = _.cloneDeep(this.props.exportLocation || {});

    exportLocation.exportedTo = countryName;
    this.props.addSelectedExportCountry(exportLocation);
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;

    await this.doSubmit(true);
    this.props.history.push(saveAsDraftUri);
  };

  doSubmit = async (isSaveAsDraft) => {
    const { path, nextUri } = this.props.route;
    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : '';

    await this.props.saveExportCountry(
      path,
      nextUri,
      documentNumber,
      isSaveAsDraft
    );
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { nextUri, summaryUri } = this.props.route;
    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : '';

    await this.doSubmit(false);

    const isDirectLanding = this.props.getAddedLandingsType || {};
    isDirectLanding.landingsEntryOption === 'directLanding'
      ? this.props.history.push(summaryUri.replace(':documentNumber', documentNumber))
      : this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
  };

  render = () => {
    const { path, nextUri, journey, previousUri, saveAsDraftUri, progressUri, title } =
      this.props.route;
    const {
      dispatchClearErrors: _dispatchClearErrors,
      history,
      countries,
      errors,
      t
    } = this.props;
    const { exportLocation = {} } = this.props;

    const saveAsDraftFormActionUrl =
      '/orchestration/api/v1/export-location/saveAsDraft';

    if (!exportLocation.exportedFrom) {
      exportLocation.exportedFrom = 'United Kingdom';
    }

    const exportedFrom = exportLocation.exportedFrom;
    const documentNumber =
      this.props.match && this.props.match.params
        ? this.props.match.params['documentNumber']
        : '';

    const exportedTo = exportLocation.exportedTo;

    if (!exportLocation.loaded) return null;

    const exportDestinationError =
      errors && Object.prototype.hasOwnProperty.call(errors, 'exportDestinationError')
        ? this.props.errors['exportDestinationError']
        : null;

    return (
      <Main>
        <PageTitle title={`${!_.isEmpty(errors) ? `${t('commonPageTitleErrorText')} ` : ''
          }${t('ccWhatExportJourneyExportJourneyHeaderTitle')} - ${t(title)}`} />
        {!_.isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
          <ErrorIsland
            errors={errors.errors.map((err) => ({
              message: err.text === 'commonProductDestinationErrorInvalidCountry' ? `${t('commonProductDestinationErrorInvalidCountry')}`: t(err.text),
              key: err.targetName,
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <BackLinkWithErrorClearOut
          backUri={previousUri.replace(':documentNumber', documentNumber)}
          clearErrors={_dispatchClearErrors}
          history={history}
          labeltext={t('commonBackLinkBackButtonLabel')}
        />
        <Header>{t('ccWhatExportJourneyExportJourneyHeaderTitle')}</Header>
        <Form
          action="/orchestration/api/v1/export-location"
          method="POST"
          onSubmit={this.onSubmit}
        >
          <input type="hidden" name="currentUri" value={path} />
          <input type="hidden" name="nextUri" value={nextUri} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />
          <input type="hidden" name="journey" value={journey} />
          <GridRow>
            <GridCol columnTwoThirds>
              <MultiChoice
                id="exportedFrom"
                label={t('ccWhatExportJourneyDepartureCountry')}
              >
                <HintText>
                  {t('ccWhatExportJourneyDepartureCountryHint')}
                </HintText>
                <fieldset>
                  <SelectRadio
                    id="exportedFromUK"
                    checked={exportedFrom === 'United Kingdom'}
                    value="United Kingdom"
                    name="exportedFrom"
                    onChange={this.onDepartureChange}
                  >
                    {t('ccWhatExportJourneyCountryUk')}
                  </SelectRadio>
                  <SelectRadio
                    id="exportedFromGU"
                    checked={exportedFrom === 'Guernsey'}
                    value="Guernsey"
                    name="exportedFrom"
                    onChange={this.onDepartureChange}
                  >
                    {t('ccWhatExportJourneyCountryGuernsey')}
                  </SelectRadio>
                  <SelectRadio
                    id="exportedFromIOM"
                    checked={exportedFrom === 'Isle Of Man'}
                    value="Isle Of Man"
                    name="exportedFrom"
                    onChange={this.onDepartureChange}
                  >
                    {t('ccWhatExportJourneyCountryIsleOfMan')}
                  </SelectRadio>
                  <SelectRadio
                    id="exportedFromJE"
                    checked={exportedFrom === 'Jersey'}
                    value="Jersey"
                    name="exportedFrom"
                    onChange={this.onDepartureChange}
                  >
                    {t('ccWhatExportJourneyCountryJersey')}
                  </SelectRadio>
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <ExportDestination
                name="exportDestination"
                exportDestination={exportedTo}
                countries={countries}
                onChange={this.onDestinationChange}
                error={exportDestinationError}
              />
            </GridCol>
          </GridRow>

          <GridRow>
            <SaveAsDraftButton
              formactionUrl={saveAsDraftFormActionUrl}
              onClick={this.onSaveAsDraft}
            />
            <ContinueButton type="submit" id="continue">
              {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </Form>
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
    exportLocation: state.exportLocation,
    countries: state.global.allCountries,
    errors: state.errors,
    getAddedLandingsType: state.landingsType,
  };
}

function loadData(store) {
  return Promise.all([
    store.dispatch(getExportCountry(this.documentNumber)),
    store.dispatch(getAllCountries()),
    store.dispatch(getLandingType(this.documentNumber))
  ]);
}

export const component =
  connect(
    mapStateToProps,
    {
      addSelectedExportCountry,
      saveExportCountry,
      getExportCountry,
      dispatchClearErrors,
      getAllCountries,
      clearExportCountry,
      getLandingType
    }
  )(withTranslation() (WhereAreYouExportingFrom));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
