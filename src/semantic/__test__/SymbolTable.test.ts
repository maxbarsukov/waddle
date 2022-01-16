import SymbolTable from '../SymbolTable';

describe('SymbolTable', () => {
  const symbolTable = new SymbolTable();

  beforeEach(() => {
    symbolTable.clear();
  });

  it('#scopesCount', () => {
    expect(symbolTable.scopesCount()).toBe(0);
    symbolTable.enterScope();
    expect(symbolTable.scopesCount()).toBe(1);
    symbolTable.enterScope();
    expect(symbolTable.scopesCount()).toBe(2);
    symbolTable.exitScope();
    expect(symbolTable.scopesCount()).toBe(1);
    symbolTable.exitScope();
    expect(symbolTable.scopesCount()).toBe(0);
  });

  it('#find', () => {
    expect(symbolTable.find('a')).toBe(undefined);
  });
});
