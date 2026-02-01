import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class SwingCommandNode extends CommandNode {
  command = 'swing' as const
}

export class SwingCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SwingCommandNode

  /**
   * Forces the targeted bipedal entity to initiate its hand swing animation with either their mainhand or their offhand.
   * 
   * Defaults to `@s` and `mainhand`.
   */
  swing = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO> = '@s', hand: 'mainhand' | 'offhand' = 'mainhand') => 
    this.finalCommand([targetParser(targets), hand])
}
