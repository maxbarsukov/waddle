import Expression from '../Expression';

export default class Reference extends Expression {
  identifier: string;

  constructor(identifier: string) {
    super();
    this.identifier = identifier;
  }

  isReference() {
    return true;
  }
}
