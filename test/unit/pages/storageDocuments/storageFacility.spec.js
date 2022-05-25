import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { component as StorageFacility } from '../../../../src/client/pages/storageNotes/storageFacility';
import storageFacility from '../../../../src/client/pages/storageNotes/storageFacility';
import {
  getStorageNotesFromRedis,
  saveStorageNotesToRedis
} from '../../../../src/client/actions';
import { clearPostcodeLookupAddress } from '../../../../src/client/actions/postcode-lookup.actions';

jest.mock('../../../../src/client/actions');
jest.mock('../../../../src/client/actions/postcode-lookup.actions');

window.scrollTo = jest.fn();

const mockStore = configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    get: () => {
      return new Promise((res) => {
        res({});
      });
    }
  }
})]);

describe('StorageFacility - without storage notes', () => {

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

  const props = {
    route: {
      previousUri: '',
      progressUri: '/create-storage-document/progress',
      changeAddressUri: '',
      journey: 'storageNotes',
      path: '/products',
      firstStorageFacility: true
    }
  };


  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props} />
      </MemoryRouter>
    </Provider>
  );

  it('should render when no storage facilities are provided', () => {
    expect(wrapper.find('StorageFacility').exists()).toBeTruthy();
    expect(wrapper.find('#continue').exists()).toBeFalsy();
  });
});

describe('StorageFacility - with storage notes and changeAddress is undefined and no storage facilities', () => {

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
      storageFacilities: []
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

const props = {
  route: {
    previousUri: '',
    progressUri: '/create-storage-document/progress',
    changeAddressUri: '',
    journey: 'storageNotes',
    path: '/products',
    firstStorageFacility: true
  }
};

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props} />
      </MemoryRouter>
    </Provider>
  );

  it('should render when no storage facilities are provided', () => {
    expect(wrapper.find('StorageFacility').exists()).toBeTruthy();
    expect(wrapper.find('#continue').exists()).toBeTruthy();
  });
  
  it('should have a back to the progress page link', () => {
    expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
  });
});

describe('StorageFacility - with storage notes and storage facilities', () => {

  const state = {
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
      storageFacilities: [
        {
          facilityName: 'name ',
          facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
          facilityBuildingName: 'LANCASTER HOUSE',
          facilityStreetName: 'HAMPSHIRE COURT',
          facilityTownCity: 'NEWCASTLE UPON TYNE',
          facilityCounty: 'TYNESIDE',
          facilityCountry: 'ENGLAND',
          facilityPostcode: 'NE4 7YH',
        },
        {
          facilityName: 'name ',
          facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
          facilityBuildingName: 'LANCASTER HOUSE',
          facilityStreetName: 'HAMPSHIRE COURT',
          facilityTownCity: 'NEWCASTLE UPON TYNE',
          facilityCounty: 'TYNESIDE',
          facilityCountry: 'ENGLAND',
          facilityPostcode: 'NE4 7YH',

        }
      ],
      changeAddress: true
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
  };

  const props = {
    route: {
      previousUri: '',
      progressUri: '/create-storage-document/progress',
      changeAddressUri: '',
      journey: 'storageNotes',
      path: '/products',
      firstStorageFacility: true
    }
  };

  const store = mockStore(state);

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props} />
      </MemoryRouter>
    </Provider>
  );

  beforeAll(() => {
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
    saveStorageNotesToRedis.mockReturnValue({ type: 'SAVE_STORAGE_NOTES_TO_REDIS' });
    clearPostcodeLookupAddress.mockReturnValue({ type: 'CLEAR_POSTCODE_LOOKUP_ADDRESS' });
  });

  it('will render', () => {
    expect(wrapper.exists('StorageFacility')).toBe(true);
    expect(wrapper.exists('#continue')).toBe(true);
  });
  it('should not render a notification banner if  the addressOne property exists', () => {
    expect(wrapper.find('NotificationBanner').exists()).toBeFalsy();
  });

  describe('on continue click', () => {

    beforeAll(() => {
      wrapper.find('#continue').at(0).simulate('click');
    });

    it('will save data', () => {
      expect(saveStorageNotesToRedis).toHaveBeenCalled();
    });

    it('will clear the postcode lookup address', () => {
      expect(clearPostcodeLookupAddress).toHaveBeenCalled();
    });

  });

});


describe('StorageFacility showing a notification  when addressOne is not present', () => {
  const newState = {
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
      storageFacilities: [
        {
          facilityName: 'Facility 1',
          _facilityUpdated: true
        },
        {
          facilityName: 'Facility 2',
          _facilityUpdated: false
        }
      ],
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
  };

  const props = {
    route: {
      previousUri: '',
      progressUri: '/create-storage-document/progress',
      changeAddressUri: '',
      journey: 'storageNotes',
      path: '/products',
      firstStorageFacility: true
    }
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const store = mockStore(newState);

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props} />
      </MemoryRouter>
    </Provider>
  );
  it('will render the StorageFacility component', () => {
    expect(wrapper.exists('StorageFacility')).toBeDefined();
  });

  it('should render a notification banner if addressOne is not present', () => {
    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('header')).toBe('Important');
    expect(wrapper.find('NotificationBanner').prop('messages')).toEqual(
      ['Due to improvements in the way addresses are managed, the storage facility addresses in this document must be re-entered.']);
  });
});

describe('StorageFacility when showing a notification for _updated is true and facilityAddressOne is present', () => {
  const newState = {
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
      errors: {
        'storageFacilities-0-facilityName': 'sdAddStorageFacilityDetailsErrorEnterTheFacilityName',
        'storageFacilities-0-facilityAddressOne': 'sdAddStorageFacilityDetailsErrorEnterTheAddress',
        'storageFacilities-0-facilityTownCity': 'sdAddStorageFacilityDetailsErrorEnterTheTown',
        'storageFacilities-0-facilityPostcode':'sdAddStorageFacilityDetailsErrorEnterThePostcode'
      },
      errorsUrl: '/',
      storageFacilities: [
        {
          facilityName: 'name ',
          facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
          facilityBuildingName: 'LANCASTER HOUSE',
          facilityStreetName: 'HAMPSHIRE COURT',
          facilityTownCity: 'NEWCASTLE UPON TYNE',
          facilityCounty: 'TYNESIDE',
          facilityCountry: 'ENGLAND',
          facilityPostcode: 'NE4 7YH',
          _facilityUpdated: false
        },
        {
          facilityName: 'name ',
          facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
          facilityBuildingName: 'LANCASTER HOUSE',
          facilityStreetName: 'HAMPSHIRE COURT',
          facilityTownCity: 'NEWCASTLE UPON TYNE',
          facilityCounty: 'TYNESIDE',
          facilityCountry: 'ENGLAND',
          facilityPostcode: 'NE4 7YH',
          _facilityUpdated: false

        }
      ],
      changeAddress: true
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
  };
  const props = {
    route: {
      previousUri: '',
      progressUri: '/create-storage-document/:documentNumber/progress',
      changeAddressUri: '',
      journey: 'storageNotes',
      path: '/products',
      firstStorageFacility: true
    }
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const store = mockStore(newState);

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props} />
      </MemoryRouter>
    </Provider>
  );

  it('should should show translated errors', () => {
    expect(wrapper.find('#errorIsland')).toBeDefined();
    expect(wrapper.find('#errorIsland .error-summary-list li').at(0).find('a').text()).toBe('Enter the facility name');
    expect(wrapper.find('#errorIsland .error-summary-list li').at(1).find('a').text()).toBe('Enter the address');
    expect(wrapper.find('#errorIsland .error-summary-list li').at(2).find('a').text()).toBe('Enter the town or city');
    expect(wrapper.find('#errorIsland .error-summary-list li').at(3).find('a').text()).toBe('Enter the postcode');
  });

  it('will render the StorageFacility component', () => {
    expect(wrapper.exists('StorageFacility')).toBeDefined();
  });

  it('should not render a notification banner if _facilityUpdated is false and facilityAddressOne has data', () => {
    expect(wrapper.find('NotificationBanner').exists()).toBeFalsy();
  });
});
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
    storageFacility.documentNumber = documentNumber;

    await storageFacility.loadData(store, journey);

    expect(getStorageNotesFromRedis).toHaveBeenCalledWith(documentNumber);
  });

});

describe('if changeAddress is true', () => {

  const mockGet = jest.fn();

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: mockGet
    }
  })]);

  const storeWithChangeAddress = mockStore({
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
      changeAddress: true,
      storageFacilities: []
    }
  });

  const props = {
    route: {
      previousUri: '',
      progressUri: '/create-storage-document/progress',
      changeAddressUri: '',
      journey: 'storageNotes',
      path: '/products'
    }
  };

  mount(
    <Provider store={storeWithChangeAddress}>
      <MemoryRouter>
        <StorageFacility {...props}  />
      </MemoryRouter>
    </Provider>
  );

  it('will not load the storage faclilty  data', () => {
    expect(mockGet).not.toHaveBeenCalled();
  });

});
