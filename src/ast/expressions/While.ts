import Expression from '../Expression';
import Block from './Block';

export default class While extends Expression {
  condition: Expression;
  body: Block;

  constructor(condition: Expression, body: Block) {
    super();
    this.condition = condition;
    this.body = body;
  }

  isWhile() {
    return true;
  }
}
