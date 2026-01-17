import { FSM } from './FSM.js';
import type * as FSMTypes from '../types.js';

// Parity Checker FSM (Reference implementation)
export class ParityFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
  constructor() {
    super({
      states: new Set(['S0', 'S1']),
      alphabet: new Set(['0', '1']),
      initialState: 'S0',
      finalStates: new Set(['S0']),
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
