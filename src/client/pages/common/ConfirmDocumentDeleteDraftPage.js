import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  saveConfirmDocumentDelete,
  addConfirmDocumentDelete,
  dispatchApiCallFailed
} from '../../actions';
import {
  Main,
  BackLink,
  Header,
  GridRow,
  GridCol,
  MultiChoice
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import HelpLink from '../../components/HelpLink';
import ContinueButton from '../../components/elements/ContinueButton';
import ErrorIsland from '../../components/elements/ErrorIsland';

import { scrollToErrorIsland, onHandleErrorClick} from '../utils';
import SelectRadio from '../../components/elements/SelectRadio';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import { withTranslation } from 'react-i18next';
import i18n from '../../../../src/i18n';
class ConfirmDocumentDeleteDraftPage extends React.Component {

  componentDidMount(){
    i18n.changeLanguage();
    this.forceUpdate();
  }

  onChange = e => {
    const confirmDocumentDelete = _.cloneDeep(
      this.props.confirmDocumentDelete || {}
    );
    confirmDocumentDelete.documentDelete = e.target.value;
    this.props.addConfirmDocumentDelete(confirmDocumentDelete);
  };

  onSubmit = async e => {
    e.preventDefault();

    try {
      const {path, journey, previousUri, nextUri} = this.props.route;
      const documentNumber = this.props.match.params['documentNumber'];
      const documentDelete = await this.props.saveConfirmDocumentDelete(path, nextUri, journey, documentNumber);
      const to = (documentDelete && documentDelete === 'Yes') ? nextUri : previousUri;

      this.props.history.push(to);
    } catch (error) {
      scrollToErrorIsland();
    }
  };

  render() {
    const {documentDeleteError, errors} = this.props.errors;
    const {confirmDocumentDelete = {}, route, match, t} = this.props;
    const {path, previousUri, nextUri, journey, journeyText} = route;
    const title = t(`${journey}DeleteCatchCertificateDeleteDraftJourneytext`, {journeyText: t(journeyText)})
    const h1Text =  t(`${journey}DeleteCatchCertificateDraftDeleteConfirmationText`, {journeyText: t(journeyText)})
    const currentUri = path.replace(':documentNumber', match.params.documentNumber);
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
            <BackLink onClick={e => { e.preventDefault(); this.props.history.push(previousUri); }} href={previousUri}>
            {t('commonBackLinkBackButtonLabel')}
              </BackLink>
        </GridRow>

        <Form action='/orchestration/api/v1/confirm-document-delete' currentUrl={currentUri} onSubmit={this.onSubmit}>
          <GridRow>
            <GridCol columnTwoThirds>
              <GridRow>
                <Header level='1'>
                  <legend>{h1Text}</legend>
                </Header>
              </GridRow>
              <MultiChoice meta={{touched: t(documentDeleteError), error: t(documentDeleteError)}} id='documentDelete'>
                <fieldset>
                  <SelectRadio id="documentDeleteYes" checked={confirmDocumentDelete.documentDelete === 'Yes'} value='Yes' name='documentDelete' inline onChange={this.onChange}>{t('Yes')}</SelectRadio>
                  <SelectRadio id="documentDeleteNo" checked={confirmDocumentDelete.documentDelete === 'No'} value='No' name='documentDelete' inline onChange={this.onChange}>{t('No')}</SelectRadio>
                </fieldset>
              </MultiChoice>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol columnTwoThirds>
              <ContinueButton type='submit' id='continue'>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
            </GridCol>
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
    errors: state.errors,
    confirmDocumentDelete: state.confirmDocumentDelete
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
      addConfirmDocumentDelete,
      saveConfirmDocumentDelete
    }
  )(withTranslation()(ConfirmDocumentDeleteDraftPage))
);

ConfirmDocumentDeleteDraftPage.propTypes = {
  confirmDocumentDelete: PropTypes.object.isRequired,
  errors: PropTypes.object
};

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
