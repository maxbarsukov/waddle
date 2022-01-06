export const INVALID_FSM_STATE = 'INVALID_FSM_STATE';

export type FsmToken = {
  recognized: boolean;
  value: string;
};

export default class Fsm {
  states: Set<string>;
  startState: string;
  finalStates: Set<string>;
  transition: (state: string, symbol: string) => string;

  constructor(states: Set<string>,
    startState: string,
    finalStates: Set<string>,
    transition: (state: string, symbol: string) => string,
  ) {
    this.states = states || new Set();
    this.startState = startState;
    this.transition = transition;
    this.finalStates = finalStates || new Set();
  }

  run(input: string): FsmToken {
    let buffer = '';
    let state = this.startState;

    for (let i = 0, length = input.length; i < length; ++i) {
      const symbol = input.charAt(i);
      const tmpState = this.transition(state, symbol);

      if (tmpState === INVALID_FSM_STATE) {
        break;
      }

      state = tmpState;
      buffer += symbol;
    }

    return {
      recognized: this.finalStates.has(state),
      value: buffer,
    };
  }
}
