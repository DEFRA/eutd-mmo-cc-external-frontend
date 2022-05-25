import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import FavouritesDetails from './../../../src/client/components/elements/FavouritesDetails';
import {component as FavouritesPage} from '../../../src/client/pages/FavouritesPage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import FP from '../../../src/client/pages/FavouritesPage';
import { render } from '@testing-library/react';
import errorTransformer from '../../../src/client/helpers/errorTransformer';

import {
  searchFishStates,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getAllUkFish,
  getCommodityCode,
  saveAddedSpeciesPerUser,
  dispatchApiCallFailed,
  dispatchClearErrors
} from '../../../src/client/actions';

import {
  addFavourite,
  removeFavourite,
  getAddedFavouritesPerUser
} from '../../../src/client/actions/favourites.actions';

jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/favourites.actions');

beforeEach(() => {
  searchFishStates.mockReturnValue({ type: 'SEARCH_FISH_STATES '});
  getAddedFavouritesPerUser.mockReturnValue({ type: 'GET_ADDED_FAVOURITES '});
  getStatesFromReferenceService.mockReturnValue({ type: 'GET_STATES_REFERENCE_SERVICE' });
  getPresentationsFromReferenceService.mockReturnValue({ type: 'GET_PRESENTATION_FROM_REFERENCE' });
  getAllUkFish.mockReturnValue({ type: 'GET_ALL_UK' });
  getCommodityCode.mockReturnValue({ type: 'GET_COMMODITY_CODE' });
  saveAddedSpeciesPerUser.mockReturnValue({ type: 'SAVE_ADDED_SPECIES '});
  dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS'});
  addFavourite.mockReturnValue({ type: 'ADD_FAVOURITE'});
  removeFavourite.mockReturnValue({ type: 'REMOVE_FAVOURITE' });
});

const mockStore = configureStore([thunk.withExtraArgument({
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
    }
  }
})]);

Enzyme.configure({ adapter: new Adapter() });

describe('Favourites Page', () => {

  let wrapper;
  let mockScrollTo;

  beforeEach(async () => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter'
        }
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
        allVessels: []
      },
      config: {
        maxLandingsLimit: 100,
      }
    });

    mockScrollTo = jest.spyOn(window, 'scrollTo')
      .mockReturnValue(null);

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage />
        </MemoryRouter>
      </Provider>
    );
  });

 it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should display the correct heading on the favourites page', () => {
    expect(wrapper.find('FavouritesPage').find('Header').text()).toContain('Product Favourites');
  });

  it('will show Favourite Details', () => {
    expect(wrapper.exists(FavouritesDetails)).toBe(true);
  });

  it('should render a favourite row', () => {
    const rowEl = wrapper.find('Row#productfavourites_PRD234');
    expect(rowEl.find('Cell').first()).toBeTruthy();
   expect(rowEl.find('Cell').first().text()).toBe('PRD234');
   expect(rowEl.find('Cell').at(1).text()).toBe('Species: ATLANTIC (COD) State: Fresh Presentation: Filleted CommodityCode: 03038990 - Frozen fish, n.e.s.');
  });

  it('should render a favourite row without a commodity code description', () => {
    const rowEl = wrapper.find('Row#productfavourites_PRD345');
    expect(rowEl.find('Cell').first().text()).toBe('PRD345');
    expect(rowEl.find('Cell').at(1).text()).toBe('Species: ATLANTIC COD State: Fresh Presentation: Chilled CommodityCode: commodity-code-2');
  });

  it('should have 2 rows', () => {
    expect(wrapper.find('TableBody').exists()).toBeTruthy();
    expect(wrapper.find('TableBody').find('Row')).toHaveLength(2);
  });

  it('should render remove button', () => {
    expect(wrapper.find('button#PRD234').exists()).toBeTruthy();
  });

  it('should remove a favourite', ()=> {
    const removeBtn = wrapper.find('button#PRD234');

    act(() => removeBtn.prop('onClick')({ currentTarget: { id: 'PRD234'}}));

    expect(removeFavourite).toHaveBeenCalledTimes(1);
    expect(removeFavourite).toHaveBeenCalledWith('PRD234');
  });

  it('should show govuk-visually-hidden for remove-favourites', () => {
    expect(wrapper.find('button#PRD234 span.govuk-visually-hidden').exists()).toBeTruthy();
    expect(wrapper.find('button#PRD234 span.govuk-visually-hidden').first().text()).toBe('productfavourites_PRD234');
   });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

   describe('Species Block with no data', () => {
    const store = mockStore({
      exporter: {
        model: {
          exporterFullName: 'Fish Exporter'
        }
      },
      addedFavouritesPerUser: {
        favourites: []
      },
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      global: {
        allFish: [],
        allVessels: []
      },
      config: {
        maxLandingsLimit: 100,
      }
    });

    mockScrollTo = jest.spyOn(window, 'scrollTo')
      .mockReturnValue(null);

    wrapper =  mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage />
        </MemoryRouter>
      </Provider>
    );

    it('should load favourites block successfully with no data', () => {
      expect(wrapper).toBeDefined();
    });
  });
});

describe('History goBack', () => {
  const store = mockStore({
    exporter: {
      model: {
        exporterFullName: 'Fish Exporter'
      }
    },
    addedFavouritesPerUser: {
      favourites: [
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
          commodity_code_description: 'Frozen fish, n.e.s.'
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
      allVessels: []
    },
    config: {
      maxLandingsLimit: 100,
    }
  });
  const mockGoBack = jest.fn();
  const history = createMemoryHistory();
  const props = {
    history: {
      goBack: mockGoBack
    }
  };
  const wrapper = mount(<Provider store={store}><Router history={history}>
          <FavouritesPage {...props}/>
        </Router></Provider>);

  it('should have an achor element with # as href', () => {
    expect(wrapper.find('BackLink').find('a')).toBeTruthy();
    expect(wrapper.find('BackLink').find('a').props().href).toBe('#');
  });
  it('should call goBackHandler', () => {
    wrapper.find('BackLink').simulate('click');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should push history for component did update', () => {
    const mockPush = jest.fn();

    new FavouritesPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      unauthorised: true,
      history: {
        push: mockPush
      },
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalled();
  });
});

describe('Page Navigation back', () => {
  const store = mockStore({
    exporter: {
      model: {
        exporterFullName: 'Fish Exporter'
      }
    },
    addedFavouritesPerUser: {
      favourites: [
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
          commodity_code_description: 'Frozen fish, n.e.s.'
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
      allVessels: []
    },
    config: {
      maxLandingsLimit: 100,
    }
  });
  const mockGoBack = jest.fn();
  const history = createMemoryHistory();
  const props = {
    history: {
      goBack: mockGoBack
    }
  };

  it('should load the component successfully', () => {
    const wrapper = mount(<Provider store={store}>
      <MemoryRouter initialEntries={['/manage-favourites']}>
        <FavouritesPage {...props} />
      </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('FavouritesPage')).toHaveLength(1);
  });

  it('should navigate back successfully', () => {
    mount(<Provider store={store}>
      <Router history={history} initialEntries={['/manage-favourites']}>
        <FavouritesPage {...props} />
      </Router></Provider>
    );
    history.push('/manage-favourites');
    expect(history.location.pathname).toBe('/manage-favourites');
    history.goBack();
    expect(history.location.pathname).toBe('/');
  });
});

describe('loadData', () => {

  beforeEach(() => {
    getStatesFromReferenceService.mockReturnValue({ type: 'GET_STATES_REFERENCE_SERVICE' });
    getAddedFavouritesPerUser.mockReturnValue({ type: 'GET_ADDED_FAVOURITES '});
    getPresentationsFromReferenceService.mockReturnValue({ type: 'GET_PRESENTATION_FROM_REFERENCE' });
    getAllUkFish.mockReturnValue({ type: 'GET_ALL_UK' });
    getCommodityCode.mockReturnValue({ type: 'GET_COMMODITY_CODE' });
    dispatchApiCallFailed.mockReturnValue({ type: 'FAILED_API' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('will dispatch an error', async () => {
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      },
      getState: () => ({
        addedFavouritesPerUser: {
          favourites: []
        }
      })
    };

    FP.queryParams = {
      error: ['{"message":"we have an issue"}']
    };

    await FP.loadData(store);

    expect(dispatchApiCallFailed).toHaveBeenCalled();
  });


});

describe('error handling', () => {

  let wrapper;

  const state = {
    exporter: {
      model: {
        exporterFullName: 'Fish Exporter'
      }
    },
    addedFavouritesPerUser: {
      favourites: [],
      errors: []
    },
    fish: [],
    speciesStates: [],
    speciesPresentations: [],
    global: {
      allFish: [],
      allVessels: []
    },
    config: {
      maxLandingsLimit: 100,
    }
  };

  const errors = {
    species: 'error.species.string.empty',
    state: 'error.state.string.empty',
    presentation: 'error.presentation.string.empty',
    commodity_code: 'error.commodity_code.string.empty',
    favourite: 'error.favourite.max'
  };

  it('should not show the error island if there are no errors', async () => {
    const store = mockStore(state);

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.exists('ErrorIsland')).toBe(false);
  });

  it('should show the error island if there are errors', async () => {
    const store = mockStore({
      ...state,
      addedFavouritesPerUser: {
        ...state.addedFavouritesPerUser,
        errors: errors
      }
    });

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.exists('ErrorIsland')).toBe(true);
  });


  it('should transform and pass any errors to the SpeciesBlock', async () => {
    const store = mockStore({
      ...state,
      addedFavouritesPerUser: {
        ...state.addedFavouritesPerUser,
        errors: errors
      }
    });

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('SpeciesBlock').prop('errors')).toStrictEqual(errorTransformer(errors));
  });

  it('should call dispatchClearErrors when clearErrors is called from the SpeciesBlock', async () => {
    const store = mockStore(state);

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('SpeciesBlock').prop('clearErrors')();

    expect(dispatchClearErrors).toHaveBeenCalledTimes(1);
  });

});

describe('add favourite', () => {

  let wrapper;

  const state = {
    exporter: {
      model: {
        exporterFullName: 'Fish Exporter'
      }
    },
    addedFavouritesPerUser: {
      favourites: []
    },
    errors: {},
    fish: [],
    speciesStates: [],
    speciesPresentations: [],
    global: {
      allFish: [],
      allVessels: []
    },
    config: {
      maxLandingsLimit: 100,
    }
  };

  it('should call the add favourite action', async () => {
    const store = mockStore(state);

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <FavouritesPage />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('SpeciesBlock').prop('addFavourite')();

    expect(addFavourite).toHaveBeenCalledTimes(1);
  });

});