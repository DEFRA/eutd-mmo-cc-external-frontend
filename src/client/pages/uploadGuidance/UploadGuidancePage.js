import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllUserAttributes } from '../../actions/userAttributes.actions';
import { UploadGuidanceEnglish } from './UploadGuidanceEnglish';
import { UploadGuidanceWelsh } from './UploadGuidanceWelsh';

export const UploadGuidancePage = (props) => {
  let userSelectedLanguage;
  const userAttributeLanguage = props.userAttributes.find((val) => val.name === 'language');

  if (userAttributeLanguage) {
    userSelectedLanguage = userAttributeLanguage.value;
  }
  return (
    userSelectedLanguage === 'cy_UK'
      ? <UploadGuidanceWelsh {...props} />
      : <UploadGuidanceEnglish {...props} />
  );
};

const mapStateToProps = state => {
  return {
    userAttributes: state.userAttributes
  };
};

const loadData = store => {
  return store.dispatch(getAllUserAttributes());
};

export default {
  loadData,
  component: withRouter(connect(mapStateToProps,
    {
      getAllUserAttributes,
    })(UploadGuidancePage)),
};
