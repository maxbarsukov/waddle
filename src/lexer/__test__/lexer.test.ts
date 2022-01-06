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
  });
});
