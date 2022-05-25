import {  mount } from 'enzyme';
import * as React from 'react';

import SaveAsDraftButton from '../../../src/client/components/SaveAsDraftButton';

describe('Save As Draft Link', () => {

  const props = {
    onClick: jest.fn()
  };

  it('should load with states passed down via props', () => {
    const link = mount(<SaveAsDraftButton {...props} />);
    expect(link).toBeDefined();
  });

  it('should handle an on click event', () => {
    const mockCallBack = jest.fn();
    const link = mount(<SaveAsDraftButton onClick={mockCallBack} />);
    link.find('button#saveAsDraft').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);  
  });
});