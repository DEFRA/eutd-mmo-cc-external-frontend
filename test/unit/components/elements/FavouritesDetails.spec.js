import { mount } from 'enzyme';
import * as React from 'react';
import FavouritesDetails from '../../../../src/client/components/elements/FavouritesDetails';

describe('FavouritesDetails', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<FavouritesDetails />);
  });

  it('should render summary', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle click summary event', () => {
    expect(wrapper.find('FavouritesDetails').state('isOpen')).toEqual(false);
    wrapper.find('summary').simulate('click');
    expect(wrapper.find('FavouritesDetails').state('isOpen')).toEqual(true);
  });

  it('should render favourite Details text', () => {
    expect(wrapper.find('div').text()).toEqual(
      'Product favourites are essential to enable the uploading of products and also can be used to speed up the process of adding products manually.When a product favourite is saved. it generates a product ID which can then be used to identify products during the uploading of landings. Product IDs are only used internally by the FES service and have no relevance to the final catch certificate'
    );
  });
});