import Node from './Node';
import Type from '../types/Types';

export default class Expression extends Node {
  line: number;
  column: number;
  expressionType: Type | undefined;

  constructor() {
    super();
    this.line = -1;
    this.column = -1;
    this.expressionType = undefined;
  }

  hasType() {
    return this.expressionType !== undefined;
  }

  isExpression() {
    return true;
  }

  isAssignment() {
    return false;
  }

  isBinaryExpression() {
    return false;
  }

  isBlock() {
    return false;
  }

  isBooleanLiteral() {
    return false;
  }

  isCast() {
    return false;
  }

  isConstructorCall() {
    return false;
  }

  isDecimalLiteral() {
    return false;
  }

  isFunctionCall() {
    return false;
  }

  isIfElse() {
    return false;
  }

  isInitialization() {
    return false;
  }

  isImport() {
    return false;
  }

  isIntegerLiteral() {
    return false;
  }

  isLazy() {
    return false;
  }

  isLet() {
    return false;
  }

  isNative() {
    return false;
  }

  isNullLiteral() {
    return false;
  }

  isReference() {
    return false;
  }

  isStringLiteral() {
    return false;
  }

  isSuper() {
    return false;
  }

  isThis() {
    return false;
  }

  isUnaryExpression() {
    return false;
  }

  isWhile() {
    return false;
  }
}
