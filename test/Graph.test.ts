import { describe, it, expect } from 'vitest';
import { NModFSM } from '../src/fsm/NModFSM.js';
import { LastNOnesFSM } from '../src/fsm/LastNOnesFSM.js';
import type { FSM } from '../src/fsm/FSM.js';
import type { State, BinaryInput } from '../src/types.js';

describe('Graph Reachability Tests', () => {
  /**
   * Performs a BFS to find all reachable states from q0.
   */
  const getReachableStates = (fsm: FSM<State, BinaryInput>): Set<State> => {
    const reachable = new Set<State>();
    const queue: State[] = [fsm.q0];
    reachable.add(fsm.q0);

    while (queue.length > 0) {
      const current = queue.shift()!;

      // Explore neighbors by resetting to the current state and trying every input.
      // This allows us to traverse the graph using only the public API.

      for (const input of fsm.alphabet) {
        fsm.reset(current);
        const nextState = fsm.transition(input);

        if (!reachable.has(nextState)) {
          reachable.add(nextState);
          queue.push(nextState);
        }
      }
    }

    return reachable;
  };

  it('NModFSM(5) should be fully connected (Strongly Connected implies Reachable)', () => {
    const fsm = new NModFSM(5);
    const reachable = getReachableStates(fsm);

    // Check that every defined state is in the reachable set
    for (const state of fsm.states) {
      expect(reachable.has(state)).toBe(true);
    }
    expect(reachable.size).toBe(fsm.states.size);
  });

  it('LastNOnesFSM(4) should be fully connected', () => {
    const fsm = new LastNOnesFSM(4);
    const reachable = getReachableStates(fsm);

    for (const state of fsm.states) {
      expect(reachable.has(state)).toBe(true);
    }
    expect(reachable.size).toBe(fsm.states.size);
  });

  it('NModFSM(100) reachability check', () => {
    // A slightly larger graph
    const fsm = new NModFSM(100);
    const reachable = getReachableStates(fsm);
    expect(reachable.size).toBe(100);
  });
});
