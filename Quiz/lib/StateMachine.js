export default class StateMachine {
	constructor() {
		this.states = {};
	}

	add(stateName, state) {
		state.name = stateName;
		this.states[stateName] = state;
		this.currentState = state;
	}

	change(stateName, enterParameters) {
		this.currentState.exit();
		this.currentState = this.states[stateName];
		this.currentState.enter(enterParameters);
	}

	update(parameters) {
		this.currentState.update(parameters);
	}

	render(context) {
		this.currentState.render(context);
	}
}