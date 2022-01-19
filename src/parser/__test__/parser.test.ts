import Parser from '..';
import {
  BinaryExpression,
  Block,
  BooleanLiteral,
  Class,
  ConstructorCall,
  DecimalLiteral,
  Formal,
  Function,
  FunctionCall,
  IfElse,
  Import,
  Initialization,
  IntegerLiteral,
  Let,
  Program,
  Property,
  Reference,
  StringLiteral,
  UnaryExpression,
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

      it('should parse an import expression', () => {
        const parser = new Parser('import List, Array from "collections"');
        const expression = parser.parseExpression() as Import;

        expect(expression.isImport()).toBe(true);

        expect(expression.source).toBe('collections');
        expect(expression.isBuiltin()).toBe(true);

        expect(expression.classNames[0]).toBe('List');
        expect(expression.classNames[1]).toBe('Array');
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

      it('should parse a block of expressions', () => {
        const parser = new Parser(`{
          "hello"
          42
          true
         }`);

        const expression = parser.parseExpression() as Block;
        expect(expression.isBlock()).toBe(true);

        const expressions = expression.expressions;

        expect(expressions.length).toBe(3);

        expect(expressions[0].isStringLiteral()).toBe(true);
        expect((expressions[0] as StringLiteral).value).toBe('"hello"');

        expect(expressions[1].isIntegerLiteral()).toBe(true);
        expect((expressions[1] as IntegerLiteral).value).toBe('42');

        expect(expressions[2].isBooleanLiteral()).toBe(true);
        expect((expressions[2] as BooleanLiteral).value).toBe('true');
      });

      it('should parse a parenthesized expression', () => {
        const parser = new Parser('1 + (2 - 3.14)');
        const expression = parser.parseExpression() as BinaryExpression;

        expect(expression.isBinaryExpression()).toBe(true);
        expect(expression.operator).toBe('+');

        const left = expression.left as IntegerLiteral;

        expect(left.isIntegerLiteral()).toBe(true);
        expect(left.value).toBe('1');

        const right = expression.right as BinaryExpression;

        expect(right.isBinaryExpression()).toBe(true);
        expect(right.operator).toBe('-');

        expect(right.left.isIntegerLiteral()).toBe(true);
        expect((right.left as IntegerLiteral).value).toBe('2');

        expect(right.right.isDecimalLiteral()).toBe(true);
        expect((right.right as DecimalLiteral).value).toBe('3.14');
      });

      it('should parse a simple method call', () => {
        const parser = new Parser('car.drive(2)');
        const expression = parser.parseExpression() as FunctionCall;

        expect(expression.isFunctionCall()).toBe(true);
        expect(expression.functionName).toBe('drive');
        expect(expression.args.length).toBe(1);
        expect(expression.args[0].isIntegerLiteral()).toBe(true);

        const object = expression.object as Reference;
        expect(object.isReference()).toBe(true);
        expect(object.identifier).toBe('car');
      });

      it('should parse chain method calls', () => {
        const parser = new Parser('node.add(42).push("Hello")');
        const expression = parser.parseExpression() as FunctionCall;

        expect(expression.isFunctionCall()).toBe(true);
        expect(expression.functionName).toBe('push');
        expect(expression.args.length).toBe(1);
        expect(expression.args[0].isStringLiteral()).toBe(true);

        const object = expression.object as FunctionCall;

        expect(object.isFunctionCall()).toBe(true);
        expect(object.functionName).toBe('add');
        expect(object.args.length).toBe(1);
        // @ts-ignore
        expect(object.object.isReference()).toBe(true);
        expect(object.args.length).toBe(1);
        expect(object.args[0].isIntegerLiteral()).toBe(true);
      });
    });

    describe('unary operators', () => {
      it('should parse a negative expression', () => {
        const parser = new Parser('-42');
        const expression = parser.parseExpression() as UnaryExpression;

        expect(expression.isUnaryExpression()).toBe(true);
        expect(expression.operator).toBe('-');

        expect(expression.expression.isIntegerLiteral()).toBe(true);
        expect((expression.expression as IntegerLiteral).value).toBe('42');
      });

      it('should parse a negated boolean expression', () => {
        const parser = new Parser('!true');
        const expression = parser.parseExpression() as UnaryExpression;

        expect(expression.isUnaryExpression()).toBe(true);
        expect(expression.operator).toBe('!');

        expect(expression.expression.isBooleanLiteral()).toBe(true);
        expect((expression.expression as BooleanLiteral).value).toBe('true');
      });
    });
  });

  describe('#parseFunction', () => {
    it('should parse a function definition', () => {
      const parser = new Parser(`def max(a: Int, b: Int): Int = {
        if (a > b) a else b
       }`);

      const func = parser.parseFunction() as Function;

      expect(func.isFunction()).toBe(true);
      expect(func.name).toBe('max');
      expect(func.returnType).toBe('Int');

      const parameters = func.parameters as Formal[];

      expect(parameters.length).toBe(2);
      expect(parameters[0].identifier).toBe('a');
      expect(parameters[0].type).toBe('Int');
      expect(parameters[1].identifier).toBe('b');
      expect(parameters[1].type).toBe('Int');

      const body = func.body as Block;

      expect(body.isBlock()).toBe(true);
      expect(body.expressions.length).toBe(1);
      expect(body.expressions[0].isIfElse()).toBe(true);
    });
  });

  describe('#parseClass', () => {
    it('should parse a class definition', () => {
      const parser = new Parser(`class Fraction(n: Int, d: Int) {
        var num: Int = n
        var den: Int = d
        def gcd(): Int = {
          let a = num, b = den in {
            if (b == 0) a else gcd(b, a % b)
          }
        }
        override def toString(): String = n.toString() + "/" + d.toString()
        }`);

      const klass = parser.parseClass() as Class;
      expect(klass.isClass()).toBe(true);
      expect(klass.name).toBe('Fraction');
      expect(klass.isExported).toBe(false);

      const parameters = klass.parameters as Formal[];
      expect(parameters.length).toBe(2);
      expect(parameters[0].identifier).toBe('n');
      expect(parameters[0].type).toBe('Int');
      expect(parameters[1].identifier).toBe('d');
      expect(parameters[1].type).toBe('Int');

      const variables = klass.properties as Property[];
      expect(variables.length).toBe(2);
      expect(variables[0].name).toBe('num');
      expect(variables[0].type).toBe('Int');
      expect(variables[0].value?.isReference()).toBe(true);
      expect((variables[0].value as Reference).identifier).toBe('n');

      expect(variables[1].name).toBe('den');
      expect(variables[1].type).toBe('Int');
      expect(variables[1].value?.isReference()).toBe(true);
      expect((variables[1].value as Reference).identifier).toBe('d');

      const functions = klass.functions as Function[];
      expect(functions.length).toBe(2);
      expect(functions[0].name).toBe('gcd');
      expect(functions[1].name).toBe('toString');
      expect(functions[1].override).toBe(true);
    });

    it('should parse an exported class', () => {
      const parser = new Parser('export class A {}');

      const klass = parser.parseClass() as Class;
      expect(klass.isClass()).toBe(true);
      expect(klass.name).toBe('A');
      expect(klass.isExported).toBe(true);
    });
  });

  describe('#parseProgram', () => {
    it('should parse multiple class definitions', () => {
      const parser = new Parser(`
      class Fraction(n: Int, d: Int) {
        var num: Int = n
        var den: Int = d
        def gcd(): Int = {
          let a = num, b = den in {
            if (b == 0) a else gcd(b, a % b)
          }
        }
        override def toString(): String = n.toString() + "/" + d.toString()
      }

      class Complex(a: Double, b: Double) {
        var x: Double = a
        var y: Double = b
        override def toString(): String = x.toString() + " + " + b.toString() + "i"
      }
      `);

      const program = parser.parseProgram() as Program;

      expect(program.classesCount()).toBe(2);

      const fraction = program.classes[0] as Class;
      expect(fraction.isClass()).toBe(true);
      expect(fraction.name).toBe('Fraction');

      const fracParameters = fraction.parameters as Formal[];
      expect(fracParameters.length).toBe(2);
      expect(fracParameters[0].identifier).toBe('n');
      expect(fracParameters[0].type).toBe('Int');
      expect(fracParameters[1].identifier).toBe('d');
      expect(fracParameters[1].type).toBe('Int');

      const fracVariables = fraction.properties as Property[];
      expect(fracVariables.length).toBe(2);

      expect(fracVariables[0].name).toBe('num');
      expect(fracVariables[0].type).toBe('Int');
      expect(fracVariables[0].value?.isReference()).toBe(true);
      expect((fracVariables[0].value as Reference).identifier).toBe('n');

      expect(fracVariables[1].name).toBe('den');
      expect(fracVariables[1].type).toBe('Int');
      expect(fracVariables[1].value?.isReference()).toBe(true);
      expect((fracVariables[1].value as Reference).identifier).toBe('d');

      const fracFunctions = fraction.functions as Function[];
      expect(fracFunctions.length).toBe(2);
      expect(fracFunctions[0].name).toBe('gcd');
      expect(fracFunctions[1].name).toBe('toString');
      expect(fracFunctions[1].override).toBe(true);

      const complex = program.classes[1] as Class;
      expect(complex.isClass()).toBe(true);
      expect(complex.name).toBe('Complex');

      const complexParameters = complex.parameters as Formal[];
      expect(complexParameters.length).toBe(2);
      expect(complexParameters[0].identifier).toBe('a');
      expect(complexParameters[0].type).toBe('Double');
      expect(complexParameters[1].identifier).toBe('b');
      expect(complexParameters[1].type).toBe('Double');

      const complexVariables = complex.properties as Property[];
      expect(complexVariables.length).toBe(2);

      expect(complexVariables[0].name).toBe('x');
      expect(complexVariables[0].type).toBe('Double');
      expect(complexVariables[0].value?.isReference()).toBe(true);
      expect((complexVariables[0].value as Reference).identifier).toBe('a');

      expect(complexVariables[1].name).toBe('y');
      expect(complexVariables[1].type).toBe('Double');
      expect(complexVariables[1].value?.isReference()).toBe(true);
      expect((complexVariables[1].value as Reference).identifier).toBe('b');

      const complexFunctions = complex.functions as Function[];
      expect(complexFunctions.length).toBe(1);
      expect(complexFunctions[0].name).toBe('toString');
      expect(complexFunctions[0].override).toBe(true);
    });
  });
});
