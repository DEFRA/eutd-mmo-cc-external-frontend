import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { UploadGuidanceEnglish } from '../../../src/client/pages/uploadGuidance/UploadGuidanceEnglish';

describe('Upload Guidance English', () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({});

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <UploadGuidanceEnglish history={{
          goBack: jest.fn()
        }} />
      </MemoryRouter>
    </Provider>
  );

  it('should render the component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in English', () => {
    expect(
      wrapper.find('PageTitle[title=\'Upload Guidance - GOV.UK\']').exists()
    ).toBeTruthy();
  });

  it('should render a upload guidance link', () => {
      expect(wrapper.find('Link[to=\'/manage-favourites\']').exists()).toBeTruthy();
      expect(wrapper.find('Link[to=\'/manage-favourites\']').text()).toBe('(opens in same tab)product favourites');
  });

  it('should render page with the correct heading in English', () => {
    expect(wrapper.find('h1').first().text()).toBe('Upload guidance');
  });

  it('should render the back link', () => {
    expect(wrapper.find('BackLink').exists()).toBeTruthy();
  });
});
