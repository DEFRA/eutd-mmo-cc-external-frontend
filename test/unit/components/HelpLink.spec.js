import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import HelpLink from '../../../src/client/components/HelpLink';

const getWrapper = (props = {}) => mount(
  <Provider store={configureStore()({
    config: {
      catchCertHelpUrl: '/cc-url',
      storageDocHelpUrl: '/sd-url',
      processingStatementHelpUrl: '/ps-url'
    }
  })}>
      <HelpLink {...props}/>
  </Provider>
);

describe('HelpLink', () => {

  it('Should load fine', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
  });

  it('should have correct external link for help exporting fish from UK', () => {
    const props = {
      journey: 'catchCertificate',
      tag: '/help-tag',
    };

    const wrapper = getWrapper(props);
    const helpLink = wrapper.find('a[href="/cc-url/help-tag"]');
    expect(helpLink.prop('rel')).toBe('noopener noreferrer');
    expect(helpLink.prop('target')).toBe('_blank');
    expect(wrapper.find('a[href="/cc-url/help-tag"] span').prop('className')).toBe('govuk-visually-hidden');
  });

});