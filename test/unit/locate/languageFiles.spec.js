import en_UK from '../../../src/locales/uk/en';
import cy_UK from '../../../src/locales/uk/cy';

describe('language files', () => {

  const enKeys = Object.keys(en_UK).sort();
  const cyKeys = Object.keys(cy_UK).sort();

  it('should be no missing keys in the Welsh translation file the same properties', () => {
    const result = enKeys.filter(key => !cyKeys.includes(key));
    expect(result).toEqual([])
  });

  it('should be no missing keys in the English translation file the same properties', () => {
    const result = cyKeys.filter(key => !enKeys.includes(key));
    expect(result).toEqual([])
  });

  it('should be empty key in the english file', () => {
    const result = enKeys.filter(key => en_UK[key] == '' || en_UK[key] == undefined)
    expect(result).toEqual([])
  });

  it('should be empty key in the english file', () => {
    const result = cyKeys.filter(key => cy_UK[key] == '' || cy_UK[key] == undefined)
    expect(result).toEqual([])
  });

})