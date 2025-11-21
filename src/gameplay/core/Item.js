import { Action } from './Action.js';

/**
 * A non-combat utility or consumable item
 * Item data can contain properties like: { heal: 200, damage: 50, etc. }
 */
export class Item extends Action {
    /**
     * @param {string} name - Display name of the item
     * @param {Object} data - Item data properties (e.g., { heal: 200, damage: 50 })
     * @param {boolean} isConsumable - Determines if the item is removed after use
     * @param {boolean} variableTarget - If true, requires target selection
     * @param {Function} animationCallback - Optional animation callback (source, target, battle) => Promise
     */
    constructor(name, data = {}, isConsumable = true, variableTarget = false, animationCallback = null) {
        super(name, variableTarget, animationCallback);
        this.data = data; // Simple data object with properties like { heal: 200 }
        this.isConsumable = isConsumable;
    }

    /**
     * Execute the item by applying its data properties
     * Returns a Promise that resolves when the item use and animation are complete
     * @param {Entity} source - The entity using the item
     * @param {Entity} target - The target entity
     * @param {BattleEngine} battle - Reference to the battle engine
     * @returns {Promise} Promise that resolves when item use and animation complete
     */
    async execute(source, target, battle) {
        if (!target.isAlive()) return Promise.resolve();

        battle.logEvent(`${source.name} uses ${this.name}!`);

        // Apply heal if present
        if (this.data.heal !== undefined) {
            const oldHP = target.currentHP;
            target.heal(this.data.heal);
            const actualHeal = target.currentHP - oldHP;
            if (actualHeal > 0) {
                battle.logEvent(`${target.name} recovers ${actualHeal} HP!`);
            }
        }

        // Apply damage if present
        if (this.data.damage !== undefined) {
            target.takeDamage(this.data.damage);
            battle.logEvent(`${target.name} takes ${this.data.damage} damage!`);
            if (!target.isAlive()) {
                battle.logEvent(`${target.name} is defeated!`);
            }
        }

        // Apply stat modifications if present
        if (this.data.stats) {
            for (const [statName, value] of Object.entries(this.data.stats)) {
                if (target.stats[statName] !== undefined) {
                    target.stats[statName] += value;
                    battle.logEvent(`${target.name}'s ${statName} ${value >= 0 ? 'increased' : 'decreased'} by ${Math.abs(value)}!`);
                }
            }
        }

        // Remove consumable items from available actions after use
        if (this.isConsumable) {
            const index = source.availableActions.indexOf(this);
            if (index > -1) {
                source.availableActions.splice(index, 1);
            }
        }

        // Play animation and wait for it to complete
        await this.playAnimation(source, target, battle);
    }
}

