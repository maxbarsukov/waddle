import Expression from '../Expression';

export default class BinaryExpression extends Expression {
  left: Expression;
  operator: string;
  right: Expression;

  constructor(left: Expression, operator: string, right: Expression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  isBinaryExpression() {
    return true;
  }
}
