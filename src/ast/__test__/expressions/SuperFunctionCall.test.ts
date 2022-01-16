import SuperFunctionCall from '../../expressions/SuperFunctionCall';

describe('SuperFunctionCall', () => {
  const sup = new SuperFunctionCall('func');

  it('should create empty super constructor call without args', () => {
    expect(sup.args.length).toBe(0);
  });

  it('#isSuper', () => {
    expect(sup.isSuper()).toBe(true);
  });
});
