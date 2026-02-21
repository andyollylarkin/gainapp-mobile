export default class StateMachine<S extends string> {
  private currentState: S;
  private transitionMap: Record<S, readonly S[]>;

  constructor(
    public initialState: S,
    public states: Record<S, readonly S[]>,
  ) {
    this.currentState = initialState;
    this.transitionMap = states;
  }

  getState(): S {
    return this.currentState;
  }

  canTransitionTo(nextState: S): boolean {
    const allowedTransitions = this.transitionMap[this.currentState];
    return allowedTransitions.includes(nextState);
  }

  transitionTo(nextState: S): boolean {
    if (this.canTransitionTo(nextState)) {
      this.currentState = nextState;
      return true;
    }
    return false;
  }
}