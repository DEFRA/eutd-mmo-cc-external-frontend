import React from 'react';
import { shallow } from 'enzyme';
import NotificationBanner from '../../../src/client/components/NotificationBanner';

describe('Notification Banner', () => {
  const props = {
    header: 'This is a title',
    messages: ['This is a message'],
    className:''
  };
  const wrapper = shallow(<NotificationBanner  {...props} />);

  it('Should render the Notification Banner component', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should render the Notification Banner component with the correct classNames', () => {

    expect(wrapper.exists('.notification-banner')).toBe(true);
    expect(wrapper.exists('.notification-banner.upload-csv-notification')).toBe(false);
    expect(wrapper.exists('.notification-banner__content')).toBe(true);
    expect(wrapper.exists('p.notification-banner__heading')).toBe(true);
    expect(wrapper.exists('h2.notification-banner__title')).toBe(true);
  });

  it('should render notification-banner upload-csv-notification className when classname prop is not empty', () => {
    const props1 = {
      header: 'This is a title',
      messages: ['This is a message'],
      className: 'upload-csv-notification'
    };
    const wrapper1 = shallow(<NotificationBanner  {...props1} />);
    expect(wrapper1).toBeDefined();
    expect(wrapper1.find('.upload-csv-notification').exists()).toBeTruthy();
    expect(wrapper1.exists('.notification-banner.upload-csv-notification')).toBe(true);
  });

  it('Should render the Notification Banner component with the correct props', () => {

    expect(wrapper.find('h2.notification-banner__title').text()).toEqual('This is a title');
    expect(wrapper.find('p.notification-banner__heading').text()).toEqual('This is a message');
  });
});
