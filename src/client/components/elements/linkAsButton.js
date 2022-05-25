import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const LinkAsButton = (props) => {
  return(
    <Fragment>
      <Link
        to={props.to}
        className={'button continue-link'}
        id={props.id || props.name}>
          {props.label}
      </Link>
    </Fragment>
  );
};

LinkAsButton.propTypes = {
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string
};

export default LinkAsButton;
