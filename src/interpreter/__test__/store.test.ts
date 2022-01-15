import Store from '../Store';

describe('Store', () => {
  describe('#get', () => {
    const store = new Store();

    it('get undefined if there is no address', () => {
      expect(store.get(0)).toBe(undefined);
      expect(store.get(-1)).toBe(undefined);
    });
  });
});
