import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { MultiplePlayersArgument } from 'sandstone/arguments'
import type { AdvancementClass } from 'sandstone/core'
import type { Macroable } from 'sandstone/variables'

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
  only = (advancement: Macroable<AdvancementArgument, MACRO>, criterion?: Macroable<string, MACRO>) => this.finalCommand(['only', advancement, criterion])

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

/** Gives or takes an advancement from one or more players. */
export class AdvancementCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = AdvancementCommandNode

  /**
   * Adds specified advancements.
   *
   * @param targets Specifies one player or more.
   */
  grant = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) => this.subCommand(['grant', targetParser(targets)], AdvancementArgumentsCommand<MACRO>, false)

  /**
   * Removes specified advancements.
   *
   * @param targets Specifies one player or more.
   */
  revoke = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) => this.subCommand(['revoke', targetParser(targets)], AdvancementArgumentsCommand<MACRO>, false)
}
