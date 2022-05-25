import { mount } from 'enzyme';
import * as React from 'react';
import SpeciesDetails from '../../../../src/client/components/elements/SpeciesDetails';


describe('SpeciesDetails', () => {

  let wrapper;
  const props = {
    exemptFrom: 'exemptFrom'
  };

  beforeEach(() => {
    wrapper = mount(<SpeciesDetails {...props}/>);
  });

  it('should render summary', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle click summary event', () => {
    expect(wrapper.state('isOpen')).toEqual(false);
    wrapper.find('summary').simulate('click');
    expect(wrapper.state('isOpen')).toEqual(true);
  });

  it('should have correct external link for species exemptions', () => {
    const speciesExemptLink = wrapper.find('a[href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2011:057:0010:0018:EN:PDF"]');
    expect(speciesExemptLink.text()).toBe('Species exempt from exemptFrom (europa.eu) (opens in new tab)');
    expect(speciesExemptLink.exists()).toBeTruthy();
    expect(speciesExemptLink.prop('rel')).toBe('noopener noreferrer');
    expect(speciesExemptLink.prop('target')).toBe('_blank');
    expect(wrapper.find('a[href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2011:057:0010:0018:EN:PDF"] span').prop('className')).toBe('govuk-visually-hidden');
    expect(wrapper.find('a[href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2011:057:0010:0018:EN:PDF"] span').text()).toBe('(opens in new tab)');
  });
});

describe('#SpeciesDetails with translation', () => {

  let wrapper;
  const props = {
    exemptFrom: 'Processing Statements'
  };

  beforeEach(() => {
    wrapper = mount(<SpeciesDetails {...props}/>);
  });

  it('should render summary', () => {
    expect(wrapper).toBeDefined();
  });

  it('should have correct external link for species exemptions', () => {
    const speciesExemptLink = wrapper.find('a[href="https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2011:057:0010:0018:EN:PDF"]');
    console.log('speciesExemptLink', speciesExemptLink);
    expect(speciesExemptLink.exists()).toBeTruthy();
  });
});