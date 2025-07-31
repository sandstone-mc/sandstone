import type { ITEMS, MultiplePlayersArgument, RootNBT } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import { nbtStringifier, targetParser } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers.js'
import { CommandArguments } from '../../helpers.js'

// Give command

export class GiveCommandNode extends CommandNode {
  command = 'give' as const
}

export class GiveCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = GiveCommandNode

  /**
   * Gives an item to one or more players.
   *
   * @param targets Specifies the target(s) to give item(s) to.
   *
   * @param item Specifies the item to give.
   *
   * @param count Specifies the number of items to give. If not specified, defaults to `1`.
   */
  give(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item: Macroable<LiteralUnion<ITEMS>, MACRO>,
    count?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Gives an item to one or more players with nbt.
   *
   * @param targets Specifies the target(s) to give item(s) to.
   *
   * @param item Specifies the item to give.
   *
   * @param nbt Specifies the nbt of the item to give.
   *
   * @param count Specifies the number of items to give. If not specified, defaults to `1`.
   */
  give(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item: Macroable<LiteralUnion<ITEMS>, MACRO>,
    nbt: Macroable<RootNBT, MACRO>,
    count?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  give(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item: Macroable<LiteralUnion<ITEMS>, MACRO>,
    countOrNBT?: Macroable<number | RootNBT, MACRO>,
    count?: Macroable<number, MACRO>,
  ) {
    if (typeof countOrNBT === 'object') {
      return this.finalCommand([targetParser(targets), `${item}${nbtStringifier(countOrNBT)}`, count])
    }
    return this.finalCommand([targetParser(targets), item, countOrNBT])
  }
}
