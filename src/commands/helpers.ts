import type { SandstoneCore } from 'sandstone/core'
import type { CommandNode } from 'sandstone/core/nodes'
import { captureCommandStackTrace } from 'sandstone/core/nodes'
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

/**
 * Capture the current call stack and attach it to `node` as
 * `node.stackTrace`. Used by command classes that want to surface
 * their call site to test runners / debuggers.
 *
 * Skips internal Sandstone frames plus the supplied `extraSkipFrames`
 * (typically the command class name itself) so the first remaining
 * frame points at the user's call site.
 *
 * @internal
 */
export function attachStackTrace(
  node: CommandNode,
  extraSkipFrames: string[] = [],
): void {
  node.commandStackTrace = captureCommandStackTrace(extraSkipFrames)
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
    protected readonly isMacro: boolean = false,
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
      const node = new this.NodeType(this.sandstonePack) as CommandNode
      // Propagate the macro context flag from the wrapping command class so
      // visitors (e.g. WithNodeVisitor) can inspect it before serialization
      // runs `getValue()` to set it lazily.
      node.isMacro = node.isMacro || this.isMacro
      return node as any
    }

    throw new Error('No node type specified & no previous node for a non-root-level command')
  }

  protected finalCommand = (
    args?: NODE extends CommandNodeConstructor ? InstanceType<NODE>['args'] : any[],
    currentNode?: InstanceTypeOr<NODE, CommandNode> | undefined,
  ): FinalCommandOutput => {
    // No followup. We can add arguments & commit.

    const node = currentNode ?? this.getNode()
    this.checkTestExclusive(node)

    if (args) {
      node.args.push(...args)
    }

    if (this.autoCommit) {
      node.commit()
    }

    return new FinalCommandOutput(node)
  }

  /**
   * Enforce the `testExclusive` flag — throw if a `testExclusive` node
   * would commit outside a `TestMCFunctionClass` context. Subclasses
   * overriding `finalCommand` should call this on the node they're about
   * to commit so the gate still runs.
   *
   * @internal
   */
  protected checkTestExclusive(node: CommandNode): void {
    if (!node.testExclusive || !this.autoCommit) return

    const currentMCFunction = this.sandstoneCore.currentMCFunction
    const isTestContext = currentMCFunction !== undefined
      && (currentMCFunction.resource as { _resourceType?: string })._resourceType === 'test_function'

    if (!isTestContext) {
      throw new Error(
        `[${node.constructor.name}] This command may only be used inside a test mcfunction (TestMCFunctionClass). `
        + 'PackTest commands are provided by the PackTest server mod and are not available outside test functions.',
      )
    }
  }

  /**
   * Variant of `finalCommand` that, in addition to the base flow,
   * captures the current call stack and stores it on the node as
   * `node.stackTrace`. Command classes that want to surface their
   * call site (e.g. the test assertion/await/fail helpers) override
   * `finalCommand` with an arrow field delegating here.
   *
   * @internal
   */
  protected finalCommandWithStackTrace(
    args?: NODE extends CommandNodeConstructor ? InstanceType<NODE>['args'] : any[],
    currentNode?: InstanceTypeOr<NODE, CommandNode> | undefined,
  ): FinalCommandOutput {
    const node = currentNode ?? this.getNode()
    this.checkTestExclusive(node)

    if (args) {
      node.args.push(...args)
    }

    if (this.autoCommit) {
      node.commit()
    }

    attachStackTrace(node, [this.constructor.name])
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

    return new NextArgumentType(this.sandstonePack, this.isMacro, node, this.autoCommit, ...additionalNextArgs) as any
  }
}
