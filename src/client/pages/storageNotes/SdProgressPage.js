import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  OrderedList,
  UnorderedList,
  ListItem,
  BackLink,
  GridCol,
  GridRow,
  Main,
  H1,
  H2,
} from 'govuk-react';
import ContinueButton from '../../components/elements/ContinueButton';
import HelpLink from '../../components/HelpLink';
import PageTitle from '../../components/PageTitle';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';
import ProgressItem from '../../components/ProgressItem';
import SecondaryButton from '../../components/elements/SecondaryButton';
import ErrorIsland from '../../components/elements/ErrorIsland';
import {
  getTransportDetails,
  clearTransportDetails,
  getStorageNotesFromRedis
} from '../../actions';
import { getProgress, clearProgress, checkProgress, clearErrors } from '../../actions/progress.actions';
import { scrollToErrorIsland, onHandleErrorClick } from '../utils';
import { forwardUri } from '../../helpers/vehicleRouteLookup';
import NotificationBanner from '../../components/NotificationBanner';
import { clearCopyDocument } from '../../actions/copy-document.actions';
import { isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';

const SdProgressPage = ({ ...props }) => {
  const pageTitle = props.t('progressTitleText');
  const {
    storageFacilitiesUri,
    transportSelectionStorageNotesUri,
    addUserReferenceUri,
    companyDetailsUri,
    productDetailsUri,
    productDestinationUri,
    previousUri,
    productsUri,
    nextUri,
    journey,
    journeyText
  } = props.route;  
  const {t, errors } = props;
  const { params } = props.match;
  const { documentNumber } = params;
  const {
    completedSections,
    requiredSections,
    progress = {}
  } = props.progress || {};
  const { vehicle } = props.transport || {};
  const transportVehicle = vehicle ? vehicle : '';
  const [ catchDetailsLink, setCatchDetailsLink ] = useState(productDetailsUri.replace(':documentNumber', documentNumber));

  const links = {
    reference: addUserReferenceUri.replace(':documentNumber', documentNumber),
    exporter: companyDetailsUri.replace(':documentNumber', documentNumber),
    storageFacilities: storageFacilitiesUri.replace(':documentNumber', documentNumber),
    exportJourney: productDestinationUri.replace(':documentNumber', documentNumber),
    transportType: transportSelectionStorageNotesUri.replace(':documentNumber', documentNumber),
    transportDetails: forwardUri(transportVehicle, props.route).replace(':documentNumber', documentNumber)
  };

  useEffect(async () => {
    await props.getProgress(documentNumber, journey);
    await props.getTransportDetails(journey, documentNumber);
    await props.getStorageNotes(documentNumber);
  }, []);

  useEffect(() => {
    return () => {
      props.clearProgress();
      props.clearTransportDetails();
      props.clearCopyDocument();
      props.clearErrors();
    };
  }, []);

  useEffect(() => {
    if (hasCatchDetail(props.storageNotes)) {
      setCatchDetailsLink(
        productsUri.replace(':documentNumber', documentNumber)
      );
    }
  }, [props.storageNotes]);

  const hasCatchDetail = (storageNotes) => {
    if (
      !isEmpty(storageNotes) &&
      storageNotes.catches &&
      storageNotes.catches.length > 0
    ) {
      return storageNotes.catches.some((catchDetail) =>
        [
          'certificateNumber',
          'commodityCode',
          'dateOfUnloading',
          'placeOfUnloading',
          'product',
          'productWeight',
          'transportUnloadedFrom',
          'weightOnCC',
        ].every(
          (prop) => catchDetail[prop] !== undefined && catchDetail[prop] !== ''
        )
      );
    }

    return false;
  };

  const handleReturnToDashboard = (event) => {
    event.preventDefault();
    props.history.push(previousUri);
  };

  const handleBackLinkClick = (event) => {
    event.preventDefault();
    props.history.push(previousUri);
  };

  const onLinkClick = (link) => (e) => {
    e.preventDefault();
    props.history.push(link);
  };

  const onCheckYourAnswersAndSubmitClick = async (event) => {
    event.preventDefault();

    try {
      await props.checkProgress(documentNumber, journey);
      props.history.push(nextUri.replace(':documentNumber', documentNumber));
    } catch (e) {
      scrollToErrorIsland();
    }
  };

  const getCopyNotificationMsg = (isVoided, docNumber) => {
    return isVoided ?
    t('commonProgressNotificationMsgIsVoided',   { journeyText: t(journeyText)  }):
    t('commonProgressNotificationMsgIsNotVoided', { documentNumber : docNumber, journeyText: t(journeyText) }) ;
  };

  return (
    <Main>
      <PageTitle
        title={`${pageTitle} - ${t('sdCommonTitle')}`}
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
            href={previousUri.replace(':documentNumber', documentNumber)}
          >
            {t('commonBackLinkBackButtonLabel')}
          </BackLink>
          {props.confirmCopyDocument.copyDocumentAcknowledged && (
            <NotificationBanner
              header={t('commonImportant')}
              messages={[getCopyNotificationMsg(props.confirmCopyDocument.voidDocumentConfirm, props.confirmCopyDocument.documentNumber)]}
            />
          )}
          <H1>{t('progressTitleText')}</H1>
          <H2 className="govuk-heading progess-h1text" data-testid="sd-progress-heading">
            {t('storageNotesApplication')}:
            {documentNumber}
          </H2>
          <br />
          <br />
          <div className="task-list-info">
            <H2
              className="govuk-heading-m"
              data-testid="ApplicationIncomplete-heading"
            >
             {(completedSections || requiredSections) !== undefined && (completedSections === requiredSections) ? t('commonProgressApplicationCompleted') : t('commonProgressApplicationIncomplete') }
            </H2>
            <p data-testid="completedSections">
            {t('commonProgressCompletedSectionsCount', {'completedSections': completedSections, 'requiredSections': requiredSections})}
            </p>
          </div>
          <OrderedList className="app-task-list">
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="Exporter-heading"
              >
                <span className="app-task-list__section-number">1.</span>
                {t('sdProgressExporter')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t(`${journey}ProgressYourReference`)}
                  testId="yourReference"
                  optional={true}
                  status={progress.reference}
                  href={links.reference}
                  onClick={onLinkClick(links.reference)}
                />
                <ProgressItem
                  title={t('sdProgressExporterDetails')}
                  id="exporter"
                  error={errors.exporterError}
                  status={progress.exporter}
                  testId="exporterDetails"
                  href={links.exporter}
                  onClick={onLinkClick(links.exporter)}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="Products-heading"
              >
                <span className="app-task-list__section-number">2.</span>
                {t('sdProgressProducts')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('sdProgressProductDetails')}
                  error={errors.catchesError}
                  id="catches"
                  status={progress.catches}
                  testId="productDetails"
                  href={catchDetailsLink}
                  onClick={onLinkClick(catchDetailsLink)}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="Storage-facilities-heading"
              >
                <span className="app-task-list__section-number">3.</span>
                {t('sdProgressStoragefacilities')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('sdProgressStoragefacilities')}
                  error={errors.storageFacilitiesError}
                  id="storageFacilities"
                  status={progress.storageFacilities}
                  testId="storageFacilities"
                  href={links.storageFacilities}
                  onClick={onLinkClick(links.storageFacilities)}
                />
              </UnorderedList>
            </ListItem>
            <br />
            <br />
            <ListItem>
              <H2
                className="app-task-list__section"
                data-testid="Transportation-heading"
              >
                <span className="app-task-list__section-number">4.</span>
                {t('sdProgessTransportation')}
              </H2>
              <UnorderedList className="app-task-list__items">
                <div className="grey-border-top"></div>
                <ProgressItem
                  title={t('commonProgressExportDestination')}
                  error={errors.exportDestinationError}
                  id="exportDestination"
                  status={progress.exportDestination}
                  testId="exportDestination"
                  href={links.exportJourney}
                  onClick={onLinkClick(links.exportJourney)}
                />
                <ProgressItem
                  title={t('commonTransportType')}
                  id="transportType"
                  error={errors.transportTypeError}
                  status={progress.transportType}
                  testId="transportType"
                  href={links.transportType}
                  onClick={onLinkClick(links.transportType)}
                />
                <ProgressItem
                  title={t('sdProgressTransportDetails')}
                  id="transportDetails"
                  error={errors.transportDetailsError}
                  status={progress.transportDetails}
                  testId="transportDetails"
                  href={links.transportDetails}
                  onClick={onLinkClick(links.transportDetails)}
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
              className="govuk-button govuk-button--secondary"
              onClick={handleReturnToDashboard}
            >
              {t('commonProgressReturnToDashboard')}
            </SecondaryButton>
              <ContinueButton
                onClick={onCheckYourAnswersAndSubmitClick}
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
  const progress = state.progress;
  return {
    progress: progress,
    transport: state.transport,
    confirmCopyDocument: state.confirmCopyDocument,
    storageNotes: state.storageNotes,
    errors: state.errors
  };
}
function loadData(store, journey) {
  return Promise.all([
    store.dispatch(getProgress(this.documentNumber, journey)),
    store.dispatch(getTransportDetails(journey, this.documentNumber)),
    store.dispatch(getStorageNotesFromRedis(this.documentNumber))
  ]);
}
export const component = withRouter(
  connect(mapStateToProps, {
    getProgress,
    checkProgress,
    getTransportDetails,
    clearProgress,
    clearCopyDocument,
    clearTransportDetails,
    getStorageNotes: getStorageNotesFromRedis,
    clearErrors
  })(withTranslation() (SdProgressPage))
);
export default {
  loadData,
  component: PageTemplateWrapper(component),
};