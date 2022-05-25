import{ SAVE } from '../../../src/client/actions/index';
import {
  getSummaryCertificate,
  showSummaryCertificateErrors
} from '../../../src/client/actions/certificate.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const journey = 'catchCertificate';
const documentNumber = 'CC-X-1';

describe('getSummaryCertificate', () => {

  const data = {
    documentNumber: 'GBR-X-CC-1',
    status: 'LOCKED',
    startedAt: '2021-01-05T16:59:29.190Z',
    exporter: {
      model: {
        addressOne: 'Building and street',
        addressTwo: 'building and street 2',
        currentUri: '',
        exporterCompanyName: 'Company name',
        exporterFullName: 'Joe Blogg',
        journey: '',
        nextUri: '',
        postcode: 'AB1 2XX',
        townCity: 'Aberdeen',
        user_id: '',
        _dynamicsUser: '',
        _dynamicsAddress: '',
        accountId: ''
      }
    },
    exportPayload: {
      items: [{
        product: {
            id: 'GBR-X-CC-1-ad634ac5-6a9a-4726-8e4b-f9c0f3ec32c5',
            commodityCode: '03024310',
            presentation: {
              code: 'WHL',
              label: 'Whole'
            },
            state: {
              code: 'FRE',
              label: 'Fresh'
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)'
            }
        },
        landings: [{
            model: {
                id: 'GBR-X-CC-1-1610013801',
                vessel: {
                    pln: 'SS229',
                    vesselName: 'AGAN BORLOWEN',
                    label: 'AGAN BORLOWEN (SS229)',
                    homePort: 'NEWLYN',
                    flag: 'GBR',
                    imoNumber: null,
                    licenceNumber: '25072',
                    licenceValidTo: '2382-12-31T00:00:00'
                },
                faoArea: 'FAO27',
                dateLanded: '2021-01-07',
                exportWeight: 12,
                numberOfSubmissions: 0
            }
        }]
      }]
    },
    conservation: {
      conservationReference: 'UK Fisheries Policy',
      legislation: ['UK Fisheries Policy'],
      caughtInUKWaters: 'Y',
      user_id: 'Test',
      currentUri: 'Test',
      nextUri: 'Test'
    },
    transport: {
      vehicle: 'directLanding',
    },
    exportLocation: {
      exportedFrom: 'United Kingdom'
    },
    validationErrors: [{
      state: 'ALI',
      species: 'LBE',
      presentation: 'WHL',
      date: new Date('2020-11-23T00:00:00.000Z'),
      vessel: 'WIRON 5',
      rules: [
        'noDataSubmitted'
      ]
    }]
  };

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({ data });
        });
      }
    }
  })]);

  it('dispatches certificate summary data if the response is successful', () => {
    const store = mockStore();

    return store.dispatch(getSummaryCertificate(journey, documentNumber)).then(() => {
      expect(store.getActions()).toEqual([{ type: 'GET_SUMMARY_DOCUMENT', payload: data }]);
    });
  });

  it('dispatches certificate summary data if the response is successful when no document number is provided', () => {
    const store = mockStore();

    return store.dispatch(getSummaryCertificate(journey)).then(() => {
      expect(store.getActions()).toEqual([{ type: 'GET_SUMMARY_DOCUMENT', payload: data }]);
    });
  });

  it('dispatches unauthorised if the authorisation check fails', () => {
    const response = {
      status: 403,
      statusText: 'Unauthorised'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);

    const store = mockFailureStore();

    return store.dispatch(getSummaryCertificate(journey, documentNumber)).then(() => {
      expect(store.getActions()).toEqual([{ type: 'GET_SUMMARY_DOCUMENT_UNAUTHORISED' }]);
    });
  });

  it('dispatches error if the API call fails', () => {
    const response = {
      status: 404,
      statusText: 'No data found'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);

    const store = mockFailureStore();

    return store.dispatch(getSummaryCertificate(journey, documentNumber)).then(() => {
      expect(store.getActions()).toEqual([{ type: SAVE, payload: { showFullPageError: true } }]);
    });
  });
});

describe('showSummaryErrors', () => {
  it('Should show summary errors', () => {

    const errors = [{
      state: 'FRE',
      species: 'COD',
      presentation: 'FIL',
      date: '2020-03-01T00:00:00.000Z',
      vessel: 'DUNAN STAR II',
      rules: ['3C']
    }];

    expect(showSummaryCertificateErrors(errors))
      .toEqual({ type: 'SHOW_SUMMARY_DOCUMENT_ERRORS', payload: { validationErrors: errors } });
  });

  it('Should show summary no errors if no provided', () => {

    expect(showSummaryCertificateErrors())
      .toEqual({ type: 'SHOW_SUMMARY_DOCUMENT_ERRORS', payload: { validationErrors: undefined } });
  });

  it('Should show summary no errors if there are no errors', () => {
    const errors = null;

    expect(showSummaryCertificateErrors(errors))
      .toEqual({ type: 'SHOW_SUMMARY_DOCUMENT_ERRORS', payload: { validationErrors: null } });
  });
});