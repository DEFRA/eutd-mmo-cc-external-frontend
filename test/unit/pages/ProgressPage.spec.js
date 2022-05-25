import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import MutationObserver from 'mutation-observer';
import { Route, Switch } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { component as ProgressPage } from '../../../src/client/pages/exportCertificates/ProgressPage';
import ProgressPageExport from '../../../src/client/pages/exportCertificates/ProgressPage';
import { getProgress, clearProgress, checkProgress, clearErrors } from '../../../src/client/actions/progress.actions';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import { getTransportDetails, clearTransportDetails } from '../../../src/client/actions';
import * as ErrorUtils from '../../../src/client/pages/utils/errorUtils';

jest.mock('../../../src/client/actions/progress.actions');
jest.mock('../../../src/client/actions/landingsType.actions');
jest.mock('../../../src/client/actions');

let push;

const renderComponent = (state = {}) => {
  const history = createMemoryHistory({ initialEntries: ['document123/progress'], });
  push = jest.spyOn(history, 'push');
  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/create-catch-certificate/:documentNumber/landings-entry',
      nextUri: '/create-catch-certificate/:documentNumber/check-your-information',
      addUserReferenceUri: '/create-catch-certificate/:documentNumber/add-your-reference',
      addExporterDetailsCatchCertificateUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
      addSpeciesUri: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
      uploadFileUri: '/create-catch-certificate/:documentNumber/upload-file',
      directLandingUri: '/create-catch-certificate/:documentNumber/direct-landing',
      whoseWatersUri: '/create-catch-certificate/:documentNumber/whose-waters-were-they-caught-in',
      whereExportingUri: '/create-catch-certificate/:documentNumber/what-export-journey',
      transportSelectionUri: '/create-catch-certificate/:documentNumber/how-does-the-export-leave-the-uk',
      addLandingsUpdatedUri: '/create-catch-certificate/:documentNumber/add-landings',
      truckCmrUri: '/create-catch-certificate/:documentNumber/do-you-have-a-road-transport-document',
      planeDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-plane',
      trainDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-train',
      containerVesselDetailsUri: '/create-catch-certificate/:documentNumber/add-transportation-details-container-vessel',
      path: ':documentNumber/progress',
      journey: 'catchCertificate',
      dashboardUri: '/create-catch-certificate/catch-certificates',
    },
    match: {
      params: {
        documentNumber: 'document123',
      },
      history: {
        push: push
      }
    }
  };

  const store = configureStore()(state);


  const { container } = render(
    <Router history={history}>
      <Switch>
        <Route exact path="/create-catch-certificate/catch-certificates">
          <div>Exporter Dashboard Page</div>
        </Route>
        <Route
          exact
          path="/create-catch-certificate/:documentNumber/landings-entry"
        >
          <div>Landings Entry Page</div>
        </Route>
        <Route exact path=":documentNumber/progress">
          <Provider store={store}>
            <ProgressPage {...props} />
          </Provider>
        </Route>
      </Switch>
    </Router>
  );

  return container;
};

describe('ProgressPage', () => {
  let wrapper;
  let originalMutationObserver;
  
  beforeEach(() => {
    getProgress.mockReset();
    getProgress.mockReturnValue({type: 'get_progress_success'});
    getLandingType.mockReset();
    getLandingType.mockReturnValue({type: 'GET_LANDINGS_TYPE'});
    getTransportDetails.mockReset();
    getTransportDetails.mockReturnValue({type: 'GET_TRANSPORT_DETAILS'});
    clearProgress.mockReturnValue({type: 'clear_progress_data'});
    checkProgress.mockReturnValue({type: 'check_progress_data'});
    clearTransportDetails.mockReturnValue({type: 'clearTransportDetails'});

    wrapper = renderComponent({
      progress: {
        completedSections: 7,
        progress:
        {
          dataUpload: '',
          conservation: 'COMPLETED',
          exportJourney: 'COMPLETED',
          exporter: 'COMPLETED',
          landings: 'COMPLETED',
          products: 'COMPLETED',
          reference: 'COMPLETED',
          transportDetails: 'COMPLETED',
          transportType: 'COMPLETED',
        },
        requiredSections: 7
      },
      transport: {
        vehicle: 'truck'
      },
      landingsType: {
        landingsEntryOption: 'directLanding'
      },
      errors: {}
    });

    originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MutationObserver;
  });

  afterEach(() => {
    global.MutationObserver = originalMutationObserver;
    push.mockReset();
  });

  it('should render an ProgressPage component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should not redirect to another page', () => {
    expect(push).not.toHaveBeenCalled();
  });

  it('make a single call to get the progress data', () => {
    expect(getProgress).toHaveBeenCalledTimes(1);
  });

  it('should render page with the correct H1 heading', () => {
    expect(screen.getByTestId('Progress-heading')).toHaveTextContent(
      'Catch Certificate application:'
    );
  });

  it('should render page with the correct H2 heading', () => {
    expect(
      screen.getByRole('heading', { name: 'Application completed' })
    ).toBeInTheDocument();
  });

  it('should render a You have completed out of required sections text', () => {
    expect(screen.getByTestId('completedSections')).toHaveTextContent(
      'You have completed 7 of 7 required sections'
    );
  });

  it('should render a back link', () => {
    const backLink = screen.getByText('Back');
    expect(backLink).toBeDefined();
  });

  it('should render return to your dashboard button', () => {
    const returnToDashboardButton = screen.getByText('Return to your dashboard');
    expect(returnToDashboardButton).toBeDefined();
  });

  it('should call the back link handler and navigate to the Landings entry uri', async () => {
    const backLink = screen.getByText('Back');

    fireEvent(
      backLink,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(await screen.findByText('Landings Entry Page')).toBeDefined();
  });

  it('should call the return to your dashboard button handler and navigate to the dashboard uri', async () => {
    const returnToDashboardButton = screen.getByText('Return to your dashboard');

    fireEvent(
      returnToDashboardButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(await screen.findByText('Exporter Dashboard Page')).toBeDefined();
  });

  it('should have an id for Exporter, Products/Landings and Transportation sections', () => {
    expect(screen.getByTestId('Exporter-heading')).toHaveTextContent('Exporter');
    expect(screen.getByTestId('ProductsAndLandings-heading')).toHaveTextContent('Products/Landings');
    expect(screen.getByTestId('Transportation-heading')).toHaveTextContent('Transportation');
  });

  it('should clear progress and transport when component unmounts', () => {
    expect(clearProgress).toHaveBeenCalled();
    expect(clearTransportDetails).toHaveBeenCalled();
    expect(clearErrors).toHaveBeenCalled();
  });
});

describe('Progress Page with no landingsEntryOption', ()=> {
  let wrapper;

  beforeEach(()=> {
    getProgress.mockReset();
    getProgress.mockReturnValue('');
    wrapper = renderComponent(
      {
        progress: {
          progress: {}
        },
        landingsType: {
          landingsEntryOption: null,
          generatedByContent: false,
        },
        errors: {}
      }
    );
  });

  afterEach(() => {
    push.mockReset();
  });

  it('should redirect to the LandingsEntryPage if there is no landingsEntryOption', ()=> {
    expect(wrapper).toBeDefined();
    expect(push).toHaveBeenCalledTimes(1);
  });
});

describe('Progress Page with no data loading', ()=> {
  let wrapper;

  beforeEach(()=> {
    getProgress.mockReset();
    getProgress.mockReturnValue('');
    wrapper = renderComponent(
      {
        progress: { progress : null },
        landingsType: {
          landingsEntryOption: 'manualEntry',
          generatedByContent: true,
        },
        errors: {}
      }
    );
  });

  afterEach(() => {
    push.mockReset();
  });

  it('should redirect to the LandingsEntryPage if no progress data is returned', ()=> {
    expect(wrapper).toBeDefined();
    expect(push).toHaveBeenCalledTimes(1);
  });
});

describe('ProgressPage, unauthorised', () => {

  let wrapper;

  beforeEach(() => {
    getProgress.mockReset();
    getProgress.mockReturnValue({type: 'get_progress_unauthorised'});

    wrapper = renderComponent(
      {
        progress: {
          unauthorised: true
        },
        landingsType: {
          landingsEntryOption: 'directLanding'
        },
        errors: {}
      }
    );
  });

  afterEach(() => {
    push.mockReset();
  });

  it('should redirect to the /forbidden page', () => {
    expect(wrapper).toBeDefined();

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/forbidden');
  });

});

describe('ProgressPage, loadData', () => {

  const store = {
    dispatch: jest.fn()
  };

  const journey = 'catchCertificate';
  const documentNumber = 'document123';

  beforeEach(() => {
    getProgress.mockReset();
    getProgress.mockReturnValue({type: 'get_progress_success'});
    getLandingType.mockReset();
    getLandingType.mockReturnValue({type: 'GET_LANDINGS_TYPE'});
    getTransportDetails.mockReset();
    getTransportDetails.mockReturnValue({type: 'GET_TRANSPORT_DETAILS'});
  });

  it('should call all methods needed to clar landings and load the component', () => {
    ProgressPageExport.documentNumber = documentNumber;
    ProgressPageExport.loadData(store, journey);

    expect(getProgress).toHaveBeenCalledTimes(1);
    expect(getProgress).toHaveBeenCalledWith(documentNumber, journey);

    expect(getLandingType).toHaveBeenCalledTimes(1);
    expect(getLandingType).toHaveBeenCalledWith(documentNumber);

    expect(getTransportDetails).toHaveBeenCalledTimes(1);
    expect(getTransportDetails).toHaveBeenCalledWith(journey, documentNumber);
  });

});

describe('Should render check your answers and submit button', () => {

  beforeEach(() => {
    getProgress.mockReset();
    getProgress.mockReturnValue({type: 'get_progress_success'});
    checkProgress.mockReturnValue({type: 'check_progress_data'});
  });



  it('should display check your answers and submit button', () => {
    renderComponent(
      {
        progress: {
          completedSections: 3,
          progress:
          {
            conservation: 'INCOMPLETE',
            exportJourney: 'INCOMPLETE',
            exporter: 'INCOMPLETE',
            landings: 'INCOMPLETE',
            products: 'COMPLETED',
            reference: 'COMPLETED',
            transportDetails: 'CANNOT START',
            transportType: 'INCOMPLETE',
          },
          requiredSections: 7
        },
        landingsType: {
          landingsEntryOption: 'manualEntry'
        },
        transport: {
          vehicle: undefined
        },
        errors: {}
      }
    );

    const checkYourAnswersAndSubmitButton = screen.queryByText('Check your answers and submit');
    expect(checkYourAnswersAndSubmitButton).not.toBeNull();
  });

  it('should  redirect to summary page when all required sections have been completed', async () => {
    renderComponent(
      {
        progress: {
          completedSections: 6,
          progress:
          {
            conservation: 'COMPLETED',
            exportJourney: 'COMPLETED',
            exporter: 'COMPLETED',
            landings: 'COMPLETED',
            products: 'COMPLETED',
            reference: 'COMPLETED'
          },
          requiredSections: 5
        },
        landingsType: {
          landingsEntryOption: 'uploadEntry'
        },
        transport: {
          vehicle: 'truck'
        },
        errors: {}
      }
    );

    const checkYourAnswersAndSubmitButton = screen.queryByText('Check your answers and submit');

    await fireEvent(checkYourAnswersAndSubmitButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/check-your-information');
  });
  
  it('should not redirect to summary page when not all required sections have been completed and should scroll to error island', async () => {
    const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    checkProgress.mockRejectedValue('error');

    const requiredSections = 7;

    const container = renderComponent(
      {
        progress: {
          completedSections: 0,
          progress:
          {
            conservation: 'INCOMPLETE',
            exportJourney: 'INCOMPLETE',
            exporter: 'INCOMPLETE',
            landings: 'INCOMPLETE',
            products: 'INCOMPLETE',
            reference: 'INCOMPLETE',
            transportDetails: 'CANNOT START',
            transportType: 'INCOMPLETE',
          },
          requiredSections
        },
        landingsType: {
          landingsEntryOption: 'uploadEntry'
        },
        transport: {
          vehicle: 'truck'
        },
        errors: {
          errors: [
              {
                  targetName: 'exporter',
                  text: 'commonProgressExporterRequiredError'
              },
              {
                  targetName: 'products',
                  text: 'commonProgressProductDetailsRequiredError'
              },
              {
                  targetName: 'landings',
                  text: 'ccProgressLandingDetailsRequiredError'
              },
              {
                  targetName: 'conservation',
                  text: 'ccProgressCatchWatersRequiredError'
              },
              {
                  targetName: 'exportJourney',
                  text: 'ccProgressExportJourneyRequiredError'
              },
              {
                  targetName: 'transportType',
                  text: 'commonProgressTransportTypeRequiredError'
              },
              {
                  targetName: 'transportDetails',
                  text: 'commonProgressTransportDetailsRequiredError'
              }
          ],
          exporterError: 'commonProgressExporterRequiredError',
          productsError: 'commonProgressProductDetailsRequiredError',
          landingsError: 'ccProgressLandingDetailsRequiredError',
          conservationError: 'ccProgressCatchWatersRequiredError',
          exportJourneyError: 'ccProgressExportJourneyRequiredError',
          transportDetailsError: 'commonProgressTransportDetailsRequiredError',
          transportTypeError: 'commonProgressTransportTypeRequiredError'
        },
      }
    );

    const checkYourAnswersAndSubmitButton = screen.queryByText('Check your answers and submit');

    await userEvent.click(checkYourAnswersAndSubmitButton);

    const errorItems = container.querySelectorAll('.error');

    expect(checkProgress).toHaveBeenCalled();
    expect(mockScrollToErrorIsland).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(errorItems.length).toEqual(requiredSections);
  });
});

describe('ProgressPage, Progress items link', () => {
  let state = {
    progress: {
      progress:
      {
        reference: 'COMPLETED'
      }
    },
    landingsType: {
      landingsEntryOption: 'directLanding'
    },
    transport: {
      vehicle: ''
    },
    errors: {}
  };

  beforeEach(()=> {
    clearErrors.mockReset();
    clearErrors.mockReturnValue({type: 'clear_progress_data'});
  });

  it('should render a link to the user reference page', () => {
    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Your reference (Optional)' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/add-your-reference');
  });

  it('should call the onLinkClick method and navigate to the reference page', () => {
    renderComponent(state);

    userEvent.click(screen.getByText('Your reference (Optional)'));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/add-your-reference');
  });

  it('should render a link to the exporter details page', () => {
    state.progress.progress.exporter = 'COMPLETED';
    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Exporter details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/add-exporter-details');
  });

  it('should call the onLinkClick method and navigate to the exporter details page', () => {
    state.progress.progress.exporter = 'COMPLETED';
    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Exporter details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/add-exporter-details');
  });

  it('should render a link to the data upload page', () => {
    state.progress.progress.dataUpload = '';
    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Data upload' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/upload-file');
  });

  it('should call the onLinkClick method and navigate to the data upload page', () => {
    state.progress.progress.dataUpload = '';
    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Data upload' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/upload-file');
  });

  it('should render a link to the product details page', () => {
    state.progress.progress.products = 'COMPLETED';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Product details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/what-are-you-exporting');
  });

  it('should call the onLinkClick method and navigate to the product details page', () => {
    state.progress.progress.products = 'COMPLETED';
    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Product details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/what-are-you-exporting');
  });

  it('should render a link to the direct landing page if direct landing is the selected landingsEntryOption', () => {
    state.progress.progress.landings = 'COMPLETED';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Landings details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/direct-landing');
  });

  it('should call the onLinkClick method and navigate to the direct landing page', () => {
    state.progress.progress.landings = 'COMPLETED';
    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Landings details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/direct-landing');
  });

  it('should render a link to the add landing page if direct landing is NOT the selected landingsEntryOption', () => {
    state.progress.progress.landings = 'COMPLETED';
    state.landingsType.landingsEntryOption = 'manualEntry';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Landings details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/add-landings');
  });

  it('should call the onLinkClick method and navigate to the add landing page', () => {
    state.progress.progress.landings = 'COMPLETED';
    state.landingsType.landingsEntryOption = 'manualEntry';
    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Landings details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/add-landings');
  });

  it('should render a link to the whose waters page', () => {
    state.progress.progress.conservation = 'COMPLETED';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Catch waters' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/whose-waters-were-they-caught-in');
  });

  it('should call the onLinkClick method and navigate to the whose waters page', () => {
    state.progress.progress.conservation = 'COMPLETED';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Catch waters' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/whose-waters-were-they-caught-in');
  });

  it('should render a link to the export journey page', () => {
    state.progress.progress.exportJourney = 'COMPLETED';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Export journey' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/what-export-journey');
  });

  it('should call the onLinkClick method and navigate to the export journey page', () => {
    state.progress.progress.exportJourney = 'COMPLETED';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Export journey' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/what-export-journey');
  });

  it('should render a link to the transport type page', () => {
    state.progress.progress.transportType = 'INCOMPLETE';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Transport type' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/how-does-the-export-leave-the-uk');
  });

  it('should call the onLinkClick method and navigate to the transport type page', () => {
    state.progress.progress.transportType = 'INCOMPLETE';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Transport type' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/how-does-the-export-leave-the-uk');
  });

  it('should render a link to the relevant transport details page when transport is truck', () => {
    state.progress.progress.transportDetails = 'INCOMPLETE';
    state.transport.vehicle = 'truck';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Transport details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/do-you-have-a-road-transport-document');
  });

  it('should call the onLinkClick method and navigate to the relevant transport details page when transport is truck', () => {
    state.progress.progress.transportDetails = 'INCOMPLETE';
    state.transport.vehicle = 'truck';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Transport details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/do-you-have-a-road-transport-document');
  });

  it('should render a link to the relevant transport details page when transport is plane', () => {
    state.transport.vehicle = 'plane';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Transport details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/add-transportation-details-plane');
  });

  it('should call the onLinkClick method and navigate to the relevant transport details page when transport is plane', () => {
    state.transport.vehicle = 'plane';
    state.progress.progress.transportDetails = 'INCOMPLETE';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Transport details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/add-transportation-details-plane');
  });

  it('should render a link to the relevant transport details page when transport is train', () => {
    state.transport.vehicle = 'train';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Transport details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/add-transportation-details-train');
  });

  it('should call the onLinkClick method and navigate to the relevant transport details page when transport is train', () => {
    state.transport.vehicle = 'train';
    state.progress.progress.transportDetails = 'INCOMPLETE';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Transport details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/add-transportation-details-train');
  });

  it('should render a link to the relevant transport details page when transport is container vessel', () => {
    state.transport.vehicle = 'containerVessel';

    renderComponent(state);

    const link = screen.getByRole('link', { name: 'Transport details' });
    expect(link).toHaveAttribute('href', '/create-catch-certificate/document123/add-transportation-details-container-vessel');
  });

  it('should call the onLinkClick method and navigate to the relevant transport details page when transport is container vessel', () => {
    state.transport.vehicle = 'containerVessel';
    state.progress.progress.transportDetails = 'INCOMPLETE';

    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Transport details' }));

    expect(push).toHaveBeenCalledWith('/create-catch-certificate/document123/add-transportation-details-container-vessel');
  });

  it('should clear errors and navigate to the data upload page', () => {
    state.progress.progress.dataUpload = '';
    state.errors = {
      errors: [
        {
          targetName: 'products',
          text: 'commonProgressProductDetailsRequiredError',
        },
        {
          targetName: 'landings',
          text: 'ccProgressLandingDetailsRequiredError',
        },
      ],
      productsError: 'commonProgressProductDetailsRequiredError',
      landingsError: 'ccProgressLandingDetailsRequiredError',
    };
    renderComponent(state);

    userEvent.click(screen.getByRole('link', { name: 'Data upload' }));

    expect(clearErrors).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(
      '/create-catch-certificate/document123/upload-file'
    );
  });
});

describe('ProgressPage snapshot', () => {
  let wrapper;
  let originalMutationObserver;
  beforeEach(() => {
    getProgress.mockReset();
    getProgress.mockReturnValue({type: 'get_progress_success'});
    getLandingType.mockReset();
    getLandingType.mockReturnValue({type: 'GET_LANDINGS_TYPE'});
    getTransportDetails.mockReset();
    getTransportDetails.mockReturnValue({type: 'GET_TRANSPORT_DETAILS'});
    clearProgress.mockReturnValue({type: 'clear_progress_data'});
    clearTransportDetails.mockReturnValue({type: 'clearTransportDetails'});

    wrapper = renderComponent({
      progress: {
        completedSections: 7,
        progress:
        {
          dataUpload: '',
          conservation: 'COMPLETED',
          exportJourney: 'COMPLETED',
          exporter: 'COMPLETED',
          landings: 'COMPLETED',
          products: 'COMPLETED',
          reference: 'COMPLETED',
          transportDetails: 'COMPLETED',
          transportType: 'COMPLETED',
        },
        requiredSections: 7
      },
      transport: {
        vehicle: 'truck'
      },
      landingsType: {
        landingsEntryOption: 'directLanding'
      },
      errors: {}
    });

    originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MutationObserver;
  });

  afterEach(() => {
    global.MutationObserver = originalMutationObserver;
    push.mockReset();
  });

  it('should take a snapshot of the component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});