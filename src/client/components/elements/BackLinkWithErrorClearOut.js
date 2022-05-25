import React from 'react';
import BackLink from '@govuk-react/back-link';

const BackLinkWithErrorClearOut = ({backUri, clearErrors, history, labeltext}) => {

  return (<BackLink onClick={(e) => {
    e.preventDefault();
    clearErrors();
    history.push(backUri);
  }} href={backUri} >{labeltext}</BackLink>);
};

export default BackLinkWithErrorClearOut;