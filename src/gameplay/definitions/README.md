# Definitions System

This folder contains all item and character definitions for the combat system. Files are organized by category and loaded all at once when the module is imported.

## Folder Structure

```
definitions/
├── items/
│   ├── potions.js      # Potion definitions
│   └── weapons.js       # Weapon/Attack definitions
├── characters/
│   ├── heroes.js        # Player character definitions
│   └── enemies.js      # Enemy character definitions
└── index.js             # Main export file (loads everything)
```

## Usage

### Method 1: Direct Import (Recommended)

Import specific definition files directly:

```javascript
import { createHealthPotion, createStrengthElixir } from './combat/definitions/items/potions.js';
import { createHero } from './combat/definitions/characters/heroes.js';
import { createGoblin } from './combat/definitions/characters/enemies.js';

// Use the definitions
const potion = createHealthPotion();
const hero = createHero();
const goblin = createGoblin();
```

### Method 2: Namespace Import

Import entire namespaces:

```javascript
import { potions, heroes, enemies, weapons } from './combat/definitions/index.js';

const potion = potions.createHealthPotion();
const hero = heroes.createHero();
const goblin = enemies.createGoblin();
const attack = weapons.createBasicStrike();
```

**Note:** All definitions are loaded immediately when the module is imported. This happens at game startup, so there's no performance penalty.

## Creating New Definitions

### Adding a New Potion

Edit `items/potions.js`:

```javascript
import { Item } from '../../core/Item.js';

export function createMyNewPotion() {
    return new Item(
        'My New Potion',
        { heal: 300 },
        true, // consumable
        false, // variableTarget
        null // animation callback (optional)
    );
}
```

### Adding a New Weapon/Attack

Edit `items/weapons.js`:

```javascript
import { Attack } from '../../core/Attack.js';

export function createMyNewAttack() {
    return new Attack(
        'My New Attack',
        60, // basePower
        false, // variableTarget
        null // animation callback (optional)
    );
}
```

### Adding a New Character

Edit `characters/heroes.js` or `characters/enemies.js`:

```javascript
import { Entity } from '../../core/Entity.js';
import { createBasicStrike } from '../items/weapons.js';

export function createMyNewCharacter() {
    return new Entity(
        'My Character',
        120,
        { ATK: 16, DEF: 14, SPD: 10 },
        [createBasicStrike()],
        'assets/art/characters/my-character.png'
    );
}
```

## Why JavaScript Files Instead of JSON?

JavaScript files are used instead of JSON because:

1. **Direct Class Usage**: You can import and use `Item`, `Attack`, and `Entity` classes directly
2. **Functions**: Each definition is a function that returns a new instance, preventing shared state
3. **Animation Callbacks**: Can include animation functions directly in the definition
4. **Type Safety**: Better IDE support and type checking
5. **Flexibility**: Can include logic, calculations, or conditional creation

If you prefer JSON, you would need to:
- Parse JSON files
- Manually construct objects using `new Item()`, `new Attack()`, etc.
- Handle animation callbacks separately
- More boilerplate code

## File Naming Convention

- Use camelCase for function names: `createHealthPotion()`
- Use descriptive names that indicate what the function creates
- Group related items in the same file (e.g., all potions in `potions.js`)

## Best Practices

1. **One function per definition**: Each function creates one item/character
2. **Export all functions**: Make sure to export each creation function
3. **Use imports**: Import shared attacks/items from other definition files
4. **Keep it simple**: Definitions should just create instances, not contain complex logic
5. **Add comments**: Document what each definition does

