import { describe, it, expect } from 'vitest';
import { NModFSM } from '../src/fsm/NModFSM.js';
import type { BinaryInput } from '../src/types.js';

describe('Equivalence Tests', () => {
  it('NModFSM(2) should show behavioral equivalence to checking the last bit', () => {
    // NModFSM(2) computes number % 2.
    // If last bit is '0', number is even (rem 0).
    // If last bit is '1', number is odd (rem 1).

    const fsm = new NModFSM(2);

    // Random testing for equivalence
    for (let i = 0; i < 100; i++) {
      const bit = Math.random() < 0.5 ? '0' : '1';
      fsm.transition(bit as BinaryInput);

      const state = fsm.getState();
      // S0 if 0, S1 if 1
      const expectedState = bit === '0' ? 'S0' : 'S1';

      expect(state).toBe(expectedState);
    }
  });

  it('should verify NModFSM(1) accepts everything (Always Remainder 0)', () => {
    const fsm = new NModFSM(1);

    for (let i = 0; i < 50; i++) {
      const bit = Math.random() < 0.5 ? '0' : '1';
      fsm.transition(bit as BinaryInput);
      expect(fsm.getState()).toBe('S0');
      expect(fsm.isAccepting()).toBe(true);
    }
  });
});
