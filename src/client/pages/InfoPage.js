import React from 'react';
import { connect } from 'react-redux';
import { Main, H3 } from 'govuk-react';
import {getVersionInfo, getReferenceDataReaderVersionInfo} from '../actions';

class InfoPage extends React.Component {

  async componentDidMount() {
    await this.props.getVersionInfo();
    await this.props.getReferenceDataReaderVersionInfo();
  }

  render() {

    const {orchestrationVersionInfo={}, referenceDataReaderVersionInfo={}} = this.props.global;
    const {config} = this.props;

    return (
      <Main>
        <H3>mmo-ecc-fe</H3>
        <p id="mmo-ecc-fe">
          Version: {config.versionInfo.gitHash}
        </p>
        <hr/>
        <H3>mmo-ecc-orchestration</H3>
        <p id="mmo-ecc-orchestration">
          Version: {orchestrationVersionInfo.gitHash}
        </p>
        <hr/>
        <H3>mmo-ecc-reference-data-reader</H3>
        <p id="mmo-ecc-reference-data-reader">
          Version: {referenceDataReaderVersionInfo.gitHash}
        </p>
      </Main>
    );
  }
}

export const component = connect( (state) => ({config: state.config, global: state.global}), {getVersionInfo, getReferenceDataReaderVersionInfo} )(InfoPage);

export default {
  component
};
