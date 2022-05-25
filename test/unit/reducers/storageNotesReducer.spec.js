import storageNotesReducer from '../../../src/client/reducers/storageNotesReducer';

describe('Storage Notes Reducer', () => {

    it('should reduce to initial state', () => {
      const initialState = {
        catches: [{}],
        storageFacilities: [{}]
      };

      const action = {
        type: ''
      };

      expect(storageNotesReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined state', () => {
      const initialState = {
        catches: [{}],
        storageFacilities: [{}],
        validationErrors: [{}],
        errors: {},
        errorsUrl: ''
      };

      const action = {
        type: ''
      };

      expect(storageNotesReducer(undefined, action)).toEqual(initialState);
    });

    it('should clear storages in the state', () => {
        const initialState = {
          catches: [{}],
          storageFacilities: [{}],
          validationErrors: [{}],
          errors: {},
          errorsUrl: ''
        };
        const action = {
            type: 'CLEAR_STORAGE_NOTES',
        };

        expect(storageNotesReducer(initialState, action)).toEqual(initialState);
    });

    it('should add storage note catch to state', () => {

        const initialState = {
            catches: [{}],
            storageFacilities: [{}]
        };

        const catches = [
            {
                certificateNumber: '122112',
                commodityCode: '123456',
                dateOfUnloading: '24/02/2019',
                placeOfUnloading: 'Felixstowe',
                product: 'Atlantic cod',
                productWeight: '12',
                transportUnloadedFrom: '123456'
            }
        ];

        const action = {
            type: 'SAVE_STORAGE_NOTES',
            payload : {
                catches : catches,
                storageFacilities: [
                    {

                    }
                ]
            }
        };

        const expectedResult = {
            catches: catches,
            storageFacilities: [{}]
        };

        expect(storageNotesReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should add storage note facility to state', () => {
        const initialState = {
            catches: [            {
                certificateNumber: '122112',
                commodityCode: '123456',
                dateOfUnloading: '24/02/2019',
                placeOfUnloading: 'Felixstowe',
                product: 'Atlantic cod',
                productWeight: '12',
                transportUnloadedFrom: '123456'
            }],
            storageFacilities: [{}]
        };

        const facilities = [
            {
                facilityAddressOne: '91 Beach Road',
                facilityName: 'Philip Merrilees',
                facilityPostcode: 'NE30 2TR',
                facilityTownCity: 'North Shields',
                storedAs: 'chilled'
            }
        ];

        const action = {
            type: 'SAVE_STORAGE_NOTES',
            payload : {
                catches : initialState.catches,
                storageFacilities: facilities
            }
        };

        const expectedResult = {
            catches: initialState.catches,
            storageFacilities: facilities
        };

        expect(storageNotesReducer(initialState, action)).toEqual(expectedResult);
    });


  it('should add storage facility to state with correct field', () => {
    const initialState = {
      catches: [{
        certificateNumber: '122112',
        commodityCode: '123456',
        dateOfUnloading: '24/02/2019',
        placeOfUnloading: 'Felixstowe',
        product: 'Atlantic cod',
        productWeight: '12',
        transportUnloadedFrom: '123456'
      }],
      storageFacilities: [{}]
    };

    const facilities = [
      {
        facilityAddressOne: 'LANCASTER HOUSE, HAMPSHIRE COURT',
        facilityBuildingName: 'LANCASTER HOUSE',
        facilityBuildingNumber: '1',
        facilityCountry: 'ENGLAND',
        facilityCounty: 'TYNESIDE',
        facilityName: 'NAME',
        facilityPostcode: 'NE4 7YH',
        facilityStreetName: 'HAMPSHIRE COURT',
        facilitySubBuildingName: 'qqq',
        facilityTownCity: 'NEWCASTLE UPON TYNE'
      }
    ];

    const action = {
      type: 'SAVE_STORAGE_NOTES',
      payload: {
        catches: initialState.catches,
        storageFacilities: facilities
      }
    };

    const expectedResult = {
      catches: initialState.catches,
      storageFacilities: facilities
    };

    expect(storageNotesReducer(initialState, action)).toEqual(expectedResult);
  });
    it('should unauthorise a storage note orch call', () => {
      const initialState = {
        catches: [{}],
        storageFacilities: [{}],
        validationErrors: [{}],
        errors: {},
        errorsUrl: ''
      };

      const expectedResult = {
        catches: [{}],
        storageFacilities: [{}],
        validationErrors: [{}],
        errors: {},
        errorsUrl: '',
        unauthorised: true,
      };

      const action = {
        type: 'SAVE_STORAGE_NOTES_UNAUTHORISED'
      };

      expect(storageNotesReducer(initialState, action)).toEqual(expectedResult);
    });

    it('will show validation errors', () => {
        const initialState = {
            catches: [{}],
            validationErrors: [{ error: 'error' }]
        };

        const expectedResult = {
            ...initialState,
            validationErrors: [{ error: 'error' }]
        };

        const action = {
            type: 'show_inline_summary_errors_ps_sd'
        };

        expect(storageNotesReducer(initialState, action)).toEqual(expectedResult);
    });
    it('will add the change address attribute', () => {
      const state = {
        test: test
      };
     const action = {type: 'change_storage_facility_address'};
     const expectedResult = {
        ...state,
        changeAddress: true
      };
      expect(storageNotesReducer(state, action)).toEqual(expectedResult);
    });
});