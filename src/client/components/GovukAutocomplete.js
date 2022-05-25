import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import Label from '@govuk-react/label';
import HintText from '@govuk-react/hint-text';
import ErrorText from '@govuk-react/error-text';
import { FONT_SIZE, LINE_HEIGHT } from '@govuk-react/constants';
import { ERROR_COLOUR } from 'govuk-colours';
import { MEDIA_QUERIES } from '@govuk-react/constants';
import Autocomplete from 'react-autocomplete';

const WIDTH = '100%';

// Using tagged template literals means you can copy raw CSS instead of camel casing
// TODO: Camel case these attributes and pass it to css function as object
const autoCompleteFormControlStyle = css`
  box-sizing: border-box;
  font-family: "nta",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  text-transform: none;
  font-size: ${FONT_SIZE.SIZE_16};
  line-height: ${LINE_HEIGHT.SIZE_16};
  width: ${WIDTH};
  padding: 5px 4px 4px;
  border: 2px solid #0b0c0c;
  margin-bottom: 0;

  @media only screen and (min-width: 641px) {
    margin-bottom: 0;
    font-size: ${FONT_SIZE.SIZE_19};
    line-height: ${LINE_HEIGHT.SIZE_19};
  }
`;

const autoCompleteFormMenuStyle = css({
  borderRadius: '3px',
  zIndex: 100,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 1.0)',
  fontSize: '100%',
  cursor: 'pointer',
  overflow: 'auto',
  maxHeight: '400px',
  height: 'auto',
  width: `${WIDTH}`,
  position: 'absolute',
  left: '0',
  top: '35px',
  display: 'flex',
  flexDirection: 'column',
  flex: '0 1 0',
  [MEDIA_QUERIES.LARGESCREEN]: {
    top: '40px'
  }
});

class GovukAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.timeout = null;
  }

  debouncedSearch = (searchItem, ...rest) => {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      // how many characters to wait for before firing a search could possibly be parameterised
      if (searchItem.length >= 2) {
        this.props.search(searchItem, ...rest);
      }
    }, 350);
  }

  renderAutocompleteItem = (item, isHighlighted) => {
    return (
      <li
        key={item.label}
        id={item.domId}
        style={{ background: isHighlighted ? 'lightgray' : 'white', padding: '2px 4px' }}
      >
        {item.label}
      </li>
    );
  }

  // TODO: This probably should live as a utility function?
  getError() {
    const propName = `${this.props.controlName}Error`;
    return this.props.error && Object.prototype.hasOwnProperty.call(this.props.error, propName) ? this.props.translate(this.props.error[propName]) : null;
  }

  renderError = error => {
    if (error) {
      return <ErrorText>{error}</ErrorText>;
    }
  }

  handleOnSelect = (val, item) => {
    this.props.onChange(val, item);
    // TODO: After selection remove result from store - check if this behaviour is desirable
    this.props.clearSearchResults();
  }

  renderItemsMenu = items => {
    return <ul id="vessel-list" className={autoCompleteFormMenuStyle}>{items}</ul>;
  }

  onInputChange = e => {
    const searchItem = e.target.value;
    // We're adding only partial names as they're typed here - onselect is when code is added
    this.props.onChange(searchItem, null);
    this.debouncedSearch(searchItem);
  }

  render() {
    const error = this.getError();

    return (
      <React.Fragment>
        <Label htmlFor={this.props.controlId}>
          {this.props.label}
          { this.props.hintText && <HintText>{this.props.hintText}</HintText>}
          {!this.props.hideErrorMessage && this.renderError(error)}
          <div style={{position: 'relative'}}>
            <Autocomplete
              getItemValue={this.props.getItem}
              items={this.props.searchResults}
              inputProps={{
                className: autoCompleteFormControlStyle,
                name: this.props.controlName,
                id: this.props.controlId,
                style: { border: error ? `4px solid ${ERROR_COLOUR}` : undefined }
              }}
              value={this.props.selectedItemName}
              renderItem={this.renderAutocompleteItem}
              wrapperStyle={
                {border: '1em'}
              }
              onChange={this.onInputChange}
              renderMenu={this.renderItemsMenu}
              onSelect={this.handleOnSelect}
            />
          </div>
        </Label>
      </React.Fragment>
    );
  }
}

GovukAutocomplete.propTypes = {
  label: PropTypes.string,
  hintText: PropTypes.string,
  hideErrorMessage: PropTypes.bool,
  error: PropTypes.object,
  controlName: PropTypes.string.isRequired,
  controlId: PropTypes.string.isRequired,
  searchResults: PropTypes.array.isRequired,
  selectedItemName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func.isRequired
};

export default GovukAutocomplete;
