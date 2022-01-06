export default class CharUtils {
  static isLetterOrDigit(char: string) {
    return CharUtils.isLetter(char) || CharUtils.isDigit(char);
  }

  static isLetter(char: string) {
    const code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
  }

  static isDigit(char: string) {
    const code = char.charCodeAt(0);
    return code >= 48 && code <= 57;
  }

  static isWhitespace(char: string) {
    return /[ \t\r\f\v\u00A0\u2028\u2029]/.test(char);
  }

  static isDelimiter(char: string) {
    return char === '{' || char === '[' || char === '('
        || char === '}' || char === ']' || char === ')'
        || char === ':' || char === ',';
  }

  static isNewline(char: string) {
    return char === '\n' || char === '\r\n';
  }

  static isDot(char: string) {
    return char === '.';
  }

  static isOperator(char: string) {
    return char === '+' || char === '-' || char === '*' || char === '/'
        || char === '=' || char === '>' || char === '<' || char === '!'
        || char === '&' || char === '|' || char === '%' || char === '~'
        || char === '$' || char === '~' || char === '^';
  }

  static isIdentifierPart(char: string) {
    return char === '_' || CharUtils.isLetterOrDigit(char) || CharUtils.isOperator(char);
  }

  static isBeginningOfIdentifier(char: string) {
    return CharUtils.isLetter(char) || char === '_';
  }

  static isBeginningOfNumber(char: string) {
    return CharUtils.isDigit(char) || char === '.';
  }

  static isBeginningOfString(char: string) {
    return char === '"';
  }

  static isExponentSymbol(char: string) {
    return char === 'e' || char === 'E';
  }

  static isBeginningOfLiteral(char: string) {
    return CharUtils.isLetter(char) || CharUtils.isBeginningOfIdentifier(char)
          || CharUtils.isBeginningOfNumber(char) || CharUtils.isBeginningOfString(char);
  }

  static isEscapeCharacter(char: string) {
    return char === '\\';
  }

  static isEndOfEscapeSequence(char: string) {
    return char === '"' || char === '\\' || char === 'n'
          || char === 'r' || char === 't' || char === 'b'
          || char === 'f' || char === 'v' || char === '0';
  }

  static isStringDelimiter(char: string) {
    return char === '"';
  }
}
