import { Node } from '..';

describe('Node', () => {
  const node = new Node();

  it('#isDefinition', () => {
    expect(node.isDefinition()).toBe(false);
  });

  it('#isExpression', () => {
    expect(node.isExpression()).toBe(true);
  });
});
