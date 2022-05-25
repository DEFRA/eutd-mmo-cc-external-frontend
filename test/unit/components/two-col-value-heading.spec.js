import React from 'react';
import { shallow } from 'enzyme';
import TwoColValueHeading from '../../../src/client/components/two-col-value-heading.component';

describe('TwoColValueHeading', () => {
  
  it('Should render 2 headings wrapped in a div', () => {
    const wrapper =  shallow(<TwoColValueHeading label='foo' value='bar' units='cm' className='test'/>);
    expect(wrapper.matchesElement(
      <div>
        <h2 className={'test column-two-thirds'}>foo</h2>
        <h2 className={'test column-one-third text-right'}>barcm</h2>
      </div>
    )).toBe(true);
  });
  
});