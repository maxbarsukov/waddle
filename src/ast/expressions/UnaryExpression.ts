import Expression from '../Expression';

export default class UnaryExpression extends Expression {
  operator: string;
  expression: Expression;

  constructor(operator: string, expression: Expression) {
    super();
    this.operator = operator;
    this.expression = expression;
  }

  isUnaryExpression() {
    return true;
  }
}
