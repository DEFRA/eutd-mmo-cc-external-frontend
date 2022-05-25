import exportCertificateReducer from '../../../src/client/reducers/export-certificate.reducer';
import {exportCertificateActionTypes} from '../../../src/client/actions';


describe('exportCertificateReducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {};
        const action = { type: '' };

        expect(exportCertificateReducer(initialState, action)).toEqual({});
    });

    it('should reduce to initial state with an undefined state', () => {
      const initialState = undefined;
      const action = { type: '' };

      expect(exportCertificateReducer(initialState, action)).toEqual({
        validationErrors: [{}]
      });
    });

    it('should create an export cert', () => {
      const previousState = {};
      const payload = {
        data: [
          {
              documentNumber: 'GBR-2018-CC-48248952D',
              uri: 'https://sndmmoinfsto001.blob.core.windows.net/1e010fab-013f-4f83-a81f-463c752fd1a2/Export%20Certificate_1543933999085.pdf?st=2018-12-04T14%3A28%3A19Z&se=2019-12-04T14%3A33%3A19Z&sp=r&sv=2018-03-28&sr=b&sig=%2F2fCZ5OTSqEI8UR4w9FQ%2Fcy2Su1l%2Fpaf1vlO%2FV7hkKQ%3D'
          }
        ]
      };

      const action = { type: exportCertificateActionTypes.EXPORT_CERT_CREATE_REQUEST_SUCCESS, payload: payload };

      const result = exportCertificateReducer(previousState, action);

      const expected = [
        {
          documentNumber: 'GBR-2018-CC-48248952D',
          uri: 'https://sndmmoinfsto001.blob.core.windows.net/1e010fab-013f-4f83-a81f-463c752fd1a2/Export%20Certificate_1543933999085.pdf?st=2018-12-04T14%3A28%3A19Z&se=2019-12-04T14%3A33%3A19Z&sp=r&sv=2018-03-28&sr=b&sig=%2F2fCZ5OTSqEI8UR4w9FQ%2Fcy2Su1l%2Fpaf1vlO%2FV7hkKQ%3D'
        }
      ];

      expect(result).toEqual(expected);
    });
});