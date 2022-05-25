import completedDocument from '../../../src/client/reducers/completedDocument.reducer';

describe('Completed document reducer', () => {

  it('should reduce to initial state', () => {
    const initialState = {documentNumber: null, documentUri: ''};

    const action = {
      type: ''
    };

    expect(completedDocument(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state with an undefined state', () => {
    const action = {
      type: ''
    };

    expect(completedDocument(undefined, action)).toBeNull();
  });

  it('should update state', () => {
    const initialState = {documentNumber: null, documentUri: ''};

    const action = {
      type: 'GET_COMPLETED_DOCUMENT',
      payload : {documentNumber: 'doc1'}
    };

    expect(completedDocument(initialState, action)).toEqual(action.payload);
  });

});