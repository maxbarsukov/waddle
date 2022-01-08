import Expression from '../Expression';
import Type from '../../types/Types';

export default class ConstructorCall extends Expression {
  type: Type;
  args: Expression[];

  constructor(type: Type, args: Expression[] = []) {
    super();
    this.type = type;
    this.args = args;
  }

  isConstructorCall() {
    return true;
  }
}
