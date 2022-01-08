import Expression from '../Expression';
import Type from '../../types/Types';

export default class Initialization extends Expression {
  identifier: string;
  type: Type | undefined;
  value: Expression | undefined;

  constructor(identifier: string, type: Type | undefined, value: Expression | undefined) {
    super();
    this.identifier = identifier;
    this.type = type;
    this.value = value;
  }

  isInitialization() {
    return true;
  }
}
