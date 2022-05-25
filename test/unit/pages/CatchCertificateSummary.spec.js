import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { component as CatchCertificateSummary } from '../../../src/client/pages/exportCertificates/CatchCertificateSummary';
import thunk from 'redux-thunk';
import { createExportCertificate, getDocument } from '../../../src/client/actions';
import { getSummaryCertificate } from '../../../src/client/actions/certificate.actions';
import { render } from '@testing-library/react';

jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/certificate.actions');


const mockBeforeEach = () => {
  createExportCertificate.mockReturnValue({ type: 'CREATE_EXPORT_CERT' });
  getDocument.mockReturnValue({ type: 'GET_DOCUMENT' });
  getSummaryCertificate.mockReturnValue({ type: 'GET_SUMMARY_DOCUMENT' });
};

describe('Export catch cert page initial load', () => {
  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);
  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'train',
          departurePlace: 'Derby',
          railwayBillNumber: '1234'
        },
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
                    pln: 'B192',
                    vesselName: 'GOLDEN BELLS 11',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'GOLDEN BELLS 11 (B192)'
                  },
                  dateLanded: '2019-01-29T00:00:00.000Z',
                  exportWeight: '22'
                }
              },
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f487a7d8-76f9-4ff6-b40e-e511b19dfb91',
                  vessel: {
                    pln: 'BCK126',
                    vesselName: 'ZARA ANNABEL',
                    homePort: 'UNKNOWN',
                    registrationNumber: 'A23327',
                    licenceNumber: '42095',
                    label: 'ZARA ANNABEL (BCK126)'
                  },
                  dateLanded: '2019-01-30T00:00:00.000Z',
                  exportWeight: '23'
                }
              }
            ]
          },
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22T00:00:00.000Z',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [
          {
            state: 'FRE',
            species: 'HER',
            presentation: 'WHL',
            date: '2020-08-15T00:00:00.000Z',
            vessel: 'WIRON 5',
            rules: ['noDataSubmitted']
          }
        ],
        landingsEntryOption: 'manualEntry'
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate',
        landingsEntryOptions: [
          {
            label: 'ccLandingsEntryOptionsDirectLandingLabel',
            value: 'directLanding',
            name: 'landingsEntry',
            id: 'directLandingOptionEntry',
            hint: 'Recommended for UK registered fishing vessels landing and exporting their catch simultaneously in the EU (or a GB registered fishing vessel direct landing in Northern Ireland).',
          },
          {
            label: 'ccLandingsEntryOptionsManualEntryLabel',
            value: 'manualEntry',
            name: 'landingsEntry',
            id: 'manualOptionEntry',
            hint: 'Recommended for small to medium sized exports.',
          },
          {
            label: 'ccLandingsEntryOptionsUploadEntryLabel',
            value: 'uploadEntry',
            name: 'landingsEntry',
            id: 'uploadOptionEntry',
            hint: 'Recommended for large exports. (Requires the set up of product favourites).',
          }
        ]
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should contain govuk-visually-hidden for change-exporterFullName', () => {
    expect(wrapper.find('#change-exporterFullName span.govuk-visually-hidden').exists()).toBeTruthy();
  });

  it('should contain govuk-visually-hidden for change-exporterCompanyName', () => {
    expect(wrapper.find('#change-exporterCompanyName span.govuk-visually-hidden').exists()).toBeTruthy();
  });

  it('should contain govuk-visually-hidden for change-exporterAddress', () => {
    expect(wrapper.find('#change-exporterAddress span.govuk-visually-hidden').exists()).toBeTruthy();
  });

  it('should contain govuk-visually-hidden for change-transportType', () => {
    expect(wrapper.find('#change-transportType span.govuk-visually-hidden').exists()).toBeTruthy();
  });

  it('should not display notification banner', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeFalsy();
  });

  it('should contain a landing entry type', () => {
    expect(wrapper.find('dd').at(4).props().children).toBe('Manual entry');
  });


  it('should match the previous snapshot', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('Export catch cert page initial load with LOCKED data', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);


  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'LOCKED',
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'truck',
          cmr: false
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        exportCertificate: {
          validationErrors: [
            {
              state: 'FRE',
              species: 'HER',
              presentation: 'WHL',
              date: '2020-08-15T00:00:00.000Z',
              vessel: 'WIRON 5',
              rules: ['noDataSubmitted']
            }
          ]
        },
        exportPayload: {
          items: [
            {
              product: {
                id: 'GBR-2021-CC-FE1AEBBD2-e9c0fcfd-6581-480c-96f1-d6693be8f464',
                commodityCode: '03044410',
                presentation: {
                  code: 'FIL',
                  label: 'Filleted'
                },
                state: {
                  code: 'FRE',
                  label: 'Fresh'
                },
                species: {
                  code: 'COD',
                  label: 'Atlantic cod (COD)'
                }
              },
              landings: [
                {
                  model: {
                    id: 'GBR-2021-CC-FE1AEBBD2-1612290985',
                    vessel: {
                      pln: 'PH1100',
                      vesselName: 'WIRON 5',
                      label: 'WIRON 5 (PH1100)',
                      homePort: 'PLYMOUTH',
                      flag: 'GBR',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2021-02-02',
                    exportWeight: 100,
                    numberOfSubmissions: 0
                  }
                }
              ]
            }
          ]
        }
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should not contain govuk-visually-hidden for change-exporterFullName', () => {
    expect(wrapper.find('#change-exporterFullName span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain govuk-visually-hidden for change-exporterCompanyName', () => {
    expect(wrapper.find('#change-exporterCompanyName span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain govuk-visually-hidden for change-exporterAddress', () => {
    expect(wrapper.find('#change-exporterAddress span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain govuk-visually-hidden for change-transportType', () => {
    expect(wrapper.find('#change-transportType span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain govuk-visually-hidden for change-species-0', () => {
    expect(wrapper.find('#change-species-0 span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain govuk-visually-hidden for change-landing-0', () => {
    expect(wrapper.find('#change-landing-0 span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain govuk-visually-hidden for change-whose-waters', () => {
    expect(wrapper.find('#change-whose-waters span.govuk-visually-hidden').exists()).toBeFalsy();
  });

  it('should not contain submit button', () => {
    expect(wrapper.find('button#continue').exists()).toBeFalsy();
  });

  it('should contain button back that goes to exporter dashboard', () => {
    expect(wrapper.find('a[href$="/create-catch-certificate/catch-certificates"]').exists()).toBeTruthy();
  });

  it('display notification banner', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
  });

  it('should render notification banner with the correct text', () => {
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('This document has been locked. To unlock, contact support on 0330 159 1989.');
  });

});

describe('Export catch cert page load when the landing vessel is overridden by Admin', () => {
  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);

  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'train',
          departurePlace: 'Derby',
          railwayBillNumber: '1234'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
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
                    pln: 'B192',
                    vesselName: 'GOLDEN BELLS 11',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'GOLDEN BELLS 11 (B192)'
                  },
                  dateLanded: '2019-01-29T00:00:00.000Z',
                  exportWeight: '22'
                }
              },
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f487a7d8-76f9-4ff6-b40e-e511b19dfb91',
                  vessel: {
                    pln: 'BCK126',
                    vesselName: 'ZARA ANNABEL',
                    homePort: 'UNKNOWN',
                    registrationNumber: 'A23327',
                    licenceNumber: '42095',
                    label: 'ZARA ANNABEL (BCK126)'
                  },
                  dateLanded: '2019-01-30T00:00:00.000Z',
                  exportWeight: '23'
                }
              }
            ]
          },
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)',
                    vesselOverriddenByAdmin: true
                  },
                  dateLanded: '2019-01-22T00:00:00.000Z',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        validationErrors: [
          {
            state: 'FRE',
            species: 'HER',
            presentation: 'WHL',
            date: '2020-08-15T00:00:00.000Z',
            vessel: 'WIRON 5',
            rules: ['noDataSubmitted']
          }
        ]
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render notification banner with the correct text', () => {
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('Landings amended and authorised by service support cannot be changed but can be removed.');
  });

  it('should contain govuk-visually-hidden for change-0-landing-0', () => {
    expect(wrapper.find('#change-0-landing-0 span.govuk-visually-hidden').exists()).toBeTruthy();
  });

  it('should contain govuk-visually-hidden for change-0-landing-1', () => {
    expect(wrapper.find('#change-0-landing-1 span.govuk-visually-hidden').exists()).toBeTruthy();
  });
  it('should contain govuk-visually-hidden for change-1-landing-0', () => {
    expect(wrapper.find('#change-1-landing-0 span.govuk-visually-hidden').exists()).toBeTruthy();
  });

  it('display notification banner', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
  });

  it('should not display a Vessel not found notification banner', () => {
    expect(wrapper.find('.notification-banner__heading').text()).not.toContain('Contact support on 0330 159 1989 to replace your Vessel name or PLN entries of \'Vessel not found (N/A)\'.');
  });

});

describe('Export catch cert page initial load with DRAFT and vessel not found data', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);


  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'train',
          departurePlace: 'Derby',
          railwayBillNumber: '1234'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
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
                    pln: 'B192',
                    vesselName: 'Vessel not found',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'Vessel not found (N/A)',
                    vesselNotFound: true
                  },
                  dateLanded: '2019-01-29T00:00:00.000Z',
                  exportWeight: '22'
                }
              },
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f487a7d8-76f9-4ff6-b40e-e511b19dfb91',
                  vessel: {
                    pln: 'BCK126',
                    vesselName: 'ZARA ANNABEL',
                    homePort: 'UNKNOWN',
                    registrationNumber: 'A23327',
                    licenceNumber: '42095',
                    label: 'ZARA ANNABEL (BCK126)'
                  },
                  dateLanded: '2019-01-30T00:00:00.000Z',
                  exportWeight: '23'
                }
              }
            ]
          },
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22T00:00:00.000Z',
                  exportWeight: '55'
                }
              }
            ]
          }]
        }
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });
  it('display notification banner with the vessel not found notification message', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
    expect(wrapper.find('.notification-banner__heading').text()).toContain('Contact support on 0330 159 1989 to replace your Vessel name or PLN entries of \'Vessel not found (N/A)\'.');
  });

  it('should not display a LOCKED document notification banner', () => {
    expect(wrapper.find('.notification-banner__heading').text()).not.toContain('This document has been locked. To unlock, contact support on 0330 159 1989.');
  });

  it('should not display a Vessel Overridden by admin notification banner', () => {
    expect(wrapper.find('.notification-banner__heading').text()).not.toContain('Landings amended and authorised by service support cannot be changed but can be removed.');
  });

});

describe('Show correct validation errors', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);
  beforeEach(() => {
    mockBeforeEach();

    const store = mockStore({
      summaryDocument: {
        exporter: {
          model: {
            exporterFullName: 'Fish Boat',
            exporterCompanyName: 'Fish trader',
            addressOne: 'FIELDING HOUSE, FLAT 1, BENNETT STREET',
            addressTwo: 'LONDON',
            townCity: 'LONDON BOROUGH OF HOUNSLOW',
            postcode: 'W4 2AR'
          }
        },
        exportPayload: {
          items: [
            {
              product: {
                id: 'GBR-2021-CC-3021065E5-0f596934-3ebd-4844-8aa5-4c68ed472b78',
                commodityCode: '03044990',
                presentation: {
                  code: 'FIL',
                  label: 'Filleted'
                },
                state: {
                  code: 'FRE',
                  label: 'Fresh'
                },
                species: {
                  code: 'HER',
                  label: 'Atlantic herring (HER)'
                },
                factor: 2.1
              },
              landings: [
                {
                  model: {
                    id: 'GBR-2021-CC-3021065E5-1612462664',
                    vessel: {
                      pln: 'N/A',
                      vesselName: 'Vessel not found',
                      label: 'Vessel not found (N/A)',
                      homePort: '',
                      flag: '',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2018-08-03',
                    exportWeight: 12932392992,
                    numberOfSubmissions: 2
                  }
                },
                {
                  model: {
                    id: 'GBR-2021-CC-3021065E5-1612462665',
                    vessel: {
                      pln: 'PH2200',
                      vesselName: 'WIRON 5',
                      label: 'WIRON (PH2200)',
                      homePort: 'some home port',
                      flag: 'UK',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2238-08-03',
                    exportWeight: 12932392992,
                    numberOfSubmissions: 2
                  }
                }
              ]
            }
          ]
        },
        transport: {
          vehicle: 'directLanding'
        },
        conservation: {
          conservationReference: 'UK Fisheries Policy',
          legislation: [
            'UK Fisheries Policy'
          ],
          caughtInUKWaters: 'Y',
          user_id: 'Test',
          currentUri: 'Test',
          nextUri: 'Test'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [
          {
            state: 'FRE',
            species: 'HER',
            presentation: 'FIL',
            date: '2018-08-03T00:00:00.000Z',
            vessel: 'Vessel not found',
            rules: [
              'vesselNotFound'
            ]
          },
          {
            state: 'FRE',
            species: 'HER',
            presentation: 'FIL',
            date: '2238-08-03T00:00:00.000Z',
            vessel: 'WIRON 5',
            rules: [
              'invalidLandingDate'
            ]
          }
        ],
        status: 'DRAFT'
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should load the error message for Vessel not found', () => {
    expect(wrapper.find('#validationError span#error-message-0').text()).toBe('Contact support on 0330 159 1989 to replace ‘Vessel not found (N/A)’ for Atlantic herring (HER) caught on 03/08/2018.');
  });

  it('should display an error summary for Vessel not found', () => {
    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    expect(wrapper.find('#errorIsland a[href="#error-message-0"]').text()).toBe('Contact support on 0330 159 1989 to replace ‘Vessel not found (N/A)’ for Atlantic herring (HER) caught on 03/08/2018.');
  });

  it('should display an error message for an invalid landing date', () => {
    expect(wrapper.find('#validationError span#error-message-1').text()).toBe('Submitted catch certificates cannot contain landing dates more than 3 days in the future');
  });

  it('should display an error summary for an invalid landing date', () => {
    expect(wrapper.find('#errorIsland').exists()).toBeTruthy();
    expect(wrapper.find('#errorIsland a[href="#error-message-1"]').text()).toBe('Submitted catch certificates cannot contain landing dates more than 3 days in the future');
  });
});

describe('Export catch cert page load when the total export weight is a decimal', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);
  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'train',
          departurePlace: 'Derby',
          railwayBillNumber: '1234'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
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
                    pln: 'B192',
                    vesselName: 'GOLDEN BELLS 11',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'GOLDEN BELLS 11 (B192)'
                  },
                  dateLanded: '2019-01-29T00:00:00.000Z',
                  exportWeight: '0.1'
                }
              },
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f487a7d8-76f9-4ff6-b40e-e511b19dfb91',
                  vessel: {
                    pln: 'BCK126',
                    vesselName: 'ZARA ANNABEL',
                    homePort: 'UNKNOWN',
                    registrationNumber: 'A23327',
                    licenceNumber: '42095',
                    label: 'ZARA ANNABEL (BCK126)'
                  },
                  dateLanded: '2019-01-30T00:00:00.000Z',
                  exportWeight: '1.1'
                }
              }
            ]
          }]
        }
      }
    });
    window.scrollTo = jest.fn();
    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });
  it('should contain a total export weight of the correct decimal value', () => {
    expect(wrapper.find('.totalExportWeight').first().text()).toBe('Total export weight1.20kg');
  });
});

describe('Display correct Transportation details', () => {
  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);
  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'train',
          departurePlace: 'Derby',
          railwayBillNumber: '1234'
        },
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
                    pln: 'B192',
                    vesselName: 'GOLDEN BELLS 11',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'GOLDEN BELLS 11 (B192)'
                  },
                  dateLanded: '2019-01-29T00:00:00.000Z',
                  exportWeight: '22'
                }
              },
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f487a7d8-76f9-4ff6-b40e-e511b19dfb91',
                  vessel: {
                    pln: 'BCK126',
                    vesselName: 'ZARA ANNABEL',
                    homePort: 'UNKNOWN',
                    registrationNumber: 'A23327',
                    licenceNumber: '42095',
                    label: 'ZARA ANNABEL (BCK126)'
                  },
                  dateLanded: '2019-01-30T00:00:00.000Z',
                  exportWeight: '23'
                }
              }
            ]
          },
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22T00:00:00.000Z',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: {
            isoCodeAlpha2: 'Alpha2',
            isoCodeAlpha3: 'Alpha3',
            isoNumericCode: 'IsoNumericCode',
            officialCountryName: 'Brazil',
          }
        },
        validationErrors: [
        ]
      },
      documentNumber: '123'
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });
  it('should contain the Destination Country row - title', () => {
    expect(wrapper.find('#destination-country dt').first().text()).toContain('Destination country');
  });

  it('should contain the Destination Country row - answer', () => {
    expect(wrapper.find('#destination-country dd').text()).toContain('Brazil');
  });

  it('should contain govuk-visually-hidden for change-exportedTo', () => {
    expect(wrapper.find('#change-exportedTo span.govuk-visually-hidden').exists()).toBeTruthy();
    expect(wrapper.find('#change-exportedTo').first().text()).toEqual('Changedestination country');

  });

  it('should contain the Departure Country row', () => {
    expect(wrapper.find('dt#departure-country').first().text()).toBe('Departure country');
  });
});

describe('When the exporter\'s address has been updated with IDM details', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);


  beforeEach(() => {
    mockBeforeEach();
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
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
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'train',
          departurePlace: 'Derby',
          railwayBillNumber: '1234'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
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
                    pln: 'PH1100',
                    vesselName: 'WIRON 5',
                    label: 'WIRON 5 (PH1100)',
                    homePort: 'PLYMOUTH',
                    flag: 'GBR',
                    imoNumber: '9249556',
                    licenceNumber: '12480',
                    licenceValidTo: '2382-12-31T00:00:00'
                  },
                  dateLanded: '2019-01-29T00:00:00.000Z',
                  exportWeight: '22'
                }
              }
            ]
          },
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22T00:00:00.000Z',
                  exportWeight: '55'
                }
              }
            ]
          }]
        }
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('display notification banner with IDM address updated message', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('Due to improvements in the way addresses are managed, the exporter’s address in this document has been reloaded from your Defra account. Please check the address is correct and change if necessary');
  });
});

describe('When the exporter wants to change landing details', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should show the correct href value for export a direct landing?', () => {
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
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
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        whereExportingUri: ':documentNumber/what-export-journey',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      },
      match: { params: {documentNumber: 'GBR-2021-CC-D6FBF748C'}}
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a#landing-entry').props().href).toContain('/landings-entry');
  });

  it('should show the correct href value for directLanding', () => {
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
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
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        whereExportingUri: ':documentNumber/what-export-journey',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      },
      match: { params: {documentNumber: 'GBR-2021-CC-D6FBF748C'}}
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a#change-0-landing-0').props().href).toContain('/direct-landing');
  });

  it('should show the correct href value for non directLanding', () => {

    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
        exportPayload: {
          items: [{
            product: {
              id: '4012-9653',
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
                  dateLanded: '2020-01-22',
                  exportWeight: '42'
                }
              }
            ]
          },
          {
            product: {
              id: '4013-9653',
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'B192',
                    vesselName: 'GOLDEN BELLS 11',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'GOLDEN BELLS 11 (B192)'
                  },
                  dateLanded: '2019-05-12',
                  exportWeight: '80'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a#change-0-landing-0').props().href).toContain('/addLandingsUpdatedUri');
    expect(wrapper.find('a#change-0-landing-0').props().href).not.toContain('/direct-landing');
  });

  it('should show the correct href value for species', () => {
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
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
          {
            product: {
              id: 'GBR-2021-CC-3021065E5-0f596934-3ebd-4844-8aa5-4c68ed472b78',
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        whereExportingUri: ':documentNumber/what-export-journey',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      },
      match: { params: {documentNumber: 'GBR-2021-CC-D6FBF748C'}}
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a#change-species-0').props().href).toContain('/addSpeciesUri');
  });

  it('should not render the change link for landings entry type in the Landing details when the document is locked', () => {
    const store = mockStore({
      summaryDocument: {
        status: 'LOCKED',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
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
          {
            product: {
              id: 'GBR-2021-CC-3021065E5-0f596934-3ebd-4844-8aa5-4c68ed472b78',
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        whereExportingUri: ':documentNumber/what-export-journey',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      },
      match: { params: {documentNumber: 'GBR-2021-CC-D6FBF748C'}}
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find('#landing-entry').exists()).toBeFalsy();
  });
});

describe('Summary page for directLanding when vessel overriden by admin', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);

  afterAll(() => {
    jest.resetAllMocks();
  });

  const store = mockStore({
    summaryDocument: {
      status: 'DRAFT',
      exporter: {
        model: {
          exporterFullName: 'Mr Fish Exporter',
          exportCompanyName: 'MailOrderFish Ltd',
          addressOne: '5 Costa Road',
          townCity: 'Hebburn',
          postcode: 'NE1 4FS'
        }
      },
      conservation: {
        conservationReference: 'Common fisheries policy'
      },
      transport: {
        vehicle: 'directLanding',
      },
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
                  label: 'SILVER QUEST (AR190)',
                  vesselOverriddenByAdmin: true
                },
                dateLanded: '2019-01-22',
                exportWeight: '22'
              }
            }
          ]
        },
        {
          product: {
            commodityCode: '03036400',
            presentation: {
              code: 'FIL',
              label: 'Filleted'
            },
            state: {
              code: 'FRO',
              label: 'Frozen'
            },
            species: {
              code: 'HAD',
              label: 'Haddock (HAD)'
            }
          },
          landings: [
            {
              addMode: false,
              editMode: false,
              model: {
                id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                vessel: {
                  pln: 'AR190',
                  vesselName: 'SILVER QUEST',
                  homePort: 'TROON AND SALTCOATS',
                  registrationNumber: 'A10726',
                  licenceNumber: '42384',
                  label: 'SILVER QUEST (AR190)',
                  vesselOverriddenByAdmin: true
                },
                dateLanded: '2019-01-22',
                exportWeight: '55'
              }
            }
          ]
        }]
      },
      exportLocation: {
        exportedFrom: 'United Kingdom',
        exportedTo: 'Brazil'
      },
      validationErrors: [{}]
    }
  });

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
      transportSelectionUri: ':documentNumber/transportSelectionUri',
      conservationManagementUri: ':documentNumber/conservationManagementUri',
      addSpeciesUri: ':documentNumber/addSpeciesUri',
      landingsEntryUri: ':documentNumber/landings-entry',
      addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
      whereExportingUri: ':documentNumber/what-export-journey',
      addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
      truckCmrUri: ':documentNumber/truckCmrUri',
      truckDetailsUri: ':documentNumber/truckDetailsUri',
      planeDetailsUri: ':documentNumber/planeDetailsUri',
      trainDetailsUri: ':documentNumber/trainDetailsUri',
      containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
      completeUri: ':documentNumber/catch-certificate-created',
      pendingUri: ':documentNumber/catch-certificate-pending',
      redirectUri: ':documentNumber/addLandingsUpdatedUri',
      journey: 'catchCertificate'
    },
    match: { params: {documentNumber: 'GBR-2021-CC-D6FBF748C'}}
  };

  wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <CatchCertificateSummary {...props} />
      </MemoryRouter>
    </Provider>
  );

  it('does not have change link for species and landing details', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a#change-species-0').exists()).toBeFalsy();
    expect(wrapper.find('a#change-0-landing-0').exists()).toBeFalsy();
    expect(wrapper.find('a#change-0-landing-1').exists()).toBeFalsy();
  });

  it('displays correct notification banner', () => {
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('Landings amended and authorised by service support cannot be changed.');
  });
});

describe('When the exporter wants to change transport type', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should not show change link when directLanding', () => {
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
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
          {
            product: {
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'AR190',
                    vesselName: 'SILVER QUEST',
                    homePort: 'TROON AND SALTCOATS',
                    registrationNumber: 'A10726',
                    licenceNumber: '42384',
                    label: 'SILVER QUEST (AR190)'
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '55'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        whereExportingUri: ':documentNumber/what-export-journey',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
    expect(wrapper.find('#change-transportType').exists()).toBeFalsy();
  });

  it('should show change link when not directLanding', () => {
    const store = mockStore({
      summaryDocument: {
        status: 'DRAFT',
        exporter: {
          model: {
            exporterFullName: 'Mr Fish Exporter',
            exportCompanyName: 'MailOrderFish Ltd',
            addressOne: '5 Costa Road',
            townCity: 'Hebburn',
            postcode: 'NE1 4FS'
          }
        },
        conservation: {
          conservationReference: 'Common fisheries policy'
        },
        transport: {
          vehicle: 'directLanding',
        },
        exportPayload: {
          items: [{
            product: {
              id: '4012-9653',
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
                  dateLanded: '2020-01-22',
                  exportWeight: '42'
                }
              }
            ]
          },
          {
            product: {
              id: '4013-9653',
              commodityCode: '03036400',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRO',
                label: 'Frozen'
              },
              species: {
                code: 'HAD',
                label: 'Haddock (HAD)'
              }
            },
            landings: [
              {
                addMode: false,
                editMode: false,
                model: {
                  id: 'f55dbc41-19f2-41c6-b047-8fcdae60601d',
                  vessel: {
                    pln: 'B192',
                    vesselName: 'GOLDEN BELLS 11',
                    homePort: 'ARDGLASS',
                    registrationNumber: 'A12186',
                    licenceNumber: '10106',
                    label: 'GOLDEN BELLS 11 (B192)'
                  },
                  dateLanded: '2019-05-12',
                  exportWeight: '80'
                }
              }
            ]
          }]
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [{}]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri',
        journey: 'catchCertificate'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
    expect(wrapper.find('#change-transportType').exists()).toBeTruthy();
  });
});

describe('Show System Failure errors', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);
  beforeEach(() => {
    mockBeforeEach();

    const store = mockStore({
      summaryDocument: {
        exporter: {
          model: {
            exporterFullName: 'Fish Boat',
            exporterCompanyName: 'Fish trader',
            addressOne: 'FIELDING HOUSE, FLAT 1, BENNETT STREET',
            addressTwo: 'LONDON',
            townCity: 'LONDON BOROUGH OF HOUNSLOW',
            postcode: 'W4 2AR'
          }
        },
        exportPayload: {
          items: [
            {
              product: {
                id: 'GBR-2021-CC-3021065E5-0f596934-3ebd-4844-8aa5-4c68ed472b78',
                commodityCode: '03044990',
                presentation: {
                  code: 'FIL',
                  label: 'Filleted'
                },
                state: {
                  code: 'FRE',
                  label: 'Fresh'
                },
                species: {
                  code: 'HER',
                  label: 'Atlantic herring (HER)'
                },
                factor: 2.1
              },
              landings: [
                {
                  model: {
                    id: 'GBR-2021-CC-3021065E5-1612462664',
                    vessel: {
                      pln: 'N/A',
                      vesselName: 'Vessel not found',
                      label: 'Vessel not found (N/A)',
                      homePort: '',
                      flag: '',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2018-08-03',
                    exportWeight: 12932392992,
                    numberOfSubmissions: 2
                  }
                },
                {
                  model: {
                    id: 'GBR-2021-CC-3021065E5-1612462665',
                    vessel: {
                      pln: 'PH2200',
                      vesselName: 'WIRON 5',
                      label: 'WIRON (PH2200)',
                      homePort: 'some home port',
                      flag: 'UK',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2238-08-03',
                    exportWeight: 12932392992,
                    numberOfSubmissions: 2
                  }
                }
              ]
            }
          ]
        },
        transport: {
          vehicle: 'directLanding'
        },
        conservation: {
          conservationReference: 'UK Fisheries Policy',
          legislation: [
            'UK Fisheries Policy'
          ],
          caughtInUKWaters: 'Y',
          user_id: 'Test',
          currentUri: 'Test',
          nextUri: 'Test'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: [
          {
            error: 'SYSTEM_ERROR'
          }
        ]
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );

  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('display notification banner', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
  });

  it('should render notification banner with the correct system content', () => {
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('There was an error in processing. Please resubmit. If the problem persists, contact support on 0330 159 1989.');
  });
});

describe('When system failures is not an array', () => {
  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({});
        });
      }
    }
  })]);
  beforeEach(() => {
    mockBeforeEach();

    const store = mockStore({
      summaryDocument: {
        exporter: {
          model: {
            exporterFullName: 'Fish Boat',
            exporterCompanyName: 'Fish trader',
            addressOne: 'FIELDING HOUSE, FLAT 1, BENNETT STREET',
            addressTwo: 'LONDON',
            townCity: 'LONDON BOROUGH OF HOUNSLOW',
            postcode: 'W4 2AR'
          }
        },
        exportPayload: {
          items: [
            {
              product: {
                id: 'GBR-2021-CC-3021065E5-0f596934-3ebd-4844-8aa5-4c68ed472b78',
                commodityCode: '03044990',
                presentation: {
                  code: 'FIL',
                  label: 'Filleted'
                },
                state: {
                  code: 'FRE',
                  label: 'Fresh'
                },
                species: {
                  code: 'HER',
                  label: 'Atlantic herring (HER)'
                },
                factor: 2.1
              },
              landings: [
                {
                  model: {
                    id: 'GBR-2021-CC-3021065E5-1612462664',
                    vessel: {
                      pln: 'N/A',
                      vesselName: 'Vessel not found',
                      label: 'Vessel not found (N/A)',
                      homePort: '',
                      flag: '',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2018-08-03',
                    exportWeight: 12932392992,
                    numberOfSubmissions: 2
                  }
                },
                {
                  model: {
                    id: 'GBR-2021-CC-3021065E5-1612462665',
                    vessel: {
                      pln: 'PH2200',
                      vesselName: 'WIRON 5',
                      label: 'WIRON (PH2200)',
                      homePort: 'some home port',
                      flag: 'UK',
                      imoNumber: '9249556',
                      licenceNumber: '12480',
                      licenceValidTo: '2382-12-31T00:00:00'
                    },
                    faoArea: 'FAO27',
                    dateLanded: '2238-08-03',
                    exportWeight: 12932392992,
                    numberOfSubmissions: 2
                  }
                }
              ]
            }
          ]
        },
        transport: {
          vehicle: 'directLanding'
        },
        conservation: {
          conservationReference: 'UK Fisheries Policy',
          legislation: [
            'UK Fisheries Policy'
          ],
          caughtInUKWaters: 'Y',
          user_id: 'Test',
          currentUri: 'Test',
          nextUri: 'Test'
        },
        exportLocation: {
          exportedFrom: 'United Kingdom',
          exportedTo: 'Brazil'
        },
        validationErrors: {
          key: 'i am not an array'
        }
      }
    });

    window.scrollTo = jest.fn();

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        transportSelectionUri: ':documentNumber/transportSelectionUri',
        conservationManagementUri: ':documentNumber/conservationManagementUri',
        addSpeciesUri: ':documentNumber/addSpeciesUri',
        landingsEntryUri: ':documentNumber/landings-entry',
        addLandingsUpdatedUri: ':documentNumber/addLandingsUpdatedUri',
        addExporterDetailsUri: ':documentNumber/addExporterDetailsUri',
        truckCmrUri: ':documentNumber/truckCmrUri',
        truckDetailsUri: ':documentNumber/truckDetailsUri',
        planeDetailsUri: ':documentNumber/planeDetailsUri',
        trainDetailsUri: ':documentNumber/trainDetailsUri',
        containerVesselDetailsUri: ':documentNumber/containerVesselDetailsUri',
        completeUri: ':documentNumber/catch-certificate-created',
        pendingUri: ':documentNumber/catch-certificate-pending',
        redirectUri: ':documentNumber/addLandingsUpdatedUri'
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CatchCertificateSummary {...props} />
        </MemoryRouter>
      </Provider>
    );

  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });
});

describe('Re-direct user to landing entry page when landing entry is null', () => {
  const mockPush = jest.fn();
  const mockGetSummaryCertificate = jest.fn();


  afterEach(() =>{
    jest.resetAllMocks();
  });

  it('should re-direct to landing entry page when landingsEntryOption is null', async () => {
    let getProgress = jest.fn();
    getProgress.mockReturnValue({ type: 'GET_PROGRESS' });
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
        journey: 'catchCertificate',
      },
      conservation: {},
      saveAsDraft: {},
      history: {
        push: mockPush
      },
      getSummaryCertificate: mockGetSummaryCertificate,
      exportPayload: {
        items: [
          {
            product: {
              id: 'GBR-2021-CC-3021065E5-0f596934-3ebd-4844-8aa5-4c68ed472b78',
              commodityCode: '03044990',
              presentation: {
                code: 'FIL',
                label: 'Filleted'
              },
              state: {
                code: 'FRE',
                label: 'Fresh'
              },
              species: {
                code: 'HER',
                label: 'Atlantic herring (HER)'
              },
              factor: 2.1
            },
            landings: [
              {
                model: {
                  id: 'GBR-2021-CC-3021065E5-1612462664',
                  vessel: {
                    pln: 'N/A',
                    vesselName: 'Vessel not found',
                    label: 'Vessel not found (N/A)',
                    homePort: '',
                    flag: '',
                    imoNumber: '9249556',
                    licenceNumber: '12480',
                    licenceValidTo: '2382-12-31T00:00:00'
                  },
                  faoArea: 'FAO27',
                  dateLanded: '2018-08-03',
                  exportWeight: 12932392992,
                  numberOfSubmissions: 2
                }
              },
              {
                model: {
                  id: 'GBR-2021-CC-3021065E5-1612462665',
                  vessel: {
                    pln: 'PH2200',
                    vesselName: 'WIRON 5',
                    label: 'WIRON (PH2200)',
                    homePort: 'some home port',
                    flag: 'UK',
                    imoNumber: '9249556',
                    licenceNumber: '12480',
                    licenceValidTo: '2382-12-31T00:00:00'
                  },
                  faoArea: 'FAO27',
                  dateLanded: '2238-08-03',
                  exportWeight: 12932392992,
                  numberOfSubmissions: 2
                }
              }
            ]
          }
        ]
      },
      landingsEntryOption: null,
      progress:{
        reference:'OPTIONAL',
        exporter:'INCOMPLETE',
        products:'INCOMPLETE',
        landings:'CANNOT START',
        conservation:'INCOMPLETE',
        exportJourney:'INCOMPLETE',
        transportType:'INCOMPLETE',
        transportDetails:'CANNOT START'
      },
      requiredSections:7,
      completedSections:0,
      getProgress:getProgress
    };

    await new CatchCertificateSummary.WrappedComponent(props).componentDidMount(props);
    expect(mockGetSummaryCertificate).toHaveBeenCalledWith('catchCertificate','GBR-23423-4234234');
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/landings-entry');
  });

  it('should not re-direct to landing entry page when landingsEntryOption is manualEntry', async () => {
    let getProgress = jest.fn();
    getProgress.mockReturnValue({ type: 'GET_PROGRESS' });
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
        journey: 'catchCertificate',
      },
      conservation: {},
      saveAsDraft: {},
      history: {
        push: mockPush
      },
      getSummaryCertificate: mockGetSummaryCertificate,
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
      },
      landingsEntryOption: 'manualEntry',
      progress:{
        reference:'OPTIONAL',
        exporter:'INCOMPLETE',
        products:'INCOMPLETE',
        landings:'CANNOT START',
        conservation:'INCOMPLETE',
        exportJourney:'INCOMPLETE',
        transportType:'INCOMPLETE',
        transportDetails:'CANNOT START'
      },
      requiredSections:7,
      completedSections:0,
      getProgress:getProgress
    };

    await new CatchCertificateSummary.WrappedComponent(props).componentDidMount(props);
    expect(mockGetSummaryCertificate).toHaveBeenCalledWith('catchCertificate','GBR-23423-4234234');
    expect(mockPush).not.toHaveBeenCalledWith('GBR-23423-4234234/landings-entry');
  });

  it('should redirect to progress page if completed sections not matched with required sections', async () => {
    let getProgress = jest.fn();
    getProgress.mockReturnValue({ type: 'GET_PROGRESS' });

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
        journey: 'catchCertificate',
      },
      conservation: {},
      saveAsDraft: {},
      history: {
        push: mockPush
      },
      getSummaryCertificate: mockGetSummaryCertificate,
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
      },
      landingsEntryOption: 'manualEntry',
      progress:{
        reference:'OPTIONAL',
        exporter:'INCOMPLETE',
        products:'INCOMPLETE',
        landings:'CANNOT START',
        conservation:'INCOMPLETE',
        exportJourney:'INCOMPLETE',
        transportType:'INCOMPLETE',
        transportDetails:'CANNOT START'
      },
      requiredSections:7,
      completedSections:0,
      getProgress:getProgress
      };

    await new CatchCertificateSummary.WrappedComponent(props).componentDidMount(props);
    expect(getProgress).toHaveBeenCalled();

  });

  it('should check if completed sections is matching to required sections', async () => {
    const mockPush = jest.fn();
    let getProgress = jest.fn();
    getProgress.mockReturnValue({ type: 'GET_PROGRESS' });

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
        journey: 'catchCertificate',
      },
      conservation: {},
      saveAsDraft: {},
      history: {
        push: mockPush
      },
      getSummaryCertificate: mockGetSummaryCertificate,
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
      },
      landingsEntryOption: 'manualEntry',
      progress: {
        progress:{
        reference:'OPTIONAL',
        exporter:'INCOMPLETE',
        products:'INCOMPLETE',
        landings:'CANNOT START',
        conservation:'INCOMPLETE',
        exportJourney:'INCOMPLETE',
        transportType:'INCOMPLETE',
        transportDetails:'CANNOT START'
      },
      requiredSections:7,
      completedSections:0
      },
      getProgress:getProgress
      };

    await new CatchCertificateSummary.WrappedComponent(props).componentDidMount(props);
    expect(mockPush).toHaveBeenCalledWith('/create-catch-certificate/GBR-23423-4234234/progress');
  });
});