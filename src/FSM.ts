import type * as FSMTypes from './types.js';

/**
 * Abstract base class representing a Finite State Machine.
 * Manages the current state and handles transitions based on generic inputs.
 *
 * @template Input The type of input the FSM accepts (default: string | number | boolean).
 */
/**
 * Configuration object for FSM.
 * @template S Type of State (Q)
 * @template I Type of Input (Σ)
 */
/**
 * Configuration object for FSM.
 * @template S Type of State (Q)
 * @template I Type of Input (Σ)
 */
export interface FSMConfig<S, I> {
  /** q0: Initial state (defaults to 'S0') */
  initialState?: S;
  /** δ: Transition function */
  transitions: Map<S, Map<I, S>>;
}

/**
 * Abstract base class representing a Finite State Machine.
 * Manages the current state and handles transitions based on generic inputs.
 *
 * Formal Definition: (Q, Σ, q0, F, δ)
 * Q: Finite set of states
 * Σ: Finite input alphabet
 * q0: Initial state (q0 ∈ Q)
 * F: Set of accepting/final states (F ⊆ Q)
 * δ: Transition function (δ: Q × Σ → Q)
 *
 * @template S The type of state in the FSM.
 * @template I The type of input the FSM accepts.
 */
export abstract class FSM<S = FSMTypes.State, I = string | number | boolean> {
  protected currentState: S;

  // Formal properties
  /** q0: Initial state */
  protected readonly q0: S;

  /** δ: Transition function */
  protected readonly transitions: Map<S, Map<I, S>>;

  /**
   * Initializes the FSM with a configuration object.
   *
   * @param config The FSM configuration (q0, δ).
   */
  constructor(config: FSMConfig<S, I>) {
    this.q0 = config.initialState ?? ('S0' as S);
    this.transitions = config.transitions;
    this.currentState = this.q0;
  }

  /**
   * OP: Transitions the FSM from the current state to the next state based on the input.
   *
   * @param input The input triggering the transition.
   * @returns The new state of the FSM.
   * @throws Error if no transition is defined for the current state and input.
   */
  public transition(input: I): S {
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
  public getState(): S {
    return this.currentState;
  }

  /**
   * Resets the FSM to the initial state (q0) or a specific state.
   *
   * @param initialState Optional state to reset to. If not provided, resets to q0.
   */
  public reset(initialState?: S): void {
    if (initialState) {
      this.currentState = initialState;
    } else {
      this.currentState = this.q0;
    }
  }
}
