import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import * as PrivacyStatementPage from '../../../src/client/pages/common/PrivacyStatementPage';
import PrivacyStatementPageWrapper from '../../../src/client/pages/common/PrivacyStatementPage';
import { getAllUserAttributes } from '../../../src/client/actions/userAttributes.actions';

jest.mock('../../../src/client/actions/userAttributes.actions');

describe('Privacy page', () => {
  describe('when user has not Accepted privacy', () => {
    let wrapper;
    const mockStore = configureStore([thunk]);
    const mockPush = jest.fn();

    const getWrapper = (selectedLanguage) => {
      const store = mockStore({
        userAttributes: [
          {
            name: 'language',
            value: selectedLanguage,
          },
        ],
      });

      const props = {
        route: {
          alwaysShowPrivacyPage: true,
        },
        history: mockPush,
        saveUserAttribute: jest.fn()
      };

      window.scrollTo = jest.fn();

      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <PrivacyStatementPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      return wrapper;
    };

    it('should render the page in English if no language has been selected', () => {
      const store = mockStore({
        userAttributes: [],
      });

      const props = {
        route: {},
      };

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <PrivacyStatementPage.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(
        wrapper.find('PageTitle[title=\'Privacy - GOV.UK\']').exists()
      ).toBeTruthy();
    });

    it('should render the page successfully when the selected language is English', () => {
      const wrapper = getWrapper('en_UK');
      expect(wrapper).toBeDefined();
      expect(
        wrapper.find('PageTitle[title=\'Privacy - GOV.UK\']').exists()
      ).toBeTruthy();
    });

    it('should render the page successfully when the selected language is Welsh', () => {
      const wrapper = getWrapper('cy_UK');
      expect(wrapper).toBeDefined();
      expect(
        wrapper
          .find('PageTitle[title=\'Tudalen Preifatrwydd - GOV.UK\']')
          .exists()
      ).toBeTruthy();
    });

    it('should  display Accept and continue button when privacy has NOT been accepted', () => {
      const englishWrapper = getWrapper('en_UK');
      const welshWrapper = getWrapper('cy_UK');
      expect(englishWrapper.find('#privacyNotice').exists()).toBeTruthy();
      expect(welshWrapper.find('#privacyNotice').exists()).toBeTruthy();
    });

    it('should take the snapshot of the page in English', () => {
      const wrapper = getWrapper('en_UK');
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });

    it('should handle a submit event', () => {
      const wrapper = getWrapper('en_UK');

      expect(
        wrapper.find('form').simulate('submit', { preventDefault() {} })
      ).toBeTruthy();
    });

    describe('when user has Accepted privacy', () => {
      let wrapper;
      const mockStore = configureStore([thunk]);
      const goBack = jest.fn();

      const getWrapper = (selectedLanguage) => {
        const store = mockStore({
          userAttributes: [
            { name: 'language', value: selectedLanguage },
            { name: 'privacy_statement', value: true },
          ],
        });

        const props = {
          route: {
            history: {
              goBack: goBack(),
            },
            alwaysShowPrivacyPage: true
          },
        };

        window.scrollTo = jest.fn();

        wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <PrivacyStatementPage.default.component {...props} />
            </MemoryRouter>
          </Provider>
        );

        return wrapper;
      };

      it('should load successfully', () => {
        const wrapper = getWrapper();
        const englishWrapper = getWrapper('en_UK');
        const welshWrapper = getWrapper('cy_UK');

        expect(wrapper).toBeDefined();
        expect(englishWrapper).toBeDefined();
        expect(welshWrapper).toBeDefined();
      });

      it('should render the page successfully when the selected language is English', () => {
        const wrapper = getWrapper('en_UK');
        expect(wrapper).toBeDefined();
        expect(
          wrapper.find('PageTitle[title=\'Privacy - GOV.UK\']').exists()
        ).toBeTruthy();
      });
  
      it('should render the page successfully when the selected language is Welsh', () => {
        const wrapper = getWrapper('cy_UK');
        expect(wrapper).toBeDefined();
        expect(
          wrapper
            .find('PageTitle[title=\'Tudalen Preifatrwydd - GOV.UK\']')
            .exists()
        ).toBeTruthy();
      });

      it('should NOT display Accept and continue button when privacy has been accepted', () => {
        const wrapper = getWrapper();
        const englishWrapper = getWrapper('en_UK');
        const welshWrapper = getWrapper('cy_UK');

        expect(wrapper.find('#privacyNotice').exists()).toBeFalsy();
        expect(englishWrapper.find('#privacyNotice').exists()).toBeFalsy();
        expect(welshWrapper.find('#privacyNotice').exists()).toBeFalsy();
      });

      it('redirects to previous page when back button is clicked on English and Welsh page', () => {
        const englishWrapper = getWrapper('en_UK');
        const welshWrapper = getWrapper('cy_UK');
        englishWrapper.find('#back').at(0).simulate('click');
        welshWrapper.find('#back').at(0).simulate('click');
        expect(goBack).toHaveBeenCalled();
      });

      it('should render Redirect component if alwaysShowPrivacyPage is not set to true', () => {
        const store = mockStore({
          userAttributes: [
            { name: 'language', value: 'en_UK' },
            { name: 'privacy_statement', value: true },
          ],
        });
  
        const props = {
          route: {
            history: {
              goBack: goBack(),
            },
            alwaysShowPrivacyPage: false
          },
        };
  
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <PrivacyStatementPage.default.component {...props} />
            </MemoryRouter>
          </Provider>
        );
  
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Redirect').exists()).toBeTruthy();
      });
    });
  });

  it('should call getAllUserAttributes action to load the component', () => {
    const store = { dispatch: jest.fn() };

    getAllUserAttributes.mockReturnValue({ type: 'GET_ALL_USER_ATTRIBUTES' });
  
    PrivacyStatementPageWrapper.loadData(store);

    expect(getAllUserAttributes).toHaveBeenCalled();
  });
});
