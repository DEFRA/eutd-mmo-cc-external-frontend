import { mount } from 'enzyme';
import * as React from 'react';
import ProductFavouriteDetail from '../../../../src/client/components/elements/ProductFavouriteDetail';
import { render } from '@testing-library/react';

describe('ProductFavouriteDetail', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ProductFavouriteDetail />);
  });

  it('should render description', () => {
    expect(wrapper).toBeDefined();
  });


  it('should generate snapshot for the Plane Details page', () => {
    const { container } = render(wrapper)
    
    expect(container).toMatchSnapshot();
  })

  it('should handle click event', () => {
    expect(wrapper.find('ProductFavouriteDetail').state('isOpen')).toEqual(false);
    wrapper.find('ProductFavouriteDetail summary').simulate('click');
    expect(wrapper.find('ProductFavouriteDetail').state('isOpen')).toEqual(true);
  });

  it('should render page with the correct links and text', () => {
    expect(wrapper.find('a[href="/manage-favourites"]').text()).toEqual('manage your product favourites(opens in new tab)');
  });

});
