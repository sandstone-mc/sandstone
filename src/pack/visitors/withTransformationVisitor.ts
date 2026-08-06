import { ExecuteCommandNode } from 'sandstone/commands'
import { MCFunctionNode } from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'
import { WithClass } from 'sandstone/flow/macro'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Structural-transform visitor for `_.with(env, callback)` nodes.
 *
 * `WithClass` captures the user callback body into its own `body` and
 * becomes the `function <name> with storage ...` call at construction.
 * The body needs to live in the child MCFunction so the commands actually
 * execute inside the macro context, so this visitor moves it there.
 *
 * Optimizations (in order of application):
 *   1. **Hoist single-execute prefix.** When the body is a single
 *      `execute ... run(() => <commands>)`, lift the execute's prefix
 *      onto the function call itself:
 *         `function ... with ...`           →   `execute ... run function ... with ...`
 *      and put the inner commands directly in the child mcfunction.
 *      This produces the more compact output the user expects:
 *         `execute as @a at @s run function foo/__with_macro with ...`
 *      instead of having to wrap every command in an `$execute` inside
 *      the child mcfunction.
 *   2. **Hoist extracted-execute prefix.** When the WithClass sits alone
 *      inside an MCFunction that was created by an extracted execute
 *      (ContainerCommandsToMCFunctionVisitor pulled the body out), the
 *      execute wrapper is redundant. Lift its prefix onto the function
 *      call, delete the now-empty wrapper MCFunction, and inline the
 *      WithClass body into the child macro MCFunction directly:
 *         `execute as @a at @s run function foo/__execute_as2`
 *           (where `__execute_as2` is just `function foo/__with_macro ...`)
 *         becomes
 *           `execute as @a at @s run function foo/__with_macro with ...`
 *      with the WithClass body's commands moved into `__with_macro`.
 */
export class WithNodeVisitor extends GenericSandstoneVisitor {
  visitMCFunctionNode = (node: MCFunctionNode) => this.genericVisit(node)

  onEnd = () => {
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue

      for (const node of fn.body) {
        if (!(node instanceof WithClass)) continue

        // Move the user's callback body into the child macro MCFunction.
        node.mcfunction.node.body.push(...node.body)

        // Optimization 1: hoist a single-execute prefix onto the function call.
        if (
          node.mcfunction.node.body.length === 1
          && node.mcfunction.node.body[0] instanceof ExecuteCommandNode
          && !(node.mcfunction.node.body[0] as ExecuteCommandNode).isMacro
        ) {
          this.hoistSingleExecutePrefix(node, fn)
          continue
        }

        // Optimization 2: the WithClass sits inside an MCFunction that was
        // extracted from an execute. Hoist the wrapping execute's prefix
        // onto the function call, and merge the WithClass body into the
        // child macro MCFunction. The wrapperFn body is allowed to
        // contain leading `data.modify` prep commands — those travel with
        // the function call so the storage is still set up correctly.
        if (
          node.enclosingExecute
          && node.enclosingExecute.createdMCFunction?.node === fn
          && !node.enclosingExecute.isMacro
          && this.isOnlyDataModifiesAndWithClass(fn.body, node)
        ) {
          this.hoistExtractedExecutePrefix(node, node.enclosingExecute, fn)
        }
      }
    }
  }

  /**
   * Optimization 1: lift the inner execute's prefix out of the child
   * mcfunction and onto a new execute that wraps the function call.
   *
   *   Before: child = [`$execute as @a at @s run playsound ...`]
   *           parent = `function default:foo/__with_macro with storage ...`
   *
   *   After:  child = [`playsound block.ancient_debris.break block @s ~ ~ ~ $(env_0)`]
   *           parent = `execute as @a at @s run function default:foo/__with_macro with storage ...`
   *
   * The execute body is moved into the child mcfunction directly (no
   * wrapping `$execute` prefix) — the parent function call already
   * inherits the execute context from the hoisted prefix.
   */
  private hoistSingleExecutePrefix(node: WithClass, parentFn: MCFunctionNode) {
    const innerExecute = node.mcfunction.node.body[0] as ExecuteCommandNode

    // The execute's args are `[['as', '@a'], ['at', '@s']]` etc. The 'run'
    // subcommand is implicit when the body has commands — it's handled by
    // getValue() based on `body.length > 0`. Reuse the args verbatim on
    // the new wrapper.
    //
    // Skip the trailing `['run', ...]` arg if present (callback-mode
    // execute has body so 'run' isn't in args; this is defensive).
    const innerArgs = innerExecute.args.filter((arg) => arg[0] !== 'run')

    // Move the inner execute's body directly into the child mcfunction —
    // no need to keep the execute wrapper since the parent function call
    // already supplies the context.
    node.mcfunction.node.body = [...innerExecute.body]

    // Build a new ExecuteCommandNode that wraps the function call.
    // Use the same NodeType (ExecuteCommandNode) but with our hoisted
    // args and a body containing just the FunctionCommandNode.
    const wrappedFnCall = this.makeFunctionCallNode(node)

    const wrapped = new ExecuteCommandNode(this.pack, false, innerArgs, {
      isSingleExecute: false,
    })
    // The wrapped execute's body is the function call itself.
    ;(wrapped as any).body = [wrappedFnCall]
    ;(wrapped as any).isMacro = (wrappedFnCall as any).isMacro ?? false

    // Splice WithClass out of the parent body and replace with `wrapped`.
    const parentBody = parentFn.body
    const myIndex = parentBody.indexOf(node)
    if (myIndex !== -1) {
      parentBody.splice(myIndex, 1, wrapped)
    }
    node.commited = true
  }

  /**
   * Optimization 2: the WithClass is the only thing inside an MCFunction
   * that was extracted from an execute (ContainerCommandsToMCFunctionVisitor
   * pulled the execute body into its own MCFunction). The execute wrapper
   * is redundant — lift its prefix onto the function call and delete the
   * wrapper MCFunction.
   *
   *   Before: parent = `execute as @a at @s run function foo/__execute_as2`
   *           wrapper = `function default:foo/__with_macro with storage ...`
   *           child   = [`$playsound ... $(env_0)`]
   *
   *   After:  parent = `execute as @a at @s run function foo/__with_macro with storage ...`
   *           (wrapper MCFunction deleted)
   *           child   = [`$playsound ... $(env_0)`]
   */
  private hoistExtractedExecutePrefix(node: WithClass, outerExecute: ExecuteCommandNode, wrapperFn: MCFunctionNode) {
    // The outer execute's args (e.g. `[['as', '@a'], ['at', '@s']]`) become
    // the prefix of the new wrapper execute. Skip any trailing `run` arg.
    const outerArgs = outerExecute.args.filter((arg) => arg[0] !== 'run')

    // The wrapperFn body is `[...data.modify prep..., WithClass]`. The
    // `data.modify` commands are the macro storage setup emitted by
    // `mcfunction()` — they must travel with the function call to keep
    // the storage prep before the call. Take everything up to and
    // including the WithClass.
    const myIndex = wrapperFn.body.indexOf(node)
    const movable = wrapperFn.body.splice(0, myIndex + 1)

    // Build the new wrapper execute: outerArgs + WithClass as body.
    const wrappedFnCall = this.makeFunctionCallNode(node)
    const wrapped = new ExecuteCommandNode(this.pack, false, outerArgs, {
      isSingleExecute: false,
    })
    ;(wrapped as any).body = [wrappedFnCall]
    ;(wrapped as any).isMacro = (wrappedFnCall as any).isMacro ?? false

    // Find the wrapper execute in its parent body and splice in the
    // prep commands + the new wrapped execute.
    const grandParentBody = this.findGrandparentBody(outerExecute)
    if (!grandParentBody) return
    const idx = grandParentBody.indexOf(outerExecute)
    if (idx !== -1) {
      // Replace outerExecute with [...prep..., wrapped].
      grandParentBody.splice(idx, 1, ...movable.slice(0, -1), wrapped)
    }

    // Delete the now-empty wrapper MCFunction from the resource registry.
    this.pack.core.resourceNodes.delete(wrapperFn)
    wrapperFn.body = []

    node.commited = true
  }

  /**
   * Walk every MCFunction in the pack looking for the one whose body
   * contains `execute`. That's the parent MCFunction whose body needs
   * to be mutated.
   */
  private findGrandparentBody(execute: ExecuteCommandNode): Node[] | null {
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      if (fn.body.includes(execute)) return fn.body
    }
    return null
  }

  /**
   * The wrapperFn body may only contain `data.modify` commands (the macro
   * storage prep emitted by `mcfunction()` — exactly one `set value {}`
   * to init the args object plus one `set from` per env var) followed by
   * the WithClass itself. Anything else means the wrapper has user content
   * and we can't hoist its execute prefix.
   */
  private isOnlyDataModifiesAndWithClass(body: Node[], withClass: WithClass): boolean {
    let dataModifies = 0
    for (const n of body) {
      if (n === withClass) continue
      const cmd = (n as any).command
      if (cmd !== 'data') return false
      dataModifies += 1
    }
    return dataModifies === withClass.env.length + 1
  }

  /**
   * Rebuild the FunctionCommandNode for `function <name> with storage
   * <target> <path>` from the WithClass' stored args (the constructor
   * spliced its own representation in). We rebuild a fresh node so the
   * wrapped execute owns it cleanly.
   */
  private makeFunctionCallNode(node: WithClass) {
    // node.args is `[name, 'with', 'storage', target, path]` after the
    // constructor absorbed the FunctionCommandNode. Use those directly.
    return node
  }
}
