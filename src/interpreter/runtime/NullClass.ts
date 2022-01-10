import {
  Class,
  Formal,
  Function,
  NativeExpression,
} from '../../ast';

import Obj from '../Obj';
import { Types } from '../../types/Types';

export default class NullClass extends Class {
  constructor() {
    super(Types.Null);

    this.functions.push(new Function('toString', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);
      value.set('value', 'null');
      return value;
    }), [], true));

    this.functions.push(new Function('==', Types.Bool, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Bool);
      value.set('value', context.store.get(context.environment.find('rhs')!).type === Types.Null);
      return value;
    }), [new Formal('rhs', Types.Object)]));

    this.functions.push(new Function('!=', Types.Bool, new NativeExpression((context) => {
      const value = Obj.create(context, Types.Bool);
      value.set('value', context.store.get(context.environment.find('rhs')!).type !== Types.Null);
      return value;
    }), [new Formal('rhs', Types.Object)]));
  }
}
