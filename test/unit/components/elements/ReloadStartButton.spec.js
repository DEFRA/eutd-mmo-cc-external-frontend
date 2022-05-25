import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ReloadStartButton from '../../../../src/client/components/elements/ReloadStartButton';


describe('ReloadStartButton', () => {
  it('should load the component without any errors with default target attribute as _self', () => {
    const component = mount(
      <MemoryRouter>
        <ReloadStartButton
          to={'/somewhere'}
          name={ 'some'}
          label={'Go'}
          className={'some'}
        />
      </MemoryRouter>
    );

    expect(component.find("a[target='_self']").exists()).toBeTruthy();
  });

  it('should load the component without any errors with default target attribute as _self with no class name', () => {
    const component = mount(
      <MemoryRouter>
        <ReloadStartButton
          to={'/somewhere'}
          name={ 'some'}
          label={'Go'}
        />
      </MemoryRouter>
    );

    expect(component.find('Link').prop('className')).toBe('button button-start ');
  });
});