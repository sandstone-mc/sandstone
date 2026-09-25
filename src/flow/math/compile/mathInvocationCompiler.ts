import type { FloatNumberProviderClass } from '../../../core/resources/datapack/numberProvider'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import {
  makeDeferredResultDataPoint,
  planMultiStatementEmit,
} from './multiStatementEmit'
import type { MathInvocationNode } from './MathInvocationNode'

/**
 * Materialize every provider JSON queued on every `MathFunctionNode`
 * into a `FloatNumberProviderClass` resource.
 *
 * Called from `MathInvocationInlineVisitor.onEnd` after the visitor
 * has walked every MCFunction and `compileMathInvocation` has queued
 * every provider. Lives in the compile section per the layering rule:
 * "all actual command / resource creation code in the compiler
 * section, even if only the sandstone core visitor uses it."
 *
 * Dedup: each `MathFunctionNode.providersToRegister` holds at most
 * one entry per name (last `queueProvider` wins). Iterating the
 * queue once per fn drains it — no entry is registered twice.
 *
 * Lives here, not on `MathFunctionNode`, because the registration
 * uses `core.pack.NumberProvider`, which is a compile-time decision
 * (resource registration into the pack). The node only owns the
 * queue; the compile module owns the materialization.
 */
export function registerQueuedProviders(core: SandstoneCore): void {
  const pack = core.pack
  for (const fn of core.mathFunctions) {
    if (fn.providersToRegister.length === 0) continue
    for (const { name, json } of fn.providersToRegister) {
      ;(pack.NumberProvider as any)('float', name, json)
    }
    fn.providersToRegister = []
  }
}

/**
 * Compile-and-emit orchestrator for a deferred math invocation.
 *
 * Called from `MathInvocationInlineVisitor.visitMathInvocationNode` at
 * SAVE time, after every `__call__` for the math fn has been seen.
 * This is where the bridge's empty `body` gets filled with imperative
 * commands — and where the visitor pipeline's per-call metadata
 * (callIdx, sharedInputPath, useCallNamespace) gets folded into the
 * emit.
 *
 * Split from the visitor per the design rule: "all actual command /
 * resource creation code lives in the compiler section, even if
 * only the sandstone core visitor uses it." The visitor just decides
 * WHEN to compile and where to splice the result.
 *
 * Per-update emission: one `data modify ... compute ... float <provider>`
 * per math command, plus a final `set from <handle_storage>` copy if
 * the planner didn't fold the last op into the result path.
 *
 * Provider JSONs are queued onto the `MathFunctionNode` for the
 * function-level register pass in `visitMathFunctionNode` — the
 * visitor dedupes provider registrations across multi-call math by
 * replacing earlier entries with the same name. The last emit
 * wins: its provider points at the shared input address, so the
 * first call's commands (which referenced that provider) pick up
 * the rewritten input on the fly.
 */
export function compileMathInvocation(
  core: SandstoneCore,
  bridge: MathInvocationNode,
): void {
  const fn = bridge.mathFunction
  const host = bridge.hostFunction

  // Single-call optimization: when this math fn has exactly one
  // invocation, skip the shared-input copies and read directly from
  // each caller's DataPoint. Multi-call: always emit
  // `set from <caller_N> → shared_<N>` so all calls feed into the
  // shared provider file (which references stable shared paths).
  const isSingleCall = fn.invocationCount === 1

  const plan = planMultiStatementEmit(core, fn, {
    callIdx: bridge.callIdx,
    useCallNamespace: bridge.useCallNamespace,
    // Pass shared inputs (only the storage-kind ones have actual dps;
    // future score-kind slots will plumb their own shared-target
    // through here). Empty array = single-call = read caller directly.
    sharedInputs: isSingleCall ? [] : bridge.inputs,
  })

  // Switch into the bridge so subsequent commands commit here.
  // The bridge is a ContainerCommandNode, not an MCFunction, so
  // `core.pack.DataVariable` and friends can't read the active
  // MCFunction from `mcfunctionStack` if we push the bridge. Push
  // the host MCFunction instead — that's the function whose context
  // those helpers actually want to see.
  host.enterContext(bridge, false)
  ;(core as unknown as { mcfunctionStack: unknown[] }).mcfunctionStack.push(host)

  // Per-input copies: one `set from <caller_N> → shared_<N>` per
  // storage-kind slot. Iterates the slot list (not positions) so
  // literal inputs that left no slot are correctly skipped.
  if (!isSingleCall) {
    for (const slot of bridge.inputs) {
      if (slot.kind !== 'storage') continue
      core.pack.commands.data
        .modify(slot.sharedDp)
        .set
        .from
        .storage(
          slot.callerDp.currentTarget as any,
          slot.callerDp.path as any,
        )
    }
  }

  // Emit per-update commands. Each `float(...)` auto-commits into
  // the bridge's body via the active context.
  for (const cmd of plan.commands) {
    const handleDp = core.pack.DataVariable(undefined, cmd.storagePath)
    core.pack.commands.data
      .modify(handleDp)
      .set
      .compute
      .default()
      .float(cmd.providerName as unknown as FloatNumberProviderClass)
  }

  // Final-return fold: if the last op already writes to the
  // result storage, skip the trailing `set from`. Source and target
  // are both pure storage paths, so a `set from` is cheaper than
  // another provider anyway.
  if (
    plan.returnHandleName &&
    plan.commands[plan.commands.length - 1]?.storagePath !== plan.resultStoragePath
  ) {
    // Handle storage is now SHARED across calls (no per-call suffix).
    // The trailing copy's source is the shared handle path.
    const sourceDp = core.pack.DataVariable(
      undefined,
      `math_${fn.resourceName ?? '0'}_h_${plan.returnHandleName}`,
    )
    core.pack.commands.data
      .modify(makeDeferredResultDataPoint(core, fn, bridge.callIdx, bridge.useCallNamespace))
      .set
      .from
      .storage(sourceDp.currentTarget as any, sourceDp.path as any)
  }

  // Cache provider JSONs for the function-level register pass.
  for (const [providerName, providerJson] of plan.providers) {
    fn.queueProvider(providerName, providerJson)
  }

  // Pop back out of the bridge.
  ;(core as unknown as { mcfunctionStack: unknown[] }).mcfunctionStack.pop()
  host.exitContext()
}
