import type { MultiplePlayersArgument, SingleEntityArgument } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import type { Macroable } from 'sandstone/core'
import { targetParser } from 'sandstone/variables/parsers'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import type { NamespacedString } from 'sandstone/utils'

/**
 * A node representing the `posteffect` command.
 */
export class PostEffectCommandNode extends CommandNode {
  command = 'posteffect' as const
}

export class PostEffectCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = PostEffectCommandNode

  /**
   * Add a post effect to a player.
   *
   * @param player The player to add the post effect to.
   * @param postEffect The namespaced ID of the post effect to add.
   *
   * @example
   * ```ts
   * posteffect.add('@p', 'minecraft:dark')
   * ```
   */
  add = (
    player: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    postEffect: Macroable<NamespacedString, MACRO>,
  ): FinalCommandOutput => this.finalCommand(['add', targetParser(player), postEffect])

  /**
   * Remove all post effects from a player.
   *
   * @param player The player to clear all post effects from.
   *
   * @example
   * ```ts
   * posteffect.clear('@p')
   * ```
   */
  clear = (player: Macroable<MultiplePlayersArgument<MACRO>, MACRO>): FinalCommandOutput =>
    this.finalCommand(['clear', targetParser(player)])

  /**
   * List all post effects applied to a target.
   *
   * @param target The target to list post effects for.
   *
   * @example
   * ```ts
   * posteffect.list('@p')
   * ```
   */
  list = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>): FinalCommandOutput =>
    this.finalCommand(['list', targetParser(target)])

  /**
   * Remove a post effect from a player.
   *
   * @param player The player to remove the post effect from.
   * @param postEffect The namespaced ID of the post effect to remove.
   *
   * @example
   * ```ts
   * posteffect.remove('@p', 'minecraft:dark')
   * ```
   */
  remove = (
    player: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    postEffect: Macroable<NamespacedString, MACRO>,
  ): FinalCommandOutput => this.finalCommand(['remove', targetParser(player), postEffect])
}
