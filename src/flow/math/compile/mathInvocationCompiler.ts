import type { FloatNumberProviderClass } from '../../../core/resources/datapack/numberProvider'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { DataPointClass } from '../../../variables/Data'
import { LiteralNode, StorageRefNode } from '../ast/nodes/leaves'
import { MathExpressionNode } from '../ast/MathExpressionNode'
import { MathReturnNode } from '../ast/nodes/control'
import { NBTFloat, NBTInt } from '../../../variables/nbt/NBTs'
import { buildSharedPlanContent, buildProviderName, coerceToBlockKind } from './multiStatementEmit'
import { compileFloatProvider, compileIntProvider } from './mathProviderCompiler'
import { runDefaultMathVisitors } from '../visitors'
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
    for (const entry of fn.providersToRegister) {
      // The queue entry is discriminated on the provider's numeric
      // kind — a float provider registers under MC's
      // `context_float_provider`, an integer one under
      // `context_int_provider`.
      if (entry.kind === 'integer') {
        pack.NumberProvider('integer', entry.name, entry.json)
      } else {
        pack.NumberProvider('float', entry.name, entry.json)
      }
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

  // Non-primary-fn bridges carry their own AST and their own
  // `MathFunctionNode`. The shared plan above only describes the
  // primary's chain, so the other fns' `constantResult` fields
  // still need their visitor pipeline run. Without this pass, the
  // bridge loop's "emit bridge's own const_result" branch sees an
  // empty constant and silently drops the `set value` command for
  // every non-primary bridge — the math result path stays at its
  // default (0f) and the test's equality check fires `fail`.
  for (const bridge of group.bridges) {
    if (bridge.mathFunction === fn) continue
    runDefaultMathVisitors(bridge.mathFunction)
  }

  // Per-bridge imperative-command emission. Each bridge in the
  // group gets its own copy of the per-update commands, but writes
  // to its OWN result storage. Provider JSON references are shared
  // across the group (queued once below).
  for (const bridge of group.bridges) {
    const host = bridge.hostFunction
    const bridgeFn = bridge.mathFunction
    // Bridges can come from different `_RawMathFunction` instances
    // (e.g. two unrelated `_.Math(Float, _ => ...)` calls that happen
    // to share an input shape). Each instance owns its own result
    // DataPoint, its own `constantResult`, and its own chain
    // analysis — the shared `content` was built from the primary
    // bridge's fn, so it only describes the primary's storage
    // topology. For a non-primary-fn bridge, we use the bridge's
    // own fn for the result path AND emit its own const_result
    // command instead of iterating the primary's shared commands.
    const isPrimaryFn = bridgeFn === fn

    // This bridge's own result DataPoint. Each call's `a.data()` /
    // `b.data()` reads from a different path, so the math result
    // must land in per-bridge storage even when the provider is
    // shared. `bridge.callIdx` (per-bridge, set by the user's
    // `_.Math(fn)(...)` call site) controls the suffix.
    const resultDataPoint = bridgeFn.getResultStorage(
      bridge.callIdx,
      bridge.useCallNamespace,
    )

    // Switch into the bridge so subsequent commands commit here.
    host.enterContext(bridge, false)
    core.mcfunctionStack.push(host)

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
    //
    // Record outputs skip the chain-analysis update loop entirely:
    // each field's returned expression is compiled directly into a
    // self-contained provider (no chain reads of intermediate handle
    // storages) and emitted as its own `set compute` against the
    // field's result path. The handle-storage writes the chain
    // analysis produced are pure overhead for record outputs.
    const bridgeOutputs = bridgeFn.outputs as { kind?: 'scalar' | 'record' } | undefined
    const isRecordOutput = bridgeOutputs?.kind === 'record'

    if (!isRecordOutput && isPrimaryFn) {
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
        // The provider's numeric kind picks the `compute` flavour: an
        // integer provider is read through `compute default integer`,
        // a float one through `compute default float`.
        if (cmd.kind === 'integer') {
          core.pack.commands.data
            .modify(dataPoint)
            .set
            .compute
            .default()
            .integer(cmd.providerName)
          continue
        }
        core.pack.commands.data
          .modify(dataPoint)
          .set
          .compute
          .default()
          .float(cmd.providerName)
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
    } else if (!isRecordOutput) {
      // Non-primary-fn bridge: the shared content describes the
      // primary's handle storages, not this bridge's. Emit the
      // bridge's own const_result command instead — the only thing
      // the shared plan would have produced for a constant-return
      // bridge. For non-constant returns of a non-primary fn the
      // shared plan is structurally unable to describe them; future
      // multi-fn plan synthesis would handle that case.
      const bridgeConst = bridgeFn.constantResult
      if (bridgeConst && LiteralNode.is(bridgeConst)) {
        const nbt = bridgeConst.kind === 'integer'
          ? new NBTInt(bridgeConst.value)
          : new NBTFloat(bridgeConst.value)
        core.pack.commands.data
          .modify(resultDataPoint)
          .set
          .value(nbt as never)
      }
    }

    // Record-output per-field handling: for each field, emit the
    // command that lands the field's returned expression at the
    // field's result path. The MathReturnNode captured at
    // `_.return({ x, y, ... })` time holds a record of
    // `{ fieldName: MathExpressionNode }` — each entry IS the
    // expression to write. `recordConstantResult` carries the
    // folded-to-literal path (e.g. y = multiply(2, 4) → 8d, emitted
    // as `set value 8d`); non-folded values run through
    // `compileMathExpressionToProvider` and emit `set compute`.
    if (bridgeOutputs?.kind === 'record') {
      const outputs = bridgeFn.outputs as {
        kind: 'record'
        fields: Record<string, 'float' | 'integer'>
      }
      // Pull the MathReturnNode's record value (the actual returned
      // expressions per field). `body[0]` is the trailing return
      // statement; for record schemas its value is a plain object
      // whose keys are the field names.
      const retNode = bridgeFn.body[0]
      const record = MathReturnNode.is(retNode)
        && retNode.value
        && typeof retNode.value === 'object'
        && !Array.isArray(retNode.value)
        ? retNode.value as Record<string, unknown>
        : {}
      for (const [fieldName, fieldKind] of Object.entries(outputs.fields)) {
        const fieldDp = bridgeFn.getResultStorageForField?.(fieldName, bridge.callIdx, bridge.useCallNamespace)
          ?? core.pack.DataVariable(
            undefined,
            `math_${bridgeFn.resourceName ?? '0'}_${fieldName}${bridge.useCallNamespace ? `_${bridge.callIdx}` : ''}`,
          )
        const constantValue = bridgeFn.recordConstantResult?.[fieldName]
        if (constantValue !== undefined) {
          // Folded field — emit `set value` directly. The field's
          // declared kind picks the NBT primitive AND the value's
          // context: a float folded into an integer field truncates
          // toward zero, exactly like MC's `from_float`.
          const nbt = fieldKind === 'integer'
            ? new NBTInt(Math.trunc(constantValue))
            : new NBTFloat(Math.fround(constantValue))
          core.pack.commands.data.modify(fieldDp).set.value(nbt as never)
          continue
        }
        // Non-folded field — look up the field's returned expression.
        // The return record's entries are `MathExpressionNode` values
        // captured at `_.return({...})` time (each is the handle's
        // `node` snapshot). Compile each expression into its own
        // self-contained provider; no intermediate handle-storage
        // writes are needed because the expression carries everything
        // from the chain roots down.
        const fieldExpr = record[fieldName]
        if (MathExpressionNode.is(fieldExpr)) {
          if (StorageRefNode.is(fieldExpr)) {
            core.pack.commands.data
              .modify(fieldDp)
              .set
              .from
              .storage(fieldExpr.dataPoint.currentTarget as never, fieldExpr.dataPoint.path as never)
            continue
          }
          const providerName = buildProviderName(
            bridgeFn,
            `field_${fieldName}_${bridge.callIdx}`,
            `${bridge.callIdx}_${fieldName}`,
          )
          // The field's declared kind picks the provider family — an
          // integer field compiles to MC's `context_int_provider` and
          // is read through `compute default integer`.
          // The field's declared kind is the context the field is
          // written in — a field whose expression has the other kind
          // is bridged by MC's `from_int` / `from_float` provider.
          const fieldExpression = coerceToBlockKind(fieldExpr, fieldKind)
          if (fieldKind === 'integer') {
            core.pack.commands.data
              .modify(fieldDp)
              .set
              .compute
              .default()
              .integer(providerName)
            bridgeFn.queueProvider({
              name: providerName,
              kind: 'integer',
              json: compileIntProvider(fieldExpression),
            })
            continue
          }
          core.pack.commands.data
            .modify(fieldDp)
            .set
            .compute
            .default()
            .float(providerName)
          bridgeFn.queueProvider({
            name: providerName,
            kind: 'float',
            json: compileFloatProvider(fieldExpression),
          })
          continue
        }
      }
    }

    // Pop back out of the bridge.
    core.mcfunctionStack.pop()
    host.exitContext()
  }

  // Cache provider JSONs for the function-level register pass.
  // Done ONCE per group — subsequent bridges in the same group
  // share the same provider JSONs, so they don't re-emit here.
  for (const entry of content.providers.values()) {
    fn.queueProvider(entry)
  }
}
