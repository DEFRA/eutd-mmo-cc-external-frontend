import * as React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AddProcessingPlantDetailsWrapper from '../../../../src/client/pages/processingStatement/addProcessingPlantDetails';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import * as clientAction from '../../../../src/client/actions/index.js';
import { getProcessingStatementFromRedis, clearProcessingStatement } from '../../../../src/client/actions';
import { component as AddProcessingPlantDetails } from '../../../../src/client/pages/processingStatement/addProcessingPlantDetails';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');


describe('Add processing plant details page', () => {
  const mockStore = configureStore([thunk]);
  const mockClearErrors = jest.fn();

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  clearProcessingStatement.mockReturnValue({
    type: 'CLEAR_PROCESSING_STATEMENT',
  });

  let wrapper;
  it('should redirect to the previous page when required data is missing', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment: 'psAddProcessingPlantDetailsErrorNullReponsiblePerson',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber'
        },
      },
      global: {
        allFish: []
      },
      t: jest.fn()
    });


    const props = {
      clear: mockClearErrors,
      t: jest.fn()
    };

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
              <AddProcessingPlantDetails
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
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should generate snapshot', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

});

describe('English/Welsh Translation test cases', () => {
  const mockStore = configureStore([thunk]);
  const mockClearErrors = jest.fn();
  const documentNumber = 'document123';
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');
  const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });

  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);
  let wrapper;
  beforeEach(() => {
    mockClearErrors.mockReset();
    mockScrollToErrorIsland.mockReset();
    mockScrollToErrorIsland.mockImplementation(() => null);

    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment: 'psAddProcessingPlantDetailsErrorNullReponsiblePerson',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber'
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant-details`
      },
      global: {
        allFish: []
      },
      t: jest.fn()
    });

  const props = {
    clear: mockClearErrors,
    t: jest.fn()
  };

  wrapper =  mount(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
          <AddProcessingPlantDetails
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

  it('when unauthorised is false', async () => {
    let  wrapper;
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        unauthorised: false
      }
    });

    wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
              <AddProcessingPlantDetails
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                }}
              />
          </Route>
        </Router>
      </Provider>
    );

    await act(async () => await wrapper);
    expect(wrapper).toBeDefined();
  });

  it('when processingStatement is undefined', async () => {
    let  wrapper;
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: undefined
    });

    wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
              <AddProcessingPlantDetails
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                }}
              />
          </Route>
        </Router>
      </Provider>
    );
    await act(async () => await wrapper);
    expect(wrapper).toBeDefined();
  });

  it('should be scroll to errorIsLand', async () => {
    const documentNumber = 'document123';
    let mockScrollToErrorIsland;
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });
    mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);
    mockSaveToRedis.mockReturnValue({
      errors: {
        personResponsibleForConsignment: 'psAddProcessingPlantDetailsErrorNullReponsiblePerson-50',
        plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber'
      },
    });

    const props = {
      route: {
        path: ':documentNumber/add-processing-plant-details',
        previousUri: ':documentNumber/catch-added',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        nextUri: ':documentNumber/add-processing-plant-address',
        journey:  'processingStatement',
        title: 'Create a UK processing statement - GOV.UK',
        saveAsDraftUri: 'processing-statements'
      },
      match:{
        params: {documentNumber}
      },
      processingStatement: undefined,
      history: {
        ...history,
        location: {
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant-details`
        }
      },
      clear: mockClearErrors,
      t: jest.fn(),
      saveToRedis: mockSaveToRedis
    };

    await new AddProcessingPlantDetails.WrappedComponent({...props}).save('documentNumber/add-processing-plant-address');

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement || {},
      currentUrl: ':documentNumber/add-processing-plant-details',
      saveAsDraft: false,
      documentNumber: documentNumber
    });

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });

  it('will call all methods needed to load the component', async () => {
    const store = {
      dispatch: () => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    };

    await AddProcessingPlantDetailsWrapper.loadData(store, 'processingStatement');
    expect(getProcessingStatementFromRedis).toHaveBeenCalled();
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


 it('should clear errors on component will unmount', () => {
  const mockDispatchClearErrors = jest.fn();

  new AddProcessingPlantDetails.WrappedComponent({
    match: {
      params: {
        documentNumber: ''
      }
    },
    unauthorised: true,
    clear: mockDispatchClearErrors
  }).componentWillUnmount();

  expect(mockDispatchClearErrors).toHaveBeenCalled();
});

it('should call on onChange/goBack when entering a description', async () => {
  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-processing-plant`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);
  mockSaveToRedis.mockReturnValue({
    errors: {
      personResponsibleForConsignment: 'psAddProcessingPlantDetailsErrorNullReponsiblePerson',
      plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber'
    },
  });

  const props = {
    route: {
      path: ':documentNumber/add-processing-plant-details',
      previousUri: ':documentNumber/catch-added',
      nextUri: ':documentNumber/add-processing-plant-address',
      journey:  'processingStatement',
      title: 'Create a UK processing statement - GOV.UK',
      saveAsDraftUri: 'processing-statements'
    },
    match:{
      params: {documentNumber}
    },
    processingStatement: undefined,
    history: {
      ...history,
      location: {
        pathname: `/create-processing-statement/${documentNumber}/add-processing-plant`
      }
    },
    clear: mockClearErrors,
    t: jest.fn(),
    saveToRedis: mockSaveToRedis,
    save: jest.fn()
  };

  await new AddProcessingPlantDetails.WrappedComponent({...props}).onChange({
    target:{
      name: 'consignmentDescription'
    }
  });

  await new AddProcessingPlantDetails.WrappedComponent({...props}).goBack({
    preventDefault: jest.fn()
  });

  expect(props.save).toHaveBeenCalled();
});

});

describe('Proccessing plant details errors', () => {
  const mockStore = configureStore([thunk]);
  const documentNumber = 'document123';
  let wrapper;

  it('Should show error section if condition met', async() => {
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });
    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment:
            'psAddProcessingPlantDetailsErrorNullReponsiblePerson',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber',
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant`,
      },
      global: {
        allFish: [],
      },
      t: jest.fn(),
    });

    const props = {
      history:{
        ...history,
        location:{
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant`
        }
      },
      clear: jest.fn(),
      t: jest.fn(),
    };

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
              <AddProcessingPlantDetails
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

    expect(wrapper.find('ErrorIsland')).toBeDefined();
  });

  it('Should check dynamic error if condition met', async() => {
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-processing-plant`,
      ],
    });
    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment:
            'psAddProcessingPDErrorPersonResponsibleForConsignmentLength-50',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber',
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant`,
      },
      global: {
        allFish: [],
      },
      t: jest.fn(),
      errorFormatForPersonResponsible: jest.fn()
    });

    const props = {
      history:{
        ...history,
        location:{
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant`
        }
      },
      clear: jest.fn(),
      t: jest.fn(),
    };

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
              <AddProcessingPlantDetails
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
    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Person responsible for this consignment must not exceed 50 characters');
  });
});

describe('Errors after translation', () => {
  const mockStore = configureStore([thunk]);
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-processing-plant`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const getComponentWrapper = (store={}, props={}) => {
    const defaultStore = {
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment: 'psAddProcessingPDErrorPersonResponsibleForConsignment',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber',
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant`,
        personResponsibleForConsignment: '',
        plantApprovalNumber: ''
      },
      global: {
        allFish: [],
      },
      t: jest.fn(),
      ...store
    };

    const _store = mockStore(defaultStore);

    const _props = {
      history:{
        ...history,
        location:{
          pathname: `/create-processing-statement/${documentNumber}/add-processing-plant`
        }
      },
      clear: jest.fn(),
      t: jest.fn(),
      ...props
    }

    return mount(
      <Provider store={_store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-processing-plant">
            <AddProcessingPlantDetails
              route={{
                previousUri:
                  '/create-processing-statement/:documentNumber/previous-uri',
                progressUri: '/create-processing-statement/:documentNumber/progress',
                path: 'path',
                nextUri: 'nextUri'
              }}
              {..._props}
            />
          </Route>
        </Router>
      </Provider>
    );
  }

  it('should be scroll to errorIsLand with empty form submission', () => {
    const wrapper = getComponentWrapper();
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Enter the name of the person responsible for this consignment');
    expect(wrapper.find('ul.error-summary-list li a').at(1).text()).toBe('Enter the plant approval number');
  });

  it('should be scroll to errorIsLand with false value submission', () => {
    const store = {
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment: 'psAddProcessingPDErrorResponsibleValidation',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber',
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant`,
        personResponsibleForConsignment: '<!2##$!>'
      },
    };
    const wrapper = getComponentWrapper(store);
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Person responsible must only contain letters, hyphens, spaces, and single quotes');
  });
  it('should be scroll to errorIsLand with dynamic error', () => {
    const store = {
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          personResponsibleForConsignment: 'psAddProcessingPDErrorPersonResponsibleForConsignmentLength-50',
          plantApprovalNumber: 'psAddProcessingPDErrorPlantApprovalNumber',
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-processing-plant`,
        personResponsibleForConsignment: '<!2##$!>'
      },
    };
    const wrapper = getComponentWrapper(store);
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);
    expect(wrapper.find('AddProcessingPlantDetails').instance().errorFormatForPersonResponsible(store.processingStatement.errors['personResponsibleForConsignment'])).toBe('Person responsible for this consignment must not exceed 50 characters');
  });

});