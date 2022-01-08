import Expression from '../Expression';
import Type from '../../types/Types';

export default class Cast extends Expression {
  object: Expression;
  type: Type;

  constructor(object: Expression, type: Type) {
    super();
    this.object = object;
    this.type = type;
  }

  isCast() {
    return true;
  }
}
