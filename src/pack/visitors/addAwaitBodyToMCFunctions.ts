import type { Node } from 'sandstone/core/nodes'
import { ContainerCommandNode, ContainerNode, MCFunctionClass, MCFunctionNode } from 'sandstone/core'
import { UntilClass } from 'sandstone/flow'
import { GenericSandstoneVisitor } from './visitor'
import { FinalCommandOutput, TagCommandNode } from 'sandstone/commands';

/**
 * After every other transformation visitor has run, this visitor finalizes
 * each await. For non-Until awaits it pushes the post-await body into the
 * await's continuation mcfunction. For `UntilClass`, `cleanupUntil` flattens
 * the three nested mcfunctions (`<parent>`, `__until/_poller`,
 * `__until/_continuation`) into the parent: the poller's poll logic is
 * spliced in place of the until, the sleep mcfunction is folded into the
 * poller (its `tag @s remove` is unshifted, its re-poll schedule is
 * redirected to call the poller directly), and the transient helpers +
 * continuation + sleep are dropped from the resource graph so they don't
 * get serialized.
 *
 * One wrinkle: when the post-await body is multi-command, splicing it
 * into the `return run function <continuation>` wrapper would break MC's
 * 1-child constraint. In that case we leave the wrapper calling the
 * continuation, push the post-await body into the continuation mcfunction
 * (via `UntilClass.continuationStillReferenced` so we don't delete it),
 * and MC runs it at runtime.
 */
export class AwaitBodyVisitor extends GenericSandstoneVisitor {
  onEnd = () => {
    const { core } = this.pack

    for (const awaitNode of core.awaitNodes) {
      if (awaitNode instanceof UntilClass) {
        this.cleanupUntil(awaitNode)
        continue
      }

      awaitNode.mcfunction.node.body.push(...awaitNode.body)
    }
  }

  private cleanupUntil(until: UntilClass): void {
    const pollerNode = until.poller.node
    const continuationNode = until.continuation.node
    if (!pollerNode || !continuationNode) return

    const parent = until.parentMCFunction
    if (!parent) {
      until.mcfunction.node.body.push(...until.body)
      return
    }

    // Replace the until with the poller's body. If the until sits directly
    // in `parent.body` splice in place; if it's wrapped deeper (e.g. inside
    // `execute.run(() => …)` inside `_.if(...)`) walk down to find it —
    // splicing at `parent.body.length` would put the inlined post-await
    // code after sibling commands and reverse user order.
    const awaitIdx = parent.body.indexOf(until as unknown as Node)
    if (awaitIdx !== -1) {
      parent.body.splice(awaitIdx, 1, ...pollerNode.body)
    } else if (!this.replaceRecursive(parent, until, pollerNode.body)) {
      parent.body.push(...pollerNode.body)
    }

    const toDelete = this.collectTransientHelpers(pollerNode, until)

    this.inlineTransientCalls(pollerNode, until.body, continuationNode, toDelete, until)

    if (until.continuationStillReferenced) {
      continuationNode.body.push(...until.body)
    }

    const sleepClass = until.sleepClass
    const sleepNode = sleepClass?.mcfunction.node

    if (sleepClass && sleepNode) {
      // Rewrite the SleepClass's own `schedule function <sleep>` slot and
      // (for asyncContext) the `_context` selector's leaf `function <sleep>`
      // call directly — both were captured as references at sleep
      // construction so we don't walk the tree.
      // Lift the sleep's `tag @s remove <timer>` into the poller so the
      // sleep mcfunction itself can be deleted. We captured a direct
      // reference to the tag command on `SleepClass.tagCommand` at
      // construction time.
      if (sleepClass.cleanupLabel) {
        pollerNode.body.unshift(sleepClass.cleanupLabel)
      }

      this.redirectFunctionCalls(sleepClass, pollerNode.resource.name)
    }

    // Drop orphans. The poller stays — its `_context` selector calls back
    // to it on every re-poll. The continuation stays only if its wrapper
    // still references it (multi-body case above).
    for (const fn of toDelete) {
      this.pack.core.resourceNodes.delete(fn as any)
    }
    if (sleepNode) this.pack.core.resourceNodes.delete(sleepNode as any)
    if (!until.continuationStillReferenced) {
      this.pack.core.resourceNodes.delete(continuationNode as any)
    }
  }

  /**
   * Rewrite the first reference to `oldTargetName` under `root` (recursive
   * into nested containers and executes) to point at `newTargetName`.
   * Covers the three call sites that take a function name: `function X`
   * (`args[0]`), `schedule function X` (`args[1]`), and the inner call
   * of `return run function X` (`args[0]` inside the wrapper's body).
   * Exits on first rewrite — for the sleep→poller re-point there is
   * exactly one reference, no need to walk further.
   */
  private redirectFunctionCalls(
    sleepNode: { args: unknown[]; contextLeaf?: FinalCommandOutput; tagCommand?: TagCommandNode; mcfunction: MCFunctionClass },
    newTargetName: string,
  ): boolean {
    // `sleepNode` is the SleepClass — the `schedule function <sleep> …`
    // command itself. Rewrite its target slot directly.
    const oldName = sleepNode.mcfunction.name
    if (sleepNode.args[1] === oldName) {
      sleepNode.args[1] = newTargetName
      return true
    }
    // asyncContext-only: the leaf `function <sleep>` inside the `_context`
    // selector's body. Captured at sleep construction time. The functionCmd
    // helper converts the MCFunctionClass to its resource name string, so
    // `leaf.args[0]` is a string.
    const leaf = sleepNode.contextLeaf
    if (leaf && leaf['node'].args[0] === oldName) {
      leaf['node'].args[0] = newTargetName
      return true
    }
    return false
  }

  /**
   * Walk `root` and replace every `function <continuation>` call with
   * `replacement`, and every `function <helper>` call with the helper's own
   * body (recursively, since helpers may themselves contain helper calls).
   * `replacement` is typically `until.body` — the user's post-await code.
   * Modifies the tree in place.
   */
  private inlineTransientCalls(
    root: ContainerNode,
    replacement: Node[],
    continuation: MCFunctionNode,
    helpers: MCFunctionNode[],
    until?: UntilClass,
  ): void {
    const body = (root as any).body as Node[] | undefined
    if (!Array.isArray(body)) return

    for (let i = 0; i < body.length; i++) {
      const child = body[i]
      if (!child) continue

      const spliceNodes = this.tryInlineFunctionCall(child, replacement, continuation, helpers, until)

      if (spliceNodes !== 'no-change') {
        if (spliceNodes === 'in-place') {
          // Wrapper body was swapped in place — recurse to inline any
          // further function calls reachable in the new body.
          this.inlineTransientCalls(child as unknown as ContainerNode, replacement, continuation, helpers, until)
          continue
        }

        const newNodes = spliceNodes as Node[]
        body.splice(i, 1, ...newNodes)
        for (const nn of newNodes) {
          if (nn instanceof ContainerNode || nn instanceof ContainerCommandNode) {
            this.inlineTransientCalls(nn, replacement, continuation, helpers, until)
          }
        }
        continue
      }

      if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
        this.inlineTransientCalls(child, replacement, continuation, helpers, until)
      }
    }
  }

  /**
   * Decide whether `node` is a `function <X>` call we should inline:
   *   - `Node[]` — splice these in place of `node`.
   *   - `'in-place'` — wrapper's inner slot was swapped; caller recurses.
   *   - `'no-change'` — leave the node alone.
   */
  private tryInlineFunctionCall(
    node: Node,
    replacement: Node[],
    continuation: MCFunctionNode,
    helpers: MCFunctionNode[],
    until?: UntilClass,
  ): Node[] | 'in-place' | 'no-change' {
    // Detect `return run function X` wrappers — same logic handles both
    // `function X` (no wrapper) and `return run function X`.
    let wrapper: ContainerCommandNode | undefined
    let inner: Node | undefined = node

    if (node instanceof ContainerCommandNode && (node as any).command === 'return' && (node as any).body?.length === 1) {
      wrapper = node
      inner = (node as any).body[0]
    }

    if (!inner || (inner as any).constructor?.name !== 'FunctionCommandNode') return 'no-change'

    const fnArg = (inner as any).args?.[0]
    if (!fnArg) return 'no-change'

    // The function call's target is either an MCFunctionClass instance
    // (`args[0].node` → MCFunctionNode) or a vanilla function-name string
    // (e.g. `myMcfunction()` → Sandstone stores `.name` in `args[0]`).
    let argFn: MCFunctionNode | undefined
    let argFnName: string | undefined
    if (typeof fnArg === 'string') {
      argFnName = fnArg
    } else {
      argFn = (fnArg as any).node as MCFunctionNode | undefined
      if (!argFn) return 'no-change'
      argFnName = argFn.resource.name
    }

    const isContinuation = argFnName === continuation.resource.name
    const isKnownHelper = !!argFn && helpers.includes(argFn)
    if (!isContinuation && !isKnownHelper) return 'no-change'

    const replacementBody = isContinuation
      ? [...replacement]
      : [...(argFn as MCFunctionNode).body]

    // MC's `return run A B C` only runs A — the caller's `execute`/`return run`
    // wrapper can only hold one body command. If the continuation body has
    // > 1 commands, leave the wrapper calling the continuation (which now
    // holds the multi-command body via `continuationNode.body.push` below)
    // and flag the until so the continuation mcfunction isn't deleted.
    if (isContinuation && replacementBody.length > 1) {
      if (until) until.continuationStillReferenced = true
      return 'no-change'
    }

    if (wrapper) {
      ;(wrapper as any).body = replacementBody
      return 'in-place'
    }

    return replacementBody
  }

  /**
   * Recursively replace every occurrence of `target` inside `root` (and
   * nested container bodies) with `replacement`. Used when the await sits
   * nested deeper than `parent.body` directly and a direct splice would
   * misplace the inlined content.
   */
  private replaceRecursive(root: ContainerNode, target: Node, replacement: Node[]): boolean {
    const body = (root as any).body as Node[] | undefined
    if (!Array.isArray(body)) return false
    const idx = body.indexOf(target)
    if (idx !== -1) {
      body.splice(idx, 1, ...replacement)
      return true
    }
    for (const child of body) {
      if (
        (child instanceof ContainerCommandNode || child instanceof ContainerNode) &&
        this.replaceRecursive(child, target, replacement)
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Collect every transient sandstone-created MCFunction descended from
   * the poller — the if-branch helper, the return_run2 helper, and any
   * deeper helper extracted from them (e.g. an `if` helper may itself
   * contain a `return_run` helper). These are created by
   * `ContainerCommandsToMCFunctionVisitor` and become orphans once we
   * inline their bodies into the parent. `__sleep` is skipped because
   * it's deleted separately below; `__sleep/_context` is skipped to match.
   *
   * Walks `pollerNode.transientChildMCFunctions` recursively (each
   * child's own `transientChildMCFunctions` may contain further helpers).
   * O(descendants of poller) instead of scanning all of
   * `core.resourceNodes`.
   */
  private collectTransientHelpers(pollerNode: MCFunctionNode, until: UntilClass): MCFunctionNode[] {
    const helpers: MCFunctionNode[] = []
    const visited = new Set<MCFunctionNode>()

    const walk = (node: MCFunctionNode) => {
      if (visited.has(node)) return
      visited.add(node)
      for (const child of node.transientChildMCFunctions) {
        if (child === pollerNode) continue
        if (child === until.continuation.node) continue

        const fnPath = child.resource.path.join('/')
        if (/\/__sleep(\b|\/)/.test('/' + fnPath.slice(pollerNode.resource.path.length))) continue

        helpers.push(child)
        walk(child)
      }
    }

    walk(pollerNode)
    return helpers
  }
}
