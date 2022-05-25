import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import {
  getStorageNotesFromRedis,
  getTransportDetails,
  getExporterFromMongo,
  saveStorageNotes,
  generateStorageNotesPdf
} from '../../../../src/client/actions';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');

import { component as Summary } from '../../../../src/client/pages/storageNotes/summary';
const mockStore = configureStore([thunk]);

const store = mockStore({
  match: {
    params: {
      documentNumber: '123'
    }
  },
  global: {
    allFish: []
  },
  exporter: {
    model: {
      exporterCompanyName: 'MailOrderFish Ltd',
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
    }],
    validationErrors: [{}],
    storageFacilities: [{
      facilityName: 'Test1 from store',
      facilityAddressOne: 'Some Address One',
      facilityTownCity: 'Some Town',
      facilityPostcode: 'Some PostCode',
      _facilityUpdated: false
    },
      {
        facilityName: 'Test2 from store',
        facilityAddressOne: 'Some Address One',
        facilityTownCity: 'Some Town',
        facilityPostcode: 'Some PostCode',
        _facilityUpdated: true
    }],
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
  saveAsDraft: {
    currentUri: {
      'GBR-2020-SD-7B3E62FE9': '/create-storage-document/:documentNumber/add-exporter-details'
    },
    journey: 'storageNotes',
    user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
  }
}
);


const props = {
  match: {
    params: {
      documentNumber: '123'
    }
  },
  path: '/create-storage-document/:documentNumber/check-your-information',
  url: '/create-storage-document/GBR-2021-SD-0467026EB/check-your-information',
  route: {
    journey: 'storageNotes',
    path: '/create-storage-document/:documentNumber/check-your-information',
    title: 'Create a UK storage document - GOV.UK',
  },
  errors: [],
  history: [],
  journey: 'processingStatement',
  addresses: [{
    building_name: 'LANCASTER HOUSE',
    city: 'NEWCASTLE UPON TYNE',
    country: 'ENGLAND',
    county: 'TYNESIDE',
    postCode: 'NE4 7YH',
    street_name: 'HAMPSHIRE COURT',

  }],
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
    }],
    global: {
      allFish: []
    },
    exporter: {
      model: {
        exporterCompanyName: 'MailOrderFish Ltd',
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
      }],
      validationErrors: [{}],
      storageFacilities: [{
        facilityName: 'Test1',
        facilityAddressOne: 'Some Address One',
        facilityTownCity: 'Some Town',
        facilityPostcode: 'Some PostCode',
        _facilityUpdated: false
      },
      {
        facilityName: 'Test2',
        facilityAddressOne: 'Some Address One',
        facilityTownCity: 'Some Town',
        facilityPostcode: 'Some PostCode',
        _facilityUpdated: true
      }],
    },
    transport: {
      vehicle: 'truck',
      cmr: 'true',
      nationalityOfVehicle: 'some-of-vehicle',
      registrationNumber: 'registration-number',
      departurePlace: 'departure-palce',
      exportDate: 'export-date',
      exportedTo: {
        isoCodeAlpha2: 'Alpha2',
        isoCodeAlpha3: 'Alpha3',
        isoNumericCode: 'IsoNumericCode',
        officialCountryName: 'Brazil',
      }
    },
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
  saveAsDraft: {
    currentUri: {
      'GBR-2020-SD-7B3E62FE9': '/create-storage-document/:documentNumber/add-exporter-details'
    },
    journey: 'storageNotes',
    user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
  },

};

describe('SummaryPage', () => {
  const documentNumber = 'GBR-2020-SD-123456';
  const history = createMemoryHistory({ initialEntries: [`/create-storage-document/${documentNumber}/check-your-information`] });
  const mockHistoryPush = jest.spyOn(history, 'push');

  let wrapper;
  beforeAll(() => {
    getExporterFromMongo.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS ' });
    saveStorageNotes.mockReturnValue({ type: 'SAVE_STORAGE_NOTES' });
    generateStorageNotesPdf.mockReturnValue({ type: 'GENERAGE_STORAGE_NOTES' });

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
            <Route path='/create-storage-document/:documentNumber/check-your-information' exact match={{ params: { documentNumber: '123' } }} >
              <Summary {...props} />
            </Route>
        </Router>
      </Provider>
    );
  });

  afterAll(() => {
    getExporterFromMongo.mockReset();
    getStorageNotesFromRedis.mockReset();
    getTransportDetails.mockReset();
    saveStorageNotes.mockReset();
    generateStorageNotesPdf.mockReset();
  });

  it('should redirect to add storage facilities page if _facilityUpdated is true', () => {
    expect(wrapper).toBeDefined();
    expect(mockHistoryPush).toHaveBeenCalledWith('/create-storage-document/GBR-2020-SD-123456/add-storage-facility-details/1');
  });
});

describe('Summary page for sd journey',() => {

  const documentNumber = 'GBR-2020-SD-123456';
  const history = createMemoryHistory({ initialEntries: [`/create-storage-document/${documentNumber}/check-your-information`] });


  let wrapper;
  beforeEach(() => {
    getExporterFromMongo.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
    getTransportDetails.mockReturnValue({ type: 'GET_TRANSPORT_DETAILS ' });
    saveStorageNotes.mockReturnValue({ type: 'SAVE_STORAGE_NOTES' });
  });
  afterEach(() => {
    getExporterFromMongo.mockReset();
    getStorageNotesFromRedis.mockReset();
    getTransportDetails.mockReset();
    saveStorageNotes.mockReset();
  });


  wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
          <Route path='/create-storage-document/:documentNumber/check-your-information' exact match={{ params: { documentNumber: '123' } }} >
            <Summary {...props} />
          </Route>
      </Router>
    </Provider>
  );


  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('SummaryPage - error island', () => {

  const props = {
    match: {
      params: {
        documentNumber: '123'
      }
    },
    path: '/create-storage-document/:documentNumber/check-your-information',
    url: '/create-storage-document/GBR-2021-SD-0467026EB/check-your-information',
    route: {
      journey: 'storageNotes',
      path: '/create-storage-document/:documentNumber/check-your-information',
      title: 'Create a UK storage document - GOV.UK',
    },
    errors: [],
    history: [],
    journey: 'processingStatement',
    addresses: [{
      building_name: 'LANCASTER HOUSE',
      city: 'NEWCASTLE UPON TYNE',
      country: 'ENGLAND',
      county: 'TYNESIDE',
      postCode: 'NE4 7YH',
      street_name: 'HAMPSHIRE COURT',

    }],
    global: {
      allFish: []
    },
    exporter: {
      model: {
        exporterCompanyName: 'MailOrderFish Ltd',
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
      }],
      validationErrors: [{}],
      storageFacilities: [{
        facilityName: 'Test1',
        facilityAddressOne: 'Some Address One',
        facilityTownCity: 'Some Town',
        facilityPostcode: 'Some PostCode',
        _facilityUpdated: false
      },
      {
        facilityName: 'Test2',
        facilityAddressOne: 'Some Address One',
        facilityTownCity: 'Some Town',
        facilityPostcode: 'Some PostCode',
        _facilityUpdated: true
      }],
    },
    transport: {
      vehicle: 'truck',
      cmr: 'true',
      nationalityOfVehicle: 'some-of-vehicle',
      registrationNumber: 'registration-number',
      departurePlace: 'departure-palce',
      exportDate: 'export-date',
      exportedTo: {
        isoCodeAlpha2: 'Alpha2',
        isoCodeAlpha3: 'Alpha3',
        isoNumericCode: 'IsoNumericCode',
        officialCountryName: 'Brazil',
      }
    },
    fish: [{}],
    saveAsDraft: {
      currentUri: {
        'GBR-2020-SD-7B3E62FE9': '/create-storage-document/:documentNumber/add-exporter-details'
      },
      journey: 'storageNotes',
      user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
    },

  };

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <Summary {...props}/>
      </MemoryRouter>
    </Provider>
  );

  it('should not render an error island component', () => {
    expect(wrapper.find('ErrorIsland').exists()).toBe(false);
  });

  it('should not render an error island component when validation errors are empty', () => {

    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    expect(wrapper.find('ErrorIsland').exists()).toBe(false);
  });
});