import { describe, it, expect } from 'vitest';
import { NModFSM } from '../src/fsm/NModFSM.js';
import type { BinaryInput } from '../src/types.js';

describe('Stress/Performance Tests', () => {
  it('should handle creation of very large NModFSM (N=5000)', () => {
    const N = 5000;
    const startTime = performance.now();
    const fsm = new NModFSM(N);
    const endTime = performance.now();

    // Just ensuring it didn't throw and created correct number of states
    expect(fsm.states.size).toBe(N);

    // Check a random transition to ensure the map is populated
    // S1 -> (1*2 + 0) % 5000 = 2 => S2
    fsm.reset('S1');
    expect(fsm.transition('0')).toBe('S2');

    console.log(
      `Creation of NModFSM(${N}) took ${(endTime - startTime).toFixed(2)}ms`,
    );
  });

  it('should handle a long sequence of inputs on a large FSM', () => {
    const N = 1000;
    const fsm = new NModFSM(N);
    const sequenceLength = 10000;

    let currentRem = 0n; // Use BigInt for ground truth tracking

    for (let i = 0; i < sequenceLength; i++) {
      const bitStr = Math.random() < 0.5 ? '0' : '1';
      const bit = BigInt(bitStr);

      fsm.transition(bitStr as BinaryInput);
      currentRem = (currentRem * 2n + bit) % BigInt(N);
    }

    const state = fsm.getState();
    const rem = parseInt(state.substring(1), 10);
    expect(rem).toBe(Number(currentRem));
  });
});
