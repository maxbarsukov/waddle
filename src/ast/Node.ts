import AstNode from '../interfaces/AstNode';

export default class Node implements AstNode {
  isDefinition() {
    return false;
  }

  isExpression() {
    return true;
  }
}
