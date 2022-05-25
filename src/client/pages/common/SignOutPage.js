import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Main, Header, Button } from 'govuk-react';
import PageTitle from '../../components/PageTitle';

class SignOutPage extends Component {
  constructor(props) {
    super(props);
    this.state = { warningTime: this.props.warningTimeout };
  }

  componentDidMount() {
    this.logoutTimeout = setTimeout(this.logout, parseInt(this.state.warningTime));
    this.timer = setInterval(this.countDown, 1000);
  }
  countDown = () => {
    this.setState(previousState => {
      return { warningTime: previousState.warningTime - 1000 };
    });
  };

  logout = () => {
    window.location.href = '/logout?backToPath=/server-logout';
    clearTimeout(this.logoutTimeout);
    clearInterval(this.timer);
  };

  render() {
    const url = this.props.loginUrl;
    const { warningTime } = this.state;
    const warningTimeToDisplay = warningTime > 60000 ? `${Math.ceil(warningTime / 60000)} minutes` : `${warningTime / 1000} seconds`;
    return (
      <Main>
        <PageTitle title="You will be signed out - GOV.UK" />
        <Header level={1}>Your application will time out soon</Header>
        <p>We will reset your application if you do not respond in {warningTimeToDisplay}. We do keep your information secure.</p>
        <form action={url}>
          <Button id="sign-in">Continue</Button>
        </form>
      </Main>
    );
  }
}

export default {
  component: connect(state => {
    return {
      loginUrl: state.config.loginUrl,
      warningTimeout: state.config.warningTimeout
    };
  }, {})(SignOutPage)
};
