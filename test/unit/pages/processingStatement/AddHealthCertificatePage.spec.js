import * as React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getProcessingStatementFromRedis, clearProcessingStatement } from '../../../../src/client/actions';
import { component as AddHealthCertificate } from '../../../../src/client/pages/processingStatement/addHealthCertificatePage';
import AddHealthCertificatePageWrapper from '../../../../src/client/pages/processingStatement/addHealthCertificatePage';
import * as clientAction from '../../../../src/client/actions/index.js';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../../src/client/actions');

describe('Add health certificate page', () => {
  const mockStore = configureStore([thunk]);

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  it('should redirect to the previous page when required data is missing', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-health-certificate`,
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
      clear: jest.fn
    });

    await act(async () => {
      await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-health-certificate">
              <AddHealthCertificate
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  path: 'path',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  nextUri: 'nextUri'
                }}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should call saveToRedis on save', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-health-certificate`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');

    const props = {
      saveToRedis: mockSaveToRedis,
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          healthCertificateDate: "psAddHealthCertificateErrorRealDateHealthCertificateDate",
          healthCertificateNumber: "psAddHealthCertificateErrorFormatHealthCertificateNumber"
        }
      }
    };


    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          healthCertificateDate: "psAddHealthCertificateErrorRealDateHealthCertificateDate",
          healthCertificateNumber: "psAddHealthCertificateErrorFormatHealthCertificateNumber"
        }
      }
    });

    const wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-health-certificate">
              <AddHealthCertificate
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  path: 'path',
                  nextUri: 'nextUri',
                }}
                props = {props}
              />
            </Route>
          </Router>
        </Provider>
      );

    const continueBtn = wrapper.find('#continue');
    await continueBtn.at(0).simulate('click', {preventDefault: () => {}});

    expect(mockSaveToRedis).toHaveBeenCalled();
    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement || {},
      currentUrl: '/create-processing-statement/document123/add-health-certificate',
      saveAsDraft: false,
      documentNumber: documentNumber,
      saveToRedisIfErrors: true
    });
  });

  it('should clear errors when component unmounts', () => {
    const mockDispatchClearErrors = jest.fn();

    new AddHealthCertificate.WrappedComponent({
      clear: mockDispatchClearErrors,
    }).componentWillUnmount();

    expect(mockDispatchClearErrors).toHaveBeenCalled();
  });

  it('should redirect to forbidden page when there is unauthorised access', () => {
    const mockPush = jest.fn();

    new AddHealthCertificate.WrappedComponent({
      match: {
        params: {
          documentNumber: 'doc1234',
        },
      },
      route: {
        previousUri: '/create-processing-statement/:documentNumber/previous-uri'
      },
      processingStatement: {
        unauthorised: true,
      },
      history: {
        push: mockPush,
      },
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('will call all methods needed to load the component', async () => {
    const store = {
      dispatch: () => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    };

    await new AddHealthCertificatePageWrapper.loadData(store, 'processingStatement');

    expect(getProcessingStatementFromRedis).toHaveBeenCalled();
  });
});

describe('#Add health certificate page after translation', () => {
  const mockStore = configureStore([thunk]);
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-health-certificate`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const getComponentWrapper = (store={}, props={}) => {
    const defaultStore = {
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        unauthorised: true,
        errors: {
          healthCertificateDate: "psAddHealthCertificateErrorHealthCertificateDate",
          healthCertificateNumber: "psAddHealthCertificateErrorFormatHealthCertificateNumber"
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-health-certificate`
      },
      global: {
        allFish: []
      },
      history: {
        location: {
          pathname: `/create-processing-statement/${documentNumber}/add-health-certificate`
        }
      },
      clear: jest.fn(),
      ...store
    };

    const _store = mockStore(defaultStore);

    const _props = {
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        errors: {
          healthCertificateDate: "psAddHealthCertificateErrorRealDateHealthCertificateDate",
          healthCertificateNumber: "psAddHealthCertificateErrorFormatHealthCertificateNumber"
        }
      },
      match:{
        params: {
          documentNumber
        }
      },
      route: {
        previousUri:
          '/create-processing-statement/:documentNumber/previous-uri',
        path: 'path',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        nextUri: 'nextUri'
      },
      history: {
        push: jest.fn
      },
      saveToRedis: mockSaveToRedis,
      ...props
    }

    return mount(
      <Provider store={_store}>
        <Router history={history}>
            <AddHealthCertificate
              route={{
                previousUri:
                  '/create-processing-statement/:documentNumber/previous-uri',
                path: 'path',
                progressUri: '/create-processing-statement/:documentNumber/progress',
                nextUri: 'nextUri'
              }}
              {..._props}
            />
        </Router>
      </Provider>
    );
  }

  it('will call the the on submit for component', () => {
    const wrapper = getComponentWrapper();
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(formEl.exists()).toBeTruthy();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call isUnauthorised if unauthorised is true', () => {
    const wrapper = getComponentWrapper();
    expect(wrapper.find('AddHealthCertificate')).toBeDefined();
    expect(mockPush).toHaveBeenCalled();
  });

  it('should be scroll to errorIsLand with empty form submission', () => {
    const wrapper = getComponentWrapper();
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Enter the Export Health Certificate date');
    expect(wrapper.find('ul.error-summary-list li a').at(1).text()).toBe('Enter Export Health Certificate number in the correct format');
  });

  it('should be scroll to errorIsLand with other errors', () => {
    const store = {
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment',
        unauthorised: true,
        errors: {
          healthCertificateDate: "psAddHealthCertificateErrorHealthCertificateDate",
          healthCertificateNumber: "psAddHealthCertificateErrorFormatHealthCertificateNumber"
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-health-certificate`,
        healthCertificateDate: new Date((new Date()).getTime() + (10 * 86400000)).toLocaleDateString()
      }
    };
    const wrapper = getComponentWrapper(store);
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(formEl.exists()).toBeTruthy();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(wrapper.find('ul.error-summary-list li a').at(1).text()).toBe('Enter Export Health Certificate number in the correct format');
  });
});

describe('Snapshot of Add health certificate page', () => {
  const mockStore = configureStore([thunk]);

  clearProcessingStatement.mockReturnValue({
    type: 'CLEAR_PROCESSING_STATEMENT'
  });

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  it('should match the snapshot', () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-health-certificate`,
      ],
    });

    const store = mockStore({
      processingStatement: {
        catches: [],
        consignmentDescription: 'consignment'
      },
      global: {
        allFish: []
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-health-certificate">
            <AddHealthCertificate
              route={{
                previousUri:
                  '/create-processing-statement/:documentNumber/previous-uri',
                path: 'path',
                progressUri: '/create-processing-statement/:documentNumber/progress',
                nextUri: 'nextUri'
              }}
            />
          </Route>
        </Router>
      </Provider>
    );

    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});