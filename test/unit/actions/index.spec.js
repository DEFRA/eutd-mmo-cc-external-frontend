import {
  beginApiCall,
  dispatchClearErrors,
  apiCallFailed,
  saveProcessingStatement,
  clearProcessingStatement,
  saveStorageNotes,
  saveProcessingStatementToRedis,
  getProcessingStatementFromRedis,
  generateProcessingStatementPdf,
  saveStorageNotesToRedis,
  getStorageNotesFromRedis,
  clearStorageNotes,
  generateStorageNotesPdf,
  searchVessels,
  vesselSelectedFromSearchResult,
  getAllUkFish,
  searchFish,
  speciesSelectedFromSearchResult,
  searchFishStates,
  dispatchAddSpeciesPerUserError,
  getStatesFromReferenceService,
  getPresentationsFromReferenceService,
  getCommodityCode,
  searchUkFish,
  getDocument,
  addSpeciesPerUser,
  getAddedSpeciesPerUser,
  editAddedSpeciesPerUser,
  saveAddedSpeciesPerUser,
  clearAddedSpeciesPerUser,
  getConservation,
  saveConservation,
  saveTransport,
  saveTruckCMR,
  saveTransportationDetails,
  getTransportDetails,
  addTransportDetails,
  showFullPageError,
  hideFullPageError,
  dispatchApiCallFailed,
  getVersionInfo,
  getReferenceDataReaderVersionInfo,
  addConservation,
  clearConservation,
  addTransport,
  saveConfirmDocumentDelete,
  addConfirmDocumentDelete,
  saveConfirmDocumentVoid,
  addConfirmDocumentVoid,
  clearTransportDetails,
  getExportCountry,
  saveExportCountry,
  clearExportCountry,
  getAllCountries,
  getAllVessels,
  getAllFish
} from '../../../src/client/actions/index';
import { getAddedFavouritesPerUser } from '../../../src/client/actions/favourites.actions';

import { addProduct, removeProduct } from '../../../src/client/actions/export-payload.actions';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';

jest.mock('../../../src/client/actions/export-payload.actions');
jest.mock('../../../src/client/actions/favourites.actions');

const buildResponse = (status, data, errors) => {
  return { response : { status, data : data, errors}};
};

const err400Response = buildResponse(400, '');
const err500Response = buildResponse(500, '');
const err403Response = buildResponse(403, '');
const err403WAFResponse = buildResponse(403, '<html>Your support ID is: 2732698712327933848</html>');

const resolveOrReject = (data, rejectWith) => {
    return new Promise((res, rej) => {
      if (rejectWith) {
        rej(rejectWith);
      } else {
        res({ data });
      }

    });
};

const mockStoreWithApi = (data, rejectWith=false) => configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    post: () => resolveOrReject(data, rejectWith),
    get: () => resolveOrReject(data, rejectWith),
    put: () => resolveOrReject(data, rejectWith)
  },
  referenceServiceApi: {
    post: () => resolveOrReject(data, rejectWith),
    get: () => resolveOrReject(data, rejectWith)
  }
})]);

const mockStore = configureStore([thunk]);

const itShouldFailAndDispatchShowFullPageError = (service, payload, beforeActions = [], afterActions = [],
  storeInfo = {}) => it('Should fail and dispatch a showFullPageError', () => {
  const store = mockStoreWithApi(null, err500Response)({ ...storeInfo });

  return store.dispatch(service(payload)).catch(() => {
    expect(store.getActions()).toEqual([
      ...beforeActions,
      { type: 'save', payload: { showFullPageError: true }},
      ...afterActions
    ]);
  });
});

const itShouldFailAndThrowAnError = (service, payload, actions = [], storeInfo = {}) => it('Should fail and throw a new error', async () => {
  const store = mockStoreWithApi(null, err400Response)({ ...storeInfo });

  let error = null;

  try {
    await store.dispatch(service(payload));
  } catch(err) {
    error = err;
  }

  expect(error).not.toBeNull();
  expect(store.getActions()).toEqual([...actions]);
});

const itShouldFailAndDispatchUnauthorised = (service, payload, actions = [], storeInfo = {}) => it('Should fail and dispatch an unauthorised', async () => {
  const store = mockStoreWithApi(null, err403Response)({ ...storeInfo });
  let error = null;

  try {
    await store.dispatch(service(payload));
  } catch(err) {
    error = err;
  }

  expect(error).not.toBeNull();
  expect(store.getActions()).toEqual([...actions]);
});

const itShouldFailAndDispatchWAFError = (service, payload, actions = [], storeInfo = {}) => it('Should fail and dispatch a WAF error', async () => {
  const store = mockStoreWithApi(null, err403WAFResponse)({ ...storeInfo });
  let error = null;

  try {
    await store.dispatch(service(payload));
  } catch(err) {
    error = err;
  }

  expect(error).not.toBeNull();
  expect(store.getActions()).toEqual([...actions]);
});

describe('Index Action creators', () => {

    it('should clear errors', () => {
        const expectedActions = [{type : 'clear_errors'}];
        const store = mockStore({dispatchClearErrors: {}});
        store.dispatch(dispatchClearErrors());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should Api call failed', () => {
        const expectedActions = [{type : 'api_call_failed', payload: { data: 'test' } }];
        const store = mockStore({dispatchApiCallFailed: {}});
        store.dispatch(dispatchApiCallFailed('test'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should begin api call', () => {
        const expectedActions = [{type : 'begin_api_call'}];
        const store = mockStore({beginApiCall: {}});
        store.dispatch(beginApiCall());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should have api call failed', () => {
        const expectedActions = [{type : 'api_call_failed', payload: {}}];
        const store = mockStore({apiCallFailed: {}});
        store.dispatch(apiCallFailed());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it ('should save a processing statement', () => {
        const data = {
            catches: [
                {
                    catchCertificateNumber: '123456',
                    exportWeightAfterProcessing: '12',
                    exportWeightBeforeProcessing: '12',
                    species: 'Atlantic cod',
                    totalWeightLanded: '12'
                }
            ],
            consignmentDescription: 'Atlantic cod fishcakes (16041992)',
            healthCertificateDate: '26/12/2018',
            healthCertificateNumber: '123456',
            personResponsibleForConsignment: 'Phil Merrilees'
        };
        const expectedActions = [{type: 'SAVE_PROCESSING_STATEMENT', payload: data}];
        const store = mockStore({saveProcessingStatement: data});
        store.dispatch(saveProcessingStatement(data));
        expect(store.getActions()).toEqual(expectedActions);
    });


  itShouldFailAndDispatchUnauthorised(saveProcessingStatementToRedis, {}, [{ type: 'SAVE_PROCESSING_STATEMENT_UNAUTHORISED' }]);

  itShouldFailAndDispatchUnauthorised(getProcessingStatementFromRedis, {}, [{ type: 'SAVE_PROCESSING_STATEMENT_UNAUTHORISED' }]);

  itShouldFailAndDispatchWAFError(saveProcessingStatementToRedis, {}, [
    { type: 'SAVE_PROCESSING_STATEMENT_WAF_ERROR', supportID: '2732698712327933848' }
  ]);

    it('should clear a processing statement', () => {
        const expectedActions = [{type: 'CLEAR_PROCESSING_STATEMENT'}];
        const store = mockStore({clearProcessingStatement: {}});
        store.dispatch(clearProcessingStatement({}));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should save storage notes', () => {
        const data = {
            catches: [
                {
                    certificateNumber: '122112',
                    commodityCode: '123456',
                    dateOfUnloading: '24/02/2019',
                    placeOfUnloading: 'Felixstowe',
                    product: 'Atlantic cod',
                    productWeight: '12',
                    transportUnloadedFrom: '123456'
                }
            ],
            storageFacilities: [
                {
                    facilityAddressOne: '91 Beach Road',
                    facilityName: 'Philip Merrilees',
                    facilityPostcode: 'NE30 2TR',
                    facilityTownCity: 'North Shields',
                    storedAs: 'chilled'
                }
            ]
        };
        const currentUrl = '/you-have-added-a-product';
        const saveToRedisIfErrors = true;

        const expectedActions = [{type: 'SAVE_STORAGE_NOTES', payload: data}];
        const store = mockStore({saveStorageNotes: data});
        store.dispatch(saveStorageNotes(data, currentUrl, saveToRedisIfErrors));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('get / save processingStatementToRedis', () => {

      const data = {
        catches: [
            {
                catchCertificateNumber: '123456',
                exportWeightAfterProcessing: '12',
                exportWeightBeforeProcessing: '12',
                species: 'Atlantic cod',
                totalWeightLanded: '12'
            }
        ],
        consignmentDescription: 'Atlantic cod fishcakes (16041992)',
        healthCertificateDate: '26/12/2018',
        healthCertificateNumber: '123456',
        personResponsibleForConsignment: 'Phil Merrilees'
      };

      describe('#saveProcessingStatementToRedis', () => {

        it('should save processing statement to redis', () => {

            const currentUrl = '/you-have-added-a-product';
            const saveToRedisIfErrors = true;

            const expectedActions = [{type: 'SAVE_PROCESSING_STATEMENT',
                                        payload: {
                                                    ...data,
                                                    errors: {}
                                                }
                                            }
                                        ];

            const store = mockStoreWithApi(data)({saveProcessingStatementToRedis: data});

            return store.dispatch(saveProcessingStatementToRedis({ data, currentUrl, saveToRedisIfErrors })).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should save processing statement to redis with a document number', () => {

          const currentUrl = '/you-have-added-a-product';
          const saveToRedisIfErrors = true;
          const documentNumber = 'some-document-number';

          const expectedActions = [{type: 'SAVE_PROCESSING_STATEMENT',
                                      payload: {
                                                  ...data,
                                                  errors: {}
                                              }
                                          }
                                      ];

          const store = mockStoreWithApi(data)({saveProcessingStatementToRedis: data});

          return store.dispatch(saveProcessingStatementToRedis({data, currentUrl, saveToRedisIfErrors, documentNumber})).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

        itShouldFailAndDispatchShowFullPageError(saveProcessingStatementToRedis, {});

        itShouldFailAndThrowAnError(saveProcessingStatementToRedis, {});

      });

      describe('#getProcessingStatementFromRedis', () => {

        it('Should get processing statement from redis', () => {

            const expectedActions = [{type: 'SAVE_PROCESSING_STATEMENT', payload: data}];

            const store = mockStoreWithApi(data)({saveProcessingStatementToRedis: data});

            return store.dispatch(getProcessingStatementFromRedis()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        itShouldFailAndDispatchShowFullPageError(getProcessingStatementFromRedis, {});

        itShouldFailAndThrowAnError(getProcessingStatementFromRedis, {});

      });

    });

    describe('#generateProcessingStatementPdf', () => {

      const currentUrl = '/you-have-added-a-product';

      const data = {
          catches: [
              {
                  catchCertificateNumber: '123456',
                  exportWeightAfterProcessing: '12',
                  exportWeightBeforeProcessing: '12',
                  species: 'Atlantic cod',
                  totalWeightLanded: '12'
              }
          ],
          consignmentDescription: 'Atlantic cod fishcakes (16041992)',
          healthCertificateDate: '26/12/2018',
          healthCertificateNumber: '123456',
          personResponsibleForConsignment: 'Phil Merrilees'
      };

      it('Should generate processing statement PDF', () => {
        const expectedActions = [{type: 'CLEAR_PROCESSING_STATEMENT'},
                                 {payload: data, type: 'SAVE_PROCESSING_STATEMENT'}];

        const store = mockStoreWithApi(data)({generateProcessingStatementPdf: data});
        return store.dispatch(generateProcessingStatementPdf(currentUrl)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('Should generate processing statement PDF with a document number', () => {
        const expectedActions = [{type: 'CLEAR_PROCESSING_STATEMENT'},
                                 {payload: data, type: 'SAVE_PROCESSING_STATEMENT'}];

        const store = mockStoreWithApi(data)({generateProcessingStatementPdf: data});
        return store.dispatch(generateProcessingStatementPdf(currentUrl, 'GBR-2020-PS-F5A5ED0DB')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('Should fail and dispatch a list of inline summary errors', () => {
        const error = ['some-error'];
        const store = mockStoreWithApi(null, { response : { data : error }})({generateProcessingStatementPdf: data});

        return store.dispatch(generateProcessingStatementPdf(currentUrl, 'GBR-2020-PS-F5A5ED0DB')).catch((err) => {
          expect(store.getActions()).toEqual([
            { type: 'show_inline_summary_errors_ps_sd', payload: { validationErrors: ['some-error']}}
          ]);

          expect(err).toEqual(new Error({ data : error }));
        });
      });

      itShouldFailAndDispatchShowFullPageError(generateProcessingStatementPdf, currentUrl);

      itShouldFailAndThrowAnError(generateProcessingStatementPdf, currentUrl);

    });

    describe('get / save storageNotesToRedis', () => {

      const currentUrl = '/you-have-added-a-product';
      const data = {
          catches: [
              {
                  certificateNumber: '122112',
                  commodityCode: '123456',
                  dateOfUnloading: '24/02/2019',
                  placeOfUnloading: 'Felixstowe',
                  product: 'Atlantic cod',
                  productWeight: '12',
                  transportUnloadedFrom: '123456'
              }
          ],
          storageFacilities: [
              {
                  facilityAddressOne: '91 Beach Road',
                  facilityName: 'Philip Merrilees',
                  facilityPostcode: 'NE30 2TR',
                  facilityTownCity: 'North Shields',
                  storedAs: 'chilled'
              }
          ]
      };


      describe('#saveStorageNotesToRedis', () => {

        it('should save storage notes to redis', () => {

            const payload = { data, currentUrl, documentNumber: undefined };

            const expectedActions = [{payload: data, type: 'SAVE_STORAGE_NOTES'}];

            const store = mockStoreWithApi(data)({saveStorageNotesToRedis: data});
            return store.dispatch(saveStorageNotesToRedis(payload)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should save storage notes to redis with a given document number', () => {

          const payload = { data, currentUrl, documentNumber: 'GBR-2020-SD-39BE01494' };

          const expectedActions = [{payload: data, type: 'SAVE_STORAGE_NOTES'}];

          const store = mockStoreWithApi(data)({saveStorageNotesToRedis: data});
          return store.dispatch(saveStorageNotesToRedis(payload)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

        itShouldFailAndDispatchShowFullPageError(saveStorageNotesToRedis, {
          data,
          currentUrl,
          documentNumber: undefined });

        itShouldFailAndThrowAnError(saveStorageNotesToRedis, {
          data,
          currentUrl,
          documentNumber: undefined });

        itShouldFailAndDispatchUnauthorised(saveStorageNotesToRedis, {
            data,
            currentUrl,
            documentNumber: 'unauthorised-document-number'
        }, [{
          type: 'SAVE_STORAGE_NOTES_UNAUTHORISED'
        }]);

        itShouldFailAndDispatchWAFError(saveStorageNotesToRedis, {}, [
          { type: 'SAVE_STORAGE_NOTES_WAF_ERROR', supportID: '2732698712327933848' }
        ]);
      });

      describe('#getStorageNotesFromRedis', () => {

        it('should get storage notes from redis', () => {
            const expectedActions = [{payload: data, type: 'SAVE_STORAGE_NOTES'}];

            const store = mockStoreWithApi(data)({getStorageNotesFromRedis: data});
            return store.dispatch(getStorageNotesFromRedis()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should get storage notes from redis with document number', () => {
          const expectedActions = [{payload: data, type: 'SAVE_STORAGE_NOTES'}];

          const store = mockStoreWithApi(data)({getStorageNotesFromRedis: data});
          return store.dispatch(getStorageNotesFromRedis('GBR-2020-SD-39BE01494')).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

        itShouldFailAndDispatchShowFullPageError(getStorageNotesFromRedis, {});

        itShouldFailAndThrowAnError(getStorageNotesFromRedis, {});

        itShouldFailAndDispatchUnauthorised(getStorageNotesFromRedis, {}, [{
          type: 'SAVE_STORAGE_NOTES_UNAUTHORISED'
        }]);
      });
    });

    it('should clear storage notes', () => {
        const data = {};
        const expectedActions = [{payload: {}, type: 'CLEAR_STORAGE_NOTES'}];

        const store = mockStore({clearStorageNotes: data});
        store.dispatch(clearStorageNotes(data));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('#generateStorageNotesPdf', () => {
      const currentUrl = '/you-have-added-a-product';
      const documentNumber = 'some-document-number';
      const data = {
          catches: [
              {
                  certificateNumber: '122112',
                  commodityCode: '123456',
                  dateOfUnloading: '24/02/2019',
                  placeOfUnloading: 'Felixstowe',
                  product: 'Atlantic cod',
                  productWeight: '12',
                  transportUnloadedFrom: '123456'
              }
          ],
          storageFacilities: [
              {
                  facilityAddressOne: '91 Beach Road',
                  facilityName: 'Philip Merrilees',
                  facilityPostcode: 'NE30 2TR',
                  facilityTownCity: 'North Shields',
                  storedAs: 'chilled'
              }
          ]
      };

      it('should generate storage notes PDF', () => {
          const expectedActions = [{payload: {pdf: data}, type: 'SAVE_STORAGE_NOTES'}];

          const store = mockStoreWithApi(data)({generateStorageNotesPdf: data});
          return store.dispatch(generateStorageNotesPdf(currentUrl)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should generate storage notes PDF when window layer is undefined', () => {
        const layer = global.dataLayer;

        global.dataLayer = undefined;
        const expectedActions = [{payload: {pdf: data}, type: 'SAVE_STORAGE_NOTES'}];

        const store = mockStoreWithApi(data)({generateStorageNotesPdf: data});
        return store.dispatch(generateStorageNotesPdf(currentUrl)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);

            global.dataLayer = layer;
        });
    });

      it('should generate storage notes PDF with a document number', () => {
        const expectedActions = [{payload: {pdf: data}, type: 'SAVE_STORAGE_NOTES'}];

        const store = mockStoreWithApi(data)({generateStorageNotesPdf: data});
        return store.dispatch(generateStorageNotesPdf(currentUrl, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('Should fail and dispatch a list of inline summary errors', () => {
        const error = ['some-error'];
        const store = mockStoreWithApi(null, { response : { data : error }})({generateStorageNotesPdf: data});

        return store.dispatch(generateStorageNotesPdf(currentUrl, documentNumber)).catch((err) => {
          expect(store.getActions()).toEqual([
            { type: 'show_inline_summary_errors_ps_sd', payload: { validationErrors: ['some-error']}}
          ]);

          expect(err).toEqual(new Error({ data : error }));
        });
      });

      itShouldFailAndDispatchShowFullPageError(generateStorageNotesPdf, {});

      itShouldFailAndThrowAnError(generateStorageNotesPdf, {});

    });

    describe('#Vessels', () => {

      const param = 'BEL';
      const data = [
          {pln:'B192', vesselName:'GOLDEN BELLS 11', homePort :'ARDGLASS', registrationNumber:'', licenceNumber:'10106', imoNumber:''},
          {pln:'BCK126', vesselName:'ZARA ANNABEL'    , homePort :'UNKNOWN'   , registrationNumber:'', licenceNumber:'42095', imoNumber:'8966640'},
          {pln:'BD277',  vesselName:'OUR OLIVIA BELLE', homePort :'ILFRACOMBE', registrationNumber:'', licenceNumber:'11956', imoNumber:''}
      ];

      const landedDate = moment('2019-02-01');
      const landedDateStr = '2019-02-01';

      describe('#searchVessels', () => {
        it('should search for vessels with a landed date', () => {
            const expectedUrl = `/vessels/search?searchTerm=BEL&landedDate=${landedDateStr}`;
            const referenceServiceApiMock = jest.fn();

            referenceServiceApiMock.get = () => _;

            const searchVesselsGET = jest.spyOn(referenceServiceApiMock,'get');

            searchVessels(param, landedDate)('', '', {referenceServiceApi : referenceServiceApiMock});

            expect(searchVesselsGET).toHaveBeenCalledWith(expectedUrl);
        });

        it('should search for vessels (no param)', () => {
            const expectedActions = [{payload: { data }, type: 'search_vessels'}];

            const store = mockStoreWithApi(data)({searchVessels: data});
            return store.dispatch(searchVessels()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

      });

      describe('#vesselSelectedFromSearchResult', () => {

        it('should select vessel from search results', () => {
            const expectedActions = [{type : 'clear_vessels_search_results'}];
            const store = mockStore({vesselSelectedFromSearchResult : {}});
            store.dispatch(vesselSelectedFromSearchResult());
            expect(store.getActions()).toEqual(expectedActions);
        });

      });

    });

    describe('Fish', () => {
      const param = 'cod';

      const data = [
          {faoCode:'COD',reportingFaoCode:'COD',faoName:'Atlantic cod',commonNames:['Cod'],scientificName:'Gadus morhua',commonRank:1,searchRank:1},
          {faoCode:'AIM',reportingFaoCode:'',faoName:'Dwarf codling',commonNames:[],scientificName:'Austrophycis marginata',commonRank:1,searchRank:2},
          {faoCode:'AOY',reportingFaoCode:'',faoName:'Crocodile snake eel',commonNames:[],scientificName:'Brachysomophis crocodilinus',commonRank:1,searchRank:2}
      ];

      describe('#getAllUkFish', () => {

        it('should get UK fish', () => {
            const expectedActions = [{payload: { allFish: data }, type: 'save'}];

            const store = mockStoreWithApi(data)({getAllUkFish: data});
            return store.dispatch(getAllUkFish()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

      });

      describe('#searchFish', () => {

        it('should search for fish', () => {
            const expectedActions = [{payload: {data}, type: 'search_fish'}];

            const store = mockStoreWithApi(data)({searchFish: data});
            return store.dispatch(searchFish(param)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        it('should search for fish (no param)', () => {
            const expectedActions = [{payload: {data}, type: 'search_fish'}];

            const store = mockStoreWithApi(data)({searchFish: data});
            return store.dispatch(searchFish()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

      });

    });

    it('should select species from search result', () => {
        const expectedActions = [{type: 'clear_species_search_results'}];
        const store = mockStore({speciesSelectedFromSearchResult: {}});
        store.dispatch(speciesSelectedFromSearchResult());
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('#searchFishStates', () => {
      const faoCode = 'COD';
      const data = [{state: {code: 'FRO', description: 'Frozen'},
                     presentations: [
                       {code: 'BMS', description: 'Below minimum conservation reference size'},
                       {code: 'FIL', description: 'Filleted'},
                       {code: 'FIS', description: 'Filleted and skinned fillets'},
                       {code: 'GUH', description: 'Gutted and headed'},
                       {code: 'GUT', description: 'Gutted'},
                       {code: 'JAP', description: 'Japanese cut'},
                                     {code: 'OTH', description: 'Other'},
                                     {code: 'ROE', description: 'Roe(s)'},
                                     {code: 'SGH', description: 'Salted'},
                                     {code: 'SGT', description: 'Salted gutted'},
                                     {code: 'WHL', description: 'Whole'}]}];

      it('should search fish states', () => {
        const expectedActions = [{
          type: 'search_fish_states',
          payload: {
            data : [ {
              'presentations': [
                { 'label': 'Below minimum conservation reference size', 'value': 'BMS'},
                {'label': 'Filleted', 'value': 'FIL'},
                {'label': 'Filleted and skinned fillets', 'value': 'FIS'},
                {'label': 'Gutted and headed', 'value': 'GUH'},
                {'label': 'Gutted', 'value': 'GUT'},
                {'label': 'Japanese cut', 'value': 'JAP'},
                {'label': 'Other', 'value': 'OTH'},
                {'label': 'Roe(s)', 'value': 'ROE'},
                {'label': 'Salted', 'value': 'SGH'},
                {'label': 'Salted gutted', 'value': 'SGT'},
                {'label': 'Whole', 'value': 'WHL'}
              ],
              'state': { 'label': 'Frozen', 'value': 'FRO' }
            }]
          }
        }];

        const store = mockStoreWithApi(data)({searchFishStates: data});

        return store.dispatch(searchFishStates(faoCode)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should search fish states (no returned data)', () => {
        const expectedActions = [{
          type: 'search_fish_states',
          payload: {
            data: null
          }
        }];
        const store = mockStoreWithApi(null)({searchFishStates: data});

        return store.dispatch(searchFishStates(faoCode)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

    });

    it('should add species per user error', () => {
        const params = 'species error';
        const expectedActions = [{payload: {data: {message: '[species error]'}}, type: 'add_species_per_user_failed'}];
        const store = mockStore({dispatchAddSpeciesPerUserError: {}});
        store.dispatch(dispatchAddSpeciesPerUserError(params));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('#getStatesFromReferenceService', () => {
      const data = [
        {value:'ALI',label:'Alive'},
        {value:'BOI',label:'Boiled'},
        {value:'DRI',label:'Dried'},
        {value:'FRE',label:'Fresh'},
        {value:'FRO',label:'Frozen'},
        {value:'SAL',label:'Salted'},
        {value:'SMO',label:'Smoked'}
      ];

      it('should get species states', () => {
          const expectedActions = [{type: 'get_species_states', payload: {data}}];

          const store = mockStoreWithApi(data)({getStatesFromReferenceService : data});

          return store.dispatch(getStatesFromReferenceService()).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      itShouldFailAndDispatchShowFullPageError(getStatesFromReferenceService, {});

      it('Should fail to get species states', () => {
        const expectedActions = [
          { type: 'get_species_states_failed', payload: { ...err400Response.response } },
          { type: 'get_species_states', payload: undefined }
        ];

        const store = mockStoreWithApi(data, err400Response)({getStatesFromReferenceService : data});

        return store.dispatch(getStatesFromReferenceService()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

    });

    describe('#getPresentationsFromReferenceService', () => {
      const data = [
        { value:'CBF',label:'Cod butterfly (escalado)' },
        { value:'CLA',label:'Claws' },
        { value:'DWT',label:'ICCAT code' },
        { value:'FIL',label:'Filleted' },
        { value:'FIN',label:'Temporary Record' },
        { value:'FIS',label:'Filleted and skinned fillets' },
        { value:'FSB',label:'Filleted with skin and bones' }
      ];

      it('should get species presentations', () => {
          const expectedActions = [{type: 'get_species_presentations', payload: {data}}];

          const store = mockStoreWithApi(data)({getPresentationsFromReferenceService : data});

          return store.dispatch(getPresentationsFromReferenceService()).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      itShouldFailAndDispatchShowFullPageError(getPresentationsFromReferenceService, {});

      it('Should fail to get species presentations', () => {
        const expectedActions = [
          { type: 'get_species_presentations_failed', payload: { ...err400Response.response } },
        ];

        const store = mockStoreWithApi(data, err400Response)({getStatesFromReferenceService : data});

        return store.dispatch(getPresentationsFromReferenceService()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    it('should get commodity codes', () => {
        const params = {
            speciesCode  : 'COD',
            presentation : 'FIL',
            state        : 'FRE'
        };

        let data = [{code:'03044410',description:'Fresh or chilled fillets of cod Gadus morhua, Gadus ogac, Gadus macrocephalus and of Boreogadus saida'}];

        const store = mockStoreWithApi(data)({getCommodityCode : data});

        const expectedActions = [{type: 'get_commodity_code', payload: {data}}];

        return store.dispatch(getCommodityCode(params)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('#searchUkFish', () => {
      const params = 'COD';

      const data = [
          {faoCode:'COD',reportingFaoCode:'COD',faoName:'Atlantic cod',commonNames:['Cod'],'scientificName':'Gadus morhua',commonRank:1,searchRank:1},
          {faoCode:'NEC',reportingFaoCode:'NEC',faoName:'Red codling',commonNames:['New Zealand Red Cod'],scientificName:'Pseudophycis bachus',commonRank:1,searchRank:1}
      ];

      const expectedActions = [{type: 'search_fish', payload: {data}}];

      it('should search UK fish', () => {
          const store = mockStoreWithApi(data)({searchUkFish : data});

          return store.dispatch(searchUkFish(params)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should search UK fish (no params)', () => {
          const store = mockStoreWithApi(data)({searchUkFish : data});

          return store.dispatch(searchUkFish()).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

    });

    describe('#getDocument', () => {
      const service = 'CC';
      const data = {documentNumber:'GBR-2019-CC-77B7775A8',startedAt:'07 Mar 2019'};

      it('should get a document', () => {
        const expectedActions = [{type: 'get_document', payload: {data}}];
        const store = mockStoreWithApi(data)({getDocument : data});

        return store.dispatch(getDocument(service)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      itShouldFailAndThrowAnError(getDocument, service);
      itShouldFailAndDispatchShowFullPageError(getDocument, service);
    });

    describe('#addSpeciesPerUser', () => {

      let params ;
      let expectedActions ;

      beforeEach(() => {
        addProduct.mockReturnValue({ type : 'add_product' });
        removeProduct.mockReturnValue({ type: 'remove_product' });
        getAddedFavouritesPerUser.mockReturnValue({ type: 'get_added_favourites_per_user' });

        params = {
          id : '1de25edf-8f04-425b-a558-c4037afcfe7c',
          user_id : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
          species : 'Atlantic cod (COD)',
          speciesCode : 'COD',
          state : 'FRO',
          stateLabel : 'Frozen',
          presentation : 'FIL',
          presentationLabel : 'Filleted',
          commodity_code : '03047190'
        };

        expectedActions = [
          {
            type: 'begin_api_call'
          },
          {
            type: 'hide_added_to_favourites_notification'
          },
          {
            type: 'add_product'
          },
          {
            payload: {
              data: {
                commodity_code: '03047190',
                id: '1de25edf-8f04-425b-a558-c4037afcfe7c',
                presentation: 'FIL',
                presentationLabel: 'Filleted',
                species: 'Atlantic cod (COD)',
                speciesCode: 'COD',
                state: 'FRO',
                stateLabel: 'Frozen',
                user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
              }
            },
            type: 'add_species_per_user'
          }
        ];
      });

      const documentNumber = 'GBR-XXXX-CC-XXXXXX';

      it('should add species per user', () => {
        const store = mockStoreWithApi(params)({addSpeciesPerUser : params});

        return store.dispatch(addSpeciesPerUser(params)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should include action added_to_favourites if response includes addedToFavourites === true', () => {
        params.addedToFavourites = true;
        const store = mockStoreWithApi(params)({addSpeciesPerUser : params});
        expectedActions.push(expectedActions[3]);
        expectedActions[4].payload.data.addedToFavourites = true;
        expectedActions[3] = {type: 'added_to_favourites', payload: {addedFavouriteProduct : expectedActions[4].payload.data}};

        const [ firstAction, secondAction, thirdAction, fourthAction, fifthAction ] = expectedActions;


        return store.dispatch(addSpeciesPerUser(params)).then(() => {
          expect(store.getActions()).toEqual([ firstAction, secondAction, thirdAction, fourthAction, { type: 'get_added_favourites_per_user' }, fifthAction ]);
        });
      });

      it('should include action added_to_favourites if response includes addedToFavourites === false', () => {
        params.addedToFavourites = false;
        const store = mockStoreWithApi(params)({addSpeciesPerUser : params});
        expectedActions.push(expectedActions[3]);
        expectedActions[4].payload.data.addedToFavourites = false;
        expectedActions[3] = {type: 'added_to_favourites', payload: {addedFavouriteProduct : expectedActions[4].payload.data}};

        return store.dispatch(addSpeciesPerUser(params)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should not include action added_to_favourites if response does not include property  addedToFavourites', () => {
        const store = mockStoreWithApi(params)({addSpeciesPerUser : params});

        return store.dispatch(addSpeciesPerUser(params)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should add species per user with a document number', () => {
        const store = mockStoreWithApi(params)({addSpeciesPerUser : params});

        return store.dispatch(addSpeciesPerUser(params, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should remove species per user', () => {
        const expected = expectedActions.slice();
        expected[2] = { type: 'remove_product' };
        expected[3] = { type: 'removed_species_per_user', payload : { data : { ...params, cancel: true } } };
        const store = mockStoreWithApi({ ...params, cancel: true })({addSpeciesPerUser : params});

        return store.dispatch(addSpeciesPerUser(params)).then(() => {
            expect(store.getActions()).toEqual(expected);
        });
      });

      it('should add species per user (no params)', () => {
        const store = mockStoreWithApi(params)({addSpeciesPerUser : params});

        return store.dispatch(addSpeciesPerUser(null)).then(() => {
            expect(store.getActions()).toEqual([{ type: 'add_species_per_user', payload: undefined }]);
        });
      });

      it('Should fail and dispatch a showFullPageError', () => {
        const store = mockStoreWithApi(null, err500Response)();

        return store.dispatch(addSpeciesPerUser(params)).catch(() => {
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'hide_added_to_favourites_notification' },
            { type: 'save', payload: { showFullPageError: true }},
            { type: 'api_call_failed', payload: { ...err500Response.response }}
          ]);
        });
      });

      it('Should fail and dispatch a api_call_failed', () => {
        const store = mockStoreWithApi(null, err400Response)();

        return store.dispatch(addSpeciesPerUser(params)).catch(() => {
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'hide_added_to_favourites_notification' },
            { type: 'api_call_failed', payload: { ...err400Response.response }}
          ]);
        });
      });

      it('Should fail and dispatch a get request for favourites if from favourites tab', () => {

        const store = mockStoreWithApi(null, err400Response)();

        return store.dispatch(addSpeciesPerUser({ ...params, addToFavourites: true })).catch(() => {
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'hide_added_to_favourites_notification' },
            { type: 'get_added_favourites_per_user' },
            { type: 'api_call_failed', payload: { ...err400Response.response }}
          ]);
        });
      });

      it('Should fail and dispatch unauthorised', () => {
        const store = mockStoreWithApi(null, err403Response)();

        return store.dispatch(addSpeciesPerUser(params)).catch(() => {
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'api_call_failed', payload: { ...err403Response.response }}
          ]);
        });
      });

      it('Should refresh favourites after adding product as favourite', () => {
        const store = mockStoreWithApi({ ...params, addedToFavourites: true })({ addSpeciesPerUser : {...params, addedToFavourites: true } });

        return store.dispatch(addSpeciesPerUser({ ...params, addToFavourites: true })).then(() => {
            expect(store.getActions().map(action => action.type)).toContain('get_added_favourites_per_user');
        });
      });

    });

    describe('#getAddedSpeciesPerUser', () => {

      it('should get added species per user', () => {
        const data = [
          {
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'state':'FRO',
            'stateLabel':'Frozen',
            'presentation':'FIL',
            'presentationLabel':'Filleted',
            'commodity_code':'03047190'
          },
          {
            'id':'1de25edf-8f04-425b-a558-c4037afcfe7c',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'species':'Atlantic cod (COD)',
            'speciesCode':'COD',
            'state':'FRO',
            'stateLabel':'Frozen',
            'presentation':'FIL',
            'presentationLabel':'Filleted',
            'commodity_code':'03047190'
          }
        ];

        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'get_added_species_per_user', payload: {data} }
        ];
        const store = mockStoreWithApi(data)({getAddedSpeciesPerUser : data});

        return store.dispatch(getAddedSpeciesPerUser()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('clear the states and presentations if the last added species has no state data', () => {
        const data = [
          {
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'state':'FRO',
            'stateLabel':'Frozen',
            'presentation':'FIL',
            'presentationLabel':'Filleted',
            'commodity_code':'03047190'
          },
          {
            'id':'1de25edf-8f04-425b-a558-c4037afcfe7c',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'species':'Atlantic cod (COD)',
            'speciesCode':'COD'
          }
        ];
        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'get_added_species_per_user', payload: {data} },
          { type: 'get_species_states_clear' },
          { type: 'get_species_presentations_clear' }
        ];
        const store = mockStoreWithApi(data)({getAddedSpeciesPerUser : data});

        return store.dispatch(getAddedSpeciesPerUser()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      itShouldFailAndDispatchShowFullPageError(getAddedSpeciesPerUser, {});

      it('Should fail to get added species per user', () => {
        const data = [
          {
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
          }
        ];

        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'get_added_species_per_user_failed', payload: { ...err400Response.response } },
        ];

        const store = mockStoreWithApi(data, err400Response)();

        return store.dispatch(getAddedSpeciesPerUser()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });

      });

      itShouldFailAndDispatchUnauthorised(getAddedSpeciesPerUser, {}, [{ type: 'clear_errors' },{ type: 'get_added_species_unauthorised' }]);

      it('should clear species and states if no species fetched', () => {
        const data = [];

        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'get_added_species_per_user', payload: {data} },
          { type: 'get_species_states_clear' },
          { type: 'get_species_presentations_clear' }
        ];
        const store = mockStoreWithApi(data)({getAddedSpeciesPerUser : data});

        return store.dispatch(getAddedSpeciesPerUser()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

   describe('#editAddedSpeciesPerUser', () => {
      it('should edit a species as changed by the exporter', () => {
        const productId = '9b4e24dc-c344-415c-930f-7ad223c958c5';
        const documentNumber = 'some-document-number';
        const params = {
          id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
          redirect: '/some-redirect',
          species: 'Atlantic cod (COD)',
          state: 'FRO',
          presentation: 'FIL',
          commodity_code: '03047190',
          commodity_code_description: 'some-commodity-code-description'
        };

        const data = [
          {
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'state':'FRO',
            'stateLabel':'Frozen',
            'presentation':'FIL',
            'presentationLabel':'Filleted',
            'commodity_code':'03047190',
            'commodity_code_description':'some-commodity-code-description'
          }
        ];

        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'hide_added_to_favourites_notification' },
          { type: 'edit_added_species_per_user', payload: { data } }
        ];
        const store = mockStoreWithApi(data)({ editAddedSpeciesPerUser : data });

        return store.dispatch(editAddedSpeciesPerUser(productId, params, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should edit a species as changed by the exporter without a document number', () => {
        const productId = '9b4e24dc-c344-415c-930f-7ad223c958c5';
        const params = {
          id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
          redirect: '/some-redirect',
          species: 'Atlantic cod (COD)',
          state: 'FRO',
          presentation: 'FIL',
          commodity_code: '03047190',
          commodity_code_description: 'some-commodity-code-description'
        };

        const data = [
          {
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'state':'FRO',
            'stateLabel':'Frozen',
            'presentation':'FIL',
            'presentationLabel':'Filleted',
            'commodity_code':'03047190',
            'commodity_code_description':'some-commodity-code-description'
          }
        ];

        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'hide_added_to_favourites_notification' },
          { type: 'edit_added_species_per_user', payload: { data } }
        ];
        const store = mockStoreWithApi(data)({ editAddedSpeciesPerUser : data });

        return store.dispatch(editAddedSpeciesPerUser(productId, params)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should edit a species as changed by the exporter and add favourites', () => {
        const productId = '9b4e24dc-c344-415c-930f-7ad223c958c5';
        const documentNumber = 'some-document-number';
        const params = {
          id: '9b4e24dc-c344-415c-930f-7ad223c958c5',
          redirect: '/some-redirect',
          species: 'Atlantic cod (COD)',
          state: 'FRO',
          presentation: 'FIL',
          commodity_code: '03047190',
          commodity_code_description: 'some-commodity-code-description'
        };

        const data = {
          products: [
            {
              'species':'Atlantic cod (COD)',
              'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
              'speciesCode':'COD',
              'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              'state':'FRO',
              'stateLabel':'Frozen',
              'presentation':'FIL',
              'presentationLabel':'Filleted',
              'commodity_code':'03047190',
              'commodity_code_description':'some-commodity-code-description'
            }
          ],
          favourite: {
            'addedToFavourites': true,
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            'state':'FRO',
            'stateLabel':'Frozen',
            'presentation':'FIL',
            'presentationLabel':'Filleted',
            'commodity_code':'03047190',
            'commodity_code_description':'some-commodity-code-description'
          }
        };

        const expectedActions = [
          { type: 'clear_errors' },
          { type: 'hide_added_to_favourites_notification' },
          { type: 'added_to_favourites', payload: { addedFavouriteProduct: data.favourite }},
          { type: 'get_added_favourites_per_user' },
          { type: 'edit_added_species_per_user', payload: { data } }
        ];
        const store = mockStoreWithApi(data)({ editAddedSpeciesPerUser : data });

        return store.dispatch(editAddedSpeciesPerUser(productId, params, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      itShouldFailAndThrowAnError(editAddedSpeciesPerUser, {}, [{ type: 'clear_errors' },{ type: 'hide_added_to_favourites_notification' },{ type: 'api_call_failed', payload: { ...err400Response.response } }]);
      itShouldFailAndDispatchShowFullPageError(editAddedSpeciesPerUser, {}, [{ type: 'clear_errors' }, { type: 'hide_added_to_favourites_notification' }]);
      itShouldFailAndDispatchUnauthorised(editAddedSpeciesPerUser, {}, [{ type: 'clear_errors' },{ type: 'hide_added_to_favourites_notification' },{ type: 'edit_added_species_per_user_unauthorised' }]);
    });

    describe('#saveAddedSpeciesPerUser', () => {

      it('should save added species per user', () => {
        const data = {
          species: [
            {
              'species':'Atlantic cod (COD)',
              'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
              'speciesCode':'COD',
              'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              'state':'FRO',
              'stateLabel':'Frozen',
              'presentation':'FIL',
              'presentationLabel':'Filleted',
              'commodity_code':'03047190'
            },
            {
              'id':'1de25edf-8f04-425b-a558-c4037afcfe7c',
              'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              'species':'Atlantic cod (COD)',
              'speciesCode':'COD',
              'state':'FRO',
              'stateLabel':'Frozen',
              'presentation':'FIL',
              'presentationLabel':'Filleted',
              'commodity_code':'03047190'
            }
          ]
        };

        const expectedActions = [{
          type: 'clear_errors'
        }];
        const store = mockStoreWithApi(data)({getAddedSpeciesPerUser : data});

        return store.dispatch(saveAddedSpeciesPerUser()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      itShouldFailAndDispatchShowFullPageError(saveAddedSpeciesPerUser, null, [], [{
        payload: {
          data: '',
          status: 500,
        },
        type: 'api_call_failed'
      }]);

      it('Should fail to save added species per user', async () => {
        const data = [
          {
            'species':'Atlantic cod (COD)',
            'id':'9b4e24dc-c344-415c-930f-7ad223c958c5',
            'speciesCode':'COD',
            'user_id':'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
          }
        ];

        const expectedActions = [
          { type: 'api_call_failed', payload: { ...err400Response.response } },
        ];

        const store = mockStoreWithApi(data, err400Response)();
        let error = null;

        try {
          await store.dispatch(saveAddedSpeciesPerUser());
        } catch(err) {
          error = err;
        }

        expect(error).not.toBeNull();
        expect(store.getActions()).toEqual(expectedActions);

      });

      itShouldFailAndDispatchUnauthorised(saveAddedSpeciesPerUser, {}, [{ type: 'get_added_species_unauthorised' }]);
    });

    describe('#clearAddedSpeciesPerUser', () => {

      it('Should clear Added Species Per User', () => {

        const expectedActions = [
          {
            type: 'clear_added_species_per_user'
          }
        ];

        const store = mockStore({addedSpeciesPerUser: {}});
        store.dispatch(clearAddedSpeciesPerUser());
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    describe('#getConservation', () => {

      it('should get conservation', () => {
          const data = {
              caughtInUKWaters       : 'Y',
              currentUri            : '/create-catch-certificate/whose-waters-were-they-caught-in',
              nextUri               : '/create-catch-certificate/how-does-the-export-leave-the-uk',
              user_id               : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              legislation           : ['UK Fisheries Policy'],
              conservationReference : 'UK Fisheries Policy'
          };

          const expectedActions = [{ type: 'add_conservation', payload: {data} }];

          const store = mockStoreWithApi(data)({getConservation : data});

          return store.dispatch(getConservation()).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      itShouldFailAndThrowAnError(getConservation, {});
      itShouldFailAndDispatchShowFullPageError(getConservation, {});
      itShouldFailAndDispatchUnauthorised(getConservation, {}, [{ type: 'add_conservation_unauthorised' }]);
    });

    describe('#saveConservation', () => {

      it('should save conservation', () => {

          const currentUri = '/create-catch-certificate/whose-waters-were-they-caught-in';
          const nextUri = '/create-catch-certificate/how-does-the-export-leave-the-uk';

          const data = {
              caughtInUKWaters: 'Y',
              conservationReference: 'UK Fisheries Policy',
              currentUri: currentUri,
              legislation: ['UK Fisheries Policy'],
              nextUri: nextUri,
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
          };

          const expectedActions = [{ type: 'begin_api_call' }];

          const store = mockStoreWithApi(data)({saveConservation : {}});

          return store.dispatch(saveConservation(currentUri, nextUri)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should save conservation with a document number', () => {

        const documentNumber = 'GBR-XXXX-CC-XXXXXXXXXX';
        const currentUri = '/create-catch-certificate/whose-waters-were-they-caught-in';
        const nextUri = '/create-catch-certificate/how-does-the-export-leave-the-uk';
        const isConservationSavedAsDraft = false;

        const data = {
            caughtInUKWaters: 'Y',
            conservationReference: 'UK Fisheries Policy',
            currentUri: currentUri,
            legislation: ['UK Fisheries Policy'],
            nextUri: nextUri,
            user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
        };

        const expectedActions = [{ type: 'begin_api_call' }];

        const store = mockStoreWithApi(data)({saveConservation : {}});

        return store.dispatch(saveConservation(currentUri, nextUri, isConservationSavedAsDraft, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('Should fail and not throw a new error', async () => {
        const documentNumber = 'GBR-XXXX-CC-XXXXXXXXXX';
        const currentUri = '/create-catch-certificate/whose-waters-were-they-caught-in';
        const nextUri = '/create-catch-certificate/how-does-the-export-leave-the-uk';
        const isConservationSavedAsDraft = true;

        const store = mockStoreWithApi(null, err400Response)({});

        let error = null;

        try {
          await store.dispatch(saveConservation(currentUri, nextUri, isConservationSavedAsDraft, documentNumber));
        } catch(err) {
          error = err;
        }

        expect(error).toBeNull();
        expect(store.getActions()).toEqual([
          { type: 'begin_api_call' },
          { type: 'api_call_failed', payload: { ...err400Response.response } }
        ]);

      });

      itShouldFailAndThrowAnError(saveConservation, {}, [
        { type: 'begin_api_call' },
        { type: 'api_call_failed', payload: { ...err400Response.response } }
      ]);

      itShouldFailAndDispatchShowFullPageError(saveConservation, {},[{ type: 'begin_api_call' }],
        [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
      );

      it('should fail and dispatch showForbiddenPage when error status is 403', async () => {
        const store = mockStoreWithApi(null, err403Response)({});
        let error = null;

        try {
          await store.dispatch(saveConservation({}));
        } catch(err) {
          error = err;
        }

        expect(error).not.toBeNull();
        expect(store.getActions()).toEqual([
          { type: 'begin_api_call' },
          { type: 'add_conservation_unauthorised' }
        ]);
      });

      it('should fail and dispatch waf error when error status is 403 and is a Silverline error', async () => {
        const store = mockStoreWithApi(null, err403WAFResponse)({});
        let error = null;

        try {
          await store.dispatch(saveConservation({}));
        } catch(err) {
          error = err;
        }

        expect(error).not.toBeNull();
        expect(store.getActions()).toEqual([
          { type: 'begin_api_call' },
          { type: 'add_conservation_waf_error', supportID: '2732698712327933848' }
        ]);
      });
    });

    describe('#getExportCountry', () => {
      it('should get export location', () => {
          const data = {
            exportedFrom: 'United Kingdom',
            exportedTo: 'Brazil'
          };

          const expectedActions = [{ type: 'get_export_country', payload: data }];

          const store = mockStoreWithApi(data)({getExportCountry: data});

          return store.dispatch(getExportCountry()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should get export location with a given document number', () => {
          const data = {
            exportedFrom: 'United Kingdom',
            exportedTo: 'Columbia'
          };

          const expectedActions = [{ type: 'get_export_country', payload: data }];

          const store = mockStoreWithApi(data)({getExportCountry: data});

          return store.dispatch(getExportCountry('GBR-2020-CC-6F04D912B')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      itShouldFailAndThrowAnError(getExportCountry, {});
      itShouldFailAndDispatchShowFullPageError(getExportCountry, {});
      itShouldFailAndDispatchUnauthorised(getExportCountry, {}, [{ type: 'get_export_country_unauthorised' }]);
    });

    describe('#saveExportCountry', () => {
      it('should save an export location', () => {
        const currentUri = '/create-catch-certificate/what-export-journey';
        const nextUri = '/create-catch-certificate/how-does-the-export-leave-the-uk';

        const data = {
            exportedFrom: 'United Kingdom',
            currentUri: currentUri,
            nextUri: nextUri,
            user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
        };

        const expectedActions = [{ type: 'begin_api_call' }];

        const store = mockStoreWithApi(data)({saveExportCountry : {}});

        return store.dispatch(saveExportCountry(currentUri, nextUri)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should save an export location with a document number', () => {
        const currentUri = '/create-catch-certificate/what-export-journey';
        const nextUri = '/create-catch-certificate/how-does-the-export-leave-the-uk';

        const data = {
            exportedFrom: 'United Kingdom',
            currentUri: currentUri,
            nextUri: nextUri,
            user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12'
        };

        const expectedActions = [{ type: 'begin_api_call' }];

        const store = mockStoreWithApi(data)({saveExportCountry : {}});

        return store.dispatch(saveExportCountry(currentUri, nextUri, 'GBR-2020-CC-6F04D9912B')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should not error on save as draft from export location page', () => {
        const currentUri = '/create-catch-certificate/what-export-journey';
        const nextUri = '/create-catch-certificate/how-does-the-export-leave-the-uk';
        const store = mockStoreWithApi(null, err400Response)({saveExportCountry : {}});

        let error = null;

        return store.dispatch(saveExportCountry(currentUri, nextUri, 'GBR-2020-CC-6F04D9912B', true)).then(() => {
          expect(store.getActions()).toEqual(
            [
              { type: 'begin_api_call' },
              { type: 'api_call_failed', payload: { ...err400Response.response } }
            ]);
        }).catch((err) => {
          error = err;
          expect(error).toBeNull();
        });
      });

      itShouldFailAndDispatchShowFullPageError(saveExportCountry, {},[{ type: 'begin_api_call' }],
        [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
      );

      itShouldFailAndDispatchUnauthorised(saveExportCountry, {}, [
        { type: 'begin_api_call' },
        { type: 'save_export_country_unauthorised' }]);
    });

    describe('#saveTransport', () => {

      it('should save transport', () => {

          const currentUri = '/create-catch-certificate/add-transportation-details-truck';
          const journey = 'catchCertificate';

          const data = {
              cmr: 'false',
              currentUri: currentUri,
              departurePlace: 'North Shields',
              journey: 'catchCertificate',
              nationalityOfVehicle: 'United Kingdom',
              nextUri: '/create-catch-certificate/check-your-information',
              registrationNumber: '12121212',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              vehicle: 'truck'
          };

          const expectedActions = [{ type: 'begin_api_call' }];

          const store = mockStoreWithApi(data)({saveTransport : {}});

          return store.dispatch(saveTransport(currentUri, journey)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should save transport with a document number', () => {

        const currentUri = '/create-catch-certificate/add-transportation-details-truck';
        const journey = 'catchCertificate';

        const data = {
            vehicle: 'plane',
            currentUri: '/create-catch-certificate/GBR-2020-CC-72ECA260A/how-does-the-export-leave-the-uk',
            journey: 'catchCertificate'
        };

        const expectedActions = [{ type: 'begin_api_call' }];

        const store = mockStoreWithApi(data)({saveTransport : {}});

        return store.dispatch(saveTransport(currentUri, journey, false, 'GBR-2020-CC-72ECA260A')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('Should fail and not throw a new error', () => {
        const currentUri = '/create-catch-certificate/add-transportation-details-truck';
        const journey = 'catchCertificate';
        const store = mockStoreWithApi(null, err400Response)({});

        return store.dispatch(saveTransport(currentUri, journey, true, 'GBR-2020-CC-72ECA260A')).then((err) => {
          expect(err).toBeUndefined();
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'api_call_failed', payload: { ...err400Response.response } }
          ]);
        });
      });

      itShouldFailAndThrowAnError(saveTransport, {}, [
        { type: 'begin_api_call' },
        { type: 'api_call_failed', payload: { ...err400Response.response } }
      ]);

      itShouldFailAndDispatchShowFullPageError(saveTransport, {},[{ type: 'begin_api_call' }],
        [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
      );

      itShouldFailAndDispatchUnauthorised(saveTransport, {}, [
        { type: 'begin_api_call' },
        { type: 'save_transport_details_unauthorised' }]);
    });

    describe('#clearExportCountry', () => {
      it('should clear export country', () => {

        const expectedActions = [
          {
            type: 'clear_export_country'
          }
        ];

        const store = mockStore({exportedFrom: 'United Kingdom'});
        store.dispatch(clearExportCountry());
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('#saveTruckCMR', () => {

      it('should save truck CMR', () => {

          const currentUri = '/create-catch-certificate/add-transportation-details-truck';
          const journey = 'catchCertificate';

          const data = {
              cmr: 'false',
              currentUri: currentUri,
              journey: 'catchCertificate',
              nextUri: '/create-catch-certificate/check-your-information',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              vehicle: 'truck'
          };

          const expectedActions = [{ type: 'begin_api_call' }];

          const store = mockStoreWithApi(data)({saveTruckCMR : {}});

          return store.dispatch(saveTruckCMR(currentUri, journey)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });

      });

      it('should save truck CMR with a document number', () => {

        const currentUri = '/create-catch-certificate/add-transportation-details-truck';
        const journey = 'catchCertificate';
        const documentNumber = 'GBR-XXXX-CC-XXXXXXXXXX';
        const isTruckCMRSavedAsDraft = false;

        const data = {
            cmr: 'false',
            currentUri: currentUri,
            journey: 'catchCertificate',
            nextUri: '/create-catch-certificate/check-your-information',
            user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            vehicle: 'truck'
        };

        const expectedActions = [{ type: 'begin_api_call' }];

        const store = mockStoreWithApi(data)({saveTruckCMR : {}});

        return store.dispatch(saveTruckCMR(currentUri, journey, isTruckCMRSavedAsDraft, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });

      });

      it('Should fail and not throw a new error', () => {
        const currentUri = '/create-catch-certificate/add-transportation-details-truck';
        const journey = 'catchCertificate';
        const documentNumber = 'GBR-XXXX-CC-XXXXXXXXXX';
        const isTruckCMRSavedAsDraft = true;
        const store = mockStoreWithApi(null, err400Response)({ });

        return store.dispatch(saveTruckCMR(currentUri, journey, isTruckCMRSavedAsDraft, documentNumber)).then((err) => {
          expect(err).toBeUndefined();
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'api_call_failed', payload: { ...err400Response.response } }
          ]);
        });
      });

      itShouldFailAndThrowAnError(saveTruckCMR, {}, [
        { type: 'begin_api_call' },
        { type: 'api_call_failed', payload: { ...err400Response.response } }
      ]);

      itShouldFailAndDispatchShowFullPageError(saveTruckCMR, {},[{ type: 'begin_api_call' }],
        [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
      );

    });

    describe('#saveTransportationDetails', () => {

      it('should save transportation details', () => {
        const transportType = 'plane';
        const currentUri = '/create-catch-certificate/add-transportation-details-plane';
        const nextUri = '/create-catch-certificate/check-your-information';
        const journey = 'catchCertificate';
        const isSaveAsDraft = false;
        const documentNumber = 'some-doc-num';

        const data = {
          transportType: transportType,
          currentUri: currentUri,
          nextUri: nextUri,
          journey: 'catchCertificate',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
          vehicle: 'plane'
        };

        const expectedActions = [{ type: 'begin_api_call' }];

        const store = mockStoreWithApi(data)({saveTransportationDetails : {}});

        return store.dispatch(saveTransportationDetails(transportType, currentUri, nextUri, journey, isSaveAsDraft, documentNumber)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });

      });

      it('Should fail and not throw a new error', () => {
        const transportType = 'plane';
        const currentUri = '/create-catch-certificate/add-transportation-details-plane';
        const nextUri = '/create-catch-certificate/check-your-information';
        const journey = 'catchCertificate';
        const isSaveAsDraft = true;
        const documentNumber = 'some-doc-num';

        const store = mockStoreWithApi(null, err400Response)({ });

        return store.dispatch(saveTransportationDetails(transportType, currentUri, nextUri, journey, isSaveAsDraft, documentNumber)).then((err) => {
          expect(err).toBeUndefined();
          expect(store.getActions()).toEqual([
            { type: 'begin_api_call' },
            { type: 'api_call_failed', payload: { ...err400Response.response } }
          ]);
        });
      });

      itShouldFailAndThrowAnError(saveTransportationDetails, {}, [
        { type: 'begin_api_call' },
        { type: 'api_call_failed', payload: { ...err400Response.response } }
      ]);

      itShouldFailAndDispatchShowFullPageError(saveTransportationDetails, {},[{ type: 'begin_api_call' }],
        [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
      );

      itShouldFailAndDispatchUnauthorised(saveTransportationDetails, {}, [{ type: 'begin_api_call'}, { type: 'save_transport_details_unauthorised' }]);

      itShouldFailAndDispatchWAFError(saveTransportationDetails, {}, [
        { type: 'begin_api_call' },
        { type: 'save_transport_details_waf_error', supportID: '2732698712327933848' }
      ]);
    });

    describe('#getTransportDetails', () => {

      it('should get transport details', () => {

          const journey = 'catchCertificate';

          const data = {
              cmr: 'false',
              journey: journey,
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              vesselName: 'Newcastle 123',
              flagState: '123456',
              containerNumber: '123456',
              departurePlace: 'North Shields'
          };

          const expectedActions = [{ type: 'add_transport_details', payload: {data}}];

          const store = mockStoreWithApi(data)({getTransportDetails : data});

          return store.dispatch(getTransportDetails(journey)).then(() => {
              expect(store.getActions()).toEqual(expectedActions);
          });

      });

      itShouldFailAndThrowAnError(getTransportDetails, {}, [
        { type: 'add_transport_details_failed', payload: { ...err400Response.response } }
      ]);

      itShouldFailAndDispatchShowFullPageError(getTransportDetails, {},[],[
        { type: 'add_transport_details_failed', payload: { ...err500Response.response } }
      ]);

      itShouldFailAndDispatchUnauthorised(getTransportDetails, {}, [{ type: 'add_transport_details_unauthorised' }]);
    });

    it('should add transport details', () => {
        const data = {
            cmr: 'false',
            journey: 'catchCertificate',
            user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
            vesselName: 'Newcastle 123',
            flagState: '123456',
            containerNumber: '123456',
            departurePlace: 'North Shields'
        };

        const expectedActions = [{ type: 'add_transport_details', payload: {data}}];
        const store = mockStore({addTransportDetails: data});

        store.dispatch(addTransportDetails(data));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should show full page error', () => {
        const expectedActions = [{ type: 'save', payload: {showFullPageError: true}}];
        const store = mockStore({showFullPageError: {}});

        store.dispatch(showFullPageError());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should hide full page error', () => {
        const expectedActions = [{ type: 'save', payload: {showFullPageError: false}}];
        const store = mockStore({showFullPageError: {}});

        store.dispatch(hideFullPageError());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should save confirm document delete', () => {

        const currentUri = '/create-catch-certificate/add-transportation-details-vessel';
        const nextUri = '/create-catch-certificate/check-your-information';
        const journey = 'catchCertificate';

        const data = {
            documentDelete: 'Yes'
        };

        const expectedActions = [
          { type: 'begin_api_call' },
          { type: 'clear_confirm_document_delete'},
          { type: 'clear_export_country' },
          { type: 'clearTransportDetails' },
          { type: 'clear_conservation' }
        ];

        const store = mockStoreWithApi(data)({ confirmDocumentDelete: { documentDelete: 'documentDelete' }});

        return store.dispatch(saveConfirmDocumentDelete(currentUri, nextUri, journey)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should save confirm document delete for a processing statement', () => {

      const currentUri = '/create-catch-certificate/add-transportation-details-vessel';
      const nextUri = '/create-catch-certificate/check-your-information';
      const journey = 'processingStatement';

      const data = {
          documentDelete: 'Yes'
      };

      const expectedActions = [
        { type: 'begin_api_call' },
        { type: 'clear_confirm_document_delete'},
        { type: 'CLEAR_PROCESSING_STATEMENT' }
      ];

      const store = mockStoreWithApi(data)({ confirmDocumentDelete: { documentDelete: 'documentDelete' }});

      return store.dispatch(saveConfirmDocumentDelete(currentUri, nextUri, journey)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should save confirm document delete for a storage document', () => {

    const currentUri = '/create-catch-certificate/add-transportation-details-vessel';
    const nextUri = '/create-catch-certificate/check-your-information';
    const journey = 'storageNotes';

    const data = {
        documentDelete: 'Yes'
    };

    const expectedActions = [
      { type: 'begin_api_call' },
      { type: 'clear_confirm_document_delete'},
      { type: 'CLEAR_STORAGE_NOTES' },
      { type: 'clearTransportDetails' },
    ];

    const store = mockStoreWithApi(data)({ confirmDocumentDelete: { documentDelete: 'documentDelete' }});

    return store.dispatch(saveConfirmDocumentDelete(currentUri, nextUri, journey)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
});
});

describe('#clearTransportDetails', () => {
  it('Should clear transport details', () => {
    expect(clearTransportDetails()).toEqual({ type: 'clearTransportDetails' });
  });
});

describe('#addConfirmDocumentDelete', () => {
  it('Should add confirm document delete', () => {
    const store = mockStore();
    store.dispatch(addConfirmDocumentDelete(null));
    expect(store.getActions()).toEqual([{ type: 'add_confirm_document_delete', payload:  null }]);
  });
});

describe('#saveConfirmDocumentDelete', () => {
  const data = { confirmDocumentDelete: { documentDelete: true } };

  it('Should save confirm document delete', () => {
    const currentUri = '/current';
    const nextUri = '/next';
    const journey = 'next/current';
    const store = mockStoreWithApi({})(data);

    return store.dispatch(saveConfirmDocumentDelete(currentUri, nextUri, journey)).then(() => {
      expect(store.getActions()).toEqual([
        { type: 'begin_api_call' },
        { type: 'clear_confirm_document_delete'}
      ]);
    });
  });

  it('Should save confirm document delete with a documentNumber', () => {
    const currentUri = '/current';
    const nextUri = '/next';
    const journey = 'next/current';
    const documentNumber = 'GBR-XXXX-CC-XXXXXXXXXX';
    const store = mockStoreWithApi({})(data);

    return store.dispatch(saveConfirmDocumentDelete(currentUri, nextUri, journey, documentNumber)).then(() => {
      expect(store.getActions()).toEqual([
        { type: 'begin_api_call' },
        { type: 'clear_confirm_document_delete'}
      ]);
    });
  });

  itShouldFailAndThrowAnError(saveConfirmDocumentDelete, {}, [
    { type: 'begin_api_call' },
    { type: 'api_call_failed', payload: { ...err400Response.response } }
  ], data);

  itShouldFailAndDispatchShowFullPageError(saveConfirmDocumentDelete, {},[{ type: 'begin_api_call' }],
    [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
  , data);
});

describe('#addConfirmDocumentVoid', () => {
  it('Should add confirm document void', () => {
    const store = mockStore();
    store.dispatch(addConfirmDocumentVoid(null));
    expect(store.getActions()).toEqual([{ type: 'add_confirm_document_void', payload:  null }]);
  });
});

describe('#saveConfirmDocumentVoid', () => {
  const data = { confirmDocumentVoid: { documentVoid: true } };

  it('Should save confirm document void', () => {
    const documentNumber = 'GBR-2020-CC1';
    const currentUri = '/current';
    const nextUri = '/next';
    const journey = 'next/current';
    const store = mockStoreWithApi({})(data);

    return store.dispatch(saveConfirmDocumentVoid(documentNumber, currentUri, nextUri, journey)).then(() => {
      expect(store.getActions()).toEqual([
        { type: 'begin_api_call' },
        { type: 'clear_confirm_document_void'}
      ]);
    });
  });

  it('Should save confirm document void with a document number', () => {
    const documentNumber = undefined;
    const currentUri = '/current';
    const nextUri = '/next';
    const journey = 'next/current';
    const store = mockStoreWithApi({})(data);

    return store.dispatch(saveConfirmDocumentVoid(documentNumber, currentUri, nextUri, journey)).then(() => {
      expect(store.getActions()).toEqual([
        { type: 'begin_api_call' },
        { type: 'clear_confirm_document_void'}
      ]);
    });
  });

  itShouldFailAndThrowAnError(saveConfirmDocumentVoid, {}, [
    { type: 'begin_api_call' },
    { type: 'api_call_failed', payload: { ...err400Response.response } }
  ], data);

  itShouldFailAndDispatchShowFullPageError(saveConfirmDocumentVoid, {},[{ type: 'begin_api_call' }],
    [{ type: 'api_call_failed', payload: { ...err500Response.response } }]
  , data);
});

describe('#addTransport', () => {
  it('Should add transport details and add transport', () => {
    const store = mockStore();
    const param = {
      status: 200
    };
    store.dispatch(addTransport(param));
    expect(store.getActions()).toEqual([
      { type: 'add_transport_details', payload: {} },
      { type: 'add_transport', payload: { data: { ...param } }}
    ]);
  });
});

describe('#clearConservation', () => {
  it('Should clear conservation', () => {
    expect(clearConservation()).toEqual({ type: 'clear_conservation' });
  });
});

describe('#addConservation', () => {
  it('Should add conservation', () => {
    const param = {
      status: 200
    };
    const store = mockStore();
    store.dispatch(addConservation(param));
    expect(store.getActions()).toEqual([{ type: 'add_conservation', payload: { data: { ...param } } }]);
  });
});

describe('#getReferenceDataReaderVersionInfo', () => {
  it('Should get referenceServiceApi version info', () => {
    const data = {
      status: 200
    };
    const store = mockStoreWithApi(data)();
    return store.dispatch(getReferenceDataReaderVersionInfo()).then(() => {
      expect(store.getActions()).toEqual([
        { type: 'save', payload: { referenceDataReaderVersionInfo: { ...data } }}
      ]);
    });
  });
});

describe('#getVersionInfo', () => {
it('Should get orchestrationApi version info', () => {
  const data = {
    status: 200
  };
  const store = mockStoreWithApi(data)();
  return store.dispatch(getVersionInfo()).then(() => {
    expect(store.getActions()).toEqual([
        { type: 'save', payload: { orchestrationVersionInfo: { ...data } }}
      ]);
    });
  });
});

describe('#getCountries', () => {
  const data = [
    {
      officialCountryName: 'United Kingdom',
      isoCodeAlpha2: 'Alpha2',
      isoCodeAlpha3: 'Alpha3',
      isoNumericCode: 'IsoNumericCode'
    },
    {
      officialCountryName: 'Brazil',
      isoCodeAlpha2: 'Alpha2',
      isoCodeAlpha3: 'Alpha3',
      isoNumericCode: 'IsoNumericCode'
    },
    {
      officialCountryName: 'Finland',
      isoCodeAlpha2: 'Alpha2',
      isoCodeAlpha3: 'Alpha3',
      isoNumericCode: 'IsoNumericCode'
    }
  ];


  it('should get all country names', () => {
    const expectedActions = [
      {payload: { allCountries: ['United Kingdom', 'Brazil', 'Finland'] }, type: 'save'},
      {payload: { allCountriesData: data }, type: 'save' }
    ];

    const store = mockStoreWithApi(data)({ getAllCountries: data });
    return store.dispatch(getAllCountries()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return undefined', () => {
    const store = mockStoreWithApi()({ getAllCountries: data });
    return store.dispatch(getAllCountries()).then((countries) => {
        expect(store.getActions()).toEqual([]);
        expect(countries).toBeUndefined();
    });
  });

});

describe('#getAllVessels', () => {
  const data = [{
    'pln':'PH1100',
    'vesselName':'WIRON 5',
    'flag':'GBR',
    'cfr':'NLD200202641',
    'homePort':'PLYMOUTH',
    'licenceNumber':'12480',
    'imoNumber':9249556,
    'licenceValidTo':'2382-12-31T00:00:00',
    'rssNumber':'C20514',
    'vesselLength':50.63
  },
  {
    'pln':'PH2200',
    'vesselName':'WIRON 6',
    'flag':'GBR',
    'cfr':'NLD200202642',
    'homePort':'PLYMOUTH',
    'licenceNumber':'12481',
    'imoNumber':9249568,
    'licenceValidTo':'2382-12-31T00:00:00',
    'rssNumber':'C20515',
    'vesselLength':50.63
  }];


  it('should get all vessels', () => {
    const expectedActions = [
      { payload: { data }, type: 'search_vessels' }
    ];

    const store = mockStoreWithApi(data)({ getAllVessels : data });
    return store.dispatch(getAllVessels()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('#getAllFish', () => {
  const data = [{
    'faoName': 'Albacore',
    'scientificName': 'Thunnus alalunga',
    'faoCode': 'ALB'
  }];


  it('should get all species', () => {
    const expectedActions = [
      { payload: { allFish: data }, type: 'save' }
    ];

    const store = mockStoreWithApi(data)({ getAllFish : data });
    return store.dispatch(getAllFish()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
