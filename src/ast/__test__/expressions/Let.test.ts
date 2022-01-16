import Let from '../../expressions/Let';
import { Expression } from '../..';

describe('Let', () => {
  const l = new Let(new Expression());

  it('should create empty let call without initializers', () => {
    expect(l.initializations.length).toBe(0);
  });

  it('#isConstructorCall', () => {
    expect(l.isLet()).toBe(true);
  });
});
