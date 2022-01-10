import Type, { Types } from '../types/Types';
import { Class, Formal, Function } from '../ast';
import Env from '../interfaces/Env';

export default class TypesUtils {
  static leastUpperBound(typeA: Type, typeB: Type, env: Env): Type {
    if (typeA === typeB) return typeA;
    if (typeA === Types.Null) return typeB;
    if (typeB === Types.Null) return typeA;

    const classA = env.getClass(typeA);
    const classB = env.getClass(typeB);

    if (classA.superClass !== 'NO_SUPER_CLASS' && classA.superClass === classB.superClass) {
      return classA.superClass;
    }
    if (
      this.inheritanceIndex(typeA, Types.Object, env)
      > this.inheritanceIndex(typeB, Types.Object, env)
    ) {
      return this.leastUpperBound(classA.superClass, typeB, env);
    }

    return this.leastUpperBound(typeA, classB.superClass, env);
  }

  static inheritanceIndex(typeA: Type, typeB: Type, env: Env) {
    let index = 0;
    while (typeA !== 'NO_SUPER_CLASS' && typeA !== typeB) {
      index++;
      typeA = env.getClass(typeA).superClass;
    }

    return index;
  }

  static findMethodToApply(klass: Class, name: string, argsTypes: Type[], env: Env) {
    let methods = this.findMethods(klass, name, argsTypes, env);
    if (methods.length === 0) {
      return undefined;
    }

    methods = methods.filter((method) => this.allConform(
      argsTypes, method.parameters.map((param) => param.type), env,
    ));

    if (methods.length === 0) {
      return undefined;
    }

    return methods.reduce((curr, prev) => this.mostSpecificFunction(curr, prev, env)!);
  }

  static findMethods(klass: Class, name: string, argsTypes: Type[], env: Env) {
    const methods: Function[] = [];

    const index = (method: Function) => {
      for (let i = 0, l = methods.length; i < l; ++i) {
        if (methods[i].equals(method)) return i;
      }
      return -1;
    };

    const collect = (kls: Class) => {
      if (kls.superClass !== 'NO_SUPER_CLASS') collect(env.getClass(kls.superClass));
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
    env: Env,
  ) {
    if (superClassName === 'NO_SUPER_CLASS') return undefined;
    let klass: Class = env.getClass(superClassName);
    do {
      const method = klass.functions.find(m => m.equals(overridingMethod));

      if (method !== undefined) return method;
      if (klass.superClass === 'NO_SUPER_CLASS') break;

      klass = env.getClass(klass.superClass);
    } while (klass.superClass !== 'NO_SUPER_CLASS');

    return undefined;
  }

  static mostSpecificFunction(
    funcA: Function | undefined,
    funcB : Function | undefined,
    env: Env,
  ) {
    if (funcA === undefined || funcB === undefined) return undefined;

    const paramsTypesA = funcA.parameters.map((param: Formal) => param.type);
    const paramsTypesB = funcB.parameters.map((param: Formal) => param.type);

    if (this.allConform(paramsTypesA, paramsTypesB, env)) return funcA;
    if (this.allConform(paramsTypesB, paramsTypesA, env)) return funcB;

    return undefined;
  }

  static allConform(typesA: Type[], typesB: Type[], env: Env) {
    if (typesB.length !== typesA.length) return false;

    for (let i = 0, l = typesA.length; i < l; ++i) {
      if (!this.conform(typesA[i], typesB[i], env)) return false;
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

  static conform(typeA: Type, typeB: Type, env: Env) {
    if (typeB === Types.Object) return true;
    if (typeA === typeB) return true;

    if (!this.isPrimitive(typeB) && typeA === Types.Null) return true;

    const classA = env.getClass(typeA);
    let classB = env.getClass(typeB);

    do {
      if (classA.superClass === classB.name) return true;
      if (classB.superClass === 'NO_SUPER_CLASS') return false;
      classB = env.getClass(classB.superClass);
    } while (classB.name !== Types.Object);

    return false;
  }

  static hasFunctionWithName(klass: Class, methodName: string, env: Env) {
    while (klass.superClass !== 'NO_SUPER_CLASS') {
      if (klass.hasFunctionWithName(methodName)) return true;
      klass = env.getClass(klass.superClass);
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
