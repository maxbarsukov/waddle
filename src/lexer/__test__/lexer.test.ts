import Lexer from '..';
// import Token from '../Token';
import TokenType from '../TokenType';

describe('Lexer', () => {
  describe('#nextToken', () => {
    describe('common', () => {
      it('should recognize a newline character as a single token ', () => {
        const lexer = new Lexer('\n');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Newline);
        expect(token.value).toBe('\n');
      });
    });

    describe('recognizes a number', () => {
      it('should recognize the one-char number', () => {
        const lexer = new Lexer('0');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Integer);
        expect(token.value).toBe('0');
      });

      it('should recognize a simple integer literal', () => {
        const lexer = new Lexer('42');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Integer);
        expect(token.value).toBe('42');
      });

      it('should recognize a simple decimal literal', () => {
        const lexer = new Lexer('3.14');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Decimal);
        expect(token.value).toBe('3.14');
      });

      it('should recognize a decimal starting with dot (.)', () => {
        const lexer = new Lexer('.25');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Decimal);
        expect(token.value).toBe('.25');
      });

      it('should recognize a decimal in scientific notation', () => {
        const lexer = new Lexer('2e65');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Decimal);
        expect(token.value).toBe('2e65');
      });

      it('should recognize a decimal in scientific notation with negative exponent part', () => {
        const lexer = new Lexer('42e-65');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.Decimal);
        expect(token.value).toBe('42e-65');
      });
    });

    describe('recognizes a string', () => {
      const testStrings = {
        'should recognize a simple string literal':
          '"Hello, World!"',
        'should recognize a string containing a newline character':
          '"a string containing a \\n newline character."',
        'should recognize a string containing an espaced backslash':
          '"a string with a \\\\ backslash"',
        'should recognize a string containing escaped double quotes':
          '"a string containing an \\" escaped double quote"',
        'should recognize a string containing escape sequences':
          '"a string containing \\t\\b\\r\\f\\v\\0 escape sequences"',
      };

      Object.entries(testStrings).forEach(([key, value]) => {
        it(key, () => {
          const lexer = new Lexer(value);
          const token = lexer.nextToken();
          expect(token.type).toBe(TokenType.String);
          expect(token.value).toBe(value);
        });
      });
    });

    describe('recognizes a boolens', () => {
      it('should recognize the boolean true literal', () => {
        const lexer = new Lexer('true');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.True);
        expect(token.value).toBe('true');
      });

      it('should recognize the boolean false literal', () => {
        const lexer = new Lexer('false');
        const token = lexer.nextToken();
        expect(token.type).toBe(TokenType.False);
        expect(token.value).toBe('false');
      });
    });

    describe('recognizes an identifier', () => {
      const testStrings = {
        'should recognize an identifier of a single letter': 'i',
        'should recognize an identifier made of letters': 'anIdentifier',
        'should recognize an identifier starting with underscore': '_identifier',
        'should recognize an identifier containing an underscore': 'an_identifier',
        'should recognize an identifier containing a $ character': 'an$identifier',
        'should recognize an identifier containing a digit': 'identifier1',
      };

      Object.entries(testStrings).forEach(([key, value]) => {
        it(key, () => {
          const lexer = new Lexer(value);
          const token = lexer.nextToken();
          expect(token.type).toBe(TokenType.Identifier);
          expect(token.value).toBe(value);
        });
      });
    });

    describe('recognizes keywords', () => {
      const testStrings = [
        'abstract', 'class', 'def',
        'else', 'extends', 'false',
        'final', 'for', 'in',
        'if', 'let', 'new', 'null',
        'override', 'private', 'protected',
        'return', 'super', 'to',
        'true', 'var', 'while',
      ];

      testStrings.forEach(keyword => {
        it(`should recognize the ${keyword} keyword`, () => {
          const keywordTokenType = keyword
            .trim()
            .replace(/^\w/, (c) => c.toUpperCase());
          const lexer = new Lexer(keyword);
          const token = lexer.nextToken();
          // @ts-ignore
          expect(token.type).toBe(TokenType[keywordTokenType]);
          expect(token.value).toBe(keyword);
        });
      });
    });
  });
});
