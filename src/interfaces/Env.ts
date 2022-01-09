import { Class } from '../ast';

export default interface Env {
  addClass(klass: Class): void;
  getClass(className: string): Class;
  removeClass(className: string): void;
}
