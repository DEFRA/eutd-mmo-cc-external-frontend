import { mount, shallow } from 'enzyme';
import * as React from 'react';
import GovukAutocomplete from '../../../src/client/components/GovukAutocomplete';

const onChangeMock = jest.fn();
const clearSearchResultsMock = jest.fn();
const searchMock = jest.fn();

const getWrapper = (error, searchResults, fullDepth = false) => {
  const mounter = fullDepth ? mount : shallow;

  return mounter(<GovukAutocomplete
    label='Foo'
    hintText='Bar'
    error={error || {}}
    controlName='foo'
    controlId='foo'
    searchResults={searchResults || []}
    selectedItemName={''}
    onChange={onChangeMock}
    search={searchMock}
    getItem={jest.fn()}
    clearSearchResults={clearSearchResultsMock}
    translate={(foo) => foo}
  />);
};

describe('Autocomplete box', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load fine with no data', () => {
    expect(getWrapper()).toBeDefined();
  });

  it('should load fine with data', () => {

    const comp = getWrapper(null, [
      {
        label: 'foo',
        id: 'foo'
      },
      {
        label: 'boo',
        id: 'boo'
      }
    ], true);

    expect(comp).toBeDefined();
    const el = comp.find('[controlId="foo"]');
    expect(el).toBeDefined();
    const event = {target: {name: 'foo', value: 'bar'}};
    el.simulate('change', event);
  });

  it('should load fine with error', () => {
    const comp = getWrapper({ 'fooError': 'Error out' }, null);
    expect(comp).toBeDefined();
  });

  describe('#renderItemsMenu', () => {

    it('Should render an ul element', () => {
      const wrapper = shallow(getWrapper().instance().renderItemsMenu(null));
      expect(wrapper.matchesElement(<ul id="vessel-list"></ul>)).toBe(true);
    });

  });

  describe('#renderAutocompleteItem', () => {

    const item = { label: 'test', domId: 0 };
    const expectContains = (highlight) => (
      <li
        id={item.domId}
        style={{ background: highlight ? 'lightgray' : 'white', padding: '2px 4px' }}
      >
        {item.label}
      </li>
    );

    it('Should render a li with item details without highlight', () => {
      const wrapper = shallow(getWrapper().instance().renderAutocompleteItem(item, false));
      expect(wrapper.contains(expectContains(false))).toBe(true);
    });

    it('Should render a li with item details with highlight', () => {
      const wrapper = shallow(getWrapper().instance().renderAutocompleteItem(item, true));
      expect(wrapper.contains(expectContains(true))).toBe(true);
    });

  });

  describe('#debouncedSearch', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      window.setTimeout = jest.fn().mockImplementation((cb, time) => {
        cb();
        expect(time).toBeGreaterThan(0);
      });
    });

    it('Should call the search function with the landed date after a timeout', () => {
      getWrapper().instance().debouncedSearch('search', 'date');
      expect(searchMock).toHaveBeenCalledWith('search', 'date');
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    });

    it('Should call the search function with one param', () => {
      getWrapper().instance().debouncedSearch('search');
      expect(searchMock).toHaveBeenCalledWith('search');
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    });

    it('Should not call the search function after a timeout if the search term is < 2 characters', () => {
      getWrapper().instance().debouncedSearch('s');
      expect(searchMock).not.toHaveBeenCalled();
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    });

    it('Should clear the timeout function if already running', () => {
      const wrapper = getWrapper();
      wrapper.instance().timeout = 'running';
      window.clearTimeout = jest.fn();
      wrapper.instance().debouncedSearch('s');
      expect(window.clearTimeout).toHaveBeenCalledWith('running');
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    });
  });

  describe('#handleOnSelect', () => {

    it('Should call props.onChange and props.clearSearchResults', () => {
      getWrapper().instance().handleOnSelect(0, 'foo');
      expect(onChangeMock).toHaveBeenCalledWith(0, 'foo');
      expect(clearSearchResultsMock).toHaveBeenCalled();
    });

  });

  describe('#onInputChange', () => {

    it('Should call props.onChange with the event target value', () => {
      getWrapper().instance().onInputChange({ target: { value: 'search' }});
      expect(onChangeMock).toHaveBeenCalledWith('search', null);
    });

  });

});
