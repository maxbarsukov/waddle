import Import from '../../expressions/Import';

describe('Import', () => {
  const imp = new Import('../file', ['List', 'Array']);

  it('should check is source a builtin file', () => {
    expect(imp.isBuiltin()).toBe(false);
    const imp2 = new Import('collections', ['List', 'Array']);
    expect(imp2.isBuiltin()).toBe(true);
  });

  it('#isImport', () => {
    expect(imp.isImport()).toBe(true);
  });
});
