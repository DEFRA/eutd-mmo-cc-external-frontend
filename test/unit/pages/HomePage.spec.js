import React from 'react';
import { mount } from 'enzyme';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import * as HomePage from '../../../src/client/pages/HomePage';
import { render } from '@testing-library/react';
jest.mock('../../../src/client/actions/userAttributes.actions');

describe('Home Page', () => {
  let wrapper;

  const mockStore = configureStore([thunk]);

  beforeAll(() => {
    const store = mockStore({});
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage.default.component />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should create snapshot for whole page',() => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  })

  it('should render radio button', () => {
    expect(wrapper.find({ type: 'radio' })).toBeDefined();
  });

  it('should handle an submit event', () => {
    wrapper.setState({
      selected: '/create-catch-certificate/catch-certificates',
    });
    wrapper.find('form').simulate('submit', { preventDefault() {} });
  });

  it('should handle radio button click event', () => {
    wrapper.find('input#createCatchCertificate').simulate('click');
    wrapper.find('input#createProcessingStatement').simulate('click');
    wrapper.find('input#createStorageDocument').simulate('click');
  });

  it('should handle continue button click event', () => {
    wrapper.setState({
      selected: '/create-catch-certificate/catch-certificates',
    });
    wrapper.find('button#continue').simulate('click');
  });

  it('should handle a submit event', () => {
    wrapper.setState({
      selected: '/create-catch-certificate/catch-certificates',
    });
    wrapper
      .find('button#continue')
      .simulate('click', { preventDefault() {} });
  });

  it('should have a for attribute on all input labels', () => {
    expect(
      wrapper.find('label#label-createCatchCertificate').props()['htmlFor']
    ).toBeDefined();
    expect(
      wrapper.find('label#label-createCatchCertificate').props()['htmlFor']
    ).toBe('createCatchCertificate');
    expect(
      wrapper.find('label#label-createProcessingStatement').props()['htmlFor']
    ).toBeDefined();
    expect(
      wrapper.find('label#label-createProcessingStatement').props()['htmlFor']
    ).toBe('createProcessingStatement');
    expect(
      wrapper.find('label#label-createStorageDocument').props()['htmlFor']
    ).toBeDefined();
    expect(
      wrapper.find('label#label-createStorageDocument').props()['htmlFor']
    ).toBe('createStorageDocument');
  });
});
