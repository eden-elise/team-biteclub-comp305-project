import { Attack } from '../../core/Attack.js';

/**
 * Weapon/Attack definitions
 * Each function returns a new Attack instance
 */

/**
 * Basic Strike - Simple melee attack
 */
export function createBasicStrike() {
    return new Attack(
        'Basic Strike',
        50, // basePower
        false, // variableTarget
        null // animation
    );
}

/**
 * Heavy Slam - Powerful but slow attack
 */
export function createHeavySlam() {
    return new Attack(
        'Heavy Slam',
        80, // basePower
        false,
        null
    );
}

/**
 * Quick Slash - Fast attack
 */
export function createQuickSlash() {
    return new Attack(
        'Quick Slash',
        40, // basePower
        false,
        null
    );
}

/**
 * Claw Swipe - Enemy attack
 */
export function createClawSwipe() {
    return new Attack(
        'Claw Swipe',
        40, // basePower
        false,
        null
    );
}

