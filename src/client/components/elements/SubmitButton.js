import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

//TODO: can probably be merged with the other button
const submitButton = (props) => {
  return(
    <Fragment>
        <button
          type="submit"
          style={props.style}
          value={props.value}
          className={`button ${props.className || ''}`}
          name={props.name}
          onClick={props.onClick}
          formAction={props.formAction}
          disabled={props.disabled}
          id={props.id}>
          {props.label}
        </button>
    </Fragment>
  );
};

submitButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.element.isRequired
  ]),
  value: PropTypes.string,
  formAction: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string
};

export default submitButton;
