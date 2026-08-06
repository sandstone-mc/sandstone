import { FunctionCommandNode } from 'sandstone/commands'
import type { SandstoneCommands } from 'sandstone/commands'
import type { MCFunctionClass, MCFunctionNode, MacroArgument, SandstoneCore } from 'sandstone/core'
import { ContainerCommandNode } from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'
import { ExecuteCommandNode } from 'sandstone/commands/implementations/entity/execute'

const WITH_CHILD_NAME = '__with_macro'

/**
 * `_.with(env, callback)` — runs the callback in a context where the given
 * `MacroArgument`s become macro parameters inside a child MCFunction.
 *
 * `_.with(env)` is the callback-less form: see `withCommands` below.
 *
 * The WithClass transforms itself into a `function <name> with storage ...`
 * command. Its `body` is moved into the child MCFunction, and the env vars
 * are materialized into the child's `macroPoint` storage via `data.modify`
 * commands emitted to the parent body by `mcfunction()` itself.
 *
 * The `WithNodeVisitor` is a stub for future optimization passes:
 *   - Adjacent WithNodes that share the same env can be merged into one call.
 *   - A WithNode whose body only references literal/constant values can
 *     skip the macro call entirely (just inline the body in the parent).
 *   - Dead/redundant WithNodes can be detected and elided.
 */
export class WithClass extends ContainerCommandNode {
  command = 'function' as const

  /** Child macro MCFunction that receives the env vars as parameters. */
  public mcfunction: MCFunctionClass<any, any>

  /**
   * If the WithClass was created inside an execute body (e.g.
   * `execute.as('@a').run(() => _.with(...))`) that later gets extracted
   * into its own MCFunction by ContainerCommandsToMCFunctionVisitor, this
   * records that execute so WithNodeVisitor can hoist the execute's prefix
   * onto the function call (Optimization 2).
   */
  enclosingExecute: ExecuteCommandNode | null = null

  /**
   * True when the body is supplied by the callback-less `_.with(env).<command>`
   * form. In that mode the first node appended to the body closes the context
   * and finalizes the call, mirroring `ExecuteCommandNode`'s single-execute
   * handling.
   */
  isSingleCommand = false

  /** MCFunction that hosts this `_.with` call. */
  private hostFunction: MCFunctionNode

  private finalized = false

  constructor(
    core: SandstoneCore,
    public env: MacroArgument[],
    callback?: () => void,
  ) {
    super(core.pack)

    const currentFunction = core.getCurrentMCFunctionOrThrow()
    this.hostFunction = currentFunction
    currentFunction.resource.nested += 1

    // Capture the enclosing execute (if any) so the visitor can hoist its
    // prefix when ContainerCommandsToMCFunctionVisitor extracts this
    // WithClass into its own MCFunction. `contextStack[0]` is the MCFunction
    // itself; any container above it is the enclosing execute / if / loop.
    const ctx = currentFunction.contextStack
    const topCtx = ctx[ctx.length - 1]
    if (ctx.length > 1 && topCtx instanceof ExecuteCommandNode) {
      this.enclosingExecute = topCtx
    }

    const baseName = `${currentFunction.resource.path.slice(2).join('/')}/${WITH_CHILD_NAME}`

    this.mcfunction = core.pack.MCFunction(
      baseName,
      env,
      () => {
        // Body is populated below.
      },
      {
        addToSandstoneCore: true,
        lazy: false,
        creator: 'sandstone',
        onConflict: 'rename',
        packType: currentFunction.resource.packType,
      },
    )

    // Capture user commands inside the callback into this.body.
    if (callback) {
      currentFunction.enterContext(this)
      callback()
      currentFunction.exitContext()
      this.finalize()
    }
  }

  /**
   * Enter this node's context so that the next command committed to the
   * current MCFunction lands in `this.body` instead of the parent body.
   * Used by the callback-less `_.with(env).<command>` form; `append()`
   * closes the context again once that command arrives.
   *
   * @internal
   */
  enterSingleCommand = () => {
    this.isSingleCommand = true
    this.hostFunction.enterContext(this)
  }

  append = (...nodes: Node[]) => {
    for (const node of nodes) {
      this.body.push(node)

      if (this.isSingleCommand && !this.finalized) {
        this.hostFunction.exitContext()
        this.finalize()
      }
    }

    return (nodes.length === 1 ? nodes[0] : nodes) as any
  }

  /**
   * Emit the macro call. Splits out of the constructor so the callback-less
   * form can defer it until its command has been committed to `this.body`.
   */
  private finalize = () => {
    if (this.finalized) {
      return
    }
    this.finalized = true

    // Let `mcfunction()` do its job: it sets up env.local, emits the
    // `data.modify` prep via ResolveNBT, creates a FunctionCommandNode,
    // and commits it to the parent body. The host MCFunction is still the
    // current MCFunction (mcfunctionStack has it from the outer callback),
    // so the prep commands and the function call land in the parent body.
    this.mcfunction()

    // Take the FunctionCommandNode out of the current context's body and
    // use it as our own serialization. We BECOME the function call so
    // WithClass serializes as `function <name> with storage ...`.
    //
    // `mcfunction()` appended the `data.modify` prep and the
    // FunctionCommandNode to the END of the current context's body —
    // after `this`. To get the correct order (`data.modify` THEN the
    // function call), move `this` from its current position to just
    // after the prep.
    //
    // Use the current context (top of contextStack), not the parent
    // MCFunction body, because `_.with` may be nested inside an execute
    // / if / loop body that later gets extracted into its own MCFunction.
    const parentBody = this.hostFunction.currentContext.body
    const myIndex = parentBody.indexOf(this)
    if (myIndex !== -1) {
      let fnCmdIdx = -1
      for (let i = myIndex + 1; i < parentBody.length; i++) {
        if (parentBody[i] instanceof FunctionCommandNode) {
          this.args = [...(parentBody[i] as FunctionCommandNode).args]
          fnCmdIdx = i
          break
        }
      }

      if (fnCmdIdx !== -1) {
        // Remove the FunctionCommandNode (we've absorbed its args).
        parentBody.splice(fnCmdIdx, 1)
        // Move `this` to right after the data.modify prep — i.e. to the
        // position the FunctionCommandNode used to occupy (minus 1 for
        // the splice), so the body becomes [..., prep..., this (→ call)].
        parentBody.splice(myIndex, 1)
        parentBody.splice(fnCmdIdx - 1, 0, this)
      }
    }
  }
}

/**
 * Callback-less `_.with(env)` — returns a `SandstoneCommands<true>` proxy
 * whose first accessed command becomes the body of the child macro
 * MCFunction. Equivalent to passing that single command as the callback:
 *
 * ```ts
 * _.with([world]).say($`Hello ${world}!`)
 * // same as
 * _.with([world], () => { $.say($`Hello ${world}!`) })
 * ```
 */
export function withCommands(core: SandstoneCore, env: MacroArgument[]): SandstoneCommands<true> {
  // Route through `macroCommands` so the commands inside the child function
  // carry `isMacro: true` — the body always runs in a macro context.
  const commandsSource = core.pack.macroCommands as any

  return new Proxy(commandsSource, {
    get: (target, p, receiver) => {
      // Don't create a WithClass for incidental probes (util.inspect,
      // `then` on await, etc.) — only for real command accesses.
      if (typeof p === 'symbol' || !(p in target)) {
        return Reflect.get(target, p, receiver)
      }

      new WithClass(core, env).enterSingleCommand()

      return target[p]
    },
  }) as SandstoneCommands<true>
}
