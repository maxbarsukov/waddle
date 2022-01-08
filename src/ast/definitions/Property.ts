import Definition from '../Definition';
import Type from '../../types/Types';

export default class Property extends Definition {
  name: string;
  type: Type;
  value: string;

  constructor(name: string, type: Type, value: string) {
    super();
    this.name = name;
    this.type = type;
    this.value = value;
  }

  isProperty() {
    return true;
  }
}
