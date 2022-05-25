import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {
  InputField,
  Header,
  GridRow,
  GridCol,
  Main,
  BackLink
} from 'govuk-react';

import {
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  clearProcessingStatement
} from '../../actions';

import {withRouter} from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import ErrorIsland from '../../components/elements/ErrorIsland';
import {onHandleErrorClick, scrollToErrorIsland, toGovukErrors} from '../utils';
import Form from '../../components/elements/Form';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import { withTranslation } from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

class AddCatchWeightsPage extends React.Component {

  goBack(e, page) {
    e.preventDefault();
    const processingStatementClone = _.cloneDeep( (this.props.processingStatement || {}) );
    processingStatementClone.errors = {};
    this.props.save(processingStatementClone);
    this.props.history.push(page);
  }

  constructor(props) {
    super(props);
    this.state = this.init(props);
  }

  init(props) {
    const processingStatement = _.cloneDeep( (props.processingStatement || {}) );
    const index = +(this.props.match.params.catchIndex) || 0;

    if( index >= processingStatement.catches.length) {
      processingStatement.catches.push({});
    } // add new entry if needed

    return({
      index,
      processingStatement,
      errors: processingStatement.errors || {},
      errorsUrl: processingStatement.errorsUrl
    });
  }

  onChange(e, name) {
    const {index} = this.state;
    const { processingStatement } = this.state;
    const catchDetails = processingStatement.catches[index];
    catchDetails[name] = e.target.value;
    this.setState({processingStatement});
  }

  onContinue = async(e) => {
    e.preventDefault();

    const { route, match}  = this.props;
    const { path, nextUri } = route;
    const documentNumber = match.params.documentNumber;
    const currentUrl = path.replace(':catchIndex', this.state.index);

    const processingStatement = await this.props.saveToRedis({
      data: this.state.processingStatement,
      currentUrl: currentUrl,
      saveToRedisIfErrors: false,
      documentNumber: documentNumber
    });

    if(!_.isEmpty(processingStatement.errors) ) {
      this.setState({errors: processingStatement.errors, errorsUrl:  processingStatement.errorsUrl});
      return scrollToErrorIsland();
    }

    this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
  };

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { route, match } = this.props;
    const { path } = route;
    const { documentNumber } = match.params;
    const currentUrl = path.replace(':catchIndex', this.state.index);

    const processingStatement = await this.props.saveToRedis({
      data: this.state.processingStatement,
      currentUrl: currentUrl,
      saveToRedisIfErrors: true,
      saveAsDraft: true,
      documentNumber: documentNumber
    });

    if(!_.isEmpty(processingStatement.errors) ) {
      this.setState({
        errors: processingStatement.errors,
        errorsUrl:  processingStatement.errorsUrl});
    }

    const { saveAsDraftUri } = route;
    this.props.history.push(saveAsDraftUri);
  }

  hasRequiredData() {
    const { processingStatement } = this.props;
    if (processingStatement.catches && processingStatement.catches.length > 0) {
      return processingStatement.catches.some(catchDetail => {
        return ['species','catchCertificateNumber'].every(prop => !_.isEmpty(catchDetail[prop]));
      });
    }

    return false;
  }

  unauthorised() {
    const { documentNumber } = this.props.match.params;
    const { previousUri } = this.props.route;

    this.props.history.push(previousUri.replace(':documentNumber', documentNumber));
  }

  componentDidUpdate() {
    const { processingStatement } = this.props;
    if (processingStatement.unauthorised === true) {
      this.props.history.push('/forbidden')
    }
  }

  async componentWillUnmount() {
    await this.props.clear();
  }

  async componentDidMount() {
    const { documentNumber } = this.props.match.params;
    await this.props.getFromRedis(documentNumber);
    this.setState(this.init(this.props));

    const { index, processingStatement } = this.state;
    const catchDetails = processingStatement.catches[index];

    if (catchDetails === undefined) {
      this.props.history.push(`/create-processing-statement/${documentNumber}/catch-added`);
    }

    if (!this.hasRequiredData()) {
      this.unauthorised();
    }
  }

  render() {
    const { history, route, match, t } = this.props;
    const { nextUri, previousUri, path, saveAsDraftUri, journey, progressUri, title } = route;
    const { errors, errorsUrl, processingStatement, index } = this.state;
    const catchDetails = processingStatement.catches[index];
    const { documentNumber } = match.params;

    if (!catchDetails) return null;
    const {
      totalWeightLanded ,
      exportWeightBeforeProcessing ,
      exportWeightAfterProcessing
    } = catchDetails;

    const errs = (errorsUrl === history.location.pathname && errors) || {}; // only display errors for this URL

    const backLink = previousUri.replace(':documentNumber', match.params.documentNumber).replace(':catchIndex', index);
    const currentUrl = path.replace(':catchIndex', index);
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${currentUrl}&n=${nextUri}&saveAsDraftUrl=${saveAsDraftUri}`;

    return (
      <Main className="storage-notes">
        <ErrorIsland errors={toGovukErrors(errs)} onHandleErrorClick={onHandleErrorClick}/>
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('psAddCatchWeightsPageHeader')} - ${t(title)}`} />

        <Form action="/orchestration/api/v1/processingStatement/saveAndValidate"
              currentUrl={currentUrl}
              nextUrl={nextUri}
              onSubmit={(e) => e.preventDefault()}>
          <GridRow>
            <GridCol>
              <BackLink href={`/orchestration/api/v1/processingStatement/back?n=${backLink}`}
                        onClick={(e) => this.goBack(e, backLink)}>{t('commonBackLinkBackButtonLabel')}</BackLink>
              <Header>{t('psAddCatchWeightsPageHeader')}</Header>
            </GridCol>
          </GridRow>
          <Fragment>
            <GridRow>
              <GridCol columnTwoThirds>
                <InputField
                  id={`catches-${index}-totalWeightLanded`}
                  meta={{error: t(errs[`catches-${index}-totalWeightLanded`]), touched: true}}
                  htmlFor={`catches.${index}.totalWeightLanded`}
                  input={{
                    autoComplete: 'off',
                    id: `catches.${index}.totalWeightLanded`,
                    name: `catches.${index}.totalWeightLanded`,
                    value: totalWeightLanded,
                    onChange: (e) => this.onChange(e, 'totalWeightLanded')
                  }}>{t('psAddCatchWeightsTotalWeightOnCatchCertificate')}</InputField>
              </GridCol>
            </GridRow>
            <GridRow>
              <GridCol columnTwoThirds>
                <InputField
                  id={`catches-${index}-exportWeightBeforeProcessing`}
                  meta={{error: t(errs[`catches-${index}-exportWeightBeforeProcessing`]), touched: true}}
                  htmlFor={`catches.${index}.exportWeightBeforeProcessing`}
                  input={{
                    autoComplete: 'off',
                    name: `catches.${index}.exportWeightBeforeProcessing`,
                    id: `catches.${index}.exportWeightBeforeProcessing`,
                    value: exportWeightBeforeProcessing,
                    onChange: (e) => this.onChange(e, 'exportWeightBeforeProcessing')
                  }}>{t('psAddCatchWeightsExportWeightBeforeProcessing')}</InputField>
              </GridCol>
            </GridRow>
            <GridRow>
              <GridCol columnTwoThirds>
                <InputField
                  className='multiline'
                  id={`catches-${index}-exportWeightAfterProcessing`}
                  meta={{error: t(errs[`catches-${index}-exportWeightAfterProcessing`]), touched: true}}
                  htmlFor={`catches.${index}.exportWeightAfterProcessing`}
                  hint={t('psAddCatchWeightsExportWeightAfterProcessingHint')}
                  input={{
                    autoComplete: 'off',
                    name: `catches.${index}.exportWeightAfterProcessing`,
                    id: `catches.${index}.exportWeightAfterProcessing`,
                    value: exportWeightAfterProcessing,
                    onChange: (e) => this.onChange(e, 'exportWeightAfterProcessing')
                  }}>{t('psAddCatchWeightsExportWeightAfterProcessing')}</InputField>
              </GridCol>
            </GridRow>
          </Fragment>
          <GridRow>
          <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={currentUrl} />
            <ContinueButton type="submit" id="continue" onClick={this.onContinue}>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
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
    saveToRedis: saveProcessingStatementToRedis,
    getFromRedis: getProcessingStatementFromRedis,
    clear: clearProcessingStatement
   })(withTranslation() (AddCatchWeightsPage)));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
