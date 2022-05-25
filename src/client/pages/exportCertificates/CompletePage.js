import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

import {
  Main,
  Panel,
  Header,
  GridRow,
  GridCol
} from 'govuk-react';

import PageTitle from '../../components/PageTitle';
import {
  clearConservation,
  clearTransportDetails,
  clearExportCountry,
  clearAddedSpeciesPerUser,
  getExportCertificateFromParams,
  clearExportPayload
} from '../../actions';

import {
  getCompletedDocument
} from '../../actions/document.actions';

import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import { monitorEvent } from '../../actions/monitor.actions';
import { withTranslation } from 'react-i18next';

class CompletePage extends Component {

  constructor(props) {
    super(props);
  }

  hasRequiredData() {
    const { completedDocument } = this.props;

    return completedDocument && completedDocument.documentNumber && completedDocument.documentUri && completedDocument.documentNumber.includes('-CC-');
  }

  async componentDidMount() {
    const documentNumber = this.props.match.params['documentNumber'];

    if (this.props.exportCertificate && this.props.exportCertificate.documentNumber) {
      this.props.clearConservation();
      this.props.clearTransportDetails();
      this.props.clearExportCountry();
      this.props.clearExportPayload();
      this.props.clearAddedSpeciesPerUser();
    }

    await this.props.getCompletedDocument(documentNumber);

    if (!this.hasRequiredData()) {
      this.props.history.push('/create-catch-certificate/catch-certificates');
    }
  }

  render() {
    const { route, completedDocument, t } = this.props;
    const documentNumber = (completedDocument && completedDocument.documentNumber) ? completedDocument.documentNumber : 'not found';
    const uri = (completedDocument && completedDocument.documentUri) ? completedDocument.documentUri :  'not found';

    const buildUrl = (docUrl) => {
      if(docUrl.indexOf('/') !== -1) {
        const splitUrlLength = docUrl.split('/').length;
        const splitUrl = docUrl.split('/')[splitUrlLength - 1];
        const docId = splitUrl.split('?')[0];
        return `/pdf/export-certificates/${docId}`;
      }
      return `/pdf/export-certificates/${docUrl}`;
    };

    const monitorViewEvent = doc => {
      const journey = this.props.route.journey;
      this.props.monitorEvent(doc, journey);
    };

    return (
      <Main className="dashboard">
        <PageTitle title={`${t('ccCreatedTitle')} - ${t('ccCommonTitle')}`}/>
        <GridRow>
          <GridCol>
            <Panel
              className="submitted-certificate-bg"
              panelTitle={t('ccCreatedPanelTitle')}
              panelBody={
                <Fragment>
                  {t('commonCatchCertificateNumber')}
                  <br/>
                  <strong id="documentNumber">{documentNumber}</strong>
                </Fragment>
              }
            />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <Header level={2} size="MEDIUM">{t('ccCreatedNextStepHeader')}</Header>
            <div>
              <ol className="list list-number">
                <li>
                  <strong><a rel="noopener noreferrer" onClick={monitorViewEvent.bind(this, documentNumber)} href={buildUrl(uri)}>{t('ccCreatedDownloadLink')}</a>. </strong>
                  {t('ccCreatedDoNotAmendCertificate')}
                  <ul className="list list-bullet">
                    <li>{t('downloadDocumentNotesFirefox')}</li>
                    <li>{t('downloadDocumentNotesMobile')}</li>
                  </ul>
                </li>
                <li>
                  <strong>{t('ccCreatedEmailToImporter')} </strong>
                  {t('commonDocumentCreatedImportersResponsibility')}
                </li>
              </ol>
              <p>
                <Link to={'/create-catch-certificate/catch-certificates'}>{t('ccCreatedViewCompletedOrCreateNewLink')}</Link>
              </p>
              <HelpLink journey={route.journey}/>
            </div>

          </GridCol>
        </GridRow>
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    exportCertificate: state.exportCertificate,
    documents: state.documents,
    monitorEvent: state.monitorEvent,
    completedDocument: state.completedDocument
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(getExportCertificateFromParams(this.queryParams));
  }
}

export const component = connect(mapStateToProps,
  {
    clearConservation,
    clearTransportDetails,
    clearExportCountry,
    clearExportPayload,
    clearAddedSpeciesPerUser,
    getCompletedDocument,
    monitorEvent
  })(withTranslation()(CompletePage));

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
