import type * as FSMTypes from './types.js';

/**
 * Abstract base class representing a Finite State Machine.
 * Manages the current state and handles transitions based on generic inputs.
 *
 * @template Input The type of input the FSM accepts (default: string | number | boolean).
 */
export abstract class FSM<Input = string | number | boolean> {
  protected currentState: FSMTypes.State;
  protected abstract readonly transitions: Map<
    FSMTypes.State,
    Map<Input, FSMTypes.State>
  >;

  constructor(initialState: FSMTypes.State) {
    this.currentState = initialState;
  }

  /**
   * OP: Transitions the FSM from the current state to the next state based on the input.
   *
   * @param input The input triggering the transition.
   * @returns The new state of the FSM.
   * @throws Error if no transition is defined for the current state and input.
   */
  public transition(input: Input): FSMTypes.State {
    const stateTransitions = this.transitions.get(this.currentState);

    if (!stateTransitions) {
      throw new Error(`No transitions defined for state ${this.currentState}`);
    }

    const nextState = stateTransitions.get(input);

    if (!nextState) {
      throw new Error(
        `Invalid transition for state ${this.currentState} with input ${input}`,
      );
    }

    this.currentState = nextState;
    return this.currentState;
  }

  /**
   * Retrieves the current state of the FSM.
   *
   * @returns The current state.
   */
  public getState(): FSMTypes.State {
    return this.currentState;
  }

  /**
   * Resets the FSM to a specific state.
   *
   * @param initialState The state to reset to.
   */
  public reset(initialState: FSMTypes.State): void {
    this.currentState = initialState;
  }
}
