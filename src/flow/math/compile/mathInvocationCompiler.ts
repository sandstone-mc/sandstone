import type { FloatNumberProviderClass } from '../../../core/resources/datapack/numberProvider'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { DataPointClass } from '../../../variables/Data'
import { LiteralNode } from '../ast/nodes/leaves'
import { NBTFloat, NBTInt } from '../../../variables/nbt/NBTs'
import { buildSharedPlanContent } from './multiStatementEmit'
import type { BridgeGroup } from './groupBridges'
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
  compileMathInvocationGroup(core, { key: 'single', bridges: [bridge] })
}

/**
 * Compile-and-emit orchestrator for a GROUP of bridges with
 * identical input shapes.
 *
 * Bridges in the same group share a single plan + provider JSONs —
 * the compiler runs `planMultiStatementEmit` once on the PRIMARY
 * bridge (the first in the group), then emits per-bridge imperative
 * commands for every bridge in the group. Each bridge still writes
 * to its OWN result storage (so `a.data()` and `b.data()` are
 * distinct), but references the group's shared provider JSONs.
 *
 * The "shared input address" mechanism only kicks in when:
 *   - group size ≥ 2 (need to populate the address per call), AND
 *   - all inputs are DataPoint/Score (constants inline directly).
 * Otherwise each call reads its inputs directly — constants are
 * baked into the provider JSON, and singletons have no shared
 * address to populate.
 *
 * Bridges without constant inputs but with size ≥ 2 still use the
 * shared input address scheme (their data-point / score inputs get
 * copied to the shared address per call).
 */
export function compileMathInvocationGroup(
  core: SandstoneCore,
  group: BridgeGroup,
): void {
  if (group.bridges.length === 0) return
  const primary = group.bridges[0]
  const fn = primary.mathFunction

  // Whether the group needs the shared input address. Two cases:
  //   1. Multi-call with all-data-point/score inputs — the
  //      per-call data needs to be staged into the shared address
  //      before the math runs, since the provider JSON reads from
  //      that address (not the caller's).
  //   2. Single-call OR any constant input — the provider JSON
  //      inlines constants and/or reads directly from the caller's
  //      DataPoint; no shared address needed.
  const useSharedInputAddress =
    group.bridges.length >= 2 && primary.inputs.length > 0

  // Build the shared plan content ONCE per group. Bridges in this
  // group share the same `commands` (provider name references +
  // handle storage targets + isFinalFold flags), the same
  // `providers` map, the same `handleStorageByHandle` map, and the
  // same `returnHandleName`. Each bridge varies only in its
  // `resultDataPoint` (the per-call destination for the math
  // result) — that's what `a.data()` vs `b.data()` reads from.
  const content = buildSharedPlanContent(core, fn, {
    callIdx: primary.callIdx,
    useCallNamespace: primary.useCallNamespace,
    // Pass shared inputs (only the storage-kind ones have actual dps;
    // future score-kind slots will plumb their own shared-target
    // through here). Empty array = single-call = read caller directly.
    sharedInputs: useSharedInputAddress ? primary.inputs : [],
    // Embed the input-shape key into every provider's resource
    // name so bridges with different input shapes get distinct
    // provider files (instead of being silently deduped by the
    // queue's name-based collapse).
    inputShapeKey: group.key,
  })

  // Per-bridge imperative-command emission. Each bridge in the
  // group gets its own copy of the per-update commands, but writes
  // to its OWN result storage. Provider JSON references are shared
  // across the group (queued once below).
  for (const bridge of group.bridges) {
    const host = bridge.hostFunction

    // This bridge's own result DataPoint. Each call's `a.data()` /
    // `b.data()` reads from a different path, so the math result
    // must land in per-bridge storage even when the provider is
    // shared. `bridge.callIdx` (per-bridge, set by the user's
    // `_.Math(fn)(...)` call site) controls the suffix.
    const resultDataPoint = fn.getResultStorage(
      bridge.callIdx,
      bridge.useCallNamespace,
    )

    // Switch into the bridge so subsequent commands commit here.
    host.enterContext(bridge, false)
    ;(core as unknown as { mcfunctionStack: unknown[] }).mcfunctionStack.push(host)

    // Shared input address population: one `set from <caller_N> →
    // shared_<N>` per storage-kind slot. Only emitted when the
    // group opted into shared input addresses (multi-call +
    // data-point/score-only).
    if (useSharedInputAddress) {
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
    //
    // The `dataPoint` for each command is computed at emit time:
    //   - Non-final commands → handle storage (shared across group).
    //   - Final fold command → THIS bridge's `resultDataPoint`
    //     (per-bridge, so different bridges land at different paths).
    //
    // Provider JSON references are SHARED across the group (the
    // provider was generated from the primary and stored in
    // `content.providers`).
    for (const cmd of content.commands) {
      const dataPoint: DataPointClass<'storage'> = cmd.isFinalFold
        ? resultDataPoint
        : content.handleStorageByHandle.get(cmd.handleName)!
      // Constant-result path: the chain analysis promoted a
      // folded-literal return to a synthetic update; emit it
      // directly via `set value Nf` / `Ni` instead of looking up a
      // provider resource. No JSON file is queued for these —
      // the literal IS the value, and its `kind` selects the
      // NBT primitive (float vs integer).
      if (cmd.isConstant && LiteralNode.is(cmd.isConstant)) {
        const nbt = cmd.isConstant.kind === 'integer'
          ? new NBTInt(cmd.isConstant.value)
          : new NBTFloat(cmd.isConstant.value)
        core.pack.commands.data.modify(dataPoint).set.value(nbt as never)
        continue
      }
      core.pack.commands.data
        .modify(dataPoint)
        .set
        .compute
        .default()
        .float(cmd.providerName as unknown as FloatNumberProviderClass)
    }

    // Final-return fold: if the last op already wrote to THIS
    // bridge's result storage, skip the trailing `set from`. The
    // shared plan doesn't know the per-bridge resultDataPoint, so
    // we infer folding from the plan's `commands` instead: if the
    // last command is `isFinalFold`, the math result is already at
    // `resultDataPoint` and no copy is needed.
    const lastCmd = content.commands[content.commands.length - 1]
    if (
      content.returnHandleName &&
      lastCmd &&
      !lastCmd.isFinalFold
    ) {
      // No folding in the shared plan for this group — emit a
      // trailing `set from <lastHandleStorage> → <bridgeResultStorage>`.
      // Source is the last handle's storage (the chain's terminal
      // intermediate), target is THIS bridge's resultDataPoint.
      const lastHandleDp = content.handleStorageByHandle.get(lastCmd.handleName)!
      core.pack.commands.data
        .modify(resultDataPoint)
        .set
        .from
        .storage(lastHandleDp.currentTarget as any, lastHandleDp.path as any)
    }

    // Pop back out of the bridge.
    ;(core as unknown as { mcfunctionStack: unknown[] }).mcfunctionStack.pop()
    host.exitContext()
  }

  // Cache provider JSONs for the function-level register pass.
  // Done ONCE per group — subsequent bridges in the same group
  // share the same provider JSONs, so they don't re-emit here.
  for (const [providerName, providerJson] of content.providers) {
    fn.queueProvider(providerName, providerJson)
  }
}
