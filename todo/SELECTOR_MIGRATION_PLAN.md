# Selector Argument Migration Plan

## Overview

This document outlines the plan to migrate all command implementations from the old non-generic selector argument types to the new generic type-parameterized versions that provide compile-time validation of selector literals.

## Migration Rationale

### Old Pattern (No Validation)
```typescript
give(
  targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  count?: number,
): FinalCommandOutput
```

**Problem**: Accepts invalid selectors like `give('@e', 'diamond')` without compile errors.

### New Pattern (Compile-Time Validation)
```typescript
give<T extends string>(
  targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  count?: number,
): FinalCommandOutput
```

**Benefit**: Rejects `give('@e', 'diamond')` at compile-time because `'@e'` is not a valid player selector.

## Type Migration Table

| Old Type | New Type | Use Case |
|----------|----------|----------|
| `SinglePlayerArgument<MACRO>` | `SinglePlayerArgumentOf<MACRO, T>` | Single player only (@s, @p, @r, names) |
| `SingleEntityArgument<MACRO>` | `SingleEntityArgumentOf<MACRO, T>` | Single entity (@s, @p, @n, @r, names) |
| `MultiplePlayersArgument<MACRO>` | `MultiplePlayersArgumentOf<MACRO, T>` | Multiple players (@a, @p, @r, @s, names) |
| `MultipleEntitiesArgument<MACRO>` | No generic version exists yet* | Multiple entities (@e, @a, @s, @p, @n, @r, names) |

*Note: `MultipleEntitiesArgument` has no `ArgumentOf` variant in selector.ts because all string literals are valid for multiple entities.

## Validation Rules

From `sandstone/src/arguments/selector.ts`:

- **SinglePlayer**: Rejects `'@a'`, `'@e'`, `'@n'`
- **SingleEntity**: Rejects `'@a'`, `'@e'`
- **MultiplePlayers**: Rejects `'@e'`, `'@n'`
- **MultipleEntities**: No rejections (all valid)

## Migration Pattern

### Step-by-Step Transformation

#### For methods with selector arguments:

**Before:**
```typescript
give(
  targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  count?: number,
) {
  return this.finalCommand([targetParser(targets), item, count])
}
```

**After:**
```typescript
give<T extends string>(
  targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  count?: number,
) {
  return this.finalCommand([targetParser(targets), item, count])
}
```

**Changes:**
1. Add generic type parameter: `<T extends string>`
2. Replace `MultiplePlayersArgument<MACRO>` with `MultiplePlayersArgumentOf<MACRO, T>`
3. No changes to function body or logic

### Multiple Selector Parameters

For commands with multiple selector arguments (e.g., `spectate`, `damage`):

**Before:**
```typescript
spectate(
  target: Macroable<SingleEntityArgument<MACRO>, MACRO>,
  player?: Macroable<SinglePlayerArgument<MACRO>, MACRO>,
)
```

**After:**
```typescript
spectate<T extends string, P extends string>(
  target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
  player?: Macroable<SinglePlayerArgumentOf<MACRO, P>, MACRO>,
)
```

**Note:** Use distinct generic type parameters (T, P, E, S, etc.) for each selector argument.

### Overloaded Methods

For commands with multiple overloads (like `give` with components):

```typescript
// Overload 1
give<T extends string>(
  targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  count?: number,
): FinalCommandOutput

// Overload 2
give<T extends string>(
  targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  components: Macroable<MemberModifiers<SymbolDataComponent>, MACRO>,
  count?: Macroable<number, MACRO>,
): FinalCommandOutput

// Implementation signature
give<T extends string>(
  targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  item: Macroable<Registry['minecraft:item'], MACRO>,
  countOrComponents?: Macroable<any, MACRO>,
  count?: Macroable<number, MACRO>,
)
```

**Pattern:** Add `<T extends string>` to ALL signatures including implementation.

### Arrow Function Methods

For sub-command methods defined as arrow functions:

**Before:**
```typescript
entity = (
  target: Macroable<SingleEntityArgument<MACRO>, MACRO>,
  path?: Macroable<string, MACRO>,
) => this.finalCommand(['entity', targetParser(target), path])
```

**After:**
```typescript
entity = <T extends string>(
  target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
  path?: Macroable<string, MACRO>,
) => this.finalCommand(['entity', targetParser(target), path])
```

**Note:** Arrow functions support generic parameters just like regular methods.

## Files Requiring Migration

### Priority 1: Simple Single-Selector Commands (13 files)

Files with straightforward selector usage, single migration point per file:

1. **player/advancement.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Methods: `grant()`, `revoke()`

2. **player/bossbar.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Method: `set().players()`

3. **player/gamemode.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Method: `gamemode()`

4. **player/recipe.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Methods: `give()`, `take()`

5. **player/spawnpoint.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Method: `spawnpoint()`

6. **player/stopsound.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Method: `stopsound()`

7. **player/title.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Methods: `title()`, `clear()`, `reset()`

8. **server/tell.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Method: `tell()`

9. **server/tellraw.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
   - Method: `tellraw()`

10. **player/playsound.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
    - Method: `playsound()` (source parameter)

11. **player/particle.ts** - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf`
    - Method: `particle()` (viewers parameter)

12. **entity/kill.ts** - `MultipleEntitiesArgument` (no change needed - all strings valid)
    - Method: `kill()`

13. **entity/tag.ts** - `MultipleEntitiesArgument` (no change needed)
    - Methods: `add()`, `remove()`, `list()`

### Priority 2: Multi-Entity Commands (8 files)

Files using `MultipleEntitiesArgument` - no migration needed since all string literals are valid:

14. **entity/clear.ts** - Currently uses `MultiplePlayersArgument` - should migrate
15. **entity/effect.ts** - `MultipleEntitiesArgument` (no change)
16. **entity/enchant.ts** - `MultipleEntitiesArgument` (no change)
17. **entity/team.ts** - `MultipleEntitiesArgument` (no change)
18. **entity/spreadplayers.ts** - `MultipleEntitiesArgument` (no change)
19. **server/me.ts** - `MultipleEntitiesArgument` (no change)
20. **world/item.ts** - `MultipleEntitiesArgument` (no change)
21. **world/loot.ts** - `MultipleEntitiesArgument` (no change)

### Priority 3: Single-Entity Commands (6 files)

Commands requiring single entity validation:

22. **entity/attribute.ts** - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - Method: `attribute()`

23. **entity/damage.ts** - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - Methods: `damage()`, `by()`, `from()` (multiple parameters)

24. **entity/ride.ts** - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - Methods: `mount()`, `dismount()`

25. **player/spectate.ts** - Mixed types
    - `SingleEntityArgument` → `SingleEntityArgumentOf` (target)
    - `SinglePlayerArgument` → `SinglePlayerArgumentOf` (player)

26. **player/experience.ts** - Mixed types
    - `MultiplePlayersArgument` → `MultiplePlayersArgumentOf` (add, set)
    - `SinglePlayerArgument` → `SinglePlayerArgumentOf` (query)

27. **entity/teleport.ts** - Mixed types
    - `MultipleEntitiesArgument` for targets (no change)
    - `SingleEntityArgument` → `SingleEntityArgumentOf` for destination/facing

### Priority 4: Complex Multi-Selector Commands (3 files)

Commands with extensive selector usage requiring careful migration:

28. **world/data.ts** - ✅ Already migrated (uses `SingleEntityArgumentOf`)
    - Methods: `get.entity()`, `merge.entity()`, `modify.entity()`, `remove.entity()`

29. **entity/scoreboard.ts** - `MultipleEntitiesArgument` throughout
    - No changes needed (all strings valid for entity operations)

30. **entity/execute.ts** - Complex nested structure with multiple selector types
    - `as()`, `at()` - `MultipleEntitiesArgument` (no change)
    - `on()` - relation-based targeting (no change)
    - `positioned.as()`, `rotated.as()` - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - `facing.entity()` - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - `store.entity()` - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - `data.entity()` - `SingleEntityArgument` → `SingleEntityArgumentOf`
    - `items.entity()` - `SingleEntityArgument` → `SingleEntityArgumentOf`

## Migration Checklist Per File

For each file being migrated:

- [ ] Identify all selector argument parameters
- [ ] Determine which selector type each parameter uses
- [ ] Check if the type needs migration (see Type Migration Table)
- [ ] Add generic type parameter(s) `<T extends string>` to method signature
- [ ] Replace old selector type with new `ArgumentOf` variant
- [ ] For multiple selectors, use distinct generic names (T, P, E, S)
- [ ] Update all overloads if method has multiple signatures
- [ ] Verify `targetParser()` is still used correctly
- [ ] Test compilation with valid and invalid selectors
- [ ] Update JSDoc if it references selector types

## Special Cases & Gotchas

### 1. Optional Selector Parameters

Some commands have optional selector parameters. The generic type parameter is still required:

```typescript
spawnpoint<T extends string>(
  targets?: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  pos?: Macroable<Coordinates<MACRO>, MACRO>,
)
```

### 2. Methods Returning Subcommands

When a method returns another command class, ensure the MACRO type flows through:

```typescript
get modify() {
  return this.subCommand(['modify'], DataModifyCommand<MACRO>, false)
}
```

The subcommand class itself contains the selector parameters and needs migration.

### 3. Parser Functions

All selector arguments should use `targetParser()` when passed to `finalCommand()`:

```typescript
this.finalCommand(['entity', targetParser(target), path])
```

### 4. Component Patch Stringifier (give.ts pattern)

The `give` command uses a special stringifier for component patches. This logic should remain unchanged:

```typescript
if (typeof countOrComponents === 'object') {
  return this.finalCommand([
    targetParser(targets),
    `${item}${componentPatchStringifier(countOrComponents as any)}`,
    count
  ])
}
```

### 5. MultipleEntitiesArgument - No Migration

Commands using `MultipleEntitiesArgument` do NOT need migration because:
- All selector literals are valid for entity commands
- No string literal validation is needed
- The type already accepts all strings

### 6. Data Point Classes

Some methods accept `DataPointClass` in addition to selector arguments. These don't need changes:

```typescript
storage(source: DataPointClass<'storage'>): void
storage(source: Macroable<string, MACRO>, sourcePath: Macroable<string, MACRO>): void
```

## Import Requirements

Ensure each migrated file imports the new generic types:

```typescript
import type {
  SingleEntityArgumentOf,
  SinglePlayerArgumentOf,
  MultiplePlayersArgumentOf,
  // ... other types
} from 'sandstone/arguments'
```

Old non-generic types can remain imported for backward compatibility or be removed if fully migrated.

## Testing Strategy

### Compile-Time Tests

After migration, verify that:

1. **Valid selectors compile**:
   ```typescript
   give('@a', 'minecraft:diamond')        // ✅
   give('@p', 'minecraft:diamond')        // ✅
   give('PlayerName', 'minecraft:diamond') // ✅
   ```

2. **Invalid selectors are rejected**:
   ```typescript
   give('@e', 'minecraft:diamond')  // ❌ Type error: '@e' not valid for players
   give('@n', 'minecraft:diamond')  // ❌ Type error: '@n' not valid for players
   ```

3. **Selector classes still work**:
   ```typescript
   give(Selector('@a'), 'minecraft:diamond')  // ✅
   give(Selector('@a', { limit: 1 }), 'minecraft:diamond')  // ✅
   ```

### Runtime Tests

Verify existing functionality:
- Commands generate correct Minecraft syntax
- `targetParser()` handles all input types correctly
- Macro arguments work as before
- Edge cases (undefined, optional parameters) behave correctly

## Migration Order

Recommended order to minimize risk:

1. **Phase 1** - Simple commands (Priority 1: 13 files)
   - Low risk, single migration point per file
   - Good for establishing migration pattern

2. **Phase 2** - Single-entity commands (Priority 3: 6 files)
   - Moderate complexity, clear validation benefits

3. **Phase 3** - Execute command (Priority 4: 1 file)
   - High complexity, many migration points
   - Requires thorough testing

4. **Phase 4** - Verification
   - Build all projects
   - Run existing tests
   - Verify no regressions

## Rollback Strategy

If issues arise during migration:

1. **Per-file rollback**: Old types are still available, can revert individual files
2. **Gradual rollout**: Migrate and test one file at a time
3. **Type compatibility**: Old and new types can coexist during migration

## Files NOT Requiring Migration (32 files)

These files don't use selector arguments:

**block/** (4 files): clone, fill, place, setblock
**server/** (13 files): datapack, debug, difficulty, function, gamerule, help, list, random, reload, return, say, schedule, setidletimeout, trigger
**world/** (7 files): forceload, locate, seed, setworldspawn, time, weather, worldborder
**player/** (1 file): item (no selectors)
**_fake/** (2 files): comment, raw
**misc** (5 files): Various utilities

## Success Criteria

Migration is complete when:

- [ ] All 31 files with selector arguments have been reviewed
- [ ] All applicable selector types use generic `ArgumentOf` variants
- [ ] All commands compile without errors
- [ ] Invalid selector literals are rejected at compile-time
- [ ] Valid selector literals and classes are accepted
- [ ] Existing tests pass
- [ ] No runtime regressions in command generation

## Estimated Effort

- **Simple files (13 files)**: ~5 minutes each = 65 minutes
- **Medium files (6 files)**: ~10 minutes each = 60 minutes
- **Complex files (execute)**: ~30 minutes
- **Testing & verification**: ~30 minutes
- **Total**: ~3 hours

## References

- **Type definitions**: `sandstone/src/arguments/selector.ts`
- **Example migrations**:
  - `sandstone/src/commands/implementations/player/give.ts`
  - `sandstone/src/commands/implementations/world/data.ts`
- **Type validation logic**: Lines 28-40 in selector.ts
