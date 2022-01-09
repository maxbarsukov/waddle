import {
  Assignment,
  BinaryExpression,
  Block,
  BooleanLiteral,
  Cast,
  Class,
  ConstructorCall,
  DecimalLiteral,
  Expression,
  Formal,
  Function,
  FunctionCall,
  IfElse,
  Initialization,
  IntegerLiteral,
  Let,
  NullLiteral,
  Program,
  Property,
  Reference,
  StringLiteral,
  SuperFunctionCall,
  This,
  UnaryExpression,
  While,
} from '../ast';

import Token from '../lexer/Token';
import TokenType from '../lexer/TokenType';
import Type, { Types } from '../types/Types';

import Lexer from '../lexer';
import Report from '../utils/Report';

export default class Parser {
  lexer: Lexer;
  currentToken: Token;

  constructor(input: string) {
    this.lexer = new Lexer(input);
    this.currentToken = this.lexer.nextToken();
  }

  expect(tokenType: Type) {
    if (tokenType !== TokenType.Newline) {
      this.discardNewlines();
    }

    const token = new Token(
      this.currentToken.type,
      this.currentToken.value,
      { line: this.currentToken.pos.line, column: this.currentToken.pos.column },
    );
    if (tokenType !== TokenType.EndOfInput && token.type === TokenType.EndOfInput) {
      throw new Error(Report.error({
        message: `Expected '${tokenType}' but reached end of input.`,
        pos: token.pos,
      }));
    }

    if (token.type !== tokenType) {
      throw new Error(Report.error({
        message: `Expected '${tokenType}' but found '${token.value}'.`,
        pos: token.pos,
      }));
    }

    this.currentToken = this.lexer.nextToken();
    return token;
  }

  parseValue(): Expression {
    const token = this.currentToken;

    if (this.accept(TokenType.EndOfInput)) {
      throw new Error(Report.error({
        message: 'Unexpected end of input.',
        pos: {
          line: token.pos.line,
          column: token.pos.column,
        },
      }));
    }

    let value: Expression | undefined;

    if (this.accept(TokenType.Integer)) {
      value = new IntegerLiteral(this.expect(TokenType.Integer).value);
    } else if (this.accept(TokenType.Decimal)) {
      value = new DecimalLiteral(this.expect(TokenType.Decimal).value);
    } else if (this.accept(TokenType.String)) {
      value = new StringLiteral(this.expect(TokenType.String).value);
    } else if (this.accept(TokenType.Null)) {
      value = this.parseNull();
    } else if (this.accept(TokenType.True) || this.accept(TokenType.False)) {
      value = new BooleanLiteral(this.currentToken.value);
      this.currentToken = this.lexer.nextToken();
    } else if (this.accept(TokenType.If)) {
      value = this.parseIfElse();
    } else if (this.accept(TokenType.While)) {
      value = this.parseWhile();
    } else if (this.accept(TokenType.Let)) {
      value = this.parseLet();
    } else if (this.accept(TokenType.LeftBrace)) {
      value = this.parseBlock();
    } else if (this.accept(TokenType.New)) {
      value = this.parseConstructorCall();
    } else if (this.accept(TokenType.This)) {
      value = this.parseThis();
    } else if (this.accept(TokenType.Super)) {
      value = this.parseSuperFunctionCall();
    } else if (this.acceptUnaryOperator()) {
      const operator = this.currentToken.value;
      this.currentToken = this.lexer.nextToken();
      value = new UnaryExpression(operator, this.parseValue());
    } else if (this.accept(TokenType.Not)) {
      value = new UnaryExpression(this.expect(TokenType.Not).value, this.parseExpression());
    } else if (this.accept(TokenType.Minus)) {
      value = new UnaryExpression(this.expect(TokenType.Minus).value, this.parseExpression());
    } else if (this.accept(TokenType.LeftParen)) {
      this.expect(TokenType.LeftParen);
      value = this.parseExpression();
      this.expect(TokenType.RightParen);
    } else if (this.accept(TokenType.Identifier)) {
      const lookahead = this.lexer.lookahead();
      if (lookahead.type === TokenType.Equal || lookahead.type === TokenType.PlusEqual
        || lookahead.type === TokenType.MinusEqual || lookahead.type === TokenType.TimesEqual
        || lookahead.type === TokenType.DivEqual || lookahead.type === TokenType.ModuloEqual) {
        value = this.parseAssignment();
      } else if (lookahead.type === TokenType.LeftParen) {
        value = this.parseFunctionCall();
      } else {
        value = new Reference(this.expect(TokenType.Identifier).value);
      }
    }

    if (value === undefined) {
      throw new Error(
        `Unexpected '${token.value}' at ${token.pos.line + 1}:${token.pos.column + 1}.`,
      );
    }

    value.line = token.pos.line;
    value.column = token.pos.column;

    return value;
  }

  parseCast() {
    let expression = this.parseBooleanExpression();
    if (this.acceptCastOperator()) {
      while (this.acceptCastOperator()) {
        this.expect(TokenType.As);
        const object = expression;
        const type = this.expect(TokenType.Identifier).value;
        expression = new Cast(object, type);
      }
    }
    return expression;
  }

  parseDispatch() {
    let expression = this.parseValue();
    while (this.accept(TokenType.Dot)) {
      this.expect(TokenType.Dot);
      const call = this.parseFunctionCall();
      call.object = expression;
      expression = call;
    }
    return expression;
  }

  parseBinaryExpression(
    acceptOperatorFunction: () => boolean,
    parseBranchFunction: () => Expression,
  ) {
    let expression = parseBranchFunction.apply(this);
    if (acceptOperatorFunction.apply(this)) {
      while (acceptOperatorFunction.apply(this)) {
        const operator = this.currentToken.value;

        this.currentToken = this.lexer.nextToken();

        const left = expression;
        const right = parseBranchFunction.apply(this);
        expression = new BinaryExpression(left, operator, right);
      }
    }
    return expression;
  }

  parseDefinition() {
    const token = this.currentToken;
    let definition = null;

    if (this.accept(TokenType.Class)) definition = this.parseClass();
    if (this.accept(TokenType.Override)
      || this.accept(TokenType.Def)
    ) definition = this.parseFunction();
    if (definition === null) {
      throw new Error(Report.error({
        message: `Unexpected '${token.type}'.`,
        pos: {
          line: token.pos.line,
          column: token.pos.column,
        },
      }));
    }
    return definition;
  }

  parseBlock() {
    this.expect(TokenType.LeftBrace);

    const expressions: Expression[] = [];
    while (!this.accept(TokenType.RightBrace)) {
      expressions.push(this.parseExpression());
    }
    const block = new Block(expressions);

    this.expect(TokenType.RightBrace);
    return block;
  }

  parseClass() {
    const classToken = this.expect(TokenType.Class);
    const name = this.expect(TokenType.Identifier).value;

    let parameters: Formal[] = [];
    let superClass: Type | undefined;
    let superClassArgs: Expression[] = [];

    if (this.accept(TokenType.LeftParen)) {
      parameters = this.parseFormals();
    }

    if (!this.accept(TokenType.Extends)) {
      superClass = Types.Object;
    } else {
      this.expect(TokenType.Extends);
      superClass = this.expect(TokenType.Identifier).value;
      if (this.accept(TokenType.LeftParen)) superClassArgs = this.parseActuals();
    }

    const klass = new Class(
      name,
      parameters,
      superClass,
      superClassArgs,
    );
    this.parseClassBody(klass);

    klass.line = classToken.pos.line;
    klass.column = classToken.pos.column;

    return klass;
  }

  parseClassBody(klass: Class) {
    this.expect(TokenType.LeftBrace);

    do {
      if (this.accept(TokenType.RightBrace)) break;
      if (this.accept(TokenType.Var)) {
        klass.properties.push(this.parseProperty());
      } else if (
        this.accept(TokenType.Def)
        || this.accept(TokenType.Private)
        || this.accept(TokenType.Override)
      ) {
        klass.functions.push(this.parseFunction());
      } else if (this.accept(TokenType.EndOfInput)) {
        throw new Error(Report.error({
          message: 'Unexpected end of input.',
          pos: {
            line: this.currentToken.pos.line,
            column: this.currentToken.pos.column,
          },
        }));
      } else {
        throw new Error(Report.error({
          message: `Unexpected token '${this.currentToken.value}'.`,
          pos: {
            line: this.currentToken.pos.line,
            column: this.currentToken.pos.column,
          },
        }));
      }
    } while (!this.accept(TokenType.RightBrace) && !this.accept(TokenType.EndOfInput));
    this.expect(TokenType.RightBrace);
  }

  parseBooleanExpression() {
    return this.parseBinaryExpression(this.acceptBooleanOperator, this.parseComparison);
  }

  parseActuals() {
    this.expect(TokenType.LeftParen);

    const actuals: Expression[] = [];
    if (!this.accept(TokenType.RightParen)) {
      do {
        if (this.accept(TokenType.Comma)) this.expect(TokenType.Comma);
        actuals.push(this.parseExpression());
      } while (this.accept(TokenType.Comma));
    }

    this.expect(TokenType.RightParen);
    return actuals;
  }

  parseIfElse() {
    this.expect(TokenType.If);
    this.expect(TokenType.LeftParen);

    const condition = this.parseExpression();

    this.expect(TokenType.RightParen);

    const thenBranch = this.parseExpression();

    let elseBranch;
    if (this.accept(TokenType.Else)) {
      this.expect(TokenType.Else);
      elseBranch = this.parseExpression();
    }

    return new IfElse(condition, thenBranch, elseBranch);
  }

  parseInitializations() {
    const initializations: Initialization[] = [];

    do {
      if (this.accept(TokenType.Comma)) {
        this.expect(TokenType.Comma);
      }

      const token = this.expect(TokenType.Identifier);

      const identifier = token.value;
      let type;
      let value;

      if (this.accept(TokenType.Colon)) {
        this.expect(TokenType.Colon);
        type = this.expect(TokenType.Identifier).value;
      }

      if (this.accept(TokenType.Equal)) {
        this.expect(TokenType.Equal);
        value = this.parseExpression();
      }

      const initialization = new Initialization(identifier, type, value);
      initialization.line = token.pos.line;
      initialization.column = token.pos.column;

      initializations.push(initialization);
    } while (this.accept(TokenType.Comma));

    return initializations;
  }

  parseLet() {
    this.expect(TokenType.Let);

    const initializations = this.parseInitializations();

    this.expect(TokenType.In);

    const body = this.parseExpression();
    return new Let(initializations, body);
  }

  parseFunction() {
    let overrideToken = null;
    let privateToken = null;

    let override = false;
    let isPrivate = false;

    if (this.accept(TokenType.Override)) {
      overrideToken = this.expect(TokenType.Override);
      override = true;
    } else if (this.accept(TokenType.Private)) {
      privateToken = this.expect(TokenType.Private);
      isPrivate = true;
    }

    const funcToken = this.expect(TokenType.Def);

    let line; let
      column;
    if (privateToken) {
      line = privateToken.pos.line;
      column = privateToken.pos.column;
    } else {
      line = overrideToken ? overrideToken.pos.line : funcToken.pos.line;
      column = overrideToken ? overrideToken.pos.column : funcToken.pos.column;
    }

    let name;
    if (this.accept(TokenType.Identifier)) {
      name = this.expect(TokenType.Identifier).value;
    } else if (this.acceptOperator()) {
      name = this.currentToken.value;
      this.currentToken = this.lexer.nextToken();
    } else {
      throw new Error(Report.error({
        message:
          `Expected identifier or operator as method name, but found '${this.currentToken.value}'.`,
        pos: {
          line,
          column,
        },
      }));
    }

    const parameters = this.parseFormals();
    let returnType: Type;

    if (!this.accept(TokenType.Colon)) {
      returnType = Types.Void;
    } else {
      this.expect(TokenType.Colon);
      returnType = this.expect(TokenType.Identifier).value;
    }

    this.expect(TokenType.Equal);
    const body = this.parseExpression();

    const func = new Function(name, returnType, body, parameters, override, isPrivate);
    func.line = line;
    func.column = column;
    return func;
  }

  parseFunctionCall() {
    let token;

    if (this.accept(TokenType.Identifier)) {
      token = this.expect(TokenType.Identifier);
    } else {
      token = this.currentToken;
      this.currentToken = this.lexer.nextToken();
    }

    const functionName = token.value;

    const line = token.pos.line;
    const column = token.pos.column;

    const args = this.parseActuals();
    const functionCall = new FunctionCall(functionName, args);

    functionCall.line = line;
    functionCall.column = column;
    return functionCall;
  }

  parseProperty() {
    const varToken = this.expect(TokenType.Var);

    const name = this.expect(TokenType.Identifier).value;
    let type;
    let value;

    if (this.accept(TokenType.Colon)) {
      this.expect(TokenType.Colon);
      type = this.expect(TokenType.Identifier).value;
    }

    if (this.accept(TokenType.Equal)) {
      this.expect(TokenType.Equal);
      value = this.parseExpression();
    }

    const property = new Property(name, type, value);

    property.line = varToken.pos.line;
    property.column = varToken.pos.column;

    return property;
  }

  parseFormals() {
    this.expect(TokenType.LeftParen);

    const formals: Formal[] = [];
    if (!this.accept(TokenType.RightParen)) {
      do {
        if (this.accept(TokenType.Comma)) {
          this.expect(TokenType.Comma);
        }

        let lazy = false;
        if (this.accept(TokenType.Lazy)) {
          this.expect(TokenType.Lazy);
          lazy = true;
        }

        const nameToken = this.expect(TokenType.Identifier);

        this.expect(TokenType.Colon);
        const type = this.expect(TokenType.Identifier).value;

        formals.push(
          new Formal(nameToken.value, type, lazy, nameToken.pos.line, nameToken.pos.column),
        );
      } while (this.accept(TokenType.Comma));
    }

    this.expect(TokenType.RightParen);
    return formals;
  }

  parseProgram() {
    const program = new Program();
    while (!this.accept(TokenType.EndOfInput)) {
      program.classes.push(this.parseClass());
    }
    return program;
  }

  parseAssignment() {
    const identifier = this.expect(TokenType.Identifier).value;
    const operator = this.currentToken.value;

    this.currentToken = this.lexer.nextToken();
    const value = this.parseExpression();
    return new Assignment(identifier, operator, value);
  }

  parseWhile() {
    this.expect(TokenType.While);
    this.expect(TokenType.LeftParen);

    const condition = this.parseExpression();

    this.expect(TokenType.RightParen);

    const body = this.parseExpression();
    return new While(condition, body);
  }

  parseSuperFunctionCall() {
    this.expect(TokenType.Super);
    this.expect(TokenType.Dot);

    const call = this.parseFunctionCall();
    return new SuperFunctionCall(call.functionName, call.args);
  }

  parseConstructorCall() {
    this.expect(TokenType.New);

    const type = this.expect(TokenType.Identifier).value;
    const args = this.parseActuals();

    return new ConstructorCall(type, args);
  }

  parseThis() {
    this.expect(TokenType.This);
    return new This();
  }

  parseNull() {
    this.expect(TokenType.Null);
    return new NullLiteral();
  }

  parseExpression() {
    return this.parseCast();
  }

  parseComparison() {
    return this.parseBinaryExpression(this.acceptComparisonOperator, this.parseAddition);
  }

  parseAddition() {
    return this.parseBinaryExpression(this.acceptAdditiveOperator, this.parseMultiplication);
  }

  parseMultiplication() {
    return this.parseBinaryExpression(this.acceptMultiplicativeOperator, this.parseDispatch);
  }

  accept(tokenType: Type) {
    if (tokenType !== TokenType.Newline) {
      this.discardNewlines();
    }

    if (tokenType !== TokenType.EndOfInput && this.currentToken.type === TokenType.EndOfInput) {
      return false;
    }

    return this.currentToken.type === tokenType;
  }

  acceptOperator() {
    return this.acceptAdditiveOperator() || this.acceptComparisonOperator()
      || this.acceptMultiplicativeOperator() || this.acceptBooleanOperator()
      || this.acceptOtherOperator();
  }

  acceptCastOperator() {
    return this.accept(TokenType.As);
  }

  acceptAdditiveOperator() {
    return this.acceptOneOf(TokenType.Plus, TokenType.Minus);
  }

  acceptMultiplicativeOperator() {
    return this.acceptOneOf(TokenType.Times, TokenType.Div, TokenType.Modulo);
  }

  acceptComparisonOperator() {
    return this.acceptOneOf(
      TokenType.Less,
      TokenType.LessOrEqual,
      TokenType.Greater,
      TokenType.GreaterOrEqual,
      TokenType.DoubleEqual,
      TokenType.NotEqual,
    );
  }

  acceptBooleanOperator() {
    return this.acceptOneOf(TokenType.And, TokenType.Or, TokenType.DoubleEqual, TokenType.NotEqual);
  }

  acceptAssignmentOperator() {
    return this.acceptOneOf(
      TokenType.Equal,
      TokenType.PlusEqual,
      TokenType.MinusEqual,
      TokenType.TimesEqual,
      TokenType.DivEqual,
      TokenType.ModuloEqual);
  }

  acceptUnaryOperator() {
    return this.acceptOneOf(
      TokenType.Plus,
      TokenType.Minus,
      TokenType.Times,
      TokenType.Div,
      TokenType.Modulo,
      TokenType.Tilde,
      TokenType.Dollar,
      TokenType.Caret,
    );
  }

  acceptOtherOperator() {
    return this.acceptOneOf(
      TokenType.Tilde,
      TokenType.TildeEqual,
      TokenType.Dollar,
      TokenType.DollarEqual,
      TokenType.Caret,
      TokenType.CaretEqual,
    );
  }

  acceptOneOf(...tokenTypes: Type[]) {
    if (tokenTypes.indexOf(TokenType.Newline) < 0) this.discardNewlines();

    const type = this.currentToken.type;
    if (type === TokenType.EndOfInput) {
      return false;
    }

    return tokenTypes.indexOf(type) >= 0;
  }

  discardNewlines() {
    while (this.currentToken.type === TokenType.Newline) {
      this.currentToken = this.lexer.nextToken();
    }
  }
}
