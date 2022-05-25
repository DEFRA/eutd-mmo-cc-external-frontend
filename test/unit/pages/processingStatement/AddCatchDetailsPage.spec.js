import * as React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getAllFish, getProcessingStatementFromRedis } from '../../../../src/client/actions';
import { component as AddCatchDetailsPage } from '../../../../src/client/pages/processingStatement/addCatchDetailsPage';
import AddCatchDetailsPageWrapper from '../../../../src/client/pages/processingStatement/addCatchDetailsPage';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import * as clientAction from '../../../../src/client/actions/index.js';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');

describe('Add catch details page', () => {
  const mockStore = configureStore([thunk]);
  const mockClearProcessingStatement = jest.spyOn(clientAction, 'clearProcessingStatement');
  mockClearProcessingStatement.mockReturnValue({ type: 'CLEAR_PROCESSING_STATEMENT '});

  getAllFish.mockReturnValue({
    type: 'GET_ALL_FISH',
  });

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-catch-details/0`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const store = mockStore({
    processingStatement: {
      catches: [],
      unauthorised: true,
      consignmentDescription: 'consignment'
    },
    global: {
      allFish: []
    }
  });

  const props = {
    clear: jest.fn()
  };

  let wrapper;


  it('should redirect to forbidden page when unauthorised', async () => {

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-catch-details/:catchIndex">
              <AddCatchDetailsPage
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  path: 'path',
                  nextUri: 'nextUri'
                }}
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/forbidden'
    );
  });

  it('should take a snapshot of the whole page', async()=> {
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-catch-details/:catchIndex">
              <AddCatchDetailsPage
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  path: 'path',
                  nextUri: 'nextUri'
                }}
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('#Add catch details page with translation', () => {
  const mockStore = configureStore([thunk]);

  getAllFish.mockReturnValue({
    type: 'GET_ALL_FISH',
  });

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  it('should call a set species', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-catch-details/0`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        catches: [],
        unauthorised: true,
        consignmentDescription: 'consignment'
      },
      global: {
        allFish: []
      }
    });

    const props = {
      clear: jest.fn()
    };

    let wrapper;

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-catch-details/:catchIndex">
              <AddCatchDetailsPage
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  path: 'path',
                  nextUri: 'nextUri'
                }}
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    const SpeciesAutocomplete = wrapper.find('SpeciesAutocomplete');
    const mockOnChange = jest.spyOn(SpeciesAutocomplete.props(),'onChange');
    wrapper.setState({
      speciesCode: 'COD',
      scientificName: 'latin-name',
    });

    const params = {
      faoCode: 'COD',
      scientificName: 'latin-name'
    };

    await act(() => SpeciesAutocomplete.props().onChange('COD', params));

    expect(SpeciesAutocomplete).toBeDefined();
    expect(mockOnChange).toHaveBeenCalledWith('COD', params);
  });

  it('will call all methods needed to load the component', async () => {
    const store = {
      dispatch: () => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    };

    await new AddCatchDetailsPageWrapper.loadData(store, 'processingStatement');

    expect(getProcessingStatementFromRedis).toHaveBeenCalled();
  });

  it('should clear while calling componentWillUnmount', async () => {
    const documentNumber = 'document123';
    const props = {
      clear: jest.fn(),
      match: {
        params: {
          documentNumber,
          catchIndex: 0
        },
      },
      processingStatement:{
        catches:[{'_id':'61d722b886d120179e06cddd','species':'Abythites lepidogenys (AHD)','catchCertificateNumber':'1234','totalWeightLanded':'12','exportWeightBeforeProcessing':'12','exportWeightAfterProcessing':'10','id':'1234-1641471440','scientificName':'Abythites lepidogenys'}]
      }
    };
    await new AddCatchDetailsPage.WrappedComponent({...props}).componentWillUnmount();

    expect(props.clear).toHaveBeenCalled();
  });

  it('should redirect to forbidden page when unauthorised', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-catch-details/0`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        catches: [undefined]
      },
      global: {
        allFish: []
      }
    });

    const props = {
      clear: jest.fn()
    };

    let wrapper;

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-catch-details/:catchIndex">
              <AddCatchDetailsPage
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  path: 'path',
                  nextUri: 'nextUri'
                }}
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(mockPush).toHaveBeenCalled();
  });
});

describe('#Add catch details page with translation for some event handler', () => {
  let wrapper;
  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-catch-details/0`,
    ],
  });
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const props = {
    route: {
      title: 'Create a UK processing statement - GOV.UK',
      previousUri: ':documentNumber/add-consignment-details',
      path: ':documentNumber/add-catch-details',
      nextUri: ':documentNumber/add-catch-weights',
      progressUri: ':documentNumber/progress',
      journey: 'processingStatement',
      saveAsDraftUri: 'processing-statements',
      firstCatch: true,
    },
    clear: jest.fn(),
    getFromRedis: jest.fn(),
    getAllFish: jest.fn(),
    saveToRedis: jest.fn(),
    match: {
      params: {
        documentNumber,
        catchIndex: 0,
      },
    },
    processingStatement: {
      catches: [{}],
      unauthorised: false,
      errors: {
        'catches-0-catchCertificateNumber': 'Enter the catch certificate number',
      }
    },
  };

  const mockStore = configureStore([thunk]);

  const store = mockStore({
    processingStatement: {
      catches: [{}],
      unauthorised: false,
      errors: {
        'catches-0-catchCertificateNumber': 'Enter the catch certificate number',
      }
    },
    global: {
      allFish: [],
    },
  });
  const mockSaveToRedis = jest.spyOn(
    clientAction,
    'saveProcessingStatementToRedis'
  );

  const getWrapper = async() => {
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-catch-details/:catchIndex">
              <AddCatchDetailsPage
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    return wrapper;
  };

  it('will handle on continue event', async() => {
    const wrapper = await getWrapper();

    expect(wrapper).toBeDefined();
    expect(wrapper.find('button#continue').exists()).toBe(true);

    wrapper.find('button#continue').simulate('click');

    mockSaveToRedis.mockReturnValue({});

    mockScrollToErrorIsland.mockReset();
    mockScrollToErrorIsland.mockImplementation(() => null);

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement,
      currentUrl: props.route.path,
      saveToRedisIfErrors: false,
      documentNumber: documentNumber,
    });
  });
});

describe('#Add catch details page for lang keys', () => {
  const mockStore = configureStore([thunk]);

  getAllFish.mockReturnValue({
    type: 'GET_ALL_FISH',
  });

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-catch-details/0`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const store = mockStore({
    processingStatement: {
      catches: [],
      unauthorised: true,
      consignmentDescription: 'consignment',
    },
    global: {
      allFish: [],
    },
  });

  const props = {
    clear: jest.fn(),
  };

  let wrapper;

  act(async () => {
    wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-catch-details/:catchIndex">
            <AddCatchDetailsPage
              route={{
                previousUri:
                  '/create-processing-statement/:documentNumber/previous-uri',
                progressUri: '/create-processing-statement/:documentNumber/progress',
                path: 'path',
                nextUri: 'nextUri',
              }}
              {...props}
            />
          </Route>
        </Router>
      </Provider>
    );
  });

  it('should render component', () => {
    expect(wrapper.find('AddCatchDetailsPage')).toBeDefined();
  });
});

describe('Test the English translation for error messages', () => {
  getAllFish.mockReturnValue({
    type: 'GET_ALL_FISH',
  });

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-catch-details/0`,
    ],
  });
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const props = {
    route: {
      title: 'Create a UK processing statement - GOV.UK',
      previousUri:
        '/create-processing-statement/:document123/add-consignment-details',
      path: '/create-processing-statement/document123/add-catch-details',
      progressUri: '/create-processing-statement/document123/progress',
      nextUri: '/create-processing-statement/document123/add-catch-weights',
      journey: 'processingStatement',
      saveAsDraftUri: 'processing-statements',
      firstCatch: true,
    },
    clear: jest.fn(),
    getFromRedis: jest.fn(),
    getAllFish: jest.fn(),
    saveToRedis: jest.fn(),
    match: {
      params: {
        documentNumber,
        catchIndex: 0,
      },
    },
    processingStatement: {
      catches: [{}],
      unauthorised: false,
      validationErrors: [{}],
      error: '',
      errors: {
        'catches-0-species':
          'psAddCatchDetailsErrorEnterTheFAOCodeOrSpeciesName',
        'catches-0-catchCertificateNumber':
          'psAddCatchDetailsErrorEnterTheCatchCertificateNumber',
      },
      errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
      addAnotherCatch: 'No',
      consignmentDescription: null,
      healthCertificateDate: null,
      healthCertificateNumber: null,
      personResponsibleForConsignment: null,
      plantApprovalNumber: null,
      plantName: null,
      plantAddressOne: null,
      plantBuildingName: null,
      plantBuildingNumber: null,
      plantSubBuildingName: null,
      plantStreetName: null,
      plantCounty: null,
      plantCountry: null,
      plantTownCity: null,
      plantPostcode: null,
      dateOfAcceptance: null,
      exportedTo: null,
      _plantDetailsUpdated: false,
    },
    errors: {
      'catches-0-species': 'psAddCatchDetailsErrorEnterTheFAOCodeOrSpeciesName',
      'catches-0-catchCertificateNumber':
        'psAddCatchDetailsErrorEnterTheCatchCertificateNumber',
    },
    errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
    history: {
      location: {
        pathname:
          '/create-processing-statement/document123/add-catch-details/0',
      },
    },
  };

  const mockStore = configureStore([thunk]);

  const store = mockStore({
    processingStatement: {
      catches: [{}],
      unauthorised: false,
      validationErrors: [{}],
      error: '',
      addAnotherCatch: 'No',
      consignmentDescription: null,
      healthCertificateDate: null,
      healthCertificateNumber: null,
      personResponsibleForConsignment: null,
      plantApprovalNumber: null,
      plantName: null,
      plantAddressOne: null,
      plantBuildingName: null,
      plantBuildingNumber: null,
      plantSubBuildingName: null,
      plantStreetName: null,
      plantCounty: null,
      plantCountry: null,
      plantTownCity: null,
      plantPostcode: null,
      dateOfAcceptance: null,
      exportedTo: null,
      _plantDetailsUpdated: false,
      errors: {
        'catches-0-species':
          'psAddCatchDetailsErrorEnterTheFAOCodeOrSpeciesName',
        'catches-0-catchCertificateNumber':
          'psAddCatchDetailsErrorEnterTheCatchCertificateNumber',
      },
      errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
    },
    global: {
      allFish: [],
    },
    errors: {
      'catches-0-species': 'psAddCatchDetailsErrorEnterTheFAOCodeOrSpeciesName',
      'catches-0-catchCertificateNumber':
        'psAddCatchDetailsErrorEnterTheCatchCertificateNumber',
    },
    errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
  });
  const mockSaveToRedis = jest.spyOn(
    clientAction,
    'saveProcessingStatementToRedis'
  );

  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/create-processing-statement/:documentNumber/add-catch-details">
          <AddCatchDetailsPage {...props} />
        </Route>
      </Router>
    </Provider>
  );

  it('should show English translation for error codes', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find('button#continue').exists()).toBe(true);

    wrapper.find('button#continue').simulate('click');

    mockSaveToRedis.mockResolvedValue({
      errors: {
        'catches-0-species':
          'psAddCatchDetailsErrorEnterTheFAOCodeOrSpeciesName',
        'catches-0-catchCertificateNumber':
          'psAddCatchDetailsErrorEnterTheCatchCertificateNumber',
      },
      errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
    });

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement,
      currentUrl: props.route.path,
      saveToRedisIfErrors: false,
      documentNumber: documentNumber,
    });

    expect(wrapper.find('#errorIsland ul li').at(0).find('a').text()).toBe(
      'Enter the FAO code or species name'
    );
    expect(wrapper.find('#errorIsland ul li').at(1).find('a').text()).toBe(
      'Enter the catch certificate number'
    );
  });

  it('should show English translation for error codes for special characters in CC Number', () => {
    const store = mockStore({
      processingStatement: {
        catches: [{}],
        unauthorised: false,
        validationErrors: [{}],
        error: '',
        addAnotherCatch: 'No',
        consignmentDescription: null,
        healthCertificateDate: null,
        healthCertificateNumber: null,
        personResponsibleForConsignment: null,
        plantApprovalNumber: null,
        plantName: null,
        plantAddressOne: null,
        plantBuildingName: null,
        plantBuildingNumber: null,
        plantSubBuildingName: null,
        plantStreetName: null,
        plantCounty: null,
        plantCountry: null,
        plantTownCity: null,
        plantPostcode: null,
        dateOfAcceptance: null,
        exportedTo: null,
        _plantDetailsUpdated: false,
        errors: {
          'catches-0-catchCertificateNumber':
            'psAddCatchDetailsErrorCCNumberMustOnlyContain',
        },
        errorsUrl:
          '/create-processing-statement/document123/add-catch-details/0',
      },
      global: {
        allFish: [],
      },
      errors: {
        'catches-0-catchCertificateNumber':
          'psAddCatchDetailsErrorCCNumberMustOnlyContain',
      },
      errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
    });

    const newProps = {
      ...props,
      processingStatement: {
        errors: {
          'catches-0-catchCertificateNumber':
            'psAddCatchDetailsErrorCCNumberMustOnlyContain',
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-catch-details">
            <AddCatchDetailsPage {...newProps} />
          </Route>
        </Router>
      </Provider>
    );

    wrapper.setState({
      errors: {
        'catches-0-catchCertificateNumber':
          'psAddCatchDetailsErrorCCNumberMustOnlyContain',
      },
    });

    expect(wrapper).toBeDefined();
    expect(wrapper.find('button#continue').exists()).toBe(true);

    wrapper.find('button#continue').simulate('click');

    mockSaveToRedis.mockResolvedValue({
      errors: {
        'catches-0-catchCertificateNumber':
          'psAddCatchDetailsErrorCCNumberMustOnlyContain',
      },
      errorsUrl: '/create-processing-statement/document123/add-catch-details/0',
    });

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement,
      currentUrl: props.route.path,
      saveToRedisIfErrors: false,
      documentNumber: documentNumber,
    });

    expect(wrapper.find('#errorIsland ul li').at(0).find('a').text()).toBe(
      'Catch certificate number must only contain letters, numbers, forward slashes, backslashes, spaces, hyphens, and full stops'
    );
  });
});