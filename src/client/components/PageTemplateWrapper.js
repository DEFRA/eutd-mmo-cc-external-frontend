import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function PageTemplateWrapper (WrappedComponent) {
  return connect(mapStateToProps, {})(class PageTemplate extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  });
}

function mapStateToProps(state) {
  return {
    config: state.config
  };
}
