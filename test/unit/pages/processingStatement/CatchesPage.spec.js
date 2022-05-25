import * as React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getProcessingStatementFromRedis, saveProcessingStatementToRedis, clearProcessingStatement } from '../../../../src/client/actions';
import catchesPage, { component as CatchesPage } from '../../../../src/client/pages/processingStatement/catchesPage';
import * as clientAction from '../../../../src/client/actions/index.js';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');

describe('Catches page', () => {
  const mockStore = configureStore([thunk]);

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  it('should redirect to the previous page when required data is missing', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/catch-added`,
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
      }
    });

    await act(async () => {
      await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/catch-added">
              <CatchesPage
                route={{
                  previousUri:
                    '/create-processing-statement/:documentNumber/previous-uri',
                  progressUri: '/create-processing-statement/:documentNumber/progress',
                  path: 'path',
                  nextUri: 'nextUri'
                }}
              />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(mockPush).toHaveBeenCalledWith(
      `/create-processing-statement/${documentNumber}/previous-uri`
    );
  });
});

describe('Test cases for Welsh/English Translation - Catches page', () => {
  const mockStore = configureStore([thunk]);

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/catch-added`,
    ],
  });
  const mockSaveToRedis = jest.spyOn(
    clientAction,
    'saveProcessingStatementToRedis'
  );
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);
  mockSaveToRedis.mockReturnValue({
    error: {
      consignmentDescription: 'consignment',
    },
  });

 const props = {
    t: jest.fn(),
    save: jest.fn(),
    route: {
      previousUri: '/create-processing-statement/:documentNumber/previous-uri',
      path: 'path',
      nextUri: '/create-processing-statement/document123/add-catch-details/1',
      progressUri: '/create-processing-statement/document123/progress',
    },
    match: {
      params: { documentNumber },
    },
    history: {
      ...history,
      location: {
        pathname: `/create-processing-statement/${documentNumber}/catch-added`,
      },
    },
    processingStatement: {
      catches: [
        {
          _id: '61d822940d8170ae2861d66f',
          species: "Mercer's tusked silverside (DTE)",
          catchCertificateNumber: '11',
          totalWeightLanded: '111',
          exportWeightBeforeProcessing: '11',
          exportWeightAfterProcessing: '11',
          id: '1111-1640790714',
          scientificName: 'Dentatherina merceri',
        },
      ],
      validationErrors: [{}],
      error: '',
      addAnotherCatch: 'Yes',
    },
  };

  it('should check the goback function', async () => {
    await new CatchesPage.WrappedComponent({ ...props }).goBack({
      preventDefault: jest.fn(),
    });
    expect(props.save).toHaveBeenCalled();
  });

  it('should check the onContinue function', async () => {
    mockPush.mockReset();
    props.save(props.route.nextUri);
    expect(props.save).toHaveBeenCalled();
    await new CatchesPage.WrappedComponent({ ...props }).onContinue({
      preventDefault: jest.fn(),
    });
    expect(mockPush).toHaveBeenCalledWith(props.route.nextUri);
  });

  it('should check the goback function', async () => {
    await new CatchesPage.WrappedComponent({ ...props }).hasRequiredData({
      preventDefault: jest.fn(),
    });
  });

  it('should redirect to forbidden page when unauthorised', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/catch-added`,
      ],
    });
    const mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    const store = mockStore({
      processingStatement: {
        catches: [],
        unauthorised: true,
      },
      t: jest.fn(),
    });

    const props = {
      t: jest.fn(),
    };
    mockPush.mockReset();

    await act(async () => {
      await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/create-processing-statement/:documentNumber/catch-added">
                <CatchesPage
                  route={{
                    previousUri:
                      '/create-processing-statement/:documentNumber/previous-uri',
                    progressUri: '/create-processing-statement/:documentNumber/progress',
                    path: 'path',
                    nextUri: 'nextUri',
                  }}
                  processingStatement={props.processingStatement}
                  {...props}
                />
            </Route>
          </Router>
        </Provider>
      );
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/create-processing-statement/document123/previous-uri'
    );
  });

  it('will call all methods needed to load the component', async () => {
    const store = {
      dispatch: () => {
        return new Promise((resolve) => {
          resolve();
        });
      },
    };

    await catchesPage.loadData(store, 'processingStatement');

    expect(getProcessingStatementFromRedis).toHaveBeenCalled();
  });
});

describe('#Catches page with translation', () => {
  const mockSaveToRedis = jest.spyOn(clientAction, 'saveProcessingStatementToRedis');
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);

  beforeEach(() => {
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });

    mockScrollToErrorIsland.mockReset();
    mockScrollToErrorIsland.mockImplementation(() => null);
  });

  afterEach(() => {
    saveProcessingStatementToRedis.mockReset();
  });

  it('should call on onContinue', async () => {
    const documentNumber = 'document123';
    const history = createMemoryHistory({
      initialEntries: [
        `/create-processing-statement/${documentNumber}/catch-added`,
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
        path: ':documentNumber/catch-added',
        nextUri: ':documentNumber/add-processing-plant-address',
        previousUri: ':documentNumber/add-catch-weights',
        progressUri: ':documentNumber/progress',
        journey: 'processingStatement',
        title: 'Create a UK processing statement - GOV.UK',
        saveAsDraftUri: 'processing-statements'
      },
      match:{
        params: {documentNumber}
      },
      processingStatement: {
        addAnotherCatch: 'No',
        catches:[{'_id':'61d722b886d120179e06cddd','species':'Abythites lepidogenys (AHD)','catchCertificateNumber':'1234','totalWeightLanded':'12','exportWeightBeforeProcessing':'12','exportWeightAfterProcessing':'10','id':'1234-1641471440','scientificName':'Abythites lepidogenys'}]
      },
      history: {
        ...history,
        location: {
          pathname: `/create-processing-statement/${documentNumber}/catch-added`
        }
      },
      t: jest.fn(),
      saveToRedis: mockSaveToRedis,
      save: jest.fn()
    };

    await new CatchesPage.WrappedComponent({...props}).onContinue({
      preventDefault: jest.fn()
    });

    await new CatchesPage.WrappedComponent({...props}).save(props.route.nextUri);

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });
});

describe('Snapshot - Catches page', () => {

  const mockStore = configureStore([thunk]);

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/catch-added`,
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
    }
  });

  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/create-processing-statement/:documentNumber/catch-added">
          <CatchesPage
            route={{
              previousUri:
                '/create-processing-statement/:documentNumber/previous-uri',
              progressUri: '/create-processing-statement/:documentNumber/progress',
              path: 'path',
              nextUri: 'nextUri',
            }}
          />
        </Route>
      </Router>
    </Provider>
  );

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('#Catches page with errors translation', () => {
  const mockStore = configureStore([thunk]);

  clearProcessingStatement.mockReturnValue({
    type: 'CLEAR_PROCESSING_STATEMENT'
  });

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
  });

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/catch-added`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  const props = {
    t: jest.fn(),
    save: jest.fn(),
    route: {
      previousUri: '/create-processing-statement/:documentNumber/previous-uri',
      path: 'path',
      nextUri: '/create-processing-statement/document123/add-catch-details/1',
      progressUri: '/create-processing-statement/document123/progress',
    },
    match: {
      params: { documentNumber },
    },
    history: {
      ...history,
      location: {
        pathname: `/create-processing-statement/${documentNumber}/catch-added`,
      },
    },
    processingStatement: {
      catches: [
        {
          _id: '61d822940d8170ae2861d66f',
          species: "Mercer's tusked silverside (DTE)",
          catchCertificateNumber: '11',
          totalWeightLanded: '111',
          exportWeightBeforeProcessing: '11',
          exportWeightAfterProcessing: '11',
          id: '1111-1640790714',
          scientificName: 'Dentatherina merceri',
        },
      ],
      validationErrors: [{}],
      error: '',
      addAnotherCatch: 'Yes',
    },
  };

  const store = mockStore({
    processingStatement: {
      catches: [],
      consignmentDescription: 'consignment',
      errors: {
        addAnotherCatch: "psCatchAddedErrorAddAnotherCatch"
      },
      errorsUrl: `/create-processing-statement/${documentNumber}/catch-added`,
      addAnotherCatch: ''
    },
    global: {
      allFish: []
    }
  });

  const wrapper = mount(<Provider store={store}>
      <Router history={history}>
        <Route path="/create-processing-statement/:documentNumber/catch-added">
          <CatchesPage {...props}/>
      </Route>
    </Router>
  </Provider>);

  it('should be scroll to errorIsLand on form submission', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);
    expect(wrapper.find('ul.error-summary-list li a').at(0).text()).toBe('Select yes if you need to add another catch');
  });
});
