import Expression from '../Expression';

export default class Assignment extends Expression {
  identifier: string;
  operator: string;
  value: Expression;

  constructor(identifier: string, operator: string, value: Expression) {
    super();

    this.identifier = identifier;
    this.operator = operator;
    this.value = value;
  }

  isAssignment() {
    return true;
  }
}
