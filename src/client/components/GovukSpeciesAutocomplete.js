import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GovukAutocomplete from './GovukAutocomplete';


class GovukSpeciesAutocomplete extends Component {
  constructor(props) {
    super(props);
  }

  getItems = fishes => {
    return fishes.map((fish) => {
      const label = fish.faoName ? `${fish.faoName} (${fish.faoCode})` : `Data error no FAO name for FAO code ${fish.faoCode}`;

      return {
        label,
        id: fish.faoCode
      };
    });
  }

  getItem = fish => {
    return fish.label;
  }

  render() {
    // TODO: Hint text isn't used in storageNotes/processingStatement so we are allowing it to be passed down but not sure if hint should be there 
    return <GovukAutocomplete
      label={'Species'}
      hintText={this.props.hintText}
      onChange={this.props.onChange}
      error={this.props.error}
      search={this.props.search}
      selectedItemName={this.props.speciesName}
      searchResults={this.getItems(this.props.searchResults || [])}
      getItem={this.getItem}
      clearSearchResults={this.props.clearSearchResults}
      controlName={this.props.controlName}
      controlId={this.props.controlId}
    />;
  }

}

GovukSpeciesAutocomplete.propTypes = {
  hintText: PropTypes.string,
  error: PropTypes.object,
  controlName: PropTypes.string.isRequired,
  controlId: PropTypes.string.isRequired,
  searchResults: PropTypes.array.isRequired,
  speciesName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  clearSearchResults: PropTypes.func.isRequired
};

export default GovukSpeciesAutocomplete;