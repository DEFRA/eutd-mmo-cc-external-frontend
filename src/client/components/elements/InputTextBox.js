import React from 'react';
import PropTypes from 'prop-types';

const InputTextBox = (props) => {

  function renderError() {
    if (props.error) {
      return (<div className="error-message">{props.error}</div> );
    }
  }

  // TODO actually display the label :D
  return(
    <div id={props.name + '-group'} className="form-group">
      {renderError()}
      <input type={props.type}
             name={props.name}
             id={props.id || props.name} //TODO determine if removing props.name here will break anything
             className={'form-control' + (props.error ? ' form-control-error' : '')}
             aria-required="true"
             value={props.value}
             defaultValue={props.defaultValue}
             maxLength={props.maxLength}
             onChange={props.onChange}
             min={props.min}
             max={props.max}
      />
    </div>
  );
};

InputTextBox.defaultProps = {
  type: 'text'
};

InputTextBox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  defaultValue: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number
};

export default InputTextBox;