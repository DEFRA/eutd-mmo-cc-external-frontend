import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import uuid from 'uuid/v4';
import {
  getExportPayload,
  clearExportPayload,
  dispatchClearErrors,
  removeProduct,
  removeLanding,
  validateExportPayload,
  validateLanding,
} from '../../../../../src/client/actions';
import { clearErrorsExportPayload } from '../../../../../src/client/actions/export-payload.actions';
import { getLandingType, validateLandingType } from '../../../../../src/client/actions/landingsType.actions';
import { component as LandingsUpdatedPage } from '../../../../../src/client/pages/exportCertificates/landings/LandingsUpdatedPage';
import LandingsUpdatedComponent from '../../../../../src/client/pages/exportCertificates/landings/LandingsUpdatedPage';
import { createMemoryHistory } from 'history';
import LandingsGuidance from '../../../../../src/client/pages/exportCertificates/landings/LandingsGuidance';
import { render } from '@testing-library/react';

jest.mock('../../../../../src/client/actions');
jest.mock('../../../../../src/client/actions/export-payload.actions');
jest.mock('../../../../../src/client/actions/landingsType.actions');
jest.mock('uuid/v4');

describe('Landings Updated Page initial load', () => {
  let wrapper;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  const exportWeight = 150.4567;

  const data = {
    items: [
      {
        product: {
          commodityCode: '03047190',
          id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
          presentation: {
            code: 'FIL',
            label: 'Filleted',
          },
          species: {
            code: 'COD',
            label: 'Atlantic cod (COD)',
          },
          state: {
            code: 'FRO',
            label: 'Frozen',
          },
        },
        landings: [
          {
            addMode: false,
            editMode: false,
            model: {
              dateLanded: '2021-03-05',
              exportWeight,
              id: '37c05560-38c9-451e-ab85-1718f682b870',
              vessel: {
                domId: 'ANNISABELLA-LO61',
                homePort: 'LOWESTOFT',
                imoNumber: '',
                label: 'ANN ISABELLA (LO61)',
                licenceNumber: '20178',
                pln: 'LO61',
                registrationNumber: '',
                vesselName: 'ANN ISABELLA',
              },
            },
          },
          {
            addMode: false,
            editMode: false
          },
        ],
      },
      {
        product: {
          commodityCode: '03047190',
          id: 'my-product-1',
          presentation: {
            code: 'FIL',
            label: 'Filleted',
          },
          species: {
            code: 'COD',
            label: 'Atlantic cod (COD)',
          },
          state: {
            code: 'FRO',
            label: 'Frozen',
          },
        }
      },
    ],
  };

  const store = mockStore({
    vessels: [
      { pln: '123', vesselName: 'Titanic' },
      { pln: '1234', vesselName: 'Titanic' },
      { pln: '456', vesselName: 'Black Pearl' },
      { pln: '4565', vesselName: 'Black Zeal' },
      { pln: '789', vesselName: 'Atlantic' },
    ],
    exportPayload: data,
    config: {
      maxLandingsLimit: 100,
      offlineValidationTime: 30,
      landingLimitDaysInTheFuture: 7,
    },
    errors: {
    }
  });

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
      nextUri:
        '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
      path: '/catch-certificates/:documentNumber/add-landings',
      journey: 'catchCertificate',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      uploadFileUri: '/catch-certificates/:documentNumber/upload-file',
      progressUri: '/catch-certificates/:documentNumber/progress'
    },
  };

  const documentNumber = 'document123';

  let mockPush;

  beforeEach(() => {
    const history = createMemoryHistory({
      initialEntries: [`/catch-certificates/${documentNumber}/add-landings?andClickId=edit-lnd-btn-GBR-2021-CC-product-1_GBR-2021-CC-landing-1`]
    });

    mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS '});
    getExportPayload.mockReturnValue({ type: 'GET_EXPORT_PAYLOAD' });
    getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });
    clearExportPayload.mockReturnValue({ type: 'CLEAR_EXPORT_PAYLOAD' });
    validateExportPayload.mockReturnValue({ type: 'VALIDATE_EXPORT_PAYLOAD' });
    validateLanding.mockReturnValue({ type: 'UPSERT_LANDING' });
    clearErrorsExportPayload.mockReturnValue({ type: 'CLEAR_LANDING' });
    removeProduct.mockReturnValue({ type: 'REMOVE_PRODUCT' });
    removeLanding.mockReturnValue({ type: 'REMOVE_LANDING' });
    getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });
    validateLandingType.mockReturnValue({ type: 'VALIDATE_LANDING_TYPE' });
    uuid.mockImplementation(() => 'testid');
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/catch-certificates/:documentNumber/add-landings">
            <LandingsUpdatedPage {...props} />
          </Route>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should have a title', () => {
    expect(wrapper.find('PageTitle').props().title).toBe('Add landings for each product - Create a UK catch certificate - GOV.UK');
  });

  it('should NOT display a warning banner if no vessel is overridden by Admin', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeFalsy();
  });

  it('should have a service call to get landing type', () => {
    expect(getLandingType).toHaveBeenCalled();
  });

  it('should handle submit event', () => {
    wrapper.find('form#outer').simulate('submit', { preventDefault() {} });

    expect(clearErrorsExportPayload).toHaveBeenCalled();
    expect(validateExportPayload).toHaveBeenCalled();
  });

  it('should handle save as draft event', async () => {
    await wrapper.find('button#saveAsDraft').simulate('click', { preventDefault() {} });

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/create-catch-certificate/catch-certificates');
  });

  it('should contain information about when a landing will be processed offline', () => {
    expect(wrapper.exists(LandingsGuidance)).toBe(true);

    const guidanceComponent = wrapper.find(LandingsGuidance);

    expect(guidanceComponent.prop('maxLandingsLimit')).toBe(100);
    expect(guidanceComponent.prop('offlineValidationTime')).toBe(30);
    expect(guidanceComponent.prop('landingLimitDaysInTheFuture')).toBe(7);
  });

  it('should contain a table of landings', () => {
    expect(wrapper.find('h2#landingsTableCaption').exists()).toBeTruthy();
    expect(wrapper.find('Table#landings-table').exists()).toBeTruthy();
  });

  it('should contain a table of products', () => {
    expect(wrapper.find('h2#productsTableCaption').exists()).toBeTruthy();
    expect(wrapper.find('Table#products-table').exists()).toBeTruthy();
  });

  it('should contain an Edit button', () => {
    const editBtn = wrapper.find('button[id="edit_37c05560-38c9-451e-ab85-1718f682b870"]');
    act(() => editBtn.props().onClick({
      preventDefault: () => {},
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(editBtn.exists()).toBeTruthy();
    expect(wrapper.find('LandingsUpdatedPage').state()).toEqual({
      editMode: '37c05560-38c9-451e-ab85-1718f682b870-testid',
      productId: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
      landingId: '37c05560-38c9-451e-ab85-1718f682b870'
    });
  });

  it('should contain an clear button', () => {
    const cancelBtn = wrapper.find('button[id="cancel"]');
    act(() => cancelBtn.props().onClick({
      preventDefault: () => {},
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(cancelBtn.exists()).toBeTruthy();
    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(wrapper.find('LandingsUpdatedPage').state()).toEqual({
      editMode: '',
      productId: undefined,
      landingId: undefined
    });
  });

  it('should contain an add button', () => {
    const addBtn = wrapper.find('button[id="submit"]');
    act(() => addBtn.props().onClick({
      preventDefault: () => {},
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(addBtn.exists()).toBeTruthy();
    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(validateLanding).toHaveBeenCalled();
  });

  it('should contain an remove product button', () => {
    const removeProductBtn = wrapper.find('button[id="remove-btn_my-product-1"]');
    wrapper.find('LandingsUpdatedPage').setState({
      productId: 'my-product-1',
      landingId: undefined
    });

    act(() => removeProductBtn.props().onClick({
      preventDefault: () => {},
      target: {
        value: 'my-product-1'
      },
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(removeProduct).toHaveBeenCalled();
    expect(removeProductBtn.exists()).toBeTruthy();
    expect(wrapper.find('LandingsUpdatedPage').state()).toEqual({
      editMode: '',
      productId: undefined,
      landingId: undefined
    });
  });

  it('should contain an remove product button 2', () => {
    const removeProductBtn = wrapper.find('button[id="remove-btn_my-product-1"]');

    act(() => removeProductBtn.props().onClick({
      preventDefault: () => {},
      target: {
        value: 'my-product-2'
      },
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(removeProduct).toHaveBeenCalled();
    expect(removeProductBtn.exists()).toBeTruthy();
    expect(wrapper.find('LandingsUpdatedPage').state()).not.toEqual({
      productId: undefined,
      landingId: undefined
    });
  });

  it('should contain an remove landing button', () => {
    const removeLandingBtn = wrapper.find('button[id="remove_37c05560-38c9-451e-ab85-1718f682b870"]');
    wrapper.find('LandingsUpdatedPage').setState({
      editMode: '37c05560-38c9-451e-ab85-1718f682b870-test-id',
      productId: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
      landingId: '37c05560-38c9-451e-ab85-1718f682b870'
    });

    act(() => removeLandingBtn.props().onClick({
      preventDefault: () => {},
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(removeLanding).toHaveBeenCalled();
    expect(removeLandingBtn.exists()).toBeTruthy();
    expect(wrapper.find('LandingsUpdatedPage').state()).toEqual({
      editMode: '',
      productId: undefined,
      landingId: undefined
    });
  });

  it('should contain an remove landing button 2', () => {
    const removeLandingBtn = wrapper.find('button[id="remove_37c05560-38c9-451e-ab85-1718f682b870"]');
    act(() => removeLandingBtn.props().onClick({
      preventDefault: () => {},
      currentTarget: ({
        blur: () => {}
      })
    }));

    expect(dispatchClearErrors).toHaveBeenCalled();
    expect(removeLanding).toHaveBeenCalled();
    expect(removeLandingBtn.exists()).toBeTruthy();
    expect(wrapper.find('LandingsUpdatedPage').state()).not.toEqual({
      productId: undefined,
      landingId: undefined
    });
  });

  it('will check if the save and continue button is present', () => {
    expect(wrapper.find('button#continue').exists()).toBeTruthy();
  });

  it('should set state to be the product id and landings id found in search - direct link from summary page', () => {
    const component = wrapper.find('LandingsUpdatedPage');
    expect(component.state()).toEqual({
      editMode: 'GBR-2021-CC-landing-1-testid',
      productId: 'GBR-2021-CC-product-1',
      landingId: 'GBR-2021-CC-landing-1'
    });
  });

  it('will show a Upload products and landings button', () => {
    const component = wrapper.find('button#upload-file').first();

    expect(component.text()).toBe('Upload products and landings');
  });

  it('will NOT show Upload products and landings button when max number of landings reached', () => {
    const store = mockStore({
      vessels: [
        { pln: '123', vesselName: 'Titanic' },
        { pln: '456', vesselName: 'Black Pearl' },
      ],
      exportPayload: data,
      config: {
        maxLandingsLimit: 1,
        offlineValidationTime: '30',
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.exists('button[id="upload-file"]')).toBeFalsy();
  });

  it('will set landingEntry type as uploadEntry and redirect to the upload page when the upload button is clicked', async () => {
    const component = wrapper.find('button#upload-file').first();

    await act(async () => {
      await component.simulate('click');
    });

    expect(validateLandingType).toHaveBeenCalledWith('uploadEntry', documentNumber);
    expect(mockPush).toHaveBeenCalledWith(
      props.route.uploadFileUri.replace(':documentNumber', documentNumber)
    );
  });

  it('will catch errors thrown setting landingEntryType', async () => {
    const mockConsole = jest.spyOn(console, 'error');

    validateLandingType.mockImplementation(() => {
      throw new Error('something has gone wrong');
    });

    const component = wrapper.find('button#upload-file').first();

    await act(async () => {
      await component.simulate('click');
    });

    expect(mockConsole).toHaveBeenCalledWith('something has gone wrong');
    expect(mockPush).not.toHaveBeenCalledWith(props.route.uploadFileUri.replace(':documentNumber', documentNumber));
  });

  it('will clear the export payload from store', () => {
    wrapper.unmount();
    expect(clearExportPayload).toHaveBeenCalled();
  });

  it('should have a back to progress page link', () => {
    expect(wrapper.find('a[href="/catch-certificates/document123/progress"]').exists()).toBeTruthy();
  });
});

describe('Landings Updated Page with no export payload', () => {
  let wrapper;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS '});
    getExportPayload.mockReturnValue({ type: 'GET_EXPORT_PAYLOAD' });
    clearExportPayload.mockReturnValue({ type: 'CLEAR_EXPORT_PAYLOAD' });
    validateExportPayload.mockReturnValue({ type: 'VALIDATE_EXPORT_PAYLOAD' });
    validateLanding.mockReturnValue({ type: 'UPSERT_LANDING' });
    clearErrorsExportPayload.mockReturnValue({ type: 'CLEAR_EXPORT_PAYLOAD' });
    const store = mockStore({
      vessels: [
        { pln: '123', vesselName: 'Titanic' },
        { pln: '1234', vesselName: 'Titanic' },
        { pln: '456', vesselName: 'Black Pearl' },
        { pln: '4565', vesselName: 'Black Zeal' },
        { pln: '789', vesselName: 'Atlantic' },
      ],
      exportPayload: undefined,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      },
      errors: {
        errors: []
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('Landings Updated page load with incomplete export data', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            id: 'GBR-2021-CC-466322E1A-8cfd94a9-3fab-4cc4-9c31-4b1d8620cf59',
            commodityCode: '03025110',
            presentation: {
              code: 'WHL',
              label: 'Whole',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
          landings: [
            {
              model: {
                id: 'GBR-2021-CC-466322E1A-1612522025',
                vessel: {
                  label: 'AURORA (SD395)'
                },
                faoArea: 'FAO27',
                dateLanded: '2021-02-01',
                exportWeight: 100,
                numberOfSubmissions: 0,
              },
              landingId: 'GBR-2021-CC-466322E1A-1612522025',
              addMode: false,
              editMode: false,
              error: '',
              errors: {},
            },
          ],
        },
        {
          product: {
            id: 'GBR-2021-CC-466322E1A-1dc4bf96-4e4e-4e97-b5dd-399814e31eb2',
            commodityCode: '03028990',
            presentation: {
              code: 'GUT',
              label: 'Gutted',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'NEC',
              label: 'Red codling (NEC)',
            },
          },
        },
      ],
    };

    const store = mockStore({
      vessels: [],
      exportPayload: data,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      },
      errors: {
        errors: []
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });
});

describe('Landings Updated Page load when a landing has vessel overridden by Admin', () => {
  let wrapper;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            commodityCode: '03047190',
            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
            state: {
              code: 'FRO',
              label: 'Frozen',
            },
          },
          landings: [
            {
              addMode: false,
              editMode: false,
              model: {
                dateLanded: '2019-03-05T00:00:00.000Z',
                exportWeight: 150,
                id: '37c05560-38c9-451e-ab85-1718f682b870',
                vessel: {
                  domId: 'ANNISABELLA-LO61',
                  homePort: 'LOWESTOFT',
                  imoNumber: '',
                  label: 'ANN ISABELLA (LO61)',
                  licenceNumber: '20178',
                  pln: 'LO61',
                  registrationNumber: '',
                  vesselName: 'ANN ISABELLA',
                  vesselOverriddenByAdmin: true,
                },
              },
            },
          ],
        },
      ],
    };

    const store = mockStore({
      vessels: [
        { pln: '123', vesselName: 'Titanic' },
        { pln: '456', vesselName: 'Black Pearl' },
      ],
      exportPayload: data,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      },
      errors: {
        errors: []
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should display a warning banner if there is vessel overridden by Admin', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeTruthy();
  });

  it('will check if the save and continue button is present', () => {
    expect(wrapper.find('button#continue').exists()).toBeTruthy();
  });
});

describe('Landings Updated Page load when there is no product or landing', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            commodityCode: '03047190',
            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
            state: {
              code: 'FRO',
              label: 'Frozen',
            },
          },
          landings: [],
        },
      ],
    };

    const store = mockStore({
      vessels: [
        { pln: '123', vesselName: 'Titanic' },
        { pln: '456', vesselName: 'Black Pearl' },
      ],
      exportPayload: data,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      },
      errors: {
        errors: []
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should not display a notification banner', () => {
    expect(wrapper.find('.notification-banner').exists()).toBeFalsy();
  });

  it('should NOT contain Edit link', () => {
    expect(
      wrapper.find('button[id="edit-lnd-btn-1_model123"]').exists()
    ).toBeFalsy();
  });

  it('should NOT contain visually hidden text in Remove', () => {
    expect(
      wrapper.find('[name="remove"] span.govuk-visually-hidden').exists()
    ).toBeFalsy();
  });
});

describe('Landings Updated Page Errors', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            commodityCode: '03047190',
            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a11',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
            state: {
              code: 'FRO',
              label: 'Frozen',
            },
          },
        },
        {
          product: {
            commodityCode: '03047200',
            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
            state: {
              code: 'FRO',
              label: 'Frozen',
            },
          },
          landings: [
            {
              addMode: false,
              editMode: false,
              model: {
                dateLanded: '2019-03-05T00:00:00.000Z',
                exportWeight: 150,
                id: '37c05560-38c9-451e-ab85-1718f682b870',
                vessel: {
                  domId: 'ANNISABELLA-LO61',
                  homePort: 'LOWESTOFT',
                  imoNumber: '',
                  label: 'ANN ISABELLA (LO61)',
                  licenceNumber: '20178',
                  pln: 'LO61',
                  registrationNumber: '',
                  vesselName: 'ANN ISABELLA',
                },
              },
            },
            {
              addMode: false,
              editMode: false,
              model: {
                dateLanded: '2018-03-05T00:00:00.000Z',
                exportWeight: '150',
                id: '37c05560-38c9-451e-ab85-1718f682b973',
                vessel: {
                  domId: 'ANNISABELLA',
                  homePort: 'LOWESTOFT',
                  imoNumber: '',
                  label: 'DORA IVINA LABEL',
                  licenceNumber: '20178',
                  pln: 'LO61',
                  registrationNumber: '',
                  vesselName: 'DORA IVINA',
                },
              },
            },
          ],
        },
      ],
      errors: {
        product: 'error.productId.string.invalid'
      }
    };

    const store = mockStore({
      vessels: [
        { pln: '123', vesselName: 'Titanic' },
        { pln: '456', vesselName: 'Black Pearl' },
      ],
      exportPayload: data,
      config: {
        maxLandingsLimit: 2,
        offlineValidationTime: '30',
      },
      errors: {
        errors: []
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('will display an error island', () => {
    expect(wrapper.find('ErrorIsland').exists()).toBeTruthy();
    expect(wrapper.find('ErrorIsland').props().errors).toEqual(
      [{
        message: 'error.productId.string.invalid',
        key: 'product'
      },{
        key: 'products-table',
        message: 'The maximum landings limit has been reached. To progress, you will need to remove the products without landings.',
      }]
    );
  });

  it('will throw an island error indicating that the number of landings has been reached', () => {
    expect(wrapper.find('ErrorIsland').exists()).toBeTruthy();
    expect(wrapper.find('ErrorIsland').props().errors[1].message).toBe('The maximum landings limit has been reached. To progress, you will need to remove the products without landings.');
  });

  it('will check if the save and continue button is not present if it has reacher the limit of landings', () => {
    expect(wrapper.find('button#continue').exists()).toBeFalsy();
  });
});

describe('Landing Updated Page Load Data', () => {
  const store = {
    dispatch: () => {
      return new Promise((res) => {
        res();
      });
    },
  };

  const documentNumber = 'some-document-number';

  beforeEach(() => {
    getExportPayload.mockReturnValue({ type: 'GET_EXPORT_PAYLOAD' });
    getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });
  });

  it('will call all methods needed to load the component', async () => {
    LandingsUpdatedComponent.documentNumber = documentNumber;

    await LandingsUpdatedComponent.loadData(store);

    expect(getLandingType).toHaveBeenCalledWith(documentNumber);
    expect(getExportPayload).toHaveBeenCalledWith(documentNumber);
    expect(getLandingType).toHaveBeenCalledWith(documentNumber);
  });
});

describe('When component did update service call fails', () => {

  it('should push history for component did update', () => {
    const mockPush = jest.fn();

    new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      exportPayload: { unauthorised: true },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting'
      }
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should not push history for component did update', () => {
    const mockPush = jest.fn();

    new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      exportPayload: {},
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting'
      }
    }).componentDidUpdate();

    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe('When component did mount', () => {

  it('should push history for component did mount without items', async () => {
    const mockPush = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      location: {
          search: ''
        },
      exportPayload: { items: [] },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: '/catch-certificates/:documentNumber/landings-entry',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      landingsType: {},
      getExportPayload: jest.fn(),
      getLandingType: jest.fn()
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should push history for component did mount with empty items products', async () => {
    const mockPush = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      location: {
        search: ''
      },
      exportPayload: { items: [{
        product: []
      }] },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: '/catch-certificates/:documentNumber/landings-entry',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      landingsType: {},
      getExportPayload: jest.fn(),
      getLandingType: jest.fn()
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should push history for component did mount with undefined items products', async () => {
    const mockPush = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      location: {
        search: ''
      },
      exportPayload: { items: [{
        product: undefined
      }] },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: '/catch-certificates/:documentNumber/landings-entry',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      landingsType: {},
      getExportPayload: jest.fn(),
      getLandingType: jest.fn()
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should push history for component did mount with landingsType of directLanding', async () => {
    const mockPush = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      location: {
        search: ''
      },
      exportPayload: {
        items: [
          {
            product: {
              commodityCode: '03047190',
              id: 'my-product-1',
              presentation: {
                code: 'FIL',
                label: 'Filleted',
              },
              species: {
                code: 'COD',
                label: 'Atlantic cod (COD)',
              },
              state: {
                code: 'FRO',
                label: 'Frozen',
              },
            }
          },
        ],
      },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: ':documentNumber/landings-entry'
      },
      landingsType: {
        landingsEntryOption: 'directLanding'
      },
      getExportPayload: jest.fn(),
      getLandingType: jest.fn()
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should redirect user to landing entry page when landing entry is undefined', async () => {
    const mockPush = jest.fn();
    const mockGetLandingType = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: 'some-document-number'
        }
      },
      location: {
        search: ''
      },
      exportPayload: { items: [{
        product: undefined
      }] },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: '/catch-certificates/:documentNumber/landings-entry',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      landingsType: {
        landingsEntryOption: null,
        generatedByContent: false
      },
      getLandingType: mockGetLandingType,
      getExportPayload: jest.fn()
    }).componentDidMount();

    expect(mockGetLandingType).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/catch-certificates/some-document-number/landings-entry');
  });

  it('should NOT redirect user to landing entry page when landing entry is not undefined', async () => {
    const mockPush = jest.fn();
    const mockGetLandingType = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: 'some-document-number'
        }
      },
      location: {
        search: ''
      },
      exportPayload: {
        items: [
          {
            product: {
              commodityCode: '03047190',
              id: 'my-product-1',
              presentation: {
                code: 'FIL',
                label: 'Filleted',
              },
              species: {
                code: 'COD',
                label: 'Atlantic cod (COD)',
              },
              state: {
                code: 'FRO',
                label: 'Frozen',
              },
            }
          },
        ],
      },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: '/catch-certificates/:documentNumber/landings-entry'
      },
      landingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false
      },
      getLandingType: mockGetLandingType,
      getExportPayload: jest.fn()
    }).componentDidMount();

    expect(mockGetLandingType).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalledWith('/catch-certificates/some-document-number/landings-entry');
  });

  it('should NOT redirect user to progress page when products is empty', async () => {
    const mockPush = jest.fn();
    const mockGetLandingType = jest.fn();

    await new LandingsUpdatedPage.WrappedComponent({
      match: {
        params: {
          documentNumber: 'some-document-number'
        }
      },
      location: {
        search: ''
      },
      exportPayload: {
        items: [],
      },
      history: {
        push: mockPush
      },
      route: {
        previousUri: ':documentNumber/what-are-you-exporting',
        landingsEntryUri: '/catch-certificates/:documentNumber/landings-entry',
        progressUri: '/create-catch-certificate/:documentNumber/progress'
      },
      landingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false
      },
      getLandingType: mockGetLandingType,
      getExportPayload: jest.fn()
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalledWith('/catch-certificates/some-document-number/progress');
  });
});

describe('When Submitting', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should catch errors and scroll to top', async () => {
    const mockScrollTo = jest.spyOn(window, 'scrollTo');

    await new LandingsUpdatedPage.WrappedComponent({
      history: []
    }).onSubmit({
      preventDefault: jest.fn()
    });

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should catch errors within save as draft and scroll to top', async () => {
    const mockScrollTo = jest.spyOn(window, 'scrollTo');

    await new LandingsUpdatedPage.WrappedComponent({
      history: []
    }).onSaveAsDraft({
      preventDefault: jest.fn()
    });

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });
});

describe('Landings page with Errors in Landings', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            id: 'GBR-2021-CC-466322E1A-8cfd94a9-3fab-4cc4-9c31-4b1d8620cf59',
            commodityCode: '03025110',
            presentation: {
              code: 'WHL',
              label: 'Whole',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
          landings: [
            {
              model: {
                id: 'GBR-2021-CC-466322E1A-1612522025',
                vessel: {
                  label: 'AURORA (SD395)',
                },
                faoArea: 'FAO27',
                dateLanded: '2021-02-01',
                exportWeight: 100,
                numberOfSubmissions: 0,
              },
              landingId: 'GBR-2021-CC-466322E1A-1612522025',
              addMode: false,
              editMode: false,
              error: 'invalid',
              errors: {
                'vessel.vesselName': 'error.vessel.vesselName.any.required',
                dateLanded: 'error.dateLanded.date.max',
              },
            },
          ],
        },
        {
          product: {
            id: 'GBR-2021-CC-466322E1A-1dc4bf96-4e4e-4e97-b5dd-399814e31eb2',
            commodityCode: '03028990',
            presentation: {
              code: 'GUT',
              label: 'Gutted',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'NEC',
              label: 'Red codling (NEC)',
            },
          },
        },
      ],
      errors: {
        product: 'some-error'
      }
    };

    const store = mockStore({
      vessels: [],
      exportPayload: data,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      },
      errors: {
        errors: [{
          targetName: 'general',
          text: 'message'
        }]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render a error messages for the landing', () => {
    expect(wrapper.find('ErrorIsland').prop('errors')).toEqual([
      {
        key: 'general',
        message: 'message',
      },
      {
        key: 'product',
        message: 'some-error'
      },
      {
        key: 'dateLanded',
        message: 'Date landed can be no more than 7 days in the future'
      },
      {
        key: 'vessel.vesselName',
        message: 'Select a vessel from the list'
      }
    ]);
  });

  it('will check if the save and continue button is present if it has reacher the limit of landings', () => {
    expect(wrapper.find('button#continue').exists()).toBeTruthy();
  });
});

describe('When updating an existing landing', () => {

  let wrapper;

  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  const data = {
    items: [
      {
        product: {
          commodityCode: '03047190',
          id: 'product1',
          presentation: { code: 'FIL', label: 'Filleted' },
          species: { code: 'COD', label: 'Atlantic cod (COD)' },
          state: { code: 'FRO', label: 'Frozen' },
        },
        landings: [
          {
            model: {
              dateLanded: '2019-03-05',
              exportWeight: 100,
              id: 'landing1',
              vessel: {
                domId: 'ANNISABELLA-LO61',
                homePort: 'LOWESTOFT',
                imoNumber: '',
                label: 'ANN ISABELLA (LO61)',
                licenceNumber: '20178',
                pln: 'LO61',
                registrationNumber: '',
                vesselName: 'ANN ISABELLA',
              },
            }
          }
        ],
      },
      {
        product: {
          commodityCode: '03047190',
          id: 'product2',
          presentation: { code: 'FIL', label: 'Filleted' },
          species: { code: 'COD', label: 'Atlantic cod (COD)' },
          state: { code: 'FRE', label: 'Fresh' },
        },
        landings: [
          {
            model: {
              dateLanded: '2019-03-06',
              exportWeight: 200,
              id: 'landing2',
              vessel: {
                domId: 'ANNISABELLA-LO61',
                homePort: 'LOWESTOFT',
                imoNumber: '',
                label: 'ANN ISABELLA (LO61)',
                licenceNumber: '20178',
                pln: 'LO61',
                registrationNumber: '',
                vesselName: 'ANN ISABELLA',
              },
            }
          }
        ],
      },
    ],
  };

  const store = mockStore({
    vessels: [
      { pln: '123', vesselName: 'Titanic' },
      { pln: '1234', vesselName: 'Titanic' },
      { pln: '456', vesselName: 'Black Pearl' },
      { pln: '4565', vesselName: 'Black Zeal' },
      { pln: '789', vesselName: 'Atlantic' },
    ],
    exportPayload: data,
    config: {
      maxLandingsLimit: 100,
      offlineValidationTime: '30',
      landingLimitDaysInTheFuture: 7,
    },
    errors: {
      errors:[]
    }
  });

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
      nextUri:
        '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
      path: '/catch-certificates/:documentNumber/add-landings',
      journey: 'catchCertificate',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      progressUri: '/catch-certificates/:documentNumber/progress'
    }
  };

  beforeEach(() => {
    dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS '});
    validateLanding.mockReturnValue({ type: 'UPSERT_LANDING' });
    clearErrorsExportPayload.mockReturnValue({ type: 'CLEAR_EXPORT_PAYLOAD' });
    const history = createMemoryHistory({ initialEntries: ['/catch-certificates/document1/add-landings'] });

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path='/catch-certificates/:documentNumber/add-landings'>
            <LandingsUpdatedPage {...props} />
          </Route>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('will show an edit button for all landings', () => {
    expect(wrapper.find('#edit_landing1').exists()).toBe(true);
    expect(wrapper.find('#edit_landing2').exists()).toBe(true);
  });

  describe('when the user clicks edit', () => {

    beforeEach(() => {
      wrapper.find('#edit_landing1').at(0).simulate('click');
    });

    it('will set the landingId and productId on the AddLandingsForm', () => {
      expect(wrapper.find('AddLandingsForm').prop('productId')).toBe('product1');
      expect(wrapper.find('AddLandingsForm').prop('landingId')).toBe('landing1');
    });

    it('will override any previous landingId and productId on the AddLandingsForm', () => {
      wrapper.find('#edit_landing2').at(0).simulate('click');

      expect(wrapper.find('AddLandingsForm').prop('productId')).toBe('product2');
      expect(wrapper.find('AddLandingsForm').prop('landingId')).toBe('landing2');
    });

    it('will rename the Add landing button to Update landing', () => {
      expect(wrapper.find('#submit').text()).toBe('Update landing');
    });

  });

  describe('when the user saves the changes', () => {

    beforeEach(() => {
      const changeEvent = {
        currentTarget: {
          name: 'weight',
          value: '200',
          blur: jest.fn()
        },
        preventDefault: jest.fn()
      };

      wrapper.find('#edit_landing1').at(0).simulate('click');
      wrapper.find('WeightInput').prop('onChange')(changeEvent);
      wrapper.find('#submit').simulate('click');
    });

    it('will call the action to update the db', () => {
      expect(validateLanding).toHaveBeenCalledTimes(1);
      expect(validateLanding).toHaveBeenCalledWith(
        'product1',
        {
          dateLanded: '2019-03-05',
            exportWeight: '200',
            id: 'landing1',
            faoArea: 'FAO27',
            vessel: {
              domId: 'ANNISABELLA-LO61',
              homePort: 'LOWESTOFT',
              imoNumber: '',
              label: 'ANN ISABELLA (LO61)',
              licenceNumber: '20178',
              pln: 'LO61',
              registrationNumber: '',
              vesselName: 'ANN ISABELLA',
            },
        },
        'document1'
      );
    });

    it('will update the landing information on the page', () => {
      expect(wrapper.find('ProductsTable').prop('weight')).toBe('300.00');
    });

  });

});

describe('Landings page with Errors in Landings in order same as form', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  const data = {
    items: [
      {
        product: {
          id: 'GBR-2021-CC-466322E1A-8cfd94a9-3fab-4cc4-9c31-4b1d8620cf59',
          commodityCode: '03025110',
          presentation: {
            code: 'WHL',
            label: 'Whole',
          },
          state: {
            code: 'FRE',
            label: 'Fresh',
          },
          species: {
            code: 'COD',
            label: 'Atlantic cod (COD)',
          },
        },
        landings: [
          {
            model: {
              id: 'GBR-2021-CC-466322E1A-1612522025',
              vessel: {
                label: 'AURORA (SD395)',
              },
              faoArea: 'FAO27',
              dateLanded: '2021-02-01',
              exportWeight: 100,
              numberOfSubmissions: 0,
            },
            landingId: 'GBR-2021-CC-466322E1A-1612522025',
            addMode: false,
            editMode: false,
            error: 'invalid',
            errors: {},
          },
        ],
      },
      {
        product: {
          id: 'GBR-2021-CC-466322E1A-1dc4bf96-4e4e-4e97-b5dd-399814e31eb2',
          commodityCode: '03028990',
          presentation: {
            code: 'GUT',
            label: 'Gutted',
          },
          state: {
            code: 'FRE',
            label: 'Fresh',
          },
          species: {
            code: 'NEC',
            label: 'Red codling (NEC)',
          },
        },
      },
    ]
  };

  const store = mockStore({
    vessels: [],
    exportPayload: data,
    config: {
      maxLandingsLimit: 100,
      offlineValidationTime: '30',
      landingLimitDaysInTheFuture: 7,
    },
    errors: {
      errors: [{
        targetName: 'general',
        text: 'message'
      }]
    }
  });

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
      nextUri:
        '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
      path: '/catch-certificates/:documentNumber/add-landings',
      journey: 'catchCertificate',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      progressUri: '/catch-certificates/:documentNumber/progress'
    },
  };

  const expectedOrderedErrors = [
    {
      key: 'general',
      message: 'message',
    },
    {
      key: 'product',
      message: 'Select a product from the list'
    },
    {
      key: 'dateLanded',
      message: 'Date landed can be no more than 7 days in the future'
    },
    {
      key: 'vessel.vesselName',
      message: 'Select a vessel from the list'
    },
    {
      key:'exportWeight',
      message:'Enter the export weight as a number, like 500 or 500.50'
    }
  ];
  window.scrollTo = jest.fn();

  it('should render a error messages for the landing in same order as its form option 1', () => {
    data.items[0].landings[0].errors = {
      exportWeight: 'error.exportWeight.number.base',
      'vessel.vesselName': 'error.vessel.vesselName.any.required',
      dateLanded: 'error.dateLanded.date.max',
      product: 'error.product.any.required',
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('ErrorIsland').prop('errors')).toEqual(expectedOrderedErrors);
  });
  it('should render a error messages for the landing in same order as its form option 2', () => {
    data.items[0].landings[0].errors = {
      'vessel.vesselName': 'error.vessel.vesselName.any.required',
      exportWeight: 'error.exportWeight.number.base',
      product: 'error.product.any.required',
      dateLanded: 'error.dateLanded.date.max',
    };

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('ErrorIsland').prop('errors')).toEqual(expectedOrderedErrors);
  });
});

describe('Landings page with Errors - Please contact support.', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);
  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            id: 'GBR-2021-CC-466322E1A-8cfd94a9-3fab-4cc4-9c31-4b1d8620cf59',
            commodityCode: '03025110',
            presentation: {
              code: 'WHL',
              label: 'Whole',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
          landings: [
            {
              model: {
                id: 'GBR-2021-CC-466322E1A-1612522025',
                vessel: {
                  label: 'European seabass (BSS)',
                },
                faoArea: 'FAO27',
                dateLanded: '2021-02-01',
                exportWeight: 100,
                numberOfSubmissions: 0,
              },
              landingId: 'GBR-2021-CC-466322E1A-1612522025',
              addMode: false,
              editMode: false
            },
          ],
        },
      ],
      errors: {
          vessel_license: 'Please contact support.'
      }
    };
    const store = mockStore({
      vessels: [],
      exportPayload: data,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      }
    });
    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });
  it('should display please contact support error', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find('ErrorIsland li a').text()).toBe('Please contact support.');
    expect(wrapper.find('ErrorIsland').prop('errors')).toEqual([
      {
        key: 'vessel_license',
        message: 'Please contact support.'
      }
    ]);
  });
});

describe('Landings page with Errors of date landed', () => {
  let wrapper;
  const mockStore = configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res([]);
          });
        },
        post: () => {
          return new Promise((res) => {
            res({});
          });
        },
      },
    }),
  ]);

  beforeEach(() => {
    const data = {
      items: [
        {
          product: {
            id: 'GBR-2021-CC-466322E1A-8cfd94a9-3fab-4cc4-9c31-4b1d8620cf59',
            commodityCode: '03025110',
            presentation: {
              code: 'WHL',
              label: 'Whole',
            },
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
          landings: [
            {
              model: {
                id: 'GBR-2021-CC-466322E1A-1612522025',
                vessel: {
                  label: 'European seabass (BSS)',
                },
                faoArea: 'FAO27',
                dateLanded: '2021-02-01',
                exportWeight: 100,
                numberOfSubmissions: 0,
              },
              landingId: 'GBR-2021-CC-466322E1A-1612522025',
              addMode: false,
              editMode: false,
              error: 'invalid',
              errors: {},
            },
          ],
        },
      ]
    };

    const store = mockStore({
      vessels: [],
      exportPayload: data,
      config: {
        maxLandingsLimit: 100,
        offlineValidationTime: '30',
        landingLimitDaysInTheFuture: 7,
      },
      errors: {
        errors: [{
          targetName: 'dateLanded',
          text: 'ccAddLandingDateLandedRestrictedError-European seabass (BSS)'
        },
        {
          targetName: 'dateLanded',
          text: 'ccUploadFilePageTableDateLandedFutureMaximumDaysError-7'
        }]
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        previousUri: '/catch-certificates/:documentNumber/what-are-you-exporting',
        nextUri:
          '/catch-certificates/:documentNumber/whose-waters-were-they-caught-in',
        path: '/catch-certificates/:documentNumber/add-landings',
        journey: 'catchCertificate',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <LandingsUpdatedPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should show error restrictions on your specified landing date and Date landed can be no more than 7 days', () => {
    expect(wrapper.find('ErrorIsland').prop('errors')).toEqual([
      {
        key: 'dateLanded',
        message: 'European seabass (BSS) was subject to fishing restrictions on your specified Landing date. Please refer to GOV.UK for further guidance.'
      },
      {
        key: 'dateLanded',
        message: 'Date landed can be no more than 7 days in the future'
      }
    ]);
  });
});