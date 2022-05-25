import ProductWeights from '../../../../../src/client/pages/exportCertificates/landings/ProductWeights';
import { mount } from 'enzyme';
import React from 'react';
import { render } from '@testing-library/react';

describe('ProductWeights', () => {
  let wrapper;

  const species = [
    {
      speciesId: '1',
      speciesLabel: 'Cod',
      exportWeight: 100,
    },
    {
      speciesId: '2',
      speciesLabel: 'Herring',
      exportWeight: 200,
    },
  ];

  const errors = [
    {
      targetName: 'weights.1.exportWeight',
      text: 'error!'
    }
  ];

  const onChange = jest.fn();

  beforeAll(() => {
    wrapper = mount(
      <ProductWeights species={species} onWeightChange={onChange} errors={errors} />
    );
  });

  it('will render', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.text()).toContain('Product weights');
  });

  it('should take a snapshot of the whole page', () => {
    const { container } = render(wrapper);
    expect(container).toMatchSnapshot();
  });
  
  it('will show the correct total export weight', () => {
    expect(wrapper.exists('#totalExportWeight')).toBe(true);
    expect(wrapper.find('#totalExportWeight').at(0).text()).toBe('300kg');
  });

  it('will call onChange when a weight is updated', () => {
    expect(onChange).not.toHaveBeenCalled();

    const first = wrapper.find('input[name="weight"]').first();

    first.simulate('change', { target: { name: 'weight', value: '1000' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('1', '1000');
  });

  it('will count invalid weights as 0', () => {
    const speciesWithInvalidWeight = [
      {
        speciesId: '1',
        speciesLabel: 'Cod',
        exportWeight: 100.10,
      },
      {
        speciesId: '2',
        speciesLabel: 'Herring',
        exportWeight: '23,3333',
      }
    ];

    const wrapperWithInvalidWeight = mount(
      <ProductWeights
        species={speciesWithInvalidWeight}
        onWeightChange={onChange}
        errors={errors}
      />
    );

    expect(wrapperWithInvalidWeight.exists('#totalExportWeight')).toBe(true);
    expect(
      wrapperWithInvalidWeight.find('#totalExportWeight').at(0).text()
    ).toBe('100.10kg');
  });

  it('will set a unique id for every weight input', () => {
    expect(wrapper.find('WeightInput').at(0).prop('id')).toBe('weights.0.exportWeight');
    expect(wrapper.find('WeightInput').at(1).prop('id')).toBe('weights.1.exportWeight');
  });

  it('will show an error', () => {
    expect(wrapper.find('WeightInput').at(0).prop('error')).toBe('');
    expect(wrapper.find('WeightInput').at(1).prop('error')).toBe('error!');
  });
});
