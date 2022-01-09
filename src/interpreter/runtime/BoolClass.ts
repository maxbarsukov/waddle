import { Class, Formal, Function, NativeExpression } from '../../ast';
import Evaluator from '../Evaluator';
import Obj from '../Obj';
import { Types } from '../../types/Types';
import Context from '../Context';

export default class BoolClass extends Class {
  constructor() {
    super(Types.Bool);
    this.superClass = Types.Object;
    this.parameters.push(new Formal('value', 'bool'));

    this.functions.push(new Function(
      'toString', Types.String, new NativeExpression((context: Context) => {
        const value = Obj.create(context, Types.String);
        value.set('value', context.self!.get('value').toString());
        return value;
      }), [], true));

    this.functions.push(new Function('==', Types.Bool, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const lhs = context.self!;

      const value = Obj.create(context, Types.Bool);

      if (rhs.type !== Types.Bool) {
        value.set('value', false);
      } else {
        value.set('value', lhs.get('value') === rhs.get('value'));
      }

      return value;
    }), [new Formal('rhs', Types.Object)], true));

    this.functions.push(new Function('unary_!', Types.Bool, new NativeExpression((context) => {
      const result = Obj.create(context, Types.Bool);

      result.set('value', !context.self!.get('value'));

      return result;
    }), []));

    this.functions.push(new Function('&&', Types.Bool, new NativeExpression((context) => {
      const lhs = context.self;
      const value = Obj.create(context, Types.Bool);

      if (lhs!.get('value') === false) {
        value.set('value', false);
      } else {
        const address = context.environment.find('rhs')!;
        let rhs = context.store.get(address);

        rhs = Evaluator.evaluate(rhs.context, rhs.expression);
        context.store.put(address, rhs);
        value.set('value', rhs.get('value'));
      }

      return value;
    }), [new Formal('rhs', Types.Bool, true)]));

    this.functions.push(new Function(
      '||', Types.Bool, new NativeExpression((context) => {
        const lhs = context.self;
        const value = Obj.create(context, Types.Bool);

        if (lhs!.get('value') === true) {
          value.set('value', true);
        } else {
          const address = context.environment.find('rhs')!;
          let rhs = context.store.get(address);

          rhs = Evaluator.evaluate(rhs.context, rhs.expression);
          context.store.put(address, rhs);
          value.set('value', rhs.get('value'));
        }

        return value;
      }), [new Formal('rhs', Types.Bool, true)]));
  }
}
