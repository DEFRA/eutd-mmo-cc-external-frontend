import React from 'react';
import { mount } from 'enzyme';
import { component as CookiePolicyPage } from '../../../src/client/pages/common/CookiePolicyPage';
import CookiePolicyWholePage from '../../../src/client/pages/common/CookiePolicyPage';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import thunk from 'redux-thunk';
import { getAllUserAttributes } from '../../../src/client/actions/userAttributes.actions';
jest.mock('../../../src/client/actions/userAttributes.actions');

let wrapper;
const mockStore = configureStore([thunk]);
const goBack = jest.fn();

const getWrapper = (language) => {
  const store = mockStore({
    userAttributes: [
      {
        name: 'language',
        value: language,
        modifiedAt: '2022-03-15T21:47:10.755Z',
      },
    ],
  });
  const props = {
    window: {
      history: {
        goBack: goBack(),
      },
    },
  };
  wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <CookiePolicyPage {...props} />
      </MemoryRouter>
    </Provider>
  );

  return wrapper;
};

describe('Cookie Policy page in English or welsh', () => {
  it('should load successfully in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');
    expect(englishWrapper).toBeDefined();
    expect(welshWrapper).toBeDefined();
  });

  it('should render save cookies settings button in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');
    expect(englishWrapper.find('#saveCookieSettings')).toBeDefined();
    expect(englishWrapper.find('#saveCookieSettings').text()).toEqual(
      'Save cookie settings'
    );
    expect(welshWrapper.find('#saveCookieSettings')).toBeDefined();
    expect(welshWrapper.find('#saveCookieSettings').text()).toEqual(
      'Cadw’r gosodiadau cwcis'
    );
  });

  it('should render radio button in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');
    expect(englishWrapper.find({ type: 'radio' })).toBeDefined();
    expect(welshWrapper.find({ type: 'radio' })).toBeDefined();
  });

  it('pushes back a page when save cookies settings button in English or welsh is clicked', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');
    englishWrapper.find('#saveCookieSettings').simulate('click');
    welshWrapper.find('#saveCookieSettings').simulate('click');
    expect(goBack).toHaveBeenCalled();
  });

  it('should handle onChange event on Yes option in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');
    englishWrapper.setState({
      selected: 'Yes',
    });
    welshWrapper.setState({
      selected: 'Yes',
    });
    expect(
      englishWrapper
        .find('input#cookieAnalyticsAccept')
        .simulate('change', { preventDefault() {} })
    ).toBeTruthy();
    expect(
      welshWrapper
        .find('input#cookieAnalyticsAccept')
        .simulate('change', { preventDefault() {} })
    ).toBeTruthy();
  });

  it('should handle onChange event on No option in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');

    englishWrapper.setState({
      selected: 'No',
    });
    expect(
      englishWrapper
        .find('input#cookieAnalyticsReject')
        .simulate('change', { preventDefault() {} })
    ).toBeTruthy();

    welshWrapper.setState({
      selected: 'No',
    });
    expect(
      welshWrapper
        .find('input#cookieAnalyticsReject')
        .simulate('change', { preventDefault() {} })
    ).toBeTruthy();
  });

  it('should handle onClick event on the Save cookie settings in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');
    expect(
      englishWrapper
        .find('#saveCookieSettings')
        .simulate('click', { preventDefault() {} })
    ).toBeTruthy();
    expect(
      welshWrapper
        .find('#saveCookieSettings')
        .simulate('click', { preventDefault() {} })
    ).toBeTruthy();
  });

  it('should handle onClick event on the Go back to the page you were looking at link in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');

    englishWrapper.find('#saveCookieSettings').simulate('click', {});
    englishWrapper.find('a.notification-banner__link').simulate('click', {});

    expect(goBack).toHaveBeenCalled();

    welshWrapper.find('#saveCookieSettings').simulate('click', {});
    welshWrapper.find('a.notification-banner__link').simulate('click', {});

    expect(goBack).toHaveBeenCalled();
  });

  it('should display notification banner with setting cookie preferences in English or welsh', () => {
    const englishWrapper = getWrapper('en_UK');
    const welshWrapper = getWrapper('cy_UK');

    englishWrapper.find('#saveCookieSettings').simulate('click', {});

    expect(englishWrapper.find('h2.notification-banner__title').text()).toEqual(
      'Success'
    );
    expect(
      englishWrapper.find('p.notification-banner__heading').text()
    ).toEqual(
      'You’ve set your cookie preferences.Go back to the page you were looking at.'
    );
    expect(englishWrapper.find('a.notification-banner__link')).toBeTruthy();

    welshWrapper.find('#saveCookieSettings').simulate('click', {});

    expect(welshWrapper.find('h2.notification-banner__title').text()).toEqual(
      'Llwyddiant'
    );
    expect(welshWrapper.find('p.notification-banner__heading').text()).toEqual(
      'Rydych chi wedi gosod eich dewisiadau cwcis.Mynd yn ôl i’r dudalen roeddech chi’n edrych arni.'
    );
    expect(welshWrapper.find('a.notification-banner__link')).toBeTruthy();
  });

  it('should take the snapshot of the page in English', () => {
    const wrapper = getWrapper('en_UK');
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('CookiePolicyPage, loadData', () => {
  const store = { dispatch: jest.fn() };

  beforeEach(() => {
    getAllUserAttributes.mockReset();
    getAllUserAttributes.mockReturnValue({ type: 'GET_ALL_USER_ATTRIBUTES' });
  });

  it('should call the getAllUserAttributes to load the component', () => {
    CookiePolicyWholePage.loadData(store);

    expect(getAllUserAttributes).toHaveBeenCalledTimes(1);
    expect(getAllUserAttributes).toHaveBeenCalled();
  });
});