import * as StorageDocumentRoutes from '../../../src/client/routes/StorageDocument';

describe('withStorageNotesContext', () => {
    let base = '/create-storage-document/';
    it('withStorageNotesContext base', () => {
        let url = 'draft-storage-document';

        const response = StorageDocumentRoutes.withStorageNotesContext(url);
        expect(response).toBe(`${base}${url}`);
    });

    it('createDraftStorageDocumentUri', () => {
        const response = StorageDocumentRoutes.createDraftStorageDocumentUri;
        expect(response).toBe('/orchestration/api/v1/document/storageDocument');
    });

    it('createDraftStorageDocumentNextUri', () => {
        const response = StorageDocumentRoutes.createDraftStorageDocumentNextUri;
        expect(response).toBe(`${base}{documentNumber}/progress`);
    });

    it('storageDocumentPrivacyNoticePageUri', () => {
        const response = StorageDocumentRoutes.storageDocumentPrivacyNoticePageUri;
        expect(response).toBe(`${base}privacy-notice`);
    });

    it('storageDocumentDashboardUri', () => {
        const response = StorageDocumentRoutes.storageDocumentDashboardUri;
        expect(response).toBe(`${base}storage-documents`);
    });

    it('storageDocumentConfirmDocumentVoidUri', () => {
        const response = StorageDocumentRoutes.storageDocumentConfirmDocumentVoidUri;
        expect(response).toBe(`${base}:documentNumber/void-this-storage-document`);
    });


    it('statementStorageNotesUri', () => {
        const response = StorageDocumentRoutes.statementStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/storage-document-created`);
    });

    it('storageDocumentConfirmDeleteUri', () => {
        const response = StorageDocumentRoutes.storageDocumentConfirmDeleteUri;
        expect(response).toBe(`${base}:documentNumber/delete-this-draft-storage-document`);
    });

    it('addUserReferenceUri', () => {
        const response = StorageDocumentRoutes.addUserReferenceUri;
        expect(response).toBe(`${base}:documentNumber/add-your-reference`);
    });

    it('companyDetailsUri', () => {
        const response = StorageDocumentRoutes.companyDetailsUri;
        expect(response).toBe(`${base}:documentNumber/add-exporter-details`);
    });

    it('companyDetailsAddressUri', () => {
        const response = StorageDocumentRoutes.companyDetailsAddressUri;
        expect(response).toBe(`${base}:documentNumber/what-exporters-address`);
    });

    it('productDetailsUri', () => {
        const response = StorageDocumentRoutes.productDetailsUri;
        expect(response).toBe(`${base}:documentNumber/add-product-to-this-consignment`);
    });

    it('productDestinationUri', () => {
        const response = StorageDocumentRoutes.productDestinationUri;
        expect(response).toBe(`${base}:documentNumber/what-export-destination`);
    });

    it('productDetailsIndexUri', () => {
        const response = StorageDocumentRoutes.productDetailsIndexUri;
        expect(response).toBe(`${base}:documentNumber/add-product-to-this-consignment/:productIndex`);
    });

    it('productsUri', () => {
        const response = StorageDocumentRoutes.productsUri;
        expect(response).toBe(`${base}:documentNumber/you-have-added-a-product`);
    });

    it('storageFacilityUri', () => {
        const response = StorageDocumentRoutes.storageFacilityUri;
        expect(response).toBe(`${base}:documentNumber/add-storage-facility-details`);
    });

    it('storageFacilitiesIndexUri', () => {
        const response = StorageDocumentRoutes.storageFacilitiesIndexUri;
        expect(response).toBe(`${base}:documentNumber/add-storage-facility-details/:facilityIndex`);
    });
    it('storageFacilitiesUri', () => {
        const response = StorageDocumentRoutes.storageFacilitiesUri;
        expect(response).toBe(`${base}:documentNumber/you-have-added-a-storage-facility`);
    });
    it('transportSelectionStorageNotesUri', () => {
        const response = StorageDocumentRoutes.transportSelectionStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/how-does-the-export-leave-the-uk`);
    });

    it('planeDetailsStorageNotesUri', () => {
        const response = StorageDocumentRoutes.planeDetailsStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-plane`);
    });

    it('truckCmrStorageNotesUri', () => {
        const response = StorageDocumentRoutes.truckCmrStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/do-you-have-a-road-transport-document`);
    });

    it('truckDetailsStorageNotesUri', () => {
        const response = StorageDocumentRoutes.truckDetailsStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-truck`);
    });

    it('trainDetailsStorageNotesUri', () => {
        const response = StorageDocumentRoutes.trainDetailsStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-train`);
    });

    it('containerVesselDetailsStorageNotesUri', () => {
        const response = StorageDocumentRoutes.containerVesselDetailsStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-container-vessel`);
    });

    it('summaryStorageNotesUri', () => {
        const response = StorageDocumentRoutes.summaryStorageNotesUri;
        expect(response).toBe(`${base}:documentNumber/check-your-information`);
    });

    it('sdProgressUri', () => {
        const response = StorageDocumentRoutes.sdProgressUri;
        expect(response).toBe(`${base}:documentNumber/progress`);
    });
});
