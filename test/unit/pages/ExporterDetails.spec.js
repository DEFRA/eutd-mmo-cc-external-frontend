import { mount } from 'enzyme';
import * as React from 'react';
import { component as ExporterDetailsPageComponent } from '../../../src/client/pages/common/ExporterDetailsPage';
import * as ExporterDetailsPage from '../../../src/client/pages/common/ExporterDetailsPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route} from 'react-router-dom';
import thunk from 'redux-thunk';
import {
  getExporterFromMongo,
  saveExporterToMongo,
  saveExporter,
  fetchUserDetailsFromDynamics,
  fetchAddressDetailsFromDynamics,
  fetchAccountDetailsFromDynamics,
  getDocument,
  clearChangeAddressExporter,
  clearUnauthorisedExporter,
} from '../../../src/client/actions';
import { clearErrors } from '../../../src/client/actions/exporter.actions';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';

jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/exporter.actions');

describe('Exporter Details Page', () => {

  let wrapper;

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


  beforeEach(() => {
    // mock all used actions, so there's no need to wait for promises when simulating clicks
    fetchAccountDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ACCOUNT_DETAILS' });
    fetchAddressDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ADDRESS_DETAILS' });
    fetchUserDetailsFromDynamics.mockReturnValue({ type: 'FETCH_USER_DETAILS' });
    saveExporter.mockReturnValue({ type: 'SAVE_EXPORTER' });
    saveExporterToMongo.mockReturnValue({ type: 'SAVE_EXPORTER_TO_MONGO' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTER_FROM_MONGO'});
    clearUnauthorisedExporter.mockReturnValue({ type: 'CLEAR_UNAUTHORISED'} );
    clearChangeAddressExporter.mockReturnValue({ type: 'CLEAR_CHANGE_ADDRESS' });
    const store = mockStore({ fetchAddressDetailsFromDynamics: {},
                              fetchAccountDetailsFromDynamics: {},
                              fetchUserDetailsFromDynamics: {},
                              getExporterFromMongo: {
                                busy: false,
                                error: undefined,
                                errors: undefined,
                                model: {
                                  addressOne: '91 Beach Road',
                                  currentUri: '/create-processing-statement/add-exporter-details',
                                  exporterCompanyName: 'Merrilees Fishing',
                                  exporterFullName: 'Philip Merrilees',
                                  journey: 'processingStatement',
                                  nextUri: '/create-processing-statement/add-consignment-details',
                                  postcode: 'NE3 1SB',
                                  townCity: 'North Shields'
                                },
                                user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
                              },
                              saveExporter: {},
                              saveExporterToMongo: {}
                            });

    const props = {
      route: {
        title                 : 'Create a UK processing statement - GOV.UK',
        previousUri           : '/create-processing-statement/processing-statements',
        nextUri               : '/create-processing-statement/add-consignment-details',
        progressUri           : '/create-processing-statement/:documentNumber/progress',
        journey               : 'processingStatement',
        path                  : '/create-processing-statement/add-exporter-details',
        showResponsiblePerson : true,
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        journeyText           : 'processing statement',
        history               : [],
        saveAsDraftUri        : '/create-processing-statement/processing-statements',
        queryParams           : {
          nextUri             : '/create-processing-statement/add-consignment-details'
        }
      }
    };

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the page', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle an submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
    expect(0).toBeFalsy();
  });

  it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="exporterFullName"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="exporterCompanyName"]').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('exporterFullName');

    expect(wrapper.find('label').at(1).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(1).props()['htmlFor']).toBe('exporterCompanyName');

  });

  it('should find the change exporter address link', () => {
    expect(wrapper.find('a.change-address-link').exists()).toBeTruthy();
    expect(wrapper.find('.exporter-address-data').exists()).toBeTruthy();
  });

  it('should clear unauthorised state', () => {
    wrapper.unmount();

    expect(clearUnauthorisedExporter).toHaveBeenCalled();
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('Exporter Details Page - Warning Message', () => {
  let wrapper;

  const mockStore = configureStore([
    thunk.withExtraArgument({
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
    })
  ]);

  const store = mockStore({});

  it('should contain the catch certificate journey text', () => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...{route: {
        journeyText: 'catchcertificate',
        changeAddressUri: 'create-catch-certificate/:documentNumber/add-processing-plant-details',
        progressUri: '/create-catch-certificate/:documentNumber/progress'}
      }} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('strong.css-jegmsb-WarningTextWrapper').text()
    ).toContain('Add the name and address of the company (or individual) responsible for this export. This information will appear on the final catchcertificate so please make sure the exporter details are correct before continuing.'
    );
  });

  it('should contain the processing statement journey text', () => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...{route: {
        journeyText: 'processingstatement',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        changeAddressUri: '/create-processing-statement/:documentNumber/add-processing-plant-details'}
      }} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('strong.css-jegmsb-WarningTextWrapper').text()
    ).toContain(
      'Add the name and address of the company (or individual) responsible for this export. This information will appear on the final processingstatement so please make sure the exporter details are correct before continuing.'
    );
  });


  it('should contain the storage document journey text', () => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...{route: {
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        progressUri: '/create-storage-document/:documentNumber/progress',
        journeyText: 'storagedocument'}
      }} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('strong.css-jegmsb-WarningTextWrapper').text()
    ).toEqual(
      'Add the name and address of the company (or individual) responsible for this export. This information will appear on the final storagedocument so please make sure the exporter details are correct before continuing.'
    );
  });

});

describe('Exporter Details Page - CC', () => {

  let wrapper;

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

  const state = {
    exporter: {
      model: {
        contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
        exporterFullName: 'Jinkx cat',
        _dynamicsUser: {
          firstName: 'Jinkx',
          lastName: 'Tuxedo'
        },
        accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
        exporterCompanyName: 'Fish trader',
        preLoadedCompanyName: true,
        preLoadedAddress: true,
        addressOne: 'Cats house',
        postcode: 'Post Code',
        townCity: 'London',
        _updated: true
      },
      error: '',
      errors: {
        errors: []
      },
      busy: false,
      saved: false
    }
  };

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/create-catch-certificate/catch-certificates',
      nextUri: '/create-catch-certificate/what-are-you-exporting',
      journey: 'catchCertificate',
      path: '/create-catch-certificate/add-exporter-details',
      progressUri: '/create-catch-certificate/:documentNumber/progress',
      landingsEntryUri: 'create-storage-document/landing-entry',
      changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
      showResponsiblePerson: true,
      journeyText: 'Catch Certificate',
      history: [],
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      queryParams: {
        nextUri: '/create-catch-certificate/what-are-you-exporting'
      }
    }
  };

  beforeEach(() => {
    fetchAccountDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ACCOUNT_DETAILS' });
    fetchAddressDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ADDRESS_DETAILS' });
    fetchUserDetailsFromDynamics.mockReturnValue({ type: 'FETCH_USER_DETAILS' });
    saveExporter.mockReturnValue({ type: 'SAVE_EXPORTER' });
    saveExporterToMongo.mockReturnValue({ type: 'SAVE_EXPORTER_TO_MONGO' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTER_FROM_MONGO ' });
    window.scrollTo = jest.fn();
  });

  describe('when first landing on the page', () => {

    beforeAll(() => {
      wrapper = mount(
        <Provider store={mockStore(state)}>
          <MemoryRouter>
            <ExporterDetailsPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should render the page', () => {
      expect(wrapper).toBeDefined();
    });

    it('should find the exporter address data and its correspondent field', () => {
      expect(wrapper.find('.exporter-address-data').exists()).toBeTruthy();
    });

    it('should display add exporter address link', () => {
      expect(wrapper.find('a.change-address-link').exists()).toBeTruthy();
    });

    it('should render a notification informing the exporter that the address details have been over written with IDM details', () => {
      expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    });

  });

  describe('PROCESSING STATEMENT: When first landing on the page', () => {
    const props = {
      route: {
        title: 'Create a UK processing statement - GOV.UK',
        previousUri: '/create-processing-statement/processing-statements',
        nextUri: '/create-processing-statement/add-consignment-details',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        journey: 'processingStatement',
        path: '/create-processing-statement/add-exporter-details',
        showResponsiblePerson: true,
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        journeyText: 'processing statement',
        history: [],
        saveAsDraftUri: '/create-processing-statement/processing-statements',
        queryParams: {
          nextUri: '/create-processing-statement/add-consignment-details'
        }
      }
    };

    beforeAll(() => {
      wrapper = mount(
        <Provider store={mockStore(state)}>
          <MemoryRouter>
            <ExporterDetailsPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should render the page', () => {
      expect(wrapper).toBeDefined();
    });

    it('should prompt user to add exporter address data and its correspondent field', () => {
      expect(wrapper.find('.exporter-address-data').exists()).toBeTruthy();
    });

    it('should find the change exporter address link', () => {
      expect(wrapper.find('a.change-address-link').exists()).toBeTruthy();
    });

    it('should render a notification informing the exporter that the address details have been over written with IDM details', () => {
      expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    });

  });


  describe('STORAGE DOCUMENT: When first landing on the page', () => {
    const props = {
      match: {
        params: {documentNumber: 'GBR-2021-CC-51F7BCC0A'},
      },
      route: {
        title: 'Create a UK storage document - GOV.UK',
        previousUri: '/create-storage-document/:documentNumber/add-your-reference',
        nextUri: '/create-storage-document/:documentNumber/add-product-to-this-consignment',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        progressUri: 'create-storage-document/progress',
        journey: 'storageNotes',
        path: '/create-storage-document/:documentNumber/add-exporter-details',
        journeyText: 'storage document',
        history: [],
        saveAsDraftUri: '/create-storage-document/storage-documents',
        queryParams: {
            nextUri: '/create-storage-document/:documentNumber/add-product-to-this-consignment'
          }
      }
    };
    beforeAll(() => {
      wrapper = mount(
        <Provider store={mockStore(state)}>
          <MemoryRouter>
            <ExporterDetailsPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should render the page', () => {
        expect(wrapper).toBeDefined();
      });

      it('should prompt user to add exporter address data and its correspondent field', () => {
        expect(wrapper.find('.exporter-address-data').exists()).toBeTruthy();
      });

      it('should display the change exporter address link', () => {
        expect(wrapper.find('a.change-address-link').exists()).toBeTruthy();
      });

      it('should render a notification informing the exporter that the address details have been over written with IDM details', () => {
        expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
      });

      it('should have a back to the progress page link', () => {
        expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
      });
  });

  describe('when landing on the page with no address details', () => {

    beforeAll(() => {
      const stateWithNoAddress = {
        exporter: {
          model: {
            contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
            exporterFullName: 'Jinkx cat',
            _dynamicsUser: {
              firstName: 'Jinkx',
              lastName: 'Tuxedo'
            },
            accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
            exporterCompanyName: 'Fish trader',
            preLoadedCompanyName: true,
            preLoadedAddress: true
          },
          error: '',
          errors: {
            errors: []
          },
          busy: false,
          saved: false
        },
      };

      wrapper = mount(
        <Provider store={mockStore(stateWithNoAddress)}>
          <MemoryRouter>
            <ExporterDetailsPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should render the page', () => {
      expect(wrapper).toBeDefined();
    });

    it('should find the exporter address data and its correspondent field', () => {
      expect(wrapper.find('.exporter-address-data').exists()).toBeTruthy();
    });

    it('should find the add exporter address link', () => {
      expect(wrapper.find('a.change-address-link').exists()).toBeTruthy();
    });

  });
  describe('when landing on the page with errors', () => {

    beforeAll(() => {
      const stateWithNoAddress = {
        exporter: {
          exporter: {
            model: {
              contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
              exporterFullName: 'Jinkx cat',
              _dynamicsUser: {
                firstName: 'Jinkx',
                lastName: 'Tuxedo'
              },
              accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
              exporterCompanyName: 'Fish trader',
              preLoadedCompanyName: true,
              preLoadedAddress: true
            },
            error: '',
            errors: {
              errors: []
            },
            busy: false,
            saved: false
          },
          error: '',
          errors: {
            exporterCompanyNameError: 'Enter the company name',
            exporterFullNameError: 'Enter your name or the name of the responsible person',
            errors: [
              {
                targetName: 'exporterCompanyName', text: 'Enter the company name'
              },
              { targetName: 'exporterFullName', text: 'Enter your name or the name of the responsible person' }
            ]
          },

          busy: false,
          saved: false
        },
      };

      wrapper = mount(
        <Provider store={mockStore(stateWithNoAddress)}>
          <MemoryRouter>
            <ExporterDetailsPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should render the page', () => {
      expect(wrapper).toBeDefined();
    });

    it('should render the errors when there are any', () => {
      expect(wrapper.find('ErrorText').first().text()).toContain('Enter your name or the name of the responsible person');
      expect(wrapper.find('ErrorText').length).toBe(2);
    });

    it('should simulate change', () => {
      wrapper.find('input[name="exporterFullName"]').simulate('change', { target: { name: 'exporterFullName', value: 'New full name' } });
      wrapper.find('input[name="exporterFullName"]').simulate('blur', { target: { name: 'exporterFullName', value: 'New full name' } });
      wrapper.find('input[name="exporterCompanyName"]').simulate('change', { target: { name: 'exporterFullName', value: 'New company name' } });
      wrapper.find('input[name="exporterCompanyName"]').simulate('blur', { target: { name: 'exporterFullName', value: 'New company name' } });
    });
  });
});

describe('Should call pickAddress', () => {

  let wrapper;

  beforeEach(() => {

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

    const state = {
      exporter: {
        model: {
          contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterFullName: 'Jinkx cat',
          _dynamicsUser: {
            firstName: 'Jinkx',
            lastName: 'Tuxedo'
          },
          accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterCompanyName: 'Fish trader',
          preLoadedCompanyName: true,
          preLoadedAddress: true,
          addressOne: 'Cats house',
          postcode: 'Post Code',
          townCity: 'London',
          _updated: true
        },
        error: '',
        errors: {
          errors: []
        },
        busy: false,
        saved: false
      }
    };

    const props = {
      pickAddress: jest.fn(),
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        nextUri: '/create-catch-certificate/what-are-you-exporting',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        history: [],
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        queryParams: {
          nextUri: '/create-catch-certificate/what-are-you-exporting'
        }
      }
    };

    fetchAccountDetailsFromDynamics.mockReturnValue({type: 'FETCH_ACCOUNT_DETAILS'});
    fetchAddressDetailsFromDynamics.mockReturnValue({type: 'FETCH_ADDRESS_DETAILS'});
    fetchUserDetailsFromDynamics.mockReturnValue({type: 'FETCH_USER_DETAILS'});
    saveExporter.mockReturnValue({type: 'SAVE_EXPORTER'});
    saveExporterToMongo.mockReturnValue({type: 'SAVE_EXPORTER_TO_MONGO'});
    getDocument.mockReturnValue({type: 'GET_DOCUMENT'});
    getExporterFromMongo.mockReturnValue({type: 'GET_EXPORTER_FROM_MONGO '});
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={mockStore(state)}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  // Add test for notification if old address is replace with new address format

  it('should render a notification informing the exporter that the address details have been over written with IDM details', () => {
    let notificationBanner = wrapper.find('ExporterDetailsPage').find('NotificationBanner');
    expect(notificationBanner).toBeTruthy();
    expect(notificationBanner.prop('header')).toBe('Important');
  });
});

describe('Should call pickAddress and use redux state', () => {

  let wrapper;

  beforeEach(() => {

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

    const state = {
      exporter: {
        model: {
          contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterFullName: 'Jinkx cat',
          _dynamicsUser: {
            firstName: 'Jinkx',
            lastName: 'Tuxedo'
          },
          accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterCompanyName: 'Fish trader',
          preLoadedCompanyName: true,
          preLoadedAddress: true,
          buildingName: '',
          buildingNumber: '',
          subBuildingName: '',
          postcode: 'Post Code',
          townCity: 'London',
          county: '',
          country: '',
          _updated: true
        },
        error: '',
        errors: {
          errors: []
        },
        busy: false,
        saved: false
      }
    };

    const props = {
      pickAddress: jest.fn(),
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        nextUri: '/create-catch-certificate/what-are-you-exporting',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        history: [],
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        queryParams: {
          nextUri: '/create-catch-certificate/what-are-you-exporting'
        }
      }
    };

    fetchAccountDetailsFromDynamics.mockReturnValue({type: 'FETCH_ACCOUNT_DETAILS'});
    fetchAddressDetailsFromDynamics.mockReturnValue({type: 'FETCH_ADDRESS_DETAILS'});
    fetchUserDetailsFromDynamics.mockReturnValue({type: 'FETCH_USER_DETAILS'});
    saveExporter.mockReturnValue({type: 'SAVE_EXPORTER'});
    saveExporterToMongo.mockReturnValue({type: 'SAVE_EXPORTER_TO_MONGO'});
    getDocument.mockReturnValue({type: 'GET_DOCUMENT'});
    getExporterFromMongo.mockReturnValue({type: 'GET_EXPORTER_FROM_MONGO '});
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={mockStore(state)}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should call the pickAddress and return new format with blank values', () => {
    let pickAddressFn = wrapper.find('ExporterDetailsPage').props().pickAddress;
    let spyPickAddress = jest.spyOn(wrapper.find('ExporterDetailsPage').props(), 'pickAddress').mockReturnValue({
      buildingName: '',
      buildingNumber: '',
      subBuildingName: '',
      postcode: 'Post Code',
      townCity: 'London',
      county: '',
      country: ''
    });
    let mockPickAddress = jest.fn(pickAddressFn);
    let result = mockPickAddress();
    expect(pickAddressFn).toBeDefined();
    expect(spyPickAddress).toHaveBeenCalled();
    expect(result).toEqual({
      buildingName: '',
      buildingNumber: '',
      subBuildingName: '',
      postcode: 'Post Code',
      townCity: 'London',
      county: '',
      country: ''
    });
    let addressDiv = wrapper.find('ExporterDetailsPage').find('div.exporter-address-data');
    let addressLink = wrapper.find('ExporterDetailsPage').find('a.change-address-link');
    expect(addressDiv).toBeDefined();
  });
});

describe('Should call pickAddress and use dynamix address', () => {

  let wrapper;
  let state;
  let props;

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

  beforeEach(() => {

    state = {
      exporter: {
        model: {
          contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterFullName: 'Jinkx cat',
          _dynamicsUser: {
            firstName: 'Jinkx',
            lastName: 'Tuxedo'
          },
          accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterCompanyName: 'Fish trader',
          preLoadedCompanyName: true,
          preLoadedAddress: true,
          buildingName: '',
          buildingNumber: '',
          subBuildingName: '',
          postcode: '',
          townCity: '',
          county: '',
          country: '',
          _updated: true
        },
        error: '',
        errors: {
          errors: []
        },
        busy: false,
        saved: false
      }
    };

    props = {
      pickAddress: jest.fn(),
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        nextUri: '/create-catch-certificate/what-are-you-exporting',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/:documentNumber/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        history: [],
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        queryParams: {
          nextUri: '/create-catch-certificate/what-are-you-exporting'
        },
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      }
    };

    fetchAccountDetailsFromDynamics.mockReturnValue({type: 'FETCH_ACCOUNT_DETAILS'});
    fetchAddressDetailsFromDynamics.mockReturnValue({type: 'FETCH_ADDRESS_DETAILS'});
    fetchUserDetailsFromDynamics.mockReturnValue({type: 'FETCH_USER_DETAILS'});
    saveExporter.mockReturnValue({type: 'SAVE_EXPORTER'});
    saveExporterToMongo.mockReturnValue({type: 'SAVE_EXPORTER_TO_MONGO'});
    getDocument.mockReturnValue({type: 'GET_DOCUMENT'});
    clearErrors.mockReturnValue({ type: 'CLEAR_ERRORS' });
    getExporterFromMongo.mockReturnValue({type: 'GET_EXPORTER_FROM_MONGO '});
    window.scrollTo = jest.fn();

  });

  it('should call clearErrors and, the pickAddress and return new address format from dynamix', () => {

    state = {
      ...state,
      model: {
        ...state.model,
        buildingName: '',
        buildingNumber: '',
        subBuildingName: '',
        postcode: '',
        townCity: '',
        county: '',
        country: ''
      },
      userdetails: {
        ...state.userdetails,
        model: [{
          buildingname: 'Dynamix Building Name',
          buildingnumber: 'Dynamix Building Number',
          subbuildingname: 'Dynamix Sub Building Name',
          street: 'Dynamix Street',
          town: 'Dynamix Town',
          postcode: 'Dynamix Postcode'
        }]
      }
    };



    wrapper = mount(
      <Provider store={mockStore(state)}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...props} />
        </MemoryRouter>
      </Provider>
    );

    let pickAddressFn = wrapper.find('ExporterDetailsPage').props().pickAddress;
    let spyPickAddress = jest.spyOn(wrapper.find('ExporterDetailsPage').props(), 'pickAddress').mockReturnValue({
      buildingName: '',
      buildingNumber: '',
      subBuildingName: '',
      postcode: '',
      townCity: '',
      county: '',
      country: ''
    });
    let mockPickAddress = jest.fn(pickAddressFn);
    let result = mockPickAddress();
    expect(pickAddressFn).toBeDefined();
    expect(spyPickAddress).toHaveBeenCalled();
    expect(result).toEqual({
      buildingName: '',
      buildingNumber: '',
      subBuildingName: '',
      postcode: '',
      townCity: '',
      county: '',
      country: ''
    });
    let addressDiv = wrapper.find('ExporterDetailsPage').find('div.exporter-address-data');
    let addressLink = wrapper.find('ExporterDetailsPage').find('a.change-address-link');
    expect(addressDiv).toBeDefined();
    expect(addressDiv.text()).toContain('Your registration address could not be accessed. Please add the exporter’s addressAdd the exporter’s address');
    expect(addressLink.text()).toContain('Add the exporter’s address');
  });

  it('should call the pickAddress and return undefined address from dynamix', () => {

    delete state.exporter;
    delete props.exporter;

    wrapper = mount(
      <Provider store={mockStore(state)}>
        <MemoryRouter>
          <ExporterDetailsPage.default.component {...props} />
        </MemoryRouter>
      </Provider>
    );

    let pickAddressFn = wrapper.find('ExporterDetailsPage').props().pickAddress;
    let spyPickAddress = jest.spyOn(wrapper.find('ExporterDetailsPage').props(), 'pickAddress').mockReturnValue({
      buildingName: '',
      buildingNumber: '',
      subBuildingName: '',
      postcode: '',
      townCity: '',
      county: '',
      country: ''
    });
    let mockPickAddress = jest.fn(pickAddressFn);
    let result = mockPickAddress();
    expect(pickAddressFn).toBeDefined();
    expect(spyPickAddress).toHaveBeenCalled();
    expect(result).toEqual({
      buildingName: '',
      buildingNumber: '',
      subBuildingName: '',
      postcode: '',
      townCity: '',
      county: '',
      country: ''
    });
    let addressDiv = wrapper.find('ExporterDetailsPage').find('div.exporter-address-data');
    let addressLink = wrapper.find('ExporterDetailsPage').find('a.change-address-link');
    expect(addressDiv).toBeDefined();
  });

});

describe('should call history to forbid access', () => {

  it('should not allow access to page', async () => {
    const mockPush = jest.fn();
    const mockUnauthorised = jest.fn();

    const previousProps = {
      exporter:{
        unauthorised:false
      }
    };

    let props = {
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: '' },
      },
      errors: {},
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        uploadFileUri: 'create-storage-document/upload-file',
        nextUri: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      exporter:{
        unauthorised:true
      },
      history: {
        push: mockPush
      },
      unauthorised:mockUnauthorised
    };

    await new ExporterDetailsPageComponent.WrappedComponent(props).componentDidUpdate(previousProps, props);
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should not allow access to a cc page when there is no landing type', async () => {
    const documentNumber = 'document123';

    const mockPush = jest.fn();

    const props = {
      config: {
        enabledAccountDetailsFetch: false
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: documentNumber },
      },
      errors: {},
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        uploadFileUri: 'create-storage-document/upload-file',
        nextUri: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      exporter: {},
      history: {
        push: mockPush
      },
      getExporterFromMongo: jest.fn(),
      getDocument: jest.fn(),
      getLandingType: jest.fn(),
      fetchUserDetailsFromDynamics: jest.fn(),
      fetchAddressDetailsFromDynamics: jest.fn(),
      fetchAccountDetailsFromDynamics: jest.fn(),
      clearChangeAddressExporter: jest.fn(),
    };

    await new ExporterDetailsPageComponent.WrappedComponent(props).componentDidMount();

    expect(props.getLandingType).toHaveBeenCalledWith(documentNumber);
    expect(mockPush).toHaveBeenCalledWith(props.route.landingsEntryUri.replace(':documentNumber', documentNumber));
  });

  it('should allow access to a cc page when there is a landing type', async () => {
    const documentNumber = 'document123';

    const mockPush = jest.fn();

    const props = {
      config: {
        enabledAccountDetailsFetch: false
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: documentNumber },
      },
      errors: {},
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        uploadFileUri: 'create-storage-document/upload-file',
        nextUri: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      exporter: {},
      landingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false
      },
      history: {
        push: mockPush
      },
      getExporterFromMongo: jest.fn(),
      getDocument: jest.fn(),
      getLandingType: jest.fn(),
      fetchUserDetailsFromDynamics: jest.fn(),
      fetchAddressDetailsFromDynamics: jest.fn(),
      fetchAccountDetailsFromDynamics: jest.fn(),
      clearChangeAddressExporter: jest.fn(),
    };

    await new ExporterDetailsPageComponent.WrappedComponent(props).componentDidMount();

    expect(props.getLandingType).toHaveBeenCalledWith(documentNumber);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not do a landing type check for a non-cc journey', async () => {
    const mockPush = jest.fn();

    const props = {
      config: {
        enabledAccountDetailsFetch: false
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: 'doc123' },
      },
      errors: {},
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        journey: 'storageNotes',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      exporter: {},
      history: {
        push: mockPush
      },
      getExporterFromMongo: jest.fn(),
      getDocument: jest.fn(),
      getLandingType: jest.fn(),
      fetchUserDetailsFromDynamics: jest.fn(),
      fetchAddressDetailsFromDynamics: jest.fn(),
      fetchAccountDetailsFromDynamics: jest.fn(),
      clearChangeAddressExporter: jest.fn(),
    };

    await new ExporterDetailsPageComponent.WrappedComponent(props).componentDidMount();

    expect(props.getLandingType).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should allow access to page when authorised', async () => {
    const mockPush = jest.fn();
    const mockUnauthorised = jest.fn();

    const previousProps = {
      exporter:{
        unauthorised: false
      }
    };

    let props = {
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: { documentNumber: '' },
      },
      errors: {},
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        uploadFileUri: 'create-storage-document/upload-file',
        nextUri: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-storage-document/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      exporter:{
        unauthorised: false
      },
      history: {
        push: mockPush
      },
      unauthorised:mockUnauthorised
    };

    await new ExporterDetailsPageComponent.WrappedComponent(props).componentDidUpdate(previousProps, props);
    expect(mockPush).not.toHaveBeenCalledWith('/forbidden');
  });
});

describe('should redirect to upload file page when the landings type is uploadEntry - CC', () => {
  let wrapper, mockPush;

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
  const documentNumber = 'GBR-23423-4234234';
  beforeEach(() => {
    fetchAccountDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ACCOUNT_DETAILS' });
    fetchAddressDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ADDRESS_DETAILS' });
    fetchUserDetailsFromDynamics.mockReturnValue({ type: 'FETCH_USER_DETAILS' });
    saveExporter.mockReturnValue({ type: 'SAVE_EXPORTER' });
    saveExporterToMongo.mockReturnValue({ type: 'SAVE_EXPORTER_TO_MONGO' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTER_FROM_MONGO' });
    clearChangeAddressExporter.mockReturnValue({ type: 'CLEAR_CHANGE_ADDRESS' });
    clearUnauthorisedExporter.mockReturnValue({ type: 'CLEAR_UNAUTHORISED' });

    const history = createMemoryHistory({
      initialEntries: [`/catch-certificates/${documentNumber}/add-exporter-details`]
    });
    mockPush = jest.spyOn(history, 'push');
    const props = {
      config: {
        enabledAccountDetailsFetch: false
      },
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-catch-certificate/catch-certificates',
        uploadFileUri: '/create-catch-certificate/upload-file',
        progressUri: '/create-processing-statement/:documentNumber/progress',
        nextUri: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        journey: 'catchCertificate',
        path: '/create-catch-certificate/add-exporter-details',
        changeAddressUri: 'create-catch-certificate/:documentNumber/add-processing-plant-details',
        landingsEntryUri: 'create-catch-certificate/landing-entry',
        showResponsiblePerson: true,
        journeyText: 'Catch Certificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      }
    };

    const state = {
      exporter: {
        model: {
          contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterFullName: 'Yohannes LTD',
          _dynamicsUser: {
            firstName: 'Bura',
            lastName: 'Yohan'
          },
          accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterCompanyName: 'Fish trader',
          preLoadedCompanyName: true,
          changeAddress: true,
          preLoadedAddress: true,
          addressOne: 'Cats house',
          postcode: 'Post Code',
          townCity: 'London',
          _updated: true
        },
        error: '',
        errors: {}
      },
      landingsType: {
        landingsEntryOption: 'uploadEntry',
        generatedByContent: false
      },
    };

    wrapper = mount(
      <Provider store={mockStore(state)}>
          <Router history={history}>
            <Route path="/catch-certificates/:documentNumber/add-exporter-details">
            <ExporterDetailsPageComponent {...props} />
            </Route>
          </Router>
        </Provider>
    );
  });

  it('should redirect to upload file page when the landings type is uploadEntry', async () => {

    await act(() => wrapper.find('form').props().onSubmit(
      {preventDefault() {}}
    ));

    expect(mockPush).toHaveBeenCalledWith('/create-catch-certificate/upload-file');
    expect(saveExporterToMongo).toHaveBeenCalled();
  });
});

describe('should redirect to add products page when the journey is non CC Journey', () => {
  let wrapper, mockPush;

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
  const documentNumber = 'GBR-23423-4234234';
  beforeEach(() => {
    fetchAccountDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ACCOUNT_DETAILS' });
    fetchAddressDetailsFromDynamics.mockReturnValue({ type: 'FETCH_ADDRESS_DETAILS' });
    fetchUserDetailsFromDynamics.mockReturnValue({ type: 'FETCH_USER_DETAILS' });
    saveExporter.mockReturnValue({ type: 'SAVE_EXPORTER' });
    saveExporterToMongo.mockReturnValue({ type: 'SAVE_EXPORTER_TO_MONGO' });
    getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
    getExporterFromMongo.mockReturnValue({ type: 'GET_EXPORTER_FROM_MONGO' });
    clearChangeAddressExporter.mockReturnValue({ type: 'CLEAR_CHANGE_ADDRESS' });
    clearUnauthorisedExporter.mockReturnValue({ type: 'CLEAR_UNAUTHORISED' });

    const history = createMemoryHistory({
      initialEntries: [`/catch-certificates/${documentNumber}/add-exporter-details`]
    });
    mockPush = jest.spyOn(history, 'push');
    const props = {
      config: {
        enabledAccountDetailsFetch: false
      },
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/create-storage-document/storage-document',
        nextUri: '/create-storage-document/what-are-you-exporting',
        journey: 'storageNotes',
        path: '/create-storage-document/add-exporter-details',
        changeAddressUri: 'create-storage-document/:documentNumber/add-processing-plant-details',
        showResponsiblePerson: true,
        journeyText: 'Storage Notes',
        saveAsDraftUri: '/create-storage-document/storage-document',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      match : {
        params : {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      history: {
        push: mockPush
      }
    };

    const state = {
      exporter: {
        model: {
          contactId: '70676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterFullName: 'Yohannes LTD',
          _dynamicsUser: {
            firstName: 'Bura',
            lastName: 'Yohan'
          },
          accountId: '7d676bc6-295e-ea11-a811-000d3a20f8d4',
          exporterCompanyName: 'Fish trader',
          preLoadedCompanyName: true,
          changeAddress: true,
          preLoadedAddress: true,
          addressOne: 'wizards house',
          postcode: 'Post Code',
          townCity: 'London',
          _updated: true
        },
        error: '',
        errors: {}
      }
    };

    wrapper = mount(
      <Provider store={mockStore(state)}>
          <Router history={history}>
            <Route path="/catch-certificates/:documentNumber/add-exporter-details">
            <ExporterDetailsPageComponent {...props} />
            </Route>
          </Router>
        </Provider>
    );
  });

  it('should redirect to add products page when the journey is storageNotes', async () => {

    await act(() => wrapper.find('form').props().onSubmit(
      {preventDefault() {}}
    ));

    expect(mockPush).toHaveBeenCalledWith('/create-storage-document/what-are-you-exporting');
    expect(saveExporterToMongo).toHaveBeenCalled();
  });
});