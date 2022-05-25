import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { component as StorageFacility } from '../../../../src/client/pages/storageNotes/storageFacility';
import storageFacility from '../../../../src/client/pages/storageNotes/storageFacility';
import { getStorageNotesFromRedis, clearStorageNotes } from '../../../../src/client/actions';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');

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


  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility route={{ previousUri: '', changeAddressUri: '', journey: 'storageNotes', path: '/products' }} />
      </MemoryRouter>
    </Provider>
  );

  it('should render when no storage facilities are provided', () => {
    expect(wrapper.find('StorageFacility').exists()).toBeTruthy();
    expect(wrapper.find('#continue').exists()).toBeFalsy();
  });
});

describe('StorageFacility - with storage notes and no storage facilities', () => {

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
    },
    match: {
      params: ''
    },
    clear: jest.fn()
  };

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacility {...props} />
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    clearStorageNotes.mockReturnValue({ type: 'CLEAR_STORAGE_NOTES' });
  });

  it('should render when no storage facilities are provided', () => {
    expect(wrapper.find('StorageFacility').exists()).toBeTruthy();
    expect(wrapper.find('#continue').exists()).toBeTruthy();
  });

  it('should have a back to the progress page link', () => {
    expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
  });


  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
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
          facilityName: 'FACILITY 1',
          facilityAddressOne: 'BUILDING 1, STREET 1',
          facilityBuildingName: 'BUILDING 1',
          facilityStreetName: 'STREET 1',
          facilityTownCity: 'TOWN 1',
          facilityCounty: 'COUNTY 1',
          facilityCountry: 'COUNTRY 1',
          facilityPostcode: 'POSTCODE 1'
        }
      ]
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
    fish: [{}],
    index: 0
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

  it('will render when storage facilities are provided', () => {
    expect(wrapper.exists('StorageFacility')).toBe(true);
    expect(wrapper.exists('#continue')).toBe(true);
  });

  describe('when populating from state', () => {

    it('will populate the facility name', () => {
      expect(wrapper.exists('[id=\'storageFacilities.0.facilityName\']')).toBe(true);

      expect(wrapper.find('[id=\'storageFacilities.0.facilityName\']').at(0).props()['value']).toBe('FACILITY 1');
    });

    it('will populate the facility address from state', () => {
      expect(wrapper.exists('LookupAddress')).toBe(true);

      expect(wrapper.find('LookupAddress').at(0).props()['addressOne']).toBe('BUILDING 1, STREET 1');
      expect(wrapper.find('LookupAddress').at(0).props()['townCity']).toBe('TOWN 1');
      expect(wrapper.find('LookupAddress').at(0).props()['postcode']).toBe('POSTCODE 1');
    });

  });

  describe('when populating from postcode lookup', () => {

    const stateWithPostcodeLookup = {
      ...state,
      postcodeLookup: {
        postcodeLookupAddress: {
          facilityAddressOne: 'BUILDING 2, STREET 2',
          facilityBuildingName: 'BUILDING 2',
          facilityStreetName: 'STREET 2',
          facilityTownCity: 'TOWN 2',
          facilityCounty: 'COUNTY 2',
          facilityCountry: 'COUNTRY 2',
          facilityPostcode: 'POSTCODE 2'
        }
      }
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

    const storeWithPostcodeLookup = mockStore(stateWithPostcodeLookup);

    const wrapperWithPostcodeLookup = mount(
      <Provider store={storeWithPostcodeLookup}>
        <MemoryRouter>
          <StorageFacility {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('will override the address in state', () => {
      expect(wrapperWithPostcodeLookup.exists('LookupAddress')).toBe(true);

      expect(wrapperWithPostcodeLookup.find('LookupAddress').at(0).props()['addressOne']).toBe('BUILDING 2, STREET 2');
      expect(wrapperWithPostcodeLookup.find('LookupAddress').at(0).props()['townCity']).toBe('TOWN 2');
      expect(wrapperWithPostcodeLookup.find('LookupAddress').at(0).props()['postcode']).toBe('POSTCODE 2');
    });

    it('will not override the facility name', () => {
      expect(wrapperWithPostcodeLookup.exists('[id=\'storageFacilities.0.facilityName\']')).toBe(true);

      expect(wrapperWithPostcodeLookup.find('[id=\'storageFacilities.0.facilityName\']').at(0).props()['value']).toBe('FACILITY 1');
    });

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

describe('StorageFacility - unauthorised', () => {
  const mockPush = jest.fn();
  const mockClear = jest.fn();

  const props = {
    match: {
      params: {
        documentNumber: 'some-document-number'
      }
    },
    history: {
      push: mockPush,
    },
    storageNotes: {
      unauthorised: true,
      changeAddress: true,
      storageFacilities: []
    },
    index: 0,
    getFromRedis: jest.fn(),
    clear: mockClear
  };

  it('should push history for componentDidUpdate with /forbidden when unauthorised', () => {
    new StorageFacility.WrappedComponent(props).componentDidUpdate();
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should clear the storage document', () => {
    new StorageFacility.WrappedComponent(props).componentWillUnmount();
    expect(mockClear).toHaveBeenCalledTimes(1);
  });
});
