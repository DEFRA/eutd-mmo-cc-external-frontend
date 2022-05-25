import {  mount } from 'enzyme';
import * as React from 'react';

import SubmitButton from '../../../../src/client/components/elements/SubmitButton';

describe('Submit Button', () => {

  it('should render a button with type submit', () => {
    const props = {
        name: 'save',
        label: 'Save',
        formAction: 'post',
        disabled: false,
        onClick: (e) => alert(e.target.value),
        id: 'save'
    };

    const comp = mount(
      <SubmitButton {...props} />
    );
    expect(comp).toBeDefined();
    const button = comp.find('button');

    expect(button.exists()).toBe(true);
    expect(button.props().type).toBe('submit');
  });
});