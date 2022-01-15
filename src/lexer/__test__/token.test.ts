import Token from '../Token';

describe('Token', () => {
  it('#toString', () => {
    expect(new Token('A', 'B', { line: 1, column: 2 }).toString()).toBe('<A, B, 1:2>');
  });
});
