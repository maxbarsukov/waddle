import Environment from './Environment';
import Store from './Store';
import { Class } from '../ast';

export default class Context {
  classes: Map<string, Class>;
  environment: Environment;
  store: Store;
  self: Class | undefined;

  constructor(
    classes: Map<string, Class> = new Map<string, Class>(),
    environment = new Environment(),
    store = new Store(),
    self: Class | undefined = undefined,
  ) {
    this.classes = classes;
    this.environment = environment;
    this.store = store;
    this.self = self;
  }

  addClass(klass: Class) {
    this.classes.set(klass.name, klass);
  }

  getClass(className: string) {
    return this.classes.get(className)!;
  }

  removeClass(className: string) {
    this.classes.delete(className);
  }

  copy() {
    return Object.assign(new Context(), this);
  }
}
