import confirmDocumentDeleteReducer from '../../../src/client/reducers/confirmDocumentDeleteReducer';

describe('confirmDocumentDeleteReducer', () => {

    it('should reduce to initial state', () => {
      const initialState = {};
      const action = {type: ''};

      expect(confirmDocumentDeleteReducer(initialState, action)).toEqual({});
    });

    it('should reduce to initial state with an undefined', () => {
      const action = {type: ''};

      expect(confirmDocumentDeleteReducer(undefined, action)).toEqual({});
    });

    it('should add confirm document delete to initial state', () => {
      const initialState = [];
      const payload = {
        documentDelete: 'Yes'
      };

      const action = {type: 'add_confirm_document_delete', payload: payload};
      expect(confirmDocumentDeleteReducer(initialState, action)).toEqual({documentDelete: 'Yes'});
    });

    it('should clear confirm document delete to initial state', () => {
        const initialState = [];
        const action = {type: 'clear_confirm_document_delete'};
        expect(confirmDocumentDeleteReducer(initialState, action)).toEqual({});
    });
});