import * as React from 'react';
import products from '../../../../src/client/pages/storageNotes/products';
import { getStorageNotesFromRedis, clearStorageNotes } from '../../../../src/client/actions';
import { component as ProductDetails } from '../../../../src/client/pages/storageNotes/products';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';

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
    getStorageNotesFromRedis.mockReturnValue({
      type: 'GET_STORAGE_NOTES_FROM_REDIS'
    });
  });

  it('will call all methods needed to load the component', async () => {
    products.documentNumber = documentNumber;

    await products.loadData(store, journey);

    expect(getStorageNotesFromRedis).toHaveBeenCalledWith(documentNumber);
  });
});

describe('Redirecting to Add product to this consignment page during loading', () => {
  const mockPush = jest.fn();
  const mockGetFromRedis = jest.fn();

  it('should redirect to add product to this consignment page when there is no catch', async () => {
    const props = {
      match: {
        params: { documentNumber: 'GBR-23423-4234234' }
      },
      global: {
        allFish: []
      },
      history: {
        push: mockPush,
      },
      exporter: {
        model: {
          exporterFullName: 'Mr Fish Exporter',
          exportCompanyName: 'MailOrderFish Ltd',
          addressOne: '5 Costa Road',
          townCity: 'Hackney',
          postcode: 'NE1 4FS',
          _updated: true
        }
      },
      storageNotes: {
        addAnotherProduct: 'notset',
        addAnotherStorageFacility: 'notset',
        catches: [],
        validationErrors: [{}],
        storageFacilities: [
          {
            facilityName: 'Test1',
            _facilityUpdated: false
          }
        ]
      },
      transport: {
        vehicle: 'plane',
        exportedTo: {
          isoCodeAlpha2: 'Alpha2',
          isoCodeAlpha3: 'Alpha3',
          isoNumericCode: 'IsoNumericCode',
          officialCountryName: 'Eritrea'
        }
      },
      fish: [{}],
      getFromRedis: mockGetFromRedis
    };

    await new ProductDetails.WrappedComponent(props).componentDidMount();

    expect(mockGetFromRedis).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockPush).toHaveBeenCalledWith(
      '/create-storage-document/GBR-23423-4234234/add-product-to-this-consignment'
    );
  });
});

describe('Generate snapshot for the add products page', () => {
  const mockGetFromRedis = jest.fn();


  const props = {
    match: {
      params: { documentNumber: 'GBR-23423-4234234' }
    },
    global: {
      allFish: []
    },
    history: {
      location: {
        pathname: '/'
      }
    },
    exporter: {
      model: {
        exporterFullName: 'Mr Fish Exporter',
        exportCompanyName: 'MailOrderFish Ltd',
        addressOne: '5 Costa Road',
        townCity: 'Hackney',
        postcode: 'NE1 4FS',
        _updated: true
      }
    },
    storageNotes: {
      addAnotherProduct: 'notset',
      addAnotherStorageFacility: 'notset',
      catches: [],
      validationErrors: [{}],
      storageFacilities: [
        {
          facilityName: 'Test1',
          _facilityUpdated: false
        }
      ]
    },
    transport: {
      vehicle: 'plane',
      exportedTo: {
        isoCodeAlpha2: 'Alpha2',
        isoCodeAlpha3: 'Alpha3',
        isoNumericCode: 'IsoNumericCode',
        officialCountryName: 'Eritrea'
      }
    },
    fish: [{}],
    getFromRedis: mockGetFromRedis,
    route: {
      journey: 'storageDocument',
      previousUri: '/:documentNumber/you-have-added-a-product',
      progressUri: '/create-storage-document/progress'
    },
  };
  clearStorageNotes.mockReturnValue({
    type: 'CLEAR_STORAGE_NOTES'
  })
  const mockStore = configureStore([thunk]);

  it('should generate snapshot for the product page when there are 0 products', () => {
    const initialState = {
      storageNotes: {
        addAnotherProduct: 'notset',
        addAnotherStorageFacility: 'notset',
        catches: [],
        validationErrors: [{}],
        storageFacilities: [
          {
            facilityName: 'Test1',
            _facilityUpdated: false
          }
        ]
      }
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails {...props} />
        </MemoryRouter>
      </Provider>
    );

      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
  });
  it('should generate snapshot for the product page when there is at least 1 product', () => {
    const initialState = {
      storageNotes: {
        addAnotherProduct: 'notset',
        addAnotherStorageFacility: 'notset',
        catches: [{
          product: "Narrownecked oceanic eel (ADD)",
          commodityCode: "11555555",
          certificateNumber: "123",
          productWeight: "11",
          weightOnCC: "11",
          placeOfUnloading: "Felix",
          dateOfUnloading: "01/01/2022",
          transportUnloadedFrom: "dss",
          scientificName: ""
      }],
        validationErrors: [{}],
        storageFacilities: [
          {
            facilityName: 'Test1',
            _facilityUpdated: false
          }
        ]
      }
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails {...props} />
        </MemoryRouter>
      </Provider>
    );

      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
  });

  it('should generate snapshot for the product page when there are multiple products', () => {
    const initialState = {
      storageNotes: {
        addAnotherProduct: 'notset',
        addAnotherStorageFacility: 'notset',
        catches: [
          {
            product: 'Narrownecked oceanic eel (ADD)',
            commodityCode: '11555555',
            certificateNumber: '123',
            productWeight: '11',
            weightOnCC: '11',
            placeOfUnloading: 'Felix',
            dateOfUnloading: '01/01/2022',
            transportUnloadedFrom: 'dss',
            scientificName: '',
          },
          {
            product: 'Narrosecond oceanic eel (ADD)',
            commodityCode: '11555556',
            certificateNumber: '1234',
            productWeight: '11',
            weightOnCC: '11',
            placeOfUnloading: 'Felix',
            dateOfUnloading: '01/01/2022',
            transportUnloadedFrom: 'dss',
            scientificName: '',
          },
        ],
        validationErrors: [{}],
        storageFacilities: [
          {
            facilityName: 'Test1',
            _facilityUpdated: false,
          },
        ],
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails {...props} />
        </MemoryRouter>
      </Provider>
    );

      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
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
          }
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
          }
        ],
        validationErrors: [{}],
      }
    });
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetails {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should have a back to the progress page link', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
  });
});

describe('should redirect to the forbidden page', () => {
  const mockPush = jest.fn();
  const mockGetFromRedis = jest.fn();

  it('should redirect to the forbidden page if storageNotes is unauthorised', async () => {
    const props = {
      match: {
        params: { documentNumber: 'GBR-23423-4234234' }
      },
      global: {
        allFish: []
      },
      history: {
        push: mockPush,
      },
      exporter: {
        model: {
          exporterFullName: 'Mr Fish Exporter',
          exportCompanyName: 'MailOrderFish Ltd',
          addressOne: '5 Costa Road',
          townCity: 'Hackney',
          postcode: 'NE1 4FS',
          _updated: true
        }
      },
      storageNotes: {
        unauthorised: true
      },
      transport: {
        vehicle: 'plane',
        exportedTo: {
          isoCodeAlpha2: 'Alpha2',
          isoCodeAlpha3: 'Alpha3',
          isoNumericCode: 'IsoNumericCode',
          officialCountryName: 'Eritrea'
        }
      },
      fish: [{}],
      getFromRedis: mockGetFromRedis
    };

    await new ProductDetails.WrappedComponent(props).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });
});
