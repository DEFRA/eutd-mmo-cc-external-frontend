
import errorTransformer from '../../../src/client/helpers/errorTransformer';
import exportReducer from '../../../src/client/reducers/exporter.reducer';

describe('Export Reducer', () => {

    it('should reduce to initial state with an undefined initial state', () => {
      const initialState = {
        model: {}
      };

      const action = {
          type: ''
      };

      expect(exportReducer(undefined, action)).toEqual(initialState);
    });

    it('should reduce to initial state', () => {
      const initialState = {
        model: {}
      };

      const action = {
          type: ''
      };

      expect(exportReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to unauthorised state', () => {
      const initialState = {
        model: {}
      };

      const action = {
          type: 'export-certificate/exporter-unauthorised'
      };

      expect(exportReducer(initialState, action)).toEqual({
        ...initialState,
        unauthorised: true
      });
    });

    it('should reduce to unauthorised state with supportID', () => {
      const initialState = {
        model: {}
      };

      const action = {
          type: 'export-certificate/waf-error',
          supportID: 1234567890
      };

      expect(exportReducer(initialState, action)).toEqual({
        ...initialState,
        unauthorised: true,
        supportID: 1234567890
      });
    });

    it('should reduce to authorised state', () => {
      const initialState = {
        model: {},
        unauthorised: true
      };

      const action = {
          type: 'export-certificate/exporter-clear-unauthorised'
      };

      expect(exportReducer(initialState, action)).toEqual({
        model: {},
      });
    });

    it('should reduce exporter requested to initial state', () => {
        const initialState = {
          model: {}
        };

        const action = {
            type: 'export-certificate/exporter-requested'
        };

        const expectedState = {
            model  : {},
            busy   : true,
            error  : undefined,
            errors : undefined
        };

        expect(exportReducer(initialState, action)).toEqual(expectedState);
    });

    it('should reduce exporter loaded to initial state', () => {
        const initialState = {
          model: {}
        };

        const action = {
            type      : 'export-certificate/exporter-loaded',
            exporter  : {
                model : {
                    addressOne          : '91 Road',
                    currentUri          : '/create-catch-certificate/add-exporter-details',
                    exporterCompanyName : 'Merrilees Fishing',
                    exporterFullName    : 'Philip Merrilees',
                    journey             : 'catchCertificate',
                    nextUri             : '/create-catch-certificate/what-are-you-exporting',
                    postcode            : 'NE30 9ZZ',
                    townCity            : 'North Shields',
                    user_id             : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
                }
            }
        };

        const expectedState = {
            busy   : false,
            error  : undefined,
            errors : {},
            model  : {
                addressOne          : '91 Road',
                currentUri          : '/create-catch-certificate/add-exporter-details',
                exporterCompanyName : 'Merrilees Fishing',
                exporterFullName    : 'Philip Merrilees',
                journey             : 'catchCertificate',
                nextUri             : '/create-catch-certificate/what-are-you-exporting',
                postcode            : 'NE30 9ZZ',
                townCity            : 'North Shields',
                user_id             : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
            },
            saved : false
        };

        expect(exportReducer(initialState, action)).toEqual(expectedState);
    });

    it('should reduce exporter invalid to initial state', () => {
        const initialState = {
            model: {}
        };

        const action = {
              type       : 'export-certificate/exporter-invalid',
              exporter   : {
                  model  : {
                    addressOne          : '',
                    currentUri          : '/create-catch-certificate/add-exporter-details',
                    exporterCompanyName : 'Merrilees Fishing',
                    exporterFullName    : '',
                    journey             : 'catchCertificate',
                    nextUri             : '/create-catch-certificate/what-are-you-exporting',
                    postcode            : 'NE30 9ZZ',
                    townCity            : 'North Shields',
                    user_id             : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
                  },
                  error  : 'invalid',
                  errors : {
                    addressOne          : 'error.addressOne.string.empty',
                    exporterFullName    : 'error.exporterFullName.string.empty'
                  }
              }
        };


        const expectedState = {
                busy   : false,
                error  : 'invalid',
                errors : {
                    addressOneError: 'Enter the building and street (address line 1 of 2)',
                    errors: [
                        {
                            targetName : 'addressOne',
                            text       : 'Enter the building and street (address line 1 of 2)'
                        },
                        {
                            targetName : 'exporterFullName',
                            text       : 'commonAddExporterDetailsPersonResponsibleError'
                        }
                    ],
                    exporterFullNameError : 'commonAddExporterDetailsPersonResponsibleError'
                },
                model: {
                    addressOne : '',
                    currentUri : '/create-catch-certificate/add-exporter-details',
                    exporterCompanyName: 'Merrilees Fishing',
                    exporterFullName : '',
                    journey: 'catchCertificate',
                    nextUri: '/create-catch-certificate/what-are-you-exporting',
                    postcode: 'NE30 9ZZ',
                    townCity: 'North Shields',
                    user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
                },
                saved: false
        };

        expect(exportReducer(initialState, action)).toEqual(expectedState);
    });

    it('should reduce exporter failed to initial state', () => {
        const initialState = {
            model: {}
        };

        const action = {
            type       : 'export-certificate/exporter-failed'
        };

        const expectedState = {
            model: {},
            busy: false,
            error: undefined,
            saved: false
        };

        expect(exportReducer(initialState, action)).toEqual(expectedState);
    });

    it('should reduce exporter changed to initial state', () => {
        const initialState = {
            model: {}
        };

        const action = {
            type       : 'export-certificate/exporter-changed',
            exporter   : {
                addressOne          : '91 Road',
                currentUri          : '/create-catch-certificate/add-exporter-details',
                exporterCompanyName : 'Merrilees Fishing',
                exporterFullName    : 'Philip Merrilees',
                journey             : 'catchCertificate',
                nextUri             : '/create-catch-certificate/what-are-you-exporting',
                postcode            : 'NE30 9ZZ',
                townCity            : 'North Shields',
                user_id             : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
            }
        };

        const expectedState = {
            model: action.exporter,
            saved: false
        };

        expect(exportReducer(initialState, action)).toEqual(expectedState);
    });

    it('should reduce exporter saved to initial state', () => {
        const initialState = {
            model: {}
        };

        const action = {
            type       : 'export-certificate/exporter-saved',
            exporter   : {
                model : {
                    addressOne          : '91 Road',
                    currentUri          : '/create-catch-certificate/add-exporter-details',
                    exporterCompanyName : 'Merrilees Fishing',
                    exporterFullName    : 'Philip Merrilees',
                    journey             : 'catchCertificate',
                    nextUri             : '/create-catch-certificate/what-are-you-exporting',
                    postcode            : 'NE30 9ZZ',
                    townCity            : 'North Shields',
                    user_id             : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
                }
            }
        };

        const expectedState = {
            model: action.exporter.model,
            busy: false,
            error: undefined,
            errors: undefined,
            saved: true
        };

        expect(exportReducer(initialState, action)).toEqual(expectedState);
    });

    it('should reduce exporter address lookup saved to initial state', () => {
      const initialState = {
        model: {
          addressOne: '1 The Road',
          currentUri: '/blahblahcurrentUri',
          exporterCompanyName: 'Phils Fishing',
          journey: 'catchCertificate',
          nextUri: '/blahblahcurrentUri',
          postcode: 'NE30 2TR',
          townCity: 'North Shields',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
        }
      };
      const manuallyAddedData = {
        subBuildingName: '',
        buildingNumber: '',
        buildingName: '',
        streetName: 'dfdsf',
        townCity: 'Landan',
        county: 'something',
        postcode: 'N1 5EN',
        country: 'Greece',
        addressOne: 'address One'
      };

      const expected = {
        model: {
          addressOne: 'address One',
          buildingName: '',
          buildingNumber: '',
          country: 'Greece',
          county: 'something',
          currentUri: '/blahblahcurrentUri',
          exporterCompanyName: 'Phils Fishing',
          journey: 'catchCertificate',
          nextUri: '/blahblahcurrentUri',
          postcode: 'N1 5EN',
          streetName: 'dfdsf',
          subBuildingName: '',
          townCity: 'Landan',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        }
      };

      const action = {
        type: 'export-certificate/exporter-address-lookup-saved',
        payload: manuallyAddedData
      };

      const expectedState = {
          model: expected.model,
          error: undefined,
          errors: undefined,
      };

      expect(exportReducer(initialState, action)).toEqual(expectedState);
  });

    it('should reduce exporter pre-name loaded exists to initial state', () => {
        const initialState = {
            model: {
              exporterFullName: 'Merrilees Fishing',
              contactId : 'an Id',
              preLoadedName: true
            }
        };

        const action = {
            type       : 'export-certificate/exporter-name-preloaded',
        };

        expect(exportReducer(initialState, action)).toStrictEqual(initialState);
    });

    it('should reduce exporter pre-name loaded to initial state', () => {
        const initialState = {
            model: {
            }
        };

        const action = {
            type       : 'export-certificate/exporter-name-preloaded',
            firstName  : 'Merrilees',
            lastName   : 'Fishing',
            contactId  : 'an Id'
        };

        const expectedResult = {
            model : {
                contactId : action.contactId,
                exporterFullName: `${action.firstName} ${action.lastName}`,
                _dynamicsUser: {
                  firstName: action.firstName,
                  lastName: action.lastName,
                }
            }
        };

        expect(exportReducer(initialState, action)).toStrictEqual(expectedResult);
    });

    it('should reduce exporter company pre-name already loaded to initial state', () => {
        let initialState = {
            model: {
                preLoadedCompanyName : 'BOO & COO LIMITED'
            }
        };

        let action = {
            type       : 'export-certificate/exporter-company-name-preloaded'
        };

        expect(exportReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce exporter company pre-name loaded to initial state', () => {
        const initialState = {
            model: {
            }
        };

        const action = {
            type                 : 'export-certificate/exporter-company-name-preloaded',
            name                 : 'BOO & COO LIMITED',
            accountId            : 'an Id',
            preLoadedCompanyName : true,
            preLoadedName        : true
        };

        const expectedResult = {
            model : {
                accountId : action.accountId,
                exporterCompanyName: action.name,
                preLoadedCompanyName: undefined

            }
        };

        expect(exportReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce exporter address already loaded to initial state', () => {
        const initialState = {
            model: {
                preLoadedAddress : 'Lower Hollin Pensax, Abberley'
            }
        };

        const action = {
            type       : 'export-certificate/exporter-address-preloaded'
        };

        expect(exportReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce exporter address loaded to initial state', () => {
        const initialState = {
            model: {
            }
        };

        const action = {
            type       : 'export-certificate/exporter-address-preloaded',
            address    : {
                buildingname: null,
                countryId: 'f49cf73a-fa9c-e811-a950-000d3a3a2566',
                county: 'Worcestershire',
                dependentlocality: null,
                fromcompanieshouse: false,
                internationalpostalcode: null,
                locality: 'Worcester',
                postcode: 'WR6 6AJ',
                premises: null,
                street: 'Lower Hollin Pensax, Abberley',
                subbuildingname: null,
                towntext: null,
                uprn: null
            }
        };

      const expectedResult = {
        model: {
          addressOne: 'Lower Hollin Pensax',
          addressTwo: 'Abberley, Worcester',
          postcode: 'WR6 6AJ',
          preLoadedAddress: undefined,
          townCity: 'Worcester',
          buildingName: null,
          buildingNumber: null,
          country: undefined,
          county: 'Worcestershire',
          streetName: 'Lower Hollin Pensax, Abberley',
          subBuildingName: null
        }
      };

      expect(exportReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce exporter address pre load failed to say the address has been preloaded', () => {
      const initialState = {
        x: 'x',
        model: {
          y: 'y'
        }
      };

      const action = {
        type: 'export-certificate/exporter-address-preload-failed'
      };

      const expectedResult = {
        x: 'x',
        model: {
          preLoadedAddress: true,
          y: 'y'
        }
      };

      expect(exportReducer(initialState, action)).toEqual(expectedResult);
    });

    describe('exporter invalid reducer', () => {

      describe('for the catch certificate journey', () => {

        it('will flatten multiple address errors to a single error', () => {
          const initialState = {};

          const action = {
            type: 'export-certificate/exporter-invalid',
            exporter: {
              model: 'exporterModel',
              error: 'error',
              errors: {
                exporterFullName: 'error.exporterFullName.any.required',
                exporterCompanyName: 'error.exporterCompanyName.any.required',
                townCity: 'error.townCity.any.required',
                postcode: 'error.postcode.any.required'
              }
            },
            journey: 'catchCertificate'
          };

          const expectedErrors = errorTransformer({
            exporterFullName: 'error.exporterFullName.any.required',
            exporterCompanyName: 'error.exporterCompanyName.any.required',
            address: 'error.address.any.required'
          });

          const expectedResult = {
            busy: false,
            model: 'exporterModel',
            error: 'error',
            errors: expectedErrors,
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

        it('will clear all exporter details errors when the exporter attempts to change address', () => {

          const action = {
            type: 'export-certificate/exporter-change-address',
          };

          const initialState = {
            busy: false,
            model: {},
            error: 'error',
            errors: errorTransformer({
              exporterFullName: 'error.exporterFullName.any.required',
              exporterCompanyName: 'error.exporterCompanyName.any.required',
              address: 'error.address.any.required'
            }),
            saved: false
          };

          const expectedResult = {
            busy: false,
            model: {
              changeAddress: true
            },
            error: undefined,
            errors: undefined,
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

        it('will clear change address flag', () => {

          const action = {
            type: 'export-certificate/exporter-clear-change-address',
          };

          const initialState = {
            busy: false,
            model: {
              changeAddress: true
            },
            error: undefined,
            errors: undefined,
            saved: false
          };

          const expectedResult = {
            busy: false,
            model: {},
            error: undefined,
            errors: undefined,
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

      });

      describe('for the processing statement journey', () => {

        it('will flatten multiple address errors to a single error', () => {
          const initialState = {};

          const action = {
            type: 'export-certificate/exporter-invalid',
            exporter: {
              model: 'exporterModel',
              error: 'error',
              errors: {
                exporterCompanyName: 'error.exporterCompanyName.any.required',
                townCity: 'error.townCity.any.required',
                postcode: 'error.postcode.any.required'
              }
            },
            journey: 'processingStatement'
          };

          const expectedErrors = errorTransformer({
            exporterCompanyName: 'error.exporterCompanyName.any.required',
            address: 'error.address.any.required'
          });

          const expectedResult = {
            busy: false,
            model: 'exporterModel',
            error: 'error',
            errors: expectedErrors,
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

        it('will clear all exporter details errors when the exporter attempts to change address', () => {

          const action = {
            type: 'export-certificate/exporter-change-address',
          };

          const initialState = {
            busy: false,
            model: {},
            error: 'error',
            errors: errorTransformer({
              exporterCompanyName: 'error.exporterCompanyName.any.required',
              address: 'error.address.any.required'
            }),
            saved: false
          };

          const expectedResult = {
            busy: false,
            model: {
              changeAddress: true
            },
            error: undefined,
            errors: undefined,
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

        it('will clear change address flag', () => {

          const action = {
            type: 'export-certificate/exporter-clear-change-address',
          };

          const initialState = {
            busy: false,
            model: {
              changeAddress: true
            },
            error: undefined,
            errors: undefined,
            saved: false
          };

          const expectedResult = {
            busy: false,
            model: {},
            error: undefined,
            errors: undefined,
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

      });

      describe('for the storage document journey', () => {

        it('will flatten multiple address errors to a single error', () => {
          const initialState = {};

          const action = {
            type: 'export-certificate/exporter-invalid',
            exporter: {
              model: 'exporterModel',
              error: 'error',
              errors: {
                exporterCompanyName: 'error.exporterCompanyName.any.required',
                address: 'error.address.any.required',
              }
            },
            journey: 'storageDocuments'
          };

          const expectedResult = {
            busy: false,
            model: 'exporterModel',
            error: 'error',
            errors: errorTransformer(action.exporter.errors),
            saved: false
          };

          expect(exportReducer(initialState, action)).toEqual(expectedResult);
        });

        it('will clear all exporter details errors when the exporter attempts to change address', () => {

            const action = {
              type: 'export-certificate/exporter-change-address',
            };

            const initialState = {
              busy: false,
              model: {},
              error: 'error',
              errors: errorTransformer({
                exporterCompanyName: 'error.exporterCompanyName.any.required',
                address: 'error.address.any.required'
              }),
              saved: false
            };

            const expectedResult = {
              busy: false,
              model: {
                changeAddress: true
              },
              error: undefined,
              errors: undefined,
              saved: false
            };

            expect(exportReducer(initialState, action)).toEqual(expectedResult);
          });

          it('will clear change address flag', () => {

            const action = {
              type: 'export-certificate/exporter-clear-change-address',
            };

            const initialState = {
              busy: false,
              model: {
                changeAddress: true
              },
              error: undefined,
              errors: undefined,
              saved: false
            };

            const expectedResult = {
              busy: false,
              model: {},
              error: undefined,
              errors: undefined,
              saved: false
            };

            expect(exportReducer(initialState, action)).toEqual(expectedResult);
          });
       });

    });

});