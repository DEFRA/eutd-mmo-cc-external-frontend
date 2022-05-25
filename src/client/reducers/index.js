import { combineReducers } from 'redux';
import accountDetailsReducer from './accountdetails.reducer';
import userDetailsReducer from './userdetails.reducer';
import addressDetailsReducer from './addressdetails.reducer';
import vesselsReducer from './vesselsReducer';
import fishReducers from './fishReducer';
import fishStatesReducer from './fishStatesReducer';
import addedSpeciesReducer from './addedSpeciesReducer';
import favouritesReducer from './favouritesReducer';
import addedSpeciesErrorStateReducer from './addedSpeciesErrorStateReducer';
import transportReducer from './transportReducer';
import transportDetailsErrorsReducer from './transportDetailsErrorsReducer';
import speciesStates from './speciesStatesReducer';
import speciesPresentations from './speciesPresentationsReducer';
import getCommodityCodeReducer from './getCommodityCodeReducer';
import processingStatementReducer from './processingStatementReducer';
import conservationReducer from './conservationReducer';
import errorsReducer from './errorsReducer';
import storageNotesReducer from './storageNotesReducer';
import exporterReducer from './exporter.reducer';
import exportPayloadReducer from './export-payload.reducer';
import exportCertificateReducer from './export-certificate.reducer';
import documents from './documentsReducer';
import globalReducer from './globalReducer';
import documentReducer from './getDocumentReducer';
import userAttributesReducer from './userAttributes.reducer';
import confirmDocumentDeleteReducer from './confirmDocumentDeleteReducer';
import confirmDocumentVoidReducer from './confirmDocumentVoidReducer';
import confirmCopyDocumentReducer from './confirmCopyDocumentReducer';
import exportCountry from './exportCountry.reducer';
import userReferenceReducer from './userReference.reducer';
import notificationReducer from './notification.reducer';
import completedDocumentReducer from './completedDocument.reducer';
import pendingDocumentReducer from './pendingDocument.reducer';
import summaryDocumentReducer from './summaryDocument.reducer';
import postcodeLookup from './postcodeLookupReducer';
import landingsTypeReducer from './landingsTypeReducer';
import directLandingReducer from './directLandingReducer';
import uploadFileReducer from './uploadFileReducer';
import progressReducer from './progress.reducer';
import changedLandingsTypeReducer from './changedLandingsTypeReducer';


export default combineReducers({
  exportCertificate: exportCertificateReducer,
  exportPayload: exportPayloadReducer,
  exporter: exporterReducer,
  vessels: vesselsReducer,
  fish: fishReducers,
  fishStates: fishStatesReducer,
  addedSpeciesPerUser: addedSpeciesReducer,
  addedFavouritesPerUser: favouritesReducer,
  addedSpeciesErrorState: addedSpeciesErrorStateReducer,
  transport: transportReducer,
  speciesStates,
  speciesPresentations,
  transportDetailsErrors: transportDetailsErrorsReducer,
  commodityCodes: getCommodityCodeReducer,
  processingStatement: processingStatementReducer,
  conservation: conservationReducer,
  storageNotes: storageNotesReducer,
  accountdetails: accountDetailsReducer,
  userdetails: userDetailsReducer,
  addressdetails: addressDetailsReducer,
  errors: errorsReducer,
  global: globalReducer,
  documents: documents,
  document : documentReducer,
  userAttributes: userAttributesReducer,
  confirmDocumentDelete: confirmDocumentDeleteReducer,
  confirmDocumentVoid: confirmDocumentVoidReducer,
  confirmCopyDocument: confirmCopyDocumentReducer,
  exportLocation: exportCountry,
  reference: userReferenceReducer,
  notification: notificationReducer,
  completedDocument: completedDocumentReducer,
  pendingDocument: pendingDocumentReducer,
  summaryDocument: summaryDocumentReducer,
  postcodeLookup: postcodeLookup,
  landingsType: landingsTypeReducer,
  directLandings: directLandingReducer,
  uploadedLandings: uploadFileReducer,
  progress: progressReducer,
  changedLandingsType: changedLandingsTypeReducer,
  config: (state = null) => state
});
