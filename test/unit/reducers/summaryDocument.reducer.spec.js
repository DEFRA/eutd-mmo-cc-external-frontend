import summaryDocument from '../../../src/client/reducers/summaryDocument.reducer';

const initialState = {
  documentNumber: '',
  status: '',
  startedAt: '',
  exporter: {
    model: {
      addressOne: '',
      addressTwo: '',
      currentUri: '',
      exporterCompanyName: '',
      exporterFullName: '',
      journey: '',
      nextUri: '',
      postcode: '',
      townCity: '',
      user_id: '',
      _dynamicsUser: '',
      _dynamicsAddress: '',
      accountId: ''
    }
  },
  exportPayload: {
    items: [{
      product: {
          id: '',
          commodityCode: '',
          presentation: {
            code: '',
            label: ''
          },
          state: {
            code: '',
            label: ''
          },
          species: {
            code: '',
            label: ''
          }
      },
      landings: [{
          model: {
              id: '',
              vessel: {
                  pln: '',
                  vesselName: '',
                  label: '',
                  homePort: '',
                  flag: '',
                  imoNumber: null,
                  licenceNumber: '',
                  licenceValidTo: ''
              },
              faoArea: '',
              dateLanded: '',
              exportWeight: 0,
              numberOfSubmissions: 0
          }
      }]
    }]
  },
  conservation: {
    conservationReference: '',
    legislation: [],
    caughtInUKWaters: '',
    user_id: '',
    currentUri: '',
    nextUri: ''
  },
  transport: {
    vehicle: '',
  },
  exportLocation: {
    exportedFrom: ''
  },
  validationErrors: []
};

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

describe('Summary document reducer', () => {

  it('should reduce to initial state', () => {
    const action = {
      type: ''
    };

    expect(summaryDocument(initialState, action)).toEqual(initialState);
  });


  it('should reduce to initial state with an authorised', () => {
    const action = {
      type: ''
    };

    expect(summaryDocument(undefined, action)).toEqual(initialState);
  });
  it('should update state', () => {
    const action = {
      type: 'GET_SUMMARY_DOCUMENT',
      payload : data
    };

    expect(summaryDocument(initialState, action)).toEqual(action.payload);
  });

  it('should update state as unauthorised', () => {
    const action = {
      type: 'GET_SUMMARY_DOCUMENT_UNAUTHORISED',
    };

    expect(summaryDocument(initialState, action)).toEqual({
      unauthorised: true
    });
  });

  it('should update summary errors', () => {
    const errors = [{
      state: 'FRE',
      species: 'COD',
      presentation: 'FIL',
      date: '2020-03-01T00:00:00.000Z',
      vessel: 'DUNAN STAR II',
      rules: ['3C']
    }];

    const action = {
      type: 'SHOW_SUMMARY_DOCUMENT_ERRORS',
      payload: { validationErrors: errors }
    };

    expect(summaryDocument(initialState, action)).toEqual({
      ...initialState,
      validationErrors: errors
    });
  });
});