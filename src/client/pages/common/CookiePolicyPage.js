import React from 'react';
import { getAllUserAttributes } from '../../actions/userAttributes.actions';
import CookiePolicyWelshPage from './CookiePolicyWelshPage';
import CookiePolicyEnglishPage from './CookiePolicyEnglishPage';
import { connect } from 'react-redux';
import PageTemplateWrapper from '../../components/PageTemplateWrapper';

class CookiePolicyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'No',
      showSuccessBanner: false,
    };
  }

  handleSaveCookieSettingClick = () => {
    if (this.state.selected === 'Yes') {
      document.cookie =
        'analytics_cookies_accepted=true;expires=Thu, 31 Dec 2099 23:59:59 UTC;samesite;secure';
    } else {
      document.cookie =
        'analytics_cookies_accepted=false;expires=Thu, 31 Dec 2099 23:59:59 UTC;samesite;secure';
    }
    this.setState({ showSuccessBanner: true });
    window.scrollTo(0, 0);
  };

  handleChange = (option) => {
    this.setState({ selected: option });
  };

  componentDidMount() {
    const cookieValue =
      document.cookie &&
      document.cookie
        .split(';')
        .some((item) => item.includes('analytics_cookies_accepted'));
    cookieValue === true
      ? this.setState({ selected: 'Yes' })
      : this.setState({ selected: 'No' });
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
    const { userAttributes } = this.props;
    const userSelectedLanguage = this.getSelectedLanguage(userAttributes);

    return userSelectedLanguage === 'cy_UK' ? (
      <CookiePolicyWelshPage
        showSuccessBanner={this.state.showSuccessBanner}
        saveCookieSetting={this.handleSaveCookieSettingClick}
        selected={this.state.selected}
        onChange={this.handleChange}
      />
    ) : (
      <CookiePolicyEnglishPage
        showSuccessBanner={this.state.showSuccessBanner}
        saveCookieSetting={this.handleSaveCookieSettingClick}
        selected={this.state.selected}
        onChange={this.handleChange}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    userAttributes: state.userAttributes,
  };
}

function loadData(store) {
  return Promise.all([store.dispatch(getAllUserAttributes())]);
}

export const component = connect(mapStateToProps, {
  getAllUserAttributes,
})(CookiePolicyPage);

export default {
  loadData,
  component: PageTemplateWrapper(component),
};