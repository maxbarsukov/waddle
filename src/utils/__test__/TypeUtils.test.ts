import TypesUtils from '../TypesUtils';
import { Class } from '../../ast';
import { Types } from '../../types/Types';
import Context from '../../interpreter/Context';
import getRuntime from '../../interpreter/runtime';
import TypeEnvironment from '../../semantic/TypeEnvironment';

describe('TypesUtils', () => {
  it('#isIternal', () => {
    expect(TypesUtils.isIternal('int')).toBe(true);
    expect(TypesUtils.isIternal('double')).toBe(true);
    expect(TypesUtils.isIternal('string')).toBe(true);
    expect(TypesUtils.isIternal('Str')).toBe(false);
    expect(TypesUtils.isIternal('Int')).toBe(false);
    expect(TypesUtils.isIternal('Object')).toBe(false);
  });

  it('#isPrimitive', () => {
    expect(TypesUtils.isPrimitive('Void')).toBe(true);
    expect(TypesUtils.isPrimitive('double')).toBe(false);
    expect(TypesUtils.isPrimitive('string')).toBe(false);
    expect(TypesUtils.isPrimitive('String')).toBe(true);
    expect(TypesUtils.isPrimitive('Int')).toBe(true);
    expect(TypesUtils.isPrimitive('Object')).toBe(false);
  });

  it('#hasFunctionWithName', () => {
    const typeEnvironment = new TypeEnvironment();
    const context = new Context();

    const classes = getRuntime();
    classes.forEach(cl => {
      typeEnvironment.addClass(cl);
      context.addClass(cl);
    });

    const a = new Class('A');
    a.superClass = Types.Object;
    expect(TypesUtils.hasFunctionWithName(a, 'toString', typeEnvironment));
  });

  it('#allEqual', () => {
    expect(TypesUtils.allEqual(
      [Types.Int, Types.Object],
      [Types.Object]),
    ).toBe(false);
    expect(TypesUtils.allEqual(
      [Types.Object],
      [Types.Object, Types.Int]),
    ).toBe(false);
    expect(TypesUtils.allEqual(
      [Types.Object],
      [Types.Object]),
    ).toBe(true);
    expect(TypesUtils.allEqual(
      [Types.Object, Types.Int],
      [Types.Int, Types.Object]),
    ).toBe(false);
    expect(TypesUtils.allEqual(
      [Types.Int, Types.Object],
      [Types.Int, Types.Object]),
    ).toBe(true);
  });

  it('#mostSpecificFunction', () => {
    // const f1 = new Function();
    // const f2 = new Function();
    const env = new TypeEnvironment();
    expect(TypesUtils.mostSpecificFunction(undefined, undefined, env)).toBe(undefined);
  });
});
