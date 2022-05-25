import { mount } from 'enzyme';
import * as React from 'react';
import {component as TransportSelectionPage} from '../../../src/client/pages/common/transport/TransportSelectionPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING } from '../../../src/client/components/helper/vehicleType';
import {
  addTransport,
  getTransportDetails,
  clearTransportDetails,
  getExportCountry,
  getStorageNotesFromRedis
} from '../../../src/client/actions';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import { catchCertificateJourney, storageNoteJourney } from '../../../src/client/helpers/journeyConfiguration';
import { act } from 'react-dom/test-utils';
import * as ErrorUtils from '../../../src/client/pages/utils/errorUtils';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/landingsType.actions');
const mockPush = jest.fn();

describe('TransportSelectionPage', () => {
  const mockSaveTransport= jest.fn();
  const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');

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

  const addTransportDetails = jest.fn;

  const props = {
    route: {
      path: ':documentNumber/how-does-the-export-leave-the-uk',
      title: 'Create a UK catch certificate for exports',
      previousUri: ':documentNumber/conservationAndManagement',
      vehicleTypes: ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING,
      saveAsDraftUri: ':documentNumber/create-catch-certificate/catch-certificates',
      journey: catchCertificateJourney,
      truckCmrUri : ':documentNumber/add-transportation-details-truck',
      planeDetailsUri: ':documentNumber/add-transportation-details-plane',
      trainDetailsUri: ':documentNumber/add-transportation-details-train',
      landingsEntryUri: ':documentNumber/landings-entry',
      containerVesselDetailsUri: ':documentNumber/add-transportation-details-container-vessel',
      summaryUri: ':documentNumber/check-your-information',
      progressUri: ':documentNumber/progress'
    },
    match: {
      params: {
        documentNumber: 'documentNumber'
      }
    },
    addTransportDetails : addTransportDetails,
    history: {
      push: mockPush
    },
  };

  const state = {
    errors: {},
    transport: {},
    getTransportDetails: {},
    clearTransportDetails: {},
    landingsType: {
      landingsEntryOption: 'manualEntry',
      generatedByContent: false
    }
  };

  const mountComponent = (p = props, s = state) =>
    mount(
      <Provider store={mockStore({...s})}>
        <MemoryRouter>
          <TransportSelectionPage {...p} />
        </MemoryRouter>
      </Provider>
    );

  beforeEach(() => {
    addTransport.mockReturnValue({ type: 'ADD_TRANSPORT' });
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    clearTransportDetails.mockReturnValue({ type: 'CLEAR_TRANSPORT_DETAIL' });
    getExportCountry.mockReturnValue({ type: 'GET_EXPORT_PAYLOAD'});
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_FROM_REDIS' });
    getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });

    jest.spyOn(window, 'scrollTo')
      .mockReturnValue();

    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('all journeys', () => {

    let wrapper;

    beforeEach(async () => {
      wrapper = await mountComponent();
    });

    it('should render plane radio button', () => {
      expect(wrapper.find('input#plane').exists()).toBeTruthy();
    });

    it('should render truck radio button', () => {
      expect(wrapper.find('input#truck').exists()).toBeTruthy();
    });

    it('should render train radio button', () => {
      expect(wrapper.find('input#train').exists()).toBeTruthy();
    });

    it('should render containerVessel radio button', () => {
      expect(wrapper.find('input#containerVessel').exists()).toBeTruthy();
    });

    it('should not render directLanding radio button', () => {
      expect(wrapper.find('input#directLanding').exists()).toBeFalsy();
    });

    it('should not render error island when there are no errors', () => {
      expect(wrapper.find('#errorIsland').exists()).toBeFalsy();
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#label-truck').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-truck').props()['htmlFor']).toBe('truck');
      expect(wrapper.find('label#label-plane').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-plane').props()['htmlFor']).toBe('plane');
      expect(wrapper.find('label#label-train').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-train').props()['htmlFor']).toBe('train');
      expect(wrapper.find('label#label-containerVessel').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-containerVessel').props()['htmlFor']).toBe('containerVessel');
    });

    it('should render disabled submit button', () => {
      expect(wrapper.find('button[type="submit"]').exists()).toBeTruthy();
    });

    it('should have an id on all inputs', () => {
      expect(wrapper.find('input[id="truck"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="plane"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="train"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="containerVessel"]').exists()).toBeTruthy();
    });

    it('renders Back to Your Progress link with the correct href property', () => {
      expect(wrapper.find('BackToProgressLink')).toBeDefined();
      expect(wrapper.find('BackToProgressLink').find('a').props().href).toBe('/documentNumber/progress');
    });

    it('should call getTransportDetails with correct params', () => {
      expect(getTransportDetails).toHaveBeenCalled();
      expect(getTransportDetails).toHaveBeenCalledWith('catchCertificate', 'documentNumber');
    });

    it('should call getStorageNotesFromRedis with correct params', () => {
      expect(getStorageNotesFromRedis).toHaveBeenCalled();
      expect(getStorageNotesFromRedis).toHaveBeenCalledWith('documentNumber');
    });

    it('should render error island when there are any errors', async () => {
      const state = {
        errors: {
          errors: [
            {
              targetName: 'vehicle',
              text: 'sdTransportSelectionTypeOfTransportErrorNull',
            },
          ],
        },
        transport: {}
      };

      const mountComponent = (p = props, s = state) =>
        mount(
        <Provider store={mockStore({...s})}>
          <MemoryRouter>
            <TransportSelectionPage {...p} />
          </MemoryRouter>
        </Provider>
      );
      wrapper = await mountComponent();

      expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    });

    it('should catch any errors on submit and scroll to the error island', async () => {
      const instance = wrapper.find('TransportSelectionPage').instance();
      mockSaveTransport.mockRejectedValue('error');

      await act(async () => {
        await instance.onSubmit({preventDefault: jest.fn()});
      });

      expect(mockScrollToErrorIsland).toHaveBeenCalled();
    });

    it('should catch any errors on save as draft and scroll to the error island', async () => {
      const instance = wrapper.find('TransportSelectionPage').instance();
      mockSaveTransport.mockRejectedValue('error');

      await act(async () => {
        await instance.onSaveAsDraft({preventDefault: jest.fn()});
      });

      expect(mockScrollToErrorIsland).toHaveBeenCalled();
    });
  });

  describe('the catch certificate journey', () => {

    it('should call getLandingType', async () => {
      await act(async () => await mountComponent());

      expect(getLandingType).toHaveBeenCalledTimes(1);
      expect(getLandingType).toHaveBeenCalledWith('documentNumber');
    });

    it('should not go anywhere if the export is for a manual entry', async () => {
      await act(async () => await mountComponent());

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should go to the progress page if the export is for a direct landing', async () => {
      const s = {
        ...state,
        landingsType: {
          landingsEntryOption: 'directLanding',
          generatedByContent: false
        }
      };

      await act(async () => await mountComponent(props, s));

      expect(mockPush).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('documentNumber/progress');
    });

    it('should go to the landing entry page if the landing entry option is null', async () => {
      const s = {
        ...state,
        landingsType: {
          landingsEntryOption: null,
          generatedByContent: false
        }
      };

      await act(async () => await mountComponent(props, s));

      const landingEntryUri = props.route.landingsEntryUri.replace(
        ':documentNumber',
        props.match.params.documentNumber
      );

      expect(mockPush).toHaveBeenCalledWith(landingEntryUri);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

  });

  describe('the storage document journey', () => {

    let wrapper;

    beforeEach(async () => {
      const p = {
        ...props,
        route: {
          ...props.route,
          journey: storageNoteJourney
        }
      };

      wrapper = await mountComponent(p);
    });

    it('should not call getLandingType', () => {
      expect(getLandingType).not.toHaveBeenCalled();
    });
    
    it('renders Back to Your Progress link with the correct href property', () => {
      expect(wrapper.find('BackToProgressLink')).toBeDefined();
      expect(wrapper.find('BackToProgressLink').find('a').props().href).toBe('/documentNumber/progress');
    });
  });

});

describe('TransportSelectionPage snapshot', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
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
        },
      },
    }),
  ]);
  const mockPush = jest.fn();
  const store = mockStore({
    errors: {},
    transport: {
      vehicle: 'plane',
    },
    getTransportDetails: {},
    landingsType: {
      generatedByContent: false,
      landingsEntryOption: 'directLanding',
    },
  });
  const props = {
    route: {
      path: ':documentNumber/how-does-the-export-leave-the-uk',
      title: 'Create a UK catch certificate for exports',
      previousUri: ':documentNumber/conservationAndManagement',
      vehicleTypes: ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING,
      saveAsDraftUri:
        ':documentNumber/create-catch-certificate/catch-certificates',
      journey: catchCertificateJourney,
      truckCmrUri: ':documentNumber/add-transportation-details-truck',
      planeDetailsUri: ':documentNumber/add-transportation-details-plane',
      trainDetailsUri: ':documentNumber/add-transportation-details-train',
      landingsEntryUri: ':documentNumber/landings-entry',
      containerVesselDetailsUri:
        ':documentNumber/add-transportation-details-container-vessel',
      summaryUri: ':documentNumber/check-your-information',
      progressUri: ':documentNumber/progress',
    },
    match: {
      params: {
        documentNumber: 'GBR-23423-4234234',
      },
    },
    history: {
      push: mockPush,
    },
  };
  beforeEach(() => {
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS' });
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TransportSelectionPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    mockPush.mockReset();
  });
  it('should generate snapshot for TransportSelectionPage', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

