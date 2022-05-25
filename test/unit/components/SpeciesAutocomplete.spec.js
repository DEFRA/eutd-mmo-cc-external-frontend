import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import SpeciesAutocomplete from '../../../src/client/components/SpeciesAutocomplete';

jest.mock('../../../src/client/components/AccessibleAutocomplete');

const mockFishes = [
  { faoName: 'Barracudas', faoCode: 'BAZ', scientificName: 'Sphyraena', commonRank: 0 },
  { faoName: 'Bigeye tuna', faoCode: 'BET', scientificName: 'Thunnus obesus', commonRank: 10 }
];

const onChangeMock = jest.fn();
const getWrapper = (error, allFish, hintText = false) => {

  const mockStore = configureStore();
  return mount(
    <Provider store={mockStore({ global: { allFish } })}>
      <SpeciesAutocomplete
        error={error}
        label='label'
        name='cuttlefish'
        onChange={onChangeMock}
        defaultValue={''}
        hintText={hintText}
      />
    </Provider>
  );
};
describe('Species Autocomplete', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render SpeciesAutocomplete without errors', () => {
    const wrapper = getWrapper(false, mockFishes);
    expect(wrapper).toBeDefined();
    expect(wrapper.find('ErrorText').exists()).toBe(false);
  });

  it('Should render SpeciesAutocomplete with errors', () => {
    const wrapper = getWrapper({ cuttlefishError: 'species error' }, mockFishes);
    expect(wrapper).toBeDefined();
    expect(wrapper.find('ErrorText').exists()).toBe(true);
    expect(wrapper.find('SpeciesAutocomplete').instance().getError()).toBe('species error');
  });

  it('Should render SpeciesAutocomplete with HintText', () => {
    const wrapper = getWrapper(false, mockFishes, true);
    expect(wrapper).toBeDefined();
    expect(wrapper.find('HintText').exists()).toBe(true);
  });

  describe('#onConfirm', () => {

    let mockGetElementsByName = jest.spyOn(document, 'getElementsByName');

    beforeEach(() => {
      mockGetElementsByName = jest.spyOn(document, 'getElementsByName');
    });

    afterEach(() => {
      mockGetElementsByName.mockReset();
    });

    it('Should noop when the parameter is false', () => {
      mockGetElementsByName.mockReturnValue({ item: () => ({
        value: 'some-value'
      })});

      const wrapper = getWrapper(false, mockFishes);
      wrapper.find('SpeciesAutocomplete').instance().onConfirm(false);
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('Should noop when the parameter is false and no element is found', () => {
      mockGetElementsByName.mockReturnValue({ item: () => null});

      const wrapper = getWrapper(false, mockFishes);
      wrapper.find('SpeciesAutocomplete').instance().onConfirm(false);
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should cancel the selection if the user clears the input field', () => {
      mockGetElementsByName.mockReturnValue({ item: () => ({
        value: ''
      })});
      const wrapper = getWrapper(false, mockFishes);
      wrapper.find('SpeciesAutocomplete').instance().onConfirm('');
      expect(onChangeMock).toHaveBeenCalledWith('');
    });

    it('Should call onChange when the parameter is valid', () => {
      const wrapper = getWrapper(false, mockFishes);
      wrapper.find('SpeciesAutocomplete').instance().onConfirm(true);
      expect(onChangeMock).toHaveBeenCalled();
    });

    it('Should only call onChange if a value is passed onConfirm', () => {
      const wrapper = getWrapper(false, mockFishes);
      wrapper.find('SpeciesAutocomplete').instance().onConfirm('some-value');
      expect(onChangeMock).toHaveBeenCalled();
    });

    it('Should call onChange when the parameter is an actual value', () => {
      const wrapper = getWrapper(false, mockFishes);
      wrapper.find('SpeciesAutocomplete').instance().onConfirm('Barracudas (BAZ)');
      expect(onChangeMock).toHaveBeenCalledWith('Barracudas (BAZ)', {
        faoName: 'Barracudas', faoCode: 'BAZ', scientificName: 'Sphyraena', commonRank: 0
      });
    });

  });

  describe('#checkEntries', () => {
    describe('when name includes product', () => {
      it('should return true', () => {
        const wrapper = getWrapper(false, mockFishes);
        expect(wrapper.find('SpeciesAutocomplete').instance().checkEntries('.product')).toBeTruthy();
      });
    });

    describe('when name includes species', () => {
      it('should return true', () => {
        const wrapper = getWrapper(false, mockFishes);
        expect(wrapper.find('SpeciesAutocomplete').instance().checkEntries('.species')).toBeTruthy();
      });
    });

    it('should return false', () => {
      const wrapper = getWrapper(false, mockFishes);
      expect(wrapper.find('SpeciesAutocomplete').instance().checkEntries('.other')).toBeFalsy();
    });
  });

  describe('#quickSearch', () => {

    const itShouldReturnArrayOfFishWithQuery = (query, expectFinal) =>
      it(`Should return and array of fish whose name includes the query ${query}`, () => {
        const wrapper = getWrapper(false, mockFishes);
        const speciesAutocompleteInstance =  wrapper.find('SpeciesAutocomplete').instance();

        const searchResult = speciesAutocompleteInstance.quickSearch(query);
        expectFinal(searchResult);
      });

    itShouldReturnArrayOfFishWithQuery('Barracudas', (searchResult) => {
      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(1);
      expect(searchResult[0]).toBe('Barracudas (BAZ)');
    });

    itShouldReturnArrayOfFishWithQuery('baz', (searchResult) => {
      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(1);
      expect(searchResult[0]).toBe('Barracudas (BAZ)');
    });

    itShouldReturnArrayOfFishWithQuery('B', (searchResult) => {
      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Barracudas (BAZ)');
      expect(searchResult[1]).toBe('Bigeye tuna (BET)');
    });

    it('Should return and array of fish whose name includes the query B', () => {
      const wrapper = getWrapper(false, [
        { faoName: 'Bigeye tuna', faoCode: 'BET', scientificName: 'Thunnus obesus', commonRank: 10 },
        { faoName: 'Barracudas', faoCode: 'BAZ', scientificName: 'Sphyraena', commonRank: 0 }
      ]);
      const speciesAutocompleteInstance =  wrapper.find('SpeciesAutocomplete').instance();

      const searchResult = speciesAutocompleteInstance.quickSearch('B');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Barracudas (BAZ)');
      expect(searchResult[1]).toBe('Bigeye tuna (BET)');
    });

    it('Should return and array of fish whose name includes the query B of equal faoCodes', () => {
      const wrapper = getWrapper(false, [
        { faoName: 'Barracudas', faoCode: 'BET', scientificName: 'Sphyraena', commonRank: 10 },
        { faoName: 'Bigeye tuna', faoCode: 'BET', scientificName: 'Thunnus obesus', commonRank: 0 }
      ]);
      const speciesAutocompleteInstance =  wrapper.find('SpeciesAutocomplete').instance();

      const searchResult = speciesAutocompleteInstance.quickSearch('B');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Barracudas (BET)');
      expect(searchResult[1]).toBe('Bigeye tuna (BET)');
    });


    it('Should return and array of fish whose name includes the query A', () => {
      const wrapper = getWrapper(false, [
        { faoName: 'Barracudas', faoCode: 'BET', scientificName: 'Sphyraena', commonRank: 10 },
        { faoName: 'Bigeye tuna', faoCode: 'BET', scientificName: 'Thunnus obesus', commonRank: 0 }
      ]);
      const speciesAutocompleteInstance =  wrapper.find('SpeciesAutocomplete').instance();

      const searchResult = speciesAutocompleteInstance.quickSearch('A');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Bigeye tuna (BET)');
      expect(searchResult[1]).toBe('Barracudas (BET)');
    });

    it('Should return and array of fish whose name includes the query A of differing ranks', () => {
      const wrapper = getWrapper(false, [
        { faoName: 'Barracudas', faoCode: 'BET', scientificName: 'Sphyraena', commonRank: 0 },
        { faoName: 'Bigeye tuna', faoCode: 'BET', scientificName: 'Thunnus obesus', commonRank: 10 }
      ]);
      const speciesAutocompleteInstance =  wrapper.find('SpeciesAutocomplete').instance();

      const searchResult = speciesAutocompleteInstance.quickSearch('A');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Barracudas (BET)');
      expect(searchResult[1]).toBe('Bigeye tuna (BET)');
    });

    it('Should return and array of fish whose name includes the query ( of differing ranks', () => {
      const wrapper = getWrapper(false, [
        { faoName: 'Barracudas', faoCode: 'BET', scientificName: '(Sphyraena)', commonRank: 0 },
        { faoName: 'Bigeye tuna', faoCode: 'BET', scientificName: 'Thunnus obesus', commonNames: ['('], commonRank: 10 },
        { faoName: 'Red Herring', faoCode: 'HER', scientificName: 'latin name', commonRank: 10 }
      ]);
      const speciesAutocompleteInstance =  wrapper.find('SpeciesAutocomplete').instance();

      const searchResult = speciesAutocompleteInstance.quickSearch('(');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(3);
      expect(searchResult[0]).toBe('Barracudas (BET)');
      expect(searchResult[1]).toBe('Bigeye tuna (BET)');
      expect(searchResult[2]).toBe('Red Herring (HER)');
    });

  });

});