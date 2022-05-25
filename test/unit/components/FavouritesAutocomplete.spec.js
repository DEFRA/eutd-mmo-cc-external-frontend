import * as React from 'react';
import { mount } from 'enzyme';

import FavouritesAutocomplete from '../../../src/client/components/FavouritesAutocomplete';

jest.mock('../../../src/client/components/AccessibleAutocomplete');

const mockFavourites = [
  {
    commodity_code: '03044410',
    commodity_code_description:
      'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
    id: 'PRD695',
    presentation: 'FIL',
    presentationLabel: 'Filleted',
    scientificName: 'Gadus morhua',
    species: 'Atlantic cod (COD)',
    speciesCode: 'COD',
    state: 'FRE',
    stateLabel: 'Fresh',
  },
  {
    commodity_code: '03025990',
    commodity_code_description:
      'Fresh or chilled fish of the families Bregmacerotidae, Euclichthyidae, Gadidae, Macrouridae, Melanonidae, Merlucciidae, Moridae and Muraenolepididae (excl. cod, haddock, coalfish, hake, Alaska pollack, blue whitings, Boreogadus saida, whiting, pollack and ling)',
    id: 'PRD533',
    presentation: 'GHT',
    presentationLabel: 'Gutted, headed and tailed',
    scientificName: 'Salilota australis',
    species: 'Tadpole codling (SAO)',
    speciesCode: 'SAO',
    state: 'FRE',
    stateLabel: 'Fresh',
  },
];

const onChangeMock = jest.fn();
const getWrapper = (error) => {

  return mount(
      <FavouritesAutocomplete
        error={error}
        label='label'
        id='product'
        name='product'
        onChange={onChangeMock}
        defaultValue={''}
        allFavourites={mockFavourites}
      />
  );
};

describe('Favourites Autocomplete', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render FavouritesAutoComplete without errors', () => {
    const wrapper = getWrapper(false);
    expect(wrapper).toBeDefined();
    expect(wrapper.find('ErrorText').exists()).toBe(false);
  });

  it('Should render FavouritesAutoComplete with errors', () => {
    const wrapper = getWrapper({ productError: 'product error' });
    expect(wrapper).toBeDefined();
    expect(wrapper.find('ErrorText').exists()).toBe(true);
    expect(wrapper.instance().getError()).toBe('product error');
  });

  it('Should render FavouritesAutoComplete with specific error message with a link', () => {
    const wrapper = getWrapper({ productError: 'error.favourite.any.invalid' });
    expect(wrapper).toBeDefined();
    expect(wrapper.find('ErrorText').exists()).toBeTruthy();
    expect(wrapper.find('a[href="/manage-favourites"]').text()).toBe('favourites');
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

      const wrapper = getWrapper(false);
      wrapper.instance().onConfirm(false);
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('Should noop when the parameter is false and no element is found', () => {
      mockGetElementsByName.mockReturnValue({ item: () => null});

      const wrapper = getWrapper(false);
      wrapper.instance().onConfirm(false);
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('Should call onChange when the parameter is valid', () => {
      const wrapper = getWrapper(false);
      wrapper.instance().onConfirm(true);
      expect(onChangeMock).toHaveBeenCalled();
    });

    it('Should only call onChange if a value is passed onConfirm', () => {
      const wrapper = getWrapper(false);
      wrapper.instance().onConfirm('some-value');
      expect(onChangeMock).toHaveBeenCalled();
    });

    it('should cancel the selection if the user clears the input field', () => {
      mockGetElementsByName.mockReturnValue({ item: () => ({
        value: ''
      })});
      const wrapper = getWrapper(false);
      wrapper.instance().onConfirm('');
      expect(onChangeMock).toHaveBeenCalledWith('');
    });

    it('Should call onChange when the parameter is an actual value', () => {
      const wrapper = getWrapper(false);
      wrapper
        .instance()
        .onConfirm('Atlantic cod (COD) Fresh, Filleted, 03044410');
      expect(onChangeMock).toHaveBeenCalledWith(
        {
          commodity_code: '03044410',
          commodity_code_description:
            'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
          id: 'PRD695',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          scientificName: 'Gadus morhua',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          state: 'FRE',
          stateLabel: 'Fresh',
        }
      );
    });

  });

  describe('#quickSearch', () => {

    const itShouldReturnArrayOfFishWithQuery = (query, expectFinal) =>
      it(`Should return and array of fish whose name includes the query ${query}`, () => {
        const wrapper = getWrapper(false, mockFavourites);
        const FavouritesAutoCompleteInstance =  wrapper.instance();

        const searchResult = FavouritesAutoCompleteInstance.quickSearch(query);
        expectFinal(searchResult);
      });

    itShouldReturnArrayOfFishWithQuery('A', (searchResult) => {
      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Atlantic cod (COD) Fresh, Filleted, 03044410');
      expect(searchResult[1]).toBe('Tadpole codling (SAO) Fresh, Gutted, headed and tailed, 03025990');
    });

    itShouldReturnArrayOfFishWithQuery('Z', (searchResult) => {
      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(0);
    });

    itShouldReturnArrayOfFishWithQuery('990', (searchResult) => {
      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(1);
      expect(searchResult[0]).toBe('Tadpole codling (SAO) Fresh, Gutted, headed and tailed, 03025990');
    });

    it('Should return and array of fish whose name includes the query FIL of differing ranks', () => {
      const favs = [
        {
          commodity_code: '03044410',
          commodity_code_description:
            'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
          id: 'PRD695',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          scientificName: 'Gadus morhua',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          state: 'FRE',
          stateLabel: 'Fresh',
        },
        {
          commodity_code: '03025990',
          commodity_code_description:
            'Fresh or chilled fish of the families Bregmacerotidae, Euclichthyidae, Gadidae, Macrouridae, Melanonidae, Merlucciidae, Moridae and Muraenolepididae (excl. cod, haddock, coalfish, hake, Alaska pollack, blue whitings, Boreogadus saida, whiting, pollack and ling)',
          id: 'PRD533',
          presentation: 'GHT',
          presentationLabel: 'Gutted, headed and tailed',
          scientificName: 'Salilota australis',
          species: 'Tadpole codling (FIL)',
          speciesCode: 'FIL',
          state: 'FRE',
          stateLabel: 'Fresh',
        },
      ];

      const wrapper = (error) => {

        return mount(
            <FavouritesAutocomplete
              error={error}
              label='label'
              name='cuttlefish'
              onChange={onChangeMock}
              defaultValue={''}
              allFavourites={favs}
            />
        );
      };

      const FavouritesAutoCompleteInstance = wrapper(false).instance();

      const searchResult = FavouritesAutoCompleteInstance.quickSearch('FIL');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Tadpole codling (FIL) Fresh, Gutted, headed and tailed, 03025990');
      expect(searchResult[1]).toBe('Atlantic cod (COD) Fresh, Filleted, 03044410');
    });

    it('Should return and array of fish whose name includes the query B of differing ranks', () => {
      const favs = [
        {
          commodity_code: '03044410',
          commodity_code_description:
            'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
          id: 'PRD695',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          scientificName: 'Gadus morhua',
          species: 'Atlantic cod (B)',
          speciesCode: 'B',
          state: 'FRE',
          stateLabel: 'Fresh',
        },
        {
          commodity_code: '03025990',
          commodity_code_description:
            'Fresh or chilled fish of the families Bregmacerotidae, Euclichthyidae, Gadidae, Macrouridae, Melanonidae, Merlucciidae, Moridae and Muraenolepididae (excl. cod, haddock, coalfish, hake, Alaska pollack, blue whitings, Boreogadus saida, whiting, pollack and ling)',
          id: 'PRD533',
          presentation: 'GHT',
          presentationLabel: 'Gutted, headed and tailed',
          scientificName: 'Salilota australis',
          species: 'Tadpole codling (SAO)',
          speciesCode: 'SAO',
          state: 'B',
          stateLabel: 'B',
        },
      ];

      const wrapper = (error) => {

        return mount(
            <FavouritesAutocomplete
              error={error}
              label='label'
              name='cuttlefish'
              onChange={onChangeMock}
              defaultValue={''}
              allFavourites={favs}
            />
        );
      };

      const FavouritesAutoCompleteInstance = wrapper(false).instance();

      const searchResult = FavouritesAutoCompleteInstance.quickSearch('B');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('Atlantic cod (B) Fresh, Filleted, 03044410');
      expect(searchResult[1]).toBe('Tadpole codling (SAO) B, Gutted, headed and tailed, 03025990');
    });

    it('Should return and array of fish whose name includes the query B of differing species name', () => {
      const favs = [
        {
          commodity_code: '03025990',
          commodity_code_description:
            'Fresh or chilled fish of the families Bregmacerotidae, Euclichthyidae, Gadidae, Macrouridae, Melanonidae, Merlucciidae, Moridae and Muraenolepididae (excl. cod, haddock, coalfish, hake, Alaska pollack, blue whitings, Boreogadus saida, whiting, pollack and ling)',
          id: 'PRD533',
          presentation: 'B',
          presentationLabel: 'B',
          scientificName: 'Salilota australis',
          species: 'BBBBA',
          speciesCode: 'SAO',
          state: '',
          stateLabel: '',
        },
        {
          commodity_code: '03025990',
          commodity_code_description:
            'Fresh or chilled fish of the families Bregmacerotidae, Euclichthyidae, Gadidae, Macrouridae, Melanonidae, Merlucciidae, Moridae and Muraenolepididae (excl. cod, haddock, coalfish, hake, Alaska pollack, blue whitings, Boreogadus saida, whiting, pollack and ling)',
          id: 'PRD533',
          presentation: 'B',
          presentationLabel: 'B',
          scientificName: 'Salilota australis',
          species: 'AAAAB',
          speciesCode: 'SAO',
          state: '',
          stateLabel: '',
        },
      ];

      const wrapper = (error) => {

        return mount(
            <FavouritesAutocomplete
              error={error}
              label='label'
              name='cuttlefish'
              onChange={onChangeMock}
              defaultValue={''}
              allFavourites={favs}
            />
        );
      };

      const FavouritesAutoCompleteInstance = wrapper(false).instance();

      const searchResult = FavouritesAutoCompleteInstance.quickSearch('B');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('AAAAB , B, 03025990');
      expect(searchResult[1]).toBe('BBBBA , B, 03025990');
    });


    it('Should return and array of fish whose name includes the query B of same everything', () => {
      const favs = [
        {
          commodity_code: '03025990',
          commodity_code_description:
            'Fresh or chilled fish of the families Bregmacerotidae, Euclichthyidae, Gadidae, Macrouridae, Melanonidae, Merlucciidae, Moridae and Muraenolepididae (excl. cod, haddock, coalfish, hake, Alaska pollack, blue whitings, Boreogadus saida, whiting, pollack and ling)',
          id: 'PRD533',
          presentation: 'B',
          presentationLabel: 'B',
          scientificName: 'Salilota australis',
          species: 'BBBB',
          speciesCode: 'SAO',
          state: '',
          stateLabel: '',
        },
        {
          commodity_code: '0302485374',
          commodity_code_description:
            'Some code',
          id: 'PRD535',
          presentation: 'Fresh',
          presentationLabel: 'Filleted',
          scientificName: 'Salilota australis',
          species: 'BBBB',
          speciesCode: 'SAO',
          state: '',
          stateLabel: '',
        },
      ];

      const wrapper = (error) => {

        return mount(
            <FavouritesAutocomplete
              error={error}
              label='label'
              name='cuttlefish'
              onChange={onChangeMock}
              defaultValue={''}
              allFavourites={favs}
            />
        );
      };

      const FavouritesAutoCompleteInstance = wrapper(false).instance();

      const searchResult = FavouritesAutoCompleteInstance.quickSearch('B');

      expect(searchResult).toBeInstanceOf(Array);
      expect(searchResult.length).toBe(2);
      expect(searchResult[0]).toBe('BBBB , B, 03025990');
      expect(searchResult[1]).toBe('BBBB , Filleted, 0302485374');
    });
  });

});