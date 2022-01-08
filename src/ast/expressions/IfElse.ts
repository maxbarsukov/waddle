import Expression from '../Expression';

export default class IfElse extends Expression {
  condition: Expression;
  thenBranch: Expression;
  elseBranch: Expression;

  constructor(condition: Expression, thenBranch: Expression, elseBranch: Expression) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  isIfElse() {
    return true;
  }
}
