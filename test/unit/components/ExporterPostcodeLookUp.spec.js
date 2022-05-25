import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import  ExporterPostcodeLookUp  from '../../../src/client/components/ExporterPostcodeLookUp';

describe('ExporterPostCodeLookUp', () => {

  const props = {
    manualAddressUrl: ':documentNumber/some-url-going-to-somewhere',
    postCodeError: {},
    onSubmit: jest.fn(),
    handleManualAddressClick: jest.fn(),
    handleInputChange: jest.fn(),
    handleCancleButton: jest.fn(),
    postcode: 'AB1 1AX',
    errors: {}
  };

  const wrapper = mount(<ExporterPostcodeLookUp {...props} />);


  it('Should render ExporterPostcodeLookUp component', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should render a manual address as a link', () => {
    expect(wrapper.find('button#enter-address-manuall-link')).toBeDefined();
  });

  it('should call on onSubmit with post code', () => {
    const button = wrapper.find('#findAddress');
    act(() => button.prop('onClick')({}));

    expect(props.onSubmit).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalledWith('AB1 1AX');
  });

  it('should call on handleManualAddressClick when opting to manually enter address', () => {
    const button = wrapper.find('button#enter-address-manually-link');
    act(() => button.prop('onClick')({}));

    expect(props.handleManualAddressClick).toHaveBeenCalled();
  });

  it('should render correct error message if there is any', () => {
    const props = {
      manualAddressUrl: ':documentNumber/some-url-going-to-somewhere',
      onSubmit: jest.fn(),
      handleManualAddressClick: jest.fn(),
      handleInputChange: jest.fn(),
      handleCancleButton: jest.fn(),
      postcode: 'AB1 1AX',
      errors: {
        postcodeError: 'commonLookupAddressPageErrorPostcodeEmpty',
        errors: [
          {
            targetName: 'postcode', text: 'commonLookupAddressPageErrorPostcodeEmpty'
          }
        ]
      }
    };
  
    const wrapper = mount(<ExporterPostcodeLookUp {...props} />);
    expect(wrapper.find('label span').at(2).text()).toBe('Enter a postcode');
  });

  it('should call on handleInputChange when entering a postcode', () => {
    const button = wrapper.find('#postcode');
    act(() => button.first().prop('onChange')({ currentTarget: { value: 'blah'}}));

    expect(props.handleInputChange).toHaveBeenCalled();
    expect(props.handleInputChange).toHaveBeenCalledWith('blah');
  });
});