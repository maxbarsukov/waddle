import Position from '../interfaces/Position';

export default class Token {
  type: string;
  value: string;
  pos: Position;

  constructor(type: string, value: string, pos: Position) {
    this.type = type;
    this.value = value;
    this.pos = pos;
  }

  toString(): string {
    return `<${this.type}, ${this.value}, ${this.pos.line}:${this.pos.column}>`;
  }
}
