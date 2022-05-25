import AddVesselForm from '../../../../../src/client/pages/exportCertificates/landings/AddVesselForm';
import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';


describe('AddVesselForm', () => {
  let wrapper;

  const faoArea = 'FAO27';
  const vessel = { label: '' };
  const errors = {
    dateLandedError: 'Enter the date landed',
    'vessel.vesselNameError': 'Select a vessel from the list'
  };

  const dateLanded = moment('2021-12-01',['YYYY-M-D', 'YYYY-MM-DD'], true);
  const onDateChange = jest.fn();

  const onFaoChange = jest.fn();
  const vesselOptions = [];
  const searchVessels = jest.fn();
  const onVesselChange = jest.fn();
  const clearSearchResults = jest.fn();
  const getDateLanded = jest.fn();
  const isDateLandedComplete = jest.fn();

  beforeAll(() => {
    wrapper = mount(
      <AddVesselForm
        dateLanded={dateLanded}
        onDateChange={onDateChange}
        faoArea={faoArea}
        onFaoChange={onFaoChange}
        vessel={vessel}
        vesselOptions={vesselOptions}
        searchVessels={searchVessels}
        onVesselChange={onVesselChange}
        clearSearchResults={clearSearchResults}
        getDateLanded = {getDateLanded}
        isDateLandedComplete = {isDateLandedComplete}
        errors={errors}
      />
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('will render', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.text()).toContain('Date Landed');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('will set the date from the props', () => {
    expect(wrapper.find('AddVesselForm').prop('dateLanded')).toEqual(
      dateLanded
    );
  });

  it('will set the FAO area from the props', () => {
    expect(wrapper.find('#select-faoArea').prop('value')).toBe(faoArea);
  });

  it('will handle the FAO area changing', () => {
    wrapper
      .find('#select-faoArea')
      .simulate('change', { target: { value: 'FAO31' } });

    expect(onFaoChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: { value: 'FAO31' } })
    );
  });

  it('will handle searching', () => {
    const search = wrapper.find('GovukVesselsAutocomplete').prop('search');

    search();

    expect(searchVessels).toHaveBeenCalled();
  });

  it('will handle clearing search results', () => {
    const clear = wrapper
      .find('GovukVesselsAutocomplete')
      .prop('clearSearchResults');

    clear();

    expect(clearSearchResults).toHaveBeenCalled();
  });

  it('will handle typing in a vessel name', () => {
    const onChange = wrapper.find('GovukVesselsAutocomplete').prop('onChange');

    onChange('wiron 5', null);

    expect(onVesselChange).toHaveBeenCalledWith({ label: 'wiron 5' });
  });

  it('will handle finding a vessel', () => {
    const onChange = wrapper.find('GovukVesselsAutocomplete').prop('onChange');

    onChange('wiron 5', { vesselName: 'WIRON 5' });

    expect(onVesselChange).toHaveBeenCalledWith({ vesselName: 'WIRON 5' });
  });

  it('should not allow user to select a vessel when date has not been set', () => {
    const ac = wrapper.find('GovukVesselsAutocomplete');
    expect(ac.exists()).toBeTruthy();
    act(() => ac.props().onChange('Enter a valid date landed to enable Vessel name'));

     expect(wrapper.find('AddVesselForm').props().vessel).toEqual(
      {
        label: ''
      }
    );
  });

  it('will parse vessel data for the autocomplete component', () => {
    const getItem = wrapper.find('GovukVesselsAutocomplete').prop('getItem');

    expect(getItem({ label: 'WIRON 5', pln: '5500' })).toEqual('WIRON 5');
  });

  it('will parse the date input field to a moment object for the autocomplete component', () => {
    const autoCompleteDate = wrapper
      .find('GovukVesselsAutocomplete')
      .prop('dateLanded');

    const expected = moment(dateLanded, 'YYYY-M-D');

    expect(autoCompleteDate.isSame(expected));
  });

  it('will pass null to the autocomplete component if the date does not match the correct format', () => {
    const invalidDateWrapper = mount(
      <AddVesselForm
        dateLanded={'20-05-14'}
        onDateChange={onDateChange}
        faoArea={faoArea}
        onFaoChange={onFaoChange}
        vessel={vessel}
        vesselOptions={vesselOptions}
        searchVessels={searchVessels}
        onVesselChange={onVesselChange}
        clearSearchResults={clearSearchResults}
        getDateLanded = {getDateLanded}
        isDateLandedComplete = {isDateLandedComplete}
        errors={errors}
      />
    );
    const autoCompleteDate = invalidDateWrapper
      .find('GovukVesselsAutocomplete')
      .prop('dateLanded');

    expect(autoCompleteDate).toBeNull();
  });

  it('will display validation errors for each component', () => {
    expect(wrapper.find('DateField').at(0).text()).toContain(errors.dateLandedError);
    expect(wrapper.find('GovukVesselsAutocomplete').at(0).text()).toContain(errors['vessel.vesselNameError']);
  });

  it('will display an error on the FAO areas field', () => {
    const invalidFAOError = {
      faoAreaError: 'Catch area is missing'
    };

    const invalidFAOWrapper = mount(
      <AddVesselForm
        dateLanded={'20-05-14'}
        onDateChange={onDateChange}
        faoArea={faoArea}
        onFaoChange={onFaoChange}
        vessel={vessel}
        vesselOptions={vesselOptions}
        searchVessels={searchVessels}
        onVesselChange={onVesselChange}
        clearSearchResults={clearSearchResults}
        getDateLanded = {getDateLanded}
        isDateLandedComplete = {isDateLandedComplete}
        errors={invalidFAOError}
      />
    );

    expect(invalidFAOWrapper
      .find('#select-faoArea')
      .prop('className')).toBe('autocomplete__input--default faoArea autocomplete__error');
  });
});
