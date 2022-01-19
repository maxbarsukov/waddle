import Definition from '../Definition';
import Formal from '../Formal';
import Type from '../../types/Types';
import Expression from '../Expression';

import Function from './Function';
import Property from './Property';

export default class Class extends Definition {
  name: string;
  parameters: Formal[];
  superClass: Type;
  superClassArgs: Expression[];
  properties: Property[];
  functions: Function[];
  isExported: boolean;

  constructor(
    name: string,
    parameters: Formal[] = [],
    superClass: Type = 'NO_SUPER_CLASS',
    superClassArgs: Expression[] = [],
    properties: Property[] = [],
    functions: Function[] = [],
    isExported = false,
  ) {
    super();
    this.name = name;
    this.parameters = parameters;
    this.superClass = superClass;
    this.superClassArgs = superClassArgs;
    this.properties = properties;
    this.functions = functions;
    this.isExported = isExported;
  }

  isClass() {
    return true;
  }

  hasProperty(propertyName: string) {
    return this.properties.some((property) => property.name === propertyName);
  }

  getProperty(propertyName: string) {
    return this.properties.find((property) => property.name === propertyName);
  }

  hasFunctionWithName(functionName: string) {
    return this.functions.some((func) => func.name === functionName);
  }
}
