import React from 'react';
import PropTypes from 'prop-types';

const LinkTargetBlank = ({ href, text, ariaLabel, ...props}) => (
  <a href={href} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer" {...props}>
    {text}<span className="govuk-visually-hidden">(opens in new tab)</span>
  </a>
);

LinkTargetBlank.propTypes = {
  href: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  props: PropTypes.node
};

export default LinkTargetBlank;
