import Context from '../Context';
import Evaluator from '../Evaluator';
import Parser from '../../parser';
import TypeChecker from '../../semantic/TypeChecker';
import TypeEnvironment from '../../semantic/TypeEnvironment';
import getRuntime from '../runtime';

describe('Evaluator', () => {
  describe('#evaluate', () => {
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

    it('should evaluate a reference', () => {
      const source = 'let n = 42 in n + 1';
      const expression = (new Parser(source)).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      context.environment.enterScope();
      const value = Evaluator.evaluate(context, expression);
      context.environment.exitScope();
      expect(value.get('value')).toBe(43);
    });
  });
});
