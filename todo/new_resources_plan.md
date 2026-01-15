# New Resources Implementation Plan

This document provides implementation plans for all pending resources identified in `new_resources.md`.

## Implementation Pattern

All resources follow the same pattern as `trimMaterial.ts`:

```typescript
// 1. Node class - extends ContainerNode, implements ResourceNode
export class {Name}Node extends ContainerNode implements ResourceNode<{Name}Class> {
  constructor(sandstoneCore: SandstoneCore, public resource: {Name}Class) {
    super(sandstoneCore)
  }
  getValue = () => JSON.stringify(this.resource.{name}JSON)
}

// 2. Arguments type - uses SymbolResource for JSON type
export type {Name}ClassArguments = {
  {name}: SymbolResource['{resource_key}']
} & ResourceClassArguments<'default'>

// 3. Resource class - extends ResourceClass
export class {Name}Class extends ResourceClass<{Name}Node> {
  public {name}JSON: NonNullable<{Name}ClassArguments['{name}']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: {Name}ClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      {Name}Node,
      sandstoneCore.pack.resourceToPath(name, ['{folder_name}']),
      args,
    )
    this.{name}JSON = args.{name}
    this.handleConflicts()
  }
}
```

---

## Datapack Resources

### 1. banner_pattern
- **File**: `src/core/resources/datapack/bannerPattern.ts`
- **Folder**: `data/<namespace>/banner_pattern/`
- **Type**: `BannerPattern` from `data/variants/banner_pattern.ts`
- **JSON Structure**: `{ asset_id, translation_key }`
- **Notes**: Simple JSON resource with texture reference and translation key

### 2. chat_type
- **File**: `src/core/resources/datapack/chatType.ts`
- **Folder**: `data/<namespace>/chat_type/`
- **Type**: `ChatType` from `data/chat_type.ts`
- **JSON Structure**: `{ chat?: ChatDecoration, narration?: ChatDecoration }`
- **Notes**: Defines how chat messages are formatted and narrated

### 3. dialog
- **File**: `src/core/resources/datapack/dialog.ts`
- **Folder**: `data/<namespace>/dialog/`
- **Type**: `Dialog` from `data/dialog.ts`
- **JSON Structure**: Polymorphic type with `confirmation`, `dialog_list`, `multi_action`, `notice`, `server_links` variants
- **Notes**: Complex type with multiple dialog types. Uses dispatcher pattern.

### 4. enchantment / enchantment_provider
- **File**: `src/core/resources/datapack/enchantment.ts`
- **Folders**:
  - `data/<namespace>/enchantment/`
  - `data/<namespace>/enchantment_provider/`
- **Types**:
  - `Enchantment` from `data/enchantment.ts`
  - `EnchantmentProvider` from `data/enchantment/provider.ts`
- **JSON Structure (Enchantment)**: `{ description, exclusive_set?, supported_items, primary_items?, weight, max_level, min_cost, max_cost, anvil_cost, slots, effects? }`
- **Notes**: Both classes in same file. Enchantment defines the enchantment itself, provider defines how enchantments are applied

### 5. instrument
- **File**: `src/core/resources/datapack/instrument.ts`
- **Folder**: `data/<namespace>/instrument/`
- **Type**: `Instrument` from `data/variants/instrument.ts`
- **JSON Structure**: `{ sound_event, range, use_duration, description }`
- **Notes**: Defines goat horn instruments

### 6. jukebox_song
- **File**: `src/core/resources/datapack/jukeboxSong.ts`
- **Folder**: `data/<namespace>/jukebox_song/`
- **Type**: `JukeboxSong` from `data/variants/jukebox_song.ts`
- **JSON Structure**: `{ description, comparator_output, length_in_seconds, sound_event }`
- **Notes**: Defines music disc songs

### 7. test_environment / test_instance
- **File**: `src/core/resources/datapack/gametest.ts`
- **Folders**:
  - `data/<namespace>/test_environment/`
  - `data/<namespace>/test_instance/`
- **Types**:
  - `TestEnvironment` from `data/gametest/test_environment.ts`
  - `TestInstance` from `data/gametest.ts`
- **Notes**: Both classes in same file. Used for Minecraft's built-in game test framework

### 8. timeline / world_clock
- **File**: `src/core/resources/datapack/timeline.ts`
- **Folders**:
  - `data/<namespace>/timeline/`
  - `data/<namespace>/world_clock/`
- **Types**:
  - `Timeline` from `data/timeline.ts`
  - `WorldClock` - empty record type
- **JSON Structure (Timeline)**: `{ period_ticks?, clock, time_markers?, tracks? }`
- **Notes**: Both classes in same file. Timeline controls environment attributes over time, world_clock is referenced by timelines

### 9. trade_set
- **File**: `src/core/resources/datapack/tradeSet.ts`
- **Folder**: `data/<namespace>/trade_set/`
- **Type**: `TradeSet` from `data/trade_set.ts`
- **JSON Structure**: `{ trades, amount, allow_duplicates?, random_sequence? }`
- **Notes**: Defines sets of trades for villagers

### 10. trial_spawner
- **File**: `src/core/resources/datapack/trialSpawner.ts`
- **Folder**: `data/<namespace>/trial_spawner/`
- **Type**: `TrialSpawnerConfig` from `data/trial_spawner.ts`
- **JSON Structure**: `{ spawn_range?, total_mobs?, simultaneous_mobs?, ticks_between_spawn?, spawn_potentials?, loot_tables_to_eject?, items_to_drop_when_ominous? }`
- **Notes**: Configures trial spawner behavior in trial chambers

### 11. villager_trade
- **File**: `src/core/resources/datapack/villagerTrade.ts`
- **Folder**: `data/<namespace>/villager_trade/`
- **Type**: `VillagerTrade` from `data/villager_trade.ts`
- **Notes**: Individual trade definition, referenced by trade_set

---

## Datapack Variants

All variants use a single generic `VariantClass<T>` in one file.

- **File**: `src/core/resources/datapack/variant.ts`
- **Folder Pattern**: `data/<namespace>/{variant_type}/`

### Variant Types

| Type Key | Folder | JSON Type |
|----------|--------|-----------|
| `cat` | `cat_variant/` | `CatVariant` |
| `chicken` | `chicken_variant/` | `ChickenVariant` |
| `cow` | `cow_variant/` | `CowVariant` |
| `frog` | `frog_variant/` | `FrogVariant` |
| `painting` | `painting_variant/` | `PaintingVariant` |
| `pig` | `pig_variant/` | `PigVariant` |
| `wolf_sound` | `wolf_sound_variant/` | `WolfSoundVariant` |
| `wolf` | `wolf_variant/` | `WolfVariant` |
| `zombie_nautilus` | `zombie_nautilus_variant/` | `ZombieNautilusVariant` |

### Implementation

```typescript
import type { SymbolResource } from 'sandstone/arguments'

type VariantType =
  | 'cat'
  | 'chicken'
  | 'cow'
  | 'frog'
  | 'painting'
  | 'pig'
  | 'wolf_sound'
  | 'wolf'
  | 'zombie_nautilus'

export class VariantNode<T extends VariantType> extends ContainerNode implements ResourceNode<VariantClass<T>> {
  constructor(sandstoneCore: SandstoneCore, public resource: VariantClass<T>) {
    super(sandstoneCore)
  }
  getValue = () => JSON.stringify(this.resource.variantJSON)
}

export type VariantClassArguments<T extends VariantType> = {
  variant: SymbolResource[`${T}_variant`]
} & ResourceClassArguments<'default'>

export class VariantClass<T extends VariantType> extends ResourceClass<VariantNode<T>> {
  public variantJSON: SymbolResource[`${T}_variant`]

  constructor(
    sandstoneCore: SandstoneCore,
    public variantType: T,
    name: string,
    args: VariantClassArguments<T>,
  ) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      VariantNode,
      sandstoneCore.pack.resourceToPath(name, [`${variantType}_variant`]),
      args,
    )
    this.variantJSON = args.variant
    this.handleConflicts()
  }
}
```

---

## Resource Pack Resources

Resource pack resources use `resourcePack()` instead of `dataPack()` and are placed in `assets/` instead of `data/`.

### 21. equipment
- **File**: `src/core/resources/resourcepack/equipment.ts`
- **Folder**: `assets/<namespace>/equipment/`
- **Type**: `Equipment` from `assets/equipment.ts`
- **JSON Structure**: `{ layers: { humanoid?, humanoid_leggings?, wings?, wolf_body?, ... } }`
- **Notes**: Defines equipment layer textures for armor rendering

### 22. particle
- **File**: `src/core/resources/resourcepack/particle.ts`
- **Folder**: `assets/<namespace>/particles/`
- **Type**: `Particle` from `assets/particle.ts`
- **JSON Structure**: `{ textures: string[] }`
- **Notes**: Simple resource defining particle textures

### 23. post_effect
- **File**: `src/core/resources/resourcepack/postEffect.ts`
- **Folder**: `assets/<namespace>/post_effect/`
- **Type**: `PostEffect` from `assets/shader/post.ts`
- **JSON Structure**: `{ targets?, passes? }`
- **Notes**: Defines post-processing shader effects (replaces old shaders system)

### 24. shader
- **File**: `src/core/resources/resourcepack/shader.ts`
- **Folder**: `assets/<namespace>/shaders/`
- **Type**: `ShaderProgram` from `assets/shader/program.ts`
- **Notes**: Core shader programs, may need multiple file types (`.vsh`, `.fsh`, `.json`)

### 25. waypoint_style
- **File**: `src/core/resources/resourcepack/waypointStyle.ts`
- **Folder**: `assets/<namespace>/waypoint_style/`
- **Type**: `WaypointStyle` from `assets/waypoint_style.ts`
- **JSON Structure**: `{ near_distance?, far_distance?, sprites }`
- **Notes**: Defines waypoint indicator appearance

---

## Implementation Checklist

For each resource:
1. [ ] Create the resource file with Node and Class
2. [ ] Export from `index.ts` (datapack or resourcepack)
3. [ ] Add factory method to `SandstonePack` in `src/pack/pack.ts`
4. [ ] Test with a sample resource

---

## SandstonePack Factory Methods

All resource classes need factory methods on `SandstonePack`. Pattern:

```typescript
// In src/pack/pack.ts

ResourceName = (name: string, resourceData: NonNullable<SymbolResource['resource_key']>, options?: Partial<ResourceClassArguments>) =>
  new ResourceClass(this.core, name, {
    resourceData,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('resource_key') as ResourceClassArguments['onConflict'],
    ...options,
  })
```

### Datapack Methods to Add

```typescript
BannerPattern = (name: string, bannerPattern: NonNullable<SymbolResource['banner_pattern']>, options?: Partial<BannerPatternClassArguments>) =>
  new BannerPatternClass(this.core, name, { bannerPattern, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('banner_pattern'), ...options })

ChatType = (name: string, chatType: NonNullable<SymbolResource['chat_type']>, options?: Partial<ChatTypeClassArguments>) =>
  new ChatTypeClass(this.core, name, { chatType, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('chat_type'), ...options })

Dialog = (name: string, dialog: NonNullable<SymbolResource['dialog']>, options?: Partial<DialogClassArguments>) =>
  new DialogClass(this.core, name, { dialog, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('dialog'), ...options })

Enchantment = (name: string, enchantment: NonNullable<SymbolResource['enchantment']>, options?: Partial<EnchantmentClassArguments>) =>
  new EnchantmentClass(this.core, name, { enchantment, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('enchantment'), ...options })

EnchantmentProvider = (name: string, enchantmentProvider: NonNullable<SymbolResource['enchantment_provider']>, options?: Partial<EnchantmentProviderClassArguments>) =>
  new EnchantmentProviderClass(this.core, name, { enchantmentProvider, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('enchantment_provider'), ...options })

Instrument = (name: string, instrument: NonNullable<SymbolResource['instrument']>, options?: Partial<InstrumentClassArguments>) =>
  new InstrumentClass(this.core, name, { instrument, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('instrument'), ...options })

JukeboxSong = (name: string, jukeboxSong: NonNullable<SymbolResource['jukebox_song']>, options?: Partial<JukeboxSongClassArguments>) =>
  new JukeboxSongClass(this.core, name, { jukeboxSong, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('jukebox_song'), ...options })

TestEnvironment = (name: string, testEnvironment: NonNullable<SymbolResource['test_environment']>, options?: Partial<TestEnvironmentClassArguments>) =>
  new TestEnvironmentClass(this.core, name, { testEnvironment, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('test_environment'), ...options })

TestInstance = (name: string, testInstance: NonNullable<SymbolResource['test_instance']>, options?: Partial<TestInstanceClassArguments>) =>
  new TestInstanceClass(this.core, name, { testInstance, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('test_instance'), ...options })

Timeline = (name: string, timeline: NonNullable<SymbolResource['timeline']>, options?: Partial<TimelineClassArguments>) =>
  new TimelineClass(this.core, name, { timeline, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('timeline'), ...options })

WorldClock = (name: string, worldClock: NonNullable<SymbolResource['world_clock']>, options?: Partial<WorldClockClassArguments>) =>
  new WorldClockClass(this.core, name, { worldClock, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('world_clock'), ...options })

TradeSet = (name: string, tradeSet: NonNullable<SymbolResource['trade_set']>, options?: Partial<TradeSetClassArguments>) =>
  new TradeSetClass(this.core, name, { tradeSet, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('trade_set'), ...options })

TrialSpawner = (name: string, trialSpawner: NonNullable<SymbolResource['trial_spawner']>, options?: Partial<TrialSpawnerClassArguments>) =>
  new TrialSpawnerClass(this.core, name, { trialSpawner, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('trial_spawner'), ...options })

VillagerTrade = (name: string, villagerTrade: NonNullable<SymbolResource['villager_trade']>, options?: Partial<VillagerTradeClassArguments>) =>
  new VillagerTradeClass(this.core, name, { villagerTrade, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('villager_trade'), ...options })

// Generic variant method
Variant = <T extends VariantType>(type: T, name: string, variant: NonNullable<SymbolResource[`${T}_variant`]>, options?: Partial<VariantClassArguments<T>>) =>
  new VariantClass(this.core, type, name, { variant, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults(`${type}_variant`), ...options })
```

### Resource Pack Methods to Add

```typescript
Equipment = (name: string, equipment: NonNullable<SymbolResource['equipment']>, options?: Partial<EquipmentClassArguments>) =>
  new EquipmentClass(this.core, name, { equipment, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('equipment'), ...options })

Particle = (name: string, particle: NonNullable<SymbolResource['particle']>, options?: Partial<ParticleClassArguments>) =>
  new ParticleClass(this.core, name, { particle, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('particle'), ...options })

PostEffect = (name: string, postEffect: NonNullable<SymbolResource['post_effect']>, options?: Partial<PostEffectClassArguments>) =>
  new PostEffectClass(this.core, name, { postEffect, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('post_effect'), ...options })

Shader = (name: string, shader: NonNullable<SymbolResource['shader']>, options?: Partial<ShaderClassArguments>) =>
  new ShaderClass(this.core, name, { shader, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('shader'), ...options })

WaypointStyle = (name: string, waypointStyle: NonNullable<SymbolResource['waypoint_style']>, options?: Partial<WaypointStyleClassArguments>) =>
  new WaypointStyleClass(this.core, name, { waypointStyle, creator: 'user', addToSandstoneCore: true, onConflict: conflictDefaults('waypoint_style'), ...options })
```

## File Updates Required

### `src/core/resources/datapack/index.ts`
Add exports for all new datapack resources:
```typescript
export * from './bannerPattern'
export * from './chatType'
export * from './dialog'
export * from './enchantment'        // includes EnchantmentProvider
export * from './gametest'           // includes TestEnvironment, TestInstance
export * from './instrument'
export * from './jukeboxSong'
export * from './timeline'           // includes WorldClock
export * from './tradeSet'
export * from './trialSpawner'
export * from './variant'            // generic VariantClass<T> for all variants
export * from './villagerTrade'
```

### `src/core/resources/resourcepack/index.ts`
Add exports for new resource pack resources:
```typescript
export * from './equipment'
export * from './particle'
export * from './postEffect'
export * from './shader'
export * from './waypointStyle'
```

