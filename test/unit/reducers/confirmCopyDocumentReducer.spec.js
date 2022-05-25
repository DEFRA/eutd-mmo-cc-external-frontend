import confirmCopyDocumentReducer from '../../../src/client/reducers/confirmCopyDocumentReducer';
describe('Copy Document Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {};
        const action = {
            type : ''
        };
        expect(confirmCopyDocumentReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined state', () => {
      const initialState = {};
      const action = {
          type : ''
      };
      expect(confirmCopyDocumentReducer(undefined, action)).toEqual(initialState);
  });

    it('should save copy document to state', () => {
        const initialState = {};
        const action = {
          payload: { documentNumber: 'DOCUMENT123', copyDocumentAcknowledged:true, voidDocumentConfirm: true },
          type: 'confirm_copy_document'
        };
        const expectedResult = {
          documentNumber: 'DOCUMENT123',
          copyDocumentAcknowledged:true,
          voidDocumentConfirm: true
        };
        expect(confirmCopyDocumentReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update copy document to state', () => {

      const initialState = {
        copyDocumentAcknowledged:false,
        voidDocumentConfirm: false
      };

      const action = {
        payload: { copyDocumentAcknowledged:true, voidDocumentConfirm: true },
        type : 'confirm_copy_document'
      };

      const expectedResult = {
        copyDocumentAcknowledged:true,
        voidDocumentConfirm: true
      };
      expect(confirmCopyDocumentReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update unauthorised copy document action to state', () => {

      const initialState = {
        copyDocumentAcknowledged:false,
        voidDocumentConfirm: false
      };

      const action = {
        error: { status: 403 },
        type : 'unauthorised_copy_document'
      };

      const expectedResult = {
        copyDocumentAcknowledged:false,
        voidDocumentConfirm: false,
        unauthorised: true
      };

      expect(confirmCopyDocumentReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should update clear copy document action to state', () => {

      const initialState = {
        copyDocumentAcknowledged:true,
        voidDocumentConfirm: true
      };

      const action = {
        type : 'clear_copy_document'
      };

      const expectedResult = {};

      expect(confirmCopyDocumentReducer(initialState, action)).toEqual(expectedResult);
    });
});