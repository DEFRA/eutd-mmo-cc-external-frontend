import { renderComponent , expect, re } from '../../test_helper';
import InputTextBox from '../../../../src/client/components/elements/InputTextBox';

describe('InputTextBox', () => {
  let component;

  beforeEach(() => {
    component = renderComponent(InputTextBox);
  });

  it('renders something', () => {
    expect(component).to.exist;
    expect($(component.html())).to.have.class('form-control');
  });
});
