import { Command } from '../Command'
import { command } from '../decorators'

import type { LiteralUnion } from '@/generalTypes'
import type { GAMERULES } from '@arguments'

export class GameruleCommand extends Command {
  /**
   * Sets or queries a game rule value.
   *
   * @param gamerule Specifies the game rule to set or query.
   *
   * Must be one of the following:
   * - `announceAdvancements `: Whether advancements should be announced in chat
   * - `commandBlockOutput `: Whether command blocks should notify admins when they perform commands
   * - `disableElytraMovementCheck `: Whether the server should skip checking player speed when the player is wearing elytra. Often helps with jittering due to lag in multiplayer.
   * - `disableRaids `: Whether raids are disabled.
   * - `doDaylightCycle `: Whether the daylight cycle and moon phases progress
   * - `doEntityDrops `: Whether entities that are not mobs should have drops
   * - `doFireTick `: Whether fire should spread and naturally extinguish
   * - `doInsomnia `: Whether phantoms can spawn in the nighttime
   * - `doImmediateRespawn `: Players respawn immediately without showing the death screen
   * - `doLimitedCrafting `: Whether players should be able to craft only those recipes that they've unlocked first
   * - `doMobLoot `: Whether mobs should drop items
   * - `doMobSpawning `: Whether mobs should naturally spawn. Does not affect monster spawners.
   * - `doPatrolSpawning `: Whether patrols can spawn
   * - `doTileDrops `: Whether blocks should have drops
   * - `doTraderSpawning `: Whether wandering traders can spawn
   * - `doWeatherCycle `: Whether the weather can change naturally. The /weather command can still change weather.
   * - `drowningDamage `: Whether the player should take damage when drowning
   * - `fallDamage `: Whether the player should take fall damage
   * - `fireDamage `: Whether the player should take fire damage
   * - `forgiveDeadPlayers `: Makes angered neutral mobs stop being angry when the targeted player dies nearby
   * - `keepInventory `: Whether the player should keep items and experience in their inventory after death
   * - `logAdminCommands `: Whether to log admin commands to server log
   * - `maxCommandChainLength `: Determines the number at which the chain command block acts as a "chain".
   * - `maxEntityCramming `: The maximum number of other pushable entities a mob or player can push, before taking 3♥♥ suffocation damage per half-second.
   *    Setting to 0 or lower disables the rule. Damage affects survival-mode or adventure-mode players, and all mobs but bats.
   *    Pushable entities include non-spectator-mode players, any mob except bats, as well as boats and minecarts.
   * - `mobGriefing `: Whether creepers, zombies, endermen, ghasts, withers, ender dragons, rabbits, sheep, villagers, silverfish, snow golems, and end crystals
   *    should be able to change blocks and whether mobs can pick up items, which also disables bartering.
   *    This also affects the capability of zombie-like creatures like zombie pigmen and drowned to pathfind to turtle eggs.
   * - `naturalRegeneration `: Whether the player can regenerate health naturally if their hunger is full enough (doesn't affect external healing, such as golden apples, the Regeneration effect, etc.)
   * - `randomTickSpeed `: How often a random block tick occurs (such as plant growth, leaf decay, etc.) per chunk section per game tick.
   *    0 disables random ticks, higher numbers increase random ticks. Setting to a high integer results in high speeds of decay and growth
   * - `reducedDebugInfo `: Whether the debug screen shows all or reduced information; and whether the effects of F3+B (entity hitboxes) and F3+G (chunk boundaries) are shown.
   * - `sendCommandFeedback `: Whether the feedback from commands executed by a player should show up in chat. Also affects the default behavior of whether command blocks store their output text
   * - `showDeathMessages `: Whether death messages are put into chat when a player dies. Also affects whether a message is sent to the pet's owner when the pet dies.
   * - `spawnRadius `: The number of blocks outward from the world spawn coordinates that a player spawns in when first joining a server or when dying without a personal spawnpoint.
   * - `spectatorsGenerateChunks `: Whether players in spectator mode can generate chunks
   * - `universalAnger `: Makes angered neutral mobs attack any nearby player, not just the player that angered them. Works best if forgiveDeadPlayers is disabled.
   *
   * @param value Specifies the value to set the game rule to. If unspecified, query the current gamerule value.
   *
   * Only `true` or `false` can affect gameplay, except in the case of
   * `maxEntityCramming`, `randomTickSpeed`, `spawnRadius`, and `maxCommandChainLength`,
   * where any integer 0 or greater affects gameplay.
   */
  @command('gamerule', { isRoot: true })
  gamerule = (gamerule: LiteralUnion<GAMERULES>, value?: boolean | number) => { }
}
