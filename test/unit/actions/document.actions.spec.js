import {
  getAllDocuments,
  GOT_ALL_DOCUMENTS,
  getCompletedDocument,
  GET_COMPLETED_DOCUMENT,
  getPendingDocument,
  GET_PENDING_DOCUMENT
} from '../../../src/client/actions/document.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('Document Actions', () => {

  const data = {
    inProgress: [],
    completed: [
      {
        createdAt: '2019-01-28T15:37:37.144Z',
        documentNumber: 'GBR-2019-CC-D8E77AC20',
        documentUri: 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548689855353.pdf?st=2019-01-28T15%3A32%3A36Z&se=2020-01-28T15%3A37%3A36Z&sp=r&sv=2018-03-28&sr=b&sig=7O%2FthW0gQYejTT3AaFBc6iWkyx3cZnY4M4PdS7Ip8Fc%3D',
        __t: 'catchCert',
        _id: '5c4f21c13a982e3450108a41',
      },
      {
        createdAt: '2019-01-29T08:57:31.783Z',
        documentNumber: 'GBR-2019-CC-D8E77AC20',
        documentUri: 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548752250050.pdf?st=2019-01-29T08%3A52%3A30Z&se=2020-01-29T08%3A57%3A30Z&sp=r&sv=2018-03-28&sr=b&sig=YgkPLf3kAuDXkgnh4TVGh3KVXvgZLe%2FeAjTfqY2w69I%3D',
        __t: 'catchCert',
        _id: '5c50157bbbef3074a489f309'
      }
    ]
  };

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({ data });
        });
      }
    }
  })]);

  it('Get all documents', () => {

    const type = 'catchCertificate';
    const expectedActions = [
      {
        type: GOT_ALL_DOCUMENTS,
        payload: data
      }
    ];

    const store = mockStore({
      getAllDocuments: [
        {
          createdAt: '2019-01-28T15:37:37.144Z',
          documentNumber: 'GBR-2019-CC-D8E77AC20',
          documentUri: 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548689855353.pdf?st=2019-01-28T15%3A32%3A36Z&se=2020-01-28T15%3A37%3A36Z&sp=r&sv=2018-03-28&sr=b&sig=7O%2FthW0gQYejTT3AaFBc6iWkyx3cZnY4M4PdS7Ip8Fc%3D',
          __t: 'catchCert',
          _id: '5c4f21c13a982e3450108a41',
        },
        {
          createdAt: '2019-01-29T08:57:31.783Z',
          documentNumber: 'GBR-2019-CC-D8E77AC20',
          documentUri: 'http://localhost:3001/pdf/export-certificates/Export%20Certificate_1548752250050.pdf?st=2019-01-29T08%3A52%3A30Z&se=2020-01-29T08%3A57%3A30Z&sp=r&sv=2018-03-28&sr=b&sig=YgkPLf3kAuDXkgnh4TVGh3KVXvgZLe%2FeAjTfqY2w69I%3D',
          __t: 'catchCert',
          _id: '5c50157bbbef3074a489f309'
        }
      ]
    });

    return store.dispatch(getAllDocuments(type)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Handles get documents failures', () => {
    const type = 'catchCertificate';

    const response = {
      status: 404,
      statusText: 'No data found'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);


    const store = mockFailureStore({
      getAllDocuments: {}
    });


    store.dispatch(getAllDocuments(type)).catch((err) => {
      expect(err).toBeDefined();
    });
  });

  it('Handles get documents failures resulting from server errors', () => {
    const type = 'catchCertificate';

    const response = {
      status: 500,
      statusText: 'Internal Server Error'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);


    const store = mockFailureStore({
      getAllDocuments: {}
    });


    store.dispatch(getAllDocuments(type)).catch((err) => {
      expect(err).toBeDefined();
    });
  });

  it('Handles get documents failures resulting from a bad request', () => {
    const type = 'catchCertificate';

    const response = {
      status: 400,
      statusText: 'Internal Server Error'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);


    const store = mockFailureStore({
      getAllDocuments: {}
    });


    store.dispatch(getAllDocuments(type)).catch((err) => {
      expect(err).toBeDefined();
    });
  });
});

describe('getCompletedDocument', () => {

  const data = {documentNumber: 'doc1', documentStatus: 'COMPLETE'};

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({ data });
        });
      }
    }
  })]);

  it('dispatches data if the response is successful and document status is COMPLETE', () => {
    const store = mockStore();

    return store.dispatch(getCompletedDocument('doc1')).then(() => {
      expect(store.getActions()).toEqual([{ type: GET_COMPLETED_DOCUMENT, payload: { documentNumber: 'doc1' , documentStatus: 'COMPLETE'} }]);
    });
  });

  it('dispatches null if the response is successful and document status is NOT COMPLETE', () => {
    const data = { documentNumber: 'doc1', documentStatus: 'PENDING' };

    const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
    get: () => {
      return new Promise((res) => {
        res({ data });
      });
    }
    }
    })]);
    const store = mockStore();

    return store.dispatch(getCompletedDocument('doc1')).then(() => {
      expect(store.getActions()).toEqual([{ type: GET_COMPLETED_DOCUMENT, payload: null }]);
    });
  });

  it('dispatches null if the response fails', () => {
    const response = {
      status: 404,
      statusText: 'No data found'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);

    const store = mockFailureStore();

    store.dispatch(getCompletedDocument('doc1')).then(() => {
      expect(store.getActions()).toEqual([{ type: GET_COMPLETED_DOCUMENT, payload: null }]);
    });
  });

});


describe('getPendingDocument', () => {

  const data = { documentNumber: 'doc1', documentStatus: 'PENDING' };

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({ data });
        });
      }
    }
  })]);

  it('dispatches data if the response is successful and document status is PENDING', () => {
    const store = mockStore();

    return store.dispatch(getPendingDocument('doc1')).then(() => {
      expect(store.getActions()).toEqual([{ type: GET_PENDING_DOCUMENT, payload: { documentNumber: 'doc1', documentStatus: 'PENDING' } }]);
    });
  });

  it('dispatches null if the response is successful and document status is NOT PENDING', () => {
    const data = { documentNumber: 'doc1', documentStatus: 'COMPLETE' };

    const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
    get: () => {
      return new Promise((res) => {
        res({ data });
      });
    }
    }
    })]);
    const store = mockStore();

    return store.dispatch(getPendingDocument('doc1')).then(() => {
      expect(store.getActions()).toEqual([{ type: GET_PENDING_DOCUMENT, payload: null }]);
    });
  });

  it('dispatches null if the response fails', () => {
    const response = {
      status: 404,
      statusText: 'No data found'
    };

    const mockFailureStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            rej({ response });
          });
        }
      }
    })]);

    const store = mockFailureStore();

    store.dispatch(getPendingDocument('doc1')).then(() => {
      expect(store.getActions()).toEqual([{ type: GET_PENDING_DOCUMENT, payload: null }]);
    });
  });
});