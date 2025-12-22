import type { NBTInt } from 'sandstone'

type GameRuleDispatcherMap = {
  'advance_time': GameRuleAdvanceTime
  'minecraft:advance_time': GameRuleAdvanceTime
  'advance_weather': GameRuleAdvanceWeather
  'minecraft:advance_weather': GameRuleAdvanceWeather
  'allow_entering_nether_using_portals': GameRuleAllowEnteringNetherUsingPortals
  'minecraft:allow_entering_nether_using_portals': GameRuleAllowEnteringNetherUsingPortals
  'block_drops': GameRuleBlockDrops
  'minecraft:block_drops': GameRuleBlockDrops
  'block_explosion_drop_decay': GameRuleBlockExplosionDropDecay
  'minecraft:block_explosion_drop_decay': GameRuleBlockExplosionDropDecay
  'command_block_output': GameRuleCommandBlockOutput
  'minecraft:command_block_output': GameRuleCommandBlockOutput
  'command_blocks_work': GameRuleCommandBlocksWork
  'minecraft:command_blocks_work': GameRuleCommandBlocksWork
  'drowning_damage': GameRuleDrowningDamage
  'minecraft:drowning_damage': GameRuleDrowningDamage
  'elytra_movement_check': GameRuleElytraMovementCheck
  'minecraft:elytra_movement_check': GameRuleElytraMovementCheck
  'ender_pearls_vanish_on_death': GameRuleEnderPearlsVanishOnDeath
  'minecraft:ender_pearls_vanish_on_death': GameRuleEnderPearlsVanishOnDeath
  'entity_drops': GameRuleEntityDrops
  'minecraft:entity_drops': GameRuleEntityDrops
  'fall_damage': GameRuleFallDamage
  'minecraft:fall_damage': GameRuleFallDamage
  'fire_damage': GameRuleFireDamage
  'minecraft:fire_damage': GameRuleFireDamage
  'fire_spread_radius_around_player': GameRuleFireSpreadRadiusAroundPlayer
  'minecraft:fire_spread_radius_around_player': GameRuleFireSpreadRadiusAroundPlayer
  'forgive_dead_players': GameRuleForgiveDeadPlayers
  'minecraft:forgive_dead_players': GameRuleForgiveDeadPlayers
  'freeze_damage': GameRuleFreezeDamage
  'minecraft:freeze_damage': GameRuleFreezeDamage
  'global_sound_events': GameRuleGlobalSoundEvents
  'minecraft:global_sound_events': GameRuleGlobalSoundEvents
  'immediate_respawn': GameRuleImmediateRespawn
  'minecraft:immediate_respawn': GameRuleImmediateRespawn
  'keep_inventory': GameRuleKeepInventory
  'minecraft:keep_inventory': GameRuleKeepInventory
  'lava_source_conversion': GameRuleLavaSourceConversion
  'minecraft:lava_source_conversion': GameRuleLavaSourceConversion
  'limited_crafting': GameRuleLimitedCrafting
  'minecraft:limited_crafting': GameRuleLimitedCrafting
  'locator_bar': GameRuleLocatorBar
  'minecraft:locator_bar': GameRuleLocatorBar
  'log_admin_commands': GameRuleLogAdminCommands
  'minecraft:log_admin_commands': GameRuleLogAdminCommands
  'max_block_modifications': GameRuleMaxBlockModifications
  'minecraft:max_block_modifications': GameRuleMaxBlockModifications
  'max_command_forks': GameRuleMaxCommandForks
  'minecraft:max_command_forks': GameRuleMaxCommandForks
  'max_command_sequence_length': GameRuleMaxCommandSequenceLength
  'minecraft:max_command_sequence_length': GameRuleMaxCommandSequenceLength
  'max_entity_cramming': GameRuleMaxEntityCramming
  'minecraft:max_entity_cramming': GameRuleMaxEntityCramming
  'max_minecart_speed': GameRuleMaxMinecartSpeed
  'minecraft:max_minecart_speed': GameRuleMaxMinecartSpeed
  'max_snow_accumulation_height': GameRuleMaxSnowAccumulationHeight
  'minecraft:max_snow_accumulation_height': GameRuleMaxSnowAccumulationHeight
  'mob_drops': GameRuleMobDrops
  'minecraft:mob_drops': GameRuleMobDrops
  'mob_explosion_drop_decay': GameRuleMobExplosionDropDecay
  'minecraft:mob_explosion_drop_decay': GameRuleMobExplosionDropDecay
  'mob_griefing': GameRuleMobGriefing
  'minecraft:mob_griefing': GameRuleMobGriefing
  'natural_health_regeneration': GameRuleNaturalHealthRegeneration
  'minecraft:natural_health_regeneration': GameRuleNaturalHealthRegeneration
  'player_movement_check': GameRulePlayerMovementCheck
  'minecraft:player_movement_check': GameRulePlayerMovementCheck
  'players_nether_portal_creative_delay': GameRulePlayersNetherPortalCreativeDelay
  'minecraft:players_nether_portal_creative_delay': GameRulePlayersNetherPortalCreativeDelay
  'players_nether_portal_default_delay': GameRulePlayersNetherPortalDefaultDelay
  'minecraft:players_nether_portal_default_delay': GameRulePlayersNetherPortalDefaultDelay
  'players_sleeping_percentage': GameRulePlayersSleepingPercentage
  'minecraft:players_sleeping_percentage': GameRulePlayersSleepingPercentage
  'projectiles_can_break_blocks': GameRuleProjectilesCanBreakBlocks
  'minecraft:projectiles_can_break_blocks': GameRuleProjectilesCanBreakBlocks
  'pvp': GameRulePvp
  'minecraft:pvp': GameRulePvp
  'raids': GameRuleRaids
  'minecraft:raids': GameRuleRaids
  'random_tick_speed': GameRuleRandomTickSpeed
  'minecraft:random_tick_speed': GameRuleRandomTickSpeed
  'reduced_debug_info': GameRuleReducedDebugInfo
  'minecraft:reduced_debug_info': GameRuleReducedDebugInfo
  'respawn_radius': GameRuleRespawnRadius
  'minecraft:respawn_radius': GameRuleRespawnRadius
  'send_command_feedback': GameRuleSendCommandFeedback
  'minecraft:send_command_feedback': GameRuleSendCommandFeedback
  'show_death_messages': GameRuleShowDeathMessages
  'minecraft:show_death_messages': GameRuleShowDeathMessages
  'spawn_mobs': GameRuleSpawnMobs
  'minecraft:spawn_mobs': GameRuleSpawnMobs
  'spawn_monsters': GameRuleSpawnMonsters
  'minecraft:spawn_monsters': GameRuleSpawnMonsters
  'spawn_patrols': GameRuleSpawnPatrols
  'minecraft:spawn_patrols': GameRuleSpawnPatrols
  'spawn_phantoms': GameRuleSpawnPhantoms
  'minecraft:spawn_phantoms': GameRuleSpawnPhantoms
  'spawn_wandering_traders': GameRuleSpawnWanderingTraders
  'minecraft:spawn_wandering_traders': GameRuleSpawnWanderingTraders
  'spawn_wardens': GameRuleSpawnWardens
  'minecraft:spawn_wardens': GameRuleSpawnWardens
  'spawner_blocks_work': GameRuleSpawnerBlocksWork
  'minecraft:spawner_blocks_work': GameRuleSpawnerBlocksWork
  'spectators_generate_chunks': GameRuleSpectatorsGenerateChunks
  'minecraft:spectators_generate_chunks': GameRuleSpectatorsGenerateChunks
  'spread_vines': GameRuleSpreadVines
  'minecraft:spread_vines': GameRuleSpreadVines
  'tnt_explodes': GameRuleTntExplodes
  'minecraft:tnt_explodes': GameRuleTntExplodes
  'tnt_explosion_drop_decay': GameRuleTntExplosionDropDecay
  'minecraft:tnt_explosion_drop_decay': GameRuleTntExplosionDropDecay
  'universal_anger': GameRuleUniversalAnger
  'minecraft:universal_anger': GameRuleUniversalAnger
  'water_source_conversion': GameRuleWaterSourceConversion
  'minecraft:water_source_conversion': GameRuleWaterSourceConversion
}
type GameRuleKeys = keyof GameRuleDispatcherMap
type GameRuleFallback = (
  | GameRuleAdvanceTime
  | GameRuleAdvanceWeather
  | GameRuleAllowEnteringNetherUsingPortals
  | GameRuleBlockDrops
  | GameRuleBlockExplosionDropDecay
  | GameRuleCommandBlockOutput
  | GameRuleCommandBlocksWork
  | GameRuleDrowningDamage
  | GameRuleElytraMovementCheck
  | GameRuleEnderPearlsVanishOnDeath
  | GameRuleEntityDrops
  | GameRuleFallDamage
  | GameRuleFireDamage
  | GameRuleFireSpreadRadiusAroundPlayer
  | GameRuleForgiveDeadPlayers
  | GameRuleFreezeDamage
  | GameRuleGlobalSoundEvents
  | GameRuleImmediateRespawn
  | GameRuleKeepInventory
  | GameRuleLavaSourceConversion
  | GameRuleLimitedCrafting
  | GameRuleLocatorBar
  | GameRuleLogAdminCommands
  | GameRuleMaxBlockModifications
  | GameRuleMaxCommandForks
  | GameRuleMaxCommandSequenceLength
  | GameRuleMaxEntityCramming
  | GameRuleMaxMinecartSpeed
  | GameRuleMaxSnowAccumulationHeight
  | GameRuleMobDrops
  | GameRuleMobExplosionDropDecay
  | GameRuleMobGriefing
  | GameRuleNaturalHealthRegeneration
  | GameRulePlayerMovementCheck
  | GameRulePlayersNetherPortalCreativeDelay
  | GameRulePlayersNetherPortalDefaultDelay
  | GameRulePlayersSleepingPercentage
  | GameRuleProjectilesCanBreakBlocks
  | GameRulePvp
  | GameRuleRaids
  | GameRuleRandomTickSpeed
  | GameRuleReducedDebugInfo
  | GameRuleRespawnRadius
  | GameRuleSendCommandFeedback
  | GameRuleShowDeathMessages
  | GameRuleSpawnMobs
  | GameRuleSpawnMonsters
  | GameRuleSpawnPatrols
  | GameRuleSpawnPhantoms
  | GameRuleSpawnWanderingTraders
  | GameRuleSpawnWardens
  | GameRuleSpawnerBlocksWork
  | GameRuleSpectatorsGenerateChunks
  | GameRuleSpreadVines
  | GameRuleTntExplodes
  | GameRuleTntExplosionDropDecay
  | GameRuleUniversalAnger
  | GameRuleWaterSourceConversion)
type GameRuleAdvanceTime = boolean
type GameRuleAdvanceWeather = boolean
type GameRuleAllowEnteringNetherUsingPortals = boolean
type GameRuleBlockDrops = boolean
type GameRuleBlockExplosionDropDecay = boolean
type GameRuleCommandBlockOutput = boolean
type GameRuleCommandBlocksWork = boolean
type GameRuleDrowningDamage = boolean
type GameRuleElytraMovementCheck = boolean
type GameRuleEnderPearlsVanishOnDeath = boolean
type GameRuleEntityDrops = boolean
type GameRuleFallDamage = boolean
type GameRuleFireDamage = boolean
type GameRuleFireSpreadRadiusAroundPlayer = NBTInt<{}>
type GameRuleForgiveDeadPlayers = boolean
type GameRuleFreezeDamage = boolean
type GameRuleGlobalSoundEvents = boolean
type GameRuleImmediateRespawn = boolean
type GameRuleKeepInventory = boolean
type GameRuleLavaSourceConversion = boolean
type GameRuleLimitedCrafting = boolean
type GameRuleLocatorBar = boolean
type GameRuleLogAdminCommands = boolean
type GameRuleMaxBlockModifications = NBTInt<{
  min: 1
}>
type GameRuleMaxCommandForks = NBTInt<{
  min: 0
}>
type GameRuleMaxCommandSequenceLength = NBTInt<{
  min: 0
}>
type GameRuleMaxEntityCramming = NBTInt<{
  min: 0
}>
type GameRuleMaxMinecartSpeed = NBTInt<{
  min: 1
}>
type GameRuleMaxSnowAccumulationHeight = NBTInt<{
  min: 0
  max: 8
}>
type GameRuleMobDrops = boolean
type GameRuleMobExplosionDropDecay = boolean
type GameRuleMobGriefing = boolean
type GameRuleNaturalHealthRegeneration = boolean
type GameRulePlayerMovementCheck = boolean
type GameRulePlayersNetherPortalCreativeDelay = NBTInt<{
  min: 0
}>
type GameRulePlayersNetherPortalDefaultDelay = NBTInt<{
  min: 0
}>
type GameRulePlayersSleepingPercentage = NBTInt<{
  min: 0
}>
type GameRuleProjectilesCanBreakBlocks = boolean
type GameRulePvp = boolean
type GameRuleRaids = boolean
type GameRuleRandomTickSpeed = NBTInt<{
  min: 0
}>
type GameRuleReducedDebugInfo = boolean
type GameRuleRespawnRadius = NBTInt<{
  min: 0
}>
type GameRuleSendCommandFeedback = boolean
type GameRuleShowDeathMessages = boolean
type GameRuleSpawnMobs = boolean
type GameRuleSpawnMonsters = boolean
type GameRuleSpawnPatrols = boolean
type GameRuleSpawnPhantoms = boolean
type GameRuleSpawnWanderingTraders = boolean
type GameRuleSpawnWardens = boolean
type GameRuleSpawnerBlocksWork = boolean
type GameRuleSpectatorsGenerateChunks = boolean
type GameRuleSpreadVines = boolean
type GameRuleTntExplodes = boolean
type GameRuleTntExplosionDropDecay = boolean
type GameRuleUniversalAnger = boolean
type GameRuleWaterSourceConversion = boolean
export type SymbolGameRule<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? GameRuleDispatcherMap
  : CASE extends 'keys' ? GameRuleKeys : CASE extends '%fallback' ? GameRuleFallback : never
