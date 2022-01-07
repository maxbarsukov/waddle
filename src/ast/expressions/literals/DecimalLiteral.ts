import Expression from '../../Expression';

export default class DecimalLiteral extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  isDecimalLiteral() {
    return true;
  }
}
