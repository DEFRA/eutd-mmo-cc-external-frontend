import speciesPresentationsReducer from '../../../src/client/reducers/speciesPresentationsReducer';

describe('Species Presentations Reducer', () => {

    it('should reduce to initial state', () => {
        const initialState = {};
        const action = {
            type : ''
        };

        expect(speciesPresentationsReducer(initialState, action)).toEqual(initialState);
    });

    it('should reduce to initial state with an undefined state', () => {
      const action = {
          type : ''
      };

      expect(speciesPresentationsReducer(undefined, action)).toEqual([]);
    });

    it('should reduce to clear state', () => {
      const initialState = {};
      const action = {
          type : 'get_species_presentations_clear'
      };

      expect(speciesPresentationsReducer(initialState, action)).toEqual([]);
    });

    it('should add species presentations failure to initial state', () => {
        const initialState = {};
        const action = {
            type   : 'get_species_presentations_failed',
            payload : {
                data : {
                    message : {
                        errorMessage : 'No Presentations found'
                    }
                }
            }
        };

        const expectedResult = [{errorMessage: 'No Presentations found'}];
        expect(speciesPresentationsReducer(initialState, action)).toEqual(expectedResult);
    });

    it('should add species presentations to initial state', () => {
        const initialState = {};

        const action = {
            type: 'get_species_presentations',
            payload : {
                data : [
                    {value:'BMS',label:'Below minimum conservation reference size'},
                    {value:'CBF',label:'Cod butterfly (escalado)'},
                    {value:'CLA',label:'Claws'},
                    {value:'DWT',label:'ICCAT code'},
                    {value:'FIL',label:'Filleted'},
                    {value:'FIN',label:'Temporary Record'},
                    {value:'FIS',label:'Filleted and skinned fillets'},
                    {value:'FSB',label:'Filleted with skin and bones'},
                    {value:'FSP',label:'Filleted skinned with pinbone on'},
                    {value:'GHT',label:'Gutted headed and tailed'},
                    {value:'GUG',label:'Gutted and gilled'},
                    {value:'GUH',label:'Gutted and headed'},
                    {value:'GUL',label:'Gutted liver in'},
                    {value:'GUS',label:'Gutted headed and skinned'},
                    {value:'GUT',label:'Gutted'},
                    {value:'HEA',label:'Headed'},
                    {value:'JAP',label:'Japanese cut'},
                    {value:'JAT',label:'Tailed Japanese cut'},
                    {value:'LAP',label:'Lappen'},
                    {value:'LVR',label:'Liver'},
                    {value:'LVR-C',label:'Liver-C'},
                    {value:'OTH',label:'Other'},
                    {value:'ROE',label:'Roe(s)'},
                    {value:'ROE-C',label:'Roe(s) - C'},
                    {value:'SAD',label:'Salted dry'},
                    {value:'SAL',label:'Salted wet light'},
                    {value:'SGH',label:'Salted'},
                    {value:'SGT',label:'Salted gutted'},
                    {value:'SKI',label:'Skinned'},
                    {value:'SUR',label:'Surimi'},
                    {value:'TAL',label:'Tail'},
                    {value:'TLD',label:'Tailed'},
                    {value:'TNG',label:'Tongue'},
                    {value:'TNG-C',label:'Tongue-C'},
                    {value:'TUB',label:'Tube only'},
                    {value:'WHL',label:'Whole'},
                    {value:'WNG',label:'Wings'}
                ]
            }
        };

        const expectedResult = action.payload.data;
        expect(speciesPresentationsReducer(initialState, action)).toEqual(expectedResult);
    });
});