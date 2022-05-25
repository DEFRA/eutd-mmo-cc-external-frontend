import * as ProcessingStatementRoutes from '../../../src/client/routes/ProcessingStatement';

describe('withProcessingStatementContext', () => {
    let base = '/create-processing-statement/';
    it('withProcessingStatementContext base', () => {
        let url = 'draft-processing-statement';

        const response = ProcessingStatementRoutes.withProcessingStatementContext(url);
        expect(response).toBe(`${base}${url}`);
    });

    it('createDraftProcessingStatementUri', () => {
        const response = ProcessingStatementRoutes.createDraftProcessingStatementUri;
        expect(response).toBe('/orchestration/api/v1/document/processingStatement');
    });

    it('createDraftProcessingStatementNextUri', () => {
        const response = ProcessingStatementRoutes.createDraftProcessingStatementNextUri;
        expect(response).toBe(`${base}{documentNumber}/progress`);
    });

    it('psPrivacyNoticePage', () => {
        const response = ProcessingStatementRoutes.psPrivacyNoticePage;
        expect(response).toBe(`${base}privacy-notice`);
    });

    it('psDashboardPage', () => {
        const response = ProcessingStatementRoutes.psDashboardPage;
        expect(response).toBe(`${base}processing-statements`);
    });

    it('psConfirmDocumentVoid', () => {
        const response = ProcessingStatementRoutes.psConfirmDocumentVoid;
        expect(response).toBe(`${base}:documentNumber/void-this-processing-statement`);
    });


    it('psProcessingStatementCreated', () => {
        const response = ProcessingStatementRoutes.psProcessingStatementCreated;
        expect(response).toBe(`${base}:documentNumber/processing-statement-created`);
    });

    it('psAddUserReference', () => {
        const response = ProcessingStatementRoutes.psAddUserReference;
        expect(response).toBe(`${base}:documentNumber/add-your-reference`);
    });

    it('psConfirmDocumentDeleteDraft', () => {
        const response = ProcessingStatementRoutes.psConfirmDocumentDeleteDraft;
        expect(response).toBe(`${base}:documentNumber/delete-this-draft-processing-statement`);
    });

    it('psAddExporterDetails', () => {
        const response = ProcessingStatementRoutes.psAddExporterDetails;
        expect(response).toBe(`${base}:documentNumber/add-exporter-details`);
    });

    it('psAddExportersAddress', () => {
        const response = ProcessingStatementRoutes.psAddExportersAddress;
        expect(response).toBe(`${base}:documentNumber/what-exporters-address`);
    });

    it('psAddConsignmentDetails', () => {
        const response = ProcessingStatementRoutes.psAddConsignmentDetails;
        expect(response).toBe(`${base}:documentNumber/add-consignment-details`);
    });

    it('psAddCatchDetails', () => {
        const response = ProcessingStatementRoutes.psAddCatchDetails;
        expect(response).toBe(`${base}:documentNumber/add-catch-details`);
    });

    it('psAddCatchDetailsIndex', () => {
        const response = ProcessingStatementRoutes.psAddCatchDetailsIndex;
        expect(response).toBe(`${base}:documentNumber/add-catch-details/:catchIndex`);
    });

    it('psAddCatchWeights', () => {
        const response = ProcessingStatementRoutes.psAddCatchWeights;
        expect(response).toBe(`${base}:documentNumber/add-catch-weights`);
    });

    it('psAddCatchWeightsIndex', () => {
        const response = ProcessingStatementRoutes.psAddCatchWeightsIndex;
        expect(response).toBe(`${base}:documentNumber/add-catch-weights/:catchIndex`);
    });

    it('psCatchAdded', () => {
        const response = ProcessingStatementRoutes.psCatchAdded;
        expect(response).toBe(`${base}:documentNumber/catch-added`);
    });

    it('psAddHealthCertificate', () => {
        const response = ProcessingStatementRoutes.psAddHealthCertificate;
        expect(response).toBe(`${base}:documentNumber/add-health-certificate`);
    });

    it('psAddProcessingPlantDetails', () => {
        const response = ProcessingStatementRoutes.psAddProcessingPlantDetails;
        expect(response).toBe(`${base}:documentNumber/add-processing-plant-details`);
    });

    it('psAddProcessingPlantAddress', () => {
        const response = ProcessingStatementRoutes.psAddProcessingPlantAddress;
        expect(response).toBe(`${base}:documentNumber/add-processing-plant-address`);
    });

    it('psProductDestinationUri', () => {
        const response = ProcessingStatementRoutes.psProductDestinationUri;
        expect(response).toBe(`${base}:documentNumber/what-export-destination`);
    });

    it('psCheckYourInformation', () => {
        const response = ProcessingStatementRoutes.psCheckYourInformation;
        expect(response).toBe(`${base}:documentNumber/check-your-information`);
    });

    it('psProgressUri', () => {
        const response = ProcessingStatementRoutes.psProgressUri;
        expect(response).toBe(`${base}:documentNumber/progress`);
    });
});
