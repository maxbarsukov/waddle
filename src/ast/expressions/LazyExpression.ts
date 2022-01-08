import Expression from '../Expression';

export default class LazyExpression extends Expression {
  expression: Expression;
  // context;

  constructor(expression: Expression) { // , context) {
    super();
    this.expression = expression;
    // this.context = context;
  }

  isLazy() {
    return true;
  }
}
