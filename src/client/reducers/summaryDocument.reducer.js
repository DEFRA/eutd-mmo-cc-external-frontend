
import {
  GET_SUMMARY_DOCUMENT,
  GET_SUMMARY_UNAUTHORISED,
  SHOW_SUMMARY_DOCUMENT_ERRORS
} from '../actions/certificate.actions';

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

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case GET_SUMMARY_DOCUMENT:
      return {
        ...state,
        ...action.payload
      };
    case SHOW_SUMMARY_DOCUMENT_ERRORS:
      return {
        ...state,
        validationErrors: action.payload.validationErrors
      };
    case GET_SUMMARY_UNAUTHORISED:
      return {
        unauthorised: true
      };
    default:
      return state;
  }
};