import Expression from '../Expression';
import Initialization from './Initialization';

export default class Let extends Expression {
  body: Expression;
  initializations: Initialization[];

  constructor(body: Expression, initializations: Initialization[] = []) {
    super();
    this.body = body;
    this.initializations = initializations;
  }

  isLet() {
    return true;
  }
}
