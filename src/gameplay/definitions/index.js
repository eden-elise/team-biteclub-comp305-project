/**
 * All definitions - loaded when this module is imported
 * 
 * Usage:
 * import { potions, heroes, enemies } from './combat/definitions/index.js';
 * const hero = heroes.createHero();
 * const potion = potions.createHealthPotion();
 */

// Direct exports - all loaded at once when module is imported
export * as potions from './items/potions.js';
export * as weapons from './items/weapons.js';
export * as heroes from './characters/heroes.js';
export * as enemies from './characters/enemies.js';

