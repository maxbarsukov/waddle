import Type, { Types } from '../types/Types';
import { Class, Formal, Function } from '../ast';
import Context from '../interpreter/Context';

export default class TypesUtils {
  static leastUpperBound(typeA: Type, typeB: Type, context: Context): Type {
    if (typeA === typeB) return typeA;
    if (typeA === Types.Null) return typeB;
    if (typeB === Types.Null) return typeA;

    const classA = context.getClass(typeA);
    const classB = context.getClass(typeB);

    if (classA?.superClass === classB?.superClass) return classA?.superClass;
    if (
      this.inheritanceIndex(typeA, Types.Object, context)
      > this.inheritanceIndex(typeB, Types.Object, context)
    ) {
      return this.leastUpperBound(classA?.superClass, typeB, context);
    }

    return this.leastUpperBound(typeA, classB?.superClass, context);
  }

  static inheritanceIndex(typeA: Type, typeB: Type, context: Context) {
    let index = 0;
    while (typeA !== undefined && typeA !== typeB) {
      index++;
      typeA = context.getClass(typeA).superClass;
    }

    return index;
  }

  static findMethodToApply(klass: Class, name: string, argsTypes: Type[], context: Context) {
    let methods = this.findMethods(klass, name, argsTypes, context);
    if (methods.length === 0) {
      return undefined;
    }

    methods = methods.filter((method) => this.allConform(
      argsTypes, method.parameters.map((param) => param.type), context,
    ));

    if (methods.length === 0) {
      return undefined;
    }

    return methods.reduce((curr, prev) => this.mostSpecificFunction(curr, prev, context)!);
  }

  static findMethods(klass: Class, name: string, argsTypes: Type[], context: Context) {
    const methods: Function[] = [];

    const index = (method: Function) => {
      for (let i = 0, l = methods.length; i < l; ++i) {
        if (methods[i].equals(method)) return i;
      }
      return -1;
    };

    const collect = (kls: Class) => {
      if (kls.superClass !== undefined) collect(context.getClass(kls.superClass));
      kls.functions
        .filter(method => method.name === name && method.parameters.length === argsTypes.length)
        .forEach(method => {
          const i = index(method);
          if (i !== -1 && method.override) methods.splice(i, 1);
          methods.push(method);
        });
    };

    collect(klass);
    return methods;
  }

  static findOverridedFunction(
    superClassName: string,
    overridingMethod: Function,
    context: Context,
  ) {
    if (superClassName === undefined) return undefined;
    let klass: Class = context.getClass(superClassName);
    do {
      const method = klass.functions.find(m => m.equals(overridingMethod));

      if (method !== undefined) return method;
      if (klass.superClass === undefined) break;

      klass = context.getClass(klass.superClass);
    } while (klass.superClass !== undefined);

    return undefined;
  }

  static mostSpecificFunction(
    funcA: Function | undefined,
    funcB : Function | undefined,
    context: Context,
  ) {
    if (funcA === undefined || funcB === undefined) return undefined;

    const paramsTypesA = funcA.parameters.map((param: Formal) => param.type);
    const paramsTypesB = funcB.parameters.map((param: Formal) => param.type);

    if (this.allConform(paramsTypesA, paramsTypesB, context)) return funcA;
    if (this.allConform(paramsTypesB, paramsTypesA, context)) return funcB;

    return undefined;
  }

  static allConform(typesA: Type[], typesB: Type[], context: Context) {
    if (typesB.length !== typesA.length) return false;

    for (let i = 0, l = typesA.length; i < l; ++i) {
      if (!this.conform(typesA[i], typesB[i], context)) return false;
    }

    return true;
  }

  static allEqual(typesA: Type[], typesB: Type[]) {
    const length = typesA.length;
    if (typesB.length !== length) return false;

    for (let i = 0; i < length; ++i) {
      if (typesA[i] !== typesB[i]) return false;
    }

    return true;
  }

  static conform(typeA: Type, typeB: Type, context: Context) {
    if (typeB === Types.Object) return true;
    if (typeA === typeB) return true;

    if (!this.isPrimitive(typeB) && typeA === Types.Null) return true;

    const classA = context.getClass(typeA);
    let classB = context.getClass(typeB);

    do {
      if (classA.superClass === classB.name) return true;
      if (classB.superClass === undefined) return false;
      classB = context.getClass(classB.superClass);
    } while (classB.name !== Types.Object);

    return false;
  }

  static hasFunctionWithName(klass: Class, methodName: string, context: Context) {
    while (klass !== undefined) {
      if (klass.hasFunctionWithName(methodName)) return true;
      klass = context.getClass(klass.superClass);
    }

    return false;
  }

  static isPrimitive(type: Type) {
    return type === Types.Int || type === Types.Double || type === Types.String
      || type === Types.Bool || type === Types.Void;
  }

  static isIternal(type: string) {
    return type === 'int' || type === 'double' || type === 'bool' || type === 'string';
  }
}
