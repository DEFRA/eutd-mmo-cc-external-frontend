import { isEmpty } from 'lodash';
import { uploadLandingsFile, saveLandings, clearLandings } from '../../../src/client/actions/upload-file.actions';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const data = [
  {
    rowNumber: 1,
    originalRow: 'some-string',
    productId: 'some-product-id',
    product: {
      species: 'species',
      speciesCode: 'species-code',
      scientificName: 'some-scientic-name',
      state: 'some-state',
      stateLabel: 'some-label',
      presentation: 'some-presentation',
      presentationLabel: 'some-presentation-label',
      commodity_code: 'some-commidity-code',
      commodity_code_description: 'some-commmodity-description',
    },
    landingDate: 'some-landing-date',
    faoArea: 'faoArea',
    vesselName: 'vessel-name',
    vesselPln: 'some-pln',
    exportWeight: 10,
    errors: [],
  },
];

const mockStore = (rejectWith = false) =>
  configureStore([
    thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res({ data });
            }
          });
        },
        post: () => {
          return new Promise((res, rej) => {
            if (rejectWith) {
              rej(rejectWith);
            } else {
              res({ data });
            }
          });
        },
      },
    }),
  ]);

const itShouldFailAndShowFullPageError = (service, actions) =>
  it('Should fail, showFullPageError and then throw an error', () => {
    const store = mockStore({
      response: { status: 500, statusText: 'Internal Server Error' },
    })();

    return store.dispatch(service()).catch((err) => {
      expect(err).toEqual(
        new Error('An error has occurred 500 (Internal Server Error)')
      );

      const expected = [
        { type: 'begin_api_call' },
        { ...(actions && actions)},
        { type: 'save', payload: { showFullPageError: true } },
      ].filter(action => !isEmpty(action));

      expect(store.getActions()).toEqual(expected);
    });
  });

const itShouldFailAndThrowAnError = (service, actions) =>
  it('Should fail and then throw an error', () => {
    const store = mockStore({
      response: { status: 400, statusText: 'Bad Request' },
    })();

    return store.dispatch(service()).catch((err) => {
      expect(err).toEqual(new Error('An error has occurred 400 (Bad Request)'));

      const expected = [
        { type: 'begin_api_call' },
        { ...(actions && actions)},
        {
          type: 'api_call_failed',
          payload: { status: 400, statusText: 'Bad Request' },
        },
      ].filter(action => !isEmpty(action));
      expect(store.getActions()).toEqual(expected);
    });
  });

const itShouldFailAndDispatchUnauthorised = (service, actions) =>
  it('Should fail and dispatch an unauthorised', () => {
    const store = mockStore({
      response: { status: 403, statusText: 'Forbidden' },
    })();

    return store.dispatch(service()).catch((err) => {
      expect(err).toEqual(new Error('unauthorised access 403'));
      const expected = [
        { type: 'begin_api_call' },
        { ...(actions && actions)},
        { type: 'unauthorised_landing_rows' },
      ].filter(action => !isEmpty(action));

      expect(store.getActions()).toEqual(expected);
    });
  });

describe('#clearLandings', () => {
  it('should clear uploaded landings', () => {
    const expectedActions = [{ type: 'clear_errors' }, { type: 'clear_landings_rows' }];

    const store = mockStore()({
      response: data,
    });

    store.dispatch(clearLandings());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('#uploadLandings', () => {
  it('should upload file data for validation', () => {
    const expectedActions = [
      {
        type: 'begin_api_call',
      },
      {
        payload: data,
        type: 'upload_landing_rows',
      },
    ];

    const store = mockStore()({
      response: data,
    });

    return store.dispatch(uploadLandingsFile(data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  itShouldFailAndShowFullPageError(uploadLandingsFile, { type: 'clear_landings_rows'});
  itShouldFailAndThrowAnError(uploadLandingsFile, { type: 'clear_landings_rows'});
  itShouldFailAndDispatchUnauthorised(uploadLandingsFile, { type: 'clear_landings_rows'});
});

describe('#saveLandings', () => {
  it('should save file data to export', () => {
    const expectedActions = [
      {
        type: 'begin_api_call',
      },
      {
        payload: data,
        type: 'save_landing_rows',
      },
    ];

    const documentNumber = 'GBR-2020-CC-2344-2423';

    const store = mockStore()({
      response: data,
    });

    return store.dispatch(saveLandings(data, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should save file data to export without a document number', () => {
    const expectedActions = [
      {
        type: 'begin_api_call',
      },
      {
        payload: data,
        type: 'save_landing_rows',
      },
    ];

    const documentNumber = undefined;

    const store = mockStore()({
      response: data,
    });

    return store.dispatch(saveLandings(data, documentNumber)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  itShouldFailAndShowFullPageError(saveLandings);
  itShouldFailAndThrowAnError(saveLandings);
  itShouldFailAndDispatchUnauthorised(saveLandings);
});
