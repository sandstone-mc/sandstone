import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class KillCommandNode extends CommandNode {
  command = 'kill' as const
}

export class KillCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = KillCommandNode

  /**
   * Instantly kill the specified entities.
   * 
   * Causes immediate death to all targeted entities, regardless of their health,
   * armor, status effects, or other protections. Living entities will drop items
   * and experience as if they died normally, and death events will be triggered.
   * 
   * **Entity Types Affected:**
   * - **Living entities:** Players, mobs (drops items/XP, triggers death events)
   * - **Items:** Dropped items, item frames (item drops, frame breaks)
   * - **Projectiles:** Arrows, fireballs (simply disappear)
   * - **Vehicles:** Boats, minecarts (drops as item)
   * - **Other entities:** Armor stands, paintings (drops as item)
   * 
   * **Important Notes:**
   * - Bypasses all forms of damage resistance and immunity
   * - Does not trigger damage-based events or effects
   * - Living entities still drop items and XP normally
   * - Can be used for cleanup without affecting world state
   *
   * @param targets Optional entity selector specifying what to kill.
   *               If omitted, kills the command executor (self-kill).
   *               
   *               **Common Selectors:**
   *               - `'@p'` - nearest player
   *               - `'@a'` - all players
   *               - `'@e[type=zombie]'` - all zombies
   *               - `'@e[type=item, distance=..10]'` - nearby items
   *               - `'PlayerName'` - specific player
   *               - `'@e[tag=cleanup]'` - entities with specific tag
   * 
   * @example
   * ```ts
   * // Kill yourself (if executed by player)
   * kill()
   * 
   * // Kill nearest player
   * kill('@p')
   * 
   * // Clear all items in a radius
   * kill('@e[type=item, distance=..50]')
   * 
   * // Remove all hostile mobs
   * kill('@e[type=#minecraft:hostile]')
   * 
   * // Kill specific entities by tag
   * kill('@e[tag=temporary]')
   * 
   * // Clear lag-causing entities
   * kill('@e[type=arrow]')
   * kill('@e[type=item, nbt={Age:5400s}]') // Old items
   * 
   * // Remove all boats and minecarts
   * kill('@e[type=#minecraft:vehicles]')
   * ```
   */
  kill = (targets?: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.finalCommand([targetParser(targets)])
}
