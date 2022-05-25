import errorTransformer from '../../../src/client/helpers/errorTransformer';

describe('errorTransformer', () => {

  it('should transform to an initial error state for an empty error object', () => {
    const result = errorTransformer();
    expect(result).toEqual({});
  });


  it('should transform to expected output for missing railway bill number', () => {
    const input = {'railwayBillNumber': 'error.railwayBillNumber.any.required'};
    const result = errorTransformer(input);
    expect(result).toEqual({
      errors:
        [{
          targetName: 'railwayBillNumber',
          text: 'sdTransportDetailsRailwayBillNumberErrorRequired'
        }],
      railwayBillNumberError: 'sdTransportDetailsRailwayBillNumberErrorRequired'
    });
  });


});