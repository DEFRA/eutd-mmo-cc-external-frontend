import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as Utils from '../../../../../src/client/pages/utils/errorUtils';
import AddLandingsForm from '../../../../../src/client/pages/exportCertificates/landings/AddLandingsForm';

describe('Add Landings Form initial load', () => {
  let wrapper;

  const mockUpsertLanding = jest.fn().mockResolvedValue(undefined);
  const mockClearLanding = jest.fn().mockResolvedValue(undefined);
  const mockAddEventListener = jest.fn();
  const mockOnDateChange = jest.fn().mockReturnValue(undefined);

  const props = {
    productId: undefined,
    landingId: undefined,
    exportPayload: {
      items: [],
    },
    errors: {},
    vesselOptions: [],
    searchVessels: () => {},
    vesselSelected: () => {},
    upsertLanding: mockUpsertLanding,
    clearLanding: mockClearLanding,
    totalLandings: 0,
    maxLandingsLimit: 100,
    editMode: '',
    onDateChange:mockOnDateChange
  };

  beforeEach(() => {
    jest.spyOn(document, 'getElementsByName')
    .mockReturnValue([{
      addEventListener: mockAddEventListener
    }]);

    jest.spyOn(document, 'getElementById')
      .mockReturnValue({
        scrollIntoView: jest.fn(),
        focus: jest.fn()
      });

    window.scrollTo = jest.fn();
    wrapper = mount(<AddLandingsForm {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load successfully', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render a DateField component', () => {
    expect(wrapper.find('DateField').exists()).toBeTruthy();
  });

  it('should render a select fao area component', () => {
    expect(wrapper.find('#select-faoArea').exists()).toBeTruthy();
  });

  it('should render a select vessels component', () => {
    expect(wrapper.find('#select-vessel').exists()).toBeTruthy();
  });

  it('should render a select products component', () => {
    expect(wrapper.find('#product').exists()).toBeTruthy();
  });

  it('should select a product from the products component', () => {
    const productSelect = wrapper.find('select#product');

    act(() =>
      productSelect.props().onChange({
        preventDefault: () => {},
        currentTarget: {
          name: 'product',
          value: 'some-product-id',
        },
      })
    );

    expect(wrapper.find('AddLandingsForm').state().product).toBe(
      'some-product-id'
    );
  });

  it('should call search vessel with no date when entering vessel name first', () => {
    const vesselNameTextBox = wrapper.find('input[name="vessel.vesselName"]');

    act(() =>
      vesselNameTextBox.props().onChange({
        preventDefault: () => {},
        target: { name: 'vessel.vesselName', value: 'TEST' },
      })
    );

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      vessel: { label: 'TEST' },
      exportWeight: '',
      faoArea: 'FAO27',
      dateLanded: '',
      editMode: ''
    });
  });

  it('should update the weight of a product from the export weight component when weight has a value', () => {
    const weightInput = wrapper.find('WeightInput');

    expect(weightInput.exists()).toBeTruthy();

    act(() =>
      weightInput.props().onChange({
        preventDefault: () => {},
        currentTarget: {
          name: 'weight',
          value: '17.12',
        },
      })
    );

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      vessel: { label: '' },
      exportWeight: '17.12',
      faoArea: 'FAO27',
      dateLanded: '',
      editMode: ''
    });
  });

  it('should set the export weight as undefined when the user hasn\'t entered a weight', () => {
    const weightInput = wrapper.find('WeightInput');

    expect(weightInput.exists()).toBeTruthy();

    act(() =>
      weightInput.props().onChange({
        preventDefault: () => {},
        currentTarget: {
          name: 'weight',
          value: '',
        },
      })
    );

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      vessel: { label: '' },
      exportWeight: undefined,
      faoArea: 'FAO27',
      dateLanded: '',
      editMode: ''
    });
  });


  it('should update the date state', () => {
    const dateField = wrapper.find('input[name="dayInputName"]');

    act(() =>
      dateField.prop('onChange')({
        target: {
          value: '05'
        }
      })
    );

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      vessel: { label: '' },
      exportWeight: '',
      faoArea: 'FAO27',
      dateLanded: 'Invalid date',
      editMode: ''
    });
  });

  it('should update dateLanded', ()=>{

    const dayField = wrapper.find('input[name="dayInputName"]');
    const monthField = wrapper.find('input[name="monthInputName"]');
    const yearField = wrapper.find('input[name="yearInputName"]');

    dayField.simulate('change', { target: { value: '10' } });
    monthField.simulate('change', { target: { value: '07' } });
    yearField.simulate('change', { target: { value: '2021' } });

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      vessel: { label: '' },
      exportWeight: '',
      faoArea: 'FAO27',
      dateLanded: '2021-07-10',
      editMode: '',
    });
  });

  it('should update the faoArea', () => {
    const faoArea = wrapper.find('#select-faoArea');

    expect(faoArea.exists()).toBeTruthy();

    act(() =>
      faoArea.props().onChange({
        preventDefault: () => {},
        currentTarget: {
          name: 'faoArea',
          value: 'FAO28',
        },
      })
    );

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      vessel: { label: '' },
      exportWeight: '',
      faoArea: 'FAO28',
      dateLanded: '',
      editMode: ''
    });
  });

  it('should return vessel label', () => {
    const ac = wrapper.find('GovukVesselsAutocomplete');
    expect(ac.props().getItem({ label: 'Wiron 5' })).toEqual('Wiron 5');
  });

  it('should not allow user to select a vessel when date has not been set', () => {
    const ac = wrapper.find('GovukVesselsAutocomplete');

    expect(ac.exists()).toBeTruthy();
    act(() => ac.props().onChange('Enter a valid date landed to enable Vessel name'));

    expect(wrapper.find('AddLandingsForm').state().model.vessel).toEqual(
      {
        label: ''
      }
    );
  });

  it('should allow user to select a vessel when date is added by label', () => {
    const ac = wrapper.find('GovukVesselsAutocomplete');

    expect(ac.exists()).toBeTruthy();
    act(() => ac.props().onChange('blablah'));

    expect(wrapper.find('AddLandingsForm').state().model.vessel.label).toBe(
      'blablah'
    );
  });

  it('should allow user to select a vessel when date is added', () => {
    const ac = wrapper.find('GovukVesselsAutocomplete');

    expect(ac.exists()).toBeTruthy();
    act(() => ac.props().onChange('blablah', { vesselName: 'Wiron 5'}));

    expect(wrapper.find('AddLandingsForm').state().model.vessel).toEqual(
      { vesselName: 'Wiron 5' }
    );
  });

  it('should render a cancel button', () => {
    expect(wrapper.find('button[id="cancel"]').exists()).toBeTruthy();
  });

  it('should render an add landing button', () => {
    expect(wrapper.find('button[id="submit"]').exists()).toBeTruthy();
  });

  it('Should NOT render Add  landing button when max number of landings reached', () => {
    const localProps = {
      ...props,
      totalLandings: 101,
    };

    wrapper = mount(<AddLandingsForm {...localProps} />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find('button[id="submit"]').exists()).toBeFalsy();
  });

  it('should add a landing', async () => {
    const localProps = {
      ...props,
      productId: 'some-product-id',
      landingId: 'some-landing-id',
    };

    wrapper = mount(<AddLandingsForm {...localProps} />);

    const addButton = wrapper.find('button[id="submit"]');
    const landing = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2019-03-05',
        editMode: ''
      },
      dateValue: '',
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...landing });

    await act(() =>
      addButton.props().onClick({
        preventDefault: () => {},
        currentTarget: {
          blur: () => {}
        }
      })
    );

    expect(mockUpsertLanding).toHaveBeenCalledWith(
      'some-product-id',
      {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2019-03-05'
      }
    );

    expect(wrapper.find('AddLandingsForm').state()).toStrictEqual({
      model: {
        id: undefined,
        vessel: { label: '' },
        faoArea: 'FAO27',
        exportWeight: '',
        dateLanded: '',
        editMode: ''
      },
      dateValue: '',
      product: 'some-product-id',
    });
  });

  it('should not add a landing', async () => {
    const addButton = wrapper.find('button[id="submit"]');
    const landing = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: { day: '', month: '', year: '' },
      },
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...landing });

    await act(() =>
      addButton.props().onClick({
        preventDefault: () => {},
      })
    );

    expect(mockUpsertLanding).not.toHaveBeenCalled();
  });

  it('should fail to upsert a landing when a landing date is invalid', async () => {
    const localProps = {
      ...props,
      productId: 'some-product-id',
      landingId: 'some-landing-id',
    };

    wrapper = mount(<AddLandingsForm {...localProps} />);

    const addButton = wrapper.find('button[id="submit"]');
    const landing = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2021-07-122',
        editMode: ''
      },
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...landing });

    await act(() =>
      addButton.props().onClick({
        preventDefault: () => {},
      })
    );

    expect(mockUpsertLanding).not.toHaveBeenCalled();
    expect(wrapper.find('AddLandingsForm').state().productId).toBeUndefined();
    expect(wrapper.find('AddLandingsForm').state().landingId).toBeUndefined();
  });

  it('should clear state', () => {
    const localProps = {
      ...props,
      productId: 'some-product-id',
      landingId: 'some-landing-id',
    };

    wrapper = mount(<AddLandingsForm {...localProps} />);

    const cancelButton = wrapper.find('button[id="cancel"]');

    expect((cancelButton).exists()).toBeTruthy();

    const initialState = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'Sylvies Grace ' },
        exportWeight: '12.50',
        faoArea: 'FAO18',
        dateLanded: '2019-03-05',
        editMode: ''
      },
      dateValue: '',
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...initialState });

    expect(wrapper.find('AddLandingsForm').state()).toEqual({
      model: {
        id: 'some-landing-id',
        vessel: { label: 'Sylvies Grace ' },
        exportWeight: '12.50',
        faoArea: 'FAO18',
        dateLanded: '2019-03-05',
        editMode: ''
      },
      dateValue: '',
      product: 'some-product-id',
    });

    cancelButton.simulate('click', { preventDefault: () => {} });

    expect(wrapper.find('AddLandingsForm').state()).toEqual({
      model: {
        id: undefined,
        vessel: { label: '' },
        exportWeight: '',
        faoArea: 'FAO27',
        dateLanded: '',
        editMode: ''
      },
      dateValue: '',
      product: 'some-product-id',
    });
  });
});

describe('Add Landings Pre Populated Form', () => {
  let wrapper;

  const props = {
    errors: {},
    exportPayload: {
      items: [
        {
          product: {
            id: 'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978',
            commodityCode: '03024330',
            commodityCodeDescription:
              'Fresh or chilled sardines "Sardinops spp." and sardinella "Sardinella spp."',
            presentation: {
              code: 'WHL',
              label: 'Whole',
            },
            scientificName: 'Sardinella aurita',
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'SAA',
              label: 'Round sardinella (SAA)',
            },
          },
          landings: [
            {
              model: {
                id: 'GBR-2021-CC-F1373BCCE-1626684999',
                vessel: {
                  pln: 'LK124',
                  vesselName: 'ALERT',
                  label: 'ALERT (LK124)',
                  homePort: 'WEST MAINLAND (SHETLAND)',
                  flag: 'GBR',
                  cfr: 'GBRA12535',
                  imoNumber: null,
                  licenceNumber: '30633',
                  licenceValidTo: '2027-12-31T00:01:00',
                },
                faoArea: 'FAO28',
                dateLanded: '2021-07-19',
                exportWeight: 123,
                numberOfSubmissions: 0,
              },
              landingId: 'GBR-2021-CC-F1373BCCE-1626684999',
              addMode: false,
              editMode: false,
              error: '',
              errors: {},
            },
            {
              model: {
                id: 'GBR-2021-CC-F1373BCCE-1626684888',
                numberOfSubmissions: 0,
              },
              landingId: 'GBR-2021-CC-F1373BCCE-1626684888',
              addMode: false,
              editMode: false,
              error: '',
              errors: {},
            },
          ],
        },
        {
          product: {
            id: 'GBR-2021-CC-no-landings',
            commodityCode: '03024330',
            commodityCodeDescription:
              'Fresh or chilled sardines "Sardinops spp." and sardinella "Sardinella spp."',
            presentation: {
              code: 'WHL',
              label: 'Whole',
            },
            scientificName: 'Sardinella aurita',
            state: {
              code: 'FRE',
              label: 'Fresh',
            },
            species: {
              code: 'SAA',
              label: 'Round sardinella (SAA)',
            },
          },
        },
      ],
    },
    productId: 'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978',
    landingId: 'GBR-2021-CC-F1373BCCE-1626684999',
    totalLandings: 2,
    maxLandingsLimit: 100,
    searchVessels: () => {},
    vesselSelected: () => {},
    upsertLanding: () => {
      throw 'error';
    },
  };

  let mockScrollToErrorIsland;

  beforeEach(() => {
    mockScrollToErrorIsland = jest.spyOn(Utils, 'scrollToErrorIsland');
    jest.spyOn(document, 'getElementById')
      .mockReturnValue({
        scrollIntoView: () => {},
        focus: () => {}
      });
  });

  afterEach(() => {
    mockScrollToErrorIsland.mockRestore();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should set an initial state with pre populated landing details', () => {
    wrapper = mount(<AddLandingsForm {...props} />);

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: 'GBR-2021-CC-F1373BCCE-1626684999',
      exportWeight: 123,
      faoArea: 'FAO28',
      dateLanded: '2021-07-19',
      vessel: {
        pln: 'LK124',
        vesselName: 'ALERT',
        label: 'ALERT (LK124)',
        homePort: 'WEST MAINLAND (SHETLAND)',
        flag: 'GBR',
        cfr: 'GBRA12535',
        imoNumber: null,
        licenceNumber: '30633',
        licenceValidTo: '2027-12-31T00:01:00',
      },
    });
    expect(wrapper.find('AddLandingsForm').state().product).toBe(
      'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978'
    );
  });

  it('should set an initial state with pre populated default landings', () => {
    const localProps = {...props, landingId: 'GBR-2021-CC-F1373BCCE-1626684888'};

    wrapper = mount(<AddLandingsForm {...localProps} />);

    expect(wrapper.find('AddLandingsForm').state().model).toMatchObject({
      id: 'GBR-2021-CC-F1373BCCE-1626684888',
      exportWeight: '',
      dateLanded: '',
      faoArea: 'FAO27',
      vessel: {
        label: '',
      },
    });
    expect(wrapper.find('AddLandingsForm').state().product).toBe(
      'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978'
    );
  });

  it('should set an initial state when a product has no landings', () => {
    props.productId = 'GBR-2021-CC-no-landings';

    wrapper = mount(<AddLandingsForm {...props} />);

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      exportWeight: '',
      faoArea: 'FAO27',
      vessel: {
        label: '',
      },
      dateLanded: '',
      editMode: ''
    });
  });

  it('should return a vessel when date is added', () => {
    wrapper = mount(<AddLandingsForm {...props} />);

    const vesselNameTextBox = wrapper.find('input[name="vessel.vesselName"]');

    wrapper.find('AddLandingsForm').setState({
      model: {
        id: 'GBR-2021-CC-F1373BCCE-1626684999',
        exportWeight: 123,
        faoArea: 'FAO28',
        dateLanded: '2021-07-19',
        vessel: {
          label: '',
        },
      },
      product: 'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978'
    });

    act(() =>
      vesselNameTextBox.props().onChange({
        preventDefault: () => {},
        target: { name: 'ALERT', value: 'ALERT' },
      })
    );

    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: 'GBR-2021-CC-F1373BCCE-1626684999',
      vessel: { label: 'ALERT' },
      dateLanded: '2021-07-19',
      exportWeight: 123,
      faoArea: 'FAO28',
    });
  });

  it('should fail to add a landing', async () => {

    const localProps = {
      ...props,
      productId: 'some-product-id',
      landingId: 'some-landing-id',
    };

    wrapper = mount(<AddLandingsForm {...localProps} />);
    const addButton = wrapper.find('button[id="submit"]');
    const landing = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2019-03-14',
      },
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...landing });

    await act(() =>
      addButton.props().onClick({
        preventDefault: () => {},
        currentTarget: {
          blur: () => {}
        }
      })
    );

    expect(mockScrollToErrorIsland).toHaveBeenCalled();
  });

  it('should label the submit button "Update landing"', () => {
    const landing = {
      model: {
        id: 'GBR-2021-CC-F1373BCCE-1626684999',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded:  '2019-03-14',
      },
      dateValue: '',
      product: 'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978',
    };

    wrapper = mount(<AddLandingsForm {...props} />);
    wrapper.find('AddLandingsForm').setState({ ...landing });

    expect(wrapper.find('AddLandingsForm #submit').text()).toBe('Update landing');
  });

  it('Should render update landing button when max number of landings reached', () => {
    const localProps = {
      ...props,
      totalLandings: 101,
    };

    const landing = {
      model: {
        id: 'GBR-2021-CC-F1373BCCE-1626684999',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded:  '2020-03-14',
      },
      product: 'GBR-2021-CC-F1373BCCE-6f55d814-9868-46ef-ac31-6f6c4539f978',
    };

    wrapper = mount(<AddLandingsForm {...localProps} />);
    wrapper.find('AddLandingsForm').setState({ ...landing });

    expect(wrapper.find('button[id="submit"]').exists()).toBeTruthy();
  });

});

describe('Add Landings Form with no landings', () => {
  let wrapper;

  const mockUpsertLanding = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    const props = {
      landingId: undefined,
      productId: undefined,
      errors: {},
      totalLandings: 0,
      maxLandingsLimit: 100,
      upsertLanding: mockUpsertLanding,
      searchVessels: () => {},
      vesselSelected: () => {},
    };

    window.scrollTo = jest.fn();
    wrapper = mount(<AddLandingsForm {...props} />);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should set an initial state with no landings', () => {
    expect(wrapper.find('AddLandingsForm').state().model).toEqual({
      id: undefined,
      exportWeight: '',
      faoArea: 'FAO27',
      vessel: {
        label: '',
      },
      dateLanded: '',
      editMode: ''
    });
  });

  it('should label the submit button "Add landing"', () => {
    expect(wrapper.find('AddLandingsForm #submit').text()).toBe('Add landing');
  });
});

describe('Add Landings Form with errors', () => {
  let wrapper;
  const mockUpsertLanding = jest.fn().mockResolvedValue(undefined);
  const mockClearLanding = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    const props = {
      productId: 'some-product-id',
      landingId: 'some-landing-id',
      totalLandings: 0,
      maxLandingsLimit: 100,
      exportPayload: {
        items: [],
        errors: { product: 'errors' }
      },
      errors: {
        faoAreaError: 'ccUploadFilePageTableCatchAreaMissingError',
        dateLandedError: 'ccUploadFilePageTableDateLandedFutureMaximumDaysError-7'
      },
      vesselOptions: [],
      searchVessels: () => {},
      vesselSelected: () => {},
      upsertLanding: mockUpsertLanding,
      clearLanding: mockClearLanding
    };

    window.scrollTo = jest.fn();
    wrapper = mount(<AddLandingsForm {...props} />);

    jest.spyOn(document, 'getElementById')
      .mockReturnValue({
        scrollIntoView: jest.fn(),
        focus: jest.fn()
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add a landing and not clear state', async () => {
    const addButton = wrapper.find('button[id="submit"]');
    const landing = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2020-05-14',
      },
      dateValue: '',
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...landing });

    await act(() =>
      addButton.props().onClick({
        preventDefault: () => {},
        currentTarget: {
          blur: () => {}
        }
      })
    );

    expect(mockUpsertLanding).toHaveBeenCalledWith(
      'some-product-id',
      {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2020-05-14',
      }
    );

    expect(wrapper.find('AddLandingsForm').state()).toStrictEqual({
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '2020-05-14',
      },
      dateValue: null,
      product: 'some-product-id',
    });
  });

  it('should add a landing and not clear state when no date is provided', async () => {
    const addButton = wrapper.find('button[id="submit"]');
    const landing = {
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded:'',
      },
      dateValue: '',
      product: 'some-product-id',
    };

    wrapper.find('AddLandingsForm').setState({ ...landing });

    await act(() =>
      addButton.props().onClick({
        preventDefault: () => {},
        currentTarget: {
          blur: () => {}
        }
      })
    );

    expect(mockUpsertLanding).toHaveBeenCalledWith(
      'some-product-id',
      {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: undefined,
      },
    );

    expect(wrapper.find('AddLandingsForm').state()).toStrictEqual({
      model: {
        id: 'some-landing-id',
        vessel: { label: 'some vessel ' },
        exportWeight: '12.50',
        faoArea: 'FAO27',
        dateLanded: '',
      },
      dateValue: null,
      product: 'some-product-id',
    });
  });

  it('should display an faoArea select with an error', () => {
    expect(wrapper
      .find('#select-faoArea')
      .prop('className')).toBe('autocomplete__input--default faoArea autocomplete__error');
  });

  it('should display Catch area is missing error', () => {
    expect(wrapper
      .find('ErrorText').at(1).text()).toBe('Catch area is missing');
  });

  it('should display Date landed can be no more than 7 days in the future error', () => {
    expect(wrapper
      .find('ErrorText').at(0).prop('errorText')).toBe('Date landed can be no more than 7 days in the future');
  });
});

describe('Add Landings Form with product was subject to fishing restrictions', () => {
  let wrapper;
  const mockUpsertLanding = jest.fn().mockResolvedValue(undefined);
  const mockClearLanding = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    const props = {
      productId: 'some-product-id',
      landingId: 'some-landing-id',
      totalLandings: 0,
      maxLandingsLimit: 100,
      exportPayload: {
        items: [],
        errors: { product: 'errors' }
      },
      errors: {
        dateLandedError: 'ccAddLandingDateLandedRestrictedError-European seabass (BSS)'
      },
      vesselOptions: [],
      searchVessels: () => {},
      vesselSelected: () => {},
      upsertLanding: mockUpsertLanding,
      clearLanding: mockClearLanding
    };

    window.scrollTo = jest.fn();
    wrapper = mount(<AddLandingsForm {...props} />);

    jest.spyOn(document, 'getElementById')
      .mockReturnValue({
        scrollIntoView: jest.fn(),
        focus: jest.fn()
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should display European seabass (BSS) was subject to fishing restrictions on your specified landing date error', () => {
    expect(wrapper
      .find('ErrorText').at(0).prop('errorText')).toBe('European seabass (BSS) was subject to fishing restrictions on your specified Landing date. Please refer to GOV.UK for further guidance.');
  });
});
