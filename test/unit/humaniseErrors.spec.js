import hum from '../../src/helpers/humaniseErrors';
import { expect } from 'chai';

describe('It copes with the absurd vagaries of Joi errors', () => {

  it('parses one error', () => {
    const parsedEr = hum('child "presentation_22" fails because ["presentation_22" must be a string]');
    expect(parsedEr).to.exist;
    expect(parsedEr).to.be.an('array');
    expect(parsedEr).to.deep.equal([ { key: 'presentation_22', message: 'Please enter a correct presentation' } ]);
  });
  it('parses many errors', () => {
    const parsedEr = hum('child "presentation_22" fails because ["presentation_22" is not allowed to be empty].' +
        ' child "state_22" fails because ["state_22" is not allowed to be empty].' +
        ' child "weight_22" fails because ["weight_22" is not allowed to be empty].' +
        ' child "presentation_44" fails because ["presentation_44" is not allowed to be empty].' +
        ' child "state_44" fails because ["state_44" is not allowed to be empty].' +
        ' child "weight_44" fails because ["weight_44" is not allowed to be empty].' +
        ' child "commodity_code_44" fails because ["commodity_code_44" is not allowed to be empty]');
    expect(parsedEr).to.be.an('array');
    expect(parsedEr).to.deep.equal([ { key: 'presentation_22',
      message: 'Please enter a presentation' },
      { key: 'state_22', message: 'Please enter a state' },
      { key: 'weight_22', message: 'Please enter a weight' },
      { key: 'presentation_44',
        message: 'Please enter a presentation' },
      { key: 'state_44', message: 'Please enter a state' },
      { key: 'weight_44', message: 'Please enter a weight' },
      { key: 'commodity_code_44',
        message: 'Please enter a commodity code' } ]
    );
  });
  it('copes with error whose field has no key', () => {
    const parsedEr = hum('child "vessel" fails because ["vessel" is not allowed to be empty].' +
      ' child "species" fails because ["species" is not allowed to be empty]');
    expect(parsedEr).to.be.an('array');
    expect(parsedEr).to.deep.equal([
      { key: 'vessel', message: 'Please enter a vessel' },
      { key: 'species', message: 'Please enter a species' }]);
  });
});