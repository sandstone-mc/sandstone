import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import type { MacroArgument, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

function checkTagName(tag: string | MacroArgument) {
  if (typeof tag !== 'string') {
    return tag
  }
  if (!tag.match(/[A-Za-z0-9\-_+.]/g)) {
    throw new Error(
      `Invalid tag name "${tag}": Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.`,
    )
  }

  return tag
}

export class TagCommandNode extends CommandNode {
  command = 'tag' as const
}

export class TagArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Add a tag to the targeted entities.
   * 
   * Tags are persistent labels that stay with entities until manually removed.
   * They're essential for creating complex selection criteria, game states,
   * and tracking entity properties across different systems.
   * 
   * **Tag Properties:**
   * - Persistent across server restarts and world reloads
   * - Case-sensitive string identifiers
   * - Each entity can have up to 1024 tags
   * - Survive entity NBT modifications
   * 
   * @param name The tag name to add. Must contain only valid characters:
   *            Letters (A-Z, a-z), numbers (0-9), hyphen (-), underscore (_),
   *            plus sign (+), and period (.). No spaces allowed.
   * 
   * @example
   * ```ts
   * tag('@p').add('quest_complete')      // Mark player as having completed quest
   * tag('@e[type=villager]').add('shop_keeper') // Mark villagers as shopkeepers
   * tag('@a[team=red]').add('team_red')  // Tag team members
   * ```
   */
  add = (name: Macroable<string, MACRO>) => this.finalCommand(['add', checkTagName(name)])

  /**
   * List all tags currently applied to the targeted entities.
   * 
   * Displays all tags for each targeted entity, useful for debugging,
   * administration, and understanding entity states.
   * 
   * @example
   * ```ts
   * tag('@p').list()                     // Show all tags on nearest player
   * tag('@e[type=armor_stand]').list()   // List tags on armor stands
   * ```
   */
  list = () => this.finalCommand(['list'])

  /**
   * Remove a specific tag from the targeted entities.
   * 
   * Removes the specified tag if it exists on the entities.
   * Does nothing if the tag is not present (no error).
   * 
   * @param name The tag name to remove. Must match exactly (case-sensitive).
   * 
   * @example
   * ```ts
   * tag('@p').remove('temp_invulnerable') // Remove temporary invulnerability
   * tag('@a').remove('old_event')        // Clean up old event tags
   * tag('@e[tag=marked]').remove('marked') // Remove marking from tagged entities
   * ```
   */
  remove = (name: Macroable<string, MACRO>) => this.finalCommand(['remove', checkTagName(name)])
}

export class TagCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TagCommandNode

  /**
   * Target entities for tag operations.
   * 
   * Selects the entities that will be affected by subsequent tag operations
   * (add, remove, list). Returns a command object for chaining tag actions.
   * 
   * **Entity Limits:**
   * - Java Edition: Maximum 1024 tags per entity
   * - Bedrock Edition: Lower limits may apply
   * 
   * **Tag Naming Rules:**
   * - Valid characters: A-Z, a-z, 0-9, hyphen (-), underscore (_), plus (+), period (.)
   * - No spaces or special characters
   * - Case-sensitive ("Player" ≠ "player")
   * - Recommended: Use descriptive, consistent naming conventions
   *
   * @param targets Entity selector specifying which entities to operate on.
   *               Can target any entity type including players, mobs, items, etc.
   *               Examples: '@p', '@a', '@e[type=zombie]', 'PlayerName'
   * 
   * @returns TagArgumentsCommand for chaining .add(), .remove(), or .list()
   * 
   * @example
   * ```ts
   * // Tag management examples
   * tag('@p').add('quest_giver')                    // Mark player as quest giver
   * tag('@e[type=villager,distance=..5]').add('nearby') // Tag nearby villagers
   * tag('@a[gamemode=creative]').add('builder')     // Tag creative players
   * 
   * // State tracking
   * tag('@p').add('in_combat').add('has_sword')     // Multiple tags
   * tag('@e[tag=boss]').remove('invulnerable')     // Remove boss immunity
   * 
   * // Administrative uses
   * tag('@a[name=AdminPlayer]').add('admin').add('moderator')
   * tag('@e[type=item,tag=temporary]').remove('temporary') // Clean up
   * 
   * // Debug and inspection
   * tag('@e[distance=..10]').list()                // Show nearby entity tags
   * ```
   */
  tag = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) =>
    this.subCommand([targetParser(targets)], TagArgumentsCommand<MACRO>, false)
}
