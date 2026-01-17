import { FSM } from './FSM.js';
import type * as FSMTypes from '../types.js';

/**
 * FSM implementation for checking if the last N bits are 1s.
 *
 * S(k) represents "k consecutive ones have been seen".
 */
export class LastNOnesFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
  private readonly n: number;

  /**
   * Creates an instance of LastNOnesFSM.
   *
   * @param n The number of consecutive ones to check for.
   * @throws Error if n is not a positive integer.
   */
  constructor(n: number) {
    if (n <= 0 || !Number.isInteger(n)) {
      throw new Error('N must be a positive integer.');
    }

    const states = new Set<FSMTypes.State>();
    for (let i = 0; i <= n; i++) {
      states.add(`S${i}` as FSMTypes.State);
    }

    const alphabet = new Set<FSMTypes.BinaryInput>(['0', '1']);
    const initialState: FSMTypes.State = 'S0';
    // Accepting state is Sn (we have seen N ones)
    const finalStates = new Set<FSMTypes.State>([`S${n}` as FSMTypes.State]);

    super({
      states,
      alphabet,
      initialState,
      finalStates,
    });

    this.n = n;

    this.generateTransitions();
  }

  /**
   * Implementation of the transition function δ.
   * Logic:
   *   If input is '0', streak is broken, reset to S0.
   *   If input is '1', increment streak, capping at N.
   */
  protected delta(
    state: FSMTypes.State,
    input: FSMTypes.BinaryInput,
  ): FSMTypes.State {
    // Extract count from "Sk"
    const count = parseInt(state.substring(1), 10);

    if (input === '0') {
      return 'S0';
    } else {
      // If we see a 1, we go to the next state, but max out at N.
      // Note: If we are at SN and see a 1, we stay at SN because the last N bits are still 1s.
      // Example N=3. 1,1,1 -> S3. Next 1 -> 1,1,1,1 -> Last 3 are 1s -> S3.
      const nextCount = Math.min(count + 1, this.n);
      return `S${nextCount}` as FSMTypes.State;
    }
  }
}
