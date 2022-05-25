import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import jsdom from 'jsdom';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../../src/client/reducers/index';
import { StaticRouter } from 'react-router-dom';

const { JSDOM } = jsdom;

const { document } = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = global.document.defaultView;
global.navigator = {
  userAgent: 'badBrowserz'
};
const $ = global.$ = _$(window);

chaiJquery(chai, chai.util, $);

function renderComponent(ComponentClass, props = {}, state = {}) {
  const componentInstance =  TestUtils.renderIntoDocument(
    <Provider store={createStore(reducers, state)}>
      <StaticRouter>
        <ComponentClass {...props} />
      </StaticRouter>
    </Provider>
  );

  return $(ReactDOM.findDOMNode(componentInstance));
}

export {renderComponent, expect};
