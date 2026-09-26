import type { Node } from 'sandstone/core/nodes'
import type { MCFunctionNode } from 'sandstone/core/resources/datapack/mcfunction'
import { MathInvocationNode } from '../../flow/math/compile/MathInvocationNode'
import { GenericSandstoneVisitor } from './visitor'
import {
  compileMathInvocationGroup,
  registerQueuedProviders,
} from '../../flow/math/compile/mathInvocationCompiler'
import { groupBridgesByInputShape } from '../../flow/math/compile/groupBridges'

/**
 * Inlines `MathInvocationNode` bodies into their parent MCFunction.
 *
 * Pairs with `MathInvocationNode` — the math lowerer builds those
 * nodes during `_.Math(fn)(...)` as EMPTY placeholders. The
 * actual imperative command creation happens in `compileMathInvocation`
 * (see `flow/math/compile/`), invoked here at save time when the
 * bridge's call-site metadata is finalized. Provider JSONs are queued
 * during that call and materialized in `onEnd` via `registerQueuedProviders`,
 * which lives in the compile module per the layering rule.
 *
 * This visitor's job is purely structural:
 *   1. Walk every MCFunction body looking for bridges.
 *   2. Trigger `compileMathInvocation` on each (idempotent — already-
 *      compiled bridges no-op).
 *   3. Splice the populated bridge body into the host MCFunction at
 *      the bridge's position; drop the bridge placeholder so
 *      serialization never sees it.
 *   4. In `onEnd`, drain every queued provider onto the pack.
 *
 * All actual command / resource creation lives in the compile section.
 */
export class MathInvocationInlineVisitor extends GenericSandstoneVisitor {
  /**
   * Walk an MCFunction's body, splicing every `MathInvocationNode`
   * encountered. The visitor pipeline walks every MCFunctionNode
   * through every visitor, so we use `processedBridges` to skip
   * repeated iterations on the same parent — otherwise already-
   * spliced bridges would be processed twice and the spliced-in
   * commands would be duplicated.
   */
  override visitMCFunctionNode = (node: MCFunctionNode): MCFunctionNode => {
    if (!this.processedBridges.has(node)) this.processedBridges.add(node)
    else return node
    // Collect every bridge in this MCFunction's body, then group
    // them by input shape. Bridges in the same group share a single
    // compile (one set of provider JSONs); each bridge still emits
    // its own per-call imperative commands targeting its own result
    // storage. The visitor pattern still walks each bridge so the
    // bridge's body gets spliced into the host MCFunction later —
    // we just pre-compile the whole group before the bridge walk so
    // the bridges can share their plan.
    const bridges: MathInvocationNode[] = []
    for (const child of node.body) {
      if (MathInvocationNode.is(child)) bridges.push(child)
    }
    if (bridges.length > 0) {
      for (const group of groupBridgesByInputShape(bridges)) {
        compileMathInvocationGroup(this.core, group)
      }
    }
    const next: Node[] = []
    for (const child of node.body) {
      if (MathInvocationNode.is(child)) {
        // Skip the per-bridge `compileMathInvocation` call here —
        // it's been done by the group compilation above. Just splice
        // the bridge's populated body into the host.
        next.push(...child.body)
      } else {
        next.push(child)
      }
    }
    node.body = next
    return node
  }
  private processedBridges = new WeakSet<MCFunctionNode>()

  /**
   * Lower a bridge's body at save time. Idempotency guard skips
   * re-lowering on subsequent visitor passes — once `body` is
   * populated, the work is done.
   *
   * The compile step (in `flow/math/compile/`) is what actually
   * emits the imperative commands and queues the provider JSONs.
   * This method's only job after that is to splice the populated
   * body into the host MCFunction at the bridge's position so
   * serialization sees the math commands inline.
   */
  visitMathInvocationNode = (node: MathInvocationNode): Node[] => {
    // Bridges are pre-compiled in groups during `visitMCFunctionNode`
    // so that bridges with matching input shapes can share a
    // compile. This visitor's only job is to splice the bridge's
    // already-populated body into its host MCFunction.
    if (node.body.length > 0) return node.body
    // Defensive: if a bridge reached this visitor without being
    // compiled yet (shouldn't happen — every MCFunction's bridges
    // are compiled in `visitMCFunctionNode` before this visitor
    // recurses), fall back to a single-bridge compile so we still
    // emit SOMETHING rather than silently dropping the invocation.
    compileMathInvocationGroup(this.core, {
      key: 'fallback-single',
      bridges: [node],
    })
    return node.body
  }

  /**
   * After every MCFunction has been walked, every bridge has been
   * compiled, and every provider JSON has been queued onto its
   * `MathFunctionNode`. Drain the queues into actual
   * `FloatNumberProviderClass` resources via `registerQueuedProviders`.
   * Late binding — providers can reference each other or share
   * storage without order dependencies.
   */
  override onEnd = (): void => {
    registerQueuedProviders(this.core)
  }
}
