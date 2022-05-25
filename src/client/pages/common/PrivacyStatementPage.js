import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import { saveUserAttribute, getAllUserAttributes } from '../../actions/userAttributes.actions';
import PrivacyStatementEnglish from './PrivacyStatementEnglish';
import PrivacyStatementWelsh from './PrivacyStatementWelsh';

const PRIVACY_STATEMENT_ATTRIBUTE_NAME = 'privacy_statement';

class PrivacyStatementPage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    // If it's submitted then consider it they agreed
    const payload = {
      key: PRIVACY_STATEMENT_ATTRIBUTE_NAME,
      value: true
    };
    await this.props.saveUserAttribute(payload);
    this.props.route.alwaysShowPrivacyPage &&
      this.props.history.push('/');
  }

  handleBackLinkClick = (e) => {
    e.preventDefault();

    this.props.history.goBack();
  };

  async componentDidMount() {
    await this.props.getAllUserAttributes();
  }

  getSelectedLanguage = (userAttributes) => {
    const userLanguageAttribute = userAttributes.find(
      (userAttribute) => userAttribute.name === 'language'
    );
    if (userLanguageAttribute) {
      return userLanguageAttribute.value;
    }
  };

  showPrivacyNotice = () => {
    const { nextUri } = this.props.route;
    const { userAttributes } = this.props;
    const selectedLanguage = this.getSelectedLanguage(userAttributes);
    const privacyAcceptedAlready = this.privacyAcceptedAlready();

    return selectedLanguage === 'cy_UK' ? (
      <PrivacyStatementWelsh
        onSubmit={this.onSubmit}
        privacyAcceptedAlready={privacyAcceptedAlready}
        nextUri={nextUri}
        onBackLinkClick={this.handleBackLinkClick}
      />
     ) : (
      <PrivacyStatementEnglish
        onSubmit={this.onSubmit}
        privacyAcceptedAlready={privacyAcceptedAlready}
        nextUri={nextUri}
        onBackLinkClick={this.handleBackLinkClick}
      />
    );
  };

  redirectToDashboard = () => {
    const { nextUri } = this.props.route;
    return <Redirect to={nextUri} />;
  };

  privacyAcceptedAlready = () => {
    let acceptedAlready = false;
    const { userAttributes } = this.props;
    for (let attribute of userAttributes) {
      if (attribute.name === PRIVACY_STATEMENT_ATTRIBUTE_NAME) {
        acceptedAlready = true;
        break;
      }
    }
    return acceptedAlready;
  };

  render = () => {
    const privacyAcceptedAlready = this.privacyAcceptedAlready();
    const { alwaysShowPrivacyPage } = this.props.route;
    if (alwaysShowPrivacyPage) {
      return this.showPrivacyNotice();
    } else {
      if (privacyAcceptedAlready) {
        return this.redirectToDashboard();
      } else {
        return this.showPrivacyNotice();
      }
    }
  };
}

const mapStateToProps = state => {
  return {
    userAttributes: state.userAttributes
  };
};

const loadData = store => {
  return store.dispatch(getAllUserAttributes());
};

export default {
  component: withRouter(connect(mapStateToProps, {
    saveUserAttribute,
    getAllUserAttributes
  })(PrivacyStatementPage)),
  loadData
};