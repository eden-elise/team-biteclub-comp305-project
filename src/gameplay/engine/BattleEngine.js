/**
 * Manages the state, turn order, and flow of the entire battle
 */
export class BattleEngine {
    /**
     * @param {Entity} entityA - First combatant
     * @param {Entity} entityB - Second combatant
     */
    constructor(entityA, entityB) {
        this.entityA = entityA;
        this.entityB = entityB;
        this.turnOrderQueue = []; // List<Entity>
        this.battleLog = []; // List<String>
        this.globalState = {}; // Map/Object for global conditions
        this.isBattleActive = false;
        this.onBattleEnd = null; // Callback function(winner, loser) called when battle ends
    }

    /**
     * Initializes entitys, sets up the log, and determines initial turn order
     */
    startBattle() {
        this.isBattleActive = true;
        this.battleLog = [];
        this.globalState = {};
        this.determineTurnOrder();
        this.logEvent('Battle begins!');
        this.logEvent(`${this.entityA.name} vs ${this.entityB.name}`);
    }

    /**
     * Determines turn order based on Speed stat
     */
    determineTurnOrder() {
        this.turnOrderQueue = [];

        // Higher speed goes first
        if (this.entityA.stats.SPD >= this.entityB.stats.SPD) {
            this.turnOrderQueue.push(this.entityA, this.entityB);
        } else {
            this.turnOrderQueue.push(this.entityB, this.entityA);
        }
    }

    /**
     * Process a single turn for a entity
     * 1. Apply pre-turn status effects (onTurnStart)
     * 2. Execute Action.execute() (waits for animation)
     * 3. Apply post-turn status effects (onTurnEnd)
     * 4. Check for win/loss conditions
     * @param {Entity} entity - The entity taking the turn
     * @param {Action} action - The action to perform
     * @param {Entity} target - The target entity
     * @returns {Promise} Promise that resolves when the turn and animations are complete
     */
    async processTurn(entity, action, target) {
        if (!this.isBattleActive || !entity.isAlive()) {
            return Promise.resolve();
        }

        this.logEvent(`--- ${entity.name}'s turn ---`);

        // 1. Process pre-turn status effects
        entity.processStatusEffectsTurnStart(this);

        // 2. Execute the action (waits for animation to complete)
        if (action) {
            await action.execute(entity, target, this);
        }

        // 3. Process post-turn status effects (decrements duration, removes expired effects)
        entity.processStatusEffectsTurnEnd(this);

        // 4. Check for win/loss conditions
        this.checkBattleEnd();
    }

    /**
     * Check if the battle has ended
     */
    checkBattleEnd() {
        if (!this.entityA.isAlive()) {
            this.isBattleActive = false;
            this.logEvent(`${this.entityB.name} wins!`);
            if (this.onBattleEnd) {
                this.onBattleEnd(this.entityB, this.entityA);
            }
        } else if (!this.entityB.isAlive()) {
            this.isBattleActive = false;
            this.logEvent(`${this.entityA.name} wins!`);
            if (this.onBattleEnd) {
                this.onBattleEnd(this.entityA, this.entityB);
            }
        }
    }

    /**
     * Adds a message to the battleLog
     * @param {string} message - The message to log
     */
    logEvent(message) {
        this.battleLog.push(message);
        console.log(`[Battle] ${message}`);
    }

    /**
     * Get the current battle log
     * @returns {Array<string>} - The battle log
     */
    getBattleLog() {
        return this.battleLog;
    }
}

