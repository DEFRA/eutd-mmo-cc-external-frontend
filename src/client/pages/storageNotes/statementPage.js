import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Main,
  Header,
  Panel,
  GridRow,
  GridCol
} from 'govuk-react';

import {
  clearStorageNotes, clearTransportDetails,
  saveStorageNotes, saveStorageNotesToRedis
} from '../../actions';
import {
  getCompletedDocument
} from '../../actions/document.actions';
import PageTitle from '../../components/PageTitle';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import HelpLink from '../../components/HelpLink';
import { monitorEvent } from '../../actions/monitor.actions';
import {withTranslation} from 'react-i18next';

class StatementPage extends React.Component {

  hasRequiredData() {
    const { completedDocument } = this.props;

    return completedDocument && completedDocument.documentNumber && completedDocument.documentUri && completedDocument.documentNumber.includes('-SD-');
  }

  async componentDidMount() {
    const documentNumber = this.props.match.params['documentNumber'];

    this.props.clear({ catches: [{}], storageFacilities: [{}], pdf: this.props.storageNotes.pdf });
    this.props.clearTransportDetails();

    await this.props.getCompletedDocument(documentNumber);

    if (!this.hasRequiredData()) {
      this.props.history.push('/create-storage-document/storage-documents');
    }
  }

  render() {
    const {route, completedDocument, t} = this.props;
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
      <Main>
        <PageTitle title={`${t('sdStatementPageTitle')} - ${t('sdCommonTitle')}` }/>
        <GridRow>
          <GridCol>
            <Panel
              className="submitted-certificate-bg"
              panelTitle={t('sdCreatedPanelTitle')}
              panelBody={
                <Fragment>
                  {t('sdCreatedPanelBody')}
                  <br />
                  <strong id="documentNumber">{documentNumber}</strong>
                </Fragment>
              }
            />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <Header level={2} size="MEDIUM">{t('sdCreatedNextStepsHeader')}</Header>
            <ol className="list list-number">
              <li>
                <strong><a rel="noopener noreferrer" onClick={monitorViewEvent.bind(this, documentNumber)} href={buildUrl(uri)}>{t('sdCreatedDownloadLink')}</a>. </strong>
                {t('sdCreatedDownloadDocumentNotesSubHeading')}
                <ul className="list list-bullet">
                  <li>{t('sdCreatedDownloadDocumentNotesFirefox')}</li>
                  <li>{t('sdCreatedDownloadDocumentNotesMobile')}</li>
                </ul>
              </li>
              <li>
                <strong>{t('sdCreatedEmailToImporter')}. </strong>
                <span>{t('sdCreatedEmailToImporterText')}</span>
              </li>
            </ol>
            <p>
              <Link to={'/create-storage-document/storage-documents'}>{t('sdCreatedViewOrCreateNewLink')}</Link>
            </p>
            <HelpLink journey={route.journey}/>
          </GridCol>
        </GridRow>
      </Main>
    );
  }
}

function mapStateToProps(state) {
  return {
    storageNotes: state.storageNotes,
    documents: state.documents,
    completedDocument: state.completedDocument,
    monitorEvent: monitorEvent
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(saveStorageNotes({ pdf: { uri: this.queryParams.uri, documentNumber: this.queryParams.documentNumber } }));
  }
}

export const component = withRouter(connect(mapStateToProps,
  {
    save: saveStorageNotes,
    saveToRedis: saveStorageNotesToRedis,
    clear: clearStorageNotes,
    monitorEvent,
    clearTransportDetails,
    getCompletedDocument
    }
  )(withTranslation()(StatementPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
