import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import {
  component as AddSpeciesPage,
  hasAdminOverride,
} from '../../../src/client/pages/exportCertificates/AddSpeciesPage';
import SUT from '../../../src/client/pages/exportCertificates/AddSpeciesPage';
import SpeciesBlock from '../../../src/client/components/SpeciesBlock';
import { render } from '@testing-library/react';

import {
  getAddedSpeciesPerUser,
  getExporterFromMongo,
  searchFishStates,
  clearAddedSpeciesPerUser,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getAllUkFish,
  getCommodityCode,
  saveAddedSpeciesPerUser,
  dispatchApiCallFailed,
  dispatchClearErrors,
} from '../../../src/client/actions';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import { getAddedFavouritesPerUser } from '../../../src/client/actions/favourites.actions';

jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/landingsType.actions');
jest.mock('../../../src/client/actions/favourites.actions');

beforeEach(() => {
  getAddedSpeciesPerUser.mockReturnValue({ type: 'GET_ADDED_SPECIES' });
  searchFishStates.mockReturnValue({ type: 'SEARCH_FISH_STATES ' });
  clearAddedSpeciesPerUser.mockReturnValue({ type: 'CLEAR_ADDED_PER_USER' });
  getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTERS_FROM_MONGO' });
  getStatesFromReferenceService.mockReturnValue({
    type: 'GET_STATES_REFERENCE_SERVICE',
  });
  getPresentationsFromReferenceService.mockReturnValue({
    type: 'GET_PRESENTATION_FROM_REFERENCE',
  });
  getAllUkFish.mockReturnValue({ type: 'GET_ALL_UK' });
  getCommodityCode.mockReturnValue({ type: 'GET_COMMODITY_CODE' });
  saveAddedSpeciesPerUser.mockReturnValue({ type: 'SAVE_ADDED_SPECIES ' });
  getLandingType.mockReturnValue({ type: 'GOT_LANDING_TYPE' });
  getAddedFavouritesPerUser.mockReturnValue({
    type: 'GET_ADDED_FAVOURITES_PER_USER',
  });
  dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS' });
});

const mockStore = configureStore([
  thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res([]);
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      },
    },
  }),
]);

describe('snapshot describe block',() => {
  let wrapper;
  let props;
  let mockScrollTo;

  const mockPush = jest.fn();

  beforeEach(() => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter',
        },
      },
      addedSpeciesPerUser: {
        species: [],
      },
      addedFavouritesPerUser: {
        favourites: [
        ]},
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false,
      },
    });

    mockScrollTo = jest.spyOn(window, 'scrollTo').mockReturnValue(null);

    props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: 'some-document-number',
        },
      },
      location: {
        search: '',
      },
      history: {
        push: mockPush,
      },
      showAddToFavouritesCheckbox: true,
    };

    mockPush.mockReset();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            '/one?andClickId=edit-prd-btn-GBR-2021-CC-product-1',
          ]}
        >
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });
  it('should load the snapshot for whole page',() => {
    const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
  })

})

describe('Add species Page initial load without addedSpeciesPerUser', () => {
  let wrapper;
  let props;
  let mockScrollTo;

  const mockPush = jest.fn();

  beforeEach(() => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter',
        },
      },
      addedSpeciesPerUser: {
        species: [
          {
            id: 'GBR-XXXX-CC-XXXXXXX_1',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'GBR-XXXX-CC-XXXXXXX_2',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      addedFavouritesPerUser: {
        favourites: [
          {
            id: 'PRD234',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'PRD345',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      errors: {
        errors: [
          {
            text: 'error.favourite.any.invalid',
            targetName: 'products',
          },
        ],
      },
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false,
      },
    });

    mockScrollTo = jest.spyOn(window, 'scrollTo').mockReturnValue(null);

    props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: 'some-document-number',
        },
      },
      location: {
        search: '',
      },
      history: {
        push: mockPush,
      },
      showAddToFavouritesCheckbox: true,
    };

    mockPush.mockReset();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            '/one?andClickId=edit-prd-btn-GBR-2021-CC-product-1',
          ]}
        >
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load page successfully without addedSpeciesPerUser', () => {
    expect(wrapper).toBeDefined();
  });



  it('should show Add to product favourites - default uncheckbox', () => {
    expect(wrapper.find('input#addToFavourites')).toHaveLength(1);
    expect(wrapper.find('input#addToFavourites').value).toBeFalsy();
    expect(wrapper.find('label#label-addToFavourites span').text()).toContain(
      'Add to product favourites'
    );
  });

  it('should get the landing type', () => {
    expect(getLandingType).toHaveBeenCalled();
  });

  it('should not redirect the user', () => {
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not display a notification banner to notify that product information has been lost', () => {
    expect(wrapper.find('NotificationBanner').exists()).toBeFalsy();
  });

  it('should render a species row', () => {
    const rowEl = wrapper.find('Row#species_COD_FRE_FIL');
    expect(rowEl.find('Cell').first().text()).toBe(
      'ATLANTIC (COD),Fresh,Filleted'
    );
    expect(rowEl.find('Cell').at(1).text()).toBe(
      '03038990 - Frozen fish, n.e.s.'
    );
  });

  it('should render a species row without a commodity code description', () => {
    const rowEl = wrapper.find('Row#species_COD_FRE_CID');
    expect(rowEl.find('Cell').first().text()).toBe(
      'ATLANTIC COD,Fresh,Chilled'
    );
    expect(rowEl.find('Cell').at(1).text()).toBe('commodity-code-2');
  });

  it('should render a save and a save as draft button', () => {
    expect(wrapper.find('button#continue').exists()).toBeTruthy();
    expect(wrapper.find('SaveAsDraftButton').exists()).toBeTruthy();
  });

  it('should have 2 rows', () => {
    expect(wrapper.find('TableBody').exists()).toBeTruthy();
    expect(wrapper.find('TableBody').find('Row')).toHaveLength(2);
  });

  it('should render an edit button', () => {
    expect(wrapper.find('button#GBR-XXXX-CC-XXXXXXX_1').exists()).toBeTruthy();
  });

  it('should render remove button', () => {
    const removeBtn = wrapper.find('button#GBR-XXXX-CC-XXXXXXX_1').at(1);

    expect(removeBtn.exists()).toBeTruthy();
  });

  it('should cancel editMode when remove button is clicked', () => {
    const removeBtn = wrapper.find('button#GBR-XXXX-CC-XXXXXXX_1').at(1);
    wrapper
      .instance()
      .setState({ productId: 'GBR-XXXX-CC-XXXXXXX_2', editMode: true });
    act(() =>
      removeBtn.prop('onClick')({
        preventDefault() {},
        currentTarget: { id: 'GBR-XXXX-CC-XXXXXXX_1' },
      })
    );
    expect(removeBtn.exists()).toBeTruthy();
    expect(wrapper.find('AddSpeciesPage').state()).toMatchObject({
      productId: undefined,
      editMode: false,
    });
    expect(wrapper.find('SpeciesBlock').state()).toEqual({
      addToFavourites: false,
      id: '',
      species: '',
      speciesCode: '',
      scientificName: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      commodityCodes: [],
    });
  });

  it('should go to the dashboard when save as draft is clicked', () => {
    const saveAsDraftBtn = wrapper.find('SaveAsDraftButton');

    act(() => saveAsDraftBtn.prop('onClick')({ preventDefault() {} }));

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/create-catch-certificate/catch-certificates');
  });

  it('should go to the next page when save and continue button is click', async () => {
    const instance = wrapper.find('AddSpeciesPage').instance();
    await instance.onSubmit({ preventDefault() {} });

    expect(saveAddedSpeciesPerUser).toHaveBeenCalled();
  });

  it('should not go to the next page when save and continue button is click', async () => {
    const instance = wrapper.find('AddSpeciesPage').instance();
    await instance.onSubmit({
      preventDefault() {
        throw 'error';
      },
    });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('should call clear Added species per user when component unmount', () => {
    wrapper.unmount();
    expect(clearAddedSpeciesPerUser).toHaveBeenCalled();
  });

  it('should show govuk-visually-hidden for remove-species', () => {
    expect(
      wrapper
        .find('button#GBR-XXXX-CC-XXXXXXX_1 span.govuk-visually-hidden')
        .exists()
    ).toBeTruthy();
    expect(
      wrapper
        .find('button#GBR-XXXX-CC-XXXXXXX_1 span.govuk-visually-hidden')
        .first()
        .text()
    ).toBe('species_COD_FRE_FIL');
  });

  it('should show govuk-visually-hidden for edit-species', () => {
    expect(
      wrapper
        .find('button#GBR-XXXX-CC-XXXXXXX_1 span.govuk-visually-hidden')
        .exists()
    ).toBeTruthy();
    expect(
      wrapper
        .find('button#GBR-XXXX-CC-XXXXXXX_1 span.govuk-visually-hidden')
        .first()
        .text()
    ).toBe('species_COD_FRE_FIL');
  });

  it('should contain 2 tabs for adding products and adding products from favourites', () => {
    expect(wrapper.find('.fes-govuk-tabs')).toBeDefined();
    expect(wrapper.find('.fes-govuk-tabs__tab')).toHaveLength(2);
  });

  it('should contain 2 tabs with the correct labels', () => {
    expect(wrapper.find('a[role="tab"]').first().text()).toBe('Add products');
    expect(wrapper.find('a[role="tab"]').at(1).text()).toBe(
      'Add products from favourites'
    );
  });

  it('should contain a tab group with a reference', () => {
    expect(wrapper.find('ForwardRef')).toBeDefined();
  });

  describe('when the user clicks edit', () => {
    beforeEach(() => {
      wrapper.find('button#GBR-XXXX-CC-XXXXXXX_1').at(0).simulate('click');
    });

    it('should load successfully', () => {
      expect(wrapper).toBeDefined();
     });

    it('will set the productId on the SpeciesBlock', () => {
      expect(wrapper.find('SpeciesBlock').prop('productId')).toBe(
        'GBR-XXXX-CC-XXXXXXX_1'
      );
    });

    it('will set the getTheSpeciesName on SpeciesBlock', () => {
      wrapper.find('AddSpeciesPage').setState({
        addedSpecies: {
          species: 'Dogfish sharks nei',
          speciesCode: 'DGX',
          commodity_code: '03038190',
          stateLabel: 'Fresh',
          presentationLabel: 'Whole',
        },
      });

      expect(wrapper.find('SpeciesBlock').props().addedSpecies).toEqual({
        species: 'Dogfish sharks nei',
        speciesCode: 'DGX',
        commodity_code: '03038190',
        stateLabel: 'Fresh',
        presentationLabel: 'Whole',
      });
    });

    it('should get the fish states of the clicked product', () => {
      expect(searchFishStates).toHaveBeenCalled();
     });

    it('should set the updated product details on the SpeciesBlock', () => {
      expect(wrapper.find('SpeciesBlock').prop('productId')).toBe(
        'GBR-XXXX-CC-XXXXXXX_1'
      );
      expect(wrapper.find('SpeciesBlock').state()).toEqual({
        id: 'GBR-XXXX-CC-XXXXXXX_1',
        addToFavourites: false,
        species: 'ATLANTIC (COD)',
        speciesCode: 'COD',
        scientificName: 'Zoarces viviparus',
        selectedState: 'FRE',
        selectedStateLabel: 'Fresh',
        selectedPresentation: 'FIL',
        selectedPresentationLabel: 'Filleted',
        selectedCommodityCode: '03038990',
        selectedCommodityCodeLabel: 'Frozen fish, n.e.s.',
        commodityCodes: [
          { value: '03038990', label: '03038990 - Frozen fish, n.e.s.' },
        ],
      });
    });
  });

  describe('when the user clicks cancel', () => {
    it('should reset editMode and productId on the state', () => {
      const cancelEditing = wrapper.find('SpeciesBlock').prop('cancelEditing');

      cancelEditing();

      expect(wrapper.find('AddSpeciesPage').state()).toMatchObject({
        editMode: false,
        productId: undefined,
        addedSpecies: undefined
      });
    });
  });

  describe('Add species Page initial load with addedSpeciesPerUser array', () => {
    let wrapper;
    const mockStore = configureStore([
      thunk.withExtraArgument({
        orchestrationApi: {
          get: () => {
            return new Promise((res) => {
              res([]);
            });
          },
          post: () => {
            return new Promise((res) => {
              res({});
            });
          },
        },
      }),
    ]);

    beforeEach(async () => {
      const store = mockStore({
        addedSpeciesPerUser: {
          species: [
            {
              species: 'Atlantic cod (COD)',
              id: 'GBR-123-456',
              speciesCode: 'COD',
              presentation: 'FIS',
              presentationLabel: 'Filleted and skinned',
            },
            {
              species: 'Black scabbardfish (BSF)',
              id: 'GBR-111-456',
              speciesCode: 'BSF',
              presentation: 'GUH',
              presentationLabel: 'Gutted and headed',
            },
            {
              caughtBy: [],
              id: 'GBR-2021-CC-29B285465-3ec7a1fa-e1e9-4544-be63-f925248d914f',
              scientificName: 'Gadus morhua',
              species: 'Atlantic cod (COD)',
              speciesCode: 'COD',
              user_id: null,
            },
          ],
          partiallyFilledProductRemoved: true,
        },
        addedFavouritesPerUser: {
          favourites: [
            {
              id: 'PRD234',
              species: 'ATLANTIC (COD)',
              speciesCode: 'COD',
              scientificName: 'Zoarces viviparus',
              state: 'FRE',
              stateLabel: 'Fresh',
              presentation: 'FIL',
              presentationLabel: 'Filleted',
              commodity_code: '03038990',
              commodity_code_description: 'Frozen fish, n.e.s.',
            },
            {
              id: 'PRD345',
              species: 'ATLANTIC COD',
              speciesCode: 'COD',
              state: 'FRE',
              stateLabel: 'Fresh',
              presentation: 'CID',
              presentationLabel: 'Chilled',
              commodity_code: 'commodity-code-2',
              commodity_code_description: undefined,
            },
          ],
        },
        errors: {},
        fish: [],
        fishStates: [
          {
            state: {
              value: 'FRE',
              label: 'Fresh',
            },
            presentations: [
              {
                value: 'FIL',
                label: 'Filleted',
              },
              {
                value: 'FIS',
                label: 'Filleted and skinned',
              },
              {
                value: 'FSB',
                label: 'Filleted with skin and bones',
              },
              {
                value: 'FSP',
                label: 'Filleted skinned with pinbone on',
              },
              {
                value: 'GUH',
                label: 'Gutted and headed',
              },
              {
                value: 'GUT',
                label: 'Gutted',
              },
              {
                value: 'JAP',
                label:
                  'Japanese cut. transversal cut removing all parts from head to belly',
              },
              {
                value: 'OTH',
                label: 'Other presentations',
              },
              {
                value: 'WHL',
                label: 'Whole',
              },
            ],
          },
        ],
        speciesStates: [],
        speciesPresentations: [],
        global: {
          allFish: [],
          allVessels: [],
        },
        config: {
          maxLandingsLimit: 100,
        },
        landingsType: {
          landingsEntryOption: 'directLanding',
          generatedByContent: false,
        },
      });
      const clearAddedSpeciesPerUser = jest.fn;

      const props = {
        route: {
          title: 'Create a UK catch certificate for exports',
          previousUri: '/export-certificates/add-exporter-details',
          nextUri: '/add-landings',
          path: ':documentNumber/what-are-you-exporting',
          saveAsDraftUri: '/create-catch-certificate/catch-certificates',
          landingsEntryUri: ':documentNumber/landings-entry',
          journey: 'catchCertificate',
          progressUri:'/create-catch-certificate/:documentNumber/progress'
        },
        clearAddedSpeciesPerUser: clearAddedSpeciesPerUser
      };

      window.scrollTo = jest.fn();
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AddSpeciesPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should load page with species successfully', () => {
      expect(wrapper).toBeDefined();
    });

    it('should render the correct guidance message', () => {
      expect(wrapper).toBeDefined();
      expect(
        wrapper.find('div#speciesAndLandingsGuidanceMessage').exists()
      ).toBeTruthy();
      expect(
        wrapper.find('div#speciesAndLandingsGuidanceMessage').text()
      ).toContain('Each product must have at least one landing.');
      expect(
        wrapper.find('div#speciesAndLandingsGuidanceMessage').text()
      ).toContain('A maximum of 100 landings is allowed per certificate.');
    });

    it('should display a notification banner if any of the species are imcomplete', () => {
      expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
      expect(wrapper.find('NotificationBanner').prop('header')).toBe(
        'Important'
      );
      expect(wrapper.find('NotificationBanner').prop('messages')).toEqual([
        'This page has been redesigned. Any partially saved products have been removed and will need to be re added.',
      ]);
    });
  });

  describe('Species Block', () => {
    const store = mockStore({
      addedSpeciesPerUser: {
        species: [],
      },
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false,
      },
    });
    const props = {
      searchResultsForSpecies: ['Atlantic cod'],
      speciesSelectedFromSearchResult: jest.fn(),
      searchFish: jest.fn(),
      searchFishStates: jest.fn(),
      getCommodityCode: jest.fn(),
      speciesStates: ['Fresh'],
      speciesPresentations: ['Filleted'],
      displayCancel: true,
      counter: 1,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('should load species block successfully', () => {
      expect(wrapper).toBeDefined();
    });
  });

  describe('when user click second tab', () => {
    it('should have a species favourtie component', async () => {
      await act(() =>
        wrapper.find('.fes-govuk-tabs__tab').at(1).prop('onClick')({
          currentTarget: { id: 'tab-pane-add-products-from-favourites' },
        })
      );
      wrapper
        .find('AddSpeciesPage')
        .setState({ activeTabKey: 'tab-pane-add-products-from-favourites' });
      expect(wrapper.find('SpeciesFavourites').exists()).toBeTruthy();
    });

    it('should have a species favourite component with users favourites', async () => {
      await act(() =>
        wrapper.find('.fes-govuk-tabs__tab').at(1).prop('onClick')({
          currentTarget: { id: 'tab-pane-add-products-from-favourites' },
        })
      );
      wrapper
        .find('AddSpeciesPage')
        .setState({ activeTabKey: 'tab-pane-add-products-from-favourites' });
      expect(wrapper.find('SpeciesFavourites').props().products).toEqual([
        {
          id: 'PRD234',
          species: 'ATLANTIC (COD)',
          speciesCode: 'COD',
          scientificName: 'Zoarces viviparus',
          state: 'FRE',
          stateLabel: 'Fresh',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          commodity_code: '03038990',
          commodity_code_description: 'Frozen fish, n.e.s.',
        },
        {
          id: 'PRD345',
          species: 'ATLANTIC COD',
          speciesCode: 'COD',
          state: 'FRE',
          stateLabel: 'Fresh',
          presentation: 'CID',
          presentationLabel: 'Chilled',
          commodity_code: 'commodity-code-2',
          commodity_code_description: undefined,
        },
      ]);
    });

    it('should have a species favourite component with errors', async () => {
      await act(() =>
        wrapper.find('.fes-govuk-tabs__tab').at(1).prop('onClick')({
          currentTarget: { id: 'tab-pane-add-products-from-favourites' },
        })
      );
      wrapper
        .find('AddSpeciesPage')
        .setState({ activeTabKey: 'tab-pane-add-products-from-favourites' });
      expect(wrapper.find('SpeciesFavourites').props().errors).toEqual({
        errors: [
          {
            text: 'error.favourite.any.invalid',
            targetName: 'products',
          },
        ],
      });
    });
  });

  it('should clears errors', () => {
    expect(dispatchClearErrors).toHaveBeenCalled();
  });

  it('should have a species favourtie component with showFavourite function to set selected state', async () => {
    await act(() =>
      wrapper.find('.fes-govuk-tabs__tab').at(1).prop('onClick')({
        currentTarget: { id: 'tab-pane-add-products-from-favourites' },
      })
    );
    wrapper.find('AddSpeciesPage').setState({
      activeTabKey: 'tab-pane-add-products-from-favourites',
      selectSpeciesFavourite: {
        species: 'Dogfish sharks nei',
        speciesCode: 'DGX',
        commodity_code: '03038190',
        stateLabel: 'Fresh',
        presentationLabel: 'Whole',
      },
    });

    expect(
      wrapper.find('SpeciesFavourites').props().selectedSpeciesFavourite
    ).toEqual({
      species: 'Dogfish sharks nei',
      speciesCode: 'DGX',
      commodity_code: '03038190',
      stateLabel: 'Fresh',
      presentationLabel: 'Whole',
    });
  });

  it('should show an error message with a link', () => {
    const errorIsland = wrapper.find('ErrorIsland');
    expect(
      errorIsland.find('a[href="/manage-favourites"]').exists()
    ).toBeTruthy();
  });

  it('should have a back to progress page link', () => {
    expect(wrapper.find('a[href="/create-catch-certificate/some-document-number/progress"]').exists()).toBeTruthy();
  });
});

describe('When component did mount', () => {
  it('should set state to be the product id and landings id found in search - direct link from summary page', async () => {
    const store = mockStore({
      addedSpeciesPerUser: {
        species: [
          {
            species: 'Atlantic cod (COD)',
            id: 'GBR-123-456',
            speciesCode: 'COD',
            presentation: 'FIS',
            presentationLabel: 'Filleted and skinned',
          },
          {
            species: 'Black scabbardfish (BSF)',
            id: 'GBR-111-456',
            speciesCode: 'BSF',
            presentation: 'GUH',
            presentationLabel: 'Gutted and headed',
          },
          {
            caughtBy: [],
            id: 'GBR-2021-CC-29B285465-3ec7a1fa-e1e9-4544-be63-f925248d914f',
            scientificName: 'Gadus morhua',
            species: 'Atlantic cod (COD)',
            speciesCode: 'COD',
            user_id: null,
          },
        ],
        partiallyFilledProductRemoved: true,
      },
      addedFavouritesPerUser: {
        favourites: [
          {
            id: 'PRD234',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'PRD345',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      errors: {},
      fish: [],
      fishStates: [
        {
          state: {
            value: 'FRE',
            label: 'Fresh',
          },
          presentations: [
            {
              value: 'FIL',
              label: 'Filleted',
            },
            {
              value: 'FIS',
              label: 'Filleted and skinned',
            },
            {
              value: 'FSB',
              label: 'Filleted with skin and bones',
            },
            {
              value: 'FSP',
              label: 'Filleted skinned with pinbone on',
            },
            {
              value: 'GUH',
              label: 'Gutted and headed',
            },
            {
              value: 'GUT',
              label: 'Gutted',
            },
            {
              value: 'JAP',
              label:
                'Japanese cut. transversal cut removing all parts from head to belly',
            },
            {
              value: 'OTH',
              label: 'Other presentations',
            },
            {
              value: 'WHL',
              label: 'Whole',
            },
          ],
        },
      ],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false,
      },
    });

    const clearAddedSpeciesPerUser = jest.fn;

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        summaryUri:
          '/create-catch-certificate/:documentNumber/check-your-information',
        progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      clearAddedSpeciesPerUser: clearAddedSpeciesPerUser,
    };

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            '/one?andClickId=edit-prd-btn-GBR-2021-CC-product-1',
          ]}
        >
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    const mockPush = jest.fn();

    await new AddSpeciesPage.WrappedComponent({
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        summaryUri:
          '/create-catch-certificate/:documentNumber/check-your-information',
          progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: 'some-document-number',
        },
      },
      location: {
        search: '?andClickId=edit-prd-btn-GBR-2021-CC-product-1',
      },
      history: {
        push: mockPush,
      },
    }).componentDidMount();

    // todo fix this expect
    expect(wrapper.find('AddSpeciesPage').state()).toMatchObject({
      editMode: false,
      productId: undefined,
    });
  });
});

describe('Without added species per user', () => {
  let wrapper;
  let props;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(async () => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter',
        },
      },
      addedSpeciesPerUser: {
        species: undefined,
      },
      addedFavouritesPerUser: {
        favourites: [
          {
            id: 'PRD234',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'PRD345',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      errors: {
        errors: [
          {
            text: 'this is an error',
            targetName: 'state',
          },
        ],
      },
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false,
      },
    });

    window.scrollTo = jest.fn();

    props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: 'some-document-number',
        },
      },
      location: {
        search: '',
      },
      history: []
    };

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render', () => {
    expect(wrapper).toBeDefined();
  });

  it('should have a ErrorIsland', () => {
    expect(wrapper.find('ErrorIsland')).toBeDefined();
  });
});

describe('Without landing entry option', () => {
  let props;

  const mockPush = jest.fn();
  const documentNumber = 'some-document-number';

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(async () => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter',
        },
      },
      addedSpeciesPerUser: {
        species: undefined,
      },
      addedFavouritesPerUser: {
        favourites: [
          {
            id: 'PRD234',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'PRD345',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      errors: {
        errors: [
          {
            text: 'this is an error',
            targetName: 'state',
          },
        ],
      },
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
    });

    window.scrollTo = jest.fn();

    props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: documentNumber,
        },
      },
      location: {
        search: '',
      },
      history: {
        push: mockPush,
      }
    };

    await mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should redirect to the landing entry option page', () => {
    const uri = props.route.landingsEntryUri.replace(':documentNumber', documentNumber);
    expect(mockPush).toHaveBeenCalledWith(uri);
  });
});

describe('When landings have been overridden by admin for a direct landing certificate', () => {
  let wrapper;
  let props;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  const mockPush = jest.fn();

  beforeEach(async () => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter',
        },
      },
      addedSpeciesPerUser: {
        species: [
          {
            id: 'GBR-XXXX-CC-XXXXXXX_1',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: 'commodity-code-1',
            commodity_code_description: 'some-commodity-code',
            caughtBy: [
              {
                vesselOverriddenByAdmin: true,
              },
            ],
          },
        ],
      },
      addedFavouritesPerUser: {
        favourites: [
          {
            id: 'PRD234',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'PRD345',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: false,
      },
    });

    props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        summaryUri:
          '/create-catch-certificate/:documentNumber/check-your-information',
          progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: 'some-document-number',
        },
      },
      history: {
        push: mockPush,
      },
      location: {
        search: '',
      }
    };

    mockPush.mockReset();

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load page successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should redirect the user to the summary page', () => {
    const summaryUri = props.route.summaryUri.replace(
      ':documentNumber',
      props.match.params.documentNumber
    );

    expect(mockPush).toHaveBeenCalledWith(summaryUri);
  });
});

describe('When landings have been overridden by admin for a non direct landing certificate', () => {
  let wrapper;
  let props;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  const mockPush = jest.fn();

  beforeEach(async () => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter',
        },
      },
      addedSpeciesPerUser: {
        species: [
          {
            id: 'GBR-XXXX-CC-XXXXXXX_1',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: 'commodity-code-1',
            commodity_code_description: 'some-commodity-code',
            caughtBy: [
              {
                vesselOverriddenByAdmin: true,
              },
            ],
          },
        ],
      },
      addedFavouritesPerUser: {
        favourites: [
          {
            id: 'PRD234',
            species: 'ATLANTIC (COD)',
            speciesCode: 'COD',
            scientificName: 'Zoarces viviparus',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'FIL',
            presentationLabel: 'Filleted',
            commodity_code: '03038990',
            commodity_code_description: 'Frozen fish, n.e.s.',
          },
          {
            id: 'PRD345',
            species: 'ATLANTIC COD',
            speciesCode: 'COD',
            state: 'FRE',
            stateLabel: 'Fresh',
            presentation: 'CID',
            presentationLabel: 'Chilled',
            commodity_code: 'commodity-code-2',
            commodity_code_description: undefined,
          },
        ],
      },
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: [],
      },
      config: {
        maxLandingsLimit: 100,
      },
      landingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false,
      },
    });

    props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: '/add-landings',
        path: ':documentNumber/what-are-you-exporting',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        summaryUri:
          '/create-catch-certificate/:documentNumber/check-your-information',
          progressUri:'/create-catch-certificate/:documentNumber/progress'
      },
      match: {
        params: {
          documentNumber: 'some-document-number',
        },
      },
      location: {
        search: '',
      },
      history: {
        push: mockPush,
      }
    };

    mockPush.mockReset();

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load page successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should not redirect the user anywhere', () => {
    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe('loadData', () => {
  beforeEach(() => {
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTERS_FROM_MONGO' });
    getAddedSpeciesPerUser.mockReturnValue({ type: 'GET_ADDED_SPECIES' });
    getStatesFromReferenceService.mockReturnValue({
      type: 'GET_STATES_REFERENCE_SERVICE',
    });
    getPresentationsFromReferenceService.mockReturnValue({
      type: 'GET_PRESENTATION_FROM_REFERENCE',
    });
    getAllUkFish.mockReturnValue({ type: 'GET_ALL_UK' });
    getCommodityCode.mockReturnValue({ type: 'GET_COMMODITY_CODE' });
    dispatchApiCallFailed.mockReturnValue({ type: 'FAILED_API' });
    getAddedFavouritesPerUser.mockReturnValue({
      type: 'GET_ADDED_FAVOURITES_PER_USER',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const documentNumber = 'some-document-number';

  it('will dispatch an error', async () => {
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      },
      getState: () => ({
        addedSpeciesPerUser: {
          species: [],
        },
      }),
    };

    SUT.documentNumber = documentNumber;
    SUT.queryParams = {
      error: ['{"message":"we have an issue"}'],
    };
    SUT.props = {
      match: {
        params: {
          documentNumber: 'GBR-XXXX-CC-XXXXXXXXXX',
        },
      },
    };

    await SUT.loadData(store);

    expect(dispatchApiCallFailed).toHaveBeenCalled();
  });

  it('will not dispatch an error', async () => {
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      },
      getState: () => ({
        addedSpeciesPerUser: {
          species: [],
        },
      }),
    };

    SUT.documentNumber = documentNumber;
    SUT.queryParams = {
      error: [],
    };
    SUT.props = {
      match: {
        params: {
          documentNumber: 'GBR-XXXX-CC-XXXXXXXXXX',
        },
      },
    };

    await SUT.loadData(store);

    expect(dispatchApiCallFailed).not.toHaveBeenCalled();
  });

  it('will load when no species are found', async () => {
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      },
      getState: () => ({
        addedSpeciesPerUser: {},
      }),
    };

    SUT.documentNumber = documentNumber;
    SUT.queryParams = {
      error: [],
    };
    SUT.props = {
      match: {
        params: {
          documentNumber: 'GBR-XXXX-CC-XXXXXXXXXX',
        },
      },
    };

    await SUT.loadData(store);

    expect(dispatchApiCallFailed).not.toHaveBeenCalled();
  });

  it('will load commodity codes', async () => {
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      },
      getState: () => ({
        addedSpeciesPerUser: {
          species: [
            {
              id: 'GBR-XXXX-CC-XXXXXXX_1',
              species: 'ATLANTIC (COD)',
              speciesCode: 'COD',
              state: 'FRE',
              stateLabel: 'Fresh',
              presentation: 'FIL',
              presentationLabel: 'Filleted',
              commodity_code: '',
              commodity_code_description: '',
            },
          ],
        },
      }),
    };

    SUT.documentNumber = documentNumber;
    SUT.queryParams = {
      error: [],
    };
    SUT.props = {
      match: {
        params: {
          documentNumber: 'GBR-XXXX-CC-XXXXXXXXXX',
        },
      },
    };

    await SUT.loadData(store);

    expect(getCommodityCode).toHaveBeenCalled();
  });

  it('will load commodity codes without a species', async () => {
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      },
      getState: () => ({
        addedSpeciesPerUser: {
          species: [
            {
              id: 'GBR-XXXX-CC-XXXXXXX_1',
              species: 'incorrrect',
              speciesCode: 'COD',
              state: 'FRE',
              stateLabel: 'Fresh',
              presentation: 'FIL',
              presentationLabel: 'Filleted',
              commodity_code: '',
              commodity_code_description: '',
            },
          ],
        },
      }),
    };

    SUT.documentNumber = documentNumber;
    SUT.queryParams = {
      error: [],
    };
    SUT.props = {
      match: {
        params: {
          documentNumber: 'GBR-XXXX-CC-XXXXXXXXXX',
        },
      },
    };

    await SUT.loadData(store);

    expect(getCommodityCode).toHaveBeenCalled();
  });
});

describe('When component did mount service call fails', () => {
  it('should catch errors', async () => {
    getAddedSpeciesPerUser.mockImplementation(() => {
      throw 'error';
    });

    await new AddSpeciesPage.WrappedComponent({
      match: {
        params: {
          documentNumber: '',
        },
      },
      location: {
        search: '',
      },
      route: {
        progressUri:'/create-catch-certificate/:documentNumber/progress'},
    })
      .componentDidMount()
      .catch((err) => {
        expect(err).toEqual(
          new TypeError('Cannot read property \'push\' of undefined')
        );
      });
  });

  it('should push history for component did update', () => {
    const mockPush = jest.fn();

    new AddSpeciesPage.WrappedComponent({
      match: {
        params: {
          documentNumber: '',
        },
      },
      unauthorised: true,
      history: {
        push: mockPush,
      },
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should clear errors on component will unmount', () => {
    const mockDispatchClearErrors = jest.fn();
    const mockClearAddedSpeciesPerUser = jest.fn();

    new AddSpeciesPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      unauthorised: true,
      dispatchClearErrors: mockDispatchClearErrors,
      clearAddedSpeciesPerUser: mockClearAddedSpeciesPerUser
    }).componentWillUnmount();

    expect(mockDispatchClearErrors).toHaveBeenCalled();
  });


});

describe('hasAdminOverride', () => {
  it('will return false if species is null', () => {
    expect(hasAdminOverride(null)).toBe(false);
  });

  it('will return false if there are no species', () => {
    expect(hasAdminOverride([])).toBe(false);
  });

  it('will return false if there is no caughtBy information', () => {
    const input = [{}];

    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if caughtBy is empty', () => {
    const input = [
      {
        caughtBy: [],
      },
    ];

    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if there are no an overridden landings', () => {
    const input = [
      {
        caughtBy: [
          {
            vesselOverriddenByAdmin: false,
          },
        ],
      },
    ];

    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return true if there is an overridden landings', () => {
    const input = [
      {
        caughtBy: [
          {
            vesselOverriddenByAdmin: true,
          },
        ],
      },
    ];

    expect(hasAdminOverride(input)).toBe(true);
  });

  it('will return true if any of the landings are overridden', () => {
    const input = [
      {
        caughtBy: [
          {
            vesselOverriddenByAdmin: false,
          },
        ],
      },
      {
        caughtBy: [
          {
            vesselOverriddenByAdmin: true,
          },
        ],
      },
    ];

    expect(hasAdminOverride(input)).toBe(true);
  });
});

describe('When next uri changing on the basis selected landing entry option', () => {
  let wrapper;
  let props;
  const mockPush = jest.fn();

  const state = {
    exporter: {
      model: {
        exporterFullName: 'Fish Exporter',
      },
    },
    addedSpeciesPerUser: {
      species: [
        {
          id: 'GBR-XXXX-CC-XXXXXXX_1',
          species: 'ATLANTIC (COD)',
          speciesCode: 'COD',
          state: 'FRE',
          stateLabel: 'Fresh',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          commodity_code: 'commodity-code-1',
          commodity_code_description: 'some-commodity-code',
          caughtBy: [
            {
              vesselOverriddenByAdmin: true,
            },
          ],
        },
      ],
    },
    addedFavouritesPerUser: {
      favourites: [
        {
          id: 'PRD234',
          species: 'ATLANTIC (COD)',
          speciesCode: 'COD',
          scientificName: 'Zoarces viviparus',
          state: 'FRE',
          stateLabel: 'Fresh',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          commodity_code: '03038990',
          commodity_code_description: 'Frozen fish, n.e.s.',
        },
        {
          id: 'PRD345',
          species: 'ATLANTIC COD',
          speciesCode: 'COD',
          state: 'FRE',
          stateLabel: 'Fresh',
          presentation: 'CID',
          presentationLabel: 'Chilled',
          commodity_code: 'commodity-code-2',
          commodity_code_description: undefined,
        },
      ],
    },
    errors: {},
    fish: [],
    speciesStates: [],
    speciesPresentations: [],
    global: {
      allFish: [],
      allVessels: [],
    },
    config: {
      maxLandingsLimit: 100,
    },
    landingsType: {
      landingsEntryOption: 'directLanding',
      generatedByContent: false,
    },
  };

  props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/export-certificates/add-exporter-details',
      path: ':documentNumber/what-are-you-exporting',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      summaryUri:
        '/create-catch-certificate/:documentNumber/check-your-information',
      directLandingsUri: '/create-catch-certificate/:documentNumber/direct-landing',
      nextUri: '/create-catch-certificate/:documentNumber/adding-landings',
      progressUri:'/create-catch-certificate/:documentNumber/progress'
    },
    match: {
      params: {
        documentNumber: 'some-document-number',
      },
    },
    history: {
      push: mockPush,
    },
    location: {
      search: '',
    }
  };

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  describe('directLanding', ()=>{
    beforeEach(async()=>{
      const _state = {
        ...state,
        landingsType: {
          landingsEntryOption: 'directLanding',
          generatedByContent: false,
        }
      };

      const store = mockStore(_state);

      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AddSpeciesPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    afterEach(()=>{
      mockPush.mockReset();
    });

    it('should load page successfully', () => {
      expect(wrapper).toBeDefined();
    });

    it('should redirect direct-landing if direct landing option selected', async() => {
      const instance = wrapper.find('AddSpeciesPage').instance();
      await instance.onSubmit({ preventDefault() {} });
      const directLandingsUri = props.route.directLandingsUri.replace(
        ':documentNumber',
        props.match.params.documentNumber
      );

      expect(mockPush).toHaveBeenCalledWith(directLandingsUri);
    });
  });

  describe('manualEntry', ()=>{
    beforeEach(async()=>{
      const _state = {
        ...state,
        landingsType: {
          landingsEntryOption: 'manualEntry',
          generatedByContent: false,
        }
      };

      const store = mockStore(_state);

      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AddSpeciesPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    afterEach(()=>{
      mockPush.mockReset();
    });

    it('should load page successfully', () => {
      expect(wrapper).toBeDefined();
    });

    it('should redirect add-landings if manual entry option selected', async() => {
      const instance = wrapper.find('AddSpeciesPage').instance();
      await instance.onSubmit({ preventDefault() {} });
      const nextUri = props.route.nextUri.replace(
        ':documentNumber',
        props.match.params.documentNumber
      );

      expect(mockPush).toHaveBeenCalledWith(nextUri);
    });
  });

  describe('uploadEntry', ()=>{
    beforeEach(async()=>{
      const _state = {
        ...state,
        landingsType: {
          landingsEntryOption: 'uploadEntry',
          generatedByContent: false,
        }
      };

      const store = mockStore(_state);

      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AddSpeciesPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    afterEach(()=>{
      mockPush.mockReset();
    });

    it('should load page successfully', () => {
      expect(wrapper).toBeDefined();
    });

    it('should redirect add-landings if upload from a CSV file option selected', async() => {
      const instance = wrapper.find('AddSpeciesPage').instance();
      await instance.onSubmit({ preventDefault() {} });
      const nextUri = props.route.nextUri.replace(
        ':documentNumber',
        props.match.params.documentNumber
      );

      expect(mockPush).toHaveBeenCalledWith(nextUri);
    });
  });
});