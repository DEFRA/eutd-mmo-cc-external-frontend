import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Main,
  Panel,
  Header,
  GridRow,
  GridCol,
  ListItem,
  OrderedList,
  UnorderedList,
} from 'govuk-react';
import HelpLink from '../../components/HelpLink';
import PageTitle from '../../components/PageTitle';
import { connect } from 'react-redux';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import { getExportCertificateFromParams } from '../../actions';
import { getPendingDocument } from '../../actions/document.actions';
import { withTranslation } from 'react-i18next';

class PendingPage extends Component {
  constructor(props) {
    super(props);
  }

  hasRequiredData() {
    return this.props.pendingDocument ? true : false;
  }

  async componentDidMount() {
    const documentNumber = this.props.match.params['documentNumber'];

    await this.props.getPendingDocument(documentNumber);

    if (!this.hasRequiredData()) {
      this.props.history.push('/create-catch-certificate/catch-certificates');
    }
  }

  render() {
    const documentNumber = this.props.match.params['documentNumber'];
    const { journey } = this.props.route;
    const { offlineValidationTime } = this.props.config;
    const { t } = this.props;

    return (
      <Main>
        <PageTitle
          title={`${t('ccPendingPageTitle')} - ${t('ccCommonTitle')}`}
        />
        <GridRow>
          <GridCol>
            <Panel
              className="pending-page-panel"
              data-testid="pending-page-panel"
              panelTitle={t('ccPendingPagePanelTitle')}
              panelBody={
                <Fragment>
                  {t('commonCatchCertificateNumber')}
                  <br />
                  <strong
                    data-testid="pending-documentNumber"
                    id="documentNumber"
                  >
                    {documentNumber}
                  </strong>
                </Fragment>
              }
            />
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol>
            <Header
              data-testid="What-you-need-to-do-next"
              level={2}
              size="MEDIUM"
            >
              {t('ccCreatedNextStepHeader')}
            </Header>
            <div>
              <p data-testid="offlineValidationMessage">
                {t('ccPendingPageOfflineValidationMessage', {
                  offlineValidationTime,
                })}
                <br />
                <br />
                {t('ccPendingPageOnceProcessingComplete')}
              </p>
            </div>
            <Header
              data-testid="Successfully-completed-catch-certificates"
              level={3}
              size="SMALL"
            >
              {t('ccPendingPageSuccessfullyCompleted')}
            </Header>
            <OrderedList listStyleType="decimal">
              <ListItem>
                <strong>{t('ccPendingPageFindTheDocument')}</strong>
              </ListItem>
              <ListItem>
                <strong>{t('ccPendingPageDownload')}</strong>
                {t('psCreatedDownloadDocumentNotesSubHeading')}
                <UnorderedList className="ul" listStyleType="disc">
                  <ListItem>
                    {t('sdCreatedDownloadDocumentNotesFirefox')}
                  </ListItem>
                  <ListItem>
                    {t('sdCreatedDownloadDocumentNotesMobile')}
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                <strong>{t('ccCreatedEmailToImporter')}</strong>
                {t('ccPendingPageImportersResponsibility')}
              </ListItem>
            </OrderedList>
            <br></br>
            <Header
              data-testid="Submissions-that-fail-validation"
              level={3}
              size="SMALL"
            >
              {t('ccPendingPageSubmissionsThatFailValidation')}
            </Header>
            <OrderedList listStyleType="decimal">
              <ListItem>
                <strong>{t('ccPendingPageDocumentLabelledFailed')}</strong>
              </ListItem>
              <ListItem>
                <strong>{t('ccPendingPageViewValidationFailure')}</strong>
              </ListItem>
              <ListItem>
                <strong>{t('ccPendingPageViewUseErrorMessages')}</strong>
              </ListItem>
            </OrderedList>
            <br></br>
            <p>{t('ccPendingPageContinueToYourDashboard')}</p>
            <Link
              data-testid="return-to-your-dashboard-link"
              to={'/create-catch-certificate/catch-certificates'}
            >
              {t('ccPendingPageReturnToDashboardLink')}
            </Link>
          </GridCol>
        </GridRow>
        <HelpLink journey={journey} />
      </Main>
    );
  }
}
function mapStateToProps(state) {
  return {
    exportCertificate: state.exportCertificate,
    documents: state.documents,
    pendingDocument: state.pendingDocument,
    config: state.config,
  };
}

function loadData(store) {
  if (Object.keys(this.queryParams).length !== 0) {
    store.dispatch(getExportCertificateFromParams(this.queryParams));
  }
}

export const component = connect(mapStateToProps, {
  getPendingDocument,
})(withTranslation()(PendingPage));

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
