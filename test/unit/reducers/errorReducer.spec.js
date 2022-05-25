import errorReducer from '../../../src/client/reducers/errorsReducer';

describe('Error Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {};
        const action = {
            type : ''
        };

        expect(errorReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = {};
      const action = {
          type : ''
      };

      expect(errorReducer(undefined, action)).toEqual(initialState);
  });

    it('should reduce errors in initial state', () => {
        const initialState = {};
        const action = {
            type : 'clear_errors'
        };

        expect(errorReducer(initialState, action)).toEqual({});
    });

    it('should reduce begin call in initial state', () => {
        const initialState = {};
        const action = {
            type : 'begin_api_call'
        };

        expect(errorReducer(initialState, action)).toEqual({});
    });

    it('should reduce API call failure in initial state', () => {
        const initialState = {};
        const action = {
            type : 'api_call_failed',
            payload : {
                data : {
                    nationalityOfVehicle: 'error.nationalityOfVehicle.any.required',
                    registrationNumber: 'error.registrationNumber.any.required',
                    departurePlace: 'error.departurePlace.any.required'
                }
            }
        };

        const expectedResult = {
            departurePlaceError : 'sdAddTransportationDetailsPlaneDeparturePlaceLabelError',
            errors: [
                {
                   targetName : 'nationalityOfVehicle',
                   text       : 'commonTransportationDetailsTruckNationalityError',
                },
                {
                    targetName : 'registrationNumber',
                    text       : 'commonTransportationDetailsTruckRegNumberError',
                },
                {
                    targetName : 'departurePlace',
                   text       : 'sdAddTransportationDetailsPlaneDeparturePlaceLabelError',
               }
            ],
            nationalityOfVehicleError : 'commonTransportationDetailsTruckNationalityError',
            registrationNumberError   : 'commonTransportationDetailsTruckRegNumberError'
        };

        expect(errorReducer(initialState, action)).toEqual(expectedResult);
    });
});