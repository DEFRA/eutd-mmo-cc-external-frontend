import React from 'react';
import { shallow } from 'enzyme';
import PageTitle from '../../../src/client/components/PageTitle';

describe('PageTitle', () => {
  
  it('Should render a Helmet component with the title prop', () => {
    const wrapper = shallow(<PageTitle title='foo'/>).find('HelmetWrapper');
    expect(wrapper).toBeDefined();
    expect(wrapper.props().title).toBe('foo');
  });
  
});