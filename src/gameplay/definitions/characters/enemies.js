import { Entity } from '../../core/Entity.js';
import { createClawSwipe, createHeavySlam } from '../items/weapons.js';

/**
 * Enemy character definitions
 * Each function returns a new Entity instance
 */

/**
 * Goblin - Weak enemy
 */
export function createGoblin() {
    return new Entity(
        'Goblin',
        60,
        {
            ATK: 10,
            DEF: 8,
            SPD: 12
        },
        [createClawSwipe()],
        'assets/art/characters/hero-2.png' // Placeholder - use actual goblin image
    );
}

/**
 * Orc - Strong enemy
 */
export function createOrc() {
    return new Entity(
        'Orc',
        80,
        {
            ATK: 18,
            DEF: 15,
            SPD: 8
        },
        [createHeavySlam()],
        'assets/art/characters/hero-2.png' // Placeholder - use actual orc image
    );
}

/**
 * Skeleton - Fast but weak enemy
 */
export function createSkeleton() {
    return new Entity(
        'Skeleton',
        50,
        {
            ATK: 12,
            DEF: 5,
            SPD: 16
        },
        [createClawSwipe()],
        'assets/art/characters/hero-2.png' // Placeholder
    );
}

