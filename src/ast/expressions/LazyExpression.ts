import Expression from '../Expression';
import Context from '../../interpreter/Context';

export default class LazyExpression extends Expression {
  expression: Expression;
  context: Context;

  constructor(expression: Expression, context: Context) {
    super();
    this.expression = expression;
    this.context = context;
  }

  isLazy() {
    return true;
  }
}
