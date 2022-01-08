import Expression from '../Expression';

export default class FunctionCall extends Expression {
  object: Expression;
  functionName: string;
  args: Expression[];

  constructor(object: Expression, functionName: string, args = []) {
    super();
    this.object = object;
    this.functionName = functionName;
    this.args = args;
  }

  isFunctionCall() {
    return true;
  }
}
