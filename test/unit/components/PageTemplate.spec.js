import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../../../src/client/actions');

import PageTemplateWrapper from '../../../src/client/components/PageTemplateWrapper';

const getWrapper = (routeObject = null) => {
  const wrappedComponent = () => <div className='internal'>Foo</div>;
  const Component = PageTemplateWrapper(wrappedComponent);
  return mount(
    <Provider store={configureStore()({})}>
      <Component route={routeObject} history={[]}/>
    </Provider>
  );
};

describe('PageTemplate HOC', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render PageTemplate correctly', async () => {
    const wrapper = await getWrapper({});
    expect(wrapper).toBeDefined();
    expect(wrapper.find('div.internal')).toBeDefined();
  });

});
