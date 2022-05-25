import * as SUT from '../../../../src/client/pages/common/transport/helpers/findRequiredTransportData';

describe('findRequiredTransportData', () => {

  it('should return true if the props has an export location', () => {
    const props = {
      exportLocation: {
        exportedTo: 'blah'
      }
    };

    const result = SUT.catchCertificate(props);

    expect(result).toBeTruthy();
  });

  it('should return false if the props has an empty export location', () => {
    const props = {
      exportLocation: {
      }
    };

    const result = SUT.catchCertificate(props);

    expect(result).toBeFalsy();
  });

  it('should return false if storage notes is undefined', () => {
    const props = {};

    const result = SUT.storageNotes(props);

    expect(result).toBeFalsy();
  });

  it('should return false if storage notes has an empty storage facility', () => {
    const props = {
      storageNotes: {

      }
    };

    const result = SUT.storageNotes(props);

    expect(result).toBeFalsy();
  });

  it('should return true if storage notes has a storage facility', () => {
    const props = {
      storageNotes: {
        storageFacilities: {
          facilityName: '',
          facilityAddressOne: '',
          facilityTownCity: '',
          facilityPostcode: '',
        }
      }
    };

    const result = SUT.storageNotes(props);

    expect(result).toBeTruthy();
  });

});