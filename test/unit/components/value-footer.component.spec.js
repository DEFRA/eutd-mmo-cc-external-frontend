import React from 'react';
import { shallow } from 'enzyme';
import ValueFooter from '../../../src/client/components/value-footer.component';

describe('ValueFooter', () => {

  it('Should render ValueFooter', () => {
    const wrapper =  shallow(<ValueFooter label='landings' value='0' className='test'/>);
    expect(wrapper.matchesElement(
      <div>
        <div className='test'>0&nbsp;landings</div>
      </div>
    )).toBe(true);
  });

});