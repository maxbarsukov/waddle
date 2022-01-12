import {
  Class,
  Formal,
  Function,
  NativeExpression,
} from '../../ast';
import Obj from '../Obj';
import { Types } from '../../types/Types';

export default class MathClass extends Class {
  constructor() {
    super(Types.Math);

    this.superClass = Types.Object;
    this.functions.push(new Function('e', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.E);
      return value;
    }), []));

    this.functions.push(new Function('ln2', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.LN2);
      return value;
    }), []));

    this.functions.push(new Function('ln10', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.LN10);
      return value;
    }), []));

    this.functions.push(new Function('log2e', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.LOG2E);
      return value;
    }), []));

    this.functions.push(new Function('log10e', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.LOG10E);
      return value;
    }), []));

    this.functions.push(new Function('pi', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.PI);
      return value;
    }), []));

    this.functions.push(new Function('abs', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.abs(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('abs', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.abs(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('acos', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.acos(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('acos', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.acos(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('acosh', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.acosh(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('acosh', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.acosh(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('asin', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.asin(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('asin', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.asin(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('asinh', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.asinh(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('asinh', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.asinh(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('atan', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.atan(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('atan', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.atan(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('atanh', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.atan(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('atanh', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.atan(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('cos', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.cos(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('cos', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.cos(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('cosh', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.cosh(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('ceil', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.ceil(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('floor', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.floor(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('log', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.log(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('log', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.log(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('log2', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.log2(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('log2', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.log2(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('log10', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.log10(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('log10', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.log10(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('max', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const y = context.store.get(context.environment.find('y')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.max(x.get('value'), y.get('value')));
      return value;
    }), [new Formal('x', Types.Int), new Formal('y', Types.Int)]));

    this.functions.push(new Function('max', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const y = context.store.get(context.environment.find('y')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.max(x.get('value'), y.get('value')));
      return value;
    }), [new Formal('x', Types.Double), new Formal('y', Types.Double)]));

    this.functions.push(new Function('min', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const y = context.store.get(context.environment.find('y')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.min(x.get('value'), y.get('value')));
      return value;
    }), [new Formal('x', Types.Int), new Formal('y', Types.Int)]));

    this.functions.push(new Function('min', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const y = context.store.get(context.environment.find('y')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.min(x.get('value'), y.get('value')));
      return value;
    }), [new Formal('x', Types.Double), new Formal('y', Types.Double)]));

    this.functions.push(new Function('pow', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const y = context.store.get(context.environment.find('y')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', x.get('value') ** y.get('value'));
      return value;
    }), [new Formal('x', Types.Int), new Formal('y', Types.Int)]));

    this.functions.push(new Function('pow', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const y = context.store.get(context.environment.find('y')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', x.get('value') ** y.get('value'));
      return value;
    }), [new Formal('x', Types.Double), new Formal('y', Types.Double)]));

    this.functions.push(new Function('random', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.random());
      return value;
    }), []));

    this.functions.push(new Function('random', Types.Int, new NativeExpression((context) => {
      const min = context.store.get(context.environment.find('min')!).get('value');
      const max = context.store.get(context.environment.find('max')!).get('value');
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.floor(Math.random() * (max - min + 1) + min));
      return value;
    }), [new Formal('min', Types.Int), new Formal('max', Types.Int)]));

    this.functions.push(new Function('round', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.round(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('sqrt', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.sqrt(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('sqrt', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.sqrt(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('sin', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.sin(x.get('value')));
      return value;
    }), [new Formal('x', Types.Int)]));

    this.functions.push(new Function('sin', Types.Double, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Double);

      value.set('value', Math.sin(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));

    this.functions.push(new Function('trunc', Types.Int, new NativeExpression((context) => {
      const x = context.store.get(context.environment.find('x')!);
      const value = Obj.create(context, Types.Int);

      value.set('value', Math.trunc(x.get('value')));
      return value;
    }), [new Formal('x', Types.Double)]));
  }
}
