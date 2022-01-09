import Environment from './Environment';
import Store from './Store';
import { Class } from '../ast';
import Obj from './Obj';
import Env from '../interfaces/Env';

export default class Context implements Env {
  classes: Map<string, Class>;
  environment: Environment;
  store: Store;
  self: Obj | undefined;

  constructor(
    classes: Map<string, Class> = new Map<string, Class>(),
    environment = new Environment(),
    store = new Store(),
    self: Obj | undefined = undefined,
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
