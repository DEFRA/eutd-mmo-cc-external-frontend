import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import {component as ConsignmentPage}  from '../../../src/client/pages/processingStatement/consignmentPage';
import {component as AddCatchDetailsPage } from '../../../src/client/pages/processingStatement/addCatchDetailsPage';
import {component as AddCatchWeightsPage } from '../../../src/client/pages/processingStatement/addCatchWeightsPage';
import {component as CatchesPage}  from '../../../src/client/pages/processingStatement/catchesPage';
import {component as AddProcessingPlantDetails}  from '../../../src/client/pages/processingStatement/addProcessingPlantDetails';
import {component as AddProcessingPlantAddress}  from '../../../src/client/pages/processingStatement/addProcessingPlantAddress';
import {component as SummaryPage}  from '../../../src/client/pages/processingStatement/summaryPage';
import {component as AddHealthCertificatePage} from '../../../src/client/pages/processingStatement/addHealthCertificatePage';
import Autocomplete from 'accessible-autocomplete/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getProcessingStatementFromRedis,
  saveProcessingStatement,
  saveProcessingStatementToRedis,
  clearProcessingStatement,
  generateProcessingStatementPdf,
  getExporterFromMongo,
  getDocument,
  getAllFish
} from '../../../src/client/actions';

jest.mock('../../../src/client/actions');

const mockStore = configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    get: () => {
      return new Promise((res) => {
        res({});
      });
    }
  }
})]);

const store = mockStore({
  exporter: {
    model: {
      exporterFullName: 'Mr Fish Exporter',
      exportCompanyName: 'MailOrderFish Ltd',
      addressOne: '5 Costa Road',
      townCity: 'Hebburn',
      postcode: 'NE1 4FS',
      _updated: true
    }
  },
  processingStatement: {
    validationErrors: [{}],
    catches: [{
      species: 'Atlantic cod',
      catchCertificateNumber: '123456',
      totalWeightLanded: '12',
      exportWeightBeforeProcessing : '12',
      exportWeightAfterProcessing : '12'
    },
    {
      species: 'European Seabass',
      catchCertificateNumber: '123457',
      totalWeightLanded: '121',
      exportWeightBeforeProcessing : '121',
      exportWeightAfterProcessing : '121'
    }],
    consignmentDescription : 'Atlantic cod fishcakes (16041992)',
    healthCertificateNumber : '123456',
    healthCertificateDate : '26/12/2018',
    addAnotherCatch: 'notset',
    exportedTo: {
      isoCodeAlpha2: 'Alpha2',
      isoCodeAlpha3: 'Alpha3',
      isoNumericCode: 'IsoNumericCode',
      officialCountryName: 'Brazil',
    },
    _plantDetailsUpdated: true
  },
  global: {
    allFish: []
  }
});


describe('Processing Statement', () => {

  beforeEach(() => {
    // mock all used actions, so there's no need to wait for promises when simulating clicks
    getProcessingStatementFromRedis.mockReturnValue({ type: 'GET_PROCESSING_STATEMENT_FROM_REDIS' });
    saveProcessingStatement.mockReturnValue({ type: 'SAVE_PROCESSING_STATEMENT' });
    saveProcessingStatementToRedis.mockReturnValue({ type: 'SAVE_PROCESSING_STATEMENT_TO_REDIS' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTER_FROM_MONGO '});
    clearProcessingStatement.mockReturnValue({ type: 'CLEAR_PROCESSING_STATEMENT '});
    generateProcessingStatementPdf.mockReturnValue({ type: 'GENERATE_PROCESSING_STATEMENT_PDF' });
    getAllFish.mockReturnValue({ type: 'GET_ALL_FISH' });
  });

  describe('add-consignment-details page', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConsignmentPage route={{
              previousUri: '',
              progressUri: '/create-processing-statement/:documentNumber/progress',
              path: '' ,
              nextUri: '',
              journey: 'processingStatement' }} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle the go back event', () => {
      wrapper.find('a').first().simulate('click');
    });

    it('should handle on change events', () => {
      wrapper.find('textarea[name="consignmentDescription"]').simulate('change', {target: {name: 'consignmentDescription',  value: 'Atlantic cod fishcakes (16041992)'}});
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle click save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });
    it('should redirect to the forbidden page if the processing statement is unauthorised', () => {
      const mockPush = jest.fn();
      new ConsignmentPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      processingStatement: { unauthorised: true} ,
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/some-previous-page',
        progressUri: ':documentNumber/progress',
      }
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
    });
  });

  describe('add catch details page', () => {

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddCatchDetailsPage route={{
            path: '/create-processing-statement/add-catch-details',
            previousUri: '',
            journey: 'processingStatement',
            nextUri: '/create-processing-statement/add-catch-weights',
            progressUri: '/create-processing-statement/:documentNumber/progress'}} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle the go back event', () => {
      wrapper.find('a[href="/orchestration/api/v1/processingStatement/back?n="]').simulate('click');
    });

    it('should handle on change events', () => {
      wrapper.find('input[name="catches.0.species"]').simulate('change', {target: {name: 'catches.0.species',  value: 'Cod'}});
      wrapper.find('input[name="catches.0.catchCertificateNumber"]').simulate('change', {target: {name: 'catches.0.catchCertificateNumber',  value: '1234567'}});
      wrapper.find(Autocomplete).simulate('change', {target: {name: 'catches.0.species',  value: 'cod'}});
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle click save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should have an id on all inputs', () => {
      expect(wrapper.find('input[id="catches.0.species"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.catchCertificateNumber"]').exists()).toBeTruthy();
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#label-catches-0-species').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-catches-0-species').props()['htmlFor']).toBe('catches.0.species');

      expect(wrapper.find('label#catches-0-catchCertificateNumber').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-catchCertificateNumber').props()['htmlFor']).toBe('catches.0.catchCertificateNumber');
    });

    it('should redirect to /forbidden when unauthorised', () => {
      const mockPush = jest.fn();
      const props = {
        match: {
          params: {
            catchIndex: 'some-catch-index'
          }
        },
        history: {
          push: mockPush,
        },
        processingStatement: {
          unauthorised: true,
          catches: []
        }
      };

      new AddCatchDetailsPage.WrappedComponent(props).componentDidUpdate();

      expect(mockPush).toHaveBeenCalledWith('/forbidden');
    });

    it('should not push history for componentDidMount when unauthorised', async () => {
      const mockPush = jest.fn();

      const props = {
        match: {
          params: {
            catchIndex: 'some-catch-index',
            documentNumber: 'some-doc-num'
          }
        },
        history: {
          push: mockPush,
        },
        processingStatement: {
          unauthorised: true,
          catches: [{
            species: 'Atlantic cod',
            catchCertificateNumber: '123456',
            totalWeightLanded: '12',
            exportWeightBeforeProcessing : '12',
            exportWeightAfterProcessing : '12'
          }]
        },
        getFromRedis: jest.fn(),
        getAllFish: jest.fn()
      };

      props.history.push.mockReset();

      await new AddCatchDetailsPage.WrappedComponent(props).componentDidMount();

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should push history for componentDidMount when hasRequiredData is false', async () => {
      const mockPush = jest.fn();

      const props = {
        match: {
          params: {
            catchIndex: 'some-catch-index',
            documentNumber: 'some-doc-num'
          }
        },
        history: {
          push: mockPush,
        },
        route: {
          previousUri: '/create-processing-statement/:documentNumber/add-consignment-details',
          progressUri: '/create-processing-statement/:documentNumber/progress',
        },
        processingStatement: {
          unauthorised: false,
          catches: [{
            species: 'Atlantic cod',
            catchCertificateNumber: '123456',
            totalWeightLanded: '12',
            exportWeightBeforeProcessing : '12',
            exportWeightAfterProcessing : '12'
          }]
        },
        getFromRedis: jest.fn(),
        getAllFish: jest.fn()
      };

      props.history.push.mockReset();

      await new AddCatchDetailsPage.WrappedComponent(props).componentDidMount();

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('add catch details page from draft', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddCatchDetailsPage route={{
            path: '/create-processing-statement/GBR-2020-PS-4070353C5/add-catch-details',
            progressUri: '/create-processing-statement/GBR-2020-PS-4070353C5/progress',
            previousUri: '',
            journey: 'processingStatement',
            nextUri: '/create-processing-statement/add-catch-weights' }} />
        </MemoryRouter>
      </Provider>
    );
    it('should have correct value of species and catch certificate', () => {
      expect(wrapper.find('input[id="catches.0.species"]').instance().value).toEqual('Atlantic cod');
      expect(wrapper.find('input[id="catches.0.catchCertificateNumber"]').instance().value).toEqual('123456');
    });

  });

  describe('add catch weights page', () => {

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddCatchWeightsPage route={{
            previousUri: '',
            journey: 'processingStatement',
            path: '/create-processing-statement/add-catch-weights',
            progressUri: '/create-processing-statement/:documentNumber/progress',
            nextUri: '' }} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle the go back event', () => {
      wrapper.find('a[href="/orchestration/api/v1/processingStatement/back?n="]').simulate('click');
    });

    it('should handle on change events', () => {
      wrapper.find('input[name="catches.0.totalWeightLanded"]').simulate('change', {target: {name: 'catches.0.totalWeightLanded',  value: '1000'}});
      wrapper.find('input[name="catches.0.exportWeightBeforeProcessing"]').simulate('change', {target: {name: 'catches.0.exportWeightBeforeProcessing',  value: '1000'}});
      wrapper.find('input[name="catches.0.exportWeightAfterProcessing"]').simulate('change', {target: {name: 'catches.0.exportWeightAfterProcessing',  value: '900'}});
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle click save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should have an id on all inputs', () => {
      expect(wrapper.find('input[id="catches.0.totalWeightLanded"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.exportWeightBeforeProcessing"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.exportWeightAfterProcessing"]').exists()).toBeTruthy();
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#catches-0-totalWeightLanded').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-totalWeightLanded').props()['htmlFor']).toBe('catches.0.totalWeightLanded');

      expect(wrapper.find('label#catches-0-exportWeightBeforeProcessing').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-exportWeightBeforeProcessing').props()['htmlFor']).toBe('catches.0.exportWeightBeforeProcessing');

      expect(wrapper.find('label#catches-0-exportWeightAfterProcessing').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-exportWeightAfterProcessing').props()['htmlFor']).toBe('catches.0.exportWeightAfterProcessing');
    });

  });

  describe('catch-added', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchesPage route={{
            previousUri: '',
            progressUri: '/create-processing-statement/:documentNumber/progress',
            path: '',
            journey: 'processingStatement',
            nextUri: '' }} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle the go back event', () => {
      wrapper.find('a[href="/orchestration/api/v1/processingStatement/back?n="]').simulate('click');
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should remove a catch', () => {
      wrapper.find('button').first().simulate('click');
    });

    it('should select a select another radio button', () => {
      wrapper.find('input[name="addAnotherCatch"]').first().simulate('change', {target: {name: 'addAnotherCatch',  value: 'Yes'}});
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#label-addAnotherCatchYes').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-addAnotherCatchYes').props()['htmlFor']).toBe('addAnotherCatchYes');
      expect(wrapper.find('label#label-addAnotherCatchNo').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-addAnotherCatchNo').props()['htmlFor']).toBe('addAnotherCatchNo');
    });

    it('should handle click save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should contain visually hidden text in Edit', () => {
      expect(wrapper.find('#edit-species-0 span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should contain visually hidden text in Remove', () => {
      expect(wrapper.find('#edit-species-0 span.govuk-visually-hidden').exists()).toBeTruthy();
    });
  });


  describe('add-processing-plant-details', () => {

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddProcessingPlantDetails route={{
            previousUri: '',
            progressUri: '/create-processing-statement/:documentNumber/progress',
            path: '',
            journey: 'processingStatement',
            nextUri: '' }} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle go back event', () => {
      wrapper.find('a').first().simulate('click');
    });

    it('should handle on change events', () => {
      wrapper.find('input[name="personResponsibleForConsignment"]').simulate('change', {target: {name: 'personResponsibleForConsignment',  value: 'Mr Processing'}});
      wrapper.find('input[name="plantApprovalNumber"]').simulate('change', {target: {name: 'plantApprovalNumber',  value: '1234567'}});
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle click save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should have an id on all inputs', () => {
      expect(wrapper.find('input[id="personResponsibleForConsignment"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="plantApprovalNumber"]').exists()).toBeTruthy();
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#personResponsibleForConsignment').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#personResponsibleForConsignment').props()['htmlFor']).toBe('personResponsibleForConsignment');

      expect(wrapper.find('label#plantApprovalNumber').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#plantApprovalNumber').props()['htmlFor']).toBe('plantApprovalNumber');
    });

    it('should redirect to the forbidden page if the processing statement is unauthorised', () => {
      const mockPush = jest.fn();

      new AddProcessingPlantDetails.WrappedComponent({
        match: {
          params: {
            documentNumber: ''
          }
        },
        processingStatement: { unauthorised: true },
        history: {
          push: mockPush
        },
        route: {
          previousUri: ':documentNumber/some-previous-page',
          progressUri: ':documentNumber/progress'
        }
      }).componentDidUpdate();

      expect(mockPush).toHaveBeenCalledWith('/forbidden');
    });
  });

  describe('add-processing-plant-address', () => {

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddProcessingPlantAddress route={{
            previousUri: '',
            progressUri: '/create-processing-statement/:documentNumber/progress',
            path: '',
            journey: 'processingStatement',
            nextUri: '',
            changeAddressUri: ''}} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should render a notification banner if _plantDetailsUpdated is true', () => {
      expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
      expect(wrapper.find('NotificationBanner').prop('header')).toBe('Important');
      expect(wrapper.find('NotificationBanner').prop('messages')).toEqual(['Due to improvements in the way addresses are managed, the processing plant address in this document must be re-entered.']);
    });
  });

  describe('add health certificate page', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AddHealthCertificatePage route={{
              previousUri: '',
              progressUri: '/create-processing-statement/:documentNumber/progress',
              path: '',
              journey: 'processingStatement',
              nextUri: '' }} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should handle the go back event', () => {
      wrapper.find('a').first().simulate('click');
    });

    it('should handle on change events', () => {
      wrapper.find('input[name="healthCertificateNumber"]').simulate('change', {target: {name: 'healthCertificateNumber',  value: '1234567'}});
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle click save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should update date', ()=>{
      const dayField = wrapper.find('input[name="dayInputName"]');
      const monthField = wrapper.find('input[name="monthInputName"]');
      const yearField = wrapper.find('input[name="yearInputName"]');

      dayField.simulate('change', { target: { value: '10' } });
      monthField.simulate('change', { target: { value: '07' } });
      yearField.simulate('change', { target: { value: '2021' } });

      expect(wrapper.find('DateFieldWithPicker').state()).toMatchObject({
        dateObject: {
          day: '10',
          month: '07',
          year: '2021',
        },
        showDatePicker: false,
      });
    });
  });

  describe('check-your-information', () => {

    let wrapper;
    beforeEach(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <SummaryPage route={{
              previousUri: '',
              progressUri: '/create-processing-statement/:documentNumber/progress',
              path: '',
              journey: 'processingStatement',
              nextUri: '',
              dashboardUri: '' }} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle go back event', () => {
      wrapper.find('a').first().simulate('click');
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle submit event', () => {
      wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
    });

    it('should handle on change link events', () => {
      wrapper.find('a#change-exporterCompanyName').simulate('click');
      wrapper.find('a#change-exporterAddress').simulate('click');
      wrapper.find('a#change-consignmentDescription').simulate('click');
      wrapper.find('a#change-healthCertificateNumber').simulate('click');
      wrapper.find('a#change-catches-0-species').simulate('click');
      wrapper.find('a#change-catches-0-catchCertificateNumber').simulate('click');
      wrapper.find('a#change-catches-0-totalWeightLanded').simulate('click');
      wrapper.find('a#change-catches-0-exportWeightBeforeProcessing').simulate('click');
      wrapper.find('a#change-catches-0-exportWeightAfterProcessing').simulate('click');
      wrapper.find('a#change-personResponsibleForConsignment').simulate('click');
      wrapper.find('a#change-plantApprovalNumber').simulate('click');
      wrapper.find('a#change-plantName').simulate('click');
      wrapper.find('a#change-plant-address').simulate('click');
      wrapper.find('a#change-exportedTo').simulate('click');
    });

    it('should contain govuk-visually-hidden for all change links', () => {
      expect(wrapper.find('#change-exporterCompanyName span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-exporterAddress span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-consignmentDescription span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-healthCertificateNumber span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-catches-0-species span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-catches-0-catchCertificateNumber span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-catches-0-totalWeightLanded span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-catches-0-exportWeightBeforeProcessing span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-catches-0-exportWeightAfterProcessing span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-personResponsibleForConsignment span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-plantApprovalNumber span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-plantName span.govuk-visually-hidden')).toHaveLength(1);
      expect(wrapper.find('#change-plant-address span.govuk-visually-hidden')).toHaveLength(1);
    });

    it('should contain the Destination Country row - title', () => {
      expect(wrapper.find('#destination-country dt').first().text()).toContain('What is the export destination?');
    });

    it('should contain the Destination Country row - answer', () => {
      expect(wrapper.find('#destination-country dd').text()).toContain('Brazil');
    });

    it('should show govuk-visually-hidden for change-exportedTo', () => {
      expect(wrapper.find('#change-exportedTo span.govuk-visually-hidden').exists()).toBeTruthy();
      expect(wrapper.find('#change-exportedTo').first().text()).toEqual('Changedestination country');
    });
  });

  describe('processing-statement-created', () => {
    it('renders without falling over', () => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AddHealthCertificatePage route={{
              previousUri: '',
              progressUri: '/create-processing-statement/:documentNumber/progress',
              path: '',
              journey: 'processingStatement',
              nextUri: '' }} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });
  });
  describe('When the exporter\'s address has been updated with IDM details', () => {

    window.scrollTo = jest.fn();

    const props = {
      route: {
        path: '/create-processing-statement/add-catch-details',
        previousUri: '',
        journey: 'processingStatement',
        progressUri: '/create-processing-statement/progress',
        nextUri: '/create-processing-statement/add-catch-weights',
        dashboardUri: '/create-processing-statement/processing-statements'
      }
    };

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SummaryPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('display notification banner with IDM address updated message', () => {
      expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
      expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('Due to improvements in the way addresses are managed, the exporter’s address in this document has been reloaded from your Defra account. Please check the address is correct and change if necessary');
    });
  });
});