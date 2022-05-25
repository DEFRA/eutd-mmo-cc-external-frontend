import * as React from 'react';
import { render } from 'enzyme';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import { component as AddProcessingPlantAddress }  from '../../../../src/client/pages/processingStatement/addProcessingPlantAddress';
import AddProcessingPlantAddressWrapper from '../../../../src/client/pages/processingStatement/addProcessingPlantAddress';
import { getProcessingStatementFromRedis,saveProcessingStatementToRedis  } from '../../../../src/client/actions';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {CHANGE_PLANT_ADDRESS, CLEAR_CHANGE_PLANT_ADDRESS, CLEAR_PROCESSING_STATEMENT} from '../../../../src/client/actions/index';
import * as clientAction from '../../../../src/client/actions/index.js';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import { render as tlcRender} from '@testing-library/react';
import '@testing-library/jest-dom';


describe('AddProcessingPlantAddress', () => {


  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockGetFromRedis = jest.spyOn(clientAction, 'getProcessingStatementFromRedis');
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);
  const mockClearErrors = jest.fn();


  const props = {
    match: {
      params: {
        documentNumber: 'processingStatement1'
      },

    },
    route: {
      previousUri: '',
      progressUri: ':documentNumber/progress',
      path: '',
      journey: 'processingStatement',
      nextUri: '',
      changeAddressUri: '/:documentnumber/changeAddress'
    },
    clear: jest.fn(),
    t: jest.fn()
  };

  const storeData = {
    processingStatement: {
      _plantDetailsUpdated: true
    },
    t: jest.fn(),
    getFromRedis:mockGetFromRedis
  };

  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: mockGet,
      post: mockPost
    }
  })]);

  const store = mockStore(storeData);

  const component =
    <Provider store={store}>
      <MemoryRouter>
        <AddProcessingPlantAddress {...props} />
      </MemoryRouter>
    </Provider>;

  beforeEach(() => {
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });
    mockScrollToErrorIsland.mockReset();
    mockScrollToErrorIsland.mockImplementation(() => null);
    mockGet.mockReset();
    mockGet.mockResolvedValue({data: {}});
    mockPost.mockReset();
    mockPost.mockResolvedValue({data: {}});
    store.clearActions();
    wrapper = mount(component);
  });


  afterEach(() => {
    saveProcessingStatementToRedis.mockReset();
  });


  describe('regardless of state', () => {

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBe(true);
    });

    it('will handle go back event', () => {
      wrapper.find('a').first().simulate('click');

      expect(store.getActions()).toContainEqual({type: CLEAR_PROCESSING_STATEMENT});
    });

    it('will handle on change events', () => {
      wrapper.find('input[name="plantName"]').simulate('change', {target: {name: 'plantName',  value: 'Plant 1234567'}});
    });

    it('will handle click continue event', async () => {
      const component = wrapper.find('button#continue');

      await act(async () => {
        await component.simulate('click');
      });

      expect(store.getActions()).toContainEqual({type: CLEAR_PROCESSING_STATEMENT});
    });

    it('will handle click save as draft event', async () => {
      const component = wrapper.find('button#saveAsDraft');

      await act(async () => {
        await component.simulate('click');
      });

      expect(store.getActions()).toContainEqual({type: CLEAR_PROCESSING_STATEMENT});
    });

    it('will have an id on all inputs', () => {
      expect(wrapper.find('input[id="plantName"]').exists()).toBe(true);
    });

    it('will have a for attribute on all input labels', () => {
      expect(wrapper.find('label#plantName').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#plantName').props()['htmlFor']).toBe('plantName');
    });

    it('will not clear the change plant address flag when the component mounts', () => {
      expect(store.getActions()).not.toContainEqual({type: CLEAR_CHANGE_PLANT_ADDRESS});
    });

    it('will clear changeAddress on save and continue', () => {
      wrapper.find('button#continue').simulate('click');

      expect(store.getActions()).toContainEqual({type: CLEAR_CHANGE_PLANT_ADDRESS});
    });

    it('will clear changeAddress on save as draft', () => {
      wrapper.find('button#saveAsDraft').simulate('click');

      expect(store.getActions()).toContainEqual({type: CLEAR_CHANGE_PLANT_ADDRESS});
    });

    it('will call the the on submit for component', () => {
      const event = {
          preventDefault: jest.fn()
        };
        const formEl = wrapper.find('form');
        formEl.props().onSubmit(event);

        expect(formEl.exists()).toBeTruthy();
        expect(event.preventDefault).toHaveBeenCalled();
     });

    it('should push history to prev page for unauthorised attempt when unauthorised is true', () => {
      const mockPush = jest.fn();

      new AddProcessingPlantAddress.WrappedComponent({
        match: {
          params: {
            documentNumber: 'GBR-23423-4234234'
          }
        },
        processingStatement: {
          unauthorised: true
        },
        history: {
          push: mockPush
        },
        route: {
          path: ':documentNumber/add-processing-plant-address',
          title: 'Create a UK processing statement - GOV.UK',
          previousUri: ':documentNumber/add-processing-plant-address',
          progressUri: ':documentNumber/progress',
          nextUri: ':documentNumber/add-health-certificate',
          changeAddressUri: ':documentNumber/what-processing-plant-address',
          journey: 'processing statement',
          saveAsDraftUri: 'processing-statements'
        }
      }).componentDidUpdate();

      expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/add-processing-plant-address');
    });

    it('should not push history when processingStatement is undefined', () => {
      const mockPush = jest.fn();

      new AddProcessingPlantAddress.WrappedComponent({
        match: {
          params: {
            documentNumber: 'GBR-23423-4234234'
          }
        },
        processingStatement: undefined,
        history: {
          push: mockPush
        },
        route: {
          path: ':documentNumber/add-processing-plant-address',
          title: 'Create a UK processing statement - GOV.UK',
          progressUri: '/create-processing-statement/:documentNumber/progress',
          previousUri: ':documentNumber/add-processing-plant-address',
          nextUri: ':documentNumber/add-health-certificate',
          changeAddressUri: ':documentNumber/what-processing-plant-address',
          journey: 'processing statement',
          saveAsDraftUri: 'processing-statements'
        }
      }).componentDidUpdate();

      expect(mockPush).not.toHaveBeenCalledWith('GBR-23423-4234234/add-processing-plant-address');
    });

    it('will call all methods needed to load the component', async () => {
      const store = {
        dispatch: () => {
          return new Promise((resolve) => {
            resolve();
          });
        }
      };

      await AddProcessingPlantAddressWrapper.loadData(store, 'processingStatement');
      expect(getProcessingStatementFromRedis).toHaveBeenCalled();
    });

    it('should call on onChange/goBack when entering a description', async () => {
      const documentNumber = 'document123';
      const history = createMemoryHistory({
        initialEntries: [
          `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
        ],
      });
      const mockPush = jest.spyOn(history, 'push');
      mockPush.mockReturnValue(null);
      mockSaveToRedis.mockReturnValue({
        errors: {
          plantAddressOne: 'Enter the address',
          plantName: 'Enter the plant name',
        },
      });

      const props = {
        route: {
          path: ':documentNumber/add-processing-plant-address',
          title: 'Create a UK processing statement - GOV.UK',
          previousUri: ':documentNumber/add-processing-plant-address',
          nextUri: ':documentNumber/add-health-certificate',
          progressUri: '/create-processing-statement/:documentNumber/progress',
          changeAddressUri: ':documentNumber/what-processing-plant-address',
          journey: 'processing statement',
          saveAsDraftUri: 'processing-statements'
        },
        match:{
          params: {documentNumber}
        },
        processingStatement: undefined,
        history: {
          ...history,
          location: {
            pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
          }
        },
        clear: mockClearErrors,
        t: jest.fn(),
        saveToRedis: mockSaveToRedis,
        save: jest.fn()
      };

      await new AddProcessingPlantAddress.WrappedComponent({...props}).onChange({
        target:{
          name: 'consignmentDescription'
        }
      });

      await new AddProcessingPlantAddress.WrappedComponent({...props}).goBack({
        preventDefault: jest.fn()
      });

      expect(props.save).toHaveBeenCalled();
    });

    it('should clear while calling componentWillUnmount', async () => {
      const documentNumber = 'document123';
      const props = {
        route: {
          path: ':documentNumber/add-processing-plant-address',
          title: 'Create a UK processing statement - GOV.UK',
          previousUri: ':documentNumber/add-processing-plant-address',
          nextUri: ':documentNumber/add-health-certificate',
          progressUri: '/create-processing-statement/:documentNumber/progress',
          changeAddressUri: ':documentNumber/what-processing-plant-address',
          journey: 'processing statement',
          saveAsDraftUri: 'processing-statements'
        },
        match:{
          params: {documentNumber}
        },
        processingStatement: undefined,
        history: {
          ...history,
          location: {
            pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
          }
        },
        clear: mockClearErrors,
        clearErrorsForPlantAddress: jest.fn(),
        t: jest.fn(),
        saveToRedis: mockSaveToRedis,
        save: jest.fn()
      };
      await new AddProcessingPlantAddress.WrappedComponent({...props}).componentWillUnmount();

      expect(props.clearErrorsForPlantAddress).toHaveBeenCalled();
    });

    it('should match snapshots', () => {
      const { container } = tlcRender(wrapper);
      expect(container).toMatchSnapshot();
    });
  });

  describe('when there is no plant address', () => {

    const rendered = render(component);

    it('will have a message that a address must be added', () => {
      const address = wrapper.find('#plant-address').html();

      expect(address).toContain('An address must be added for this processing plant.');
    });

    it('will have a add address link', () => {
      const plantAddressLink = rendered.find('#plant-address-link').html();

      expect(plantAddressLink).toBe('Add the processing plant address');
    });

    it('will handle clicking to add an address', () => {
      wrapper.find('#address-link-wrapper').find('Link').simulate('click');

      expect(store.getActions()).toContainEqual({type: CHANGE_PLANT_ADDRESS});
    });

  });

  describe('when there is a plant address', () => {

    const plantAddress = {
      plantAddressOne: 'address one',
      plantAddressTwo: 'address two',
      plantTownCity: 'town city',
      plantPostcode: 'postcode'
    };

    const store = mockStore({
      ...storeData,
      processingStatement: {
        ...storeData.processingStatement,
        ...plantAddress
      },
    });

    const component =
      <Provider store={store}>
        <MemoryRouter>
          <AddProcessingPlantAddress {...props} />
        </MemoryRouter>
      </Provider>;

    const rendered = render(component);

    beforeEach(() => {
      wrapper = mount(component);
    });

    it('will display the users address', () => {
      const address = rendered.find('#plant-address').html();

      expect(address).toContain(plantAddress.plantAddressOne);
      expect(address).toContain(plantAddress.plantTownCity);
      expect(address).toContain(plantAddress.plantPostcode);
    });

    it('will have a change address link', () => {
      const plantAddressLink = rendered.find('#plant-address-link').html();

      expect(plantAddressLink).toContain('Change');
      expect(plantAddressLink).toContain('processing plant address');
    });

    it('will handle clicking to add an address', () => {
      wrapper.find('#address-link-wrapper').find('Link').simulate('click');

      expect(store.getActions()).toContainEqual({type: CHANGE_PLANT_ADDRESS});
    });

    it('should render a notification banner if _plantDetailsUpdated is true', () => {
      expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
      expect(wrapper.find('NotificationBanner').prop('header')).toBe('Important');
      expect(wrapper.find('NotificationBanner').prop('messages')).toEqual(['Due to improvements in the way addresses are managed, the processing plant address in this document must be re-entered.']);
    });

  });

  describe('if changeAddress is undefined', () => {

    it('will load the processing statement data', () => {
      expect(mockGet).toHaveBeenCalledWith('/processingStatement', expect.anything());
    });

  });

  describe('if changeAddress is true', () => {

    const mockGet = jest.fn();

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: mockGet
      }
    })]);

    const storeWithChangeAddress = mockStore({
      ...storeData,
      processingStatement: {
        ...storeData.processingStatement,
        changeAddress: true
      },

    });

    mount(
      <Provider store={storeWithChangeAddress}>
        <MemoryRouter>
          <AddProcessingPlantAddress {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('will not load the processing statement data', () => {
      expect(mockGet).not.toHaveBeenCalled();
    });

  });

  describe('when required data is missing', () => {

    const mockGet = jest.fn();

    mockGet.mockResolvedValue({data: {}});

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: mockGet
      }
    })]);

    it('should redirect to the previous page', async () => {
      const documentNumber = 'document123';
      const history = createMemoryHistory({
        initialEntries: [
          `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
        ],
      });
      const mockPush = jest.spyOn(history, 'push');
      mockPush.mockReturnValue(null);

      const store = mockStore({
        processingStatement: {
          catches: [],
          consignmentDescription: 'consignment'
        },
        global: {
          allFish: []
        },
        t: jest.fn()
      });

      let wrapper;

      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <Route path="/create-processing-statement/:documentNumber/add-processing-plant-address">
                <AddProcessingPlantAddress
                  route={{
                    previousUri:
                      '/create-processing-statement/:documentNumber/previous-uri',
                    path: 'path',
                    progressUri: '/create-processing-statement/:documentNumber/progress',
                    nextUri: 'nextUri',
                    changeAddressUri: 'changeAddressUri'
                  }}
                />
              </Route>
            </Router>
          </Provider>
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('#Add Proccessing Plant Address Translations',() =>{

    const plantAddress = {
      plantAddressOne: 'address one',
      plantAddressTwo: 'address two',
      plantTownCity: 'town city',
      plantPostcode: 'postcode'
    };

    const store = mockStore({
      ...storeData,
      processingStatement: {
        ...storeData.processingStatement,
        ...plantAddress
      },
    });

    const component =
      <Provider store={store}>
        <MemoryRouter>
          <AddProcessingPlantAddress {...props} />
        </MemoryRouter>
      </Provider>;

    const rendered = render(component);


  it('should use translator for notification banner if _plantDetailsUpdated is true', () => {
    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
  });
  });
});

describe('Proccessing plant address errors', () => {
  const mockGet = jest.fn();
  mockGet.mockResolvedValue({data: {}});

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: mockGet
    }
  })]);

  it('Should show error section if condition met', async() => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          plantAddressOne: 'Enter the address',
          plantName: 'Enter the plant name'
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
      },
      global: {
        allFish: []
      },
      t: jest.fn()
    });

    const props = {
      history:{
        ...history,
        location:{
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
        }
      },
      clear: jest.fn(),
      t: jest.fn(),
    };

    let wrapper;

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-processing-plant-address">
              <AddProcessingPlantAddress
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  path: 'path',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  nextUri: 'nextUri',
                  changeAddressUri: 'changeAddressUri'
                }}
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(wrapper.find('ErrorIsland')).toBeDefined();
  });

  it('when processingStatement is undefined', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      global: {
        allFish: []
      },
      t: jest.fn()
    });

    const props = {
      history:{
        ...history,
        location:{
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
        }
      },
      clear: jest.fn(),
      t: jest.fn(),
    };

    let wrapper;

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-processing-plant-address">
              <AddProcessingPlantAddress
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  path: 'path',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  nextUri: 'nextUri',
                  changeAddressUri: 'changeAddressUri'
                }}
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(wrapper).toBeDefined();
  });
});

describe('Proccessing plant address errors while saving to redis', () => {
  const mockGet = jest.fn();
  mockGet.mockResolvedValue({data: {}});
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');

  beforeEach(() => {
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });

    mockScrollToErrorIsland.mockReturnValue(null);
  });

  afterEach(() => {
    mockScrollToErrorIsland.mockReset();
  });

  it('Should show error section if condition met while saving to redis', async() => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    mockSaveToRedis.mockReturnValue({
      errors: {
        consignmentDescription: 'Enter a description and commodity code',
      },
    });

    const props = {
      route: {
        path: ':documentNumber/add-processing-plant-address',
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: ':documentNumber/add-processing-plant-address',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        nextUri: ':documentNumber/add-health-certificate',
        changeAddressUri: ':documentNumber/what-processing-plant-address',
        journey: 'processing statement',
        saveAsDraftUri: 'processing-statements'
      },
      match:{
        params: {documentNumber}
      },
      processingStatement: undefined,
      history: {
        ...history,
        location: {
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
        }
      },
      t: jest.fn(),
      save: jest.fn(),
      clearChangePlantAddress: jest.fn(),
      saveToRedis: mockSaveToRedis
    };

    await new AddProcessingPlantAddress.WrappedComponent({...props}).save();

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement || {},
      currentUrl: ':documentNumber/add-processing-plant-address',
      saveAsDraft: false,
      documentNumber: documentNumber
    });

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });

  it('Should show error section if condition met while calling onSaveAsDraft', async() => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    mockSaveToRedis.mockReturnValue({
      errors: {
        consignmentDescription: 'Enter a description and commodity code',
      },
    });

    const props = {
      route: {
        path: ':documentNumber/add-processing-plant-address',
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: ':documentNumber/add-processing-plant-address',
        nextUri: ':documentNumber/add-health-certificate',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        changeAddressUri: ':documentNumber/what-processing-plant-address',
        journey: 'processing statement',
        saveAsDraftUri: 'processing-statements'
      },
      match:{
        params: {documentNumber}
      },
      processingStatement: undefined,
      history: {
        ...history,
        location: {
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
        }
      },
      t: jest.fn(),
      save: jest.fn(),
      clear: jest.fn(),
      clearChangePlantAddress: jest.fn(),
      saveToRedis: mockSaveToRedis
    };

    await new AddProcessingPlantAddress.WrappedComponent({...props}).onSaveAsDraft({
      preventDefault: jest.fn()
    });

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement || {},
      currentUrl: ':documentNumber/add-processing-plant-address',
      saveAsDraft: false,
      documentNumber: documentNumber
    });
  });
});

describe('Proccessing plant address errors after translation', () => {
  const documentNumber = 'document123';
  const mockGet = jest.fn();
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: mockGet
    }
  })]);

  mockGet.mockResolvedValue({data: {}});
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');

  beforeEach(() => {
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });

    mockScrollToErrorIsland.mockReturnValue(null);
  });

  afterEach(() => {
    mockScrollToErrorIsland.mockReset();
  });

  const renderComponent = async (errors) => {
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const _store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant-address`,
        errors
      },
      global: {
        allFish: []
      },
      t: jest.fn()
    });

    const props = {
      route: {
        path: ':documentNumber/add-processing-plant-address',
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: ':documentNumber/add-processing-plant-address',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        nextUri: ':documentNumber/add-health-certificate',
        changeAddressUri: ':documentNumber/what-processing-plant-address',
        journey: 'processing statement',
        saveAsDraftUri: 'processing-statements'
      },
      match:{
        params: {documentNumber}
      },
      history: {
        ...history,
        location: {
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-address`
        }
      },
      t: jest.fn(),
      save: jest.fn(),
      clear: jest.fn(),
      clearChangePlantAddress: jest.fn(),
      saveToRedis: mockSaveToRedis
    };

    const wrapper = mount(
      <Provider store={_store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-processing-plant-address">
            <AddProcessingPlantAddress
              route={{
                previousUri:
                  '/create-processing-statement/:documentNumber/previous-uri',
                progressUri: '/create-processing-statement/:documentNumber/progress',
                path: 'path',
                nextUri: 'nextUri',
                changeAddressUri: 'changeAddressUri'
              }}
              {...props}
            />
          </Route>
        </Router>
      </Provider>
    );

    await act(async () => { await wrapper});
    return wrapper;
  }

  it('should show error while submitting empty form', async() => {
    const errors = {
      plantName: "psAddProcessingPlantAddressErrorNullPlantName"
    };
    const wrapper = await renderComponent(errors);
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Enter the plant name');
  });

  it('should show error by waf rule', async() => {
    const errors = {
      plantName: "psAddProcessingPlantAddressErrorFormatPlantName"
    };
    const wrapper = await renderComponent(errors);
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe(`Plant name must only contain letters, numbers, apostrophes (' or ’), full stops, hyphens, commas, forward slashes, back slashes, ampersands, and spaces`);
  });

  it('should show error on maximum value limit', async() => {
    const errors = {
      plantName: "psAddProcessingPlantAddressErrorMaxLimitPlantName"
    };
    const wrapper = await renderComponent(errors);
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Plant name must not exceed 54 characters');
  });
});



