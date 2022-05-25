import { mount } from 'enzyme';
import * as React from 'react';
import { component as WhoseWatersWereTheyCaughtInPage} from '../../../src/client/pages/exportCertificates/WhoseWatersWereTheyCaughtInPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { getLandingType } from '../../../src/client/actions/landingsType.actions';
import {  getConservation, getExportPayload, clearConservation, addConservation } from '../../../src/client/actions';
import { render } from '@testing-library/react';
jest.mock('../../../src/client/actions/landingsType.actions');
jest.mock('../../../src/client/actions');

describe('Whose Waters Were They Caught in Page', () => {
  let wrapper;
  let props;

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
        },
      },
    }),
  ]);

  props = {
    history: [],
    route: {
      title: 'Create a UK catch certificate for exports',
      previousUri: ':documentNumber/add-landings',
      nextUri: ':documentNumber/how-does-the-export-leave-the-uk',
      path: ':documentNumber/what-export-journey',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      directLandingUri: ':documentNumber/direct-landing',
      journey: 'catchCertificate',
      progressUri: '/catch-certificates/:documentNumber/progress'
    },
    conservation: {
      caughtInOtherWaters: 'Y',
    },
    match: { params: { documentNumber: 'GBR-2021-CC-D6FBF748C' } }
  };

  beforeEach(() => {
    getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });
    getConservation.mockReturnValue({ type: 'GET_CONSERVATION' });
    getExportPayload.mockReturnValue({ type: 'GET_EXPORT_PAYLOAD' });
    clearConservation.mockReturnValue({ type: 'CLEAR_CONSERVATION' });
    addConservation.mockReturnValue({ type: 'ADD_CONSERVATION' });
    const store = mockStore({
      errors: {},
      conservation: {},
      landingsType: { landingsEntryOption: 'directLanding' },
      exportPayload: {
        items: [
          {
            product: {
              commodityCode: '03036310',
              presentation: {
                code: 'FIL',
                label: 'Filleted',
              },
              state: {
                code: 'FRO',
                label: 'Frozen',
              },
              species: {
                code: 'COD',
                label: 'Atlantic cod (COD)',
              },
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
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '22',
                },
              },
            ],
          },
        ],
      },
    });
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <WhoseWatersWereTheyCaughtInPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });



  it('should render caught in uk waters check box', () => {
    expect(
      wrapper.find('input[name="caughtInUKWaters"]').exists()
    ).toBeTruthy();
  });

  it('should render caught in eu waters check box', () => {
    expect(
      wrapper.find('input[name="caughtInEUWaters"]').exists()
    ).toBeTruthy();
  });

  it('should render caught in other waters check box', () => {
    expect(
      wrapper.find('input[name="caughtInOtherWaters"]').exists()
    ).toBeTruthy();
  });

  it('should handle submit event', () => {
    wrapper.find('form').simulate('submit', { preventDefault() {} });
  });

  it('should handle on change events setting check box value', () => {
    wrapper
      .find('input[name="caughtInUKWaters"]')
      .simulate('change', { target: { name: 'caughtInUKWaters', value: 'Y' } });
  });

  it('should handle save as draft event', () => {
    wrapper.find('button#saveAsDraft').simulate('click');
  });

  it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="watersCaughtIn"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="caughtInEUWaters"]').exists()).toBeTruthy();
    expect(
      wrapper.find('input[id="caughtInOtherWaters"]').exists()
    ).toBeTruthy();
    expect(wrapper.find('input[id="otherWaters"]').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(
      wrapper.find('label#label-otherWaters').props()['htmlFor']
    ).toBeDefined();
    expect(wrapper.find('label#label-otherWaters').props()['htmlFor']).toBe(
      'otherWaters'
    );
    expect(
      wrapper.find('label#label-watersCaughtIn').props()['htmlFor']
    ).toBeDefined();
    expect(wrapper.find('label#label-watersCaughtIn').props()['htmlFor']).toBe(
      'watersCaughtIn'
    );
    expect(
      wrapper.find('label#label-caughtInEUWaters').props()['htmlFor']
    ).toBeDefined();
    expect(
      wrapper.find('label#label-caughtInEUWaters').props()['htmlFor']
    ).toBe('caughtInEUWaters');
    expect(
      wrapper.find('label#label-caughtInOtherWaters').props()['htmlFor']
    ).toBeDefined();
    expect(
      wrapper.find('label#label-caughtInOtherWaters').props()['htmlFor']
    ).toBe('caughtInOtherWaters');
  });

  it('should have a back to progress page link', () => {
    expect(wrapper.find('a[href="/catch-certificates/GBR-2021-CC-D6FBF748C/progress"]').exists()).toBeTruthy();
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
     expect(container).toMatchSnapshot();
    });

});


describe('should call history to forbid access', () => {
  it('should not allow access to page when conservation is unauthorised', async () => {
    const mockPush = jest.fn();
    const mockUnauthorised = jest.fn();

    const previousProps = {
      conservation: {
        unauthorised: false,
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
        nextUri: '',
        path: '',
        previousUri: '',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        title: 'Create a UK catch certificate - GOV.UK',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      conservation: {
        unauthorised: true,
      },
      history: {
        push: mockPush,
      },
      unauthorised: mockUnauthorised,
    };

    await new WhoseWatersWereTheyCaughtInPage.WrappedComponent(
      props
    ).componentDidUpdate(previousProps, props);
    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });

  it('should allow access to page when authorised', async () => {
    const mockPush = jest.fn();
    const mockUnauthorised = jest.fn();

    const previousProps = {
      conservation: {
        unauthorised: false,
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
        nextUri: '',
        path: '',
        previousUri: '',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        title: 'Create a UK catch certificate - GOV.UK',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      conservation: {
        unauthorised: false,
      },
      history: {
        push: mockPush,
      },
      unauthorised: mockUnauthorised,
    };

    await new WhoseWatersWereTheyCaughtInPage.WrappedComponent(
      props
    ).componentDidUpdate(previousProps, props);
    expect(mockPush).not.toHaveBeenCalledWith('/forbidden');
  });
});

describe('Re-direct user to landing entry page when landing entry is null', () => {
  const mockPush = jest.fn();
  const mockGetLandingType = jest.fn();
  const mockGetConservation = jest.fn();
  const mockGetExportPayload = jest.fn();

  afterEach(() => {
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
      conservation: {},
      history: {
        push: mockPush,
      },
      getAddedLandingsType: {
        landingsEntryOption: null,
        generatedByContent: false,
      },
      getLandingType: mockGetLandingType,
      getConservation: mockGetConservation,
      getExportPayload: mockGetExportPayload,
      exportPayload: {
        items: [
          {
            landings: [],
          },
        ],
      },
    };

    await new WhoseWatersWereTheyCaughtInPage.WrappedComponent(props).componentDidMount();

    expect(mockGetLandingType).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetConservation).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetExportPayload).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockPush).toHaveBeenCalledWith('GBR-23423-4234234/landings-entry');
  });

  it('should not re-direct to landing entry page when landingsEntryOption is manualEntry and generatedByContent is false', async () => {
    const mockPush = jest.fn();
    const mockGetLandingType = jest.fn();
    const mockGetConservation = jest.fn();
    const mockGetExportPayload = jest.fn();

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
      conservation: {},
      history: {
        push: mockPush,
      },
      getAddedLandingsType: {
        landingsEntryOption: 'manualEntry',
        generatedByContent: false,
      },
      getLandingType: mockGetLandingType,
      getConservation: mockGetConservation,
      getExportPayload: mockGetExportPayload,
      exportPayload: {
        items: [
          {
            product: {
              commodityCode: '03036310',
              presentation: {
                code: 'FIL',
                label: 'Filleted',
              },
              state: {
                code: 'FRO',
                label: 'Frozen',
              },
              species: {
                code: 'COD',
                label: 'Atlantic cod (COD)',
              },
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
                  },
                  dateLanded: '2019-01-22',
                  exportWeight: '22',
                },
              },
            ],
          },
        ],
      },
    };

    await new WhoseWatersWereTheyCaughtInPage.WrappedComponent(props).componentDidMount();

    expect(mockGetLandingType).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetConservation).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockGetExportPayload).toHaveBeenCalledWith('GBR-23423-4234234');
    expect(mockPush).not.toHaveBeenCalledWith('GBR-23423-4234234/landings-entry');
  });
});

describe('Disable backLink when there is no product details for items returned', () => {
    let wrapper;
    let props;

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
          },
        },
      }),
    ]);

    props = {
      history: [],
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: ':documentNumber/add-landings',
        nextUri: ':documentNumber/how-does-the-export-leave-the-uk',
        path: ':documentNumber/what-export-journey',
        saveAsDraftUri: '/create-catch-certificate/catch-certificates',
        directLandingUri: ':documentNumber/direct-landing',
        journey: 'catchCertificate',
        progressUri: '/catch-certificates/:documentNumber/progress'
      },
      conservation: {
        caughtInOtherWaters: 'Y',
      },
      match: { params: { documentNumber: 'GBR-2021-CC-D6FBF748C' } }
    };

    beforeEach(() => {
      getLandingType.mockReturnValue({ type: 'GET_LANDING_TYPE' });
      getConservation.mockReturnValue({ type: 'GET_CONSERVATION' });
      getExportPayload.mockReturnValue({ type: 'GET_EXPORT_PAYLOAD' });
      clearConservation.mockReturnValue({ type: 'CLEAR_CONSERVATION' });
      addConservation.mockReturnValue({ type: 'ADD_CONSERVATION' });
    });

  it('should not render backLink when there are no product details  exists', () => {

    const store = mockStore({
      errors: {},
      conservation: {},
      landingsType: { landingsEntryOption: 'directLanding' },
      exportPayload: {
        items: [],
      },
    });
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <WhoseWatersWereTheyCaughtInPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('BackLink').exists()).toBeFalsy();
  });

  it('should render backLink when there is a product details exsists', () => {

    const store = mockStore({
      errors: {},
      conservation: {},
      landingsType: { landingsEntryOption: 'directLanding' },
      exportPayload: {
        items: [{
          product: {
            commodityCode: '03036310',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            state: {
              code: 'FRO',
              label: 'Frozen',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
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
                },
                dateLanded: '2019-01-22',
                exportWeight: '22',
              },
            },
          ],
        }],
      },
    });
    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <WhoseWatersWereTheyCaughtInPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('BackLink').exists()).toBeTruthy();
    expect(wrapper.find('BackLink').props().href).toContain('GBR-2021-CC-D6FBF748C/direct-landing');
  });
});