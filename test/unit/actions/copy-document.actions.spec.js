import {
  submitCopyCertificate,
  clearCopyDocument,
  clearErrors,
  addCopyDocument,
  checkCopyCertificate,
  unauthorisedCopyDocument
} from '../../../src/client/actions/copy-document.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = (rejectWith = false) => configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    get: () => {

        return new Promise((res, rej) => {
          if (rejectWith) {
            rej(rejectWith);
          } else {
            res({ data: false });
          }
        });
    }
  }
})]);

const itShouldFailAndShowFullPageError = (service) => it('Should fail, showFullPageError and then throw an error', () => {
  const store = mockStore({ response: { status: 500, statusText: 'Internal Server Error' }})();

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('An error has occurred 500 (Internal Server Error)'));
    expect(store.getActions()).toEqual([
      { type: 'save',  payload: { showFullPageError: true } },
      { type: 'api_call_failed', payload: { status: 500, statusText: 'Internal Server Error' } }
    ]);
  });
});

const itShouldFailAndThrowAnError = (service) => it('Should fail and then throw an error', () => {
  const store = mockStore({ response: { status: 400, statusText: 'Bad Request' }})();

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('An error has occurred 400 (Bad Request)'));
    expect(store.getActions()).toEqual([
      { type: 'api_call_failed', payload: { status: 400, statusText: 'Bad Request' } }
    ]);
  });
});

const itShouldFailAndDispatchUnauthorised = (service) => it('Should fail and dispatch an unauthorised', () => {
  const store = mockStore({ response : { status: 403, statusText: 'Forbidden' }})();

  return store.dispatch(service()).catch((err) => {
    expect(err).toEqual(new Error('Unauthorised access 403'));
    expect(store.getActions()).toEqual([{ type: 'unauthorised_copy_document' }]);
  });
});

describe('CopyAllCertificateData', () => {

  let getFn = jest.fn();
  let postFn = jest.fn();
  let store;

  const journey = 'catchCertificate';
  const ipAddress = 'xx.xxx.xx.xxx';
  const originalDocumentNumber = 'document1';
  const copyDocumentNumber = 'document2';
  const isVoidedDocument = false;
  const copyDocumentAcknowledged = true;
  const excludeLandings = false;

  beforeEach(() => {
    postFn.mockReset();
    postFn.mockResolvedValue({status: 200, data: { documentNumber: originalDocumentNumber, newDocumentNumber: copyDocumentNumber, voidOriginal: isVoidedDocument }});

    getFn.mockReset();
    getFn.mockResolvedValue({status: 200, data: ipAddress});

    store = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        post: postFn,
        get: getFn
      }
    })])({});
  });

  it('will call the orchestrator for copy all data option', async () => {
    await store.dispatch(
      submitCopyCertificate({
        documentNumber: originalDocumentNumber, copyDocumentAcknowledged, voidOriginal:isVoidedDocument, excludeLandings, journey
      })
      );

    expect(getFn).not.toHaveBeenCalled();

    expect(postFn).toHaveBeenCalledWith(
      '/confirm-copy-certificate',
      {
        copyDocumentAcknowledged: true,
        voidOriginal: false,
        excludeLandings: false,
        journey: 'catchCertificate'
      },
      {
        headers: {
          documentnumber: originalDocumentNumber
        }
      }
    );
  });

  it('will return the document number from a successful api call', async () => {
    const res = await store.dispatch(submitCopyCertificate(originalDocumentNumber, copyDocumentAcknowledged, isVoidedDocument, excludeLandings, journey));

    expect(store.getActions()).toEqual([{ type: 'confirm_copy_document', payload: { documentNumber: originalDocumentNumber, voidDocumentConfirm: false }}]);
    expect(res).toStrictEqual(copyDocumentNumber);
  });
});

describe('excludeLandings', () => {

  let getFn = jest.fn();
  let postFn = jest.fn();
  let store;

  const journey = 'catchCertificate';
  const ipAddress = 'xx.xxx.xx.xxx';
  const originalDocumentNumber = 'document1';
  const copyDocumentNumber = 'document2';
  const isVoidedDocument = false;
  const copyDocumentAcknowledged = true;
  const excludeLandings = true;

  beforeEach(() => {
    postFn.mockReset();
    postFn.mockResolvedValue({status: 200, data: { documentNumber: originalDocumentNumber, newDocumentNumber: copyDocumentNumber, voidOriginal: isVoidedDocument }});

    getFn.mockReset();
    getFn.mockResolvedValue({status: 200, data: ipAddress});

    store = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        post: postFn,
        get: getFn
      }
    })])({});
  });

  it('will call the orchestrator for copy all data option', async () => {
    await store.dispatch(
      submitCopyCertificate({
        documentNumber: originalDocumentNumber, copyDocumentAcknowledged, voidOriginal:isVoidedDocument, excludeLandings, journey
      })
      );

    expect(getFn).not.toHaveBeenCalled();

    expect(postFn).toHaveBeenCalledWith(
      '/confirm-copy-certificate',
      {
        copyDocumentAcknowledged: true,
        voidOriginal: false,
        excludeLandings: true,
        journey: 'catchCertificate'
      },
      {
        headers: {
          documentnumber: originalDocumentNumber
        }
      }
    );
  });

  it('will return the document number from a successful api call', async () => {
    const res = await store.dispatch(submitCopyCertificate(originalDocumentNumber, copyDocumentAcknowledged, isVoidedDocument, excludeLandings, journey));

    expect(store.getActions()).toEqual([{ type: 'confirm_copy_document', payload: { documentNumber: originalDocumentNumber, voidDocumentConfirm: false }}]);
    expect(res).toStrictEqual(copyDocumentNumber);
  });
});

describe('submitCopyCertificate', () => {

  let getFn = jest.fn();
  let postFn = jest.fn();
  let store;

  const journey = 'catchCertificate';
  const ipAddress = 'xx.xxx.xx.xxx';
  const originalDocumentNumber = 'document1';
  const copyDocumentNumber = 'document2';
  const isVoidedDocument = false;
  const copyDocumentAcknowledged = true;
  const excludeLandings = false;

  beforeEach(() => {
    postFn.mockReset();
    postFn.mockResolvedValue({status: 200, data: { documentNumber: originalDocumentNumber, newDocumentNumber: copyDocumentNumber, voidOriginal: isVoidedDocument }});

    getFn.mockReset();
    getFn.mockResolvedValue({status: 200, data: ipAddress});

    store = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        post: postFn,
        get: getFn
      }
    })])({});
  });

  it('will call the orchestrator with the correct details', async () => {
    await store.dispatch(
      submitCopyCertificate({
        documentNumber: originalDocumentNumber, copyDocumentAcknowledged, voidOriginal:isVoidedDocument, excludeLandings, journey
      })
      );

    expect(getFn).not.toHaveBeenCalled();

    expect(postFn).toHaveBeenCalledWith(
      '/confirm-copy-certificate',
      {
        copyDocumentAcknowledged: true,
        voidOriginal: false,
        excludeLandings: false,
        journey: 'catchCertificate'
      },
      {
        headers: {
          documentnumber: originalDocumentNumber
        }
      }
    );
  });

  it('will return the document number from a successful api call', async () => {
    const res = await store.dispatch(submitCopyCertificate(originalDocumentNumber, copyDocumentAcknowledged, isVoidedDocument, excludeLandings, journey));

    expect(store.getActions()).toEqual([{ type: 'confirm_copy_document', payload: { documentNumber: originalDocumentNumber, voidDocumentConfirm: false }}]);
    expect(res).toStrictEqual(copyDocumentNumber);
  });

  describe('when document is to be voided', () => {
    const isVoidedDocument = true;

    beforeEach(() => {
      postFn.mockReset();
      postFn.mockResolvedValue({status: 200, data: { documentNumber: originalDocumentNumber, newDocumentNumber: copyDocumentNumber, voidOriginal: isVoidedDocument }});

      getFn.mockReset();
      getFn.mockResolvedValue({status: 200, data: ipAddress });

      store = configureStore([thunk.withExtraArgument({
        orchestrationApi: {
          post: postFn,
          get: getFn
        }
      })])({});
    });

    it('will call the orchestrator with the correct details', async () => {
      await store.dispatch(submitCopyCertificate({
        documentNumber:originalDocumentNumber,
        copyDocumentAcknowledged,
        voidOriginal: isVoidedDocument,
        excludeLandings: false,
        journey
        })
      );

      expect(getFn).toHaveBeenCalledWith('/client-ip');

      expect(postFn).toHaveBeenCalledWith(
        '/confirm-copy-certificate',
        {
          copyDocumentAcknowledged: true,
          voidOriginal: isVoidedDocument,
          excludeLandings: false,
          journey: 'catchCertificate',
          ipAddress: 'xx.xxx.xx.xxx'
        },
        {
          headers: {
            documentnumber: originalDocumentNumber
          }
        }
      );
    });

    it('will return the document number from a successful api call', async () => {
      const res = await store.dispatch(
        submitCopyCertificate({
          documentNumber:originalDocumentNumber,
          copyDocumentAcknowledged,
          voidOriginal:isVoidedDocument,
          excludeLandings,
          journey
          })
      );

      expect(store.getActions()).toEqual([{ type: 'confirm_copy_document', payload: { documentNumber: originalDocumentNumber, voidDocumentConfirm: true }}]);
      expect(res).toStrictEqual(copyDocumentNumber);
    });

    it('will return undefined for an unsuccessful api call with status 400', async () => {
      const error = {response: { status: 400 }};

      getFn.mockRejectedValue(error);

      const res = await store.dispatch(submitCopyCertificate({
        documentNumber:originalDocumentNumber, copyDocumentAcknowledged, voidOriginal:isVoidedDocument, excludeLandings, journey
        })
      );

      expect(res).toBeUndefined();
      expect(store.getActions()).toEqual([
        { type: 'api_call_failed', payload: error.response }
      ]);
    });

    it('will return undefined for an unsuccessful api call with status 500', async () => {
      const error = {response: { status: 500 }};

      getFn.mockRejectedValue(error);

      const res = await store.dispatch(submitCopyCertificate({
        documentNumber: originalDocumentNumber, copyDocumentAcknowledged, voidOriginal: isVoidedDocument, excludeLandings, journey
      }));

      expect(res).toBeUndefined();
      expect(store.getActions()).toEqual([
        { type: 'save', payload: { showFullPageError: true } },
        { payload: {'status': 500}, type: 'api_call_failed'}
      ]);
    });

    it('will dispatch showFullPageError() if the orchestrator call fails', async () => {
      const error = {response: { status: 500 }};

      getFn.mockRejectedValue(error);

      await store.dispatch(submitCopyCertificate({
        documentNumber: originalDocumentNumber, copyDocumentAcknowledged, voidOriginal: isVoidedDocument, excludeLandings, journey
      }));

      expect(store.getActions()).toEqual([
        { type: 'save', payload: { showFullPageError: true } },
        { type: 'api_call_failed', payload:{ status: 500 } }
      ]);
    });
  });

  it('will return unauthorised for an unsuccessful api call', async () => {
    const error = {response: { status: 403 }};

    postFn.mockRejectedValue(error);

    const res = await store.dispatch(submitCopyCertificate({
      documentNumber: originalDocumentNumber, copyDocumentAcknowledged, voidOriginal: isVoidedDocument, excludeLandings, journey
    }));

    expect(res).toBeUndefined();
    expect(store.getActions()).toEqual([{ type: 'unauthorised_copy_document'}]);
  });

  it('will return undefined for an unsuccessful api call', async () => {
    const error = new Error('broken');

    postFn.mockRejectedValue(error);

    const res = await store.dispatch(submitCopyCertificate(originalDocumentNumber, copyDocumentAcknowledged, isVoidedDocument, excludeLandings, journey));

    expect(res).toBeUndefined();
  });

  it('will dispatch showFullPageError() if the orchestrator call fails', async () => {
    const error = new Error('broken');

    postFn.mockRejectedValue(error);

    await store.dispatch(submitCopyCertificate(originalDocumentNumber, copyDocumentAcknowledged, isVoidedDocument, excludeLandings, journey));

    expect(store.getActions()).toEqual([
      { type: 'save', payload: { showFullPageError: true }},
      { type: 'api_call_failed', payload: {} }
    ]);
  });

});

describe('checkCopyCertificate', () => {

  it('should check whether a document can be cloned', () => {

    const documentNumber = 'GBR-2020-CC-2345-3453';
    const expectedActions = [];

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res({ data: { canCopy: true } });
          });
        }
      }
    })]);

    const store = mockStore();

    return store.dispatch(checkCopyCertificate(documentNumber)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch unauthorised if document can not be cloned', () => {

    const documentNumber = 'GBR-2020-CC-2345-3453';
    const expectedActions = [{
      type : 'unauthorised_copy_document'
    }];

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res({ data: { canCopy: false } });
          });
        }
      }
    })]);

    const store = mockStore();

    return store.dispatch(checkCopyCertificate(documentNumber)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  itShouldFailAndShowFullPageError(checkCopyCertificate);
  itShouldFailAndThrowAnError(checkCopyCertificate);
  itShouldFailAndDispatchUnauthorised(checkCopyCertificate);
});

describe('copy certificate actions', () => {

  const mockStore = configureStore([thunk]);
  const store = mockStore({ copyCertificateConfirm: { copyDocumentAcknowledged: false }, errors: [] });

  beforeEach(() => {
    store.clearActions();
  });

  it('should dispatch addCopyDocument', () => {
    const expectedActions = [{ type: 'confirm_copy_document' }];
    store.dispatch(addCopyDocument());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should clear a copy certificate', () => {
    const expectedActions = [{type: 'clear_copy_document'}];
    store.dispatch(clearCopyDocument());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should clear errors', () => {
    const expectedActions = [{type: 'clear_errors'}];
    store.dispatch(clearErrors());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch an unauthorised', () => {
    const expectedActions = [{type: 'unauthorised_copy_document'}];
    store.dispatch(unauthorisedCopyDocument());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
