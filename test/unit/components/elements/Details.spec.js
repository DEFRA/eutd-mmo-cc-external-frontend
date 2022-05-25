import {  mount } from 'enzyme';
import * as React from 'react';
import Details from '../../../../src/client/components/elements/Details';

describe('Details', () => {

  let wrapper;

  beforeEach(() => {  
    const props = {
      summary : 'This is a summary',
      details : 'This is the details'
    };

    wrapper = mount(<Details {...props} />);
  });


  it('should render summary', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle click summary event', () => {
    wrapper.find('summary').simulate('click');
    expect(wrapper.state('isOpen')).toEqual(true);
  });
});