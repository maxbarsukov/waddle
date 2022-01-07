import Type from '../types/Types';

export default class Formal {
  identifier: string;
  type: Type;
  lazy: boolean;
  line: number;
  column: number;

  constructor(identifier: string, type: Type, lazy = false, line = -1, column = -1) {
    this.identifier = identifier;
    this.type = type;
    this.lazy = lazy;
    this.line = line;
    this.column = column;
  }
}
