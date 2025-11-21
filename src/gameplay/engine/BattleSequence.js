import { BattleEngine } from './BattleEngine.js';

/**
 * BattleSequence manages the complete battle flow from start to finish.
 * Returns a promise that resolves when the battle ends, indicating the winner and loser.
 * 
 * Usage:
 * const battleSequence = new BattleSequence(player, enemy);
 * battleSequence.start().then(result => {
 *   if (result.loser === 'player') {
 *     // Handle player defeat
 *   } else {
 *     // Handle enemy defeat
 *   }
 * });
 */
export class BattleSequence {
    /**
     * @param {Entity} player - The player entity
     * @param {Entity} enemy - The enemy entity
     * @param {Function} targetSelectionCallback - Callback for target selection (action, availableTargets) => Promise<Entity>
     */
    constructor(player, enemy, targetSelectionCallback = null) {
        this.player = player;
        this.enemy = enemy;
        this.battleEngine = new BattleEngine(player, enemy);
        this.battlePromise = null;
        this.battleResolve = null;
        this.battleReject = null;
        this.targetSelectionCallback = targetSelectionCallback; // Function(action, availableTargets) => Promise<Entity>
    }

    /**
     * Starts the battle sequence.
     * Sets up the battle and returns a promise that resolves when the battle ends.
     * 
     * Note: The battle view UI should call processTurn() when actions are selected.
     * The promise will resolve automatically when one entity's HP reaches 0.
     * 
     * @returns {Promise<BattleResult>} Promise that resolves with battle result
     * @property {Entity} winner - The winning entity
     * @property {Entity} loser - The losing entity
     * @property {string} loserType - Either 'player' or 'enemy'
     */
    start() {
        // Create promise for battle completion
        this.battlePromise = new Promise((resolve, reject) => {
            this.battleResolve = resolve;
            this.battleReject = reject;
        });

        // Initialize battle
        this.battleEngine.startBattle();

        // Set up battle end callback
        // This will be called automatically when checkBattleEnd() detects a winner
        this.battleEngine.onBattleEnd = (winner, loser) => {
            const loserType = loser === this.player ? 'player' : 'enemy';
            this.battleResolve({
                winner: winner,
                loser: loser,
                loserType: loserType
            });
        };

        return this.battlePromise;
    }

    /**
     * Get the battle engine instance (for UI to interact with)
     * @returns {BattleEngine}
     */
    getBattleEngine() {
        return this.battleEngine;
    }

    /**
     * Get player image path
     * @returns {string}
     */
    getPlayerImage() {
        return this.player.image;
    }

    /**
     * Get enemy image path
     * @returns {string}
     */
    getEnemyImage() {
        return this.enemy.image;
    }

    /**
     * Process a turn in the battle
     * Handles variable target selection if needed and waits for animations to complete
     * @param {Entity} entity - The entity taking the turn
     * @param {Action} action - The action to perform
     * @param {Entity} target - The target entity (ignored if action.variableTarget is true)
     * @returns {Promise} Promise that resolves when the turn and all animations are complete
     */
    async processTurn(entity, action, target) {
        // If action requires target selection, prompt for it
        let finalTarget = target;
        if (action.variableTarget && this.targetSelectionCallback) {
            const availableTargets = [this.player, this.enemy].filter(u => u.isAlive());
            finalTarget = await this.targetSelectionCallback(action, availableTargets);
        }

        // Process the turn (which will wait for animations)
        await this.battleEngine.processTurn(entity, action, finalTarget);
    }

    /**
     * Set the target selection callback
     * @param {Function} callback - Function(action, availableTargets) => Promise<Entity>
     */
    setTargetSelectionCallback(callback) {
        this.targetSelectionCallback = callback;
    }

    /**
     * Check if battle is still active
     * @returns {boolean}
     */
    isActive() {
        return this.battleEngine.isBattleActive;
    }
}

