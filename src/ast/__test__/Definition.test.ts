import { Definition } from '..';

describe('Definition', () => {
  const definition = new Definition();

  it('#isDefinition', () => {
    expect(definition.isDefinition()).toBe(true);
  });

  it('#isClass', () => {
    expect(definition.isClass()).toBe(false);
  });

  it('#isProperty', () => {
    expect(definition.isProperty()).toBe(false);
  });

  it('#isFunction', () => {
    expect(definition.isFunction()).toBe(false);
  });
});
