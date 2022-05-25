import {  mount } from 'enzyme';
import * as React from 'react';
import {component as WhereAreYouExportingFrom} from '../../../src/client/pages/exportCertificates/WhereAreYouExportingFrom';
import WhereAreYouExportingFromExport from '../../../src/client/pages/exportCertificates/WhereAreYouExportingFrom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { addSelectedExportCountry, getExportCountry, getAllCountries, clearExportCountry, ADD_SELECTED_EXPORT_COUNTRY, saveExportCountry } from '../../../src/client/actions/index';
import PageTitle from '../../../src/client/components/PageTitle';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import { act } from 'react-dom/test-utils';
import {render} from '@testing-library/react';

jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/landingsType.actions');

describe('WhereAreYouExportingFrom', () => {

  let wrapper;
  let store;
  let props;

  const history = createMemoryHistory();
  const mockPush = jest.spyOn(history, 'push');

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const exportLocation = jest.fn;

  props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: ':documentNumber/whose-waters-were-they-caught-in',
      nextUri: ':documentNumber/how-does-the-export-leave-the-uk',
      path: ':documentNumber/what-export-journey',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      journey: 'catchCertificate',
      summaryUri: ':documentNumber/check-your-information',
      progressUri: '/catch-certificates/:documentNumber/progress'
    },
    exportLocation: exportLocation,
    countries: ['UK', 'USA', 'Brazil'],
    match: {
      params: {
        documentNumber: 'GBR-2021-CC-51F7BCC0A'
      }
    },
    history: {
      push: mockPush
    }
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({type: 'GET_LANDING_TYPE'});
    store = mockStore({
      errors: {},
      exportLocation: {
        exportedFrom: 'United Kingdom',
        exportedTo: 'Russia',
        loaded: true
      },
      global: {
        allCountries: [],
        allCountriesData: [
          {
            officialCountryName: 'United Kingdom',
            isoCodeAlpha2: 'Alpha2',
            isoCodeAlpha3: 'Alpha3',
            isoNumericCode: 'IsoNumericCode'
          },
          {
            officialCountryName: 'Brazil',
            isoCodeAlpha2: 'Alpha2',
            isoCodeAlpha3: 'Alpha3',
            isoNumericCode: 'IsoNumericCode'
          },
          {
            officialCountryName: 'Finland',
            isoCodeAlpha2: 'Alpha2',
            isoCodeAlpha3: 'Alpha3',
            isoNumericCode: 'IsoNumericCode'
          }
        ]
      },
      landingsType: {
        landingsEntryOption: 'directLanding'
      },
    });

    getExportCountry.mockReturnValue({type:'test'});
    saveExportCountry.mockReturnValue({type: 'test'});
    getAllCountries.mockReturnValue({type: 'test'});
    clearExportCountry.mockReturnValue({type: 'CLEAR_EXPORT_COUNTRY'});
    addSelectedExportCountry.mockReturnValue({'payload': {'exportedFrom': 'United Kingdom', 'exportedTo': {'isoCodeAlpha2': 'Alpha2', 'isoCodeAlpha3': 'Alpha3', 'isoNumericCode': 'IsoNumericCode', 'officialCountryName': 'Brazil'}, 'loaded': true}, 'type': 'add_selected_export_country'});


    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <WhereAreYouExportingFrom {...props}/>
        </Router>
      </Provider>
    );

  });

  afterEach(() =>{
      mockPush.mockReset();
     saveExportCountry.mockReset();
   });

  it('should take a snapshot', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('should render the exported from form', () => {
    expect(wrapper.find('div#exportedFrom').exists()).toBeTruthy();
  });

  it('should render the correct title', () => {
    expect(wrapper.find('h1').exists()).toBeTruthy();
    expect(wrapper.find('h1').text()).toEqual('What journey does the export take?');
  });

  it('should render the correct hint text', () => {
    expect(wrapper.find('MultiChoice HintText').text()).toEqual('This is also known as the country of exportation, or vessel flag state (for direct landings)');
  });

  it('should render the correct label', () => {
    expect(wrapper.find('LabelText').text()).toEqual('Select the departure country');
  });

  it('should have a back to progress page link', () => {
    expect(wrapper.find('a[href="/catch-certificates/GBR-2021-CC-51F7BCC0A/progress"]').exists()).toBeTruthy();
  });

  it('should render radio buttons', () => {
    expect(wrapper.find('input#exportedFromJE').exists()).toBeTruthy();
    expect(wrapper.find('input#exportedFromUK').exists()).toBeTruthy();
    expect(wrapper.find('input#exportedFromIOM').exists()).toBeTruthy();
    expect(wrapper.find('input#exportedFromGU').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label#label-exportedFromUK').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label#label-exportedFromUK').props()['htmlFor']).toBe('exportedFromUK');
    expect(wrapper.find('label#label-exportedFromGU').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label#label-exportedFromGU').props()['htmlFor']).toBe('exportedFromGU');
    expect(wrapper.find('label#label-exportedFromIOM').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label#label-exportedFromIOM').props()['htmlFor']).toBe('exportedFromIOM');
    expect(wrapper.find('label#label-exportedFromJE').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label#label-exportedFromJE').props()['htmlFor']).toBe('exportedFromJE');
  });

  it('should handle submit event for continue button', async () => {
    await act(() => {
      wrapper.find('button#continue').simulate(
        'submit',
        { preventDefault() { } }
      );
    });

    expect(saveExportCountry).toHaveBeenCalled();

    const summaryUri = props.route.summaryUri;
    const documentNumber = props.match.params.documentNumber;
    expect(mockPush).toHaveBeenCalledWith(summaryUri.replace(':documentNumber', documentNumber));
 });

  it('should handle submit event for save as draft button and navigate the exporter to the dashboard', async () => {
    await act(() => {
      wrapper
        .find('button#saveAsDraft')
        .simulate('click', { preventDefault() {} });
    });
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      '/create-catch-certificate/catch-certificates'
    );
  });

  it('should call getLandingType with correct params', () => {
    expect(getLandingType).toHaveBeenCalled();
    expect(getLandingType).toHaveBeenCalledWith(props.match.params.documentNumber);
  });

  it('should handle save as draft event', () => {
    wrapper.find('button#saveAsDraft').simulate('click');
  });

  it('should handle on change events setting check box value', () => {
    wrapper.find('input#exportedFromGU').simulate('change', { target: { name: 'exportedFrom', value: 'Guernsey' } });
    wrapper.find('input#exportedFromIOM').simulate('change', { target: { name: 'exportedFrom', value: 'Isle Of Man' } });
    wrapper.find('input#exportedFromUK').simulate('change', { target: { name: 'exportedFrom', value: 'United Kingdom' } });
    wrapper.find('input#exportedFromJE').simulate('change', { target: { name: 'exportedFrom', value: 'Jersey' } });
  });

  it('should pass the exportedTo field when ExportDestination is undefined while on change events setting check box value', () => {
    expect(wrapper.find('ExportDestination').prop('exportDestination')).toBe('Russia');
  });

  it('should include the ExportDestination component', () => {
    expect(wrapper.exists('ExportDestination')).toBe(true);
  });

  it('will have the correct page title', () => {
    expect(wrapper.find(PageTitle).prop('title')).toBe(
      `What journey does the export take? - Create a UK catch certificate - GOV.UK`
    );
  });


  it('should handle onChange for the ExportDestination component', () => {
    const onChange = wrapper.find('ExportDestination').prop('onChange');

    onChange('Brazil');

    expect(store.getActions()).toContainEqual({
      type: ADD_SELECTED_EXPORT_COUNTRY,
      payload: {
        exportedFrom: 'United Kingdom',
        exportedTo: {
          isoCodeAlpha2: 'Alpha2',
          isoCodeAlpha3: 'Alpha3',
          isoNumericCode: 'IsoNumericCode',
          officialCountryName: 'Brazil',
        },
        loaded: true,
      },
    });
  });

  it('should pass the exportedTo field to the ExportDestination component', () => {
    expect(wrapper.find('ExportDestination').prop('exportDestination')).toBe('Russia');
  });

  describe('if there are no errors', () => {

    it('will not show an error island', () => {
      expect(wrapper.exists('ErrorIsland')).toBe(false);
    });

  });

  describe('if there are errors', () => {
    let defaultErrors = {
      exportDestinationError: 'an error',
      errors: [
        {
          targetName: 'exportDestination',
          text: 'an error'
        }
      ]
    };

    let prepareStore = (errors=defaultErrors)=> mockStore({
      errors: errors,
      exportLocation: {
        exportedFrom: 'United Kingdom',
        exportedTo: 'Russia',
        loaded: true
      },
      global: {
        allCountries: []
      },
      landingsType: {isDirectLanding: true}
    });

    getLandingType.mockReturnValue({type: 'GET_LANDING_TYPE'});

    const getWrapper = (translationError) => {
      return mount(
        <Provider store={prepareStore(translationError)}>
          <Router history={history}>
            <WhereAreYouExportingFrom {...props} />
          </Router>
        </Provider>
      );
    };

    it('should contain a error title', () => {
      const wrapperWithErrors = getWrapper();
      expect(wrapperWithErrors.find('PageTitle').props().title).toBe('Error: What journey does the export take? - Create a UK catch certificate - GOV.UK');
    });

    it('will show an error island', () => {
      const wrapperWithErrors = getWrapper();
      expect(wrapperWithErrors.exists('ErrorIsland')).toBe(true);
    });

    it('will populate the error property on the ExportDestination component', () => {
      const wrapperWithErrors = getWrapper();
      expect(wrapperWithErrors.find('ExportDestination').prop('error')).toBe('an error');
    });

    it('will populate the error property on the ExportDestination component with translation', () => {
      const translationError = {
        exportDestinationError: 'Select a valid destination country',
        errors: [
          {
            targetName: 'exportDestination',
            text: 'commonProductDestinationErrorInvalidCountry'
          }
        ]
      };
      const wrapperWithErrors = getWrapper(translationError);
      expect(wrapperWithErrors.find('ExportDestination').prop('error')).toBe('Select a valid destination country');
    });

  });


  describe('should call history.push', () => {

    beforeEach(() => {
      getLandingType.mockReturnValue({type: 'GET_LANDING_TYPE'});
      store = mockStore({
        errors: {},
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Russia',
          loaded: true
        },
        global: {
          allCountries: [],
          allCountriesData: [
            {
              officialCountryName: 'United Kingdom',
              isoCodeAlpha2: 'Alpha2',
              isoCodeAlpha3: 'Alpha3',
              isoNumericCode: 'IsoNumericCode'
            },
            {
              officialCountryName: 'Brazil',
              isoCodeAlpha2: 'Alpha2',
              isoCodeAlpha3: 'Alpha3',
              isoNumericCode: 'IsoNumericCode'
            },
            {
              officialCountryName: 'Finland',
              isoCodeAlpha2: 'Alpha2',
              isoCodeAlpha3: 'Alpha3',
              isoNumericCode: 'IsoNumericCode'
            }
          ]
        },
        landingsType: {isDirectLanding: false},

      });

      const exportLocation = jest.fn;

      props = {
        route: {
          title: 'Create a UK catch certificate - GOV.UK',
          previousUri: ':documentNumber/whose-waters-were-they-caught-in',
          nextUri: ':documentNumber/how-does-the-export-leave-the-uk',
          path: ':documentNumber/what-export-journey',
          saveAsDraftUri: '/create-catch-certificate/catch-certificates',
          journey: 'catchCertificate',
          summaryUri: ':documentNumber/check-your-information',
          progressUri: '/catch-certificates/:documentNumber/progress'
        },
        exportLocation: exportLocation,
        countries: ['UK', 'USA', 'Brazil'],
        match: {
          params: {
            documentNumber: 'GBR-2021-CC-51F7BCC0A'
          }
        },
        history: {
          push: mockPush
        },
      };

      window.scrollTo = jest.fn();

      wrapper = mount(
        <Provider store={store}>
          <Router history={history}>
            <WhereAreYouExportingFrom {...props}/>
          </Router>
        </Provider>
      );

    });

    it('should call history.push when {isDirectLanding: false}', async () => {
      await act( () => {
        wrapper.find('button#continue').simulate(
          'submit',
          { preventDefault() { } }
        );
      });

      expect(saveExportCountry).toHaveBeenCalled();

      const nextUri = props.route.nextUri;
      const documentNumber = props.match.params.documentNumber;
      expect(mockPush).toHaveBeenCalledWith(nextUri.replace(':documentNumber', documentNumber));
    });
  });
});

describe('Re-direct user to landing entry page when landing entry is null', () => {
  const mockPush = jest.fn();
  const mockGetLandingType = jest.fn();
  const mockGetExportCountry = jest.fn();
  const mockGetAllCountries = jest.fn();

  afterEach(() =>{
    jest.resetAllMocks();
  });

  it('should re-direct to landing entry page when landingsEntryOption is null and generatedByContent is false', async () => {

    let props = {
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: 'GBR-23423-4234234' },
      },
      errors: {},
      route: {
        nextUri: '',
        path: '',
        landingsEntryUri: ':documentNumber/landings-entry',
        previousUri: '',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        title: 'Create a UK catch certificate - GOV.UK',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      history: {
        push: mockPush
      },
      getAddedLandingsType: {
        landingsEntryOption: null,
        generatedByContent: false
      },
      getLandingType: mockGetLandingType,
      getExportCountry: mockGetExportCountry,
      getAllCountries: mockGetAllCountries,
      exportPayload: {
        items: [
          {
            landings: [],
          },
        ]
      }
    };

    await new WhereAreYouExportingFrom.WrappedComponent(props).componentDidMount(props);
    expect(mockGetExportCountry).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetLandingType).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetAllCountries).toHaveBeenCalledWith();
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/landings-entry');
  });

  it('should not re-direct to landing entry page when landingsEntryOption is manualEntry and generatedByContent is false', async () => {

    let props = {
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: 'GBR-23423-4234234' },
      },
      errors: {},
      route: {
        nextUri: '',
        path: '',
        landingsEntryUri: ':documentNumber/landings-entry',
        previousUri: '',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        title: 'Create a UK catch certificate - GOV.UK',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      history: {
        push: mockPush
      },
      getAddedLandingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false
      },
      getLandingType: mockGetLandingType,
      getExportCountry: mockGetExportCountry,
      getAllCountries: mockGetAllCountries,
      exportPayload: {
        items: [{
          product: {
            commodityCode: '03036310',
            presentation: {
              code: 'FIL',
              label: 'Filleted'
            },
            state: {
              code: 'FRO',
              label: 'Frozen'
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)'
            }
          },
          landings: [
            {
              addMode: false,
              editMode: false,
              model: {
                id: '99bc2947-c6f4-4012-9653-22dc0b9ad036',
                vessel: {
                  pln: 'AR190',
                  vesselName: 'SILVER QUEST',
                  homePort: 'TROON AND SALTCOATS',
                  registrationNumber: 'A10726',
                  licenceNumber: '42384',
                  label: 'SILVER QUEST (AR190)'
                },
                dateLanded: '2019-01-22',
                exportWeight: '22'
              }
            }
          ]
        },
        ]
      }
    };

    await new WhereAreYouExportingFrom.WrappedComponent(props).componentDidMount(props);
    expect(mockGetExportCountry).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetLandingType).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetAllCountries).toHaveBeenCalledWith();
    expect(mockPush).not.toHaveBeenCalledWith('GBR-23423-4234234/landings-entry');
  });
});

describe('WhereAreYouExportingFrom, Re-direct user to forbidden page', () => {
  const mockPush = jest.fn();

  afterEach(() =>{
    jest.resetAllMocks();
  });

  it('should re-direct to forbidden page when exportLocation.unauthorised  is true', async () => {

    let props = {
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: 'GBR-23423-4234234' },
      },
      errors: {},
      route: {
        nextUri: '',
        path: '',
        landingsEntryUri: ':documentNumber/landings-entry',
        previousUri: '',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        title: 'Create a UK catch certificate - GOV.UK',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      exportLocation: {
        unauthorised: true
      },
      history: {
        push: mockPush
      },
      exportPayload: {
        items: [
          {
            landings: [],
          },
        ]
      }
    };

    await new WhereAreYouExportingFrom.WrappedComponent(props).componentDidUpdate(props);
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });
});

describe('WhereAreYouExportingFrom, clearExportCountry', () => {
  const mockPush = jest.fn();
  const mockClearExportCountry = jest.fn();

  afterEach(() =>{
    jest.resetAllMocks();
  });

  it('should call clearExportCountry during componentWillUnmount', async () => {

    let props = {
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: 'GBR-23423-4234234' },
      },
      errors: {},
      route: {
        nextUri: '',
        path: '',
        landingsEntryUri: ':documentNumber/landings-entry',
        previousUri: '',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        title: 'Create a UK catch certificate - GOV.UK',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      clearExportCountry: mockClearExportCountry,
      exportLocation: {
        exportedFrom: 'UK',
        exportedTo: 'India'
      },
      history: {
        push: mockPush
      },
      exportPayload: {
        items: [
          {
            landings: [],
          },
        ]
      }
    };

    await new WhereAreYouExportingFrom.WrappedComponent(props).componentWillUnmount();
    expect(mockClearExportCountry).toHaveBeenCalled();
  });
});

describe('WhereAreYouExportingFrom, loadData', () => {
  const store = { dispatch: jest.fn() };
  const documentNumber = 'document123';

  beforeEach(() => {
    getExportCountry.mockReset();
    getExportCountry.mockReturnValue({ type: 'GET_EXPORT_COUNTRY' });
    getAllCountries.mockReset();
    getAllCountries.mockReturnValue({ type: 'GET_ALL_COUNTRIES' });
    getLandingType.mockReset();
    getLandingType.mockReturnValue({ type: 'GET_LANDINGS_TYPE' });
  });

  it('should call all methods needed to load the component', () => {
    WhereAreYouExportingFromExport.documentNumber = documentNumber;
    WhereAreYouExportingFromExport.loadData(store);

    expect(getExportCountry).toHaveBeenCalledTimes(1);
    expect(getExportCountry).toHaveBeenCalledWith(documentNumber);

    expect(getAllCountries).toHaveBeenCalledTimes(1);
    expect(getAllCountries).toHaveBeenCalledWith();

    expect(getLandingType).toHaveBeenCalledTimes(1);
    expect(getLandingType).toHaveBeenCalledWith(documentNumber);
  });
});
