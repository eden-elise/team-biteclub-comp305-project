import { Item } from '../../core/Item.js';

/**
 * Potion definitions
 * Each function returns a new Item instance
 */

/**
 * Health Potion - Restores 200 HP
 */
export function createHealthPotion() {
    return new Item(
        'Health Potion',
        { heal: 200 },
        true, // consumable
        false, // variableTarget
        null // animation (can be added later)
    );
}

/**
 * Greater Health Potion - Restores 500 HP
 */
export function createGreaterHealthPotion() {
    return new Item(
        'Greater Health Potion',
        { heal: 500 },
        true,
        false,
        null
    );
}

/**
 * Mana Potion - Restores 100 MP (if you add MP stat)
 */
export function createManaPotion() {
    return new Item(
        'Mana Potion',
        { stats: { MP: 100 } }, // Adjust based on your stat system
        true,
        false,
        null
    );
}

/**
 * Strength Elixir - Increases ATK by 5
 * Variable target - can be used on player or enemy
 */
export function createStrengthElixir() {
    return new Item(
        'Strength Elixir',
        { stats: { ATK: 5 } },
        true,
        true, // variableTarget
        null
    );
}

/**
 * Defense Elixir - Increases DEF by 5
 * Variable target - can be used on player or enemy
 */
export function createDefenseElixir() {
    return new Item(
        'Defense Elixir',
        { stats: { DEF: 5 } },
        true,
        true, // variableTarget
        null
    );
}

/**
 * Poison Flask - Deals 50 damage
 * Variable target - can be used on player or enemy
 */
export function createPoisonFlask() {
    return new Item(
        'Poison Flask',
        { damage: 50 },
        true,
        true, // variableTarget
        null
    );
}

