import Parser from '..';
import {
  BinaryExpression,
  BooleanLiteral, ConstructorCall,
  DecimalLiteral,
  IfElse,
  Initialization,
  IntegerLiteral,
  Let,
  Reference,
  StringLiteral,
  While,
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

    describe('expressions', () => {
      it('should parse an if/else expression', () => {
        const parser = new Parser('if (true) 1 else 2');
        const expression = parser.parseExpression() as IfElse;

        expect(expression.isIfElse()).toBe(true);
        expect(expression.thenBranch.isIntegerLiteral()).toBe(true);
        expect((expression.thenBranch as IntegerLiteral).value).toBe('1');

        // @ts-ignore
        expect(expression.elseBranch.isIntegerLiteral()).toBe(true);
        expect((expression.elseBranch as IntegerLiteral).value).toBe('2');
      });

      it('should parse a while expression', () => {
        const parser = new Parser('while (true) 42');
        const expression = parser.parseExpression() as While;

        expect(expression.isWhile()).toBe(true);

        expect(expression.condition.isBooleanLiteral()).toBe(true);
        expect((expression.condition as BooleanLiteral).value).toBe('true');

        expect(expression.body.isIntegerLiteral()).toBe(true);
        expect((expression.body as IntegerLiteral).value).toBe('42');
      });

      it('should parse a let expression', () => {
        const parser = new Parser('let a: Int = 2, b = 3 in a + b');
        const expression = parser.parseExpression() as Let;

        expect(expression.isLet()).toBe(true);

        const initializations = expression.initializations as Initialization[];

        expect(initializations.length).toBe(2);

        expect(initializations[0].identifier).toBe('a');
        expect(initializations[0].type).toBe('Int');

        // @ts-ignore
        expect(initializations[0].value.isIntegerLiteral()).toBe(true);
        expect((initializations[0].value as IntegerLiteral).value).toBe('2');

        expect(initializations[1].identifier).toBe('b');
        expect(initializations[1].type).toBe(undefined);

        // @ts-ignore
        expect(initializations[1].value.isIntegerLiteral()).toBe(true);
        expect((initializations[1].value as IntegerLiteral).value).toBe('3');

        const body = expression.body as BinaryExpression;

        expect(body.isBinaryExpression()).toBe(true);
        expect(body.operator).toBe('+');

        expect(body.left.isReference()).toBe(true);
        expect((body.left as Reference).identifier).toBe('a');

        expect(body.right.isReference()).toBe(true);
        expect((body.right as Reference).identifier).toBe('b');
      });

      it('should parse a this expression', () => {
        const parser = new Parser('this');
        const expression = parser.parseExpression();

        expect(expression.isThis()).toBe(true);
      });

      it('should parse a constructor call', () => {
        const parser = new Parser('new Integer(42)');
        const expression = parser.parseExpression() as ConstructorCall;

        expect(expression.isConstructorCall()).toBe(true);

        expect(expression.type).toBe('Integer');
        expect(expression.args.length).toBe(1);
        expect(expression.args[0].isIntegerLiteral()).toBe(true);
        expect((expression.args[0] as IntegerLiteral).value).toBe('42');
      });
    });
  });
});
