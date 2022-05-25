import favouritesReducer from '../../../src/client/reducers/favouritesReducer';

describe('Favourites Reducer', () => {
  it('should reduce to initial state', () => {
    const initialState = {
      favourites: [],
    };

    const action = {
      type: '',
    };

    expect(favouritesReducer(initialState, action)).toEqual(initialState);
  });

  it('should reduce to initial state with an undefined', () => {
    const initialState = {
      favourites: [],
    };

    const action = {
      type: '',
    };

    expect(favouritesReducer(undefined, action)).toEqual(initialState);
  });

  it('should reduce payload favourite removed to initial state', () => {
    const initialState = {
      favourites: [
        {
          commodityCode: '03047190',
          id: 'PRD234',
          presentation: {
            code: 'FIL',
            label: 'Filleted',
          },
          species: {
            code: 'COD',
            label: 'Atlantic cod (COD)',
          },
          state: {
            code: 'FRO',
            label: 'Frozen',
          },
        },
      ],
    };

    const action = {
      payload: {
        favourites: [],
      },
      type: 'favourite_removed',
    };

    const expectedResult = {
      favourites: action.payload,
      errors: undefined,
    };

    expect(favouritesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should reduce payload favourite remove failed to initial state', () => {
    const initialState = {
      favourites: [],
    };

    const action = {
      payload: [],
      type: 'favourite_remove_failed',
      error: ['There is a failure'],
    };

    const expectedResult = {
      favourites: [],
      errors: ['There is a failure'],
    };

    expect(favouritesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should recude an unauthorised payload favourite to unauthorised', () => {
    const initialState = {
      favourites: [{}]
    };

    const action = {
      payload: {

      },
      type : 'favourite_removed_unauthorised'
    };

    const expectedResult = {
      favourites: [{}],
      unauthorised: true
    };

    expect(favouritesReducer(initialState, action)).toStrictEqual(expectedResult);
});


it('ADD FAV# should replace favourites with the returned payload', () => {
  const initialState = {
    favourites: ['FISH1'],
  };

  const action = {
    payload: ['FISH1', 'FISH2'],
    type: 'favourite_add',
  };

  const expectedResult = {
    favourites: action.payload,
    errors: undefined,
  };

  expect(favouritesReducer(initialState, action)).toEqual(expectedResult);
});

it('ADD Fav# should reduce payload add favourite failed to initial state', () => {
  const initialState = {
    favourites: [],
  };

  const action = {
    payload: {
      favourites: [],
    },
    type: 'favourite_add_failed',
    error: ['There is a failure'],
  };

  const expectedResult = {
    favourites: [],
    errors: ['There is a failure'],
  };

  expect(favouritesReducer(initialState, action)).toEqual(expectedResult);
});

it('ADD FAV# should recude an unauthorised payload favourite to unauthorised', () => {
  const initialState = {
    favourites: [{}]
  };

  const action = {
    payload: {

    },
    type : 'favourite_add_unauthorised'
  };

  const expectedResult = {
    favourites: [{}],
    unauthorised: true
  };

  expect(favouritesReducer(initialState, action)).toStrictEqual(expectedResult);
});

});

describe('Added Favourites State Reducer', () => {

  it('should reduce to initial state', () => {
    const initialState = {
      species: [],
    };
    const action = { type: '' };

    expect(favouritesReducer(initialState, action)).toEqual({
      species: [],
    });
  });
  it('should reduce to initial state when given no initial state', () => {
    const action = { type: '' };

    expect(favouritesReducer(undefined, action)).toEqual({
      favourites: [],
    });
  });
    it('should get favourites per user in initial state', () => {
        const initialState = {
          favourites: [],
        };

        const action = {
          type: 'get_added_favourites_per_user',
          payload: {
            data: {
              favourites: [
                {
                  commodity_code: '03044410',
                  commodity_code_description: 'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
                  id: 'GBR-2021-CC-0742EA3B4-e279ac8d-f705-47f0-b54d-e059c430c287',
                  presentation: 'FIL',
                  presentationLabel: 'Filleted',
                  scientificName: 'Gadus morhua',
                  species: 'Atlantic cod (COD)',
                  speciesCode: 'COD',
                  state: 'FRE',
                  stateLabel: 'Fresh',
                },
              ],
            },
          },
        };

        const expectedAction = {
          favourites: [
            {
              commodity_code: '03044410',
              commodity_code_description:
                'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
              id: 'GBR-2021-CC-0742EA3B4-e279ac8d-f705-47f0-b54d-e059c430c287',
              presentation: 'FIL',
              presentationLabel: 'Filleted',
              scientificName: 'Gadus morhua',
              species: 'Atlantic cod (COD)',
              speciesCode: 'COD',
              state: 'FRE',
              stateLabel: 'Fresh',
            },
          ],
        };

        const addedFavouritesPerUser = favouritesReducer(initialState, action);
        expect(addedFavouritesPerUser.favourites).toEqual(expectedAction);
      });
    it('should unauthorise favourites per user in initial state', () => {
        const initialState = {
          favourites: [],
        };

        const action = {
          type: 'get_added_favourites_unauthorised',
        };

        const expectedAction = {
          favourites: [],
          unauthorised: true,
        };

        expect(favouritesReducer(initialState, action)).toEqual(expectedAction);
      });
    it('should clear favourites per user', () => {
        const initialState = {
          favourites: [
            {
              id: '34d114ac-99b5-4fe1-9f5d-4a764a75d459',
              presentation: 'FIL',
              presentationLabel: 'Filleted',
              species: 'Atlantic cod (COD)',
              speciesCode: 'COD',
              state: 'FRO',
              stateLabel: 'Frozen',
              scientificName: 'Gadus morhua1',
              commodity_code: '03044410',
              commodity_code_description: 'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
            },
          ],
        };

        const expectedResult = {
          favourites: [],
        };
        const action = { type: 'clear_added_favourites_per_user' };

        expect(favouritesReducer(initialState, action)).toEqual(expectedResult);
      });

});

