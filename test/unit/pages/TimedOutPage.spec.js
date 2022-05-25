import TimedOutPage from '../../../src/client/pages/common/TimedOutPage';
import {  mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

describe('Timed out page', () => {
  it('should load', () => {
    const mockStore = configureStore();
    const store = mockStore({ 
      config: {
        loginUrl: 'foo' 
      }
    });
    const component = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TimedOutPage.component />
        </MemoryRouter>
      </Provider>
    );

    expect(component).toBeDefined();
  });
});
