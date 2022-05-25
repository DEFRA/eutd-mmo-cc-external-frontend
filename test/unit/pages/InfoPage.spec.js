import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {component as InfoPage} from '../../../src/client/pages/InfoPage';

describe('/version-info', () => {
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const store = mockStore({
    config: {
      versionInfo: {gitHash: '1234'}
    },
    global: {
      orchestrationVersionInfo: {gitHash: 'ABCD'}
    }
  });

  it('shows what versions are deployed', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <InfoPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#mmo-ecc-fe').text()).toContain('1234');
    expect(wrapper.find('#mmo-ecc-orchestration').text()).toContain('ABCD');

  });
});

describe('/version-info with globals', () => {
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const store = mockStore({
    config: {
      versionInfo: {gitHash: '1234'}
    },
    global: {}
  });

  it('shows what versions are deployed', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <InfoPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('#mmo-ecc-fe').text()).toContain('1234');
    expect(wrapper.find('#mmo-ecc-orchestration').text()).toBe('Version: ');

  });
});
