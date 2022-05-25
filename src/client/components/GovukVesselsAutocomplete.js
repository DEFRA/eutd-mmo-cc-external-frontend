import PropTypes from 'prop-types';
import GovukAutocomplete from './GovukAutocomplete';

class GovukVesselsAutocomplete extends GovukAutocomplete {
  constructor(props) {
    super(props);
  }

  onInputChange = e => {
    const searchItem = e.target.value;
    this.props.onChange(searchItem, null);
    this.debouncedSearch(searchItem, this.props.dateLanded);
  }

}

GovukVesselsAutocomplete.propTypes.dateLanded = PropTypes.object;

export default GovukVesselsAutocomplete;
