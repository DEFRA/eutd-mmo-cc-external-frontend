import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import * as Utils from '../../../../../src/client/pages/utils/errorUtils';

import { component as LandingsTypeConfirmationPage } from '../../../../../src/client/pages/exportCertificates/landings/LandingsTypeConfirmationPage';
import landingsTypeConfirmationPage from '../../../../../src/client/pages/exportCertificates/landings/LandingsTypeConfirmationPage';
import { dispatchClearErrors } from '../../../../../src/client/actions';
import { confirmChangeLandingsType, clearLandingsType, onLoadComponentRedirect, clearChangedLandingsType } from '../../../../../src/client/actions/landingsType.actions';
import { render } from '@testing-library/react';
jest.mock('../../../../../src/client/actions');
jest.mock('../../../../../src/client/actions/export-payload.actions');
jest.mock('../../../../../src/client/actions/landingsType.actions');

describe('Landings Type Confirmation Page', () => {
  let wrapper;

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

  const store = mockStore({
    errors: {},
    landingsType: { landingsEntryOption: 'manualEntry' },
    changedLandingsType: 'directLanding',
    t: jest.fn()
  });

  const props = {
    route: {
      path: '/catch-certificates/landings-type-confirmation',
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/catch-certificates/landings-entry',
      nextUri: '/catch-certificates/what-are-you-exporting',
      dashboardUri: 'catch-certificates',
      uploadFileUri: '/catch-certificates/upload-file',
      journey: 'catchCertificate',
      journeyText: 'catch certificate',
    },
  };

  const documentNumber = 'document123';
  const mockPreventDefault = jest.fn();
  const history = createMemoryHistory({
    initialEntries: [`/catch-certificates/${documentNumber}/landings-type-confirmation`],
    initialIndex: 0
  });
  const mockPush = jest.spyOn(history, 'push');

  wrapper = mount(
    <Provider store={store}>
      <Router history={history} >
        <Route path="/catch-certificates/:documentNumber/landings-type-confirmation">
          <LandingsTypeConfirmationPage {...props} />
        </Route>
      </Router>
    </Provider>
  );

  beforeEach(() => {
    mockPush.mockReset();
    mockPreventDefault.mockReturnValue(null);
    confirmChangeLandingsType.mockReturnValue({ type: 'EXPORT_PAYLOAD_LOADED' });
    clearLandingsType.mockReturnValue({type:'CLEAR_LANDINGS_TYPE'});
    onLoadComponentRedirect.mockReturnValue({ type: 'LANDINGS_TYPE_CHANGE_UNAUTHORISED' });
    dispatchClearErrors.mockReturnValue({ type: 'DISPATCH_CLEAR_ERRORS' });
    clearChangedLandingsType.mockReturnValue({type: 'clear_changed_landings_type'});
  });

  afterEach(() => {
    confirmChangeLandingsType.mockRestore();
    clearLandingsType.mockRestore();
    dispatchClearErrors.mockRestore();
    clearChangedLandingsType.mockRestore();
    mockPreventDefault.mockRestore();
  });

  it('should mount successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should contain a title', () => {
    expect(wrapper.find('PageTitle').props().title).toBe('Are you sure you want to change your landings type? - Create a UK catch certificate - GOV.UK');
  });

  it('should contain a back link', () => {
    expect(wrapper.find('BackLink').exists()).toBeTruthy();
    expect(wrapper.find('BackLink').props().href).toContain('/catch-certificates/landings-entry');
  });

  it('should contain a back link that clears any errors and goes to the previous screen', () => {
    const backUri = props.route.previousUri.replace(':documentNumber', documentNumber);

    act(() => {
      wrapper.find('BackLink').prop('onClick')({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(backUri);
  });

  it('should contain warning', () => {
    expect(wrapper.find('WarningText').props().className).toContain('warning-message');
    expect(wrapper.find('WarningText').text()).toContain('Switching between direct and non-direct landings types will require the re-entry of landings data.');
  });

  it('should contain radio options', () => {
    expect(wrapper.find('input#landingsTypeYes').exists()).toBeTruthy();
    expect(wrapper.find('label#label-landingsTypeYes span').text()).toBe('Yes, I want to change my landings type');

    expect(wrapper.find('input#landingsTypeNo').exists()).toBeTruthy();
    expect(wrapper.find('label#label-landingsTypeNo span').text()).toBe('No, I want to keep my current landings type');
  });

  it('should set state when Yes option selected', () => {
    act(() => {
      wrapper.find('input#landingsTypeYes').prop('onChange')({ preventDefault: () => { }, target: { value: 'Yes' } });
    });

    expect(wrapper.find('LandingsTypesConfirmationPage').state().confirmLandingsType).toBe('Yes');
  });

  it('should set state when No option selected', () => {
    act(() => {
      wrapper.find('input#landingsTypeNo').prop('onChange')({ preventDefault: () => { }, target: { value: 'No' } });
    });

    expect(wrapper.find('LandingsTypesConfirmationPage').state().confirmLandingsType).toBe('No');
  });

  it('should contain buttons', () => {
    expect(wrapper.find('button#cancel').exists()).toBeTruthy();
    expect(wrapper.find('button#continue').exists()).toBeTruthy();
  });

  it('should contain a cancel button that clears any errors and goes to the previous screen', () => {
    const backUri = props.route.previousUri.replace(':documentNumber', documentNumber);

    act(() => {
      wrapper.find('button#cancel').prop('onClick')({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(backUri);
  });

  it('should contain a continue button that goes to the add products page', () => {
    wrapper.find('LandingsTypesConfirmationPage').setState({ confirmLandingsType: 'Yes' });

    act(() => {
      wrapper.find('Form').prop('onSubmit')({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(confirmChangeLandingsType).toHaveBeenCalled();
    expect(confirmChangeLandingsType).toHaveBeenCalledWith(
      {
        'landingsEntryConfirmation': 'Yes',
        'landingsEntryOption': 'directLanding'
      },
      props.route.journey,
      props.route.path,
      documentNumber
    );
  });

  it('should contain a continue button that goes to the upload file page', () => {
    const store = mockStore({
      errors: {},
      landingsType: { landingsEntryOption: null },
      changedLandingsType: 'uploadEntry'
    });

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/catch-certificates/:documentNumber/landings-type-confirmation']} initialIndex={0} >
          <LandingsTypeConfirmationPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('LandingsTypesConfirmationPage').setState({ confirmLandingsType: 'Yes' });

    act(() => {
      wrapper.find('Form').prop('onSubmit')({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(confirmChangeLandingsType).toHaveBeenCalled();
    expect(confirmChangeLandingsType).toHaveBeenCalledWith({ 'landingsEntryConfirmation': 'Yes', 'landingsEntryOption': 'uploadEntry' }, 'catchCertificate', '/catch-certificates/landings-type-confirmation', undefined);
  });

  it('should contain a help link', () => {
    expect(wrapper.find('HelpLink').exists()).toBeTruthy();
    expect(wrapper.find('HelpLink').props().journey).toBe('catchCertificate');
  });

  it('Should redirect the user to the forbidden page when there is unauthorised access to the page', () => {
    const mockPush = jest.fn();

    new LandingsTypeConfirmationPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      history: {
        push: mockPush
      },
      route: {
        path: '/catch-certificates/:documentNumber/landings-type-confirmation',
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/landings-options',
        addLandingsUri: '/catch-certificates/:documentNumber/add-landings',
        directLandingUri: '/catch-certificates/:documentNumber/direct-landing',
        journey: 'catchCertificate',
        journeyText: 'catch certificate',
      },
      landingsType: { unauthorised: true }
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('Should not redirect the user to the forbidden page when there is authorised access to the page', () => {
    const mockPush = jest.fn();

    new LandingsTypeConfirmationPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      history: {
        push: mockPush
      },
      route: {
        path: '/catch-certificates/:documentNumber/landings-type-confirmation',
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/landings-options',
        addLandingsUri: '/catch-certificates/:documentNumber/add-landings',
        directLandingUri: '/catch-certificates/:documentNumber/direct-landing',
        journey: 'catchCertificate',
        journeyText: 'catch certificate',
      },
      landingsType: { unauthorised: false }
    }).componentDidMount();

    expect(mockPush).not.toHaveBeenCalledWith('/forbidden');
  });

  it('should unmount and clear landings type', () => {
    wrapper.unmount();
    expect(clearLandingsType).toHaveBeenCalled();
    expect(clearChangedLandingsType).toHaveBeenCalled();
  });

});

describe('Snapshot describe',()=>{

  let wrapper;

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

  const store = mockStore({
    errors: {},
    landingsType: { landingsEntryOption: 'manualEntry' },
    changedLandingsType: 'directLanding',
    t: jest.fn()
  });

  const props = {
    route: {
      path: '/catch-certificates/landings-type-confirmation',
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/catch-certificates/landings-entry',
      nextUri: '/catch-certificates/what-are-you-exporting',
      dashboardUri: 'catch-certificates',
      uploadFileUri: '/catch-certificates/upload-file',
      journey: 'catchCertificate',
      journeyText: 'catch certificate',
    },
    t: jest.fn(),
    clearLandingsType: jest.fn()

  };

  const documentNumber = 'document123';
  const mockPreventDefault = jest.fn();
  const history = createMemoryHistory({
    initialEntries: [`/catch-certificates/${documentNumber}/landings-type-confirmation`],
    initialIndex: 0
  });
  const mockPush = jest.spyOn(history, 'push');

  wrapper = mount(
    <Provider store={store}>
      <Router history={history} >
        <Route path="/catch-certificates/:documentNumber/landings-type-confirmation">
          <LandingsTypeConfirmationPage {...props} />
        </Route>
      </Router>
    </Provider>
  );

  beforeEach(() => {
    mockPush.mockReset();
    mockPreventDefault.mockReturnValue(null);
    confirmChangeLandingsType.mockReturnValue({ type: 'EXPORT_PAYLOAD_LOADED' });
    clearLandingsType.mockReturnValue({type:'landingsType/landings_type/clear'});
    onLoadComponentRedirect.mockReturnValue({ type: 'LANDINGS_TYPE_CHANGE_UNAUTHORISED' });
    dispatchClearErrors.mockReturnValue({ type: 'DISPATCH_CLEAR_ERRORS' });
    clearChangedLandingsType.mockReturnValue({type: 'clear_changed_landings_type'});
  });

  
  it('should take a snapshot of the whole page', () => {
  const { container } = render(wrapper);
   expect(container).toMatchSnapshot();
  });
  
})

describe('Landings Type Confirmation Page with errors', () => {
  let wrapper;

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

  const store = mockStore({
    errors: {
      errors: [{
        text: 'We have an issue',
        targetName: 'confirmLandingsChange'
      }]
    },
    t: jest.fn()
  });

  const props = {
    route: {
      path: '/catch-certificates/:documentNumber/add-landings',
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/catch-certificates/:documentNumber/landings-options',
      addLandingsUri: '/catch-certificates/:documentNumber/add-landings',
      directLandingUri: '/catch-certificates/:documentNumber/direct-landing',
      journey: 'catchCertificate',
      journeyText: 'catch certificate',
    },
    t: jest.fn()
  };

  const mockPreventDefault = jest.fn();

  wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <LandingsTypeConfirmationPage {...props} />
      </MemoryRouter>
    </Provider>
  );

  let mockScrollToErrorIsland;

  beforeEach(() => {
    confirmChangeLandingsType.mockReturnValue({ type: 'EXPORT_PAYLOAD_LOADED' });
    mockScrollToErrorIsland = jest.spyOn(Utils, 'scrollToErrorIsland');
  });

  afterEach(() => {
    confirmChangeLandingsType.mockRestore();
    mockPreventDefault.mockRestore();
    mockScrollToErrorIsland.mockRestore();
  });

  it('should contain a title', () => {
    expect(wrapper.find('PageTitle').props().title).toBe('Error: Are you sure you want to change your landings type? - Create a UK catch certificate - GOV.UK');
  });

  it('should have an error island', () => {
    expect(wrapper.find('ErrorIsland').exists()).toBeTruthy();
    expect(wrapper.find('ErrorIsland').props().errors).toHaveLength(1);
  });

  it('should contain a continue button that goes to the next screen', () => {

    wrapper.find('LandingsTypesConfirmationPage').setState({ confirmLandingsType: 'Yes' });

    act(() => {
      wrapper.find('Form').prop('onSubmit')({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(confirmChangeLandingsType).toHaveBeenCalled();
  });

  it('should contain a continue button that goes to the next screen when confirmation is no', () => {

    wrapper.find('LandingsTypesConfirmationPage').setState({ confirmLandingsType: 'No' });

    act(() => {
      wrapper.find('Form').prop('onSubmit')({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(confirmChangeLandingsType).toHaveBeenCalled();
  });

  it('will call ScrollToErrorIsland if an error is thrown', () => {
    confirmChangeLandingsType.mockImplementation(() => {
      throw 'error';
    });

    act(() => {
      wrapper.find('Form').prop('onSubmit')({ preventDefault: mockPreventDefault });
    });

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });
});

describe('Landings Type loadData', () => {

  const store = {
    dispatch: jest.fn()
  };

  const queryParams = {
    error: '{"x":5,"y":6}'
  };


  it('will call all methods needed to load the component', () => {
    landingsTypeConfirmationPage.queryParams = {};

    landingsTypeConfirmationPage.loadData(store);

    expect(onLoadComponentRedirect).toHaveBeenCalled();
  });

  it('will call all methods needed to load the component when given query params', () => {
    landingsTypeConfirmationPage.queryParams = queryParams;

    landingsTypeConfirmationPage.loadData(store);

    expect(store.dispatch).toHaveBeenCalled();
  });

});


describe('landingsTypeConfirmationPage, Page guard', () => {

  it('Should redirect the exporter to dashboard when changedLandingsType is empty', () => {
    const mockPush = jest.fn();
    const props = {
      match: {
        params: {
          documentNumber: ''
        }
      },
      history: {
        push: mockPush
      },
      route: {
        path: '/catch-certificates/:documentNumber/landings-type-confirmation',
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/landings-entry',
        nextUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        dashboardUri: 'catch-certificates',
        uploadFileUri: '/catch-certificates/:documentNumber/upload-file',
        journey: 'catchCertificate',
        journeyText: 'catch certificate',
      },
      landingsType: { landingsEntryOption: null },
      changedLandingsType: '',
      t: jest.fn()
    };

    new LandingsTypeConfirmationPage.WrappedComponent(props).componentDidMount();

    expect(mockPush).toHaveBeenCalledWith('catch-certificates');
  });
});