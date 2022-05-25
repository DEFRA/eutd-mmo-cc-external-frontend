import * as React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getProcessingStatementFromRedis } from '../../../../src/client/actions';
import { component as AddCatchWeightsPage } from '../../../../src/client/pages/processingStatement/addCatchWeightsPage';
import AddCatchWeightsPageWrapper from '../../../../src/client/pages/processingStatement/addCatchWeightsPage';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');

describe('Add catch weights page', () => {
  const mockStore = configureStore([thunk]);

  const documentNumber = 'document123';
  const history = createMemoryHistory({
    initialEntries: [
      `/create-processing-statement/${documentNumber}/add-catch-weights/0`,
    ],
  });
  const mockPush = jest.spyOn(history, 'push');
  mockPush.mockReturnValue(null);

  getProcessingStatementFromRedis.mockReturnValue({
    type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
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
        <Route path="/create-processing-statement/:documentNumber/add-catch-weights/:catchIndex">
          <AddCatchWeightsPage
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

  it('should render the AddcatchWeightsPage component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should redirect to the previous page when required data is missing', () => {
    expect(mockPush).toHaveBeenCalledWith(
      `/create-processing-statement/${documentNumber}/previous-uri`
    );
  });
});

describe('#Add catch weights page page rerouting to and from the forbidden page', () => {  

  it('will call all methods needed to load the component', async () => {
    const store = {
      dispatch: () => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    };
    getProcessingStatementFromRedis.mockReturnValue({
      type: 'GET_PROCESSING_STATEMENT_FROM_REDIS',
    });

    await new AddCatchWeightsPageWrapper.loadData(store, 'processingStatement');

    expect(getProcessingStatementFromRedis).toHaveBeenCalled();
  });

  it('should clear the state while calling componentWillUnmount', async () => {
    const documentNumber = 'document123';
    const mockClearProcessingStatement = jest.fn();
    
    await new AddCatchWeightsPage.WrappedComponent({
      clear: mockClearProcessingStatement,
      match: {
        params: {
          documentNumber,
          catchIndex: 0,
        },
      },
      processingStatement: {
        catches: [
          {
            _id: '61d722b886d120179e06cddd',
            species: 'Abythites lepidogenys (AHD)',
            catchCertificateNumber: '654321',
            totalWeightLanded: '12',
            exportWeightBeforeProcessing: '12',
            exportWeightAfterProcessing: '10',
            id: '1234-1641471440',
            scientificName: 'Abythites lepidogenys',
          },
        ],
      }
    }).componentWillUnmount();

    expect(mockClearProcessingStatement).toHaveBeenCalled();
  });

  it('should redirect to forbidden page when there is unauthorised access', async () => {
    const mockPush = jest.fn();
    const mockClearProcessingStatement = jest.fn();
    const documentNumber = 'document123';
    const props = {
      match: {
        params: {
          documentNumber,
          catchIndex: 0,
        },
      },
      clear: mockClearProcessingStatement,
      processingStatement: {
        catches: [],
        unauthorised: true
      },
      history: {
        push: mockPush,
      },
      global: {
        allFish: []
      }
    };

    await new AddCatchWeightsPage.WrappedComponent(props).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should redirect to the previous page when there is no catchDetails while calling componentDidMount', async () => {
    const documentNumber = 'document123';
    const mockClearProcessingStatement = jest.fn();
    const mockPush = jest.fn();
    const mockGetFromRedis = jest.fn();
    
    await new AddCatchWeightsPage.WrappedComponent({
      clear: mockClearProcessingStatement,
      getFromRedis: mockGetFromRedis,
      match: {
        params: {
          documentNumber,
          catchIndex: 0,
        },
      },
      route:{
        previousUri:
          '/create-processing-statement/:documentNumber/add-catch-details',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        path: 'path',
        nextUri: 'nextUri'
      },
      history: {
        push: mockPush,
      },
      processingStatement: {
        catches: []
      }
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalledWith('/create-processing-statement/document123/add-catch-details');
  });
});
