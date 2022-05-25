import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import LandingsDetailTable from '../../../src/client/components/LandingsDetailsTable';

describe('Landings Table', () => {
  const mockDocumentNumber = 'GBR-CC-XXXX';
  const mockExportPayload = {
    items: [
      {
        product: {
          id: 'GBR-2021-CC-product-1',
          commodityCode: '03044410',
          commodityCodeDescription: 'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
          presentation: {
            code: 'FIS',
            label: 'Filleted and skinned'
          },
          scientificName: 'Gadus morhua',
          state: {
            code: 'FRE',
            label: 'Fresh'
          },
          species: {
            code: 'COD',
            label: 'Atlantic cod (COD)'
          }
        },
        landings: [
          {
            model: {
              id: 'GBR-2021-CC-landing-1',
              vessel: {
                pln: 'SD395',
                vesselName: 'AURORA',
                label: 'AURORA (SD395)',
                homePort: 'SUNDERLAND',
                flag: 'GBR',
                cfr: 'GBRC18395',
                imoNumber: null,
                licenceNumber: '23010',
                licenceValidTo: '2382-12-31T00:00:00'
              },
              faoArea: 'FAO27',
              dateLanded: '2021-07-15',
              exportWeight: 22,
              numberOfSubmissions: 0
            },
            landingId: 'GBR-2021-CC-landing-1',
            addMode: false,
            editMode: false,
            error: '',
            errors: {}
          },
          {
            model: {
              id: 'GBR-2021-CC-landing-2',
              vessel: {
                pln: 'SD395',
                vesselName: 'AURORA',
                label: 'AURORA (SD395)',
                homePort: 'SUNDERLAND',
                flag: 'GBR',
                cfr: 'GBRC18395',
                imoNumber: null,
                licenceNumber: '23010',
                licenceValidTo: '2382-12-31T00:00:00',
                vesselOverriddenByAdmin: true
              },
              faoArea: 'FAO27',
              dateLanded: '2021-07-15',
              exportWeight: 22,
              numberOfSubmissions: 0
            },
            landingId: 'GBR-2021-CC-landing-1',
            addMode: false,
            editMode: false,
            error: '',
            errors: {}
          },
        ]
      },
      {
        product: {
          id: 'GBR-2021-CC-76096F601-3a87dc0b-424e-47e5-82f8-3b6e3d454ff2',
          commodityCode: '03028590',
          commodityCodeDescription: 'Fresh or chilled sea bream "Sparidae" (excl. gilt-head sea bream, Dentex dentex and Pagellus spp.)',
          presentation: {
            code: 'WHL',
            label: 'Whole'
          },
          scientificName: 'Spondyliosoma cantharus',
          state: {
            code: 'FRE',
            label: 'Fresh'
          },
          species: {
            code: 'BRB',
            label: 'Black seabream (BRB)'
          }
        }
      }
    ],
    busy: false
  };

  const mockRemoveLanding = jest.fn();
  const mockEditLanding = jest.fn();

  const getWrapper = ( exportPayload = { items: [ { product: { }}] }, totalLandings = 0) => mount(
    <LandingsDetailTable
      documentNumber={mockDocumentNumber}
      exportPayload={exportPayload}
      totalLandings={totalLandings}
      editLanding={mockEditLanding}
      removeLanding={mockRemoveLanding}
    />
  );

  it('should render an empty table with the correct headings', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    expect(wrapper.find('Table').exists()).toBeTruthy();

    expect(wrapper.find('CellHeader')).toHaveLength(4);
    expect(wrapper.find('CellHeader').at(0).text()).toBe('Product');
    expect(wrapper.find('CellHeader').at(1).text()).toBe('Landing');
    expect(wrapper.find('CellHeader').at(2).text()).toBe('Export weight (kg)');
    expect(wrapper.find('CellHeader').at(3).text()).toBe('Action');
  });

  it('should render a empty table with the correct value footer', () => {
    const wrapper = getWrapper();

    expect(wrapper.find('ValueFooter').exists()).toBeTruthy();
    expect(wrapper.find('ValueFooter').prop('value')).toBe(0);
    expect(wrapper.find('ValueFooter').prop('label')).toBe('landings');
  });

  it('should render a table with the correct value footer without plural', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('ValueFooter').exists()).toBeTruthy();
    expect(wrapper.find('ValueFooter').prop('value')).toBe(1);
    expect(wrapper.find('ValueFooter').prop('label')).toBe('landing');
  });

  it('should render a table with one row with the correction information in the right format', () => {
    const wrapper = getWrapper(mockExportPayload, 1);
    const row = wrapper.find('Row#vessel_GBR-2021-CC-product-1_GBR-2021-CC-landing-1');

    expect(row.exists()).toBeTruthy();
    expect(row.find('Cell').at(0).text()).toBe('Atlantic cod (COD), Fresh, Filleted and skinned, 03044410');
    expect(row.find('Cell').at(1).text()).toBe('15/07/2021, FAO27, AURORA (SD395)');
    expect(row.find('Cell').at(2).text()).toBe('22');
  });


  it('should render a table with just a header', () => {
    const dataExportPayload = {
      items: undefined
    };

    const wrapper = getWrapper(dataExportPayload, 1);

    expect(wrapper.find('Row')).toHaveLength(1);
  });

  it('should render a table with one row when no id is provided', () => {
    const dataExportPayload = {
      items: [
        {
          product: {
            id: 'GBR-2021-CC-product-1',
            commodityCode: '03044410',
            commodityCodeDescription: 'Fresh or chilled fillets of cod "Gadus morhua, Gadus ogac, Gadus macrocephalus" and of Boreogadus saida',
            presentation: {
              code: 'FIS',
              label: 'Filleted and skinned'
            },
            scientificName: 'Gadus morhua',
            state: {
              code: 'FRE',
              label: 'Fresh'
            },
            species: {
              code: 'COD',
              label: 'Atlantic cod (COD)'
            }
          },
          landings: [
            {
              model: {
                id: undefined,
                vessel: {
                  pln: 'SD395',
                  vesselName: 'AURORA',
                  label: 'AURORA (SD395)',
                  homePort: 'SUNDERLAND',
                  flag: 'GBR',
                  cfr: 'GBRC18395',
                  imoNumber: null,
                  licenceNumber: '23010',
                  licenceValidTo: '2382-12-31T00:00:00'
                },
                faoArea: 'FAO27',
                dateLanded: '2021-07-15',
                exportWeight: 22,
                numberOfSubmissions: 0
              },
              landingId: undefined,
              addMode: false,
              editMode: false,
              error: '',
              errors: {}
            }
          ]
        },
        {
          product: {
            id: 'GBR-2021-CC-76096F601-3a87dc0b-424e-47e5-82f8-3b6e3d454ff2',
            commodityCode: '03028590',
            commodityCodeDescription: 'Fresh or chilled sea bream "Sparidae" (excl. gilt-head sea bream, Dentex dentex and Pagellus spp.)',
            presentation: {
              code: 'WHL',
              label: 'Whole'
            },
            scientificName: 'Spondyliosoma cantharus',
            state: {
              code: 'FRE',
              label: 'Fresh'
            },
            species: {
              code: 'BRB',
              label: 'Black seabream (BRB)'
            }
          }
        }
      ],
      busy: false
    };

    const wrapper = getWrapper(dataExportPayload, 1);

    expect(wrapper.find('Row#vessel_GBR-2021-CC-product-1_new').exists()).toBeTruthy();
  });

  it('should render a table with one row with an edit button and remove button', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('button#edit_GBR-2021-CC-landing-1').exists()).toBeTruthy();
    expect(wrapper.find('button#remove_GBR-2021-CC-landing-1').exists()).toBeTruthy();
  });

  it('should not render an edit button for a landing with an overriden vessel', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('button#edit_GBR-2021-CC-landing-2').exists()).toBeFalsy();
    expect(wrapper.find('button#remove_GBR-2021-CC-landing-2').exists()).toBeTruthy();
  });

  it('should edit a landing by clicking the edit button', () => {
    const wrapper = getWrapper(mockExportPayload, 1);
    const editBtn = wrapper.find('button#edit_GBR-2021-CC-landing-1');

    act(() => editBtn.prop('onClick')({ preventDefault: () => {}, currentTarget: { blur: () => {}}}));
    expect(mockEditLanding).toHaveBeenCalled();
    expect(mockEditLanding).toHaveBeenCalledWith('GBR-2021-CC-product-1', 'GBR-2021-CC-landing-1');
  });

  it('should remove a landing by clicking the remove button', () => {
    const wrapper = getWrapper(mockExportPayload, 1);
    const removeBtn = wrapper.find('button#remove_GBR-2021-CC-landing-1');

    act(() => removeBtn.prop('onClick')({ preventDefault: () => {}}));
    expect(mockRemoveLanding).toHaveBeenCalled();
    expect(mockRemoveLanding).toHaveBeenCalledWith('GBR-2021-CC-product-1', 'GBR-2021-CC-landing-1');
  });

});