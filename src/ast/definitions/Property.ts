import Expression from '../Expression';
import Definition from '../Definition';
import Type from '../../types/Types';

export default class Property extends Definition {
  name: string;
  type: Type | undefined;
  value: Expression | undefined;

  constructor(
    name: string,
    type: Type | undefined,
    value: Expression | undefined,
  ) {
    super();
    this.name = name;
    this.type = type;
    this.value = value;
  }

  isProperty() {
    return true;
  }
}
