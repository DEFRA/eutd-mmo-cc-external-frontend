import _ from 'lodash';
import { mount } from 'enzyme';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as Dashboard from '../../../src/client/pages/common/document/DashboardPage';
import { render } from '@testing-library/react';

describe('Journey dashboard page', () => {

  jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-01-01').getTime());

  describe('When viewing the Catch Certificate Dashboad', () => {

    const storeDefaults = {
      addedSpeciesPerUser: [],
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      accountdetails: {},
      userdetails: {},
      global: {
        allFish: [],
        allVessels: []
      },
      documents: {
        inProgress: [],
        completed: []
      },
      userAttributes: [{
        name: 'privacy_statement',
        value: true,
        modifiedAt: '2019-08-23'
      }],
      config: {
        maximumConcurrentDrafts: 10
      },
      notification: {
        title: 'This is the title',
        message: 'This is a message'
      }
    };

    const defaultProps = {
      route: {
        title: 'Create a UK catch certificate for exports',
        previousUri: '/export-certificates/add-exporter-details',
        nextUri: ':documentNumber/add-your-reference',
        confirmUri: '/add-company-details',
        confirmVoidDocumentUri: '/void-this-catch-certificate',
        journey: 'catchCertificate',
        journeyText: 'catch certificate',
        copyUri: ':documentNumber/copy-this-catch-certificate',
        summaryUri: ':documentNumber/check-your-information',
        progressUri: ':documentNumber/progress'
      }
    };

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res({
              data: {
                inProgress: [],
                completed: []
              }
            });
          });
        }
      },
      dynamixApi: {
        get: () => {
          return new Promise(res => {
            res();
          });
        }
      }
    })]);

    beforeEach(() => {
      window.scrollTo = jest.fn();
    });

    it('should show the create button if we have not reached the maximum number of concurrent drafts', () => {
      const wrapper = mount(
        <Provider store={mockStore(storeDefaults)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('.button-start').length).toBe(1);
    });

    it('should not show the create button if we have reached the maximum number of concurrent drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'}
      ];

      store.config.maximumConcurrentDrafts = 2;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('.button-start').length).toBe(0);
    });

    it('should show help text telling the user how many concurrent drafts they can have', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'}
      ];

      store.config.maximumConcurrentDrafts = 2;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('.multiple-draft-info').length).toBe(1);
      expect(wrapper.find('.multiple-draft-info').text()).toContain('A maximum of 2 draft catch certificates is allowed at any time.');
    });

    it('should show a notification banner when a user reaches a maximum number of catch certificates drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' },
        { documentNumber: '2' },
      ];

      store.config.maximumConcurrentDrafts = 2;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('.notification-banner').text()).toContain(
        'You have reached the maximum limit allowed for draft catch certificates.'
      );
    });

    it('should show a notification telling the user of any service message if any exsists', () => {
        const store = _.cloneDeep(storeDefaults);

        const wrapper = mount(
          <Provider store={mockStore(store)}>
            <MemoryRouter>
              <Dashboard.default.component {...defaultProps} />
            </MemoryRouter>
          </Provider>
        ).render();

        expect(wrapper).toBeDefined();
        expect(wrapper.find('.notification-message').length).toBe(1);
    });

    it('should not show a notification telling the user of any service messages when the notification is empty', () => {
      const store = _.cloneDeep(storeDefaults);

      store.notification = {};

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('.notification-message').length).toBe(0);
    });

    it('should show the void link if we have a completed document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="/void-this-catch-certificate"]').text()).toEqual('Void catch certificate 1 ');
    });

    it('should not show the copy link on completed documents, if we have reached the maximum number of concurrent drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'},
        {documentNumber: '3'},
        {documentNumber: '4'},
        {documentNumber: '5'}
      ];

      store.config.maximumConcurrentDrafts = 5;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-catch-certificate"]').length).toBe(0);
    });

    it('should not show the copy link if the copyUri is undefined', () => {
      const store = _.cloneDeep(storeDefaults);
      const props = _.cloneDeep(defaultProps);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      props.route.copyUri = undefined;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-catch-certificate"]').length).toBe(0);
    });

    it('should show the copy link if we have a completed document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-catch-certificate"]').text()).toEqual('Copy catch certificate 1 ');
    });

    it('will check the amount of govuk-visually-hidden there is on progress block', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('Table[name="catchCertificate-progress-certificates"] .govuk-visually-hidden').length).toBe(2);
    });

    it('should show a pending status for a pending document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false, status: 'PENDING'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('strong.pendingTag').exists()).toBeTruthy();
    });

    it('should show a locked status for a document locked by admin', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false, status: 'LOCKED'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('strong.lockedTag').exists()).toBeTruthy();
    });

    it('should show a draft status for a draft document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false, status: 'DRAFT'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('strong.draftInactiveTag').exists()).toBeTruthy();
    });

    it('should show a failed status for a failed document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: true }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('strong.failedTag').exists()).toBeTruthy();
    });

    it('will check the amount of govuk-visually-hidden there is on complete block', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find('Table[name="catchCertificate-completed-certificates"] .govuk-visually-hidden').length).toBe(3);
    });

    it('should show a message to notify the user to regularly refresh the page', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('p.multiple-draft-info').exists()).toBeTruthy();
      expect(wrapper.find('p.multiple-draft-info').text()).toContain('For pending submissions, refresh regularly to see updates.');
      expect(wrapper.find('p.multiple-draft-info').text()).toContain('For failed submissions, continue the document to view resolution instructions.');
    });

    it('should show a continue button with a href', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/progress');
    });

    it('should not show a continue button when status is PENDING', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false, status: 'PENDING'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeFalsy();
    });

    it('should show a continue button with a href linking to the progress when defined', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false }
      ];

      store.saveAsDraft = {
        currentUri: {
          '1' : ':documentNumber/how-does-the-export-leave-the-uk'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/progress');
    });

    it('should show a continue button with a href linking to the progressUri when a saveAsDraft is defined for the current document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false }
      ];

      store.saveAsDraft = {
        currentUri: {
          '1' : ':documentNumber/how-does-the-export-leave-the-uk'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/progress');
    });

    it('should show a continue button with a href linking to the check your answers page if document is a FAILED certificate application', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: true }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/check-your-information');
    });

    it('should show a continue button with a href linking to the summary page when document is a FAILED certificate application but a save a draft link is defined', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: true }
      ];

      store.saveAsDraft = {
        currentUri: {
          '1' : ':documentNumber/how-does-the-export-leave-the-uk'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/check-your-information');
    });

    it('should show a continue button with a href linking to the check your answers page if document is a LOCKED by admin and has a save as draft', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', status: 'LOCKED' }
      ];

      store.saveAsDraft = {
        currentUri: {
          '1' : ':documentNumber/how-does-the-export-leave-the-uk'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/check-your-information');
    });

    it('should show a continue button with a href linking to the check your answers page if document is a LOCKED by admin and has a save as draft and is a failed document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', status: 'LOCKED', isFailed: true }
      ];

      store.saveAsDraft = {
        currentUri: {
          '1' : ':documentNumber/how-does-the-export-leave-the-uk'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/check-your-information');
    });

    it('should show a continue button with a href linking to the check your answers page if document is a LOCKED by admin', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', status: 'LOCKED' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/check-your-information');
    });

    it('should not show a delete button when status is LOCKED', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false, status: 'LOCKED'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#delete').exists()).toBeFalsy();
    });

    it('should not show a message to notify the user to regularly refresh the page for the processing statement journey', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      const props = {
        route: {
          ...defaultProps.route,
          journey: 'processingStatement'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('p.multiple-draft-info').text()).not.toContain('For pending submissions, refresh regularly to see updates.');
    });

    it('should not show a message to notify the user to regularly refresh the page for the storage document journey', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      const props = {
        route: {
          ...defaultProps.route,
          journey: 'storageNotes'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('p.multiple-draft-info').text()).not.toContain('For pending submissions, refresh regularly to see updates.');
    });

    it('should not show a message to notify the user to regularly refresh the page for the journey is undefined', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      const props = {
        route: {
          ...defaultProps.route,
          journey: undefined
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('p.multiple-draft-info').text()).not.toContain('For pending submissions, refresh regularly to see updates.');
    });

    it('should display a pageTitle that matches the naming convention of other pages', () => {

      const wrapper = mount(
        <Provider store={mockStore(storeDefaults)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(Helmet).prop('title')).toBe('Catch certificates - Create a UK catch certificate for exports');
    });

    it('should display a pageTitle that matches the naming convention of other pages with an indivduals name', () => {
      const store = _.cloneDeep(storeDefaults);

      store.userdetails = {
        model: [
          {
            firstName: 'Isaac',
            lastName: 'Babalola'
          }
        ]
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(Helmet).prop('title')).toBe('Isaac Babalola: catch certificates - Create a UK catch certificate for exports');
    });

    it('should display a pageTitle that matches the naming convention of other pages with an organisations name', () => {
      const store = _.cloneDeep(storeDefaults);

      store.accountdetails = {
        model: [
          {
            name: 'Fish Company'
          }
        ]
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find(Helmet).prop('title')).toBe('Fish Company: catch certificates - Create a UK catch certificate for exports');
    });

    it('should have correct name attribute on in progress documents table', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('Table').prop('name')).toBe('catchCertificate-progress-certificates');
    });

    it('should have correct name attribute on progress documents section when there are no progress documents', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('div[name="catchCertificate-progress-certificates"]').prop('name')).toBe('catchCertificate-progress-certificates');
    });

    it('should have correct name attribute on completed documents table', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('Table').prop('name')).toBe('catchCertificate-completed-certificates');
    });

    it('should have correct name attribute on completed documents section when there are no completed documents', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('div[name="catchCertificate-completed-certificates"]').prop('name')).toBe('catchCertificate-completed-certificates');
    });

    it('should have correct external link for guidance on exporting fish', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const guidanceOnExportingFishLink = wrapper.find('a[href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal"]');
      expect(guidanceOnExportingFishLink.text()).toBe('Guidance on exporting fish (gov.uk) (opens in new tab)');
      expect(guidanceOnExportingFishLink.exists()).toBeTruthy();
      expect(guidanceOnExportingFishLink.prop('rel')).toBe('noopener noreferrer');
      expect(guidanceOnExportingFishLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for prior notification form', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const priorNotificationFormLink = wrapper.find('a[href="https://www.gov.uk/government/publications/give-prior-notification-to-land-fish-in-the-eu"]');
      expect(priorNotificationFormLink.text()).toBe('Prior notification form (gov.uk) (opens in new tab)');
      expect(priorNotificationFormLink.exists()).toBeTruthy();
      expect(priorNotificationFormLink.prop('rel')).toBe('noopener noreferrer');
      expect(priorNotificationFormLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/government/publications/give-prior-notification-to-land-fish-in-the-eu"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/government/publications/give-prior-notification-to-land-fish-in-the-eu"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for pre-landing declaration', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const preLandingDeclarationLink = wrapper.find('a[href="https://www.gov.uk/government/publications/make-a-pre-landing-declaration-to-land-fish-in-an-eu-port"]');
      expect(preLandingDeclarationLink.text()).toBe('Pre-landing declaration (gov.uk) (opens in new tab)');
      expect(preLandingDeclarationLink.exists()).toBeTruthy();
      expect(preLandingDeclarationLink.prop('rel')).toBe('noopener noreferrer');
      expect(preLandingDeclarationLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/government/publications/make-a-pre-landing-declaration-to-land-fish-in-an-eu-port"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/government/publications/make-a-pre-landing-declaration-to-land-fish-in-an-eu-port"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for create a UK processing statement', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const createAUKProcessingStatementLink = wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-processing-statement"]');
      expect(createAUKProcessingStatementLink.text()).toBe('Create a UK processing statement (gov.uk) (opens in new tab)');
      expect(createAUKProcessingStatementLink.exists()).toBeTruthy();
      expect(createAUKProcessingStatementLink.prop('rel')).toBe('noopener noreferrer');
      expect(createAUKProcessingStatementLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-processing-statement"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-processing-statement"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for create a UK storage document', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const createAUKStorageDocumentLink = wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-storage-document"]');
      expect(createAUKStorageDocumentLink.text()).toBe('Create a UK storage document (gov.uk) (opens in new tab)');
      expect(createAUKStorageDocumentLink.exists()).toBeTruthy();
      expect(createAUKStorageDocumentLink.prop('rel')).toBe('noopener noreferrer');
      expect(createAUKStorageDocumentLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-storage-document"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-storage-document"] span').text()).toBe('(opens in new tab)');
    });
    it('should take a snapshot of the whole page with drafts, pending, failed and completed documents', () => {
      const store = _.cloneDeep(storeDefaults);
  
      store.documents.inProgress = [
        { documentNumber: '1', isFailed: true, status: 'FAILED'},
        { documentNumber: '2', isFailed: false, status: 'PENDING'},
        { documentNumber: '3', isFailed: false, status: 'PENDING'},
        { documentNumber: '4', isFailed: false, status: 'DRAFT'},
        { documentNumber: '5', isFailed: true, status: 'LOCKED' }
      ];
  
      store.documents.completed = [
        { documentNumber: '6', documentUri: '/' }
      ];
  
      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );
  
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });
  });

  describe('When viewing the Processing Statement Dashboard', () => {

    const storeDefaults = {
      addedSpeciesPerUser: [],
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      accountdetails: {},
      userdetails: {},
      global: {
        allFish: [],
        allVessels: []
      },
      documents: {
        inProgress: [],
        completed: []
      },
      userAttributes: [{
        name: 'privacy_statement',
        value: true,
        modifiedAt: '2019-08-23'
      }],
      config: {
        maximumConcurrentDrafts: 10
      },
      notification: {
        title: 'This is the title',
        message: 'This is a message'
      }
    };

    const defaultProps = {
      route: {
        confirmUri: ':documentNumber/delete-this-draft-processing-statement',
        confirmVoidDocumentUri: ':documentNumber/void-this-processing-statement',
        copyUri: ':documentNumber/copy-this-processing-statement',
        createDraftNextUri: '{documentNumber}/progress',
        createUri: '/orchestration/api/v1/document/processingStatement',
        journey: 'processingStatement',
        journeyText: 'processing statement',
        nextUri: '/:documentNumber/add-your-reference',
        progressUri: '/:documentNumber/progress',
        path: '/processing-statements',
        privacyNoticeUri: '/privacy-notice',
        summaryUri: '/:documentNumber/check-your-information',
        title: 'Create a UK processing statement - GOV.UK'
      }
    };

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res({
              data: {
                inProgress: [],
                completed: []
              }
            });
          });
        }
      },
      dynamixApi: {
        get: () => {
          return new Promise(res => {
            res();
          });
        }
      }
    })]);

    beforeEach(() => {
      window.scrollTo = jest.fn();
    });

    it('should show a copy link in the completed dashboard for processing statements', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-processing-statement"]').text()).toEqual('Copy processing statement 1 ');

    });

    it('should not show the copy link on completed documents, if we have reached the maximum number of concurrent drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'},
        {documentNumber: '3'},
        {documentNumber: '4'},
        {documentNumber: '5'}
      ];

      store.config.maximumConcurrentDrafts = 5;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-processing-statement"]').length).toBe(0);
    });

    it('should not show the copy link if the copyUri is undefined', () => {
      const store = _.cloneDeep(storeDefaults);
      const props = _.cloneDeep(defaultProps);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      props.route.copyUri = undefined;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-processing-statement"]').length).toBe(0);
    });

    it('should show a notification banner when a user reaches a maximum number of processing statement drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' },
        { documentNumber: '2' },
      ];

      store.config.maximumConcurrentDrafts = 2;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('NotificationBanner')).toBeDefined();
      expect(wrapper.find('NotificationBanner').prop('header')).toBe(
        'Important'
      );
      expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe(
        'You have reached the maximum limit allowed for draft processing statements.'
      );
    });

    it('should have correct name attribute on in progress documents table', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('Table').prop('name')).toBe('processingStatement-progress-certificates');
    });

    it('should have correct name attribute on completed documents table', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('Table').prop('name')).toBe('processingStatement-completed-certificates');
    });

    it('should have correct external link for guidance on exporting fish', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const guidanceOnExportingFishLink = wrapper.find('a[href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal"]');
      expect(guidanceOnExportingFishLink.exists()).toBeTruthy();
      expect(guidanceOnExportingFishLink.prop('rel')).toBe('noopener noreferrer');
      expect(guidanceOnExportingFishLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for create a UK catch certificate', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const createAUKCatchCertificateLink = wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-catch-certificate"]');
      expect(createAUKCatchCertificateLink.exists()).toBeTruthy();
      expect(createAUKCatchCertificateLink.prop('rel')).toBe('noopener noreferrer');
      expect(createAUKCatchCertificateLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-catch-certificate"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-catch-certificate"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for create a UK storage document', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const createAUKStorageDocumentLink = wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-storage-document"]');
      expect(createAUKStorageDocumentLink.exists()).toBeTruthy();
      expect(createAUKStorageDocumentLink.prop('rel')).toBe('noopener noreferrer');
      expect(createAUKStorageDocumentLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-storage-document"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-storage-document"] span').text()).toBe('(opens in new tab)');
    });

    it('should show a continue button with a href', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/progress');
    });

    it('should show a continue button with a href linking to the progressUri when a saveAsDraft is defined for the current document', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1', isFailed: false }
      ];

      store.saveAsDraft = {
        currentUri: {
          '1' : ':documentNumber/how-does-the-export-leave-the-uk'
        }
      };

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('a#continue').exists()).toBeTruthy();
      expect(wrapper.find('a#continue').props().href).toBe('/1/progress');
    });

    it('should take a snapshot of the whole page', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1', createdAt: '2019-01-28T15:37:37.144Z',},
        {documentNumber: '2', createdAt: '2019-01-28T15:37:37.144Z',}
      ];

      store.documents.completed = [
        { documentNumber: '3', documentUri: '/', createdAt: '2019-01-28T15:37:37.144Z', }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });
  });

  describe('When viewing the Storage Document Dashboard', () => {

    const storeDefaults = {
      addedSpeciesPerUser: [],
      errors: {},
      fish: [],
      speciesStates: [],
      speciesPresentations: [],
      accountdetails: {},
      userdetails: {},
      global: {
        allFish: [],
        allVessels: []
      },
      documents: {
        inProgress: [],
        completed: []
      },
      userAttributes: [{
        name: 'privacy_statement',
        value: true,
        modifiedAt: '2019-08-23'
      }],
      config: {
        maximumConcurrentDrafts: 10
      },
      notification: {
        title: 'This is the title',
        message: 'This is a message'
      }
    };

    const defaultProps = {
      route: {
        confirmUri: ':documentNumber/delete-this-draft-storage-document',
        confirmVoidDocumentUri: ':documentNumber/void-this-storage-document',
        createDraftNextUri: '{documentNumber}/add-your-reference',
        createUri: '/orchestration/api/v1/document/storageDocument',
        copyUri: ':documentNumber/copy-this-storage-document',
        journey: 'storageNotes',
        journeyText: 'storage document',
        nextUri: '/:documentNumber/add-your-reference',
        path: '/storage-documents',
        privacyNoticeUri: '/privacy-notice',
        summaryUri: '/:documentNumber/check-your-information',
        title: 'Create a UK storage document - GOV.UK'
      }
    };

    const mockStore = configureStore([thunk.withExtraArgument({
      orchestrationApi: {
        get: () => {
          return new Promise((res) => {
            res({
              data: {
                inProgress: [],
                completed: []
              }
            });
          });
        }
      },
      dynamixApi: {
        get: () => {
          return new Promise(res => {
            res();
          });
        }
      }
    })]);

    beforeEach(() => {
      window.scrollTo = jest.fn();
    });

    it('should show a copy link in the completed dashboard for storage documents', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' }
      ];

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-storage-document"]').text()).toEqual('Copy storage document 1 ');

    });

    it('should not show the copy link on completed documents, if we have reached the maximum number of concurrent drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'},
        {documentNumber: '3'},
        {documentNumber: '4'},
        {documentNumber: '5'}
      ];

      store.config.maximumConcurrentDrafts = 5;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      ).render();

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-storage-document"]').length).toBe(0);
    });

    it('should not show the copy link if the copyUri is undefined', () => {
      const store = _.cloneDeep(storeDefaults);
      const props = _.cloneDeep(defaultProps);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/blah' }
      ];

      props.route.copyUri = undefined;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...props} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper).toBeDefined();
      expect(wrapper.find('a[href="1/copy-this-storage-document"]').length).toBe(0);
    });

    it('should show a notification banner when a user reaches a maximum number of storage document drafts', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        { documentNumber: '1' },
        { documentNumber: '2' },
      ];

      store.config.maximumConcurrentDrafts = 2;

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('NotificationBanner')).toBeDefined();
      expect(wrapper.find('NotificationBanner').prop('header')).toBe(
        'Important'
      );
      expect(wrapper.find('NotificationBanner').prop('messages')[0]).toBe(
        'You have reached the maximum limit allowed for draft storage documents.'
      );
    });

    it('should have correct name attribute on in progress documents table', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1'},
        {documentNumber: '2'}
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('Table').prop('name')).toBe('storageNotes-progress-certificates');
    });

    it('should have correct name attribute on completed documents table', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.completed = [
        { documentNumber: '1', documentUri: '/' }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      expect(wrapper.find('Table').prop('name')).toBe('storageNotes-completed-certificates');
    });

    it('should have correct external link for create a UK catch certificate', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const createAUKCatchCertificateLink = wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-catch-certificate"]');
      expect(createAUKCatchCertificateLink.text()).toBe('Create a UK catch certificate (gov.uk) (opens in new tab)');
      expect(createAUKCatchCertificateLink.exists()).toBeTruthy();
      expect(createAUKCatchCertificateLink.prop('rel')).toBe('noopener noreferrer');
      expect(createAUKCatchCertificateLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-catch-certificate"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-catch-certificate"] span').text()).toBe('(opens in new tab)');
    });

    it('should have correct external link for create a UK processing statement', () => {
      const store = _.cloneDeep(storeDefaults);

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const createAUKProcessingStatementLink = wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-processing-statement"]');
      expect(createAUKProcessingStatementLink.text()).toBe('Create a UK processing statement (gov.uk) (opens in new tab)');
      expect(createAUKProcessingStatementLink.exists()).toBeTruthy();
      expect(createAUKProcessingStatementLink.prop('rel')).toBe('noopener noreferrer');
      expect(createAUKProcessingStatementLink.prop('target')).toBe('_blank');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-processing-statement"] span').prop('className')).toBe('govuk-visually-hidden');
      expect(wrapper.find('a[href="https://www.gov.uk/guidance/create-a-uk-processing-statement"] span').text()).toBe('(opens in new tab)');
    });

    it('should take a snapshot of the whole page', () => {
      const store = _.cloneDeep(storeDefaults);

      store.documents.inProgress = [
        {documentNumber: '1', createdAt: '2019-01-28T15:37:37.144Z',},
        {documentNumber: '2', createdAt: '2019-01-28T15:37:37.144Z',}
      ];

      store.documents.completed = [
        { documentNumber: '3', documentUri: '/', createdAt: '2019-01-28T15:37:37.144Z', }
      ];

      const wrapper = mount(
        <Provider store={mockStore(store)}>
          <MemoryRouter>
            <Dashboard.default.component {...defaultProps} />
          </MemoryRouter>
        </Provider>
      );

      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });

  });

});

describe('When viewing the Processing Statement Dashboard in selected language', () => {

  const storeDefaults = {
    addedSpeciesPerUser: [],
    errors: {},
    fish: [],
    speciesStates: [],
    speciesPresentations: [],
    accountdetails: {},
    userdetails: {},
    global: {
      allFish: [],
      allVessels: []
    },
    documents: {
      inProgress: [],
      completed: []
    },
    userAttributes: [{
      name: 'privacy_statement',
      value: true,
      modifiedAt: '2019-08-23'
    }],
    config: {
      maximumConcurrentDrafts: 10
    },
    notification: {
      title: 'This is the title',
      message: 'This is a message'
    }
  };

  const defaultProps = {
    route: {
      confirmUri: ':documentNumber/delete-this-draft-processing-statement',
      confirmVoidDocumentUri: ':documentNumber/void-this-processing-statement',
      copyUri: ':documentNumber/copy-this-processing-statement',
      createDraftNextUri: '{documentNumber}/progress',
      createUri: '/orchestration/api/v1/document/processingStatement',
      journey: 'processingStatement',
      journeyText: 'processing statement',
      nextUri: '/:documentNumber/add-your-reference',
      progressUri: '/:documentNumber/progress',
      path: '/processing-statements',
      privacyNoticeUri: '/privacy-notice',
      summaryUri: '/:documentNumber/check-your-information',
      title: 'Create a UK processing statement - GOV.UK'
    }
  };

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({
            data: {
              inProgress: [],
              completed: []
            }
          });
        });
      }
    },
    dynamixApi: {
      get: () => {
        return new Promise(res => {
          res();
        });
      }
    }
  })]);

  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  const renderComponent = (store={}, props={}) => {

    return mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
            <Dashboard.default.component {...props} />
         </MemoryRouter>
      </Provider>
    );
  };

  it('should display the correct header for a sole trader', () => {
    const store = _.cloneDeep(storeDefaults);

    store.userdetails = {
      model: [
        {
          firstName: 'Elizabeth',
          lastName: 'Windsor'
        }
      ],
    };

    const wrapper = renderComponent(store, defaultProps);

    expect(wrapper.find('StyledHeader').at(0).text()).toBe('Elizabeth Windsor: processing statements');
  });

  it('should display the correct header for an organisation', () => {
    const store = _.cloneDeep(storeDefaults);

    store.accountdetails = {
      model: [
        {
          name: 'Birds Eye'
        }
      ],
    };

    const wrapper = renderComponent(store, defaultProps);

    expect(wrapper.find('StyledHeader').at(0).text()).toBe('Birds Eye: processing statements');
  });


  it('should show help text telling the user how many concurrent drafts they can have', () => {
    const store = _.cloneDeep(storeDefaults);

    store.documents.inProgress = [
      {documentNumber: '1'},
      {documentNumber: '2'}
    ];

    store.config.maximumConcurrentDrafts = 2;

    const wrapper = renderComponent(store, defaultProps);

    expect(wrapper.find('caption h2').length).toBe(1);
    expect(wrapper.find('.multiple-draft-info').length).toBe(1);
    expect(wrapper.find('.multiple-draft-info').text()).toContain('A maximum of 2 draft processing statements is allowed at any time.');
  });

  it('should show inprogress table header in welsh', () => {
    const store = _.cloneDeep(storeDefaults);

    store.documents.inProgress = [
      {documentNumber: '1'},
      {documentNumber: '2'}
    ];
    const wrapper = renderComponent(store, defaultProps);

    const inProgressTable =  wrapper.find('table th');
    expect(inProgressTable.length).toBe(4);
  });

  it('should show completed table header in welsh', () => {
    const store = _.cloneDeep(storeDefaults);

    store.documents.completed = [
      { documentNumber: '1', documentUri: '/blah' }
    ];
    const wrapper = renderComponent(store, defaultProps);

    const inProgressTable =  wrapper.find('table th');
    expect(inProgressTable.length).toBe(4);
  });
});

describe('When viewing the Storage Document Dashboard with translation', () => {

  const storeDefaults = {
    addedSpeciesPerUser: [],
    errors: {},
    fish: [],
    speciesStates: [],
    speciesPresentations: [],
    accountdetails: {},
    userdetails: {},
    global: {
      allFish: [],
      allVessels: []
    },
    documents: {
      inProgress: [],
      completed: []
    },
    userAttributes: [{
      name: 'privacy_statement',
      value: true,
      modifiedAt: '2019-08-23'
    }],
    config: {
      maximumConcurrentDrafts: 10
    },
    notification: {
      title: 'This is the title',
      message: 'This is a message'
    }
  };

  const defaultProps = {
    route: {
      confirmUri: ':documentNumber/delete-this-draft-storage-document',
      confirmVoidDocumentUri: ':documentNumber/void-this-storage-document',
      createDraftNextUri: '{documentNumber}/add-your-reference',
      createUri: '/orchestration/api/v1/document/storageDocument',
      copyUri: ':documentNumber/copy-this-storage-document',
      journey: 'storageNotes',
      journeyText: 'storage document',
      nextUri: '/:documentNumber/add-your-reference',
      path: '/storage-documents',
      privacyNoticeUri: '/privacy-notice',
      summaryUri: '/:documentNumber/check-your-information',
      title: 'Create a UK storage document - GOV.UK'
    }
  };

  const mockStore = configureStore([thunk.withExtraArgument({
    orchestrationApi: {
      get: () => {
        return new Promise((res) => {
          res({
            data: {
              inProgress: [],
              completed: []
            }
          });
        });
      }
    },
    dynamixApi: {
      get: () => {
        return new Promise(res => {
          res();
        });
      }
    }
  })]);

  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('should show the text for no completed document', () => {
    const store = _.cloneDeep(storeDefaults);

    store.documents.inProgress = [
      { documentNumber: '1' }
    ];

    store.documents.completed = [];

    const wrapper = mount(
      <Provider store={mockStore(store)}>
        <MemoryRouter>
          <Dashboard.default.component {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toBeDefined();
  });
});