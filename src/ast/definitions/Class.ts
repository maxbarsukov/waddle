import Definition from '../Definition';
import Formal from '../Formal';
import Type from '../../types/Types';
import Expression from '../Expression';

import Function from './Function';
import Property from './Property';

export default class Class extends Definition {
  name: string;
  parameters: Formal[];
  superClass: Type | undefined;
  superClassArgs: Expression[];
  properties: Property[];
  functions: Function[];

  constructor(
    name: string,
    parameters: Formal[] = [],
    superClass: Type | undefined = undefined,
    superClassArgs: Expression[] = [],
    properties: Property[] = [],
    functions: Function[] = [],
  ) {
    super();
    this.name = name;
    this.parameters = parameters;
    this.superClass = superClass;
    this.superClassArgs = superClassArgs;
    this.properties = properties;
    this.functions = functions;
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
