import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { component as AddSpeciesPage } from '../../../../../src/client/pages/exportCertificates/AddSpeciesPage';
import {
  getAddedSpeciesPerUser,
  clearAddedSpeciesPerUser,
  addSpeciesPerUser,
  dispatchApiCallFailed,
  getExporterFromMongo,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getCommodityCode,
  searchFishStates,
  dispatchClearErrors,
  speciesSelectedFromSearchResult,
  searchUkFish,
  getAllUkFish,
  saveAddedSpeciesPerUser
} from '../../../../../src/client/actions';

import { getAddedFavouritesPerUser } from '../../../../../src/client/actions/favourites.actions';

jest.mock('../../../../../src/client/actions');
jest.mock('../../../../../src/client/actions/favourites.actions');

describe('Add product Page initial load', () => {
  let wrapper;
  let store;

  const mountWrapper = (store,props)=> {
    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <AddSpeciesPage {...props} />
        </MemoryRouter>
      </Provider>
    );
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


  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/export-certificates/add-exporter-details',
      nextUri: '/add-landings',
      path: ':documentNumber/what-are-you-exporting',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      journey: 'catchCertificate',
      progressUri: '/create-catch-certificate/:documentNumber/progress'
    },
    match: {
      params: {
        documentNumber: 'GBR-XXXX-CC-XXXXXXX'
      }
    },
  };

  beforeEach(() => {
    addSpeciesPerUser.mockReturnValue({ type: 'ADD_SPECIES_PER_USER' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_FROM_MONGO' });
    getAddedSpeciesPerUser.mockReturnValue({ type: 'ADD_SPECIES_PER_USER' });
    clearAddedSpeciesPerUser.mockReturnValue({ type: 'CLEAR_SPECIES_PER_USER' });
    getStatesFromReferenceService.mockReturnValue({ type: 'GET_SPECIES_STATES' });
    getPresentationsFromReferenceService.mockReturnValue({ type: 'GET_PRESENTATIONS' });
    getCommodityCode.mockReturnValue({ type: 'GET_COMMODITY_CODE' });
    searchFishStates.mockReturnValue({ type: 'SEARCH_FISH_STATES' });
    dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERROR' });
    speciesSelectedFromSearchResult.mockReturnValue({ type: 'SPECIES_SEARCH' });
    searchUkFish.mockReturnValue({ type: 'SEARCH_UK_FISH' });
    getAllUkFish.mockReturnValue({ type: 'GET_ALL_UK_FISH' });
    saveAddedSpeciesPerUser.mockReturnValue({ type: 'SAVE_ADDED_SPECIES_PER_USER' });
    dispatchApiCallFailed.mockReturnValue({ type: 'DISPATCH_ERROR'});
    getAddedFavouritesPerUser.mockReturnValue({ type: 'GET_ADDED_FAVOURITES_PER_USER'});

    jest.spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    store = {
      addedSpeciesPerUser: {
        species: [
          {
            id: 'GBR-XXXX-CC-XXXXXXX_1',
            species: 'ATLANTIC COD',
            stateLabel: 'Fresh',
            presentationLabel: 'Filleted',
            commodity_code: '03044410',
            commodity_code_description: 'Fresh or Filleted fish'
          },
          {
            id: 'GBR-XXXX-CC-XXXXXXX_2',
            species: 'ATLANTIC COD',
            stateLabel: 'Fresh',
            presentationLabel: 'Chilled',
            commodity_code: '03044411',
            commodity_code_description: 'Fresh or chilled fish'
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
            commodity_code_description: 'Frozen fish, n.e.s.'
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
            commodity_code_description: undefined
          },
        ]
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
    };


  });

  it('should load page successfully without addedSpeciesPerUser', () => {
    mountWrapper(store,props);
    expect(wrapper).toBeDefined();
  });

  it('should have table caption', () => {
    mountWrapper(store,props);
    expect(wrapper.find('#productTableCaption')).toBeDefined();
  });

  it('should have product table caption as per spec', () => {
    mountWrapper(store,props);
    expect(wrapper.find('#productTableCaption').text()).toBe('Your products');
  });

  it('table caption should have proper class', () => {
    mountWrapper(store,props);
    expect(wrapper.find('#productTableCaption').hasClass('heading-large')).toBe(
      true
    );
  });

  it('product table should exists', () => {
    mountWrapper(store,props);
    expect(wrapper.find('table.yourProductsTable')).toBeDefined();
  });

  it('should have 3 columns with correct column headings', () => {
    mountWrapper(store,props);
    wrapper.find('AddSpeciesPage').setState({
      products: [
        {
          id: 'GBR-XXXX-CC-XXXXXXX_1',
          species: 'ATLANTIC COD',
          stateLabel: 'Fresh',
          presentationLabel: 'Filleted',
          commodity_code: '03044410',
          commodity_code_description: 'Fresh or Filleted fish'
        },
        {
          id: 'GBR-XXXX-CC-XXXXXXX_2',
          species: 'ATLANTIC COD',
          stateLabel: 'Fresh',
          presentationLabel: 'Filleted',
          commodity_code: '03044411',
          commodity_code_description: 'Fresh or Filleted fish'
        },
      ],
    });

    expect(wrapper.find('CellHeader')).toHaveLength(3);
    expect(wrapper.find('CellHeader').at(0).text()).toBe('Product');
    expect(wrapper.find('CellHeader').at(1).text()).toBe('Commodity code');
    expect(wrapper.find('CellHeader').at(2).text()).toBe('Action');
  });

  it('should have 2 rows', () => {
    mountWrapper(store,props);
    expect(wrapper.find('TableBody').exists()).toBeTruthy();
    expect(wrapper.find('TableBody').find('Row')).toHaveLength(2);
  });

  it('should have remove button for product with commodity code 03044410', () => {
    mountWrapper(store,props);
    const removeBtn = wrapper.find('button#GBR-XXXX-CC-XXXXXXX_1');

    expect(removeBtn.exists()).toBeTruthy();
  });

  it('should call remove button handler', () => {
    mountWrapper(store,props);
    const removeBtn = wrapper.find('button#GBR-XXXX-CC-XXXXXXX_1').at(1);

    removeBtn.simulate('click', {
      id: 'GBR-XXXX-CC-XXXXXXX_1',
      species: 'ATLANTIC COD',
      stateLabel: 'Fresh',
      presentationLabel: 'Filleted',
      commodity_code: '03044410',
      commodity_code_description: 'Fresh or chilled fish'
    });

    expect(addSpeciesPerUser).toHaveBeenCalledWith({
      cancel: 'GBR-XXXX-CC-XXXXXXX_1',
      redirect: 'GBR-XXXX-CC-XXXXXXX/what-are-you-exporting',
    }, 'GBR-XXXX-CC-XXXXXXX');
  });

  it('should show notification banner with the right message if partiallyFilledProductRemoved = true', () => {
    store.addedSpeciesPerUser.partiallyFilledProductRemoved =true;
    mountWrapper(store,props);

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')).toEqual(['This page has been redesigned. Any partially saved products have been removed and will need to be re added.']);

  });

  it('should show notification banner with the right message if addedToFavourites = true', () => {
    store.addedSpeciesPerUser.addedFavouriteProduct= {
      addedToFavourites : true,
      commodity_code: '03047190',
      id: '1de25edf-8f04-425b-a558-c4037afcfe7c',
      presentation: 'FIL',
      presentationLabel: 'Filleted',
      species: 'Atlantic cod (COD)',
      speciesCode: 'COD',
      state: 'FRO',
      stateLabel: 'Frozen',
      user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
    };
    mountWrapper(store,props);

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')).toEqual([
      'Product '
      + store.addedSpeciesPerUser.addedFavouriteProduct.species +', '
      + store.addedSpeciesPerUser.addedFavouriteProduct.stateLabel + ', '
      + store.addedSpeciesPerUser.addedFavouriteProduct.presentationLabel + ', '
      + store.addedSpeciesPerUser.addedFavouriteProduct.commodity_code
    + ' has been added to your product favourites']);

  });

  it('should show notification banner with the right message if addedToFavourites = false', () => {
    store.addedSpeciesPerUser.addedFavouriteProduct= {
      addedToFavourites : false,
      commodity_code: '03047190',
      id: '1de25edf-8f04-425b-a558-c4037afcfe7c',
      presentation: 'FIL',
      presentationLabel: 'Filleted',
      species: 'Atlantic cod (COD)',
      speciesCode: 'COD',
      state: 'FRO',
      stateLabel: 'Frozen',
      user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
    };
    mountWrapper(store,props);

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')).toEqual([
      'Product '
      + store.addedSpeciesPerUser.addedFavouriteProduct.species +', '
      + store.addedSpeciesPerUser.addedFavouriteProduct.stateLabel + ', '
      + store.addedSpeciesPerUser.addedFavouriteProduct.presentationLabel + ', '
      + store.addedSpeciesPerUser.addedFavouriteProduct.commodity_code
      + ' already exists in your product favourites']);

  });
});

//
