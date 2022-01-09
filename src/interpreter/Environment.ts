export default class Environment {
  scopes: Map<string, number>[];
  scope: Map<string, number> | null;
  currentScopeIndex: number;

  constructor() {
    this.scopes = [];
    this.scope = null;
    this.currentScopeIndex = -1;
  }

  enterScope() {
    if (this.currentScopeIndex + 1 >= this.scopes.length) {
      this.scopes.push(new Map());
    }

    this.scope = this.scopes[++this.currentScopeIndex];
  }

  add(identifier: string, address: number) {
    if (this.scope !== null) {
      this.scope.set(identifier, address);
    }
  }

  find(identifier: string) {
    if (this.scope === null) return undefined;

    let address;
    let scope = this.scope;
    let index = this.currentScopeIndex;

    while (address === undefined && index >= 0) {
      address = scope.get(identifier);
      scope = this.scopes[--index];
    }

    return address;
  }

  exitScope() {
    this.scopes.splice(this.currentScopeIndex, 1);
    this.scope = --this.currentScopeIndex >= 0 ? this.scopes[this.currentScopeIndex] : null;
  }
}
