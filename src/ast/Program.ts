import Class from './definitions/Class';

export default class Program {
  classes: Class[];
  constructor(classes: Class[] = []) {
    this.classes = classes;
  }

  classesCount() {
    return this.classes.length;
  }
}
