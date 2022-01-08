import Definition from '../Definition';
import Type, { Types } from '../../types/Types';
import Formal from '../Formal';
import Expression from '../Expression';

export default class Function extends Definition {
  name: string;
  parameters: Formal[];
  returnType: Type;
  body: Expression;
  override: boolean;
  isPrivate: boolean;

  constructor(
    name: string,
    returnType: Type,
    body: Expression,
    parameters: Formal[] = [],
    override = false,
    isPrivate = false,
  ) {
    super();
    this.name = name;
    this.parameters = parameters;
    this.returnType = returnType;
    this.body = body;
    this.override = override;
    this.isPrivate = isPrivate;
  }

  isFunction() {
    return true;
  }

  equals(method: Function): boolean {
    if (this.name !== method.name) return false;
    if (this.parameters.length !== method.parameters.length) return false;

    for (let i = 0, length = this.parameters.length; i < length; ++i) {
      if (this.parameters[i].type !== method.parameters[i].type) {
        return false;
      }
    }

    return this.returnType === method.returnType;
  }

  signature(): string {
    let sign = `${this.name}(`;
    const parametersCount = this.parameters.length;

    if (parametersCount > 0) {
      sign += `${this.parameters[0].identifier}: ${this.parameters[0].type}`;
      for (let i = 1; i < parametersCount; ++i) {
        sign += `, ${this.parameters[i].identifier}: ${this.parameters[i].type}`;
      }
    }

    sign += ')';

    if (this.returnType !== Types.Void) {
      sign += `: ${this.returnType}`;
    }

    return sign;
  }
}
