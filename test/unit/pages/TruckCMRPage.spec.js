import {  mount } from 'enzyme';
import * as React from 'react';
import {component as TruckCMRPage} from '../../../src/client/pages/common/transport/TruckCMRPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import { render } from '@testing-library/react';


jest.mock('../../../src/client/actions/landingsType.actions');

describe('TruckCMRPage', () => {

  let wrapper;
  const mockPush = jest.fn();

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({crm: 'true'});
        });
      }}
  })]);

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    const store = mockStore({ errors: {}, transport: {}, getTransportDetails: {}, saveTruckCMR: {}});

    const props = {
      history : [],
      route   : {
        path : ':documentNumber/transportSelection',
        title       : 'Create a UK catch certificate for exports',
        previousUri : ':documentNumber/transportSelection',
        nextUri     : ':documentNumber/summary',
        saveAsDraftUri: ':documentNumber/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate' ,
        summaryUri : ':documentNumber/check-your-information',
        truckDetailsUri : ':documentNumber/add-transportation-details-truck',
        progressUri: 'documentNumber/progress'
      }
    };

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TruckCMRPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render "yes" multi-choice option', () => {
    expect(wrapper.find('input#separateCmrTrue').exists()).toBeTruthy();
  });

  it('should render "no" multi-choice option', () => {
    expect(wrapper.find('input#separateCmrFalse').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label#label-separateCmrTrue').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label#label-separateCmrTrue').props()['htmlFor']).toBe('separateCmrTrue');
    expect(wrapper.find('label#label-separateCmrFalse').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label#label-separateCmrFalse').props()['htmlFor']).toBe('separateCmrFalse');
  });

  it('should handle submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
  });

  it('should handle on change events setting CMR to true', () => {
    wrapper.find('input[name="cmr"][id="separateCmrTrue"]').simulate('change', {target: {name: 'cmr',  value: 'true'}});
  });

  it('should handle on change events setting CMR to false', () => {
    wrapper.find('input[name="cmr"][id="separateCmrFalse"]').simulate('change', {target: {name: 'cmr',  value: 'false'}});
  });

  it('should handle save as draft event', () => {
    wrapper.find('button#saveAsDraft').simulate('click');
  });

  it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="separateCmrTrue"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="separateCmrFalse"]').exists()).toBeTruthy();
  });

  it('renders Back to Your Progress link with the correct href property', () => {
    expect(wrapper.find('BackToProgressLink')).toBeDefined();
    expect(wrapper.find('BackToProgressLink').find('a').props().href).toBe('/documentNumber/progress');
  });

  it('should take a snapshot of whole page', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should re-direct to forbidden page when unauthorised', async () => {
    const props = {
      history : {
        push: mockPush
      },
      route   : {
        path : ':documentNumber/transportSelection',
        title       : 'Create a UK catch certificate for exports',
        previousUri : ':documentNumber/transportSelection',
        nextUri     : ':documentNumber/summary',
        saveAsDraftUri: ':documentNumber/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate' ,
        summaryUri : ':documentNumber/check-your-information',
        truckDetailsUri : ':documentNumber/add-transportation-details-truck',
        progressUri: 'documentNumber/progress'
      },
      transport: {
        unauthorised: true
      }
    };

    await new TruckCMRPage.WrappedComponent(props).componentDidUpdate(props);
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });
});

describe('TruckCMRPage - with errors', () => {

  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({ crm: 'true' });
        });
      }
    }
  })]);

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    const store = mockStore({
      errors: {
        cmrError: 'Select yes if you have a road transport document to go with this export',
        errors: [{ targetName: 'cmr', text: 'Select yes if you have a road transport document to go with this export'}]
      },
      transport: {},
      getTransportDetails: {},
      saveTruckCMR: {}
    });

    const props = {
      history: [],
      route: {
        path: ':documentNumber/transportSelection',
        title: 'Create a UK catch certificate for exports',
        previousUri: ':documentNumber/transportSelection',
        nextUri: ':documentNumber/summary',
        saveAsDraftUri: ':documentNumber/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        summaryUri: ':documentNumber/check-your-information',
        truckDetailsUri: ':documentNumber/add-transportation-details-truck',
        progressUri: 'documentNumber/progress'
      }
    };

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TruckCMRPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render error attributes', () => {
    expect(wrapper.find('ErrorText span').text()).toBe('Select yes if you have a road transport document to go with this export');
  });

  it('should render error summary link with the correct text', () => {
    expect(wrapper.find('ul.error-summary-list li a').text()).toBe('Select yes if you have a road transport document to go with this export');
  });

});

describe('TruckCMRPage - when export is a directLanding', () => {

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const history = createMemoryHistory();
  const mockPush = jest.spyOn(history, 'push');

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });

    const store = mockStore({
      errors: {},
      transport: {
        vehicle:'truck'
      },
      getTransportDetails: {},
      landingsType: {
        generatedByContent: false,
        landingsEntryOption: 'directLanding'
      }
    });
    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      }
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <TruckCMRPage {...props}/>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockRestore();
  });

  it('should redirect to exporter dashboard page', () => {
    expect(mockPush).toHaveBeenCalledWith('/create-catch-certificate/catch-certificates');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('TruckCMRPage - when catch cert has no landing type', () => {

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const documentNumber = 'GBR-23423-4234234';
  const history = createMemoryHistory({ initialEntries: [`${documentNumber}/do-you-have-a-road-transport-document`] });
  const mockPush = jest.spyOn(history, 'push');

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: ':documentNumber/progress'
    }
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });

    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'truck'
      },
      getTransportDetails: {}
    });
    window.scrollTo = jest.fn();

    mount(
      <Provider store={store}>
        <Router history={history}>
          <Route exact path=":documentNumber/do-you-have-a-road-transport-document">
            <TruckCMRPage {...props}/>
          </Route>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should redirect to the landing entry page', () => {
    const { landingsEntryUri } = props.route;
    const expectedUrl = landingsEntryUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('TruckCMRPage - when on the storage document journey', () => {
  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const history = createMemoryHistory();
  const mockPush = jest.spyOn(history, 'push');

  beforeEach(() => {
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });

    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'truck'
      },
      getTransportDetails: {},
      landingsType: {
        generatedByContent: false,
        landingsEntryOption: 'directLanding'
      }
    });
    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'storageNotes',
        progressUri: 'documentNumber/progress'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <TruckCMRPage {...props}/>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should not call getLandingType', () => {
    expect(getLandingType).not.toHaveBeenCalled();
  });

  it('should not redirect', () => {
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renders Back to Your Progress link with the correct href property', () => {
    expect(wrapper.find('BackToProgressLink')).toBeDefined();
    expect(wrapper.find('BackToProgressLink').find('a').props().href).toBe('/documentNumber/progress');
  });
});

describe('TruckCMRPage - when tranport details is incomplete', () => {

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const documentNumber = 'GBR-23423-4234234';
  const history = createMemoryHistory({ initialEntries: [`${documentNumber}/do-you-have-a-road-transport-document`] });
  const mockPush = jest.spyOn(history, 'push');

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: '/create-catch-certificate/:documentNumber/progress'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    }
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {},
      getAddedLandingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: true
      }
    });
    window.scrollTo = jest.fn();

    mount(
      <Provider store={store}>
        <Router history={history}>
          <Route exact path=":documentNumber/do-you-have-a-road-transport-document">
            <TruckCMRPage {...props}/>
          </Route>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should redirect to the progress page', () => {
    const expectedUrl = props.route.progressUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});
