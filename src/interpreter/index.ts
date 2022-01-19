import fs from 'fs';
import path from 'path';

import * as process from 'process';
import * as readline from 'readline';

import {
  FunctionCall,
  Program,
  Reference,
  Assignment,
  Import,
  Class,
} from '../ast';

import getRuntime, {
  IOClass,
  MathClass,
  PredefClass,
} from './runtime';

import Lexer from '../lexer';
import TokenType from '../lexer/TokenType';
import Parser from '../parser';

import { Types } from '../types/Types';

import Obj from './Obj';
import Context from './Context';
import Evaluator from './Evaluator';

import Symbol from '../semantic/Symbol';
import TypeChecker from '../semantic/TypeChecker';
import TypeEnvironment from '../semantic/TypeEnvironment';
import Report from '../utils/Report';

export default class Interpreter {
  typeEnvironment: TypeEnvironment;
  context: Context;

  predefClass: PredefClass;
  mathClass: MathClass;
  ioClass: IOClass;

  predef: Obj;
  math: Obj;
  io: Obj;

  res: number;
  DEFAULT_PROMPT = '> ';

  constructor() {
    this.typeEnvironment = new TypeEnvironment();
    this.context = new Context();

    this.predefClass = new PredefClass();
    this.mathClass = new MathClass();
    this.ioClass = new IOClass();

    this.typeEnvironment.currentClass = this.predefClass;

    [this.predefClass, this.mathClass, this.ioClass].forEach(cl => {
      this.typeEnvironment.addClass(cl);
      this.context.addClass(cl);
    });

    this.loadClasses();

    this.predef = Obj.create(this.context, Types.Predef);
    this.math = Obj.create(this.context, Types.Math);
    this.io = Obj.create(this.context, Types.IO);

    this.context.self = this.predef;

    this.typeEnvironment.symbolTable.enterScope();
    this.typeEnvironment.symbolTable.add(new Symbol('Math', Types.Math));
    this.typeEnvironment.symbolTable.add(new Symbol('IO', Types.IO));

    this.context.environment.enterScope();
    this.context.environment.add('Math', this.context.store.alloc(this.math));
    this.context.environment.add('IO', this.context.store.alloc(this.io));

    this.res = 0;
  }

  run(filePath: fs.PathOrFileDescriptor) {
    const source = fs.readFileSync(filePath, 'utf-8');
    let prev = ' ';
    let input = '';

    source.split('\n').forEach(line => {
      line = line.trim();
      if (line === '' && prev === '') {
        prev = ' ';
        input = '';
      } else {
        prev = line;
        input += line;
        try {
          if (!this.tryParse(input)) {
            input += '\n';
          } else {
            this.execute(input);
            input = '';
          }
        } catch (e) {
          // @ts-ignore
          console.log(`error: ${e.message}\n`);
          input = '';
        }
      }
    });
  }

  repl() {
    console.log(`waddle v${process.env.npm_package_version || '1.0.0'}`);
    console.log(':quit or Ctrl-C to quit.\n');

    let prev = ' ';
    let input = '';

    const scanner = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    scanner.setPrompt(this.DEFAULT_PROMPT);
    scanner.prompt();

    scanner.on('line', (line) => {
      line = line.trim();

      if (line === ':quit') {
        scanner.close();
        process.exit();
      } else if (line.startsWith(':load')) {
        this.runLoadCommand(line, scanner);
      } else {
        if (line === '' && prev === '') {
          prev = ' ';
          input = '';
          scanner.setPrompt(this.DEFAULT_PROMPT);
        } else {
          prev = line;
          input += line;

          try {
            if (!this.tryParse(input)) {
              input += '\n';
              scanner.setPrompt('    | ');
            } else {
              console.log(`${this.execute(input)}\n`);
              input = '';
              scanner.setPrompt(this.DEFAULT_PROMPT);
            }
          } catch (e) {
            // @ts-ignore
            console.log(`error: ${e.message}\n`);
            input = '';
            scanner.setPrompt(this.DEFAULT_PROMPT);
          }
        }

        scanner.prompt();
      }
    });

    scanner.on('close', () => {
      console.log('Bye!');
    });
  }

  execute(input: string) {
    const lexer = new Lexer(input);
    let token = lexer.nextToken();

    while (token.type === TokenType.Newline) {
      token = lexer.nextToken();
    }

    switch (token.type) {
      case TokenType.Class:
        return this.injectClass(input);
      case TokenType.Var:
        return this.injectProperty(input);
      case TokenType.Import:
        return this.injectImport(input);
      case TokenType.Def:
        return this.injectFunction(input);
      default:
        return this.evaluateExpression(input);
    }
  }

  evaluateExpression(input: string) {
    const parser = new Parser(input);
    const expression = parser.parseExpression();

    TypeChecker.typeCheck(this.typeEnvironment, expression);

    let value = Evaluator.evaluate(this.context, expression);
    let identifier;

    if (expression.isReference()) {
      identifier = (expression as Reference).identifier;
    } else if (expression.isAssignment()) {
      identifier = (expression as Assignment).identifier;
      value = this.context.self!.get(identifier);
    } else {
      identifier = `res${this.res++}`;
      this.typeEnvironment.symbolTable.add(new Symbol(identifier, value.type!));
      const address = this.context.store.alloc(value);
      this.context.environment.add(identifier, address);
    }

    if (value.type === Types.String) {
      return `${identifier}: ${value.type} = "${value.get('value')}"`;
    }

    const call = new FunctionCall('toString', [], new Reference(identifier));

    call.object!.expressionType = value.type;
    call.expressionType = Types.String;

    const res = Evaluator.evaluate(this.context, call);
    return value.type === Types.Void ? '' : `${identifier}: ${value.type} = ${res.get('value')}`;
  }

  injectClass(input: string) {
    const parser = new Parser(input);
    const klass = parser.parseClass();
    this.typeEnvironment.addClass(klass);

    try {
      TypeChecker.typeCheckClass(this.typeEnvironment, klass);
    } catch (e) {
      this.typeEnvironment.removeClass(klass.name);
      throw e;
    }

    this.context.addClass(klass);
    return `defined class ${klass.name}`;
  }

  injectImport(input: string) {
    const parser = new Parser(input);
    const imp = parser.parseImport();
    const classes = this.getClassesFromImport(imp);

    classes.forEach(klass => {
      this.typeEnvironment.addClass(klass);

      try {
        TypeChecker.typeCheckClass(this.typeEnvironment, klass);
      } catch (e) {
        this.typeEnvironment.removeClass(klass.name);
        throw e;
      }

      this.context.addClass(klass);
    });

    return `imported classes ${classes.map(kl => kl.name).join(', ')}`;
  }

  injectProperty(input: string) {
    const parser = new Parser(input);
    const property = parser.parseProperty();

    const index = this.predefClass
      .properties
      .findIndex((variable) => variable.name === property.name);
    if (index !== -1) {
      this.predefClass.properties.splice(index, 1);
    }

    TypeChecker.typeCheckProperty(this.typeEnvironment, property);
    this.predefClass.properties.push(property);
    const value = Evaluator.evaluateProperty(this.context, property);
    // @ts-ignore
    value.address = 'this';
    this.predef.properties.set(property.name, value);

    const call = new FunctionCall('toString', [], new Reference(property.name));
    const res = Evaluator.evaluate(this.context, call);

    return `${property.name}: ${property.type} = ${res.get('value')}`;
  }

  injectFunction(input: string) {
    const parser = new Parser(input);
    const func = parser.parseFunction();

    let index = this.predefClass.functions.findIndex((f) => func.equals(f));
    if (index !== -1) {
      this.predefClass.functions.splice(index, 1);
    }

    index = this.predef.functions.findIndex((f) => func.equals(f));
    if (index !== -1) {
      this.predef.functions.splice(index, 1);
    }

    this.predefClass.functions.push(func);
    this.predef.functions.push(func);

    TypeChecker.typeCheckFunction(this.typeEnvironment, func);
    return func.signature();
  }

  runLoadCommand(cmd: string, scanner: readline.Interface) {
    const args = cmd.split(/\s+/);
    const count = args.length;

    if (count <= 1) {
      console.log('error: no file provided.');
      console.log();
    } else {
      try {
        const program = new Program();

        for (let i = 1; i < count; ++i) {
          program.classes = program.classes.concat(this.loadFile(args[i]).classes);
        }

        TypeChecker.typeCheckProgram(this.typeEnvironment, program);
        this.typeEnvironment.symbolTable.enterScope();
        program.classes.forEach((klass) => {
          this.context.addClass(klass);
          console.log(`defined class ${klass.name}.`);
        });
      } catch (e) {
        // @ts-ignore
        console.log(`error: ${e.message}`);
      }
      console.log();
    }

    scanner.prompt();
  }

  loadFile(filePath: fs.PathOrFileDescriptor) {
    const parser = new Parser(fs.readFileSync(filePath, 'utf-8'));
    return parser.parseProgram();
  }

  tryParse(input: string) {
    const parser = new Parser(input);

    try {
      if (parser.accept(TokenType.Class)) {
        parser.parseClass();
      } else if (parser.accept(TokenType.Var)) {
        parser.parseProperty();
      } else if (parser.accept(TokenType.Def)) {
        parser.parseFunction();
      } else {
        parser.parseExpression();
      }
      return true;
    } catch (e) {
      // @ts-ignore
      if (e.message.search('end of input.') > 0) {
        return false;
      }
      throw e;
    }
  }

  loadClasses() {
    const classes = getRuntime();
    classes.forEach(cl => {
      this.typeEnvironment.addClass(cl);
      this.context.addClass(cl);
    });
  }

  getClassesFromImport(imp: Import) {
    const files = this.getFilesForImport(imp);
    const importClassNames = imp.classNames;

    const classes: Class[] = [];
    const classNames: string[] = [];
    files.forEach(file => {
      const newClasses = this.loadFile(file).classes.filter(klass => klass.isExported);
      classNames.push(...newClasses.map(klass => klass.name));
      classes.push(...newClasses);
    });

    importClassNames.forEach(className => {
      if (!classNames.includes(className)) {
        throw new Error(Report.error({
          message:
            `No class ${className} exported from ${imp.source}.\nFound: ${classNames.join(', ')}.`,
          pos: {
            line: imp.line,
            column: imp.column,
          },
        }));
      }
    });

    return classes;
  }

  getFilesForImport(imp: Import) {
    const pathElements = imp.source.split('/');

    let filePath;
    if (imp.isBuiltin()) {
      filePath = path.join(__dirname, 'stdlib', ...pathElements);
    } else {
      filePath = path.join(process.cwd(), ...pathElements);
    }

    if (!fs.existsSync(filePath) && !fs.existsSync(`${filePath}.waddle`)) {
      throw new Error(Report.error({
        message: `No such file for import: '${imp.source}' (${filePath}).`,
        pos: {
          line: imp.line,
          column: imp.column,
        },
      }));
    }

    const filePaths: string[] = [];
    let withExt = false;
    try {
      if (fs.lstatSync(filePath)
        .isDirectory()) {
        const files = fs
          .readdirSync(filePath)
          .filter(fileName => fileName.match(/.*\.(waddle?)/ig));
        filePaths.concat(files);
      } else {
        withExt = true;
      }
    } catch {
      withExt = true;
    }

    if (withExt) {
      if (!filePath.endsWith('.waddle')) filePath += '.waddle';
      filePaths.push(filePath);
    }

    return filePaths;
  }
}
