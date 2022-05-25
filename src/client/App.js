import React from 'react';
import { renderRoutes } from 'react-router-config';
import '../../scss/main.scss';
import { withTranslation } from 'react-i18next';
import i18n from '../i18n';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { isEmpty } from 'lodash';

import {
  getAllUserAttributes,
  saveUserAttribute,
} from './actions/userAttributes.actions';
import FeedbackAndLanguageHeader from './components/FeedbackAndLanguageHeader';

const ErrorBoundary = withRouter(
  connect((state) => ({
    idleTimeout: state.config.idleTimeout,
    warningTimeout: state.config.warningTimeout,
    showFullPageError: state.global.showFullPageError,
    enableErrorPage: state.config.enableErrorPage,
    enableTranslation: state.config.enableTranslation,
  }))(
    class ErrBoundary extends React.Component {
      state = {};

      events = [
        'load',
        'mousemove',
        'mousedown',
        'click',
        'scroll',
        'keypress',
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel'
      ];


      componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.error({ info, error });
      }

    
      componentDidMount() {

        this.events.forEach(event => {
          window.addEventListener(event, this.resetTimeout);
        });
        this.setTimeout();
        this.initTranslation();
      }

      initTranslation = async () => {
        const { languages } = this.props;
        const { userAttributes = [] } = this.props;
        const userAttributeLangObject = userAttributes.find((val) => val.name === 'language');
        const userAttributeLanguage =  userAttributeLangObject && !isEmpty(userAttributeLangObject.value)
          ? userAttributeLangObject.value
          : languages.english;

        if(this.props.enableTranslation === true){
          await i18n.changeLanguage(userAttributeLanguage);
          translateHeaderAndFooter();
        }

        document.addEventListener('DOMContentLoaded', function(event) {
          translateHeaderAndFooter();
        });
      };

      setTimeout = () => {
        this.timerId = setTimeout(this.warnToLogout, parseInt(this.props.idleTimeout));
      };

      resetTimeout = () => {
        clearTimeout(this.timerId);
        this.setTimeout();
      };

      warnToLogout = () => {
        window.location.href = '/sign-out';
      };

      clearTimer = () => {
        clearTimeout(this.timerId);
        this.events.forEach((event) => {
          window.removeEventListener(event, this.resetTimeout);
        });
      };

      render() {
        const { showFullPageError, enableErrorPage } = this.props;
        if (enableErrorPage && (this.state.hasError || showFullPageError)) {
          return <ErrorPage />;
        }
        return this.props.children;
      }
    }
  )
);

const translateHeaderAndFooter = () => {
  const elementList = document.querySelectorAll('[data-translate]');
  for (const element of elementList) {
    element.innerHTML = i18n.t(element.getAttribute('data-translate'));
  }
};

const App = ({ route, ...props }) => {
  let userSelectedLanguage;
  const userAttributeLangObject = props.userAttributes.find((val) => val.name === 'language');
  if (userAttributeLangObject) {
    userSelectedLanguage = userAttributeLangObject.value;
  }
  const saveAttributes = async (language) => {
    if (!isEmpty(language)) {
      translateHeaderAndFooter();
      await props.saveUserAttribute({
        key: 'language',
        value: language,
      });
    }
  };

  return (
    <React.Fragment>
      <FeedbackAndLanguageHeader
        pathName={props && props.location && props.location.pathname}
        saveAttributes={saveAttributes}
        userSelectedLanguage={userSelectedLanguage}
        enableTranslation={props.enableTranslation}
      />
      <ErrorBoundary {...props}>
        {renderRoutes(route.routes, { translateHeaderAndFooter })}
      </ErrorBoundary>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    userAttributes: state.userAttributes,
    languages: state.config.languages,
    enableTranslation: state.config.enableTranslation
  };
};

const loadData = store => {
  return store.dispatch(getAllUserAttributes());
};

export default {
  component: withRouter(connect(mapStateToProps, {
    getAllUserAttributes,
    saveUserAttribute
  })(withTranslation()(App))),
  loadData
};
