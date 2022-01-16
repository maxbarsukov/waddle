import { Class, Function } from '../ast';
import SymbolTable from './SymbolTable';
import Env from '../interfaces/Env';

export default class TypeEnvironment implements Env {
  classes: Map<string, Class>;
  symbolTable: SymbolTable;
  functions: Map<string, Function[]>;
  currentClass: Class | null;

  constructor() {
    this.classes = new Map<string, Class>();
    this.symbolTable = new SymbolTable();
    this.functions = new Map<string, Function[]>();
    this.currentClass = null;
  }

  addClass(klass: Class) {
    this.classes.set(klass.name, klass);
    this.functions.set(klass.name, []);
  }

  hasClass(className: string) {
    return this.classes.has(className);
  }

  getClass(className: string) {
    return this.classes.get(className)!;
  }

  removeClass(className: string) {
    return this.classes.delete(className);
  }

  addFunction(className: string, func: Function) {
    this.functions.get(className)!.push(func);
  }

  hasFunction(className: string, func: Function) {
    return this.functions.get(className)!.some((m: Function) => m.equals(func));
  }

  getFunction(className: string, functionName: string) {
    return this.functions.get(className)!.find((func: Function) => func.name === functionName);
  }

  conform(classNameA: string, classNameB: string) {
    const classA = this.getClass(classNameA);
    let classB = this.getClass(classNameB);

    do {
      if (classA.superClass !== 'NO_SUPER_CLASS' && classA.superClass === classB.name) return true;
      classB = this.getClass(classB.superClass);
    } while (classB !== undefined);

    return false;
  }
}
