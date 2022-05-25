import React from 'react';
import { mount } from 'enzyme';
import Label from '@govuk-react/label';
import ExportDestination, { countrySearch } from '../../../src/client/components/ExportDestination';
import { render } from '@testing-library/react';


describe('ExportDestination', () => {

  const props = {
    name: 'exportedTo',
    countries: ['UK', 'Brazil']
  };

  const wrapper = mount(<ExportDestination {...props} />);

  it('will render the ExportDestination component', () => {
    expect(wrapper).toBeDefined();
  });

  it('will render the ExportDestination component with the correct id and hint text', () => {
    expect(wrapper.exists('#exportedTo')).toBe(true);
    expect(wrapper.exists('HintText')).toBe(true);
    expect(wrapper.find('HintText').text()).toEqual(
      'This is the main destination country for the export, not the countries it is passing through. ' +
      'This information will not appear on the final document.'
    );
  });

  it('will render the ExportDestination component with the correct label attributes', () => {
    expect(wrapper.exists(Label)).toBeTruthy();
    expect(wrapper.find(Label).prop('htmlFor')).toBe('exportedTo');
  });

  it('will render the ErrorText component when there is an error', () => {
    const wrapper = mount(<ExportDestination {...props} error='Select a valid destination country' />);
    expect(wrapper.find(Label).prop('error')).toEqual('Select a valid destination country');
    expect(wrapper.find('ErrorText').text()).toEqual('Select a valid destination country');
  });

  it('will not render the ErrorText component when there is no error', () => {
    expect(wrapper.exists('ErrorText')).toBe(false);
    expect(wrapper.find(Label).prop('error')).toBeUndefined();
  });

  describe('the AccessibleAutoComplete component', () => {

    it('will set the defaultSelectMessage if it is specified in the props', () => {
      const updated = mount(<ExportDestination {...props} defaultSelectMessage='test' />);

      expect(updated.find('AccessibleAutoComplete').prop('defaultSelectMessage')).toBe('test');
    });

    it('will set the defaultSelectMessage as an empty string if it is not specified in the props', () => {
      expect(wrapper.find('AccessibleAutoComplete').prop('defaultSelectMessage')).toBe('');
    });

    it('will set the defaultValue if exportDestination is specified in the props', () => {
      const exportedTo = {
        officialCountryName: 'SPAIN',
        isoCodeAlpha2: 'A1',
        isoCodeAlpha3: 'A3',
        isoNumericCode: 'SP'
      };
      const updated = mount(<ExportDestination {...props} exportDestination={exportedTo} />);

      expect(updated.find('AccessibleAutoComplete').prop('defaultValue')).toBe('SPAIN');
    });

    it('will set the defaultValue as an empty string if it is not specified in the props', () => {
      expect(wrapper.find('AccessibleAutoComplete').prop('defaultValue')).toBe('');
    });

    it('will load countries for the nonJs journey', () => {
       expect(wrapper.find('AccessibleAutoComplete').prop('nojsValues').length).toEqual(2);
    });

    it('will set the displayMenu as overlay', () => {
      expect(wrapper.find('AccessibleAutoComplete').prop('displayMenu')).toBe('overlay');
    });

    it('will set the search function so that it can search countries', () => {
      const testFn = wrapper.find('AccessibleAutoComplete').prop('search');

      expect(testFn('B')).toEqual(['Brazil']);
    });

    it('will call onChange when the onConfirm function is called', () => {
      const onChange = jest.fn();
      const updated = mount(<ExportDestination {...props} onChange={onChange} />);

      updated.find('AccessibleAutoComplete').props().onConfirm('test');

      expect(onChange).toHaveBeenCalledWith('test');
    });

  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('countrySearch', () => {
  const search = countrySearch(['Republic of Ireland', 'United Kingdom', 'United States of America']);

  it('will return an exact match', () => {
    expect(search('United Kingdom')).toEqual(['United Kingdom']);
  });

  it('will return partial matches', () => {
   expect(search('United')).toEqual(['United Kingdom', 'United States of America']);
  });

  it('will return case-insensitive results', () => {
    expect(search('uNiTed')).toEqual(['United Kingdom', 'United States of America']);
  });

  it('will return matches within a string', () => {
    expect(search('Ireland')).toEqual(['Republic of Ireland']);
  });

});

describe('ExportDestination actions', () => {

  const props = {
    name: 'exportedTo',
    countries: ['UK', 'Brazil'],
    defaultSelectMessage: 'message',
    exportDestination: {
      officialCountryName: 'countryName'
    },
    error: '',
    onChange: jest.fn()
  };

  const wrapper = mount(<ExportDestination {...props}/>);

  let mockGetElementById;

  beforeEach(() => {
    mockGetElementById = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    mockGetElementById.mockReset();
  });

  it('will call the on confirm of the ExportDestination component', () => {
    const country = 'Nigeria';

    const accessibleAutoCompleteEl = wrapper.find('AccessibleAutoComplete[id="exportedTo"]');
    accessibleAutoCompleteEl.props().onConfirm(country);

    expect(props.onChange).toHaveBeenCalledWith('Nigeria');
  });

  it('will call the on confirm with no params of the ExportDestination component', () => {
    const country = null;
    const el = { value: 'England' };

    mockGetElementById.mockImplementation(() => el);

    const accessibleAutoCompleteEl = wrapper.find('AccessibleAutoComplete[id="exportedTo"]');
    accessibleAutoCompleteEl.props().onConfirm(country);

    expect(props.onChange).toHaveBeenCalledWith('England');
  });

  it('will call the on confirm with no params and no element of the ExportDestination component', () => {
    const country = null;

    mockGetElementById.mockImplementation(() => null);

    const accessibleAutoCompleteEl = wrapper.find('AccessibleAutoComplete[id="exportedTo"]');
    accessibleAutoCompleteEl.props().onConfirm(country);

    expect(props.onChange).toHaveBeenCalledWith(null);
  });

});
