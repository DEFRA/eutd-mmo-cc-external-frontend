import fishReducer from '../../../src/client/reducers/fishReducer';

describe('Fish Reducer', () => {

    it('should reduce to initial state', () => {
      const initialState = [];
      const action = {type: ''};

      expect(fishReducer(initialState, action)).toEqual([]);
    });

    it('should reduce to initial state with an undefined', () => {
      const action = {type: ''};

      expect(fishReducer(undefined, action)).toEqual([]);
    });

    it('should add a species to initial state', () => {
        const initialState = [];

        const payload = {
            data : [
                {
                    faoCode           : 'COD',
                    reportingFaoCode  : 'COD',
                    faoName           : 'Atlantic cod',
                    commonNames       : [
                                        'Cod'
                                        ],
                    scientificName    : 'Gadus morhua',
                    commonRank        : 1,
                    searchRank        : 1
                },
                {   faoCode           : 'AIM',
                    reportingFaoCode  : '',
                    faoName           : 'Dwarf codling',
                    commonNames       : [],
                    scientificName    : 'Austrophycis marginata',
                    commonRank        : 1,
                    searchRank        : 2
                }
            ]
        };

        const action = {type: 'search_fish', payload: payload};

        expect(fishReducer(initialState, action)).toEqual(payload.data);
    });

    it('should clear species from state', () => {
        const initialState = [
            {
                faoCode           : 'COD',
                reportingFaoCode  : 'COD',
                faoName           : 'Atlantic cod',
                commonNames       : [
                                    'Cod'
                                    ],
                scientificName    : 'Gadus morhua',
                commonRank        : 1,
                searchRank        : 1
            },
            {   faoCode           : 'AIM',
                reportingFaoCode  : '',
                faoName           : 'Dwarf codling',
                commonNames       : [],
                scientificName    : 'Austrophycis marginata',
                commonRank        : 1,
                searchRank        : 2
            }
        ];

        const payload = {
            data : []
        };

        const action = {type: 'clear_species_search_results', payload: payload};

        expect(fishReducer(initialState, action)).toEqual([]);
    });
});