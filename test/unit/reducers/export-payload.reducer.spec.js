import exportPayloadReducer from '../../../src/client/reducers/export-payload.reducer';

describe('Export Payload Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            type: ''
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined', () => {
      const initialState = {
          items: []
      };

      const action = {
          type: ''
      };

      expect(exportPayloadReducer(undefined, action)).toEqual(initialState);
  });

    it('should clear export payload to initial state', () => {
        const initialState = {
            items: [
              {
                product: {
                  id: 'fbd2df90-2c64-4cf0-ac47-32e831eff3b0',
                  commodityCode: '03079100',
                  presentation: {
                    code: 'WHL',
                    label: 'Whole'
                  },
                  state: {
                    code: 'FRE',
                    label: 'Fresh'
                  },
                  species: {
                    code: 'PER',
                    label: 'Periwinkles nei (PER)'
                  }
                },
                landings: [
                  {
                    model: {
                      id: '69caf292-76ed-4fb0-aa89-69ac6a900de4',
                      vessel: {
                        pln: 'K373',
                        vesselName: 'AALSKERE',
                        flag: 'GBR',
                        homePort: 'KIRKWALL',
                        licenceNumber: '40815',
                        imoNumber: 9163178,
                        licenceValidTo: '2027-12-31T00:00:00',
                        rssNumber: 'B14974',
                        vesselLength: 33.89,
                        label: 'AALSKERE (K373)',
                        domId: 'AALSKERE-K373'
                      },
                      dateLanded: '2019-11-06T00:00:00.000Z',
                      exportWeight: 34,
                      faoArea: 'FAO27'
                    }
                  }
                ]
              }
            ],
            busy: false
          };

          const action = {
            type: 'export-certificate/export-payload/clear'
          };

          const expectedResult = {
            items : []
          };

          expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload requested to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            type: 'export-certificate/export-payload/requested'
        };

        const expectedResult = {
            items  : [],
            busy   : true,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload failed to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            type: 'export-certificate/export-payload/failed'
        };

        const expectedResult = {
            items  : [],
            busy   : false,
            errors : [
                {
                    targetName: 'exportPayloadFailed',
                    text: 'Communication failure with server please check your connection and refresh the page'
                }
            ]
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload validate requested to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            type: 'export-certificate/export-payload/validate/requested'
        };

        const expectedResult = {
            items  : [],
            busy   : true,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload validate failed to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            type   : 'export-certificate/export-payload/validate/failed',
            errors : [
                'There is a failure'
            ]
        };

        const expectedResult = {
            items  : [],
            busy   : false,
            errors : [
                'There is a failure'
            ]
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload product update failed to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            type   : 'export-certificate/export-payload/product-update-failed',
            error : [
                'There is a failure'
            ]
        };

        const expectedResult = {
            items  : [],
            busy   : false,
            errors : [
                'There is a failure'
            ]
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce landing removed failed to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                ]
            },
            type   : 'export-certificate/export-payload/landing_remove-failed',
            error : [
                'There is a failure'
            ]
        };

        const expectedResult = {
            items  : [],
            busy   : false,
            errors : [
                'There is a failure'
            ]
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce landing update failed to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                ]
            },
            type   : 'export-certificate/export-payload/landing_update-failed',
            error : [
                'There is a failure'
            ]
        };

        const expectedResult = {
            items  : [],
            busy   : false,
            errors : [
                'There is a failure'
            ]
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload loaded to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        }
                    }
                ]
            },
            type   : 'export-certificate/export-payload/loaded'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload product added to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        }
                    }
                ]
            },
            type   : 'export-certificate/export-payload/product-added'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload validation success to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        }
                    }
                ]
            },
            type   : 'export-certificate/export-payload/validate/success'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload product removed to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                ]
            },
            type   : 'export-certificate/export-payload/product-removed'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload landing upserted to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        },
                        landings : [
                            {
                                addMode: false,
                                editMode: false,
                                model: {
                                    dateLanded   : '2019-03-05T00:00:00.000Z',
                                    exportWeight : 150,
                                    id           : '37c05560-38c9-451e-ab85-1718f682b870',
                                    vessel       : {
                                        domId: 'ANNISABELLA-LO61',
                                        homePort: 'LOWESTOFT',
                                        imoNumber: '',
                                        label: 'ANN ISABELLA (LO61)',
                                        licenceNumber: '20178',
                                        pln: 'LO61',
                                        registrationNumber: '',
                                        vesselName: 'ANN ISABELLA'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            type : 'export-certificate/export-payload/landing_upserted'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload landing updated to initial state', () => {
        const initialState = {
            items: [
                {
                    product: {
                        commodityCode: '03047190',
                        id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                        presentation: {
                            code: 'FIL',
                            label: 'Filleted'
                        },
                        species: {
                            code: 'COD',
                            label: 'Atlantic cod (COD)'
                        },
                        state: {
                            code: 'FRO',
                            label: 'Frozen'
                        }
                    },
                    landings : [
                        {
                            addMode: false,
                            editMode: false,
                            model: {
                                dateLanded   : '2019-03-05T00:00:00.000Z',
                                exportWeight : 150,
                                id           : '37c05560-38c9-451e-ab85-1718f682b870',
                                vessel       : {
                                    domId: 'ANNISABELLA-LO61',
                                    homePort: 'LOWESTOFT',
                                    imoNumber: '',
                                    label: 'ANN ISABELLA (LO61)',
                                    licenceNumber: '20178',
                                    pln: 'LO61',
                                    registrationNumber: '',
                                    vesselName: 'ANN ISABELLA'
                                }
                            }
                        }
                    ]
                }
            ]
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        },
                        landings : [
                            {
                                addMode: false,
                                editMode: false,
                                model: {
                                    dateLanded   : '2019-03-10T00:00:00.000Z',
                                    exportWeight : 200,
                                    id           : '37c05560-38c9-451e-ab85-1718f682b870',
                                    vessel       : {
                                        domId: 'ANNISABELLA-LO61',
                                        homePort: 'LOWESTOFT',
                                        imoNumber: '',
                                        label: 'ANN ISABELLA (LO61)',
                                        licenceNumber: '20178',
                                        pln: 'LO61',
                                        registrationNumber: '',
                                        vesselName: 'ANN ISABELLA'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            type : 'export-certificate/export-payload/landing_updated'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload landing removed to initial state', () => {
        const initialState = {
            items: [
                {
                    product: {
                        commodityCode: '03047190',
                        id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                        presentation: {
                            code: 'FIL',
                            label: 'Filleted'
                        },
                        species: {
                            code: 'COD',
                            label: 'Atlantic cod (COD)'
                        },
                        state: {
                            code: 'FRO',
                            label: 'Frozen'
                        }
                    },
                    landings : [
                        {
                            addMode: false,
                            editMode: false,
                            model: {
                                dateLanded   : '2019-03-05T00:00:00.000Z',
                                exportWeight : 150,
                                id           : '37c05560-38c9-451e-ab85-1718f682b870',
                                vessel       : {
                                    domId: 'ANNISABELLA-LO61',
                                    homePort: 'LOWESTOFT',
                                    imoNumber: '',
                                    label: 'ANN ISABELLA (LO61)',
                                    licenceNumber: '20178',
                                    pln: 'LO61',
                                    registrationNumber: '',
                                    vesselName: 'ANN ISABELLA'
                                }
                            }
                        }
                    ]
                }
            ]
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        },
                        landings : []
                    }
                ]
            },
            type : 'export-certificate/export-payload/landing_removed'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce export payload landing updated failed to initial state', () => {
        const initialState = {
            items: [
                {
                    product: {
                        commodityCode: '03047190',
                        id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                        presentation: {
                            code: 'FIL',
                            label: 'Filleted'
                        },
                        species: {
                            code: 'COD',
                            label: 'Atlantic cod (COD)'
                        },
                        state: {
                            code: 'FRO',
                            label: 'Frozen'
                        }
                    },
                    landings : [
                        {
                            addMode: false,
                            editMode: false,
                            model: {
                                dateLanded   : '2019-03-05T00:00:00.000Z',
                                exportWeight : 150,
                                id           : '37c05560-38c9-451e-ab85-1718f682b870',
                                vessel       : {
                                    domId: 'ANNISABELLA-LO61',
                                    homePort: 'LOWESTOFT',
                                    imoNumber: '',
                                    label: 'ANN ISABELLA (LO61)',
                                    licenceNumber: '20178',
                                    pln: 'LO61',
                                    registrationNumber: '',
                                    vesselName: 'ANN ISABELLA'
                                }
                            }
                        }
                    ]
                }
            ]
        };

        const action = {
            exportPayload : {
                items : [
                    {
                        product: {
                            commodityCode: '03047190',
                            id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                            presentation: {
                                code: 'FIL',
                                label: 'Filleted'
                            },
                            species: {
                                code: 'COD',
                                label: 'Atlantic cod (COD)'
                            },
                            state: {
                                code: 'FRO',
                                label: 'Frozen'
                            }
                        },
                        landings : []
                    }
                ]
            },
            type : 'export-certificate/export-payload/landing_upsert-failed',
            error : 'This updated failed'
        };

        const expectedResult = {
            items  : action.exportPayload.items,
            busy   : false,
            errors : 'This updated failed'
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce landing update failed errors to initial state', () => {
        const initialState = {
            items: []
        };

        const action = {
            exportPayload : {
                items : []
            },
            type   : 'export-certificate/export-payload/clear-errors',
            error : [
                'There is a failure'
            ]
        };

        const expectedResult = {
            items  : [],
            busy   : false,
            errors : undefined
        };

        expect(exportPayloadReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should reduce an unauthorised get export payload landing to unauthorised', () => {
        const initialState = {
          items: [{}]
        };

        const action = {
          exportPayload: {

          },
          type : 'export-certificate/export-payload/unauthorised'
        };

        const expectedResult = {
          items: [{}],
          unauthorised: true,
          supportID: undefined
        };

        expect(exportPayloadReducer(initialState, action)).toStrictEqual(expectedResult);
    });

    it('should reduce an export payload landing with waf error to have support ID', () => {
        const initialState = {
          items: [{}]
        };

        const action = {
          type : 'export-certificate/export-payload/waf-error',
          supportID: '123456'
        };

        const expectedResult = {
          items: [{}],
          unauthorised: true,
          supportID: '123456'
        };

        expect(exportPayloadReducer(initialState, action)).toStrictEqual(expectedResult);
    });

    it('should reduce an unauthorised post export payload landing to unauthorised', () => {
        const initialState = {
          items: [{}]
        };

        const action = {
          exportPayload: {

          },
          type : 'export-certificate/export-payload/landing_upsert-unauthorised'
        };

        const expectedResult = {
          items: [{}],
          unauthorised: true,
          supportID: undefined
        };

        expect(exportPayloadReducer(initialState, action)).toStrictEqual(expectedResult);
  });

    it('should recude an unauthorised export payload landing edit to unauthorised', () => {
        const initialState = {
          items: [{}]
        };

        const action = {
          exportPayload: {

          },
          type : 'export-certificate/export-payload/landing_updated_unauthorised'
        };

        const expectedResult = {
          items: [{}],
          unauthorised: true,
          supportID: undefined
        };

        expect(exportPayloadReducer(initialState, action)).toStrictEqual(expectedResult);
    });

    it('should reduce an unauthorised export payload landing delete to unauthorised', () => {
        const initialState = {
          items: [
            {
                product: {
                    commodityCode: '03047190',
                    id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                    presentation: {
                        code: 'FIL',
                        label: 'Filleted'
                    },
                    species: {
                        code: 'COD',
                        label: 'Atlantic cod (COD)'
                    },
                    state: {
                        code: 'FRO',
                        label: 'Frozen'
                    }
                },
                landings : [
                    {
                        addMode: false,
                        editMode: false,
                        model: {
                            dateLanded   : '2019-03-05T00:00:00.000Z',
                            exportWeight : 150,
                            id           : '37c05560-38c9-451e-ab85-1718f682b870',
                            vessel       : {
                                domId: 'ANNISABELLA-LO61',
                                homePort: 'LOWESTOFT',
                                imoNumber: '',
                                label: 'ANN ISABELLA (LO61)',
                                licenceNumber: '20178',
                                pln: 'LO61',
                                registrationNumber: '',
                                vesselName: 'ANN ISABELLA'
                            }
                        }
                    }
                ]
            }
        ]
      };

      const action = {
        exportPayload : {
            items : [
                {
                    product: {
                        commodityCode: '03047190',
                        id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                        presentation: {
                            code: 'FIL',
                            label: 'Filleted'
                        },
                        species: {
                            code: 'COD',
                            label: 'Atlantic cod (COD)'
                        },
                        state: {
                            code: 'FRO',
                            label: 'Frozen'
                        }
                    },
                    landings : [
                        {
                            addMode: false,
                            editMode: false,
                            model: {
                                dateLanded   : '2019-03-10T00:00:00.000Z',
                                exportWeight : 200,
                                id           : '37c05560-38c9-451e-ab85-1718f682b870',
                                vessel       : {
                                    domId: 'ANNISABELLA-LO61',
                                    homePort: 'LOWESTOFT',
                                    imoNumber: '',
                                    label: 'ANN ISABELLA (LO61)',
                                    licenceNumber: '20178',
                                    pln: 'LO61',
                                    registrationNumber: '',
                                    vesselName: 'ANN ISABELLA'
                                }
                            }
                        }
                    ]
                }
            ]
        },
        type : 'export-certificate/export-payload/landing_remove-unauthorised'
      };

      const expectedResult = {
        items: [
          {
              product: {
                  commodityCode: '03047190',
                  id: 'c5fbae94-cc06-4326-aa8b-7426063f3a00',
                  presentation: {
                      code: 'FIL',
                      label: 'Filleted'
                  },
                  species: {
                      code: 'COD',
                      label: 'Atlantic cod (COD)'
                  },
                  state: {
                      code: 'FRO',
                      label: 'Frozen'
                  }
              },
              landings : [
                  {
                      addMode: false,
                      editMode: false,
                      model: {
                          dateLanded   : '2019-03-05T00:00:00.000Z',
                          exportWeight : 150,
                          id           : '37c05560-38c9-451e-ab85-1718f682b870',
                          vessel       : {
                              domId: 'ANNISABELLA-LO61',
                              homePort: 'LOWESTOFT',
                              imoNumber: '',
                              label: 'ANN ISABELLA (LO61)',
                              licenceNumber: '20178',
                              pln: 'LO61',
                              registrationNumber: '',
                              vesselName: 'ANN ISABELLA'
                          }
                      }
                  }
              ]
          }
        ],
        unauthorised: true,
        supportID: undefined
      };

      expect(exportPayloadReducer(initialState, action)).toStrictEqual(expectedResult);
    });
});


/*
  LANDING_UPSERT_FAILED: 'export-certificate/export-payload/landing_upsert-failed',

const initialState = { items: []};

export default(state = initialState, action) => {
  switch (action.type) {

    case exportPayloadActionTypes.LANDING_UPSERT_FAILED:
      return {
        ...state,
        items: action.exportPayload.items,
        busy: false,
        errors: action.error
      };
    case exportPayloadActionTypes.LANDING_UPDATE_FAILED:
      return {
        ...state,
        busy: false,
        errors: action.error
      };

    default:
      return state;
  }
};

*/