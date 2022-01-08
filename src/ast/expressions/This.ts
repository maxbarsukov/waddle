import Expression from '../Expression';

export default class This extends Expression {
  isThis() {
    return true;
  }
}
