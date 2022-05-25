import * as React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getProcessingStatementFromRedis, saveProcessingStatementToRedis, clearProcessingStatement} from '../../../../src/client/actions';
import { component as ConsignmentPage } from '../../../../src/client/pages/processingStatement/consignmentPage';
import ConsignmentPageWrapper from '../../../../src/client/pages/processingStatement/consignmentPage';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import * as clientAction from '../../../../src/client/actions/index.js';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');

describe('Consignment page', () => {
  const mockStore = configureStore([thunk]);
  const mockClearErrors = jest.fn();
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');
  const mockClearProcessingStatement = jest.spyOn(clientAction, 'clearProcessingStatement')
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);

  beforeEach(() => {
    mockClearErrors.mockReset();
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });
    mockClearProcessingStatement.mockReturnValue({ type: 'CLEAR_PROCESSING_STATEMENT '});

    mockScrollToErrorIsland.mockReset();
    mockScrollToErrorIsland.mockImplementation(() => null);
  });

  afterEach(() => {
    saveProcessingStatementToRedis.mockReset();
  });

  it('should redirect to forbidden page when unauthorised', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        unauthorised: true,
      },
      t: jest.fn(),
    });

    const props = {
      t: jest.fn()
    };

    await act(async () => {
      await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-consignment">
              <ConsignmentPage
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                    progressUri: '/create-processing-statement/:documentNumber/progress',
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

  it('should take a snapshot of the whole page', async () => {
    let  wrapper;
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        unauthorised: true,
        errors: null,
        errorsUrl: `/create-processing-statement/${documentNumber}/add-consignment`
      },
      clear: mockClearErrors
    });

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-consignment">
              <ConsignmentPage
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

    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('when unauthorised is false', async () => {
    let  wrapper;
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
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
          <Route path="/create-processing-statement/:documentNumber/add-consignment">
              <ConsignmentPage
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
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);
    mockSaveToRedis.mockReturnValue({
      errors: {
        consignmentDescription: 'Enter a description and commodity code',
      },
    });
    const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    const props = {
      route: {
        path: ':documentNumber/add-consignment-details',
        nextUri: ':documentNumber/add-catch-details',
        previousUri: ':documentNumber/add-exporter-details',
        progressUri: ':documentNumber/progress',
        journey: 'processingStatement',
        title: 'Create a UK processing statement - GOV.UK',
        saveAsDraftUri: 'processing-statements'
      },
      match:{
        params: {documentNumber}
      },
      processingStatement: {
        unauthorised: false,
        errors: {
          consignmentDescription: 'Enter a description and commodity code'
        },
        errorsUrl: `/create-processing-statement/${documentNumber}/add-consignment`
      },
      history: {
        ...history,
        location: {
          pathname: `/create-processing-statement/${documentNumber}/add-consignment`
        }
      },
      clear: mockClearErrors,
      t: jest.fn(),
      saveToRedis: mockSaveToRedis
    };

    await new ConsignmentPage.WrappedComponent({...props}).save('documentNumber/add-catch-weight');

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: props.processingStatement || {},
      currentUrl: `/create-processing-statement/${documentNumber}/add-consignment-details`,
      saveToRedisIfErrors: true,
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

    await ConsignmentPageWrapper.loadData(store, 'processingStatement');

    expect(getProcessingStatementFromRedis).toHaveBeenCalled();
  });

  it('will call the the on submit for component', async() => {
    let  wrapper;
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        unauthorised: false,
      },
    });

    wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-consignment">
              <ConsignmentPage
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

    new ConsignmentPage.WrappedComponent({
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

  it('when processingStatement is undefined', async () => {
    let  wrapper;
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: undefined,
    });

    wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/create-processing-statement/:documentNumber/add-consignment">
              <ConsignmentPage
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

  it('should call on onChange/goBack when entering a description', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
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
        path: ':documentNumber/add-consignment-details',
        nextUri: ':documentNumber/add-catch-details',
        previousUri: ':documentNumber/add-exporter-details',
        progressUri: ':documentNumber/progress',
        journey: 'processingStatement',
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
          pathname: `/create-processing-statement/${documentNumber}/add-consignment`
        }
      },
      clear: mockClearErrors,
      t: jest.fn(),
      saveToRedis: mockSaveToRedis,
      save: jest.fn()
    };

    await new ConsignmentPage.WrappedComponent({...props}).onChange({
      target:{
        name: 'consignmentDescription'
      }
    });

    await new ConsignmentPage.WrappedComponent({...props}).goBack({
      preventDefault: jest.fn()
    });

    expect(props.save).toHaveBeenCalled();
  });
});

describe('#Consignment page with translation', () => {
  let wrapper;
  const documentNumber = 'document123';
  const mockStore = configureStore([thunk]);
  const mockClearErrors = jest.fn();
  let mockScrollToErrorIsland;
  let mockSaveToRedis;

  const processingStatement = {
    unauthorised: true,
    errors: {
      consignmentDescription: 'psConsignmentEnterConsignmentDescription'
    },
    errorsUrl: `/create-processing-statement/${documentNumber}/add-consignment`
  };

  const props = {
    route: {
      previousUri:
        '/create-processing-statement/:documentNumber/previous-uri',
      progressUri: '/create-processing-statement/:documentNumber/progress',
      saveAsDraftUri: ':documentNumber/add-catch-details',
      nextUri: ':documentNumber/add-catch-details'
    },
    t: jest.fn(),
    saveToRedis: mockSaveToRedis
  };

  beforeEach(() => {
    mockClearErrors.mockReset();
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });

    mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');

    clearProcessingStatement.mockReturnValue({ type:  'CLEAR_PROCESSING_STATEMENT' })
  });

  afterEach(() => {
    saveProcessingStatementToRedis.mockReset();
    mockScrollToErrorIsland.mockRestore();
    mockSaveToRedis.mockRestore();
  });

  const getConsignmentWrapper = async() => {
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/add-consignment`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement,
      t: jest.fn(),
    });

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/add-consignment">
              <ConsignmentPage
                {...props}
              />
            </Route>
          </Router>
        </Provider>
      );
    });
    return wrapper
  }

  it('should translate to welsh', async () => {
    await getConsignmentWrapper();
    wrapper.find('button#continue').simulate('click');
    mockSaveToRedis.mockReturnValue({
      errors: {
        consignmentDescription: 'psConsignmentEnterConsignmentDescription',
      },
    });

    expect(mockSaveToRedis).toHaveBeenCalledWith({
      data: processingStatement || {},
      currentUrl: `/create-processing-statement/${documentNumber}/add-consignment-details`,
      saveToRedisIfErrors: true,
      saveAsDraft: true,
      documentNumber: documentNumber
    });

    expect(wrapper.find('ErrorIsland h2.error-summary-heading').text()).toEqual('There is a problem');
    expect(wrapper.find('ErrorIsland ul.error-summary-list li').at(0).text()).toEqual('Enter a description and commodity code');
    expect(wrapper.find('TextArea span').at(2).text()).toBe('Enter a description and commodity code');
  });
});
