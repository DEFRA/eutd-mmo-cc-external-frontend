import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import ProductsTable from '../../../src/client/components/products-table.component';

describe('Products Table', () => {
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
          }
        ]
      },
      {
        product: {
          id: 'GBR-2021-CC-product-2',
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
  const mockRemoveProduct = jest.fn();

  const getWrapper = ( exportPayload = { items: [ { product: { }}] }) => mount(
    <ProductsTable
      exportPayload={exportPayload}
      weight={3}
      documentNumber={mockDocumentNumber}
      removeProduct={mockRemoveProduct}
    />
  );

  it('should render an empty table with the correct headings', () => {
    const wrapper = getWrapper();
    expect(wrapper).toBeDefined();
    expect(wrapper.find('Table').exists()).toBeTruthy();

    expect(wrapper.find('CellHeader')).toHaveLength(3);
    expect(wrapper.find('CellHeader').at(0).text()).toBe('Product');
    expect(wrapper.find('CellHeader').at(1).text()).toBe('Export weight (kg)');
    expect(wrapper.find('CellHeader').at(2).text()).toBe('Action');
  });

  it('should render a table with total export weight footer', () => {
    const wrapper = getWrapper();

    expect(wrapper.find('#products-table-footer').exists()).toBeTruthy();
  });

  it('should render a table with one row', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('Row#product_GBR-2021-CC-product-1').exists()).toBeTruthy();
  });

  it('should render a table with one row with a remove button', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('#remove-btn_GBR-2021-CC-product-1').exists()).toBeTruthy();
  });

  it('should contain visually hidden text in Remove button and expect it to have Species Name, presentation and state', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('#remove-btn_GBR-2021-CC-product-1').exists()).toBeTruthy();
    expect(wrapper.find('#remove-btn_GBR-2021-CC-product-1').first().text()).toEqual('RemoveAtlantic cod (COD), Fresh, Filleted and skinned');
  });

  it('should handle remove product event', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    expect(wrapper.find('#remove-btn_GBR-2021-CC-product-1').first().simulate('click')).toBeTruthy();
  });

  it('should remove a product by clicking on remove handler', () => {
    const wrapper = getWrapper(mockExportPayload, 1);

    const removeBtn = wrapper.find('#remove-btn_GBR-2021-CC-product-1').first();

    act(() => removeBtn.prop('onClick')({preventDefault() {}, target: { value :'GBR-CC-PRODUCT-ID'}, currentTarget: { blur: () => {}}}));
    expect(mockRemoveProduct).toHaveBeenCalled();
    expect(mockRemoveProduct).toHaveBeenCalledWith('GBR-2021-CC-product-1');
  });

  it('should render a table of products with no landings', () => {
    const wrapper = getWrapper(mockExportPayload);

    expect(wrapper.find('Row#product_GBR-2021-CC-product-2').exists()).toBeTruthy();
  });

  it('should render an empty table with no products', () => {
    const mockExportPayloadWithNoProducts = {
      items: undefined
    };

    const wrapper = getWrapper(mockExportPayloadWithNoProducts);
    expect(wrapper.find('Row#product_GBR-2021-CC-product-1').exists()).toBeFalsy();
  });

  it('should render an empty table with product with no landing details', () => {
    const mockExportPayloadWithNoLandingDetails = {
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
              landingId: 'GBR-2021-CC-landing-1',
              addMode: false,
              editMode: false,
              error: '',
              errors: {}
            }
          ]
        }
      ],
    };

    const wrapper = getWrapper(mockExportPayloadWithNoLandingDetails);
    expect(wrapper.find('Cell').at(1).text()).toBe('0');
  });

  it('should render not a remove button when the number of product is less than 1', () => {
    const mockExportPayloadWithSingleProduct = {
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
              landingId: 'GBR-2021-CC-landing-1',
              addMode: false,
              editMode: false,
              error: '',
              errors: {}
            }
          ]
        }
      ],
    };

    const wrapper = getWrapper(mockExportPayloadWithSingleProduct);
    expect(wrapper.find('button#remove-btn_GBR-2021-CC-product-1').exists()).toBeFalsy();
  });

  it('should render remove buttons when the number of product is more than 1', () => {
    const mockExportPayloadWithTwoProducts = {
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
              landingId: 'GBR-2021-CC-landing-1',
              addMode: false,
              editMode: false,
              error: '',
              errors: {}
            }
          ]
        },
        {
          product: {
            id: 'GBR-2021-CC-product-2',
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
              landingId: 'GBR-2021-CC-landing-1',
              addMode: false,
              editMode: false,
              error: '',
              errors: {}
            }
          ]
        }
      ],
    };

    const wrapper = getWrapper(mockExportPayloadWithTwoProducts);
    expect(wrapper.find('button#remove-btn_GBR-2021-CC-product-2').exists()).toBeTruthy();
    expect(wrapper.find('button#remove-btn_GBR-2021-CC-product-1').exists()).toBeTruthy();
  });
});