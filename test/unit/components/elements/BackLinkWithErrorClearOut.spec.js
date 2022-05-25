import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BackLinkWithErrorClearOut from '../../../../src/client/components/elements/BackLinkWithErrorClearOut';

const clearErrorsMock = jest.fn();

const getWrapper = (history = []) => {
  return mount(
    <MemoryRouter>
      <BackLinkWithErrorClearOut
        backUri='/test'
        history={history}
        clearErrors={clearErrorsMock}
        labeltext='Back'
      />
    </MemoryRouter>
  );
};

describe('BackLinkWithErrorClearOut', () => {

  it('should render correctly with expected href', () => {
    expect(getWrapper().find('a[href=\'/test\']').exists()).toBeTruthy();
  });
  
  it('should render correctly with expected Back text', () => {
    expect(getWrapper().find('a[href=\'/test\']').text()).toBe('Back');
  });
  it('Should call clearErrors and add to history when clicked', () => {
    const history = [];
    const wrapper = getWrapper(history);
    const link = wrapper.find('BackLink');
    link.simulate('click');
    expect(clearErrorsMock).toHaveBeenCalled();
    expect(history.length).toBe(1);
    expect(history).toEqual(['/test']);
  });

});