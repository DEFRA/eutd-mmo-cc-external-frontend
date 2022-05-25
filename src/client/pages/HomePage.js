import React from 'react';
import { connect } from 'react-redux';
import { Header, Main, Button } from 'govuk-react';
import SelectRadio from '../../../src/client/components/elements/SelectRadio';
import PageTitle from '../components/PageTitle';
import Form from '../components/elements/Form';
import { withTranslation } from 'react-i18next';
import {withRouter} from 'react-router-dom';
import i18n from '../../i18n';
class Home extends React.Component {

  state = {
    selected: '/create-catch-certificate/catch-certificates',
  };

  componentDidMount(){
    i18n.changeLanguage();
    this.forceUpdate();
  }

  render() {
    const {  t } = this.props;
    return (
      <Main>
        <PageTitle title= {`${t('commonHomePageWhatDoYouWant')}`} />
        <Header>{t('commonHomePageWhatDoYouWant')}</Header>
        <Form
          currentUrl='/'
          action="/orchestration/api/v1/home/saveAndValidate"
        >
          <div id="radioButtons">
            <fieldset className="govuk-fieldset">
              <legend className="visually-hidden">{t('commonHomePageWhatDoYouWant')}</legend>
              <SelectRadio onClick={() => this.setState({ selected: '/create-catch-certificate/catch-certificates' })} id="createCatchCertificate" name="journeySelection" value="/create-catch-certificate/catch-certificates" defaultChecked>{t('commonDashboardCreateAUkCatchCertificate')} {t('commonHomePageIncludingLinksText')}</SelectRadio>
              <SelectRadio onClick={() => this.setState({selected: '/create-processing-statement/processing-statements'})} id="createProcessingStatement" name="journeySelection" value="/create-processing-statement/processing-statements">{t('processingStatementRendererHeaderSectionTitle')}</SelectRadio>
              <SelectRadio onClick={() => this.setState({selected: '/create-storage-document/storage-documents'})} id="createStorageDocument" name="journeySelection" value="/create-storage-document/storage-documents">{t('commonDashboardCreateaUkStorageDocument')}</SelectRadio>
            </fieldset>
          </div>
          <br/>
          <Button id="continue" name="continue" type="submit">{t('commonContinueButtonContinueButtonText')}</Button>
        </Form>
      </Main>
    );
  }
}

export default {
  component: withRouter(connect(null, {})(withTranslation() (Home)))
};
