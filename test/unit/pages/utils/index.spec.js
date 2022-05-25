import { constructAddress, hasAdminOverride } from '../../../../src/client/pages/utils/index';

it('Construct address with no fields', () => {
  const addressArray = [];
  const expectedResult = '';
  expect(constructAddress(addressArray)).toEqual(expectedResult);
});

it('Construct address with 3 fields', () => {
  const addressArray = [undefined, 'Line 2', 'Line 3', 'Line 4'];
  const expectedResult = 'Line 2, Line 3. Line 4';
  expect(constructAddress(addressArray)).toEqual(expectedResult);
});

it('Construct address with 2 fields', () => {
  const addressArray = [undefined, undefined, 'Line 3', 'Line 4'];
  const expectedResult = ', Line 3. Line 4';
  expect(constructAddress(addressArray)).toEqual(expectedResult);
});

it('Construct address with 1 field', () => {
  const addressArray = [undefined, undefined, undefined, 'Line 4'];
  const expectedResult = '. Line 4';
  expect(constructAddress(addressArray)).toEqual(expectedResult);
});

it('Construct address with 0 field', () => {
  const addressArray = [undefined, undefined, undefined, undefined];
  const expectedResult = '';
  expect(constructAddress(addressArray)).toEqual(expectedResult);
});

it('Construct address with 4 fields', () => {
  const addressArray = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
  const expectedResult = 'Line 1 Line 2, Line 3. Line 4';
  expect(constructAddress(addressArray)).toEqual(expectedResult);
});

describe('hasAdminOverride', () => {
  it('will return false if no exportPayload', () => {
    const input = null;
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if the items property is not in the exportPayload', () => {
    const input = {};
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if there are no items in the exportPayload', () => {
    const input = { items: [] };
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if there are no landings in the exportPayload', () => {
    const input = { items: [{ product: 'cod' }] };
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if the landings dont have a model', () => {
    const input = { items: [{ product: 'cod', landings: [{}] }] };
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if the landings dont have a vessel', () => {
    const input = { items: [{ product: 'cod', landings: [{ model: {} }] }] };
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return false if the vessel isnt overridden by an admin', () => {
    const input = {
      items: [
        {
          product: 'cod',
          landings: [{ model: { vessel: { vesselName: 'WIRON5' } } }],
        },
      ],
    };
    expect(hasAdminOverride(input)).toBe(false);
  });

  it('will return true if the vessel is overridden by an admin', () => {
    const input = {
      items: [
        {
          product: 'cod',
          landings: [
            {
              model: {
                vessel: { vesselName: 'WIRON5', vesselOverriddenByAdmin: true },
              },
            },
          ],
        },
      ],
    };
    expect(hasAdminOverride(input)).toBe(true);
  });

  it('will return true if only one vessel is overridden by an admin', () => {
    const input = {
      items: [
        {
          product: 'cod',
          landings: [{ model: { vessel: { vesselName: 'WIRON5' } } }],
        },
        {
          product: 'herring',
          landings: [
            {
              model: {
                vessel: { vesselName: 'WIRON5', vesselOverriddenByAdmin: true },
              },
            },
          ],
        },
      ],
    };
    expect(hasAdminOverride(input)).toBe(true);
  });
});
