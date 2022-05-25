import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import * as StatementPage from '../../../../src/client/pages/storageNotes/statementPage';

describe('Statement Page', () => {
  const props = {

    route: {
      title: 'Create a UK storage document for exports',
      previousUri: '/export-certificates/add-exporter-details',
      nextUri: '/add-landings',
      path: ':documentNumber/what-are-you-exporting',
      saveAsDraftUri: '/create-storage-document/storage-document',
      journey: 'processingStatement'
    },
    completedDocument: {
      documentNumber: 'GBR-2021-SD-7FF42686F',
      documentStatus: 'COMPLETE',
      documentUri: '_75d4eda9-2f5a-46d4-9324-9fe28915575d.pdf'
    }
  };
  const mockStore = configureStore([thunk]);


  const store = mockStore({
    completedDocument: {
      documentNumber: 'GBR-2021-SD-7FF42686F',
      documentStatus: 'COMPLETE',
      documentUri: '_75d4eda9-2f5a-46d4-9324-9fe28915575d.pdf'
    },
    errors: {}
  });

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StatementPage.default.component  {...props} />
      </MemoryRouter>
    </Provider>);

  it('should render complete page', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render complete title with document number', () => {
    expect(wrapper.find('StyledTitle h2').text()).toBe('The storage document has been created');
    expect(wrapper.find('StyledBody #documentNumber').text()).toEqual('GBR-2021-SD-7FF42686F');
  });

  it('should should create snapshot of the UI', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
});