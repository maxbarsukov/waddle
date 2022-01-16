import TypeChecker from '../TypeChecker';
import TypeEnvironment from '../TypeEnvironment';
import getRuntime from '../../interpreter/runtime';

import {
  Block,
  Class,
  Expression,
  IntegerLiteral,
  Program,
  Property,
  Reference,
  StringLiteral,
  This,
  While,
} from '../../ast';
import { Types } from '../../types/Types';
import Symbol from '../Symbol';

describe('TypeChecker', () => {
  const typeEnv = new TypeEnvironment();

  const runtimeClasses = getRuntime();
  runtimeClasses.forEach(cls => {
    typeEnv.addClass(cls);
  });

  beforeEach(() => {
    typeEnv.symbolTable.clear();
  });

  it('#typeCheckWhile', () => {
    const expr = new While(new Expression(), new Expression());
    const t = () => TypeChecker.typeCheckWhile(typeEnv, expr);
    expect(t).toThrow(Error);
  });

  it('#typeCheckThis', () => {
    const expr = new This();
    TypeChecker.typeCheckThis(typeEnv, expr);
    expect(expr.expressionType).toBe(typeEnv.currentClass?.name);
  });

  describe('#typeCheckReference', () => {
    it('should typecheck ref with symbol', () => {
      const reference = new Reference('a');
      typeEnv.symbolTable.enterScope();
      typeEnv.symbolTable.add(new Symbol('a', Types.String));
      TypeChecker.typeCheckReference(typeEnv, reference);
      expect(reference.expressionType).toBe(Types.String);
      typeEnv.symbolTable.exitScope();
    });

    it('should typecheck ref with current class', () => {
      const reference = new Reference('a');
      const klass = new Class('A');
      klass.properties.push(
        new Property('a', Types.String, new StringLiteral('"hello"')),
      );
      typeEnv.currentClass = klass;
      TypeChecker.typeCheckReference(typeEnv, reference);
      expect(reference.expressionType).toBe(Types.String);
    });

    it('should throw error without prop in current class', () => {
      const reference = new Reference('a');
      typeEnv.currentClass = new Class('A');
      const t = () => TypeChecker.typeCheckReference(typeEnv, reference);
      expect(t).toThrow(Error);
    });
  });

  describe('#typeCheckProperty', () => {
    const klass = new Class('A');
    klass.properties.push(
      new Property('a', Types.String, new StringLiteral('"hello"')),
      new Property('b', Types.Int, new IntegerLiteral('42')),
    );
    typeEnv.currentClass = klass;

    it('should throw error if sym already in table', () => {
      const property = new Property('n', Types.String, undefined);
      typeEnv.symbolTable.enterScope();
      typeEnv.symbolTable.add(new Symbol('n', Types.String));
      const t = () => TypeChecker.typeCheckProperty(typeEnv, property);
      expect(t).toThrow(Error);
      typeEnv.symbolTable.exitScope();
    });

    it('should throw error if type mismatching', () => {
      const expr = new Block();
      expr.expressionType = Types.String;
      const property = new Property('n', Types.String, expr);

      typeEnv.symbolTable.enterScope();

      const t = () => TypeChecker.typeCheckProperty(typeEnv, property);
      expect(t).toThrow(Error);

      typeEnv.symbolTable.exitScope();
    });

    it('should update property type', () => {
      const expr = new StringLiteral('"Hi!"');
      expr.expressionType = Types.String;
      const property = new Property('n', undefined, expr);

      typeEnv.symbolTable.enterScope();

      TypeChecker.typeCheckProperty(typeEnv, property);
      expect(property.type).toBe(Types.String);

      typeEnv.symbolTable.exitScope();
    });
  });

  describe('#typeCheckProgram', () => {
    const klass = new Class('A');
    klass.properties.push(
      new Property('a', Types.String, new StringLiteral('"hello"')),
      new Property('b', Types.Int, new IntegerLiteral('42')),
    );
    typeEnv.currentClass = klass;

    it('should throw error if class already defined', () => {
      const program = new Program([new Class('B')]);
      typeEnv.addClass(new Class('B'));

      const t = () => TypeChecker.typeCheckProgram(typeEnv, program);
      expect(t).toThrow(Error);
    });

    it('should add class if not defined', () => {
      const program = new Program([new Class('Bb')]);
      typeEnv.addClass(new Class('Cc'));

      TypeChecker.typeCheckProgram(typeEnv, program);
      expect(typeEnv.hasClass('Bb')).toBe(true);
    });
  });
});
