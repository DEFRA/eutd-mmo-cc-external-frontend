import React from 'react';
import DirectLandingsPage from '../../../src/client/pages/exportCertificates/DirectLandingsPage';
import LandingsUpdatedPage  from '../../../src/client/pages/exportCertificates/landings/LandingsUpdatedPage';

import LandingsTypeConfirmationPage from '../../../src/client/pages/exportCertificates/landings/LandingsTypeConfirmationPage';
import LandingsEntryPage from '../../../src/client/pages/exportCertificates/landings/LandingsEntryPage';
import UploadFilePage from '../../../src/client/pages/exportCertificates/UploadFilePage';
import * as CatchCertificateRoutes from '../../../src/client/routes/CatchCertificate';
import * as journeyConfiguration from '../../../src/client/helpers/journeyConfiguration';
import { Redirect } from 'react-router';
import ProgressPage from '../../../src/client/pages/exportCertificates/ProgressPage';
import CopyCertificateConfirmPage from '../../../src/client/pages/common/CopyCertificateConfirm';
import ConfirmDocumentCopyVoidPage from '../../../src/client/pages/common/ConfirmDocumentCopyVoidPage';


describe('withCatchCertificateContext', () => {
    let base = '/create-catch-certificate/';
    it('should reply with the following url', () => {
        let url = 'draft-certificate';
        const response = CatchCertificateRoutes.withCatchCertificateContext(url);
        expect(response).toBe(`${base}${url}`);
    });

    it('createDraftCatchCertificateLandingsEntryUri', () => {
      const response = CatchCertificateRoutes.createDraftCatchCertificateLandingsEntryUri;
      expect(response).toBe(`${base}{documentNumber}/landings-entry`);
    });

    it('catchCertificatePrivacyNoticePageUri', () => {
        const response = CatchCertificateRoutes.catchCertificatePrivacyNoticePageUri;
        expect(response).toBe(`${base}privacy-notice`);
    });

    it('catchCertificateJourneyDashboardUri', () => {
        const response = CatchCertificateRoutes.catchCertificateJourneyDashboardUri;
        expect(response).toBe(`${base}catch-certificates`);
    });

    it('catchCertificateConfirmDocumentVoidUri', () => {
        const response = CatchCertificateRoutes.catchCertificateConfirmDocumentVoidUri;
        expect(response).toBe(`${base}:documentNumber/void-this-catch-certificate`);
    });

    it('catchCertificateConfirmDocumentCopyUri', () => {
      const response = CatchCertificateRoutes.catchCertificateConfirmDocumentCopyUri;
      expect(response).toBe(`${base}:documentNumber/copy-this-catch-certificate`);
    });

    it('catchCertificateConfirmDocumentCopyVoidUri', () => {
      const response = CatchCertificateRoutes.catchCertificateConfirmDocumentCopyVoidUri;
      expect(response).toBe(`${base}:documentNumber/copy-void-confirmation`);
    });

    it('completeUrl', () => {
        const response = CatchCertificateRoutes.completeUri;
        expect(response).toBe(`${base}:documentNumber/catch-certificate-created`);
    });

    it('catchCertificateConfirmDeleteDraftUri', () => {
        const response = CatchCertificateRoutes.catchCertificateConfirmDeleteDraftUri;
        expect(response).toBe(`${base}:documentNumber/delete-this-draft-catch-certificate`);
    });

    it('progressPageUri', () => {
        const response = CatchCertificateRoutes.progressUri;
        expect(response).toBe(`${base}:documentNumber/progress`);
    });

    it('addUserReferenceUri', () => {
        const response = CatchCertificateRoutes.addUserReferenceUri;
        expect(response).toBe(`${base}:documentNumber/add-your-reference`);
    });

    it('addExporterDetailsCatchCertificateUri', () => {
        const response = CatchCertificateRoutes.addExporterDetailsCatchCertificateUri;
        expect(response).toBe(`${base}:documentNumber/add-exporter-details`);
    });

    it('exportersAddressCatchCertificateUri', () => {
      const response = CatchCertificateRoutes.exportersAddressCatchCertificateUri;
      expect(response).toBe(`${base}:documentNumber/what-exporters-address`);
    });

    describe('addSpeciesUri', () => {
      it('will have the correct url', () => {
        const response = CatchCertificateRoutes.addSpeciesUri;
        expect(response).toBe(`${base}:documentNumber/what-are-you-exporting`);
      });

      it('will have the summaryUri', () => {
        const route = CatchCertificateRoutes.default.find(r => r.path === CatchCertificateRoutes.addSpeciesUri);

        expect(route.summaryUri).toBe(CatchCertificateRoutes.summaryUri);
      });
    });

    it('addLandingsUri', () => {
        const response = CatchCertificateRoutes.addLandingsUpdatedUri;
        expect(response).toBe(`${base}:documentNumber/add-landings`);
    });

    it('whoseWatersUri', () => {
        const response = CatchCertificateRoutes.whoseWatersUri;
        expect(response).toBe(`${base}:documentNumber/whose-waters-were-they-caught-in`);
    });

    it('whereExportingUri', () => {
        const response = CatchCertificateRoutes.whereExportingUri;
        expect(response).toBe(`${base}:documentNumber/what-export-journey`);
    });

    it('transportSelectionUri', () => {
        const response = CatchCertificateRoutes.transportSelectionUri;
        expect(response).toBe(`${base}:documentNumber/how-does-the-export-leave-the-uk`);
    });

    it('planeDetailsUri', () => {
        const response = CatchCertificateRoutes.planeDetailsUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-plane`);
    });

    it('truckCmrUri', () => {
        const response = CatchCertificateRoutes.truckCmrUri;
        expect(response).toBe(`${base}:documentNumber/do-you-have-a-road-transport-document`);
    });

    it('truckDetailsUri', () => {
        const response = CatchCertificateRoutes.truckDetailsUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-truck`);
    });

    it('trainDetailsUri', () => {
        const response = CatchCertificateRoutes.trainDetailsUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-train`);
    });

    it('containerVesselDetailsUri', () => {
        const response = CatchCertificateRoutes.containerVesselDetailsUri;
        expect(response).toBe(`${base}:documentNumber/add-transportation-details-container-vessel`);
    });

    it('summaryUri', () => {
        const response = CatchCertificateRoutes.summaryUri;
        expect(response).toBe(`${base}:documentNumber/check-your-information`);
    });
});

describe('createDraftCatchCertificateUri', () => {
    it('/orchestration/api/v1/document/catchCertificate', () => {
        const response = CatchCertificateRoutes.createDraftCatchCertificateUri;
        expect(response).toBe('/orchestration/api/v1/document/catchCertificate');
    });

});

describe('directLandingsUri', () => {
  const path = CatchCertificateRoutes.directLandingUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/direct-landing');
  });

  it('will have a route', () => {
    expect(route).toBeTruthy();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(DirectLandingsPage.component);
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.addSpeciesUri);
  });

  it('will have the correct summary link', () => {
    expect(route.summaryUri).toBe(CatchCertificateRoutes.summaryUri);
  });
});

describe('NonDirectLandingsUri', () => {
  const path = CatchCertificateRoutes.addLandingsUpdatedUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/add-landings');
  });

  it('will have a route', () => {
    expect(route).toBeTruthy();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(LandingsUpdatedPage.component);
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.addSpeciesUri);
  });
});

describe('LandingsUpdatedPage', () => {
  const path = CatchCertificateRoutes.addLandingsUpdatedUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct link for the file upload page', () => {
    expect(route.uploadFileUri).toBe(CatchCertificateRoutes.uploadFileUri);
  });

});

describe('landingsTypeConfirmationPage', () => {
  const path = CatchCertificateRoutes.landingsTypeConfirmationUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/landings-type-confirmation');
  });

  it('will have a route', () => {
    expect(route).toBeTruthy();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(LandingsTypeConfirmationPage.component);
  });

  it('will have the journey information', () => {
    expect(route.journey).toBe('catchCertificate');
    expect(route.journeyText).toBe('catchCertificate');
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.landingsEntryUri);
  });

  it('will have the correct next link', () => {
    expect(route.nextUri).toBe(CatchCertificateRoutes.progressUri);
  });

  it('will have the correct upload file link', () => {
    expect(route.uploadFileUri).toBe(CatchCertificateRoutes.uploadFileUri);
  });
});

describe('uploadFileUri', () => {
  const path = CatchCertificateRoutes.uploadFileUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/upload-file');
  });

  it('will have a route', () => {
    expect(route).toBeTruthy();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(UploadFilePage.component);
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.addExporterDetailsCatchCertificateUri);
  });

  it('will have the landing entry uri link ', () => {
    expect(route.landingsEntryUri).toBe(CatchCertificateRoutes.landingsEntryUri);
  });

  it('will have the correct next link', () => {
    expect(route.nextUri).toBe(CatchCertificateRoutes.addSpeciesUri);
  });
});

describe('landingsEntryPage', () => {
  const path = CatchCertificateRoutes.landingsEntryUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/landings-entry');
  });

  it('will have a route', () => {
    expect(route).toBeDefined();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(LandingsEntryPage.component);
  });

  it('will have the journey information', () => {
    expect(route.journey).toBe('catchCertificate');
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.catchCertificateJourneyDashboardUri);
  });

  it('will have the correct next link', () => {
    expect(route.nextUri).toBe(CatchCertificateRoutes.progressUri);
  });



  it('will have 3 options for landings entry options', () => {
    expect(route.landingsEntryOptions).toHaveLength(3);
  });
});

describe('/landing-type', () => {
  const route = CatchCertificateRoutes.default.find(r =>
    r.path === '/create-catch-certificate/:documentNumber/landing-type'
  );

  it('will redirect the user to the landings entry page', () => {
    const documentNumber = 'document123';

    const props = {
      match: {
        params: {
          documentNumber: documentNumber
        }
      }
    };

    const redirect = route.component(props);

    expect(redirect).toEqual(<Redirect to={`/create-catch-certificate/${documentNumber}/landings-entry`} />);
  });
});

describe('ProgressPage', () => {
  const path = CatchCertificateRoutes.progressUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/progress');
  });

  it('will have a route', () => {
    expect(route).toBeDefined();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(ProgressPage.component);
  });

  it('will have the journey information', () => {
    expect(route.journey).toBe('catchCertificate');
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.landingsEntryUri);
  });

  it('will have the correct next link', () => {
    expect(route.nextUri).toBe(CatchCertificateRoutes.summaryUri);
  });

  it('will have the correct dashboard route', () => {
    expect(route.dashboardUri).toBe(CatchCertificateRoutes.catchCertificateJourneyDashboardUri);
  });
});

describe('CopyCertificateConfirmPage', () => {
  const path = CatchCertificateRoutes.catchCertificateConfirmDocumentCopyUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/copy-this-catch-certificate');
  });

  it('will have a route', () => {
    expect(route).toBeDefined();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(CopyCertificateConfirmPage.component);
  });

  it('will have the journey information', () => {
    expect(route.journey).toBe('catchCertificate');
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.catchCertificateJourneyDashboardUri);
  });

  it('will have the correct next link', () => {
    expect(route.nextUri).toBe(CatchCertificateRoutes.landingsEntryUri);
  });

  it('will have the correct void confirmation link', () => {
    expect(route.voidUri).toBe(CatchCertificateRoutes.catchCertificateConfirmDocumentCopyVoidUri);
  });

});

describe('ConfirmDocumentCopyVoidPage', () => {
  const path = CatchCertificateRoutes.catchCertificateConfirmDocumentCopyVoidUri;
  const route = CatchCertificateRoutes.default.find(r => r.path === path);

  it('will have the correct url', () => {
    expect(path).toBe('/create-catch-certificate/:documentNumber/copy-void-confirmation');
  });

  it('will have a route', () => {
    expect(route).toBeDefined();
  });

  it('will use the correct component', () => {
    expect(route.component).toBe(ConfirmDocumentCopyVoidPage.component);
  });

  it('will have the journey information', () => {
    expect(route.journey).toBe('catchCertificate');
  });

  it('will have the journey text', () => {
    expect(route.journeyText).toBe('catchCertificate');
  });

  it('will have the correct title', () => {
    expect(route.title).toBe(journeyConfiguration.catchCertificatesTitle);
  });

  it('will have the correct back link', () => {
    expect(route.previousUri).toBe(CatchCertificateRoutes.catchCertificateConfirmDocumentCopyUri);
  });

  it('will have the correct next link', () => {
    expect(route.nextUri).toBe(CatchCertificateRoutes.landingsEntryUri);
  });

  it('will have the correct cancel link', () => {
    expect(route.cancelUri).toBe(CatchCertificateRoutes.catchCertificateJourneyDashboardUri);
  });

});