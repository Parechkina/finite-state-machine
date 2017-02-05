class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initialState = config.initial;
        this.currentState = this.initialState;
        this.normal = config.states.normal;
        this.busy = config.states.busy;
        this.hungry = config.states.hungry;
        this.sleeping = config.states.sleeping;
        this.states = config.states;
        this.previousState = null;
        this.redoState = null;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(state in this){
            this.redoState = null;
            this.previousState = this.currentState;
            this.currentState = state;
        }else{
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

        var state = this.currentState;

        var transitions = this[state].transitions;
        if(event in transitions){
            this.redoState = null;
            this.previousState = this.currentState;
            this.currentState = transitions[event];

        }else{
            throw new Error();
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var eventStates = [];
        if(!event){
            eventStates = Object.keys(this.states);
            return eventStates;
        }

        for(var key in this.states){
            var stateTransitions = this.states[key].transitions;
            if(Object.keys(stateTransitions).indexOf(event) != -1){

                eventStates.push(key);
            }

        }

        return eventStates;

    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.previousState!=null){
            this.redoState = this.currentState;
            this.currentState= this.previousState;
            this.previousState = null;
            return true;
        }
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.redoState!=null){
            this.previousState = this.currentState;
            this.currentState = this.redoState;
            this.redoState = null;
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {

        this.previousState = null;
        this.redoState = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
