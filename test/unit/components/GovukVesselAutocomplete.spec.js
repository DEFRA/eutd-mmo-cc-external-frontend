import { shallow } from 'enzyme';
import * as React from 'react';
import GovukVesselsAutocomplete from '../../../src/client/components/GovukVesselsAutocomplete';

const onChangeMock = jest.fn();
const clearSearchResultsMock = jest.fn();
const searchMock = jest.fn();

const getWrapper = ( dateLanded =null) => {
  const mounter = shallow;

  return mounter(<GovukVesselsAutocomplete
    label='Foo'
    hintText='Bar'
    controlName='foo'
    controlId='foo'
    searchResults={[]}
    selectedItemName={''}
    onChange={onChangeMock}
    search={searchMock}
    getItem={jest.fn()}
    clearSearchResults={clearSearchResultsMock}
    dateLanded={dateLanded}
  />);
};

describe('VesselsAutocomplete box', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('search implementation', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      window.setTimeout = jest.fn().mockImplementation((cb, time) => {
        cb();
        expect(time).toBeGreaterThan(0);
      });
    });

    it('Should call the search function when debouncedSearch is called (implementation)', () => {
      getWrapper().instance().debouncedSearch('search', 'date');
      expect(searchMock).toHaveBeenCalledWith('search', 'date');
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    });

    it('Should call the search function when onInputChange is called (implementation)', () => {
      const dateLanded = new Date(2019, 1, 1);
      const searchTerm = 'bob';
      const event = {target: {value: searchTerm}};
      getWrapper(dateLanded).instance().onInputChange(event);
      expect(searchMock).toHaveBeenCalledWith(searchTerm, dateLanded);
    });

    if('Should call the search function with empty date if dateLanded not provided', () => {
      const searchTerm = 'bob';
      const event = {target: {value: searchTerm}};
      getWrapper().instance().onInputChange(event);
      expect(searchMock).toHaveBeenCalledWith(searchTerm, null);
    });

  });

});

