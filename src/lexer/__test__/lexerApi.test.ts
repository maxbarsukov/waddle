import Lexer from '..';
import CharUtils from '../../utils/CharUtils';

describe('Lexer', () => {
  it('#createErrorReport', () => {
    const lexer = new Lexer('symbol');
    // @ts-ignore
    const errMessage = lexer.createErrorReport('sym');

    expect(errMessage.pos.line).toBe(0);
    expect(errMessage.pos.column).toBe(0);
    expect(errMessage.message).toBe("Unrecognized token 'sym'.");
  });

  it('#skipUntilNewline', () => {
    const lexer = new Lexer('hello  \n');
    lexer.skipUntilNewline();

    expect(CharUtils.isNewline(lexer.input.charAt(lexer.position))).toBe(true);
    expect(lexer.position).toBe(7);
  });

  it('#recognizeDelimiter', () => {
    const lexer = new Lexer('a');
    const t = () => lexer.recognizeDelimiter();
    expect(t).toThrow(Error);
    expect(lexer.position).toBe(1);
  });

  it('#recognizeString', () => {
    const lexer = new Lexer('"aaa');
    const t = () => lexer.recognizeString();
    expect(t).toThrow(Error);
    expect(lexer.position).toBe(0);
  });

  it('#recognizeNumber', () => {
    const lexer = new Lexer('a');
    const t = () => lexer.recognizeNumber();
    expect(t).toThrow(Error);
    expect(lexer.position).toBe(0);
  });

  it('#recognizeLiteral', () => {
    const lexer = new Lexer('∘');
    const t = () => lexer.recognizeLiteral();
    expect(t).toThrow(Error);
    expect(lexer.position).toBe(0);
  });

  describe('#readToken', () => {
    it('should throw an error if unrecognized symbol', () => {
      const lexer = new Lexer('∘');
      const t = () => lexer.readToken();
      expect(t).toThrow(Error);
      expect(lexer.position).toBe(0);
    });

    it('should recognize a dot', () => {
      const lexer = new Lexer('.');
      const token = lexer.readToken();
      expect(token.pos.line).toBe(0);
      expect(token.pos.column).toBe(0);
      expect(token.type).toBe('.');
    });
  });

  describe('#recognizeOperator', () => {
    it('should throw an error on &=', () => {
      const lexer = new Lexer('&=');
      const t = () => lexer.recognizeOperator();
      expect(t).toThrow(Error);
      expect(lexer.position).toBe(2);
    });

    it('should throw an error on |=', () => {
      const lexer = new Lexer('|=');
      const t = () => lexer.recognizeOperator();
      expect(t).toThrow(Error);
      expect(lexer.position).toBe(2);
    });
  });
});
