import { mount } from 'enzyme';
import * as React from 'react';
import { component as ProductDestinationPage } from '../../../src/client/pages/common/ProductDestinationPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { ADD_SELECTED_EXPORT_COUNTRY } from '../../../src/client/actions/index';
import i18n from '../../../src/i18n';
import { render } from '@testing-library/react';

global.scrollTo = jest.fn();

describe('Product Destination Page', () => {
  let wrapper;

  const props = {
    history: [],
    route: {
      title: 'Page title',
      header: 'Page header',
      previousUri: ':documentNumber/previous-url',
      nextUri: ':documentNumber/next-url',
      path: ':documentNumber/what-export-destination',
      saveAsDraftUri: '/save-as-draft-url',
      journey: 'journey',
      progressUri: 'document123/progress'
    },
    match: {
      params: {
        documentNumber: 'document123',
      },
    },
  };

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

  let store = mockStore({
    errors: {},
    exportLocation: {
      exportedTo: 'New Zealand',
      loaded : true
    },
    global: {
      allCountries: ['UK', 'Brazil'],
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
  });

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/what-export-destination']}>
          <ProductDestinationPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('will render the correct title', () => {
    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Page header - Page title'
    );
  });

  it('will render the correct header', () => {
    expect(wrapper.find('h1').text()).toBe(props.route.header);
  });

  it('will render the ExportDestination component', () => {
    expect(wrapper.find('ExportDestination').exists()).toBe(true);
  });

  it('should pass the exportedTo field to the ExportDestination component', () => {
    expect(wrapper.find('ExportDestination').prop('exportDestination')).toBe(
      'New Zealand'
    );
  });

  it('will handle onChange for the ExportDestination component', () => {
    const onChange = wrapper.find('ExportDestination').prop('onChange');

    onChange('Brazil');

    expect(store.getActions()).toContainEqual({
      type: ADD_SELECTED_EXPORT_COUNTRY,
      payload: {
        exportedTo: {
          isoCodeAlpha2: 'Alpha2',
          isoCodeAlpha3: 'Alpha3',
          isoNumericCode: 'IsoNumericCode',
          officialCountryName: 'Brazil',
        },
        loaded: true
      },
    });
  });

  it('will handle onSubmit', () => {
    wrapper.find('button#continue').simulate('submit', { preventDefault() {} });
  });

  it('will not render an error island by default', () => {
    expect(wrapper.find('ErrorIsland').exists()).toBe(false);
  });

  it('renders Back to Your Progress link with the correct href property', () => {
    expect(wrapper.find('BackToProgressLink').find('a')).toBeTruthy();
    expect(wrapper.find('BackToProgressLink').find('a').props().href).toBe('/document123/progress');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  describe('if there are errors', () => {
    let wrapperWithErrors;

    const storeWithErrors = mockStore({
      errors: {
        exportDestinationError: i18n.t('commonProductDestinationErrorInvalidCountry'),
        errors: [{targetName:'exportDestination', text:'commonProductDestinationErrorInvalidCountry'}],
      },
      exportLocation: {
        exportedTo: 'New Zealand',
        loaded : true
      },
      global: {
        allCountries: ['UK', 'Brazil'],
      },
    });

    beforeAll(() => {
      wrapperWithErrors = mount(
        <Provider store={storeWithErrors}>
          <MemoryRouter>
            <ProductDestinationPage {...props} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('will render an error island', () => {
      expect(wrapperWithErrors.exists('ErrorIsland')).toBe(true);
    });

    it('will populate the error property on the ExportDestination component', () => {
      expect(wrapperWithErrors.find('ExportDestination').prop('error')).toBe(
        'Select a valid destination country'
      );
    });
  });
});
