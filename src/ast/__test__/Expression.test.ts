import { Expression } from '..';
import { Types } from '../../types/Types';

describe('Expression', () => {
  const expression = new Expression();

  it('#hasType', () => {
    expect(expression.hasType()).toBe(false);
    expression.expressionType = Types.String;
    expect(expression.hasType()).toBe(true);
  });

  it('#isExpression', () => {
    expect(expression.isExpression()).toBe(true);
  });

  it('#isLazy', () => {
    expect(expression.isLazy()).toBe(false);
  });

  it('#isImport', () => {
    expect(expression.isImport()).toBe(false);
  });
});
