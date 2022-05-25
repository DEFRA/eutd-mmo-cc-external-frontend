import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

import {
  getUserReference,
  saveUserReference,
  clearUserReference
} from '../../actions/user-reference.actions';

import {
  clearCopyDocument
} from '../../actions/copy-document.actions';

import {
  Main,
  BackLink,
  Header,
  InputField,
  GridRow,
  GridCol
} from 'govuk-react';

import { scrollToErrorIsland, onHandleErrorClick} from '../utils';

import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import PageTitle from '../../components/PageTitle';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';

import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import ErrorIsland from '../../components/elements/ErrorIsland';
import NotificationBanner from '../../components/NotificationBanner';
import errorTransformer from '../../helpers/errorTransformer';

class UserReferencePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userReference: ''
    };
  }

  onChange = e => {
    this.setState({ userReference: e.target.value });
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;
    await this.onSave(saveAsDraftUri);
  }

  onSave = async (nextUri) => {
    const { errors } = this.props.errors;
    const documentNumber = this.props.match.params['documentNumber'];

    try {
      await this.props.saveUserReference({ userReference: this.state.userReference.toString().trim() }, documentNumber);
      this.props.history.push(nextUri);
    } catch (e) {
      if (!isEmpty(errors)) {
        scrollToErrorIsland();
      }
    }
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  getCopyNotificationMsg(isVoided, documentNumber) {
    const { journeyText, journey } = this.props.route;
    const addRemoveLandingText = journey === 'catchCertificate' ? ' landing' : '';
    return isVoided ? `This draft was created by copying a document that has now been voided. You are reminded that you must not use a ${this.props.t(journeyText)} or${addRemoveLandingText} data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.` :
    `This draft was created by copying document ${documentNumber}. You are reminded that you must not use a ${this.props.t(journeyText)} or${addRemoveLandingText} data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.`;
   }

  componentDidUpdate() {
    const { reference } = this.props;

    if (reference.unauthorised === true) {
      this.unauthorised();
    }
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0);

    const documentNumber = this.props.match.params['documentNumber'];

    try {
      await this.props.getUserReference(documentNumber);

      const { userReference } = this.props.reference;
      this.setState({ userReference: userReference });
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {
    this.props.clearCopyDocument();
    this.props.clearUserReference();
  }

  render = () => {
    const { route, match, confirmCopyDocument, t } = this.props;
    const { title, header, previousUri, path, nextUri, journey, journeyText } = route;
    const { documentNumber } = match.params;
    const errors = errorTransformer(this.props.reference.error);

    const saveAsDraftFormActionUrl = `/orchestration/api/v1/userReference/${journey}/saveAsDraftLink`;
    const backLinkUrl = previousUri.replace(':documentNumber', documentNumber);

    return (
      <Main>
        <PageTitle title={`${!isEmpty(errors) ? 'Error: ' : ''} ${t(header)} - ${t(title)}`} />
        {!isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
          <ErrorIsland
            errors={errors.errors.map((err) => ({
              message: t(err.text),
              key: err.targetName,
            }))}
            onHandleErrorClick={onHandleErrorClick}
          />
        )}
        <GridRow>
          <GridCol>
            <BackLink onClick={e => {
              e.preventDefault();
              this.props.history.push(backLinkUrl);
            }
            }
              href={backLinkUrl}>
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            {confirmCopyDocument.copyDocumentAcknowledged && (
              <NotificationBanner
                header={t('commonImportant')}
                messages={[this.getCopyNotificationMsg(confirmCopyDocument.voidDocumentConfirm, confirmCopyDocument.documentNumber)]} />
            )}
           <Header>
             {t(header)}
            </Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/userReference"
          currentUrl={path.replace(':documentNumber', documentNumber)}
          nextUrl={nextUri.replace(':documentNumber', documentNumber)}
          documentNumber={documentNumber}
          onSubmit={e => e.preventDefault()}>
          <input type="hidden" name="journey" value={journey} />
          <input type="hidden" name="currentUri" value={path} />
          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                meta={{ error: t(errors.userReferenceError), touched: true }}
                htmlFor={'userReference'}
                input={{
                  autoComplete: 'off',
                  id: 'userReference',
                  className: 'formControl',
                  name: 'userReference',
                  value: this.state.userReference,
                  onChange: e => this.onChange(e),
                  onBlur: e => this.onChange(e)
                }}
                hint={t('commonAddYourReferenceHint', {journeyText: t(journeyText)})}>{t('commonAddYourReferenceOptionalText')}
                </InputField>
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <ContinueButton id="continue" onClick={() => this.onSave(nextUri.replace(':documentNumber', documentNumber))}>
              {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={previousUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey} />
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    confirmCopyDocument: state.confirmCopyDocument,
    reference: state.reference,
    errors: state.errors
  };
}

function loadData(store) {
  return store.dispatch(getUserReference(this.documentNumber));
}

export const component = withRouter(
  connect(mapStateToProps, {
    getUserReference,
    saveUserReference,
    clearUserReference,
    clearCopyDocument
  })(withTranslation() (UserReferencePage)));

UserReferencePage.propTypes = {
  confirmCopyDocument: PropTypes.object,
  reference: PropTypes.object,
  errors: PropTypes.object
};

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
