import React, {Fragment} from 'react';
import PageTitle from '../components/PageTitle';

const NotFoundPage = ({ staticContext = {} }) => {
  staticContext.notFound = true;
  return (
    <Fragment>
      <PageTitle title="Page not found – GOV.UK"/>
      <h1 className="heading-large">Page not found</h1>
      <p>
        If you typed the web address, check it is correct.
        <br/><br/>
        If you pasted the web address, check you copied the full address.
        <br/><br/>
        If the web address is correct or you selected a link or button, <a href="/">check the document is in progress</a>. Everything you have done so far will have been saved
      </p>
    </Fragment>
  );
};

export default {
  component: NotFoundPage
};
