import React from 'react';
import { DateField, LabelText } from 'govuk-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

export default withTranslation() (class DateFieldWithPicker extends React.Component {
  state = {
    showDatePicker: false,
    selectedDate: parseDate(new Date()),
    dateObject: {
      day: '',
      month: '',
      year: '',
    },
  };

  componentDidUpdate(prevProps) {
    const { date, dateFormat } = this.props;
    if (prevProps.date !== date && date !== 'Invalid date') {
      this.setDateValue(date, dateFormat);
    }
  }

  setDateValue = (date, dateFormat) => {
    const formattedDate = moment(date, [dateFormat]);
    if (date) {
      this.setState({
        selectedDate: formattedDate,
        dateObject: {
          day: formattedDate.format('DD'),
          month: formattedDate.format('MM'),
          year: formattedDate.format('YYYY'),
        },
      });
    } else {
      this.setState({
        selectedDate: null,
        dateObject: {
          day: '',
          month: '',
          year: '',
        },
      });
    }
  };

  handleOnSelect = (date) => {
    const checkDate = moment(date);
    this.props.onDateChange({
      target: {
        name: this.props.name,
        value: moment(date, ['YYYY-M-D', 'YYYY-MM-DD'], true).format(
          this.props.dateFormat
        ),
      },
    });
    this.setState({
      showDatePicker: false,
      selectedDate: date,
      dateObject: {
        day: checkDate.format('DD'),
        month: checkDate.format('MM'),
        year: checkDate.format('YYYY'),
      },
    });
  };

  componentDidMount() {
    const { date, dateFormat } = this.props;
    if (date !== 'Invalid date') {
      this.setDateValue(date, dateFormat);
    }
    ['dayInputName', 'monthInputName', 'yearInputName'].forEach((name) => {
      const inputEl = Array.from(document.getElementsByName(name) || [])[0];

      if (inputEl) {
        inputEl.addEventListener('keydown', (event) => {
          (event.keyCode === 69 || event.keyCode === 190) &&
            event.preventDefault();
        });
      }
    });
  }

  onDateChange = (value) => {
    this.setState({
      dateObject: value,
    });
    const { dateFormat, name } = this.props;

    if (value && Object.values(value).every((_) => _ !== '')) {

      this.props.onDateChange({
        target: {
          name: name,
          value: getFormattedDate(value, dateFormat),
        },
      });
      this.setState({
        selectedDate: parseDate(
          value.day + '/' + value.month + '/' + value.year
        ),
      });
    } else {
      this.setState({ selectedDate: null });
      this.props.onDateChange({
        target: {
          name: name,
          value: 'Invalid date',
        },
      });
    }
  };

  render() {
    const { showDatePicker, selectedDate, dateObject } = this.state;
    const { errors, labelText, labelTextClass, id, t} = this.props;

    return (
      <>
        <div className="date-field-with-picker" id={id}>
          <div className="column-field-picker">
            <DateField
              className="date-field"
              hintText={t('psAddHealthCertificateDateFieldHint')}
              errorText={errors}
              inputNames={{
                day: 'dayInputName',
                month: 'monthInputName',
                year: 'yearInputName',
              }}
              input={{
                labels: {
                  day: t('commonDatePickerLabelDay'),
                  month: t('commonDatePickerLabelMonth'),
                  year: t('commonDatePickerLabelYear')
                },
                value: {
                  day: dateObject.day || '',
                  month: dateObject.month || '',
                  year: dateObject.year || '',
                },
                onChange: this.onDateChange,
              }}
            >
              <LabelText id="date-field-label-text" className={labelTextClass}>
                {labelText}
              </LabelText>
            </DateField>
            <div className={`date-picker ${errors ? 'error' : ''}`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ showDatePicker: true });
                }}
              >
                <img alt="calendar" src="/static/assets/images/calendar.png" />
              </button>
            </div>
          </div>
          {showDatePicker && (
            <DatePicker
              inline
              withPortal
              autoComplete="off"
              selected={selectedDate || ''}
              dateFormat={'DD/MM/YYYY'}
              onClickOutside={() => this.setState({ showDatePicker: false })}
              onSelect={this.handleOnSelect}
            />
          )}
        </div>
      </>
    );
  }
});

export function getFormattedDate(value, dateFormat) {

  if (dateFormat.startsWith('YYYY')) {
    const dateString = value.year + '-' + value.month + '-' + value.day;
    return moment(dateString, ['YYYY-M-D', 'YYYY-MM-DD'], true).format(
      dateFormat
    );
  } else {
    const dateStringReverse = value.day + '/' + value.month + '/' + value.year;

    return moment(dateStringReverse, ['D/M/YYYY', 'DD/MM/YYYY'], true).format(
      dateFormat
    );
  }
}

export function parseDate(date) {
  const b = date && moment(date, 'DD/MM/YYYY');
  if (!b || !b.isValid()) return null;
  return b;
}
