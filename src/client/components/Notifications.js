import React from 'react';
import PropTypes from 'prop-types';
import InsetText from '@govuk-react/inset-text';


const Notifications = ({ title, message}) =>{

  return (
    <InsetText style={{ border: 0 }} className='notification-message'>
      <h2>{title}</h2>
      <p>{message}</p>
    </InsetText>
  );

};

Notifications.propTypes = {
  title : PropTypes.string,
  message : PropTypes.string
};

export default Notifications;
