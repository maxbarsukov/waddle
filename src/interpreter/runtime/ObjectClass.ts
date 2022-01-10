import {
  Class,
  Formal,
  Function,
  FunctionCall,
  NativeExpression,
  Reference,
  This,
} from '../../ast';

import Obj from '../Obj';
import { Types } from '../../types/Types';
import Evaluator from '../Evaluator';

export default class ObjectClass extends Class {
  constructor() {
    super(Types.Object);

    this.functions.push(new Function('instanceOf', Types.Bool, new NativeExpression((context) => {
      const type = context.store.get(context.environment.find('type')!);
      const self = context.self!;
      const value = Obj.create(context, Types.Bool);
      value.set('value', self.type === type.get('value'));
      return value;
    }), [new Formal('type', Types.String)]));

    this.functions.push(new Function('toString', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);
      value.set('value', `${context.self!.type}@${context.self!.address}`);
      return value;
    }), []));

    this.functions.push(new Function('==', Types.Bool, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const value = Obj.create(context, Types.Bool);
      if (context.self!.type !== rhs.type) {
        value.set('value', false);
      } else {
        value.set('value', context.self!.address === rhs.address);
      }
      return value;
    }), [new Formal('rhs', Types.Object)]));

    this.functions.push(new Function('!=', Types.Bool, new NativeExpression((context) => {
      const object = new This();
      object.expressionType = Types.Object;
      const arg = new Reference('rhs');
      arg.expressionType = Types.Object;
      const call = new FunctionCall('==', [arg], object);
      const value = Evaluator.evaluate(context, call);
      value.set('value', !value.get('value'));
      return value;
    }), [new Formal('rhs', Types.Object)]));

    this.functions.push(new Function('!=', Types.Bool, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Bool);
      value.set('value', context.self!.type !== Types.Null);
      return value;
    }), [new Formal('rhs', Types.Null)]));

    this.functions.push(new Function('+', Types.String, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const object = new This();
      object.expressionType = Types.Object;

      const call = new FunctionCall('toString', [], object);
      const self = Evaluator.evaluate(context, call);
      const value = Obj.create(context, Types.String);
      value.set('value', self.get('value') + rhs.get('value'));
      return value;
    }), [new Formal('rhs', Types.String)]));
  }
}
