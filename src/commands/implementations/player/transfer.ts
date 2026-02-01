import type { MultiplePlayersArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class TransferCommandNode extends CommandNode {
  command = 'transfer' as const
}

export class TransferCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TransferCommandNode

  /**
   * Forces the targeted player(s) to directly connect to another minecraft server.
   * 
   * Defaults to targeting `@s`.
   */
  transfer<T extends string>(
    hostname: Macroable<string, MACRO>,
    port?: Macroable<number, MACRO>,
    targets?: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
  ) {
    const args: unknown[] = [hostname]
    if (port) {
      args.push(port)
      if (targets !== undefined) {
        args.push(targetParser(targets))
      }
    } else {
      args.push(25565, targetParser(targets))
    }
    return this.finalCommand([hostname, port, targetParser(targets)])
  }
}
