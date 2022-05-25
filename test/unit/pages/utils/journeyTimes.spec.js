import * as journeyTimes from '../../../../src/client/pages/utils/journeyTime';

afterEach(() => {
    window.startJourney = undefined;
    jest.restoreAllMocks();
});

describe('startJourney', () => {

    it('will set a startJourney property on the window to be the current date time', () => {
        jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-01-10'));

        journeyTimes.startJourney();
        expect(window.startJourney).toEqual(new Date('2020-01-10'));
    });

});

describe('journeyTime', () => {

    it('will return 0 if window.startJourney is undefined', () => {
        expect(journeyTimes.journeyTime()).toBe(0);
    });

    it('will return the time in seconds between window.startJourney and the current date time', () => {
        window.startJourney = new Date('2020-01-01');

        jest.spyOn(Date, 'now').mockReturnValue(new Date('2020-01-02'));

        expect(journeyTimes.journeyTime()).toBe('86400');
    });

});