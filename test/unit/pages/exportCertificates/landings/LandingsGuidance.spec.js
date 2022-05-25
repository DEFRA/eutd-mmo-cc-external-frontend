import LandingsGuidance from '../../../../../src/client/pages/exportCertificates/landings/LandingsGuidance';
import { mount } from 'enzyme';
import React from 'react';
import i18n from '../../../../../src/i18n';

describe('LandingsGuidance', () => {
  describe('with all optional properties', () => {
    const props = {
      maxLandingsLimit: 100,
      offlineValidationTime: 30,
      landingLimitDaysInTheFuture: 7,
      t: i18n.t
    };

    const wrapper = mount(<LandingsGuidance {...props} />);

    it('will mount', () => {
      expect(
        wrapper.find('div#speciesAndLandingsGuidanceMessage').exists()
      ).toBe(true);
    });

    it('will contain all guidance', () => {
      const guidance = wrapper
        .find('div#speciesAndLandingsGuidanceMessage')
        .text();

      expect(guidance).toContain('A landing date is required before selecting a vessel');

      expect(guidance).toContain(
        'Landing dates can be up to 7 days in the future in draft documents but only up to 3 days in the future in final submitted catch certificates'
      );

      expect(guidance).toContain(
        'All landings should have been made in accordance with the relevant conservation and management measures'
      );

      expect(guidance).toContain(
        'A maximum of 100 landings is allowed per certificate'
      );

      expect(guidance).toContain(
        'Multiple landings can take up to 30 minutes to validate'
      );
    });
  });

  describe('without optional parameters', () => {
    const props = {
      landingLimitDaysInTheFuture: 7,
      t: jest.fn
    };

    const wrapper = mount(<LandingsGuidance {...props} />);

    it('will not contain guidance on maximum landings if no property is supplied', () => {
      const guidance = wrapper
        .find('div#speciesAndLandingsGuidanceMessage')
        .text();

      expect(guidance).not.toContain(
        'A maximum of 100 landings is allowed per certificate'
      );
    });

    it('will not contain guidance on offline validation time if no property is supplied', () => {
      const guidance = wrapper
        .find('div#speciesAndLandingsGuidanceMessage')
        .text();

      expect(guidance).not.toContain(
        'Multiple landings can take up to 30 minutes to validate'
      );
    });
  });
});
