import { FSM } from './FSM.js';
import type * as FSMTypes from './types.js';

/**
 * Concrete implementation of FSM for Modulo N arithmetic.
 * Calculates the remainder of a number represented by a binary string when divided by `N`.
 *
 * Dynamically generates states (S0 to Sn-1) and their transitions upon instantiation.
 */
export class NModFSM extends FSM {
  private readonly modulus: number;
  protected readonly transitions: Map<
    FSMTypes.State,
    Map<FSMTypes.BinaryInput, FSMTypes.State>
  >;

  /**
   * Creates an instance of NModFSM.
   *
   * @param modulus The positive integer modulus (N) for calculation.
   * @throws Error if modulus is not a positive integer.
   */
  constructor(modulus: number) {
    super('S0'); // Initial state S0
    this.modulus = modulus;

    if (modulus <= 0 || !Number.isInteger(modulus)) {
      throw new Error('Modulus must be a positive integer.');
    }

    this.transitions = new Map();

    // Generate states S0 to S{n-1}
    // And transitions for each state with input '0' and '1'
    for (let i = 0; i < modulus; i++) {
      const currentState: FSMTypes.State = `S${i}`;
      const stateTransitions = new Map<FSMTypes.BinaryInput, FSMTypes.State>();

      // Input '0'
      const nextVal0 = (2 * i) % modulus;
      const nextState0: FSMTypes.State = `S${nextVal0}`;
      stateTransitions.set('0', nextState0);

      // Input '1'
      const nextVal1 = (2 * i + 1) % modulus;
      const nextState1: FSMTypes.State = `S${nextVal1}`;
      stateTransitions.set('1', nextState1);

      this.transitions.set(currentState, stateTransitions);
    }
  }
}
