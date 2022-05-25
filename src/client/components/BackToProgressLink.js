import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BackToProgressLink = ({ progressUri, documentNumber }) => {
  const { t } = useTranslation();

  return (
    <Link
      id="backToProgress"
      to={progressUri.replace(':documentNumber', documentNumber)}
    >
      {t('commonBackToProgressLinkText')}
      <span className="govuk-visually-hidden">
        {t('commonBackToProgressHiddenText')}
      </span>
    </Link>
  );
};

BackToProgressLink.propTypes = {
  progressUri: PropTypes.string.isRequired,
  documentNumber: PropTypes.string.isRequired,
};

export default BackToProgressLink;