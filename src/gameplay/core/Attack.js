import { Action } from './Action.js';

/**
 * A combat move focused on dealing damage
 */
export class Attack extends Action {
    /**
     * @param {string} name - Display name of the attack
     * @param {number} basePower - The base damage modifier
     * @param {boolean} variableTarget - If true, requires target selection
     * @param {Function} animationCallback - Optional animation callback (source, target, battle) => Promise
     */
    constructor(name, basePower, variableTarget = false, animationCallback = null) {
        super(name, variableTarget, animationCallback);
        this.basePower = basePower;
    }

    /**
     * Execute the attack
     * Returns a Promise that resolves when the attack and animation are complete
     * @param {Entity} source - The entity performing the attack
     * @param {Entity} target - The target entity
     * @param {BattleEngine} battle - Reference to the battle engine
     * @returns {Promise} Promise that resolves when attack and animation complete
     */
    async execute(source, target, battle) {
        if (!target.isAlive()) return Promise.resolve();

        battle.logEvent(`${source.name} uses ${this.name}!`);

        // Calculate damage: (source ATK * basePower) - (target DEF / 2)
        const baseDamage = source.stats.ATK * this.basePower;
        const defenseReduction = target.stats.DEF / 2;
        const damage = Math.max(1, Math.floor(baseDamage - defenseReduction));

        target.takeDamage(damage);
        battle.logEvent(`${target.name} takes ${damage} damage!`);

        if (!target.isAlive()) {
            battle.logEvent(`${target.name} is defeated!`);
        }

        // Play animation and wait for it to complete
        await this.playAnimation(source, target, battle);
    }
}

