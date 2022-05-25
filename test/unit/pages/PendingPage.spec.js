import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { component as PendingPage } from '../../../src/client/pages/exportCertificates/PendingPage';
import PendingPageComponent from '../../../src/client/pages/exportCertificates/PendingPage';
import { getExportCertificateFromParams } from '../../../src/client/actions';
import { render } from '@testing-library/react';

jest.mock('../../../src/client/actions');

let wrapper;
const mockStore = configureStore();

const getWrapper = () => {
  const store = mockStore({
    exportCertificate: {
      documentNumber: 'GBR-2020-CC-89118C4DC',
    },
    config: {
      offlineValidationTime: '30',
    }
  });

  const props = {
    route: {
      title: 'Create a UK catch certificate for exports',
    },
    currentUri: '/catch-certificate-pending',
    journey: 'catchCertificate',
    match: {
      params: {
        documentNumber: 'GBR-2020-CC-89118C4DC',
      },
    },
    config: {
      offlineValidationTime: '30',
    },
  };

  const mountedWrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <PendingPage {...props} />
      </MemoryRouter>
    </Provider>
  );
  return mountedWrapper;
};

describe('Pending page', () => {
  beforeEach(() => {
    wrapper = getWrapper();
  });

  it('should render pending page', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render document number', () => {
    expect(wrapper.find('#documentNumber').text()).toEqual(
      'GBR-2020-CC-89118C4DC'
    );
  });

  it('should render PageTitle with the correct text', () => {
    expect(
      wrapper
        .find(
          "PageTitle[title='Catch certificate pending - Create a UK catch certificate - GOV.UK']"
        )
        .exists()
    ).toBeTruthy();
  });

  it('should render Panel with the correct text', () => {
    expect(
      wrapper
        .find("Panel[panelTitle='The catch certificate is being processed']")
        .exists()
    ).toBeTruthy();
  });

  it('should render Link to the correct path', () => {
    expect(
      wrapper
        .find("Link[to='/create-catch-certificate/catch-certificates']")
        .exists()
    ).toBeTruthy();
  });

  it('should render paragraph with the correct text', () => {
    expect(wrapper.find('p').first().text()).toContain(
      'Processing should take no more than 30 minutes'
    );
  });

  it('should render lists item with the correct text', () => {
    expect(wrapper.find('ListItem').at(0).text()).toBe(
      'Find the document in the ‘Completed’ list on your exporter dashboard.'
    );
    expect(wrapper.find('ListItem').at(1).text()).toContain(
      'Download the catch certificate by selecting ‘View’.'
    );
    expect(wrapper.find('ListItem').at(2).text()).toBe(
      'if you are using Firefox as an internet browser, please ensure JavaScript is enabled in order to view and download the certificate'
    );
    expect(wrapper.find('ListItem').at(3).text()).toBe(
      'if you are using a mobile device, please ensure you have installed a PDF viewer'
    );
    expect(wrapper.find('ListItem').at(4).text()).toBe(
      "Email the catch certificate to the importer.It is the importers responsibility to submit the document to the import control authority where your export will enter the EU. The importing authority will complete and sign their section of the document at the Border Inspection Post (BIP)."
    );
    expect(wrapper.find('ListItem').at(5).text()).toBe(
      'Find the document (labelled ‘Failed’) in the ‘In progress’ list on your exporter dashboard.'
    );
    expect(wrapper.find('ListItem').at(6).text()).toBe(
      'View the validation failure reasons by selecting ‘Continue’.'
    );
    expect(wrapper.find('ListItem').at(7).text()).toBe(
      'Use the error messages and guidance to help amend the document and/or to re-submit.'
    );
  });

  it('should redirect to the dashboard page when there is no required data', async () => {
    const mockPush = jest.fn();
    const mockGetPendingDocument = jest.fn();
    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
      },
      currentUri: '/catch-certificate-pending',
      journey: 'catchCertificate',
      getPendingDocument: mockGetPendingDocument,
      match: {
        params: {
          documentNumber: 'GBR-2020-CC-89118C4DC',
        },
      },
      history: {
        push: mockPush,
      },
      pendingDocument: false,
      config: {
        offlineValidationTime: '30',
      },
    };

    await new PendingPage.WrappedComponent(props).componentDidMount();
    expect(mockGetPendingDocument).toHaveBeenCalledWith(
      'GBR-2020-CC-89118C4DC'
    );
    expect(mockPush).toHaveBeenCalledWith(
      '/create-catch-certificate/catch-certificates'
    );
  });

  it('should not redirect to the dashboard page when there is required data', async () => {
    const mockPush = jest.fn();
    const mockGetPendingDocument = jest.fn();
    const props = {
      route: {
        title: 'Create a UK catch certificate for exports',
      },
      currentUri: '/catch-certificate-pending',
      journey: 'catchCertificate',
      getPendingDocument: mockGetPendingDocument,
      match: {
        params: {
          documentNumber: 'GBR-2020-CC-89118C4DC',
        },
      },
      history: {
        push: mockPush,
      },
      pendingDocument: true,
      config: {
        offlineValidationTime: '30',
      },
    };

    await new PendingPage.WrappedComponent(props).componentDidMount();
    expect(mockGetPendingDocument).toHaveBeenCalledWith(
      'GBR-2020-CC-89118C4DC'
    );
    expect(mockPush).not.toHaveBeenCalledWith(
      '/create-catch-certificate/catch-certificates'
    );
  });

  it('should take snapshot for the whole page',() => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});

describe('Pending page, loadData', () => {
  const store = { dispatch: jest.fn() };

  beforeEach(() => {
    getExportCertificateFromParams.mockReset();
    getExportCertificateFromParams.mockReturnValue({
      type: 'GET_PENDING_DOCUMENT',
    });
  });

  it('should call the getExportCertificateFromParams to load the component', () => {
    PendingPageComponent.queryParams = {
      documentNumber: 'GBR-2020-CC-89118C4DC',
    };
    PendingPageComponent.loadData(store);

    expect(getExportCertificateFromParams).toHaveBeenCalledTimes(1);
    expect(getExportCertificateFromParams).toHaveBeenCalled();
  });

  it('should not call the getExportCertificateFromParams to load the component when there is no queryParams', () => {
    PendingPageComponent.queryParams = {};
    PendingPageComponent.loadData(store);

    expect(getExportCertificateFromParams).not.toHaveBeenCalled();
  });
});
