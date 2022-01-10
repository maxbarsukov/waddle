import {
  Assignment,
  BinaryExpression,
  Block,
  BooleanLiteral,
  Cast,
  ConstructorCall,
  DecimalLiteral,
  Expression,
  Function,
  FunctionCall,
  IfElse,
  Initialization,
  IntegerLiteral,
  LazyExpression,
  Let,
  NativeExpression,
  Property,
  Reference,
  StringLiteral,
  SuperFunctionCall,
  UnaryExpression,
  While,
} from '../ast';

import Report from '../utils/Report';
import Obj from './Obj';
import { Types } from '../types/Types';
import Context from './Context';

export default class Evaluator {
  static evaluate(context: Context, expression: Expression | undefined): Obj {
    if (expression === undefined || expression.isDefinition()) {
      return Obj.create(context, Types.Void);
    }

    let value = null;
    if (expression.isAssignment()) {
      value = this.evaluateAssignment(context, expression as Assignment);
    } else if (expression.isBinaryExpression()) {
      value = this.evaluateBinaryExpression(context, expression as BinaryExpression);
    } else if (expression.isBlock()) {
      value = this.evaluateBlock(context, expression as Block);
    } else if (expression.isBooleanLiteral()) {
      value = this.evaluateBooleanLiteral(context, expression as BooleanLiteral);
    } else if (expression.isCast()) {
      value = this.evaluateCast(context, expression as Cast);
    } else if (expression.isConstructorCall()) {
      value = this.evaluateConstructorCall(context, expression as ConstructorCall);
    } else if (expression.isDecimalLiteral()) {
      value = this.evaluateDecimalLiteral(context, expression as DecimalLiteral);
    } else if (expression.isFunctionCall()) {
      value = this.evaluateFunctionCall(context, expression as FunctionCall);
    } else if (expression.isIfElse()) {
      value = this.evaluateIfElse(context, expression as IfElse);
    } else if (expression.isInitialization()) {
      value = this.evaluateInitialization(context, expression as Initialization);
    } else if (expression.isIntegerLiteral()) {
      value = this.evaluateIntegerLiteral(context, expression as IntegerLiteral);
    } else if (expression.isLet()) {
      value = this.evaluateLet(context, expression as Let);
    } else if (expression.isNative()) {
      value = this.evaluateNative(context, expression as NativeExpression);
    } else if (expression.isNullLiteral()) {
      value = this.evaluateNullLiteral(context);
    } else if (expression.isReference()) {
      value = this.evaluateReference(context, expression as Reference);
    } else if (expression.isStringLiteral()) {
      value = this.evaluateStringLiteral(context, expression as StringLiteral);
    } else if (expression.isSuper()) {
      value = this.evaluateSuperFunctionCall(context, expression as SuperFunctionCall);
    } else if (expression.isThis()) {
      value = this.evaluateThis(context);
    } else if (expression.isUnaryExpression()) {
      value = this.evaluateUnaryExpression(context, expression as UnaryExpression);
    } else if (expression.isWhile()) {
      value = this.evaluateWhile(context, expression as While);
    } else {
      throw new Error(Report.error({
        message: `Can't evaluate expression '${expression} with ${expression.expressionType} type`,
        pos: {
          line: expression.line,
          column: expression.column,
        },
      }));
    }

    expression.expressionType = value.type;
    return value;
  }

  static evaluateAssignment(context: Context, assign: Assignment) {
    const address = context.environment.find(assign.identifier);

    const value = assign.operator === '='
      ? this.evaluate(context, assign.value)
      : this.evaluateFunctionCall(context, new FunctionCall(
        assign.operator.charAt(0),
        [assign.value],
        new Reference(assign.identifier),
      ));

    if (address !== undefined) {
      context.store.put(address, value);
    } else if (context.self!.has(assign.identifier)) {
      context.self!.set(assign.identifier, value);
    }

    return Obj.create(context, Types.Void);
  }

  static evaluateBinaryExpression(context: Context, expression: BinaryExpression) {
    return this.evaluateFunctionCall(context, new FunctionCall(
      expression.operator,
      [expression.right],
      expression.left,
    ));
  }

  static evaluateBlock(context: Context, block: Block) {
    const size = block.expressions.length;

    if (size === 0) return Obj.create(context, Types.Void);

    context.environment.enterScope();
    for (let i = 0; i < size - 1; ++i) {
      this.evaluate(context, block.expressions[i]);
    }

    const value = this.evaluate(context, block.expressions[size - 1]);
    context.environment.exitScope();

    return value;
  }

  static evaluateBooleanLiteral(context: Context, bool: BooleanLiteral) {
    const value = Obj.create(context, Types.Bool);
    value.set('value', bool.value === 'true');
    return value;
  }

  static evaluateCast(context: Context, cast: Cast) {
    const object = this.evaluate(context, cast.object);
    const value = Obj.create(context, cast.type);

    object.properties.forEach((v, k) => {
      value.set(k, v);
    });

    return value;
  }

  static evaluateConstructorCall(context: Context, call: ConstructorCall) {
    const object = Obj.create(context, call.type);
    this.evaluateConstructorImpl(context, object, object.type!, call.args);
    return object;
  }

  static evaluateDecimalLiteral(context: Context, decimal: DecimalLiteral) {
    const value = Obj.create(context, Types.Double);
    value.set('value', parseFloat(decimal.value));
    return value;
  }

  static evaluateFunctionCall(context: Context, call: FunctionCall) {
    const object = call.object === undefined ? context.self!
      : this.evaluate(context, call.object);

    const func = object.getMostSpecificFunction(
      call.functionName,
      call.args.map((arg) => arg.expressionType!),
      context,
    );

    return this.evaluateFunctionCallImpl(context, object, func, call);
  }

  static evaluateIfElse(context: Context, ifElse: IfElse) {
    const condition = this.evaluate(context, ifElse.condition);

    return condition.get('value')
      ? this.evaluate(context, ifElse.thenBranch)
      : this.evaluate(context, ifElse.elseBranch);
  }

  static evaluateInitialization(context: Context, init: Initialization) {
    const value = init.value !== undefined ? this.evaluate(context, init.value)
      : Obj.defaultValue(context, init.type!);

    const address = context.store.alloc(value);
    context.environment.add(init.identifier, address);
  }

  static evaluateIntegerLiteral(context: Context, integer: IntegerLiteral) {
    const value = Obj.create(context, Types.Int);
    value.set('value', parseInt(integer.value, 10));
    return value;
  }

  static evaluateLet(context: Context, letExpr: Let) {
    letExpr.initializations.forEach((init) => {
      this.evaluateInitialization(context, init);
    });

    const value = this.evaluate(context, letExpr.body);

    letExpr.initializations.forEach((init) => {
      context.store.free(context.environment.find(init.identifier)!);
    });

    return value;
  }

  static evaluateNative(context: Context, native: NativeExpression) {
    return native.func(context);
  }

  static evaluateNullLiteral(context: Context) {
    return Obj.create(context, Types.Null);
  }

  static evaluateProperty(context: Context, property: Property) {
    if (property.value === undefined) {
      return Obj.defaultValue(context, property.type!);
    }

    return this.evaluate(context, property.value);
  }

  static evaluateReference(context: Context, reference: Reference) {
    const address = context.environment.find(reference.identifier);

    if (address !== undefined) {
      let value = context.store.get(address);

      if (value instanceof Expression) {
        value = this.evaluate(context, value);
        context.store.put(address, value);
      }

      return value;
    }

    let prop = context.self!.get(reference.identifier);

    if (prop instanceof Expression) {
      prop = this.evaluate(context, prop);
      context.self!.set(reference.identifier, prop);
    }

    return prop;
  }

  static evaluateStringLiteral(context: Context, str: StringLiteral) {
    const value = Obj.create(context, Types.String);
    value.set('value', str.value.substring(1, str.value.length - 1));
    return value;
  }

  static evaluateSuperFunctionCall(context: Context, call: SuperFunctionCall) {
    const baseType = context.getClass(context.self?.type!).superClass;
    const base = Obj.create(context, baseType);
    const func = base.getMostSpecificFunction(
      call.functionName,
      call.args.map((arg: Expression) => arg.expressionType!),
      context,
    );

    return this.evaluateFunctionCallImpl(context, context.self!, func, call as FunctionCall);
  }

  static evaluateThis(context: Context) {
    return context.self;
  }

  static evaluateUnaryExpression(context: Context, expression: UnaryExpression) {
    return this.evaluateFunctionCall(context, new FunctionCall(
      `unary_${expression.operator}`,
      [],
      expression.expression,
    ));
  }

  static evaluateWhile(context: Context, whileExpr: While) {
    while (this.evaluate(context, whileExpr.condition).get('value') === true) {
      this.evaluate(context, whileExpr.body);
    }
    return Obj.create(context, Types.Void);
  }

  static evaluateConstructorImpl(context: Context, object: Obj, type: string, args: Expression[]) {
    const klass = context.getClass(type);
    const argsValues = args.map((arg) => this.evaluate(context, arg));
    const self = context.self;

    context.self = object;

    for (let i = 0, l = klass.parameters.length; i < l; ++i) {
      object.set(klass.parameters[i].identifier, argsValues[i]);
    }

    if (klass.superClass !== 'NO_SUPER_CLASS') {
      this.evaluateConstructorImpl(context, object, klass.superClass, klass.superClassArgs);
    }

    klass.properties.forEach((variable) => {
      object.set(variable.name, this.evaluateProperty(context, variable));
    });

    context.self = self;
  }

  static evaluateFunctionCallImpl(
    context: Context,
    object: Obj,
    func: Function | undefined,
    call: FunctionCall,
  ) {
    if (func === undefined) {
      throw new Error(Report.error({
        message: `No function '${call.functionName}' defined in class '${object.type}'.`,
        pos: {
          line: call.line,
          column: call.column,
        },
      }));
    }

    context.environment.enterScope();
    const argsValues = [];

    for (let i = 0, l = func.parameters.length; i < l; ++i) {
      if (func.parameters[i].lazy) {
        argsValues.push(new LazyExpression(call.args[i], context.copy()));
      } else {
        argsValues.push(this.evaluate(context, call.args[i]));
      }
    }

    for (let i = 0, l = func.parameters.length; i < l; ++i) {
      // @ts-ignore
      context.environment.add(func.parameters[i].identifier, context.store.alloc(argsValues[i]));
    }

    const self = context.self;
    context.self = object;
    const value = this.evaluate(context, func.body);

    func.parameters.forEach((parameter) => {
      context.store.free(context.environment.find(parameter.identifier)!);
    });

    context.environment.exitScope();
    context.self = self;

    return value;
  }
}
