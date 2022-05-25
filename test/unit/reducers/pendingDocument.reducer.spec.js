
import pendingDocument from '../../../src/client/reducers/pendingDocument.reducer';
describe('Pending document reducer', () => {
  it('should reduce to initial state', () => {
    const initialState = {documentNumber: null, documentUri: ''};
    const action = {
      type: ''
    };
    expect(pendingDocument(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state with an authorised', () => {
    const action = {
      type: ''
    };
    expect(pendingDocument(undefined, action)).toBeNull();
  });

  it('should update state', () => {
    const initialState = {documentNumber: null, documentUri: ''};
    const action = {
      type: 'GET_PENDING_DOCUMENT',
      payload : {documentNumber: 'doc1'}
    };
    expect(pendingDocument(initialState, action)).toEqual(action.payload);
  });
});