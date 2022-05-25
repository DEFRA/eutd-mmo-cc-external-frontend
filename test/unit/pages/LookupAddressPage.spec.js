import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { STAGES, NAVIGATION_STAGES, postcodeLookupContexts, component as LookupAddressPage } from '../../../src/client/pages/common/LookupAddressPage';
import { clearErrors, saveManualLookupAddress } from '../../../src/client/actions/postcode-lookup.actions';
import lookupAddressPage from '../../../src/client/pages/common/LookupAddressPage';
import { getAllCountries } from '../../../src/client/actions';
import AddAddressForm from '../../../src/client/components/AddAddressForm';
import { createMemoryHistory } from 'history';
import { catchCertificateJourney, storageNoteJourney } from '../../../src/client/helpers/journeyConfiguration';
import { render } from '@testing-library/react';

jest.mock('../../../src/client/actions/postcode-lookup.actions');
jest.mock('../../../src/client/actions');

const mockBeforeEach = () => {
  clearErrors.mockReturnValue({ type: 'CREATE_EXPORT_CERT' });
};

describe('stages', () => {
  it('should have the correct stages', () => {
    expect(STAGES).toStrictEqual({
      NEXT: 'NEXT',
      PREV: 'PREV',
      SKIP: 'SKIP'
    });
  });
});

describe('Exporters Address page', () => {

  let wrapper;
  const mockStore = configureStore();

  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      global: {
        allCountries: [],
        allCountriesData: []
      },
      errors: {
        postcodeError: 'Enter a postcode',
        errors: [
          {
            targetName: 'postcode', text: 'Enter a postcode'
          }
        ]
      },
      postcodeLookup: {
        unauthorised: false
      }
    });

    window.scrollTo = jest.fn();
    const props = {
      match: {
        params: { documentNumber: 'GBR-2021-CC-51F7BCC0A' },
      },
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/create-catch-certificate/:documentNumber/add-exporter-address',
        path: '/create-catch-certificate/:documentNumber/what-exporters-address',
        postcodeLookupAddressTitle: 'What is the exporter’s address',
        journey: 'catchCertificate',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      errors: {
        postcodeError: 'Enter a postcode',
        errors: [
          {
            targetName: 'postcode', text: 'Enter a postcode'
          }
        ]
      },
      history:[],
      journey: 'catchCertificate',
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LookupAddressPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render exporters address page', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render paragraph with the header text', () => {
    expect(wrapper.find('Header').first().text()).toContain('What is the exporter’s address');
  });

  it('should render enter the address manually link', () => {
    expect(wrapper.find('button#enter-address-manually-link').exists()).toBeTruthy();
  });

  it('should render enter a back to progress page link', () => {
    expect(wrapper.find('a[href="/create-catch-certificate/undefined/progress"]').exists()).toBeTruthy();
  });

  it('should handle submit event', () => {
    wrapper.find('button#findAddress').simulate('submit', { preventDefault() {} });
    expect(true).toBeTruthy();
  });

  it('should handle cancel event', () => {
    wrapper.find('button#cancel').simulate('click', { preventDefault() {} });
    expect(true).toBeTruthy();
  });

  it('should have an id on all inputs, links and buttons', () => {
    expect(wrapper.find('input[id="postcode"]').exists()).toBeTruthy();
    expect(wrapper.find('button[id="cancel"]').exists()).toBeTruthy();
    expect(wrapper.find('button[id="enter-address-manually-link"]').exists()).toBeTruthy();
    expect(wrapper.find('button[id="findAddress"]').exists()).toBeTruthy();

    act(() => {
      wrapper.find('button[id="enter-address-manually-link"]').simulate('click');
    });
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('postcode');
  });

  it('should render the errors when there are any', () => {
    expect(wrapper.exists('ErrorIsland')).toBeTruthy();
    expect(wrapper.find('ErrorText').first().text()).toContain('Enter a postcode');
    expect(wrapper.find('#errorIsland').text()).toContain('There is a problemEnter a postcode');
  });

  it('should redirect to forbidden error page when unauthorised', () => {
    const mockPush = jest.fn();
    const prevProps = {};
    const prevState = {
      selectedAddress: ''
    };

    new LookupAddressPage.WrappedComponent({
      unauthorised: true,
      history: {
        push: mockPush
      }
    }).componentDidUpdate(prevProps, prevState);

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should redirect to landings entry page if there is no landing entry for a cc journey', async () => {
    const documentNumber = 'document123';
    const props = {
      match: {
        params: {
          documentNumber
        }
      },
      route: {
        landingsEntryUri: '/:documentNumber/landings-entry',
        journey: catchCertificateJourney
      },
      history: {
        push: jest.fn()
      },
      getAllCountries: jest.fn(),
      getLandingType: jest.fn()
    };

    await new LookupAddressPage.WrappedComponent(props).componentDidMount();

    expect(props.getLandingType).toHaveBeenCalledWith(documentNumber);
    expect(props.history.push).toHaveBeenCalledWith(props.route.landingsEntryUri.replace(':documentNumber', documentNumber));
  });

  it('should not redirect to landings entry page if there is a landing entry for a cc journey', async () => {
    const documentNumber = 'document123';
    const props = {
      match: {
        params: {
          documentNumber
        }
      },
      route: {
        landingsEntryUri: '/:documentNumber/landings-entry',
        journey: catchCertificateJourney
      },
      landingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false
      },
      history: {
        push: jest.fn()
      },
      getAllCountries: jest.fn(),
      getLandingType: jest.fn()
    };

    await new LookupAddressPage.WrappedComponent(props).componentDidMount();

    expect(props.getLandingType).toHaveBeenCalledWith(documentNumber);
    expect(props.history.push).not.toHaveBeenCalled();
  });

  it('should not redirect to landings entry page if there is no landing entry for a non-cc journey', async () => {
    const documentNumber = 'document123';
    const props = {
      match: {
        params: {
          documentNumber
        }
      },
      route: {
        landingsEntryUri: '/:documentNumber/landings-entry',
        journey: storageNoteJourney
      },
      history: {
        push: jest.fn()
      },
      getAllCountries: jest.fn(),
      getLandingType: jest.fn()
    };

    await new LookupAddressPage.WrappedComponent(props).componentDidMount();

    expect(props.getLandingType).not.toHaveBeenCalled();
    expect(props.history.push).not.toHaveBeenCalled();
  });
});

describe('Processing Statement Journey - Processing Plant Address using Postcode lookup: Enter Postcode (Step 1)', () => {

  let wrapper;
  const mockStore = configureStore();

  beforeEach(() => {
    const store = mockStore({
      global: {
        allCountries: [],
        allCountriesData: []
      },
      postcodeLookup: {
        unauthorised: false
      }
    });

    window.scrollTo = jest.fn();
    const props = {
      match: {
        params: {documentNumber: 'GBR-2021-CC-51F7BCC0A'},
      },
      route: {
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: '/create-processing-statement/:documentNumber/add-processing-plant-details',
        nextUri: '/create-processing-statement/:documentNumber/add-processing-plant-details',
        path: '/create-processing-statement/:documentNumber/what-processing-plant-address',
        postcodeLookupAddressTitle: 'What is the processing plant address?',
        journey: 'processingStatement',
        progressUri: '/create-processing-statement/:documentNumber/progress'
      },
      errors: [],
      history: [],
      journey: 'processingStatement',
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LookupAddressPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render Exporter Address page for Processing Statement journey', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render corresponding title', () => {
    const expectedTitle = 'What is the processing plant address?';
    const titleElement = wrapper.find('h1');
    expect (titleElement.text()).toBe(expectedTitle);
  });

  it('should render input element for postcode', () => {
    const targetElement = wrapper.find('#postcode');
    expect(targetElement).toBeDefined();
  });


  it('should render Enter Manual Address and associate correct route to it', () => {
    const props = {
      match: {
        params: {documentNumber: 'GBR-2021-CC-51F7BCC0A'},
      },
      route: {
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: '/create-processing-statement/GBR-2021-CC-51F7BCC0A/add-processing-plant-details',
        nextUri: '/create-processing-statement/GBR-2021-CC-51F7BCC0A/add-processing-plant-details',
        path: '/create-processing-statement/GBR-2021-CC-51F7BCC0A/what-processing-plant-address',
        progressUri: '/create-processing-statement/:documentNumber/progress'
      },
      errors: [],
      history: [],
      journey: 'processingStatement',
    };

    const store = mockStore({
      global: {
        allCountries: []
      },
      postcodeLookup: {
        unauthorised: false
      }
    });

    wrapper = wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LookupAddressPage {...props} />
        </MemoryRouter>
      </Provider>
    );
    const targetElement = wrapper.find('button#enter-address-manually-link');
    expect(targetElement.text()).toBe('Enter the address manually');
  });

  it('should show correct errors on postcode lookup  - (Step 1)', ()=> {
    const props = {
      match: {
        params: {documentNumber: 'GBR-2021-CC-51F7BCC0A'},
      },
      route: {
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: '/create-processing-statement/GBR-2021-CC-51F7BCC0A/add-processing-plant-details',
        nextUri: '/create-processing-statement/GBR-2021-CC-51F7BCC0A/add-processing-plant-details',
        path: '/create-processing-statement/GBR-2021-CC-51F7BCC0A/what-processing-plant-address',
        progressUri: '/create-processing-statement/:documentNumber/progress'
      },
      errors: [],
      history: [],
      journey: 'processingStatement'
    };

    const store = mockStore({
      global: {
        allCountries: []
      },
      postcodeLookup: {
        unauthorised: false
      },
      errors: {
        postcodeError: 'commonLookupAddressPageErrorSelectedAddress',
        errors: [
          {
            targetName: 'postcode', text: 'commonLookupAddressPageErrorSelectedAddress'
          }
        ]
      },
    });

    wrapper = wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LookupAddressPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.exists('ErrorIsland')).toBeTruthy();
    expect(wrapper.find('ErrorText').first().text()).toBe('Select an address to continue or click \'I cannot find my address in the list\'');
    expect(wrapper.find('#errorIsland').text()).toBe('There is a problemSelect an address to continue or click \'I cannot find my address in the list\'');
  });

  it('should take a snapshot of the PostcodeLookUp - (Step 1)', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should render enter a back to progress page link', () => {
    expect(wrapper.find('a[href="/create-processing-statement/undefined/progress"]').exists()).toBeTruthy();
  });
});

describe('Processing Statement Journey - Processing Plant Address using Postcode lookup: Select Address (Step 2)', () => {

  let wrapper;
  const mockStore = configureStore();

  beforeEach(() => {
    mockBeforeEach();

    const store = mockStore({
      global: {
        allCountries: [],
        allCountriesData: []
      },
      postcodeLookup: {
        unauthorised: false
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      match: {
        params: {documentNumber: 'GBR-2021-CC-51F7BCC0A'},
      },
      route: {
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: 'create-processing-statement/:documentNumber/add-processing-plant-details',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        nextUri: 'create-processing-statement/:documentNumber/add-processing-plant-details',
        path: 'create-processing-statement/:documentNumber/what-processing-plant-address',
      },
      errors: [],
      history: [],
      journey: 'processingStatement',
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
      setSelectedAddress: jest.fn(),
      postcode:'E11JR'
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LookupAddressPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('LookupAddressPage').setState({
      addresses: [{
        address_line: 'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
        building_name: 'LANCASTER HOUSE',
        city: 'NEWCASTLE UPON TYNE',
        country: 'ENGLAND',
        county: 'TYNESIDE',
        postCode: 'NE4 7YH',
        street_name: 'HAMPSHIRE COURT'
      }],
      selectedAddressForEdit: {
        address_line: 'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
        building_name: 'LANCASTER HOUSE',
        city: 'NEWCASTLE UPON TYNE',
        country: 'ENGLAND',
        county: 'TYNESIDE',
        postCode: 'NE4 7YH',
        street_name: 'HAMPSHIRE COURT'
      },
      errors: {},
      postcode: 'NE4 7YH',
      selectedAddress: '',
      selectedAddressError: {},
      steps: NAVIGATION_STAGES.SELECTED_ADDRESS,
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
      setSelectedAddress: jest.fn()
    });
  });

  it('should render Select Address Component', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.exists('SelectAddress')).toBe(true);
  });

  it('should handle selected address navigation click', () => {
    wrapper.find('#selectAddressNavigationSkip').simulate('click', { preventDefault() {} });

    expect(clearErrors).toHaveBeenCalled();
  });

});

describe('Processing Statement Journey - Processing Plant Address using Postcode lookup: Manual Address (Step 3)', () => {

  let wrapper;
  const mockStore = configureStore();

  beforeEach(() => {

    const store = mockStore({
      global: {
        allCountries: [],
        allCountriesData: []
      },
      postcodeLookup: {
        unauthorised: false
      }
    });

    window.scrollTo = jest.fn();
    const props = {
      match: {
        params: {documentNumber: 'GBR-2021-CC-51F7BCC0A'},
      },
      route: {
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: 'create-processing-statement/:documentNumber/add-processing-plant-details',
        nextUri: 'create-processing-statement/:documentNumber/add-processing-plant-details',
        path: 'create-processing-statement/:documentNumber/what-processing-plant-address',
        progressUri: '/create-processing-statement/:documentNumber/progress'
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
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LookupAddressPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('LookupAddressPage').setState({
      addresses: [{
        building_name: 'LANCASTER HOUSE',
        city:'NEWCASTLE UPON TYNE',
        country: 'ENGLAND',
        county: 'TYNESIDE',
        postCode: 'NE4 7YH',
        street_name: 'HAMPSHIRE COURT',

      }],
      selectedAddressForEdit: {
        building_name: 'LANCASTER HOUSE',
        city:'NEWCASTLE UPON TYNE',
        country: 'ENGLAND',
        county: 'TYNESIDE',
        postCode: 'NE4 7YH',
        street_name: 'HAMPSHIRE COURT'
      },
      errors:{},
      postcode: 'NE4 7YH',
      selectedAddress: 'LANCASTER HOUSE, HAMPSHIRE COURT, TYNESIDE, ENGLAND, NEWCASTLE UPON TYNE, NE4 7YH',
      selectedAddressError: {},
      steps: NAVIGATION_STAGES.MANUAL_ADDRESS,
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
      setSelectedAddress:jest.fn()
    });

  });


  it('should render Add Manual Address Component', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find(AddAddressForm).exists()).toBe(true);
  });

});

describe('Storage Document Journey - Storage Facility Address using Postcode lookup: Manual Address (Step 3)', () => {

  let wrapper;
  const mockStore = configureStore();

  const documentNumber = 'GBR-2020-SD-123456';
  const facilityIndex = 1;

  const history = createMemoryHistory({ initialEntries: [`create-storage-document/${documentNumber}/what-storage-facility-address/${facilityIndex}`] });
  const mockHistoryPush = jest.spyOn(history, 'push');
  const props = {
    route: {
      title: 'Create a UK storage document - GOV.UK',
      previousUri: 'create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
      nextUri: 'create-storage-document/:documentNumber/add-storage-facility-details/:facilityIndex',
      path: 'create-storage-document/:documentNumber/what-storage-facility-address/:facilityIndex',
      postcodeLookupContext: postcodeLookupContexts.STORAGE_FACILITY_ADDRESS,
      postcodeLookupAddressTitle: 'What is the storage facility address?',
      journey: 'storageNotes',
      progressUri: '/create-storage-document/progress'
    },
    errors: [],
    journey: 'storageNotes',
    addresses: [{
      building_name: 'LANCASTER HOUSE',
      city: 'NEWCASTLE UPON TYNE',
      country: 'ENGLAND',
      county: 'TYNESIDE',
      postCode: 'NE4 7YH',
      street_name: 'HAMPSHIRE COURT',
    }],
  };

  beforeEach(() => {
    getAllCountries.mockReset();
    getAllCountries.mockReturnValue([]);

    saveManualLookupAddress.mockReset();
    saveManualLookupAddress.mockReturnValue(true);

    const store = mockStore({
      global: {
        allCountries: [],
        allCountriesData: []
      },
      postcodeLookup: {
        unauthorised: false
      }
    });

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="create-storage-document/:documentNumber/what-storage-facility-address/:facilityIndex">
            <LookupAddressPage {...props} />
          </Route>
        </Router>
      </Provider>
    );

    wrapper.find('LookupAddressPage').setState({
      addresses: [{
        building_name: 'LANCASTER HOUSE',
        city:'NEWCASTLE UPON TYNE',
        country: 'ENGLAND',
        county: 'TYNESIDE',
        postCode: 'NE4 7YH',
        street_name: 'HAMPSHIRE COURT',
      }],
      selectedAddressForEdit: {
        building_name: 'LANCASTER HOUSE,',
        city:'NEWCASTLE UPON TYNE,',
        country: 'ENGLAND,',
        county: 'TYNESIDE,',
        postCode: 'NE4 7YH,',
        street_name: 'HAMPSHIRE COURT,'
      },
      errors:{},
      postcode: 'NE4 7YH',
      selectedAddress: 'LANCASTER HOUSE, HAMPSHIRE COURT, TYNESIDE, ENGLAND, NEWCASTLE UPON TYNE, NE4 7YH',
      selectedAddressError: {},
      steps: NAVIGATION_STAGES.MANUAL_ADDRESS,
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
      setSelectedAddress:jest.fn()
    });

  });

  it('will render Add Manual Address Component', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find(AddAddressForm).exists()).toBe(true);
  });

  it('will remove commas from address lines', () => {
    const manualAddressPayload = {
      context: 'STORAGE DOCUMENT STORAGE FACILITY ADDRESS',
      documentNumber: 'GBR-2020-SD-123456',
      state: {
        buildingName: 'LANCASTER HOUSE',
        buildingNumber: undefined,
        country: 'ENGLAND',
        county: 'TYNESIDE',
        postcode: 'NE4 7YH',
        streetName: 'HAMPSHIRE COURT',
        subBuildingName: undefined,
        townCity: 'NEWCASTLE UPON TYNE',
      },
    };

    wrapper.find(AddAddressForm).simulate('submit');
    expect(saveManualLookupAddress).toHaveBeenCalledWith(manualAddressPayload);
  });

  it('will handle form submission', () => {
    wrapper.find(AddAddressForm).simulate('submit');

    expect(saveManualLookupAddress).toHaveBeenCalled();
  });

  it('will handle form cancel', () => {
    wrapper.find('#cancel').at(0).simulate('click');

    expect(mockHistoryPush).toHaveBeenCalledWith(
      `${props.route.nextUri
        .replace(':documentNumber', documentNumber)
        .replace(':facilityIndex', facilityIndex)}`
    );
  });

  it('should take a snapshot of the storage', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should have a back to the progress page link', () => {
    expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
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

  beforeEach(() => {
    getAllCountries.mockReturnValue({ type: 'SAVE' });
  });

  it('will call all methods needed to load the component', async () => {
    await lookupAddressPage.loadData(store);

    expect(getAllCountries).toHaveBeenCalled();
  });

});