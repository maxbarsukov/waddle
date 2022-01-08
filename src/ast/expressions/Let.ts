import Expression from '../Expression';
import Initialization from './Initialization';

export default class Let extends Expression {
  initializations: Initialization[];
  body: Expression;

  constructor(initializations: Initialization[], body: Expression) {
    super();
    this.initializations = initializations !== undefined ? initializations : [];
    this.body = body;
  }

  isLet() {
    return true;
  }
}
