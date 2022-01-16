import { Types } from '../../../types/Types';
import { Expression, Class, Property } from '../..';

describe('Class', () => {
  const klass = new Class('Klass');
  klass.properties.push(
    new Property('a', Types.Int, new Expression()),
    new Property('b', Types.Double, new Expression()),
  );

  it('#hasProperty', () => {
    expect(klass.hasProperty('a')).toBe(true);
    expect(klass.hasProperty('b')).toBe(true);
    expect(klass.hasProperty('noSuchProp')).toBe(false);
  });

  it('#getProperty', () => {
    expect(klass.getProperty('a')?.type).toBe(Types.Int);
    expect(klass.getProperty('b')?.type).toBe(Types.Double);
    expect(klass.getProperty('noSuchProp')).toBe(undefined);
  });
});
