import React from 'react';
import { mount } from 'enzyme';

import SelectAddress from '../../../src/client/components/SelectAddress';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

describe('Test Suite - Postcode Look up - Step 2: Select Address', () => {
  const props = {
    postcode: 'B20 3RU',
    errors: { error: [], addressError: '' },
    addresses: [
      {
        address_line: 'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
        building_name: 'LANCASTER HOUSE',
        street_name: 'HAMPSHIRE COURT',
        county: 'TYNESIDE',
        country: 'ENGLAND',
        city: 'NEWCASTLE UPON TYNE',
        postCode: 'NE4 7YH',
      },
    ],
    setSelectedAddress: jest.fn(),
    handleCancelButton: jest.fn(),
    handleSelectAddressNavigation: jest.fn(),
  };

  const wrapper = mount(<SelectAddress {...props} />);

  it('Should render "Select Address" component', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should render drop-down component', () => {
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.exists()).toBeTruthy();
  });
  it('Should keep a default option selected in drop-down component', () => {
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.childAt(0).text()).toBe('1 address found');
  });

  it('Should have default option text updated according to number of results in drop-down component', () => {
    const props = {
      postcode: 'B20 3RU',
      errors: { error: [], addressError: '' },
      addresses: [
        {
          address_line: 'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
          building_name: 'LANCASTER HOUSE',
          street_name: 'HAMPSHIRE COURT',
          county: 'TYNESIDE',
          country: 'ENGLAND',
          city: 'NEWCASTLE UPON TYNE',
          postCode: 'NE4 7YH',
        },
        {
          address_line: 'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
          building_name: 'LANCASTER HOUSE',
          street_name: 'HAMPSHIRE COURT',
          county: 'TYNESIDE',
          country: 'ENGLAND',
          city: 'NEWCASTLE UPON TYNE',
          postCode: 'NE4 9YH',
        },
        {
          address_line: 'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
          building_name: 'LANCASTER HOUSE',
          street_name: 'HAMPSHIRE COURT',
          county: 'TYNESIDE',
          country: 'ENGLAND',
          city: 'NEWCASTLE UPON TYNE',
          postCode: 'NE4 8YH',
        }
      ],
      setSelectedAddress: jest.fn(),
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
    };
    const wrapper = mount(<SelectAddress {...props} />);
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.childAt(0).text()).toBe('3 addresses found');
  });

  it('Should have default option text updated to No addresses found when no address were found', () => {
    const props = {
      postcode: 'B20 3RU',
      errors: { error: [], addressError: '' },
      addresses: [],
      setSelectedAddress: jest.fn(),
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
    };
    const wrapper = mount(<SelectAddress {...props} />);
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.childAt(0).text()).toBe('No addresses found');
  });

  it('Should have an option available for selection by user in drop-down component when only building_name is given', () => {
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.childAt(1).text().trim()).toBe(
      'MARINE MANAGEMENT ORGANIZATION, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH'
    );
  });

  it('should show correct error when there is any', () => {
    const props = {
      postcode: 'B20 3RU',
      errors: {
        errors: [
        {
          targetName: 'postcode', text: 'commonLookupAddressPageErrorSelectedAddress'
        }
        ],
        addressError: 'commonLookupAddressPageErrorSelectedAddress' },
      addresses: [],
      setSelectedAddress: jest.fn(),
      handleCancelButton: jest.fn(),
      handleSelectAddressNavigation: jest.fn(),
    };
    const wrapper = mount(<SelectAddress {...props} />);
    expect(wrapper.find('.error-message').first().text()).toBe('Select an address to continue or click \'I cannot find my address in the list\'');
  });

  it('should take a snapshot of SelectAddress: PostcodeLookUp: Step 2', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('select option dropdown list', () => {

  const props = {
    postcode: 'B20 3RU',
    errors: { error: [], addressError: '' },
    addresses: [
      {
        address_line: 'MARINE MANAGEMENT ORGANIZATION 1, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
        building_number: '34',
        building_name: 'LANCASTER HOUSE',
        sub_building_name: 'TOP FLOOR',
        street_name: 'HAMPSHIRE COURT',
        county: 'TYNESIDE',
        country: 'ENGLAND',
        city: 'NEWCASTLE UPON TYNE',
        postCode: 'NE4 7YH',
      },
      {
        address_line: 'MARINE MANAGEMENT ORGANIZATION 2, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
        building_number: '34',
        street_name: 'HAMPSHIRE COURT',
        county: 'TYNESIDE',
        country: 'ENGLAND',
        city: 'NEWCASTLE UPON TYNE',
        postCode: 'NE4 7YH',
      },
      {
        address_line: 'MARINE MANAGEMENT ORGANIZATION 3, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH',
        building_name: 'LANCASTER HOUSE',
        street_name: 'HAMPSHIRE COURT',
        county: 'TYNESIDE',
        country: 'ENGLAND',
        city: 'NEWCASTLE UPON TYNE',
        postCode: 'NE4 7YH',
      }
    ],
    setSelectedAddress: jest.fn(),
    handleCancelButton: jest.fn(),
    handleSelectAddressNavigation: jest.fn(),
  };

  const wrapper = mount(<SelectAddress {...props} />);

  it('should included an option with all properties when all are given', () => {
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.childAt(1).text().trim()).toBe(
      'MARINE MANAGEMENT ORGANIZATION 1, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH'
    );
  });

  it('should included an option with only building_number and main properties when only building_number is added', () => {
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    expect(dropdown.childAt(2).text().trim()).toBe(
      'MARINE MANAGEMENT ORGANIZATION 2, LANCASTER HOUSE, HAMPSHIRE COURT, NEWCASTLE UPON TYNE, NE4 7YH'
    );
  });
  it('should set address with the value of the select address', () => {
    const dropdown = wrapper.find('select[name=\'selectAddress\']');
    act(() => {
      dropdown.prop('onChange')({ currentTarget: { value: 'blah'}});
    });

    expect(props.setSelectedAddress).toHaveBeenCalled();
    expect(props.setSelectedAddress).toHaveBeenCalledWith('blah');
  });

  it('should call handleSelectAddressNavigation', () => {
    const dropdown = wrapper.find('#selectAddressNavigationPrev');
    act(() => {
      dropdown.prop('onClick')({});
    });

    expect(props.handleSelectAddressNavigation).toHaveBeenCalled();
    expect(props.handleSelectAddressNavigation).toHaveBeenCalledWith('PREV');
  });

  it('should call handleSelectAddressNavigation when continuing', () => {
    const dropdown = wrapper.find('#continueSelectAddress');
    act(() => {
      dropdown.first().prop('onClick')({});
    });

    expect(props.handleSelectAddressNavigation).toHaveBeenCalled();
    expect(props.handleSelectAddressNavigation).toHaveBeenCalledWith('NEXT');
  });

  it('should call handleSelectAddressNavigation when skipping', () => {
    const dropdown = wrapper.find('#selectAddressNavigationSkip');
    act(() => {
      dropdown.prop('onClick')({});
    });

    expect(props.handleSelectAddressNavigation).toHaveBeenCalled();
    expect(props.handleSelectAddressNavigation).toHaveBeenCalledWith('SKIP');
  });
});