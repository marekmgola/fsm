import { describe, it, expect, beforeEach } from 'vitest';
import { FSM } from '../src/fsm/FSM.js';
import { NModFSM } from '../src/fsm/NModFSM.js';
import { ParityFSM } from '../src/fsm/ParityFSM.js';
import type * as FSMTypes from '../src/types.js';

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

  it('throws error if generated transition result is not in Q', () => {
    class InvalidFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
      constructor() {
        super({
          states: new Set(['S0']),
          alphabet: new Set(['0']),
          initialState: 'S0',
          finalStates: new Set(),
        });
        // This should throw because delta returns S99 which is not in Q
        this.generateTransitions();
      }
      protected delta(
        _state: FSMTypes.State,
        _input: FSMTypes.BinaryInput,
      ): FSMTypes.State {
        return 'S99' as FSMTypes.State;
      }
    }

    expect(() => new InvalidFSM()).toThrow(/not in Q/);
  });

  it('defaults finalStates to empty set if not provided', () => {
    class NoFinalFSM extends FSM<FSMTypes.State, FSMTypes.BinaryInput> {
      constructor() {
        super({
          states: new Set(['S0']),
          alphabet: new Set(['0']),
          initialState: 'S0',
          // finalStates omitted
        });
        this.generateTransitions();
      }
      protected delta(
        state: FSMTypes.State,
        _input: FSMTypes.BinaryInput,
      ): FSMTypes.State {
        return state;
      }
    }

    const fsm = new NoFinalFSM();
    expect(fsm.finalStates).toBeInstanceOf(Set);
    expect(fsm.finalStates.size).toBe(0);
    expect(fsm.isFinalState()).toBe(false);
  });

  it('throws error if input is not in alphabet', () => {
    const parityFSM = new ParityFSM();
    expect(() => parityFSM.transition('2' as FSMTypes.BinaryInput)).toThrow(
      /not in the alphabet/,
    );
  });

  it('checks isFinalState correctly', () => {
    const parityFSM = new ParityFSM();
    expect(parityFSM.isFinalState()).toBe(true); // S0 is final
    parityFSM.transition('1');
    expect(parityFSM.isFinalState()).toBe(false); // S1 is not final
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
      expect(fsm.isAccepting()).toBe(true);
    });

    it('calculates transitions correctly for example sequence 101 (Binary 5, 5%3=2)', () => {
      fsm.reset('S0');
      // 1 -> 1 (S1)
      expect(fsm.transition('1')).toBe('S1');
      // 0 -> (2*1 + 0)%3 = 2 -> S2
      expect(fsm.transition('0')).toBe('S2');
      // 1 -> (2*2 + 1)%3 = 5%3 = 2 -> S2
      expect(fsm.transition('1')).toBe('S2');
      expect(fsm.isAccepting()).toBe(false);
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
