import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18n from '../../../src/i18n';
import { getAllUserAttributes } from '../actions/userAttributes.actions';
import PageTemplateWrapper from '../components/PageTemplateWrapper';
import ImproveServiceWelshPage from './ImproveServiceWelshPage';
import ImproveServiceEnglishPage from './ImproveServiceEnglishPage';

function getService(backRoute) {
  if( backRoute.indexOf( '/create-processing-statement' ) !== -1) return {title: i18n.t('psCommonTitle'), href: '/create-processing-statement/processing-statements' };
  if( backRoute.indexOf( '/create-storage-document' ) !== -1) return {title: i18n.t('sdCommonTitle'), href: '/create-storage-document/storage-documents' };
  if( backRoute.indexOf( '/create-catch-certificate' ) !== -1) return {title: i18n.t('ccCommonTitle'), href: '/create-catch-certificate/catch-certificates' };
  return {title: '', href: '#'};
}
class ImproveServicePage extends Component {

  state = {
    backRoute: '#'
  };

  componentDidMount() {
    const backRoute = window.location.search.replace('?', '');
    this.setState( {backRoute});
    const service = getService(backRoute);
    const titleNode = document.getElementsByClassName('govuk-header__link--service-name');
    if( titleNode && titleNode[0] ) {
      titleNode[0].text = service.title.replace(' - GOV.UK', '');
      titleNode[0].href = service.href;
    }
  }

  getSelectedLanguage = (userAttributes) => {
    const userLanguageAttribute = userAttributes.find(
      (userAttribute) => userAttribute.name === 'language'
    );
    if (userLanguageAttribute) {
      return userLanguageAttribute.value;
    }
  };

  render() {
    const { backRoute } = this.state;
    const {feedbackUrl, userAttributes } = this.props
    const userSelectedLanguage = this.getSelectedLanguage(userAttributes);

    let title = getService(backRoute).title;
    if( !title ) title = 'GOV.UK';

    const listFont = {
      'fontSize': '19px'
    };

    return userSelectedLanguage === 'cy_UK' ? (
      <ImproveServiceWelshPage
        feedbackUrl={feedbackUrl}
        backRoute={backRoute}
        listFont={listFont}
        goBack={() => this.props.history.goBack()}
        title={title}
      />
    ) : (
      <ImproveServiceEnglishPage
        feedbackUrl={feedbackUrl}
        backRoute={backRoute}
        listFont={listFont}
        goBack={() => this.props.history.goBack()}
        title={title}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    feedbackUrl: state.config.feedbackUrl,
    userAttributes: state.userAttributes,
  };
}

function loadData(store) {
  return Promise.all([store.dispatch(getAllUserAttributes())]);
}

export const component = connect(mapStateToProps, {
  getAllUserAttributes,
})(ImproveServicePage);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};
