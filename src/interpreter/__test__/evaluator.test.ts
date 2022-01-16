import Context from '../Context';
import Evaluator from '../Evaluator';
import Parser from '../../parser';
import TypeChecker from '../../semantic/TypeChecker';
import TypeEnvironment from '../../semantic/TypeEnvironment';
import getRuntime from '../runtime';
import { Types } from '../../types/Types';
import { Expression, FunctionCall } from '../../ast';
import Obj from '../Obj';

describe('Evaluator', () => {
  const typeEnv = new TypeEnvironment();
  const context = new Context();

  const runtimeClasses = getRuntime();
  runtimeClasses.forEach(cls => {
    typeEnv.addClass(cls);
    context.addClass(cls);
  });

  beforeEach(() => {
    typeEnv.symbolTable.clear();
  });

  describe('#evaluate', () => {
    it('should evaluate a boolean literal', () => {
      const source = 'false';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      const value = Evaluator.evaluate(context, expression);
      expect(value.get('value')).toBe(false);
    });

    it('should evaluate a string literal', () => {
      const source = '"Hello, world!"';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      const value = Evaluator.evaluate(context, expression);
      expect(value.get('value')).toBe('Hello, world!');
    });

    it('should evaluate an integer literal', () => {
      const source = '42';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      const value = Evaluator.evaluate(context, expression);
      expect(value.get('value')).toBe(42);
    });

    it('should evaluate an integer addition', () => {
      const source = '1 + 2 + 3 + 4 + 5';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      const value = Evaluator.evaluate(context, expression);
      expect(value.get('value')).toBe(15);
    });

    it('should evaluate an if/else expression', () => {
      const testCases = {
        'if (2 < 3) 42 else 21': 42,
        'if (2 < 3) { 42 } else 21': 42,
        'if (2 < 3) 42 else { 21 }': 42,
        'if (2 < 3) { 42 } else { 21 }': 42,
        'if (2 > 3) 42 else 21': 21,
        'if (2 == 3) 42 else -111': -111,
      };
      Object.entries(testCases).forEach(([source, ans]) => {
        const expression = (new Parser(source)).parseExpression();
        TypeChecker.typeCheck(typeEnv, expression);
        const value = Evaluator.evaluate(context, expression);
        expect(value.get('value')).toBe(ans);
      });
    });

    it('should evaluate a constructor call', () => {
      const fractionClassSource = `
        class Fraction(n: Int, d: Int) {
          var num: Int = n
          var den: Int = d
         }
      `;

      const fractionClass = (new Parser(fractionClassSource)).parseClass();
      typeEnv.addClass(fractionClass);
      context.addClass(fractionClass);
      TypeChecker.typeCheckClass(typeEnv, fractionClass);

      const source = 'new Fraction(3, 4)';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);

      const value = Evaluator.evaluate(context, expression);

      expect(value.type).toBe('Fraction');

      expect(value.has('num')).toBe(true);
      expect(value.has('den')).toBe(true);

      expect(value.get('num').get('value')).toBe(3);
      expect(value.get('den').get('value')).toBe(4);
    });

    it('should evaluate a super call', () => {
      const classSource = `
        class A {
          var s: String = super.toString()
         }
      `;

      const klass = (new Parser(classSource)).parseClass();
      typeEnv.addClass(klass);
      context.addClass(klass);
      TypeChecker.typeCheckClass(typeEnv, klass);

      const source = 'new A()';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);

      const value = Evaluator.evaluate(context, expression);

      expect(value.type).toBe('A');

      expect(value.has('s')).toBe(true);
      expect(value.get('s').get('value')).toBe('A@undefined');
    });

    it('should evaluate a reference', () => {
      const source = 'let n = 42 in n + 1';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      context.environment.enterScope();
      const value = Evaluator.evaluate(context, expression);
      context.environment.exitScope();
      expect(value.get('value')).toBe(43);
    });

    it('should evaluate a while', () => {
      const source = 'let n = 0 in { while(n < 10) { n = n + 1 }\n n}';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      context.environment.enterScope();
      const value = Evaluator.evaluate(context, expression);
      context.environment.exitScope();
      expect(value.get('value')).toBe(10);
    });

    it('should evaluate an undefined literal', () => {
      const value = Evaluator.evaluate(context, undefined);
      expect(value.type).toBe(Types.Void);
    });

    it('should throw error if can\'t evaluate expression', () => {
      const t = () => Evaluator.evaluate(context, new Expression());
      expect(t).toThrow(Error);
    });
  });

  describe('#evaluateFunctionCallImpl', () => {
    it('should throw error if func is undefined', () => {
      const t = () => {
        Evaluator.evaluateFunctionCallImpl(
          context,
          new Obj('Type'),
          undefined,
          new FunctionCall('name'),
        );
      };
      expect(t).toThrow(Error);
    });
  });
});
