import _ from 'lodash';
import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import {act} from 'react-dom/test-utils';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { component as CopyCertificateConfirmPage } from '../../../src/client/pages/common/CopyCertificateConfirm';
import copyCertificateConfirmPage from '../../../src/client/pages/common/CopyCertificateConfirm';
import {
  addCopyDocument,
  clearCopyDocument,
  clearErrors,
  submitCopyCertificate,
  unauthorisedCopyDocument,
  checkCopyCertificate
} from '../../../src/client/actions/copy-document.actions';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import {
  dispatchApiCallFailed
} from '../../../src/client/actions';

jest.mock('../../../src/client/actions/copy-document.actions');
jest.mock('../../../src/client/actions');

const mockBeforeEach = () => {
  addCopyDocument.mockReturnValue({ type: 'CONFIRM_COPY_DOCUMENT' });
  clearCopyDocument.mockReturnValue({ type: 'CLEAR_COPY_DOCUMENT' });
  clearErrors.mockReturnValue({ type: 'CLEAR_ERRORS '});
  submitCopyCertificate.mockReturnValue({
    type: 'CONFIRM_COPY_DOCUMENT', payload: {
      documentNumber: 'document1',
      copyDocumentAcknowledged: true,
      voidDocumentConfirm: true
    }
  });
  unauthorisedCopyDocument.mockReturnValue({ type: 'unauthorised_copy_document' });
  checkCopyCertificate.mockReturnValue({type: 'UNAUTHORISED_COPY_DOCUMENT'});
  dispatchApiCallFailed.mockReturnValue({type: 'CALL_FAILED'});
};

const mockStore = configureStore([thunk.withExtraArgument({
  orchestrationApi: {
    get: () => {
      return new Promise(res => {
        res({});
      });
    }
  }
})]);

let props = {
  onSubmit: jest.fn().mockReturnValue({
    copyDocumentAcknowledged: true,
    documentNumber: 'document1',
    journey: 'catch certificate'
  }),
  onChange: jest.fn().mockReturnValue({
    copyDocumentAcknowledged: true,
    documentNumber: 'document1',
    journey: 'catch certificate'
  }),
  match: {
    path: '/create-catch-certificate/:documentNumber/copy-this-catch-certificate',
    url: '/create-catch-certificate/GBR-2021-CC-D6FBF748C/copy-this-catch-certificate',
    isExact: true,
    params: {'documentNumber': 'GBR-2021-CC-D6FBF748C'}
  },
  route: {
    path: '/create-catch-certificate/:documentNumber/copy-this-catch-certificate',
    title: 'Create a UK catch certificate - GOV.UK',
    journey: 'catchCertificate',
    journeyText: 'catch certificate',
    previousUri: '/create-catch-certificate/catch-certificates',
    nextUri: '/create-catch-certificate/:documentNumber/add-your-reference',
    copyCertificateOptions: [
      {
        label: 'Copy all certificate data',
        value: 'copyAllCertificateData',
        name: 'copyDocument',
        id: 'copyAllCertificateData',
        hint: 'Enables you to quickly create a new draft catch certificate from a previously submitted document with similar data',
      },
      {
        label: 'Copy all certificate data EXCEPT the landings',
        value: 'copyExcludeLandings',
        id: 'copyExcludeLandings',
        name: 'copyDocument',
        hint: 'Enables you to quickly create a new draft catch certificate from a previously submitted document with similar data, but exclude the landings in the copy',
      }, {
        label: 'Copy all certificate data AND void the original',
        value: 'voidDocumentConfirm',
        id: 'voidDocumentConfirm',
        name: 'copyDocument',
        hint: 'Allows you correct errors in a submitted document by copying and replacing it',
      }
    ]
  },
  clearErrors: jest.fn()
};

let storeDefaults = {
  confirmCopyDocument: {
    copyDocumentAcknowledged: false,
    voidDocumentConfirm: false
  },
  errors: { errors: [] },
};

jest.spyOn(window, 'scrollTo')
  .mockImplementation(() => {});

let wrapper = mount(
  <Provider store={mockStore(storeDefaults)}>
    <MemoryRouter>
      <CopyCertificateConfirmPage {...props} />
    </MemoryRouter>
  </Provider>
);

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


describe('CopyCertificateConfirm', () => {

  beforeEach(() => {
    mockBeforeEach();

    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });



  it('should have continue button on the page with title as per specs', () => {
    expect(wrapper.find({type: 'submit', id: 'continue'}).exists()).toBeTruthy();
    expect(wrapper.find({type: 'submit', id: 'continue'}).at(0).text()).toBe('Create draft catch certificate');
  });

  

  it('should have checkbox on the page', () => {
    expect(wrapper.exists('input#copyDocumentAcknowledged')).toBeTruthy();
    expect(wrapper.find('Checkbox#copyDocumentAcknowledged').text()).toBe(
      'I understand I must not reuse the same catch certificate or landing data for catches that have already been exported'
    );
  });

  it('should have radio button options with corresponding labels and hints to copy document', () => {
    // Copy All Certificate Data Option
    expect(wrapper.find('input#copyAllCertificateData').exists()).toBeTruthy();
    expect(wrapper.find('input#copyAllCertificateData').props().checked).toBeFalsy();
    expect(wrapper.find('#copyAllCertificateData').contains('Copy all certificate data')).toBeTruthy();
    expect(wrapper.find('#copyAllCertificateData StyledHint').text()).toBe('Enables you to quickly create a new draft catch certificate from a previously submitted document with similar data');

    // Copy Exclude Landings Option
    expect(wrapper.find('input#copyExcludeLandings').exists()).toBeTruthy();
    expect(wrapper.find('input#copyExcludeLandings').props().checked).toBeFalsy();
    expect(wrapper.find('#copyExcludeLandings').contains('Copy all certificate data EXCEPT the landings')).toBeTruthy();
    expect(wrapper.find('#copyExcludeLandings StyledHint').text()).toBe('Enables you to quickly create a new draft catch certificate from a previously submitted document with similar data, but exclude the landings in the copy');

    // Copy Void Original Option
    expect(wrapper.find('input#voidDocumentConfirm').exists()).toBeTruthy();
    expect(wrapper.find('input#voidDocumentConfirm').props().checked).toBeFalsy();
    expect(wrapper.find('#voidDocumentConfirm').contains('Copy all certificate data AND void the original')).toBeTruthy();
    expect(wrapper.find('#voidDocumentConfirm StyledHint').text()).toBe('Allows you correct errors in a submitted document by copying and replacing it');
  });

  it('should have text of the warning with proper spaces as per specs', () => {
    expect(wrapper.find('#warningMessage').at(0).find('strong').text()).toBe('You must not use a catch certificate or landing data for catches that have already been exported. Knowingly reusing catch certificates or using landing data that relate to a previous export is a serious offence and may result in enforcement action being taken.');
  });

  it('should show warning text and acknowledgement heading in order as per specs', () => {
    expect(wrapper.find('Header').exists()).toBeTruthy();
    expect(wrapper.find('#warningMessageRow h2').text()).toBe('Acknowledgement');
    expect(wrapper.find('#warningMessageRow+#acknowledgementRow').exists()).toBeFalsy();
  });

  it('should show warning text', () => {
    expect(
      wrapper
        .find('div#warningMessage')
        .hasClass('warning-message')
    ).toBeTruthy();
  });

  it('should show acknowledgement head with large style', () => {
    expect(
      wrapper
        .find('#acknowledgementRow')
        .find('h2')
    ).toBeTruthy();
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

    const secondaryButtonEl = wrapper.find('button[name="cancel-copy-certificate-confirm-btn"]');
    secondaryButtonEl.simulate('click', {
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should call the on change and set FormGroup - Copy All option selected', () => {
    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': null,
      'copyDocumentAcknowledged': false
    });
    act(() => {
      wrapper.find('Radio#copyAllCertificateData').props().onChange({
        target: {
          name: 'copyDocument',
          value: 'copyAllCertificateData',
          checked: true
        }
      });
    });

    expect(component.state()).toEqual({
      'copyDocument': 'copyAllCertificateData',
      'copyDocumentAcknowledged': false
    });
  });

  it('should call the on change and set FormGroup - Copy Excluding Landing option selected', () => {
    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': null,
      'copyDocumentAcknowledged': false
    });
    act(() => {
      wrapper.find('Radio#copyExcludeLandings').props().onChange({
        target: {
          name: 'copyDocument',
          value: 'copyExcludeLandings',
          checked: true
        }
      });
    });
    expect(component.state()).toEqual({
      'copyDocument': 'copyExcludeLandings',
      'copyDocumentAcknowledged': false
    });
  });

  it('should call the on change and set FormGroup - Void Document option selected', () => {
    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': null,
      'copyDocumentAcknowledged': false
    });
    act(() => {
      wrapper.find('Radio#voidDocumentConfirm').props().onChange({
        target: {
          name: 'copyDocument',
          value: 'voidDocumentConfirm',
          checked: true
        }
      });
    });
    expect(component.state()).toEqual({
      'copyDocument': 'voidDocumentConfirm',
      'copyDocumentAcknowledged': false
    });
  });

  it('should call the on change and set copyDocumentAcknowledge as true', () => {
    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': null,
      'copyDocumentAcknowledged': false
    });

    act(() => {
      wrapper.find('Checkbox#copyDocumentAcknowledged').props().onChange({ target: { name: 'copyDocumentAcknowledged', checked: true }});
    });
    expect(component.state()).toEqual({
      'copyDocument': null,
      'copyDocumentAcknowledged': true
    });
  });

  it('should test act onSubmit with FormGroup - copy all option selected and Acknowledgement TRUE', () => {

    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': 'copyAllCertificateData',
      'copyDocumentAcknowledged': true
    });

    const mockPreventDefault = jest.fn();

    const formEl = wrapper.find('form');
    act(() => formEl.props().onSubmit({
      preventDefault: mockPreventDefault
    }));

    expect(formEl.exists()).toBeTruthy();
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should test act onSubmit with FormGroup - Exclude Landings selected and Acknowledgement TRUE', () => {

    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': 'copyExcludeLandings',
      'copyDocumentAcknowledged': true
    });

    const mockPreventDefault = jest.fn();

    const formEl = wrapper.find('form');
    act(() => formEl.props().onSubmit({
      preventDefault: mockPreventDefault
    }));

    expect(formEl.exists()).toBeTruthy();
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should test act onSubmit with FormGroup - Void Original selected and Acknowledgement TRUE', () => {

    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': 'voidDocumentConfirm',
      'copyDocumentAcknowledged': true
    });

    const mockPreventDefault = jest.fn();

    const formEl = wrapper.find('form');
    act(() => formEl.props().onSubmit({
      preventDefault: mockPreventDefault
    }));

    expect(formEl.exists()).toBeTruthy();
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should test act onSubmit with FormGroup - copy all option selected with Acknowledgement FALSE', () => {

    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': 'copyAllCertificateData',
      'copyDocumentAcknowledged': true
    });

    const mockPreventDefault = jest.fn();

    const formEl = wrapper.find('form');
    act(() => formEl.props().onSubmit({
      preventDefault: mockPreventDefault
    }));

    expect(formEl.exists()).toBeTruthy();
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should test act onSubmit with FormGroup set to NULL with Acknowledgement FALSE', () => {

    const component = wrapper.find('copyCertificateConfirmPage');
    component.setState({
      'copyDocument': null,
      'copyDocumentAcknowledged': true
    });

    const mockPreventDefault = jest.fn();

    const formEl = wrapper.find('form');
    act(() => formEl.props().onSubmit({
      preventDefault: mockPreventDefault
    }));

    expect(formEl.exists()).toBeTruthy();
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should call onChange for Acknowledgement', () => {
    const onChangeFn = wrapper.find('copyCertificateConfirmPage').instance().props.onChange;
    const spyOnChangeFn = jest.spyOn(wrapper.find('copyCertificateConfirmPage').instance().props,'onChange');
    onChangeFn({target:{
      name:'copyDocumentAcknowledged',
      value: true,
      checked: true
    }
    });
    expect(spyOnChangeFn).toHaveBeenCalled();
  });

  it('should call onChange for copyAllCertificateData', () => {
    const onChangeFn = wrapper.find('copyCertificateConfirmPage').instance().props.onChange;
    const spyOnChangeFn = jest.spyOn(wrapper.find('copyCertificateConfirmPage').instance().props, 'onChange');
    onChangeFn({
      target: {
        name: 'copyAllCertificateData',
        value: 'copyAllCertificateData',
        checked: true
      }
    });
    expect(spyOnChangeFn).toHaveBeenCalled();
  });

  it('should call onChange for copyExcludeLandings', () => {
    const onChangeFn = wrapper.find('copyCertificateConfirmPage').instance().props.onChange;
    const spyOnChangeFn = jest.spyOn(wrapper.find('copyCertificateConfirmPage').instance().props, 'onChange');
    onChangeFn({
      target: {
        name: 'copyExcludeLandings',
        value: 'copyExcludeLandings',
        checked: true
      }
    });
    expect(spyOnChangeFn).toHaveBeenCalled();
  });

  it('should call onChange for voidDocumentConfirm', () => {
    const onChangeFn = wrapper.find('copyCertificateConfirmPage').instance().props.onChange;
    const spyOnChangeFn = jest.spyOn(wrapper.find('copyCertificateConfirmPage').instance().props, 'onChange');
    onChangeFn({
      target: {
        name: 'voidDocumentConfirm',
        value: 'voidDocumentConfirm',
        checked: true
      }
    });
    expect(spyOnChangeFn).toHaveBeenCalled();
  });

  it('should call onSubmit', () => {
    const submitFn = wrapper.find('copyCertificateConfirmPage').instance().props.onSubmit;
    const spyOnSubmit = jest.spyOn(wrapper.find('copyCertificateConfirmPage').instance().props,'onSubmit');
    submitFn();
    expect(spyOnSubmit).toHaveBeenCalled();
  });

  it('should handle on change events', () => {
    wrapper.find('Radio').first().find('input[type=\'radio\']').simulate('change', { target: { checked: true, name: 'my-radio', value: true }});
    expect(wrapper.find('copyCertificateConfirmPage').state()['my-radio']).toBeTruthy();
  });


  it('should show error if no option',() => {
    const store = _.cloneDeep(storeDefaults);

    store.errors = {
     errors: [{ 'targetName': 'copyDocumentAcknowledged', 'text': 'Check the acknowledgement to continue'},
               {'targetName': 'voidOriginal', 'text': 'Select an option to continue'}
              ]
    };

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <CopyCertificateConfirmPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    let ErrorIsland = wrapper.find('div#errorIsland');
    expect(ErrorIsland.exists()).toBeTruthy();
    expect(wrapper.find('ul.error-summary-list li a[href="#voidOriginal"]').text()).toEqual('Select an option to continue');
    expect(wrapper.find('ul.error-summary-list li a[href="#copyDocumentAcknowledged"]').text()).toEqual('Check the acknowledgement to continue');
});



  it('should clear errors on component will unmount', () => {
    const mockDispatchClearErrors = jest.fn();

    new CopyCertificateConfirmPage.WrappedComponent({
      match: {
        params: {
          documentNumber: ''
        }
      },
      unauthorised: true,
      clearErrors: mockDispatchClearErrors
    }).componentWillUnmount();

    expect(mockDispatchClearErrors).toHaveBeenCalled();
  });

  it('should push history for component did mount', () => {
    const mockPush = jest.fn();

    new CopyCertificateConfirmPage.WrappedComponent({
      match: {
        params: {
          documentNumber: '',
        },
      },
      unauthorised: true,
      history: {
        push: mockPush,
      },
    }).componentDidMount();

    expect(mockPush).toHaveBeenCalled();
  });

  it('should push history for component did update', () => {
    const mockPush = jest.fn();

    new CopyCertificateConfirmPage.WrappedComponent({
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

  describe('loadData', () => { 
    const store = {
      dispatch: () => {
        return new Promise((res) => {
          res();
        });
      }
    };

    const documentNumber = 'some-document-number';

    it('will call all methods needed to load the component', () => {
      copyCertificateConfirmPage.documentNumber = documentNumber;

      copyCertificateConfirmPage.loadData(store);

      expect(unauthorisedCopyDocument).toHaveBeenCalled();
    });
  });


});


