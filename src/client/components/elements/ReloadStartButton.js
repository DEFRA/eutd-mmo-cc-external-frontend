import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ReloadStartButton = (props) => {
  return(
    <Link
      to={props.to}
      className={`button button-start ${props.className || ''}`}
      id={props.id || props.name}
      target='_self'>
      {props.label}
    </Link>
  );
};

ReloadStartButton.propTypes = {
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string
};

export default ReloadStartButton;
