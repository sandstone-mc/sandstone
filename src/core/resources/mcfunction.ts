import { makeClassCallable } from '@utils'

import { ContainerNode } from '../nodes'
import { CallableResourceClass } from './resource'

import type { TimeArgument } from '@arguments/basics'
import type { ScheduleType } from '@commands'
import type { FinalCommandOutput } from '@commands/helpers'
import type {
  ContainerCommandNode, Node, ResourceClassArguments, ResourceNode, SandstoneCore,
} from '@core'
import type { ResourcePath } from '@pack'
import type { BASIC_CONFLICT_STRATEGIES, MakeInstanceCallable } from '@utils'

/**
 * A node representing a Minecraft function.
 */
export class MCFunctionNode extends ContainerNode implements ResourceNode {
  contextStack: (ContainerNode | ContainerCommandNode)[]

  constructor(sandstoneCore: SandstoneCore, public resource: MCFunctionClass) {
    super(sandstoneCore)
    this.contextStack = [this]
  }

  /**
   * The currently active context.
   *
   * For example, the current context is the function body if the function is not in a loop.
   * If the function is in a loop, the current context is the loop body.
   */
  get currentContext() {
    return this.contextStack[this.contextStack.length - 1]
  }

  /**
   * Sequentially add a node to the body of the function.
   *
   * @param node The node to add.
   */
  addNode = (node: Node) => this.currentContext.append(node)

  /**
   * Switch the current context to the given node.
   * Also adds the node to the body of the current context, except if addNode is False.
   *
   * @param node The node to switch to.
   * @param addNode Whether to add the node to the body of the current context.
   */
  enterContext = (node: ContainerNode | ContainerCommandNode, addNode: boolean = true) => {
    if (addNode) {
      this.currentContext.append(node)
    }

    this.contextStack.push(node)
  }

  /**
   * Switch the current context to the given node, run the given function, and switch back to the original context.
   * Also adds the node to the body of the current context, except if addNode is False.
   *
   * @param node The node to switch to.
   * @param callback The function to run.
   * @param addNode Whether to add the node to the body of the current context.
   *
   * @return The previously active context.
   * @throws Error if there is no previous context.
   */
  insideContext = (node: ContainerNode | ContainerCommandNode, callback: () => void, addNode: boolean = true) => {
    this.enterContext(node, addNode)
    callback()
    return this.exitContext()
  }

  /**
   * Leave the current context, and return to the previous one.
   *
   * @return The previously active context.
   * @throws Error if there is no previous context.
   */
  exitContext = () => {
    if (this.contextStack.length === 0) {
      throw new Error('No previous context to return to.')
    }

    if (this.contextStack.length === 1) {
      throw new Error('It is forbidden for a MCFunction to exit its latest context, since the MCFunction itself must be in the context stack.')
    }

    return this.contextStack.pop()
  }

  getValue = () => this.body.map((node) => node.getValue()).join('\n')
}

export type MCFunctionClassArguments = {
  /**
   * The callback to run when the MCFunction is generated.
   *
   * @default () => {}
   */
  callback?: () => void

  /**
   * If true, then the function will only be created if it is called from another function.
   */
  lazy?: boolean

  /**
   * Whether the function should run when the datapack loads.
   *
   * Defaults to `true` if `runEvery` is specified, else `false`.
   */
  runOnLoad?: boolean

  /**
   * The function tags to put this function in.
   */
  tags?: readonly (string /* | TagInstance<'functions'>*/)[]
} & ResourceClassArguments & ({
  /**
   * What to do if another mcfunction has the same name.
   *
   * - `throw`: Throw an error.
   * - `replace`: Replace silently the old mcfunction with the new one.
   * - `ignore`: Keep silently the old mcfunction, discarding the new one.
   * - `append`: Append the new mcfunction commands to the old one.
   * - `prepend`: Prepend the new mcfunction commands to the old one.
   */
  onConflict?: BASIC_CONFLICT_STRATEGIES | 'append' | 'prepend' | 'rename'
}) & ({
  /**
   * If specified, the function will run every given time.
   *
   * If `runOnLoad` is unspecified or `true`, then it will run on load too.
   *
   * If `runOnLoad` is `false`, you will have to manually start it.
   *
   * You can stop the automatic scheduling by running `theFunction.clearSchedule()`.
   *
   * @example
   *
   * // Run every 5 ticks, including on data pack load.
   * {
   *   runEvery: 5,
   * }
   *
   * // Run every 5 ticks, but wait 5 ticks before data pack loads for 1st execution.
   * {
   *   runEvery: 5,
   *   runOnLoad: false,
   * }
   *
   * // Run every 8 seconds
   * {
   *   runEvery: '8s'
   * }
   */
  runEvery?: TimeArgument
} | {
  /**
   * Whether the function should run each tick.
   */
  runEveryTick?: boolean
})

export class _RawMCFunctionClass extends CallableResourceClass<MCFunctionNode> {
  public callback: NonNullable<MCFunctionClassArguments['callback']>

  public tags: MCFunctionClassArguments['tags']

  public lazy: boolean

  public addToSandstoneCore: boolean

  constructor(core: SandstoneCore, path: ResourcePath, args: MCFunctionClassArguments) {
    super(core, core.pack.dataPack(), 'mcfunction', 'utf8', MCFunctionNode, path, {
      ...args,
      addToSandstoneCore: args.lazy ? false : args.addToSandstoneCore,
    })

    this.callback = args.callback ?? (() => {})

    this.lazy = !!args.lazy
    this.addToSandstoneCore = !!args.addToSandstoneCore
    this.tags = args.tags
  }

  public generate = () => {
    if (this.addToSandstoneCore && this.lazy) {
      this.core.resourceNodes.add(this.node)
    }

    if (this.node.body.length > 0) {
      /*
       * Don't generate resource if the node already has commands.
       * Else, this might generate the nodes twice with fast refresh
       */
      return
    }

    const { sandstoneCore } = this.node

    sandstoneCore.insideMCFunction(this.asCallable, () => {
      // Doing .apply allows users to use `this()` inside the callbak to call the MCFunction!
      this.callback.apply(this.asCallable)
    })
  }

  __call__ = (): FinalCommandOutput => this.commands.functionCmd(this.asCallable)

  schedule = {
    clear: (): FinalCommandOutput => this.commands.schedule.clear(this.asCallable),

    function: (delay: TimeArgument, type: ScheduleType): FinalCommandOutput => this.commands.schedule.function(this.asCallable, delay, type),
  }
}

export const MCFunctionClass = makeClassCallable(_RawMCFunctionClass)
export type MCFunctionClass = MakeInstanceCallable<_RawMCFunctionClass>
