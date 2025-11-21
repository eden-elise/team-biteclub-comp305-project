# Combat System Architecture

## Working concept as of 11/20/2025, not reviewed by team yet

## Context
Turn-based combat system requiring flexibility, extensibility, and clean separation of concerns. Must integrate seamlessly with main game flow using promises for async battle completion.

## Decision
Five-layer architecture with clear responsibilities:

### **1. Core Combatants** (`Entity`)
- Single concrete class (no PlayerEntity/EnemyEntity distinction)
- Represents any combat entity
- Properties: `name`, `maxHP`, `currentHP`, `stats`, `activeEffects`, `availableActions`, `image`

### **2. Actions** (`Action` → `Attack`, `Item`)
- Abstract base for all turn-based choices
- `Attack`: Deals damage based on stats
- `Item`: Applies effects via data object (`{ heal: 200 }`, `{ damage: 50 }`, `{ stats: { ATK: 5 } }`)
- Supports `variableTarget` flag for target selection
- Supports animation callbacks (returns Promise)

### **3. Effects**
- **Removed** - Simplified to direct data properties on Items
- Items specify effects directly: `{ heal: 200 }` instead of `[new HealEffect(200)]`

### **4. Status Effects** (`StatusEffect`)
- Persistent conditions with `onTurnStart()`, `onTurnEnd()`, `onDamageReceived()`
- Applied via `Entity.activeEffects`

### **5. Battle Flow** (`BattleSequence` → `BattleEngine`)
- `BattleSequence`: Manages complete battle lifecycle
  - Returns Promise resolving when battle ends
  - Handles target selection for variable-target actions
  - Waits for animations to complete
- `BattleEngine`: Core battle logic and state management

## Consequences

### ✅ **Benefits**
- **Simple**: No complex effect chains, just data properties
- **Extensible**: Add new items by creating functions in definitions folder
- **Async-ready**: Promise-based flow integrates with game loop
- **Animation-aware**: Actions wait for animations before continuing
- **Target selection**: Built-in support for variable-target actions

### ⚠️ **Trade-offs**
- Less granular than effect system (can't compose complex effect chains)
- Single Entity class means no type distinction between player/enemy (handled by context instead)

## Key Design Choices

### **No Effect Classes**
Items use simple data objects instead of effect classes. Trade-off: less composability, more simplicity.

### **Single Entity Class**
One `Entity` class for all entities. Player/enemy distinction handled by game context, not type system.

### **Promise-Based Flow**
`BattleSequence.start()` returns Promise. Battle view processes turns, battle ends when HP reaches 0, promise resolves with winner/loser.

### **Animation Integration**
Actions return Promises from `execute()`. Battle flow waits for animations before continuing.

### **Variable Targets**
Actions can set `variableTarget: true`. BattleSequence prompts for target selection via callback before execution.

