import TypesUtils from '../TypesUtils';
import { Class, Expression, Formal, Function } from '../../ast';
import { Types } from '../../types/Types';
import Context from '../../interpreter/Context';
import getRuntime from '../../interpreter/runtime';
import TypeEnvironment from '../../semantic/TypeEnvironment';

describe('TypesUtils', () => {
  const typeEnv = new TypeEnvironment();
  const context = new Context();

  const runtimeClasses = getRuntime();
  runtimeClasses.forEach(cls => {
    typeEnv.addClass(cls);
    context.addClass(cls);
  });

  beforeEach(() => {
    typeEnv.symbolTable.clear();
  });

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
    const a = new Class('A');
    a.superClass = Types.Object;
    expect(TypesUtils.hasFunctionWithName(a, 'toString', typeEnv));
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
    const f1 = new Function(
      'fun1',
      Types.String,
      new Expression(),
      [new Formal('a', Types.Int), new Formal('b', Types.String)],
    );
    const f2 = new Function(
      'fun2',
      Types.String,
      new Expression(),
      [new Formal('x', Types.Int), new Formal('y', Types.String)],
    );
    const f3 = new Function(
      'fun3',
      Types.String,
      new Expression(),
      [new Formal('y', Types.String), new Formal('x', Types.Int)],
    );
    const f4 = new Function(
      'fun4',
      Types.String,
      new Expression(),
      [new Formal('s', Types.Int)],
    );
    expect(TypesUtils.mostSpecificFunction(undefined, undefined, typeEnv)).toBe(undefined);
    expect(TypesUtils.mostSpecificFunction(f1, undefined, typeEnv)).toBe(undefined);
    expect(TypesUtils.mostSpecificFunction(f1, f2, typeEnv)).toBe(f1);
    expect(TypesUtils.mostSpecificFunction(f2, f1, typeEnv)).toBe(f2);
    expect(TypesUtils.mostSpecificFunction(f1, f3, typeEnv)).toBe(undefined);
    expect(TypesUtils.mostSpecificFunction(f1, f4, typeEnv)).toBe(undefined);
  });
});
