import DatePicker from 'react-datepicker';
import React from 'react';
import moment from 'moment';
import {InputField} from 'govuk-react';


export class GovukDatePicker extends React.Component{

  state = {
    showDatePicker: false
  };

  render(){
    const {showDatePicker} = this.state;
    const {id, htmlFor, onChange, hint, input, meta} = this.props;

    return (
      <div className="form-group">
          <span></span>
          <div>
            <InputField htmlFor={htmlFor} meta={meta} id={id} hint={hint} onChange={onChange} input={input}>{this.props.children}</InputField>
            <div className="date-picker2">
              <img className={`${meta.error ? 'error' : ''}`} alt="calendar" onClick={(e) => {
                e.preventDefault();
                this.setState({showDatePicker: true});
              }} src="/static/assets/images/calendar.png"/>
            </div>
            { showDatePicker && <DatePicker
              inline
              withPortal
              autoComplete="off"
              // className={`date-picker form-control ${meta.error ? 'form-control-error' : ''}`}
              selected={parseDate(input.value)}
              dateFormat={'DD/MM/YYYY'}
              onClickOutside={() => this.setState({showDatePicker: false}) }
              onChange={e => {
                const event = {
                  target: {name: input.name, value: e ? e.format('DD/MM/YYYY') : e}
                };
                input.onChange(event);
                this.setState({showDatePicker: false});
              }}
            /> }
          </div>
      </div>
    );
  }
}

export function parseDate(date) {
  const b = date && moment(date, 'DD/MM/YYYY');
  if( !b || !b.isValid()) return null;
  return b;
}


