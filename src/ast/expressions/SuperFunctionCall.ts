import Expression from '../Expression';

export default class SuperFunctionCall extends Expression {
  functionName: string;
  args: Expression[];

  constructor(functionName: string, args: Expression[] = []) {
    super();
    this.functionName = functionName;
    this.args = args;
  }

  isSuper() {
    return true;
  }
}
