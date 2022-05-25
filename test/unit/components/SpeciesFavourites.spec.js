import React from 'react';
import { shallow, mount } from 'enzyme';
import SpeciesFavourites from '../../../src/client/components/SpeciesFavourites';
import { act } from 'react-dom/test-utils';
import * as ErrorUtils from '../../../src/client/pages/utils/errorUtils';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockAddSpeciesPerUser = jest.fn().mockResolvedValue({
  payload: {},
});
const mockShowSelectedFavourite = jest.fn();

const history = createMemoryHistory();

const getWrapper = (fullDepth = false, products = [], errors = {},) => {
  return fullDepth
    ? mount(
        <Router history={history}>
          <SpeciesFavourites
            addSpeciesPerUser={mockAddSpeciesPerUser}
            errors={errors}
            products={products}
            setSelectedSpeciesFavourite={mockShowSelectedFavourite}
            selectedSpeciesFavourite={undefined}
          />
        </Router>
      )
    : shallow(
        <Router history={history}>
          <SpeciesFavourites
            addSpeciesPerUser={mockAddSpeciesPerUser}
            errors={errors}
            products={products}
            setSelectedSpeciesFavourite={mockShowSelectedFavourite}
            selectedSpeciesFavourite={undefined}
          />
        </Router>
      );
};

describe('SpeciesFavourites', () => {
  it('should mount successfully', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
  });

  it('should generate snapshot for the Plane Details page', () => {
    const wrapper = getWrapper(true);
    const { container } = render(wrapper)
    
    expect(container).toMatchSnapshot();
  })

  it('should load with an initial state', () => {
    const wrapper = getWrapper(true);
    expect(wrapper.find('SpeciesFavourites').state()).toEqual({
      commodity_code: '',
      commodity_code_description: '',
      id: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      selectedFavourite: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      species: '',
      speciesCode: '',
      scientificName: '',
    });
  });

  it('should have an add product button', () => {
    const wrapper = getWrapper(true);
    const addBtn = wrapper.find('button#submit');
    expect(addBtn.exists()).toBeTruthy();
  });

  it('should add selected favourite to the products', () => {
    const wrapper = getWrapper(true);
    const addBtn = wrapper.find('button#submit');
    addBtn.simulate('click', {});

    expect(mockAddSpeciesPerUser).toHaveBeenCalled();
  });

  it('should set the correct state', () => {
    const initialState = {
      commodity_code: '',
      commodity_code_description: '',
      id: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      selectedFavourite:'',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      species: '',
      speciesCode: '',
      scientificName: '',
    };

    const wrapper = mount(
      <Router history={history}>
        <SpeciesFavourites
          addSpeciesPerUser={mockAddSpeciesPerUser}
          errors={{}}
          products={[]}
          setSelectedSpeciesFavourite={mockShowSelectedFavourite}
          selectedSpeciesFavourite={undefined}
        />
      </Router>
    );

    const component = wrapper.find('SpeciesFavourites');
    component.setState(initialState);

    const favouritesInput = wrapper.find('FavouritesAutocomplete');

    const expectedState = {
      commodity_code: 'some-code',
      commodity_code_description: '',
      id: '',
      selectedState: '',
      selectedStateLabel: 'state',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      selectedPresentation: '',
      selectedFavourite: 'some-specie state presentation some-code',
      selectedPresentationLabel: 'presentation',
      species: 'some-specie',
      speciesCode: '',
      scientificName: '',
    };

    act(() => {
      favouritesInput.prop('onChange')(expectedState);
    });
    expect(mockShowSelectedFavourite).toHaveBeenCalledWith(expectedState);
    expect(component.state()).toEqual(expectedState);
  });

  it('should assigned the default value for favouritesInput if selectedFavourite is empty' ,() => {

    const wrapper = mount(
      <Router history={history}>
        <SpeciesFavourites
          addSpeciesPerUser={mockAddSpeciesPerUser}
          errors={{}}
          products={[]}
          showSelectedFavourite= {mockShowSelectedFavourite}
          selectedSpeciesFavourite={{ selectedFavourite: 'some-specie state presentation some-cod'}}
        />
      </Router>
    );

    expect(wrapper.find('FavouritesAutocomplete').props().defaultValue).toEqual('some-specie state presentation some-cod');
  });

  it('should call ScrollToErrorIsland if an error is thrown', () => {
    const wrapper = mount(
      <Router history={history}>
        <SpeciesFavourites
          addSpeciesPerUser={mockAddSpeciesPerUser}
          errors={[{ product: 'Select a product favourite from the list' }]}
          products={[]}
          showSelectedFavourite ={mockShowSelectedFavourite}
          selectedSpeciesFavourite=''
        />
      </Router>
    );

    const mockScrollToErrorIsland = jest.spyOn(
      ErrorUtils,
      'scrollToErrorIsland'
    );

    mockAddSpeciesPerUser.mockImplementation(() => {
      throw 'error';
    });
    const addBtn = wrapper.find('button#submit');
    addBtn.simulate('click', {});

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });

  it('should render product errors if any', () => {
    const errors = {
      errors: [
        {
          targetName: 'product',
          text: 'Select a product favourite from the list',
        },
      ],
      productError: 'Select a product favourite from the list',
    };

    const wrapper = getWrapper(true, [], errors);

    expect(wrapper.find('FavouritesAutocomplete').props().error).toEqual(
      errors
    );
  });
});

describe('setSpecies', () => {
  it('Should set the selection to none when user clears the input', () => {
    const wrapper = getWrapper(true);
    const component = wrapper.find('SpeciesFavourites');
    const favouritesInput = wrapper.find('FavouritesAutocomplete');

    act(() => {
      favouritesInput.prop('onChange')();
    });
    expect(component.state().species).toEqual('');
  });
});
