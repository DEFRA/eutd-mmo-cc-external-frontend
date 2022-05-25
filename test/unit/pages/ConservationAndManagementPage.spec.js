import {  mount } from 'enzyme';
import * as React from 'react';
import {component as WhoseWatersWereTheyCaughtInPage} from '../../../src/client/pages/exportCertificates/WhoseWatersWereTheyCaughtInPage';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';

import {
  clearConservation,
  addConservation,
  saveConservation,
  dispatchClearErrors,
  dispatchApiCallFailed,
  getConservation
} from '../../../src/client/actions';

jest.mock('../../../src/client/actions');

describe('ConservationAndManagementPage', () => {

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

  beforeEach(async () => {
    clearConservation.mockReturnValue({ type: 'CLEAR_CONSERVATION' });
    addConservation.mockReturnValue({ type: 'ADD_CONSERVATION' });
    saveConservation.mockReturnValue({ type: 'SAVE_CONSERVATION' });
    dispatchClearErrors.mockReturnValue({ type: 'CLEAR_ERRORS' });
    dispatchApiCallFailed.mockReturnValue({ type: 'CALL_FAILED' });
    getConservation.mockReturnValue({ type: 'GET_CONSERVATION' });
    const store = mockStore({
      errors: {}, conservation: {}, landingsType: { landingsEntryOption: 'directLanding' },
      exportPayload: {
        items: [{
          product: {
            commodityCode: '03036310',
            presentation: {
              code: 'FIL',
              label: 'Filleted',
            },
            state: {
              code: 'FRO',
              label: 'Frozen',
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)',
            },
          },
          landings: [
            {
              addMode: false,
              editMode: false,
              model: {
                id: '99bc2947-c6f4-4012-9653-22dc0b9ad036',
                vessel: {
                  pln: 'AR190',
                  vesselName: 'SILVER QUEST',
                  homePort: 'TROON AND SALTCOATS',
                  registrationNumber: 'A10726',
                  licenceNumber: '42384',
                  label: 'SILVER QUEST (AR190)',
                },
                dateLanded: '2019-01-22',
                exportWeight: '22',
              },
            },
          ],
        }],
      }});
    window.scrollTo = jest.fn();

    const props = {

        route: {
          title: 'Create a UK catch certificate for exports',
          previousUri    : ':documentNumber/add-landings',
          nextUri        : ':documentNumber/what-export-journey',
          path           : ':documentNumber/whose-waters-were-they-caught-in',
          saveAsDraftUri : '/create-catch-certificate/catch-certificates',
          journey        : 'catchCertificate',
          directLandingUri : ':documentNumber/direct-landing',
          progressUri   : '/create-catch-certificate/:documentNumber/progress'
        },
        match: { params: {documentNumber: 'GBR-2021-CC-D6FBF748C'}}
    };

    wrapper = await mount(
      <Provider store={store}>
        <MemoryRouter>
          <WhoseWatersWereTheyCaughtInPage {...props}/>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render watersCaughtIn checkbox list', () => {
    expect(wrapper.find('#watersCaughtIn').exists()).toBeTruthy();
  });

  it('should render submit button', () => {
    expect(wrapper.find('button[type="submit"]').exists()).toBeTruthy();
  });

  it('should have a back to progress page link', () => {
    expect(wrapper.find('a[href="/create-catch-certificate/GBR-2021-CC-D6FBF748C/progress"]').exists()).toBeTruthy();
  });

});
