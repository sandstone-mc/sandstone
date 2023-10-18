import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { ITEMS, MultiplePlayersArgument } from 'sandstone/arguments'
import type { TagClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/variables'

export class ClearCommandNode extends CommandNode {
  command = 'clear' as const
}

export class ClearCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ClearCommandNode

  /**
   * Clears items from player inventory, including items being dragged by the player.
   *
   * @param targets Specifies the player(s) whose items are cleared.
   * If not specified, defaults to the player who executes the command.
   *
   * @param item Specifies the item to be cleared. If not specified, all items are cleared.
   *
   * @param maxCount Specifies the maximum number of items to be cleared.
   *
   * If not specified, all items that match `item` are cleared.
   *
   * If `0`, instead of clearing of items, detectes and queries the amount of specified items.
   */
  clear = (
    targets?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item?: Macroable<LiteralUnion<ITEMS> | TagClass<'items'>, MACRO>,
    maxCount?: Macroable<number, MACRO>,
  ) => this.finalCommand([targetParser(targets), item, maxCount])
}
