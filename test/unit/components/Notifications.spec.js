import React from 'react';
import { shallow } from 'enzyme';
import Notifications from '../../../src/client/components/Notifications';

describe('Notifications', () => {
  const props = {
    title: 'This is a title',
    message: 'This is a message'
  };
  const wrapper = shallow(<Notifications  {...props} />);

it('Should render the Notification component', () => {
    expect(wrapper).toBeDefined();

  });
it('Should render the Notification component with the correct className', () => {
    expect(wrapper.exists('.notification-message')).toBe(true);
});


});
