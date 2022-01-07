import Node from './Node';

export default class Definition extends Node {
  line: number;
  column: number;

  constructor() {
    super();
    this.line = -1;
    this.column = -1;
  }

  isDefinition() {
    return true;
  }

  isClass() {
    return false;
  }

  isProperty() {
    return false;
  }

  isFunction() {
    return false;
  }
}
