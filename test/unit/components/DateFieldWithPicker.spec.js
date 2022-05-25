import { mount } from 'enzyme';
import * as React from 'react';
import moment from 'moment';
import DateFieldWithPicker, { parseDate, getFormattedDate } from '../../../src/client/components/DateFieldWithPicker';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';


describe('DateFieldWithPicker', () => {

  const props = {
    errors: undefined,
    onDateChange: jest.fn(),
    labelText: '',
    labelTextClass: 'label-landings-form',
    dateFormat:'YYYY-MM-DD',
    id: 'component-id'
  };
  const wrapper = mount(<DateFieldWithPicker {...props} />);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should render a valid react component', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should render a DateField', () => {
    expect(wrapper.find('DateField').exists()).toBeTruthy();
  });

  it('Should render a Label text field with the correct className', ()=> {
    expect(wrapper.find('#date-field-label-text').first().text()).toEqual(props.labelText);
    expect(wrapper.find('#date-field-label-text').first().props().className).toContain(props.labelTextClass);
  });

  it('Should render a DatePicker', () => {
    expect(wrapper.find('div.date-picker').exists()).toBeTruthy();
  });

  it('Should set showDatePicker to true when the calendar icon is clicked', () => {
    const calendar = wrapper.find('div.date-picker');
    expect(calendar).toBeDefined();
    calendar.find('img').simulate('click', { preventDefault: () => { } });

    expect(wrapper.find('DatePicker').exists()).toBeTruthy();
    expect(wrapper.find('CalendarContainer.react-datepicker').exists()).toBeTruthy();
    expect(wrapper.find('DateFieldWithPicker').state('showDatePicker')).toBe(true);
  });

  it('Should set selected date when a date is selected', () => {
    const calendar = wrapper.find('div.date-picker');
    expect(calendar).toBeDefined();
    calendar.find('img').simulate('click', { preventDefault: () => { } });
    const datePicker = wrapper.find('DatePicker');
    act(() => {
      datePicker.prop('onSelect')({ day: '01'});
    });
    expect(wrapper.find('DateFieldWithPicker').state('selectedDate')).toEqual({day: '01'});
  });
  
  it('Should have an id as props', () => {
    expect(wrapper.props().id).toEqual('component-id');
  });

  it('it should create snap shot for whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  })
});

describe('DatePicker callback props', () => {
  const props = {
    errors: undefined,
    onDateChange: jest.fn(),
    dateFormat:'YYYY-MM-DD'
  };
  const wrapper = mount(<DateFieldWithPicker {...props} />);
  let datePicker;
  beforeEach(() => {
    wrapper.find('img').simulate('click', { preventDefault: () => {} });
    datePicker = wrapper.find('DatePicker');
  });

  it('Should set showDatePicker to false when clicking outside', () => {
    datePicker.instance().props.onClickOutside();
    expect(wrapper.find('DateFieldWithPicker').state('showDatePicker')).toBe(false);
  });

  it('will set the right state when the picker is selected', () => {

    const date = { day: '01', month: '05', year: '2021' };
    const checkDate = moment(date);

    datePicker
      .instance()
      .props.onSelect(date);
    expect(wrapper.find('DateFieldWithPicker').state()).toEqual({
      dateObject: { day: checkDate.format('DD'), month: checkDate.format('MM'), year: checkDate.format('YYYY') },
      selectedDate: {
        day: '01',
        month: '05',
        year: '2021',
      },
      showDatePicker: false,
    });
  });
});

describe('DateField', ()=> {
  let wrapper;
  const mockAddEventListener = jest.fn();
  const mockOnDateChange= jest.fn();
  const props = {
    onDateChange: mockOnDateChange,
    errors: undefined,
    dateFormat:'YYYY-MM-DD'
  };

  beforeEach(() => {
    jest.spyOn(document, 'getElementsByName')
    .mockReturnValue([{
      addEventListener: mockAddEventListener
    }]);

    window.scrollTo = jest.fn();
    wrapper = mount(<DateFieldWithPicker {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update onChange every time the user types in the date field', () => {
    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');

    dayField.simulate('change', { target: { value: '10' } });
    monthField.simulate('change', { target: { value: '07' } });
    yearField.simulate('change', { target: { value: '2021' } });

    expect(wrapper.find('DateFieldWithPicker').state()).toMatchObject({
      showDatePicker: false,
      dateObject: {
        day: '10',
        month: '07',
        year: '2021',
      },
    });
  });

  it('should add an event listener to prevent alpha characters', () => {
    expect(mockAddEventListener).toHaveBeenCalledTimes(3);
  });

  it('will set selectedDate to be null if the date in the field is not finished', ()=> {
    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');

    dayField.simulate('change', { target: { value: '02' } });
    monthField.simulate('change', { target: { value: '' } });
    yearField.simulate('change', { target: { value: '' } });

    expect(wrapper.find('DateFieldWithPicker').state('selectedDate')).toBe(null);
    expect(mockOnDateChange).toHaveBeenCalledWith({
      target: {
        name: undefined,
        value: 'Invalid date',
      },
    });  });

  it('will set selectedDate to the value entered and set the correct onDateChange prop if the date in the field is complete', ()=> {
    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');

    dayField.simulate('change', { target: { value: '10' } });
    monthField.simulate('change', { target: { value: '05' } });
    yearField.simulate('change', { target: { value: '2020' } });

    expect(mockOnDateChange).toHaveBeenCalledWith({
      target: {
        name: undefined,
        value: '2020-05-10',
      },
    });
    expect(wrapper.find('DateFieldWithPicker').state('selectedDate')).not.toBeNull();
  });
});

describe('ComponentDidUpdate', ()=> {

  it('should componentDidUpdate with new props', () => {
    let wrapper;

    const props = {
      errors: undefined,
      date: '2020-05-10',
      dateFormat:'YYYY-MM-DD'
    };

    const prevProps = {
      errors: undefined,
      date: '2020-05-12',
      dateFormat:'YYYY-MM-DD'
    };

    wrapper = mount(<DateFieldWithPicker {...props} />);
    const instance = wrapper.find('DateFieldWithPicker').instance();
    instance.componentDidUpdate(prevProps);

    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toBeDefined();
    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toEqual({
      day: '10',
      month: '05',
      year: '2020',
    });
  });


  it('should update dateObject to default value when we get empty date prop', () => {
    let wrapper;
    const props = {
      errors: undefined,
      date: null,
    };

    const prevProps = {
      errors: undefined,
      date: '2020-05-12',
    };

    wrapper = mount(<DateFieldWithPicker {...props} />);

    const instance = wrapper.find('DateFieldWithPicker').instance();
    instance.componentDidUpdate(prevProps);

    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toBeDefined();
    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toEqual({
      day: '',
      month: '',
      year: '',
    });
  });
});

describe('ComponentDidMount', ()=> {

  it('should componentDidMount with props and an invalid date', () => {
    let wrapper;

    const props = {
      errors: undefined,
      date: 'Invalid date',
      dateFormat:'YYYY-MM-DD'
    };

    wrapper = mount(<DateFieldWithPicker {...props} />);
    const instance = wrapper.find('DateFieldWithPicker').instance();
    instance.componentDidMount(props);

    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toBeDefined();
    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toEqual({
      day: '',
      month: '',
      year: '',
    });
  });

  it('should componentDidMount with props and a correct date', () => {
    let wrapper;

    const props = {
      errors: undefined,
      date: '2020-05-05',
      dateFormat:'YYYY-MM-DD'
    };

    wrapper = mount(<DateFieldWithPicker {...props} />);
    const instance = wrapper.find('DateFieldWithPicker').instance();
    instance.componentDidMount(props);

    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toBeDefined();
    expect(wrapper.find('DateFieldWithPicker').state('dateObject')).toEqual({
      day: '05',
      month: '05',
      year: '2020',
    });
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

describe('#getFormattedDate', () => {
  it('Should return the correctly formatted date', () => {
    const result = getFormattedDate({ day: '01', month: '03', year: '2020' }, 'YYYY-MM-DD');
    expect(result).toBe('2020-03-01');
  });

  it('Should return the correctly formatted date, second option', () => {
    const result = getFormattedDate({ day: '01', month: '03', year: '2020' }, 'DD/MM/YYYY');
    expect(result).toBe('01/03/2020');
  });
});

describe('English/Welsh Translation test cases', () => {
  const props = {
    errors: undefined,
    onDateChange: jest.fn(),
    labelText: '',
    labelTextClass: 'label-landings-form',
    dateFormat:'YYYY-MM-DD',
    id: 'component-id',
    t: jest.fn()
  };
  const wrapper = mount(
      <DateFieldWithPicker {...props} />
  );
});
