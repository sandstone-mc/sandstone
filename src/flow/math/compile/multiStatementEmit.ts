import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { DataPointClass } from '../../../variables/Data'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { JsonContextFloatProvider } from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type { NamespacedString, NonEmptyString } from '../../../utils'
import { BinaryOpNode, AggregateNode, UnaryOpNode } from '../ast/nodes/operators'
import { LiteralNode, StorageRefNode } from '../ast/nodes/leaves'
import { compileMathExpressionToProvider } from './mathProviderCompiler'
import type { ChainUpdate, MathChainAnalysis } from '../visitors/mathChainAnalysis'
import { runDefaultMathVisitors } from '../visitors'

/**
 * Multi-statement math emission — plan generation only.
 *
 * Takes the structural analysis from `analyzeMathChain` (which lives
 * in its own module so the compiler doesn't have to re-derive chain
 * topology) and turns it into the runtime-facing plan:
 *
 *   - For each `ChainUpdate`, allocate a `DataPointClass` via
 *     `MathFunctionNode.getHandleStorage` (single source of truth for
 *     the path — `DataVariable` applies packUid/namespace suffixing
 *     once) and compile the provider JSON (full or incremental).
 *   - For the LAST update on the return handle's chain, point its
 *     write target at the result `DataPoint` (allocated via
 *     `getResultStorage`) so the runtime folds the chain's final
 *     value directly into the deferred-result path — no trailing
 *     `set from <handle_storage>` copy needed.
 *
 * Future visitors (e.g. `MathFlattenAddChainVisitor` that collapses
 * consecutive `+=` calls into a single n-ary aggregate, or a
 * `MathDeadStoreEliminator` that prunes never-read handle storage)
 * mutate `fn.allNodes` in place. `analyzeMathChain` reads `allNodes`
 * fresh each call, so the compiler automatically picks up
 * visitor-driven transformations on the next save.
 */

export interface MultiStatementEmit {
  commands: Array<{
    handleName: string
    /**
     * The `DataPointClass` whose storage this op writes to. When the
     * last op is the return-handle's final update AND folding is in
     * play, this points at the RESULT DataPoint — otherwise the
     * handle's intermediate storage DataPoint. The runtime emitter
     * uses this directly; the provider embed reads `dp.currentTarget`
     * + `dp.path` from it. Single source of truth for both sides
     * (was: bare path strings reconstructed separately, which is how
     * the write/read suffix mismatch crept in).
     */
    dataPoint: DataPointClass<'storage'>
    providerName: string
    /**
     * True when this command writes to its bridge's per-call
     * `resultDataPoint` (final-fold path).
     */
    isFinalFold?: boolean
    /**
     * When set, the emitter writes the literal value via
     * `data modify ... set value Nf` and skips the provider
     * lookup. Constant folding produces this when the math
     * function's return is a single literal.
     */
    isConstant?: MathExpressionNode
  }>
  providers: Map<string, JsonContextFloatProvider>
  /**
   * DataPoint for the per-call result storage. Used by
   * `compileMathInvocation`'s trailing `set from` (only when folding
   * isn't in play). Allocated via `fn.getResultStorage(...)` so the
   * packUid suffix lands on it consistently.
   */
  resultDataPoint: DataPointClass<'storage'>
  returnHandleName: string | null
}

export function planMultiStatementEmit(
  _core: SandstoneCore,
  fn: MathFunctionNode,
  options: {
    /**
     * Per-call index (0-based). Storage paths include this suffix
     * when `useCallNamespace` is true so multiple invocations of the
     * same math function don't clobber each other's intermediate
     * state. `useCallNamespace` is `false` for the first (and
     * only) invocation — single-call math keeps simple paths.
     */
    callIdx: number
    useCallNamespace: boolean
    /** Shared input slots for multi-call math — one per non-literal
     *  input slot on the bridge (storage inputs only for now; future
     *  score support adds score-kind entries). Each entry carries the
     *  shared target reference (storage DataPoint today) used to
     *  rewrite the matching `fn.inputs[slot.position]` reference in
     *  the AST. Empty array = single-call = read caller directly.
     *
     *  The slot.position field is what makes this N-input-friendly:
     *  the compiler maps slot.position → fn.inputs[slot.position]
     *  to find the right AST node to rewrite, instead of hard-coding
     *  the first input. */
    sharedInputs?: ReadonlyArray<import('./MathInvocationNode').SharedInputSlot>
    /**
     * Pre-allocated result `DataPoint`. When omitted, the function
     * allocates one via `fn.getResultStorage(callIdx, useCallNamespace)`.
     * Pass an explicit one when you want a per-call variation of
     * an otherwise-shared plan (e.g., shared-provider bridges in a
     * math invocation group — each bridge gets its own result
     * storage but shares the providers and intermediate commands).
     */
    resultDataPoint?: DataPointClass<'storage'>
  },
): MultiStatementEmit {
  const { callIdx, useCallNamespace, sharedInputs } = options

  const resultDataPoint =
    options.resultDataPoint ?? fn.getResultStorage(callIdx, useCallNamespace)

  return buildPlan(_core, fn, {
    callIdx,
    useCallNamespace,
    sharedInputs,
    resultDataPoint,
    // The single-bridge wrapper doesn't have an input shape key
    // (the caller is the legacy `compileMathInvocation` entry
    // point). Pass an empty key — the resulting provider name
    // collides with anything else the user does through the
    // wrapper, but that's the wrapper's job to worry about. The
    // new group-aware entry point (`buildSharedPlanContent`)
    // takes the real key.
    inputShapeKey: '',
  })
}

/**
 * Per-bridge-immutable content for a math invocation group. Holds
 * the chain analysis + the per-update command metadata + the
 * provider JSON map + handle storage map. Bridges in the same
 * group share one of these; each bridge varies only in its
 * `resultDataPoint` (the per-call destination for the math result).
 *
 * Stored here so `compileMathInvocationGroup` runs the
 * analysis + provider compilation ONCE per group, then reuses the
 * immutable content for every bridge in the group (just varying
 * the result storage per call).
 */
export interface SharedPlanContent {
  /** Per-update command metadata. The actual `dataPoint` is
   *  computed at emit time (handle storage for non-final, the
   *  bridge's `resultDataPoint` for the final fold). */
  commands: Array<{
    handleName: string
    providerName: string
    isFinalFold: boolean
    /**
     * When the chain analysis produced a synthetic update for a
     * constant result (the math function's return value is a
     * single literal because constant folding reduced the whole
     * chain to one), `isConstant` carries the literal so the
     * emitter can write it via `data modify ... set value Nf`
     * instead of `set compute ... float <provider>`. No
     * provider JSON is queued for these — the literal IS the
     * value, no separate resource needed.
     */
    isConstant?: MathExpressionNode
  }>
  providers: Map<string, JsonContextFloatProvider>
  handleStorageByHandle: Map<string, DataPointClass<'storage'>>
  returnHandleName: string | null
}

/**
 * Build the per-group shared plan content. Runs the visitor
 * pipeline + chain analysis + provider compilation ONCE. The
 * returned object is reused for every bridge in the group —
 * per-bridge variation lives entirely in the resultDataPoint
 * passed at emit time.
 */
function buildPlan(
  _core: SandstoneCore,
  fn: MathFunctionNode,
  options: {
    callIdx: number
    useCallNamespace: boolean
    sharedInputs?: ReadonlyArray<import('./MathInvocationNode').SharedInputSlot>
    resultDataPoint: DataPointClass<'storage'>
    inputShapeKey: string
  },
): MultiStatementEmit {
  const { useCallNamespace, sharedInputs } = options
  void useCallNamespace
  void sharedInputs

  // Run the full visitor pipeline (transforms + analyses) before
  // any plan generation. This is what populates `fn.analyses` with
  // the chain analysis AND applies any AST rewrites (e.g. the
  // flatten visitor collapsing `add` chains into single n-ary
  // aggregates). Calling it here keeps `planMultiStatementEmit`
  // self-contained — every entry point that uses plan generation
  // gets the same pipeline run. The pipeline is idempotent for
  // the analyses (a second run produces the same result) but the
  // transform visitors must NOT run twice on the same `fn` (they
  // mutate in place); since this function is called once per math
  // invocation per save, that's fine.
  runDefaultMathVisitors(fn)

  // Multi-call input rewrite: when `sharedInputPath` is set, swap the
  // FIRST StorageRefNode in `fn.inputs` to point at the shared input.
  // That StorageRefNode is the user's input — the AST only references
  // it once (every call's chain reads from the same logical input).
  // The bridge's `set from <caller> → shared` copy populates the
  // shared address with the current call's value before the math
  // runs, so all reads land on the right value.
  if (sharedInputs && sharedInputs.length > 0) {
    for (const slot of sharedInputs) {
      if (slot.kind !== 'storage') continue
      const target = (fn.inputs as readonly MathExpressionNode[])[slot.position]
      if (!StorageRefNode.is(target)) continue
      ;(target as unknown as { dataPoint: DataPointClass<'storage'> }).dataPoint = slot.sharedDp
    }
  }

  // The chain analysis (root classification, transient detection,
  // chain-state tracking, update enumeration, return-handle
  // resolution) was produced by `MathChainAnalysisVisitor` during
  // `runDefaultMathVisitors(fn)`. The visitor pipeline runs FIRST in
  // the call sequence — see the JSDoc on `runDefaultMathVisitors`
  // for ordering — and stores its result under the `'chain'` key.
  // We pull it here so this module stays focused on PLAN GENERATION
  // and doesn't have to re-derive chain structure. The `as` cast
  // pins the type — `MathChainAnalysisVisitor.key` is `'chain'` and
  // its `analyze()` always returns `MathChainAnalysis`.
  const analysis = fn.analyses.get('chain') as MathChainAnalysis
  // `chainReachability` — root → forward-reachable nodes map. Used
  // by the incremental provider compiler to know which chain nodes
  // can be substituted with a `minecraft:storage` read.
  // `returnHandle` — handle ID of the chain that `_.return(value)`
  // references; used to fold the last update on that chain into the
  // result storage. Both produced by analysis visitors during the
  // same pipeline run (above). The `as unknown as` casts pin the
  // types since `fn.analyses` is `Map<string, unknown>`.
  const chainReachability = fn.analyses.get('chainReachability') as
    Map<MathExpressionNode, Set<MathExpressionNode>>
  const returnHandle = fn.analyses.get('returnHandle') as string | null

  // Each chain's intermediate-storage DataPoint. Allocated via
  // `fn.getHandleStorage` so packUid suffixing matches the runtime
  // write target exactly — same `DataPoint` instance flows to the
  // provider embed (read) AND the runtime emitter (write). Single
  // source of truth, no path strings to drift.
  const handleStorageByHandle = new Map<string, DataPointClass<'storage'>>()
  for (const root of analysis.inputRoots) {
    const handleName = analysis.rootToId.get(root)
    if (!handleName) continue
    handleStorageByHandle.set(handleName, fn.getHandleStorage(handleName))
  }
  for (const root of analysis.chainStartRoots) {
    const handleName = analysis.rootToId.get(root)
    if (!handleName) continue
    handleStorageByHandle.set(handleName, fn.getHandleStorage(handleName))
  }

  // Find the LAST update on the return handle's chain. The trailing
  // `data modify ... set from <handle_storage>` command copies
  // this update's result into the deferred-result path the caller
  // reads via `.data()`. Folding is always safe: every intermediate
  // write to the handle's storage happens BEFORE the final op (and
  // before any cross-handle reads from it), and the final op's
  // incremental provider reads the handle's storage at runtime —
  // pointing its `data modify ... set ... compute default float` at
  // the result storage path drops the trailing copy entirely.
  const lastUpdateIndexByHandle = new Map<string, number>()
  analysis.updates.forEach((u, i) => {
    lastUpdateIndexByHandle.set(u.handleName, i)
  })
  const finalIndex = returnHandle
    ? lastUpdateIndexByHandle.get(returnHandle)
    : undefined
  const foldResultIntoFinal = finalIndex !== undefined

  // Result DataPoint — same allocation semantics as the runtime write
  // target. Shared by both the fold-into-final branch (when this op
  // writes there) and the trailing `set from` (when folding doesn't
  // happen and we still need to copy handle storage → result). When
  // Result DataPoint is computed in the wrapper (`planMultiStatementEmit`)
  // — this inner function (`buildPlan`) is shared by both the wrapper
  // and the per-group compiler, both of which supply it explicitly.

  const plan: MultiStatementEmit = {
    commands: [],
    providers: new Map(),
    resultDataPoint: options.resultDataPoint,
    returnHandleName: returnHandle,
  }

  analysis.updates.forEach((u, i) => {
    const isFinalOnReturn = i === finalIndex
    // Folding into result: the FINAL op on the return handle's chain
    // writes its result DIRECTLY to the result DataPoint (no trailing
    // copy needed). Earlier ops and ops on non-return handles write
    // to the handle's intermediate storage.
    const dataPoint: DataPointClass<'storage'> =
      isFinalOnReturn && foldResultIntoFinal
        ? options.resultDataPoint
        : handleStorageByHandle.get(u.handleName)!
    const providerName = buildProviderName(fn, `op_${i}`, options.inputShapeKey)
    // Constant-result short-circuit: when the chain analysis
    // promoted a folded-literal return into a synthetic update
    // (see `MathChainAnalysisVisitor` and `fn.constantResult`),
    // emit the literal via `data modify ... set value Nf` and
    // skip the provider resource — no separate JSON file is
    // needed, the literal IS the value.
    if (u.handleName === 'const_result' && LiteralNode.is(u.expression)) {
      plan.commands.push({
        handleName: u.handleName,
        dataPoint,
        providerName,
        isFinalFold: true,
        isConstant: u.expression,
      })
      return
    }
    const providerJson: JsonContextFloatProvider = u.isFirst
      ? compileMathExpressionToProvider(
          substituteRoots(u.expression, analysis.rootToId, u.statesBefore),
        )
      : compileIncrementalProvider(
          u,
          analysis,
          handleStorageByHandle,
          chainReachability,
        )
    plan.commands.push({
      handleName: u.handleName,
      dataPoint,
      providerName,
    })
    plan.providers.set(providerName, providerJson)
  })

  return plan
}

/**
 * Build the per-group shared plan content. Runs the visitor
 * pipeline + chain analysis + provider compilation ONCE. Bridges
 * in the same group share this content; each bridge varies only
 * in its `resultDataPoint` (the per-call destination for the math
 * result).
 *
 * The returned `commands` carry per-update metadata; the actual
 * `dataPoint` (storage target for each `data modify`) is computed
 * at emit time from `handleStorageByHandle` (shared) and the
 * bridge's own `resultDataPoint` (per-bridge).
 *
 * Used by `compileMathInvocationGroup` so the chain analysis +
 * provider compilation run once per group, not once per bridge.
 */
export function buildSharedPlanContent(
  _core: SandstoneCore,
  fn: MathFunctionNode,
  options: {
    callIdx: number
    useCallNamespace: boolean
    sharedInputs?: ReadonlyArray<import('./MathInvocationNode').SharedInputSlot>
    /**
     * Stable key describing the call group's input shape. Embedded
     * into each provider's resource name so bridges with different
     * input shapes (different constants, different DataPoint
     * identities) get distinct provider files — see
     * `buildProviderName`.
     */
    inputShapeKey: string
  },
): SharedPlanContent {
  const { useCallNamespace, sharedInputs } = options
  void useCallNamespace

  // Multi-call input rewrite (same logic as in `buildPlan`).
  if (sharedInputs && sharedInputs.length > 0) {
    for (const slot of sharedInputs) {
      if (slot.kind !== 'storage') continue
      const target = (fn.inputs as readonly MathExpressionNode[])[slot.position]
      if (!StorageRefNode.is(target)) continue
      ;(target as unknown as { dataPoint: DataPointClass<'storage'> }).dataPoint = slot.sharedDp
    }
  }

  // Run the visitor pipeline (transforms + analyses). Subsequent
  // // pipelines see the cached analyses in `fn.analyses` so this is
  // cheap to re-run if the compiler is called more than once per
  // save (it shouldn't be, but the runner's idempotent).
  runDefaultMathVisitors(fn)

  const analysis = fn.analyses.get('chain') as MathChainAnalysis
  const chainReachability = fn.analyses.get('chainReachability') as
    Map<MathExpressionNode, Set<MathExpressionNode>>
  const returnHandle = fn.analyses.get('returnHandle') as string | null

  const handleStorageByHandle = new Map<string, DataPointClass<'storage'>>()
  for (const root of analysis.inputRoots) {
    const handleName = analysis.rootToId.get(root)
    if (!handleName) continue
    handleStorageByHandle.set(handleName, fn.getHandleStorage(handleName))
  }
  for (const root of analysis.chainStartRoots) {
    const handleName = analysis.rootToId.get(root)
    if (!handleName) continue
    handleStorageByHandle.set(handleName, fn.getHandleStorage(handleName))
  }

  // Determine which update is the final fold.
  const lastUpdateIndexByHandle = new Map<string, number>()
  analysis.updates.forEach((u, i) => {
    lastUpdateIndexByHandle.set(u.handleName, i)
  })
  const finalIndex = returnHandle
    ? lastUpdateIndexByHandle.get(returnHandle)
    : undefined
  const foldResultIntoFinal = finalIndex !== undefined

  const content: SharedPlanContent = {
    commands: [],
    providers: new Map(),
    handleStorageByHandle,
    returnHandleName: returnHandle,
  }

  analysis.updates.forEach((u, i) => {
    const isFinalOnReturn = i === finalIndex && foldResultIntoFinal
    const providerName = buildProviderName(fn, `op_${i}`, options.inputShapeKey)
    // Constant-result short-circuit: when the chain analysis
    // promoted a folded-literal return into a synthetic update,
    // emit it as `set value Nf` instead of `set compute ...
    // float <provider>`. No provider JSON is queued — the
    // literal IS the value.
    if (u.handleName === 'const_result' && LiteralNode.is(u.expression)) {
      content.commands.push({
        handleName: u.handleName,
        providerName,
        isFinalFold: true,
        isConstant: u.expression,
      })
      return
    }
    const providerJson: JsonContextFloatProvider = u.isFirst
      ? compileMathExpressionToProvider(
          substituteRoots(u.expression, analysis.rootToId, u.statesBefore),
        )
      : compileIncrementalProvider(
          u,
          analysis,
          handleStorageByHandle,
          chainReachability,
        )
    content.commands.push({
      handleName: u.handleName,
      providerName,
      isFinalFold: isFinalOnReturn,
    })
    content.providers.set(providerName, providerJson)
  })

  return content
}

/**
 * Compile a non-first op's provider as an INCREMENTAL `minecraft:storage`
 * read of the target handle plus the rest of the expression tree —
 * replacing any chain-node reference with the corresponding storage
 * read. Every node in the substitution-set has been previously
 * written to its chain's storage at some op earlier in the chain;
 * the runtime command does only O(1) work per side of the op.
 *
 * Type-cast justifications:
 *   - Each `type: X` field uses the broader `BinaryOp` / `AggregateOp`
 *     union — TS can't statically narrow without enumerating every
 *     alternative shape. `compileIncrementalProvider` is only reached
 *     from `planMultiStatementEmit`, which already validated the op via
 *     the canonical compiler's `isBinaryOp` / `isAggregateOp` helpers;
 *     this layer's dispatch matches. Final `as JsonContextFloatProvider`
 *     aligns the broader record with the discriminated union.
 *   - The aggregate `inputs` tuple carries `{0: JsonFloatRef}` (TS
 *     demands exactly-one-element minimum). Our `inputs.map(...)` always
 *     returns ≥2 elements (handle's LHS + at least one RHS arg), so
 *     the runtime shape is valid; TS just can't see it.
 *
 * Storage references in the emitted JSON read `dp.currentTarget` +
 * `dp.path` from the SAME `DataPoint` the runtime emitter uses for
 * its write target. PackUid/namespace/anonymousDataId suffixing is
 * applied once inside `DataVariable` and stays consistent between
 * the two consumers — no opportunity for write/read drift.
 */
function compileIncrementalProvider(
  update: ChainUpdate,
  analysis: MathChainAnalysis,
  handleStorageByHandle: Map<string, DataPointClass<'storage'>>,
  chainNodesByRoot: Map<MathExpressionNode, Set<MathExpressionNode>>,
): JsonContextFloatProvider {
  const expression = update.expression
  // Compute each chain node's "owning root" — the FIRST root
  // reachable by walking backward through operands[0]/inputs[0],
  // stopping at the node itself if it IS a root. This gives every
  // node an unambiguous primary chain (BinOp[0] is funny's root
  // despite using CopyNode[0] in its construction; BinOp[1] is rx's
  // chain state).
  const rootKeys = new Set(analysis.rootToId.keys())
  const owningRoot = new Map<MathExpressionNode, MathExpressionNode>()
  for (const root of rootKeys) owningRoot.set(root, root)
  for (const node of chainNodesByRoot.values()) {
    for (const candidate of node) {
      if (owningRoot.has(candidate)) continue
      const or = owningRootOf(candidate, rootKeys)
      if (or) owningRoot.set(candidate, or)
    }
  }

  const nodeToStorageRef = new Map<MathExpressionNode, JsonContextFloatProvider>()
  for (const [node, root] of owningRoot) {
    if (analysis.transients.has(node)) continue
    if (node === expression) continue
    // Only skip `inputRoots` (the no-predecessor leaves — input
    // sources, literals). These represent the BASELINE value of a
    // chain, not a previous chain update — substituting them with a
    // handle-storage read would yield the LAST chain update's value
    // rather than the baseline. `chainStartRoots` (handle startNodes
    // from `_.modulo(...)` etc.) ARE chain roots with their own
    // storage and MUST be substituted — they capture a snapshot of
    // their operands at construction time, before any subsequent
    // mutation overwrites the source chain's storage.
    if (analysis.inputRoots.has(node)) continue
    const handle = analysis.rootToId.get(root)
    if (!handle) continue
    const dp = handleStorageByHandle.get(handle)
    if (!dp) continue
    nodeToStorageRef.set(node, {
      type: 'storage',
      storage: dp.currentTarget as unknown as NamespacedString,
      path: dp.path as unknown as NonEmptyString,
    } as JsonContextFloatProvider)
  }
  return compileWithChainReads(expression, nodeToStorageRef)
}

/**
 * Walk backward from `node` via `operands[0]` / `inputs[0]` to find
 * its owning root. Returns `node` itself if it IS a root (the chain
 * it owns), otherwise the root its chain-fronts. Used to disambiguate
 * cross-chain references — e.g. BinOp[0] (= `_.modulo(rx, _.float(10))`)
 * is funny's root even though its construction reads from CopyNode[0].
 */
function owningRootOf(
  node: MathExpressionNode,
  roots: Set<MathExpressionNode>,
): MathExpressionNode | undefined {
  if (roots.has(node)) return node
  if (BinaryOpNode.is(node) && node.operands[0]) {
    return owningRootOf(node.operands[0], roots)
  }
  if (AggregateNode.is(node) && node.inputs[0]) {
    return owningRootOf(node.inputs[0], roots)
  }
  return undefined
}

/**
 * Recursively compile `expression` to a provider JSON, replacing any
 * node present in `chainRefMap` with the corresponding storage-ref
 * provider. Non-chain expressions recurse; literals compile
 * normally via the canonical compiler.
 */
function compileWithChainReads(
  expression: MathExpressionNode,
  chainRefMap: Map<MathExpressionNode, JsonContextFloatProvider>,
): JsonContextFloatProvider {
  const ref = chainRefMap.get(expression)
  if (ref) return ref
  if (BinaryOpNode.is(expression)) {
    return {
      type: expression.op,
      left: compileWithChainReads(expression.operands[0], chainRefMap),
      right: compileMathExpressionToProvider(expression.operands[1]),
    } as unknown as JsonContextFloatProvider
  }
  if (AggregateNode.is(expression)) {
    return {
      type: expression.op,
      inputs: expression.inputs.map((n) => compileWithChainReads(n, chainRefMap)),
    } as unknown as JsonContextFloatProvider
  }
  if (UnaryOpNode.is(expression)) {
    return {
      type: expression.op,
      input: compileMathExpressionToProvider(expression.operand),
    } as unknown as JsonContextFloatProvider
  }
  return compileMathExpressionToProvider(expression)
}

/**
 * Replace each root reference in `expression` with the root's
 * chain state at the snapshot moment. Leaves chain states,
 * transients, and literals untouched (chain states reference other
 * chain states — that's the chain; the compiler walks them all).
 *
 * IMPORTANT: after replacing a root with its state, do NOT recurse
 * into that replacement. The replacement is itself a chain state
 * whose internal operands may reference roots again — recursing
 * would create cycles (e.g., BinOp[1] referencing itself when
 * CopyNode[0] → BinOp[1] is substituted into BinOp[1].operands[0]).
 */
function substituteRoots(
  expression: MathExpressionNode,
  rootToId: Map<MathExpressionNode, string>,
  stateSnapshot: Map<MathExpressionNode, MathExpressionNode>,
): MathExpressionNode {
  const id = rootToId.get(expression)
  if (id !== undefined) {
    // Root hit — replace with snapshot state, DON'T recurse. The
    // state is itself a chain node; the compiler walks down through
    // it normally at compile time.
    return stateSnapshot.get(expression) ?? expression
  }
  if (BinaryOpNode.is(expression)) {
    const newL = substituteRoots(expression.operands[0], rootToId, stateSnapshot)
    const newR = substituteRoots(expression.operands[1], rootToId, stateSnapshot)
    if (newL === expression.operands[0] && newR === expression.operands[1]) return expression
    return new BinaryOpNode(expression.sandstoneCore, expression.op, [newL, newR], expression.kind)
  }
  if (AggregateNode.is(expression)) {
    const newInputs = expression.inputs.map((n) =>
      substituteRoots(n, rootToId, stateSnapshot),
    )
    if (newInputs.every((n, i) => n === expression.inputs[i])) return expression
    return new AggregateNode(expression.sandstoneCore, expression.op, newInputs, expression.kind)
  }
  if (UnaryOpNode.is(expression)) {
    const newOperand = substituteRoots(expression.operand, rootToId, stateSnapshot)
    if (newOperand === expression.operand) return expression
    return new UnaryOpNode(expression.sandstoneCore, expression.op, newOperand)
  }
  return expression
}

/**
 * Provider resource names are keyed by the math function's
 * resource name AND the input shape key of the call group. Two
 * bridges with different input shapes (different constants, or
 * different DataPoint identities) MUST produce provider files with
 * different names — otherwise the dedup-by-name in
 * `MathFunctionNode.queueProvider` would silently collapse them to
 * one file and the constants/identities would be lost.
 *
 * The input shape key (see `compile/groupBridges.ts`) is a stable
 * string derived from each input position's type + identity. It's
 * opaque — only used to namespace the provider name.
 */
function buildProviderName(
  fn: MathFunctionNode,
  suffix: string,
  inputShapeKey: string,
): string {
  // Short hash of the input shape key (8 chars of [a-z0-9]) —
  // the full key can be long (one entry per input position with
  // type/value pairs), and provider names end up as filenames via
  // `registerQueuedProviders` → `NumberProvider`. Two bridges with
  // semantically equivalent shapes hash to the same value, so they
  // collapse to one provider file; different shapes hash to
  // different values, so they get distinct files.
  //
  // FNV-1a 32-bit hash, base-36 encoded, zero-padded to 8 chars.
  let hash = 0x811c9dc5
  for (let i = 0; i < inputShapeKey.length; i++) {
    hash ^= inputShapeKey.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  const safeShape = (hash >>> 0).toString(36).padStart(8, '0')
  return `default:math_${fn.resourceName ?? '0'}_${suffix}_${safeShape}`
}