import { FSM } from './FSM.js';
import type * as FSMTypes from '../types.js';

/**
 * FSM implementation for Modulo N arithmetic.
 * Calculates the remainder of a binary number when divided by `N`.
 */
export class NModFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
  private readonly modulus: number;

  /**
   * Creates an instance of NModFSM.
   *
   * @param modulus The positive integer modulus (N).
   * @throws Error if modulus is not a positive integer.
   */
  constructor(modulus: number) {
    if (modulus <= 0 || !Number.isInteger(modulus)) {
      throw new Error('Modulus must be a positive integer.');
    }

    const states = new Set<FSMTypes.State>();
    for (let i = 0; i < modulus; i++) {
      states.add(`S${i}`);
    }

    const alphabet = new Set<FSMTypes.BinaryInput>(['0', '1']);
    const initialState: FSMTypes.State = 'S0';
    // For Modulo FSM, S0 (remainder 0) is accepting.
    const finalStates = new Set<FSMTypes.State>(['S0']);

    super({
      states,
      alphabet,
      initialState,
      finalStates,
    });

    this.modulus = modulus;

    this.generateTransitions();
  }

  /**
   * Implementation of the transition function δ.
   * Calculates the next state based on the current state (remainder) and input bit.
   */
  protected delta(
    state: FSMTypes.State,
    input: FSMTypes.BinaryInput,
  ): FSMTypes.State {
    // Extract integer remainder from state string "S{r}"
    const remainder = parseInt(state.substring(1), 10);

    const bit = input === '0' ? 0 : 1;

    // Logic: New Remainder = (Current * 2 + Input) % Modulus
    const nextRemainder = (remainder * 2 + bit) % this.modulus;

    return `S${nextRemainder}`;
  }
}
