import ConstructorCall from '../../expressions/ConstructorCall';
import { Types } from '../../../types/Types';

describe('ConstructorCall', () => {
  const constructorCall = new ConstructorCall(Types.String);

  it('should create empty constructor call without args', () => {
    expect(constructorCall.args.length).toBe(0);
  });

  it('#isConstructorCall', () => {
    expect(constructorCall.isConstructorCall()).toBe(true);
  });
});
