import Expression from '../../Expression';

export default class IntegerLiteral extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  isIntegerLiteral() {
    return true;
  }
}
