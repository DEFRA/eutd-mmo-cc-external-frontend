import { mount } from 'enzyme';
import * as React from 'react';

import GovukSpeciesAutocomplete from '../../../src/client/components/GovukSpeciesAutocomplete';

const getWrapper = (noFaoName = false, searchResults = [{ faoName: noFaoName ? false : 'foo', faoCode: 'FOO' }]) => {
  return mount(<GovukSpeciesAutocomplete
    hintText={'foo'}
    onChange={jest.fn()}
    error={{}}
    search={jest.fn()}
    speciesName={''}
    searchResults={searchResults}
    clearSearchResults={jest.fn()}
    controlName={'foo'}
    controlId={'foo'}
  />);
};

describe('Species autocomplete', () => {

  it('should load fine with species data', () => {
    expect(getWrapper()).toBeDefined();
  });

  it('Should load fine when no faoName is included with the fish data', () => {
    expect(getWrapper(true)).toBeDefined();
  });

  it('Should load fine without search results', () => {
    expect(getWrapper(true, null)).toBeDefined();
  });

  describe('#getItem', () => {

    it('Should return the label of a fish item', () => {
      const wrapper = getWrapper();
      expect(wrapper.instance().getItem({ label: 'foo' })).toEqual('foo');
    });

  });
});