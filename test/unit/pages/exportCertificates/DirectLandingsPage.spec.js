import DirectLandingsPageComponent, {
  component as DirectLandingsPage,
  getErrors,
  getLandingErrorsFromExportPayload,
  mapVesselsOptions,
  parseState,
  transformAllErrors,
  transformError,
} from '../../../../src/client/pages/exportCertificates/DirectLandingsPage';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PageTitle from '../../../../src/client/components/PageTitle';
import { BackLink } from 'govuk-react';
import LandingsGuidance from '../../../../src/client/pages/exportCertificates/landings/LandingsGuidance';
import { MemoryRouter } from 'react-router';
import { act } from 'react-dom/test-utils';
import AddVesselForm from '../../../../src/client/pages/exportCertificates/landings/AddVesselForm';
import ProductWeights from '../../../../src/client/pages/exportCertificates/landings/ProductWeights';
import SaveAsDraftButton from '../../../../src/client/components/SaveAsDraftButton';
import ContinueButton from '../../../../src/client/components/elements/ContinueButton';
import { getDirectLandings, clearDirectLanding, upsertDirectLanding } from '../../../../src/client/actions/direct-landing.actions';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import { getLandingType } from '../../../../src/client/actions/landingsType.actions';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');
jest.mock('../../../../src/client/actions/export-payload.actions');
jest.mock('../../../../src/client/actions/direct-landing.actions');
jest.mock('../../../../src/client/actions/landingsType.actions');

describe('DirectLandingsPage', () => {
  let mockScrollToErrorIsland, mockPush, wrapper;
  mockPush = jest.fn();
  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/cc/:documentNumber/what-are-you-exporting',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      nextUri: '/cc/:documentNumber/whose-waters-were-they-caught-in',
      path: ':documentNumber/direct-landing',
      summaryUri: ':documentNumber/check-your-information',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: '/create-catch-certificate/:documentNumber/progress'
    },
    config: {
      landingLimitDaysInTheFuture: 7,
    },
    match: {
      params: {
        documentNumber: 'document123',
      },
    },
    history: {
      push: mockPush
    },
  };

  beforeEach(() => {
    upsertDirectLanding.mockReturnValue({ type: 'UPSERT_DIRECT_LANDING' });
    getDirectLandings.mockReturnValue({ type: 'GET_DIRECT_LANDING_PRODUCTS' });
    clearDirectLanding.mockReturnValue({ type: 'CLEAR_DIRECT_LANDING' });
    getLandingType
      .mockReturnValue({ type: 'LANDINGS_TYPE_CHANGE_SUCCESS' });
    mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when the certificate has a product', () => {
    const state = {
      directLandings: {
        dateLanded: '',
        faoArea: 'FAO27',
        weights: [
          {
            exportWeight: 300,
            speciesId: '1',
            speciesLabel: 'Atlantic cod (COD), Fresh, Filleted, 11111111',
          },
          {
            exportWeight: 200,
            speciesId: '2',
            speciesLabel: 'Herring (HER), Fresh, Filleted, 22222222',
          },
        ],
        vessels: [],
        unauthorised: false
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/direct-landing']}>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will render', () => {
      expect(wrapper).not.toBeNull();
    });

    it('will not redirect the user to add species page', () => {
      expect(props.history.push).not.toHaveBeenCalled();
    });

    it('will have the correct page title', () => {
      expect(wrapper.find(PageTitle).prop('title')).toBe(
        `Add your landing - ${props.route.title}`
      );
    });

    it('will show a back link', () => {
      expect(wrapper.exists(BackLink)).toBe(true);
    });

    it('will link to the previous uri', () => {
      const previousUri = props.route.previousUri;
      const documentNumber = props.match.params.documentNumber;

      expect(wrapper.find(BackLink).prop('href')).toBe(
        previousUri.replace(':documentNumber', documentNumber)
      );
    });

    it('will push to the previous uri on click', () => {
      const previousUri = props.route.previousUri;
      const documentNumber = props.match.params.documentNumber;

      wrapper.find(BackLink).simulate('click');

      expect(props.history.push).toHaveBeenCalledWith(
        previousUri.replace(':documentNumber', documentNumber)
      );
    });

    it('will show landing guidance', () => {
      expect(wrapper.exists(LandingsGuidance)).toBe(true);
    });

    it('will include guidance on landing date limit', () => {
      expect(
        wrapper.find(LandingsGuidance).prop('landingLimitDaysInTheFuture')
      ).toBe(props.config.landingLimitDaysInTheFuture);
    });

    it('will not include guidance on maximum landings', () => {
      expect(
        wrapper.find(LandingsGuidance).prop('offlineValidationTime')
      ).toBeUndefined();
    });

    it('will not include guidance on offline validation time', () => {
      expect(
        wrapper.find(LandingsGuidance).prop('maximumLandingLimit')
      ).toBeUndefined();
    });

    it('will initialise the state', () => {
      expect(wrapper.find('DirectLandingsPage').state()).toEqual({
        dateLanded: '',
        dateLandedStringValue: '',
        faoArea: 'FAO27',
        species: state.directLandings.weights,
        vessel: { label: '' },
        vessels: [],
      });
    });

    it('will include the add vessel form', () => {
      expect(wrapper.exists(AddVesselForm)).toBe(true);
    });

    it('will default the add vessel form to FAO27', () => {
      expect(wrapper.find(AddVesselForm).prop('faoArea')).toBe('FAO27');
    });

    it('will update the dateLanded on change', () => {
      const onChange = wrapper.find(AddVesselForm).prop('onDateChange');

      onChange({target: {
        name: '',
        value: 'some-date'
      }});

      expect(wrapper.find('DirectLandingsPage').state().dateLanded).toBe('some-date');
    });

    it('will update the faoArea on change', () => {
      const onChange = wrapper.find(AddVesselForm).prop('onFaoChange');
      const mockPreventDefault = jest.fn();

      onChange({
        preventDefault: mockPreventDefault,
        target: { value: 'FAO22' },
      });

      expect(mockPreventDefault).toHaveBeenCalledTimes(1);
      expect(wrapper.find('DirectLandingsPage').state().faoArea).toBe('FAO22');
    });

    it('will update the vessel on change', () => {
      const vessel = { label: 'WIRON 5' };
      const onChange = wrapper.find(AddVesselForm).prop('onVesselChange');

      onChange(vessel);

      expect(wrapper.find('DirectLandingsPage').state().vessel).toBe(vessel);
    });

    it('will include the product weights form', () => {
      expect(wrapper.exists(ProductWeights)).toBe(true);
    });

    it('will update the product weights on change', () => {
      const onChange = wrapper.find(ProductWeights).prop('onWeightChange');

      onChange('1', '500.01');

      expect(wrapper.find('DirectLandingsPage').state().species).toStrictEqual([
        {
          speciesId: '1',
          speciesLabel: 'Atlantic cod (COD), Fresh, Filleted, 11111111',
          exportWeight: '500.01',
        },
        {
          speciesId: '2',
          speciesLabel: 'Herring (HER), Fresh, Filleted, 22222222',
          exportWeight: 200,
        },
      ]);
    });

    it('will default the weight to undefined if no value is specified', () => {
      const onChange = wrapper.find(ProductWeights).prop('onWeightChange');

      onChange('1', '');

      expect(wrapper.find('DirectLandingsPage').state().species).toStrictEqual([
        {
          speciesId: '1',
          speciesLabel: 'Atlantic cod (COD), Fresh, Filleted, 11111111',
          exportWeight: undefined,
        },
        {
          speciesId: '2',
          speciesLabel: 'Herring (HER), Fresh, Filleted, 22222222',
          exportWeight: 200,
        },
      ]);
    });

    it('will show a Save as Draft button', () => {
      expect(wrapper.exists(SaveAsDraftButton)).toBe(true);
    });

    it('should go to the dashboard when save as draft is clicked', async () => {
      const saveAsDraftBtn = wrapper.find('SaveAsDraftButton');

      await act(() => saveAsDraftBtn.prop('onClick')({ preventDefault() {} }));

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/create-catch-certificate/catch-certificates');
    });

    it('will call ScrollToErrorIsland if an error is thrown when save as draft is clicked', async () => {
      const saveAsDraftBtn = wrapper.find('SaveAsDraftButton');

      mockPush.mockImplementation(() => {
        throw new Error('error');
      });

      await act(() => {
        saveAsDraftBtn.prop('onClick')({ preventDefault() {} });
      });

      expect(mockScrollToErrorIsland).toHaveBeenCalled();
    });

    it('will show a Save and Continue button', () => {
      expect(wrapper.exists(ContinueButton)).toBe(true);
    });

    it('the continue button will submit and redirect to the whose-waters page', async () => {
      const nextUri = props.route.nextUri;
      const documentNumber = props.match.params.documentNumber;

      const pageState = wrapper.find('DirectLandingsPage').state();

      await act(() =>
        wrapper
          .find('form')
          .props()
          .onSubmit({ preventDefault() {} })
      );

      expect(upsertDirectLanding).toHaveBeenCalled();

      expect(upsertDirectLanding).toHaveBeenCalledWith(
        {
          dateLanded: pageState.dateLanded,
          faoArea: pageState.faoArea,
          vessel: pageState.vessel,
          weights: pageState.species
        },
        documentNumber
      );

      expect(props.history.push).toHaveBeenCalledWith(
        nextUri.replace(':documentNumber', documentNumber)
      );
    });

    it('will call ScrollToErrorIsland if an error is thrown when the submit button is clicked', async () => {
      upsertDirectLanding.mockImplementation(() => {
        throw new Error('error');
      });

      await act(() =>
        wrapper
          .find('form')
          .props()
          .onSubmit({ preventDefault() {} })
      );

      expect(mockScrollToErrorIsland).toHaveBeenCalled();
    });

    it('should have a back to progress page link', () => {
      expect(wrapper.find('a[href="/create-catch-certificate/document123/progress"]').exists()).toBeTruthy();
    });
  });

  describe('when unauthorised', () => {
    const state = {
      directLandings: {
        dateLanded: '',
        faoArea: 'FAO27',
        weights: [],
        vessels: [],
        unauthorised: true
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will redirect to forbidden page', async () => {
      await act(() =>
      wrapper
        .find('form')
        .props()
        .onSubmit({ preventDefault() {} })
      );

      expect(props.history.push).toHaveBeenCalledWith('/forbidden');
    });
  });

  describe('when the certificate does not have a landing entry option', () => {
    const state = {
      directLandings: {
        dateLanded: '',
        faoArea: 'FAO27',
        weights: [
          {
            exportWeight: 300,
            speciesId: '1',
            speciesLabel: 'Atlantic cod (COD), Fresh, Filleted, 11111111',
          },
          {
            exportWeight: 200,
            speciesId: '2',
            speciesLabel: 'Herring (HER), Fresh, Filleted, 22222222',
          },
        ],
        vessels: [],
        unauthorised: false
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      }
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will redirect the user to the landing entry page', () => {
      const { documentNumber } = props.match.params;
      const { landingsEntryUri } = props.route;
      const redirectUri = landingsEntryUri.replace(':documentNumber', documentNumber);

      expect(props.history.push).toHaveBeenCalledWith(redirectUri);
      expect(props.history.push).toHaveBeenCalledTimes(1);
    });

  });

  describe('when the certificate does not have a product', () => {
    const store = configureStore()({
      directLandings: {},
      addedSpeciesPerUser: {
        species: [],
      },
      errors: {
        errors: [],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      }
    });

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will render', () => {
      expect(wrapper).not.toBeNull();
    });

    it('will redirect the user to the progress page', () => {
      expect(props.history.push).toHaveBeenCalledWith('/create-catch-certificate/document123/progress');
    });
  });

  describe('when the certificate has a partially complete product', () => {
    const store = configureStore()({
      directLandings: {},
      addedSpeciesPerUser: {
        species: [
          {
            species: 'xyz',
            state: 'xyz',
            presentation: 'xyz',
            commodity_code: 'xyz',
          },
          {
            species: 'abc',
            state: 'abc',
            presentation: 'abc',
          },
        ],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      }
    });

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will render', () => {
      expect(wrapper).not.toBeNull();
    });

    it('will redirect the user to the progress page', () => {
      expect(props.history.push).toHaveBeenCalledWith('/create-catch-certificate/document123/progress');
    });
  });

  describe('when getDirectLandings errors', () => {
    beforeEach(() => {
      getDirectLandings.mockImplementation(() => {
        throw new Error('error');
      });
    });

    const store = configureStore()({
      addedSpeciesPerUser: {
        species: [],
      },
      errors: {
        errors: [],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      }
    });

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will render', () => {
      expect(wrapper).not.toBeNull();
    });

    it('will redirect the user to the forbidden page', () => {
      expect(props.history.push).toHaveBeenCalledWith('/forbidden');
    });
  });

  describe('when there are no validation errors', () => {
    const state = {
      addedSpeciesPerUser: {
        species: [
          {
            id: '1',
            species: 'Atlantic cod (COD)',
            commodity_code: '11111111',
            caughtBy: [
              {
                weight: 200,
              },
            ],
            stateLabel: 'Fresh',
            presentationLabel: 'Filleted',
          },
        ],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should not display the error island', () => {
      expect(wrapper.exists('ErrorIsland')).toBe(false);
    });
  });

  describe('snapshot describe block', () => {
    const state = {
      addedSpeciesPerUser: {
        species: [
          {
            id: '1',
            species: 'Atlantic cod (COD)',
            commodity_code: '11111111',
            caughtBy: [
              {
                weight: 200,
              },
            ],
            stateLabel: 'Fresh',
            presentationLabel: 'Filleted',
          },
        ],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      },
      exportPayload: {
        items: [
          {
            landings: [
              {
                error: '',
                errors: {},
              },
            ],
          },
        ],
        error: '',
        errors: {
        },
      },
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

  
    it('it should create snap shot for whole page', () => {
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    })

  });

  describe('when there are validation errors', () => {
    const state = {
      addedSpeciesPerUser: {
        species: [
          {
            id: '1',
            species: 'Atlantic cod (COD)',
            commodity_code: '11111111',
            caughtBy: [
              {
                weight: 200,
              },
            ],
            stateLabel: 'Fresh',
            presentationLabel: 'Filleted',
          },
        ],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      },
      exportPayload: {
        items: [
          {
            landings: [
              {
                error: 'invalid',
                errors: {
                  species: 'validation.product.seasonal.invalid-date',
                },
              },
            ],
          },
        ],
        error: 'invalid',
        errors: 
          {  dateLanded: 'error.dateLanded.date.max',}
        ,
      },
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should display the error island', () => {
      expect(wrapper.exists('ErrorIsland')).toBe(true);
    });
   it('should display the correct error messages in the error island', () => {
      const errors = wrapper.find('.error-summary-list');

      expect(errors.text()).toContain(
        'Date landed can be no more than 7 days in the future'
      );
    });

    it('will pass the errors object to the AddVesselForm component', () => {
      const { errorObject } = getErrors(
        state.exportPayload,
        state.config.landingLimitDaysInTheFuture
      );

      expect(wrapper.find('AddVesselForm').prop('errors')).toStrictEqual(errorObject);
    });

    it('will pass the errors array to the ProductWeights component', () => {
      const { errors } = getErrors(
        state.exportPayload,
        state.config.landingLimitDaysInTheFuture
      );

      expect(wrapper.find('ProductWeights').prop('errors')).toStrictEqual(errors);
    });
  });

  describe('when the certificate has overridden landings', () => {
    const state = {
      directLandings: {
        dateLanded: '',
        faoArea: 'FAO27',
        weights: [
          {
            exportWeight: 300,
            speciesId: '1',
            speciesLabel: 'Atlantic cod (COD), Fresh, Filleted, 11111111',
          }
        ],
        vessel: {
          vesselOverriddenByAdmin: true
        },
        vessels: [],
      },
      config: {
        landingLimitDaysInTheFuture: 7,
      },
      landingsType: {
        landingsEntryOption : 'directLanding',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <DirectLandingsPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will render', () => {
      expect(wrapper).not.toBeNull();
    });

    it('will redirect the user to the summary page', () => {
      const summaryUri = props.route.summaryUri.replace(':documentNumber', props.match.params.documentNumber);
      expect(props.history.push).toHaveBeenCalledWith(summaryUri);
    });

  });

  it('will clear the direct landings from store', () => {
    wrapper.unmount();
    expect(clearDirectLanding).toHaveBeenCalled();
  });
});

describe('parseState', () => {
  it('will return species', () => {
    const res = parseState({ weights: 'weights' });
    expect(res).toStrictEqual({ species: 'weights' });
  });

  it('will return faoArea if one is specified', () => {
    const res = parseState({ weights: 'weights', faoArea: 'faoArea' });
    expect(res).toStrictEqual({ species: 'weights', faoArea: 'faoArea' });
  });

  it('will not return faoArea if the one specified is empty', () => {
    const res = parseState({ weights: 'weights', faoArea: '' });
    expect(res).toStrictEqual({ species: 'weights' });
  });

  it('will return a vessel if one is specified', () => {
    const res = parseState({
      weights: 'weights',
      vessel: {
        vesselName: 'vesselName',
        pln: 'pln',
      },
    });
    expect(res).toStrictEqual({
      species: 'weights',
      vessel: {
        domId: 'vesselName-pln',
        label: 'vesselName (pln)',
        pln: 'pln',
        vesselName: 'vesselName',
      },
    });
  });

  it('will return a dateLanded if one is specified', () => {
    const res = parseState({
      weights: 'weights',
      dateLanded: '2020-05-01',
    });
    expect(res).toStrictEqual({
      species: 'weights',
      dateLanded: '2020-05-01',
    });
  });

  it('will not return a dateLanded if it is received in the wrong format', () => {
    const res = parseState({
      weights: 'weights',
    });
    expect(res).toStrictEqual({
      species: 'weights',
    });
  });
});

describe('mapVesselOptions', () => {
  it('will return an empty array if no vessels are provided', () => {
    expect(mapVesselsOptions(null)).toEqual([]);
  });

  it('will add a label and a domId for every vessel', () => {
    const input = [
      { vesselName: 'BOAT 1', pln: 'PLN1' },
      { vesselName: 'BOAT 2', pln: 'PLN2' },
    ];
    expect(mapVesselsOptions(input)).toEqual([
      {
        vesselName: 'BOAT 1',
        pln: 'PLN1',
        label: 'BOAT 1 (PLN1)',
        domId: 'BOAT1-PLN1',
      },
      {
        vesselName: 'BOAT 2',
        pln: 'PLN2',
        label: 'BOAT 2 (PLN2)',
        domId: 'BOAT2-PLN2',
      },
    ]);
  });

  it('will sort vessels alphabetically on name and pln', () => {
    const input = [
      { vesselName: 'VESSEL', pln: 'PLN1' },
      { vesselName: 'BOAT', pln: 'PLN3' },
      { vesselName: 'BOAT', pln: 'PLN2' },
    ];
    expect(mapVesselsOptions(input)).toEqual([
      {
        vesselName: 'BOAT',
        pln: 'PLN2',
        label: 'BOAT (PLN2)',
        domId: 'BOAT-PLN2',
      },
      {
        vesselName: 'BOAT',
        pln: 'PLN3',
        label: 'BOAT (PLN3)',
        domId: 'BOAT-PLN3',
      },
      {
        vesselName: 'VESSEL',
        pln: 'PLN1',
        label: 'VESSEL (PLN1)',
        domId: 'VESSEL-PLN1',
      },
    ]);
  });

  it('will remove whitespace, commas, and close brackets on the domId', () => {
    const input = [{ vesselName: 'BOAT, 1)', pln: 'PLN1' }];
    expect(mapVesselsOptions(input)).toEqual([
      {
        vesselName: 'BOAT, 1)',
        pln: 'PLN1',
        label: 'BOAT, 1) (PLN1)',
        domId: 'BOAT1-PLN1',
      },
    ]);
  });

  it('will replace open brackets on the domId with a hyphen', () => {
    const input = [{ vesselName: '(BOAT', pln: 'PLN1' }];
    expect(mapVesselsOptions(input)).toEqual([
      {
        vesselName: '(BOAT',
        pln: 'PLN1',
        label: '(BOAT (PLN1)',
        domId: '-BOAT-PLN1',
      },
    ]);
  });
});

describe('getLandingErrorsFromExportPayload', () => {
  it('will return an empty object if the export payload is empty', () => {
    expect(getLandingErrorsFromExportPayload({})).toEqual({});
  });

  it('will return an empty object if the export payload doesnt have an items property', () => {
    expect(
      getLandingErrorsFromExportPayload({ transport: { vehicle: 'truck' } })
    ).toEqual({});
  });

  it('will return an empty object if the export payload doesnt have any items', () => {
    expect(getLandingErrorsFromExportPayload({ items: [] })).toEqual({});
  });

  it('will return an error if a landing has an error', () => {
    const exportPayload = {
      items: [
        {
          landings: [
            {
              error: 'invalid',
              errors: {
                weight: 'required',
              },
            },
          ],
        },
      ],
    };
    expect(getLandingErrorsFromExportPayload(exportPayload)).toEqual({
      weight: 'required',
    });
  });

  it('will only return the last error from the last landing', () => {
    const exportPayload = {
      items: [
        {
          landings: [
            {
              error: 'invalid',
              errors: {
                date: 'invalid',
              },
            },
          ],
        },
        {
          landings: [
            {
              error: 'invalid',
              errors: {
                weight: 'required',
              },
            },
          ],
        },
      ],
    };
    expect(getLandingErrorsFromExportPayload(exportPayload)).toEqual({
      weight: 'required',
    });
  });

  it('will not return any errors if the last landing has no errors', () => {
    const exportPayload = {
      items: [
        {
          species: 'Cod',
          landings: [
            {
              error: 'invalid',
              errors: {
                date: 'invalid',
              },
            },
          ],
        },
        {
          species: 'Herring',
          landings: [
            {
              errors: {},
            },
          ],
        },
      ],
    };
    expect(getLandingErrorsFromExportPayload(exportPayload)).toEqual({});
  });

  it('will not return any errors if the last landing doesnt have an error of "invalid"', () => {
    const exportPayload = {
      items: [
        {
          species: 'Cod',
          landings: [
            {
              error: 'invalid',
              errors: {
                date: 'invalid',
              },
            },
          ],
        },
        {
          species: 'Herring',
          landings: [
            {
              error: 'error',
              errors: {
                date: 'invalid',
              },
            },
          ],
        },
      ],
    };
    expect(getLandingErrorsFromExportPayload(exportPayload)).toEqual({});
  });

  it('will ignore products which have no landings', () => {
    const exportPayload = {
      items: [
        {
          species: 'Cod',
          landings: [
            {
              error: 'invalid',
              errors: {
                date: 'invalid',
              },
            },
          ],
        },
        {
          species: 'Herring',
        },
      ],
    };
    expect(getLandingErrorsFromExportPayload(exportPayload)).toEqual({
      date: 'invalid',
    });
  });
});

describe('getErrors', () => {
  it('will return no errors if there are none', () => {
    const exportPayload = {
      error: '',
      errors: {},
    };

    expect(getErrors(exportPayload, 7)).toStrictEqual({
      errors: [],
      errorObject: {},
    });
  });

  it('will correctly transform errors', () => {
    const exportPayload = {
      items: [
        {
          product: {
            commodityCode: '03044410',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
        },
        {
          product: {
            commodityCode: '03023190',
            presentation: {
              code: 'GUH',
              label: 'Gutted and headed',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'ALB',
              label: 'Albacore (ALB)',
            },
          },
        },
      ],
      error: 'invalid',
      errors: {
        'vessel.vesselName': 'error.vessel.vesselName.any.required',
        dateLanded: 'error.dateLanded.date.max',
        'weights.0.exportWeight': 'error.weights.0.exportWeight.any.required',
        'weights.1.exportWeight': 'error.weights.1.exportWeight.any.required',
      },
    };

    expect(getErrors(exportPayload, 7)).toStrictEqual({
      errors: [
        {
          targetName: 'vessel.vesselName',
          text: 'ccAddLandingSelectVesselListNullError',
        },
        {
          targetName: 'dateLanded',
          text: 'ccUploadFilePageTableDateLandedFutureMaximumDaysError-7',
        },
        {
          targetName: 'weights.0.exportWeight',
          text: 'errorDirectLandingExportWeightRequiredText-Atlantic cod (COD)-Fresh-Filleted-03044410',
        },
        {
          targetName: 'weights.1.exportWeight',
          text: 'errorDirectLandingExportWeightRequiredText-Albacore (ALB)-Fresh-Gutted and headed-03023190',
        },
      ],
      errorObject: {
        'vessel.vesselNameError': 'ccAddLandingSelectVesselListNullError',
        dateLandedError: 'ccUploadFilePageTableDateLandedFutureMaximumDaysError-7',
        'weights.0.exportWeightError':
          'errorDirectLandingExportWeightRequiredText-Atlantic cod (COD)-Fresh-Filleted-03044410',
        'weights.1.exportWeightError':
          'errorDirectLandingExportWeightRequiredText-Albacore (ALB)-Fresh-Gutted and headed-03023190',
      },
    });
  });

  it('will correctly transform Add Landings Form with product was subject to fishing restrictions ', () => {
    const exportPayload = {
      items: [
        {
          product: {
            commodityCode: '03044410',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
        },
        {
          product: {
            commodityCode: '03023190',
            presentation: {
              code: 'GUH',
              label: 'Gutted and headed',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'ALB',
              label: 'Albacore (ALB)',
            },
          },
        },
      ],
      error: 'invalid',
      errors: {
        dateLanded: 'ccAddLandingDateLandedRestrictedError-European seabass (BSS)'
     
      },
    };

    expect(getErrors(exportPayload, 1)).toStrictEqual({
      errors: [
        {
          targetName: 'dateLanded',
          text: 'ccAddLandingDateLandedRestrictedError-European seabass (BSS)',
        }
       
      ],
      errorObject: {
        dateLandedError: 'ccAddLandingDateLandedRestrictedError-European seabass (BSS)',
     
      },
    });
  });
});

describe('transformError', () => {
  const products = [
    {
      product: {
        commodityCode: '03044410',
        presentation: {
          code: 'FIL',
          label: 'Filleted',
        },
        state: {
          code: 'FRE',
          label: 'Fresh',
        },
        species: {
          code: 'COD',
          label: 'Atlantic cod (COD)',
        },
      },
    },
    {
      product: {
        commodityCode: '03023190',
        presentation: {
          code: 'GUH',
          label: 'Gutted and headed',
        },
        state: {
          code: 'FRE',
          label: 'Fresh',
        },
        species: {
          code: 'ALB',
          label: 'Albacore (ALB)',
        },
      },
    },
  ];

  const errors = {
    dateLanded: 'error.dateLanded.date.max',
    'vessel.vesselName': 'error.vessel.vesselName.any.required',
    'weights.1.exportWeight': 'error.weights.1.exportWeight.any.required',
  };

  const landingLimit = 7;

  it('will transform a date landed error', () => {
    const errorKey = 'dateLanded';
    const result = transformError(errors, errorKey, products, landingLimit);

    expect(result).toEqual({
      [errorKey]: {
        key: 'error.dateLanded.date.max',
        params: [landingLimit],
      },
    });
  });

  it('will transform a vessel name error', () => {
    const errorKey = 'vessel.vesselName';
    const result = transformError(errors, errorKey, products, landingLimit);

    expect(result).toEqual({
      [errorKey]: 'error.vessel.vesselName.any.required',
    });
  });

  it('will transform a product error', () => {
    const errorKey = 'weights.1.exportWeight';
    const result = transformError(errors, errorKey, products, landingLimit);

    expect(result).toEqual({
      [errorKey]: {
        key: 'error.weights.exportWeight.any.required',
        params: ['Albacore (ALB)', 'Fresh', 'Gutted and headed', '03023190'],
      },
    });
  });
});

describe('transformAllErrors', () => {
  const products = [
    {
      product: {
        commodityCode: '03044410',
        presentation: {
          code: 'FIL',
          label: 'Filleted',
        },
        state: {
          code: 'FRE',
          label: 'Fresh',
        },
        species: {
          code: 'COD',
          label: 'Atlantic cod (COD)',
        },
      },
    },
  ];

  const limit = 7;

  it('will return an empty object when there are no errors', () => {
    const result = transformAllErrors({}, products, limit);

    expect(result).toStrictEqual({});
  });

  it('will run the transform method on each error', () => {
    const errors = {
      'vessel.vesselName': 'error.vessel.vesselName.any.required',
      'weights.0.exportWeight': 'error.weights.exportWeight.any.required',
    };
    const result = transformAllErrors(errors, products, limit);

    expect(result).toStrictEqual({
      'vessel.vesselName': 'error.vessel.vesselName.any.required',
      'weights.0.exportWeight': {
        key: 'error.weights.exportWeight.any.required',
        params: ['Atlantic cod (COD)', 'Fresh', 'Filleted', '03044410'],
      },
    });
  });
});

describe('Direct Landings Load Data', () => {
  getDirectLandings.mockReturnValue({ type: 'GET_DIRECT_LANDING_PRODUCTS' });
  getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });
  const store = {
    dispatch: () => {
      return new Promise((res) => {
        res();
      });
    },
  };

  const documentNumber = 'GBR-2021-CC-458DDBA39';

  it('will call all methods needed to load the component', async () => {
    DirectLandingsPageComponent.documentNumber = documentNumber;

    await DirectLandingsPageComponent.loadData(store);
    expect(getDirectLandings).toBeCalled();
    expect(getDirectLandings).toHaveBeenCalledWith(documentNumber);
    expect(getLandingType).toBeCalled();
    expect(getLandingType).toHaveBeenCalledWith(documentNumber);
  });
});

describe('when unauthorised', () => {
  const mockPush = jest.fn();

  const props = {
    history: {
      push: mockPush,
    },
    directLandings: { unauthorised: true }
  };

  it('should push history for component did update with /forbidden', () => {
    new DirectLandingsPage.WrappedComponent(props).componentDidUpdate();
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });
});

describe('Restrict direct access to direct-landing page', () => {
  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/cc/:documentNumber/what-are-you-exporting',
      saveAsDraftUri: 'cc/catch-certificates',
      nextUri: '/cc/:documentNumber/whose-waters-were-they-caught-in',
      path: ':documentNumber/direct-landing',
      summaryUri: ':documentNumber/check-your-information',
      journey: 'catchCertificate',
      progressUri: 'create-catch-certificate/:documentNumber/progress'
    },
    config: {
      landingLimitDaysInTheFuture: 7,
    },
    match: {
      params: {
        documentNumber: 'document123',
      },
    },
    history: {
      push: jest.fn(),
    },
    unauthorised: false,
    landingsType: {
      landingsEntryOption: 'not directLanding',
      generatedByContent: false
    },
    addedSpeciesPerUser: {
      species: [
        {
          id: '1',
          species: 'Atlantic cod (COD)',
          commodity_code: '11111111',
          caughtBy: [
            {
              weight: 200,
            },
          ],
          stateLabel: 'Fresh',
          presentationLabel: 'Filleted',
        },
      ],
    },
    error: '',
    errors: [],
  };

  const store = configureStore()({
    directLandings: {
      dateLanded: '',
      faoArea: 'FAO27',
      weights: [
        {
          exportWeight: 300,
          speciesId: '1',
          speciesLabel: 'Atlantic cod (COD), Fresh, Filleted, 11111111',
        },
        {
          exportWeight: 200,
          speciesId: '2',
          speciesLabel: 'Herring (HER), Fresh, Filleted, 22222222',
        },
      ],
    },
    unauthorised: false,
    config: {
      landingLimitDaysInTheFuture: 7,
    },
    landingsType: {
      landingsEntryOption: 'not directLanding',
      generatedByContent: false
    },
    error: '',
    errors: [],
  });

  beforeEach(() => {
    getDirectLandings.mockReturnValue({ type: 'GET_DIRECT_LANDING_PRODUCTS' });
    getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <DirectLandingsPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('will redirect to CC dashboard', () => {
    expect(props.history.push).toHaveBeenCalledWith(
      props.route.saveAsDraftUri
    );
  });
});

