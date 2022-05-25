import React from 'react';
import AccessibleAutoComplete from './AccessibleAutocomplete';
import Label from '@govuk-react/label';
import ErrorText from '@govuk-react/error-text';
import { toLower } from 'lodash';
import { t } from 'i18next';

class FavouritesAutocomplete extends React.Component {

  quickSearch = (query) => {
    const queryStr = query.toLowerCase();
    let data = this.props.allFavourites.filter( d => this.favouritesName(d).toLowerCase().indexOf(queryStr) !== -1)
      .map( d => {
        const commonRank = d.commonRank || 0;
        let rank;
        if( d.species.toLowerCase().indexOf( queryStr ) !== -1 ) rank = 1;
        else if( d.stateLabel.toLowerCase().indexOf( queryStr ) !== -1 ) rank = 10 + commonRank;
        else if( d.presentationLabel.toLowerCase().indexOf( queryStr ) !== -1 ) rank = 20 + commonRank;
        else if( d.commodity_code.indexOf( queryStr ) !== -1 ) rank = 30 + commonRank;
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

      if (a.species < b.species) {
        return -1;
      }

      if (a.species > b.species) {
        return 1;
      }

      return 0;
    });

    return data.map( (d) => this.favouritesName(d));
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

      const fish = this.props.allFavourites.find( f => this.favouritesName(f) === val);

      this.props.onChange && this.props.onChange(fish);
    }
  };

  getError() {
    let propName = `${this.props.id}Error`;

    const error = this.props.error && Object.prototype.hasOwnProperty.call(this.props.error, propName) ? this.props.error[propName] : null;

    return (error === 'error.favourite.any.invalid') ? <> {t('ccWhatExportingFromNolongerValidError')}&nbsp;
    <span className="govuk-link-in-error-summary">
      <a href="/manage-favourites" aria-label={t('ccWhatExportingFromAboutYourFavorites')}>
      {toLower(t('ccRenderFavourites'))}
      </a>
    </span> </> : t(error);
  }

  favouritesName(s) {
    return `${s.species} ${s.stateLabel}, ${s.presentationLabel}, ${s.commodity_code}`;
  }

  renderError = error => {
    if (error) {
      return <ErrorText>{error}</ErrorText>;
    }
    return null;
  }

  shouldComponentUpdate() {
    return this.props.unauthorised !== true;
  }

  render() {
    const {label, defaultValue, allFavourites, defaultSelectMessage, unauthorised, htmlFor} = this.props;

    let nojsValues = allFavourites.filter( d => d.faoName).map( (d) => this.favouritesName(d));
    nojsValues.sort();

    const error = this.getError();
    return (
      <Label htmlFor={htmlFor} error={error} id={`label-${this.props.id}`} key={`${this.props.id}-${defaultValue}`}>
        <div id='favouritesLabel'>{label}</div>
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
          id={this.props.id}
          unauthorised={unauthorised}
        />
      </Label>
    );
  }
}

export default FavouritesAutocomplete;