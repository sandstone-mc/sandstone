import type { MultiplePlayersArgument } from 'sandstone/arguments'
import type { AdvancementClass, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

// Advancement command

export class AdvancementCommandNode extends CommandNode {
  command = 'advancement' as const
}

type AdvancementArgument = string | AdvancementClass

export class AdvancementArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  /** Adds or removes all loaded advancements. */
  everything = () => this.finalCommand(['everything'])

  /**
   * Adds or removes a single advancement or criterion.
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   *
   * @param criterion Specifies a valid criterion of the advancement to manipulate.
   * The command defaults to the entire advancement.
   * If specified, the command refers to merely the criterion and not the entire advancement.
   */
  only = (advancement: Macroable<AdvancementArgument, MACRO>, criterion?: Macroable<string, MACRO>) =>
    this.finalCommand(['only', advancement, criterion])

  /**
   * Adds or removes an advancement and all its children advancements.
   * Think of specifying everything from that advancement to the end.
   *
   * The exact order the operation is carried out in is:
   *
   *     specified advancement > child > child's child > ...
   *
   * When it operates on a child that branches, it iterates through all its children before continuing.
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   */
  from = (advancement: Macroable<AdvancementArgument, MACRO>) => this.finalCommand(['from', advancement])

  /**
   * Specifies an advancement, and adds or removes all its parent advancements, and all its children advancements.
   * Think of specifying everything through the specified advancement, going both backwards and forwards.
   *
   * The exact order the operation is as if the command were executed with "until" specified, then with "from" specified:
   *
   *     parent > parent's parent > ... > root > specified advancement > child > child's child > ...
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   */
  through = (advancement: Macroable<AdvancementArgument, MACRO>) => this.finalCommand(['through', advancement])

  /**
   * Adds or removes an advancement and all its parent advancements until the root for addition/removal.
   * Think of specifying everything from the start until that advancement.
   *
   * The exact order the operation is carried out in is:
   *
   *     parent > parent's parent > ... > root > specified advancement.
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   */
  until = (advancement: Macroable<AdvancementArgument, MACRO>) => this.finalCommand(['until', advancement])
}

export class AdvancementCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = AdvancementCommandNode

  /**
   * Grant advancements to players.
   *
   * @param targets Player selector to grant advancements to.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=red]'
   *
   * @example
   * ```ts
   * advancement.grant('@p').everything()                    // Grant all advancements
   * advancement.grant('@a').only('minecraft:story/mine_stone')  // Grant specific advancement
   * advancement.grant('@p').from('minecraft:story/root')   // Grant advancement and children
   * advancement.grant('@a').until('minecraft:story/smelt_iron') // Grant parents up to advancement
   * ```
   */
  grant = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) =>
    this.subCommand(['grant', targetParser(targets)], AdvancementArgumentsCommand<MACRO>, false)

  /**
   * Revoke advancements from players.
   *
   * @param targets Player selector to revoke advancements from.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=blue]'
   *
   * @example
   * ```ts
   * advancement.revoke('@p').everything()                   // Remove all advancements
   * advancement.revoke('@a').only('minecraft:story/mine_stone') // Remove specific advancement
   * advancement.revoke('@p').through('minecraft:story/root')    // Remove advancement tree
   * ```
   */
  revoke = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) =>
    this.subCommand(['revoke', targetParser(targets)], AdvancementArgumentsCommand<MACRO>, false)
}
