import {  mount } from 'enzyme';
import * as React from 'react';
import InputTextBox from '../../../../src/client/components/elements/InputTextBox';

describe('InputTextBox', () => {

  it('should render text box', () => {
    const props = {
        name: 'speciesName',
        defaultValue: 'Atlantic cod',
        type: 'text',
        onChange: (e) => alert(e.target.value),
        min: 1,
        max: 30
    };

    const wrapper = mount(<InputTextBox {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('should render error', () => {
    const props = {
        name: 'speciesName',
        error: 'Species is required'
    };

    const wrapper = mount(<InputTextBox {...props} />);
    expect(wrapper).toBeDefined();
  });
});