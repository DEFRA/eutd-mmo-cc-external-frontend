import {  mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { render, screen } from '@testing-library/react';
import { component as productDetails } from '../../../../src/client/pages/storageNotes/productDetails';
import ProductDetails from '../../../../src/client/pages/storageNotes/productDetails';
import { getStorageNotesFromRedis, clearStorageNotes } from '../../../../src/client/actions';
import SUT from '../../../../src/client/pages/storageNotes/productDetails';

jest.mock('../../../../src/client/actions');

describe('loadData', () => {

  const store = {
    dispatch: () => {
      return new Promise((res) => {
        res();
      });
    }
  };

  const journey = 'storageDocument';
  const documentNumber = 'some-document-number';

  beforeEach(() => {
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
  });

  it('will call all methods needed to load the component', async () => {
    SUT.documentNumber = documentNumber;

    await SUT.loadData(store, journey);

    expect(getStorageNotesFromRedis).toHaveBeenCalledWith(documentNumber);
  });

  it('should redirect to the forbidden page if the storage notes is unauthorised', () => {    
      const mockPush = jest.fn();
      new productDetails.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      storageNotes: { unauthorised: true} ,
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/some-previous-page'
      }
  }).componentDidUpdate();

  expect(mockPush).toHaveBeenCalledWith('/forbidden');
  
  });
});

describe('Back to progress page link', () => {
  let wrapper;
  beforeEach(() => {
    clearStorageNotes.mockReturnValue({ type: 'CLEAR_STORAGE_NOTES' });

    const mockStore = configureStore([thunk]);

    const props = {
      match: {
        params: {
          documentNumber: 'GBR-2021-CC-51F7BCC0A',
        },
      },
      route: {
        path: '/create-storage-document/123456789/add-product-to-this-consignment',
        previousUri:
          '/create-storage-document/:documentNumber/add-product-to-this-consignment',
        journey: 'storageNotes',
        progressUri: '/create-storage-document/progress',
        saveAsDraftUri: '/create-storage-document/storage-documents',
        title: 'Create a UK storage document - GOV.UK',
      }
    };

    const store = mockStore({
      clear: clearStorageNotes,
      global: {
        allFish: [],
      },
      errors: {},
      index: 0,
      scientificName: '',
      selectedDateOfUnloading: undefined,
      species: '',
      storageNotes: {
        addAnotherProduct: 'No',
        addAnotherStorageFacility: 'No',
        catches: [],
        errors: {},
        errorsUrl: '',
        storageFacilities: [],
        validationErrors: [{}],
      }
    });
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails.component {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should have a back to the progress page link', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
  });
});

describe('Product details snapshot', () => {
  let wrapper;
  beforeEach(() => {
    clearStorageNotes.mockReturnValue({ type: 'CLEAR_STORAGE_NOTES' });

    const mockStore = configureStore([thunk]);

    const props = {
      match: {
        params: {
          documentNumber: 'GBR-2021-CC-51F7BCC0A',
        },
      },
      history: {
        push: jest.fn(),

        location: {
          pathname:
            '/create-storage-document/123456789/add-product-to-this-consignment/0',
          search: '',
          state: undefined,
        },
      },
      route: {
        path: '/create-storage-document/123456789/add-product-to-this-consignment/0',
        previousUri:
          '/create-storage-document/:documentNumber/add-product-to-this-consignment/0',
        progressUri: '/create-storage-document/:documentNumber/progress',
        journey: 'storageNotes',
        saveAsDraftUri: '/create-storage-document/storage-documents',
        title: 'Create a UK storage document - GOV.UK',
      },
      storageNotes: {
        addAnotherProduct: 'No',
        addAnotherStorageFacility: 'No',
        catches: [
          {
            certificateNumber: 'ABCD',
            commodityCode: '123456',
            dateOfUnloading: '14/10/2021',
            id: 'abcd-1634218473',
            placeOfUnloading: 'Dover',
            product: 'Atlantic cod (COD)',
            productWeight: '100',
            scientificName: '',
            transportUnloadedFrom: 'ABCD1234',
            weightOnCC: '100',
          },
        ],
        errors: {},
        errorsUrl: '',
        storageFacilities: [
          {
            _facilityUpdated: false,
            facilityAddressOne: 'MMO, LANCASTER HOUSE, HAMPSHIRE COURT',
            facilityBuildingName: 'LANCASTER HOUSE',
            facilityBuildingNumber: '',
            facilityCountry: 'ENGLAND',
            facilityCounty: 'TYNESIDE',
            facilityName: 'Some facility',
            facilityPostcode: 'NE4 7YH',
            facilityStreetName: 'HAMPSHIRE COURT',
            facilitySubBuildingName: 'MMO',
            facilityTownCity: 'NEWCASTLE UPON TYNE',
          },
        ],
        validationErrors: [{}],
      },
      clear: clearStorageNotes
    };

    const store = mockStore({
      clear: clearStorageNotes,
      global: {
        allFish: [],
      },
      errors: {},
      index: 0,
      scientificName: '',
      selectedDateOfUnloading: undefined,
      species: '',
      history: {
        push: jest.fn(),

        location: {
          pathname:
            '/create-storage-document/123456789/add-product-to-this-consignment/0',
          search: '',
          state: undefined,
        },
      },
      storageNotes: {
        addAnotherProduct: 'No',
        addAnotherStorageFacility: 'No',
        catches: [
          {
            certificateNumber: 'ABCD',
            commodityCode: '123456',
            dateOfUnloading: '14/10/2021',
            id: 'abcd-1634218473',
            placeOfUnloading: 'Dover',
            product: 'Atlantic cod (COD)',
            productWeight: '100',
            scientificName: '',
            transportUnloadedFrom: 'ABCD1234',
            weightOnCC: '100',
          },
        ],
        errors: {},
        errorsUrl: '',
        storageFacilities: [
          {
            _facilityUpdated: false,
            facilityAddressOne: 'MMO, LANCASTER HOUSE, HAMPSHIRE COURT',
            facilityBuildingName: 'LANCASTER HOUSE',
            facilityBuildingNumber: '',
            facilityCountry: 'ENGLAND',
            facilityCounty: 'TYNESIDE',
            facilityName: 'Some facility',
            facilityPostcode: 'NE4 7YH',
            facilityStreetName: 'HAMPSHIRE COURT',
            facilitySubBuildingName: 'MMO',
            facilityTownCity: 'NEWCASTLE UPON TYNE',
          },
        ],
        validationErrors: [{}],
      },
    });
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails.component {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the product details component and take snapshot', () => {
    expect(wrapper).toBeDefined();
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('Product details errors', () => {
  let wrapper;
  const documentNumber = 'GBR-2021-CC-51F7BCC0A';
  beforeEach(() => {
    clearStorageNotes.mockReturnValue({ type: 'CLEAR_STORAGE_NOTES' });

    const mockStore = configureStore([thunk]);

    const storageNotes = {
      addAnotherProduct: 'No',
      addAnotherStorageFacility: 'No',
      catches: [{}],
      errors: {
        'catches-0-product': 'sdAddProductToConsignmentProductNameErrorNull',
        'catches-0-certificateNumber':
          'sdAddProductToConsignmentCertificateNumberErrorNull',
        'catches-0-commodityCode':
          'sdAddProductToConsignmentCommodityCodeErrorNull',
        'catches-0-dateOfUnloading':
          'sdAddProductToConsignmentDateOfUnloadingErrorNull',
        'catches-0-placeOfUnloading':
          'sdAddProductToConsignmentPlaceOfUnloadingErrorNull',
        'catches-0-productWeight':
          'sdAddProductToConsignmentExportWeightErrorNull',
        'catches-0-transportUnloadedFrom':
          'sdAddProductToConsignmentTransportDetailsErrorNull',
        'catches-0-weightOnCC': 'sdAddProductToConsignmentWeightOnCCErrorNull',
      },
      errorsUrl: '/',
      storageFacilities: [
        {
          _facilityUpdated: false,
          facilityAddressOne: 'MMO, LANCASTER HOUSE, HAMPSHIRE COURT',
          facilityBuildingName: 'LANCASTER HOUSE',
          facilityBuildingNumber: '',
          facilityCountry: 'ENGLAND',
          facilityCounty: 'TYNESIDE',
          facilityName: 'Some facility',
          facilityPostcode: 'NE4 7YH',
          facilityStreetName: 'HAMPSHIRE COURT',
          facilitySubBuildingName: 'MMO',
          facilityTownCity: 'NEWCASTLE UPON TYNE',
        },
      ],
      validationErrors: [{}],
    };

    const props = {
      match: {
        params: {
          documentNumber,
        },
      },
      history: {
        push: jest.fn(),

        location: {
          pathname: `/create-storage-document/${documentNumber}/add-product-to-this-consignment`,
          search: '',
          state: undefined,
        },
      },
      route: {
        journey: 'storageNotes',
        title: 'Create a UK storage document - GOV.UK',
        path: `/create-storage-document/${documentNumber}/add-product-to-this-consignment`,
        previousUri: `/create-storage-document/${documentNumber}/add-product-to-this-consignment`,
        saveAsDraftUri: `/create-storage-document/${documentNumber}/you-have-added-a-product`,
        nextUri: `/create-storage-document/${documentNumber}/you-have-added-a-product`,
        progressUri: `/create-storage-document/${documentNumber}/progress`
      },
      storageNotes,
      clear: clearStorageNotes,
    };

    const store = mockStore({
      clear: clearStorageNotes,
      global: {
        allFish: [],
      },
      index: 0,
      scientificName: '',
      selectedDateOfUnloading: undefined,
      species: '',
      history: {
        push: jest.fn(),

        location: {
          pathname:
            '/create-storage-document/123456789/add-product-to-this-consignment',
          search: '',
          state: undefined,
        },
      },
      storageNotes,
    });
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails.component {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the product details component with errors', () => {
    render(wrapper);

    expect(screen.getByText('Enter the FAO code or product name')).toBeTruthy();
    expect(screen.getByText('Enter the document number')).toBeTruthy();
    expect(
      screen.getByText(
        'Commodity code must be between 6 and 12 characters, and contain only letters, numbers, full stops, colons, hyphens, and slashes'
      )
    ).toBeTruthy();
    expect(
      screen.getByText('Enter the date product entered the UK')
    ).toBeTruthy();
    expect(
      screen.getByText('Enter the place product entered the UK')
    ).toBeTruthy();
    expect(screen.getByText('Enter the export weight in kg')).toBeTruthy();
  });
});