import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as SignOutPage from '../../../src/client/pages/common/SignOutPage';

describe('SignOutPage', () => {

  let wrapper;
  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise(res => {
          res({
            data: []
          });
        });
      }
    }
  })]);

  beforeEach(() => {
    const store = mockStore({
      config: {
        loginUrl: 'foo',
        warningTimeout: 60000
      }
    });

    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
        nextUri: '/create-catch-certificates/catch-certificates',
        journey: 'catchCertificate'
      }
    };

    window.scrollTo = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SignOutPage.default.component {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle a submit event', () => {
    wrapper.setState({ warningTime: 22000 });
    wrapper.find('form').simulate(
      'submit',
      { preventDefault() { } }
    );
  });

  it('should find the correct text on te page', () => {
    expect(wrapper.find('h1').text()).toEqual('Your application will time out soon');
    expect(wrapper.find('p').text()).toEqual('We will reset your application if you do not respond in 60 seconds. We do keep your information secure.');
  });
});