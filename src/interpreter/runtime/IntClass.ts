import { Class, Formal, Function, NativeExpression } from '../../ast';
import Obj from '../Obj';
import { Types } from '../../types/Types';

export default class IntClass extends Class {
  constructor() {
    super(Types.Int);

    this.superClass = Types.Object;
    this.parameters.push(new Formal('value', 'int'));

    this.functions.push(new Function('toString', Types.String, new NativeExpression((context) => {
      const result = Obj.create(context, Types.String);

      result.set('value', context.self!.get('value').toString());
      return result;
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

    this.functions.push(new Function('unary_-', Types.Int, new NativeExpression((context) => {
      const result = Obj.create(context, Types.Int);
      result.set('value', -context.self!.get('value'));
      return result;
    }), []));

    this.functions.push(new Function('%', Types.Int, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const lhs = context.self!;

      const result = Obj.create(context, Types.Int);
      result.set('value', lhs.get('value') % rhs.get('value'));

      return result;
    }), [new Formal('rhs', Types.Int)]));

    [Types.Int, Types.Double].forEach(type => {
      this.functions.push(new Function('+', type, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, type);
        result.set('value', lhs.get('value') + rhs.get('value'));
        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('-', type, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, type);
        result.set('value', lhs.get('value') - rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('*', type, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, type);
        result.set('value', lhs.get('value') * rhs.get('value'));

        return result;
      }), [new Formal('rhs', type)]));

      this.functions.push(new Function('/', type, new NativeExpression((context) => {
        const rhs = context.store.get(context.environment.find('rhs')!);
        const lhs = context.self!;

        const result = Obj.create(context, Types.Int);
        result.set('value', Math.round(lhs.get('value') / rhs.get('value')));

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
