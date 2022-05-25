import React from 'react';
import { mount } from 'enzyme';
import AddAddressForm from '../../../src/client/components/AddAddressForm';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';

describe('AddAddressForm', () => {

  const mockStore = configureStore([thunk.withExtraArgument({
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
      }
    }
  })]);

  const store = mockStore({
    preSelected: {
      building_name: 'LANCASTER HOUSE',
      city: 'NEWCASTLE UPON TYNE',
      country: 'ENGLAND',
      county: 'TYNESIDE',
      postCode: 'NE4 7YH',
      street_name: 'HAMPSHIRE COURT',
      sub_building_name: 'sub building name',
      building_number: 'building number'
    }
  });

  const props = {
    countries: ['Brazil', 'UK'],
    errors: {},
    preSelected: {
      building_name: 'LANCASTER HOUSE',
      city: 'NEWCASTLE UPON TYNE',
      country: 'ENGLAND',
      county: 'TYNESIDE',
      postCode: 'NE4 7YH',
      street_name: 'HAMPSHIRE COURT',
      sub_building_name: 'sub building name',
      building_number: 'building number'
    },
    handleCancelButton: jest.fn()
  };
  const wrapper = mount(
    <Provider store={store}>
        <MemoryRouter>
          <AddAddressForm {...props}/>
        </MemoryRouter>
      </Provider>

    );

  it('Should render the AddAddressForm component', () => {
    expect(wrapper).toBeDefined();

  });

  it('should have an id on all inputs', () => {
    expect(wrapper.find('input[id="subBuildingName"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="buildingNumber"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="buildingName"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="postcode"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="streetName"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="townCity"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="postcode"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="county"]').exists()).toBeTruthy();
    expect(wrapper.find('input[id="country"]').exists()).toBeTruthy();
  });

  it('should have a for attribute on all input labels', () => {
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(0).props()['htmlFor']).toBe('subBuildingName');
    expect(wrapper.find('label').at(1).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(1).props()['htmlFor']).toBe('buildingNumber');
    expect(wrapper.find('label').at(2).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(2).props()['htmlFor']).toBe('buildingName');
    expect(wrapper.find('label').at(3).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(3).props()['htmlFor']).toBe('streetName');
    expect(wrapper.find('label').at(4).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(4).props()['htmlFor']).toBe('townCity');
    expect(wrapper.find('label').at(5).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(5).props()['htmlFor']).toBe('county');
    expect(wrapper.find('label').at(6).props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').at(6).props()['htmlFor']).toBe('postcode');

  });

  it('will set the AccessibleAutoComplete component', () => {
    expect(wrapper.find('AccessibleAutoComplete').exists()).toBeTruthy();
    expect(wrapper.find('AccessibleAutoComplete[id="country"]').exists()).toBeTruthy();
  });

  it('should find the cancel and submit exporter address buttons', () => {
    expect(wrapper.find('button#cancel').exists()).toBeTruthy();
    expect(wrapper.find('button#submit').exists()).toBeTruthy();
  });

  it('should find the the fields with the preselected address', () => {
    expect(wrapper.find('input[id="subBuildingName"]').instance().value).toEqual('sub building name');
    expect(wrapper.find('input[id="buildingNumber"]').instance().value).toEqual('building number');
    expect(wrapper.find('input[id="buildingName"]').instance().value).toEqual('LANCASTER HOUSE');
    expect(wrapper.find('input[id="streetName"]').instance().value).toEqual('HAMPSHIRE COURT');
    expect(wrapper.find('input[id="townCity"]').instance().value).toEqual('NEWCASTLE UPON TYNE');
    expect(wrapper.find('input[id="county"]').instance().value).toEqual('TYNESIDE');
    expect(wrapper.find('input[id="postcode"]').instance().value).toEqual('NE4 7YH');
    expect(wrapper.find('input[id="country"]').instance().value).toEqual('ENGLAND');
  });

  it('should handle change on the fields', () => {
    wrapper.find('input[name="subBuildingName"]').simulate('change', { target: { name: 'subBuildingName', value: 'Flat 1' } });
    expect(wrapper.find('input[name="subBuildingName"]').instance().value).toEqual('Flat 1');


    wrapper.find('input[name="buildingNumber"]').simulate('change', { target: { name: 'buildingNumber', value: '11' } });
    expect(wrapper.find('input[name="buildingNumber"]').instance().value).toEqual('11');

    wrapper.find('input[name="buildingName"]').simulate('change', { target: { name: 'buildingName', value: 'Winter house' } });
    expect(wrapper.find('input[name="buildingName"]').instance().value).toEqual('Winter house');

    wrapper.find('input[name="streetName"]').simulate('change', { target: { name: 'streetName', value: 'Water of Leith' } });
    expect(wrapper.find('input[name="streetName"]').instance().value).toEqual('Water of Leith');

    wrapper.find('input[name="townCity"]').simulate('change', { target: { name: 'townCity', value: 'Edinburgh' } });
    expect(wrapper.find('input[name="townCity"]').instance().value).toEqual('Edinburgh');

    wrapper.find('input[name="county"]').simulate('change', { target: { name: 'county', value: 'Midlothian' } });
    expect(wrapper.find('input[name="county"]').instance().value).toEqual('Midlothian');

    wrapper.find('input[name="postcode"]').simulate('change', { target: { name: 'postcode', value: 'EH1 2EH' } });
    expect(wrapper.find('input[name="postcode"]').instance().value).toEqual('EH1 2EH');

    wrapper.find('input[name="country"]').simulate('change', { target: { name: 'county', value: 'Scotland' } });
    expect(wrapper.find('input[name="country"]').instance().value).toEqual('Scotland');

    wrapper.find('input[name="country"]').simulate('blur', { target: { name: 'county', value: 'Scotland' } });
    expect(wrapper.find('input[name="country"]').instance().value).toEqual('Scotland');

  });



  it('should handle blur on the fields', () => {

    wrapper.find('input[name="subBuildingName"]').simulate('blur', { target: { name: 'subBuildingName', value: 'Flat 1' } });
    expect(wrapper.find('input[name="subBuildingName"]').instance().value).toEqual('Flat 1');

    wrapper.find('input[name="buildingNumber"]').simulate('blur', { target: { name: 'buildingNumber', value: '11' } });
    expect(wrapper.find('input[name="buildingNumber"]').instance().value).toEqual('11');

    wrapper.find('input[name="buildingName"]').simulate('blur', { target: { name: 'buildingName', value: 'Winter house' } });
    expect(wrapper.find('input[name="buildingName"]').instance().value).toEqual('Winter house');

    wrapper.find('input[name="streetName"]').simulate('blur', { target: { name: 'streetName', value: 'Water of Leith' } });
    expect(wrapper.find('input[name="streetName"]').instance().value).toEqual('Water of Leith');

    wrapper.find('input[name="townCity"]').simulate('blur', { target: { name: 'townCity', value: 'Edinburgh' } });
    expect(wrapper.find('input[name="townCity"]').instance().value).toEqual('Edinburgh');

    wrapper.find('input[name="county"]').simulate('blur', { target: { name: 'county', value: 'Midlothian' } });
    expect(wrapper.find('input[name="county"]').instance().value).toEqual('Midlothian');

    wrapper.find('input[name="postcode"]').simulate('blur', { target: { name: 'postcode', value: 'EH1 2EH' } });
    expect(wrapper.find('input[name="postcode"]').instance().value).toEqual('EH1 2EH');

    wrapper.find('input[name="country"]').simulate('blur', { target: { name: 'county', value: 'Scotland' } });
    expect(wrapper.find('input[name="country"]').instance().value).toEqual('Scotland');

  });

  it('should take a snapshot of AddAddressForm: PostcodeLookUp: Step 3', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('AddAddressForm without pre selected values', () => {

  const mockStore = configureStore([thunk.withExtraArgument()]);

  const store = mockStore({
  });

  const props = {
    countries: ['Brazil', 'UK'],
    errors: {},

  };

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <AddAddressForm {...props} />
      </MemoryRouter>
    </Provider>
  );

  it('should find the the fields without the preselected address', () => {
    expect(wrapper.find('input[id="subBuildingName"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="buildingNumber"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="buildingName"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="streetName"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="townCity"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="county"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="postcode"]').instance().value).toEqual('');
    expect(wrapper.find('input[id="country"]').instance().value).toEqual('');
  });

  it('should render the errors when there are any', () => {
    const mockStore = configureStore([thunk.withExtraArgument()]);

    const store = mockStore({});

    const props = {
      countries: ['Brazil', 'UK'],
      errors: {
        streetNameError: 'commonWhatExportersAddressErrorStreetName',
        townCityError: 'commonWhatExportersAddressErrorTownCity',
        postcodeError: 'commonLookupAddressPageErrorPostcodeEmpty',
        countryError: 'commonWhatExportersAddressErrorCountry'
      }

    };

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddAddressForm {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('ErrorText').at(0).text()).toBe('Enter a street name');
    expect(wrapper.find('ErrorText').at(1).text()).toBe('Enter the town or city');
    expect(wrapper.find('ErrorText').at(2).text()).toBe('Enter a postcode');
    expect(wrapper.find('ErrorText').at(3).text()).toBe('Select a country from the list');
  });
});

describe('AddAddressForm actions', () => {

  const props = {
    countries: ['Brazil', 'UK'],
    errors: {},
    preSelected: {
      building_name: 'LANCASTER HOUSE',
      city: 'NEWCASTLE UPON TYNE',
      country: 'ENGLAND',
      county: 'TYNESIDE',
      postCode: 'NE4 7YH',
      street_name: 'HAMPSHIRE COURT',
      sub_building_name: 'sub building name',
      building_number: 'building number'
    },
    handleCancelButton: jest.fn(),
    onSubmit: jest.fn()
  };

  const mockStore = configureStore([thunk.withExtraArgument()]);

  const store = mockStore({
  });
  // const wrapper = mount(<AddAddressForm {...props}/>);

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <AddAddressForm {...props} />
      </MemoryRouter>
    </Provider>

  );

  let mockGetElementById;


  beforeEach(() => {
    mockGetElementById = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    mockGetElementById.mockReset();
  });

  it('will call the on confirm of the AddressForm component', () => {
    const country = 'Nigeria';

    wrapper.setState({
      'country': 'Nigeria'
    });

    wrapper.mount();
    const accessibleAutoCompleteEl = wrapper.find('AccessibleAutoComplete[id="country"]');
    accessibleAutoCompleteEl.props().onConfirm(country);

    expect(wrapper.state().country).toBe('Nigeria');
  });

  it('will call the on confirm with no params of the AddressForm component', () => {
    const country = null;
    const el = { value: 'England' };
    wrapper.setState({
      'country': 'England'
    });

    wrapper.mount();

    mockGetElementById.mockImplementation(() => el);

    const accessibleAutoCompleteEl = wrapper.find('AccessibleAutoComplete[id="country"]');
    accessibleAutoCompleteEl.props().onConfirm(country);

    expect(wrapper.state().country).toBe('England');
  });

  it('will call the on confirm with no params and no element of the AddressForm component', () => {
    const country = null;

    wrapper.setState({
      'country': 'England'
    });

    wrapper.mount();

    mockGetElementById.mockImplementation(() => null);

    const accessibleAutoCompleteEl = wrapper.find('AccessibleAutoComplete[id="country"]');
    accessibleAutoCompleteEl.props().onConfirm(country);

    expect(wrapper.state().country).toBe('England');
  });

  it('will call the the on submit for component', () => {

    const expected =  {
      subBuildingName: 'sub building name',
      buildingNumber: 'building number',
      buildingName: 'LANCASTER HOUSE',
      streetName: 'HAMPSHIRE COURT',
      townCity: 'NEWCASTLE UPON TYNE',
      county: 'TYNESIDE',
      postcode: 'NE4 7YH',
      country: 'England',
    };

    const event = {
      preventDefault: jest.fn()
    };
    const formEl = wrapper.find('form');
    formEl.props().onSubmit(event);

    expect(formEl.exists()).toBeTruthy();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalledWith(expected);
  });
});