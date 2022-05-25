import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { component as ProductDetails } from '../../../src/client/pages/storageNotes/productDetails';
import { component as Products } from '../../../src/client/pages/storageNotes/products';
import { component as StorageFacility } from '../../../src/client/pages/storageNotes/storageFacility';
import { component as StorageFacilities } from '../../../src/client/pages/storageNotes/storageFacilitiesPage';
import { component as Summary } from '../../../src/client/pages/storageNotes/summary';
import { component as Statement } from '../../../src/client/pages/storageNotes/statementPage';

import {
  getDocument,
  getExporterFromMongo,
  getTransportDetails,
  generateStorageNotesPdf,
  getStorageNotesFromRedis,
  saveStorageNotes,
  saveStorageNotesToRedis,
  clearStorageNotes,
  clearTransportDetails,
  changeStorageFacilityAddress

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
  global: {
    allFish: []
  },
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
  storageNotes: {
    addAnotherProduct: 'notset',
    addAnotherStorageFacility: 'notset',
    catches: [{
      product: 'Asda squid burgers',
      commodityCode: '123456',
      certificateNumber: '12345',
      productWeight: '1000',
      dateOfUnloading: '25/01/2019',
      placeOfUnloading: 'Dover',
      transportUnloadedFrom: 'Car',
      weightOnCC: '500'
    },
    {
      product: 'Tesco squid burgers',
      commodityCode: '123457',
      certificateNumber: '12346',
      productWeight: '1001',
      dateOfUnloading: '25/01/2019',
      placeOfUnloading: 'Dover',
      transportUnloadedFrom: 'Truck'
    }],
    validationErrors: [{}],
    storageFacilities: [{
      facilityName: 'Test1',
      facilityAddressOne: 'Test2',
      facilityAddressTwo: 'Test3',
      facilityTownCity: 'Test4',
      facilityPostcode: 'aa11aa',
    },
    {
      facilityName: 'Test2',
      facilityAddressOne: 'Test2',
      facilityAddressTwo: 'Test2',
      facilityTownCity: 'Test2',
      facilityPostcode: 'aa11aa',
    }]
  },
  transport: {
    vehicle: 'truck',
    cmr: 'true',
    exportedTo: {
      isoCodeAlpha2: 'Alpha2',
      isoCodeAlpha3: 'Alpha3',
      isoNumericCode: 'IsoNumericCode',
      officialCountryName: 'Brazil',
    }
  },
  fish: [{}]
  }
);


describe('Storage Notes', () => {

  beforeEach(() => {
    // mock all used actions, so there's no need to wait for promises when simulating clicks
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
    saveStorageNotes.mockReturnValue({ type: 'SAVE_STORAGE_NOTES' });
    saveStorageNotesToRedis.mockReturnValue({ type: 'SAVE_STORAGE_NOTES_TO_REDIS' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTER_FROM_MONGO '});
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS '});
    generateStorageNotesPdf.mockReturnValue({ type: 'GENERATE_STORAGE_NOTES_PDF' });
    clearStorageNotes.mockReturnValue({ type: 'CLEAR_STORAGE_NOTES' });
    clearTransportDetails.mockReturnValue({ type: 'CLEAR_TRANSPORT_DETAILS' });
    changeStorageFacilityAddress.mockReturnValue({ type: 'CHANGE_STORAGE_FACILITY_ADDRESS', payload: { unsavedFacilityName: 'Facilitity 1' }});
  });

  // Product Details
  describe('ProductDetailsPage', () => {

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails route={{
            previousUri: '',
            progressUri: '/create-storage-documents/progress',
            journey: 'storageNotes',
            saveAsDraftUri: '/storage-documents',
            path: '/products'
          }} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle go back event', () => {
      wrapper.find('a[href="/orchestration/api/v1/processingStatement/back?n="]').simulate('click');
    });

    it('should handle continue event', () => {

      wrapper.find('button#continue').simulate('click');
    });

    it('should handle an on change event', () => {
      wrapper.find('input[name="catches.0.commodityCode"]').simulate('change', {target: {name: 'catches.0.commodityCode',  value: '123456'}});
      wrapper.find('input[name="catches.0.product"]').simulate('change', {target: {name: 'catches.0.product',  value: 'Cod'}});
      wrapper.find('input[name="catches.0.certificateNumber"]').simulate('change', {target: {name: 'catches.0.certificateNumber',  value: '123456'}});
      wrapper.find('input[name="catches.0.productWeight"]').simulate('change', {target: {name: 'catches.0.productWeight',  value: '100'}});
      wrapper.find('input[name="catches.0.placeOfUnloading"]').simulate('change', {target: {name: 'catches.0.placeOfUnloading',  value: 'Docks'}});
      wrapper.find('input[name="catches.0.transportUnloadedFrom"]').simulate('change', {target: {name: 'catches.0.transportUnloadedFrom',  value: 'Truck'}});

      const dayField = wrapper.find('input[name="dayInputName"]');
      const monthField = wrapper.find('input[name="monthInputName"]');
      const yearField = wrapper.find('input[name="yearInputName"]');

      dayField.simulate('change', { target: { value: '10' } });
      monthField.simulate('change', { target: { value: '07' } });
      yearField.simulate('change', { target: { value: '2021' } });
    });

    it('should handle save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should have an id on all inputs', () => {
      expect(wrapper.find('input[id="catches.0.product"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.commodityCode"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.productWeight"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.placeOfUnloading"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.transportUnloadedFrom"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.certificateNumber"]').exists()).toBeTruthy();
      expect(wrapper.find('input[id="catches.0.weightOnCC"]').exists()).toBeTruthy();

      expect(wrapper.find('input[name="dayInputName"]').exists()).toBeTruthy();
      expect(wrapper.find('input[name="monthInputName"]').exists()).toBeTruthy();
      expect(wrapper.find('input[name="yearInputName"]').exists()).toBeTruthy();
    });

    it('will render the all the correct hint texts within the ProductDetails component', () => {
      expect(wrapper.find('HintText StyledHint').at(0).text()).toEqual('Enter part of the FAO code or product name for suggestions e.g. Atlantic Cod (COD). You must choose from the suggestions provided to avoid invalid documents.');
      expect(wrapper.find('HintText StyledHint').at(1).text()).toEqual('For example, 31 03 1980');
      expect(wrapper.find('HintText StyledHint').at(2).text()).toEqual('For example, Felixstowe or Dover.');
      expect(wrapper.find('HintText StyledHint').at(3).text()).toEqual('For example, the name of a container ship, flight number or vehicle registration.');
      expect(wrapper.find('HintText StyledHint').at(4).text()).toEqual('Enter 1 catch certificate document number per line.');

    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#label-catches-0-product').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-catches-0-product').props()['htmlFor']).toBe('catches.0.product');

      expect(wrapper.find('label#catches-0-commodityCode').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-commodityCode').props()['htmlFor']).toBe('catches.0.commodityCode');

      expect(wrapper.find('label#catches-0-productWeight').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-productWeight').props()['htmlFor']).toBe('catches.0.productWeight');

      expect(wrapper.find('span#date-field-label-text')).toBeDefined();

      expect(wrapper.find('label#catches-0-placeOfUnloading').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-placeOfUnloading').props()['htmlFor']).toBe('catches.0.placeOfUnloading');

      expect(wrapper.find('label#catches-0-transportUnloadedFrom').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-transportUnloadedFrom').props()['htmlFor']).toBe('catches.0.transportUnloadedFrom');

      expect(wrapper.find('label#catches-0-certificateNumber').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-certificateNumber').props()['htmlFor']).toBe('catches.0.certificateNumber');

      expect(wrapper.find('label#catches-0-weightOnCC').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#catches-0-weightOnCC').props()['htmlFor']).toBe('catches.0.weightOnCC');
    });
  });

  describe('Product details page from Draft', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails route={{
            previousUri: '',
            progressUri: '/create-storage-documents/progress',
            journey: 'storageNotes',
            saveAsDraftUri: '/storage-documents',
            path: 'create-storage-document/add-product-to-this-consignment'
          }} />
        </MemoryRouter>
      </Provider>
    );

    it('should have correct value of all inputs saved', () => {

      expect(wrapper.find('input[id="catches.0.product"]').instance().value).toEqual('Asda squid burgers');
      expect(wrapper.find('input[id="catches.0.commodityCode"]').instance().value).toEqual('123456');
      expect(wrapper.find('input[id="catches.0.productWeight"]').instance().value).toEqual('1000');
      expect(wrapper.find('input[id="catches.0.placeOfUnloading"]').instance().value).toEqual('Dover');
      expect(wrapper.find('input[id="catches.0.transportUnloadedFrom"]').instance().value).toEqual('Car');
      expect(wrapper.find('input[id="catches.0.certificateNumber"]').instance().value).toEqual('12345');
      expect(wrapper.find('input[id="catches.0.weightOnCC"]').instance().value).toEqual('500');

      const dayField = wrapper.find('input[name="dayInputName"]');
      const monthField = wrapper.find('input[name="monthInputName"]');
      const yearField = wrapper.find('input[name="yearInputName"]');

      dayField.simulate('change', { target: { value: '10' } });
      monthField.simulate('change', { target: { value: '07' } });
      yearField.simulate('change', { target: { value: '2021' } });

      expect(wrapper.find('DateFieldWithPicker').state().dateObject).toEqual({
        day: '10',
        month: '07',
        year: '2021',
      });
    });

    it('should have an form onSubmit', () => {
      const mockPrevent = jest.fn();

      wrapper.find('form').simulate(
        'submit',
        {preventDefault: mockPrevent}
      );

      expect(wrapper.find('form').exists()).toBeTruthy();
      expect(mockPrevent).toHaveBeenCalled();
    });

    it('should call a set species', async () => {
      await act(() => wrapper.find('SpeciesAutocomplete').props().onChange('COD', {
        faoCode: 'COD',
        scientificName: 'latin-name'
      }));

      expect(wrapper.find('CatchDetailsPage').state().species).toBe('COD');
      expect(wrapper.find('CatchDetailsPage').state().speciesCode).toBe('COD');
      expect(wrapper.find('CatchDetailsPage').state().scientificName).toBe('latin-name');
    });

    it('should call a set species with no species Obj', async () => {
      await act(() => wrapper.find('SpeciesAutocomplete').props().onChange('COD'));

      expect(wrapper.find('CatchDetailsPage').state().species).toBe('COD');
      expect(wrapper.find('CatchDetailsPage').state().speciesCode).toBe('COD');
      expect(wrapper.find('CatchDetailsPage').state().scientificName).toBeUndefined();
    });

  });

  describe('Product details page with no storage notes', () => {
    const wrapper = mount(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <ProductDetails route={{
            previousUri: '',
            progressUri: '/create-storage-documents/progress',
            journey: 'storageNotes',
            saveAsDraftUri: '/storage-documents',
            path: 'create-storage-document/add-product-to-this-consignment'
          }} />
        </MemoryRouter>
      </Provider>
    );

    it('should not render', () => {
      expect(wrapper.find('#continue').exists()).toBeFalsy();
    });

  });

  describe('Product details page with storage notes', () => {
    const wrapper = mount(
      <Provider store={mockStore({
        global: {
          allFish: []
        },
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
        storageNotes: {
          addAnotherProduct: 'notset',
          addAnotherStorageFacility: 'notset',
          catches: [],
          validationErrors: [{}],
          storageFacilities: [{
            facilityName: 'Test1',
            facilityAddressOne: 'Test2',
            facilityAddressTwo: 'Test3',
            facilityTownCity: 'Test4',
            facilityPostcode: 'aa11aa',
          },
          {
            facilityName: 'Test2',
            facilityAddressOne: 'Test2',
            facilityAddressTwo: 'Test2',
            facilityTownCity: 'Test2',
            facilityPostcode: 'aa11aa',
          }]
        },
        transport: {
          vehicle: 'truck',
          cmr: 'true',
          exportedTo: {
            isoCodeAlpha2: 'Alpha2',
            isoCodeAlpha3: 'Alpha3',
            isoNumericCode: 'IsoNumericCode',
            officialCountryName: 'Brazil',
          }
        },
        fish: [{}]
        }
      )}>
        <MemoryRouter>
          <ProductDetails route={{
            previousUri: '',
            progressUri: '/create-storage-documents/progress',
            journey: 'storageNotes',
            saveAsDraftUri: '/storage-documents',
            path: 'create-storage-document/add-product-to-this-consignment'
          }} />
        </MemoryRouter>
      </Provider>
    );

    it('should render', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

  });

  // Products,
  describe('ProductsPage', () => {

    const history = [];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Products history={history} route={{
            previousUri: '',
            progressUri: '/create-storage-documents/progress',
            journey: 'storageNotes',
            saveAsDraftUri: '/storage-documents',
            path: '/products'
          }} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#addAnotherProduct').exists()).toBeTruthy();
    });

    it('should handle back link event', () => {
      wrapper.find('a[href="/orchestration/api/v1/storageNotes/back?n="]').simulate('click');
    });

    it('should handle remove product event', () => {
      wrapper.find('button').first().simulate('click');
    });

    it('should handle add another product event', () => {
      wrapper.find('input[name="addAnotherProduct"]').first().simulate('change', {target: {name: 'addAnotherProduct',  value: 'Yes'}});
    });

    it('should handle click continue event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should handle submit event', () => {
      wrapper.find('form').simulate('submit', { preventDefault () {} });
    });

    it('should handle save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should show govuk-visually-hidden for change-product', () => {
      expect(wrapper.find('#edit-product-0 span.govuk-visually-hidden').exists()).toBeTruthy();
      expect(wrapper.find('#edit-product-0 span.govuk-visually-hidden').text()).toBe('product Asda squid burgers');
    });

    it('should show govuk-visually-hidden for remove-product', () => {
      expect(wrapper.find('#remove-product-0 span.govuk-visually-hidden').exists()).toBeTruthy();
      expect(wrapper.find('#remove-product-0 span.govuk-visually-hidden').text()).toBe('product Asda squid burgers');

    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#label-addAnotherProductYes').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-addAnotherProductYes').props()['htmlFor']).toBe('addAnotherProductYes');
      expect(wrapper.find('label#label-addAnotherProductNo').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-addAnotherProductNo').props()['htmlFor']).toBe('addAnotherProductNo');
    });
  });

  // Facility,
  describe('StorageFacilityPage', () => {
    let props = {
      storageFacilities:{
        catches: [{
          _id: '60bf70ee83f21a0948385777',
          product: 'Atlantic cod (COD)',
          commodityCode: 'acddd123',
          certificateNumber: 'ABCD123',
          productWeight: '100',
          weightOnCC: '100',
          placeOfUnloading: 'Dover',
          dateOfUnloading: '08/06/2021',
          transportUnloadedFrom: 'ACBD123',
          id: 'undefined-1623149474',
          scientificName: 'Gadus morha'
        }],
        storageFacilities: [{
          facilityTownCity: 'NEWCASTLE UPON TYNE',
          facilityPostcode: 'NE4 7YH',
          facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
          facilityName: 'Facility2'
        }],
        validationErrors: [{}],
        errors: {},
        errorsUrl: '',
        addAnotherProduct: 'No',
        addAnotherStorageFacility: 'No'
        },
      route: {
        path: '/create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
        title: 'Create a UK storage document - GOV.UK',
        journey: 'storageNotes',
        changeAddressUri: '/create-storage-document/:documentNumber/what-storage-facility-address/:facilityIndex',
        previousUri: '/create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
        progressUri: '/create-storage-documents/progress',
        nextUri: '/create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
        saveAsDraftUri: '/create-storage-document/storage-documents'
      }
        };

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <StorageFacility {...props} />
        </MemoryRouter>
      </Provider>
    );


    it('renders without falling over', () => {
      expect(wrapper.find('#continue').exists()).toBeTruthy();
    });

    it('should handle go back event', () => {
      //TODO: supply match params to storageFacility to test how the component picks documentNumber up
      wrapper.find('a[href^="/orchestration/api/v1/storageNotes/back?n=/create-storage-document/"]').simulate('click');
      expect(true).toBeTruthy();
    });
  });

  // Facilities,
  describe('StorageFacilitiesPage', () => {

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <StorageFacilities route={{ previousUri: '', nextUri: '', journey: 'storageNotes', path: '/products', progressUri: '/progress' }} />
        </MemoryRouter>
      </Provider>
    );

    it('renders without falling over', () => {
      expect(wrapper.find('#addAnotherStorageFacility').exists()).toBeTruthy();
    });

    it('should handle go back event with href', () => {
      wrapper.find('a[href^="/orchestration/api/v1/storageNotes/back?n=/create-storage-document/"]').simulate('click');
    });

    it('should handle submit event', () => {
      wrapper.find('form').simulate('submit', { preventDefault () {} });
    });

    it('should handle click submit event', () => {
      wrapper.find('button#continue').simulate('click');
    });

    it('should remove a storage facility', () => {
      wrapper.find('button').first().simulate('click');
    });

    it('should edit a storage facility', () => {
      wrapper.find('a[href$="/add-storage-facility-details/0"]').simulate('click');
    });

    it('should handle save as draft event', () => {
      wrapper.find('button#saveAsDraft').simulate('click');
    });

    it('should show govuk-visually-hidden for edit-facility', () => {
      expect(wrapper.find('#edit-facility-0 span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should show govuk-visually-hidden for remove-facility', () => {
      expect(wrapper.find('#remove-facility-0 span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should have a for attribute on all input labels', () => {
      expect(wrapper.find('label#label-addAnotherStorageFacilityYes').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-addAnotherStorageFacilityYes').props()['htmlFor']).toBe('addAnotherStorageFacilityYes');
      expect(wrapper.find('label#label-addAnotherStorageFacilityNo').props()['htmlFor']).toBeDefined();
      expect(wrapper.find('label#label-addAnotherStorageFacilityNo').props()['htmlFor']).toBe('addAnotherStorageFacilityNo');
    });
  });

  describe('SummaryPage', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Summary route={{ previousUri: '', journey: 'storageNotes', path: '/products', progressUri: '/progress' }}/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('renders without falling over', () => {
      expect(wrapper.find('#exporter-details').exists()).toBeTruthy();
    });

    it('should handle go back event with href', () => {
      wrapper.find('a[href$="do-you-have-a-road-transport-document"]').first().simulate('click');
    });

    it('should handle go back event with href for container vessel transport', async () => {

      const newStore = mockStore({
        storageNotes: {
          catches: [{
            product: 'Asda squid burgers',
            commodityCode: '123456',
            certificateNumber: '12345',
            productWeight: '1000',
            dateOfUnloading: '25/01/2019',
            placeOfUnloading: 'Dover',
            transportUnloadedFrom: 'Car'
          }],
          validationErrors: [{}],
          storageFacilities: [{
            facilityName: 'Test',
            facilityAddressOne: 'Test',
            facilityAddressTwo: 'Test',
            facilityTownCity: 'Test',
            facilityPostcode: 'aa11aa',
          }]
        },
        addAnotherProduct: 'notset',
        addAnotherStorageFacility: 'notset',
        transport: {
          vehicle: 'containerVessel',
          cmr: 'false'
        },
        fish: [{}],
        document: {
          documentNumber: '123456'
        }
      });

      const newWrapper = await mount(
        <Provider store={newStore}>
          <MemoryRouter>
            <Summary route={{ previousUri: '', journey: 'storageNotes', path: '/products', progressUri: '/progress' }}/>
          </MemoryRouter>
        </Provider>
      );

      newWrapper.find('a[href$="add-transportation-details-container-vessel"]').first().simulate('click');
    });

    it('should handle go back event with href for all other transport', async () => {

      const newStore = mockStore({
        storageNotes: {
          catches: [{
            product: 'Asda squid burgers',
            commodityCode: '123456',
            certificateNumber: '12345',
            productWeight: '1000',
            dateOfUnloading: '25/01/2019',
            placeOfUnloading: 'Dover',
            transportUnloadedFrom: 'Car'
          }],
          validationErrors: [{}],
          storageFacilities: [{
            facilityName: 'Test',
            facilityAddressOne: 'Test',
            facilityAddressTwo: 'Test',
            facilityTownCity: 'Test',
            facilityPostcode: 'aa11aa',
          }]
        },
        addAnotherProduct: 'notset',
        addAnotherStorageFacility: 'notset',
        transport: {
          vehicle: 'train',
          cmr: 'false',
        },
        fish: [{}]
      });

      const newWrapper = await mount(
        <Provider store={newStore}>
          <MemoryRouter>
            <Summary route={{ previousUri: '', journey: 'storageNotes', path: '/products', progressUri: '/progress' }}/>
          </MemoryRouter>
        </Provider>
      );

      newWrapper.find('a[href$="add-transportation-details-train"]').first().simulate('click');
    });

    it('should handle submit event', () => {
      wrapper.find('form').simulate('submit', { preventDefault() {}});
    });

    it('should handle exporter change link event', () => {
      wrapper.find('a[href$="add-exporter-details"]').first().simulate('click');
    });

    it('should handle add produce to consignment change link event', () => {
      wrapper.find('a[href$="add-product-to-this-consignment/0"]').first().simulate('click');
    });

    it('should handle add storage facilities change link event', () => {
      wrapper.find('a[href$="add-storage-facility-details/0"]').first().simulate('click');
    });

    it('should handle transport details change link event', () => {
      wrapper.find('a[href$="how-does-the-export-leave-the-uk"]').first().simulate('click');
    });

    it('should show govuk-visually-hidden for change-exporterCompanyName', () => {
      expect(wrapper.find('#change-exporterCompanyName span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should show govuk-visually-hidden for change-catches-product', () => {
      expect(wrapper.find('#change-catches-0-product span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should show govuk-visually-hidden for change-exportedTo', () => {
      expect(wrapper.find('#change-exportedTo span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should show govuk-visually-hidden for change-transportType', () => {
      expect(wrapper.find('#change-transportType span.govuk-visually-hidden').exists()).toBeTruthy();
    });

    it('should contain the Destination Country row - title', () => {
      expect(wrapper.find('#destination-country dt').first().text()).toContain('What is the export destination?');
    });

    it('should contain the Destination Country row - answer', () => {
      expect(wrapper.find('#destination-country dd').text()).toContain('Brazil');
    });

    it('display notification banner with IDM address updated message', () => {
      expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
      expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('Due to improvements in the way addresses are managed, the exporter’s address in this document has been reloaded from your Defra account. Please check the address is correct and change if necessary');
    });

  });

  describe('StatementPage', () => {

    it('renders without falling over', () => {

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Statement route={{ previousUri: '', journey: 'storageNotes', path: '/product', progressUri: '/progress' }}/>
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('#documentNumber').exists()).toBeTruthy();

    });

  });
});

describe('StorageFacilityPage - Postcode lookup address', () => {

  let props = {
    storageFacilities: {
      catches: [{
        _id: '60bf70ee83f21a0948385777',
        product: 'Atlantic cod (COD)',
        commodityCode: 'acddd123',
        certificateNumber: 'ABCD123',
        productWeight: '100',
        weightOnCC: '100',
        placeOfUnloading: 'Dover',
        dateOfUnloading: '08/06/2021',
        transportUnloadedFrom: 'ACBD123',
        id: 'undefined-1623149474',
        scientificName: 'Gadus morha'
      }],
      storageFacilities: [{
        facilityTownCity: 'NEWCASTLE UPON TYNE',
        facilityPostcode: 'NE4 7YH',
        facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
        facilityName: 'Facility2'
      }],
      validationErrors: [{}],
      errors: {},
      errorsUrl: '',
      addAnotherProduct: 'No',
      addAnotherStorageFacility: 'No'
    },
    route: {
      path: '/create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
      title: 'Create a UK storage document - GOV.UK',
      journey: 'storageNotes',
      changeAddressUri: '/create-storage-document/:documentNumber/what-storage-facility-address/:facilityIndex',
      previousUri: '/create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
      progressUri: '/create-storage-document//progress',
      nextUri: '/create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
      saveAsDraftUri: '/create-storage-document/storage-documents'
    }
  };

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props}/>
      </MemoryRouter>
    </Provider>
  );

  it('should show post lookup address', () => {
    let addressPlaceholder = wrapper.find('#lookup-address');
    expect(addressPlaceholder.exists()).toBeTruthy();
    expect(addressPlaceholder.type()).toEqual('p');
    expect(addressPlaceholder.text()).toBe('Test2Test4aa11aa');
  });
});
