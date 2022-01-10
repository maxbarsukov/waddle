import {
  Class,
  Function,
  NativeExpression,
} from '../../ast';

import Obj from '../Obj';
import { Types } from '../../types/Types';

export default class UnitClass extends Class {
  constructor() {
    super(Types.Void);
    this.superClass = Types.Object;
    this.functions.push(new Function('toString', Types.String, new NativeExpression((context) => {
      const value = Obj.create(context, Types.String);
      value.set('value', '()');
      return value;
    }), [], true));
  }
}
