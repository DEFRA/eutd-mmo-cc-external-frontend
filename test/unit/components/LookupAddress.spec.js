import React from 'react';
import { mount } from 'enzyme';
import  LookupAddress  from '../../../src/client/components/LookupAddress';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Link } from 'react-router-dom';
import thunk from 'redux-thunk';
import {changeStorageFacilityAddress} from '../../../src/client/actions/index';
import { render } from '@testing-library/react';

const storeData = {
    addAnotherProduct: 'notset',
    addAnotherStorageFacility: 'notset',
    catches: [{
      product: 'Asda squid burgers',
      commodityCode: '123456',
      certificateNumber: '12345',
      productWeight: '1000',
      dateOfUnloading: '25/01/2019',
      placeOfUnloading: 'Dover',
      transportUnloadedFrom: 'Car',
      weightOnCC: '500'
    }],
    storageFacilities: [
      {
        facilityName: 'FACILITY 1',
        facilityAddressOne: 'BUILDING 1, STREET 1',
        facilityBuildingName: 'BUILDING 1',
        facilityStreetName: 'STREET 1',
        facilityTownCity: 'TOWN 1',
        facilityCounty: 'COUNTY 1',
        facilityCountry: 'COUNTRY 1',
        facilityPostcode: 'POSTCODE 1'
      }
    ]
};

const expectedActions = [
  { type: 'change_storage_facility_address', payload: {unsavedFacilityName: 'Facilitity 1'}}
];


describe('Lookup Address Component if address is present', () => {
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

  const store = mockStore({storeData});
 
  const props = {
    addressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
    townCity: 'NEWCASTLE UPON TYNE',
    postcode: 'E11JR',
    addressType: 'storage facility',
    changeAddressLink:
      '/create-storage-document/GBR-2021-SD-67C7DC640/what-storage-facility-address/1',
    changeAddressHandler: jest.fn(),
  };
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <LookupAddress {...props} />
      </MemoryRouter>
    </Provider>
  );
  
  
  it('Should render the Lookup Address component', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should render message "An address must be added for this storage facility."', () => {
    expect(wrapper.find('#lookup-address').exists()).toBeTruthy();
    expect(wrapper.find('#lookup-address').type()).toBe('p');
    expect(wrapper.find('#lookup-address').text()).toBe('LANCASTER HOUSE, HAMPSHIRE COURTNEWCASTLE UPON TYNEE11JR');
  });

  it('Should render change address link', () => {
    expect(wrapper.find('#change-lookup-address-link').first().exists()).toBeTruthy();
    expect(wrapper.find('#change-lookup-address-link').first().type()).toBe(Link);
    expect(wrapper.find('#change-lookup-address-link').first().text()).toBe('Changestorage facility address');
  });
  it('will handle clicking to add an address', () => {
    wrapper.find('#address-link-wrapper').find('Link').simulate('click');
    store.dispatch(changeStorageFacilityAddress({unsavedFacilityName: 'Facilitity 1'}));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should take a snapshot of the whole page when address', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});


describe('Address Lookup Component if address is not present', () => {
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

  const store = mockStore({storeData});

  const props = {
    addressOne: '',
    townCity: '',
    postcode: '',
    addressType: 'storage facility',
    changeAddressLink:
      '/create-storage-document/GBR-2021-SD-67C7DC640/what-storage-facility-address/1',
    changeAddressHandler: jest.fn(),
  };
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <LookupAddress {...props} />
      </MemoryRouter>
    </Provider>
  );
  

  it('Should render the Lookup Address component', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should render link to add facility address', () => {
    expect(wrapper.find('#add-lookup-address-link').exists()).toBeTruthy();
    expect(wrapper.find('#add-lookup-address-link').first().type()).toBe(Link);
    expect(wrapper.find('#add-lookup-address-link').first().text()).toBe('Add the storage facility address');
  });

  it('will handle clicking to add an address', () => {
      wrapper.find('#address-link-wrapper').find('Link').simulate('click');
      store.dispatch(changeStorageFacilityAddress({unsavedFacilityName: 'Facilitity 1'}));
      expect(store.getActions()).toEqual(expectedActions);
  });
    
  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
  
});

