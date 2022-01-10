import Type, { Types } from '../types/Types';
import TypesUtils from '../utils/TypesUtils';
import Context from './Context';
import { Function } from '../ast';

export default class Obj {
  type: Type | undefined;
  properties: Map<string, any>;
  functions: Function[];
  address: number | undefined;

  constructor(
    type: Type | undefined = undefined,
    properties = new Map<string, any>(),
    functions: Function[] = [],
    address: number | undefined = undefined,
  ) {
    this.type = type;
    this.properties = properties;
    this.functions = functions;
    this.address = address;
  }

  get(propertyName: string) {
    return this.properties.get(propertyName);
  }

  set(propertyName: string, value: any) {
    this.properties.set(propertyName, value);
  }

  has(propertyName: string) {
    return this.properties.has(propertyName);
  }

  static create(context: Context, className: string): Obj {
    const klass = context.getClass(className);

    const object = klass.superClass !== 'NO_SUPER_CLASS'
      ? Obj.create(context, klass.superClass)
      : new Obj(className);

    klass.parameters.forEach((param) => {
      object.properties.set(param.identifier, Obj.defaultValue(context, param.type));
    });

    klass.properties.forEach((variable) => {
      // @ts-ignore
      object.properties.set(variable.identifier, Obj.defaultValue(context, variable.type));
    });

    klass.functions.forEach((method) => {
      const superClassMethodIndex = object.findMethodIndex(method);

      if (superClassMethodIndex !== -1 && method.override) {
        object.functions.splice(superClassMethodIndex, 1);
      }

      object.functions.push(method);
    });

    object.type = className;

    return object;
  }

  getMethod(methodName: string, argsTypes: Type[]) {
    const methods: Function[] = this
      .functions
      .filter((method: Function) => method.name === methodName);

    for (let i = 0, length = methods.length; i < length; ++i) {
      const method = methods[i];
      const parametersTypes = method.parameters.map((param) => param.type);
      if (TypesUtils.allEqual(argsTypes, parametersTypes)) return method;
    }

    return null;
  }

  getMostSpecificFunction(functionName: string, argsTypes: Type[], context: Context) {
    let functions: Function[] = this
      .functions
      .filter((func: Function) => func.name === functionName);
    if (functions.length === 0) return undefined;

    functions = functions.filter(method => TypesUtils.allConform(
      argsTypes,
      method.parameters.map((param) => param.type),
      context,
    ),
    );

    if (functions.length === 0) return undefined;
    return functions.reduce((curr, prev) => TypesUtils.mostSpecificFunction(curr, prev, context)!);
  }

  static defaultValue(context: Context, type: Type) {
    if (TypesUtils.isIternal(type)) return undefined;

    let value: Obj;
    switch (type) {
      case Types.Int:
        value = Obj.create(context, Types.Int);
        value.set('value', 0);
        break;

      case Types.Double:
        value = Obj.create(context, Types.Double);
        value.set('value', 0.0);
        break;

      case Types.Bool:
        value = Obj.create(context, Types.Bool);
        value.set('value', false);
        break;

      case Types.String:
        value = Obj.create(context, Types.String);
        value.set('value', '""');
        break;

      default:
        value = Obj.create(context, Types.Null);
        break;
    }

    return value;
  }

  findMethodIndex(method: Function) {
    for (let i = 0, l = this.functions.length; i < l; ++i) {
      if (this.functions[i].equals(method)) return i;
    }

    return -1;
  }

  toString() {
    let str = `${this.type}(`;

    const l = this.properties.keys.length;
    const keys = Array.from(this.properties.keys());

    for (let i = 0; i < l - 1; ++i) {
      str += `${keys[i]}: ${this.properties.get(keys[i])}, `;
    }

    return `${str}${keys[l - 1]}: ${this.properties.get(keys[l - 1])})`;
  }
}
