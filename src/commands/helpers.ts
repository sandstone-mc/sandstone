import type { SandstoneCore } from 'sandstone/core'
import type { CommandNode } from 'sandstone/core/nodes'
import type { SandstonePack } from 'sandstone/pack'
import type { SandstoneCommands } from './commands'

type InstanceTypeOr<NODE extends (new (...args: any) => CommandNode) | undefined, X> = NODE extends undefined
  ? X
  : NODE extends new (
        ...args: any
      ) => infer R
    ? R
    : never

/**
 * This is what final commands return.
 * It has a protected access to the node that was executed, allowing users to access the node's properties.
 *
 * This should only be used by users for advanced usage.
 */

export class FinalCommandOutput {
  constructor(protected node: CommandNode<unknown[]>) {}
}

export type CommandNodeConstructor = new (...args: any) => CommandNode
export type CommandArgumentsConstructor = new (...args: any) => any

export abstract class CommandArguments<
  NODE extends CommandNodeConstructor | undefined = CommandNodeConstructor | undefined,
> {
  protected NodeType?: NODE

  protected sandstoneCore: SandstoneCore

  protected sandstoneCommands: SandstoneCommands<false>

  constructor(
    protected sandstonePack: SandstonePack,
    protected previousNode?: CommandNode,
    protected autoCommit = true,
  ) {
    this.sandstoneCore = sandstonePack.core
    this.sandstoneCommands = sandstonePack.commands
  }

  protected getNode: () => InstanceTypeOr<NODE, CommandNode> = () => {
    if (this.previousNode) {
      // This is not a root-level command, so we can use the previous node.
      return this.previousNode
    }

    // Automatically create the node for root-level commands.
    if (this.NodeType) {
      /* Typescript does not manage to remove undefined for some reasons */
      /* @ts-ignore */
      return new this.NodeType(this.sandstonePack) as any
    }

    throw new Error('No node type specified & no previous node for a non-root-level command')
  }

  protected finalCommand = (
    args?: NODE extends CommandNodeConstructor ? InstanceType<NODE>['args'] : any[],
    currentNode?: InstanceTypeOr<NODE, CommandNode> | undefined,
  ): FinalCommandOutput => {
    // No followup. We can add arguments & commit.

    const node = currentNode ?? this.getNode()

    if (args) {
      node.args.push(...args)
    }

    if (this.autoCommit) {
      node.commit()
    }

    return new FinalCommandOutput(node)
  }

  protected subCommand = <NEXT_ARGUMENT extends CommandArgumentsConstructor>(
    args: NODE extends CommandNodeConstructor ? InstanceType<NODE>['args'] : any[],
    NextArgumentType: NEXT_ARGUMENT,
    executable = false,
    additionalNextArgs: unknown[] = [],
    currentNode?: InstanceTypeOr<NODE, CommandNode> | undefined,
  ): NEXT_ARGUMENT extends CommandArgumentsConstructor ? InstanceType<NEXT_ARGUMENT> : FinalCommandOutput => {
    const node = currentNode ?? this.getNode()

    /*
     * The command has followup arguments. We need to append the arguments to the node, and return a new instance of the followup command.
     * If the command is executable at this point, we can commit it.
     */
    if (args) {
      node.args.push(...args)
    }

    if (executable && this.autoCommit) {
      node.commit()
    }

    return new NextArgumentType(this.sandstonePack, node, this.autoCommit, ...additionalNextArgs) as any
  }
}
