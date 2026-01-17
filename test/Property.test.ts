import { describe, it, expect } from 'vitest';
import { NModFSM } from '../src/fsm/NModFSM.js';
import type { BinaryInput } from '../src/types.js';

describe('NModFSM Property Tests (Fuzzing)', () => {
  const NUM_TESTS = 100;

  const generateRandomBinaryString = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.random() < 0.5 ? '0' : '1';
    }
    return result;
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  it(`passes ${NUM_TESTS} random tests`, () => {
    for (let i = 0; i < NUM_TESTS; i++) {
      // Random modulus between 1 and 100
      const mod = getRandomInt(1, 100);
      const fsm = new NModFSM(mod);

      // Random binary string of length 1 to 50
      const binaryStr = generateRandomBinaryString(getRandomInt(1, 50));

      // Calculate expected using BigInt
      let expectedRemainder = BigInt(0);
      if (binaryStr.length > 0) {
        expectedRemainder = BigInt(`0b${binaryStr}`) % BigInt(mod);
      }

      // Run FSM
      for (const char of binaryStr) {
        fsm.transition(char as BinaryInput);
      }

      // Check result
      // FSM state is "S<remainder>"
      const actualState = fsm.getState();
      const actualRemainder = parseInt(actualState.substring(1), 10);

      try {
        expect(actualRemainder).toBe(Number(expectedRemainder));
      } catch (error) {
        console.error(`Failed on: Mod=${mod}, Binary=${binaryStr}`);
        throw error;
      }
    }
  });

  it('handles large inputs correctly', () => {
    const mod = 123;
    const fsm = new NModFSM(mod);
    // 1000 bits
    const binaryStr = generateRandomBinaryString(1000);

    const expectedRemainder = BigInt(`0b${binaryStr}`) % BigInt(mod);

    for (const char of binaryStr) {
      fsm.transition(char as BinaryInput);
    }

    const actualState = fsm.getState();
    const actualRemainder = parseInt(actualState.substring(1), 10);

    expect(actualRemainder).toBe(Number(expectedRemainder));
  });
});
