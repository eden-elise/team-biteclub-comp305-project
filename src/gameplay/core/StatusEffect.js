/**
 * Represents a status effect that can be applied to an Entity
 * Status effects can modify stats, deal damage over time, heal over time, etc.
 */
export class StatusEffect {
    /**
     * @param {string} name - Name of the status effect
     * @param {number} duration - Number of turns the effect lasts (-1 for permanent)
     * @param {string} icon - Path to the icon image (not used by this class, for UI)
     * @param {Object} statModifiers - Object with stat modifications (e.g., { ATK: 5, DEF: -2 })
     * @param {Function} onTurnStart - Callback(entity, battleEngine) called at start of each turn
     * @param {Function} onTurnEnd - Callback(entity, battleEngine) called at end of each turn
     * @param {Function} onApply - Callback(entity, battleEngine) called when effect is applied
     * @param {Function} onRemove - Callback(entity, battleEngine) called when effect is removed
     */
    constructor(name, duration = -1, icon = '', statModifiers = {}, onTurnStart = null, onTurnEnd = null, onApply = null, onRemove = null) {
        this.name = name;
        this.duration = duration; // -1 means permanent
        this.remainingTurns = duration;
        this.icon = icon; // Path to icon image (for UI use, not used by this class)
        this.statModifiers = statModifiers; // Object like { ATK: 5, DEF: -2 }
        this.entity = null; // Reference to the entity this effect is applied to

        // Callbacks
        this.onTurnStart = onTurnStart; // (entity, battleEngine) => void
        this.onTurnEnd = onTurnEnd; // (entity, battleEngine) => void
        this.onApply = onApply; // (entity, battleEngine) => void
        this.onRemove = onRemove; // (entity, battleEngine) => void
    }

    /**
     * Apply this status effect to an entity
     * @param {Entity} entity - The entity to apply the effect to
     * @param {BattleEngine} battleEngine - The battle engine (optional, for callbacks)
     */
    apply(entity, battleEngine = null) {
        this.entity = entity;
        if (this.onApply) {
            this.onApply(entity, battleEngine);
        }
    }

    /**
     * Remove this status effect from its entity
     * @param {BattleEngine} battleEngine - The battle engine (optional, for callbacks)
     */
    remove(battleEngine = null) {
        if (this.onRemove && this.entity) {
            this.onRemove(this.entity, battleEngine);
        }
        if (this.entity) {
            this.entity.removeStatusEffect(this);
        }
        this.entity = null;
    }

    /**
     * Process turn start for this status effect
     * @param {Entity} entity - The entity with this effect
     * @param {BattleEngine} battleEngine - The battle engine
     */
    processTurnStart(entity, battleEngine) {
        if (this.onTurnStart) {
            this.onTurnStart(entity, battleEngine);
        }
    }

    /**
     * Process turn end for this status effect
     * Decrements duration and removes if expired
     * @param {Entity} entity - The entity with this effect
     * @param {BattleEngine} battleEngine - The battle engine
     */
    processTurnEnd(entity, battleEngine) {
        if (this.onTurnEnd) {
            this.onTurnEnd(entity, battleEngine);
        }

        // Decrement duration if not permanent
        if (this.duration > 0) {
            this.remainingTurns--;
            if (this.remainingTurns <= 0) {
                this.remove(battleEngine);
            }
        }
    }

    /**
     * Get the modified stat value for a given stat
     * @param {string} statName - Name of the stat (e.g., 'ATK', 'DEF')
     * @param {number} baseValue - The base stat value
     * @returns {number} The modified stat value
     */
    getModifiedStat(statName, baseValue) {
        const modifier = this.statModifiers[statName] || 0;
        return baseValue + modifier;
    }

    /**
     * Check if this effect is permanent
     * @returns {boolean}
     */
    isPermanent() {
        return this.duration === -1;
    }

    /**
     * Check if this effect has expired
     * @returns {boolean}
     */
    isExpired() {
        return this.duration > 0 && this.remainingTurns <= 0;
    }
}

