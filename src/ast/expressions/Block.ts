import Expression from '../Expression';

export default class Block extends Expression {
  expressions: Expression[];

  constructor(expressions: Expression[] = []) {
    super();
    this.expressions = expressions;
  }

  isBlock() {
    return true;
  }
}
