import Symbol from './Symbol';

export type Scope = Map<string, Symbol>;

export default class SymbolTable {
  namespaces: Map<string, Scope[]>;
  scope: Scope | null;
  scopes: Scope[];
  currentScopeIndex: number;

  constructor() {
    this.namespaces = new Map<string, Scope[]>();
    this.currentScopeIndex = -1;
    this.scope = null;
    this.scopes = [];
    this.enterNamespace('default');
  }

  enterNamespace(namespace: string) {
    if (!this.namespaces.has(namespace)) {
      this.namespaces.set(namespace, []);
    }

    this.scopes = this.namespaces.get(namespace)!;
  }

  enterScope() {
    if (this.currentScopeIndex + 1 >= this.scopes.length) {
      this.scopes.push(new Map<string, Symbol>());
    }

    this.scope = this.scopes[++this.currentScopeIndex];
  }

  add(symbol: Symbol) {
    if (this.scope !== null) {
      this.scope.set(symbol.identifier, symbol);
    }
  }

  check(identifier: string) {
    if (this.scope === null) {
      return false;
    }

    return this.scope.has(identifier);
  }

  scopesCount() {
    return this.scopes.length;
  }

  find(identifier: string) {
    if (this.scope === null) {
      return undefined;
    }

    let symbol;
    let scope = this.scope;
    let scopeIndex = this.currentScopeIndex;

    while (symbol === undefined && scopeIndex >= 0) {
      symbol = scope.get(identifier);
      scope = this.scopes[--scopeIndex];
    }

    return symbol;
  }

  exitScope() {
    this.scopes.splice(this.currentScopeIndex, 1);

    this.scope = --this.currentScopeIndex >= 0 ? this.scopes[this.currentScopeIndex] : null;
  }

  clear() {
    this.namespaces = new Map<string, Scope[]>();
    this.enterNamespace('default');
  }
}
