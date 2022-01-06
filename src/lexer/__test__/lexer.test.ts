import Lexer from '..';
// import Token from '../Token';
import TokenType from '../TokenType';

describe('Lexer', () => {
  describe('#nextToken', () => {
    test('should recognize a newline character as a single token ', () => {
      const lexer = new Lexer('\n');
      const token = lexer.nextToken();
      expect(token.type).toBe(TokenType.Newline);
      expect(token.value).toBe('\n');
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
  });
});
