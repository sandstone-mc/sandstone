import type { NBTInt } from 'sandstone'

type JsonGameRuleDispatcherMap = {
  'advance_time': JsonGameRuleAdvanceTime,
  'minecraft:advance_time': JsonGameRuleAdvanceTime,
  'advance_weather': JsonGameRuleAdvanceWeather,
  'minecraft:advance_weather': JsonGameRuleAdvanceWeather,
  'allow_entering_nether_using_portals': JsonGameRuleAllowEnteringNetherUsingPortals,
  'minecraft:allow_entering_nether_using_portals': JsonGameRuleAllowEnteringNetherUsingPortals,
  'block_drops': JsonGameRuleBlockDrops,
  'minecraft:block_drops': JsonGameRuleBlockDrops,
  'block_explosion_drop_decay': JsonGameRuleBlockExplosionDropDecay,
  'minecraft:block_explosion_drop_decay': JsonGameRuleBlockExplosionDropDecay,
  'command_block_output': JsonGameRuleCommandBlockOutput,
  'minecraft:command_block_output': JsonGameRuleCommandBlockOutput,
  'command_blocks_work': JsonGameRuleCommandBlocksWork,
  'minecraft:command_blocks_work': JsonGameRuleCommandBlocksWork,
  'drowning_damage': JsonGameRuleDrowningDamage,
  'minecraft:drowning_damage': JsonGameRuleDrowningDamage,
  'elytra_movement_check': JsonGameRuleElytraMovementCheck,
  'minecraft:elytra_movement_check': JsonGameRuleElytraMovementCheck,
  'ender_pearls_vanish_on_death': JsonGameRuleEnderPearlsVanishOnDeath,
  'minecraft:ender_pearls_vanish_on_death': JsonGameRuleEnderPearlsVanishOnDeath,
  'entity_drops': JsonGameRuleEntityDrops,
  'minecraft:entity_drops': JsonGameRuleEntityDrops,
  'fall_damage': JsonGameRuleFallDamage,
  'minecraft:fall_damage': JsonGameRuleFallDamage,
  'fire_damage': JsonGameRuleFireDamage,
  'minecraft:fire_damage': JsonGameRuleFireDamage,
  'fire_spread_radius_around_player': JsonGameRuleFireSpreadRadiusAroundPlayer,
  'minecraft:fire_spread_radius_around_player': JsonGameRuleFireSpreadRadiusAroundPlayer,
  'forgive_dead_players': JsonGameRuleForgiveDeadPlayers,
  'minecraft:forgive_dead_players': JsonGameRuleForgiveDeadPlayers,
  'freeze_damage': JsonGameRuleFreezeDamage,
  'minecraft:freeze_damage': JsonGameRuleFreezeDamage,
  'global_sound_events': JsonGameRuleGlobalSoundEvents,
  'minecraft:global_sound_events': JsonGameRuleGlobalSoundEvents,
  'immediate_respawn': JsonGameRuleImmediateRespawn,
  'minecraft:immediate_respawn': JsonGameRuleImmediateRespawn,
  'keep_inventory': JsonGameRuleKeepInventory,
  'minecraft:keep_inventory': JsonGameRuleKeepInventory,
  'lava_source_conversion': JsonGameRuleLavaSourceConversion,
  'minecraft:lava_source_conversion': JsonGameRuleLavaSourceConversion,
  'limited_crafting': JsonGameRuleLimitedCrafting,
  'minecraft:limited_crafting': JsonGameRuleLimitedCrafting,
  'locator_bar': JsonGameRuleLocatorBar,
  'minecraft:locator_bar': JsonGameRuleLocatorBar,
  'log_admin_commands': JsonGameRuleLogAdminCommands,
  'minecraft:log_admin_commands': JsonGameRuleLogAdminCommands,
  'max_block_modifications': JsonGameRuleMaxBlockModifications,
  'minecraft:max_block_modifications': JsonGameRuleMaxBlockModifications,
  'max_command_forks': JsonGameRuleMaxCommandForks,
  'minecraft:max_command_forks': JsonGameRuleMaxCommandForks,
  'max_command_sequence_length': JsonGameRuleMaxCommandSequenceLength,
  'minecraft:max_command_sequence_length': JsonGameRuleMaxCommandSequenceLength,
  'max_entity_cramming': JsonGameRuleMaxEntityCramming,
  'minecraft:max_entity_cramming': JsonGameRuleMaxEntityCramming,
  'max_minecart_speed': JsonGameRuleMaxMinecartSpeed,
  'minecraft:max_minecart_speed': JsonGameRuleMaxMinecartSpeed,
  'max_snow_accumulation_height': JsonGameRuleMaxSnowAccumulationHeight,
  'minecraft:max_snow_accumulation_height': JsonGameRuleMaxSnowAccumulationHeight,
  'mob_drops': JsonGameRuleMobDrops,
  'minecraft:mob_drops': JsonGameRuleMobDrops,
  'mob_explosion_drop_decay': JsonGameRuleMobExplosionDropDecay,
  'minecraft:mob_explosion_drop_decay': JsonGameRuleMobExplosionDropDecay,
  'mob_griefing': JsonGameRuleMobGriefing,
  'minecraft:mob_griefing': JsonGameRuleMobGriefing,
  'natural_health_regeneration': JsonGameRuleNaturalHealthRegeneration,
  'minecraft:natural_health_regeneration': JsonGameRuleNaturalHealthRegeneration,
  'player_movement_check': JsonGameRulePlayerMovementCheck,
  'minecraft:player_movement_check': JsonGameRulePlayerMovementCheck,
  'players_nether_portal_creative_delay': JsonGameRulePlayersNetherPortalCreativeDelay,
  'minecraft:players_nether_portal_creative_delay': JsonGameRulePlayersNetherPortalCreativeDelay,
  'players_nether_portal_default_delay': JsonGameRulePlayersNetherPortalDefaultDelay,
  'minecraft:players_nether_portal_default_delay': JsonGameRulePlayersNetherPortalDefaultDelay,
  'players_sleeping_percentage': JsonGameRulePlayersSleepingPercentage,
  'minecraft:players_sleeping_percentage': JsonGameRulePlayersSleepingPercentage,
  'projectiles_can_break_blocks': JsonGameRuleProjectilesCanBreakBlocks,
  'minecraft:projectiles_can_break_blocks': JsonGameRuleProjectilesCanBreakBlocks,
  'pvp': JsonGameRulePvp,
  'minecraft:pvp': JsonGameRulePvp,
  'raids': JsonGameRuleRaids,
  'minecraft:raids': JsonGameRuleRaids,
  'random_tick_speed': JsonGameRuleRandomTickSpeed,
  'minecraft:random_tick_speed': JsonGameRuleRandomTickSpeed,
  'reduced_debug_info': JsonGameRuleReducedDebugInfo,
  'minecraft:reduced_debug_info': JsonGameRuleReducedDebugInfo,
  'respawn_radius': JsonGameRuleRespawnRadius,
  'minecraft:respawn_radius': JsonGameRuleRespawnRadius,
  'send_command_feedback': JsonGameRuleSendCommandFeedback,
  'minecraft:send_command_feedback': JsonGameRuleSendCommandFeedback,
  'show_death_messages': JsonGameRuleShowDeathMessages,
  'minecraft:show_death_messages': JsonGameRuleShowDeathMessages,
  'spawn_mobs': JsonGameRuleSpawnMobs,
  'minecraft:spawn_mobs': JsonGameRuleSpawnMobs,
  'spawn_monsters': JsonGameRuleSpawnMonsters,
  'minecraft:spawn_monsters': JsonGameRuleSpawnMonsters,
  'spawn_patrols': JsonGameRuleSpawnPatrols,
  'minecraft:spawn_patrols': JsonGameRuleSpawnPatrols,
  'spawn_phantoms': JsonGameRuleSpawnPhantoms,
  'minecraft:spawn_phantoms': JsonGameRuleSpawnPhantoms,
  'spawn_wandering_traders': JsonGameRuleSpawnWanderingTraders,
  'minecraft:spawn_wandering_traders': JsonGameRuleSpawnWanderingTraders,
  'spawn_wardens': JsonGameRuleSpawnWardens,
  'minecraft:spawn_wardens': JsonGameRuleSpawnWardens,
  'spawner_blocks_work': JsonGameRuleSpawnerBlocksWork,
  'minecraft:spawner_blocks_work': JsonGameRuleSpawnerBlocksWork,
  'spectators_generate_chunks': JsonGameRuleSpectatorsGenerateChunks,
  'minecraft:spectators_generate_chunks': JsonGameRuleSpectatorsGenerateChunks,
  'spread_vines': JsonGameRuleSpreadVines,
  'minecraft:spread_vines': JsonGameRuleSpreadVines,
  'tnt_explodes': JsonGameRuleTntExplodes,
  'minecraft:tnt_explodes': JsonGameRuleTntExplodes,
  'tnt_explosion_drop_decay': JsonGameRuleTntExplosionDropDecay,
  'minecraft:tnt_explosion_drop_decay': JsonGameRuleTntExplosionDropDecay,
  'universal_anger': JsonGameRuleUniversalAnger,
  'minecraft:universal_anger': JsonGameRuleUniversalAnger,
  'water_source_conversion': JsonGameRuleWaterSourceConversion,
  'minecraft:water_source_conversion': JsonGameRuleWaterSourceConversion,
}
type JsonGameRuleKeys = keyof JsonGameRuleDispatcherMap
type JsonGameRuleFallback = (
  | JsonGameRuleAdvanceTime
  | JsonGameRuleAdvanceWeather
  | JsonGameRuleAllowEnteringNetherUsingPortals
  | JsonGameRuleBlockDrops
  | JsonGameRuleBlockExplosionDropDecay
  | JsonGameRuleCommandBlockOutput
  | JsonGameRuleCommandBlocksWork
  | JsonGameRuleDrowningDamage
  | JsonGameRuleElytraMovementCheck
  | JsonGameRuleEnderPearlsVanishOnDeath
  | JsonGameRuleEntityDrops
  | JsonGameRuleFallDamage
  | JsonGameRuleFireDamage
  | JsonGameRuleFireSpreadRadiusAroundPlayer
  | JsonGameRuleForgiveDeadPlayers
  | JsonGameRuleFreezeDamage
  | JsonGameRuleGlobalSoundEvents
  | JsonGameRuleImmediateRespawn
  | JsonGameRuleKeepInventory
  | JsonGameRuleLavaSourceConversion
  | JsonGameRuleLimitedCrafting
  | JsonGameRuleLocatorBar
  | JsonGameRuleLogAdminCommands
  | JsonGameRuleMaxBlockModifications
  | JsonGameRuleMaxCommandForks
  | JsonGameRuleMaxCommandSequenceLength
  | JsonGameRuleMaxEntityCramming
  | JsonGameRuleMaxMinecartSpeed
  | JsonGameRuleMaxSnowAccumulationHeight
  | JsonGameRuleMobDrops
  | JsonGameRuleMobExplosionDropDecay
  | JsonGameRuleMobGriefing
  | JsonGameRuleNaturalHealthRegeneration
  | JsonGameRulePlayerMovementCheck
  | JsonGameRulePlayersNetherPortalCreativeDelay
  | JsonGameRulePlayersNetherPortalDefaultDelay
  | JsonGameRulePlayersSleepingPercentage
  | JsonGameRuleProjectilesCanBreakBlocks
  | JsonGameRulePvp
  | JsonGameRuleRaids
  | JsonGameRuleRandomTickSpeed
  | JsonGameRuleReducedDebugInfo
  | JsonGameRuleRespawnRadius
  | JsonGameRuleSendCommandFeedback
  | JsonGameRuleShowDeathMessages
  | JsonGameRuleSpawnMobs
  | JsonGameRuleSpawnMonsters
  | JsonGameRuleSpawnPatrols
  | JsonGameRuleSpawnPhantoms
  | JsonGameRuleSpawnWanderingTraders
  | JsonGameRuleSpawnWardens
  | JsonGameRuleSpawnerBlocksWork
  | JsonGameRuleSpectatorsGenerateChunks
  | JsonGameRuleSpreadVines
  | JsonGameRuleTntExplodes
  | JsonGameRuleTntExplosionDropDecay
  | JsonGameRuleUniversalAnger
  | JsonGameRuleWaterSourceConversion)
type JsonGameRuleAdvanceTime = boolean
type JsonGameRuleAdvanceWeather = boolean
type JsonGameRuleAllowEnteringNetherUsingPortals = boolean
type JsonGameRuleBlockDrops = boolean
type JsonGameRuleBlockExplosionDropDecay = boolean
type JsonGameRuleCommandBlockOutput = boolean
type JsonGameRuleCommandBlocksWork = boolean
type JsonGameRuleDrowningDamage = boolean
type JsonGameRuleElytraMovementCheck = boolean
type JsonGameRuleEnderPearlsVanishOnDeath = boolean
type JsonGameRuleEntityDrops = boolean
type JsonGameRuleFallDamage = boolean
type JsonGameRuleFireDamage = boolean
type JsonGameRuleFireSpreadRadiusAroundPlayer = (NBTInt<{}> | number)
type JsonGameRuleForgiveDeadPlayers = boolean
type JsonGameRuleFreezeDamage = boolean
type JsonGameRuleGlobalSoundEvents = boolean
type JsonGameRuleImmediateRespawn = boolean
type JsonGameRuleKeepInventory = boolean
type JsonGameRuleLavaSourceConversion = boolean
type JsonGameRuleLimitedCrafting = boolean
type JsonGameRuleLocatorBar = boolean
type JsonGameRuleLogAdminCommands = boolean
type JsonGameRuleMaxBlockModifications = (NBTInt<{
  min: 1,
}> | number)
type JsonGameRuleMaxCommandForks = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRuleMaxCommandSequenceLength = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRuleMaxEntityCramming = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRuleMaxMinecartSpeed = (NBTInt<{
  min: 1,
}> | number)
type JsonGameRuleMaxSnowAccumulationHeight = (NBTInt<{
  min: 0,
  max: 8,
}> | number)
type JsonGameRuleMobDrops = boolean
type JsonGameRuleMobExplosionDropDecay = boolean
type JsonGameRuleMobGriefing = boolean
type JsonGameRuleNaturalHealthRegeneration = boolean
type JsonGameRulePlayerMovementCheck = boolean
type JsonGameRulePlayersNetherPortalCreativeDelay = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRulePlayersNetherPortalDefaultDelay = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRulePlayersSleepingPercentage = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRuleProjectilesCanBreakBlocks = boolean
type JsonGameRulePvp = boolean
type JsonGameRuleRaids = boolean
type JsonGameRuleRandomTickSpeed = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRuleReducedDebugInfo = boolean
type JsonGameRuleRespawnRadius = (NBTInt<{
  min: 0,
}> | number)
type JsonGameRuleSendCommandFeedback = boolean
type JsonGameRuleShowDeathMessages = boolean
type JsonGameRuleSpawnMobs = boolean
type JsonGameRuleSpawnMonsters = boolean
type JsonGameRuleSpawnPatrols = boolean
type JsonGameRuleSpawnPhantoms = boolean
type JsonGameRuleSpawnWanderingTraders = boolean
type JsonGameRuleSpawnWardens = boolean
type JsonGameRuleSpawnerBlocksWork = boolean
type JsonGameRuleSpectatorsGenerateChunks = boolean
type JsonGameRuleSpreadVines = boolean
type JsonGameRuleTntExplodes = boolean
type JsonGameRuleTntExplosionDropDecay = boolean
type JsonGameRuleUniversalAnger = boolean
type JsonGameRuleWaterSourceConversion = boolean
export type JsonSymbolGameRule<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonGameRuleDispatcherMap
  : CASE extends 'keys' ? JsonGameRuleKeys : CASE extends '%fallback' ? JsonGameRuleFallback : never
