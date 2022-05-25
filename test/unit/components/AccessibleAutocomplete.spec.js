import {  mount } from 'enzyme';
import * as React from 'react';
import AccessibleAutoComplete from '../../../src/client/components/AccessibleAutocomplete';

describe('AccessibleAutoComplete', () => {

  let wrapper;
  const search = jest.fn();

  beforeEach(() => {
    const props = {
      search,
      nojsValues: []
    };

    wrapper = mount(<AccessibleAutoComplete {...props} />);
  });

  it('Should render AccessibleAutoComplete', () => {
    expect(wrapper).toBeDefined();
  });

  it('Should search with the query and call populateResults', async () => {
    const populateResults = jest.fn();
    search.mockReturnValue(['result1']);
    await wrapper.instance().suggest('test', populateResults);
    expect(search).toHaveBeenCalledWith('test');
    expect(populateResults).toHaveBeenCalledWith(['result1']);
  });

  it('Should create an option element for each nonJs option, there should be an extra option for the non value', () => {
    wrapper.setState({ showJsAutoComplete: false });
    wrapper.setProps({ nojsValues: ['opt1', 'opt2', 'opt3'] });
    expect(wrapper.find('option').length).toEqual(4);
  });

  it('Should use an empty array if nojsValues is undefined, but there should still be one option.', () => {
    wrapper.setState({ showJsAutoComplete: false });
    wrapper.setProps({ nojsValues: undefined });
    expect(wrapper.find('option').length).toEqual(1);
  });

});

describe('AccessibleAutoComplete - window is undefined', () => {
  const search = jest.fn();
  const props = {
    search,
    nojsValues: []
  };

  const { window } = global;

  beforeAll(() => {
    delete global.window;
  });

  afterAll(() => {
    global.window = window;
  });

  it('Should throw an Reference exemption error', () => {
    expect(() => mount(<AccessibleAutoComplete {...props} />)).toThrow('window is not defined');
  });

});