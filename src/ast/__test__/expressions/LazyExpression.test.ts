import LazyExpression from '../../expressions/LazyExpression';
import { Expression } from '../..';
import Context from '../../../interpreter/Context';

describe('LazyExpression', () => {
  const lazy = new LazyExpression(new Expression(), new Context());

  it('#isLazy', () => {
    expect(lazy.isLazy()).toBe(true);
  });
});
