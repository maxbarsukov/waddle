import TypeEnvironment from '../TypeEnvironment';
import getRuntime from '../../interpreter/runtime';

import { Class, Expression, Function } from '../../ast';
import { Types } from '../../types/Types';

describe('TypeEnvironment', () => {
  const typeEnv = new TypeEnvironment();

  const runtimeClasses = getRuntime();
  runtimeClasses.forEach(cls => {
    typeEnv.addClass(cls);
  });

  beforeEach(() => {
    typeEnv.symbolTable.clear();
  });

  it('#addClass', () => {
    const n = typeEnv.classes.size;
    typeEnv.addClass(new Class('A'));
    expect(typeEnv.classes.size).toBe(n + 1);
  });

  it('#hasClass', () => {
    typeEnv.addClass(new Class('AA'));
    expect(typeEnv.hasClass('AA')).toBe(true);
    expect(typeEnv.hasClass('BB')).toBe(false);
  });

  it('#getClass', () => {
    const klass = new Class('AAA');
    typeEnv.addClass(klass);
    expect(typeEnv.getClass('AAA')).toBe(klass);
    expect(typeEnv.getClass('BBB')).toBe(undefined);
  });

  it('#removeClass', () => {
    const n = typeEnv.classes.size;
    typeEnv.addClass(new Class('AAAA'));
    expect(typeEnv.classes.size).toBe(n + 1);
    typeEnv.removeClass('AAAA');
    expect(typeEnv.classes.size).toBe(n);
  });

  it('#addFunction', () => {
    const n = typeEnv.functions.get('A')!.length;
    typeEnv.addFunction('A', new Function('a', Types.String, new Expression()));
    expect(typeEnv.functions.get('A')!.length).toBe(n + 1);
  });

  it('#hasFunction', () => {
    const f1 = new Function('aa', Types.String, new Expression());
    const f2 = new Function('bb', Types.String, new Expression());
    typeEnv.addFunction('AA', f1);
    expect(typeEnv.hasFunction('AA', f1)).toBe(true);
    expect(typeEnv.hasFunction('AA', f2)).toBe(false);
  });

  it('#getFunction', () => {
    const f1 = new Function('aaa', Types.String, new Expression());
    typeEnv.addFunction('AAA', f1);
    expect(typeEnv.getFunction('AAA', 'aaa')).toBe(f1);
    expect(typeEnv.getFunction('AAA', 'bbb')).toBe(undefined);
  });

  it('#conform', () => {
    const k1 = new Class('K1');
    const k2 = new Class('K2');
    const k3 = new Class('K3');
    k3.superClass = 'K2';
    typeEnv.addClass(k1);
    typeEnv.addClass(k2);
    typeEnv.addClass(k3);
    expect(typeEnv.conform('K1', 'K2')).toBe(false);
    expect(typeEnv.conform('K1', 'K3')).toBe(false);
    expect(typeEnv.conform('K3', 'K2')).toBe(true);
    expect(typeEnv.conform('K3', 'Object')).toBe(false);
    expect(typeEnv.conform('Object', 'K1')).toBe(false);
  });
});
