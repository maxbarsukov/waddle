import TypesUtils from '../TypesUtils';
import { Class, Expression, Formal, Function, NativeExpression } from '../../ast';
import { Types } from '../../types/Types';
import Context from '../../interpreter/Context';
import getRuntime from '../../interpreter/runtime';
import TypeEnvironment from '../../semantic/TypeEnvironment';
import Obj from '../../interpreter/Obj';

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
    expect(TypesUtils.hasFunctionWithName(a, 'toString', typeEnv)).toBe(true);
    expect(TypesUtils.hasFunctionWithName(a, 'someFunc', typeEnv)).toBe(false);
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

  it('#inheritanceIndex', () => {
    const a = new Class('A');
    a.superClass = Types.Object;
    const b = new Class('B');
    b.superClass = 'A';
    typeEnv.addClass(a);
    typeEnv.addClass(b);
    expect(TypesUtils.inheritanceIndex(Types.Object, Types.Object, typeEnv)).toBe(0);
    expect(TypesUtils.inheritanceIndex(Types.Int, Types.Object, typeEnv)).toBe(1);
    expect(TypesUtils.inheritanceIndex('A', Types.Object, typeEnv)).toBe(1);
    expect(TypesUtils.inheritanceIndex('B', Types.Object, typeEnv)).toBe(2);
    expect(TypesUtils.inheritanceIndex('B', 'A', typeEnv)).toBe(1);
  });

  it('#findMethodToApply', () => {
    const a = new Class('A');
    a.superClass = Types.Object;
    const func = new Function(
      'method', Types.String, new NativeExpression((ctx) => {
        const arg = ctx.store.get(ctx.environment.find('a')!);
        const value = Obj.create(ctx, Types.String);
        value.set('value', arg.get('value').toString());
        return value;
      }), [new Formal('a', Types.Int, true)]);

    a.functions.push(func);
    typeEnv.addClass(a);

    expect(TypesUtils.findMethodToApply(a, 'anotherMethod', ['Int'], typeEnv))
      .toBe(undefined);

    expect(TypesUtils.findMethodToApply(a, 'method', ['String'], typeEnv))
      .toBe(undefined);

    expect(TypesUtils.findMethodToApply(a, 'method', ['Int'], typeEnv))
      .toBe(func);
  });

  it('#findOverridedFunction', () => {
    const a = new Class('A');
    a.superClass = Types.Object;
    const func = new Function(
      'method', Types.Bool, new NativeExpression((ctx) => {
        const value = Obj.create(ctx, Types.Bool);
        value.set('value', false);
        return value;
      }), [new Formal('a', Types.Int, true)]);

    a.functions.push(func);
    typeEnv.addClass(a);

    const b = new Class('B');
    b.superClass = 'A';
    typeEnv.addClass(b);

    expect(TypesUtils.findOverridedFunction('NO_SUPER_CLASS', func, typeEnv)).toBe(undefined);
    expect(TypesUtils.findOverridedFunction('A', func, typeEnv)).toBe(func);
    expect(TypesUtils.findOverridedFunction('B', func, typeEnv)).toBe(func);
    expect(TypesUtils.findOverridedFunction(Types.Object, func, typeEnv)).toBe(undefined);
  });

  it('#leastUpperBound', () => {
    const a = new Class('A');
    a.superClass = Types.Object;
    typeEnv.addClass(a);

    const b = new Class('B');
    b.superClass = 'A';
    typeEnv.addClass(b);

    const c = new Class('C');
    c.superClass = Types.Object;
    typeEnv.addClass(c);

    expect(TypesUtils.leastUpperBound('A', 'A', typeEnv)).toBe('A');
    expect(TypesUtils.leastUpperBound(Types.Object, Types.Object, typeEnv)).toBe(Types.Object);
    expect(TypesUtils.leastUpperBound('A', Types.Null, typeEnv)).toBe('A');
    expect(TypesUtils.leastUpperBound(Types.Null, 'B', typeEnv)).toBe('B');
    expect(TypesUtils.leastUpperBound('A', 'B', typeEnv)).toBe('A');
    expect(TypesUtils.leastUpperBound('B', 'A', typeEnv)).toBe('A');
    expect(TypesUtils.leastUpperBound('B', Types.Object, typeEnv)).toBe(Types.Object);
    expect(TypesUtils.leastUpperBound(Types.Object, 'A', typeEnv)).toBe(Types.Object);
    expect(TypesUtils.leastUpperBound('A', 'C', typeEnv)).toBe(Types.Object);
  });
});
