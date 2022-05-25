import processingStatementReducer from '../../../src/client/reducers/processingStatementReducer';

describe('Processing Statement Reducer', () => {

    it('should reduce to initial state', () => {
      const initialState = {
        catches: [{}],
        validationErrors: [{}]
      };

      const state = null;
      const action = {
          type: ''
      };

      expect(processingStatementReducer(state, action)).toEqual(initialState);
    });

    it('should clear statement in state', () => {
        const state = {
          catches: [{}],
          validationErrors: [{}]
        };

        const action = {
            type    : 'CLEAR_PROCESSING_STATEMENT',
            payload : {
                catches: [{}],
                validationErrors: [{}]
            }
        };

        expect(processingStatementReducer(state, action)).toEqual(action.payload);
    });

    it('should save processing statement to state', () => {
        const state = {
          catches: [{}],
          validationErrors: [{}]
        };

        const action = {
            type    : 'SAVE_PROCESSING_STATEMENT',
            payload : {
                consignmentDescription: 'Atlantic cod fishcakes (16041992)',
                dateOfAcceptance: '04/03/2019',
                healthCertificateDate: '25/02/2019',
                healthCertificateNumber: '123456',
                personResponsibleForConsignment: 'Phil Merrilees',
                plantAddressOne: '91 Road',
                plantApprovalNumber: '12',
                plantName: 'Pl',
                plantPostcode: 'NE30 9ZZ',
                plantTownCity: 'North Shields',
                catches : [{
                    catchCertificateNumber: '12',
                    exportWeightAfterProcessing: '12',
                    exportWeightBeforeProcessing: '12',
                    species: 'cod',
                    totalWeightLanded: '12'
                }],
                validationErrors: [{}]
            }
        };

        expect(processingStatementReducer(state, action)).toEqual(action.payload);
    });

    it('should save processing statement as unauthorised', () => {
        const state = {
            consignmentDescription: 'Atlantic cod fishcakes (16041992)',
            dateOfAcceptance: '04/03/2019',
            healthCertificateDate: '25/02/2019',
            healthCertificateNumber: '123456',
            personResponsibleForConsignment: 'Phil Merrilees',
            plantAddressOne: '91 Road',
            plantApprovalNumber: '12',
            plantName: 'Pl',
            plantPostcode: 'NE30 9ZZ',
            plantTownCity: 'North Shields',
            catches: [{
                catchCertificateNumber: '12',
                exportWeightAfterProcessing: '12',
                exportWeightBeforeProcessing: '12',
                species: 'cod',
                totalWeightLanded: '12'
            }],
            validationErrors: [{}]
        };

        const action = {
            type: 'SAVE_PROCESSING_STATEMENT_UNAUTHORISED'
        };
        const result = {
            consignmentDescription: 'Atlantic cod fishcakes (16041992)',
            dateOfAcceptance: '04/03/2019',
            healthCertificateDate: '25/02/2019',
            healthCertificateNumber: '123456',
            personResponsibleForConsignment: 'Phil Merrilees',
            plantAddressOne: '91 Road',
            plantApprovalNumber: '12',
            plantName: 'Pl',
            plantPostcode: 'NE30 9ZZ',
            plantTownCity: 'North Shields',
            catches:
            [{
                catchCertificateNumber: '12',
                exportWeightAfterProcessing: '12',
                exportWeightBeforeProcessing: '12',
                species: 'cod',
                totalWeightLanded: '12'
                }],
        validationErrors: [ {} ],
        unauthorised: true
        };
        expect(processingStatementReducer(state, action)).toEqual(result);
    });

    it('should save processing statement as unauthorised and with supportID when there is a WAF rule violation', () => {
      const state = {
          consignmentDescription: 'Atlantic cod fishcakes (16041992)',
          dateOfAcceptance: '04/03/2019',
          healthCertificateDate: '25/02/2019',
          healthCertificateNumber: '123456',
          personResponsibleForConsignment: 'Phil Merrilees',
          plantAddressOne: '91 Road',
          plantApprovalNumber: '12',
          plantName: 'Pl',
          plantPostcode: 'NE30 9ZZ',
          plantTownCity: 'North Shields',
          catches: [{
              catchCertificateNumber: '12',
              exportWeightAfterProcessing: '12',
              exportWeightBeforeProcessing: '12',
              species: 'cod',
              totalWeightLanded: '12'
          }],
          validationErrors: [{}]
      };

      const action = {
          type: 'SAVE_PROCESSING_STATEMENT_WAF_ERROR',
          supportID: '1234567890'
      };
      const result = {
          consignmentDescription: 'Atlantic cod fishcakes (16041992)',
          dateOfAcceptance: '04/03/2019',
          healthCertificateDate: '25/02/2019',
          healthCertificateNumber: '123456',
          personResponsibleForConsignment: 'Phil Merrilees',
          plantAddressOne: '91 Road',
          plantApprovalNumber: '12',
          plantName: 'Pl',
          plantPostcode: 'NE30 9ZZ',
          plantTownCity: 'North Shields',
          catches:
          [{
              catchCertificateNumber: '12',
              exportWeightAfterProcessing: '12',
              exportWeightBeforeProcessing: '12',
              species: 'cod',
              totalWeightLanded: '12'
              }],
      validationErrors: [ {} ],
      unauthorised: true,
      supportID: '1234567890'
      };
      expect(processingStatementReducer(state, action)).toEqual(result);
  });

    it('will show validation errors', () => {
        const state = {
            catches: [{}],
            validationErrors: [{ error: 'error' }]
        };

        const action = {
            type: 'SHOW_INLINE_SUMMARY_ERRORS_PS_SD'
        };

        const expectedResult = {
            ...state,
            validationErrors: [{ error: 'error' }]
        };

        expect(processingStatementReducer(state, action)).toEqual(expectedResult);
    });

    it('will add the change address attribute', () => {
      const state = {
        test: test
      };

      const action = {type: 'change_plant_address'};

      const expectedResult = {
        ...state,
        changeAddress: true
      };

      expect(processingStatementReducer(state, action)).toEqual(expectedResult);
    });

    it('will clear the change address attribute', () => {
      const state = {
        test: test,
        changeAddress: true
      };

      const action = {type: 'clear_change_plant_address'};

      const expectedResult = {
        ...state,
        changeAddress: undefined
      };

      expect(processingStatementReducer(state, action)).toEqual(expectedResult);
    });

    it('will clear the errors for address', () => {
      const state = {
        changeAddress: true
      };

      const action = {type: 'CLEAR_ERRORS_PLANT_ADDRESS'};

      const expectedResult = {
        ...state,
        errors: {}
      };

      expect(processingStatementReducer(state, action)).toEqual(expectedResult);
    });

    it('should show processing statement inline errors', () => {
      const state = {
        catches: [{}],
        validationErrors: [{}]
      };

      const action = {
          type    : 'show_inline_summary_errors_ps_sd',
          payload : {
              validationErrors: [{
                test: 'test'
              }]
          }
      };

      expect(processingStatementReducer(state, action)).toEqual({
        catches: [{}],
        validationErrors: [{ test: 'test' }]
      });
  });
});