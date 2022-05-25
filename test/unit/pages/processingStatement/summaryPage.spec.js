import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';


import {
  getExporterFromMongo,
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  getDocument
} from '../../../../src/client/actions';

jest.mock('../../../../src/client/actions');

import { component as SummaryPage } from '../../../../src/client/pages/processingStatement/summaryPage';
const mockStore = configureStore([thunk]);

getProcessingStatementFromRedis.mockReturnValue({type: 'GET_PROCESSING_STATEMENT_FROM_REDIS'});
getExporterFromMongo.mockReturnValue({type: 'GET_EXPORTER_FROM_MONGO'});
getDocument.mockReturnValue({type: 'GET_DOCUMENT'});

const props = {
  route: {
    journey: 'processingStatement',
    nextUri: '/create-processing-statement/:documentNumber/processing-statement-created',
    path: '/create-processing-statement/:documentNumber/check-your-information',
    previousUri: '/create-processing-statement/:documentNumber/what-export-destination',
    title: 'Create a UK processing statement - GOV.UK',
  },
  validateExportHealthCertificateFormat:jest.fn(),
  healthCertificateNumber: '20/2/123456'
};

const store = {
  exporter: {
    exporterCompanyName: 'll',
    addressOne: '35, ',
    buildingNumber: '35',
    subBuildingName: null,
    buildingName: null,
    streetName: null,
    county: null,
    country: 'United Kingdom of Great Britain and Northern Ireland',
    townCity: 'London',
    postcode: 'AB10 1SB',
    _dynamicsAddress: {
      defra_uprn: null,
      defra_buildingname: null,
      defra_subbuildingname: null,
      defra_premises: '35',
      defra_street: null,
      defra_locality: null,
      defra_dependentlocality: null,
      defra_towntext: 'London',
      defra_county: null,
      defra_postcode: 'AB10 1SB',
      _defra_country_value: 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
      defra_internationalpostalcode: null,
      defra_fromcompanieshouse: false,
      defra_addressid: '93ff7b0b-f1be-eb11-8235-000d3a3a8895',
      _defra_country_value_OData_Community_Display_V1_FormattedValue: 'United Kingdom of Great Britain and Northern Ireland',
      _defra_country_value_Microsoft_Dynamics_CRM_associatednavigationproperty: 'defra_Country',
      _defra_country_value_Microsoft_Dynamics_CRM_lookuplogicalname: 'defra_country',
      defra_fromcompanieshouse_OData_Community_Display_V1_FormattedValue: 'No'
    },
    user_id: '',
    journey: '',
    currentUri: '',
    nextUri: '',
    preLoadedName: true,
    preLoadedAddress: true,
    preLoadedCompanyName: true
  },
  processingStatement: {
    catches: [],
    validationErrors: [
      {}
    ],
    error: '',
    addAnotherCatch: 'No',
    consignmentDescription: 'hdhdhhd',
    healthCertificateDate: '31/05/2021',
    healthCertificateNumber: '20/2/123456',
    personResponsibleForConsignment: 'eee',
    plantApprovalNumber: 'rrr',
    plantName: 'ttt',
    plantAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
    plantBuildingName: 'LANCASTER HOUSE',
    plantBuildingNumber: null,
    plantSubBuildingName: null,
    plantStreetName: 'HAMPSHIRE COURT',
    plantCounty: 'TYNESIDE',
    plantCountry: 'ENGLAND',
    plantTownCity: 'NEWCASTLE UPON TYNE',
    plantPostcode: 'NE4 7YH',
    dateOfAcceptance: '15/07/2021',
    exportedTo: {
      officialCountryName: 'Antigua and Barbuda',
      isoCodeAlpha2: 'AG',
      isoCodeAlpha3: 'ATG',
      isoNumericCode: '028'
    },
    _plantDetailsUpdated: false,
    errors: {}
  }
};

describe('summary page', () => {

  beforeEach(() => {
    getProcessingStatementFromRedis.mockReturnValue({ type: 'SAVE_PROCESSING_STATEMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'EXPORTER_LOADED' });
    saveProcessingStatement.mockReturnValue({ type: 'SAVE_PROCESSING_STATEMENT' });
    saveProcessingStatementToRedis.mockReturnValue({ type: 'SAVE_PROCESSING_STATEMENT ' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
  });
  afterEach(() => {
    getProcessingStatementFromRedis.mockReset();
    getExporterFromMongo.mockReset();
    saveProcessingStatement.mockReset();
    saveProcessingStatementToRedis.mockReset();
    getDocument.mockReset();
  });

  describe('when there are catches with same certificate as health certificate', () => {

    store.processingStatement.catches = [
      {
        _id: '60ef9bef853a5e6012168299',
        species: 'American conger (COA)',
        catchCertificateNumber: '20/2/123456',
        totalWeightLanded: '2',
        exportWeightBeforeProcessing: '2',
        id: 'jddd-1622823417',
        scientificName: 'Conger oceanicus',
      },
      {
        _id: '60ef9bef853a5e6012168298',
        species: 'Sharpchin flyingfish (FOA)',
        catchCertificateNumber: 'DIFFEREN ONE',
        totalWeightLanded: '34',
        exportWeightBeforeProcessing: '34',
        exportWeightAfterProcessing: '34',
        id: 'different one-1626138981',
        scientificName: 'Fodiator acutus',
      },
      {
        _id: '60ef9bef853a5e6012168297',
        species: 'Astronesthes gemmifer (AEG)',
        catchCertificateNumber: '20/2/123456',
        totalWeightLanded: '44',
        exportWeightBeforeProcessing: '44',
        exportWeightAfterProcessing: '44',
        id: '20/2/123456-1626272217',
        scientificName: '',
      },
    ];

    const wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <SummaryPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    it('should successfully render the summary page', () => {
      expect(wrapper).toBeDefined();
    });

    it('should render the ErrorIsland component', () => {
      expect(wrapper.find('ErrorIsland').exists()).toBeTruthy();
    });

    it('should render an error message per erronneous catch', () => {
      expect(wrapper.find('ErrorIsland').prop('errors')).toEqual([
        {
          key: 'catches-in-consignment-0',
          message: 'Catch certificate number  for American conger (COA) cannot be the same as the health certificate number'
        },
        {
          key: 'catches-in-consignment-2',
          message: 'Catch certificate number  for Astronesthes gemmifer (AEG) cannot be the same as the health certificate number'
        }
      ]);
    });

    it('should render error message with in each catch component with the issue', () => {
      expect(wrapper.find('#catches-in-consignment-0').exists('.error-message')).toBe(true);
      expect(wrapper.find('#catches-in-consignment-2').exists('.error-message')).toBe(true);
    });

    it('should not render error message for catch component without the issue', () => {
      expect(wrapper.find('#catches-in-consignment-1').exists('.error-message')).toBe(false);
    });

    it('should render the submit button in a disable state', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
      expect(wrapper.find('#continue').prop('disabled')).toBeTruthy();
    });


    it('validateDate() validates dates correctly', async ()   => {
      try {
        let result = await wrapper.instance().validateDate('01/01/2019');
        expect(result).toBeTruthy();

        result = await wrapper.instance().validateDate('1/01/2019');
        expect(result).toBeTruthy();

        result = await wrapper.instance().validateDate('01/1/2019');
        expect(result).toBeTruthy();

        result = await wrapper.instance().validateDate('32/1/2019');
        expect(result).toBeFalsy();

        result = await wrapper.instance().validateDate('1/13/2019');
        expect(result).toBeFalsy();

        result = await wrapper.instance().validateDate('1/13/xxxx');
        expect(result).toBeFalsy();
      } catch (e) {
         return e;
      }
    });

    it('should identify correct health certificate number format', async () => {

    try {
      let result = await wrapper.instance().validateExportHealthCertificateFormat('0/0/000000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('000/0/00000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('x/0/000000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('xx/00/00000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/00000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/x/000000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/00000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/0/x00000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/0x0000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/00x000');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/000x00');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/0000x0');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/00/00000x');
      expect(result).toBeFalsy();

      result = await wrapper.instance().validateExportHealthCertificateFormat('00/0/000000');
      expect(result).toBeTruthy();
    } catch (e) {
      return e;
   }
    });
  });

  describe('when there catches with different certificate as health certificate', () => {

    store.processingStatement.catches = [
      {
        _id: '60ef9bef853a5e6012168299',
        species: 'American conger (COA)',
        catchCertificateNumber: '1st certificate',
        totalWeightLanded: '2',
        exportWeightBeforeProcessing: '2',
        id: 'jddd-1622823417',
        scientificName: 'Conger oceanicus',
      },
      {
        _id: '60ef9bef853a5e6012168298',
        species: 'Sharpchin flyingfish (FOA)',
        catchCertificateNumber: '2nd certificate',
        totalWeightLanded: '34',
        exportWeightBeforeProcessing: '34',
        exportWeightAfterProcessing: '34',
        id: 'different one-1626138981',
        scientificName: 'Fodiator acutus',
      },
      {
        _id: '60ef9bef853a5e6012168297',
        species: 'Astronesthes gemmifer (AEG)',
        catchCertificateNumber: '3dr certificate',
        totalWeightLanded: '44',
        exportWeightBeforeProcessing: '44',
        exportWeightAfterProcessing: '44',
        id: '20/2/123456-1626272217',
        scientificName: '',
      },
    ];

    const wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <SummaryPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    it('should successfuly render the summary page', () => {
      expect(wrapper).toBeDefined();
    });

    it('should not render the ErrorIsland component', () => {
      expect(wrapper.find('ErrorIsland').exists()).toBe(false);
    });

    it('should not render error message for any of the catch components', () => {
      expect(wrapper.find('#catches-in-consignment-0').exists('.error-message')).toBe(false);
      expect(wrapper.find('#catches-in-consignment-1').exists('.error-message')).toBe(false);
      expect(wrapper.find('#catches-in-consignment-2').exists('.error-message')).toBe(false);
    });

    it('should render the submit button in a enable state', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
      expect(wrapper.find('#continue').prop('disabled')).toBeFalsy();
    });
  });

  describe('when required data is missing', () => {
    const mockStore = configureStore([thunk]);

    it('should redirect to the first page before the journey', async () => {
      const documentNumber = 'document123';
      const history = createMemoryHistory({
        initialEntries: [
          `/create-processing-statement/${documentNumber}/check-your-information`,
        ],
      });
      const mockPush = jest.spyOn(history, 'push');
      mockPush.mockReturnValue(null);

      const store = mockStore({
        processingStatement: {
          catches: [],
          validationErrors: [],
          consignmentDescription: 'consignment',
          healthCertificateDate: '19/10/2020'
        },
        saveAsDraft: {

        },
        global: {
          allFish: []
        },
        exporter: {
          model: {
            addressOne: 'some-address-name',
            townCity: 'some-town-city',
            postcode: 'some-postcode',
            exporterCompanyName: 'some-company-name'
          }
        }
      });

      let wrapper;

      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <Route path="/create-processing-statement/:documentNumber/check-your-information">
                <SummaryPage
                  route={{
                    path: 'path',
                    nextUri: 'nextUri',
                    previousUri: 'previousUri'
                  }}
                />
              </Route>
            </Router>
          </Provider>
        );
      });

      expect(mockPush).toHaveBeenCalledWith('/create-processing-statement/document123/progress');
    });

    it('should redirect to the health certificate page', async () => {
      const documentNumber = 'document123';
      const history = createMemoryHistory({
        initialEntries: [
          `/create-processing-statement/${documentNumber}/check-your-information`,
        ],
      });
      const mockPush = jest.spyOn(history, 'push');
      mockPush.mockReturnValue(null);

      const store = mockStore({
        processingStatement: {
          catches: [],
          consignmentDescription: 'consignment',
          validationErrors: []
        },
        saveAsDraft: {

        },
        global: {
          allFish: []
        },
        exporter: {
          model: {
            addressOne: 'some-address-name',
            townCity: 'some-town-city',
            postcode: 'some-postcode',
            exporterCompanyName: 'some-company-name'
          }
        }
      });

      let wrapper;

      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <Route path="/create-processing-statement/:documentNumber/check-your-information">
                <SummaryPage
                  route={{
                    path: 'path',
                    nextUri: 'nextUri',
                    previousUri: 'previousUri'
                  }}
                />
              </Route>
            </Router>
          </Provider>
        );
      });

      expect(mockPush).toHaveBeenCalledWith('/create-processing-statement/document123/progress');
    });

    it('should redirect to the exporter details page', async () => {
      const documentNumber = 'document123';
      const history = createMemoryHistory({
        initialEntries: [
          `/create-processing-statement/${documentNumber}/check-your-information`,
        ],
      });
      const mockPush = jest.spyOn(history, 'push');
      mockPush.mockReturnValue(null);

      const store = mockStore({
        processingStatement: {
          catches: [],
          consignmentDescription: 'consignment',
          healthCertificateDate: '19/10/2020',
          validationErrors: []
        },
        saveAsDraft: {

        },
        global: {
          allFish: []
        },
        exporter: {
          model: {
            addressOne: 'some-address-name',
            townCity: 'some-town-city',
            postcode: 'some-postcode'
          }
        }
      });

      let wrapper;

      await act(async () => {
        wrapper = await mount(
          <Provider store={store}>
            <Router history={history}>
              <Route path="/create-processing-statement/:documentNumber/check-your-information">
                <SummaryPage
                  route={{
                    path: 'path',
                    nextUri: 'nextUri',
                    previousUri: 'previousUri'
                  }}
                />
              </Route>
            </Router>
          </Provider>
        );
      });

      expect(mockPush).toHaveBeenCalledWith('/create-processing-statement/document123/progress');
    });
  });

  describe('Summary page errors for processing statement', () => {

    store.processingStatement.catches = [
      {
        _id: '60ef9bef853a5e6012168299',
        species: 'American conger (COA)',
        catchCertificateNumber: '1st certificate',
        totalWeightLanded: '1',
        exportWeightBeforeProcessing: '2',
        id: 'jddd-1622823417',
        scientificName: 'Conger oceanicus',
      },
      {
        _id: '60ef9bef853a5e6012168298',
        species: 'Sharpchin flyingfish (FOA)',
        catchCertificateNumber: '2nd certificate',
        totalWeightLanded: '34',
        exportWeightBeforeProcessing: '34',
        exportWeightAfterProcessing: '34',
        id: 'different one-1626138981',
        scientificName: 'Fodiator acutus',
      },
      {
        _id: '60ef9bef853a5e6012168297',
        species: 'Astronesthes gemmifer (AEG)',
        catchCertificateNumber: '3dr certificate',
        totalWeightLanded: '44',
        exportWeightBeforeProcessing: '44',
        exportWeightAfterProcessing: '44',
        id: '20/2/123456-1626272217',
        scientificName: '',
      },
    ];

    store.processingStatement.validationErrors = [{
      error: 'this is a validation error'
    }];

    const wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <SummaryPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    it('should render the ErrorIsland component', () => {
      wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
      expect(wrapper.find('ErrorIsland').exists()).toBe(true);
      expect(wrapper.find('ErrorIsland').prop('errors')).toEqual([
        {
          message: 'Your validation checks have failed. In order to progress your application, please review your information and re-submit.',
          key: 'validationError'
        }
        ]);
    });

    it('should render the submit button in a disabled state', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
      expect(wrapper.find('#continue').prop('disabled')).toBeTruthy();
    });
  });

  describe('when the ui is fully render with no errors', () => {

    store.processingStatement.catches = [
      {
        _id : '61dd431b068a705bf96e0b7b',
        species : 'Dwarf codling (AIM)',
        catchCertificateNumber : '786689OY',
        totalWeightLanded : '2',
        exportWeightBeforeProcessing : '2',
        exportWeightAfterProcessing : '2',
        id : '786689oy-1641890550',
        scientificName : 'Austrophycis marginata'
      }
    ];

    const wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <SummaryPage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    it('should match the previous snapshot', () => {
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });

  });

});
