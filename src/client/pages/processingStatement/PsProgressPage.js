import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isEmpty, upperFirst } from 'lodash';
import {
  OrderedList,
  UnorderedList,
  ListItem,
  BackLink,
  GridCol,
  GridRow,
  Main,
  H1,
  H2
} from 'govuk-react';
import ContinueButton from '../../components/elements/ContinueButton';
import HelpLink from '../../components/HelpLink';
import PageTitle from '../../components/PageTitle';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import ProgressItem from '../../components/ProgressItem';
import SecondaryButton from '../../components/elements/SecondaryButton';
import NotificationBanner from '../../components/NotificationBanner';
import ErrorIsland from '../../components/elements/ErrorIsland';
import { getProgress, clearProgress, checkProgress, clearErrors } from '../../actions/progress.actions';
import { clearCopyDocument } from '../../actions/copy-document.actions';
import { getProcessingStatementFromRedis } from '../../actions';
import { scrollToErrorIsland, onHandleErrorClick } from '../utils';
import { withTranslation } from 'react-i18next';

const PsProgressPage = ({ ...props }) => {
  const pageTitle = props.t('progressTitleText');

  const {
    referenceUri,
    exporterUri,
    consignmentDescriptionUri,
    catchesUri,
    catchesAddedUri,
    processingPlantUri,
    processingPlantAddressUri,
    exportHealthCertificateUri,
    exportDestinationUri,
    previousUri,
    nextUri,
    journey,
    title,
    journeyText
  } = props.route;
  const {t, errors} = props;
  const { params } = props.match;
  const { documentNumber } = params;
  const { completedSections, requiredSections, progress = {} } = props.progress || {};

  const [ catchDetailsLink, setCatchDetailsLink ] = useState(catchesUri.replace(':documentNumber', documentNumber));

  useEffect(async () => {
    await props.getProgress(documentNumber, journey);
    await props.getProcessingStatement(documentNumber);
  }, []);

  useEffect(() => {
    if (hasCatchDetail(props.processingStatement)) {
      setCatchDetailsLink(catchesAddedUri.replace(':documentNumber', documentNumber));
    }
  }, [props.processingStatement]);

  useEffect(() => {
    return () => {
      props.clearProgress();
      props.clearCopyDocument();
      props.clearErrors();
    };
   }, []);

  const handleReturnToDashboard = (event) => {
    event.preventDefault();
    props.history.push(previousUri);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await props.checkProgress(documentNumber, journey);
      props.history.push(nextUri.replace(':documentNumber', documentNumber));
    } catch (e) {
      scrollToErrorIsland();
    }
  };

  const handleBackLinkClick = (event) => {
    event.preventDefault();
    props.history.push(previousUri);
  };

  const onLinkClick = (link) => (e) => {
    e.preventDefault();
    props.history.push(link);
  };

  const getCopyNotificationMsg = (isVoided, originalDocumentNumber) => {
    return isVoided ?
      t('commonProgressNotificationMsgIsVoided',   { journeyText: t(journeyText)  }):
      t('commonProgressNotificationMsgIsNotVoided', { documentNumber : originalDocumentNumber, journeyText: t(journeyText) }) ;
  };

  const hasCatchDetail = (_processingStatement) => {
    if (!isEmpty(_processingStatement) && _processingStatement.catches && _processingStatement.catches.length > 0) {
      return _processingStatement.catches.some(catchDetail => [
          'species',
          'catchCertificateNumber',
          'totalWeightLanded',
          'exportWeightBeforeProcessing',
          'exportWeightAfterProcessing'].every(prop => catchDetail[prop] !== undefined && catchDetail[prop] !== '')
      );
    }

    return false;
  };

  return (
    <Main>
      <PageTitle
        title={`${pageTitle} - ${t(title)}`}
      />
      {!isEmpty(errors) && errors.errors && errors.errors.length > 0 && (
        <ErrorIsland
          errors={errors.errors.map((err) => ({
            message: t(err.text),
            key: err.targetName,
          }))}
          onHandleErrorClick={onHandleErrorClick}
        />
      )}
      <GridRow>
        <GridCol>
          <BackLink
            onClick={handleBackLinkClick}
            href={previousUri}
          >{t('commonBackLinkBackButtonLabel')}
          </BackLink>
          {props.confirmCopyDocument.copyDocumentAcknowledged && (
            <NotificationBanner
               header={t('commonImportant')}
              messages={[getCopyNotificationMsg(props.confirmCopyDocument.voidDocumentConfirm, props.confirmCopyDocument.documentNumber)]}
            />
          )}
          <H1>{t('progressTitleText')}</H1>
          <H2 className="govuk-heading progess-h1text" data-testid="ps-progress-heading">
            {t('psProgressProcessingStatementApplication')}{documentNumber}
          </H2>
          <br />
          <br />
          <div className="task-list-info">
            <H2
              className="govuk-heading-m"
              data-testid="ApplicationIncomplete-heading"
            >
              {completedSections === requiredSections ? t('commonProgressApplicationCompleted') : t('commonProgressApplicationIncomplete')}
            </H2>
            <p data-testid="completedSections">
              {t('commonProgressCompletedSectionsCount', {'completedSections': completedSections, 'requiredSections': requiredSections})}
            </p>
          </div>
          <OrderedList className="app-task-list">
            <ListItem>
              <H2 className="app-task-list__section" data-testid="Exporter-heading">
                <span className="app-task-list__section-number">1.</span>
                {t('psProgressexporter')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t(`${journey}ProgressYourReference`)}
                  testId="yourReference"
                  optional={true}
                  status={progress.reference}
                  href={referenceUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(referenceUri.replace(':documentNumber', documentNumber))}
                />
                <ProgressItem
                  title={t('psProgressExporterDetails')}
                  id="exporter"
                  error={errors.exporterError}
                  status={progress.exporter}
                  testId="exporterDetails"
                  href={exporterUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(exporterUri.replace(':documentNumber', documentNumber))}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2 className="app-task-list__section" data-testid="Products-heading">
                <span className="app-task-list__section-number">2.</span>
                {t('psProgressProducts')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('psProgressConsignmentDescription')}
                  id="consignmentDescription"
                  error={errors.consignmentDescriptionError}
                  status={progress.consignmentDescription}
                  testId="consignmentDescription"
                  href={consignmentDescriptionUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(consignmentDescriptionUri.replace(':documentNumber', documentNumber))}
                />
                <ProgressItem
                  title={t('psProgressCatchDetails')}
                  id="catches"
                  error={errors.catchesError}
                  status={progress.catches}
                  testId="catchDetails"
                  href={catchDetailsLink}
                  onClick={onLinkClick(catchDetailsLink)}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2 className="app-task-list__section" data-testid="Processing-heading">
                <span className="app-task-list__section-number" >3.</span>
                <span data-testid="psProgressProcessingPlantSectionTitle">{t('psProgressProcessingPlantSectionTitle')}</span>
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('psProgressProcessingPlant')}
                  id="processingPlant"
                  error={errors.processingPlantError}
                  status={progress.processingPlant}
                  testId="processingPlant"
                  href={processingPlantUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(processingPlantUri.replace(':documentNumber', documentNumber))}
                />
                <ProgressItem
                  title={upperFirst(t('commonProgressProcessingPlantAddress'))}
                  id="processingPlantAddress"
                  error={errors.processingPlantAddressError}
                  status={progress.processingPlantAddress}
                  testId="processingPlantAddress"
                  href={processingPlantAddressUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(processingPlantAddressUri.replace(':documentNumber', documentNumber))}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2 className="app-task-list__section" data-testid="TransportationAndLogistics-heading">
                <span className="app-task-list__section-number">4.</span>
                {t('psProgressTransportationLogistics')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('psProgressExportHealthCertificate')}
                  id="exportHealthCertificate"
                  error={errors.exportHealthCertificateError}
                  status={progress.exportHealthCertificate}
                  testId="exportHealthCertificate"
                  href={exportHealthCertificateUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(exportHealthCertificateUri.replace(':documentNumber', documentNumber))}
                />
                <ProgressItem
                  title={t('commonProgressExportDestination')}
                  id="exportDestination"
                  error={errors.exportDestinationError}
                  status={progress.exportDestination}
                  testId="exportDestination"
                  href={exportDestinationUri.replace(':documentNumber', documentNumber)}
                  onClick={onLinkClick(exportDestinationUri.replace(':documentNumber', documentNumber))}
                />
              </UnorderedList>
            </ListItem>
          </OrderedList>
          <br />
          <br />
          <GridRow>
            <SecondaryButton
              type="button"
              id="returnToYourDashboard"
              name="returnToYourDashboard"
              value="returnToYourDashboard"
              testId="returnToYourDashboard"
              className="govuk-button govuk-button--secondary"
              onClick={handleReturnToDashboard}
            >
              {t('commonProgressReturnToDashboard')}
            </SecondaryButton>
            <ContinueButton
              onClick={handleSubmit}
              id="continue"
            >
              {t('commonProgressCheckYourAnswersSubmit')}
            </ContinueButton>
          </GridRow>
          <HelpLink journey={journey} />
        </GridCol>
      </GridRow>
    </Main>
  );
};

function mapStateToProps(state) {
  return {
    progress: state.progress,
    confirmCopyDocument: state.confirmCopyDocument,
    processingStatement: state.processingStatement,
    errors: state.errors
  };
}

function loadData(store, journey) {
  return store.dispatch(getProgress(this.documentNumber, journey))
    .then(() => store.dispatch(getProcessingStatementFromRedis(this.documentNumber)));
}

export const component = withRouter(
  connect(mapStateToProps, {
    getProgress,
    clearProgress,
    checkProgress,
    clearCopyDocument,
    getProcessingStatement: getProcessingStatementFromRedis,
    clearErrors
  })(withTranslation() (PsProgressPage)));

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
