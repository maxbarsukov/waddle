export default class Token {
  type: string;
  value: string;
  line: number;
  column: number;

  constructor(type: string, value: string, line: number, column: number) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString(): string {
    return `<${this.type}, ${this.value}, ${this.line}:${this.column}>`;
  }
}
