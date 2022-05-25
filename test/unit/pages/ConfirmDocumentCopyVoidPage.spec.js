import _ from 'lodash';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { component as ConfirmDocumentCopyVoidPage } from '../../../src/client/pages/common/ConfirmDocumentCopyVoidPage';
import copyDocumentCopyVoidPage from '../../../src/client/pages/common/ConfirmDocumentCopyVoidPage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { addCopyDocument, clearCopyDocument, submitCopyCertificate, clearErrors } from '../../../src/client/actions/copy-document.actions';
import { dispatchApiCallFailed } from '../../../src/client/actions';
import { render } from '@testing-library/react';
jest.mock('../../../src/client/actions');
jest.mock('../../../src/client/actions/copy-document.actions');

const mockStore = configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    post: () => {
      return new Promise((res) => {
        res({});
      });
    }
  }
})]);

const props = {
  errors: { errors: [], voidOriginalError: [] },
  match: {
    path: '/create-catch-certificate/:documentNumber/copy-void-confirmation',
    url: '/create-catch-certificate/GBR-2021-CC-D6FBF748C/copy-void-confirmation',
    isExact: true,
    params: {'documentNumber': 'GBR-2021-CC-D6FBF748C'}
  },
  route: {
    title                 : 'Create a UK catch certificate - GOV.UK',
    journey               : 'catchCertificate',
    previousUri           : '/create-catch-certificate/GBR-2021-CC-D6FBF748C/copy-this-catch-certificate',
    path                  : '/create-catch-certificate/:documentNumber/copy-void-confirmation',
    journeyText           : 'catch certificate',
    nextUri: '/create-catch-certificate/:documentNumber/add-your-reference'
  },
  t: jest.fn()
};

const storeA = {
  confirmCopyDocument: {
    copyDocumentAcknowledged: true,
    copyExcludeLandings: false,
    unauthorised: false,
    voidOriginal: undefined,
    voidDocumentConfirm: false
  },
  errors: { errors: [] },
  t: jest.fn()
};

let wrapper;

describe('Confirm Document Copy Void page', () => {

  beforeEach(() => {
    addCopyDocument.mockReturnValue({ type: 'CONFIRM_COPY_DOCUMENT' });
    clearCopyDocument.mockReturnValue({ type: 'CLEAR_COPY_DOCUMENT' });
    submitCopyCertificate.mockResolvedValue('new-document-number');
    dispatchApiCallFailed.mockResolvedValue('CALL_FAILED');
    clearErrors.mockReturnValue({ type: 'CLEAR_ERRORS '});

    window.scrollTo = jest.fn();

    wrapper = mount(
      <Provider store={mockStore(storeA)}>
        <MemoryRouter>
          <ConfirmDocumentCopyVoidPage {...props} />
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

  it('should render a continue button', () => {
    let continueButton = wrapper.find({type: 'submit', id: 'continue'});
    expect(continueButton.exists()).toBeTruthy();
  });

  it('should render a cancel button', () => {
    let continueButton = wrapper.find({name: 'cancel-confirm-copy-void-btn', id: 'cancel-confirm-copy-void-btn'});
    expect(continueButton.exists()).toBeTruthy();
  });

  it('should call the onClick of the back link', () => {
    const mockPreventDefault = jest.fn();

    const baclLinkEl = wrapper.find('BackLink');
    baclLinkEl.simulate('click', {
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });


  it('should call the onClick of the Secondary Button', () => {
    const mockPreventDefault = jest.fn();

    const secondaryButtonEl = wrapper.find('button[name="cancel-confirm-copy-void-btn"]');
    secondaryButtonEl.simulate('click', {
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should call submitCopyCertificate when the form is submitted', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    expect(submitCopyCertificate).toHaveBeenCalledTimes(1);
  });

  it('should default the submit button as not being disabled', () => {
    const button = wrapper.find({type: 'submit', id: 'continue'}).at(0);

    expect(button.prop('disabled')).toBe(false);
  });

  it('should set the submit button as disabled on submit', () => {
    const resolveAfterOneSec = () =>
      new Promise((res, _) => setTimeout(() => res(), 1000));

    submitCopyCertificate.mockImplementation(() => resolveAfterOneSec);

    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    const button = wrapper.find({type: 'submit', id: 'continue'}).at(0);

    expect(button.prop('disabled')).toBe(true);
  });

  it('should set the submit button back to enabled after successful submission', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    const button = wrapper.find({type: 'submit', id: 'continue'}).at(0);

    expect(button.prop('disabled')).toBe(false);
  });

  it('should set the submit button back to enabled after failed submission', () => {
    submitCopyCertificate.mockRejectedValue('no');

    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    const button = wrapper.find({type: 'submit', id: 'continue'}).at(0);

    expect(button.prop('disabled')).toBe(false);
  });

  it('should handle submit event and push history', () => {
    act(() => wrapper.find('form').props().onSubmit(
      {preventDefault() {}}
    ));
  });

  it('should handle on change events', () => {
    wrapper.find('input[name="voidOriginal"][id="documentVoidOriginalYes"]').simulate('change', {target: {name: 'voidOriginal',  value: 'true'}});
  });

  it('should find the legend tags', () => {
    expect(wrapper.find('legend')).toHaveLength(1);
  });

  it('should throw an error if the user has not made a selection', () => {
    const store = _.cloneDeep(storeA);

    store.errors = {
      voidOriginal: undefined,
      errors: [{ 'targetName': 'voidOriginal', 'text': 'Select an option to continue' }]
    };

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <ConfirmDocumentCopyVoidPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    let ErrorIsland = wrapper.find('div#errorIsland');
    let errorSummary = wrapper.find('ul.error-summary-list li a');
    expect(ErrorIsland.exists()).toBeTruthy();
    expect(errorSummary.text()).toEqual('Select an option to continue');
  });

  it('should push history for component did update', () => {
    const mockPush = jest.fn();

    new ConfirmDocumentCopyVoidPage.WrappedComponent({
      match: {
        params: {
          documentNumber: '',
        },
      },
      unauthorised: true,
      history: {
        push: mockPush,
      },
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should clear errors on component will unmount', () => {
    const mockDispatchClearErrors = jest.fn();

    new ConfirmDocumentCopyVoidPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      unauthorised: true,
      clearErrors: mockDispatchClearErrors,
    }).componentWillUnmount();

    expect(mockDispatchClearErrors).toHaveBeenCalled();
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
    copyDocumentCopyVoidPage.documentNumber = documentNumber;
    copyDocumentCopyVoidPage.queryParams = {};

    copyDocumentCopyVoidPage.loadData(store);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('will call all methods needed to load the component when given query params', () => {
    copyDocumentCopyVoidPage.documentNumber = documentNumber;
    copyDocumentCopyVoidPage.queryParams = queryParams;

    copyDocumentCopyVoidPage.loadData(store);

    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('snapshots describe', () => {
  beforeEach(() => {
   clearErrors.mockReturnValue({ type: 'CLEAR_ERRORS '});
    window.scrollTo = jest.fn();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  })
})

