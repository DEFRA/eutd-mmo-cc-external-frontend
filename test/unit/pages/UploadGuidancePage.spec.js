import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import thunk from 'redux-thunk';
import * as UploadGuidancePage from '../../../src/client/pages/uploadGuidance/UploadGuidancePage';
import UploadGuidancePageWrapper from '../../../src/client/pages/uploadGuidance/UploadGuidancePage';
import { getAllUserAttributes } from '../../../src/client/actions/userAttributes.actions';

jest.mock('../../../src/client/actions/userAttributes.actions');

describe('UploadGuidancePage', () => {
  let wrapper;
  const mockStore = configureStore([thunk]);

  const getWrapper = (selectedLanguage) => {
    const store = mockStore({
      userAttributes: [{ name: 'language', value: selectedLanguage }],
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadGuidancePage.default.component />
        </MemoryRouter>
      </Provider>
    );

    wrapper = container;

    return wrapper;
  };

  it('should render an UploadGuidancePage component', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
  });

  it('should render the page in English', () => {
    const wrapper = getWrapper('en_UK');
    expect(wrapper).toBeDefined();
  });

  it('should render the page in Welsh', () => {
    const wrapper = getWrapper('cy_UK');
    expect(wrapper).toBeDefined();
  });

  it('should render the page in English if no language has been selected', () => {
    const store = mockStore({
      userAttributes: [],
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <UploadGuidancePage.default.component />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
    expect(
      wrapper.find('PageTitle[title=\'Upload Guidance - GOV.UK\']').exists()
    ).toBeTruthy();
  });

  it('should take a snapshot of the whole page', () => {
    const wrapper = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call getAllUserAttributes action to load the component', () => {
    const store = { dispatch: jest.fn() };

    getAllUserAttributes.mockReturnValue({ type: 'GET_ALL_USER_ATTRIBUTES' });

    UploadGuidancePageWrapper.loadData(store);

    expect(getAllUserAttributes).toHaveBeenCalled();
    expect(getAllUserAttributes).toHaveBeenCalledTimes(1);
  });
});
