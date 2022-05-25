import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SecondaryButton from '../../components/elements/SecondaryButton';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import { withTranslation } from 'react-i18next';

import {
  dispatchApiCallFailed
} from '../../actions';

import {
  addCopyDocument,
  submitCopyCertificate,
  clearErrors,
} from '../../actions/copy-document.actions';

import {
  Main,
  Header,
  BackLink,
  GridRow,
  GridCol,
  MultiChoice
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import ContinueButton from '../../components/elements/ContinueButton';
import ErrorIsland from '../../components/elements/ErrorIsland';
import { scrollToErrorIsland, onHandleErrorClick } from '../utils';
import SelectRadio from '../../components/elements/SelectRadio';

class ConfimDocumentCopyVoidPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      voidOriginal: undefined,
      disableSubmit: undefined
    };
  }

  onChange = e => {
    this.setState({ voidOriginal: JSON.parse(e.target.value)});
  };

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ disableSubmit: true });

    try {
      const { journey, nextUri} = this.props.route;
      const { documentNumber } = this.props.match.params;
      const { history, copyDocumentAcknowledged, copyExcludeLandings } = this.props;
      const { voidOriginal } = this.state;
      const confirmVoidOriginal = await this.props.submitCopyCertificate({
        journey,
        documentNumber,
        voidOriginal,
        copyDocumentAcknowledged,
        excludeLandings: copyExcludeLandings
      });

      if (confirmVoidOriginal) {
        history.push(nextUri.replace(':documentNumber', confirmVoidOriginal));
      }
    } catch (error) {
      scrollToErrorIsland();
    } finally {
      this.setState({ disableSubmit: false });
    }
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    const { copyDocumentAcknowledged, voidDocumentConfirm } = this.props;

    if (!copyDocumentAcknowledged || !voidDocumentConfirm) {
       this.unauthorised();
    }
  }

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

  render() {
    const {voidOriginalError, errors} = this.props.errors;
    const {route, match, unauthorised, history, t} = this.props;
    const { disableSubmit } = this.state;

    const {path, previousUri, journeyText, journey, cancelUri} = route;

    const title = t(`${journey}CopyVoidConfirmationPagetitle`, {journeyText: t(journeyText)})
    const h1Text =  t(`${journey}CopyVoidConfirmationHeader`, {journeyText: t(journeyText)})
    const currentUri = path.replace(':documentNumber', match.params.documentNumber);

    if (unauthorised)
       return null;

    return (
      <Main>
        {errors && (
          <ErrorIsland
            errors={errors.map(err => ({
              message: t(err.text),
              key: err.targetName
            }))}
            onHandleErrorClick={onHandleErrorClick}
        />
        )}

        <PageTitle
          title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${title} - ${t(this.props.route.title)}`}
        />
        <GridRow>
          <GridCol columnTwoThirds>
            <BackLink onClick={e => {
              e.preventDefault();
              history.push(previousUri.replace(':documentNumber', match.params.documentNumber));
            }} href={previousUri}>
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
          </GridCol>
        </GridRow>

        <Form action='/orchestration/api/v1/confirm-copy-certificate' currentUrl={currentUri} onSubmit={this.onSubmit}>
          <GridRow>
            <GridCol style={{ width: '75%' }}>
              <GridRow>
                <GridCol style={{ width: '75%' }}>
                  <Header level='1' style={{ marginBottom: '0px' }}>
                    <legend>{h1Text}</legend>
                  </Header>
                </GridCol>
              </GridRow>
              <MultiChoice meta={{touched: t(voidOriginalError), error: t(voidOriginalError)}} id='voidOriginal'>
                <fieldset className="govuk-fieldset">
                  <SelectRadio id="documentVoidOriginalYes" checked={this.state.voidOriginal === true} value='true' name='voidOriginal' onChange={this.onChange}>{t(`${journey}CopyVoidConfirmationDocumentVoidOriginalYes`, {journeyText: t(journeyText).toLowerCase()})}</SelectRadio >
                  <SelectRadio id="documentVoidOriginalNo" checked={this.state.voidOriginal === false} value='false' name='voidOriginal' onChange={this.onChange}>{t(`${journey}CopyVoidConfirmationDocumentVoidOriginalNo`, {journeyText: t(journeyText).toLowerCase()})}</SelectRadio>
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol columnTwoThirds>
            <SecondaryButton
              id="cancel-confirm-copy-void-btn"
              formAction={null}
              name="cancel-confirm-copy-void-btn"
              onClick={(e) => {
                e.preventDefault();
                history.push(cancelUri);
              }}
            >
              {t('commonSecondaryButtonCancelButton')}<span className="govuk-visually-hidden">{t('commonSecondaryButtonCancelButton')}</span>
            </SecondaryButton>
              <ContinueButton type='submit' id='continue' disabled={disableSubmit}>{t('commonContinueButtonContinueButtonText')}</ContinueButton>
            </GridCol>
          </GridRow>
        </Form>
        <HelpLink journey={route.journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    unauthorised: state.confirmCopyDocument.unauthorised,
    copyDocumentAcknowledged: state.confirmCopyDocument.copyDocumentAcknowledged,
    copyExcludeLandings: state.confirmCopyDocument.copyExcludeLandings,
    voidDocumentConfirm: state.confirmCopyDocument.voidDocumentConfirm
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(dispatchApiCallFailed(JSON.parse(this.queryParams.error)));
  }
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      addCopyDocument,
      submitCopyCertificate,
      clearErrors,
    }
  )(withTranslation() (ConfimDocumentCopyVoidPage))
);

ConfimDocumentCopyVoidPage.propTypes = {
  errors: PropTypes.object
};

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
