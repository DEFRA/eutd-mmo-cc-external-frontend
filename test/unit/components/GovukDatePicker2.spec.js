import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { GovukDatePicker, parseDate } from '../../../src/client/components/GovukDatePicker2';

const mockChange = jest.fn();
const mockInputOnChange = jest.fn();
const input = { name: 'exportDate', value: 'foo', onChange: mockInputOnChange };
const getWrapper = (fullDepth = false, error = false) => {
  const mounter = fullDepth ? mount : shallow;
  return (
    mounter(<GovukDatePicker
        id={0}
        label="pick"
        onChange={mockChange}
        hint="hint"
        input={input}
        meta={{ error }}
      />)
  );
};

describe('GovukDatePicker2', () => {

  it('Should render a valid react component', () => {
    expect(getWrapper()).toBeDefined();
  });

  it('Should render a ok with meta errors', () => {
    expect(getWrapper(false, true)).toBeDefined();
  });

  it('Should set showDatePicker to true when the calendar icon is clicked', () => {
    const wrapper = getWrapper();
    const calendar = wrapper.find('div.date-picker2');
    expect(calendar).toBeDefined();
    calendar.find('img').simulate('click', { preventDefault: () => {}});
    expect(wrapper.state('showDatePicker')).toBe(true);
  });

  describe('DatePicker callback props', () => {
    let wrapper;
    let datePicker;
    beforeEach(() => {
      wrapper = getWrapper(true);
      wrapper.find('img').simulate('click', { preventDefault: () => {}});
      datePicker = wrapper.find('DatePicker');
      expect(datePicker).toBeDefined();
    });

    it('Should set showDatePicker to false when clicking outside', () => {
      datePicker.instance().props.onClickOutside();
      expect(wrapper.state('showDatePicker')).toBe(false);
    });
    
    it('Should set showDatePicker to false and call input.onChange when a date is selected (no value)', () => {
      datePicker.instance().props.onChange(null);
      expect(wrapper.state('showDatePicker')).toBe(false);
      expect(mockInputOnChange).toHaveBeenCalledWith({ target: { name: input.name, value: null }});
    });

    it('Should set showDatePicker to false and call input.onChange when a date is selected (with value)', () => {
      const value = {
        format: jest.fn().mockReturnValue(true)
      };
      datePicker.instance().props.onChange(value);
      expect(wrapper.state('showDatePicker')).toBe(false);
      expect(mockInputOnChange).toHaveBeenCalledWith({ target: { name: input.name, value: true }});
      expect(value.format).toHaveBeenCalled();
    });

  });

  describe('#parseDate', () => {

    it('Should return null if param is not a valid date', () => {
      expect(parseDate('no')).toBeNull();
    });

    it('Should return a parsed date', () => {
      const result = parseDate(new Date('2014-02-27T10:00:00'));
      expect(result).not.toBeNull();
    });

  });
});