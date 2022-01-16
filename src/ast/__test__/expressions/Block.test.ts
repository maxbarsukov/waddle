import Block from '../../expressions/Block';

describe('Block', () => {
  const block = new Block();
  it('should create empty block without args', () => {
    expect(block.expressions.length).toBe(0);
  });

  it('#isBlock', () => {
    expect(block.isBlock()).toBe(true);
  });
});
