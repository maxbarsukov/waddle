import {
  Assignment,
  BinaryExpression,
  Block,
  BooleanLiteral,
  Cast,
  Class,
  ConstructorCall,
  DecimalLiteral,
  Definition,
  Expression,
  Function,
  FunctionCall,
  IfElse,
  Initialization,
  IntegerLiteral,
  Let,
  Node,
  NullLiteral, Program,
  Property,
  Reference,
  StringLiteral,
  SuperFunctionCall,
  This,
  UnaryExpression,
  While,
} from '../ast';

import Report from '../utils/Report';
import Symbol from './Symbol';
import { Types } from '../types/Types';
import TypesUtils from '../utils/TypesUtils';
import TypeEnvironment from './TypeEnvironment';

export default class TypeChecker {
  static typeCheck(environment: TypeEnvironment, ast: Node | undefined) {
    if (ast === undefined) return;

    if (ast.isDefinition()) {
      const def = ast as Definition;
      if (def.isClass()) {
        this.typeCheckClass(environment, ast as Class);
      } else if (def.isFunction()) {
        this.typeCheckFunction(environment, ast as Function);
      } else if (def.isProperty()) {
        this.typeCheckProperty(environment, ast as Property);
      }
    } else if (ast.isExpression()) {
      const expr = ast as Expression;
      if (expr.isAssignment()) {
        this.typeCheckAssignment(environment, expr as Assignment);
      } else if (expr.isBinaryExpression()) {
        this.typeCheckBinaryExpression(environment, expr as BinaryExpression);
      } else if (expr.isBlock()) {
        this.typeCheckBlock(environment, expr as Block);
      } else if (expr.isBooleanLiteral()) {
        this.typeCheckBooleanLiteral(expr as BooleanLiteral);
      } else if (expr.isCast()) {
        this.typeCheckCast(environment, expr as Cast);
      } else if (expr.isConstructorCall()) {
        this.typeCheckConstructorCall(environment, expr as ConstructorCall);
      } else if (expr.isDecimalLiteral()) {
        this.typeCheckDecimalLiteral(expr as DecimalLiteral);
      } else if (expr.isIfElse()) {
        this.typeCheckIfElse(environment, expr as IfElse);
      } else if (expr.isInitialization()) {
        this.typeCheckInitialization(environment, expr as Initialization);
      } else if (expr.isIntegerLiteral()) {
        this.typeCheckIntegerLiteral(expr as IntegerLiteral);
      } else if (expr.isLet()) {
        this.typeCheckLet(environment, expr as Let);
      } else if (expr.isFunctionCall()) {
        this.typeCheckFunctionCall(environment, expr as FunctionCall);
      } else if (expr.isNullLiteral()) {
        this.typeCheckNullLiteral(expr as NullLiteral);
      } else if (expr.isReference()) {
        this.typeCheckReference(environment, expr as Reference);
      } else if (expr.isStringLiteral()) {
        this.typeCheckStringLiteral(expr as StringLiteral);
      } else if (expr.isSuper()) {
        this.typeCheckSuperFunctionCall(environment, expr as SuperFunctionCall);
      } else if (expr.isThis()) {
        this.typeCheckThis(environment, expr as This);
      } else if (expr.isUnaryExpression()) {
        this.typeCheckUnaryExpression(environment, expr as UnaryExpression);
      } else if (expr.isWhile()) {
        this.typeCheckWhile(environment, expr as While);
      }
    }
  }

  static typeCheckAssignment(environment: TypeEnvironment, assign: Assignment) {
    const symbol = environment.symbolTable.find(assign.identifier);

    if (symbol === undefined) {
      throw new Error(Report.error({
        message: `Assignment to an undefined variable '${assign.identifier}'.`,
        pos: {
          line: assign.line,
          column: assign.column,
        },
      }));
    }

    this.typeCheck(environment, assign.value);
    const valueType = assign.value.expressionType!;

    if (symbol.type === undefined) {
      symbol.type = valueType;
    } else if (!TypesUtils.conform(valueType, symbol.type, environment)) {
      throw new Error(
        `Value assigned to '${symbol.identifier}' `
        + `does not conform to the declared type '${symbol.type}'.`,
      );
    }

    assign.expressionType = Types.Void;
  }

  static typeCheckBinaryExpression(environment: TypeEnvironment, expression: BinaryExpression) {
    const functionCall = new FunctionCall(
      expression.operator, [expression.right], expression.left,
    );

    functionCall.line = expression.line;
    functionCall.column = expression.column;

    this.typeCheckFunctionCall(environment, functionCall);

    expression.expressionType = functionCall.expressionType;
  }

  static typeCheckBlock(environment: TypeEnvironment, block: Block) {
    environment.symbolTable.enterScope();
    block.expressions.forEach((expression) => {
      this.typeCheck(environment, expression);
    });

    const length = block.expressions.length;
    block.expressionType = length > 0 ? block.expressions[length - 1].expressionType : Types.Void;
    environment.symbolTable.exitScope();
  }

  static typeCheckBooleanLiteral(boolean: BooleanLiteral) {
    boolean.expressionType = Types.Bool;
  }

  static typeCheckCast(environment: TypeEnvironment, cast: Cast) {
    this.typeCheck(environment, cast.object);

    if (!TypesUtils.conform(cast.type, cast.object.expressionType!, environment)) {
      throw new Error(Report.error({
        message: `Cannot cast an object of type '${cast.object.expressionType}' to '${cast.type}'.`,
        pos: {
          line: cast.line,
          column: cast.column,
        },
      }));
    }

    cast.expressionType = cast.type;
  }

  static typeCheckClass(environment: TypeEnvironment, klass: Class) {
    const symbolTable = environment.symbolTable;
    const currentClass = environment.currentClass;

    environment.currentClass = klass;
    symbolTable.enterScope();

    klass.parameters.forEach((parameter) => {
      if (symbolTable.check(parameter.identifier)) {
        throw new Error(Report.error({
          message:
            `Duplicate class parameter name '${parameter.identifier}' in class `
            + `'${klass.name}' definition.`,
          pos: {
            line: parameter.line,
            column: parameter.column,
          },
        }));
      }

      symbolTable.add(new Symbol(
        parameter.identifier, parameter.type, parameter.line, parameter.column),
      );
    });

    if (klass.superClass !== 'NO_SUPER_CLASS') {
      this.typeCheckConstructorCall(environment, new ConstructorCall(
        klass.superClass, klass.superClassArgs),
      );
    }

    klass.properties.forEach((property) => {
      this.typeCheckProperty(environment, property);
    });

    klass.functions.forEach((func) => {
      if (environment.hasFunction(klass.name, func)) {
        throw new Error(Report.error({
          message:
            `Function '${func.name}' with signature '${func.signature()}' `
            + `is already defined in class '${klass.name}'.`,
          pos: {
            line: func.line,
            column: func.column,
          },
        }));
      }

      environment.addFunction(klass.name, func);

      this.typeCheckFunction(environment, func);
    });

    symbolTable.exitScope();

    environment.currentClass = currentClass;
  }

  static typeCheckConstructorCall(environment: TypeEnvironment, call: ConstructorCall) {
    if (!environment.hasClass(call.type)) {
      throw new Error(Report.error({
        message: `Undefined type '${call.type}'.`,
        pos: {
          line: call.line,
          column: call.column,
        },
      }));
    }

    const klass = environment.getClass(call.type)!;
    const parametersCount = klass.parameters.length;

    if (parametersCount !== call.args.length) {
      throw new Error(Report.error({
        message: `Class '${klass.name}' constructor called with wrong number of arguments.`,
        pos: {
          line: call.line,
          column: call.column,
        },
      }));
    }

    for (let i = 0; i < parametersCount; ++i) {
      const arg = call.args[i];

      this.typeCheck(environment, arg);

      const argType = arg.expressionType;
      const parameterType = klass.parameters[i].type;

      if (!TypesUtils.conform(argType!, parameterType, environment)) {
        throw new Error(Report.error({
          message:
            `Class '${klass.name}' constructor argument type `
            + `'${argType}' does not conform to declared type '${parameterType}'.`,
          pos: {
            line: arg.line,
            column: arg.column,
          },
        }));
      }
    }

    call.expressionType = call.type;
  }

  static typeCheckDecimalLiteral(decimal: DecimalLiteral) {
    decimal.expressionType = Types.Double;
  }

  static typeCheckFunction(environment: TypeEnvironment, func: Function) {
    const symbolTable = environment.symbolTable;

    if (func.override) {
      const overrided = TypesUtils.findOverridedFunction(
        environment.currentClass!.superClass, func, environment,
      );

      if (overrided === undefined) {
        throw new Error(Report.error({
          message:
            `No suitable function '${func.signature()}' found in superclass(es) to override.`,
          pos: {
            line: func.line,
            column: func.column,
          },
        }));
      }
    }

    symbolTable.enterScope();

    func.parameters.forEach((parameter) => {
      if (symbolTable.check(parameter.identifier)) {
        throw new Error(Report.error({
          message: `Duplicate parameter name '${parameter.identifier}' in func '${func.name}'.`,
          pos: {
            line: parameter.line,
            column: parameter.column,
          },
        }));
      }

      symbolTable.add(new Symbol(
        parameter.identifier, parameter.type, parameter.line, parameter.column),
      );
    });

    this.typeCheck(environment, func.body);

    if (!TypesUtils.conform(func.body.expressionType!, func.returnType, environment)) {
      throw new Error(Report.error({
        message:
          `Function '${func.name}' value type '${func.body.expressionType}' `
          + `does not conform to return type '${func.returnType}'.`,
        pos: {
          line: func.line,
          column: func.column,
        },
      }));
    }

    symbolTable.exitScope();
  }

  static typeCheckFunctionCall(environment: TypeEnvironment, call: FunctionCall) {
    if (call.object !== undefined) {
      this.typeCheck(environment, call.object);
    }

    const objectClass = call.object === undefined ? environment.currentClass!
      : environment.getClass(call.object.expressionType!)!;

    if (!TypesUtils.hasFunctionWithName(objectClass, call.functionName, environment)) {
      throw new Error(Report.error({
        message: `No function '${call.functionName}' defined in class '${objectClass.name}'.`,
        pos: {
          line: call.line,
          column: call.column,
        },
      }));
    }

    call.args.forEach((arg) => {
      this.typeCheck(environment, arg);
    });

    const argsTypes = call.args.map((arg) => arg.expressionType!);
    const func = TypesUtils.findMethodToApply(
      objectClass, call.functionName, argsTypes, environment,
    );

    if (func === undefined) {
      throw new Error(Report.error({
        message:
          `Function '${call.functionName}' of class '${objectClass.name}' `
          + `cannot be applied to '(${argsTypes.join(',')})'.`,
        pos: {
          line: call.line,
          column: call.column,
        },
      }));
    }

    if (func.isPrivate && !(call.object === undefined || call.object.isThis())) {
      throw new Error(Report.error({
        message: `Function '${call.functionName}' of class '${objectClass.name}' is private.`,
        pos: {
          line: call.line,
          column: call.column,
        },
      }));
    }

    call.expressionType = func.returnType;
  }

  static typeCheckIfElse(environment: TypeEnvironment, ifElse: IfElse) {
    this.typeCheck(environment, ifElse.condition);

    if (ifElse.condition.expressionType !== Types.Bool) {
      throw new Error(Report.error({
        message:
          'Condition of the if/else expression evaluates to a value of type '
          + `'${ifElse.condition.expressionType}', must evaluate to a boolean value.`,
        pos: {
          line: ifElse.condition.line,
          column: ifElse.condition.column,
        },
      }));
    }

    this.typeCheck(environment, ifElse.thenBranch);

    if (ifElse.elseBranch === undefined) {
      ifElse.expressionType = Types.Void;
    } else {
      this.typeCheck(environment, ifElse.elseBranch);
      ifElse.expressionType = TypesUtils.leastUpperBound(
        ifElse.thenBranch.expressionType!,
        ifElse.elseBranch.expressionType!,
        environment,
      );
    }
  }

  static typeCheckInitialization(environment: TypeEnvironment, init: Initialization) {
    const symbolTable = environment.symbolTable;

    if (symbolTable.check(init.identifier)) {
      throw new Error(Report.error({
        message: `Duplicate identifier '${init.identifier}' in let binding.`,
        pos: {
          line: init.line,
          column: init.column,
        },
      }));
    }

    const symbol = new Symbol(init.identifier, init.type!, init.line, init.column);

    if (init.value === undefined) {
      init.expressionType = init.type;
    } else {
      this.typeCheck(environment, init.value);
      const valueType = init.value.expressionType;
      if (init.type === undefined) {
        init.type = valueType;
      } else if (!TypesUtils.conform(valueType!, init.type, environment)) {
        throw new Error(Report.error({
          message: `Assigned value to variable '${init.identifier}' of type '${valueType}'`
            + ` does not conform to its declared type '${init.type}'.`,
          pos: {
            line: init.line,
            column: init.column,
          },
        }));
      }
      init.expressionType = valueType;
    }

    symbol.type = init.expressionType!;
    symbolTable.add(symbol);
  }

  static typeCheckIntegerLiteral(integer: IntegerLiteral) {
    integer.expressionType = Types.Int;
  }

  static typeCheckLet(environment: TypeEnvironment, letExpr: Let) {
    environment.symbolTable.enterScope();
    letExpr.initializations.forEach((init) => {
      this.typeCheckInitialization(environment, init);
    });

    this.typeCheck(environment, letExpr.body);
    letExpr.expressionType = letExpr.body.expressionType;
    environment.symbolTable.exitScope();
  }

  static typeCheckNullLiteral(nullExpr: NullLiteral) {
    nullExpr.expressionType = Types.Null;
  }

  static typeCheckProgram(environment: TypeEnvironment, program: Program) {
    const currentClass = environment.currentClass;

    program.classes.forEach((klass) => {
      if (environment.hasClass(klass.name)) {
        throw new Error(
          `Class '${klass.name}' at ${klass.line + 1}:${klass.column + 1} is already defined.`,
        );
      }

      environment.addClass(klass);
    });

    program.classes.forEach((klass) => {
      environment.currentClass = klass;

      TypeChecker.typeCheck(environment, klass);
    });

    environment.currentClass = currentClass;
  }

  static typeCheckProperty(environment: TypeEnvironment, property: Property) {
    const symbolTable = environment.symbolTable;

    if (symbolTable.check(property.name)) {
      throw new Error(Report.error({
        message: `An instance variable named '${property.name}' is already in scope.`,
        pos: {
          line: property.line,
          column: property.column,
        },
      }));
    }

    if (property.value !== undefined) {
      this.typeCheck(environment, property.value);

      if (property.type === undefined) {
        property.type = property.value.expressionType;
      } else if (!TypesUtils.conform(property.value.expressionType!, property.type, environment)) {
        throw new Error(Report.error({
          message:
            `Value of type '${property.value.expressionType}' cannot be assigned to variable `
            + `'${property.name}' of type '${property.type}'.`,
          pos: {
            line: property.line,
            column: property.column,
          },
        }));
      }
    }

    symbolTable.add(new Symbol(property.name, property.type!, property.line, property.column));
  }

  static typeCheckReference(environment: TypeEnvironment, reference: Reference) {
    const symbol = environment.symbolTable.find(reference.identifier);

    if (symbol !== undefined) {
      reference.expressionType = symbol.type;
    } else if (environment.currentClass!.hasProperty(reference.identifier)) {
      // @ts-ignore
      reference.expressionType = environment.currentClass.getProperty(reference.identifier).type;
    } else {
      throw new Error(Report.error({
        message: `Reference to an undefined identifier '${reference.identifier}'.`,
        pos: {
          line: reference.line,
          column: reference.column,
        },
      }));
    }
  }

  static typeCheckStringLiteral(string: StringLiteral) {
    string.expressionType = Types.String;
  }

  static typeCheckSuperFunctionCall(environment: TypeEnvironment, superCall: SuperFunctionCall) {
    const currentClass = environment.currentClass;
    environment.currentClass = environment.getClass(currentClass!.superClass)!;

    const call = new FunctionCall(superCall.functionName, superCall.args, undefined);
    call.line = superCall.line;
    call.column = superCall.column;

    this.typeCheckFunctionCall(environment, call);

    superCall.expressionType = call.expressionType;
    environment.currentClass = currentClass;
  }

  static typeCheckThis(environment: TypeEnvironment, thisExpr: This) {
    thisExpr.expressionType = environment.currentClass?.name;
  }

  static typeCheckUnaryExpression(environment: TypeEnvironment, expression: UnaryExpression) {
    const funcCall = new FunctionCall(`unary_${expression.operator}`, [], expression.expression);

    funcCall.line = expression.line;
    funcCall.column = expression.column;

    this.typeCheckFunctionCall(environment, funcCall);
    expression.expressionType = funcCall.expressionType;
  }

  static typeCheckWhile(environment: TypeEnvironment, whileExpr: While) {
    this.typeCheck(environment, whileExpr.condition);

    if (whileExpr.condition.expressionType !== Types.Bool) {
      throw new Error(Report.error({
        message: 'Condition of a while loop evaluates to a value of type ' +
          `'${whileExpr.condition.expressionType}',must evaluate to a boolean value.`,
        pos: {
          line: whileExpr.condition.line,
          column: whileExpr.condition.column,
        },
      }));
    }

    this.typeCheck(environment, whileExpr.body);
    whileExpr.expressionType = Types.Void;
  }
}
