import Expression from '../../Expression';

export default class StringLiteral extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  isStringLiteral() {
    return true;
  }
}
