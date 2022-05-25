import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Panel, Main, GridRow, GridCol } from 'govuk-react';

import {
  clearProcessingStatement,
  saveProcessingStatement,
  saveProcessingStatementToRedis
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

    return completedDocument && completedDocument.documentNumber && completedDocument.documentUri && completedDocument.documentNumber.includes('-PS-');
  }

  async componentDidMount() {
    const documentNumber = this.props.match.params['documentNumber'];

    await this.props.getCompletedDocument(documentNumber);

    if (!this.hasRequiredData()) {
      this.props.history.push('/create-processing-statement/processing-statements');
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
        <PageTitle title={t('psCreatedSuccessPageTitle')} />
        <GridRow>
          <GridCol>
            <Panel
              className="submitted-certificate-bg"
              panelTitle={t('psCreatedPanelTitle')}
              panelBody={
                <Fragment>
                  {t('psCreatedPanelBody')}
                  <br />
                  <strong id="documentNumber">{documentNumber}</strong>
                </Fragment>
              }
            />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <Header level={2} size="MEDIUM">{t('psCreatedNextStepsHeader')}</Header>
            <ol className="list list-number">
              <li>
                <strong><a rel="noopener noreferrer" href={buildUrl(uri)} onClick={monitorViewEvent.bind(this, documentNumber)}>{t('psCreatedDownloadLink')}</a>. </strong>
                {t('psCreatedDownloadDocumentNotesSubHeading')}
                <ul className="list list-bullet">
                  <li>{t('psCreatedDownloadDocumentNotesFirefox')}</li>
                  <li>{t('psCreatedDownloadDocumentNotesMobile')}</li>
                </ul>
              </li>
              <li>
                <strong>{t('psCreatedEmailToImporter')}</strong>
                {t('commonDocumentCreatedImportersResponsibility')}
              </li>
            </ol>
            <p>
              <Link to={'/create-processing-statement/processing-statements'}>{t('psCreatedViewOrCreateNewLink')}</Link>
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
    processingStatement: state.processingStatement,
    documents: state.documents,
    monitorEvent: state.monitorEvent,
    completedDocument: state.completedDocument
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(clearProcessingStatement());
    store.dispatch(saveProcessingStatement({uri: this.queryParams.uri, documentNumber: this.queryParams.documentNumber}));
  }
}

export const component = withRouter(
  connect(
    mapStateToProps,
    {
      save: saveProcessingStatement,
      saveToRedis: saveProcessingStatementToRedis,
      monitorEvent: monitorEvent,
      clear: clearProcessingStatement,
      getCompletedDocument: getCompletedDocument
    }
  )(withTranslation()(StatementPage))
);

export default {
  loadData,
  component: PageTemplateWrapper(component)
};
