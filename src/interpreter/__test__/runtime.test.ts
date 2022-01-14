import TypeEnvironment from '../../semantic/TypeEnvironment';
import Context from '../Context';
import getRuntime from '../runtime';
import Parser from '../../parser';
import TypeChecker from '../../semantic/TypeChecker';
import Evaluator from '../Evaluator';

function check(source: string, ans: any, typeEnv: TypeEnvironment, context: Context) {
  const expression = (new Parser(source)).parseExpression();
  TypeChecker.typeCheck(typeEnv, expression);
  const value = Evaluator.evaluate(context, expression);
  expect(value.get('value')).toBe(ans);
}

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
      '10 == new Object()': false,
      '10 != new Object()': false,
      '10 > 1': true,
      '10 > 11': false,
      '10 < 1': false,
      '10 < 11': true,
      '10 >= 1': true,
      '10 >= 11': false,
      '10 <= 1': false,
      '10 <= 11': true,
      '11 <= 11': true,
      '11 >= 11': true,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('BoolClass', () => {
    const testCases = {
      'true.toString()': 'true',
      'false.toString()': 'false',
      'false == false': true,
      'false == new Object()': false,
      'true == 1': false,
      'false != false': false,
      'false != new Object()': true,
      'true != 1': true,
      '!true': false,
      '!false': true,
      '!!true': true,
      '!!false': false,
      'true && true': true,
      'true && false': false,
      'false && true': false,
      'false && false': false,
      'true || true': true,
      'true || false': true,
      'false || true': true,
      'false || false': false,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });
});
