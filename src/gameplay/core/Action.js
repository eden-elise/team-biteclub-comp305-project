/**
 * Base class for all turn-based choices
 */
export class Action {
    /**
     * @param {string} name - Display name of the action
     * @param {boolean} variableTarget - If true, requires target selection before execution
     * @param {Function} animationCallback - Optional callback that returns a Promise for the animation
     */
    constructor(name, variableTarget = false, animationCallback = null) {
        this.name = name;
        this.variableTarget = variableTarget; // If true, UI must prompt for target selection
        this.animationCallback = animationCallback; // Function(source, target, battle) => Promise
    }

    /**
     * Execute the action
     * Returns a Promise that resolves when the action and its animation are complete
     * @param {Entity} source - The entity performing the action
     * @param {Entity} target - The target entity
     * @param {BattleEngine} battle - Reference to the battle engine
     * @returns {Promise} Promise that resolves when action and animation complete
     */
    execute(source, target, battle) {
        throw new Error('execute() must be implemented by subclass');
    }

    /**
     * Play the animation for this action
     * @param {Entity} source - The entity performing the action
     * @param {Entity} target - The target entity
     * @param {BattleEngine} battle - Reference to the battle engine
     * @returns {Promise} Promise that resolves when animation completes
     */
    playAnimation(source, target, battle) {
        if (this.animationCallback) {
            return this.animationCallback(source, target, battle);
        }
        // Default: resolve immediately (no animation)
        return Promise.resolve();
    }
}

