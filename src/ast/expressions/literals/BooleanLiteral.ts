import Expression from '../../Expression';

export default class BooleanLiteral extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  isBooleanLiteral() {
    return true;
  }
}
