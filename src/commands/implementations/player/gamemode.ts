import type { GAMEMODES, MultiplePlayersArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

// Gamemode command

export class GameModeCommandNode extends CommandNode {
  command = 'gamemode' as const
}

export class GameModeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = GameModeCommandNode

  /**
   * Set the game mode for specified players.
   *
   * Changes how players can interact with the world and what abilities they have.
   * This affects movement, block interaction, damage, hunger, and available items.
   * 
   * **Game Mode Details:**
   * 
   * **Survival Mode:**
   * - Health and hunger systems active
   * - Must gather and craft resources
   * - Can break and place most blocks (with tools/permissions)
   * - Takes damage and can die
   * - Limited inventory and item durability
   * 
   * **Creative Mode:**
   * - Infinite health and no hunger
   * - Access to all blocks and items
   * - Can fly and phase through blocks
   * - Instant block breaking
   * - Immune to damage and environmental effects
   * 
   * **Adventure Mode:**
   * - Health and hunger like survival
   * - Cannot break or place blocks without proper tools and permissions
   * - Designed for custom maps and controlled experiences
   * - Can still interact with entities and items
   * 
   * **Spectator Mode:**
   * - No collision with blocks or entities
   * - Can fly through walls and observe
   * - Invisible to other players and mobs
   * - Cannot interact with the world
   * - Can teleport to other players
   *
   * @param gamemode The new game mode to set. Must be one of:
   *                 - `'survival'` or `'s'` or `0` for survival mode
   *                 - `'creative'` or `'c'` or `1` for creative mode  
   *                 - `'adventure'` or `'a'` or `2` for adventure mode
   *                 - `'spectator'` or `'sp'` or `3` for spectator mode
   *
   * @param targets Optional player selector(s) specifying who to change.
   *                If omitted, defaults to the command executor.
   *                Can target multiple players with selectors like `@a[team=red]`.
   * 
   * @example
   * ```ts
   * // Change your own gamemode
   * gamemode('creative')
   * 
   * // Target specific players
   * gamemode('survival', '@a')           // All players to survival
   * gamemode('creative', '@p')           // Nearest player to creative  
   * gamemode('spectator', 'PlayerName')  // Specific player to spectator
   * 
   * // Conditional gamemode changes
   * gamemode('adventure', '@a[tag=mapPlayer]')  // Players with specific tag
   * gamemode('creative', '@a[gamemode=survival]') // Only survival players
   * 
   * // Using numeric IDs (alternative syntax)
   * gamemode('1', '@p')  // Creative mode using numeric ID
   * ```
   */
  gamemode = <T extends string>(gamemode: Macroable<GAMEMODES, MACRO>, targets?: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>) =>
    this.finalCommand([targetParser(gamemode), targets])
}
