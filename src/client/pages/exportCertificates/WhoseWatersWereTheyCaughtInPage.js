import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Checkbox from '../../components/elements/checkbox';

import {
  Main,
  Header,
  GridRow,
  GridCol,
  InputField,
  MultiChoice
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';

import {
  addConservation,
  saveConservation,
  dispatchClearErrors,
  dispatchApiCallFailed,
  getConservation,
  clearConservation,
  getExportPayload
} from '../../actions';

import {
  getLandingType
} from '../../actions/landingsType.actions';

import BackLinkWithErrorClearOut from '../../components/elements/BackLinkWithErrorClearOut';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import { scrollToErrorIsland, onHandleErrorClick } from '../utils';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import BackToProgressLink from '../../components/BackToProgressLink';
import { withTranslation } from 'react-i18next';

class WhoseWatersWereTheyCaughtInPage extends Component {

  state = {
    jsEnabled: false
  };

  constructor(props) {
    super(props);
  }

  otherWatersChange = (e) => {
    this.props.addConservation({ [e.target.name]: e.target.value });
  };

  onChange = (e) => {
    this.props.addConservation({ [e.target.name]: (e.target.checked ? 'Y' : undefined) });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      await this.doSubmit(false);
      const { nextUri } = this.props.route;
      const documentNumber = (this.props.match && this.props.match.params)
        ? this.props.match.params['documentNumber']
        : '';
      const nextUrl = nextUri.replace(':documentNumber', documentNumber);
      this.props.history.push(nextUrl);
    } catch (error) {
      scrollToErrorIsland();
    }
  };

   hasRequiredData() {
     return (this.props.exportPayload.items && this.props.exportPayload.items.length > 0);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    try {
      const { saveAsDraftUri } = this.props.route;
      await this.doSubmit(true);
      this.props.history.push(saveAsDraftUri);
    } catch (error) {
      scrollToErrorIsland();
    }
  }

  doSubmit = async (isConservationSavedAsDraft) => {
    const { path, nextUri } = this.props.route;
    const documentNumber = (this.props.match && this.props.match.params)
      ? this.props.match.params['documentNumber']
      : '';

    await this.props.saveConservation(path, nextUri, isConservationSavedAsDraft, documentNumber);
  }

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

  componentWillUnmount() {
    this.props.clearConservation();
  }

  componentDidMount = async () => {
    const documentNumber = this.props.match.params['documentNumber'];

    try {
      await this.props.getConservation(documentNumber);
      await this.props.getLandingType(documentNumber);
      await this.props.getExportPayload(documentNumber);

      if (!this.hasLandingEntryOption()) {
        this.displayLandingEntryOptions();
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ jsEnabled: true });
  };

  componentDidUpdate() {
    const { conservation } = this.props;

    if (conservation.unauthorised === true) {
      this.unauthorised();
    }
  }

  render = () => {
    const { errors, otherWatersError, watersCaughtInError, } = this.props.errors;

    const { otherWaters, caughtInUKWaters, caughtInEUWaters, caughtInOtherWaters } = this.props.conservation;
    const { dispatchClearErrors: _dispatchClearErrors, history, route, t } = this.props;
    const { previousUri, path, nextUri, saveAsDraftUri, journey, directLandingUri, progressUri, title } = route;
    const saveAsDraftFormActionUrl = '/orchestration/api/v1/conservation/saveAsDraft';

    // include documentNumber within route object
    const documentNumber = (this.props.match && this.props.match.params)
      ? this.props.match.params['documentNumber']
      : '';

    const backTo =
      this.props.getAddedLandingsType.landingsEntryOption === 'directLanding'
        ? directLandingUri.replace(':documentNumber', documentNumber)
        : previousUri.replace(':documentNumber', documentNumber);

    return (
      <Main>
        <PageTitle title={`${errors ? `${t('commonPageTitleErrorText')} ` : ''}${t('ccWhoseWatersWereTheyCaughtInTitleText')} - ${t(title)}`} />
        {errors && <ErrorIsland errors={errors.map(err => ({ message: t(err.text), key: err.targetName }))} onHandleErrorClick={onHandleErrorClick} />}
        <GridRow>
          <GridCol>
            {this.hasRequiredData() &&
              (<BackLinkWithErrorClearOut
                backUri={backTo}
                clearErrors={_dispatchClearErrors}
                history={history}
                labeltext={t('commonBackLinkBackButtonLabel')}
              />)}
            <Header>{t('ccWhoseWatersWereTheyCaughtInHeaderText')}</Header>
          </GridCol>
        </GridRow>
        <form action="/orchestration/api/v1/conservation" method="POST" onSubmit={this.onSubmit}>
          <input type='hidden' name='currentUri' value={path} />
          <input type='hidden' name='nextUri' value={nextUri} />
          <input type="hidden" name="dashboardUri" value={saveAsDraftUri} />
          <input type="hidden" name="journey" value={journey} />
          <div style={{ display: 'none' }}>
            <Checkbox></Checkbox>
          </div>

          <MultiChoice meta={{ touched: t(watersCaughtInError), error: t(watersCaughtInError) }} label={t('ccWhoseWatersWereTheyCaughtInSelectText')}>
            <Checkbox id="watersCaughtIn" name="caughtInUKWaters" onChange={this.onChange} checked={caughtInUKWaters === 'Y'} value="Y">{t('ccWhoseWatersWereTheyCaughtInCheckBox1Text')}</Checkbox>
            <Checkbox id="caughtInEUWaters" name="caughtInEUWaters" onChange={this.onChange} checked={caughtInEUWaters === 'Y'} value="Y">{t('ccWhoseWatersWereTheyCaughtInCheckBox2Text')}</Checkbox>
            <Checkbox id="caughtInOtherWaters" name="caughtInOtherWaters" onChange={this.onChange} checked={caughtInOtherWaters === 'Y'} value="Y">{t('ccWhoseWatersWereTheyCaughtInCheckBox3Text')}</Checkbox>
          </MultiChoice>

          {(!this.state.jsEnabled || caughtInOtherWaters === 'Y') &&
            <Fragment>
              <div style={{ borderLeft: 'solid #eee 10px', paddingLeft: '10px' }}>
                <InputField
                  id={'label-otherWaters'}
                  htmlFor={'otherWaters'}
                  input={{
                    autoComplete: 'off',
                    id: 'otherWaters',
                    name: 'otherWaters',
                    value: otherWaters
                  }}
                  meta={{
                    touched: t(otherWatersError),
                    error: t(otherWatersError),
                  }} onChange={this.otherWatersChange}>{t('ccWhoseWatersWereTheyCaughtInInputText')}</InputField>
              </div>
            </Fragment>
          }

          <br />
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <ContinueButton type="submit" id="continue">{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
          </GridRow>
        </form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey} />
      </Main>
    );
  }

}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    conservation: state.conservation,
    exportPayload: state.exportPayload,
    getAddedLandingsType: state.landingsType,
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }

  return store.dispatch(getConservation(this.documentNumber))
    .then(() => store.dispatch(getExportPayload(this.documentNumber)))
    .then(() => store.dispatch(getLandingType(this.documentNumber)));

}

export const component = connect(
  mapStateToProps,
  {
    addConservation,
    saveConservation,
    getConservation,
    clearConservation,
    dispatchClearErrors,
    getExportPayload,
    getLandingType
  }
)(withTranslation() (WhoseWatersWereTheyCaughtInPage));

WhoseWatersWereTheyCaughtInPage.propTypes = {
  conservation: PropTypes.object.isRequired,
  errors: PropTypes.object,
  exportPayload: PropTypes.object
};

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
