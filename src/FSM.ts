import type * as FSMTypes from './types.js';

export abstract class FSM<Input = string | number | boolean> {
  protected currentState: FSMTypes.State;
  protected abstract readonly transitions: Map<
    FSMTypes.State,
    Map<Input, FSMTypes.State>
  >;

  constructor(initialState: FSMTypes.State) {
    this.currentState = initialState;
  }

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

  public getState(): FSMTypes.State {
    return this.currentState;
  }

  public reset(initialState: FSMTypes.State): void {
    this.currentState = initialState;
  }
}
