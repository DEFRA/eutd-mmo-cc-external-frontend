import React from 'react';
import {H1, Main} from 'govuk-react';
import PageTitle from '../components/PageTitle';
import {
  catchCertificatesTitle,
  processingStatementTitle,
  storageDocumentTitle
} from '../helpers/journeyConfiguration';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import i18n from '../../../src/i18n'
 export class ErrorPage extends React.Component {

  constructor(props){
    super(props)
  }
  state = {
    href: '/'
  };

  componentDidMount() {
    this.setState( {href: window.location.href});
    window.scrollTo(0, 0);
  }

  render() {
    const {href} = this.state;
    const {t} = i18n;
    let service = '';
    if( href.indexOf( '/create-processing-statement' ) !== -1) service = t(processingStatementTitle);
    if( href.indexOf( '/create-storage-document' ) !== -1) service = t(storageDocumentTitle);
    if( href.indexOf( '/create-catch-certificate' ) !== -1) service = t(catchCertificatesTitle);

    if( service ) service = `- ${service}`;
    else service = '- GOV.UK';


    return(
      <Main>
        <div className="column-two-thirds">
          <PageTitle title={`${t('commonErrorPageTitle')} ${service}`} />
          <H1>{t('commonErrorPageTitle')}</H1>
          <p>{t('commonErrorPageTryagainText')}</p>
          <p>{t('commonErrorPagesaveText')}</p>
        </div>
      </Main>
    );
  }
}

export const component = connect()(withTranslation() (ErrorPage))

export default {
  component: ErrorPage
};
