import * as timeUtils from '../../../src/client/helpers/timeUtils';

describe('when 1st of may which is in position 3 in array is passed to generateMissingMonths function', () => {
  it('should return an array of july, june, may, april dates in that order', () => {
    const givenDate = new Date(2019, 4); // may 
    const fullDatesPageRange = timeUtils.generateMissingMonths(givenDate, 2);
    expect(fullDatesPageRange.length).toEqual(4);
    expect(fullDatesPageRange[0].getMonth()).toEqual(6); // july
    expect(fullDatesPageRange[1].getMonth()).toEqual(5);
    expect(fullDatesPageRange[2].getMonth()).toEqual(4);
    expect(fullDatesPageRange[3].getMonth()).toEqual(3);
  });
});

describe('when november which is in position 4 in array is passed to generateMissingMonths function', () => {
  it('should return an array of feb, jan, dec and nov dates in order', () => {
    const givenDate = new Date(2019, 10);
    const fullDatesPageRange = timeUtils.generateMissingMonths(givenDate, 3);
    expect(fullDatesPageRange.length).toEqual(4);
    expect(fullDatesPageRange[0].getMonth()).toEqual(1); // feb
    expect(fullDatesPageRange[1].getMonth()).toEqual(0);
    expect(fullDatesPageRange[2].getMonth()).toEqual(11);
    expect(fullDatesPageRange[3].getMonth()).toEqual(10);
  });
});


describe('when previousFourMonths is called with may as from date', () => {
  it('should return an array of 4 dates which has may as the first element followed by april, march and feb', () => {
    const fromDate = new Date(2019, 4);
    const fourMonths = timeUtils.previousFourMonths(fromDate);
    expect(fourMonths.length).toEqual(4);
    expect(fourMonths[0].getMonth()).toEqual(4);
    expect(fourMonths[1].getMonth()).toEqual(3);
    expect(fourMonths[2].getMonth()).toEqual(2);
    expect(fourMonths[3].getMonth()).toEqual(1);
  });
});


describe('when nextFourMonths is called with may as from date', () => {
  it('should return an array of 4 dates which has aug as first element then july, june and may', () => {
    const fromDate = new Date(2019, 4);
    const fourMonths = timeUtils.nextFourMonths(fromDate);
    expect(fourMonths.length).toEqual(4);
    expect(fourMonths[0].getMonth()).toEqual(7); 
    expect(fourMonths[1].getMonth()).toEqual(6);
    expect(fourMonths[2].getMonth()).toEqual(5);
    expect(fourMonths[3].getMonth()).toEqual(4);
  });
});
