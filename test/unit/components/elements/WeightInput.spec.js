import * as React from 'react';
import {  mount } from 'enzyme';
import { WeightInput } from '../../../../src/client/components/elements/WeightInput';

describe('WeightInput', () => {

  it('should render text box', () => {
    const props = {
      label: 'this is a label',
      hint: 'this is a hint',
      value: 'blah',
      errors: {},
      onChange: jest.fn()
    };

    const wrapper = mount(<WeightInput {...props} />);
    expect(wrapper).not.toBeNull();
  });

  it('should have a default id of "weight"', () => {
    const wrapper = mount(<WeightInput />);
    expect(wrapper.find('input').prop('id')).toBe('weight');
  });

  it('should allow the id to be overwritten', () => {
    const wrapper = mount(<WeightInput id="my-id" />);
    expect(wrapper.find('input').prop('id')).toBe('my-id');
  });

  it('should render error', () => {
    const props = {
      name: 'blah',
      error: 'blah blah error'
    };

    const wrapper = mount(<WeightInput {...props} />);
    expect(wrapper.find('.error-message').text()).toBe('blah blah error');
  });

  it('should add a css class when in an error state', () => {
    const props = {
      error: 'blah blah error'
    };

    const wrapper = mount(<WeightInput {...props} />);
    expect(wrapper.find('input').prop('className')).toBe('form-control form-control-error weight-input');
  });

  it('should have a class of "weight-input"', () => {
    const wrapper = mount(<WeightInput />);
    expect(wrapper.find('input').prop('className')).toBe('form-control weight-input');
  });
});