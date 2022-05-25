import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { component as UploadFilePage } from '../../../../src/client/pages/exportCertificates/UploadFilePage';
import  UploadFilePageExport  from '../../../../src/client/pages/exportCertificates/UploadFilePage';

import * as Utils from '../../../../src/client/pages/utils/errorUtils';
import { clearLandings, saveLandings, uploadLandingsFile } from '../../../../src/client/actions/upload-file.actions';
import userEvent from '@testing-library/user-event';
import { getLandingType } from '../../../../src/client/actions/landingsType.actions';


jest.mock('../../../../src/client/actions/upload-file.actions');
jest.mock('../../../../src/client/actions/landingsType.actions');

let globalGetByTestId;

const renderComponent = (state) => {

  const store = configureStore()(state);

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/create-catch-certificate/:documentNumber/landings-entry',
      nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
      landingsEntryUri: '/create-catch-certificate/:documentNumber/landings-entry',
      path: '/create-catch-certificate/:documentNumber/upload-file',
      journey: 'catchCertificate',
      dashboardUri: '/create-catch-certificate/catch-certificates',
      progressUri: '/create-catch-certificate/:documentNumber/progress'
    }
  };

  const history = createMemoryHistory({ initialEntries: ['document123/upload-file'] });

  const { container, getByTestId } = render(
    <Router history={history}>
      <Switch>
        <Route exact path="/create-catch-certificate/:documentNumber/landings-entry">
          <div>Landings Entry Page</div>
        </Route>
        <Route exact path="/create-catch-certificate/catch-certificates">
          <div>Exporter Dashboard Page</div>
        </Route>
        <Route exact path="/create-catch-certificate/:documentNumber/landings-entry">
          <div>Landings Entry Option Page</div>
        </Route>
        <Route exact path=":documentNumber/upload-file">
          <Provider store={store}>
            <UploadFilePage {...props} />
          </Provider>
        </Route>
      </Switch>
    </Router>
  );

  globalGetByTestId = getByTestId;
  return container;
};

describe('UploadFilePage', () => {

  const mockScrollToErrorIsland = jest.spyOn(Utils, 'scrollToErrorIsland');
  mockScrollToErrorIsland.mockReturnValue(null);


  const defaultStore = {
    config: {
      catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
    },
    errors: {
      fileError: 'ccUploadFilePageErrorFileRequired',
      errors: [{ targetName: 'file', text: 'ccUploadFilePageErrorFileRequired'}]
    },
    uploadedLandings: {
      landings: [
        {
          rowNumber: 1,
          originalRow: 'PRD003,21/07/2021,FAO27,BS16,20',
          productId: 'PRD003',
          product: {
            commodity_code: '03061210',
            commodity_code_description: 'commodity-code-description',
            presentation: 'WHO',
            presentationLabel: 'Whole',
            scientificName: undefined,
            species: 'Atlantic cod',
            speciesCode: 'LBE',
            state: 'FRO',
            stateLabel: 'Frozen',
          },
          landingDate: '19/07/2021',
          faoArea: 'FAO27',
          vessel: {
            pln: 'BS16',
            vesselName: 'CALAMARI'
          },
          vesselsPln: 'BS16',
          exportWeight: '20',
          errors: []
        },
        {
          rowNumber: 2,
          originalRow: 'PRD621,19/07/2021,FAO27,PH1100,10',
          productId: 'PRD621',
          product: {
            commodity_code: '03061210',
            commodity_code_description: 'commodity-code-description',
            presentation: 'WHO',
            presentationLabel: 'Whole',
            scientificName: undefined,
            species: 'Atlantic cod',
            speciesCode: 'LBE',
            state: 'FRE',
            stateLabel: 'Fresh',
          },
          landingDate: '19/07/2021',
          faoArea: 'FAO27',
          vessel: {
            pln: 'PH1100',
            vesselName: 'WIRON 5'
          },
          vesselsPln: 'PH1100',
          exportWeight: '10',
          errors: ['error.vessel.label.any.empty', 'error.dateLanded.date.isoDate']
        },
      ],
    },
     landingsType: {
      landingsEntryOption: 'uploadEntry',
      generatedByContent: false
    }
  };

  beforeEach(() => {
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });

    mockScrollToErrorIsland.mockReset();
    mockScrollToErrorIsland.mockImplementation(() => null);
  });

  afterEach(() => {
    getLandingType.mockRestore();
    uploadLandingsFile.mockRestore();
    saveLandings.mockRestore();
  });

  it('should render an UploadFile component', () => {
    const wrapper = renderComponent(defaultStore);
    expect(wrapper).toBeDefined();
  });

  it('should render an error island and an error in the FileUpload component', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('There is a problem')).toBeDefined();
    const errorLinks = screen.getAllByText('Upload a valid CSV file to continue');
    expect(errorLinks).toHaveLength(2);
  });

  it('should render an error island  component when there is a dynamic error that has a param', () => {
    const storeWithDynamicError = {
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {
        fileError: 'ccUploadFilePageErrorMaxFileSize-10',
        errors: [{ targetName: 'file', text: 'ccUploadFilePageErrorMaxFileSize-10'}]
      },
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD003,21/07/2021,FAO27,BS16,20',
            productId: 'PRD003',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'BS16',
              vesselName: 'CALAMARI'
            },
            vesselsPln: 'BS16',
            exportWeight: '20',
            errors: []
          },
          {
            rowNumber: 2,
            originalRow: 'PRD621,19/07/2021,FAO27,PH1100,10',
            productId: 'PRD621',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRE',
              stateLabel: 'Fresh',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'PH1100',
              vesselName: 'WIRON 5'
            },
            vesselsPln: 'PH1100',
            exportWeight: '10',
            errors: ['error.vessel.label.any.empty', 'error.dateLanded.date.isoDate']
          },
        ],
      },
       landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    };

    renderComponent(storeWithDynamicError);
    expect(screen.getByText('There is a problem')).toBeDefined();
    const errorLinks = screen.getAllByText('The selected file must be smaller than 10KB');
    expect(errorLinks).toHaveLength(2);
  });

  it('should render a product favourites link', () => {
    renderComponent(defaultStore);
    const favouritesLink = screen.getByText('product favourites.');
    expect(favouritesLink).toHaveAttribute('href', '/manage-favourites');
  });

  it('should render a upload guidance link', () => {
    renderComponent(defaultStore);
    const favouritesLink = screen.getByText('upload guidance');
    expect(favouritesLink).toHaveAttribute('href', '/upload-guidance');
  });

  it('should render a H1 heading', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Upload products and landings')).toBeDefined();
  });

  it('should get saved landings entry option when the page loads', () => {
    renderComponent(defaultStore);
    expect(getLandingType).toHaveBeenCalled();
    expect(getLandingType).toHaveBeenCalledWith('document123');
    expect(getLandingType).toHaveBeenCalledTimes(1);
  });

  it('should redirect to dashboard page when landingsEntryOption is not equal to uploadEntry', async () => {
    renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {
        fileError: 'Select a file to upload',
        errors: [{ targetName: 'file', text: 'Select a file to upload'}]
      },
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD003,21/07/2021,FAO27,BS16,20',
            productId: 'PRD003',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'BS16',
              vesselName: 'CALAMARI'
            },
            vesselsPln: 'BS16',
            exportWeight: '20',
            errors: []
          },
          {
            rowNumber: 2,
            originalRow: 'PRD621,19/07/2021,FAO27,PH1100,10',
            productId: 'PRD621',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRE',
              stateLabel: 'Fresh',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'PH1100',
              vesselName: 'WIRON 5'
            },
            vesselsPln: 'PH1100',
            exportWeight: '10',
            errors: ['error.vessel.label.any.empty', 'error.dateLanded.date.isoDate']
          },
        ],
      },
       landingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false
      }
    });

    expect(await screen.findByText('Exporter Dashboard Page')).toBeDefined();
  });

  it('should redirect to Landings Entry page when landingsEntryOption is undefined', async () => {
    renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {
        fileError: 'Select a file to upload',
        errors: [{ targetName: 'file', text: 'Select a file to upload'}]
      },
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD003,21/07/2021,FAO27,BS16,20',
            productId: 'PRD003',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'BS16',
              vesselName: 'CALAMARI'
            },
            vesselsPln: 'BS16',
            exportWeight: '20',
            errors: []
          },
          {
            rowNumber: 2,
            originalRow: 'PRD621,19/07/2021,FAO27,PH1100,10',
            productId: 'PRD621',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRE',
              stateLabel: 'Fresh',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'PH1100',
              vesselName: 'WIRON 5'
            },
            vesselsPln: 'PH1100',
            exportWeight: '10',
            errors: ['error.vessel.label.any.empty', 'error.dateLanded.date.isoDate']
          },
        ],
      },
       landingsType: {
        landingsEntryOption: null,
        generatedByContent: false
      }
    });

    expect(await screen.findByText('Landings Entry Page')).toBeDefined();
  });

  it('should render a H2 heading with test ids', () => {
    renderComponent(defaultStore);

    expect(screen.getByText('Guidance')).toBeDefined();
    expect(screen.getByText('Guidance')).toHaveAttribute('data-testid', 'guidance-heading');
    expect(screen.getByText('File upload')).toBeDefined();
    expect(screen.getByText('File upload')).toHaveAttribute('data-testid', 'file-upload-heading');
    expect(screen.getByText('Upload results')).toBeDefined();
    expect(screen.getByText('Upload results')).toHaveAttribute('data-testid', 'upload-results-label');
  });

  it('should render a WarningText section with test id', () => {
    renderComponent(defaultStore);
    const warningText = screen.getByText((content) => content.startsWith('To upload products and landings, you will need to read and understand'));

    expect(warningText).toBeDefined();
    expect(screen.getByTestId('warning-message')).toBeDefined();
  });

  it('should render advice section for failed upload with test ids', () => {
    renderComponent(defaultStore);

    expect(screen.getByTestId('validation-failed-paragraph')).toBeDefined();
    expect(screen.getByTestId('validation-failed-advice-one')).toBeDefined();
    expect(screen.getByTestId('validation-failed-advice-two')).toBeDefined();
  });

  it('should render a file upload component B', () => {
    renderComponent(defaultStore);
    const inputNode = globalGetByTestId('productCsvFileUpload');
    expect(inputNode).toBeDefined();
    expect(inputNode).toHaveTextContent('Upload the CSV file from your device');
    expect(inputNode.querySelector('input')).toBeDefined();
    expect(inputNode.querySelector('input')).toHaveAttribute('accept', '.csv');
  });

  it('should choose file to upload', () => {
    renderComponent(defaultStore);
    const inputNode = globalGetByTestId('productCsvFileUpload');
    const file = new File(['hello'], 'sample.csv', {type: 'text/csv'});
    const input = inputNode.querySelector('input');

    userEvent.upload(inputNode, file);
    expect(input.files[0]).toStrictEqual(file);
    expect(input.files.item(0)).toStrictEqual(file);
    expect(input.files).toHaveLength(1);
    expect(uploadLandingsFile).toHaveBeenCalledWith(input.files[0], 'document123');
  });

  it('should not do anything if the user does not select a file to upload', () => {
    renderComponent(defaultStore);
    const inputNode = globalGetByTestId('productCsvFileUpload');
    const input = inputNode.querySelector('input');
    fireEvent.change(input, {target: {value: undefined}});
    expect(input.files[0]).toStrictEqual(undefined);
    expect(input.files).toHaveLength(0);
    expect(uploadLandingsFile).not.toHaveBeenCalled();
  });

  it('should scroll to error island if error thrown whilst uploading', () => {
    renderComponent(defaultStore);
    uploadLandingsFile.mockImplementation(() => new Error());

    const inputNode = globalGetByTestId('productCsvFileUpload');
    const file = new File(['hello'], 'sample.csv', {type: 'text/csv'});

    userEvent.upload(inputNode, file);

    expect(uploadLandingsFile).toHaveBeenCalled();
    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });

  it('should clear validated uploads', () => {
    renderComponent(defaultStore);
    const clearUploadBtn = screen.getByText('Clear the upload');
    const inputNode = globalGetByTestId('productCsvFileUpload');
    const file = new File(['hello'], 'sample.csv', {type: 'text/csv'});
    const input = inputNode.querySelector('input');

    userEvent.upload(inputNode, file);

    fireEvent(clearUploadBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(clearLandings).toHaveBeenCalled();
    expect(input.value).toBe('');
  });

  it('should clear validated uploads with no errors', () => {
    renderComponent(defaultStore);
    const mockQuerySelector = jest.spyOn(document, 'querySelector')
      .mockReturnValue(null);

    const clearUploadBtn = screen.getByText('Clear the upload');
    const inputNode = globalGetByTestId('productCsvFileUpload');
    const file = new File(['hello'], 'sample.csv', {type: 'text/csv'});

    userEvent.upload(inputNode, file);

    fireEvent(clearUploadBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(clearLandings).toHaveBeenCalled();
    mockQuerySelector.mockRestore();
  });

  it('should render a clear upload button', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Clear the upload')).toBeDefined();
  });

  it('should go to the previous uri', () => {
    renderComponent(defaultStore);
    const clearUploadsBtn = screen.getByText('Cancel');

    fireEvent(clearUploadsBtn, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(screen.getByText('Landings Entry Page')).toBeDefined();
  });

  it('should render a table', () => {
    renderComponent(defaultStore);
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  it('should render a table with three columns', () => {
    renderComponent(defaultStore);
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
  });

  it('should render a table with three including the header of the table', () => {
    renderComponent(defaultStore);
    expect(screen.getByTestId('PRD621')).toHaveTextContent('PRD621,19/07/2021,FAO27,PH1100,10');
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('should render a table with a Failed text when there is an error', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('FAILED')).toBeInTheDocument();
  });

  it('should render a table with an error message row', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Select a vessel from the list')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid date landed')).toBeInTheDocument();
  });

  it('should render a table with an error message row of date can not be more than 7 days', () => {

    const initialStore = {
      config: {
        catchCertHelpUrl:
          'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal',
      },
      errors: {},
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD621,19/07/2021,FAO27,PH1100,10',
            productId: 'PRD621',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRE',
              stateLabel: 'Fresh',
            },
            landingDate: '19/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'PH1100',
              vesselName: 'WIRON 5',
            },
            vesselsPln: 'PH1100',
            exportWeight: '10',
            errors: [
              'error.dateLanded.date.missing',
              { key: 'error.dateLanded.date.max', params: [7] },
            ],
          },
        ],
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false,
      },
    };

    renderComponent(initialStore);
    expect(screen.getByText('Date landed is missing')).toBeInTheDocument();
    expect(
      screen.getByText('Date landed can be no more than 7 days in the future')
    ).toBeInTheDocument();
  });

  it('should render a cancel button', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Cancel')).toBeDefined();
  });

  it('should render a Save and continue button', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('Save and continue')).toBeDefined();
  });

  it('should render Upload instruction text', () => {
    renderComponent(defaultStore);
    expect(screen.getByText('If any rows in your upload fail validation, you can:')).toBeDefined();
    expect(screen.getByText('Correct the data in the original CSV file, clear the uploaded data then re-upload the updated CSV file, or')).toBeDefined();
    expect(screen.getByText('Make a note of the failed landings, click save and continue, then add landings manually or upload a new file.')).toBeDefined();
  });

  it('should render a back link component', () => {
    renderComponent(defaultStore);
    const backLink = screen.getByText('Back');
    expect(backLink).toHaveAttribute('href', '/create-catch-certificate/:documentNumber/landings-entry');
  });

  it('should call handle back link click handler', () => {
    renderComponent(defaultStore);
    const backLink = screen.getByText('Back');

    fireEvent(backLink, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(screen.getByText('Landings Entry Page')).toBeDefined();
  });

  it('should render a help link component', () => {
    renderComponent(defaultStore);
    const helpLink = screen.getByText('Get help exporting fish from the UK (gov.uk)');
    expect(screen.getByText('Need help?')).toBeDefined();
    expect(helpLink).toHaveAttribute('href', 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal');
  });

  it('should render a help link component with hidden text', () => {
    renderComponent(defaultStore);
    const helpSpan = screen.getAllByText('(opens in new tab)');
    expect(helpSpan).toHaveLength(1);
  });

  it('should render a help link same tab component with hidden text', () => {
    renderComponent(defaultStore);
    const helpSpan = screen.getAllByText('(opens in same tab)');
    expect(helpSpan).toHaveLength(2);
  });

  it('should call handler to save landings within uploaded file', () => {
    renderComponent(defaultStore);
    const saveAndContinueButton = screen.getByText('Save and continue');

    fireEvent(saveAndContinueButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    const expected = {
      file: [
        {
          rowNumber: 1,
          originalRow: 'PRD003,21/07/2021,FAO27,BS16,20',
          productId: 'PRD003',
          product: {
            commodity_code: '03061210',
            commodity_code_description: 'commodity-code-description',
            presentation: 'WHO',
            presentationLabel: 'Whole',
            scientificName: undefined,
            species: 'Atlantic cod',
            speciesCode: 'LBE',
            state: 'FRO',
            stateLabel: 'Frozen',
          },
          landingDate: '19/07/2021',
          faoArea: 'FAO27',
          vessel: {
            pln: 'BS16',
            vesselName: 'CALAMARI'
          },
          vesselsPln: 'BS16',
          exportWeight: '20',
          errors: []
        },
        {
          rowNumber: 2,
          originalRow: 'PRD621,19/07/2021,FAO27,PH1100,10',
          productId: 'PRD621',
          product: {
            commodity_code: '03061210',
            commodity_code_description: 'commodity-code-description',
            presentation: 'WHO',
            presentationLabel: 'Whole',
            scientificName: undefined,
            species: 'Atlantic cod',
            speciesCode: 'LBE',
            state: 'FRE',
            stateLabel: 'Fresh',
          },
          landingDate: '19/07/2021',
          faoArea: 'FAO27',
          vessel: {
            pln: 'PH1100',
            vesselName: 'WIRON 5'
          },
          vesselsPln: 'PH1100',
          exportWeight: '10',
          errors: ['error.vessel.label.any.empty', 'error.dateLanded.date.isoDate']
        },
      ],
      currentUri: '/create-catch-certificate/document123/upload-file'
    };

    expect(saveLandings).toHaveBeenCalled();
    expect(saveLandings).toHaveBeenCalledWith(expected, 'document123');
  });

  it('should call handler to save landings and catch any errors', () => {
    renderComponent(defaultStore);
    saveLandings.mockImplementation(() => new Error());

    const saveAndContinueButton = screen.getByText('Save and continue');

    fireEvent(saveAndContinueButton, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(saveLandings).toHaveBeenCalled();
    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });

  it('should render a page with all available links', () => {
    renderComponent(defaultStore);
    expect(screen.getAllByRole('link')).toHaveLength(6);
  });

  it('should clear uploaded landings when component unmounts', () => {
    expect(clearLandings).toHaveBeenCalled();
  });

  it('should render a back to progress page link component', () => {
    renderComponent(defaultStore);
    const backLink = screen.getByText('Back to Your Progress');
    expect(backLink).toHaveAttribute('href', '/create-catch-certificate/document123/progress');
  });

  it('should take a snapshot of the whole page', () => {
    const container = renderComponent(defaultStore);
    expect(container).toMatchSnapshot();
  });
});

describe('UploadFilePage, with no errors', () => {

  beforeEach(() => {
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });

    const state = {
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD047,21/07/2021,FAO27,BS16,30',
            productId: 'PRD047',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
            },
            landingDate: '21/07/2021',
            faoArea: 'FAO27',
            vessel: {
              pln: 'BS16',
              vesselName: 'CALAMARI'
            },
            vesselsPln: 'BS16',
            exportWeight: '30',
            errors: []
          }
        ]
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/:documentNumber/some-back-uri',
        nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
        landingsEntryUri: '/create-catch-certificate/:documentNumber/landings-entry',
        path: ':documentNumber/upload-file',
        journey: 'catchCertificate',
        dashboardUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadFilePage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });


  it('should render a page without an error link', () => {
    expect(screen.getAllByRole('link')).toHaveLength(5);
  });

  it('should render a table', () => {
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  it('should render a table with three columns', () => {
    expect(screen.getByText('Row')).toBeDefined();
    expect(screen.getByText('Data')).toBeDefined();
    expect(screen.getByText('Result')).toBeDefined();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
  });

  it('should render a table with two rows including the header of the table', () => {
    expect(screen.getByTestId('PRD047')).toHaveTextContent('PRD047,21/07/2021,FAO27,BS16,30');
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
});

describe('UploadFilePage, with no product', () => {

  beforeEach(() => {
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });

    const state = {
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD047,21/07/2021,FAO27,BS16,30',
            productId: 'PRD047',
            landingDate: '21/07/2021',
            faoArea: 'FAO27',
            vesselsPln: 'BS16',
            vessel: {
              pln: 'BS16',
              vesselName: 'Vessel Name'
            },
            exportWeight: '30',
            errors: []
          }
        ]
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/:documentNumber/some-back-uri',
        nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
        landingsEntryUri: '/create-catch-certificate/:documentNumber/landings-entry',
        path: ':documentNumber/upload-file',
        journey: 'catchCertificate',
        dashboardUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadFilePage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render a table', () => {
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  it('should render a table with three columns', () => {
    expect(screen.getByText('Row')).toBeDefined();
    expect(screen.getByText('Data')).toBeDefined();
    expect(screen.getByText('Result')).toBeDefined();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
  });

  it('should render a table with a single title row', () => {
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

});

describe('UploadFilePage, with no vessel', () => {

  beforeEach(() => {
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });

    const state = {
      uploadedLandings: {
        landings: [
          {
            rowNumber: 1,
            originalRow: 'PRD047,21/07/2021,FAO27,BS16,30',
            productId: 'PRD047',
            landingDate: '21/07/2021',
            faoArea: 'FAO27',
            vesselsPln: 'BS16',
            product: {
              commodity_code: '03061210',
              commodity_code_description: 'commodity-code-description',
              presentation: 'WHO',
              presentationLabel: 'Whole',
              scientificName: undefined,
              species: 'Atlantic cod',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
            },
            exportWeight: '30',
            errors: []
          }
        ]
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/:documentNumber/some-back-uri',
        nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
        landingsEntryUri: '/create-catch-certificate/:documentNumber/landings-entry',
        path: ':documentNumber/upload-file',
        journey: 'catchCertificate',
        dashboardUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadFilePage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render a table', () => {
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  it('should render a table with three columns', () => {
    expect(screen.getByText('Row')).toBeDefined();
    expect(screen.getByText('Data')).toBeDefined();
    expect(screen.getByText('Result')).toBeDefined();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
  });

  it('should render a table with a single title row', () => {
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

});

describe('Show success Notification', () => {

  beforeEach(() => {
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });
  });

  it('should not show the notification', () => {

    const landings = [];

    let props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/:documentNumber/some-back-uri',
        nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
        landingsEntryUri: '/create-catch-certificate/:documentNumber/landings-entry',
        path: ':documentNumber/upload-file',
        journey: 'catchCertificate',
        dashboardUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      }
    };

    const state = {
      uploadedLandings:{landings: landings},
      showNotification: true,
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    };

    const store = configureStore()(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadFilePage {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('rows uploaded successfully', {exact: false})).toEqual(null);
  });

  it('should show the notification', () => {
    const landings = [
      {
        rowNumber: 1,
        originalRow: 'PRD003,21/07/2021,FAO27,PLN3,300',
        productId: 'PRD047',
        product: {
          commodity_code: '03061210',
          commodity_code_description: 'commodity-code-description',
          presentation: 'WHO',
          presentationLabel: 'Whole',
          scientificName: null,
          species: 'Atlantic cod',
          speciesCode: 'LBE',
          state: 'FRO',
          stateLabel: 'Frozen',
        },
        landingDate: '19/07/2021',
        faoArea: 'FAO27',
        vessel: {
          pln: 'BS16',
          vesselName: 'CALAMARI'
        },
        exportWeight: '10.00',
        errors: []
      },
      {
        rowNumber: 2,
        originalRow: 'PRD001,19/07/2021,FAO27,PLN1,100',
        productId: 'PRD621',
        product: {
          commodity_code: '03061210',
          commodity_code_description: 'commodity-code-description',
          presentation: 'WHO',
          presentationLabel: 'Whole',
          scientificName: null,
          species: 'Atlantic cod',
          speciesCode: 'LBE',
          state: 'FRE',
          stateLabel: 'Fresh',
        },
        landingDate: '19/07/2021',
        faoArea: 'FAO27',
        vessel: {
          pln: 'BS16',
          vesselName: 'CALAMARI'
        },
        exportWeight: '10.00',
        errors: ['error.vessel.label.any.empty']
      },
    ];
    let props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/:documentNumber/some-back-uri',
        nextUri: '/create-catch-certificate/:documentNumber/some-next-uri',
        landingsEntryUri: '/create-catch-certificate/:documentNumber/landings-entry',
        path: ':documentNumber/upload-file',
        journey: 'catchCertificate',
        dashboardUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progressUri'
      }
    };
    const state = {
      uploadedLandings:{landings: landings},
      showNotification: true,
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    };
    const store = configureStore()(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadFilePage {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('rows uploaded successfully', {exact: false})).toBeDefined();
  });
});

describe('UploadFilePage, load data', () => {

  const store = {
    dispatch: jest.fn()
  };

  const journey = 'catchCertificate';
  const documentNumber = 'document123';

  beforeEach(() => {
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });
  });

  afterEach(() => {
    getLandingType.mockRestore();
  });

  it('will call all methods needed to load the component', () => {

    UploadFilePageExport.documentNumber = documentNumber;

    UploadFilePageExport.loadData(store, journey);

    expect(getLandingType).toHaveBeenCalled();
    expect(getLandingType).toHaveBeenCalledWith('document123');
  });
});

describe('Display File upload in progress notification', () => {
  const mockScrollToField = jest.spyOn(Utils, 'scrollToField');
  mockScrollToField.mockReturnValue(null);

  beforeEach(() => {
    saveLandings.mockReturnValue({ type: 'save_landing_rows' });
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
    uploadLandingsFile.mockReturnValue({ type: 'upload_landing_rows' });
    clearLandings.mockReturnValue({ type: 'clear_landings_rows' });

    mockScrollToField.mockReset();
    mockScrollToField.mockImplementation(() => null);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the please wait for your file to be validated and uploaded notification when uploading a file', async () => {

    renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {},
      uploadedLandings: {
        landings: [],
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    });

    const inputNode = globalGetByTestId('productCsvFileUpload');
    const file = new File(['hello'], 'sample.csv', { type: 'text/csv' });
    userEvent.upload(inputNode, file);

    await waitFor(() => expect(screen.getByText('please wait for your file to be validated and uploaded', {exact: false})).toBeInTheDocument());
    expect(await uploadLandingsFile).toHaveBeenCalled();
    expect(clearLandings).toHaveBeenCalled();
    expect(mockScrollToField).toHaveBeenCalledWith('root');
  });

  it('should render file upload in progress notification when uploading a second file and should clear the landings of the first file', async () => {

    renderComponent({
      config: {
        catchCertHelpUrl: 'https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal'
      },
      errors: {},
      uploadedLandings: {
        landings: [],
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      }
    });

    const inputNode = globalGetByTestId('productCsvFileUpload');
    const file1 = new File(['upload file 1'], 'sample1.csv', { type: 'text/csv' });
    const file2 = new File(['upload file 2'], 'sample2.csv', { type: 'text/csv' });

    userEvent.upload(inputNode, file1);

    await waitFor(() => expect(screen.getByText('please wait for your file to be validated and uploaded', {exact: false})).toBeInTheDocument());
    expect(await uploadLandingsFile).toHaveBeenCalled();
    expect(clearLandings).toHaveBeenCalled();
    expect(mockScrollToField).toHaveBeenCalledWith('root');

    userEvent.upload(inputNode, file2);

    await waitFor(() => expect(screen.getByText('please wait for your file to be validated and uploaded', {exact: false})).toBeInTheDocument());
    expect(await uploadLandingsFile).toHaveBeenCalled();
    expect(clearLandings).toHaveBeenCalled();
    expect(mockScrollToField).toHaveBeenCalledWith('root');
  });
});