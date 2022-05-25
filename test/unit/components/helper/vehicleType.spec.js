import {
  ALL_SUPPORTED_VEHICLE_TYPES,
  ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING,
  VEHICLE_TYPE_FIELDS,
  capitalizeFirstLetter
} from '../../../../src/client/components/helper/vehicleType';

describe('Vehicle Type', () => {

  it('Should be an array of strings length 5', () => {
    expect(ALL_SUPPORTED_VEHICLE_TYPES).toBeInstanceOf(Array);
    expect(ALL_SUPPORTED_VEHICLE_TYPES.length).toBe(5);
  });

  it('Should be an array of strings length 4', () => {
    expect(ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING).toBeInstanceOf(Array);
    expect(ALL_SUPPORTED_VEHICLE_TYPES_NO_DIRECT_LANDING.length).toBe(4);
  });
  
  it('Should be an object whose keys are ALL_SUPPORTED_VEHICLE_TYPES', () => {
    Object.keys(VEHICLE_TYPE_FIELDS).forEach((key) => {
      expect(ALL_SUPPORTED_VEHICLE_TYPES.includes(key)).toBe(true);
    });
  });
  
  describe('#capitalizeFirstLetter', () => {

    it('Should capitalize the first letter of the word', () => {
      expect(capitalizeFirstLetter('foo')).toBe('Foo');
    });

  });
});