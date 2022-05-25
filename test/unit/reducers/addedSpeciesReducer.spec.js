import addedSpeciesReducer from '../../../src/client/reducers/addedSpeciesReducer';

describe('Added Species State Reducer', () => {
  it('should reduce to initial state', () => {
    const initialState = {
      species: [],
    };
    const action = { type: '' };

    expect(addedSpeciesReducer(initialState, action)).toEqual({
      species: [],
    });
  });

  it('should reduce to initial state when given no initial state', () => {
    const action = { type: '' };

    expect(addedSpeciesReducer(undefined, action)).toEqual({
      species: [],
    });
  });

  it('should get species per user in initial state', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'get_added_species_per_user',
      payload: {
        data: {
          species: [
            {
              id: '496df882-0f04-472d-a97d-c335c62031b5',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              species: 'European lobster (LBE)',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
              presentation: 'WHL',
              presentationLabel: 'Whole',
              commodity_code: '03061210',
            },
          ],
        },
      },
    };

    const expectedAction = {
      species: [
        {
          id: '496df882-0f04-472d-a97d-c335c62031b5',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
          species: 'European lobster (LBE)',
          speciesCode: 'LBE',
          state: 'FRO',
          stateLabel: 'Frozen',
          presentation: 'WHL',
          presentationLabel: 'Whole',
          commodity_code: '03061210',
        },
      ],
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should get species per user with partially removed species', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'get_added_species_per_user',
      payload: {
        data: {
          species: [
            {
              id: '496df882-0f04-472d-a97d-c335c62031b5',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              species: 'European lobster (LBE)',
              speciesCode: 'LBE',
              state: 'FRO',
              stateLabel: 'Frozen',
              presentation: 'WHL',
              presentationLabel: 'Whole',
              commodity_code: '03061210',
            },
          ],
          partiallyFilledProductRemoved: true,
        },
      },
    };

    const expectedAction = {
      species: [
        {
          id: '496df882-0f04-472d-a97d-c335c62031b5',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
          species: 'European lobster (LBE)',
          speciesCode: 'LBE',
          state: 'FRO',
          stateLabel: 'Frozen',
          presentation: 'WHL',
          presentationLabel: 'Whole',
          commodity_code: '03061210',
        },
      ],
      partiallyFilledProductRemoved: true,
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should reduce the updated species per user to state', () => {
    const initialState = {
      species: [
        {
          id: '496df882-0f04-472d-a97d-c335c62031b5',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
          species: 'European lobster (LBE)',
          speciesCode: 'LBE',
          state: 'FRO',
          stateLabel: 'Frozen',
          presentation: 'WHL',
          presentationLabel: 'Whole',
          commodity_code: '03061210',
        },
      ],
      partiallyFilledProductRemoved: false
    };

    const action = {
      type: 'edit_added_species_per_user',
      payload: {
        data: {
          products: [
            {
              id: '496df882-0f04-472d-a97d-c335c62031b5',
              user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
              species: 'Atlantic cod (COD)',
              speciesCode: 'COD',
              state: 'FRE',
              stateLabel: 'Fresh',
              presentation: 'WHL',
              presentationLabel: 'Whole',
              commodity_code: '03001510',
            },
          ],
        },
      },
    };

    const expectedAction = {
      species: [
        {
          id: '496df882-0f04-472d-a97d-c335c62031b5',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          state: 'FRE',
          stateLabel: 'Fresh',
          presentation: 'WHL',
          presentationLabel: 'Whole',
          commodity_code: '03001510',
        },
      ],
      partiallyFilledProductRemoved: false
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should add first species per user to initial state', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'add_species_per_user',
      payload: {
        data: {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      },
    };

    const expectedResult = {
      species: [
        {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should update existing species per user', () => {
    const initialState = {
      species: [
        {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    const action = {
      type: 'add_species_per_user',
      payload: {
        data: {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)1',
          speciesCode: 'COD1',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      },
    };

    const expectedResult = {
      species: [
        {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)1',
          speciesCode: 'COD1',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should add species per user to existing add species state', () => {
    const initialState = {
      species: [
        {
          id: 'd3564b44-ef54-4797-b361-142a26915531',
          species: 'Norway lobster (LBE)',
          speciesCode: 'LBE',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    const action = {
      type: 'add_species_per_user',
      payload: {
        data: {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      },
    };

    const expectedResult = {
      species: [
        {
          id: 'd3564b44-ef54-4797-b361-142a26915531',
          species: 'Norway lobster (LBE)',
          speciesCode: 'LBE',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
        {
          id: 'd3564b44-ef54-4797-b361-142a26915535',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should remove species per user from initial state', () => {
    const initialState = {
      species: [
        {
          commodity_code: '03047190',
          id: '34d114ac-99b5-4fe1-9f5d-4a764a75d459',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          state: 'FRO',
          stateLabel: 'Frozen',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
        {
          commodity_code: '03061210',
          id: '496df882-0f04-472d-a97d-c335c62031b5',
          presentation: 'WHL',
          presentationLabel: 'Whole',
          species: 'European lobster (LBE)',
          speciesCode: 'LBE',
          state: 'FRO',
          stateLabel: 'Frozen',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    const expectedResult = {
      species: [
        {
          commodity_code: '03061210',
          id: '496df882-0f04-472d-a97d-c335c62031b5',
          presentation: 'WHL',
          presentationLabel: 'Whole',
          species: 'European lobster (LBE)',
          speciesCode: 'LBE',
          state: 'FRO',
          stateLabel: 'Frozen',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    const action = {
      type: 'removed_species_per_user',
      payload: {
        data: {
          cancel: '34d114ac-99b5-4fe1-9f5d-4a764a75d459',
        },
      },
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should clear species per user', () => {
    const initialState = {
      species: [
        {
          commodity_code: '03047190',
          id: '34d114ac-99b5-4fe1-9f5d-4a764a75d459',
          presentation: 'FIL',
          presentationLabel: 'Filleted',
          species: 'Atlantic cod (COD)',
          speciesCode: 'COD',
          state: 'FRO',
          stateLabel: 'Frozen',
          user_id: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX-YZ12',
        },
      ],
    };

    const expectedResult = {
      species: [],
    };
    const action = { type: 'clear_added_species_per_user' };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedResult);
  });

  it('should unauthorise species per user in initial state', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'add_species_per_user_unauthorised',
    };

    const expectedAction = {
      species: [],
      unauthorised: true,
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should unauthorise edit species per user in initial state', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'edit_added_species_per_user_unauthorised',
    };

    const expectedAction = {
      species: [],
      unauthorised: true,
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should unauthorise get added species in initial state', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'get_added_species_unauthorised',
    };

    const expectedAction = {
      species: [],
      unauthorised: true,
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should addedToFavourites property get added the initial state', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'added_to_favourites',
      payload : { addedFavouriteProduct : 'a value'}
    };

    const expectedAction = {
      species: [],
      addedFavouriteProduct: 'a value',
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });

  it('should reset addedFavouriteProduct to empty object', () => {
    const initialState = {
      species: [],
    };

    const action = {
      type: 'hide_added_to_favourites_notification',
      payload : {}
    };

    const expectedAction = {
      species: [],
      addedFavouriteProduct: {},
    };

    expect(addedSpeciesReducer(initialState, action)).toEqual(expectedAction);
  });


});
