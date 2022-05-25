import addedSpeciesErrorStateReducer from '../../../src/client/reducers/addedSpeciesErrorStateReducer';

describe('Add Species Error State Reducer', () => {

    it('should reduce to initial state', () => {
      const initialState = [];
      const action = {type: ''};

      expect(addedSpeciesErrorStateReducer(initialState, action)).toEqual([]);
    });

    it('should reduce to initial state with an undefined state', () => {
      const action = {type: ''};

      expect(addedSpeciesErrorStateReducer(undefined, action)).toEqual([]);
    });

    it('should add species per user to initial state', () => {
        const initialState = [];
        const action = {type: 'add_species_per_user'};

        expect(addedSpeciesErrorStateReducer(initialState, action)).toEqual([]);
    });

    it('should add species per_user failure to initial state', () => {
        const initialState = [];

        const payload = {
            data: {
                message: [
                    'Add species failed'
                ]
            }
        };
        const action = {type: 'add_species_per_user_failed', payload: payload};
        expect(addedSpeciesErrorStateReducer(initialState, action)).toEqual([['Add species failed']]);
    });
});