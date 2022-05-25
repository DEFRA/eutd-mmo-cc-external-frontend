import * as Dynamix from '../../../src/helpers/dynamix';
import {parseContactsResponse} from '../../../src/helpers/dynamix';


const mockDecodedResponse = (data) => {
  return {
    status : 200,
    request : {path : 'here the path'},
    data
  };
};

describe('parseAddressResponse', () => {

  it('should return dymanics address', async () => {

    const dynamicsAddressResponse = mockDecodedResponse({
        value : [
          {
            defra_Address : {
              defra_addressid: '00185463-69c2-e911-a97a-000d3a2cbad9',
              defra_buildingname: 'Lancaster House',
              defra_county: null,
              defra_dependentlocality: null,
              defra_fromcompanieshouse: false,
              'defra_fromcompanieshouse@OData.Community.Display.V1.FormattedValue': 'No',
              'defra_internationalpostalcode': null,
              'defra_locality': null,
              'defra_postcode': 'NE4 7YJ',
              'defra_premises': '23',
              'defra_street': 'Newcastle upon Tyne',
              defra_subbuildingname: null,
              defra_towntext: 'Newcastle upon Tyne',
              defra_uprn: null,
              '_defra_country_value': 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
              '_defra_country_value@Microsoft.Dynamics.CRM.associatednavigationproperty': 'defra_Country',
              '_defra_country_value@Microsoft.Dynamics.CRM.lookuplogicalname' : 'defra_country',
              '_defra_country_value@OData.Community.Display.V1.FormattedValue': 'United Kingdom of Great Britain and Northern Ireland'
            }
          }
        ]
    });

    expect(await Dynamix.parseAddressResponse(dynamicsAddressResponse)).toEqual([{
      uprn: null,
      buildingname: 'Lancaster House',
      subbuildingname: null,
      premises: '23',
      street: 'Newcastle upon Tyne',
      locality:null,
      dependentlocality: null,
      towntext: 'Newcastle upon Tyne',
      county: null,
      postcode: 'NE4 7YJ',
      country: 'United Kingdom of Great Britain and Northern Ireland',
      countryId: 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
      internationalpostalcode: null,
      fromcompanieshouse: false,
      _dynamicsAddress: {
        defra_addressid: '00185463-69c2-e911-a97a-000d3a2cbad9',
        defra_buildingname: 'Lancaster House',
        defra_county: null,
        defra_dependentlocality: null,
        defra_fromcompanieshouse: false,
        'defra_fromcompanieshouse_OData_Community_Display_V1_FormattedValue': 'No',
        'defra_internationalpostalcode': null,
        'defra_locality': null,
        'defra_postcode': 'NE4 7YJ',
        'defra_premises': '23',
        'defra_street': 'Newcastle upon Tyne',
        defra_subbuildingname: null,
        defra_towntext: 'Newcastle upon Tyne',
        defra_uprn: null,
        '_defra_country_value': 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
        '_defra_country_value_Microsoft_Dynamics_CRM_associatednavigationproperty': 'defra_Country',
        '_defra_country_value_Microsoft_Dynamics_CRM_lookuplogicalname' : 'defra_country',
        '_defra_country_value_OData_Community_Display_V1_FormattedValue': 'United Kingdom of Great Britain and Northern Ireland'
      }
    }]);

  });
});

describe('parseContactsResponse', () => {

  it('should should return user details', function () {

    const dynamicsUserDetailsResponse = mockDecodedResponse({
      defra_b2cobjectid : 'obj id',
      contactid : 'contactid',
      firstname : 'name',
      lastname : 'lastname',
      emailaddress1 : 'emailaddress1@emailaddress1',
      telephone1 : '12345',
      defra_tacsacceptedversion : '352425',
      defra_tacsacceptedon : '2020-06-19 16:27:56.324Z',
      defra_addrcorbuildingnumber : '115',
      defra_addrcorbuildingname : 'A BUILDING NUMBER',
      defra_addrcorstreet : 'TAMWORTH ROAD',
      defra_addrcorcounty : 'NEWCASTLE CITY',
      defra_addrcortown : 'NEWCASTLE UPON TYNE',
      defra_addrcorpostcode : 'NE4 5AS'
    });

    expect(parseContactsResponse(dynamicsUserDetailsResponse)).toEqual(
    [{
      sub: 'obj id',
      contactId: 'contactid',
      firstName: 'name',
      lastName: 'lastname',
      email: 'emailaddress1@emailaddress1',
      telephoneNumber: '12345',
      mobileNumber: '12345',
      buildingname: 'A BUILDING NUMBER',
      buildingnumber: '115',
      county: 'NEWCASTLE CITY',
      internationalpostalcode: undefined,
      locality: undefined,
      postcode: 'NE4 5AS',
      street: 'TAMWORTH ROAD',
      subbuildingname: undefined,
      town: 'NEWCASTLE UPON TYNE',
      uprn: undefined,
      dependentlocality: undefined,
      termsAcceptedVersion: 352425,
      termsAcceptedOn: new Date('2020-06-19T16:27:56.324Z')
    }]
    );
  });
});