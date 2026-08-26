import type { SandstonePack } from 'sandstone/pack'
import type { LoopArgument } from 'sandstone/variables'
import { ResolvedNBT } from 'sandstone/variables/nbt/NBTs'
import * as util from 'util'
import { formatDebugString } from '../utils'
import { isMacroArgument, type MacroArgument } from './Macro'
import type { MCFunctionClass, MCFunctionNode } from './resources/datapack'
import type { SandstoneCore } from './sandstoneCore'

export abstract class Node {
  constructor(public sandstoneCore: SandstoneCore) {}

  [util.inspect.custom](_depth: number, _options: any) {
    return `${this.constructor.name}()`
  }

  abstract getValue(): any

  type = this.constructor.name
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerNode extends Node {
  _body: Node[]

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)

    this._body = []
  }

  get body(): Node[] {
    return this._body
  }

  set body(body: Node[]) {
    this._body = body
  }

  generateBody(callback: () => void): Node[] {
    // Enter the current node's body
    this.sandstoneCore.insideContext(this, () => {
      callback()
    })

    // Return the body of this node.
    return this.body
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append<NODE extends Node>(node: NODE): NODE

  /**
   * Appends several nodes at the end of this node's body.
   */
  append<NODES extends Node[]>(...nodes: NODES): NODES

  append(...nodes: Node[]) {
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  /**
   * Prepends a node to the beginning of this node's body.
   */
  prepend<NODE extends Node>(node: NODE): NODE

  /**
   * Prepends several nodes to the beginning of this node's body.
   */
  prepend<NODES extends Node[]>(...nodes: NODES): NODES

  prepend(...nodes: Node[]) {
    this.body.unshift(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, undefined, this.body, options.indent)
  }
}

/**
 * A node that represents a generic command.
 */
export abstract class CommandNode<ARGS extends unknown[] = unknown[]> extends Node {
  abstract command: string

  args: ARGS

  commited = false

  isMacro = false

  constructor(
    public sandstonePack: SandstonePack,
    ...args: ARGS
  ) {
    super(sandstonePack.core)
    this.args = args
  }

  getValue() {
    const filteredArgs: unknown[] = this.command === '' ? [] : [this.command]

    // `this.isMacro` is the sole signal that decides the `$` prefix. It must
    // be set at construction by `Macro as $`, helpers.ts propagation, or the
    // node's own constructor when the syntax is intrinsically macro (e.g.
    // `function <name-with-$(...)>`).
    //
    // We track `hasMacroArgs` purely as a sanity check: an arg that IS a
    // macro argument landing on a non-macro-declared node means the caller
    // forgot to declare macro → throw.
    //
    // Note: `function <name> with storage <path>` is NOT a macro command.
    // The `with` clause routes env-var resolution at runtime, but the
    // function name has no `$(...)`, so the serialized args are plain
    // strings — `hasMacroArgs` stays false.
    let hasMacroArgs = false

    for (const arg of this.args) {
      if (arg !== undefined && arg !== null) {
        // Yes these are cursed, unfortunately, there's not really a better way to do this as visitors only visit the root nodes.
        if (typeof arg === 'object') {
          if (arg instanceof ResolvedNBT) {
            // ResolvedNBT carries macro info forward from nbtResolver recursion,
            // so we can detect $(...) substitutions that originated inside nested
            // NBT values rather than from a top-level MacroArgument object.
            if (arg.containsMacro) {
              hasMacroArgs = true
            }
            filteredArgs.push(arg)
          } else if (isMacroArgument(this.sandstoneCore, arg)) {
            hasMacroArgs = true

            filteredArgs.push((arg as MacroArgument).toMacro())
          } else if (Object.hasOwn(arg, '_hasMacro') && (arg as { _hasMacro: boolean })._hasMacro) {
            // Selector (and any similar complex arg that stringifies `$(...)`
            // via its own toString) exposes macro info via _hasMacro so the
            // command can still be flagged as a macro command.
            hasMacroArgs = true

            filteredArgs.push(arg)
          } else if (Object.hasOwn(arg, 'toLoop')) {
            filteredArgs.push((arg as LoopArgument).toLoop())
          } else {
            filteredArgs.push(arg)
          }
        } else {
          filteredArgs.push(arg)
        }
      }
    }

    if (hasMacroArgs && !this.isMacro) {
      throw new Error(`[${this.constructor.name}#getValue] Received macro argument(s) but was not declared as a macro command.`)
    }
    if (!hasMacroArgs && this.isMacro) {
      throw new Error(`[${this.constructor.name}#getValue] Command was declared as a macro command but received no macro argument(s).`)
    }

    return `${this.isMacro ? '$' : ''}${filteredArgs.join(' ')}`
  }

  /**
   * Commits the command to the current MCFunction context.
   */
  commit() {
    if (this.commited) {
      return this
    }
    this.commited = true

    return this.sandstonePack.appendNode(this)
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.args, undefined, options.indent)
  }
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerCommandNode<ARGS extends unknown[] = unknown[]>
  extends CommandNode<ARGS>
  implements ContainerNode {
  abstract command: string

  _body: Node[]

  constructor(sandstonePack: SandstonePack, ...args: ARGS) {
    super(sandstonePack, ...args)
    this._body = []
  }

  get body(): Node[] {
    return this._body
  }

  set body(body: Node[]) {
    this._body = body
  }

  generateBody(callback: () => void): Node[] {
    // Enter the current node's body
    this.sandstoneCore.insideContext(this, () => {
      callback()
    })

    // Return the body of this node.
    this._body = this.body
    return this._body
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append(node: Node) {
    this.body.push(node)
    return node
  }

  /**
   * Appends a node at the end of this node's body.
   */
  prepend(node: Node) {
    this.body.unshift(node)
    return node
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.args, this.body, options.indent)
  }

  /**
   * Create a MCFunction from this node.
   * It shouldn't be added to Sandstone's core.
   *
   * The returned node will replace
   */
  createMCFunction: (currentMCFunction: MCFunctionNode | null) => { node: Node | Node[]; mcFunction?: MCFunctionNode } =
    (_currentMCFunction) => ({ node: this })
}

export abstract class AwaitNode extends ContainerCommandNode {
  mcfunction: MCFunctionClass<any, any> = undefined as unknown as MCFunctionClass<any, any>

  /**
   * The MCFunction whose body currently contains this AwaitNode. Captured
   * at construction (the MCFunction whose context the node was appended
   * to via `enterContext`) and refreshed by
   * `ContainerCommandsToMCFunctionVisitor` when the node's containing
   * execute body is extracted into a new MCFunction. Lets
   * `AwaitBodyVisitor.cleanupUntil` find the await's direct parent in
   * O(1) instead of scanning `core.resourceNodes`.
   */
  parentMCFunction: MCFunctionNode | undefined
}

export type AwaitNodeClass = new (core: SandstoneCore, ...args: any[]) => AwaitNode