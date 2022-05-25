import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import SpeciesBlock from '../../../src/client/components/SpeciesBlock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import * as ErrorUtils from '../../../src/client/pages/utils/errorUtils';

const mocksearchFishStates = jest.fn();
const mockClearErrors = jest.fn();
const mockCancelButtonHandler = jest.fn();
const mockgetCommodityCode = jest.fn();
const mockGetTheSpeciesName = jest.fn();
const mockAddSpeciesPerUser = jest.fn().mockResolvedValue({
  payload: {},
});
const mockEditAddedSpeciesPerUser = jest.fn().mockResolvedValue({
  payload: {},
});

const mockSetAddedSpecies = jest.fn();

const mockStore = configureStore([
  thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      },
    },
  }),
]);

const store = mockStore({
  global: {
    allFish: [
      {
        faoName: 'Albacore',
        scientificName: 'Thunnus alalunga',
        faoCode: 'ALB',
        rank: 10,
      },
    ],
    allVessels: [],
    allCountries: [],
  },
});

const getWrapper = (
  fullDepth = false,
  commodityCodes,
  errors = null,
  displayAddProduct = false
) => {
  const props = {
    errors: errors,
    clearErrors: mockClearErrors,
    cancelEditing: mockCancelButtonHandler,
    speciesStates: ['FRO', 'FRE'],
    speciesPresentations: ['FIL', 'GUT'],
    getCommodityCode: mockgetCommodityCode,
    commodityCodes: commodityCodes || ['1', '2', '3'],
    searchFishStates: mocksearchFishStates,
    fishStates: [
      {
        state: { value: 'FRO' },
        presentations: [{ value: 'BMS' }, { value: 'ALI' }],
      },
    ],
    addSpeciesUri: '/:documentNumber/what-are-you-exporting',
    displayAddProduct: displayAddProduct,
    addSpeciesPerUser: mockAddSpeciesPerUser,
    getTheSpeciesName: mockGetTheSpeciesName,
    editSpeciesPerUser: mockEditAddedSpeciesPerUser,
    onSubmitAction: '/orchestration/api/v1/fish/add',
    showAddToFavouritesCheckbox: true,
    setAddedSpecies: mockSetAddedSpecies
  };
  if (fullDepth) {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );
  } else {
    return shallow(
      <SpeciesBlock
        productId={1}
        errors={errors}
        speciesStates={['FRO', 'FRE']}
        speciesPresentations={['FIL', 'GUT']}
        getCommodityCode={mockgetCommodityCode}
        getTheSpeciesName = {mockGetTheSpeciesName}
        commodityCodes={commodityCodes || ['1', '2', '3']}
        searchFishStates={mocksearchFishStates}
        fishStates={[
          {
            state: { value: 'FRO' },
            presentations: [{ value: 'BMS' }, { value: 'ALI' }],
          },
        ]}
        addSpeciesUri="/:documentNumber/what-are-you-exporting"
        displayAddProduct={true}
        onSubmitAction='/orchestration/api/v1/fish/add'
        setAddedSpecies={mockSetAddedSpecies}
        cancelEditing={mockCancelButtonHandler}
      />
    );
  }
};

describe('SpeciesBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render species block with species select', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    expect(wrapper.find('Connect(SpeciesAutocomplete)').exists()).toBe(true);
  });

  it('should have an id on all inputs', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    expect(wrapper.find('#species').exists()).toBeTruthy();
  });

  it('should have a for attributeini on all input labels', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    expect(wrapper.find('#species').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('#species').props()['htmlFor']).toBe('species');
  });

  it('Should render presentation dropdown with options for the selectedState', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    wrapper.setState({ selectedState: 'FRO', species: 'GIANT CANNIBAL CARP' });

    const dropDown = wrapper.find('#state');
    expect(dropDown.exists()).toBe(true);
    expect(dropDown.props().options).toEqual([{ value: 'FRO' }]);
  });

  it('Should set the selectedPresentation', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#presentation');
    const event = {
      preventDefault() {},
      target: {
        0: {
          text: 'Alive',
        },
        value: 'ALI',
        selectedIndex: 0,
      },
    };
    dropDown.simulate('change', event);
    expect(dropDown.exists()).toBe(true);
    expect(wrapper.state().selectedPresentation).toBe('ALI');
    expect(wrapper.state().selectedPresentationLabel).toBe('Alive');
  });

  it('Should set the selectedState', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#state');
    dropDown.props().onChange({
      target: {
        0: {
          text: 'Fresh',
        },
        value: 'FRE',
        selectedIndex: 0,
      },
    });
    expect(wrapper.state().selectedState).toBe('FRE');
    expect(wrapper.state().selectedStateLabel).toBe('Fresh');
  });

  it('Should set the selectedState with no value', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#state');
    dropDown.props().onChange({
      target: {
        0: {
          text: undefined,
        },
        value: undefined,
        selectedIndex: 0,
      },
    });
    expect(wrapper.state().selectedState).toBe(undefined);
    expect(wrapper.state().selectedStateLabel).toBe(undefined);
  });

  it('Should render with nojsPresentationOptions', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    wrapper.setState({ selectedState: 'FRO' });
    wrapper.setProps({
      fishStates: [{ state: { value: 'FRO' }, presentations: false }],
    });
    wrapper.update();

    const dropDown = wrapper.find('#presentation');
    expect(dropDown.props().options).toEqual(['FIL', 'GUT']);
  });

  it('Should set the selectedCommodityCode', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#commodity_code');
    wrapper.setState({
      selectedState: 'FRO',
      species: 'GIANT CANNIBAL CARP',
      selectedPresentation: 'ALI',
    });
    dropDown.props().onChange({
      target: {
        0: {
          text: 'Descriptioooon of Commodity Code',
        },
        value: '123456',
        selectedIndex: 0,
      },
    });
    expect(wrapper.state().selectedCommodityCode).toBe('123456');
    expect(wrapper.state().selectedCommodityCodeLabel).toBe(
      'Descriptioooon of Commodity Code'
    );
  });

  it('Should set the selectedCommodityCode with no values', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#commodity_code');
    wrapper.setState({
      selectedState: 'FRO',
      species: 'GIANT CANNIBAL CARP',
      selectedPresentation: 'ALI',
    });
    dropDown.props().onChange({
      target: {
        0: {
          text: undefined,
        },
        value: undefined,
        selectedIndex: 0,
      },
    });
    expect(wrapper.state().selectedCommodityCode).toBe('');
    expect(wrapper.state().selectedCommodityCodeLabel).toBe('');
  });

  it('Should have add product button', () => {
    const wrapper = getWrapper();
    const addBtn = wrapper.find('button#submit');

    expect(addBtn.exists()).toBeTruthy();
    expect(addBtn.prop('className')).toBe('button');
  });

  it('Should not have an add product button', () => {
    const wrapper = getWrapper(true);
    const addBtn = wrapper.find('button#submit');
    expect(addBtn.exists()).toBeFalsy();
  });

  it('should add a product', () => {
    const wrapper = getWrapper(true, [], {}, true);

    const addBtn = wrapper.find('button#submit');
    addBtn.simulate('click', {});

    expect(mockAddSpeciesPerUser).toHaveBeenCalled();
  });

  it('should include Call addToFavourites when calling addSpeciesPerUser', () => {
    const wrapper = getWrapper(true, [], {}, true);

    const addBtn = wrapper.find('button#submit');
    addBtn.simulate('click', {});

    expect(mockAddSpeciesPerUser).toBeCalledWith({
        addToFavourites: false,
        btn_submit: '',
        commodity_code: '',
        commodity_code_description: '',
        presentation: '',
        presentationLabel: '',
        redirect: '/create-catch-certificate/:documentNumber/what-are-you-exporting',
        scientificName: '',
        species: '',
        speciesCode: '',
        state: '',
        stateLabel: '',
      }
      ,undefined
    );
  });

  it('should update a product', () => {
    const props = {
      errors: {},
      clearErrors: mockClearErrors,
      cancelEditing: mockCancelButtonHandler,
      speciesStates: ['FRO', 'FRE'],
      speciesPresentations: ['FIL', 'GUT'],
      getCommodityCode: mockgetCommodityCode,
      commodityCodes: ['1', '2', '3'],
      searchFishStates: mocksearchFishStates,
      fishStates: [
        {
          state: { value: 'FRO' },
          presentations: [{ value: 'BMS' }, { value: 'ALI' }],
        },
      ],
      addSpeciesUri: '/:documentNumber/what-are-you-exporting',
      products: [{
        id: '1',
        species: 'Atlantic Cod (COD)',
        speciesCode: 'COD',
        scientificName: 'some-scientic-name',
        state: 'FRE',
        stateLabel: 'Fresh',
        presentation: 'WHL',
        presentationLabel: 'Whole',
        commodity_code: '03232342',
        commodity_code_description: 'some description',
        addToFavourites: false
      }],
      productId: '1',
      displayAddProduct: true,
      addSpeciesPerUser: mockAddSpeciesPerUser,
      setAddedSpecies: mockSetAddedSpecies,
      editAddedSpeciesPerUser: mockEditAddedSpeciesPerUser,
      onSubmitAction: '/orchestration/api/v1/fish/add'
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );

    const updateButton = wrapper.find('button#submit');
    updateButton.simulate('click', {});

    expect(mockEditAddedSpeciesPerUser).toHaveBeenCalled();
  });

  it('should reset editMode and productId after updating a product', () => {

    const props = {
      clearErrors: mockClearErrors,
      cancelEditing: mockCancelButtonHandler,
      speciesStates: ['FRO', 'FRE'],
      speciesPresentations: ['FIL', 'GUT'],
      getCommodityCode: mockgetCommodityCode,
      commodityCodes: ['1', '2', '3'],
      searchFishStates: mocksearchFishStates,
      fishStates: [
        {
          state: { value: 'FRO' },
          presentations: [{ value: 'BMS' }, { value: 'ALI' }],
        },
      ],
      addSpeciesUri: '/:documentNumber/what-are-you-exporting',
      products: [{
        id: '1',
        species: 'Atlantic Cod (COD)',
        speciesCode: 'COD',
        scientificName: 'some-scientic-name',
        state: 'FRE',
        stateLabel: 'Fresh',
        presentation: 'WHL',
        presentationLabel: 'Whole',
        commodity_code: '03232342',
        commodity_code_description: 'some description',
        addToFavourites: false
       }],
      productId: '1',
      displayAddProduct: true,
      addSpeciesPerUser: mockAddSpeciesPerUser,
      getTheSpeciesName: mockGetTheSpeciesName,
      editAddedSpeciesPerUser: mockEditAddedSpeciesPerUser,
      onSubmitAction: '/orchestration/api/v1/fish/add'
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );

    const updateButton = wrapper.find('button#submit');
    updateButton.simulate('click', { preventDefault: () => { } });

    expect(mockEditAddedSpeciesPerUser).toHaveBeenCalled();
    expect(wrapper.prop('productId')).toBeUndefined();
  });

  it('should clear previous errors when we enter edit mode', () => {
    const mockSetEditModeForMultipleEditing = jest.fn();
    const props = {
      errors: { errors: [{speciesError: 'Enter the common name or FAO code'}]},
      clearErrors: mockClearErrors,
      cancelEditing: mockCancelButtonHandler,
      speciesStates: ['FRO', 'FRE'],
      speciesPresentations: ['FIL', 'GUT'],
      getCommodityCode: mockgetCommodityCode,
      commodityCodes: ['1', '2', '3'],
      searchFishStates: mocksearchFishStates,
      fishStates: [
        {
          state: { value: 'FRO' },
          presentations: [{ value: 'BMS' }, { value: 'ALI' }],
        },
      ],
      addSpeciesUri: '/:documentNumber/what-are-you-exporting',
      products: [{ id: '1' }],
      productId: '99',
      displayAddProduct: true,
      addSpeciesPerUser: mockAddSpeciesPerUser,
      setAddedSpecies: mockSetAddedSpecies,
      editAddedSpeciesPerUser: mockEditAddedSpeciesPerUser,
      setEditModeForMultipleEditing: mockSetEditModeForMultipleEditing,
      onSubmitAction: '/orchestration/api/v1/fish/add'
    };

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('SpeciesBlock').instance().componentDidUpdate({ productId: '000'});

    expect(mockClearErrors).toHaveBeenCalled();

  });

  it('should not call editAddedSpeciesPerUser when the product to be updated does not exist on the products list', () => {
    const mockSetEditModeForMultipleEditing = jest.fn();
    const props = {
      clearErrors: mockClearErrors,
      cancelEditing: mockCancelButtonHandler,
      speciesStates: ['FRO', 'FRE'],
      speciesPresentations: ['FIL', 'GUT'],
      getCommodityCode: mockgetCommodityCode,
      commodityCodes: ['1', '2', '3'],
      searchFishStates: mocksearchFishStates,
      fishStates: [
        {
          state: { value: 'FRO' },
          presentations: [{ value: 'BMS' }, { value: 'ALI' }],
        },
      ],
      addSpeciesUri: '/:documentNumber/what-are-you-exporting',
      products: [{ id: '1' }],
      productId: '2',
      displayAddProduct: true,
      addSpeciesPerUser: mockAddSpeciesPerUser,
      setAddedSpecies: mockSetAddedSpecies,
      editAddedSpeciesPerUser: mockEditAddedSpeciesPerUser,
      setEditModeForMultipleEditing: mockSetEditModeForMultipleEditing,
      onSubmitAction: '/orchestration/api/v1/fish/add'
    };
    const wrapper = shallow(<SpeciesBlock {...props} />);

    wrapper.setProps({ products: [{ id: '1' }, { id: '5' }], productId: '2' });

    expect(mockSetEditModeForMultipleEditing).not.toHaveBeenCalled();

  });

  it('should clear the state when the user clicks remove during editMode', () => {
    const props = {
      clearErrors: mockClearErrors,
      cancelEditing: mockCancelButtonHandler,
      speciesStates: ['FRO', 'FRE'],
      speciesPresentations: ['FIL', 'GUT'],
      getCommodityCode: mockgetCommodityCode,
      commodityCodes: ['1', '2', '3'],
      searchFishStates: mocksearchFishStates,
      fishStates: [
        {
          state: { value: 'FRO' },
          presentations: [{ value: 'BMS' }, { value: 'ALI' }],
        },
      ],
      addSpeciesUri: '/:documentNumber/what-are-you-exporting',
      products: [{
        id: '1',
        species: '',
        speciesCode: '',
        scientificName: '',
        state: '',
        stateLabel: '',
        presentation: '',
        presentationLabel: '',
        commodity_code: '',
        commodity_code_description: '',
        addToFavourites: false
      }],
      productId: undefined,
      displayAddProduct: true,
      addSpeciesPerUser: mockAddSpeciesPerUser,
      setAddedSpecies: mockSetAddedSpecies,
      editAddedSpeciesPerUser: mockEditAddedSpeciesPerUser,
      onSubmitAction: '/orchestration/api/v1/fish/add'
    };

    jest.spyOn(document, 'getElementsByName').mockImplementation(() => [
      {
        value: '',
        click: jest.fn(),
        focus: jest.fn(),
        blur: jest.fn(),
      },
    ]);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('SpeciesBlock').state()).toEqual({
      addToFavourites: false,
      id: '',
      species: '',
      speciesCode: '',
      scientificName: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      commodityCodes: [],
    });
  });

  it('should call cancelEditing when the species name is changed', () => {

    const mockCancelEditing = jest.fn();

    const props = {
      primaryButtonLabel: 'Add Product',
      clearErrors: mockClearErrors,
      cancelEditing: mockCancelEditing,
      speciesStates: ['FRO', 'FRE'],
      speciesPresentations: ['FIL', 'GUT'],
      getCommodityCode: mockgetCommodityCode,
      commodityCodes: ['1', '2', '3'],
      searchFishStates: mocksearchFishStates,
      fishStates: [
        {
          state: { value: 'FRO' },
          presentations: [{ value: 'BMS' }, { value: 'ALI' }],
        },
      ],
      addSpeciesUri: '/:documentNumber/what-are-you-exporting',
      productId: '1',
      displayAddProduct: true,
      addSpeciesPerUser: mockAddSpeciesPerUser,
      setAddedSpecies: mockSetAddedSpecies,
      editAddedSpeciesPerUser: mockEditAddedSpeciesPerUser,
      onSubmitAction: '/orchestration/api/v1/fish/add'
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock {...props} />
        </MemoryRouter>
      </Provider>
    );

    const speciesInput = wrapper.find('SpeciesAutocomplete');


    act(() => {
      speciesInput.prop('onChange')({target: {
        value: ''
      }} );
    });

    expect(mockCancelEditing).toHaveBeenCalled();
    expect(wrapper.find('button#submit').text()).toBe(props.primaryButtonLabel);
  });

  it('should not add two products on double click - added to fix an automation test', () => {
    const wrapper = getWrapper(true, [], {}, true);

    const addBtn = wrapper.find('button#submit');

    addBtn.simulate('click', {});
    addBtn.simulate('click', {});

    expect(mockAddSpeciesPerUser).toHaveBeenCalledTimes(1);
  });

  it('should not clear state after clearing selection', () => {
    const mockSpy = jest.fn().mockResolvedValue({});
    const initialState = {
      species: 'COD',
      scientificName: 'some-scitific-name',
      selectedState: 'some-state',
      selectedStateLabel: 'some-state-label',
      selectedPresentation: 'some-presentation',
      selectedPresentationLabel: 'some-presentation-label',
      selectedCommodityCode: 'some-commodity-code',
      selectedCommodityCodeLabel: 'some-commodity-code-label',
      commodityCodes: [{ value: 'value', label: 'label' }],
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock
            errors={{}}
            speciesStates={['FRO', 'FRE']}
            clearErrors={mockClearErrors}
            speciesPresentations={['FIL', 'GUT']}
            getCommodityCode={mockgetCommodityCode}
            getTheSpeciesName = {mockGetTheSpeciesName}
            commodityCodes={[]}
            searchFishStates={mocksearchFishStates}
            fishStates={[
              {
                state: { value: 'FRO' },
                presentations: [{ value: 'BMS' }, { value: 'ALI' }],
              },
            ]}
            addSpeciesUri="/:documentNumber/what-are-you-exporting"
            displayAddProduct={true}
            addSpeciesPerUser={mockSpy}
            setAddedSpecies={mockSetAddedSpecies}
            onSubmitAction='/orchestration/api/v1/fish/add'
          />
        </MemoryRouter>
      </Provider>
    );

    const component = wrapper.find('SpeciesBlock');
    component.setState(initialState);

    const addBtn = wrapper.find('button#submit');
    addBtn.simulate('click', {});

    expect(mockSpy).toHaveBeenCalled();
  });

  it('Should have cancel button', () => {
    const wrapper = getWrapper();
    const cancelBtn = wrapper.find('#cancel');

    expect(cancelBtn.exists()).toBeTruthy();
  });

  it('Should clear errors when cancel button is pressed', () => {
    jest.spyOn(document, 'getElementsByName').mockImplementation(() => [
      {
        value: '',
        click: jest.fn(),
        focus: jest.fn(),
        blur: jest.fn(),
      },
    ]);
    const wrapper = getWrapper(true, [], {
      presentationError: 'some-error',
    });

    expect(wrapper.find('Select#presentation').prop('error')).toEqual('some-error');


    const cancelBtn = wrapper.find('Button').first();
    cancelBtn.simulate('click', { preventDefault: () => {} });

    expect(mockClearErrors).toHaveBeenCalled();
  });

  it('Should cancel edit mode when cancel button is pressed', () => {
    jest.spyOn(document, 'getElementsByName').mockImplementation(() => [
      {
        value: '',
        click: jest.fn(),
        focus: jest.fn(),
        blur: jest.fn(),
      },
    ]);
    const wrapper = getWrapper(true);

    const cancelBtn = wrapper.find('Button').first();
    cancelBtn.simulate('click', { preventDefault: () => {} });

    expect(mockCancelButtonHandler).toHaveBeenCalled();
  });

  it('Should clear state', () => {
    jest.spyOn(document, 'getElementsByName').mockImplementation(() => [
      {
        value: '',
        click: jest.fn(),
        focus: jest.fn(),
        blur: jest.fn(),
      },
    ]);

    const initialState = {
      id: 'some-id',
      species: 'Atlantic Cod',
      speciesCode: 'COD',
      scientificName: 'some-scitific-name',
      selectedState: 'some-state',
      selectedStateLabel: 'some-state-label',
      selectedPresentation: 'some-presentation',
      selectedPresentationLabel: 'some-presentation-label',
      selectedCommodityCode: 'some-commodity-code',
      selectedCommodityCodeLabel: 'some-commodity-code-label',
      commodityCodes: [{ value: 'value', label: 'label' }],
    };
    const wrapper = getWrapper(true);
    const component = wrapper.find('SpeciesBlock');
    component.setState(initialState);

    expect(component.state()).toEqual({
      addToFavourites: false,
      id: 'some-id',
      species: 'Atlantic Cod',
      speciesCode: 'COD',
      scientificName: 'some-scitific-name',
      selectedState: 'some-state',
      selectedStateLabel: 'some-state-label',
      selectedPresentation: 'some-presentation',
      selectedPresentationLabel: 'some-presentation-label',
      selectedCommodityCode: 'some-commodity-code',
      selectedCommodityCodeLabel: 'some-commodity-code-label',
      commodityCodes: [{ value: 'value', label: 'label' }],
    });

    const cancelBtn = wrapper.find('Button').first();
    cancelBtn.simulate('click', { preventDefault: () => {} });

    expect(cancelBtn.exists()).toBeTruthy();

    expect(component.state()).toEqual({
      addToFavourites: false,
      id:'',
      species: '',
      speciesCode: '',
      scientificName: '',
      selectedState: '',
      selectedStateLabel: '',
      selectedPresentation: '',
      selectedPresentationLabel: '',
      selectedCommodityCode: '',
      selectedCommodityCodeLabel: '',
      commodityCodes: [],
    });
  });

  it('Should show an error on state', () => {
    const wrapper = getWrapper(true, [], {
      stateError: 'some-error',
    });

    expect(wrapper.find('Select#state').prop('error')).toEqual(
      'some-error'
    );
  });

  it('Should show an error on presentation', () => {
    const wrapper = getWrapper(true, [], {
      presentationError: 'some-error',
    });

    expect(wrapper.find('Select#presentation').prop('error')).toEqual(
      'some-error'
    );
  });

  it('Should show an error on commodity codes', () => {
    const wrapper = getWrapper(true, [], {
      'commodity_codeError': 'some-error',
    });

    expect(wrapper.find('Select#commodity_code').exists()).toBeTruthy();
  });

  it('should render with no fish states', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock
            errors={{}}
            speciesStates={['FRO', 'FRE']}
            speciesPresentations={['FIL', 'GUT']}
            getCommodityCode={mockgetCommodityCode}
            commodityCodes={[]}
            searchFishStates={mocksearchFishStates}
            fishStates={[]}
            addSpeciesUri="/:documentNumber/what-are-you-exporting"
            displayAddProduct={true}
            addSpeciesPerUser={mockAddSpeciesPerUser}
            onSubmitAction='/orchestration/api/v1/fish/add'
            setAddedSpecies={mockSetAddedSpecies}
          />
        </MemoryRouter>
      </Provider>
    );

    const component = wrapper.find('SpeciesBlock');
    component.setState({ species: 'HER' });

    wrapper.mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock
            errors={{}}
            speciesStates={['FRO', 'FRE']}
            speciesPresentations={['FIL', 'GUT']}
            getCommodityCode={mockgetCommodityCode}
            commodityCodes={[]}
            searchFishStates={mocksearchFishStates}
            fishStates={[]}
            addSpeciesUri="/:documentNumber/what-are-you-exporting"
            displayAddProduct={true}
            addSpeciesPerUser={mockAddSpeciesPerUser}
            setAddedSpecies={mockSetAddedSpecies}
            onSubmitAction='/orchestration/api/v1/fish/add'
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
  });

  it('should render with no species presentations', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock
            errors={{}}
            speciesStates={['FRO', 'FRE']}
            speciesPresentations={[]}
            getCommodityCode={mockgetCommodityCode}
            commodityCodes={[]}
            searchFishStates={mocksearchFishStates}
            fishStates={[
              {
                state: {
                  value: '',
                  presentations: [
                    {
                      value: 'FRE',
                    },
                  ],
                },
              },
            ]}
            addSpeciesUri="/:documentNumber/what-are-you-exporting"
            displayAddProduct={true}
            addSpeciesPerUser={mockAddSpeciesPerUser}
            setAddedSpecies={mockSetAddedSpecies}
            onSubmitAction='/orchestration/api/v1/fish/add'
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
  });

  describe('setSpecies', () => {
    it('Should set species and speciesCode state values', async () => {
      const wrapper = getWrapper();
      await wrapper.instance().setSpecies('Barracuda', { faoCode: 'BAZ' });
      expect(wrapper.state('species')).toEqual('Barracuda');
      expect(mocksearchFishStates).toHaveBeenCalled();
      expect(wrapper.state('speciesCode')).toEqual('BAZ');
    });

    it('Should set both species and speciesCode state values to the speciesName', async () => {
      const wrapper = getWrapper();
      await wrapper.instance().setSpecies('Barracuda');
      expect(wrapper.state('species')).toEqual('Barracuda');
      expect(mocksearchFishStates).toHaveBeenCalled();
      expect(wrapper.state('speciesCode')).toEqual('Barracuda');
    });

    it('Should set the selection to none when user clears the input', async () => {
      const wrapper = getWrapper();
      await wrapper.instance().setSpecies('');
      expect(wrapper.state('species')).toEqual('');
      expect(mocksearchFishStates).not.toHaveBeenCalled();
    });
  });

  describe('getCommodityCodes', () => {
    it('Should get the CommodityCodes', async () => {
      const wrapper = getWrapper();
      wrapper.setState({
        selectedState: 'FRO',
        speciesCode: 'GIANT CANNIBAL CARP',
        selectedPresentation: 'ALI',
      });
      await wrapper.instance().getCommodityCodes('FRO','ALI');
      expect(mockgetCommodityCode).toHaveBeenCalled();
    });
  });

  it('Should unselect presentation and commodity code when State is selected', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#state');
    const event = {
      preventDefault() {},
      target: {
        0: {
          text: 'Fresh',
        },
        value: 'FRE',
        selectedIndex: 0,
      },
    };
    dropDown.simulate('change', event);
    expect(wrapper.state().selectedPresentation).toBe('');
    expect(wrapper.state().selectedPresentationLabel).toBe('');
    expect(wrapper.state().selectedCommodityCode).toBe('');
    expect(wrapper.state().commodityCodes).toEqual([]);
  });

  it('Should set selectedCommodityCode when there is a single commodity code and selected presentation', async () => {
    const wrapper = getWrapper(false, [ {value: 'some-commodity-code', label: 'some-commodity-label'}]);
    wrapper.setState({
      selectedState: 'FRO',
      speciesCode: 'GIANT CANNIBAL CARP',
      selectedPresentation: 'ALI',
    });

    await wrapper.instance().getCommodityCodes('FRO','ALI');

    expect(wrapper.state().selectedPresentation).toBe('ALI');
    expect(wrapper.state().selectedPresentationLabel).toBe('');
    expect(wrapper.state().selectedCommodityCode).toBe('some-commodity-code');
    expect(wrapper.state().selectedCommodityCodeLabel).toBe('some-commodity-label');
    expect(wrapper.state().commodityCodes).toEqual([{value: 'some-commodity-code', label: 'some-commodity-label'}]);
  });

  it('Should not set selectedCommodityCode when there is a single commodity code but no selected presentation', async () => {
    const wrapper = getWrapper(false, [ {value: 'some-commodity-code', label: 'some-commodity-label'}]);
    wrapper.setState({
      selectedState: 'FRO',
      speciesCode: 'GIANT CANNIBAL CARP',
      selectedPresentation: '',
    });

    await wrapper.instance().getCommodityCodes('FRO','');

    expect(wrapper.state().selectedPresentation).toBe('');
    expect(wrapper.state().selectedCommodityCode).not.toBe('some-commodity-code');
    expect(wrapper.state().selectedCommodityCode).toBe('');
    expect(wrapper.state().selectedCommodityCodeLabel).not.toBe('some-commodity-label');
    expect(wrapper.state().selectedCommodityCodeLabel).toBe('');
    expect(wrapper.state().commodityCodes).toEqual([]);
  });

  it('Should unselect commodity code when Presentation goes back to default', () => {
    const wrapper = getWrapper();
    const dropDown = wrapper.find('#presentation');
    const event = {
      preventDefault() {},
      target: {
        0: {
          text: 'Alive',
        },
        value: 'ALI',
        selectedIndex: 0,
      },
    };
    dropDown.simulate('change', event);
    expect(wrapper.state().selectedCommodityCode).toBe('');
    expect(wrapper.state().commodityCodes).toEqual([]);
  });

  it('should set the default value for the species autocomplete', () => {
    const wrapper = getWrapper(true);

    wrapper.find('SpeciesBlock').setState({
      species: 'Aardvark'
    });

    expect(wrapper.find('SpeciesAutocomplete').prop('defaultValue')).toBe('Aardvark');
  });

  describe('when adding favourites', () => {

    const mockAddFavourite = jest.fn();
    const mockClearErrors = jest.fn();
    const mockScrollToErrorIsland = jest.spyOn(ErrorUtils, 'scrollToErrorIsland');
    mockScrollToErrorIsland.mockReturnValue(null);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SpeciesBlock
            errors={{}}
            speciesStates={['FRO', 'FRE']}
            speciesPresentations={['FIL', 'GUT']}
            getCommodityCode={mockgetCommodityCode}
            commodityCodes={[]}
            searchFishStates={mocksearchFishStates}
            fishStates={[
              {
                state: {
                  value: '',
                  presentations: [
                    {
                      value: 'FRE',
                    },
                  ],
                },
              },
            ]}
            addSpeciesUri="/:documentNumber/what-are-you-exporting"
            displayAddProduct={true}
            addSpeciesPerUser={mockAddSpeciesPerUser}
            setAddedSpecies={mockSetAddedSpecies}
            onSubmitAction='/orchestration/api/v1/favourites'
            addFavourite={mockAddFavourite}
            clearErrors={mockClearErrors}
            showAddToFavouritesCheckbox={true}
          />
        </MemoryRouter>
      </Provider>
    );

    const state = {
      id: '',
      addToFavourites: false,
      selectedPresentation: 'WHO',
      selectedPresentationLabel: 'Whole',
      species: 'COD',
      speciesCode: 'Atlantic Cod',
      selectedState: 'FRE',
      selectedStateLabel: 'Fresh',
      scientificName: 'Gadhus morhua',
      selectedCommodityCode: '03025110',
      selectedCommodityCodeLabel: '03025110 - Fresh or chilled cod "Gadhus morhua"',
      commodityCodes: []
    };

    const instance = wrapper.find('SpeciesBlock').instance();
    instance.setState(state);

    beforeEach(() => {
      mockAddFavourite.mockReset();
      mockClearErrors.mockReset();

      mockScrollToErrorIsland.mockReset();
      mockScrollToErrorIsland.mockImplementation(() => null);
    });

    it('should clear any errors', async () => {
      await act(async () => {
        await instance.onSubmit({preventDefault: jest.fn()});
      });

      expect(mockClearErrors).toHaveBeenCalledTimes(1);
    });

    it('should call the add favourite prop', async () => {
      await act(async () => {
        await instance.onSubmit({preventDefault: jest.fn()});
      });

      expect(mockAddFavourite).toHaveBeenCalledWith(
        {
          presentation: state.selectedPresentation,
          presentationLabel: state.selectedPresentationLabel,
          species: state.species,
          speciesCode: state.speciesCode,
          state: state.selectedState,
          stateLabel: state.selectedStateLabel,
          scientificName: state.scientificName,
          commodity_code: state.selectedCommodityCode,
          commodity_code_description: 'Fresh or chilled cod "Gadhus morhua"'
        }
      );
    });

    it('should catch any errors and scroll to the error island', async () => {
      mockAddFavourite.mockRejectedValue('error');

      await act(async () => {
        await instance.onSubmit({preventDefault: jest.fn()});
      });

      expect(mockScrollToErrorIsland).toHaveBeenCalled();
    });

    it('should maintain the state if the add favourite call doesnt return a payload', async () => {
      await act(async () => {
        await instance.onSubmit({preventDefault: jest.fn()});
      });

      expect(instance.state).toStrictEqual(state);
    });

    it('should clear the state if the add favourite call returns a response', async () => {
      mockAddFavourite.mockResolvedValue(['FISH1', 'FISH2']);

      await act(async () => {
        await instance.onSubmit({preventDefault: jest.fn()});
      });

      expect(instance.state).toStrictEqual({
        addToFavourites: false,
        id: '',
        species: '',
        speciesCode: '',
        scientificName: '',
        selectedState: '',
        selectedStateLabel: '',
        selectedPresentation: '',
        selectedPresentationLabel: '',
        selectedCommodityCode: '',
        selectedCommodityCodeLabel: '',
        commodityCodes: [],
      });
    });

    describe('Add Favourites :: Checkbox',()=>{


    it('should have a checkbox', ()=>{
      expect(wrapper.find('input#addToFavourites')).toHaveLength(1);
    });

    it('should have a checkbox unchecked by default', ()=>{
      expect(wrapper.find('input#addToFavourites').value).toBeFalsy();
    });

    it('should have a checkbox with proper label', ()=>{
      expect(wrapper.find('label#label-addToFavourites span').text()).toContain('Add to product favourites');
    });

    it('should call checkbox onChange handler', () => {
      wrapper.find('SpeciesBlock').setState({addToFavourites: false});
      act(() =>
        wrapper.find('input#addToFavourites').prop('onChange')({
          currentTarget: {
            checked: true,
          },
        })
      );
      expect(wrapper.find('SpeciesBlock').state()).toBeTruthy();
    });

    it('should update the value of checkbox and call the handler', () => {
      expect(wrapper.find('input#addToFavourites').value).toBeFalsy();
      act(() =>
        wrapper.find('input#addToFavourites').prop('onChange')({
          currentTarget: {
            checked: true,
          },
        })
      );
      wrapper.mount();
      expect(wrapper.find('input#addToFavourites').props().value).toBeTruthy();
    });
  });

});


});