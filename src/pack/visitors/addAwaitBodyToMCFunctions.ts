import type { Node } from 'sandstone/core/nodes'
import { ContainerCommandNode, ContainerNode, MCFunctionNode } from 'sandstone/core'
import { UntilClass } from 'sandstone/flow'
import { GenericSandstoneVisitor } from './visitor'

/**
 * After every other transformation visitor has run, this visitor:
 *
 *   - Pushes the post-await body (e.g. `say('hi')` after `_.await.until(...)`)
 *     into each await's continuation MCFunction so it actually runs.
 *   - For `UntilClass`, inlines the poller's body into the await's parent
 *     MCFunction, replacing any `function <continuation>` call inside with
 *     the user's post-await body. This collapses the three nested MCFunctions
 *     (`<parent>`, `<parent>/__until/_poller`, `<parent>/__until/_continuation`)
 *     down to the parent + a re-poll poller.
 *   - Rolls the sleep mcfunction's `tag @s remove <timer>` cleanup into the
 *     top of the poller, so the sleep mcfunction itself can be deleted and
 *     the context selector can call the poller directly.
 *   - Removes the orphaned MCFunctions (transient
 *     `ContainerCommandsToMCFunctionVisitor` helpers, the continuation, the
 *     sleep mcfunction) from the resource graph so they don't get serialized.
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

  /**
   * Inline `_.await.until(...)` so it produces a parent MCFunction that
   * runs the poll logic inline + a re-poll poller + an entity-selector
   * `_context` instead of three nested MCFunctions. Concretely:
   *
   *   - Inlines every `function <helper>` / `function <continuation>` chain
   *     inside the poller's body so the leaf `function <continuation>` is
   *     replaced with the user's post-await body.
   *   - Splices the resulting poller body into the await's parent at the
   *     await node's position.
   *   - Rolls the sleep mcfunction's `tag @s remove <timer>` into the top
   *     of the poller (so the sleep mcfunction itself can be deleted and
   *     the `_context` selector can call the poller directly).
   *   - Deletes the continuation, the sleep mcfunction, and every
   *     transient `ContainerCommandsToMCFunctionVisitor` helper from the
   *     resource graph so they don't get serialized.
   */
  private cleanupUntil(until: UntilClass): void {
    const pollerNode = until.poller.node
    const continuationNode = until.continuation.node
    if (!pollerNode || !continuationNode) return

    const parent = this.findAwaitParent(until)
    if (!parent) {
      until.mcfunction.node.body.push(...until.body)
      return
    }

    const awaitIdx = parent.body.indexOf(until as unknown as Node)
    const insertAt = awaitIdx === -1 ? parent.body.length : awaitIdx

    // Collect every transient helper inside the poller (the if-branch
    // helper, return-run2 helper, etc. — anything ContainerCommandsToMCFunctionVisitor
    // created). We need to delete these after inlining so they don't get
    // serialized. We deliberately skip `__sleep` and `__sleep/_context`:
    // those are handled separately below.
    const toDelete = this.collectTransientHelpers(pollerNode, until)

    // Walk the poller's body, replacing each `function <X>` call (where X
    // is the continuation, or any helper in `toDelete`) inline. After
    // this pass the poller's body contains the user's post-await code at
    // the leaf of the chain — no separate `function <continuation>` call
    // remains.
    this.inlineTransientCalls(pollerNode, until.body, continuationNode, toDelete)

    // Find the sleep + context MCFunctions created by SleepClass inside
    // the poller's else branch. After we fold the sleep's tag-cleanup
    // into the poller and redirect the context selector, neither is
    // needed as a separate function.
    const sleepNode = this.findSiblingMCFunction(pollerNode, '__sleep')
    const contextNode = sleepNode ? this.findSiblingMCFunction(sleepNode, '_context') : undefined

    if (sleepNode) {
      // Pull the sleep's tag-remove command out and prepend it to the
      // poller's body. The sleep body is `tag @s remove <timer>` followed
      // by `return run function <poller>`; we lift only the tag-remove.
      // The return-run-function-poller was the original re-poll entry
      // point, but now the context selector will call the poller directly.
      // Tag args are `[<selector>, 'remove', <tag-name>]` — the 'remove'
      // subcommand is at index 1 because the selector was pushed as the
      // first arg by `tag('@s')`.
      const tagRemove = sleepNode.body.find(
        (n: any) => n?.constructor?.name === 'TagCommandNode' && (n as any).args?.[1] === 'remove',
      )
      if (tagRemove) {
        pollerNode.body.unshift(tagRemove)
      }
    }

    if (contextNode) {
      // The context selector ends with `execute ... at @s run function <sleep>`.
      // Redirect it to call the poller directly so we can delete the sleep
      // mcfunction. The selector still provides the @s entity context the
      // poller needs.
      this.redirectContextSelector(contextNode, sleepNode, pollerNode)
    }

    // Splice the modified poller body into the parent at the await's
    // position. The user's post-await body has already been inlined into
    // the poller's body, so we DON'T splice `until.body` again here
    // (that would run it unconditionally at the end of the parent).
    parent.body.splice(insertAt, 1, ...pollerNode.body)

    // Drop the orphaned MCFunctions from the resource graph. The poller
    // itself is preserved — the `_context` selector calls back to it on
    // every re-poll, so we need it to exist as a real resource.
    for (const fn of toDelete) {
      this.pack.core.resourceNodes.delete(fn as any)
    }
    if (sleepNode) this.pack.core.resourceNodes.delete(sleepNode as any)
    this.pack.core.resourceNodes.delete(continuationNode as any)
  }

  /**
   * Walk the context selector's body looking for the leaf
   * `function <sleep>` call and replace its target with the poller's name.
   * The selector still does its entity-selection work (and provides @s
   * context); only the final `function <X>` argument changes.
   */
  private redirectContextSelector(
    contextNode: MCFunctionNode,
    sleepNode: MCFunctionNode | undefined,
    pollerNode: MCFunctionNode,
  ): void {
    const oldSleepName = sleepNode?.resource.name
    const newTargetName = pollerNode.resource.name
    const visit = (node: Node) => {
      if (!node) return
      if ((node as any).constructor?.name === 'FunctionCommandNode') {
        const args = (node as any).args
        if (Array.isArray(args) && args.length >= 1) {
          const target = args[0]
          if (typeof target === 'string' && (!oldSleepName || target === oldSleepName)) {
            args[0] = newTargetName
          }
        }
      }
      if ('body' in node && Array.isArray((node as any).body)) {
        for (const child of (node as any).body as Node[]) {
          visit(child)
        }
      }
    }
    for (const child of contextNode.body) {
      visit(child)
    }
  }

  /**
   * Find the MCFunction at `<anchor>/<leaf>` (or `<anchor path>/<leaf>` if
   * `anchor` has a multi-segment path).
   */
  private findSiblingMCFunction(anchor: MCFunctionNode, leaf: string): MCFunctionNode | undefined {
    const basePath = anchor.resource.path
    const targetPath = [...basePath, leaf]
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      if (fn.resource.path.length !== targetPath.length) continue
      if (fn.resource.path.every((p, i) => p === targetPath[i])) return fn
    }
    return undefined
  }

  /**
   * Walk the tree under `root`, replacing every FunctionCommandNode that
   * targets `continuation` with `replacement`, and every FunctionCommandNode
   * that targets a sandstone-created non-serialized helper with the
   * helper's own body (recursively, since helpers may themselves contain
   * helper calls). Modifies the tree in place.
   *
   * `replacement` is typically `until.body` — the user's post-await code.
   * It is spliced in wherever the `function <continuation>` call appears,
   * so the post-await code runs at the right point in the parent's flow
   * instead of falling through to the end of the parent.
   */
  private inlineTransientCalls(
    root: ContainerNode,
    replacement: Node[],
    continuation: MCFunctionNode,
    helpers: MCFunctionNode[],
  ): void {
    const body = (root as any).body as Node[] | undefined
    if (!Array.isArray(body)) return

    for (let i = 0; i < body.length; i++) {
      const child = body[i]
      if (!child) continue

      const spliceNodes = this.tryInlineFunctionCall(child, replacement, continuation, helpers)

      if (spliceNodes !== 'no-change') {
        if (spliceNodes === 'in-place') {
          // The child (e.g. a ReturnRunCommandNode) had its body swapped
          // in place — recurse into the new contents to inline any further
          // function calls that may now be reachable.
          this.inlineTransientCalls(child as unknown as ContainerNode, replacement, continuation, helpers)
          continue
        }

        // The child was replaced by one or more new nodes. Splice them in
        // and recurse into each so we don't miss nested helper calls.
        const newNodes = spliceNodes as Node[]
        body.splice(i, 1, ...newNodes)
        for (const nn of newNodes) {
          if (nn instanceof ContainerNode || nn instanceof ContainerCommandNode) {
            this.inlineTransientCalls(nn, replacement, continuation, helpers)
          }
        }
        continue
      }

      // Not a function call — walk into container children.
      if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
        this.inlineTransientCalls(child, replacement, continuation, helpers)
      }
    }
  }

  /**
   * Decide whether `node` is a `function <X>` call we should inline. If so:
   *   - return `Node[]` (the new nodes to splice into the parent's body), or
   *   - return `'in-place'` (the child was a ReturnRunCommandNode whose body
   *     was swapped in place — caller recurses into the child).
   *   - return `'no-change'` if no inline happened.
   */
  private tryInlineFunctionCall(
    node: Node,
    replacement: Node[],
    continuation: MCFunctionNode,
    helpers: MCFunctionNode[],
  ): Node[] | 'in-place' | 'no-change' {
    // Unwrap `return run X` so the same logic handles both `function X`
    // and `return run function X`.
    let wrapper: ContainerCommandNode | undefined
    let inner: Node | undefined = node

    if (node instanceof ContainerCommandNode && (node as any).command === 'return' && (node as any).body?.length === 1) {
      wrapper = node
      inner = (node as any).body[0]
    }

    if (!inner || (inner as any).constructor?.name !== 'FunctionCommandNode') {
      return 'no-change'
    }

    const fnArg = (inner as any).args?.[0]
    if (!fnArg) return 'no-change'

    // The function call's target can be either:
    //   - A sandstone MCFunctionClass instance (`args[0].node` resolves to
    //     the MCFunctionNode), or
    //   - A vanilla function-name string (e.g. when a callback wrote
    //     `myMcfunction()` and Sandstone converted it to `myMcfunction.name`
    //     at command-build time). Compare by resource name in that case.
    let argFn: MCFunctionNode | undefined
    let argFnName: string | undefined
    if (typeof fnArg === 'string') {
      argFnName = fnArg
    } else {
      argFn = (fnArg as any).node as MCFunctionNode | undefined
      if (!argFn) return 'no-change'
      argFnName = argFn.resource.name
    }

    const continuationName = continuation.resource.name
    const isContinuation = argFnName === continuationName
    const isKnownHelper = !!argFn && helpers.includes(argFn)

    if (!isContinuation && !isKnownHelper) return 'no-change'

    const replacementBody = isContinuation
      ? [...replacement]
      : [...(argFn as MCFunctionNode).body]

    if (wrapper) {
      // We have `return run function X` — swap the FunctionCommandNode
      // out of the wrapper's body and put `replacementBody` in its place.
      ;(wrapper as any).body = replacementBody
      return 'in-place'
    }

    // Direct `function X` call — splice replacementBody in its place.
    return replacementBody
  }

  /**
   * Find the MCFunction that owns the given await node. The await node is
   * currently sitting in some parent MCFunction's body (it was added when
   * the await constructor called `currentFunction.enterContext(this)` and
   * the parent body received the await via append).
   */
  private findAwaitParent(awaitNode: Node): MCFunctionNode | undefined {
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      if (fn === (awaitNode as any).mcfunction) continue
      if (this.containsNode(fn, awaitNode)) return fn
    }
    return undefined
  }

  private containsNode(root: ContainerNode, target: Node): boolean {
    if (root === target) return true
    for (const child of root.body) {
      if (child === target) return true
      if ((child instanceof ContainerCommandNode || child instanceof ContainerNode) && this.containsNode(child, target)) {
        return true
      }
    }
    return false
  }

  /**
   * Walk the resource graph and collect every transient sandstone-created
   * MCFunction inside the poller's tree (the if-branch helper, the
   * return_run2 helper, etc.). These were created by
   * ContainerCommandsToMCFunctionVisitor and become orphaned once we
   * inline their bodies into the parent.
   *
   * We deliberately skip `__sleep` and `__sleep/_context` — those are
   * handled separately (folded into the poller / redirected to the poller,
   * then deleted outright).
   */
  private collectTransientHelpers(pollerNode: MCFunctionNode, until: UntilClass): MCFunctionNode[] {
    const pollerPath = pollerNode.resource.path.join('/')
    const helpers: MCFunctionNode[] = []

    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      if (fn === pollerNode) continue
      if (fn === until.continuation.node) continue
      if ((fn.resource as any).creator !== 'sandstone') continue

      const fnPath = fn.resource.path.join('/')
      if (!fnPath.startsWith(pollerPath + '/')) continue
      // Skip the legitimate re-poll machinery (handled separately).
      if (/\/__sleep(\b|\/)/.test('/' + fnPath.slice(pollerPath.length))) continue

      helpers.push(fn)
    }

    return helpers
  }
}
