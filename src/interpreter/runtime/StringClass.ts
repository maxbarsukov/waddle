import {
  Class,
  Formal,
  Function,
  FunctionCall,
  NativeExpression,
  Reference,
} from '../../ast';

import Obj from '../Obj';
import { Types } from '../../types/Types';
import Evaluator from '../Evaluator';

export default class StringClass extends Class {
  constructor() {
    super(Types.String);

    this.superClass = Types.Object;
    this.parameters.push(new Formal('value', 'string'));

    this.functions.push(new Function('toString', Types.String, new NativeExpression(context => {
      return context.self!;
    }), [], true));

    this.functions.push(new Function('==', Types.Bool, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const lhs = context.self!;
      const result = Obj.create(context, Types.Bool);

      if (rhs.type !== Types.String) {
        result.set('value', false);
      } else {
        result.set('value', lhs.get('value') === rhs.get('value'));
      }
      return result;
    }), [new Formal('rhs', Types.Object)], true));

    this.functions.push(new Function('!=', Types.Bool, new NativeExpression((context) => {
      const rhs = context.store.get(context.environment.find('rhs')!);
      const lhs = context.self!;
      const result = Obj.create(context, Types.Bool);

      if (rhs.type !== Types.String) {
        result.set('value', false);
      } else {
        result.set('value', lhs.get('value') !== rhs.get('value'));
      }
      return result;
    }), [new Formal('rhs', Types.Object)], true));

    this.functions.push(new Function('+', Types.String, new NativeExpression((context) => {
      const call = new FunctionCall('toString', [], new Reference('rhs'));
      const rhs = Evaluator.evaluate(context, call);
      const lhs = context.self!;
      const value = Obj.create(context, Types.String);

      value.set('value', lhs.get('value') + rhs.get('value'));
      return value;
    }), [new Formal('rhs', Types.Object)]));

    this.functions.push(new Function('at', Types.String, new NativeExpression((context) => {
      const index = context.store.get(context.environment.find('index')!);
      const self = context.self!;
      const value = Obj.create(context, Types.String);

      value.set('value', self.get('value').charAt(index.get('value')));
      return value;
    }), [new Formal('index', Types.Int)]));

    this.functions.push(new Function('length', Types.Int, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Int);

      value.set('value', context.self!.get('value').length);
      return value;
    }), []));

    this.functions.push(new Function('contains', Types.Bool, new NativeExpression((context) => {
      const s = context.store.get(context.environment.find('s')!);
      const self = context.self!;
      const value = Obj.create(context, Types.Bool);

      value.set('value', self.get('value').search(s.get('value')) > 0);
      return value;
    }), [new Formal('s', Types.String)]));

    this.functions.push(new Function('startsWith', Types.Bool, new NativeExpression((context) => {
      const s = context.store.get(context.environment.find('s')!);
      const self = context.self!;
      const value = Obj.create(context, Types.Bool);

      value.set('value', self.get('value').startsWith(s.get('value')));
      return value;
    }), [new Formal('s', Types.String)]));

    this.functions.push(new Function('endsWith', Types.Bool, new NativeExpression((context) => {
      const s = context.store.get(context.environment.find('s')!);
      const self = context.self!;
      const value = Obj.create(context, Types.Bool);

      value.set('value', self.get('value').endsWith(s.get('value')));
      return value;
    }), [new Formal('s', Types.String)]));

    this.functions.push(new Function('indexOf', Types.Int, new NativeExpression((context) => {
      const s = context.store.get(context.environment.find('s')!);
      const self = context.self!;
      const value = Obj.create(context, Types.Int);

      value.set('value', self.get('value').indexOf(s.get('value')));
      return value;
    }), [new Formal('s', Types.String)]));

    this.functions.push(new Function('toUpper', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);

      value.set('value', context.self!.get('value').toUpperCase());
      return value;
    }), []));

    this.functions.push(new Function('toLower', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);

      value.set('value', context.self!.get('value').toLowerCase());
      return value;
    }), []));

    this.functions.push(new Function('substring', Types.String, new NativeExpression((context) => {
      const start = context.store.get(context.environment.find('start')!);
      const value = Obj.create(context, Types.String);

      value.set('value', context.self!.get('value').substring(start.get('value')));
      return value;
    }), [new Formal('start', Types.Int)]));

    this.functions.push(new Function('substring', Types.String, new NativeExpression((context) => {
      const start = context.store.get(context.environment.find('start')!);
      const end = context.store.get(context.environment.find('end')!);
      const value = Obj.create(context, Types.String);

      value.set(
        'value',
        context.self!.get('value').substring(start.get('value'), end.get('value')),
      );
      return value;
    }), [new Formal('start', Types.Int), new Formal('end', Types.Int)]));

    this.functions.push(new Function('trim', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);

      value.set('value', context.self!.get('value').trim());
      return value;
    }), []));

    this.functions.push(new Function('replace', Types.String, new NativeExpression((context) => {
      const oldSub = context.store.get(context.environment.find('oldSub')!);
      const newSub = context.store.get(context.environment.find('newSub')!);
      const self = context.self!;
      const value = Obj.create(context, Types.String);

      value.set('value', self.get('value').replace(oldSub.get('value'), newSub.get('value')));
      return value;
    }), [new Formal('oldSub', Types.String), new Formal('newSub', Types.String)]));
  }
}
