import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as AccessibilityStatementPage from '../../../src/client/pages/common/AccessibilityStatementPage';
import AccessibilityStatementPageWrapper from '../../../src/client/pages/common/AccessibilityStatementPage';
import { getAllUserAttributes } from '../../../src/client/actions/userAttributes.actions';

jest.mock('../../../src/client/actions/userAttributes.actions');

describe('Accessibility Statement Page', () => {

  const mockStore = configureStore([thunk]);

  const getWrapper = (selectedLanguage) => {
    const store = mockStore({
      userAttributes: [{ name: 'language', value: selectedLanguage }],
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccessibilityStatementPage.default.component />
        </MemoryRouter>
      </Provider>
    );

    return wrapper;
  };

  it('should render the page in English if no language has been selected', () => {
    const store = mockStore({
      userAttributes: [],
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccessibilityStatementPage.default.component />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
    expect(wrapper.find('PageTitle[title=\'Accessibility - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should render the page in English', () => {
    const wrapper = getWrapper('en_UK');
    expect(wrapper).toBeDefined();
  });

  it('should render the page in Welsh', () => {
    const wrapper = getWrapper('cy_UK');
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in English', () => {
    const wrapper = getWrapper('en_UK');

    expect(wrapper.find('PageTitle[title=\'Accessibility - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should render PageTitle with the correct text in Welsh', () => {
    const wrapper = getWrapper('cy_UK');

    expect(wrapper.find('PageTitle[title=\'Hygyrchedd - GOV.UK\']').exists()).toBeTruthy();
  });

  it('should take a snapshot of the whole page', () => {
    const wrapper = getWrapper();
    const { container } = render(wrapper);

    expect(container).toMatchSnapshot();
  });

  it('should call getAllUserAttributes action to load the component', () => {
    const store = { dispatch: jest.fn() };

    getAllUserAttributes.mockReturnValue({ type: 'GET_ALL_USER_ATTRIBUTES' });

    AccessibilityStatementPageWrapper.loadData(store);

    expect(getAllUserAttributes).toHaveBeenCalled();
    expect(getAllUserAttributes).toHaveBeenCalledTimes(1);
  });
});