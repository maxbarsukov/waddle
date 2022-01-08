import Parser from '..';
import {
  BinaryExpression,
  BooleanLiteral,
  DecimalLiteral,
  IntegerLiteral,
  StringLiteral,
} from '../../ast';

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

    describe('arithmetic operators', () => {
      it('should correctly handle left associativity for arithmetic operators', () => {
        const parser = new Parser('7 - 4 + 2');
        const expression = parser.parseExpression() as BinaryExpression;

        expect(expression.isBinaryExpression()).toBe(true);

        expect(expression.operator).toBe('+');
        expect(expression.left.isBinaryExpression()).toBe(true);

        expect((expression.left as BinaryExpression).operator).toBe('-');
        expect((expression.left as BinaryExpression).left.isIntegerLiteral()).toBe(true);

        expect(((expression.left as BinaryExpression).left as IntegerLiteral).value).toBe('7');

        expect((expression.left as BinaryExpression).right.isIntegerLiteral()).toBe(true);
        expect(((expression.left as BinaryExpression).right as IntegerLiteral).value).toBe('4');

        expect((expression.right as IntegerLiteral).value).toBe('2');
      });
    });

    it('should correctly handle operator precedence', () => {
      const parser = new Parser('1 + 3 * 5 - 8');
      const expression = parser.parseExpression() as BinaryExpression;

      expect(expression.isBinaryExpression()).toBe(true);
      expect(expression.operator).toBe('-');

      const left = expression.left as BinaryExpression;

      expect(left.isBinaryExpression()).toBe(true);
      expect(left.operator).toBe('+');

      expect(left.left.isIntegerLiteral()).toBe(true);
      expect((left.left as IntegerLiteral).value).toBe('1');

      const multiplication = left.right as BinaryExpression;

      expect(multiplication.isBinaryExpression()).toBe(true);
      expect(multiplication.operator).toBe('*');

      expect(multiplication.left.isIntegerLiteral()).toBe(true);
      expect((multiplication.left as IntegerLiteral).value).toBe('3');

      expect(multiplication.right.isIntegerLiteral()).toBe(true);
      expect((multiplication.right as IntegerLiteral).value).toBe('5');

      const right = expression.right as IntegerLiteral;

      expect(right.isIntegerLiteral()).toBe(true);
      expect(right.value).toBe('8');
    });
  });
});
