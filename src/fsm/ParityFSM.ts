import { FSM } from './FSM.js';
import type * as FSMTypes from '../types.js';

// Concrete implementation for testing base FSM logic (Parity Checker)
export class ParityFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
  constructor() {
    // Q = {S0, S1}, Σ = {0, 1}, q0 = S0
    super({
      states: new Set(['S0', 'S1']),
      alphabet: new Set(['0', '1']),
      initialState: 'S0',
      finalStates: new Set(['S0']), // Even parity accepted
    });
    this.generateTransitions();
  }

  protected delta(
    state: FSMTypes.State,
    input: FSMTypes.BinaryInput,
  ): FSMTypes.State {
    if (state === 'S0') return input === '0' ? 'S0' : 'S1';
    if (state === 'S1') return input === '0' ? 'S1' : 'S0';
    return 'S0';
  }
}
