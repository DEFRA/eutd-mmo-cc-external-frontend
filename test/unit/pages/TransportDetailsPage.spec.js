import {  mount } from 'enzyme';
import * as React from 'react';
import {component as TransportDetailsPage} from '../../../src/client/pages/common/transport/TransportDetailsPage';
import transportDetailsPage from '../../../src/client/pages/common/transport/TransportDetailsPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { getTransportDetails, addTransportDetails, dispatchApiCallFailed, clearTransportDetails, saveTransportationDetails, dispatchClearErrors } from '../../../src/client/actions';
import * as ErrorUtils from '../../../src/client/pages/utils/errorUtils';

jest.mock('../../../src/client/actions/landingsType.actions');
jest.mock('../../../src/client/actions');

const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');

describe('Truck Details Page', () => {

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

  const mockPush = jest.fn();

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
    saveTransportationDetails.mockReturnValue({ type: 'SAVE_TRANSPORT_DETAILS' });
    clearTransportDetails.mockReturnValue({ type: 'CLEAR_TRANSPORT_DATA' });
    dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS' });

    const store = mockStore({errors: {}, transport: {}, getTransportDetails: {}});

    const props = {
      route: {
        path : ':documentNumber/add-transportation-details-truck',
        title: 'Create a UK catch certificate for exports',
        previousUri: ':documentNumber/transportSelection',
        nextUri: ':documentNumber/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificateJourney',
        progressUri: ':documentNumber/progress',
        transportType: 'truck'
      },
      match : {
        params : {
          documentNumber : 'my number'
        }
      },
      history: {
        push: mockPush,
      },
    };

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockScrollToErrorIsland.mockRestore();
  });

  it('should generate snapshot for the page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should render nationality of vehicle text input', () => {
    expect(wrapper.find('input#nationalityOfVehicle').exists()).toBeTruthy();
  });

  it('should render registration number text input', () => {
    expect(wrapper.find('input#registrationNumber').exists()).toBeTruthy();
  });

  it('should handle submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
  });

  it('should handle on change events', () => {
    wrapper.find('input[name="nationalityOfVehicle"]').simulate('change', {target: {name: 'nationalityOfVehicle',  value: 'British'}});
  });

  it('should handle on change date event', () => {
    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');
    dayField.simulate('change', {
      target: { name: 'exportDate', value: '02' },
    });
    monthField.simulate('change', {
      target: { name: 'exportDate', value: '10' },
    });
    yearField.simulate('change', {
      target: { name: 'exportDate', value: '2020' },
    });

    expect(addTransportDetails).toHaveBeenCalled();
  });

  it('should go to the dashboard when save as draft is clicked', () => {
    const saveAsDraftBtn = wrapper.find('SaveAsDraftButton');

    act(() => saveAsDraftBtn.prop('onClick')({ preventDefault() {} }));

    expect(mockPush).toHaveBeenCalled();
  });

  it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="nationalityOfVehicle"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="registrationNumber"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="departurePlace"]').exists()).toBeTruthy();
    expect(wrapper.find('#date-field-label-text').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('nationalityOfVehicle');

    expect(wrapper.find('label').at(1).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(1).props()['htmlFor']).toBe('registrationNumber');

    expect(wrapper.find('label').at(2).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(2).props()['htmlFor']).toBe('departurePlace');
  });

  it('Should render a Label text field with the correct className', ()=> {
    expect(wrapper.find('DateFieldWithPicker #date-field-label-text').at(3).text()).toEqual('Export date');
    expect(wrapper.find('#date-field-label-text').at(3).props().className).toContain('label-TruckDetailPage-form');
  });

  it('renders Back to Your Progress link with the correct href property', () => {
    expect(wrapper.find('BackToProgressLink').find('a')).toBeTruthy();
    expect(wrapper.find('BackToProgressLink').find('a').props().href).toBe('/my number/progress');
  });

  it('should not render error island when there are no errors', () => {
    expect(wrapper.find('#errorIsland').exists()).toBeFalsy();
  });

  it('should re-direct to forbidden page when unauthorised', async () => {
    const props = {
      history : {
        push: mockPush
      },
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'truck'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      transport: {
        unauthorised: true
      }
    };

    await new TransportDetailsPage.WrappedComponent(props).componentDidUpdate(props);
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should render error island when there are any errors', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'tempNationalityOfVehicle',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEditError: 'some error',
        tempNationalityOfVehicleError: null,
        tempRegistrationNumberError: null
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'truck'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
  });

  it('should render error island when there are any errors and assign error to relevant input values', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'tempNationalityOfVehicle',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEditError: 'some error',
        tempNationalityOfVehicleError: 'nationality of vehicle error',
        tempRegistrationNumberError: 'registration number error'
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'truck'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    expect(wrapper.find('input[value="nationality of vehicle error"]').exists()).toBeTruthy();
    expect(wrapper.find('input[value="registration number error"]').exists()).toBeTruthy();
  });

  it('should clear errors on component will unmount', () => {
    const mockDispatchClearErrors = jest.fn();
    const mockClearTransportDetails = jest.fn();

    new TransportDetailsPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      unauthorised: true,
      dispatchClearErrors: mockDispatchClearErrors,
      clearTransportDetails: mockClearTransportDetails
    }).componentWillUnmount();

    expect(mockDispatchClearErrors).toHaveBeenCalled();
  });
});

describe('Truck Details Page - when export is a directLanding', () => {

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

  const mockPush = jest.fn();

  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {},
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
        journey: 'catchCertificateJourney',
        progressUri: ':documentNumber/progress',
        transportType: 'truck'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      },
    };

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockRestore();
  });

  it('should redirect to progress page', () => {
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/progress');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('Truck Details Page - when catch cert has no landing type', () => {

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

  const mockPush = jest.fn();

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: ':documentNumber/progress',
      transportType: 'truck'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {}
    });
    window.scrollTo = jest.fn();

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should redirect to the landings entry page', () => {
    const { landingsEntryUri } = props.route;
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = landingsEntryUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('TruckDetailsPage - when on the storage document journey', () => {

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

  const mockPush = jest.fn();

  beforeEach(() => {
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});

    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'truck',
        cmr: 'false'
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
        progressUri: ':documentNumber/progress',
        transportType: 'truck'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      },
    };

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
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
});

describe('Truck Details Page - when required data is missing', () => {
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

  const mockPush = jest.fn();

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificateJourney',
      progressUri: '/create-catch-certificate/:documentNumber/progress',
      transportType: 'truck'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {},
      landingsType: {
        generatedByContent: false,
        landingsEntryOption: 'manualEntry'
      }
    });
    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should redirect to the progress if does not have required data', () => {
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = props.route.progressUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
  });

  it('should redirect to the progress if truck is not selected', () => {
    wrapper.instance().setState({transport: {vehicle: ''}});
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = props.route.progressUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
  });
});

describe('Plane Details Page', () => {

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


  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS'});
    saveTransportationDetails.mockReturnValue({ type: 'SAVE_TRANSPORT_DETAILS' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    const store = mockStore({ errors: {}, transport: {}, getTransportDetails: {} });

    const props = {
      history: [],
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificateJourney',
        progressUri: ':documentNumber/progress',
        transportType: 'plane'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      }
    };

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    getTransportDetails.mockReset();
    addTransportDetails.mockReset();
    saveTransportationDetails.mockReset();
    getLandingType.mockReset();
    clearTransportDetails.mockReset();
    dispatchApiCallFailed.mockReset();
  });

  it('should render flight number text input', () => {
    expect(wrapper.find('input#flightNumber').exists()).toBeTruthy();
  });

  it('should render container number text input', () => {
    expect(wrapper.find('input#containerNumber').exists()).toBeTruthy();
  });

  it('should handle submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    expect(saveTransportationDetails).toHaveBeenCalled();
  });

  it('should handle on change events', () => {
    wrapper.find('input[name="flightNumber"]').simulate('change', {target: {name: 'flightNumber',  value: '123456'}});
    expect(addTransportDetails).toHaveBeenCalled();
  });

  it('should handle on change date event', () => {
    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');
    dayField.simulate('change', {
      target: { name: 'exportDate', value: '02' },
    });
    monthField.simulate('change', {
      target: { name: 'exportDate', value: '10' },
    });
    yearField.simulate('change', {
      target: { name: 'exportDate', value: '2020' },
    });

    expect(addTransportDetails).toHaveBeenCalled();
    expect(addTransportDetails).toHaveBeenCalledTimes(3);
  });

  it('should handle save as draft event', () => {
    wrapper.find('button#saveAsDraft').simulate('click');

    expect(saveTransportationDetails).toHaveBeenCalled();
  });

  it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="flightNumber"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="containerNumber"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="departurePlace"]').exists()).toBeTruthy();
    expect(wrapper.find('#date-field-label-text').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('flightNumber');

    expect(wrapper.find('label').at(1).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(1).props()['htmlFor']).toBe('containerNumber');

    expect(wrapper.find('label').at(2).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(2).props()['htmlFor']).toBe('departurePlace');
  });

  it('Should render a Label text field with the correct className', ()=> {
    expect(wrapper.find('DateFieldWithPicker #date-field-label-text').at(3).text()).toEqual('Export date');
    expect(wrapper.find('#date-field-label-text').at(3).props().className).toContain('label-PlaneDetailPage-form');
  });

  it('should render error island when there are any errors', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'njEdit',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEditError: 'some nj edit error',
        tempFlightNumberError: null,
        tempContainerNumberError: null,
        tempDeparturePlaceError: null
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'plane'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
  });

  it('should render error island when there are any errors and assign error to relevant input values', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'njEdit',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEditError: 'some nj edit error',
        tempFlightNumberError: 'flight number error',
        tempContainerNumberError: 'container number error',
        tempDeparturePlaceError: 'departure place error'
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'plane'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    expect(wrapper.find('input[value="flight number error"]').exists()).toBeTruthy();
    expect(wrapper.find('input[value="container number error"]').exists()).toBeTruthy();
    expect(wrapper.find('input[value="departure place error"]').exists()).toBeTruthy();
  });
});

describe('Plane Details Page - when export is a directLanding', () => {
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

  const mockPush = jest.fn();

  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {},
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
        journey: 'catchCertificateJourney',
        progressUri:':documentNumber/progress',
        transportType: 'plane'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      },
    };
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockRestore();
  });
  it('should redirect to progress page', () => {
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/progress');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('Plane Details Page - when catch cert has no landing type', () => {
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
  const mockPush = jest.fn();
  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: ':documentNumber/progress',
      transportType: 'plane'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };
  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {},
    });
    window.scrollTo = jest.fn();
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });
  afterEach(() => {
    mockPush.mockRestore();
  });
  it('should redirect to the landing entry page', () => {
    const { landingsEntryUri } = props.route;
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = landingsEntryUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('Plane Details Page - when on the storage document journey', () => {
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
  const mockPush = jest.fn();
  const store = mockStore({
    errors: {},
    transport: {
      vehicle: 'plane'
    },
    getTransportDetails: {},
    landingsType: {
      generatedByContent: false,
      landingsEntryOption: 'directLanding'
    }
  });
  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'storageNotes',
      progressUri: ':documentNumber/progress',
      transportType: 'plane'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };
  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});

    window.scrollTo = jest.fn();

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
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
 
});

describe('Plane Details Page - when on the storage document journey1', () => {
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
  const mockPush = jest.fn();
  const store = mockStore({
    errors: {},
    transport: {
      vehicle: 'plane'
    },
    getTransportDetails: {},
    landingsType: {
      generatedByContent: false,
      landingsEntryOption: 'directLanding'
    }
  });
  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'storageNotes',
      progressUri: ':documentNumber/progress',
      transportType: 'plane'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };
  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should generate snapshot for the Plane Details page', () => {
    
    const { container } = render(wrapper);
    
    expect(container).toMatchSnapshot();
  });
});


describe('Plane Details Page - when required data is missing', () => {
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
  const mockPush = jest.fn();
  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'storageNotes',
      progressUri: '/create-catch-certificate/GBR-23423-4234234/progress',
      transportType: 'plane'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };
  beforeEach(() => {
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {},
      landingsType: {
        generatedByContent: false,
        landingsEntryOption: 'directLanding'
      }
    });
    window.scrollTo = jest.fn();
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should redirect to the progress if does not have required data', () => {
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = props.route.progressUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
  });
});

describe('Plane Details Page - loadData', () => {
  const store = {
    dispatch: () => {
      return new Promise((res) => {
        res();
      });
    }
  };

  beforeEach(() => {
    dispatchApiCallFailed.mockReturnValue({ type: 'DISPATCH_API_CALLED' });
    getTransportDetails.mockReturnValue({ type: 'SAVE' });
    getLandingType.mockReturnValue({ type: 'GET' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
  });

  afterEach(() => {
    dispatchApiCallFailed.mockReset();
    getTransportDetails.mockReset();
    getLandingType.mockReset();
    clearTransportDetails.mockReset();
    addTransportDetails.mockReset();
  });

  it('will call all methods needed to load the component', async () => {
    transportDetailsPage.queryParams = {};

    await transportDetailsPage.loadData(store, 'catchCertificate');

    expect(getTransportDetails).toHaveBeenCalled();
    expect(getLandingType).toHaveBeenCalled();
  });

  it('will call all methods needed to load the component when given query params', async () => {
    transportDetailsPage.queryParams = { error: '{"x":5,"y":6}' };

    await transportDetailsPage.loadData(store, 'catchCertificateJourney');

    expect(dispatchApiCallFailed).toHaveBeenCalled();
  });

  it('will call all methods needed to load the component within the storage document journey', async () => {
    transportDetailsPage.queryParams = {};

    await transportDetailsPage.loadData(store, 'storageNotes');

    expect(getTransportDetails).toHaveBeenCalled();
    expect(getLandingType).not.toHaveBeenCalled();
  });
});

describe('Train Details Page', () => {

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

    beforeEach(() => {
      getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
      getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
      addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS' });
      clearTransportDetails.mockReturnValue({ type: 'CLEAR_TRANSPORT_DATA' });

      const store = mockStore({ errors: {}, transport: {}, getTransportDetails: {}});
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
          progressUri: ':documentNumber/progress',
          transportType: 'train'
        },
        match : {
          params : {
            documentNumber: 'GBR-23423-4234234'
          }
        },
        history: {
          push: jest.fn()
        }
      };

      wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <TransportDetailsPage {...props}/>
            </MemoryRouter>
          </Provider>
      );
    });

    afterEach(() => {
      getLandingType.mockRestore();
    });

    it('should generate snapshot for the page', () => {
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();  
    });

    it('should render railway bill number text input', () => {
        expect(wrapper.find('Input#railwayBillNumber').exists()).toBeTruthy();
    });

    it('should handle submit event', () => {
      wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
    });

    it('should handle on change events', () => {
      wrapper.find('input[name="departurePlace"]').simulate('change', {target: {name: 'departurePlace',  value: 'North Shields'}});
    });

    it('should handle on change date event', () => {
      const dayField = wrapper.find('input[name="dayInputName"]');
      const monthField = wrapper.find('input[name="monthInputName"]');
      const yearField = wrapper.find('input[name="yearInputName"]');
      dayField.simulate('change', {
        target: { name: 'exportDate', value: '02' },
      });
      monthField.simulate('change', {
        target: { name: 'exportDate', value: '10' },
      });
      yearField.simulate('change', {
        target: { name: 'exportDate', value: '2020' },
      });
    });

    it('should handle save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should have an id on all inputs', () => {
      expect(wrapper.find('input[id="railwayBillNumber"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="departurePlace"]').exists()).toBeTruthy();
      expect(wrapper.find('#date-field-label-text').exists()).toBeTruthy();
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('railwayBillNumber');

      expect(wrapper.find('label').at(1).props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label').at(1).props()['htmlFor']).toBe('departurePlace');
    });

    it('Should render a Label text field with the correct className', ()=> {
      expect(wrapper.find('DateFieldWithPicker #date-field-label-text').at(3).text()).toEqual('Export date');
      expect(wrapper.find('#date-field-label-text').at(3).props().className).toContain('label-TrainDetailPage-form');
    });

    it('should call getLandingType', () => {
      expect(getLandingType).toHaveBeenCalled();
    });

    it('should render error island when there are any errors', () => {
      const store = mockStore({
        errors: {
          errors: [
            {
              targetName: 'vehicle',
              text: 'Select how the export leaves the UK',
            },
          ],
          njEditError: 'some njEditError',
          tempRailwayBillNumberError: null
        },
        transport: {},
        getTransportDetails: {},
      });
  
      const props = {
        route: {
          title: 'Create a UK catch certificate for exports',
          previousUri: '/transportSelection',
          nextUri: '/summary',
          showExportDate: true,
          saveAsDraftUri: '/create-catch-certificate/catch-certificates',
          landingsEntryUri: ':documentNumber/landings-entry',
          journey: 'catchCertificate',
          progressUri: ':documentNumber/progress',
          transportType: 'train'
        },
        match : {
          params : {
            documentNumber: 'GBR-23423-4234234'
          }
        },
        history: {
          push: jest.fn()
        }
      };
  
  
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <TransportDetailsPage {...props}/>
          </MemoryRouter>
        </Provider>
      );
  
      expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    });

    it('should render error island and assign error to relevant input values', () => {
      const store = mockStore({
        errors: {
          errors: [
            {
              targetName: 'vehicle',
              text: 'Select how the export leaves the UK',
            },
          ],
          njEditError: 'some njEditError',
          tempRailwayBillNumberError: 'railwaybill number error'
        },
        transport: {},
        getTransportDetails: {},
      });
  
      const props = {
        route: {
          title: 'Create a UK catch certificate for exports',
          previousUri: '/transportSelection',
          nextUri: '/summary',
          showExportDate: true,
          saveAsDraftUri: '/create-catch-certificate/catch-certificates',
          landingsEntryUri: ':documentNumber/landings-entry',
          journey: 'catchCertificate',
          progressUri: ':documentNumber/progress',
          transportType: 'train'
        },
        match : {
          params : {
            documentNumber: 'GBR-23423-4234234'
          }
        },
        history: {
          push: jest.fn()
        }
      };
  
  
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <TransportDetailsPage {...props}/>
          </MemoryRouter>
        </Provider>
      );
  
      expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
      expect(wrapper.find('input[value="railwaybill number error"]').exists()).toBeTruthy();
    });
});

describe('Train Details Page - when export is a directLanding', () => {

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

  const mockPush = jest.fn();

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    addTransportDetails.mockReturnValue({ type: 'ADD_TRANSPORT_DETAILS '});
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {},
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
        progressUri: ':documentNumber/progress',
        transportType: 'train'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      },
    };

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockRestore();
  });

  it('should redirect to progress page', () => {
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/progress');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('Train Details Page - when catch cert has no landing type', () => {

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

  const mockPush = jest.fn();

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: ':documentNumber/progress',
      transportType: 'train'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {},
    });
    window.scrollTo = jest.fn();

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockRestore();
  });

  it('should redirect to the landing entry page', () => {
    const { landingsEntryUri } = props.route;
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = landingsEntryUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('Train Details Page - when on the storage document journey', () => {

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

  const mockPush = jest.fn();

  beforeEach(() => {
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'train'
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
        progressUri: ':documentNumber/progress',
        transportType: 'train'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      },
    };

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
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
});

describe('Train Details Page - when required data is missing', () => {

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

  const mockPush = jest.fn();

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: '/create-catch-certificate/:documentNumber/progress',
      transportType: 'train'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });

    const store = mockStore({
      errors: {},
      transport: {},
      getTransportDetails: {},
      landingsType: {
        generatedByContent: false,
        landingsEntryOption: 'manualEntry'
      }
    });
    window.scrollTo = jest.fn();

    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });

  it('should redirect to exporter progress page', () => {
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = props.route.progressUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('ContainerVessel Details Page', () => {

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

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    const store = mockStore({errors: {}, transport: {}, getTransportDetails: {}});
    window.scrollTo = jest.fn();

    const props = {
      history: [],
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: ':documentNumber/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      }
    };
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render vessel name text input', () => {
    expect(wrapper.find('Input#vesselName').exists()).toBeTruthy();
  });

  it('should render flag state text input', () => {
    expect(wrapper.find('Input#flagState').exists()).toBeTruthy();
  });

   it('should render container number(s) text input', () => {
     expect(wrapper.find('Input#containerNumber').exists()).toBeTruthy();
   });

   it('should handle submit event', () => {
     wrapper.find('form').simulate(
       'submit',
       {preventDefault() {}}
     );
   });

   it('should handle on change events', () => {
     wrapper.find('input[name="vesselName"]').simulate('change', {target: {name: 'vesselName',  value: 'Jolly Roger'}});
   });

   it('should handle on change date event', () => {
    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');
    dayField.simulate('change', {
      target: { name: 'exportDate', value: '02' },
    });
    monthField.simulate('change', {
      target: { name: 'exportDate', value: '10' },
    });
    yearField.simulate('change', {
      target: { name: 'exportDate', value: '2020' },
    });
  });

   it('should handle save as draft event', () => {
     wrapper.find('button#saveAsDraft').simulate('click');
   });

   it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="vesselName"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="flagState"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="containerNumber"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="departurePlace"]').exists()).toBeTruthy();
    expect(wrapper.find('#date-field-label-text').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('vesselName');

    expect(wrapper.find('label').at(1).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(1).props()['htmlFor']).toBe('flagState');

    expect(wrapper.find('label').at(2).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(2).props()['htmlFor']).toBe('containerNumber');

    expect(wrapper.find('label').at(3).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(3).props()['htmlFor']).toBe('departurePlace');
  });

  it('Should render a Label text field with the correct className', ()=> {
    expect(wrapper.find('DateFieldWithPicker #date-field-label-text').at(3).text()).toEqual('Export date');
    expect(wrapper.find('#date-field-label-text').at(3).props().className).toContain('label-ContainerVesselDetailPage-form');
  });
  it('should take a snapshot of whole page', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should render error island when there are any errors', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'vehicle',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEdit: 'nj edit',
        njEditError: 'some nj error',
        tempVesselNameError: null,
        tempFlagStateError: null
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
  });

  it('renders error island when there are any errors', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'vehicle',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEdit: 'nj edit'
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
  });

  it('should render error island when there are any errors and assign error to relevant input values', () => {
    const store = mockStore({
      errors: {
        errors: [
          {
            targetName: 'vehicle',
            text: 'Select how the export leaves the UK',
          },
        ],
        njEditError: 'some nj error',
        tempVesselNameError: 'vessel name error',
        tempFlagStateError: 'flagstate error'
      },
      transport: {},
      getTransportDetails: {},
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/transportSelection',
        nextUri: '/summary',
        showExportDate: true,
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        landingsEntryUri: ':documentNumber/landings-entry',
        journey: 'catchCertificate',
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: jest.fn()
      }
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    expect(wrapper.find('input[value="vessel name error"]').exists()).toBeTruthy();
    expect(wrapper.find('input[value="flagstate error"]').exists()).toBeTruthy();
  });
});

describe('ContainerVessel Details Page - when export is a directLanding', () => {
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

  const mockPush = jest.fn();

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
  
    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'containerVessel'
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
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      }
    };
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });
  afterEach(() => {
    mockPush.mockRestore();
  });

  it('should redirect to progress page', () => {
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/progress');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('ContainerVessel Details Page - when catch cert has no transport details', () => {
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

  const mockPush = jest.fn();

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
  
    const store = mockStore({
      errors: {},
      transport: {},
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
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      }
    };
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });
  afterEach(() => {
    mockPush.mockRestore();
  });

  it('should redirect to progress page', () => {
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/progress');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('ContainerVessel Details Page - when catch cert has no landing type', () => {
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
  const mockPush = jest.fn();
  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: '/transportSelection',
      nextUri: '/summary',
      showExportDate: true,
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      landingsEntryUri: ':documentNumber/landings-entry',
      journey: 'catchCertificate',
      progressUri: ':documentNumber/progress',
      transportType: 'containerVessel'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    history: {
      push: mockPush
    },
  };
  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'containerVessel'
      },
      getTransportDetails: {}
    });
    window.scrollTo = jest.fn();
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });
  afterEach(() => {
    mockPush.mockRestore();
  });
  it('should redirect to the landing entry page', () => {
    const { landingsEntryUri } = props.route;
    const documentNumber = props.match.params.documentNumber;
    const expectedUrl = landingsEntryUri.replace(':documentNumber', documentNumber);

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

describe('ContainerVessel Details Page - when on the storage document journey', () => {
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
  const mockPush = jest.fn();
  beforeEach(() => {
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    const store = mockStore({
      errors: {},
      transport: {
        vehicle: 'containerVessel'
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
        progressUri: ':documentNumber/progress',
        transportType: 'containerVessel'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      },
    };
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportDetailsPage {...props}/>
        </MemoryRouter>
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
});