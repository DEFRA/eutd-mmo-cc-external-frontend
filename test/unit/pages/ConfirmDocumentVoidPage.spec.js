import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import * as React from 'react';
import * as ConfirmDocumentVoidPage from '../../../src/client/pages/common/ConfirmDocumentVoidPage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { MemoryRouter } from 'react-router-dom';
import {
  saveConfirmDocumentVoid,
  addConfirmDocumentVoid,
  dispatchApiCallFailed
} from '../../../src/client/actions';
import { render } from '@testing-library/react';

jest.mock('../../../src/client/actions');

const mockStore = configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    post: () => {
      return new Promise((res) => {
        res({});
      });
    },
    get: () => {
      return new Promise((res) => {
        res({});
      });
    }
  }
})]);

const store = mockStore({
  addConfirmDocumentVoid: {},
  saveConfirmDocumentVoid: {},
  errors: {}
});


describe('Confirm Document Void page', () => {
  let wrapper;
 
  const props = {
    errors : {},
    route: {
      title                 : 'Create a UK catch certificate - GOV.UK',
      nextUri               : '/create-catch-certificate/:documentNumber/what-are-you-exporting',
      journey               : 'catchCertificate',
      previousUri           : '/create-catch-certificate/catch-certificates',
      path                  : '/create-catch-certificate/catch-certificates',
      journeyText           : 'catch certificate'
    },
};

  beforeEach(() => {
    saveConfirmDocumentVoid.mockReturnValue({ type: 'SAVE_CONFIRM_VOID' });
    addConfirmDocumentVoid.mockReturnValue({ type: 'ADD_CONFIRM_VOID' });
    dispatchApiCallFailed.mockReturnValue({ type: 'CALL_FAILED' });

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
            <ConfirmDocumentVoidPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
  });

  it('should handle on change events', () => {
    wrapper.find('input[name="documentVoid"][id="documentVoidYes"]').simulate('change', {target: {name: 'documentVoid',  value: 'Yes'}});
  });

  it('should find the legend tags', () => {
    expect(wrapper.find('legend')).toHaveLength(1);
  });

  it('should handle click on backlink', () => {
    const mockPreventDefault = jest.fn();

    wrapper.find('BackLink').simulate('click', {
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should throw an error if the user has not made a selection', () => {
    store.errors = {
      errors: [{ 'targetName': 'documentVoid', 'text': 'Select yes if you want to void the current document' }]
    };

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
           <ConfirmDocumentVoidPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );

    let ErrorIsland = wrapper.find('div#errorIsland');
    let errorSummary = wrapper.find('ul.error-summary-list li a');
    expect(ErrorIsland.exists()).toBeTruthy();
    expect(errorSummary.text()).toEqual('Select yes if you want to void the current document');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

