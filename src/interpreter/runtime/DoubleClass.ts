import { Class, Formal, Function, NativeExpression } from '../../ast';
import Obj from '../Obj';
import { Types } from '../../types/Types';

export default class DoubleClass extends Class {
  constructor() {
    super(Types.Double);

    this.superClass = Types.Object;
    this.parameters.push(new Formal('value', 'double'));

    this.functions.push(new Function('toString', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);

      value.set('value', context.self!.get('value').toString());
      return value;
    }), [], true));

    this.functions.push(new Function('==', Types.Bool, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const lhs = context.self!;
      const value = Obj.create(context, Types.Bool);

      if (rhs.type !== Types.Int && rhs.type !== Types.Double) {
        value.set('value', false);
      } else {
        value.set('value', lhs.get('value') === rhs.get('value'));
      }
      return value;
    }), [new Formal('rhs', Types.Object)], true));

    this.functions.push(new Function('unary_-', Types.Double, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Double);

      value.set('value', -context.self!.get('value'));

      return value;
    }), []));

    [Types.Double, Types.Int].forEach(type => {
      this.functions.push(new Function('+', Types.Double, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Double);
        result.set('value', lhs.get('value') + rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('-', Types.Double, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Double);
        result.set('value', lhs.get('value') - rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('*', Types.Double, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Double);
        result.set('value', lhs.get('value') * rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('/', Types.Double, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Double);
        result.set('value', lhs.get('value') / rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('%', Types.Double, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Double);
        result.set('value', lhs.get('value') % rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('>', Types.Bool, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Bool);
        result.set('value', lhs.get('value') > rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('>=', Types.Bool, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Bool);
        result.set('value', lhs.get('value') >= rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('<', Types.Bool, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Bool);
        result.set('value', lhs.get('value') < rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('<=', Types.Bool, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Bool);
        result.set('value', lhs.get('value') <= rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));
    });
  }
}
