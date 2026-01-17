import { describe, it, expect, beforeEach } from 'vitest';
import { LastNOnesFSM } from '../src/fsm/LastNOnesFSM.js';

describe('LastNOnesFSM', () => {
  describe('N = 3', () => {
    let fsm: LastNOnesFSM;

    beforeEach(() => {
      fsm = new LastNOnesFSM(3);
    });

    it('starts at S0', () => {
      expect(fsm.getState()).toBe('S0');
      expect(fsm.isAccepting()).toBe(false);
    });

    it('detects 3 consecutive ones', () => {
      // 1
      expect(fsm.transition('1')).toBe('S1');
      expect(fsm.isAccepting()).toBe(false);
      // 1,1
      expect(fsm.transition('1')).toBe('S2');
      expect(fsm.isAccepting()).toBe(false);
      // 1,1,1 -> Match!
      expect(fsm.transition('1')).toBe('S3');
      expect(fsm.isAccepting()).toBe(true);
    });

    it('resets on 0', () => {
      // 1,1
      fsm.transition('1');
      fsm.transition('1');
      expect(fsm.getState()).toBe('S2');

      // 1,1,0 -> Reset to S0
      expect(fsm.transition('0')).toBe('S0');
      expect(fsm.getState()).toBe('S0');
    });

    it('maintains accepting state on additional ones', () => {
      // 1,1,1
      fsm.transition('1');
      fsm.transition('1');
      fsm.transition('1');
      expect(fsm.isAccepting()).toBe(true);

      // 1,1,1,1 -> Still valid (last 3 are 1s)
      expect(fsm.transition('1')).toBe('S3');
      expect(fsm.isAccepting()).toBe(true);
    });

    it('handles mixed sequence', () => {
      // 1, 0, 1, 1, 1, 0, 1
      expect(fsm.transition('1')).toBe('S1');
      expect(fsm.transition('0')).toBe('S0');
      expect(fsm.transition('1')).toBe('S1');
      expect(fsm.transition('1')).toBe('S2');
      expect(fsm.transition('1')).toBe('S3'); // Win
      expect(fsm.isAccepting()).toBe(true);

      expect(fsm.transition('0')).toBe('S0'); // Reset
      expect(fsm.isAccepting()).toBe(false);
      expect(fsm.transition('1')).toBe('S1');
    });
  });

  it('throws invalid N', () => {
    expect(() => new LastNOnesFSM(0)).toThrow();
    expect(() => new LastNOnesFSM(-1)).toThrow();
    expect(() => new LastNOnesFSM(1.5)).toThrow();
  });
});
