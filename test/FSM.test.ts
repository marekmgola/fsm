import { describe, it, expect, beforeEach } from 'vitest';
import { FSM } from '../src/FSM.js';
import { NModFSM } from '../src/NModFSM.js';
import type * as FSMTypes from '../src/types.js';

// Concrete implementation for testing base FSM logic
class ParityFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
  constructor() {
    // S0 (Even): 0->S0, 1->S1
    const s0Trans = new Map<FSMTypes.BinaryInput, FSMTypes.State>();
    s0Trans.set('0', 'S0');
    s0Trans.set('1', 'S1');

    // S1 (Odd): 0->S1, 1->S0
    const s1Trans = new Map<FSMTypes.BinaryInput, FSMTypes.State>();
    s1Trans.set('0', 'S1');
    s1Trans.set('1', 'S0');

    const transitions = new Map<
      FSMTypes.State,
      Map<FSMTypes.BinaryInput, FSMTypes.State>
    >();
    transitions.set('S0', s0Trans);
    transitions.set('S1', s1Trans);

    super({
      transitions,
    });
  }
}

describe('FSM Base Class', () => {
  // Bonus: Parity Checker FSM (Even/Odd number of 1s)
  it('runs a simple Parity Checker FSM (Bonus)', () => {
    const parityFSM = new ParityFSM();

    expect(parityFSM.getState()).toBe('S0');
    expect(parityFSM.transition('0')).toBe('S0');
    expect(parityFSM.transition('1')).toBe('S1');
    expect(parityFSM.transition('1')).toBe('S0');
    expect(parityFSM.transition('1')).toBe('S1');
  });

  it('throws error on invalid transition', () => {
    // Force an invalid state to test error handling
    // We can't easily force invalid input with strict typing '0'|'1'
    // without casting, but let's test a missing state config if possible
    // or just rely on the fact that if we accessed a state not in the map it throws.

    // Actually, let's create a broken FSM for this test
    class BrokenFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
      constructor() {
        super({
          transitions: new Map(), // Empty transitions shouldn't crash constructor but will fail transition()
        });
      }
    }
    const broken = new BrokenFSM();
    expect(() => broken.transition('0')).toThrow(/No transitions defined/);
  });
});

describe('NModFSM', () => {
  describe('Modulo 3 (The Exercise)', () => {
    let fsm: NModFSM;

    beforeEach(() => {
      fsm = new NModFSM(3);
    });

    it('starts at S0', () => {
      expect(fsm.getState()).toBe('S0');
    });

    it('calculates transitions correctly for example sequence 110 (Binary 6, 6%3=0)', () => {
      // 1 -> (2*0 + 1)%3 = 1 -> S1
      expect(fsm.transition('1')).toBe('S1');
      // 1 -> (2*1 + 1)%3 = 3%3 = 0 -> S0
      expect(fsm.transition('1')).toBe('S0');
      // 0 -> (2*0 + 0)%3 = 0 -> S0
      expect(fsm.transition('0')).toBe('S0');
    });

    it('calculates transitions correctly for example sequence 101 (Binary 5, 5%3=2)', () => {
      fsm.reset('S0');
      // 1 -> 1 (S1)
      expect(fsm.transition('1')).toBe('S1');
      // 0 -> (2*1 + 0)%3 = 2 -> S2
      expect(fsm.transition('0')).toBe('S2');
      // 1 -> (2*2 + 1)%3 = 5%3 = 2 -> S2
      expect(fsm.transition('1')).toBe('S2');
    });

    it('verifies all transitions for Mod 3', () => {
      // S0: 0->S0, 1->S1
      fsm.reset('S0');
      expect(fsm.transition('0')).toBe('S0');
      fsm.reset('S0');
      expect(fsm.transition('1')).toBe('S1');

      // S1: 0->S2, 1->S0
      fsm.reset('S1');
      expect(fsm.transition('0')).toBe('S2');
      fsm.reset('S1');
      expect(fsm.transition('1')).toBe('S0');

      // S2: 0->S1, 1->S2
      fsm.reset('S2');
      expect(fsm.transition('0')).toBe('S1');
      fsm.reset('S2');
      expect(fsm.transition('1')).toBe('S2');
    });
  });

  describe('Modulo 4', () => {
    let fsm: NModFSM;
    beforeEach(() => {
      fsm = new NModFSM(4);
    });

    it('transitions correctly for sequence 1111 (15 % 4 = 3)', () => {
      // S0 -1-> S1 (1)
      expect(fsm.transition('1')).toBe('S1');
      // S1 -1-> S3 (3)
      expect(fsm.transition('1')).toBe('S3');
      // S3 -1-> S3 (7%4=3)  [(2*3+1)%4 = 7%4 = 3]
      expect(fsm.transition('1')).toBe('S3');
      // S3 -1-> S3 (15%4=3) [(2*3+1)%4 = 3]
      expect(fsm.transition('1')).toBe('S3');
    });
  });
});
