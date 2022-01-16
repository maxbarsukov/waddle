import Symbol from '../Symbol';
import { Types } from '../../types/Types';

describe('Symbol', () => {
  it('should create a symbol', () => {
    const sym = new Symbol('A', Types.String);
    expect(sym).toBeInstanceOf(Symbol);
    expect(sym.line).toBe(-1);
    expect(sym.column).toBe(-1);
  });
});
