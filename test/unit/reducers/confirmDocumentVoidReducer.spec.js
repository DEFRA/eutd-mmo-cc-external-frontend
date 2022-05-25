import confirmDocumentVoidReducer from '../../../src/client/reducers/confirmDocumentVoidReducer';

describe('confirmDocumentVoidReducer', () => {

    it('should reduce to initial state', () => {
      const initialState = {};
      const action = {type: ''};

      expect(confirmDocumentVoidReducer(initialState, action)).toEqual({});
    });

    it('should reduce to initial state with an undefined', () => {
      const action = {type: ''};

      expect(confirmDocumentVoidReducer(undefined, action)).toEqual({});
    });

    it('should add confirm document void to initial state', () => {
      const initialState = [];
      const payload = {
        documentVoid: 'Yes'
      };

      const action = {type: 'add_confirm_document_void', payload: payload};
      expect(confirmDocumentVoidReducer(initialState, action)).toEqual({documentVoid: 'Yes'});
    });

    it('should clear confirm document void to initial state', () => {
        const initialState = [];
        const action = {type: 'clear_confirm_document_void'};
        expect(confirmDocumentVoidReducer(initialState, action)).toEqual({});
    });
});