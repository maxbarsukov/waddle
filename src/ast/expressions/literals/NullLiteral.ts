import Expression from '../../Expression';

export default class NullLiteral extends Expression {
  isNullLiteral() {
    return true;
  }
}
