import { ExecuteCommandNode } from 'sandstone/commands'
import { MCFunctionNode } from 'sandstone/core'
import { WithClass } from 'sandstone/flow/macro'
import { ResolveNBTNode, ResolveNBTPartClass } from 'sandstone/variables/ResolveNBT'
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
    for (const withClass of this.pack.core.withNodes) {
      // The MCFunction that currently contains this WithClass. Updated
      // by `MCFunctionNode.body`'s setter when `ContainerCommandsToMCFunctionVisitor`
      // extracts an enclosing execute body into a new wrapper — without
      // the update, `withClass.hostFunction` (captured at construction)
      // would still point at the original caller.
      const fn = withClass.containingMCFunction
      if (!fn) throw new Error(`[WithNodeVisitor] WithClass has no containingMCFunction — body assignment must have been skipped.`)
      const node: WithClass = withClass

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
      // contain a single leading ResolveNBTNode carrying the macro
      // storage prep (one `set from` per env var — the leading
      // `set value {}` reset is skipped when the wrapper dataPoint is
      // dedicated to this resolve). That prep travels with the function
      // call so the storage is still set up correctly.
      const myIndex = fn.body.indexOf(node)
      const prep = myIndex > 0 ? fn.body[myIndex - 1] : undefined
      if (
        node.enclosingExecute
        && node.enclosingExecute.createdMCFunction?.node === fn
        && !node.enclosingExecute.isMacro
        && prep instanceof ResolveNBTNode
        && this.resolveNBTMatchesEnv(prep, node)
      ) {
        this.hoistExtractedExecutePrefix(node, node.enclosingExecute, fn)
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

    // The grandparent MCFunction is the one that hosted this `_.with`
    // before ContainerCommandsToMCFunctionVisitor extracted the enclosing
    // execute. WithClass tracks it directly via `hostFunction`.
    const grandParentBody = node.hostFunction.body
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
   * The prep block for `_.with(env)` is wrapped in a `ResolveNBTNode`.
   * Validate by matching the node's input NBT against the WithClass' env
   * list: the NBT must be a plain object with one `ResolveNBTPart` entry
   * per env var, each pointing at the matching env DataPoint.
   */
  private resolveNBTMatchesEnv(node: ResolveNBTNode, withClass: WithClass): boolean {
    const { nbt } = node
    if (!nbt || (nbt as { constructor?: { name: string } }).constructor?.name !== 'Object') return false

    const entries = Object.entries(nbt)
    if (entries.length !== withClass.env.size) return false

    for (const [, value] of entries) {
      if (!(value instanceof ResolveNBTPartClass)) return false
      if (!withClass.env.has(value.value as never)) return false
    }
    return true
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
