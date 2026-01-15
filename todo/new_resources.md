# Resources to Implement

This document tracks resources defined in `SymbolResource` that need implementation in Sandstone.

## Datapack Resources

| Resource | Folder Path | Type Definition |
|----------|-------------|-----------------|
| banner_pattern | `data/<namespace>/banner_pattern/` | `BannerPattern` |
| chat_type | `data/<namespace>/chat_type/` | `ChatType` |
| dialog | `data/<namespace>/dialog/` | `Dialog` |
| enchantment | `data/<namespace>/enchantment/` | `Enchantment` |
| enchantment_provider | `data/<namespace>/enchantment_provider/` | `EnchantmentProvider` |
| instrument | `data/<namespace>/instrument/` | `Instrument` |
| jukebox_song | `data/<namespace>/jukebox_song/` | `JukeboxSong` |
| test_environment | `data/<namespace>/test_environment/` | `TestEnvironment` |
| test_instance | `data/<namespace>/test_instance/` | `TestInstance` |
| timeline | `data/<namespace>/timeline/` | `Timeline` |
| world_clock | `data/<namespace>/world_clock/` | `WorldClock` |
| trade_set | `data/<namespace>/trade_set/` | `TradeSet` |
| trial_spawner | `data/<namespace>/trial_spawner/` | `TrialSpawnerConfig` |
| villager_trade | `data/<namespace>/villager_trade/` | `VillagerTrade` |

### Variants

| Resource | Folder Path | Type Definition |
|----------|-------------|-----------------|
| cat_variant | `data/<namespace>/cat_variant/` | `CatVariant` |
| chicken_variant | `data/<namespace>/chicken_variant/` | `ChickenVariant` |
| cow_variant | `data/<namespace>/cow_variant/` | `CowVariant` |
| frog_variant | `data/<namespace>/frog_variant/` | `FrogVariant` |
| painting_variant | `data/<namespace>/painting_variant/` | `PaintingVariant` |
| pig_variant | `data/<namespace>/pig_variant/` | `PigVariant` |
| wolf_sound_variant | `data/<namespace>/wolf_sound_variant/` | `WolfSoundVariant` |
| wolf_variant | `data/<namespace>/wolf_variant/` | `WolfVariant` |
| zombie_nautilus_variant | `data/<namespace>/zombie_nautilus_variant/` | `ZombieNautilusVariant` |

## Resource Pack Resources

| Resource | Folder Path | Type Definition |
|----------|-------------|-----------------|
| equipment | `assets/<namespace>/equipment/` | `Equipment` |
| particle | `assets/<namespace>/particles/` | `Particle` |
| post_effect | `assets/<namespace>/post_effect/` | `PostEffect` |
| shader | `assets/<namespace>/shaders/` | `ShaderProgram` |
| waypoint_style | `assets/<namespace>/waypoint_style/` | `WaypointStyle` |

## Currently Implemented

### Datapack
- advancement
- damageType
- itemModifier
- lootTable
- mcfunction
- predicate
- recipe
- structure
- tag
- trimMaterial
- trimPattern

### Resource Pack
- atlas
- blockstate
- font
- itemDefinition
- language
- model
- sound
- text
- texture
- textureMeta

## Summary

| Category | Missing | Implemented |
|----------|---------|-------------|
| Datapack | 14 | 11 |
| Variants | 9 | 0 |
| Resource Pack | 5 | 10 |
| **Total** | **28** | **21** |

## Notes

- Enchantment and enchantment_provider should be implemented together
- Test_environment and test_instance should be implemented together
- Timeline and world_clock should be implemented together
- Worldgen resources (biome, dimension, features, etc.) are deferred for later
