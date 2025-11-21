/**
 * Represents any entity that can participate in combat
 */
export class Entity {
    /**
     * @param {string} name - The entity's name
     * @param {number} maxHP - Maximum Health
     * @param {Object} stats - Dictionary of core stats (e.g., ATK, DEF, SPD)
     * @param {Array<Action>} availableActions - The pool of moves and items this entity can use
     * @param {string} image - Path to the entity's image/sprite
     */
    constructor(name, maxHP, stats = {}, availableActions = [], image = '') {
        this.name = name;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.stats = {
            ATK: 10,
            DEF: 10,
            SPD: 10,
            ...stats
        };
        this.activeEffects = []; // List<StatusEffect>
        this.availableActions = availableActions; // List<Action>
        this.image = image; // Path to image/sprite
    }

    /**
     * Check if the entity is alive
     * @returns {boolean}
     */
    isAlive() {
        return this.currentHP > 0;
    }

    /**
     * Take damage (can be overridden for special behavior)
     * @param {number} damage - Amount of damage to take
     */
    takeDamage(damage) {
        this.currentHP = Math.max(0, this.currentHP - damage);
    }

    /**
     * Heal the entity
     * @param {number} amount - Amount to heal
     */
    heal(amount) {
        this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
    }

    /**
     * Add a status effect to this entity
     * @param {StatusEffect} statusEffect - The status effect to add
     * @param {BattleEngine} battleEngine - The battle engine (optional, for callbacks)
     */
    addStatusEffect(statusEffect, battleEngine = null) {
        statusEffect.apply(this, battleEngine);
        this.activeEffects.push(statusEffect);
    }

    /**
     * Remove a status effect from this entity
     * @param {StatusEffect} statusEffect - The status effect to remove
     */
    removeStatusEffect(statusEffect) {
        const index = this.activeEffects.indexOf(statusEffect);
        if (index > -1) {
            this.activeEffects.splice(index, 1);
        }
    }

    /**
     * Get all active status effects
     * @returns {Array<StatusEffect>}
     */
    getStatusEffects() {
        return this.activeEffects;
    }

    /**
     * Get a stat value with all status effect modifications applied
     * @param {string} statName - Name of the stat (e.g., 'ATK', 'DEF')
     * @returns {number} The modified stat value
     */
    getModifiedStat(statName) {
        let value = this.stats[statName] || 0;
        for (const effect of this.activeEffects) {
            value = effect.getModifiedStat(statName, value);
        }
        return value;
    }

    /**
     * Process turn start for all active status effects
     * @param {BattleEngine} battleEngine - The battle engine
     */
    processStatusEffectsTurnStart(battleEngine) {
        // Create a copy to avoid issues if effects are removed during iteration
        const effects = [...this.activeEffects];
        for (const effect of effects) {
            effect.processTurnStart(this, battleEngine);
        }
    }

    /**
     * Process turn end for all active status effects
     * @param {BattleEngine} battleEngine - The battle engine
     */
    processStatusEffectsTurnEnd(battleEngine) {
        // Create a copy to avoid issues if effects are removed during iteration
        const effects = [...this.activeEffects];
        for (const effect of effects) {
            effect.processTurnEnd(this, battleEngine);
        }
    }
}

