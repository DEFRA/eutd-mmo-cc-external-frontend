import { mount } from 'enzyme';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LinkAsButton from '../../../../src/client/components/elements/linkAsButton';

describe('Link Button', () => {
  it('should load with states passed down via props', () => {
    const props = {
      to: '/',
      name: 'home',
      label: 'Home',
      className: 'some-class',
      id: 'home',
    };

    const comp = mount(
      <MemoryRouter>
        <LinkAsButton {...props} />
      </MemoryRouter>
    );

    expect(comp).toBeDefined();
  });

  it('should load with states passed down via props with no id', () => {
    const props = {
      to: '/',
      name: 'home',
      label: 'Home',
      className: 'some-class',
    };

    const comp = mount(
      <MemoryRouter>
        <LinkAsButton {...props} />
      </MemoryRouter>
    );

    expect(comp.find('Link').prop('id')).toBe('home');
  });
});
