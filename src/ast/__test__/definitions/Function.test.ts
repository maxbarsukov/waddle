import Function from '../../definitions/Function';
import { Types } from '../../../types/Types';
import { Expression, Formal } from '../..';

describe('Function', () => {
  describe('#signature', () => {
    it('should generate signature', () => {
      const f = new Function(
        'myFunc',
        Types.String,
        new Expression(),
        [new Formal('arg1', Types.String), new Formal('arg2', Types.Int)],
        true,
        true,
      );
      expect(f.signature()).toBe('myFunc(arg1: String, arg2: Int): String');
    });
  });
});
