import {  mount } from 'enzyme';
import * as React from 'react';
import ErrorIsland from '../../../../src/client/components/elements/ErrorIsland';

const clickErrorLink = (props, onHandleErrorClick) => {
  const preventDefault = jest.fn();
  const wrapper = mount(<ErrorIsland {...props} onHandleErrorClick={onHandleErrorClick}/>);
  const errorLink = wrapper.find('a').first();
  expect(errorLink).toBeDefined();
  errorLink.simulate('click', { preventDefault });
  return { preventDefault };
};

describe('ErrorIsland', () => {
  const props = {
      errors: [
          {
              key: 'ERROR',
              message: 'There is an error'    
          },
          {
              key: 'ERROR',
              message: 'There is an error'    
          },
          {
              key: 'ERROR1',
              message: 'There is another error'    
          }                        
      ]
  };

  it('should render the island with errors', () => {
    const wrapper = mount(<ErrorIsland {...props} />);

    expect(wrapper).toBeDefined();
    expect(wrapper.find('#errorIsland')).toBeDefined();
  });

  it('should render the island with no errors', () => {
    let useProps = { ...props, errors: []};
    const wrapper = mount(<ErrorIsland {...useProps} />);
    expect(wrapper.html()).toBeNull();
  });
  
  it('Should call e.preventDefault if onHandleErrorClick is supplied to props', () => {
    const { preventDefault } = clickErrorLink(props, jest.fn());
    expect(preventDefault).toHaveBeenCalled();
  });
  
  it('Should not call e.preventDefault if onHandleErrorClick is not supplied to props', () => {
    const { preventDefault } = clickErrorLink(props, null);
    expect(preventDefault).not.toHaveBeenCalled();
  });

});