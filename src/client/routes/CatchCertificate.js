import React from 'react';
import * as common from './Common';
import * as transport from './Transport';
import {
  catchCertificateJourney,
  catchCertificatesTitle,
  catchCertificateJourneyText,
  exporterAddressLookupTitle
} from '../helpers/journeyConfiguration';
import { postcodeLookupContexts } from '../pages/common/LookupAddressPage';
import CompletePage from '../pages/exportCertificates/CompletePage';
import PendingPage from '../pages/exportCertificates/PendingPage';
import AddSpeciesPage from '../pages/exportCertificates/AddSpeciesPage';
import DirectLandingsPage from '../pages/exportCertificates/DirectLandingsPage';
import LandingsUpdatedPage from '../pages/exportCertificates/landings/LandingsUpdatedPage';
import LandingsTypeConfirmationPage from '../pages/exportCertificates/landings/LandingsTypeConfirmationPage';
import LandingsEntryPage from '../pages/exportCertificates/landings/LandingsEntryPage';
import WhoseWatersWereTheyCaughtInPage from '../pages/exportCertificates/WhoseWatersWereTheyCaughtInPage';
import WhereAreYouExportingFrom from '../pages/exportCertificates/WhereAreYouExportingFrom';
import CatchCertificateSummary from '../pages/exportCertificates/CatchCertificateSummary';
import UploadFilePage from '../pages/exportCertificates/UploadFilePage';
import { Redirect } from 'react-router';
import ProgressPage from '../pages/exportCertificates/ProgressPage';
import { PLANE_KEY, TRAIN_KEY, TRUCK_KEY, CONTAINER_VESSEL_KEY } from '../components/helper/vehicleType';

const dashboardUri = '/dashboard';
const copyCertificateOptions = [
  {
    label: 'ccCopyAllCertificateData',
    value: 'copyAllCertificateData',
    name: 'copyDocument',
    id: 'copyAllCertificateData',
    hint: 'ccCopyAllCertificateDataSubtitle1',
  },
  {
    label: 'ccCopyAllCertificateDataExceptTheLandings',
    value: 'copyExcludeLandings',
    id: 'copyExcludeLandings',
    name: 'copyDocument',
    hint: 'ccCopyAllCertificateDataSubtitle2',
  }, {
    label: 'ccCopyAllCertificateDataAndVoidTheOriginal',
    value: 'voidDocumentConfirm',
    id: 'voidDocumentConfirm',
    name: 'copyDocument',
    hint: 'commonCopyThisDocumentVoidDocumentConfirmHint',
  }
];

const landingsEntryOptions = [
  {
    label: 'ccLandingsEntryOptionsDirectLandingLabel',
    value: 'directLanding',
    name: 'landingsEntry',
    id: 'directLandingOptionEntry',
    hint: 'ccLandingsEntryOptionsDirectLandingHint',
  },
  {
    label: 'ccLandingsEntryOptionsManualEntryLabel',
    value: 'manualEntry',
    name: 'landingsEntry',
    id: 'manualOptionEntry',
    hint: 'ccLandingsEntryOptionsManualEntryHint',
  },
  {
    label: 'ccLandingsEntryOptionsUploadEntryLabel',
    value: 'uploadEntry',
    name: 'landingsEntry',
    id: 'uploadOptionEntry',
    hint: 'ccLandingsEntryOptionsUploadEntryHint',
  }
];

export const withCatchCertificateContext = uri => `/create-catch-certificate/${uri}`;
export const createDraftCatchCertificateUri = '/orchestration/api/v1/document/catchCertificate';
export const createDraftCatchCertificateLandingsEntryUri = withCatchCertificateContext('{documentNumber}/landings-entry');
export const catchCertificatePrivacyNoticePageUri = withCatchCertificateContext('privacy-notice');
export const catchCertificateJourneyDashboardUri = withCatchCertificateContext('catch-certificates');
export const catchCertificateConfirmDocumentVoidUri = withCatchCertificateContext(':documentNumber/void-this-catch-certificate');
export const catchCertificateConfirmDocumentCopyUri = withCatchCertificateContext(':documentNumber/copy-this-catch-certificate');
export const catchCertificateConfirmDocumentCopyVoidUri = withCatchCertificateContext(':documentNumber/copy-void-confirmation');
export const catchCertificateConfirmDeleteDraftUri = withCatchCertificateContext(':documentNumber/delete-this-draft-catch-certificate');
export const addUserReferenceUri = withCatchCertificateContext(':documentNumber/add-your-reference');
export const addExporterDetailsCatchCertificateUri = withCatchCertificateContext(':documentNumber/add-exporter-details');
export const exportersAddressCatchCertificateUri = withCatchCertificateContext(':documentNumber/what-exporters-address');
export const addSpeciesUri = withCatchCertificateContext(':documentNumber/what-are-you-exporting');
export const landingsEntryUri = withCatchCertificateContext(':documentNumber/landings-entry');
export const progressUri = withCatchCertificateContext(':documentNumber/progress');
export const landingTypeUri = withCatchCertificateContext(':documentNumber/landing-type');
export const landingsTypeConfirmationUri = withCatchCertificateContext(':documentNumber/landings-type-confirmation');
export const directLandingUri = withCatchCertificateContext(':documentNumber/direct-landing');
export const addLandingsUpdatedUri = withCatchCertificateContext(':documentNumber/add-landings');
export const whoseWatersUri = withCatchCertificateContext(':documentNumber/whose-waters-were-they-caught-in');
export const whereExportingUri = withCatchCertificateContext(':documentNumber/what-export-journey');
export const transportSelectionUri = withCatchCertificateContext(':documentNumber/how-does-the-export-leave-the-uk');
export const planeDetailsUri = withCatchCertificateContext(':documentNumber/add-transportation-details-plane');
export const truckCmrUri = withCatchCertificateContext(':documentNumber/do-you-have-a-road-transport-document');
export const truckDetailsUri = withCatchCertificateContext(':documentNumber/add-transportation-details-truck');
export const trainDetailsUri = withCatchCertificateContext(':documentNumber/add-transportation-details-train');
export const containerVesselDetailsUri = withCatchCertificateContext(':documentNumber/add-transportation-details-container-vessel');
export const summaryUri = withCatchCertificateContext(':documentNumber/check-your-information');
export const completeUri = withCatchCertificateContext(':documentNumber/catch-certificate-created');
export const pendingUri = withCatchCertificateContext(':documentNumber/catch-certificate-pending');
export const uploadFileUri = withCatchCertificateContext(':documentNumber/upload-file');
export const redirectUri = addLandingsUpdatedUri;

const catchCertificate = [
  {
    ...common.PrivacyStatementPage,
    path: catchCertificatePrivacyNoticePageUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    nextUri: catchCertificateJourneyDashboardUri
  },
  {
    ...common.JourneyDashboardPage,
    path: catchCertificateJourneyDashboardUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
    nextUri: addUserReferenceUri,
    progressUri: progressUri,
    confirmUri: catchCertificateConfirmDeleteDraftUri,
    confirmVoidDocumentUri: catchCertificateConfirmDocumentVoidUri,
    createUri: createDraftCatchCertificateUri,
    createDraftNextUri: createDraftCatchCertificateLandingsEntryUri,
    privacyNoticeUri: catchCertificatePrivacyNoticePageUri,
    copyUri: catchCertificateConfirmDocumentCopyUri,
    summaryUri,
  },
  {
    ...common.CopyCertificateConfirmPage,
    path: catchCertificateConfirmDocumentCopyUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
    previousUri: catchCertificateJourneyDashboardUri,
    nextUri: landingsEntryUri,
    voidUri: catchCertificateConfirmDocumentCopyVoidUri,
    copyCertificateOptions,
  },
  {
    ...common.ConfirmDocumentDeleteDraftPage,
    path: catchCertificateConfirmDeleteDraftUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
    previousUri: catchCertificateJourneyDashboardUri,
    nextUri: catchCertificateJourneyDashboardUri
  },
  {
    ...common.ConfirmDocumentVoidPage,
    path: catchCertificateConfirmDocumentVoidUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
    previousUri: catchCertificateJourneyDashboardUri,
    nextUri: catchCertificateJourneyDashboardUri
  },
  {
    ...common.ConfirmDocumentCopyVoidPage,
    path: catchCertificateConfirmDocumentCopyVoidUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
    previousUri: catchCertificateConfirmDocumentCopyUri,
    nextUri: landingsEntryUri,
    cancelUri: catchCertificateJourneyDashboardUri
  },
  {
    ...common.UserReferencePage,
    path: addUserReferenceUri,
    title: catchCertificatesTitle,
    header: common.AddUserReferenceHeader,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
    previousUri: progressUri,
    nextUri: addExporterDetailsCatchCertificateUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri: progressUri
  },
  {
    ...common.ExporterDetailsPage,
    path: addExporterDetailsCatchCertificateUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    previousUri: addUserReferenceUri,
    journeyText: catchCertificateJourneyText,
    nextUri: addSpeciesUri,
    confirmUri: catchCertificateConfirmDeleteDraftUri,
    header: common.ExporterDetailsHeader,
    showResponsiblePerson: true,
    changeAddressUri: exportersAddressCatchCertificateUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    uploadFileUri,
    landingsEntryUri,
    progressUri: progressUri
  },
  {
    ...common.ExportersAddressPage,
    path: exportersAddressCatchCertificateUri,
    previousUri: addExporterDetailsCatchCertificateUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    nextUri: addExporterDetailsCatchCertificateUri,
    landingsEntryUri,
    progressUri: progressUri,
    postcodeLookupAddressTitle: exporterAddressLookupTitle,
    postcodeLookupContext: postcodeLookupContexts.EXPORTER_ADDRESS
  },
  {
    ...UploadFilePage,
    path: uploadFileUri,
    title: catchCertificatesTitle,
    journey: catchCertificateJourney,
    previousUri: addExporterDetailsCatchCertificateUri,
    landingsEntryUri,
    nextUri: addSpeciesUri,
    dashboardUri: catchCertificateJourneyDashboardUri,
    progressUri: progressUri
  },
  {
    ...AddSpeciesPage,
    path: addSpeciesUri,
    title: catchCertificatesTitle,
    previousUri: addExporterDetailsCatchCertificateUri,
    nextUri: addLandingsUpdatedUri,
    directLandingsUri: directLandingUri,
    journey: catchCertificateJourney,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    directLandingUri,
    landingsEntryUri,
    summaryUri,
    progressUri: progressUri
  },
  {
    ...LandingsEntryPage,
    path: landingsEntryUri,
    title: catchCertificatesTitle,
    previousUri: catchCertificateJourneyDashboardUri,
    nextUri: progressUri,
    journey: catchCertificateJourney,
    landingsTypeConfirmationUri,
    landingsEntryOptions,
    progressUri: progressUri
  },
  {
    ...ProgressPage,
    path: progressUri,
    title: catchCertificatesTitle,
    previousUri: landingsEntryUri,
    nextUri: summaryUri,
    addUserReferenceUri,
    addExporterDetailsCatchCertificateUri,
    addSpeciesUri,
    uploadFileUri,
    directLandingUri,
    addLandingsUpdatedUri,
    whoseWatersUri,
    whereExportingUri,
    summaryUri,
    transportSelectionUri,
    planeDetailsUri,
    truckCmrUri,
    truckDetailsUri,
    trainDetailsUri,
    containerVesselDetailsUri,
    dashboardUri: catchCertificateJourneyDashboardUri,
    journey: catchCertificateJourney,
    landingsEntryOptions,
  },
  {
    path: landingTypeUri,
    exact: true,
    component: function RedirectToLandingsEntryPage(props) {
      const { documentNumber } = props.match.params;
      const updatedLandingsEntryUri = landingsEntryUri.replace(':documentNumber', documentNumber);

      return <Redirect to={updatedLandingsEntryUri}/>;
    }
  },
  {
    ...DirectLandingsPage,
    path: directLandingUri,
    journey: catchCertificateJourney,
    previousUri: addSpeciesUri,
    title: catchCertificatesTitle,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    nextUri: whoseWatersUri,
    landingsEntryUri,
    summaryUri,
    progressUri
  },
  {
    ...LandingsUpdatedPage,
    path: addLandingsUpdatedUri,
    title: catchCertificatesTitle,
    previousUri: addSpeciesUri,
    nextUri: whoseWatersUri,
    uploadFileUri,
    journey: catchCertificateJourney,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    landingsEntryUri,
    progressUri
  },
  {
    ...LandingsTypeConfirmationPage,
    path: landingsTypeConfirmationUri,
    title: catchCertificatesTitle,
    previousUri: landingsEntryUri,
    nextUri: progressUri,
    dashboardUri: catchCertificateJourneyDashboardUri,
    uploadFileUri,
    journey: catchCertificateJourney,
    journeyText: catchCertificateJourneyText,
  },
  {
    ...WhoseWatersWereTheyCaughtInPage,
    path: whoseWatersUri,
    title: catchCertificatesTitle,
    previousUri: addLandingsUpdatedUri,
    nextUri: whereExportingUri,
    landingsEntryUri,
    journey: catchCertificateJourney,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    directLandingUri: directLandingUri,
    progressUri: progressUri
  },
  {
    ...WhereAreYouExportingFrom,
    path: whereExportingUri,
    title: catchCertificatesTitle,
    previousUri: whoseWatersUri,
    nextUri: transportSelectionUri,
    landingsEntryUri,
    journey: catchCertificateJourney,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    summaryUri,
    progressUri: progressUri
  },
  {
    ...transport.TransportSelectionPage,
    path: transportSelectionUri,
    title: catchCertificatesTitle,
    vehicleTypes: transport.ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING,
    previousUri: whereExportingUri,
    truckCmrUri,
    planeDetailsUri,
    trainDetailsUri,
    containerVesselDetailsUri,
    summaryUri,
    journey: catchCertificateJourney,
    landingsEntryUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri
  },
  {
    ...transport.TransportDetailsPage,
    path: planeDetailsUri,
    title: catchCertificatesTitle,
    previousUri: transportSelectionUri,
    nextUri: summaryUri,
    journey: catchCertificateJourney,
    landingsEntryUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri,
    transportType: PLANE_KEY
  },
  {
    ...transport.TruckCMRPage,
    path: truckCmrUri,
    title: catchCertificatesTitle,
    previousUri: transportSelectionUri,
    summaryUri,
    truckDetailsUri,
    journey: catchCertificateJourney,
    landingsEntryUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri
  },
  {
    ...transport.TransportDetailsPage,
    path: truckDetailsUri,
    title: catchCertificatesTitle,
    previousUri: truckCmrUri,
    nextUri: summaryUri,
    journey: catchCertificateJourney,
    landingsEntryUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri,
    transportType: TRUCK_KEY
  },
  {
    ...transport.TransportDetailsPage,
    path: trainDetailsUri,
    title: catchCertificatesTitle,
    previousUri: transportSelectionUri,
    nextUri: summaryUri,
    journey: catchCertificateJourney,
    landingsEntryUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri,
    transportType: TRAIN_KEY
  },
  {
    ...transport.TransportDetailsPage,
    path: containerVesselDetailsUri,
    title: catchCertificatesTitle,
    previousUri: transportSelectionUri,
    nextUri: summaryUri,
    journey: catchCertificateJourney,
    landingsEntryUri,
    saveAsDraftUri: catchCertificateJourneyDashboardUri,
    progressUri,
    transportType: CONTAINER_VESSEL_KEY
  },
  {
    ...CatchCertificateSummary,
    path: summaryUri,
    title: catchCertificatesTitle,
    transportSelectionUri,
    conservationManagementUri: whoseWatersUri,
    addSpeciesUri,
    addLandingsUpdatedUri,
    whereExportingUri,
    addExporterDetailsUri: addExporterDetailsCatchCertificateUri,
    truckCmrUri,
    truckDetailsUri,
    planeDetailsUri,
    trainDetailsUri,
    containerVesselDetailsUri,
    completeUri,
    pendingUri,
    redirectUri,
    landingsEntryUri,
    journey: catchCertificateJourney,
    landingsEntryOptions
  },
  {
    ...CompletePage,
    path: completeUri,
    title: catchCertificatesTitle,
    finalPage: true,
    dashboardUri,
    journey: catchCertificateJourney
  },
  {
    ...PendingPage,
    path: pendingUri,
    title: catchCertificatesTitle,
    finalPage: true,
    dashboardUri,
    journey: catchCertificateJourney
  }
];


export default catchCertificate;

