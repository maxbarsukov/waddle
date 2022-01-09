import Expression from '../Expression';
import Context from '../../interpreter/Context';
import Obj from '../../interpreter/Obj';

export default class NativeExpression extends Expression {
  func: (context: Context) => Obj;

  constructor(func: (context: Context) => Obj) {
    super();
    this.func = func;
  }

  isNative() {
    return true;
  }
}
