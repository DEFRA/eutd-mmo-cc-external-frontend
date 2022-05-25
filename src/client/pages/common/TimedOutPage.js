import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Main, Header, Button } from 'govuk-react';

import PageTitle from '../../components/PageTitle';

class TimedOutPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = this.props.loginUrl;
    return <Main>
      <PageTitle title='You have been timed out - GOV.UK' />
      <Header level={1}>You have been timed out </Header>
      <p>Your document is still in progress.</p>
      <p>Everything you have done so far has been saved.</p>
      <form action={url}>
        <Button id="sign-in">Continue</Button>
      </form>
    </Main>;
  }
}


export default {
  component: connect( state => {
    return {
      loginUrl: state.config.loginUrl 
    };
  })(TimedOutPage)
};
