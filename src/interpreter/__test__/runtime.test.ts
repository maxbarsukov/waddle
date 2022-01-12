import TypeEnvironment from '../../semantic/TypeEnvironment';
import Context from '../Context';
import getRuntime from '../runtime';
import Parser from '../../parser';
import TypeChecker from '../../semantic/TypeChecker';
import Evaluator from '../Evaluator';

describe('Runtime', () => {
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

  describe('IntClass', () => {
    const testCases = {
      '1 + 2 + 3 + 4 + 5': 15,
      '(1 + 2) * 3 + 4 + 5': 18,
      '1 - 10': -9,
      '10 / 2': 5,
      '10 % 3': 1,
      '10 * 3': 30,
      '3.*(2)': 6,
      '-11': -11,
      '-(-11)': 11,
      '((1 + 1) + 1) * 2': 6,
      '1.toString()': '1',
      '100.toString()': '100',
      '10 == 10': true,
      '10 == 11': false,
      '10 != 11': true,
      '10 != 10': false,
      '10 > 1': true,
      '10 > 11': false,
      '10 < 1': false,
      '10 < 11': true,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        const expression = (new Parser(source)).parseExpression();
        TypeChecker.typeCheck(typeEnv, expression);
        const value = Evaluator.evaluate(context, expression);
        expect(value.get('value')).toBe(ans);
      });
    });
  });

  describe('MathClass', () => {
    const testCases = {
      'Math.ln2()': Math.LN2,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        const expression = (new Parser(source)).parseExpression();
        TypeChecker.typeCheck(typeEnv, expression);
        const value = Evaluator.evaluate(context, expression);
        expect(value.get('value')).toBe(ans);
      });
    });
  });
});
