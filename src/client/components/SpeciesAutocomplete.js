import {connect} from 'react-redux';
import React from 'react';
import AccessibleAutoComplete from './AccessibleAutocomplete';
import Label from '@govuk-react/label';
import HintText from '@govuk-react/hint-text';
import ErrorText from '@govuk-react/error-text';
import { t } from 'i18next';
class SpeciesAutocomplete extends React.Component {

  quickSearch = (query) => {
    const queryStr = query.toLowerCase();
    let data = this.props.allFish.filter( d => d.faoName)
      .filter( d => this.speciesName(d).toLowerCase().indexOf(queryStr) !== -1)
      .map( d => {
        const commonRank = d.commonRank || 0;
        let rank;
        if( d.faoCode.toLowerCase().indexOf( queryStr ) !== -1 ) rank = 1;
        else if( d.faoName.toLowerCase().indexOf( queryStr ) !== -1 ) rank = 10 + commonRank;
        else if( d.scientificName.toLowerCase().indexOf( queryStr ) !== -1 ) rank = 20 + commonRank;
        else if( (d.commonNames || []).join('').toLowerCase().indexOf( queryStr ) !== -1 ) rank = 20 + commonRank;
        d.rank = rank || 100;
        return d;
      });

    data.sort((a,b) => {

      if (a.rank < b.rank) {
        return -1;
      }

      if (a.rank > b.rank) {
        return 1;
      }

      if (a.faoCode < b.faoCode) {
        return -1;
      }

      if (a.faoCode > b.faoCode) {
        return 1;
      }

      return 0;
    });

    return data.map( (d) => this.speciesName(d));
  };

  onConfirm = (val) => {
    if (!val) {
      const el = document.getElementsByName(this.props.name).item(0);
      if (el) {
        val = el.value;
        if (val === '') {
          this.props.onChange('');
        }
      }
    } else {
      const fish = this.props.allFish.find( f => this.speciesName(f) === val);
      this.props.onChange && this.props.onChange(fish ? val : '', fish);
    }
  };

  checkEntries(name) {
    if ((name.includes('.product')) || (name.includes('.species'))) {
      return true;
    }
  }
  getError() {
    let propName = `${this.props.name}Error`;

    // There is a case where the name of the element can't be used
    // so we use an errorName prop for this edge case.
    if (this.props.errorName) {
      propName = this.props.errorName;
    }

    return this.props.error && Object.prototype.hasOwnProperty.call(this.props.error, propName) ? t(this.props.error[propName]) : null;
  }

  speciesName(s) {
    return `${s.faoName} (${s.faoCode})`;
  }

  renderError = error => {
    if (error) {
      return <ErrorText>{t(error)}</ErrorText>;
    }
    return null;
  }

  shouldComponentUpdate() {
    return this.props.unauthorised !== true;
  }

  render() {
    const {label, defaultValue, allFish, defaultSelectMessage, unauthorised, htmlFor} = this.props;

    let nojsValues = allFish.filter( d => d.faoName).map( (d) => this.speciesName(d));
    nojsValues.sort();
    const error = this.getError();
    return (
      <Label htmlFor={htmlFor} error={error} id={`label-${this.props.id}`} name={this.props.id} key={`${this.props.id}-${defaultValue}`}>
        <div id='speciesLabel'>{label}</div>
        { this.props.hintText && <HintText>{this.props.hintText}</HintText>}
        {this.renderError(error)}
        <AccessibleAutoComplete
          defaultSelectMessage={defaultSelectMessage}
          defaultValue={defaultValue}
          nojsValues={nojsValues}
          showAllValues={this.props.showAllValues || false}
          displayMenu="overlay"
          search={this.quickSearch}
          onConfirm={this.onConfirm}
          name={this.props.name}
          id={this.props.name}
          unauthorised={unauthorised}
        />
      </Label>
    );
  }
}

export default connect((state) => ({
  allFish: state.global.allFish
}) , {})(SpeciesAutocomplete);