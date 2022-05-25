import { createExportCertificate, getExportCertificateFromParams, exportCertificateActionTypes }  from '../../../src/client/actions/export-certificate.actions';
import { SHOW_SUMMARY_DOCUMENT_ERRORS } from '../../../src/client/actions/certificate.actions';

jest.mock('../../../src/client/actions/index');

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

const mockData = {
    transport: {
        vehicle    : 'truck',
        currentUri : '/create-catch-certificate/add-transportation-details-truck',
        journey    : 'catchCertificate',
        user_id    : 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        cmr        : 'false',
        nationalityOfVehicle: 'United Kingdom',
        departurePlace: 'North Shields',
        registrationNumber: '12121212',
        nextUri: '/create-catch-certificate/check-your-information'
    }
};

let data = null;
let currentUri = null;
let journey = null;
const exportCertMockStore = (rejectWith=false) => configureStore([thunk.withExtraArgument({
    orchestrationApi: {
    post: () => {
        return new Promise((res, rej) => {
            if (rejectWith) {
                rej(rejectWith);
            } else {
                res({ data });
            }
        });
    },
    get: () => {
      return new Promise(res => {
        res({ data });
      });
    }
    }
})]);

describe('Export Certificate Action creators', () => {
    beforeEach(() => {
      data = { ...mockData };
      currentUri = '/create-catch-certificate/create-export';
      journey = 'catchCertificate';

    });

    afterEach(() => {
      data = null;
    });

    it('should create export certificate', () => {
        const expectedActions = [
            { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS, payload: {data}}
        ];

        const store = exportCertMockStore()({createExportCertificate: data});

        return store.dispatch(createExportCertificate(currentUri, journey)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should create export certificate with a document number', () => {
      const expectedActions = [
          { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS, payload: {data}}
      ];

      const store = exportCertMockStore()({createExportCertificate: data});

      return store.dispatch(createExportCertificate(currentUri, journey, 1, 'SOME-DOCUMENT-CC-NUMBER')).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should not create an export certificate if the application is invalid', () => {
      data = { status: 'invalid catch certificate' };

      const expectedActions = [];

      const store = exportCertMockStore()({createExportCertificate: data});

      return store.dispatch(createExportCertificate(currentUri, journey)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
  });

    it('should get export certificate from params', () => {
        const expectedActions = [{type : exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS, payload: {data}}];
        const store = mockStore({getExportCertificateFromParams: {}});
        store.dispatch(getExportCertificateFromParams(data));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('Should fail to create an export certificate', () => {
        const expectedActions = [
            { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_FAILED, errorRes: 'Error: a' }
        ];

        const store = exportCertMockStore(new Error('a'))({createExportCertificate: data});
        return store.dispatch(createExportCertificate(currentUri, null)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('Should catch an expection if exportCertificateCreated throws', async () => {
        const expectedActions = [
            { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_FAILED, errorRes: 'Error: a' }
        ];

        const toStringError = new String('a');
        toStringError.toString = jest.fn().mockImplementation(() => {
            throw new Error('some_error');
        });

        const store = exportCertMockStore(toStringError)({createExportCertificate: data});
        let error = null;
        try {
            await store.dispatch(createExportCertificate(currentUri, null)).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        } catch (err) {
            error = err;
        }
        expect(error).not.toBeNull();
        expect(error).toEqual(new Error('some_error'));
    });

    it('Should catch an expection if exportCertificateCreated throws and show summary certificate errors', () => {
      const error = {
        response: {
          data: {
            status: 400,
            statusText: 'Bad Request'
          }
        }
      };

      const expectedActions = [
        { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_FAILED, errorRes: error.toString() },
        { type: SHOW_SUMMARY_DOCUMENT_ERRORS, payload: { validationErrors: error.response.data } },
      ];

      const store = exportCertMockStore(error)({createExportCertificate: data});
      return store.dispatch(createExportCertificate(currentUri, null)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
      });
    });
});