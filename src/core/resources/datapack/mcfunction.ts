import type { TimeArgument } from 'sandstone/arguments/basics'
import type { NBTObject, NBTSerializable } from 'sandstone/arguments/nbt'
import type { ScheduleType } from 'sandstone/commands'
import type { FinalCommandOutput } from 'sandstone/commands/helpers'
import type {
  ContainerCommandNode,
  MacroArgument,
  Node,
  ResourceClassArguments,
  ResourceNode,
  SandstoneCore,
} from 'sandstone/core'
import { formatDebugString, makeCallable, makeClassCallable } from 'sandstone/utils'
import * as util from 'util'
import type { MakeInstanceCallable } from '../../../utils'
import { ResolveNBTPart } from '../../../variables/ResolveNBT'
import { ContainerNode } from '../../nodes'
import { CallableResourceClass } from '../resource'
import { TagClass } from './tag'

const tags: Record<string, TagClass<'function'>> = {}

// interface AttributeWrapper {
//  attributes: string[]
// }

// type MapperA2<Wrapper extends AttributeWrapper> = {
//  [Index in keyof Wrapper['attributes']]: Wrapper['attributes'][Index]
// }

/**
 * A node representing a Minecraft function.
 */
export class MCFunctionNode extends ContainerNode implements ResourceNode {
  contextStack: (ContainerNode | ContainerCommandNode)[]

  constructor(
    sandstoneCore: SandstoneCore,
    public resource: MCFunctionClass<any, any>,
  ) {
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
   * Sequentially add node(s) to the end of the body of the function.
   *
   * @param node The node(s) to add.
   */
  appendNode = (node: Node | Node[]) => {
    if (Array.isArray(node)) {
      for (const _node of node) {
        this.currentContext.append(_node)
      }
    } else {
      this.currentContext.append(node)
    }
  }

  /**
   * Sequentially add node(s) to the beginning of the body of the function.
   *
   * @param node The node(s) to add.
   */
  prependNode = (node: Node | Node[]) => {
    if (Array.isArray(node)) {
      for (const _node of node) {
        this.currentContext.prepend(_node)
      }
    } else {
      this.currentContext.prepend(node)
    }
  }

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
      throw new Error(
        'It is forbidden for a MCFunction to exit its latest context, since the MCFunction itself must be in the context stack.',
      )
    }

    return this.contextStack.pop()
  }

  getValue = () => {
    this.sandstoneCore.currentNode = this.resource.name

    return this.body
      .filter((node) => node.getValue() !== null)
      .map((node) => node.getValue())
      .join('\n')
  };

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(
      this.constructor.name,
      {
        name: this.resource.name,
      },
      this.body,
      options.indent,
    )
  }
}

export type MCFunctionClassArguments = {
  /**
   * The callback to run when the MCFunction is generated.
   *
   * @default () => {}
   */
  callback?: (...params: [loop: MCFunctionClass<any, any>, ...params: MacroArgument[]]) => void

  /**
   * If true, then the function will only be created if it is called from another function.
   */
  lazy?: boolean

  /**
   * Whether the function should run when the datapack loads.
   *
   * Defaults to `true` if `runEvery` is specified, else `false`.
   *
   * Incompatible with macro parameters.
   */
  runOnLoad?: boolean

  /**
   * The function tags to put this function in.
   */
  tags?: readonly (string | TagClass<'function'>)[]

  /**
   * If specified, the function will run every given time.
   *
   * If `runOnLoad` is unspecified or `true`, then it will run on load too.
   *
   * If `runOnLoad` is `false`, you will have to manually start it.
   *
   * You can stop the automatic scheduling by running `theFunction.clearSchedule()`.
   *
   * Incompatible with macro parameters.
   *
   * @example
   *
   * // Run every 5 ticks, including on datapack load.
   * {
   *   runEvery: 5,
   * }
   *
   * // Run every 5 ticks, but wait until 5 ticks after the datapack loads for 1st execution.
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

  /**
   * Whether the function should run each tick.
   *
   * Incompatible with macro parameters.
   */
  runEveryTick?: boolean

  /**
   * Optional. Whether to retain the execution context through async calls. Defaults to false.
   */
  asyncContext?: boolean
} & ResourceClassArguments<'function'>

export class _RawMCFunctionClass<
  PARAMS extends readonly MacroArgument[] | undefined,
  ENV extends readonly MacroArgument[] | undefined,
> extends CallableResourceClass<MCFunctionNode> implements NBTSerializable {
  static readonly resourceType = 'function'

  public callback: NonNullable<MCFunctionClassArguments['callback']>

  public nested = 0

  public asyncContext: NonNullable<MCFunctionClassArguments['asyncContext']>

  /** @internal */
  tags: MCFunctionClassArguments['tags']

  /** @internal */
  lazy: boolean

  /** @internal */
  env?: ENV

  constructor(core: SandstoneCore, name: string, args: MCFunctionClassArguments, env?: ENV) {
    if (name.startsWith('./')) {
      // We have a relative name.
      const currentMCFunctionName = core.currentMCFunction?.resource.name
      if (!currentMCFunctionName) {
        throw new Error('Cannot use relative paths outside of an existing MCFunction.')
      }

      name = `${currentMCFunctionName}/${name.slice(2)}`
    }

    super(
      core,
      { packType: core.pack.dataPack(), extension: 'mcfunction' },
      MCFunctionNode,
      _RawMCFunctionClass.resourceType,
      core.pack.resourceToPath(name, ['function']),
      {
        ...args,
        addToSandstoneCore: args.lazy ? false : args.addToSandstoneCore,
      },
    )

    this.callback = args.callback ?? (() => {})

    if (this.nested !== 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.nested; i++) {
        this.node.exitContext()
      }
    }

    this.asyncContext = args.asyncContext === undefined ? false : args.asyncContext

    this.lazy = !!args.lazy
    this.addToSandstoneCore = !!args.addToSandstoneCore
    this.tags = args.tags

    if (env) {
      this.env = env
    }

    if (args.runOnLoad) {
      if (env) {
        core.pack.loadTags.load.push(
          core.pack.MCFunction(`load_${this.name.split(':')[1]}`, () => {
            /* @ts-ignore */
            this.__call__()
          }),
        )
      } else {
        core.pack.loadTags.load.push(this.name)
      }
    } else if (args.runEveryTick) {
      /* @ts-ignore */
      core.pack.registerTickedCommands('1t', () => this.__call__())
    }

    if (args.tags) {
      for (const tag of args.tags) {
        this.addToTag(`${tag}`)
      }
    }

    if (!args.runEveryTick && args.runEvery) {
      /* @ts-ignore */
      core.pack.registerTickedCommands(args.runEvery, () => this.__call__())
    }

    this.handleConflicts()
  }

  /** @internal */
  generate = () => {
    if (this.node.body.length > 0) {
      /*
       * Don't generate resource if the node already has commands.
       * Else, this might generate the nodes twice with fast refresh
       */
      // return
      // TODO: Look into doing more optimized HMR with the new watcher eventually, for now this doesn't matter anymore
    }

    this.push(this.callback.bind(undefined, makeCallable(this, this.__call__)))
  }

  protected addToTag = (tag: string) => {
    let func: MCFunctionClass<undefined, undefined>
    if (this.env !== undefined) {
      func = this.core.pack.MCFunction(`${this.name}/tag_call`, {
        addToSandstoneCore: true,
        creator: 'sandstone',
        onConflict: 'rename',
        // @ts-ignore: this breaks functions with parameters
        callback: () => this.__call__(),
      })
    } else {
      func = this as unknown as MCFunctionClass<undefined, undefined>
    }
    if (tags[tag]) {
      tags[tag].push(func)
    } else {
      tags[tag] = new TagClass(this.core, 'function', tag, {
        values: [func],
        addToSandstoneCore: true,
        creator: 'sandstone',
        onConflict: 'append',
      })
    }
  }

  __call__ = (..._params: PARAMS extends undefined ? [] : PARAMS): FinalCommandOutput => {
    if (this.env || _params.length !== 0) {
      const args: NBTObject = {}

      if (_params.length !== 0) {
        for (const [i, param] of _params.entries()) {
          // Haha funny TypeScript
          /* @ts-ignore */
          args[`param_${i}`] = ResolveNBTPart(param)

          param.local.set(this.name, `param_${i}`)
        }
        // Yeah this is cursed, but there's not really a better way to do this
        this.node.body = []

        /* @ts-ignore */
        this.core.insideContext(
          this.node,
          () =>
            this.callback(
              makeCallable(this, (this as any).__call__.bind(undefined, ..._params)),
              ...(_params as MacroArgument[]),
            ),
          false,
        )
      }
      if (this.env) {
        for (const [i, env] of this.env.entries()) {
          // Haha funny TypeScript
          /* @ts-ignore */
          args[`env_${i}`] = ResolveNBTPart(env)

          env.local.set(this.name, `env_${i}`)
        }
      }
      return this.commands.functionCmd(this.name, 'with', this.pack.ResolveNBT(args).dataPoint)
    }

    return this.commands.functionCmd(this.name)
  }

  schedule = {
    clear: (): FinalCommandOutput => this.commands.schedule.clear(this.name),

    function: (delay: TimeArgument, type: ScheduleType): FinalCommandOutput =>
      this.commands.schedule.function(this.name, delay, type),
  }

  push(...contents: _RawMCFunctionClass<PARAMS, ENV>[] | [() => any]) {
    if (contents[0] instanceof _RawMCFunctionClass) {
      for (const mcfunction of contents as _RawMCFunctionClass<PARAMS, ENV>[]) {
        this.node.body.push(...mcfunction.node.body)
      }
    } else {
      this.core.enterMCFunction(this)
      this.core.insideContext(this.node, contents[0], false)
      this.core.exitMCFunction()
    }
  }

  unshift(...contents: _RawMCFunctionClass<PARAMS, ENV>[] | [() => any]) {
    const fake = new MCFunctionClass(this.core, 'fake', {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'ignore',
    })

    if (contents[0] instanceof _RawMCFunctionClass) {
      for (const mcfunction of contents as _RawMCFunctionClass<PARAMS, ENV>[]) {
        this.node.body.unshift(...mcfunction.node.body)
      }
    } else {
      this.core.enterMCFunction(fake)
      this.core.insideContext(fake.node, contents[0], false)
      this.core.exitMCFunction()
      this.node.body.unshift(...fake.node.body)
    }
  }

  splice(start: number, removeItems: number | 'auto', ...contents: _RawMCFunctionClass<PARAMS, ENV>[] | [() => void]) {
    const fake = new MCFunctionClass(this.core, 'fake', {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'ignore',
    })

    const fullBody: Node[] = []

    if (contents[0] instanceof _RawMCFunctionClass) {
      for (const mcfunction of contents as _RawMCFunctionClass<PARAMS, ENV>[]) {
        fullBody.push(...mcfunction.node.body)
      }
    } else {
      this.core.enterMCFunction(fake)
      this.core.insideContext(fake.node, contents[0], false)
      this.core.exitMCFunction()
      fullBody.push(...fake.node.body)
    }

    this.node.body.splice(start, removeItems === 'auto' ? fullBody.length : removeItems, ...fullBody)
  }

  /**
   * @internal
   */
  toNBT() {
    return this.name
  }
}

export const MCFunctionClass = makeClassCallable(_RawMCFunctionClass)
export type MCFunctionClass<
  PARAMS extends readonly MacroArgument[] | undefined = undefined,
  ENV extends readonly MacroArgument[] | undefined = undefined,
> = MakeInstanceCallable<_RawMCFunctionClass<PARAMS, ENV>> & NBTSerializable
