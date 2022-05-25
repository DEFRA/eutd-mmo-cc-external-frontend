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
import {
  toGovukErrors,
  onHandleErrorClick,
  scrollToErrorIsland
} from '../utils';
import ErrorIsland from '../../components/elements/ErrorIsland';
import PageTitle from '../../components/PageTitle';
import Form from '../../components/elements/Form';
import DateFieldWithPicker from '../../components/DateFieldWithPicker';
import {withRouter} from 'react-router-dom';
import HelpLink from '../../components/HelpLink';
import SaveAsDraftButton from '../../components/SaveAsDraftButton';
import ContinueButton from '../../components/elements/ContinueButton';
import { withTranslation } from 'react-i18next';
import BackToProgressLink from '../../components/BackToProgressLink';

class AddHealthCertificatePage extends React.Component {
  state = {
    certificateDateString: '',
  };

  async save(nextUri) {
    const { saveAsDraftUri } = this.props.route;
    const { documentNumber } = this.props.match.params;
    const isHealthCertificateSavedAsDraft = nextUri === saveAsDraftUri;
    const processingStatement = await this.props.saveToRedis({
        data: this.props.processingStatement || {},
        currentUrl: `/create-processing-statement/${documentNumber}/add-health-certificate`,
        saveAsDraft: isHealthCertificateSavedAsDraft,
        saveToRedisIfErrors: true,
        documentNumber: documentNumber
      });

    if (!isHealthCertificateSavedAsDraft && !_.isEmpty(processingStatement.errors)) {
      scrollToErrorIsland();
      return;
    }

    this.props.history.push(nextUri.replace(':documentNumber', documentNumber));
  }

  async componentDidMount() {
    await this.props.getFromRedis(this.props.match.params.documentNumber);

     this.setState({
      certificateDateString: this.props.processingStatement.healthCertificateDate,
    });
  }

  isUnauthorised() {
    const { processingStatement } = this.props;
    return processingStatement.unauthorised === true;
  }

  unauthorised() {
    this.props.history.push('/forbidden');
  }

  componentWillUnmount() {
    this.props.clear();
  }

  componentDidUpdate() {
    if (this.isUnauthorised()) {
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
    this.props.history.push(page);
  }

  onSaveAsDraft = async (e) => {
    e.preventDefault();
    const { saveAsDraftUri } = this.props.route;
    await this.save(saveAsDraftUri);
  }

  render() {
    const { processingStatement = {}, history, route, match, t } = this.props;
    const documentNumber = match.params.documentNumber;
    const { certificateDateString } = this.state;
    const { previousUri, path, saveAsDraftUri, nextUri, journey, progressUri, title } = route;

    const errors = (processingStatement.errorsUrl === history.location.pathname && processingStatement.errors) ? processingStatement.errors : {}; // only display errors for this URL
    const saveAsDraftFormActionUrl = `/orchestration/api/v1/processingStatement/saveAndValidate?c=${path}&n=${nextUri}&saveAsDraftUrl=${saveAsDraftUri}`;

    const backUrl = previousUri.replace(':documentNumber', documentNumber);

    return (
      <Main className="processing-statement">
        <PageTitle title={`${!_.isEmpty(errors) ? 'Error: ' : ''}${t('psAddHealthCertificateHeader')} - ${t(title)}`} />
        <ErrorIsland errors={toGovukErrors(errors)} onHandleErrorClick={onHandleErrorClick}/>
        <GridRow>
          <GridCol>
            <BackLink onClick={e => this.goBack(e, backUrl)} href={backUrl}>
              {t('commonBackLinkBackButtonLabel')}
            </BackLink>
            <Header>{t('psAddHealthCertificateHeader')}</Header>
          </GridCol>
        </GridRow>
        <Form
          action="/orchestration/api/v1/processingStatement/saveAndValidate"
          currentUrl={path}
          nextUrl={nextUri}
          onSubmit={e => e.preventDefault()}>
          <GridRow>
            <GridCol columnTwoThirds>
              <InputField htmlFor="healthCertificateNumber" meta={{ error: t(errors.healthCertificateNumber), touched: true }} hint={t('psAddHealthCertificateHealthCertificateNumberHint')} input={{autoComplete: 'off', name: 'healthCertificateNumber', id: 'healthCertificateNumber', value: processingStatement.healthCertificateNumber, onChange: e => this.onChange(e)}}>{t('psAddHealthCertificateHealthCertificateNumber')}</InputField>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol columnTwoThirds>
            <DateFieldWithPicker
                id='healthCertificateDate'
                name='healthCertificateDate'
                errors={t(errors.healthCertificateDate)}
                onDateChange={e => this.onChange(e)}
                dateFormat='DD/MM/YYYY'
                date={certificateDateString || ''}
                labelText={t('psAddHealthCertificateHealthCertificateDateLabel')}
            ></DateFieldWithPicker>
            </GridCol>
          </GridRow>
          <GridRow>
            <SaveAsDraftButton formactionUrl={saveAsDraftFormActionUrl} onClick={this.onSaveAsDraft} />
            <input type="hidden" name="journey" value={journey} />
            <input type="hidden" name="currentUri" value={path} />
            <ContinueButton id="continue" onClick={() => this.save(nextUri)}>
              {t('commonContinueButtonSaveAndContinueButton')}
            </ContinueButton>
          </GridRow>
        </Form>
        <BackToProgressLink
          progressUri={progressUri}
          documentNumber={documentNumber}
        />
        <HelpLink journey={route.journey}/>
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
  connect(mapStateToProps,
    {
      save: saveProcessingStatement,
      clear: clearProcessingStatement,
      saveToRedis: saveProcessingStatementToRedis,
      getFromRedis: getProcessingStatementFromRedis
    })(withTranslation()(AddHealthCertificatePage)));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
