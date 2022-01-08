import Expression from '../Expression';

export default class FunctionCall extends Expression {
  functionName: string;
  args: Expression[];
  object: Expression | undefined;

  constructor(
    functionName: string,
    args: Expression[] = [],
    object: Expression | undefined = undefined,
  ) {
    super();
    this.functionName = functionName;
    this.args = args;
    this.object = object;
  }

  isFunctionCall() {
    return true;
  }
}
