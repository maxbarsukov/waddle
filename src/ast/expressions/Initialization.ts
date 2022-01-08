import Expression from '../Expression';
import Type from '../../types/Types';

export default class Initialization extends Expression {
  identifier: string;
  type: Type;
  value: string;

  constructor(identifier: string, type: Type, value: string) {
    super();
    this.identifier = identifier;
    this.type = type;
    this.value = value;
  }

  isInitialization() {
    return true;
  }
}
