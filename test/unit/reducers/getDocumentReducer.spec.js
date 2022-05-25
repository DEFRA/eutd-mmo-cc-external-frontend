import getDocumentReducer from '../../../src/client/reducers/getDocumentReducer';

describe('Get Document Reducer', () => {

    it('should reduce to initial state', () => {
      const initialState = [];
      const action = {type: ''};

      expect(getDocumentReducer(initialState, action)).toEqual([]);
    });

    it('should reduce to initial state with an undefined', () => {
      const action = {type: ''};

      expect(getDocumentReducer(undefined, action)).toEqual({});
    });

    it('should add a document number to initial state', () => {
        const initialState = [];

        const payload = {
            data : {
              documentNumber : 'GBR-2019-CC-205A3C348',
              startedAt      : '27 Feb 2019'
            }
        };

        const action = {type: 'get_document', payload: payload};

        expect(getDocumentReducer(initialState, action)).toEqual(payload.data);
    });
});