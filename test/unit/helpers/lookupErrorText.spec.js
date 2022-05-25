import lookupErrorText  from '../../../src/client/helpers/lookupErrorText';


describe('lookupErrorText', () => {

  it('should lookup correct text for required key', () => {
    const result = lookupErrorText('error.railwayBillNumber.any.required');
    expect(result).toBe('sdTransportDetailsRailwayBillNumberErrorRequired');
  });

  it('should lookup correct text for empty key', () => {
    const result = lookupErrorText('error.railwayBillNumber.any.empty');
    expect(result).toBe('Enter the railway bill number');
  });

  it('should lookup correct text for alphanumeric key', () => {
    const result = lookupErrorText('error.railwayBillNumber.string.alphanum');
    expect(result).toBe('commonAddTransportationDetailsRailwayBillOnlyNumLettersError');
  });

  it('should lookup correct text for railway bill number max size', () => {
    const result = lookupErrorText('error.railwayBillNumber.string.max');
    expect(result).toBe('commonAddTransportationDetailsRailwayBillMaxCharError');
  });

  it('should lookup the correct text for a message with a config value', () => {
    const result = lookupErrorText({ params: [5], key: 'error.dateLanded.date.max'});
    expect(result).toBe('ccUploadFilePageTableDateLandedFutureMaximumDaysError-5');
  });

  it('should lookup the correct text for an error message when user has not made a selection in copy-void-confirmation page', () => {
    const result = lookupErrorText('error.voidOriginal.any.required');
    expect(result).toBe('commonCopyVoidConfirmationError');
  });

  it('should lookup the correct text for an error message when user has not made a selection in delete-this-draft page', () => {
    const result = lookupErrorText('error.documentDelete.any.required');
    expect(result).toBe('commonDocumentDraftDeleteError');
  });

  it('should return key if no error found', () => {
    const result = lookupErrorText('this.error.does.not.exist');
    expect(result).toBe('this.error.does.not.exist');
  });

  it('registrationNumber should lookup correct text for max characters', () => {
    const result = lookupErrorText('error.registrationNumber.string.max');
    expect(result).toBe('ccAddTransportationDetailsRegistrationCharExceedError');
  });

  it('registrationNumber should lookup correct text for invalid characters', () => {
    const result = lookupErrorText('error.registrationNumber.string.pattern.base');
    expect(result).toBe('ccAddTransportationDetailsRegistrationOnlyAlphaNumError');
  });

  it('departurePlace should lookup correct text for max characters', () => {
    const result = lookupErrorText('error.departurePlace.string.max');
    expect(result).toBe('sdAddTransportationDetailsPlaneDeparturePlaceMaxCharError');
  });

  it('departurePlace should lookup correct text for invalid characters', () => {
    const result = lookupErrorText('error.departurePlace.string.pattern.base');
    expect(result).toBe('sdAddTransportationDetailsPlaneDeparturePlaceCharValidationError');
  });

  it('Container number should lookup correct text for max characters', () => {
    const result = lookupErrorText('error.containerNumber.string.max');
    expect(result).toBe('commonAddTransportationDetailsPlaneContainerMaxCharError');
  });
  it('Container number should lookup correct text for invalid characters', () => {
    const result = lookupErrorText('error.containerNumber.string.alphanum');
    expect(result).toBe('commonAddTransportationDetailsPlaneContainerOnlyNumLettersError');
  });
  it('Container number should lookup correct text for invalid pattern', () => {
    const result = lookupErrorText('error.containerNumber.string.pattern.base');
    expect(result).toBe('commonAddTransportationDetailsPlaneContainerOnlyNumLettersError');
  });

  it('Flight number should lookup correct text for max characters', () => {
    const result = lookupErrorText('error.flightNumber.string.max');
    expect(result).toBe('commonAddTransportationDetailsPlaneFlightNumberMaxCharError');
  });

  it('Flight number should lookup correct text for invalid characters', () => {
    const result = lookupErrorText('error.flightNumber.string.alphanum');
    expect(result).toBe('commonAddTransportationDetailsPlaneFlightNumberOnlyNumbersError');
  });

  it('Vessel name should lookup correct text for max characters', () => {
    const result = lookupErrorText('error.vesselName.string.max');
    expect(result).toBe('commonAddTransportationDetailsVesselNameMax');
  });

  it('Vessel name should lookup correct text for invalid characters', () => {
    const result = lookupErrorText('error.vesselName.string.pattern.base');
    expect(result).toBe('commonAddTransportationDetailsVesselNameBasePatternError');
  });

  it('Should display error for missing street name', () => {
    const result = lookupErrorText('error.streetName.string.empty');
    const expectedText = 'Enter a street name';
   expect(result).toBe('commonWhatExportersAddressErrorStreetName');
  });

  it('Should display error for invalid characters in sub-building name', () => {
    const result = lookupErrorText('error.subBuildingName.string.pattern.base');
    const expectedText = 'SubBuilding name must only contain letters, numbers, apostrophes, hyphens, periods, commas, spaces, ampersands, exclamation marks and forward slashes';

    expect(result).toBe('commonWhatExportersAddressErrorSubBuildingValidation');
  });

  it('Should display error for invalid characters in building name', () => {
    const result = lookupErrorText('error.buildingName.string.pattern.base');
    const expectedText = 'Building name must only contain letters, numbers, apostrophes, hyphens, periods, commas, spaces, ampersands, exclamation marks and forward slashes';

    expect(result).toBe('commonWhatExportersAddressErrorBuildingNameValidation');
  });

  it('Should display error for invalid characters in building number', () => {
    const result = lookupErrorText('error.buildingNumber.string.pattern.base');
    const expectedText = 'Building number must contain only letters, numbers, spaces, hyphens and commas';

    expect(result).toBe('commonWhatExportersAddressErrorBuildingNumberValidation');
  });

  it('Should display error for invalid characters in street name', () => {
    const result = lookupErrorText('error.streetName.string.pattern.base');
    const expectedText = 'Street name must only contain letters, numbers, apostrophes, hyphens, periods, commas, spaces, ampersands, exclamation marks and forward slashes';

    expect(result).toBe('commonWhatExportersAddressErrorStreetNameValidation');
  });

  it('Should display error for invalid characters in town name', () => {
    const result = lookupErrorText('error.townCity.string.pattern.base');
    const expectedText = 'Town or City name must only contain letters, numbers, apostrophes, hyphens, periods, commas, spaces, ampersands, exclamation marks and forward slashes';

    expect(result).toBe('commonWhatExportersAddressErrorTownCityValidation');
  });

  it('Should display error for invalid characters in county', () => {
    const result = lookupErrorText('error.county.string.pattern.base');
    const expectedText = 'County name must only contain letters, numbers, apostrophes, hyphens, periods, commas, spaces, ampersands, exclamation marks and forward slashes';

    expect(result).toBe('commonWhatExportersAddressErrorCounty');
  });

  it('Select a country from the list for invalid country', () => {
    const result = lookupErrorText('error.country.any.invalid');
    const expectedText = 'Select a country from the list';

    expect(result).toBe('commonWhatExportersAddressErrorCountry');
  });

  it('Should display error for missing country', () => {
    const result = lookupErrorText('error.country.string.empty');
    const expectedText = 'Select a country from the list';

    expect(result).toBe('commonWhatExportersAddressErrorCountry');
  });

  it('Should display error for postcode minimum characters', () => {
    const result = lookupErrorText('error.postcode.string.min');
    const expectedText = 'Postcode must be between 5 and 8 characters, and contain only letters, numbers, spaces, hyphens and commas';

    expect(result).toBe('commonLookupAddressPageErrorPostcodeValidation');
  });

  it('Should display error for postcode maximum characters', () => {
    const result = lookupErrorText('error.postcode.string.max');
    const expectedText = 'Postcode must be between 5 and 8 characters, and contain only letters, numbers, spaces, hyphens and commas';

    expect(result).toBe('commonLookupAddressPageErrorPostcodeValidation');
  });

  it('Should display error for more than 50 characters in user reference', () => {
    const result = lookupErrorText('error.userReference.string.max');
    const expectedText = 'Enter your reference as 50 characters or fewer';

    expect(result).toBe('commonUserReferencePageErrorMaxChar');
  });

 
  it('Should display error for empty string transportation details', () => {
    expect(lookupErrorText('error.departurePlace.string.empty')).toBe('sdAddTransportationDetailsPlaneDeparturePlaceLabelError');
    expect(lookupErrorText('error.nationalityOfVehicle.string.empty')).toBe('commonTransportationDetailsTruckNationalityError');
    expect(lookupErrorText('error.registrationNumber.string.empty')).toBe('commonTransportationDetailsTruckRegNumberError');
    expect(lookupErrorText('error.containerNumber.string.empty')).toBe('commonAddTransportationDetailsPlaneContainerNumberLabelError');
    expect(lookupErrorText('error.flightNumber.string.empty')).toBe('commonAddTransportationDetailsPlaneFlightNumberLabelError');
    expect(lookupErrorText('error.vehicle.string.empty')).toBe('sdTransportSelectionTypeOfTransportErrorNull');
    expect(lookupErrorText('error.railwayBillNumber.string.empty')).toBe('Enter the railway bill number');
    expect(lookupErrorText('error.vesselName.string.empty')).toBe('commonAddTransportationDetailsVesselNameError');
    expect(lookupErrorText('error.stationName.string.empty')).toBe('Enter the station name');
    expect(lookupErrorText('error.flagState.string.empty')).toBe('commonAddTransportationDetailsVesselFlagError');
  });

  it('should lookup the correct text for commodity codes', () => {
    const expectedText = 'ccProductFavouritesPageErrorCommodityCode';

    expect(lookupErrorText({key: 'error.commodity_code.any.required'})).toBe(expectedText);
    expect(lookupErrorText({key: 'error.commodity_code.any.invalid'})).toBe(expectedText);
    expect(lookupErrorText({key: 'error.commodity_code.string.empty'})).toBe('ccProductFavouritesPageErrorCommodityCode');
  });

  it('should lookup the correct text for duplicate favourites', () => {
    const expectedText = 'ccProductFavouritesPageErrorDuplicate';

    expect(lookupErrorText({key: 'error.favourite.duplicate'})).toBe(expectedText);
  });

  it('should lookup the correct text for a maximum number of favourites reached error', () => {
    const result = lookupErrorText({ params: {limit: 99}, key: 'error.favourite.max'});
    expect(result).toBe('ccProductFavouritesPageErrorLimit-99');
  });

  it('should lookup the correct text for a favourite not being provided', () => {
    const expectedText = 'ccWhatExportingFromSelectProductFavouriteListError';
    expect(lookupErrorText({ key: 'error.favourite.any.required'})).toBe(expectedText);
  });

  it('should lookup the correct text for special characters not allowed in userReference page', () => {
    expect(lookupErrorText({ key: 'error.userReference.string.pattern.base'})).toBe('commonUserReferenceEnterRefAsACombination');
  });

  it('should lookup the correct text for a missing or invalid faoArea value in uploads', () => {
    expect(lookupErrorText({ key: 'error.faoArea.any.missing'})).toBe('ccUploadFilePageTableCatchAreaMissingError');
    expect(lookupErrorText({ key: 'error.faoArea.any.invalid'})).toBe('ccUploadFilePageTableCatchAreaInvalidError');
  });

  it('should lookup the correct text for upload file errors', () => {
    expect(lookupErrorText({ key: 'error.file.array.min' })).toBe('ccUploadFilePageErrorFileRequired');
    expect(lookupErrorText({ key: 'error.file.array.max' })).toBe('ccUploadFilePageErrorFileRequired');
    expect(lookupErrorText({ key: 'error.file.any.required' })).toBe('ccUploadFilePageErrorFileRequired');
  });

  it('should lookup the correct text for a missing exportWeight value in uploads', () => {
    expect(lookupErrorText({ key: 'error.exportWeight.any.missing'})).toBe('ccCommonExportWeightMissingError');
  });

  it('should lookup the correct text for a missing product ID in uploads', () => {
    expect(lookupErrorText({ key: 'error.product.any.missing'})).toBe('ccUploadFilePageTableProductMissingError');
  });

  it('should lookup the correct text when product ID doesnt exist in uploads', () => {
    expect(lookupErrorText({ key: 'error.product.any.exists'})).toBe('ccUploadFilePageTableProductDoesNotExistError');
  });

  it('should lookup the correct text when product ID is invalid in uploads', () => {
    expect(lookupErrorText({ key: 'error.product.any.invalid' })).toBe(
      'ccUploadFilePageTableProductInvalidError'
    );
  });

  it('should lookup the correct text when landing date is missing in uploads', () => {
    expect(lookupErrorText({ key: 'error.dateLanded.date.missing' })).toBe('ccCommonDateLandedMissingError');
  });

  it('should lookup the correct text for upload vessel related errors', () => {
    expect(lookupErrorText({ key: 'error.vesselPln.any.missing' }))
      .toBe('ccUploadFilePageTableVesselMissingError');
    expect(lookupErrorText({ key: 'error.vesselPln.any.invalid' }))
      .toBe('ccUploadFilePageTableVesselInvalidLicenseError');
  });

  it('should lookup the correct text for a max file size error', () => {
    const error = (maxBytes) => ({
      key: 'error.upload.max-file-size',
      params: {
        maxBytes: maxBytes
      }
    });

    expect(lookupErrorText(error(10000)))
      .toBe('ccUploadFilePageErrorMaxFileSize-10');

    expect(lookupErrorText(error(10010)))
    .toBe('ccUploadFilePageErrorMaxFileSize-10');

    expect(lookupErrorText(error('10010')))
    .toBe('ccUploadFilePageErrorMaxFileSize-10');

    expect(lookupErrorText(error('12010')))
    .toBe('ccUploadFilePageErrorMaxFileSize-12');
  });

  it('should lookup the correct text for file upload validation errors', () => {
    expect(lookupErrorText({ key: 'error.upload.invalid-file-type' }))
      .toBe('ccUploadFilePageErrorInvalidFileType');
    expect(lookupErrorText({ key: 'error.upload.invalid-columns' }))
      .toBe('ccUploadFilePageErrorInvalidFile');
    expect(lookupErrorText({ key: 'error.upload.av-failed' }))
      .toBe('ccUploadFilePageErrorAvFailed');
    expect(lookupErrorText({ key: 'error.upload.max-landings', params: {limit: 55} }))
      .toBe('ccUploadFilePageErrorMaxLandings-55');
    expect(lookupErrorText({ key: 'error.upload.min-landings' }))
      .toBe('ccUploadFilePageErrorEmptyFile');
  });

  it('should lookup an error message when a landing entry has not been selected', () => {
    expect(lookupErrorText({ key: 'error.landingsEntryOption.any.required' })).toBe('ccLandingTypeConfirmationSelectOption');
    expect(lookupErrorText({ key: 'error.landingsEntryOption.string.base' })).toBe('ccLandingTypeConfirmationSelectOption');
  });

  it('should lookup an error message when a landings entry confirmation has not been selected', () => {
    expect(lookupErrorText({ key: 'error.landingsEntryConfirmation.string.empty' })).toBe('ccLandingTypeConfirmationSelectOption');
  });

  it('should lookup an error message when sub-building name, building number, building name or street name has not been selected', () => {
    expect(lookupErrorText({ key: 'error.addressFirstPart.any.required' })).toBe('Enter a sub-building name, building number, a building name or street name');
  });
  it('should lookup and error message when export destination country is not valid', () => {
    expect(lookupErrorText({ key:'error.exportDestination.any.invalid'})).toBe('commonProductDestinationErrorInvalidCountry');
  });

  it('should lookup the correct text for an error message when user has not completed the exporter details section on the progress page', () => {
    const result = lookupErrorText('error.exporter.incomplete');
    expect(result).toBe('commonProgressExporterRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the product details section on the progress page', () => {
    const result = lookupErrorText('error.catches.incomplete');
    expect(result).toBe('commonProgressProductDetailsRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the storage facilities section on the progress page', () => {
    const result = lookupErrorText('error.storageFacilities.incomplete');
    expect(result).toBe('sdProgressStorageFacilitiesRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the export destination section on the progress page', () => {
    const result = lookupErrorText('error.exportDestination.incomplete');
    expect(result).toBe('commonProgressExportDestinationRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the transport type section on the progress page', () => {
    const result = lookupErrorText('error.transportType.incomplete');
    expect(result).toBe('commonProgressTransportTypeRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the transport details section on the progress page', () => {
    const result = lookupErrorText('error.transportDetails.incomplete');
    expect(result).toBe('commonProgressTransportDetailsRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the consignment description section on the progress page', () => {
    const result = lookupErrorText('error.consignmentDescription.incomplete');
    expect(result).toBe('psProgressConsignmentDescriptionRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the processing plant ID section on the progress page', () => {
    const result = lookupErrorText('error.processingPlant.incomplete');
    expect(result).toBe('psProgressProcessingPlantIdRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the processing plant address section on the progress page', () => {
    const result = lookupErrorText('error.processingPlantAddress.incomplete');
    expect(result).toBe('psProgressProcessingPlantAddressRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the export health certificate section on the progress page', () => {
    const result = lookupErrorText('error.exportHealthCertificate.incomplete');
    expect(result).toBe('psProgressHealthCertificateRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the product details section on the progress page for catch certificates', () => {
    const result = lookupErrorText('error.products.incomplete');
    expect(result).toBe('commonProgressProductDetailsRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the landing details section on the progress page for catch certificates', () => {
    const result = lookupErrorText('error.landings.incomplete');
    expect(result).toBe('ccProgressLandingDetailsRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the catch waters section on the progress page for catch certificates', () => {
    const result = lookupErrorText('error.conservation.incomplete');
    expect(result).toBe('ccProgressCatchWatersRequiredError');
  });

  it('should lookup the correct text for an error message when user has not completed the export journey section on the progress page for catch certificates', () => {
    const result = lookupErrorText('error.exportJourney.incomplete');
    expect(result).toBe('ccProgressExportJourneyRequiredError');
  });
});
