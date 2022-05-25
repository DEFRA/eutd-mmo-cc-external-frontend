import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { UploadGuidanceWelsh } from '../../../src/client/pages/uploadGuidance/UploadGuidanceWelsh';

describe('Upload Guidance Welsh', () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({});

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <UploadGuidanceWelsh history={{
          goBack: jest.fn()
        }} />
      </MemoryRouter>
    </Provider>
  );

  it('should render the component', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render PageTitle with the correct text in Welsh', () => {
    expect(
      wrapper.find('PageTitle[title=\'Canllawiau Llwytho i Fyny - GOV.UK\']').exists()
    ).toBeTruthy();
  });

  it('should render a upload guidance link', () => {
    expect(wrapper.find('Link[to=\'/manage-favourites\']').exists()).toBeTruthy();
    expect(wrapper.find('Link[to=\'/manage-favourites\']').text()).toBe('(opens in same tab)hoff gynnyrch');
  });

  it('should render page with the correct heading in Welsh', () => {
    expect(wrapper.find('h1').first().text()).toBe('Canllawiau llwytho i fyny');
  });

  it('should render the back link', () => {
    expect(wrapper.find('BackLink').exists()).toBeTruthy();
  });
});
