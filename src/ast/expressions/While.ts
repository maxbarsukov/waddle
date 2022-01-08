import Expression from '../Expression';

export default class While extends Expression {
  condition: Expression;
  body: Expression;

  constructor(condition: Expression, body: Expression) {
    super();
    this.condition = condition;
    this.body = body;
  }

  isWhile() {
    return true;
  }
}
