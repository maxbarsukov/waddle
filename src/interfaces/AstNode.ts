export default interface AstNode {
  isDefinition(): boolean;
  isExpression(): boolean;
}
