import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SecondaryButton from './elements/SecondaryButton';
import { useTranslation } from 'react-i18next';

const SaveAsDraftButton = (props) => {
  const {t} = useTranslation();
  return (
    <Fragment>
      <SecondaryButton formAction={props.formactionUrl} type="submit" id="saveAsDraft" name="saveAsDraft" onClick={props.onClick}>{t('commonSaveAsDraftButtonSaveAsDraftText')}</SecondaryButton>
    </Fragment>
  );
};

SaveAsDraftButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  formactionUrl: PropTypes.string
};

export default SaveAsDraftButton;