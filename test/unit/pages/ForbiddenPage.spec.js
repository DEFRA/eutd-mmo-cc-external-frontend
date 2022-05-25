import React from 'react';
import { mount } from 'enzyme/build';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as ForbiddenPage from '../../../src/client/pages/ForbiddenPage';
import { render } from '@testing-library/react';

const mockStore = configureStore([thunk]);

const props = {};

describe('Forbidden Error Page - unauthorised 403', () => {
  let wrapper;

  const store = mockStore({
    reference: {},
    exporter: {},
    exportPayload: {},
    transport: {},
    processingStatement: {},
    storageNotes: {},
    directLandings: {},
    conservation: {}
  });

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
            <ForbiddenPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should display the correct heading on the forbidden page when not Silverline WAF error', () => {
    expect(wrapper.find('ForbiddenPage').find('h1').text()).toContain('Forbidden');
  });

  it('should display the correct message on the forbidden page', () => {
    wrapper.find('ForbiddenPage');
    expect(wrapper.find('ForbiddenPage').find('p').length).toBe(2);
    expect(wrapper.find('ForbiddenPage').find('p').at(0).text()).toContain('You do not have permission to carry out this action.');
    expect(wrapper.find('ForbiddenPage').find('p').at(1).text()).toContain('Navigate back in your browser to return.');
  });

  it('should check the p tags having data-testids', () => {
    expect(wrapper.find('ForbiddenPage').find('p').at(0).props()['data-testid']).toBe('no-permission');
    expect(wrapper.find('ForbiddenPage').find('p').at(1).props()['data-testid']).toBe('navigate-back');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

});

describe('Forbidden Error Page - Silverline WAF violation', () => {
  let wrapper;

  const store = mockStore({
    reference: { supportID: 123456789 }
  });

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
            <ForbiddenPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should display the correct heading on the forbidden page when not Silverline WAF error', () => {
    expect(wrapper.find('ForbiddenPage').find('h1').text()).toContain('Sorry, the requested URL was rejected');
  });

  it('should display the correct message and with the correct transaction ID', () => {
    wrapper.find('ForbiddenPage');
    expect(wrapper.find('ForbiddenPage').find('p').length).toBe(5);
    expect(wrapper.find('ForbiddenPage').find('p').at(0).text()).toContain('Please try again later');
    expect(wrapper.find('ForbiddenPage').find('p').at(1).text()).toContain('Transaction Support ID: 123456789');
    expect(wrapper.find('ForbiddenPage').find('p').at(2).text()).toContain('If you need further support, contact the Fish Exports Service helpline:');
    expect(wrapper.find('ForbiddenPage').find('p').at(3).text()).toContain('Telephone: 0330 159 1989');
    expect(wrapper.find('ForbiddenPage').find('p').at(4).text()).toContain('Monday to Friday 7:00 to 20:00 (except public holidays)');
  });

  it('p tags should have data-testids', () => {
    expect(wrapper.find('ForbiddenPage').find('p').at(0).props()['data-testid']).toBe('try-again');
    expect(wrapper.find('ForbiddenPage').find('p').at(1).props()['data-testid']).toBe('support-id');
    expect(wrapper.find('ForbiddenPage').find('p').at(2).props()['data-testid']).toBe('contact-fes');
    expect(wrapper.find('ForbiddenPage').find('p').at(3).props()['data-testid']).toBe('tel-number');
    expect(wrapper.find('ForbiddenPage').find('p').at(4).props()['data-testid']).toBe('opening-hours');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});
