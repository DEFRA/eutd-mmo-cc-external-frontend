import React from 'react';
import { HintText, Label } from 'govuk-react';

export const WeightInput = ({ error, hint, value, label, onChange, id = 'weight', unit = 'kg' }) => {
  function renderError() {
    if (error) {
      return <div className="error-message">{error}</div>;
    }
  }

  return (
    <div className={'govuk-form-group' + (error ? ' govuk-form-group-error' : '')} name='exportWeight'>
      <Label className="govuk-label-weight-input" htmlFor="weight">{label}</Label>
      {hint && <HintText>{hint}</HintText>}
      {renderError()}
      <div className="govuk-input__wrapper">
        <input
          className={
            'form-control' + (error ? ' form-control-error' : '') + ' weight-input'
          }
          id={id}
          name="weight"
          type="text"
          spellCheck="false"
          style={{ marginRight: 0 }}
          value={value}
          onChange={onChange}
        />
        <div className="govuk-input__suffix" aria-hidden="true">
          {unit}
        </div>
      </div>
    </div>
  );
};
