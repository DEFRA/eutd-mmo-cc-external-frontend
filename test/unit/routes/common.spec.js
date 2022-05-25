import * as BaseRoute from '../../../src/client/routes/Base';

describe('Base route', () => {

    it('improveServiceUri', () => {
        const response = BaseRoute.improveServiceUri;
        expect(response).toBe('/service-improvement-plan');
    });

    it('cookiePolicyUri', () => {
        const response = BaseRoute.cookiePolicyUri;
        expect(response).toBe('/cookies');
    });
    it('accessibilityStatementUri', () => {
      const response = BaseRoute.accessibilityStatementUri;
      expect(response).toBe('/accessibility');
    });

    it('privacyStatementUri', () => {
      const response = BaseRoute.privacyStatementUri;
      expect(response).toBe('/privacy-notice');
  });
});
