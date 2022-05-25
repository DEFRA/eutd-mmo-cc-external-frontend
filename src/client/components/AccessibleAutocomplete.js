import React from 'react';
import { t } from 'i18next';

let Autocomplete = {};

if (typeof window !== 'undefined') {
  Autocomplete = require( 'accessible-autocomplete/react' ).default;
}

export default class AccessibleAutoComplete extends React.Component {

  state = {
    showJsAutoComplete: false
  };

  shouldComponentUpdate() {
    return this.props.unauthorised !== true;
  }

  componentDidMount() {
    this.setState({showJsAutoComplete: true});
  }

  suggest = async (query, populateResults) => {
    const results = await this.props.search(query);
    populateResults(results);
  };


  renderNojs() {
    const {nojsValues=[], id, name, defaultValue, defaultSelectMessage} = this.props;

    return (
      <select defaultValue={defaultValue} className="autocomplete__input autocomplete__input--default" id={id} name={name}>
        <option key="-1" value="">{defaultSelectMessage}</option>
        {
          nojsValues.map( (v, index) => <option key={index}  value={v}>{v}</option>)
        }
      </select>
    );
  }

  render() {
    if( !this.state.showJsAutoComplete) return this.renderNojs();
    return(
      <Autocomplete source={this.suggest} {...this.props} tNoResults={ () => t('commonNoResultsFound')}/>
    );
  }
}
