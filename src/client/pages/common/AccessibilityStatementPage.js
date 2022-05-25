import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllUserAttributes } from '../../actions/userAttributes.actions';
import { AccessibilityStatementEnglish } from './AccessibilityStatementEnglish';
import { AccessibilityStatementWelsh } from './AccessibilityStatementWelsh';

const AccessibilityStatementPage = (props) => {
  let userSelectedLanguage;
  const userAttributeLanguage = props.userAttributes.find((val) => val.name === 'language');
  
  if (userAttributeLanguage) {
    userSelectedLanguage = userAttributeLanguage.value;
  }

  return (
    userSelectedLanguage === 'cy_UK' 
      ? <AccessibilityStatementWelsh />
      : <AccessibilityStatementEnglish />
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
      getAllUserAttributes
    })(AccessibilityStatementPage))
};
