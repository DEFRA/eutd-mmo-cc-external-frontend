import React from 'react';
import { Router } from 'react-router';
import { fireEvent,render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { component as PsProgressPage } from '../../../../src/client/pages/processingStatement/PsProgressPage';
import ProgressPageExport from '../../../../src/client/pages/processingStatement/PsProgressPage';
import { getProgress, clearProgress, checkProgress, clearErrors } from '../../../../src/client/actions/progress.actions';
import { clearCopyDocument } from '../../../../src/client/actions/copy-document.actions';
import { getProcessingStatementFromRedis } from '../../../../src/client/actions';
import * as ErrorUtils from '../../../../src/client/pages/utils/errorUtils';



jest.mock('../../../../src/client/actions/progress.actions');
jest.mock('../../../../src/client/actions/copy-document.actions');
jest.mock('../../../../src/client/actions');

let mockPush;

const renderComponent = (state = {}) => {
  const history = createMemoryHistory({ initialEntries: ['/create-processing-statement/document123/progress'], });

  mockPush = jest.spyOn(history, 'push');

  const props = {
    route: {
      title: 'Create a UK processing statement - GOV.UK',
      previousUri: '/create-processing-statement/processing-statements',
      nextUri: '/create-processing-statement/:documentNumber/check-your-information',
      path: '/create-processing-statement/:documentNumber/progress',
      referenceUri: '/create-processing-statement/:documentNumber/user-reference',
      exporterUri: '/create-processing-statement/:documentNumber/exporter-details',
      consignmentDescriptionUri: '/create-processing-statement/:documentNumber/consignment-description',
      catchesUri: '/create-processing-statement/:documentNumber/catches',
      catchesAddedUri: '/create-processing-statement/:documentNumber/catches-added',
      processingPlantUri: '/create-processing-statement/:documentNumber/processing-plant',
      processingPlantAddressUri: '/create-processing-statement/:documentNumber/processing-plant-address',
      exportHealthCertificateUri: '/create-processing-statement/:documentNumber/export-health-certificate',
      exportDestinationUri: '/create-processing-statement/:documentNumber/export-destination',
      journey: 'processingStatement',
      journeyText:'processing statement'
    },
    match: {
      params: {
        documentNumber: 'document123',
      },
    },
    t: jest.fn(),
    history: {
      push: mockPush
    }
  };

  const store = configureStore()(state);

  const { container } = render(
    <Router history={history}>
      <Switch>
        <Route exact path="/create-processing-statement/processing-statements">
          <div>Processing Statement Dashboard Page</div>
        </Route>
        <Route exact path="/create-processing-statement/:documentNumber/user-reference">
          <div>Processing Statement User Reference Page</div>
        </Route>
        <Route exact path="/create-processing-statement/:documentNumber/check-your-information">
          <div>Processing Statement Summary Page</div>
        </Route>
        <Route exact path="/create-processing-statement/:documentNumber/catches-added">
          <div>Processing Statement Catches Added</div>
        </Route>
        <Route exact path="/create-processing-statement/:documentNumber/progress">
          <Provider store={store}>
            <PsProgressPage {...props} />
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
    getProgress.mockReturnValue({type: 'get_progress_success'});
    clearProgress.mockReturnValue({type: 'clear_progress_data'});
    checkProgress.mockReturnValue({type: 'check_progress_data'});
    clearCopyDocument.mockReturnValue({type: 'clear_copy_document'});
    getProcessingStatementFromRedis.mockReturnValue({ type: 'get_processing_statement' });
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          consignmentDescription: 'INCOMPLETE',
          catches: 'INCOMPLETE',
          processingPlant: 'INCOMPLETE',
          processingPlantAddress: 'INCOMPLETE',
          exportHealthCertificate: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE',
        },
        completedSections: 2,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {}
    });

    originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MutationObserver;
  });

  afterEach(() => {
    global.MutationObserver = originalMutationObserver;
    mockPush.mockReset();
  });

  it('should render an PsProgressPage component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should not redirect to another page', () => {
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should render page with the correct H1 heading', () => {
    expect(screen.getByTestId('ps-progress-heading')).toHaveTextContent(
      'Processing Statement application:'
    );
  });

  it('should render a back link', () => {
    const backLink = screen.getByText('Back');
    expect(backLink).toBeDefined();
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

    expect(await screen.findByText('Processing Statement Dashboard Page')).toBeDefined();
  });

  it('should render an application incomplete message and Check your answers and submit', () => {
    expect(screen.getByText('Application incomplete')).toBeDefined();
    expect(screen.getByText('You have completed 2 of 7 required sections.')).toBeDefined();
    expect(screen.getByText('Check your answers and submit')).toBeDefined();
  });

  it('should render an application complete message and display a Check your answers and submit', async () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          consignmentDescription: 'COMPLETE',
          catches: 'COMPLETE',
          processingPlant: 'COMPLETE',
          processingPlantAddress: 'COMPLETE',
          exportHealthCertificate: 'COMPLETE',
          exportDestination: 'COMPLETE',
        },
        completedSections: 7,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {}
    });

    expect(screen.getByText('Application completed')).toBeDefined();
    expect(screen.getByText('You have completed 7 of 7 required sections.')).toBeDefined();
    expect(screen.getAllByText('Check your answers and submit')).toBeDefined();


    await fireEvent(
      screen.getAllByText('Check your answers and submit')[1],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/create-processing-statement/document123/check-your-information');
    expect(await screen.findByText('Processing Statement Summary Page')).toBeDefined();
  });

  it('should make a service call to the back end to get the progress of the processing statement', () => {
    expect(getProgress).toHaveBeenCalledWith('document123','processingStatement');
  });

  it('should clear progress of the processing statement', () => {
    expect(clearProgress).toHaveBeenCalledWith();
  });

  it('should clear progress errors of the processing statement', () => {
    expect(clearErrors).toHaveBeenCalledWith();
  });

  it('should have an id for Exporter, Products, Processing plant and Transportation & logistics sections', () => {
    expect(screen.getByTestId('Exporter-heading')).toHaveTextContent('Exporter');
    expect(screen.getByTestId('Products-heading')).toHaveTextContent('Products');
    expect(screen.getByTestId('Processing-heading')).toHaveTextContent('Processing plant');
    expect(screen.getByTestId('TransportationAndLogistics-heading')).toHaveTextContent('Transportation & logistics');
  });

  it('should have links that take the exporter to the pages of processing statement journey', async () => {

    expect(screen.getByTestId('progress-yourReference-title')).toHaveAttribute('href', '/create-processing-statement/document123/user-reference');
    expect(screen.getByTestId('progress-exporterDetails-title')).toHaveAttribute('href', '/create-processing-statement/document123/exporter-details');
    expect(screen.getByTestId('progress-consignmentDescription-title')).toHaveAttribute('href', '/create-processing-statement/document123/consignment-description');
    expect(screen.getByTestId('progress-catchDetails-title')).toHaveAttribute('href', '/create-processing-statement/document123/catches');
    expect(screen.getByTestId('progress-processingPlant-title')).toHaveAttribute('href', '/create-processing-statement/document123/processing-plant');
    expect(screen.getByTestId('progress-processingPlantAddress-title')).toHaveAttribute('href', '/create-processing-statement/document123/processing-plant-address');
    expect(screen.getByTestId('progress-exportHealthCertificate-title')).toHaveAttribute('href', '/create-processing-statement/document123/export-health-certificate');
    expect(screen.getByTestId('progress-exportDestination-title')).toHaveAttribute('href', '/create-processing-statement/document123/export-destination');

    fireEvent(
      screen.getByText('Your reference (Optional)'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(await screen.findByText('Processing Statement User Reference Page')).toBeDefined();
  });

  it('should have links that take the exporter to the catches added page', () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'INCOMPLETE',
          reference: 'OPTIONAL',
          consignmentDescription: 'INCOMPLETE',
          catches: 'INCOMPLETE',
          processingPlant: 'INCOMPLETE',
          processingPlantAddress: 'INCOMPLETE',
          exportHealthCertificate: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE',
        },
        completedSections: 7,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {
        catches:[{
          species: 'Atlantic Cod (COD)',
          catchCertificateNumber: '1234',
          totalWeightLanded: 10,
          exportWeightBeforeProcessing: 10,
          exportWeightAfterProcessing: 10
        }],
        validationErrors:[{}],
        error:'',
        addAnotherCatch:'No',
        consignmentDescription:'cod',
        healthCertificateDate:null,
        healthCertificateNumber:null,
        personResponsibleForConsignment:null,
        plantApprovalNumber:null,
        plantName:null,
        plantAddressOne:null,
        plantBuildingName:null,
        plantBuildingNumber:null,
        plantSubBuildingName:null,
        plantStreetName:null,
        plantCounty:null,
        plantCountry:null,
        plantTownCity:null,
        plantPostcode:null,
        dateOfAcceptance:null,
        exportedTo:null,
        _plantDetailsUpdated:false
      }
    });

    const catchLink = screen.getAllByText('Catch details')[1];

    expect(catchLink).toHaveAttribute('href', '/create-processing-statement/document123/catches-added');
  });

  it('should not have links that take the exporter to the catches added page', () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'INCOMPLETE',
          reference: 'OPTIONAL',
          consignmentDescription: 'INCOMPLETE',
          catches: 'INCOMPLETE',
          processingPlant: 'INCOMPLETE',
          processingPlantAddress: 'INCOMPLETE',
          exportHealthCertificate: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE',
        },
        completedSections: 7,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {
        catches:[{
          catchCertificateNumber: '123',
          exportWeightAfterProcessing: '',
          exportWeightBeforeProcessing: '',
          id: '123-1639426803',
          scientificName: 'Coloconger raniceps',
          species: 'Coloconger raniceps (ACO)',
          totalWeightLanded: ''
        }],
        validationErrors:[{}],
        error:'',
        addAnotherCatch:'No',
        consignmentDescription:'cod',
        healthCertificateDate:null,
        healthCertificateNumber:null,
        personResponsibleForConsignment:null,
        plantApprovalNumber:null,
        plantName:null,
        plantAddressOne:null,
        plantBuildingName:null,
        plantBuildingNumber:null,
        plantSubBuildingName:null,
        plantStreetName:null,
        plantCounty:null,
        plantCountry:null,
        plantTownCity:null,
        plantPostcode:null,
        dateOfAcceptance:null,
        exportedTo:null,
        _plantDetailsUpdated:false
      }
    });

    const catchLink = screen.getAllByText('Catch details')[1];

    expect(catchLink).toHaveAttribute('href', '/create-processing-statement/document123/catches');
  });

  it('should render return to your dashboard button', () => {
    const returnToDashboardButton = screen.getByText('Return to your dashboard');
    expect(returnToDashboardButton).toBeDefined();
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

    expect(await screen.findByText('Processing Statement Dashboard Page')).toBeDefined();
  });


  it('should render an application incomplete message with no progress data', () => {
    wrapper = renderComponent({
      progress: undefined,
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {}
    });

    expect(screen.getByText('Application incomplete')).toBeDefined();
  });

  it('should display copy document notification for processing statement', () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          consignmentDescription: 'COMPLETE',
          catches: 'COMPLETE',
          processingPlant: 'COMPLETE',
          processingPlantAddress: 'COMPLETE',
          exportHealthCertificate: 'COMPLETE',
          exportDestination: 'COMPLETE',
        },
        completedSections: 7,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: { copyDocumentAcknowledged: true, voidDocumentConfirm: false, documentNumber: 'GBR-VOID-DOCUMENT' },
      processingStatement: {}
    });
    expect(screen.getByText('Important')).toBeDefined();
    expect(screen.getByText('This draft was created by copying document GBR-VOID-DOCUMENT. You are reminded that you must not use a processing statement or data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.')).toBeDefined();
  });

  it('should display copy document notification with a VOID message for processing statement', () => {
    wrapper = renderComponent({
      progress: {
        progress:
        {
          exporter: 'COMPLETED',
          reference: 'COMPLETED',
          consignmentDescription: 'COMPLETE',
          catches: 'COMPLETE',
          processingPlant: 'COMPLETE',
          processingPlantAddress: 'COMPLETE',
          exportHealthCertificate: 'COMPLETE',
          exportDestination: 'COMPLETE',
        },
        completedSections: 7,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: { copyDocumentAcknowledged: true, voidDocumentConfirm: true },
      processingStatement: {}
    });

    expect(screen.getByText('Important')).toBeDefined();
    expect(screen.getByText('This draft was created by copying a document that has now been voided. You are reminded that you must not use a processing statement or data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.')).toBeDefined();
  });

  it('should take a snapshot of the whole page', () => {
    const  container = renderComponent({
      progress: {
        progress:
        {
          exporter: 'INCOMPLETE',
          reference: 'OPTIONAL',
          consignmentDescription: 'INCOMPLETE',
          catches: 'INCOMPLETE',
          processingPlant: 'INCOMPLETE',
          processingPlantAddress: 'INCOMPLETE',
          exportHealthCertificate: 'INCOMPLETE',
          exportDestination: 'INCOMPLETE',
        },
        completedSections: 7,
        requiredSections: 7
      },
      errors: {},
      confirmCopyDocument: {},
      processingStatement: {}
    });
    
    expect(container).toMatchSnapshot();
  });

  it('should not redirect to summary page when not all required sections have been completed and checkProgress throws an error', async () => {
    checkProgress.mockRejectedValue('error');
    const submitButton = screen.getByText('Check your answers and submit');

    await fireEvent(
      submitButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(checkProgress).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should scroll to errorIsland', () => {
    const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    const submitButton = screen.getByText('Check your answers and submit');

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
      submitButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });
});

describe('ProgressPage, loadData', () => {

  const store = {
    dispatch: () => {
      return new Promise((resolve) => {
        resolve();
      });
    }
  };

  const journey = 'catchCertificate';
  const documentNumber = 'document123';

  beforeEach(() => {
    getProgress.mockReset();
    getProgress.mockReturnValue({type: 'get_progress_success'});

    getProcessingStatementFromRedis.mockReset();
    getProcessingStatementFromRedis.mockReturnValue({ type: 'get_processing_statement' });
  });

  it('should call all methods needed to load the component', async () => {
    ProgressPageExport.documentNumber = documentNumber;
    await ProgressPageExport.loadData(store, journey);

    expect(getProgress).toHaveBeenCalledTimes(1);
    expect(getProgress).toHaveBeenCalledWith(documentNumber, journey);

    expect(getProcessingStatementFromRedis).toHaveBeenCalledTimes(1);
    expect(getProcessingStatementFromRedis).toHaveBeenCalledWith(documentNumber);
  });
});
