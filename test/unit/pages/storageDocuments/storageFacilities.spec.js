import storageFacilities from '../../../../src/client/pages/storageNotes/storageFacilitiesPage';
import {
  getStorageNotesFromRedis,
  saveStorageNotes,
  clearStorageNotes
} from '../../../../src/client/actions';
import { clearPostcodeLookupAddress } from '../../../../src/client/actions/postcode-lookup.actions';
import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { component as StorageFacilitiesPage } from '../../../../src/client/pages/storageNotes/storageFacilitiesPage';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';

jest.mock('../../../../src/client/actions');
jest.mock('../../../../src/client/actions/postcode-lookup.actions');

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
    getStorageNotesFromRedis.mockReturnValue({ type: 'GET_STORAGE_NOTES_FROM_REDIS' });
  });

  it('will call all methods needed to load the component', async () => {
    storageFacilities.documentNumber = documentNumber;

    await storageFacilities.loadData(store, journey);

    expect(getStorageNotesFromRedis).toHaveBeenCalledWith(documentNumber);
  });

});

describe('component', () => {

  const windowScrollTo = window.scrollTo = jest.fn();

  const mockStore = configureStore([thunk]);

  const initialState = {
    storageNotes: {
      storageFacilities: [
        {
          facilityName: 'Facility 1'
        },
        {
          facilityName: 'Facility 2'
        }
      ]
    }
  };

  const store = mockStore(initialState);

  const props = {
    route: {
      journey: 'storageNotes',
      progressUri: '/create-storage-document/progress'
    },
    history: {
      location: {
        pathname: '/'
      }
    }
  };
  
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <StorageFacilitiesPage {...props} />
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    saveStorageNotes.mockReset();
    saveStorageNotes.mockReturnValue({ type: 'SAVE' });

    clearPostcodeLookupAddress.mockReset();
    clearPostcodeLookupAddress.mockReturnValue({ type: 'CLEAR' });
    clearStorageNotes.mockReturnValue({type: 'CLEAR_STORAGE_NOTES'});
  });


  it('should take a snapshot of Storage Facility', ()=> {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });

  it('will render', () => {
    expect(wrapper).toBeDefined();
  });

  it('will scroll to 0,0', () => {
    expect(windowScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('will call getFromRedis', () => {
    expect(getStorageNotesFromRedis).toHaveBeenCalled();
  });

  it('will render a delete button for each facility', () => {
    expect(wrapper.exists('#remove-facility-0')).toBe(true);
    expect(wrapper.exists('#remove-facility-1')).toBe(true);
  });

  it('should have a back to the progress page link', () => {
    expect(wrapper.find('a[href="/create-storage-document/progress"]').exists()).toBeTruthy();
  });

  it('will handle removing a storage facility', () => {
    wrapper.find('#remove-facility-0').at(0).simulate('click');

    expect(saveStorageNotes).toHaveBeenCalledWith(
      {
        storageFacilities: [
          {
            facilityName: 'Facility 2'
          }
        ]
      }
    );

    expect(clearPostcodeLookupAddress).toHaveBeenCalled();
  });


  it('should NOT push history for componentDidMount when hasRequiredData is true', async () => {
    const mockPush = jest.fn();

    const props = {
      history: {
        push: mockPush,
      },
      match: {
        params: {
          documentNumber: 'some-doc-num'
        }
      },
      storageNotes: {
        storageFacilities: [
          {
            facilityName: 'Facility 1',
          },
          {
            facilityName: 'Facility 2',
          }
        ]
      },
      getFromRedis: jest.fn(),
      getAllFish: jest.fn()
    };

    props.history.push.mockReset();

    await new StorageFacilitiesPage.WrappedComponent(props).componentDidMount();

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should push history for componentDidMount when hasRequiredData is false', async () => {
    const mockPush = jest.fn();

    const props = {
      match: {
        params: {
          documentNumber: 'some-doc-num'
        }
      },
      history: {
        push: mockPush,
      },
      storageNotes: {},
      getFromRedis: jest.fn(),
      getAllFish: jest.fn()
    };

    props.history.push.mockReset();

    await new StorageFacilitiesPage.WrappedComponent(props).componentDidMount();

    expect(mockPush).toHaveBeenCalledWith('/create-storage-document/some-doc-num/add-storage-facility-details');
  });

  describe('if no storage facilities have been updated', () => {

    const initialState = {
      storageNotes: {
        storageFacilities: [
          {
            facilityName: 'Facility 1',
            _facilityUpdated: false
          },
          {
            facilityName: 'Facility 2',
            _facilityUpdated: false
          }
        ]
      }
    };

    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <StorageFacilitiesPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('will not show the notification banner', () => {
      expect(wrapper.exists('NotificationBanner')).toBe(false);
    });

  });

  describe('if any storage facilities have been updated', () => {

    const initialState = {
      storageNotes: {
        storageFacilities: [
          {
            facilityName: 'Facility 1',
            _facilityUpdated: false
          },
          {
            facilityName: 'Facility 2',
            _facilityUpdated: true
          }
        ]
      }
    };

    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <StorageFacilitiesPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('will show the notification banner', () => {
      expect(wrapper.exists('NotificationBanner')).toBe(true);
    });

  });

  describe('if we have any errors', () => {

    const initialState = {
      storageNotes: {
        storageFacilities: [
          {
            facilityName: 'Facility 1'
          },
          {
            facilityName: 'Facility 2'
          },
          {
            facilityName: 'Facility 3'
          }
        ],
        errors: {
          'addAnotherStorageFacility': 'Error one',
          'storageFacilities-0-facilityAddressOne': 'Error two',
          'storageFacilities-1-facilityAddressOne': 'Error three'
        },
        errorsUrl: '/'
      }
    };


    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <StorageFacilitiesPage {...props} />
        </MemoryRouter>
      </Provider>
    );

    it('will show an error island', () => {
      expect(wrapper.exists('#errorIsland')).toBe(true);
    });

    it('will list all errors in the error island', () => {
      const errors = wrapper.find('#errorIsland li');

      expect(errors.length).toBe(3);
      expect(errors.at(0).html()).toContain('Error one');
      expect(errors.at(1).html()).toContain('Error two');
      expect(errors.at(2).html()).toContain('Error three');
    });

    it('will update the links for facility errors to highlight the row which has the error', () => {
      const errors = wrapper.find('#errorIsland li');

      expect(errors.at(1).html()).toContain('href="#storageFacilities-0"');
      expect(errors.at(2).html()).toContain('href="#storageFacilities-1"');
    });

    it('will not update the link for any other errors', () => {
      const errors = wrapper.find('#errorIsland li');

      expect(errors.at(0).html()).toContain('href="#addAnotherStorageFacility"');
    });

    it('will show inline errors for storage facilities with errors', () => {
      expect(wrapper.find('#storageFacilities-0').exists('.form-group-error')).toBe(true);
      expect(wrapper.find('#storageFacilities-0').exists('.error-message')).toBe(true);
      expect(wrapper.find('#storageFacilities-0 .error-message').html()).toContain('Error two');

      expect(wrapper.find('#storageFacilities-1').exists('.form-group-error')).toBe(true);
      expect(wrapper.find('#storageFacilities-1').exists('.error-message')).toBe(true);
      expect(wrapper.find('#storageFacilities-1 .error-message').html()).toContain('Error three');
    });

    it('will not show inline errors for storage facilities without errors', () => {
      expect(wrapper.find('#storageFacilities-2').exists('.form-group-error')).toBe(false);
      expect(wrapper.find('#storageFacilities-2').exists('.error-message')).toBe(false);
    });

  });
});

describe('should redirect to the forbidden page', () => {
  const mockPush = jest.fn();
  const mockGetFromRedis = jest.fn();

  it('should redirect to the forbidden page if storageNotes is unauthorised', async () => {
    const props = {
      match: {
        params: { documentNumber: 'GBR-23423-4234234' }
      },
      global: {
        allFish: []
      },
      history: {
        push: mockPush,
      },
      exporter: {
        model: {
          exporterFullName: 'Mr Fish Exporter',
          exportCompanyName: 'MailOrderFish Ltd',
          addressOne: '5 Costa Road',
          townCity: 'Hackney',
          postcode: 'NE1 4FS',
          _updated: true
        }
      },
      storageNotes: {
        unauthorised: true
      },
      transport: {
        vehicle: 'plane',
        exportedTo: {
          isoCodeAlpha2: 'Alpha2',
          isoCodeAlpha3: 'Alpha3',
          isoNumericCode: 'IsoNumericCode',
          officialCountryName: 'Eritrea'
        }
      },
      getFromRedis: mockGetFromRedis
    };

    await new StorageFacilitiesPage.WrappedComponent(props).componentDidUpdate();

    expect(mockPush).toHaveBeenCalledWith('/forbidden');
  });
});

describe('should take snapshot of the page based on number of facilities added', () => {
  const mockStore = configureStore([thunk]);
  const mockClearErrors = jest.fn();


  clearPostcodeLookupAddress.mockReturnValue({ type: 'CLEAR' });
  clearStorageNotes.mockReturnValue({type: 'CLEAR_STORAGE_NOTES'});

  const props = {
    clear: mockClearErrors,
    route: {
      journey: 'storageNotes',
      progressUri: '/create-storage-document/progress'
    },
    history: {
      location: {
        pathname: '/'
      }
    }
  };
    
    it('should take a snapshot of Storage Facility when only 1 facility added', ()=> {
      const initialState = {
        storageNotes: {
          storageFacilities: [
            {
              facilityName: 'Facility 1'
            }
          ]
        }
      };
    
      const store = mockStore(initialState);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <StorageFacilitiesPage {...props} />
          </MemoryRouter>
        </Provider>
      );
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });

    it('should take a snapshot of Storage Facility when no storage facilities added', ()=> {
      const initialState = {
        storageNotes: {
          storageFacilities: [
          ]
        }
      };
    
      const store = mockStore(initialState);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <StorageFacilitiesPage {...props} />
          </MemoryRouter>
        </Provider>
      );
      const { container } = render(wrapper);
      expect(container).toMatchSnapshot();
    });
});