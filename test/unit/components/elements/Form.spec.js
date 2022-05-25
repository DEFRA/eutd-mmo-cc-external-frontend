import { shallow } from 'enzyme';
import * as React from 'react';
import Form from '../../../../src/client/components/elements/Form';

const getWrapper = (props = {}) => {
  return shallow(
    <Form {...props}>
      Foobar
    </Form>
  );
};

const queryParams = [
  'c=/currentUrl/',
  'n=/nextUrl/',
  'saveToRedisIfErrors=true',
  'setOnValidationSuccess=true',
  'documentNumber=doc123'
];

describe('Form', () => {

  it('Should return a form element with a basic action url', () => {
    const wrapper = getWrapper({ action: 'foo/' });
    expect(wrapper.matchesElement(
      <form action='foo/'>Foobar</form>
    )).toBe(true);
  });

  it('Should return a form element with a full action url', () => {
    const wrapper = getWrapper({
      action: 'foo/',
      currentUrl: '/currentUrl/',
      nextUrl: '/nextUrl/',
      saveToRedisIfErrors: true,
      setOnValidationSuccess: true,
      documentNumber: 'doc123'
    });

    let expectAction = 'foo/';
    expectAction += `?${queryParams.join('&')}`;

    expect(wrapper.matchesElement(
      <form action={expectAction}>Foobar</form>
    )).toBe(true);
  });

});