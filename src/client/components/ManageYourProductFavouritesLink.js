import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ManageYourProductFavouritesLink = ({styles}) => {
  const { t } = useTranslation();
  let text = t('ccProductFavouriteDetailSummary3ParagraphText');
  const manageYourProductFavouritesText = text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <Link
      id="manageYourProductFavourites"
      to="/manage-favourites"
      style={styles}
    >
      {manageYourProductFavouritesText}
    </Link>
  );
};

ManageYourProductFavouritesLink.propTypes = {
  progressUri: PropTypes.string.isRequired,
  documentNumber: PropTypes.string.isRequired,
};

export default withRouter(ManageYourProductFavouritesLink);