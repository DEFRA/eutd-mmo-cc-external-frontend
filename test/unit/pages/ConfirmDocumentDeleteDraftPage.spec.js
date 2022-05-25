import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import * as React from 'react';
import _ from 'lodash';
import * as ConfirmDocumentDeleteDraftPage from '../../../src/client/pages/common/ConfirmDocumentDeleteDraftPage';
import ConfirmDocumentDeleteDraftPageWrapper from '../../../src/client/pages/common/ConfirmDocumentDeleteDraftPage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import {
  saveConfirmDocumentDelete,
  addConfirmDocumentDelete,
  dispatchApiCallFailed
} from '../../../src/client/actions';
import { act } from 'react-dom/test-utils';
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

describe('Confirm Document Delete Draft page', () => {
  let wrapper;


  const storeA = {
    addConfirmDocumentDelete  : {},
    saveConfirmDocumentDelete : {},
    errors: { errors: [] },
    t: jest.fn()
  };

  beforeEach(() => {
    saveConfirmDocumentDelete.mockReturnValue({ type: 'SAVE_CONFIRM_DELETE' });
    addConfirmDocumentDelete.mockReturnValue({ type: 'ADD_CONFIRM_DELETE' });
    dispatchApiCallFailed.mockReturnValue({ type: 'CALL_FAILED' });
    const store = mockStore({
        addConfirmDocumentDelete  : {},
        saveConfirmDocumentDelete : {},
        errors                    : {},
        t                         : jest.fn()
    });

    const props = {
        errors : {},
        route: {
          title                 : 'Create a UK catch certificate - GOV.UK',
          nextUri               : '/create-catch-certificate/what-are-you-exporting',
          journey               : 'catchCertificate',
          previousUri           : '/create-catch-certificate/catch-certificates',
          path                  : '/create-catch-certificate/catch-certificates',
          history               : [],
          journeyText           : 'catch certificate'
        },
        t: jest.fn()
    };


    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
            <ConfirmDocumentDeleteDraftPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );
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
    wrapper.find('input[name="documentDelete"][id="documentDeleteYes"]').simulate('change', {target: {name: 'documentDelete',  value: 'Yes'}});
  });

  it('should find the legend tags', () => {
    expect(wrapper.find('legend')).toHaveLength(1);
  });

  it('should call the onClick of the back link', () => {
    const mockPreventDefault = jest.fn();

    const baclLinkEl = wrapper.find('BackLink');
    baclLinkEl.simulate('click', {
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

    it('should handle submit event and push history', () => {
     act(() => wrapper.find('form').props().onSubmit(
      {preventDefault() {}}
    ));
  });
  
  it('should throw an error if the user has not made a selection', () => {
    const store = _.cloneDeep(storeA);
    const props = {
      errors : {},
      route: {
        title                 : 'Create a UK catch certificate - GOV.UK',
        nextUri               : '/create-catch-certificate/what-are-you-exporting',
        journey               : 'catchCertificate',
        previousUri           : '/create-catch-certificate/catch-certificates',
        path                  : '/create-catch-certificate/catch-certificates',
        history               : [],
        journeyText           : 'catch certificate'
      },
      t: jest.fn()
  };
    store.errors = {
      documentDelete: 'Select yes if you want to delete the current document and start a new one',
      errors: [{ 'targetName': 'documentDelete', 'text': 'Select yes if you want to delete the current document and start a new one' }]
    };

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
        <ConfirmDocumentDeleteDraftPage.default.component {...props}/>
        </MemoryRouter>
      </Provider>
    );

    let ErrorIsland = wrapper.find('div#errorIsland');
    let errorSummary = wrapper.find('ul.error-summary-list li a');
    expect(ErrorIsland.exists()).toBeTruthy();
    expect(wrapper.find('ErrorIsland').prop('errors')[0].message).toBe('Select yes if you want to delete the current document and start a new one');
});

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('loadData', () => {
  const store = {
    dispatch: jest.fn()
  };

  const documentNumber = 'some-document-number';
  const queryParams = {
    error: '{"x":5,"y":6}'
  };

  it('will call all methods needed to load the component', () => {
    ConfirmDocumentDeleteDraftPageWrapper.documentNumber = documentNumber;
    ConfirmDocumentDeleteDraftPageWrapper.queryParams = {};

    ConfirmDocumentDeleteDraftPageWrapper.loadData(store);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('will call all methods needed to load the component when given query params', () => {
    ConfirmDocumentDeleteDraftPageWrapper.documentNumber = documentNumber;
    ConfirmDocumentDeleteDraftPageWrapper.queryParams = queryParams;

    ConfirmDocumentDeleteDraftPageWrapper.loadData(store);

    expect(store.dispatch).toHaveBeenCalled();
  });
});