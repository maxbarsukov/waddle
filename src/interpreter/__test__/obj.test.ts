import Obj from '../Obj';
import { Function, NativeExpression } from '../../ast';
import { Types } from '../../types/Types';
import Context from '../Context';
import getRuntime from '../runtime';

describe('Obj', () => {
  const obj = new Obj();

  const func1 = new Function('method', Types.String, new NativeExpression((context) => {
    const value = Obj.create(context, Types.String);
    value.set('value', context.self!.get('value').toString());
    return value;
  }), [], true);

  const func2 = new Function('method1', Types.String, new NativeExpression((context) => {
    const value = Obj.create(context, Types.String);
    value.set('value', context.self!.get('value').toString());
    return value;
  }), [], true);

  obj.functions.push(func1, func2);

  describe('#getMethod', () => {
    it('should get null if there is no method', () => {
      expect(obj.getMethod('noSuchMethod', [])).toBe(null);
    });

    it('should method if name found', () => {
      expect(obj.getMethod('method', [])).toBe(func1);
      expect(obj.getMethod('method1', [])).toBe(func2);
    });
  });

  describe('#defaultValue', () => {
    const context = new Context();

    const runtimeClasses = getRuntime();
    runtimeClasses.forEach(cls => {
      context.addClass(cls);
    });

    it('should get 0 as Int default value', () => {
      expect(Obj.defaultValue(context, Types.Int)!.get('value')).toBe(0);
    });

    it('should get 0.0 as Double default value', () => {
      expect(Obj.defaultValue(context, Types.Double)!.get('value')).toBe(0.0);
      expect(Obj.defaultValue(context, Types.Double)!.type).toBe(Types.Double);
    });

    it('should get false as Bool default value', () => {
      expect(Obj.defaultValue(context, Types.Bool)!.get('value')).toBe(false);
    });

    it('should get empty string as String default value', () => {
      expect(Obj.defaultValue(context, Types.String)!.get('value')).toBe('""');
    });

    it('should get null as Nulll default value', () => {
      expect(Obj.defaultValue(context, Types.Null)!.type).toBe(Types.Null);
      expect(Obj.defaultValue(context, Types.Object)!.type).toBe(Types.Null);
    });
  });

  describe('#toString', () => {
    const context = new Context();

    const runtimeClasses = getRuntime();
    runtimeClasses.forEach(cls => {
      context.addClass(cls);
    });

    it('toString works correctly', () => {
      expect(obj.toString()).toBe('undefined(undefined: undefined)');
      obj.type = 'SomeType';
      expect(obj.toString()).toBe('SomeType(undefined: undefined)');
      obj.properties = new Map<string, any>([
        ['keyInt', 1],
        ['keyString', 'Str'],
      ]);

      expect(obj.toString()).toBe('SomeType(keyInt: 1, keyString: Str)');
    });
  });
});
