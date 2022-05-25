import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import * as React from 'react';
import { component as ImproveServicePage } from '../../../src/client/pages/ImproveServicePage';
import ImproveServicePageComponent from '../../../src/client/pages/ImproveServicePage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import { getAllUserAttributes } from '../../../src/client/actions/userAttributes.actions';

jest.mock('../../../src/client/actions/userAttributes.actions');

const mockStore = configureStore([
  thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({});
        });
      },
    },
  }),
]);

let wrapper;
const mockGoBack = jest.fn();

const getWrapper = (name, language) => {
  const store = mockStore({
    config: {
      feedbackUrl: '/some-feedback-url',
    },
    userAttributes: [
      {
        name: name,
        value: language,
        modifiedAt: '2022-03-15T21:47:10.755Z',
      },
    ],
  });
  const props = {
    route: {
      title: '',
      previousUri: '/create-catch-certificate/catch-certificates',
    },
    history: {
      goBack: mockGoBack,
    },
  };

  wrapper = mount(
    <Provider store={store}>
      <ImproveServicePage {...props} />
    </Provider>
  );

  return wrapper;
};

describe('Improve service page in English', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementsByClassName').mockReturnValue([
      {
        title: '',
        href: '',
      },
    ]);

    wrapper = getWrapper('language', 'en_UK');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle clicking back link', () => {
    wrapper.find('a[href=""]').simulate('click', { preventDefault: () => {} });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('will check if the anchor has the alt tag for service manual tag', () => {
    wrapper.find('a[alt="Opens service manual"]').simulate('click');
    expect(wrapper.find('a[alt="Opens service manual"]')).toBeTruthy();
  });

  it('will check if the anchor has the alt tag for feedback form', () => {
    wrapper.find('a[alt="Opens feedback form"]').simulate('click');
    expect(wrapper.find('a[alt="Opens feedback form"]')).toBeTruthy();
  });

  it('should render PageTitle with the correct text', () => {
    expect(
      wrapper
        .find("PageTitle[title='Service improvement plan - GOV.UK']")
        .exists()
    ).toBeTruthy();
  });

  it('should render page with the correct heading', () => {
    expect(wrapper.find('h1').first().text()).toContain(
      "How we're improving the service"
    );
  });

  it('should render page with the correct links and text', () => {
    expect(
      wrapper
        .find('a[href="https://www.gov.uk/service-manual/service-standard"]')
        .first()
        .text()
    ).toEqual('Digital Service Standard (opens in new tab)');
    expect(wrapper.find('a[href="/some-feedback-url"]').first().text()).toEqual(
      'feedback (opens in new tab)'
    );
  });

  it('should render update information about how this service is being improved', () => {
    expect(wrapper.find('p').at(0).text()).toBe(
      'The Fish Exports Service helps businesses operating in the UK produce documents that enable fish exports to the EU and certain other countries.'
    );
    expect(wrapper.find('p').at(1).text()).toBe('The service:');
    expect(wrapper.find('p').at(2).text()).toBe(
      'As part of continuous improvement, the service aims to:'
    );
    expect(wrapper.find('p').at(3).text()).toBe(
      'Your feedback (opens in new tab) will help us to improve this service.'
    );

    expect(wrapper.find('li').at(0).text()).toBe(
      'uses your information in a secure way'
    );
    expect(wrapper.find('li').at(1).text()).toBe(
      'is working towards the WCAG 2.1 AA accessibility standard'
    );
    expect(wrapper.find('li').at(2).text()).toBe(
      'uses technology that allows it to be improved over time'
    );
    expect(wrapper.find('li').at(3).text()).toBe(
      'aims to meet the Government’s Digital Service Standard (opens in new tab).'
    );

    expect(wrapper.find('li').at(4).text()).toBe(
      'address and fix identified, WCAG 2.1 AA non-compliant accessibility issues (priority 1)'
    );
    expect(wrapper.find('li').at(5).text()).toBe(
      'carry out continuous research to make sure you can complete the service first time, and make improvements where necessary (priority 2)'
    );
    expect(wrapper.find('li').at(6).text()).toBe(
      'continue to research and test the service to ensure your needs are addressed (priority 3)'
    );
  });

  it('should display the correct title for catch certificates', () => {
    wrapper.find('ImproveServicePage').setState({
      backRoute: '/create-catch-certificate',
    });

    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Service improvement plan - Create a UK catch certificate - GOV.UK'
    );
  });

  it('should display the correct title for processing statements', () => {
    wrapper.find('ImproveServicePage').setState({
      backRoute: '/create-processing-statement',
    });

    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Service improvement plan - Create a UK processing statement - GOV.UK'
    );
  });

  it('should display the correct title for storage documents', () => {
    wrapper.find('ImproveServicePage').setState({
      backRoute: '/create-storage-document',
    });
    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Service improvement plan - Create a UK storage document - GOV.UK'
    );
  });

  it('should generate snapshot for the Plane Details page', () => {
    const { container } = render(wrapper);

    expect(container).toMatchSnapshot();
  });
});

describe('Improve service page in Welsh', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementsByClassName').mockReturnValue([
      {
        title: '',
        href: '',
      },
    ]);

    wrapper = getWrapper('language', 'cy_UK');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should handle clicking back link', () => {
    wrapper.find('a[href=""]').simulate('click', { preventDefault: () => {} });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('will check if the anchor has the alt tag for service manual tag', () => {
    wrapper.find('a[alt="Opens service manual"]').simulate('click');
    expect(wrapper.find('a[alt="Opens service manual"]')).toBeTruthy();
  });

  it('will check if the anchor has the alt tag for feedback form', () => {
    wrapper.find('a[alt="Opens feedback form"]').simulate('click');
    expect(wrapper.find('a[alt="Opens feedback form"]')).toBeTruthy();
  });

  it('should render PageTitle with the correct text', () => {
    expect(
      wrapper
        .find("PageTitle[title='Cynllun gwella gwasanaeth - GOV.UK']")
        .exists()
    ).toBeTruthy();
  });

  it('should render page with the correct heading', () => {
    expect(wrapper.find('h1').first().text()).toContain(
      'Sut rydyn ni’n gwella’r gwasanaeth'
    );
  });

  it('should render page with the correct links and text', () => {
    expect(
      wrapper
        .find('a[href="https://www.gov.uk/service-manual/service-standard"]')
        .first()
        .text()
    ).toEqual(
      'Safon Gwasanaeth Digidol y Llywodraeth (yn agor mewn tab newydd)'
    );
    expect(wrapper.find('a[href="/some-feedback-url"]').first().text()).toEqual(
      'adborth (yn agor mewn tab newydd)'
    );
  });

  it('should render update information about how this service is being improved', () => {
    expect(wrapper.find('p').at(0).text()).toBe(
      'Mae’r Gwasanaeth Allforio Pysgod yn helpu busnesau sy’n gweithredu yn y DU i gynhyrchu dogfennau sy’n golygu bod modd allforio pysgod i’r UE ac i rai gwledydd eraill.'
    );
    expect(wrapper.find('p').at(1).text()).toBe('Mae’r gwasanaeth yn:');
    expect(wrapper.find('p').at(2).text()).toBe(
      'Er mwyn gwella’n barhaus, nod y gwasanaeth yw:'
    );
    expect(wrapper.find('p').at(3).text()).toBe(
      'Bydd eich adborth (yn agor mewn tab newydd) yn ein helpu i wella’r gwasanaeth hwn.'
    );

    expect(wrapper.find('li').at(0).text()).toBe(
      'defnyddio eich gwybodaeth mewn ffordd ddiogel'
    );
    expect(wrapper.find('li').at(1).text()).toBe(
      'gweithio tuag at safon hygyrchedd WCAG 2.1 AA'
    );
    expect(wrapper.find('li').at(2).text()).toBe(
      'defnyddio technoleg sy’n ei alluogi i wella dros amser'
    );
    expect(wrapper.find('li').at(3).text()).toBe(
      'Anelu at gyrraedd Safon Gwasanaeth Digidol y Llywodraeth (yn agor mewn tab newydd).'
    );

    expect(wrapper.find('li').at(4).text()).toBe(
      'canfod a datrys problemau hygyrchedd sydd ddim yn cydymffurfio â WCAG 2.1 AA (blaenoriaeth 1)'
    );
    expect(wrapper.find('li').at(5).text()).toBe(
      'gwneud gwaith ymchwil parhaus i wneud yn siŵr eich bod yn gallu cwblhau’r gwasanaeth y tro cyntaf, a gwneud gwelliannau lle bo angen (blaenoriaeth 2)'
    );
    expect(wrapper.find('li').at(6).text()).toBe(
      'parhau i ymchwilio a phrofi’r gwasanaeth fel ei fod yn cyflawni eich anghenion (blaenoriaeth 3)'
    );
  });

  it('should display the correct title for catch certificates', () => {
    wrapper.find('ImproveServicePage').setState({
      backRoute: '/create-catch-certificate',
    });

    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Cynllun gwella gwasanaeth - Create a UK catch certificate - GOV.UK'
    );
  });

  it('should display the correct title for processing statements', () => {
    wrapper.find('ImproveServicePage').setState({
      backRoute: '/create-processing-statement',
    });

    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Cynllun gwella gwasanaeth - Create a UK processing statement - GOV.UK'
    );
  });

  it('should display the correct title for storage documents', () => {
    wrapper.find('ImproveServicePage').setState({
      backRoute: '/create-storage-document',
    });
    expect(wrapper.find('PageTitle').prop('title')).toBe(
      'Cynllun gwella gwasanaeth - Create a UK storage document - GOV.UK'
    );
  });
});

describe('Improve service page - with no title', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementsByClassName').mockReturnValue([undefined]);

    wrapper = getWrapper('language', 'en_UK');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render', () => {
    expect(wrapper).toBeDefined();
  });
});

describe('Improve service page - with no previously selected language', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementsByClassName').mockReturnValue([undefined]);

    wrapper = getWrapper();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render', () => {
    expect(wrapper).toBeDefined();
  });
});

describe('Improve service page, loadData', () => {
  const store = { dispatch: jest.fn() };

  beforeEach(() => {
    getAllUserAttributes.mockReset();
    getAllUserAttributes.mockReturnValue({ type: 'GET_ALL_USER_ATTRIBUTES' });
  });

  it('should call the getAllUserAttributes to load the component', () => {
    ImproveServicePageComponent.loadData(store);

    expect(getAllUserAttributes).toHaveBeenCalledTimes(1);
    expect(getAllUserAttributes).toHaveBeenCalled();
  });
});