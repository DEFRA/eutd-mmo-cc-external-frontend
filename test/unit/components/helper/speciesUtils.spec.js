import { findSpeciesState, findPresentation, findCommodity } from '../../../../src/client/components/helper/speciesUtils';

describe('speciesUtils', () => {

  describe('#findSpeciesState', () => {
    const states = [
      { value: 'ALI', label: 'Alive'},
      { value: 'BOI', label: 'Boiled'},
      { value: 'DRI', label: 'Dried'},
      { value: 'FRE', label: 'Fresh'},
      { value: 'FRO', label: 'Frozen'},
      { value: 'SAL', label: 'Salted'},
      { value: 'SMO', label: 'Smoked'},
    ];
    
    it('Should return the state object based on the stateCode', () => {
      expect(findSpeciesState('ALI', states)).toEqual(states[0]);
    });
    
    it('Should return undefined if the stateCode is invalid or options not set', () => {
      expect(findSpeciesState('ALB', states)).not.toBeDefined();
      expect(findSpeciesState('ALB')).not.toBeDefined();
    });
    
  });
  
  describe('#findPresentation', () => {
    const presentations = [
      { value: 'CBF', label: 'Cod butterfly (escalado)' },
      { value: 'CLA', label: 'Claws' },
      { value: 'DWT', label: 'ICCAT value' },
      { value: 'FIL', label: 'Filleted' },
      { value: 'FIS', label: 'Filleted and skinned fillets' },
      { value: 'FSB', label: 'Filleted with skin and bones' },
      { value: 'WHL', label: 'Whole' },
      { value: 'WNG', label: 'Wings' }
    ];
    
    it('Should return the presentation object based on the presentationCode', () => {
      expect(findPresentation('CBF', presentations)).toEqual(presentations[0]);
    });
    
    it('Should return undefined if the presentationCode is invalid or options not set', () => {
      expect(findPresentation('CBA', presentations)).not.toBeDefined();
      expect(findPresentation('CBA')).not.toBeDefined();
    });
    
  });
  
  describe('#findCommodity', () => {
    const commodities = [
      { code: '03025110', label: 'Fresh or chilled cod "Gadus morhua"' },
      { code: '03025190', label: 'Fresh or chilled cod "Gadus ogac, Gadus macrocephalus"' },
      { code: '03025200', label: 'Fresh or chilled haddock "Melanogrammus aeglefinus"' }
    ];
    
    it('Should return the commodity object based on the commodityCode', () => {
      expect(findCommodity('03025110', commodities)).toEqual(commodities[0]);
    });
    
    it('Should return undefined if the commodityCode is invalid or options not set', () => {
      expect(findCommodity('030251102', commodities)).not.toBeDefined();
      expect(findCommodity('030251102')).not.toBeDefined();
    });
    
  });

});

