import * as common from './Common';
import * as transport from './Transport';
import {
  exporterAddressLookupTitle,
  storageNoteJourney,
  storageDocumentTitle,
  storageDocumentJourneyText,
  storageDocumentLookupTitle,
} from '../helpers/journeyConfiguration';

import { postcodeLookupContexts } from '../pages/common/LookupAddressPage';
import ProductDestinationPage from '../pages/common/ProductDestinationPage';
import ProductDetails from '../pages/storageNotes/productDetails';
import Products from '../pages/storageNotes/products';
import StorageFacilitiesPage from '../pages/storageNotes/storageFacilitiesPage';
import StorageFacility from '../pages/storageNotes/storageFacility';
import StorageNotesSummary from '../pages/storageNotes/summary';
import StorageNotesStatementPage from '../pages/storageNotes/statementPage';
import SdProgressPage from '../pages/storageNotes/SdProgressPage';
import {
  CONTAINER_VESSEL_KEY,
  PLANE_KEY,
  TRAIN_KEY,
  TRUCK_KEY,
} from '../components/helper/vehicleType';

const copyCertificateOptions = [
  {
    label: 'commonCopyThisProcessingStatementCopyAllCertificateData',
    value: 'copyAllCertificateData',
    id: 'copyAllCertificateData',
    name: 'copyDocument',
    hint: 'commonCopyThisStorageDocumentCopyAllCertificateDataHint',
  },
  {
    label: 'commonCopyThisDocumentVoidDocumentConfirm',
    value: 'voidDocumentConfirm',
    id: 'voidDocumentConfirm',
    name: 'copyDocument',
    hint: 'commonCopyThisDocumentVoidDocumentConfirmHint',
  },
];

export const withStorageNotesContext = (uri) =>
  `/create-storage-document/${uri}`;
export const createDraftStorageDocumentUri =
  '/orchestration/api/v1/document/storageDocument';
export const createDraftStorageDocumentNextUri = withStorageNotesContext(
  '{documentNumber}/progress'
);

export const storageDocumentPrivacyNoticePageUri =
  withStorageNotesContext('privacy-notice');
export const storageDocumentDashboardUri =
  withStorageNotesContext('storage-documents');

export const statementStorageNotesUri = withStorageNotesContext(
  ':documentNumber/storage-document-created'
);
export const storageDocumentConfirmDocumentVoidUri = withStorageNotesContext(
  ':documentNumber/void-this-storage-document'
);
export const storageDocumentConfirmCopyUri = withStorageNotesContext(
  ':documentNumber/copy-this-storage-document'
);
export const storageDocumentConfirmCopyVoidUri = withStorageNotesContext(
  ':documentNumber/copy-void-confirmation'
);
export const storageDocumentConfirmDeleteUri = withStorageNotesContext(
  ':documentNumber/delete-this-draft-storage-document'
);
export const addUserReferenceUri = withStorageNotesContext(
  ':documentNumber/add-your-reference'
);
export const companyDetailsUri = withStorageNotesContext(
  ':documentNumber/add-exporter-details'
);
export const sdProgressUri = withStorageNotesContext(
  ':documentNumber/progress'
);
export const companyDetailsAddressUri = withStorageNotesContext(
  ':documentNumber/what-exporters-address'
);
export const productDetailsUri = withStorageNotesContext(
  ':documentNumber/add-product-to-this-consignment'
);
export const productDestinationUri = withStorageNotesContext(
  ':documentNumber/what-export-destination'
);
export const productDetailsIndexUri = withStorageNotesContext(
  ':documentNumber/add-product-to-this-consignment/:productIndex'
);
export const productsUri = withStorageNotesContext(
  ':documentNumber/you-have-added-a-product'
);
export const storageFacilityUri = withStorageNotesContext(
  ':documentNumber/add-storage-facility-details'
);
export const whatStorageFacilityAddressUri = withStorageNotesContext(
  ':documentNumber/what-storage-facility-address/:facilityIndex'
);
export const storageFacilitiesIndexUri = withStorageNotesContext(
  ':documentNumber/add-storage-facility-details/:facilityIndex'
);
export const storageFacilitiesUri = withStorageNotesContext(
  ':documentNumber/you-have-added-a-storage-facility'
);
export const transportSelectionStorageNotesUri = withStorageNotesContext(
  ':documentNumber/how-does-the-export-leave-the-uk'
);
export const planeDetailsStorageNotesUri = withStorageNotesContext(
  ':documentNumber/add-transportation-details-plane'
);
export const truckCmrStorageNotesUri = withStorageNotesContext(
  ':documentNumber/do-you-have-a-road-transport-document'
);
export const truckDetailsStorageNotesUri = withStorageNotesContext(
  ':documentNumber/add-transportation-details-truck'
);
export const trainDetailsStorageNotesUri = withStorageNotesContext(
  ':documentNumber/add-transportation-details-train'
);
export const containerVesselDetailsStorageNotesUri = withStorageNotesContext(
  ':documentNumber/add-transportation-details-container-vessel'
);
export const summaryStorageNotesUri = withStorageNotesContext(
  ':documentNumber/check-your-information'
);

const storageDocument = [
  {
    ...common.PrivacyStatementPage,
    path: storageDocumentPrivacyNoticePageUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    nextUri: storageDocumentDashboardUri,
  },
  {
    ...common.JourneyDashboardPage,
    path: storageDocumentDashboardUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    createUri: createDraftStorageDocumentUri,
    createDraftNextUri: createDraftStorageDocumentNextUri,
    copyUri: storageDocumentConfirmCopyUri,
    nextUri: sdProgressUri,
    confirmUri: storageDocumentConfirmDeleteUri,
    confirmVoidDocumentUri: storageDocumentConfirmDocumentVoidUri,
    privacyNoticeUri: storageDocumentPrivacyNoticePageUri,
    summaryUri: summaryStorageNotesUri,
    progressUri: sdProgressUri,
  },
  {
    ...common.ConfirmDocumentVoidPage,
    path: storageDocumentConfirmDocumentVoidUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    previousUri: storageDocumentDashboardUri,
    nextUri: storageDocumentDashboardUri,
  },
  {
    ...common.ConfirmDocumentDeleteDraftPage,
    path: storageDocumentConfirmDeleteUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    previousUri: storageDocumentDashboardUri,
    nextUri: storageDocumentDashboardUri,
  },
  {
    ...common.CopyCertificateConfirmPage,
    path: storageDocumentConfirmCopyUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    previousUri: storageDocumentDashboardUri,
    nextUri: sdProgressUri,
    voidUri: storageDocumentConfirmCopyVoidUri,
    copyCertificateOptions,
  },
  {
    ...common.ConfirmDocumentCopyVoidPage,
    path: storageDocumentConfirmCopyVoidUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    previousUri: storageDocumentConfirmCopyUri,
    nextUri: sdProgressUri,
    cancelUri: storageDocumentDashboardUri,
  },
  {
    ...common.UserReferencePage,
    path: addUserReferenceUri,
    title: storageDocumentTitle,
    header: common.AddUserReferenceHeader,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    previousUri: sdProgressUri,
    nextUri: companyDetailsUri,
    saveAsDraftUri: storageDocumentDashboardUri,
  },
  {
    ...common.ExporterDetailsPage,
    path: companyDetailsUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    journeyText: storageDocumentJourneyText,
    previousUri: addUserReferenceUri,
    nextUri: productDetailsUri,
    confirmUri: storageDocumentConfirmDeleteUri,
    header: common.ExporterDetailsHeader,
    changeAddressUri: companyDetailsAddressUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...common.ExportersAddressPage,
    path: companyDetailsAddressUri,
    previousUri: companyDetailsUri,
    title: storageDocumentTitle,
    journey: storageDocumentJourneyText,
    nextUri: companyDetailsUri,
    postcodeLookupAddressTitle: exporterAddressLookupTitle,
    postcodeLookupContext: postcodeLookupContexts.EXPORTER_ADDRESS,
    progressUri: sdProgressUri,
  },
  {
    ...ProductDetails,
    path: productDetailsIndexUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    previousUri: productsUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...ProductDetails,
    path: productDetailsUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    firstProduct: true,
    previousUri: companyDetailsUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...Products,
    path: productsUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    previousUri: productDetailsUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...StorageFacility,
    path: storageFacilitiesIndexUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    changeAddressUri: whatStorageFacilityAddressUri,
    previousUri: storageFacilitiesIndexUri,
    nextUri: storageFacilitiesIndexUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    postcodeLookupContext: postcodeLookupContexts.EXPORTER_ADDRESS,
    progressUri: sdProgressUri,
  },
  {
    ...StorageFacility,
    path: storageFacilityUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    firstStorageFacility: true,
    changeAddressUri: whatStorageFacilityAddressUri,
    previousUri: storageFacilitiesIndexUri,
    nextUri: storageFacilitiesIndexUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...common.ExportersAddressPage,
    path: whatStorageFacilityAddressUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    previousUri: storageFacilitiesIndexUri,
    nextUri: storageFacilitiesIndexUri,
    postcodeLookupAddressTitle: storageDocumentLookupTitle,
    saveAsDraftUri: storageDocumentDashboardUri,
    postcodeLookupContext: postcodeLookupContexts.STORAGE_FACILITY_ADDRESS,
    progressUri: sdProgressUri,
  },
  {
    ...StorageFacilitiesPage,
    path: storageFacilitiesUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    nextUri: productDestinationUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...ProductDestinationPage,
    path: productDestinationUri,
    title: storageDocumentTitle,
    header: common.AddExporterDestinationHeader,
    journey: storageNoteJourney,
    previousUri: storageFacilitiesUri,
    nextUri: transportSelectionStorageNotesUri,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...SdProgressPage,
    path: sdProgressUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    previousUri: storageDocumentDashboardUri,
    nextUri: summaryStorageNotesUri,
    storageFacilitiesUri,
    transportSelectionStorageNotesUri,
    truckCmrUri: truckCmrStorageNotesUri,
    planeDetailsUri: planeDetailsStorageNotesUri,
    trainDetailsUri: trainDetailsStorageNotesUri,
    containerVesselDetailsUri: containerVesselDetailsStorageNotesUri,
    addUserReferenceUri,
    companyDetailsUri,
    productDetailsUri,
    productDestinationUri,
    productsUri,
    journeyText: storageDocumentJourneyText,
  },
  {
    ...transport.TransportSelectionPage,
    path: transportSelectionStorageNotesUri,
    title: storageDocumentTitle,
    vehicleTypes: transport.ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING,
    previousUri: productDestinationUri,
    truckCmrUri: truckCmrStorageNotesUri,
    planeDetailsUri: planeDetailsStorageNotesUri,
    trainDetailsUri: trainDetailsStorageNotesUri,
    containerVesselDetailsUri: containerVesselDetailsStorageNotesUri,
    summaryUri: summaryStorageNotesUri,
    journey: storageNoteJourney,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...transport.TransportDetailsPage,
    path: planeDetailsStorageNotesUri,
    title: storageDocumentTitle,
    previousUri: transportSelectionStorageNotesUri,
    nextUri: summaryStorageNotesUri,
    journey: storageNoteJourney,
    showExportDate: true,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
    transportType: PLANE_KEY,
  },
  {
    ...transport.TruckCMRPage,
    path: truckCmrStorageNotesUri,
    title: storageDocumentTitle,
    previousUri: transportSelectionStorageNotesUri,
    summaryUri: summaryStorageNotesUri,
    truckDetailsUri: truckDetailsStorageNotesUri,
    journey: storageNoteJourney,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
  },
  {
    ...transport.TransportDetailsPage,
    path: truckDetailsStorageNotesUri,
    title: storageDocumentTitle,
    previousUri: truckCmrStorageNotesUri,
    nextUri: summaryStorageNotesUri,
    journey: storageNoteJourney,
    showExportDate: true,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
    transportType: TRUCK_KEY,
  },
  {
    ...transport.TransportDetailsPage,
    path: trainDetailsStorageNotesUri,
    title: storageDocumentTitle,
    previousUri: transportSelectionStorageNotesUri,
    nextUri: summaryStorageNotesUri,
    journey: storageNoteJourney,
    showExportDate: true,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
    transportType: TRAIN_KEY,
  },
  {
    ...transport.TransportDetailsPage,
    path: containerVesselDetailsStorageNotesUri,
    title: storageDocumentTitle,
    previousUri: transportSelectionStorageNotesUri,
    nextUri: summaryStorageNotesUri,
    journey: storageNoteJourney,
    showExportDate: true,
    saveAsDraftUri: storageDocumentDashboardUri,
    progressUri: sdProgressUri,
    transportType: CONTAINER_VESSEL_KEY,
  },
  {
    ...StorageNotesSummary,
    path: summaryStorageNotesUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
  },
  {
    ...StorageNotesStatementPage,
    path: statementStorageNotesUri,
    title: storageDocumentTitle,
    journey: storageNoteJourney,
    finalPage: true,
  },
];

export default storageDocument;
