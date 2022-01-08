import Expression from '../Expression';
import Function from '../definitions/Function';

export default class NativeExpression extends Expression {
  func: Function;

  constructor(func: Function) {
    super();
    this.func = func;
  }

  isNative() {
    return true;
  }
}
