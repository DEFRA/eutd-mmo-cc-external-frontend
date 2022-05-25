import globalReducer from '../../../src/client/reducers/globalReducer';

describe('Global Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {};
        const action = {
            type : ''
        };

        expect(globalReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with undefined', () => {
      const initialState = {
        allFish: [],
        allVessels: [],
        allCountries: []
      };

      const action = {
          type : ''
      };

      expect(globalReducer(undefined, action)).toEqual(initialState);
  });

    it('should save to state', () => {
        const initialState = {};

        const action = {
            type: 'save',
            payload : {
                allFish : [
                    {'faoCode':'BAZ','reportingFaoCode':'BAZ','faoName':'Barracudas, etc. nei','commonNames':['Barracuda'],'scientificName':'Sphyraenidae','commonRank':1,'searchRank':1},
                    {'faoCode':'BER','reportingFaoCode':'BER','faoName':'','commonNames':['Scorpionfish'],'scientificName':'Brachypterois serrulata','commonRank':1,'searchRank':1},
                    {'faoCode':'BET','reportingFaoCode':'BET','faoName':'Bigeye tuna','commonNames':['Bigeye Tuna'],'scientificName':'Thunnus obesus','commonRank':1,'searchRank':1}
                ]
            }
        };

        const expectedResult = {
            allFish : [
                {'faoCode':'BAZ','reportingFaoCode':'BAZ','faoName':'Barracudas, etc. nei','commonNames':['Barracuda'],'scientificName':'Sphyraenidae','commonRank':1,'searchRank':1},
                {'faoCode':'BER','reportingFaoCode':'BER','faoName':'','commonNames':['Scorpionfish'],'scientificName':'Brachypterois serrulata','commonRank':1,'searchRank':1},
                {'faoCode':'BET','reportingFaoCode':'BET','faoName':'Bigeye tuna','commonNames':['Bigeye Tuna'],'scientificName':'Thunnus obesus','commonRank':1,'searchRank':1}
            ]
        };

        expect(globalReducer(initialState, action)).toEqual(expectedResult);
    });
    
    it('should update forbidden to state', () => {
        const initialState = {};

        const action = {
            type: 'save',
            payload : {showForbiddenError: true}
        };

        const expectedResult = {showForbiddenError: true};

        expect(globalReducer(initialState, action)).toEqual(expectedResult);
    });
});