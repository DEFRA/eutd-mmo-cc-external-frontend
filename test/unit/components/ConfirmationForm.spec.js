import {  mount } from 'enzyme';
import * as React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import ConfirmationForm from '../../../src/client/components/ConfirmationForm';


describe('Confirmation Form', () => {

  let wrapper;
  const createExportCertificate = jest.fn();
  const disableSubmit = jest.fn();

  beforeEach(() => {
    createExportCertificate.mockReset();
    const props = {
      createExportCertificate  : createExportCertificate,
      currentUri               : '/confirmation',
      journey                  : 'catchCertificate',
      completeUri              : '/complete',
      disableSubmit            : disableSubmit
    };

    wrapper = mount(<MemoryRouter><ConfirmationForm {...props} /></MemoryRouter>);
  });

  it('should render confirmation', () => {
    expect(wrapper).toBeDefined();
  });

  it('should call disableSubmit when click submit event', () => {
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
    expect(disableSubmit).toHaveBeenCalled();
  });

  it('should not duplicate a click submit event if creatingPdf===true', () => {
    wrapper.find('ConfirmationForm').instance().setState({ creatingPdf: true });
    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );
    expect(createExportCertificate).not.toHaveBeenCalled();
  });

});

describe('Confirmation onSubmit', () => {
  const disableSubmit = jest.fn();
  const history = createMemoryHistory();
  const mockHistoryPush = jest.spyOn(history, 'push');

  let wrapper;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return user to add-landings page', async () => {
    const createExportCertificate = jest.fn()
    .mockImplementation(() => 'ERROR');

    const props = {
      createExportCertificate  : createExportCertificate,
      currentUri               : '/confirmation',
      journey                  : 'catchCertificate',
      completeUri              : '/complete',
      disableSubmit            : disableSubmit,
      documentNumber           : 'CC1-XXXX-CC-XXXXXX'
    };

    wrapper = mount(
      <Router history={history}>
        <ConfirmationForm {...props} />
      </Router>
    );

    wrapper.find('ConfirmationForm').instance().setState({ creatingPdf: false });

    await act(async () => {
      await wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
    });

    expect(createExportCertificate).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('/create-catch-certificate/CC1-XXXX-CC-XXXXXX/add-landings');
  });

  it('should return user to catch-certificate page', async () => {
    const createExportCertificate = jest.fn()
    .mockImplementation(() => ({
      payload: {
        data: {
          status:'catch certificate is LOCKED'
        }
      }
    }));

    const props = {
      createExportCertificate  : createExportCertificate,
      currentUri               : '/confirmation',
      journey                  : 'catchCertificate',
      completeUri              : '/complete',
      pendingUri               : '/pending',
      disableSubmit            : disableSubmit,
      documentNumber           : 'CC1-XXXX-CC-XXXXXX'
    };

    wrapper = mount(
      <Router history={history}>
        <ConfirmationForm {...props} />
      </Router>
    );

    wrapper.find('ConfirmationForm').instance().setState({ creatingPdf: false });

    await act(async () => {
      await wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
    });

    expect(createExportCertificate).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('/create-catch-certificate/catch-certificates');
  });

  it('should return user to complete page', async () => {
    const createExportCertificate = jest.fn()
    .mockImplementation(() => ({
      type: 'export-certificate/create/success',
      payload: {
        data: {}
      }
    }));

    const props = {
      createExportCertificate  : createExportCertificate,
      currentUri               : '/confirmation',
      journey                  : 'catchCertificate',
      completeUri              : '/complete',
      pendingUri               : '/pending',
      disableSubmit            : disableSubmit,
      documentNumber           : 'CC1-XXXX-CC-XXXXXX'
    };

    wrapper = mount(
      <Router history={history}>
        <ConfirmationForm {...props} />
      </Router>
    );

    wrapper.find('ConfirmationForm').instance().setState({ creatingPdf: false });

    await act(async () => {
      await wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
    });

    expect(createExportCertificate).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('/complete');
  });

  it('should return user to pending page', async () => {
    const createExportCertificate = jest.fn()
    .mockImplementation(() => ({
      type: 'export-certificate/create/success',
      payload: {
        data: {
          offlineValidation: true
        }
      }
    }));

    const props = {
      createExportCertificate  : createExportCertificate,
      currentUri               : '/confirmation',
      journey                  : 'catchCertificate',
      completeUri              : '/complete',
      pendingUri               : '/pending',
      disableSubmit            : disableSubmit,
      documentNumber           : 'CC1-XXXX-CC-XXXXXX'
    };

    wrapper = mount(
      <Router history={history}>
        <ConfirmationForm {...props} />
      </Router>
    );

    wrapper.find('ConfirmationForm').instance().setState({ creatingPdf: false });

    wrapper.find('form').simulate(
      'submit',
      {preventDefault() {}}
    );

    await act(async () => {
      await wrapper.find('form').simulate(
        'submit',
        {preventDefault() {}}
      );
    });

    expect(createExportCertificate).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('/pending');
  });

  it('should throw an error', async () => {

    const shouldFailAndThrow = async () => {
      jest.spyOn(window, 'scrollTo')
        .mockReturnValue(null);

      const createExportCertificate = jest.fn()
        .mockImplementation(() => ({
          type: 'export-certificate/create/success',
          payload: {
            validationErrors: [{
              rules: 'some-error'
            }]
          }
        }));

      const props = {
        createExportCertificate  : createExportCertificate,
        currentUri               : '/confirmation',
        journey                  : 'catchCertificate',
        completeUri              : '/complete',
        pendingUri               : '/pending',
        disableSubmit            : disableSubmit,
        documentNumber           : 'CC1-XXXX-CC-XXXXXX'
      };

      wrapper = mount(
        <Router history={history}>
          <ConfirmationForm {...props} />
        </Router>
      );

      wrapper.find('ConfirmationForm').instance().setState({ creatingPdf: false });

      await act(() => wrapper.find('form').props().onSubmit({preventDefault() {}}));
    };

    await shouldFailAndThrow()
      .catch(((err) => expect(err).toEqual(new Error('validation failed when creating an export certificate'))));
  });
});