import {  mount } from 'enzyme';
import * as React from 'react';
import {component as CompletePage} from '../../../src/client/pages/exportCertificates/CompletePage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import {
  clearConservation,
  clearTransportDetails,
  clearExportCountry,
  clearExportPayload,
  getExportCertificateFromParams,
  clearAddedSpeciesPerUser
} from '../../../src/client/actions';
jest.mock('../../../src/client/actions');

describe('Export complete page initial load', () => {
    let wrapper;
    const mockStore = configureStore();

    beforeEach(() => {
      clearConservation.mockReturnValue({ type: 'CLEAR_CONSERVATION' });
      clearTransportDetails.mockReturnValue({ type: 'CLEAR_TRANSPORT' });
      clearExportCountry.mockReturnValue({ type: 'CLEAR_EXPORT_COUNTRY' });
      clearExportPayload.mockReturnValue({ type: 'export-certificate/export-payload/clear' });
      clearAddedSpeciesPerUser.mockReturnValue({ type: 'clear_added_species_per_user' });
      getExportCertificateFromParams.mockReturnValue({ type: 'GET_EXPORT_CERT' });
        const store = mockStore({
          exportCertificate : {
            documentNumber: 'GBR-2018-CC-48248952D',
            uri: 'https://sndmmoinfsto001.blob.core.windows.net/1e010fab-013f-4f83-a81f-463c752fd1a2/Export%20Certificate_1543933999085.pdf?st=2018-12-04T14%3A28%3A19Z&se=2019-12-04T14%3A33%3A19Z&sp=r&sv=2018-03-28&sr=b&sig=%2F2fCZ5OTSqEI8UR4w9FQ%2Fcy2Su1l%2Fpaf1vlO%2FV7hkKQ%3D'
          }
        });

      const props = {
        route: {
          title: 'Create a UK catch certificate for exports',
          dashboardUri: '/dashboard'
        },
        match: {
          params: {
            documentNumber: 'doc1'
          }
        }
      };

      wrapper = mount(
            <Provider store={store}>
              <MemoryRouter>
                <CompletePage {...props}/>
              </MemoryRouter>
            </Provider>
          );

    });

    it('should load successfully', () => {
      expect(wrapper).toBeDefined();
    });

    it('should render export certificate link', () => {
      expect(wrapper.find('#documentNumber').exists()).toBeTruthy();
    });

    it('should take a snapshot of the page', ()=> {
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });
});
