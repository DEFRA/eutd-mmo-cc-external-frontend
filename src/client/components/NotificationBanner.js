import React from 'react';
import PropTypes from 'prop-types';

const NotificationBanner = ({ header, messages, className }) => {
  
  return (
    <div style={{ border: 0  }}  className={`notification-banner ${className ? className : ''}`.trim() } role="alert" >
      <div className='notification-banner__header'>
        <h2 className='notification-banner__title'>{header}</h2>
      </div>
      <div className='notification-banner__content'>
        {messages.map((message, index) => (<p key={index} className='notification-banner__heading'>{message}</p>))}
      </div>
    </div>
  );
};

NotificationBanner.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
};

export default NotificationBanner;
