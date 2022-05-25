const anyEmpty = (label) => `Enter the ${label}`;
const anyRequired = (label) => `Enter the ${label}`;
const valid = (label) => `Enter a valid ${label}`;
const greaterThan = (label, than) => `Enter ${label} greater than ${than}`;
const dateFormat = (format) => `Enter a real date in the ${format} format`;

const railwayBillNumberLabel = 'railway bill number';
const stationNameLabel = 'station name';
const conservationReferenceLabel = 'conservation reference';
const anotherConservationLabel = 'another conservation';
const dateLabel = 'date';

const fieldLabel = {
  exporterCompanyName: 'company name',
  exporterFullName: 'your name or the name of the responsible person',
  addressOne: 'building and street (address line 1 of 2)',
  townCity: 'town or city',
  postcode: 'postcode',
  streetName: 'street name',
  county: 'county/state/province',
  country: 'country',
};

const getErrorMessage = (key, params = []) => {
  const errors = {
    'error.vessel.any.invalid': valid('vessel'),
    'error.vessel.any.empty': anyEmpty('vessel'),
    'error.date.any.empty': anyEmpty('date'),
    'error.weight.number.greater': greaterThan('weight', 0),
    'error.weight.number.base': anyEmpty('weight'),
    'error.faoArea.any.required': 'ccUploadFilePageTableCatchAreaMissingError',
    'error.faoArea.any.missing': 'ccUploadFilePageTableCatchAreaMissingError',
    'error.faoArea.any.only': 'ccUploadFilePageTableCatchAreaMissingError',
    'error.faoArea.any.invalid': 'ccUploadFilePageTableCatchAreaInvalidError',
    'error.species.any.empty': 'ccProductFavouritesPageErrorSpeciesName',
    'error.species.any.required': 'ccProductFavouritesPageErrorSpeciesName',
    'error.species.any.invalid': 'ccProductFavouritesPageErrorSpeciesName',
    'error.species.string.empty': 'ccProductFavouritesPageErrorSpeciesName',
    'error.species.string.required': 'ccProductFavouritesPageErrorSpeciesName',
    'error.species.string.invalid': 'ccProductFavouritesPageErrorSpeciesName',
    'error.exportDestination.any.invalid':
      'commonProductDestinationErrorInvalidCountry',
    'error.state.any.required': 'ccProductFavouritesPageErrorState',
    'error.state.any.empty': 'ccProductFavouritesPageErrorState',
    'error.presentation.any.required':
      'ccProductFavouritesPageErrorPresentation',
    'error.presentation.any.empty': 'ccProductFavouritesPageErrorPresentation',
    'error.state.string.empty': 'ccProductFavouritesPageErrorState',
    'error.presentation.string.empty':
      'ccProductFavouritesPageErrorPresentation',
    'error.commodity_code.any.required':
      'ccProductFavouritesPageErrorCommodityCode',
    'error.commodity_code.any.invalid':
      'ccProductFavouritesPageErrorCommodityCode',
    'error.commodity_code.string.empty':
      'ccProductFavouritesPageErrorCommodityCode',
    'error.flightNumber.any.required':
      'commonAddTransportationDetailsPlaneFlightNumberLabelError',
    'error.flightNumber.any.empty':
      'commonAddTransportationDetailsPlaneFlightNumberLabelError',
    'error.flightNumber.string.empty':
      'commonAddTransportationDetailsPlaneFlightNumberLabelError',
    'error.flightNumber.string.max':
      'commonAddTransportationDetailsPlaneFlightNumberMaxCharError',
    'error.flightNumber.string.alphanum':
      'commonAddTransportationDetailsPlaneFlightNumberOnlyNumbersError',
    'error.containerNumber.any.required':
      'commonAddTransportationDetailsPlaneContainerNumberLabelError',
    'error.containerNumber.any.empty':
      'commonAddTransportationDetailsPlaneContainerNumberLabelError',
    'error.containerNumber.string.empty':
      'commonAddTransportationDetailsPlaneContainerNumberLabelError',
    'error.containerNumber.string.max':
      'commonAddTransportationDetailsPlaneContainerMaxCharError',
    'error.containerNumber.string.alphanum':
      'commonAddTransportationDetailsPlaneContainerOnlyNumLettersError',
    'error.containerNumber.string.pattern.base':
      'commonAddTransportationDetailsPlaneContainerOnlyNumLettersError',
    'error.departurePlace.any.required':
      'sdAddTransportationDetailsPlaneDeparturePlaceLabelError',
    'error.departurePlace.any.empty':
      'sdAddTransportationDetailsPlaneDeparturePlaceLabelError',
    'error.departurePlace.string.empty':
      'sdAddTransportationDetailsPlaneDeparturePlaceLabelError',
    'error.departurePlace.string.pattern.base':
      'sdAddTransportationDetailsPlaneDeparturePlaceCharValidationError',
    'error.departurePlace.string.max':
      'sdAddTransportationDetailsPlaneDeparturePlaceMaxCharError',
    'error.vehicle.any.required':
      'sdTransportSelectionTypeOfTransportErrorNull',
    'error.vehicle.any.empty': 'sdTransportSelectionTypeOfTransportErrorNull',
    'error.vehicle.string.empty':
      'sdTransportSelectionTypeOfTransportErrorNull',
    'error.railwayBillNumber.any.empty': anyEmpty(railwayBillNumberLabel),
    'error.railwayBillNumber.string.empty': anyEmpty(railwayBillNumberLabel),
    'error.railwayBillNumber.any.required':
      'sdTransportDetailsRailwayBillNumberErrorRequired',
    'error.railwayBillNumber.string.alphanum':
      'commonAddTransportationDetailsRailwayBillOnlyNumLettersError',
    'error.railwayBillNumber.string.max':
      'commonAddTransportationDetailsRailwayBillMaxCharError',
    'error.stationName.any.empty': anyEmpty(stationNameLabel),
    'error.stationName.string.empty': anyEmpty(stationNameLabel),
    'error.stationName.any.required': anyRequired(stationNameLabel),
    'error.cmr.any.required': 'commonRoadTransportDocumentError',
    'error.nationalityOfVehicle.any.required':
      'commonTransportationDetailsTruckNationalityError',
    'error.nationalityOfVehicle.any.empty':
      'commonTransportationDetailsTruckNationalityError',
    'error.nationalityOfVehicle.string.empty':
      'commonTransportationDetailsTruckNationalityError',
    'error.registrationNumber.any.required':
      'commonTransportationDetailsTruckRegNumberError',
    'error.registrationNumber.any.empty':
      'commonTransportationDetailsTruckRegNumberError',
    'error.registrationNumber.string.empty':
      'commonTransportationDetailsTruckRegNumberError',
    'error.registrationNumber.string.max':
      'ccAddTransportationDetailsRegistrationCharExceedError',
    'error.registrationNumber.string.pattern.base':
      'ccAddTransportationDetailsRegistrationOnlyAlphaNumError',
    'error.vesselName.any.required':
      'commonAddTransportationDetailsVesselNameError',
    'error.vesselName.any.empty':
      'commonAddTransportationDetailsVesselNameError',
    'error.vesselName.string.empty':
      'commonAddTransportationDetailsVesselNameError',
    'error.vesselName.string.max':
      'commonAddTransportationDetailsVesselNameMax',
    'error.vesselName.string.pattern.base':
      'commonAddTransportationDetailsVesselNameBasePatternError',
    'error.flagState.any.required':
      'commonAddTransportationDetailsVesselFlagError',
    'error.flagState.any.empty':
      'commonAddTransportationDetailsVesselFlagError',
    'error.flagState.string.empty':
      'commonAddTransportationDetailsVesselFlagError',
    'error.conservationReference.any.required': anyRequired(
      conservationReferenceLabel
    ),
    'error.conservationReference.any.empty': anyEmpty(
      conservationReferenceLabel
    ),
    'error.conservationReference.string.empty': anyEmpty(
      conservationReferenceLabel
    ),
    'error.anotherConservation.any.required': anyRequired(
      anotherConservationLabel
    ),
    'error.anotherConservation.any.empty': anyEmpty(anotherConservationLabel),
    'error.anotherConservation.string.empty': anyEmpty(
      anotherConservationLabel
    ),
    'error.date.date.base': anyRequired(dateLabel),
    'error.date.date.format': dateFormat('dd/mm/yyyy'),
    'error.exporterCompanyName.string.empty':
      'commonAddExporterDetailsErrorCompanyName',
    'error.exporterCompanyName.string.required':
      'commonAddExporterDetailsErrorCompanyName',
    'error.exporterFullName.string.empty':
      'commonAddExporterDetailsPersonResponsibleError',
    'error.exporterFullName.string.required':
      'commonAddExporterDetailsPersonResponsibleError',
    'error.addressOne.string.empty': `Enter the ${fieldLabel['addressOne']}`,
    'error.addressOne.string.required': `Enter the ${fieldLabel['addressOne']}`,
    'error.townCity.string.empty': 'commonWhatExportersAddressErrorTownCity',
    'error.townCity.string.required': `Enter the ${fieldLabel['townCity']}`,
    'error.townCity.string.base': `Enter the ${fieldLabel['townCity']}`,
    'error.exporterCompanyName.any.empty':
      'commonAddExporterDetailsErrorCompanyName',
    'error.exporterCompanyName.any.required':
      'commonAddExporterDetailsErrorCompanyName',
    'error.exporterFullName.any.empty':
      'commonAddExporterDetailsPersonResponsibleError',
    'error.exporterFullName.any.required':
      'commonAddExporterDetailsPersonResponsibleError',
    'error.addressOne.any.empty': `Enter the ${fieldLabel['addressOne']}`,
    'error.addressOne.any.required': `Enter the ${fieldLabel['addressOne']}`,
    'error.addressFirstPart.any.required':
      'Enter a sub-building name, building number, a building name or street name',
    'error.townCity.any.empty': `Enter the ${fieldLabel['townCity']}`,
    'error.townCity.any.required': `Enter the ${fieldLabel['townCity']}`,
    'error.postcode.string.empty': 'commonLookupAddressPageErrorPostcodeEmpty',
    'error.postcode.string.base': `Enter a ${fieldLabel['postcode']}`,
    'error.postcode.any.required': `Enter a ${fieldLabel['postcode']}`,
    'error.postcode.string.min':
      'commonLookupAddressPageErrorPostcodeValidation',
    'error.postcode.string.max':
      'commonLookupAddressPageErrorPostcodeValidation',
    'error.streetName.any.required': `Enter a ${fieldLabel['streetName']}`,
    'error.country.any.required': 'Select a country from the list',
    'error.country.string.empty': 'commonWhatExportersAddressErrorCountry',
    'error.country.any.invalid': 'commonWhatExportersAddressErrorCountry',
    'error.streetName.string.empty':
      'commonWhatExportersAddressErrorStreetName',
    'error.subBuildingName.string.pattern.base':
      'commonWhatExportersAddressErrorSubBuildingValidation',
    'error.buildingName.string.pattern.base':
      'commonWhatExportersAddressErrorBuildingNameValidation',
    'error.buildingNumber.string.pattern.base':
      'commonWhatExportersAddressErrorBuildingNumberValidation',
    'error.streetName.string.pattern.base':
      'commonWhatExportersAddressErrorStreetNameValidation',
    'error.townCity.string.pattern.base':
      'commonWhatExportersAddressErrorTownCityValidation',
    'error.county.string.pattern.base': 'commonWhatExportersAddressErrorCounty',
    'error.postcode.string.regex.base':
      'commonLookupAddressPageErrorPostcodeValidation',
    'error.postcode.string.pattern.base':
      'commonLookupAddressPageErrorPostcodeValidation',
    'error.address.any.required':
      'commonAddExporterDetailsExportersErrorAddress',
    'error.vessel.string.base': 'Select a vessel from the list',
    'error.vessel.label.any.empty': 'Select a vessel from the list',
    'error.vessel.vessel.vesselName.any.empty':
      'ccAddLandingSelectVesselListNullError',
    'error.vessel.vesselName.any.required':
      'ccAddLandingSelectVesselListNullError',
    'error.exportWeight.number.base': 'ccCommonExportWeightAsNumberError',
    'error.exportWeight.number.greater': 'ccCommonExportWeightGreaterError',
    'error.exportWeight.number.decimal-places':
      'ccCommonExportWeightDecimalPlacesError',
    'error.exportWeight.any.required': 'ccCommonExportWeightRequiredError',
    'error.exportWeight.any.empty': 'ccCommonExportWeightRequiredError',
    'error.exportWeight.any.missing': 'ccCommonExportWeightMissingError',
    'error.exportDate.any.required':
      'commonAddTransportationDetailsPlaneExportDateError',
    'error.exportDate.date.base':
      'commonAddTransportationDetailsPlaneExportDateError',
    'error.exportDate.date.format':
      'commonAddTransportationDetailsPlaneExportDateError',
    'error.dateLanded.date.base': 'ccCommonDateLandedRealError',
    'error.dateLanded.any.required': 'ccCommonDateLandedRequiredError',
    'error.dateLanded.any.empty': 'ccCommonDateLandedRequiredError',
    'error.dateLanded.date.format':
      'psAddHealthCertificateErrorRealDateHealthCertificateDate',
    'error.dateLanded.date.isoDate': 'ccCommonDateLandedInvalidError',
    'error.dateLanded.date.max': `ccUploadFilePageTableDateLandedFutureMaximumDaysError-${params[0]}`,
    'error.dateLanded.date.missing': 'ccCommonDateLandedMissingError',
    'error.watersCaughtIn.object.missing':
      'ccWhoseWatersWereTheyCaughtInErrorRequired',
    'error.otherWaters.any.empty':
      'ccWhoseWatersWereTheyCaughtInErrorOtherWatersRequired',
    'error.otherWaters.any.required':
      'ccWhoseWatersWereTheyCaughtInErrorOtherWatersRequired',
    'error.documentDelete.any.required': 'commonDocumentDraftDeleteError',
    'error.documentVoid.any.required': 'commonConfirmDocumentVoidPageError',
    'error.voidOriginal.any.required': 'commonCopyVoidConfirmationError',
    'error.copyDocumentAcknowledged.any.invalid':
      'commonCopyAcknowledgementError',
    'error.copyDocumentAcknowledged.any.required':
      'commonCopyAcknowledgementError',
    'error.userReference.string.max': 'commonUserReferencePageErrorMaxChar',
    'error.userReference.string.pattern.base':
      'commonUserReferenceEnterRefAsACombination',
    'validation.vessel.license.invalid-date':
      'ccUploadFilePageTableVesselInvalidLicenseError',
    'validation.product.seasonal.invalid-date':
      'ccUploadFilePageTableVesselSeasonalRestictionError',
    'error.product.string.empty': 'ccAddLandingSelectProductFromListError',
    'error.product.any.required': 'ccAddLandingSelectProductFromListError',
    'error.confirmLandingsChange.string.empty':
      'Select yes if you want to change your landings type',
    'error.landingTypeMultiChoice.any.required': 'Select a landings type',
    'error.weights.exportWeight.number.base':
      'ccCommonExportWeightAsNumberError',
    'error.product.any.missing': 'ccUploadFilePageTableProductMissingError',
    'error.product.any.exists': 'ccUploadFilePageTableProductDoesNotExistError',
    'error.product.any.invalid': 'ccUploadFilePageTableProductInvalidError',
    'error.weights.exportWeight.any.required': `errorDirectLandingExportWeightRequiredText-${params[0]}-${params[1]}-${params[2]}-${params[3]}`,
    'error.weights.exportWeight.any.empty': `errorDirectLandingExportWeightRequiredText-${params[0]}-${params[1]}-${params[2]}-${params[3]}`,
    'error.weights.exportWeight.number.greater':
      'ccCommonExportWeightGreaterError',
    'error.weights.exportWeight.number.decimal-places':
      'ccCommonExportWeightDecimalPlacesError',
    'error.favourite.duplicate': 'ccProductFavouritesPageErrorDuplicate',
    'error.favourite.max': `ccProductFavouritesPageErrorLimit-${params['limit']}`,
    'error.favourite.any.required':
      'ccWhatExportingFromSelectProductFavouriteListError',
    'error.file.array.min': 'ccUploadFilePageErrorFileRequired',
    'error.file.array.max': 'ccUploadFilePageErrorFileRequired',
    'error.file.any.required': 'ccUploadFilePageErrorFileRequired',
    'error.upload.max-file-size': `ccUploadFilePageErrorMaxFileSize-${Math.round(
      params['maxBytes'] / 1000
    )}`,
    'error.upload.invalid-file-type': 'ccUploadFilePageErrorInvalidFileType',
    'error.upload.invalid-columns': 'ccUploadFilePageErrorInvalidFile',
    'error.upload.av-failed': 'ccUploadFilePageErrorAvFailed',
    'error.upload.max-landings': `ccUploadFilePageErrorMaxLandings-${params['limit']}`,
    'error.upload.min-landings': 'ccUploadFilePageErrorEmptyFile',
    'error.vesselPln.any.missing': 'ccUploadFilePageTableVesselMissingError',
    'error.vesselPln.any.invalid':
      'ccUploadFilePageTableVesselInvalidLicenseError',
    'error.landingsEntryOption.any.required':
      'ccLandingTypeConfirmationSelectOption',
    'error.landingsEntryOption.string.base':
      'ccLandingTypeConfirmationSelectOption',
    'error.landingsEntryConfirmation.string.empty':
      'ccLandingTypeConfirmationSelectOption',
    'error.exporter.incomplete': 'commonProgressExporterRequiredError',
    'error.catches.incomplete': 'commonProgressProductDetailsRequiredError',
    'error.storageFacilities.incomplete':
      'sdProgressStorageFacilitiesRequiredError',
    'error.exportDestination.incomplete':
      'commonProgressExportDestinationRequiredError',
    'error.transportType.incomplete':
      'commonProgressTransportTypeRequiredError',
    'error.transportDetails.incomplete':
      'commonProgressTransportDetailsRequiredError',
    'error.consignmentDescription.incomplete':
      'psProgressConsignmentDescriptionRequiredError',
    'error.processingPlant.incomplete':
      'psProgressProcessingPlantIdRequiredError',
    'error.processingPlantAddress.incomplete':
      'psProgressProcessingPlantAddressRequiredError',
    'error.exportHealthCertificate.incomplete':
      'psProgressHealthCertificateRequiredError',
    'error.products.incomplete': 'commonProgressProductDetailsRequiredError',
    'error.landings.incomplete': 'ccProgressLandingDetailsRequiredError',
    'error.conservation.incomplete': 'ccProgressCatchWatersRequiredError',
    'error.exportJourney.incomplete': 'ccProgressExportJourneyRequiredError',
  };

  return errors[key] || key;
};

const lookupErrorText = (error) =>
  typeof error === 'object'
    ? getErrorMessage(error['key'], error['params'])
    : getErrorMessage(error);

export default lookupErrorText;
