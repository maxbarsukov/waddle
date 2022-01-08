import Parser from '..';
import { DecimalLiteral, IntegerLiteral, BooleanLiteral, StringLiteral } from '../../ast';

describe('Parser', () => {
  describe('#parseExpression', () => {
    describe('literals', () => {
      it('should parse a simple integer literal', () => {
        const parser = new Parser('42');
        const expression = parser.parseExpression() as IntegerLiteral;
        expect(expression.isIntegerLiteral()).toBe(true);
        expect(expression.isDecimalLiteral()).toBe(false);
        expect(expression.value).toBe('42');
      });

      it('should parse a simple decimal literal', () => {
        const parser = new Parser('3.14159');
        const expression = parser.parseExpression() as DecimalLiteral;
        expect(expression.isDecimalLiteral()).toBe(true);
        expect(expression.isIntegerLiteral()).toBe(false);
        expect(expression.value).toBe('3.14159');
      });

      it('should parse a simple string literal', () => {
        const parser = new Parser('"Hello, World!"');
        const expression = parser.parseExpression() as StringLiteral;
        expect(expression.isStringLiteral()).toBe(true);
        expect(expression.isDecimalLiteral()).toBe(false);
        expect(expression.value).toBe('"Hello, World!"');
      });

      it('should parse a null literal', () => {
        const parser = new Parser('null');
        const expression = parser.parseExpression();
        expect(expression.isNullLiteral()).toBe(true);
        expect(expression.isDecimalLiteral()).toBe(false);
      });

      it('should parse the boolean literal "true"', () => {
        const parser = new Parser('true');
        const expression = parser.parseExpression() as BooleanLiteral;
        expect(expression.isBooleanLiteral()).toBe(true);
        expect(expression.isNullLiteral()).toBe(false);
        expect(expression.value).toBe('true');
      });

      it('should parse the boolean literal "false"', () => {
        const parser = new Parser('false');
        const expression = parser.parseExpression() as BooleanLiteral;
        expect(expression.isBooleanLiteral()).toBe(true);
        expect(expression.isNullLiteral()).toBe(false);
        expect(expression.value).toBe('false');
      });
    });
  });
});
