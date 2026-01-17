import { FSM } from './FSM.js';
import type * as FSMTypes from '../types.js';

/**
 * Concrete implementation of FSM for Modulo N arithmetic.
 * Calculates the remainder of a number represented by a binary string when divided by `N`.
 *
 * Dynamically generates states (S0 to Sn-1) and their transitions upon instantiation.
 */
export class NModFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
  private readonly modulus: number;

  /**
   * Creates an instance of NModFSM.
   *
   * @param modulus The positive integer modulus (N) for calculation.
   * @throws Error if modulus is not a positive integer.
   */
  constructor(modulus: number) {
    if (modulus <= 0 || !Number.isInteger(modulus)) {
      throw new Error('Modulus must be a positive integer.');
    }

    // Q: Finite set of states { S0, ..., S(N-1) }
    const states = new Set<FSMTypes.State>();
    for (let i = 0; i < modulus; i++) {
      states.add(`S${i}`);
    }

    // Σ: Finite input alphabet { '0', '1' }
    const alphabet = new Set<FSMTypes.BinaryInput>(['0', '1']);

    // q0: Initial state
    const initialState: FSMTypes.State = 'S0';

    // F: Set of accepting states. For Modulo FSM, usually S0 (remainder 0) is accepting.
    const finalStates = new Set<FSMTypes.State>(['S0']);

    super({
      states,
      alphabet,
      initialState,
      finalStates,
    });

    this.modulus = modulus;

    // IMPORTANT: Generate transitions using the abstract delta method
    // This calls this.delta() for all Q x Σ
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
