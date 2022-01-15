import Context from '../Context';
import getRuntime from '../runtime';
import { Class } from '../../ast';

describe('Context', () => {
  describe('#removeClass', () => {
    const context = new Context();

    const runtimeClasses = getRuntime();
    runtimeClasses.forEach(cls => {
      context.addClass(cls);
    });

    beforeEach(() => {
      context.addClass(new Class('A'));
      context.addClass(new Class('B'));
    });

    it('should successfully remove a class', () => {
      const n = context.classes.size;
      context.removeClass('A');
      expect(context.classes.size).toBe(n - 1);
    });

    it('should successfully remove several classes', () => {
      const n = context.classes.size;
      context.removeClass('A');
      context.removeClass('B');
      expect(context.classes.size).toBe(n - 2);
    });

    it('shouldn\'t remove one class twice', () => {
      const n = context.classes.size;
      context.removeClass('A');
      context.removeClass('A');
      expect(context.classes.size).toBe(n - 1);
    });
  });
});
