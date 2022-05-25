import React from 'react';
import { Router } from 'react-router';
import { fireEvent,render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { component as SdProgressPage } from '../../../../src/client/pages/storageNotes/SdProgressPage';
import SdProgressPageExport from '../../../../src/client/pages/storageNotes/SdProgressPage';
import { getProgress, clearProgress, checkProgress, clearErrors } from '../../../../src/client/actions/progress.actions';
import { getTransportDetails, clearTransportDetails, getStorageNotesFromRedis } from '../../../../src/client/actions';
import { clearCopyDocument } from '../../../../src/client/actions/copy-document.actions';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';


jest.mock('../../../../src/client/actions');
jest.mock('../../../../src/client/actions/progress.actions');
jest.mock('../../../../src/client/actions/copy-document.actions');

let push;

const renderComponent = (state = {}) => {
  const props = {
    route: {
      title: 'Create a UK Storage document - GOV.UK',
      previousUri: '/create-storage-document/storage-documents',
      nextUri: '/create-storage-document/:documentNumber/check-your-information',
      path: '/create-storage-document/:documentNumber/progress',
      addUserReferenceUri: '/create-storage-document/:documentNumber/user-reference',
      companyDetailsUri: '/create-storage-document/:documentNumber/exporter-details',
      transportSelectionStorageNotesUri: '/create-storage-document/:documentNumber/how-does-the-export-leave-the-uk',
      productDetailsUri: '/create-storage-document/:documentNumber/add-product-to-this-consignment',
      storageFacilitiesUri: '/create-storage-document/:documentNumber/you-have-added-a-storage-facility',
      productDestinationUri: '/create-storage-document/:documentNumber/what-export-destination',
      exportDestinationUri: '/create-storage-document/:documentNumber/export-destination',
      truckCmrUri: '/create-storage-document/:documentNumber/do-you-have-a-road-transport-document',
      planeDetailsUri: '/create-storage-document/:documentNumber/add-transportation-details-plane',
      trainDetailsUri: '/create-storage-document/:documentNumber/add-transportation-details-train',
      productsUri: '/create-storage-document/:documentNumber/you-have-added-a-product',
      containerVesselDetailsUri: '/create-storage-document/:documentNumber/add-transportation-details-container-vessel',
      journey: 'storageDocument',
      journeyText: 'storage document'
    },
    match: {
      params: {
        documentNumber: 'document123',
      },
    },
    t: jest.fn()
  };
  const store = configureStore()(state);
  const history = createMemoryHistory({ initialEntries: ['/create-storage-document/document123/progress'], });
  push = jest.spyOn(history, 'push');
  const { container } = render(
    <Router history={history}>
      <Switch>
        <Route exact path="/create-storage-document/storage-documents">
          <div>Storage document Dashboard Page</div>
        </Route>
        <Route exact path="/create-storage-document/:documentNumber/user-reference">
          <div>Storage document User Reference Page</div>
        </Route>
        <Route exact path="/create-storage-document/:documentNumber/check-your-information">
          <div>Storage document Summary Page</div>
        </Route>
        <Route exact path="/create-storage-document/:documentNumber/progress">
          <Provider store={store}>
               <SdProgressPage {...props} />
          </Provider>
        </Route>
      </Switch>
    </Router>
  );
  return container;
};

describe('SD ProgressPage', () => {
  let wrapper, state;
  let originalMutationObserver;

  state = {
    progress: {
      progress: {
        exporter: 'COMPLETED',
        reference: 'COMPLETED',
        catches: 'INCOMPLETE',
        storageFacilities: 'INCOMPLETE',
        transportType: 'COMPLETED',
        transportDetails: 'INCOMPLETE',
        exportDestination: 'INCOMPLETE'
      },
      completedSections: 1,
      requiredSections: 6,
    },
    errors: {},
    confirmCopyDocument: {},
    transport: {
        vehicle: 'plane'
    }
  };
  beforeEach(() => {
    getProgress.mockReturnValue({ type: 'get_progress_success' });
    clearProgress.mockReturnValue({ type: 'clear_progress_data' });
    checkProgress.mockReturnValue({ type: 'check_progress'});
    getTransportDetails.mockReturnValue({ type: 'get_transport_success' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    clearCopyDocument.mockReturnValue({type: 'clear_copy_document'});
    getStorageNotesFromRedis.mockReturnValue({ type: 'get_storage_notes' });
    originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MutationObserver;
  });

  afterEach(() => {
    global.MutationObserver = originalMutationObserver;
    push.mockReset();
  });

  it('should render SdProgressPage component', () => {
    wrapper = renderComponent(state);
    expect(wrapper).toBeDefined();
  });

  it('should render page with the correct H1 heading', () => {
    renderComponent(state);
    expect(screen.getByTestId('sd-progress-heading')).toHaveTextContent(
      'Storage Document application:document123'
    );
  });

  it('should render a back link', () => {
    renderComponent(state);
    const backLink = screen.getByText('Back');
    expect(backLink).toBeDefined();
  });

  it('should call the back link handler and navigate to the Dashboard page', async () => {
    renderComponent(state);
    const backLink = screen.getByText('Back');
    fireEvent(
      backLink,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(await screen.findByText('Storage document Dashboard Page')).toBeDefined();
  });

  it('should render an application incomplete message', () => {
    renderComponent(state);
    expect(screen.getByText('Application incomplete')).toBeDefined();
    expect(screen.getByText('You have completed 1 of 6 required sections.')).toBeDefined();
  });

  it('should render an application complete message and display a Check your answers and submit', async () => {
    renderComponent({
      progress: {
        progress:
        {
            exporter: 'COMPLETED',
            reference: 'COMPLETED',
            catches: 'COMPLETED',
            storageFacilities: 'COMPLETED',
            transportType: 'COMPLETED',
            transportDetails: 'COMPLETED',
            exportDestination: 'COMPLETED'
        },
        completedSections: 6,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: {},
    });

    expect(screen.getByText('Application completed')).toBeDefined();
    expect(screen.getByText('You have completed 6 of 6 required sections.')).toBeDefined();
    expect(screen.getByText('Check your answers and submit')).toBeDefined();
    fireEvent(
      screen.getByText('Check your answers and submit'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(await screen.findByText('Storage document Summary Page')).toBeDefined();
  });

  it('should take a snapshot of the whole page when whole data is filled', () => {
    const  container = renderComponent({
      progress: {
        progress:
        {
            exporter: 'COMPLETED',
            reference: 'COMPLETED',
            catches: 'COMPLETED',
            storageFacilities: 'COMPLETED',
            transportType: 'COMPLETED',
            transportDetails: 'COMPLETED',
            exportDestination: 'COMPLETED'
        },
        completedSections: 6,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: {},
    });
    
   expect(container).toMatchSnapshot();
  });
  it('should make a service call to get the progress and the transport details of the storageDocument', () => {
    renderComponent(state);
    expect(getProgress).toHaveBeenCalledWith('document123','storageDocument');
    expect(getTransportDetails).toHaveBeenCalledWith('storageDocument', 'document123');
  });

  it('should clear progress of the storageDocument', () => {
    renderComponent(state);
    expect(clearProgress).toHaveBeenCalledWith();
    expect(clearTransportDetails).toHaveBeenCalledWith();
    expect(clearErrors).toHaveBeenCalled();
  });

  it('should have an id for Exporter, Products, Storage facilities and Transportation sections', () => {
    renderComponent(state);
    expect(screen.getByTestId('Exporter-heading')).toHaveTextContent('Exporter');
    expect(screen.getByTestId('Products-heading')).toHaveTextContent('Products');
    expect(screen.getByTestId('Storage-facilities-heading')).toHaveTextContent('Storage facilities');
    expect(screen.getByTestId('Transportation-heading')).toHaveTextContent('Transportation');
  });

  it('should have links that take the exporter to the pages of Storage document journey', async () => {
    renderComponent(state);
    expect(screen.getByText('Your reference (Optional)')).toHaveAttribute('href', '/create-storage-document/document123/user-reference');
    expect(screen.getByText('Exporter details')).toHaveAttribute('href', '/create-storage-document/document123/exporter-details');
    expect(screen.getByText('Product details')).toHaveAttribute('href', '/create-storage-document/document123/add-product-to-this-consignment');
    expect(screen.getByTestId('progress-storageFacilities-title')).toHaveAttribute('href', '/create-storage-document/document123/you-have-added-a-storage-facility');
    expect(screen.getByText('Transport type')).toHaveAttribute('href', '/create-storage-document/document123/how-does-the-export-leave-the-uk');
    expect(screen.getByText('Transport details')).toHaveAttribute('href', '/create-storage-document/document123/add-transportation-details-plane');
    expect(screen.getByText('Export destination')).toHaveAttribute('href', '/create-storage-document/document123/what-export-destination');
    fireEvent(
      screen.getByText('Your reference (Optional)'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(await screen.findByText('Storage document User Reference Page')).toBeDefined();
  });

  it('should render check your answers and submit button', () => {
    state = {
      progress: {
        progress: {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'COMPLETED',
          storageFacilities: 'COMPLETED',
          exportDestination: 'COMPLETED',
          transportDetails: 'CANNOT START',
          transportType: 'INCOMPLETE',
        },
        requiredSections: 4,
        completedSections: 6,
      },
      errors: {},
      confirmCopyDocument: {},
      transport: {
        vehicle: undefined,
      },
    };
    renderComponent(state);

    const checkYourAnswersAndSubmitButton = screen.queryByText(
      'Check your answers and submit'
    );
    expect(checkYourAnswersAndSubmitButton).toBeInTheDocument();
  });

  it('should redirect to the check your answers page when all sections are completed and checkProgress does not throw an error', async () => {
    state = {
      progress: {
        progress: {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'COMPLETED',
          storageFacilities: 'COMPLETED',
          exportDestination: 'COMPLETED',
          transportDetails: 'COMPLETED',
          transportType: 'COMPLETED',
        },
        requiredSections: 6,
        completedSections: 6,
      },
      errors: {},
      confirmCopyDocument: {},
      transport: {
        vehicle: undefined,
      },
    };
    renderComponent(state);

    const checkYourAnswersAndSubmitButton = screen.queryByText(
      'Check your answers and submit'
    );

    await fireEvent(
      checkYourAnswersAndSubmitButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(checkProgress).toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/create-storage-document/document123/check-your-information');
  });

  it('should render return to your dashboard button', () => {
    renderComponent(state);
    const returnToDashboardButton = screen.getByText('Return to your dashboard');
    expect(returnToDashboardButton).toBeDefined();
  });

  it('should call the return to your dashboard button handler and navigate to the dashboard uri', async () => {
    renderComponent(state);
    const returnToDashboardButton = screen.getByText('Return to your dashboard');
    fireEvent(
      returnToDashboardButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(await screen.findByText('Storage document Dashboard Page')).toBeDefined();
  });

  it('should render an application incomplete message with no progress data', () => {
      state = {
        progress: undefined,
        confirmCopyDocument: {},
        errors: {}
      };
      renderComponent(state);
      expect(screen.getByText('Application incomplete')).toBeDefined();
  });

  it('should display copy document notification for storage document', () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'COMPLETED',
          storageFacilities: 'COMPLETED',
          exportDestination: 'COMPLETED',
          transportDetails: 'CANNOT START',
          transportType: 'INCOMPLETE',
        },
        completedSections: 4,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: { copyDocumentAcknowledged: true, voidDocumentConfirm: false, documentNumber: 'GBR-VOID-DOCUMENT' },
    });

    expect(screen.getByText('Important')).toBeDefined();
  //  expect(screen.getByText('This draft was created by copying document GBR-VOID-DOCUMENT. You are reminded that you must not use a storage document or data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.')).toBeDefined();
  });

  it('should display copy document notification with a VOID message for storage document', () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'COMPLETED',
          storageFacilities: 'COMPLETED',
          exportDestination: 'COMPLETED',
          transportDetails: 'CANNOT START',
          transportType: 'INCOMPLETE',
        },
        completedSections: 4,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: { copyDocumentAcknowledged: true, voidDocumentConfirm: true },
      storageNotes: {}
    });

    expect(screen.getByText('Important')).toBeDefined();
    expect(screen.getByText('This draft was created by copying a document that has now been voided. You are reminded that you must not use a storage document or data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.')).toBeDefined();
  });

  it('should not redirect to the check your answers page when the requiredSections and completedSections are not equal and checkProgress throws error', async () => {
    checkProgress.mockRejectedValue('error');

    state = {
      progress: {
        progress: {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'COMPLETED',
          storageFacilities: 'COMPLETED',
          exportDestination: 'COMPLETED',
          transportDetails: 'CANNOT START',
          transportType: 'INCOMPLETE',
        },
        requiredSections: 4,
        completedSections: 6,
      },
      errors: {},
      confirmCopyDocument: {},
      transport: {
        vehicle: undefined,
      },
    };
    renderComponent(state);

    const checkYourAnswersAndSubmitButton = screen.queryByText(
      'Check your answers and submit'
    );

    await fireEvent(
      checkYourAnswersAndSubmitButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(checkProgress).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});

describe('Navigate exporter to added product details page from the progress page', () => {
  let originalMutationObserver;
  beforeEach(() => {
    getProgress.mockReturnValue({ type: 'get_progress_success' });
    clearProgress.mockReturnValue({ type: 'clear_progress_data' });
    getTransportDetails.mockReturnValue({ type: 'get_transport_success' });
    clearTransportDetails.mockReturnValue({ type: 'clear_transport_data' });
    getStorageNotesFromRedis.mockReturnValue({ type: 'get_storage_notes' });
    originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MutationObserver;
  });

  afterEach(() => {
    global.MutationObserver = originalMutationObserver;
    getProgress.mockReset();
    clearProgress.mockReset();
    getTransportDetails.mockReset();
    clearTransportDetails.mockReset();
    getStorageNotesFromRedis.mockReset();
  });

  it('should have links that navigate the exporter to the catches added page', () => {
    renderComponent({
      progress: {
        progress: {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'INCOMPLETE',
          storageFacilities: 'INCOMPLETE',
          transportType: 'COMPLETED',
          transportDetails: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE'
        },
        completedSections: 1,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: {},
      storageNotes: {
        catches: [
          {
            certificateNumber: 'THJMTH54747',
            commodityCode: '123456',
            dateOfUnloading: '05/04/2021',
            id: '123-1639426803',
            placeOfUnloading: 'Red Sea',
            product: 'Seabasses nei (BSE)',
            productWeight: '12',
            transportUnloadedFrom: 'Dover',
            weightOnCC: '12'
          },
        ],
        addAnotherProduct: 'No',
        addAnotherStorageFacility: 'No',
        exportedTo: {
          isoCodeAlpha2: 'AF',
          isoCodeAlpha3: 'AFG',
          isoNumericCode: '004',
          officialCountryName: 'Afghanistan'
        },
      },
    });

    expect(screen.getByText('Product details')).toHaveAttribute('href', '/create-storage-document/document123/you-have-added-a-product');
  });

  it('should not have links that navigate the exporter to the catches added page', () => {
    renderComponent({
      progress: {
        progress: {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          catches: 'INCOMPLETE',
          storageFacilities: 'INCOMPLETE',
          transportType: 'COMPLETED',
          transportDetails: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE'
        },
        completedSections: 1,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: {},
      storageNotes: {
        catches: [
          {
            certificateNumber: '',
            commodityCode: '',
            dateOfUnloading: '05/04/2021',
            id: undefined,
            placeOfUnloading: '',
            product: 'Seabasses nei (BSE)',
            productWeight: '12',
            transportUnloadedFrom: '',
            weightOnCC: '12'
          },
        ],
        addAnotherProduct: 'No',
        addAnotherStorageFacility: 'No',
        exportedTo: {
          isoCodeAlpha2: 'AF',
          isoCodeAlpha3: 'AFG',
          isoNumericCode: '004',
          officialCountryName: 'Afghanistan'
        },
      },
    });

    expect(screen.getByText('Product details')).toHaveAttribute('href', '/create-storage-document/document123/add-product-to-this-consignment');
  });

  it('should take a snapshot of the whole page', () => {
    const  container = renderComponent({
      progress: {
        progress:
        {
          reference: 'INCOMPLETE',
          exporter: 'INCOMPLETE',
          catches: 'INCOMPLETE',
          storageFacilities: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE',
          transportType: 'INCOMPLETE',
          transportDetails: 'CANNOT START',
        },
        completedSections: 0,
        requiredSections: 6
      },
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {}
    });
    
   expect(container).toMatchSnapshot();
  });

  it('should scroll to errorIsland', () => {
    const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    checkProgress.mockRejectedValue('error');

    renderComponent({
      progress: {
        progress:
        {
          reference: 'INCOMPLETE',
          exporter: 'INCOMPLETE',
          catches: 'INCOMPLETE',
          storageFacilities: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE',
          transportType: 'INCOMPLETE',
          transportDetails: 'CANNOT START',
        },
        completedSections: 0,
        requiredSections: 6
      },
      errors: {
        errors: [{targetName:'exporter',text:'ExporterRequiedError'}]
      },
      confirmCopyDocument: {},
      processingStatement: {}
    });
    
    fireEvent(
      screen.getByText('Check your answers and submit'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });
});


describe('SD ProgressPage, loadData', () => {
  const store = {
    dispatch: jest.fn(),
  };
  const journey = 'storageDocument';
  const documentNumber = 'document123';
  beforeEach(() => {
    getProgress.mockReturnValue({ type: 'get_progress_success' });
    getTransportDetails.mockReturnValue({ type: 'get_transport_success' });
    getStorageNotesFromRedis.mockReturnValue({ type: 'get_storage_notes' });
    
  });
  
  afterEach(() => {
    getProgress.mockReset();
    getTransportDetails.mockReset();
    getStorageNotesFromRedis.mockReset();
  });

  it('should call all methods required to load the component', () => {
    SdProgressPageExport.documentNumber = documentNumber;
    SdProgressPageExport.loadData(store, journey);

    expect(getProgress).toHaveBeenCalledTimes(1);
    expect(getTransportDetails).toHaveBeenCalledTimes(1);
    expect(getStorageNotesFromRedis).toHaveBeenCalledTimes(1);
    expect(getProgress).toHaveBeenCalledWith(documentNumber, journey);
    expect(getTransportDetails).toHaveBeenCalledWith(journey, documentNumber);
    expect(getStorageNotesFromRedis).toHaveBeenCalledWith(documentNumber);
  });
});