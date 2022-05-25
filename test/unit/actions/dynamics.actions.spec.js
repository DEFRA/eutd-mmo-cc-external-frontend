import {
  fetchAddressDetailsFromDynamics,
  fetchAccountDetailsFromDynamics,
  fetchUserDetailsFromDynamics,
  dynamicsActionTypes,
  getAddressArrayFromDynamicsResponse,
  getAddressModelFromDynamicsResponse
} from '../../../src/client/actions/dynamics.actions';
import { parseAccountsResponse, parseContactsResponse } from '../../../src/helpers/dynamix';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('../../../src/helpers/dynamix', () => ({
  ...jest.requireActual('../../../src/helpers/dynamix'),
  parseAccountsResponse: jest.fn(),
  parseContactsResponse: jest.fn()
}));

const data = {
    value : [
        {
            defra_Address : {
                defra_buildingname: null,
                defra_county: 'Worcestershire',
                defra_dependentlocality: null,
                defra_fromcompanieshouse: false,
                defra_internationalpostalcode: null,
                defra_locality: 'Worcester',
                defra_postcode: 'WR6 6AJ',
                defra_premises: null,
                defra_street: 'Lower Hollin Pensax, Abberley',
                defra_subbuildingname: null,
                defra_towntext: null,
                defra_uprn: '1234',
                _defra_country_value: 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
                _defra_country_value_OData_Community_Display_V1_FormattedValue:'United Kingdom of Great Britain and Northern Ireland'
            }
        }
    ]
};

const mockAddressFilled = {
  buildingname: 'buildingname',
  subbuildingname: 'subbuildingname',
  country: 'England',
  premises: 'premises',
  locality: 'locality',
  dependantLocality: 'dependantLocality',
  towntext: 'towntext',
  county: 'county'
};

const mockAddress = {
  uprn: '1234',
  buildingname: null,
  subbuildingname: null,
  premises: null,
  street: 'Lower Hollin Pensax, Abberley',
  locality: 'Worcester',
  dependentlocality: null,
  towntext: null,
  county: 'Worcestershire',
  postcode: 'WR6 6AJ',
  country: 'United Kingdom of Great Britain and Northern Ireland',
  countryId: 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
  internationalpostalcode: null,
  fromcompanieshouse: false,
  _dynamicsAddress: {
    '_defra_country_value': 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
    'defra_buildingname': null,
    'defra_county': 'Worcestershire',
    'defra_dependentlocality': null,
    'defra_fromcompanieshouse': false,
    'defra_internationalpostalcode': null,
    'defra_locality': 'Worcester',
    'defra_postcode': 'WR6 6AJ',
    'defra_premises': null,
    'defra_street': 'Lower Hollin Pensax, Abberley',
    'defra_subbuildingname': null,
    'defra_towntext': null,
    'defra_uprn': '1234',
    '_defra_country_value_OData_Community_Display_V1_FormattedValue':'United Kingdom of Great Britain and Northern Ireland'
  }
};

const mockAccount = {
  accountId: '123',
  name: 'Test',
  email: 'Test@email.com'
};

const mockUser = {
  contactId  : 'an Id',
  firstName: 'Jane',
  lastName: 'Doe'
};

const response = {
    baseURL: '/dynamix/',
    headers: {Accept: 'application/json, text/plain, */*'},
    maxContentLength: -1,
    method: 'get',
    timeout: 60000,
    url: '/dynamix/user-details',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    data: data,
    responseType: '',
    responseURL: 'http://localhost:3001/dynamix/user-details',
    responseXML: null,
    status: 200,
    statusText: 'OK',
    withCredentials: false
};

const noAddressResponse = { ...response };
noAddressResponse.data = {
    value : []
};

const createMockStore = (reject = false) => {
  return configureStore([thunk.withExtraArgument({
                      dynamixApi: {
                          get: () => {
                              return new Promise((res, rej) => {
                                if (reject) {
                                  rej(new Error('a'));
                                } else {
                                  res(response);
                                }

                              });
                          }
                      }
                    })]);
};

const createMockStoreNoAddress = (reject = false) => {
  return configureStore([thunk.withExtraArgument({
                      dynamixApi: {
                          get: () => {
                              return new Promise((res, rej) => {
                                if (reject) {
                                  rej(new Error('a'));
                                } else {
                                  res(noAddressResponse);
                                }

                              });
                          }
                      }
                    })]);
};

describe('Dynamics Actions', () => {

  describe('#fetchAddressDetailsFromDynamics', () => {

    it('should fetch address details', () => {
        const expectedActions = [
            {
                type      : dynamicsActionTypes.ADDRESS_DETAILS_LOADED,
                addresses : [{ ...mockAddress }
                ]
            },
            {   type: dynamicsActionTypes.EXPORTER_ADDRESS_PRE_LOADED,
                address: { ...mockAddress }
            }];

        const store = createMockStore()({
            fetchAddressDetailsFromDynamics: response
        });

        return store.dispatch(fetchAddressDetailsFromDynamics()).then(() => {
            expect(store.getActions()).toStrictEqual(expectedActions);
        });
    });

    it('should fetch address details and dispath a success only', () => {
      const expectedActions = [
          {
              type      : dynamicsActionTypes.ADDRESS_DETAILS_LOADED,
              addresses : []
          }];

      const store = createMockStoreNoAddress()({
          fetchAddressDetailsFromDynamics: noAddressResponse
      });

      return store.dispatch(fetchAddressDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });

    it('should fail if the server returned an error', () => {
        const expectedActions = [
            {
                type      : dynamicsActionTypes.ADDRESS_DETAILS_FAILED,
                error: 'Failed server call to get address details'
            },
            {
                type      : dynamicsActionTypes.EXPORTER_ADDRESS_PRE_LOAD_FAILED
            }
        ];

        const store = createMockStore(true)({
            fetchAddressDetailsFromDynamics: response
        });

        return store.dispatch(fetchAddressDetailsFromDynamics()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

  });

  describe('#fetchAccountDetailsFromDynamics', () => {

    it(`should dispatch an action to ${dynamicsActionTypes.ACCOUNT_DETAILS_LOADED}`, () => {
      const expectedActions = [{
        type : dynamicsActionTypes.ACCOUNT_DETAILS_LOADED,
        accounts: mockAccount
      }];
      parseAccountsResponse.mockReturnValue(mockAccount);
      const store = createMockStore()();

      return store.dispatch(fetchAccountDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(parseAccountsResponse).toHaveBeenCalled();
      });
    });

    it(`Should dispatch actions ${dynamicsActionTypes.ACCOUNT_DETAILS_LOADED},
       ${dynamicsActionTypes.EXPORTER_COMPANY_NAME_PRE_LOADED}`, () => {
      const expectedActions = [
        {
          type : dynamicsActionTypes.ACCOUNT_DETAILS_LOADED,
          accounts: [mockAccount]
        },
        {
          type : dynamicsActionTypes.EXPORTER_COMPANY_NAME_PRE_LOADED,
          name: mockAccount.name,
          accountId : mockAccount.accountId
        },
      ];
      parseAccountsResponse.mockReturnValue([mockAccount]);
      const store = createMockStore()();

      return store.dispatch(fetchAccountDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(parseAccountsResponse).toHaveBeenCalled();
      });
    });

    it(`Should dispatch an action to ${dynamicsActionTypes.ACCOUNT_DETAILS_FAILED}`, () => {
      const expectedActions = [
        {
          type : dynamicsActionTypes.ACCOUNT_DETAILS_FAILED,
          error: 'Failed server call to get account details'
        }
      ];

      const store = createMockStore(true)();

      return store.dispatch(fetchAccountDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });

  });

  describe('#fetchUserDetailsFromDynamics', () => {

    it(`should dispatch an action to ${dynamicsActionTypes.USER_DETAILS_LOADED}`, () => {
      const expectedActions = [{
        type : dynamicsActionTypes.USER_DETAILS_LOADED,
        userdetails: mockUser
      }];
      parseContactsResponse.mockReturnValue(mockUser);
      const store = createMockStore()();

      return store.dispatch(fetchUserDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(parseContactsResponse).toHaveBeenCalled();
      });
    });

    it(`Should dispatch actions ${dynamicsActionTypes.USER_DETAILS_LOADED},
        ${dynamicsActionTypes.EXPORTER_NAME_PRE_LOADED}`, () => {
        const expectedActions = [
        {
          type : dynamicsActionTypes.USER_DETAILS_LOADED,
          userdetails: [mockUser]
        },
        {
          type : dynamicsActionTypes.EXPORTER_NAME_PRE_LOADED,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          contactId : mockUser.contactId
        },
      ];
      parseContactsResponse.mockReturnValue([mockUser]);
      const store = createMockStore()();

      return store.dispatch(fetchUserDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toStrictEqual(expectedActions);
          expect(parseContactsResponse).toHaveBeenCalled();
      });
    });

    it(`Should dispatch an action to ${dynamicsActionTypes.USER_DETAILS_FAILED}`, () => {
      const expectedActions = [
        {
          type : dynamicsActionTypes.USER_DETAILS_FAILED,
          error: 'Failed server call to get user details'
        }
      ];

      const store = createMockStore(true)();

      return store.dispatch(fetchUserDetailsFromDynamics()).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });

  });

  describe('#getAddressArrayFromDynamicsResponse', () => {

    it('Should return an array of address information', () => {
      const dynamicsResponse = {
        address : { ...mockAddressFilled }
      };
      const addressArray = getAddressArrayFromDynamicsResponse(dynamicsResponse);

      expect(addressArray).toBeInstanceOf(Array);
      expect(addressArray.length).toBe(5);
      expect(addressArray).toEqual([
        'premises, subbuildingname, buildingname, ',
        'locality',
        'dependantLocality',
        'towntext',
        'county'
      ]);
    });

    it('Should return an array of address information without locality', () => {
      const dynamicsResponse = {
        address : { ...mockAddressFilled, locality: undefined }
      };
      const addressArray = getAddressArrayFromDynamicsResponse(dynamicsResponse);

      expect(addressArray).toBeInstanceOf(Array);
      expect(addressArray.length).toBe(4);
      expect(addressArray).toEqual([
        'premises, subbuildingname, buildingname, ',
        'dependantLocality',
        'towntext',
        'county'
      ]);
    });

    it('Should return an array of address information without county', () => {
      const dynamicsResponse = {
        address : { ...mockAddressFilled, county: undefined }
      };
      const addressArray = getAddressArrayFromDynamicsResponse(dynamicsResponse);

      expect(addressArray).toBeInstanceOf(Array);
      expect(addressArray.length).toBe(4);
      expect(addressArray).toEqual([
        'premises, subbuildingname, buildingname, ',
        'locality',
        'dependantLocality',
        'towntext'
      ]);
    });

    it('Should return an array of address information with street address delimited by ,', () => {
      const dynamicsResponse = {
        address : {
          ...mockAddressFilled,
          street: '1, street'
        }
      };
      const addressArray = getAddressArrayFromDynamicsResponse(dynamicsResponse);

      expect(addressArray).toBeInstanceOf(Array);
      expect(addressArray.length).toBe(6);
      expect(addressArray).toEqual([
        'premises, subbuildingname, buildingname, 1',
        'street',
        'locality',
        'dependantLocality',
        'towntext',
        'county'
      ]);
    });

    it('Should return an array of address information without delimiting street address', () => {
      const dynamicsResponse = {
        address : {
          ...mockAddressFilled,
          street: '1 street'
        }
      };
      const addressArray = getAddressArrayFromDynamicsResponse(dynamicsResponse);

      expect(addressArray).toBeInstanceOf(Array);
      expect(addressArray.length).toBe(5);
      expect(addressArray).toEqual([
        'premises, subbuildingname, buildingname, 1 street',
        'locality',
        'dependantLocality',
        'towntext',
        'county'
      ]);
    });

  });

  describe('#getAddressModelFromDynamicsResponse', () => {
    it('Should return an address object with addressOne, buildingNumber, subBuildingName, buildingName, streetName, county, country, postCode, townCity and addressTwo', () => {
      const dynamicsResponse = {
        address : {
          ...mockAddressFilled,
          street: '1 street',
          postcode: 'postcode'
        }
      };

      const model = getAddressModelFromDynamicsResponse(dynamicsResponse);
      expect(model).toEqual({
        addressOne: 'premises, subbuildingname, buildingname, 1 street',
        addressTwo: 'locality, dependantLocality, towntext',
        townCity: 'towntext',
        postcode: 'postcode',
        buildingName: 'buildingname',
        buildingNumber: 'premises',
        country: 'England',
        county: 'county',
        streetName: '1 street',
        subBuildingName: 'subbuildingname'
      });
    });

    it('Should return an address object with addressOne, buildingNumber, subBuildingName, buildingName, streetName, county, country, postCode, townCity and addressTwo as intentionalpostcode is null', () => {
      const dynamicsResponse = {
        address : {
          ...mockAddressFilled,
          street: '1 street',
          postcode: null,
          internationalpostalcode: null
        }
      };

      const model = getAddressModelFromDynamicsResponse(dynamicsResponse);
      expect(model).toEqual({
        addressOne: 'premises, subbuildingname, buildingname, 1 street',
        addressTwo: 'locality, dependantLocality, towntext',
        townCity: 'towntext',
        buildingName: 'buildingname',
        buildingNumber: 'premises',
        country: 'England',
        county: 'county',
        streetName: '1 street',
        subBuildingName: 'subbuildingname'
      });
    });

    it('Should return an address object with addressOne, buildingNumber, subBuildingName, buildingName, streetName, county, country, internationalpostalcode, townCity and addressTwo', () => {
      const dynamicsResponse = {
        address : {
          ...mockAddressFilled,
          street: '1 street',
          internationalpostalcode: 'postcode'
        }
      };
      const model = getAddressModelFromDynamicsResponse(dynamicsResponse);
      expect(model).toEqual({
        addressOne: 'premises, subbuildingname, buildingname, 1 street',
        addressTwo: 'locality, dependantLocality, towntext',
        townCity: 'towntext',
        postcode: 'postcode',
        buildingName: 'buildingname',
        buildingNumber: 'premises',
        country: 'England',
        county: 'county',
        streetName: '1 street',
        subBuildingName: 'subbuildingname'
      });
    });

    it('Should return an address object with addressOne', () => {
      const dynamicsResponse = {
        address : {
          premises: 'premises'
        }
      };

      const model = getAddressModelFromDynamicsResponse(dynamicsResponse);
      expect(model).toEqual({
        addressOne: 'premises, ',
        addressTwo: '',
        buildingNumber: 'premises',
      });
    });

  });

});
