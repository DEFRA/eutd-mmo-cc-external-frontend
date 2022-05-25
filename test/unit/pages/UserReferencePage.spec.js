import _ from 'lodash';
import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { component as UserReferencePage } from '../../../src/client/pages/common/UserReferencePage';
import userReference from '../../../src/client/pages/common/UserReferencePage';
import {
  getUserReference,
  clearUserReference,
} from '../../../src/client/actions/user-reference.actions';
import { BackLink } from 'govuk-react';
import { render } from '@testing-library/react';

jest.mock('../../../src/client/actions/user-reference.actions');

beforeEach(() => {
  getUserReference.mockReturnValue({ type: 'GET_USER_REFERENCE' });
  clearUserReference.mockReturnValue({ type: 'CLEAR_USER_REFERENCE' });
});

describe('Add user reference to document', () => {

  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  let mockPush;

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      header: 'Add your reference for this export',
      path: '/create-catch-certificate/:documentNumber/add-your-reference',
      previousUri: '/create-catch-certificate/:documentNumber/progress',
      nextUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      journey: 'catchCertificate',
      journeyText: 'catchCertificate'
    },
    match: {
      params: {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    t: jest.fn()
  };

  const documentNumber = 'GBR-23423-4234234';

  beforeEach(() => {
    const store = mockStore({
      reference: { userReference: 'My Reference' },
      confirmCopyDocument: { copyDocumentAcknowledged: false, voidDocumentConfirm: false },
      errors: {},
      t: jest.fn()
    });

    window.scrollTo = jest.fn();

    const history = createMemoryHistory({ initialEntries: [`/create-catch-certificate/${documentNumber}/add-your-reference`] });

    mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path='/create-catch-certificate/:documentNumber/add-your-reference'>
            <UserReferencePage {...props}/>
          </Route>
        </Router>
      </Provider>
    );
  });

  it('should render user reference text input', () => {
    expect(wrapper.find('input#userReference').exists()).toBeTruthy();
  });

  it('should contain back button that goes to the progress page', () => {
    expect(
      wrapper.find('a[href$="/create-catch-certificate/GBR-23423-4234234/progress"]').exists()
    ).toBeTruthy();
  });

  it('will redirect to the progress uri when back link is clicked', () => {
    const previousUri = props.route.previousUri;
    const documentNumber = props.match.params.documentNumber;

    wrapper.find(BackLink).simulate('click');

    expect(mockPush).toHaveBeenCalledWith(
      previousUri.replace(':documentNumber', documentNumber)
    );
  });

  it('should handle submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
  });

  it('should handle on change events', () => {
    wrapper.find('input[name="userReference"]').simulate('change', {target: {name: 'userReference',  value: 'My Reference'}});
  });

  it('should handle on blur events', () => {
    wrapper.find('input[name="userReference"]').simulate('blur', { target: { name: 'userReference', value: 'My Reference 1' } });
    expect(wrapper.find('input[name="userReference"]').instance().value).toEqual('My Reference 1');
  });

  it('should handle continue button click event', () => {
    wrapper.setState({selected: '/create-catch-certificate/catch-certificates'});
    wrapper.find('button#continue').simulate('click');
});

  it('should handle save as draft event', () => {
    wrapper.find('button#saveAsDraft').simulate('click');
  });

  it('should have a label with a userReference for attribute', () => {
    expect(wrapper.find('label').props()['htmlFor']).toBeDefined();
    expect(wrapper.find('label').props()['htmlFor']).toBe('userReference');
  });

  it('should not display copy document notification', () => {
    expect(wrapper.find('NotificationBanner').exists()).toBeFalsy();
  });

  it('should have the correct form parameters', () => {
    const currentUri = props.route.path.replace(':documentNumber', documentNumber);
    const nextUri = props.route.nextUri.replace(':documentNumber', documentNumber);
    const form = wrapper.find('Form');

    expect(form.prop('action')).toBe('/orchestration/api/v1/userReference');
    expect(form.prop('nextUrl')).toBe(nextUri);
    expect(form.prop('currentUrl')).toBe(currentUri);
    expect(form.prop('documentNumber')).toBe(documentNumber);
  });
});

describe('When redirected from copy confirm document page', () => {
  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const storeDefaults = {
    reference: { userReference: 'My Reference' },
    confirmCopyDocument: { copyDocumentAcknowledged: true, voidDocumentConfirm: false },
    errors: {},
    t: jest.fn()
  };

  const props = {
    history: [],
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      header: 'Add your reference for this export',
      path: '/create-catch-certificate/:documentNumber/add-your-reference',
      previousUri: '/create-catch-certificate/catch-certificates',
      nextUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      journey: 'catchCertificate',
      journeyText: 'catch certificate'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    },
    t: jest.fn()
  };


  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should display copy document notification for catch certificate', () => {
    wrapper = mount(
      <Provider store={mockStore(storeDefaults)}>
        <MemoryRouter>
          <UserReferencePage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('This draft was created by copying document undefined. You are reminded that you must not use a catch certificate or landing data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.');
  });

  it('should display copy document notification with a VOID message for catch certificate', () => {
    const store = _.cloneDeep(storeDefaults);

    store.confirmCopyDocument.voidDocumentConfirm = true;

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <UserReferencePage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('This draft was created by copying a document that has now been voided. You are reminded that you must not use a catch certificate or landing data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.');
  });

  it('should not display copy document notification with a VOID message', () => {
    const store = _.cloneDeep(storeDefaults);

    store.confirmCopyDocument.copyDocumentAcknowledged = false;
    store.confirmCopyDocument.voidDocumentConfirm = true;

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <UserReferencePage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('NotificationBanner').exists()).toBeFalsy();
  });

});

describe('When redirected from copy comfirm document page for a processing statement', () => {
  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  const storeDefaults = {
    reference: { userReference: 'My Reference' },
    confirmCopyDocument: { copyDocumentAcknowledged: true, voidDocumentConfirm: false },
    errors: {}
  };

  const props = {
    history: [],
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      header: 'Add your reference for this export',
      path: '/create-catch-certificate/:documentNumber/add-your-reference',
      previousUri: '/create-catch-certificate/catch-certificates',
      nextUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      journey: 'processingStatement',
      journeyText: 'processing statement'
    },
    match : {
      params : {
        documentNumber: 'GBR-23423-4234234'
      }
    }
  };

  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should display copy document notification for processing statement', () => {
    wrapper = mount(
      <Provider store={mockStore(storeDefaults)}>
        <MemoryRouter>
          <UserReferencePage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('This draft was created by copying document undefined. You are reminded that you must not use a processing statement or data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.');
  });

  it('should display copy document notification with a VOID message for processing statement', () => {
    const store = _.cloneDeep(storeDefaults);

    store.confirmCopyDocument.voidDocumentConfirm = true;

    wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <UserReferencePage {...props}/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('NotificationBanner').exists()).toBeTruthy();
    expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe('This draft was created by copying a document that has now been voided. You are reminded that you must not use a processing statement or data for catches that have already been exported as this is a serious offence and may result in enforcement action being taken.');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('loadData', () => {
  const store = {
    dispatch: () => {
      return new Promise((res) => {
        res();
      });
    }
  };

  const journey = 'storageDocument';
  const documentNumber = 'some-document-number';

  beforeEach(() => {
    getUserReference.mockReturnValue({ type: 'save_user_reference' });
  });

  it('will call all methods needed to load the component', async () => {
    userReference.documentNumber = documentNumber;

    await userReference.loadData(store, journey);

    expect(getUserReference).toHaveBeenCalledWith(documentNumber);
  });

});

describe('When component did update service call fails', () => {

  it('should push history to forbidden page for unauthorised attempt when reference.unauthorised is true', () => {
    const mockPush = jest.fn();

    new UserReferencePage.WrappedComponent({
      match: {
        params: {
          documentNumber: 'GBR-23423-4234234'
        }
      },
      reference: { unauthorised: true },
      history: {
        push: mockPush
      },
      route: {
        title: 'Create a UK catch certificate - GOV.UK',
        header: 'Add your reference for this export',
        path: '/create-catch-certificate/:documentNumber/add-your-reference',
        previousUri: '/create-catch-certificate/catch-certificates',
        nextUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
        journey: 'catchCertificate',
        journeyText: 'Catch Certificate'
      }
    }).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });
});

describe('UserReference with errors', () => {

  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  let mockPush;

  const props = {
    route: {
      title: 'Create a UK catch certificate - GOV.UK',
      header: 'commonAddYourReferenceForThisExport',
      path: '/create-catch-certificate/:documentNumber/add-your-reference',
      previousUri: '/create-catch-certificate/:documentNumber/progress',
      nextUri: '/create-catch-certificate/:documentNumber/add-exporter-details',
      saveAsDraftUri: '/create-catch-certificate/catch-certificates',
      journey: 'catchCertificate',
      journeyText: 'catch certificate'
    },
    match: {
      params: {
        documentNumber: 'GBR-23423-4234234'
      }
    }
  };

  const documentNumber = 'GBR-23423-4234234';
  const store = mockStore({
    reference: {
      userReference: 'My Reference',
      error: { userReference: 'error.userReference.string.pattern.base' },
    },
    confirmCopyDocument: {
      copyDocumentAcknowledged: false,
      voidDocumentConfirm: false,
    },
    errors: {},
  });

  beforeEach(() => {
    window.scrollTo = jest.fn();

    const history = createMemoryHistory({ initialEntries: [`/create-catch-certificate/${documentNumber}/add-your-reference`] });

    mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);
    wrapper = mount(
     <Provider store={store}>
        <Router history={history}>
          <Route path='/create-catch-certificate/:documentNumber/add-your-reference'>
            <UserReferencePage {...props}/>
          </Route>
        </Router>
      </Provider>
    );
  });

  it('should show errorIsland', () => {
    wrapper.find('input[name="userReference"]').simulate('blur', { target: { name: 'userReference', value: '<?!@##' } });
    wrapper.setState({selected: '/create-catch-certificate/catch-certificates'});
    wrapper.find('button#continue').simulate('click');
    expect(wrapper).toBeDefined();
    expect(wrapper.find('input[name="userReference"]').instance().value).toEqual('<?!@##');
    expect(wrapper.find('ErrorIsland li').at(0).text()).toEqual('Enter your reference as a combination of letters, numbers, hyphens, slashes and full stops');
  });
});

describe('UserReference back link Navigation for storage Notes Journey', () => {

  let wrapper;

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
      post: () => {
        return new Promise((res) => {
          res({});
        });
      }
    }
  })]);

  let mockPush;

  const props = {
    route: {
      title: 'Create a UK storage document - GOV.UK',
      header: 'commonAddYourReferenceForThisExport',
      path: '/create-storage-document/:documentNumber/add-your-reference',
      previousUri: '/create-storage-document/:documentNumber/progress',
      nextUri: '/create-storage-document/:documentNumber/add-exporter-details',
      saveAsDraftUri: '/create-storage-document/catch-certificates',
      journey: 'storageNotes',
      journeyText: 'storageNotes'
    },
    match: {
      params: {
        documentNumber: 'GBR-23423-4234234'
      }
    }
  };

  const documentNumber = 'GBR-23423-4234234';
  const store = mockStore({
    reference: {},
    confirmCopyDocument: {},
    errors: {},
  });

  beforeEach(() => {
    window.scrollTo = jest.fn();

    const history = createMemoryHistory({ initialEntries: [`/create-storage-document/${documentNumber}/add-your-reference`] });

    mockPush = jest.spyOn(history, 'push');
    mockPush.mockReturnValue(null);
    wrapper = mount(
     <Provider store={store}>
        <Router history={history}>
          <Route path='/create-storage-document/:documentNumber/add-your-reference'>
            <UserReferencePage {...props}/>
          </Route>
        </Router>
      </Provider>
    );
  });

  it('should redirect to the SD progress page when back link is clicked in Storage document journey', () => {
    wrapper.find(BackLink).simulate('click');

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/create-storage-document/GBR-23423-4234234/progress');
  });

  it('should have a back to the progress page link', () => {
    expect(wrapper).toBeDefined();
    expect(wrapper.find('a[href="/create-storage-document/GBR-23423-4234234/progress"]').exists()).toBeTruthy();
  });
});
