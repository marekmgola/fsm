import { FSM } from './FSM.js';
import type * as FSMTypes from './types.js';

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

    const transitions = new Map<
      FSMTypes.State,
      Map<FSMTypes.BinaryInput, FSMTypes.State>
    >();

    // Generate states S0 to S{n-1} and transitions
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

      transitions.set(currentState, stateTransitions);
    }

    super({
      transitions,
    });

    this.modulus = modulus;
  }
}
