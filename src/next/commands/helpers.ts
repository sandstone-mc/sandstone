import type { CommandNode } from '../core/nodes'
import type { SandstoneCore } from '../core/sandstoneCore'

type InstanceTypeOr<NODE extends (new (...args: any) => CommandNode) | undefined, X> = (
  NODE extends undefined ? X : NODE extends new (...args: any) => infer R ? R : never
)

/**
 * This is what final commands return.
 * It has a protected access to the node that was executed, allowing users to access the node's properties.
 *
 * This should only be used by users for advanced usage.
 */
export class FinalCommandOutput {
  constructor(protected node: CommandNode<unknown[]>) { }
}

export abstract class CommandArguments<NODE extends (new (...args: any) => CommandNode) | undefined = (new (...args: any) => CommandNode) | undefined> {
  protected NodeType?: NODE

  constructor(protected sandstoneCore: SandstoneCore, protected previousNode?: CommandNode) { }

  protected getNode: (() => InstanceTypeOr<NODE, CommandNode>) = () => {
    if (this.previousNode) {
      // This is not a root-level command, so we can use the previous node.
      return this.previousNode
    }

    // Automatically create the node for root-level commands.
    if (this.NodeType) {
      // Typescript does not manage to remove undefined
      const NodeType = this.NodeType as Exclude<NODE, undefined>
      return new NodeType(this.sandstoneCore) as any
    }

    throw new Error('No node type specified & no previous node for a non-root-level command')
  }

  protected command: (
    // Command with no possible followups
    ((args?: unknown[]) => FinalCommandOutput) &

    // Command with possible followups
    (<NEXT_ARGUMENT extends (new (...args: any) => CommandArguments) >(nextArgumentType: NEXT_ARGUMENT, executable: boolean, args: unknown[], additionalNextArgs?: unknown[]) => InstanceType<NEXT_ARGUMENT>)
  ) = (...args: any[]) => {
    const node = this.getNode()

    if (args.length === 0) {
      // No arguments, so we can commit the command.
      node.commit()
      return new FinalCommandOutput(node)
    }
    if (args.length === 1) {
      // One argument, which means the command is executable and has no followup. We can add arguments & commit.
      node.args.push(...args[0])
      node.commit()
      return new FinalCommandOutput(node)
    }

    /*
     * The command has followup arguments. We need to append the arguments to the node, and return a new instance of the followup command.
     * If the command is executable at this point, we can commit it.
     */
    const [NextArgumentType, executable, nextArguments, additionalNextArgs = []] = args
    node.args.push(...nextArguments)

    if (executable) {
      node.commit()
    }

    return new NextArgumentType(this.sandstoneCore, node, ...additionalNextArgs)
  }
}
