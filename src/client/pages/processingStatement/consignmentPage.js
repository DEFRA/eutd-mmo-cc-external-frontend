import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BackToProgressLink from '../../components/BackToProgressLink';

import {
  Main,
  BackLink,
  TextArea,
  Header,
  GridRow,
  GridCol
} from 'govuk-react';

import {
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  clearProcessingStatement
} from '../../actions';

import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import {
  toGovukErrors,
  onHandleErrorClick,
  scrollToErrorIsland
} from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import {withRouter} from 'react-router-dom';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import { withTranslation } from 'react-i18next';
class ConsignmentPage extends React.Component {

  async save(nextUri) {
    const isDescriptionSavedAsDraft = nextUri === this.props.route.saveAsDraftUri;
    const documentNumber = this.props.match.params['documentNumber'];
    const processingStatement = await this.props.saveToRedis({
        data: this.props.processingStatement || {},
        currentUrl: `/create-processing-statement/${documentNumber}/add-consignment-details`,
        saveToRedisIfErrors: true,
        saveAsDraft: isDescriptionSavedAsDraft,
        documentNumber: documentNumber
    });

    if (!isDescriptionSavedAsDraft && !_.isEmpty(processingStatement.errors)) {
      scrollToErrorIsland();
      return;
    }

    this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
  }

  componentWillUnmount() {
    this.props.clear();
  }

  async componentDidMount() {
    const { processingStatement } = this.props;

    await this.props.getFromRedis(this.props.match.params.documentNumber);

    if (processingStatement && processingStatement.unauthorised === true) {
      this.unauthorised();
    }
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  componentDidUpdate() {
    const { processingStatement } = this.props;

    if (processingStatement && processingStatement.unauthorised === true) {
      this.unauthorised();
    }
  }

  onChange(e) {
    const processingStatement = _.cloneDeep(this.props.processingStatement || {});
    processingStatement[e.target.name] = e.target.value;
    this.props.save(processingStatement);
  }

  goBack(e, page) {
    e.preventDefault();
    const processingStatementClone = _.cloneDeep((this.props.processingStatement || {}));
    processingStatementClone.errors = {};
    this.props.save(processingStatementClone);
    this.props.history.push(page);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;
    await this.save(saveAsDraftUri);
  }

  render() {
    const { processingStatement = {}, history, route, match, t } = this.props;
    const { previousUri, path, nextUri, saveAsDraftUri, journey, progressUri, title } = route;
    const backUrl = previousUri.replace(':documentNumber', match.params.documentNumber);
    const documentNumber = match.params['documentNumber'];

    const errors = (processingStatement && processingStatement.errorsUrl === history.location.pathname && processingStatement.errors) || {}; // only display errors for this URL
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${path}&n=${nextUri}&saveAsDraftUrl=${saveAsDraftUri}`;
    return (
      <Main className="processing-statement">
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('psAddConsignmentDetailsConsignmentPageHeader')} - ${t(title)}`} />
        <ErrorIsland errors={toGovukErrors(errors)} onHandleErrorClick={onHandleErrorClick}/>
        <GridRow>
          <GridCol>
            <BackLink onClick={e => this.goBack(e, backUrl)} href={backUrl}>
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            <Header>{t('psAddConsignmentDetailsConsignmentPageHeader')}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/processingStatement/saveAndValidate"
          currentUrl={path}
          nextUrl={nextUri}
          onSubmit={e => e.preventDefault()}>
          <GridRow>
            <GridCol columnTwoThirds>
              <TextArea htmlFor="consignmentDescription" meta={{ error: t(errors.consignmentDescription), touched: true }} input={{autoComplete: 'off', className: 'formControl', name: 'consignmentDescription', id: 'consignmentDescription', value: processingStatement.consignmentDescription, onChange: e => this.onChange(e)}} hint={t('psAddConsignmentDetailsConsignmentDescriptionHint')}></TextArea>
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton id="continue" onClick={() => this.save(nextUri)}> {t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={journey}/>
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    processingStatement: state.processingStatement
  };
}

function loadData(store) {
  return store.dispatch(getProcessingStatementFromRedis(this.documentNumber));
}

export const component = withRouter(
  connect(mapStateToProps, {
    save: saveProcessingStatement,
    clear: clearProcessingStatement,
    saveToRedis: saveProcessingStatementToRedis,
    getFromRedis: getProcessingStatementFromRedis
   })(withTranslation() (ConsignmentPage)));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
