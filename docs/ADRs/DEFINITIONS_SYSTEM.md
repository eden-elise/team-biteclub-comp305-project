# Definitions System Architecture

## Working concept as of 11/20/2025, not reviewed by team yet

## Context
Need organized system for defining items, weapons, and characters. Must be maintainable, discoverable, and load efficiently at game startup.

## Decision
**Multiple files for semantic clarity, single import for practical use.**

### **Structure**
```
definitions/
├── items/
│   ├── potions.js      # All potion definitions
│   └── weapons.js       # All weapon/attack definitions
├── characters/
│   ├── heroes.js        # Player character definitions
│   └── enemies.js       # Enemy character definitions
└── index.js             # Single entry point
```

### **Loading Strategy**
- **Files**: Separated by semantic category (potions, weapons, heroes, enemies)
- **Loading**: All loaded at once via direct exports in `index.js`
- **Usage**: Import namespaces directly: `import { potions, heroes } from './definitions/index.js'`

## Rationale

### **Why Multiple Files?**
- **Semantic clarity**: Easy to find "where do I add a new potion?" → `potions.js`
- **Organization**: Related items grouped together
- **Maintainability**: Large files split by category, not one massive file
- **Collaboration**: Multiple developers can work on different categories

### **Why Load All At Once?**
- **Reality**: Games load all assets at startup anyway
- **Simplicity**: No async complexity, no dynamic loading logic
- **Performance**: Module imports are cached, no runtime overhead
- **Predictability**: Everything available immediately, no loading states

### **Why JavaScript Over JSON?**
- **Direct class usage**: Import `Item`, `Attack`, `Entity` directly
- **Functions**: Each definition is a function returning new instance (prevents shared state)
- **Animation callbacks**: Can include functions directly in definitions
- **Type safety**: Better IDE support and autocomplete
- **Less boilerplate**: No manual object construction from JSON

## Implementation

### **Definition Files**
Each file exports factory functions:
```javascript
export function createHealthPotion() {
    return new Item('Health Potion', { heal: 200 }, true, false, null);
}
```

### **Index File**
Simple re-exports:
```javascript
export * as potions from './items/potions.js';
export * as weapons from './items/weapons.js';
export * as heroes from './characters/heroes.js';
export * as enemies from './characters/enemies.js';
```

### **Usage**
```javascript
import { potions, heroes } from './combat/definitions/index.js';
const hero = heroes.createHero();
const potion = potions.createHealthPotion();
```

## Consequences

### ✅ **Benefits**
- **Clear organization**: Easy to find and add definitions
- **Simple loading**: No async complexity, everything available immediately
- **Type-safe**: Full IDE support and autocomplete
- **Maintainable**: Logical file structure scales well

### ⚠️ **Trade-offs**
- All definitions loaded even if unused (acceptable for game startup)
- Manual file creation required (no auto-discovery, but explicit is better)

## Alternatives Considered

### **Single File**
❌ Rejected: Would become unwieldy with many definitions

### **JSON Files**
❌ Rejected: Requires manual object construction, can't include functions, more boilerplate

### **Dynamic Async Loading**
❌ Rejected: Unnecessary complexity when everything loads at startup anyway

### **Auto-discovery**
❌ Rejected: Explicit files are clearer and easier to maintain

