import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  ChangeLinkTag,
  SummaryTable,
  SummaryRow,
  SummaryRowValue,
  SummaryCellKey,
  SummaryCellValue,
  SummaryCellLink
} from '../../../src/client/components/Summary';

const getWrapper = (Component, props) => {
  return mount(<Component {...props}/>);
};

const itShouldRenderAndPassNoSeparatorProp = (Component, value = true) => 
it('Should pass noSeperator prop to Styled', () => {
  const wrapper = getWrapper(Component, { noSeperator: value });
  expect(wrapper.prop('noSeperator')).toBeDefined();
  expect(wrapper.prop('noSeperator')).toBe(value);
});

describe('Summary Components', () => {
  
  describe('#ChangeLinkTag', () => {
    
    it('Should render the ChangeLinkTag component', () => {
      const wrapper = shallow(<ChangeLinkTag />);
      expect(wrapper).toBeDefined();
      expect(wrapper.find('Anchor').exists()).toBe(true);
    });
    
  });
  
  itShouldRenderAndPassNoSeparatorProp(SummaryTable, false);
  itShouldRenderAndPassNoSeparatorProp(SummaryRow, false);
  itShouldRenderAndPassNoSeparatorProp(SummaryRowValue, false);
  itShouldRenderAndPassNoSeparatorProp(SummaryCellKey, false);
  itShouldRenderAndPassNoSeparatorProp(SummaryCellValue, false);
  itShouldRenderAndPassNoSeparatorProp(SummaryCellLink, false);
  
  itShouldRenderAndPassNoSeparatorProp(SummaryTable);
  itShouldRenderAndPassNoSeparatorProp(SummaryRow);
  itShouldRenderAndPassNoSeparatorProp(SummaryRowValue);
  itShouldRenderAndPassNoSeparatorProp(SummaryCellKey);
  itShouldRenderAndPassNoSeparatorProp(SummaryCellValue);
  itShouldRenderAndPassNoSeparatorProp(SummaryCellLink);

});