import CharUtils from '../utils/CharUtils';
import Report from '../utils/Report';

import ErrorMessage from '../interfaces/ErrorMessage';
import Position from '../interfaces/Position';

import Fsm, { INVALID_FSM_STATE, FsmToken } from './Fsm';
import Token from './Token';
import TokenType from './TokenType';

export default class Lexer {
  input: string;
  inputSize: number;

  buffer: Token[] = [];
  position: number = 0;
  line: number = 0;
  column: number = 0;

  constructor(input: string) {
    this.input = input;
    this.inputSize = input.length;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token;

    do {
      token = this.nextToken();
      if (token.type === TokenType.EndOfInput) {
        break;
      }
      tokens.push(token);
    } while (token.type !== TokenType.EndOfInput);

    return tokens;
  }

  nextToken(): Token {
    if (this.buffer.length > 0) {
      return this.buffer.pop() || this.readToken();
    }

    return this.readToken();
  }

  readToken(): Token {
    this.skipWhitespaces();

    if (this.position >= this.inputSize) {
      return new Token(TokenType.EndOfInput, 'EOF', {
        line: this.line,
        column: this.column,
      });
    }

    const symbol = this.input.charAt(this.position);

    if (CharUtils.isBeginningOfLiteral(symbol)) return this.recognizeLiteral();
    if (CharUtils.isOperator(symbol)) return this.recognizeOperator();
    if (CharUtils.isDelimiter(symbol)) return this.recognizeDelimiter();
    if (CharUtils.isDot(symbol)) {
      const column = this.column;

      this.position++;
      this.column++;

      return new Token(TokenType.Dot, '.', { line: this.line, column });
    }

    if (CharUtils.isNewline(symbol)) {
      const line = this.line;
      const column = this.column;

      this.position++;
      this.line++;
      this.column = 0;

      return new Token(TokenType.Newline, '\n', { line, column });
    }

    throw new Error(Report.error(this.createErrorReport(symbol)));
  }

  recognizeLiteral() {
    const symbol = this.input.charAt(this.position);

    if (CharUtils.isLetter(symbol)) return this.recognizeKeywordOrIdentifier();
    if (CharUtils.isBeginningOfIdentifier(symbol)) return this.recognizeIdentifier();
    if (CharUtils.isBeginningOfNumber(symbol)) return this.recognizeNumber();
    if (CharUtils.isBeginningOfString(symbol)) return this.recognizeString();

    throw new Error(Report.error(this.createErrorReport(symbol)));
  }

  recognizeKeywordOrIdentifier() {
    const token: Token | null = this.recognizeKeyword();
    return token !== null ? token : this.recognizeIdentifier();
  }

  recognizeKeyword(): Token | null {
    const symbol = this.input.charAt(this.position);

    const keywords: string[] = Object.values(TokenType)
      .filter(x => !(parseInt(x, 10) >= 0))
      .filter(key => key.charAt(0) === symbol);

    for (let i = 0; i < keywords.length; ++i) {
      const keyword = keywords[i];
      const token: Token | null = this.recognizeToken(keyword);

      if (token !== null) {
        const offset = token.value.length;

        if (CharUtils.isIdentifierPart(this.input.charAt(this.position + offset))) {
          return null;
        }

        this.position += offset;
        this.column += offset;

        return token;
      }
    }

    return null;
  }

  recognizeIdentifier(): Token {
    let identifier = '';

    while (this.position < this.inputSize) {
      const symbol = this.input.charAt(this.position);
      if (!CharUtils.isIdentifierPart(symbol)) {
        break;
      }

      identifier += symbol;
      this.position++;
    }

    const column = this.column;
    this.column += identifier.length;

    return new Token(TokenType.Identifier, identifier, { line: this.line, column });
  }

  recognizeNumber() {
    const recognizer = this.buildNumberRecognizer();

    const fsmToken: FsmToken = recognizer.run(this.input.substring(this.position));
    const recognized = fsmToken.recognized;
    let value = fsmToken.value;

    if (!recognized) {
      throw new Error(Report.error({
        message: 'Unrecognized number literal.',
        pos: {
          line: this.line,
          column: this.column,
        },
      }));
    }

    if (this.input.charAt(this.position) === '.' && value === '.') {
      this.position++;
      this.column++;

      return new Token(TokenType.Dot, '.', {
        line: this.line,
        column: this.column - 1,
      });
    }

    let offset = value.length;

    if (value.charAt(offset - 1) === '.') {
      value = value.substring(0, offset - 1);
      offset--;
    }

    const column = this.column;

    this.position += offset;
    this.column += offset;

    return new Token((value.includes('.')
      || value.includes('e')
      || value.includes('E'))
      ? TokenType.Decimal
      : TokenType.Integer,
    value,
    { line: this.line, column },
    );
  }

  recognizeString(): Token {
    const recognizer = this.buildStringRecognizer();
    const { recognized, value }: FsmToken = recognizer.run(this.input.substring(this.position));

    if (!recognized) {
      throw new Error(Report.error({
        message: 'Invalid string literal.',
        pos: {
          line: this.line,
          column: this.column,
        },
      }));
    }

    const offset = value.length;
    const column = this.column;

    this.position += offset;
    this.column += offset;

    return new Token(TokenType.String, value, { line: this.line, column });
  }

  recognizeToken(token: string): Token | null {
    const length = token.length;

    for (let i = 0; i < length; ++i) {
      if (this.input.charAt(this.position + i) !== token.charAt(i)) {
        return null;
      }
    }

    return new Token(token, token, { line: this.line, column: this.column });
  }

  recognizeDelimiter(): Token {
    const symbol = this.input.charAt(this.position);
    const column = this.column;

    this.position++;
    this.column++;
    const position: Position = { line: this.line, column };
    switch (symbol) {
      case '{':
        return new Token(TokenType.LeftBrace, '{', position);

      case '}':
        return new Token(TokenType.RightBrace, '}', position);

      case '[':
        return new Token(TokenType.LeftBracket, '[', position);

      case ']':
        return new Token(TokenType.RightBracket, ']', position);

      case '(':
        return new Token(TokenType.LeftParen, '(', position);

      case ')':
        return new Token(TokenType.RightParen, ')', position);

      case ',':
        return new Token(TokenType.Comma, ',', position);

      case ':':
        return new Token(TokenType.Colon, ':', position);

      default:
        throw new Error(Report.error(this.createErrorReport(symbol)));
    }
  }

  recognizeOperator(): Token {
    const symbol = this.input.charAt(this.position);
    const lookahead = this.position + 1 < this.inputSize
      ? this.input.charAt(this.position + 1)
      : null;
    const column = this.column;
    const pos: Position = { line: this.line, column };

    if (lookahead !== null
      && (lookahead === '=' || lookahead === '&' || lookahead === '|' || lookahead === '-')
    ) {
      this.position++;
      this.column++;
    }

    this.position++;
    this.column++;

    switch (symbol) {
      case '=':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.DoubleEqual, '==', pos)
          : new Token(TokenType.Equal, '=', pos);

      case '%':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.ModuloEqual, '%=', pos)
          : new Token(TokenType.Modulo, '%', pos);

      case '+':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.PlusEqual, '+=', pos)
          : new Token(TokenType.Plus, '+', pos);

      case '*':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.TimesEqual, '*=', pos)
          : new Token(TokenType.Times, '*', pos);

      case '>':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.GreaterOrEqual, '>=', pos)
          : new Token(TokenType.Greater, '>', pos);

      case '!':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.NotEqual, '!=', pos)
          : new Token(TokenType.Not, '!', pos);

      case '~':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.TildeEqual, '~=', pos)
          : new Token(TokenType.Tilde, '~', pos);

      case '$':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.DollarEqual, '$=', pos)
          : new Token(TokenType.Dollar, '$', pos);

      case '^':
        return lookahead !== null && lookahead === '='
          ? new Token(TokenType.CaretEqual, '^=', pos)
          : new Token(TokenType.Caret, '^', pos);

      case '&':
        if (lookahead !== null && lookahead === '&') {
          return new Token(TokenType.And, '&&', pos);
        }

        throw new Error(Report.error(this.createErrorReport(symbol)));

      case '|':
        if (lookahead !== null && lookahead === '|') {
          return new Token(TokenType.Or, '||', pos);
        }

        throw new Error(Report.error(this.createErrorReport(symbol)));

      case '/':
        if (lookahead !== '=' && lookahead !== '/') return new Token(TokenType.Div, '/', pos);
        if (lookahead === '=') return new Token(TokenType.DivEqual, '/=', pos);
        if (lookahead === '/') {
          this.skipUntilNewline();
          return this.nextToken();
        }
        break;

      case '<':
        if (lookahead !== '=' && lookahead !== '-') return new Token(TokenType.Less, '<', pos);
        if (lookahead === '=') return new Token(TokenType.LessOrEqual, '<=', pos);
        if (lookahead === '-') return new Token(TokenType.LeftArrow, '<-', pos);
        break;

      case '-':
        if (lookahead === null || (lookahead !== '=' && lookahead !== '>')) {
          return new Token(TokenType.Minus, '-', pos);
        }
        if (lookahead === '=') return new Token(TokenType.MinusEqual, '-=', pos);
        if (lookahead === '>') return new Token(TokenType.RightArrow, '->', pos);
        throw new Error(Report.error(this.createErrorReport(symbol)));

      default:
        throw new Error(Report.error(this.createErrorReport(symbol)));
    }
    throw new Error(Report.error(this.createErrorReport(symbol)));
  }

  buildStringRecognizer(): Fsm {
    const states = new Set([
      'Start', 'StartString', 'Character',
      'Backslash', 'EscapeSequence', 'EndString',
    ]);
    const startState = 'Start';
    const finalStates = new Set(['EndString']);

    const transition = (state: string, symbol: string): string => {
      switch (state) {
        case 'Start':
          if (CharUtils.isStringDelimiter(symbol)) return 'StartString';
          break;

        case 'StartString':
        case 'Character':
          if (CharUtils.isStringDelimiter(symbol)) return 'EndString';
          if (CharUtils.isEscapeCharacter(symbol)) return 'Backslash';
          return 'Character';

        case 'Backslash':
          if (CharUtils.isEndOfEscapeSequence(symbol)) return 'EscapeSequence';
          break;

        case 'EscapeSequence':
          if (CharUtils.isStringDelimiter(symbol)) return 'EndString';
          if (CharUtils.isEscapeCharacter(symbol)) return 'Backslash';
          return 'Character';

        default:
          break;
      }

      return INVALID_FSM_STATE;
    };

    return new Fsm(states, startState, finalStates, transition);
  }

  buildNumberRecognizer(): Fsm {
    const states = new Set([
      'Start', 'Zero', 'Integer',
      'StartDecimal', 'Decimal', 'StartExponentNotation',
      'NumberInExponentNotation', 'End',
    ]);

    const startState = 'Start';

    const finalStates = new Set([
      'Zero', 'Integer', 'StartDecimal',
      'Decimal', 'NumberInExponentNotation', 'End',
    ]);

    const transition = (state: string, symbol: string) => {
      switch (state) {
        case 'Start':
          if (symbol === '0') return 'Zero';
          if (symbol === '.') return 'StartDecimal';
          if (CharUtils.isDigit(symbol)) return 'Integer';
          break;

        case 'Zero':
          if (CharUtils.isExponentSymbol(symbol)) return 'StartExponentNotation';
          if (symbol === '.') return 'StartDecimal';
          break;

        case 'Integer':
          if (CharUtils.isDigit(symbol)) return 'Integer';
          if (CharUtils.isExponentSymbol(symbol)) return 'StartExponentNotation';
          if (symbol === '.') return 'StartDecimal';
          break;

        case 'StartDecimal':
          if (CharUtils.isDigit(symbol)) return 'Decimal';
          return INVALID_FSM_STATE;

        case 'StartExponentNotation':
          if (CharUtils.isDigit(symbol) || symbol === '-') return 'NumberInExponentNotation';
          break;

        case 'Decimal':
          if (CharUtils.isDigit(symbol)) return 'Decimal';
          if (CharUtils.isExponentSymbol(symbol)) return 'StartExponentNotation';
          break;

        case 'NumberInExponentNotation':
          if (CharUtils.isDigit(symbol)) return 'NumberInExponentNotation';
          break;

        default:
          break;
      }

      return INVALID_FSM_STATE;
    };

    return new Fsm(states, startState, finalStates, transition);
  }

  lookahead(): Token {
    const token: Token = this.readToken();
    this.buffer.push(token);
    return token;
  }

  skipWhitespaces(): void {
    while (this.position < this.inputSize
      && CharUtils.isWhitespace(this.input.charAt(this.position))
    ) {
      this.position++;
      this.column++;
    }
  }

  skipUntilNewline(): void {
    while (this.position < this.inputSize
      && !CharUtils.isNewline(this.input.charAt(this.position))
    ) {
      this.position++;
      this.column++;
    }
  }

  private createErrorReport(
    symbol: string,
    line: number = this.line,
    column: number = this.column,
  ): ErrorMessage {
    return {
      pos: {
        line,
        column,
      },
      message: `Unrecognized token '${symbol}'.`,
    };
  }
}
