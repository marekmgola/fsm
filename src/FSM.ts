import type * as FSMTypes from './types.js';

/**
 * Configuration object for FSM, matching the formal definition.
 * @template S Type of State (Q)
 * @template I Type of Input (Σ)
 */
export interface FSMConfig<S, I> {
  /** Q: Finite set of states */
  states: Set<S>;
  /** Σ: Finite input alphabet */
  alphabet: Set<I>;
  /** q0: Initial state (q0 ∈ Q) */
  initialState: S;
  /** F: Set of accepting/final states (F ⊆ Q) */
  finalStates: Set<S>;
}

/**
 * Abstract base class representing a Finite Automaton (FA).
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
  /** Q: Finite set of states */
  public readonly states: Set<S>;

  /** Σ: Finite input alphabet */
  public readonly alphabet: Set<I>;

  /** q0: Initial state */
  public readonly q0: S;

  /** F: Set of accepting/final states */
  public readonly finalStates: Set<S>;

  /** δ: Transition function (lookup table populated by validation) */
  protected readonly transitions: Map<S, Map<I, S>>;

  /**
   * Initializes the FSM with a configuration object matching the formal definition.
   *
   * @param config The FSM configuration (Q, Σ, q0, F).
   * @throws Error if q0 is not in Q or if F is not a subset of Q.
   */
  constructor(config: FSMConfig<S, I>) {
    this.states = config.states;
    this.alphabet = config.alphabet;
    this.q0 = config.initialState;
    this.finalStates = config.finalStates;

    // Validate q0 ∈ Q
    if (!this.states.has(this.q0)) {
      throw new Error(
        `Initial state ${String(this.q0)} must be in the set of states Q.`,
      );
    }

    // Validate F ⊆ Q
    for (const state of this.finalStates) {
      if (!this.states.has(state)) {
        throw new Error(
          `Final state ${String(state)} must be in the set of states Q.`,
        );
      }
    }

    this.currentState = this.q0;
    this.transitions = new Map();
  }

  /**
   * Abstract method representing the transition function logic δ(q, σ).
   * Must be implemented by subclasses.
   *
   * @param state The current state q.
   * @param input The input symbol σ.
   * @returns The next state.
   */
  protected abstract delta(state: S, input: I): S;

  /**
   * Generates and validates the transition function for all (q, σ) ∈ Q × Σ.
   * Populates the transitions lookup table.
   *
   * This method must be called by the subclass constructor after its own initialization is complete.
   *
   * @throws Error if the abstract delta method returns a state not in Q.
   */
  protected generateTransitions(): void {
    for (const state of this.states) {
      const inputMap = new Map<I, S>();
      for (const input of this.alphabet) {
        const nextState = this.delta(state, input);

        // Validate result is in Q
        if (!this.states.has(nextState)) {
          throw new Error(
            `Transition δ(${String(state)}, ${String(input)}) returned ${String(nextState)}, which is not in Q.`,
          );
        }

        inputMap.set(input, nextState);
      }
      this.transitions.set(state, inputMap);
    }
  }

  /**
   * Transitions the FSM from the current state to the next state based on the input.
   * Uses the pre-validated transition table.
   *
   * @param input The input triggering the transition.
   * @returns The new state of the FSM.
   * @throws Error if transitions have not been generated/validated.
   */
  public transition(input: I): S {
    if (this.transitions.size === 0) {
      throw new Error(
        'Transitions have not been generated. Ensure generateTransitions() is called in the subclass constructor.',
      );
    }

    // Validate Input ∈ Σ
    if (!this.alphabet.has(input)) {
      throw new Error(`Input ${String(input)} is not in the alphabet Σ.`);
    }

    const stateTransitions = this.transitions.get(this.currentState);

    // Should safely exist if generateTransitions was called and currentState is valid
    if (!stateTransitions) {
      throw new Error(
        `No transitions found for state ${String(this.currentState)}. Q may satisfy invariants but map is missing.`,
      );
    }

    const nextState = stateTransitions.get(input);

    if (nextState === undefined) {
      // Should not happen if validation covered all inputs
      throw new Error(
        `Invalid transition for state ${String(this.currentState)} with input ${String(input)}`,
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
   * Checks if the FSM is currently in an accepting/final state.
   */
  public isAccepting(): boolean {
    return this.finalStates.has(this.currentState);
  }

  /**
   * Checks if the current state is a final state.
   * Alias for isAccepting, using the naming convention requested.
   */
  public isFinalState(): boolean {
    return this.finalStates.has(this.currentState);
  }

  /**
   * Resets the FSM to the initial state (q0) or a specific state.
   *
   * @param state Optional state to reset to. If provided, must be in Q.
   */
  public reset(state?: S): void {
    if (state !== undefined) {
      if (!this.states.has(state)) {
        throw new Error(
          `Cannot reset to state ${String(state)} as it is not in Q.`,
        );
      }
      this.currentState = state;
    } else {
      this.currentState = this.q0;
    }
  }
}
