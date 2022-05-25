import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Main,
  BackLink,
  InputField,
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
import { withTranslation } from 'react-i18next';

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
import BackToProgressLink from '../../components/BackToProgressLink';

class AddProcessingPlantDetails extends React.Component {
  async save() {
    const {route, match} = this.props;
    const documentNumber = match.params.documentNumber;
    const processingStatement = await this.props.saveToRedis(
      {
        data: this.props.processingStatement || {},
        currentUrl: route.path,
        saveAsDraft: false,
        documentNumber: documentNumber
      });

    if (!_.isEmpty(processingStatement.errors)) return scrollToErrorIsland();
    this.props.history.push(route.nextUri.replace(':documentNumber', documentNumber));
  }

  onChange(e) {
    const processingStatement = _.cloneDeep(this.props.processingStatement || {});
    processingStatement[e.target.name] = e.target.value;
    this.props.save(processingStatement);
  }

  goBack(e, page) {
    e.preventDefault();
    this.props.history.push(page);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { route } = this.props;
    const { documentNumber } = this.props.match.params;
    const { path, saveAsDraftUri } = route;

    await this.props.saveToRedis(
      {
        data: this.props.processingStatement || {},
        currentUrl: path,
        saveAsDraft: true,
        documentNumber: documentNumber
      });

    this.props.history.push(saveAsDraftUri);
  }

  redirectToForbidden() {
    this.props.history.push('/forbidden');
  }

  componentWillUnmount() {
    this.props.clear();
  }

  async componentDidMount() {
    await this.props.getFromRedis(this.props.match.params.documentNumber);
  }

  componentDidUpdate() {
    const { processingStatement } = this.props;
    if (processingStatement.unauthorised === true) {
      this.redirectToForbidden();
    }
  }

  formatErrorResponse(error) {
    let errorObject = {};
    if(!_.isEmpty(error)) {
      Object.keys(error).forEach(key => {
        return errorObject[key] = this.errorFormatForPersonResponsible(error[key]);
      });
    }
    return errorObject;
  }

  errorFormatForPersonResponsible(error) {
    const {t} = this.props;
    if (!_.isEmpty(error)) {
      const splitDynamicErrors = error.split('-');
      if (splitDynamicErrors.length > 0) {
        return t(splitDynamicErrors[0], {
          MAX_PERSON_RESPONSIBLE_LENGTH: splitDynamicErrors[1],
        });
      }
    }
    return t(error);
  }

  render() {
    const { processingStatement = {}, history, route, match, t } = this.props;
    const { previousUri, path, nextUri, saveAsDraftUri, journey, progressUri, title } = route;
    const { documentNumber } = match.params;
    const errors = (processingStatement.errorsUrl === history.location.pathname && processingStatement.errors) ? processingStatement.errors : {}; // only display errors for this URL
    const { personResponsibleForConsignment = '', plantApprovalNumber = '' } = processingStatement;
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${path}&n=${nextUri}&saveAsDraftUrl=${saveAsDraftUri}`;
    const backUrl = previousUri.replace(':documentNumber', documentNumber);

    return (
      <Main className="processing-statement">
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('psAddProcessingPDAddProcessingPlantDetails')} - ${t(title)}`} />
        <ErrorIsland errors={toGovukErrors(this.formatErrorResponse(errors))} onHandleErrorClick={onHandleErrorClick}/>
        <GridRow>
          <GridCol>
            <BackLink onClick={e => this.goBack(e, backUrl)} href={backUrl}>
            {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            <Header>{t('psAddProcessingPDAddProcessingPlantDetails')}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/processingStatement/saveAndValidate"
          currentUrl={path}
          nextUrl={nextUri}
          onSubmit={e => e.preventDefault()}
        >
          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                id="personResponsibleForConsignment"
                meta={{error: this.errorFormatForPersonResponsible(errors['personResponsibleForConsignment']), touched: true}}
                htmlFor={'personResponsibleForConsignment'}
                input={{
                  autoComplete: 'off',
                  className: 'formControl',
                  name: 'personResponsibleForConsignment',
                  id: 'personResponsibleForConsignment',
                  value: personResponsibleForConsignment,
                  onChange: e => this.onChange(e, 'personResponsibleForConsignment')
                }}>{t('psAddProcessingPDPersonResponsibleForThisConsignment')}</InputField>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol columnTwoThirds>
              <InputField
                hint={t('psAddProcessingPDHintTextForPlantApprovalNumber')}
                id="plantApprovalNumber"
                meta={{error: t(errors['plantApprovalNumber']), touched: true}}
                htmlFor={'plantApprovalNumber'}
                input={{
                  autoComplete: 'off',
                  className: 'formControl',
                  name: 'plantApprovalNumber',
                  id: 'plantApprovalNumber',
                  value: plantApprovalNumber,
                  onChange: e => this.onChange(e, 'plantApprovalNumber')
                }}>{t('psAddProcessingPDPlantApprovalNumber')}</InputField>
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton id="continue" onClick={() => this.save()}>{t('commonContinueButtonSaveAndContinueButton')}</ContinueButton>
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
  })(withTranslation() (AddProcessingPlantDetails)) );

export default {
  loadData,
  component: PageTemplateWrapper( component )
};
