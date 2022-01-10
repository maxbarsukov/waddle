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
  });
});
