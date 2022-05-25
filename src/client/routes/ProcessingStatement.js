
import * as common from './Common';
import {
  processingStatementJourney,
  processingStatementTitle,
  processingStatementJourneyText,
  exporterAddressLookupTitle,
  processingPlantLookupTitle
} from '../helpers/journeyConfiguration';

import {postcodeLookupContexts} from '../pages/common/LookupAddressPage';
import ConsignmentPage from '../pages/processingStatement/consignmentPage';
import AddCatchDetailsPage from '../pages/processingStatement/addCatchDetailsPage';
import AddCatchWeightsPage from '../pages/processingStatement/addCatchWeightsPage';
import AddHealthCertificate from '../pages/processingStatement/addHealthCertificatePage';
import CatchesPage from '../pages/processingStatement/catchesPage';
import AddProcessingPlantDetails from '../pages/processingStatement/addProcessingPlantDetails';
import AddProcessingPlantAddress from '../pages/processingStatement/addProcessingPlantAddress';
import ProductDestinationPage from '../pages/common/ProductDestinationPage';
import SummaryPage from '../pages/processingStatement/summaryPage';
import StatementPage from '../pages/processingStatement/statementPage';
import PsProgressPage from '../pages/processingStatement/PsProgressPage';

const copyCertificateOptions = [
  {
    label: 'commonCopyThisProcessingStatementCopyAllCertificateData',
    value: 'copyAllCertificateData',
    id: 'copyAllCertificateData',
    name: 'copyDocument',
    hint: 'commonCopyThisProcessingStatementCopyAllCertificateDataHint'
  },
  {
    label: 'commonCopyThisDocumentVoidDocumentConfirm',
    value: 'voidDocumentConfirm',
    id: 'voidDocumentConfirm',
    name: 'copyDocument',
    hint: 'commonCopyThisDocumentVoidDocumentConfirmHint'
  }
];

export const withProcessingStatementContext = uri => `/create-processing-statement/${uri}`;
export const createDraftProcessingStatementUri = '/orchestration/api/v1/document/processingStatement';
export const createDraftProcessingStatementNextUri = withProcessingStatementContext('{documentNumber}/progress');

export const psPrivacyNoticePage = withProcessingStatementContext('privacy-notice');
export const psDashboardPage = withProcessingStatementContext('processing-statements');

export const psProcessingStatementCreated = withProcessingStatementContext(':documentNumber/processing-statement-created');
export const psConfirmDocumentVoid = withProcessingStatementContext(':documentNumber/void-this-processing-statement');
export const psConfirmCopyUri = withProcessingStatementContext(':documentNumber/copy-this-processing-statement');
export const psConfirmDocumentCopyVoidUri = withProcessingStatementContext(':documentNumber/copy-void-confirmation');
export const psAddUserReference = withProcessingStatementContext(':documentNumber/add-your-reference');
export const psConfirmDocumentDeleteDraft = withProcessingStatementContext(':documentNumber/delete-this-draft-processing-statement');
export const psAddExporterDetails = withProcessingStatementContext(':documentNumber/add-exporter-details');
export const psAddExportersAddress = withProcessingStatementContext(':documentNumber/what-exporters-address');
export const psProgressUri = withProcessingStatementContext(':documentNumber/progress');

export const psAddConsignmentDetails = withProcessingStatementContext(':documentNumber/add-consignment-details');
export const psAddCatchDetails = withProcessingStatementContext(':documentNumber/add-catch-details');
export const psAddCatchDetailsIndex = withProcessingStatementContext(':documentNumber/add-catch-details/:catchIndex');
export const psAddCatchWeights = withProcessingStatementContext(':documentNumber/add-catch-weights');
export const psAddCatchWeightsIndex = withProcessingStatementContext(':documentNumber/add-catch-weights/:catchIndex');
export const psCatchAdded = withProcessingStatementContext(':documentNumber/catch-added');
export const psAddHealthCertificate = withProcessingStatementContext(':documentNumber/add-health-certificate');
export const psAddProcessingPlantDetails = withProcessingStatementContext(':documentNumber/add-processing-plant-details');
export const psAddProcessingPlantAddress = withProcessingStatementContext(':documentNumber/add-processing-plant-address');
export const psWhatProcessingPlantAddress = withProcessingStatementContext(':documentNumber/what-processing-plant-address');
export const psProductDestinationUri = withProcessingStatementContext(':documentNumber/what-export-destination');
export const psCheckYourInformation = withProcessingStatementContext(':documentNumber/check-your-information');

const processingStatement = [
  {
    ...common.PrivacyStatementPage,
    path: psPrivacyNoticePage,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    nextUri: psDashboardPage
  },
  {
    ...common.JourneyDashboardPage,
    path: psDashboardPage,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    nextUri: psAddUserReference,
    progressUri: psProgressUri,
    confirmUri: psConfirmDocumentDeleteDraft,
    confirmVoidDocumentUri: psConfirmDocumentVoid,
    createUri: createDraftProcessingStatementUri,
    createDraftNextUri: createDraftProcessingStatementNextUri,
    copyUri: psConfirmCopyUri,
    privacyNoticeUri: psPrivacyNoticePage,
    summaryUri: psCheckYourInformation
  },
  {
    ...common.UserReferencePage,
    path: psAddUserReference,
    title: processingStatementTitle,
    header: common.AddUserReferenceHeader,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    previousUri: psProgressUri,
    nextUri: psAddExporterDetails,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...common.ConfirmDocumentVoidPage,
    path: psConfirmDocumentVoid,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    previousUri: psDashboardPage,
    nextUri: psDashboardPage
  },
  {
    ...common.ConfirmDocumentDeleteDraftPage,
    path: psConfirmDocumentDeleteDraft,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    previousUri: psDashboardPage,
    nextUri: psDashboardPage,
  },
  {
    ...common.CopyCertificateConfirmPage,
    path: psConfirmCopyUri,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    previousUri: psDashboardPage,
    nextUri: psProgressUri,
    voidUri: psConfirmDocumentCopyVoidUri,
    copyCertificateOptions
  },
  {
    ...common.ConfirmDocumentCopyVoidPage,
    path: psConfirmDocumentCopyVoidUri,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    previousUri: psConfirmCopyUri,
    nextUri: psProgressUri,
    cancelUri: psDashboardPage
  },
  {
    ...common.ExporterDetailsPage,
    path: psAddExporterDetails,
    title: processingStatementTitle,
    header: common.ExporterDetailsHeader,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
    previousUri: psAddUserReference,
    progressUri: psProgressUri,
    confirmUri: psConfirmDocumentDeleteDraft,
    nextUri: psAddConsignmentDetails,
    changeAddressUri: psAddExportersAddress,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...common.ExportersAddressPage,
    path: psAddExportersAddress,
    previousUri: psAddExporterDetails,
    title: processingStatementTitle,
    progressUri: psProgressUri,
    journey: processingStatementJourney,
    nextUri: psAddExporterDetails,
    postcodeLookupAddressTitle: exporterAddressLookupTitle,
    postcodeLookupContext: postcodeLookupContexts.EXPORTER_ADDRESS
  },
  {
    ...common.ExportersAddressPage,
    path: psWhatProcessingPlantAddress,
    previousUri: psAddProcessingPlantAddress,
    title: processingStatementTitle,
    progressUri: psProgressUri,
    journey: processingStatementJourney,
    nextUri: psAddProcessingPlantAddress,
    postcodeLookupAddressTitle: processingPlantLookupTitle,
    postcodeLookupContext: postcodeLookupContexts.PROCESSING_PLANT_ADDRESS
  },
  {
    ...PsProgressPage,
    path: psProgressUri,
    title: processingStatementTitle,
    previousUri: psDashboardPage,
    nextUri: psCheckYourInformation,
    referenceUri: psAddUserReference,
    exporterUri: psAddExporterDetails,
    consignmentDescriptionUri: psAddConsignmentDetails,
    catchesUri: psAddCatchDetails,
    catchesAddedUri: psCatchAdded,
    processingPlantUri: psAddProcessingPlantDetails,
    processingPlantAddressUri: psAddProcessingPlantAddress,
    exportHealthCertificateUri: psAddHealthCertificate,
    exportDestinationUri: psProductDestinationUri,
    journey: processingStatementJourney,
    journeyText: processingStatementJourneyText,
  },
  {
    ...ConsignmentPage,
    path: psAddConsignmentDetails,
    title: processingStatementTitle,
    nextUri: psAddCatchDetails,
    progressUri: psProgressUri,
    previousUri: psAddExporterDetails,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddCatchDetailsPage,
    path: psAddCatchDetailsIndex,
    title: processingStatementTitle,
    previousUri: psAddConsignmentDetails,
    progressUri: psProgressUri,
    nextUri: psAddCatchWeightsIndex,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddCatchDetailsPage,
    path: psAddCatchDetails,
    title: processingStatementTitle,
    nextUri: psAddCatchWeights,
    previousUri: psAddConsignmentDetails,
    progressUri: psProgressUri,
    firstCatch: true,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddCatchWeightsPage,
    path: psAddCatchWeightsIndex,
    title: processingStatementTitle,
    nextUri: psCatchAdded,
    progressUri: psProgressUri,
    previousUri: psAddCatchDetails,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddCatchWeightsPage,
    path: psAddCatchWeights,
    title: processingStatementTitle,
    nextUri: psCatchAdded,
    previousUri: psAddCatchDetails,
    progressUri: psProgressUri,
    firstCatch: true,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...CatchesPage,
    path: psCatchAdded,
    previousUri: psAddCatchWeights,
    nextUri: psAddProcessingPlantDetails,
    progressUri: psProgressUri,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddProcessingPlantDetails,
    path: psAddProcessingPlantDetails,
    title: processingStatementTitle,
    previousUri: psCatchAdded,
    progressUri: psProgressUri,
    nextUri: psAddProcessingPlantAddress,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddProcessingPlantAddress,
    path: psAddProcessingPlantAddress,
    title: processingStatementTitle,
    progressUri: psProgressUri,
    previousUri: psAddProcessingPlantDetails,
    nextUri: psAddHealthCertificate,
    changeAddressUri: psWhatProcessingPlantAddress,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...AddHealthCertificate,
    path: psAddHealthCertificate,
    title: processingStatementTitle,
    nextUri: psProductDestinationUri,
    progressUri: psProgressUri,
    previousUri: psAddProcessingPlantAddress,
    journey: processingStatementJourney,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...ProductDestinationPage,
    path: psProductDestinationUri,
    title: processingStatementTitle,
    progressUri: psProgressUri,
    header: common.AddExporterDestinationHeader,
    journey: processingStatementJourney,
    previousUri: psAddHealthCertificate,
    nextUri: psCheckYourInformation,
    saveAsDraftUri: psDashboardPage
  },
  {
    ...SummaryPage,
    path: psCheckYourInformation,
    title: processingStatementTitle,
    journey: processingStatementJourney,
    nextUri: psProcessingStatementCreated,
    previousUri: psProductDestinationUri,
  },
  {
    ...StatementPage,
    path: psProcessingStatementCreated,
    title: processingStatementTitle,
    finalPage: true,
    journey: processingStatementJourney
  }
];

export default processingStatement;