import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MutationObserver from 'mutation-observer';
import { component as LandingsEntryPage } from '../../../../../src/client/pages/exportCertificates/landings/LandingsEntryPage';
import LandingsEntryPageExport from '../../../../../src/client/pages/exportCertificates/landings/LandingsEntryPage';
import { getLandingType, validateLandingType, dispatchSaveChangedLandingsType, clearLandingsType} from '../../../../../src/client/actions/landingsType.actions';

import * as Utils from '../../../../../src/client/pages/utils/errorUtils';


jest.mock('../../../../../src/client/actions/landingsType.actions');

const renderComponent = (state) => {

  const store = configureStore()(state);

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
      nextUri: '/create-catch-certificate/:documentNumber/progress',
      path: '/create-catch-certificate/:documentNumber/landings-entry',
      uploadFileUri: '/create-catch-certificate/:documentNumber/upload-file',
      landingsTypeConfirmationUri: '/create-catch-certificate/:documentNumber/landings-type-confirmation',
      journey: 'catchCertificate',
      landingsEntryOptions: [
        {
          label: 'Direct Landing',
          value: 'directLanding',
          name: 'landingsEntry',
          id: 'directLandingOptionEntry',
          hint: 'Recommended for UK registered fishing vessels landing and exporting their catch simultaneously in the EU (or a GB registered fishing vessel direct landing in Northern Ireland).',
        },
        {
          label: 'Manual entry',
          value: 'manualEntry',
          name: 'landingsEntry',
          id: 'manualOptionEntry',
          hint: 'Recommended for small to medium sized exports.',
        },
        {
          label: 'Upload from a CSV file',
          value: 'uploadEntry',
          name: 'landingsEntry',
          id: 'uploadOptionEntry',
          hint: 'Recommended for large exports. (Requires the set up of product favourites).',
        }
      ]
    }
  };

  const history = createMemoryHistory({ initialEntries: ['document123/landings-entry'] });

  const { container } = render(
    <Router history={history}>
      <Switch>
        <Route exact path="/create-catch-certificate/:documentNumber/add-exporter-details">
           <div>Exporter Detaiils Page</div>
        </Route>
        <Route exact path="/create-catch-certificate/catch-certificates">
           <div>Exporter Dashboard Page</div>
        </Route>
        <Route exact path="/create-catch-certificate/:documentNumber/landings-type-confirmation">
           <div>Confirm Landings Type Page</div>
        </Route>
        <Route exact path="/create-catch-certificate/:documentNumber/progress">
           <div>Catch Certificate application</div>
        </Route>
        <Route exact path="/forbidden">
           <div>Forbidden</div>
        </Route>
        <Route exact path=":documentNumber/landings-entry">
          <Provider store={store}>
              <LandingsEntryPage {...props} />
          </Provider>
        </Route>
      </Switch>
    </Router>
  );

  return container;
};

beforeEach(() => {
  getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
});

afterEach(() => {
  getLandingType.mockReset();
});

describe('LandingsEntryPage', () => {
  const defaultStore = {
    config: {
      catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
    },
    errors: {},
    landingsType: {
      landingsEntryOption: 'directLanding',
      generatedByContent: false
    }
  };

  let mockScrollToErrorIsland;
  let mockWindowScrollTo;
  let originalMutationObserver;

  beforeEach(() => {
    validateLandingType.mockReturnValue({ type: 'LANDINGS_TYPE' });
    dispatchSaveChangedLandingsType.mockReturnValue({ type: 'save_changed_landings_type' });
    clearLandingsType.mockReturnValue({tyep:'landingsType/landings_type/clear'});
    mockScrollToErrorIsland = jest.spyOn(Utils, 'scrollToErrorIsland');
    mockScrollToErrorIsland.mockReturnValue(undefined);
    mockWindowScrollTo = jest.fn()
      .mockReturnValue(undefined);

    window.scrollTo = mockWindowScrollTo;

    originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MutationObserver;
  });

  afterEach(() => {
    mockScrollToErrorIsland.mockRestore();
    mockWindowScrollTo.mockRestore();
    validateLandingType.mockRestore();
    dispatchSaveChangedLandingsType.mockRestore();

    global.MutationObserver = originalMutationObserver;
  });

  it('should render an LandingsEntry component', () => {
    const wrapper = renderComponent(defaultStore);
    expect(wrapper).toBeDefined();
  });

  it('should scroll to top', () => {
    renderComponent(defaultStore);
    expect(mockWindowScrollTo).toHaveBeenCalled();
  });

  it('should get saved landings entry option when the page loads', () => {
    renderComponent(defaultStore);
    expect(getLandingType).toHaveBeenCalled();
    expect(getLandingType).toHaveBeenCalledWith('document123');
    expect(getLandingType).toHaveBeenCalledTimes(1);
  });

  it('should clear the landings entry type', () => {
    expect(clearLandingsType).toHaveBeenCalledWith();
  });

  it('should select previous selection on landing entry page', () => {
    const wrapper = renderComponent(defaultStore);
    const directLanding = wrapper.querySelector('#directLandingOptionEntry');
    const manualEntry = wrapper.querySelector('#manualOptionEntry');
    const uploadEntry = wrapper.querySelector('#uploadOptionEntry');

    expect(directLanding.checked).toBeTruthy();
    expect(manualEntry.checked).toBeFalsy();
    expect(uploadEntry.checked).toBeFalsy();
  });

  it('should render a form element', () => {
    const wrapper = renderComponent(defaultStore);
    const form = wrapper.querySelector('form');
    expect(form).toBeDefined();
  });

  it('should render a back link component', () => {
    renderComponent(defaultStore);
    const backLink = screen.getByText('Back');
    expect(backLink).toHaveAttribute('href', '/create-catch-certificate/document123/add-exporter-details');
  });

  it('should render a page title', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('How do you want to enter your products and landings?')).toBeDefined();
  });

  it('should render all landings entry options', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Direct Landing')).toBeDefined();
    expect(screen.getByText('Manual entry')).toBeDefined();
    expect(screen.getByText('Upload from a CSV file')).toBeDefined();
  });

  it('should render all landings entry options with hints', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Recommended for UK registered fishing vessels landing and exporting their catch simultaneously in the EU (or a GB registered fishing vessel direct landing in Northern Ireland).')).toBeDefined();
    expect(screen.getByText('Recommended for small to medium sized exports.')).toBeDefined();
    expect(screen.getByText('Recommended for large exports. (Requires the set up of product favourites).')).toBeDefined();
  });

  it('should select the direct landing radio option', () => {
    const wrapper = renderComponent(defaultStore);
    const directLanding = wrapper.querySelector('#directLandingOptionEntry');
    const manualEntry = wrapper.querySelector('#manualOptionEntry');
    const uploadEntry = wrapper.querySelector('#uploadOptionEntry');

    fireEvent(directLanding, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(directLanding.checked).toBeTruthy();
    expect(manualEntry.checked).toBeFalsy();
    expect(uploadEntry.checked).toBeFalsy();
  });

  it('should select the manual entry radio option', () => {
    const wrapper = renderComponent(defaultStore);
    const directLanding = wrapper.querySelector('#directLandingOptionEntry');
    const manualEntry = wrapper.querySelector('#manualOptionEntry');
    const uploadEntry = wrapper.querySelector('#uploadOptionEntry');

    fireEvent(manualEntry, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(manualEntry.checked).toBeTruthy();
    expect(directLanding.checked).toBeFalsy();
    expect(uploadEntry.checked).toBeFalsy();
  });

  it('should select the upload entry radio option', () => {
    const wrapper = renderComponent(defaultStore);
    const directLanding = wrapper.querySelector('#directLandingOptionEntry');
    const manualEntry = wrapper.querySelector('#manualOptionEntry');
    const uploadEntry = wrapper.querySelector('#uploadOptionEntry');

    fireEvent(uploadEntry, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(uploadEntry.checked).toBeTruthy();
    expect(manualEntry.checked).toBeFalsy();
    expect(directLanding.checked).toBeFalsy();
  });

  it('should have a details component', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('What is a CSV file?')).toBeDefined();
    expect(screen.getByText('A CSV file is a text file that uses commas to separate its values. Each value in the file is a data field and each line is a data record.')).toBeDefined();
    expect(screen.getByText('Spreadsheets and some software can usually export their data to a CSV file.')).toBeDefined();
  });

  it('should have a Save and continue button', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Save and continue')).toBeDefined();
  });

  it('should call the Save and continue button handler and navigate to the progress page', async () => {
    const wrapper = renderComponent(defaultStore);
    const saveAndContinueBtn = screen.getByText('Save and continue');
    const directLanding = wrapper.querySelector('#directLandingOptionEntry');

    fireEvent(directLanding, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    fireEvent(saveAndContinueBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(validateLandingType).toHaveBeenCalledWith('directLanding', 'document123');
    expect(await screen.findByText('Catch Certificate application')).toBeDefined();
  });

  it('should call the Save and continue button handler and navigate to the landings confirmation uri', async () => {
    const wrapper = renderComponent(defaultStore);
    const saveAndContinueBtn = screen.getByText('Save and continue');
    const uploadFile = wrapper.querySelector('#uploadOptionEntry');

    fireEvent(uploadFile, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    fireEvent(saveAndContinueBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(dispatchSaveChangedLandingsType).toHaveBeenCalledWith('uploadEntry');
    expect(await screen.findByText('Confirm Landings Type Page')).toBeDefined();
  });

  it('should call the Save and continue button handler and navigate to the progress page when landing type is initally undefined', async () => {
    const wrapper = renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {},
      landingsType: {
        landingsEntryOption: null,
        generatedByContent: false
      }
    });
    const saveAndContinueBtn = screen.getByText('Save and continue');
    const directLanding = wrapper.querySelector('#directLandingOptionEntry');

    fireEvent(directLanding, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    fireEvent(saveAndContinueBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(validateLandingType).toHaveBeenCalledWith('directLanding', 'document123');
    expect(await screen.findByText('Catch Certificate application')).toBeDefined();
  });

  it('should call the Save and continue button handler and navigate to the progress page when landings entry is upload entry', async () => {
    renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {},
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    });

    const saveAndContinueBtn = screen.getByText('Save and continue');

    fireEvent(saveAndContinueBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(validateLandingType).toHaveBeenCalledWith('uploadEntry', 'document123');
    expect(await screen.findByText('Catch Certificate application')).toBeDefined();
  });

  it('should call the Save and continue button handler and catch any thrown errors', () => {
    renderComponent(defaultStore);
    validateLandingType.mockImplementation(() => {
      throw new Error('Bad Request');
    });

    const saveAndContinueBtn = screen.getByText('Save and continue');

    fireEvent(saveAndContinueBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    }));

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });


  it('should call handle back link click handler', () => {
    renderComponent(defaultStore);
    const backLink = screen.getByText('Back');

    fireEvent(backLink, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(screen.findByText('Exporter Detaiils Page')).toBeDefined();
  });

  it('should render a help link component', () => {
    renderComponent(defaultStore);
    const helpLink = screen.getByText('Get help exporting fish from the UK (gov.uk)');
    expect(helpLink).toHaveAttribute('href', 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal');
  });

  it('should render a help link component with hidden text', () => {
    renderComponent(defaultStore);
    const helpSpan = screen.getByText('(opens in new tab)');
    expect(helpSpan).toBeDefined();
  });

  it('should NOT render notification banner if landings details have not been selected before the data upload feature was introduced', () => {
    renderComponent(defaultStore);
    const notificationBanner = screen.queryByText('This new page offers ways to enter products and landings for different types of export. Select an option to continue');

    expect(notificationBanner).toBeFalsy();
  });

  it('should render notification banner if landings details have been selected before the data upload feature was introduced', () => {
    renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {},
      landingsType: {
        landingsEntryOption: 'directLanding',
        generatedByContent: true
      }
    });

    const notificationBanner = screen.getByText('This new page offers ways to enter products and landings for different types of export. Select an option to continue');

    expect(notificationBanner).toBeDefined();
  });

  it('should render notification banner if redirected from copy confirm document page', () => {
    renderComponent({
      ...defaultStore,
      confirmCopyDocument: {
        copyDocumentAcknowledged: true,
        voidDocumentConfirm: false,
        documentNumber : 'XYZ-1234'
      },
    });

    const notificationBanner = screen.getByText('This draft was created by copying document XYZ-1234. You are reminded that you must not use a catch certificate or landing data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.');

    expect(notificationBanner).toBeDefined();
  });

  it('should render notification banner if redirected from copy confirm document page and void original document', () => {
    renderComponent({
      ...defaultStore,
      confirmCopyDocument: {
        copyDocumentAcknowledged: true,
        voidDocumentConfirm: true
      },
    });

    const notificationBanner = screen.getByText('This draft was created by copying a document that has now been voided. You are reminded that you must not use a catch certificate or landing data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.');

    expect(notificationBanner).toBeDefined();
  });

  it('should forbid access to the landings entry page', async () => {
    renderComponent({
      ...defaultStore,
      landingsType: {
        unauthorised: true
      }
    });

    expect(await screen.findByText('Forbidden')).toBeDefined();
  });

  it('should take a snapshot of the whole page', ()=> {
    const container = renderComponent(defaultStore);
    expect(container).toMatchSnapshot();
  });
});

describe('LandingsEntryPage, with error', () => {
  let mockOnHandleErrorClick;
  let mockWindowScrollTo;

  beforeEach(() => {
    const state = {
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {
        landingsEntryOptionError: 'Select a landings entry option',
        errors: [{ targetName: 'landingEntry', text: 'Select a landings entry option'}]
      },
      landingsType: {}
    };

    const store = configureStore()(state);

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
        nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
        path: '/create-catch-certificate/:documentNumber/landings-entry',
        journey: 'catchCertificate',
        landingsEntryOptions: null
      }
    };

    mockOnHandleErrorClick = jest.spyOn(Utils, 'onHandleErrorClick');
    mockWindowScrollTo = jest.fn()
      .mockReturnValue(undefined);

    window.scrollTo = mockWindowScrollTo;

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsEntryPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(()=> {
    mockOnHandleErrorClick.mockRestore();
    mockWindowScrollTo.mockRestore();
  });

  it('should render a page with an error link in error island and an error within the multi choice component', () => {
    expect(screen.getAllByText('Select a landings entry option')).toHaveLength(2);
  });


  it('should call error link handler when clicked', () => {
    const errorLink = screen.getAllByText('Select a landings entry option')[0];

    fireEvent(errorLink, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(mockOnHandleErrorClick).toHaveBeenCalled();
  });

});

describe('LandingsEntryPage, load data', () => {
  const store = {
    dispatch: jest.fn()
  };

  const journey = 'catchCertificate';
  const documentNumber = 'some-document-number';

  it('will call all methods needed to load the component', () => {
    LandingsEntryPageExport.documentNumber = documentNumber;
    LandingsEntryPageExport.loadData(store, journey);

    expect(getLandingType).toHaveBeenCalled();
    expect(getLandingType).toHaveBeenCalledWith(documentNumber);
  });
});