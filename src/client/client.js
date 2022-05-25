// Startup point for the client side application
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, withRouter} from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import axios from 'axios';
import Routes from './Routes';
import reducers from './reducers';
import { createBrowserHistory } from 'history';

const composeEnhancers = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
  

const paramSerializerFn = params => {
  let output = '';
  Object.keys(params).forEach((k) => {
    output+= `${k}=${params[k]}&`;
  });
  return encodeURI(output);
};

const axiosResponseInterceptorSuccessFn = response => response;
const axiosResponseInterceptorErrorFn = error => {
  if (error.response.status === 599) {
    // Let's check if this is because we're logged out
    const empPromise = new Promise(() => {});
    const searchParam = error.request.responseURL.slice(error.request.responseURL.search(/[?]/g));
    let searchParams = new URLSearchParams(searchParam);
    if(searchParams.get('notLoggedInErr') === 'yes') {
      window.location = '/logout?backToPath=/server-logout';
      return empPromise;
    }
    // It's always a timeout...
    window.location = '/timed-out';
    return new Promise(() => {});
  } else {
    return new Promise((_,rej) => rej(error));
  }
};

const axiosInstanceForOrchService = axios.create({
  baseURL: '/orchestration/api/v1/',
  paramsSerializer: paramSerializerFn,
  timeout: window.INITIAL_STATE.config.axiosTimeout
});

axiosInstanceForOrchService.interceptors.response.use(axiosResponseInterceptorSuccessFn, axiosResponseInterceptorErrorFn);

const axiosInstanceForRefService = axios.create({
  baseURL: '/reference/api/v1/',
  paramsSerializer: paramSerializerFn,
  timeout: window.INITIAL_STATE.config.axiosTimeout
});

axiosInstanceForRefService.interceptors.response.use(axiosResponseInterceptorSuccessFn, axiosResponseInterceptorErrorFn);

const axiosInstanceForDynamixService = axios.create({
  baseURL: '/dynamix/',
  paramsSerializer: paramSerializerFn,
  timeout: window.INITIAL_STATE.config.axiosTimeout
});

axiosInstanceForDynamixService.interceptors.response.use(axiosResponseInterceptorSuccessFn, axiosResponseInterceptorErrorFn);

const store = createStore(
  reducers,
  window.INITIAL_STATE,
  composeEnhancers(applyMiddleware(
    // The difference between orch/ref service api is not significant as they both go through proxy
    // However it is significant in the server side store. To stick with same action creators we're
    // passing down same axios instance to both orchestration and reference service api .
    thunk.withExtraArgument( {
      orchestrationApi: axiosInstanceForOrchService,
      referenceServiceApi: axiosInstanceForRefService,
      dynamixApi: axiosInstanceForDynamixService } )
  ))
);

const ScrollToTop = withRouter( class ScrollToTop extends React.Component {
  componentDidMount() {
  }

  render() {
    return this.props.children;
  }
});

const history = createBrowserHistory();


ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <ScrollToTop>
        <div>{renderRoutes(Routes)}</div>
      </ScrollToTop>
    </Router>
  </Provider>,
  document.querySelector('#root')
);
