import Expression from '../Expression';

export default class Import extends Expression {
  source: string;
  classNames: string[];

  constructor(source: string, classNames: string[]) {
    super();
    this.source = source;
    this.classNames = classNames;
  }

  isImport() {
    return true;
  }

  isBuiltin() {
    return this.source[0] !== '.';
  }
}
