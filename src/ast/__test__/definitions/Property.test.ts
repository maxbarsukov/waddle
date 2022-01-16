import Property from '../../definitions/Property';
import { Expression } from '../..';

import { Types } from '../../../types/Types';

describe('Property', () => {
  const property = new Property('a', Types.String, new Expression());

  it('#isProperty', () => {
    expect(property.isProperty()).toBe(true);
  });
});
