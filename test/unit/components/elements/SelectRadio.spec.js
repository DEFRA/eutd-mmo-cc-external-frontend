import {  mount } from 'enzyme';
import * as React from 'react';
import * as emotion from 'emotion';
import { createSerializer } from 'jest-emotion';
import { render } from '@testing-library/react';

import SelectRadio from '../../../../src/client/components/elements/SelectRadio';

expect.addSnapshotSerializer(createSerializer(emotion));

describe('SelectRadio', () => {
  it('should load successfully', () => {
    const comp = mount(
      <SelectRadio name={'sample'} value={'1'}>Boo</SelectRadio>
    );
    expect(comp).toBeDefined();
  });
});

describe('When loading radio on server side rendering', () => {
  it('should override + selectors to select sibling with ~ css selector', () => {
    const { container } = render(<SelectRadio name={'sample'} value={'1'} checked readonly>Boo</SelectRadio>);
    expect(container).toMatchSnapshot();
  });
});