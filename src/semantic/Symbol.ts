import Type from '../types/Types';

export default class Symbol {
  identifier: string;
  type: Type;
  line: number;
  column: number;

  constructor(identifier: string, type: Type, line = -1, column = -1) {
    this.identifier = identifier;
    this.type = type;
    this.line = line;
    this.column = column;
  }
}
