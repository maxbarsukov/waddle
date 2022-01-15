import readline from 'readline-sync';

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
      1: 1,
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
      '11.instanceOf("Int")': true,
      '11.instanceOf("Double")': false,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('BoolClass', () => {
    const testCases = {
      true: true,
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
      'false.instanceOf("Bool")': true,
      'false.instanceOf("Double")': false,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('DoubleClass', () => {
    const testCases = {
      1.3: 1.3,
      '1.0.toString()': '1',
      '1.1.toString()': '1.1',
      '2e2.toString()': '200',
      '-1.3': -1.3,
      '-(-1.3)': 1.3,
      '1.0 == 1.0': true,
      '1.0 == 1': true,
      '1.1 == 1.0': false,
      '1.1 == 1': false,
      '1.1 == new Object()': false,
      '1.0 != 1.0': false,
      '1.0 != 1': false,
      '1.1 != 1.0': true,
      '1.1 != 1': true,
      '1.1 != new Object()': false,
      '0.1 + 0.2 == 0.3': false,
      '1.1 + 1.2 == 2.3': true,
      '1.1 + 2.1 + 3.1 + 4.1 + 5.1': 15.5,
      '(1.1 + 2.1) * 3.5 + 4.0 + 5.9': 21.1,
      '1.1 - 10.5': -9.4,
      '1.1 - 10': -8.9,
      '10.2 / 2': 5.1,
      '10.2 / 2.5': 4.08,
      '10.5 % 3': 1.5,
      '10.4 * 3': 31.200000000000003,
      '10.4 * 3.1': 32.24,
      '3.2.*(2.1)': 6.720000000000001,
      '0.1 + 0.2': 0.30000000000000004,
      '2.1e-1': 0.21,
      '3.1e3': 3100,
      '3.2E4': 32000,
      '10.1 > 1': true,
      '10.1 > 11': false,
      '10.1 < 1': false,
      '10.1 < 11.1': true,
      '10.1 >= 1.1': true,
      '10.1 >= 11.1': false,
      '10.1 <= 1.1': false,
      '10.1 <= 11.1': true,
      '11.1 <= 11.1': true,
      '11.1 >= 11.1': true,
      '1.0.instanceOf("Int")': false,
      '1.0.instanceOf("Double")': true,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('NullClass', () => {
    const testCases = {
      null: undefined,
      'null.toString()': 'null',
      'null == null': true,
      'null == new Object()': false,
      'null == 0': false,
      'null != null': false,
      'null != new Object()': true,
      'null != 0': true,
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('ObjectClass', () => {
    const testCases = {
      'new Object()': undefined,
      'new Object().instanceOf("Object")': true,
      'new Object().instanceOf("Int")': false,
      'new Object().toString()': 'Object@undefined',
      'new Object() == new Object()': false,
      'new Object() == 1': false,
      'new Object() == null': false,
      'new Object() == "Object@undefined"': false,
      'new Object() != new Object()': true,
      'new Object() != 1': true,
      'new Object() != null': true,
      'new Object() != "Object@undefined"': true,
      'new Object() + "AAA"': 'Object@undefinedAAA',
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('VoidClass', () => {
    const testCases = {
      'new Void()': undefined,
      'new Void().instanceOf("Void")': true,
      'new Void().toString()': '()',
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('PredefClass', () => {
    const testCases = {
      'new Predef()': undefined,
      'new Predef().instanceOf("Predef")': true,
      'new Predef().toString()': '__predef__',
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('StringClass', () => {
    const testCases = {
      '""': '',
      '"A"': 'A',
      '"A".toString()': 'A',
      '"A" + "B"': 'AB',
      '"Abc" + "DE"': 'AbcDE',
      '"Abc" + 1': 'Abc1',
      '"Abc" + 1.2': 'Abc1.2',
      '"Abc" + 1.0': 'Abc1',
      '"Abc" + new Object()': 'AbcObject@0',
      '("A" + "B").toString()': 'AB',
      '"ab" == "ab"': true,
      '"ab" != "ab"': false,
      '"ab" == "abc"': false,
      '"ab" == 1': false,
      '"ab" != 1': false,
      '"ab" != "abc"': true,
      '"abc".at(0)': 'a',
      '"abc".at(2)': 'c',
      '"abc".at(-1)': '',
      '"abc".length()': 3,
      '"".length()': 0,
      '"abcde".contains("a")': true,
      '"abcde".contains("b")': true,
      '"abcde".contains("abc")': true,
      '"abcde".contains("abcde")': true,
      '"abcde".startsWith("a")': true,
      '"abcde".startsWith("b")': false,
      '"abcde".startsWith("abc")': true,
      '"abcde".startsWith("abcde")': true,
      '"abcde".startsWith("bcde")': false,
      '"abcde".endsWith("e")': true,
      '"abcde".endsWith("cd")': false,
      '"abcde".endsWith("a")': false,
      '"abcde".endsWith("bcde")': true,
      '"abcde".indexOf("a")': 0,
      '"abcde".indexOf("abcde")': 0,
      '"abcde".indexOf("e")': 4,
      '"abcde".indexOf("bcde")': 1,
      '"abcde".indexOf("smth")': -1,
      '"abcde".toUpper()': 'ABCDE',
      '"ABCDE".toUpper()': 'ABCDE',
      '"Hello_There".toUpper()': 'HELLO_THERE',
      '"ABCDE".toLower()': 'abcde',
      '"abcde".toLower()': 'abcde',
      '"Hello_There".toLower()': 'hello_there',
      '"abcde".substring(2)': 'cde',
      '"abcde".substring(0)': 'abcde',
      '"abcde".substring(5)': '',
      '"abcde".substring(6)': '',
      '"abcde".substring(-2)': 'abcde',
      '"abcde".substring(2, 4)': 'cd',
      '"abcde".substring(0, 3)': 'abc',
      '"abcde".substring(5, 6)': '',
      '"abcde".substring(6, -1)': 'abcde',
      '"abcde".substring(-2, 3)': 'abc',
      '"abcde".trim()': 'abcde',
      '"  ".trim()': '',
      '"  a".trim()': 'a',
      '"a  a".trim()': 'a  a',
      '"a  ".trim()': 'a',
      '"\na\na  ".trim()': 'a\na',
      '"abcde".replace("smth", "a")': 'abcde',
      '"abcde".replace("a", "bb")': 'bbbcde',
      '"abcde".replace("abc", "")': 'de',
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });
  });

  describe('MathClass', () => {
    const testCases = {
      'new Math$()': undefined,
      'new Math$().instanceOf("Math$")': true,
      'new Math$().toString()': 'Math$@undefined',
      'new Math$().e()': Math.E,
      'new Math$().ln2()': Math.LN2,
      'new Math$().ln10()': Math.LN10,
      'new Math$().log2e()': Math.LOG2E,
      'new Math$().log10e()': Math.LOG10E,
      'new Math$().pi()': Math.PI,
      'new Math$().abs(1.1)': 1.1,
      'new Math$().abs(-1.1)': 1.1,
      'new Math$().abs(1)': 1,
      'new Math$().abs(-1)': 1,
      'new Math$().acos(0.5)': Math.acos(0.5),
      'new Math$().acos(1)': Math.acos(1),
      'new Math$().acosh(2)': Math.acosh(2),
      'new Math$().acosh(0.5)': Math.acosh(0.5),
      'new Math$().asin(0.5)': Math.asin(0.5),
      'new Math$().asin(1)': Math.asin(1),
      'new Math$().asinh(2)': Math.asinh(2),
      'new Math$().asinh(0.5)': Math.asinh(0.5),
      'new Math$().atan(0.5)': Math.atan(0.5),
      'new Math$().atan(1)': Math.atan(1),
      'new Math$().atanh(2)': Math.atanh(2),
      'new Math$().atanh(0.5)': Math.atanh(0.5),
      'new Math$().cos(0.5)': Math.cos(0.5),
      'new Math$().cos(1)': Math.cos(1),
      'new Math$().cosh(0.5)': Math.cosh(0.5),
      'new Math$().cosh(1)': Math.cosh(1),
      'new Math$().ceil(1.1)': 2,
      'new Math$().ceil(1.9)': 2,
      'new Math$().ceil(1.5)': 2,
      'new Math$().ceil(1)': 1,
      'new Math$().floor(1.1)': 1,
      'new Math$().floor(1.9)': 1,
      'new Math$().floor(1.5)': 1,
      'new Math$().floor(1)': 1,
      'new Math$().log(10)': Math.log(10),
      'new Math$().log(2.5)': Math.log(2.5),
      'new Math$().log2(4)': Math.log2(4),
      'new Math$().log2(16.5)': Math.log2(16.5),
      'new Math$().log10(100)': 2,
      'new Math$().log10(16.5)': Math.log10(16.5),
      'new Math$().max(1.1, 1)': 1.1,
      'new Math$().max(1, 2.1)': 2.1,
      'new Math$().max(1, 3)': 3,
      'new Math$().max(15.9, 16.1)': 16.1,
      'new Math$().min(1.1, 1)': 1,
      'new Math$().min(1, 2.1)': 1,
      'new Math$().min(1, 3)': 1,
      'new Math$().min(15.9, 16.1)': 15.9,
      'new Math$().pow(2, 4)': 16,
      'new Math$().pow(2.1, 3)': 2.1 ** 3,
      'new Math$().pow(2, 3.5)': 2 ** 3.5,
      'new Math$().pow(0.2, 3.5)': 0.2 ** 3.5,
      'new Math$().round(1)': 1,
      'new Math$().round(1.1)': 1,
      'new Math$().round(1.5)': 2,
      'new Math$().round(1.9)': 2,
      'new Math$().sqrt(4)': 2,
      'new Math$().sqrt(5.2)': Math.sqrt(5.2),
      'new Math$().sin(0.5)': Math.sin(0.5),
      'new Math$().sin(1)': Math.sin(1),
      'new Math$().trunc(1.0)': Math.trunc(1.0),
      'new Math$().trunc(1.1)': Math.trunc(1.1),
      'new Math$().trunc(1.5)': Math.trunc(1.5),
      'new Math$().trunc(1.99)': Math.trunc(1.99),
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });

    it('new Math$().random()', () => {
      const expression = (new Parser('new Math$().random()')).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      const value = Evaluator.evaluate(context, expression);
      expect(value.get('value')).toBeGreaterThanOrEqual(0);
      expect(value.get('value')).toBeLessThanOrEqual(1);
    });

    it('new Math$().random(1, 5)', () => {
      const expression = (new Parser('new Math$().random(1, 5)')).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      const value = Evaluator.evaluate(context, expression);
      expect(value.get('value')).toBeGreaterThanOrEqual(1);
      expect(value.get('value')).toBeLessThanOrEqual(5);
    });
  });

  describe('IOClass', () => {
    const log = console.log;
    const question = readline.question;
    const questionInt = readline.questionInt;
    const questionFloat = readline.questionFloat;

    beforeEach(() => {
      console.log = jest.fn();
      readline.question = jest.fn();
      readline.questionInt = jest.fn();
      readline.questionFloat = jest.fn();
    });

    afterAll(() => {
      console.log = log;
      readline.question = question;
      readline.questionInt = questionInt;
      readline.questionFloat = questionFloat;
    });

    const testCases = {
      'new IO$()': undefined,
      'new IO$().instanceOf("IO$")': true,
      'new IO$().toString()': 'IO$@undefined',
    };

    Object.entries(testCases).forEach(([source, ans]) => {
      it(source, () => {
        check(source, ans, typeEnv, context);
      });
    });

    const testCasesPrint = {
      'new IO$().println(1)': '1',
      'new IO$().println("")': '',
      'new IO$().println("Hello World")': 'Hello World',
      'new IO$().println(new Object())': 'Object@0',
    };

    Object.entries(testCasesPrint).forEach(([source, ans]) => {
      it(source, () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const expression = (new Parser(source)).parseExpression();
        TypeChecker.typeCheck(typeEnv, expression);
        Evaluator.evaluate(context, expression);
        expect(consoleSpy).toHaveBeenCalledWith(ans);
      });
    });

    it('new IO$().println()', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const expression = (new Parser('new IO$().println()')).parseExpression();
      TypeChecker.typeCheck(typeEnv, expression);
      Evaluator.evaluate(context, expression);
      expect(consoleSpy).toHaveBeenCalledWith();
    });

    const questionIntSpy = jest.spyOn(readline, 'questionInt');
    const questionFloatSpy = jest.spyOn(readline, 'questionFloat');
    const questionSpy = jest.spyOn(readline, 'question');

    const testCasesRead = {
      questionIntSpy: ['new IO$().readInt("Hi")', 'new IO$().readInt()'],
      questionSpy: ['new IO$().readString("Hi")', 'new IO$().readString()'],
      questionFloatSpy: ['new IO$().readDouble("Hi")', 'new IO$().readDouble()'],
    };

    Object.entries(testCasesRead).forEach(([spy, sources]) => {
      sources.forEach(source => {
        it(`${source}: ${spy}`, () => {
          const expression = (new Parser(source)).parseExpression();
          TypeChecker.typeCheck(typeEnv, expression);
          Evaluator.evaluate(context, expression);
          expect(questionIntSpy).toHaveBeenCalledTimes(0);
          expect(questionFloatSpy).toHaveBeenCalledTimes(0);
          expect(questionSpy).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
