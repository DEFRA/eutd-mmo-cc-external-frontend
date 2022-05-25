import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  addCopyDocument,
  clearErrors,
  submitCopyCertificate,
  checkCopyCertificate,
  unauthorisedCopyDocument,
} from '../../actions/copy-document.actions';

import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol,
  MultiChoice,
  WarningText,
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import ContinueButton from '../../components/elements/ContinueButton';
import SecondaryButton from '../../components/elements/SecondaryButton';
import ErrorIsland from '../../components/elements/ErrorIsland';
import SelectRadio from '../../components/elements/SelectRadio';
import { withTranslation } from 'react-i18next';

import { onHandleErrorClick, scrollToErrorIsland } from '../utils';

import Checkbox from '../../components/elements/checkbox';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';

class copyCertificateConfirmPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { copyDocumentAcknowledged: false, copyDocument: null };
    this.onSubmit.bind(this);
    this.onChange.bind(this);
    this.unauthorised.bind(this);
  }

  componentDidMount = async () => {
    const { unauthorised } = this.props;

    if (unauthorised) {
       this.unauthorised();
    }

    window.scrollTo(0, 0);

    const documentNumber = this.props.match.params['documentNumber'];

    await this.props.checkCopyCertificate(documentNumber);
  };

  componentDidUpdate() {
    const { unauthorised } = this.props;

    if (unauthorised) {
      this.unauthorised();
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]:
        e.target.name === 'copyDocumentAcknowledged'
          ? e.target.checked
          : e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();

    const {
      match: {
        params: { documentNumber },
      },
      route,
      history,
    } = this.props;

    const { journey, nextUri, voidUri } = route;
    const { copyDocumentAcknowledged, copyDocument } = this.state;
    let payload = {
      copyDocumentAcknowledged,
      documentNumber,
      journey,
    };

    switch (copyDocument) {
      case 'copyAllCertificateData':
        payload = {
          ...payload,
          voidOriginal: false,
          excludeLandings: false,
        };
        break;
      case 'copyExcludeLandings':
        payload = {
          ...payload,
          voidOriginal: false,
          excludeLandings: true,
        };
        break;
      case 'voidDocumentConfirm':
        payload = {
          ...payload,
          voidOriginal: true,
          voidDocumentConfirm: true,
        };
        break;
      default:
        break;
    }

    if (copyDocumentAcknowledged && copyDocument === 'voidDocumentConfirm') {
      this.props.addCopyDocument(payload);
      history.push(voidUri.replace(':documentNumber', documentNumber));
    } else {
      const documentNumberOfCopy = await this.props.submitCopyCertificate(
        payload
      );
      if (documentNumberOfCopy) {
        history.push(nextUri.replace(':documentNumber', documentNumberOfCopy));
      } else {
        scrollToErrorIsland();
      }
    }
  };

  render() {
    const {
      unauthorised,
      route,
      match: {
        params: { documentNumber },
      },
      history, t
    } = this.props;

    const { errors } = this.props.errors;
    const {
      path,
      previousUri,
      nextUri,
      journey,
      journeyText,
      copyCertificateOptions,
    } = route;
    const title = `${t('copy')} ${documentNumber}`;
    const currentUri = path.replace(':documentNumber', documentNumber);
    const addRemoveLandingText =
      journey === 'catchCertificate' ?  t('ccUploadFilePageTableLandingInfo').toLowerCase() : '';
    const updatedJourneyText = t(journeyText)
      .split(' ')
      .map((text) => text.charAt(0).toUpperCase() + text.substring(1))
      .join(' ');

    const copyOptionsError = errors
      ? errors.find((error) => error.targetName === 'voidOriginal')
      : false;
    const acknowledgementError = errors
      ? errors.find((error) => error.targetName === 'copyDocumentAcknowledged')
      : false;

    if (unauthorised) return null;

    const renderCopyConfirmOptions = () => {
      return copyCertificateOptions.map(option => (
        <SelectRadio
          key={option.id}
          id={option.id}
          name={option.name}
          value={option.value}
          hint={t(option.hint)}
          onChange={this.onChange}
        >
          {t(option.label)}
        </SelectRadio>
      ));
    };

    return (
      <Main>
        {errors && (
          <ErrorIsland
            errors={errors.map((err) => ({
              message: t(err.text),
              key: err.targetName,
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <PageTitle title={title} />
        <GridRow>
          <GridCol columnTwoThirds>
            <BackLink
              onClick={(e) => {
                e.preventDefault();
                history.push(previousUri);
              }}
              href={previousUri}
            >
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
          </GridCol>
        </GridRow>

        <Form
          action="/orchestration/api/v1/confirm-copy-certificate"
          currentUrl={currentUri}
          onSubmit={this.onSubmit}
        >
          <GridRow>
            <GridCol>
              <Header level="1">{title}</Header>
              <MultiChoice
                meta={{
                  touched: true,
                  error: copyOptionsError ? t(copyOptionsError.text) : '',
                }}
                id="voidOriginal"
              >
                <fieldset>{renderCopyConfirmOptions()}</fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow id="warningMessageRow">
            <GridCol>
              <Header level="2">{t('commonCopyThisProcessingStatementAcknowledgement')}</Header>
              <WarningText className="warning-message" id="warningMessage">
                   {t(`${journey}CopyThisDocumentWarningMessage`, {journeyText:updatedJourneyText.toLowerCase(), addRemoveLandingText: addRemoveLandingText})}
              </WarningText>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              <MultiChoice
                meta={{
                  touched: true,
                  error: acknowledgementError ? t(acknowledgementError.text) : '',
                }}
                id="copyCertificate"
              >
                <fieldset>
                  <Checkbox
                    id="copyDocumentAcknowledged"
                    checked={this.state.copyDocumentAcknowledged}
                    value={this.state.copyDocumentAcknowledged}
                    name="copyDocumentAcknowledged"
                    inline
                    onChange={this.onChange}
                  >
                    {t(`${journey}CopyThisProcessingStatementCopyDocumentAcknowledged`, {journeyText: updatedJourneyText.toLowerCase(),addRemoveLandingText: addRemoveLandingText})}
                  </Checkbox>
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow>
            <SecondaryButton
              id="cancel-copy-certificate-confirm-btn"
              formAction={null}
              name="cancel-copy-certificate-confirm-btn"
              onClick={(e) => {
                e.preventDefault();
                history.push(previousUri);
              }}
            >
              {t('commonSecondaryButtonCancelButton')}<span className="govuk-visually-hidden">{t('commonSecondaryButtonCancelButton')}</span>
            </SecondaryButton>
            <ContinueButton type="submit" id="continue" name="continue">
              {t(`${journey}CopyThisProcessingStatementCreatedraftJourney`,{journeyText: updatedJourneyText.toLowerCase()})}
            </ContinueButton>
          </GridRow>
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="currentUri" value={currentUri} />
          <input type="hidden" name="nextUri" value={nextUri} />
          <input type="hidden" name="previousUri" value={previousUri} />
        </Form>
        <HelpLink journey={route.journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    unauthorised: state.confirmCopyDocument.unauthorised,
    errors: state.errors,
  };
}

function loadData(store) {
  store.dispatch(unauthorisedCopyDocument());
}

export const component = withRouter(
  connect(mapStateToProps, {
    addCopyDocument,
    clearErrors,
    checkCopyCertificate,
    submitCopyCertificate,
  })(withTranslation() (copyCertificateConfirmPage))
);

copyCertificateConfirmPage.propTypes = {
  errors: PropTypes.object,
};

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
