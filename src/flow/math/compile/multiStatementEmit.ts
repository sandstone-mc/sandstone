import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { DataPointClass } from '../../../variables/Data'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import type { MathNode } from '../ast/MathNode'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { JsonContextFloatProvider } from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type { NamespacedString, NonEmptyString } from '../../../utils'
import {
  AggregateNode,
  BinaryOpNode,
  UnaryOpNode,
} from '../ast/nodes/operators'
import { StorageRefNode } from '../ast/nodes/leaves'
import { compileMathExpressionToProvider } from './mathProviderCompiler'

/**
 * Multi-statement math emission.
 *
 * For math fns whose body sequences multiple updates to one or more
 * named handles (e.g. `const rx = _.float(input); rx /= 10; rx += funny;
 * _.return(rx)`), emit one `data modify ... compute ... float <provider>`
 * command per handle update and one provider per command. The final
 * `_.return(value)` emits a `data modify ... set from <storage>` command
 * copying the return handle's storage into the math result path.
 *
 * Tracker classification:
 *   - **roots** — nodes that are `inputs[0]` of some `Aggregate`.
 *     Each root is a chain startNode (a handle's identity baseline).
 *   - **transients** — `operands[N>=1]` of aggregates that are NOT
 *     also `inputs[0]` of any aggregate. These are values consumed by
 *     an operation, not handle identities.
 *   - **chain states** — `BinaryOpNode`s whose `operands[0]` is the
 *     current state of some root (and the BinOp itself isn't a
 *     transient). Each extends the chain by one mutation.
 *   - **side-effect updates** — `AggregateNode`s (whose `inputs[0]`
 *     extends a root's chain) that aren't themselves transients.
 *
 * Each root maintains a `chainState` that's the latest chain-state
 * node or side-effect node applied to it. Per-update emission
 * substitutes each root reference in the update's expression with
 * the chain state captured BEFORE the update — that's what the user
 * meant to read at that source position.
 *
 * The per-update `statesBefore` is the snapshot used during
 * substitution; walking with the running total would self-substitute
 * the last update.
 */

export interface MultiStatementEmit {
  commands: Array<{
    handleName: string
    storagePath: string
    providerName: string
  }>
  providers: Map<string, JsonContextFloatProvider>
  resultStoragePath: string
  returnHandleName: string | null
  /**
   * Shared input address used across invocations of the same math
   * function. `undefined` for single-call math (the user's
   * per-invocation DataPoint is the input address directly).
   *
   * Empty string when shared input is in play but the path was a
   * DataPoint passed through; the actual path comes from the
   * `compileMathInvocation` rewrite of the input StorageRefNode.
   */
  sharedInputPath?: string
}

interface Update {
  handleName: string
  expression: MathExpressionNode
  statesBefore: Map<MathExpressionNode, MathExpressionNode>
  /** True iff this is the first op on its target handle's chain —
   *  no prior state to read from storage, so its provider computes
   *  its LHS from inputs directly. Every subsequent op becomes
   *  INCREMENTAL (LHS = `minecraft:storage` read of the handle). */
  isFirst: boolean
}

export function planMultiStatementEmit(
  core: SandstoneCore,
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
  },
): MultiStatementEmit {
  const { callIdx, useCallNamespace, sharedInputs } = options

  // Multi-call input rewrite: when `sharedInputPath` is set, swap the
  // FIRST StorageRefNode in `fn.inputs` to point at the shared input.
  // That StorageRefNode is the user's input — the AST only references
  // it once (every call's chain reads from the same logical input).
  // The bridge's `set from <caller> → shared` copy populates the
  // shared address with the current call's value before the math
  // runs, so all reads land on the right value.
  //
  // The rebound input refs aren't in `fn.allNodes` (they're inputs,
  // not part of the user-written AST), so walk `fn.inputs` to find
  // them. For single-input math fns, `fn.inputs[0]` is the
  // user's-input StorageRefNode. For multi-input fns, each
  // `fn.inputs[i]` is one input — rewriting all of them to the
  // shared address would conflate them; v1 only handles single
  // input, so we rewrite the first.
  //
  // Path matching isn't viable: the user's per-call DataPoint path
  // changes between calls (call 1: `anon_<id>_0`, call 2: `anon_<id>_1`),
  // but the AST was built once and only references the FIRST call's
  // path. Match structurally instead — rewrite the first StorageRefNode.
  if (sharedInputs && sharedInputs.length > 0) {
    // Per-input rewrite: for each shared input slot, swap the
    // matching `fn.inputs[slot.position]` reference's dataPoint to
    // point at the slot's shared target. This makes the AST's
    // chain-root references resolve to the shared address that the
    // bridge's per-call `set from` copy just populated.
    //
    // Score-kind slots are skipped — they don't carry storage targets
    // (and the compiler can't yet emit a score-based provider; see
    // TODO on `SharedInputSlot.score`).
    for (const slot of sharedInputs) {
      if (slot.kind !== 'storage') continue
      const target = (fn.inputs as readonly MathExpressionNode[])[slot.position]
      if (!StorageRefNode.is(target)) continue
      ;(target as unknown as { dataPoint: DataPointClass<'storage'> }).dataPoint = slot.sharedDp
    }
  }

  // ROOTS = nodes that are inputs[0] of some aggregate. These are
  // the chain identities (each handle has one root).
  const roots = new Set<MathExpressionNode>()
  // TRANSIENTS = nodes used only as values by other operations
  // (operand[N>=1] of a BinOp, input[N>=1] of an Aggregate that is
  // not itself roots). A node that is both a root AND used as a value
  // stays a root — root identity takes priority over value usage.
  const transients = new Set<MathExpressionNode>()

  for (const node of fn.allNodes as readonly MathNode[]) {
    if (AggregateNode.is(node)) {
      roots.add(node.inputs[0])
    }
  }

  for (const node of fn.allNodes as readonly MathNode[]) {
    // Collect transient candidates from binOp operands and aggregate
    // inputs[N>=1].
    if (BinaryOpNode.is(node)) {
      for (let i = 1; i < node.operands.length; i++) {
        transients.add(node.operands[i])
      }
    }
    if (AggregateNode.is(node)) {
      for (let i = 1; i < node.inputs.length; i++) {
        transients.add(node.inputs[i])
      }
    }
  }
  // Drop anything that is a root — root identity wins.
  for (const r of roots) transients.delete(r)

  // Walk allNodes chronologically — for each non-transient BinOp /
  // aggregate whose `operands[0]` / `inputs[0]` matches the current
  // state of some chain root, treat it as an update that extends
  // that root's chain.
  const chainState = new Map<MathExpressionNode, MathExpressionNode>()
  for (const r of roots) chainState.set(r, r) // each root starts as itself

  function chainRootOf(node: MathExpressionNode): MathExpressionNode | undefined {
    let current: MathExpressionNode | undefined = node
    const seen = new Set<MathExpressionNode>()
    while (current && !seen.has(current)) {
      seen.add(current)
      if (roots.has(current)) return current
      // For chain propagation, descend into the immediate-predecessor
      // (operands[0] of a BinOp, inputs[0] of an aggregate).
      const ast = current as {
        operands?: MathExpressionNode[]
        inputs?: MathExpressionNode[]
      }
      const next: MathExpressionNode | undefined =
        ast.operands?.[0] ?? ast.inputs?.[0]
      if (next === undefined) return undefined
      current = next
    }
    return undefined
  }

  // Stable handle IDs by root, in first-appearance order.
  const rootToId = new Map<MathExpressionNode, string>()
  let handleCounter = 0
  for (const node of fn.allNodes as readonly MathNode[]) {
    if (AggregateNode.is(node) && !transients.has(node) && roots.has(node.inputs[0])) {
      const root = chainRootOf(node.inputs[0])
      if (root && !rootToId.has(root)) {
        rootToId.set(root, `h_${handleCounter++}`)
      }
    }
  }

  // Replay allNodes chronologically to (a) collect updates with
  // pre-update state snapshots and (b) advance each root's chain
  // state. Each BinOp's chain root is determined by walking BACK
  // from the BinOp itself through its `operands[0]` predecessors —
  // if the BinOp IS itself a root (e.g. constructed via
  // `_.modulo(a, b)`), its own chain is the right one. The
  // alternative of "look at `node.operands[0]`'s chain root" would
  // mis-classify those constructor-wraps onto whatever chain the
  // operand belongs to.
  //
  // We also track each root's "first update" — the first op on its
  // chain. The first op has no prior state to read from storage, so
  // its provider computes its LHS from inputs directly. Every
  // subsequent op on the same chain becomes INCREMENTAL — its LHS
  // is replaced with a `minecraft:storage` provider that reads the
  // handle's storage, so the runtime command does O(1) work instead
  // of recomputing the entire chain from the input.
  const updates: Update[] = []
  const firstPerRoot = new Set<MathExpressionNode>(roots)
  for (const node of fn.allNodes as readonly MathNode[]) {
    if (BinaryOpNode.is(node)) {
      if (transients.has(node)) continue
      const root = chainRootOf(node)
      if (!root) continue
      if (!rootToId.has(root)) {
        rootToId.set(root, `h_${handleCounter++}`)
      }
      const isFirst = firstPerRoot.has(root)
      firstPerRoot.delete(root)
      updates.push({
        handleName: rootToId.get(root)!,
        expression: node,
        statesBefore: new Map(chainState),
        isFirst,
      })
      chainState.set(root, node)
    } else if (AggregateNode.is(node)) {
      if (transients.has(node)) continue
      const root = chainRootOf(node.inputs[0])
      if (!root) continue
      if (!rootToId.has(root)) {
        rootToId.set(root, `h_${handleCounter++}`)
      }
      const isFirst = firstPerRoot.has(root)
      firstPerRoot.delete(root)
      updates.push({
        handleName: rootToId.get(root)!,
        expression: node,
        statesBefore: new Map(chainState),
        isFirst,
      })
      chainState.set(root, node)
    }
  }

  // Determine the return handle by walking the return value back to
  // its chain root.
  const ret = fn.body[0] as unknown as { value?: unknown } | undefined
  const returnHandleName = findReturnHandleName(ret?.value, rootToId)

  // For each root, build the set of all chain nodes (root itself +
  // every BinOp/Aggregate whose target is reachable from the root via
  // forward `operands[0]`/`inputs[0]` walks). Non-first ops on this
  // chain can replace any of these nodes with a `minecraft:storage`
  // read since each one was previously written to the handle's storage
  // at some earlier op in the chain.
  const ns = String(core.pack.defaultNamespace)
  const chainNodesByRoot = collectChainNodesByRoot(fn.allNodes, roots)
  const handleStoragePathByHandle: Map<string, string> = new Map()
  for (const root of roots) {
    const handleName = rootToId.get(root)
    if (!handleName) continue
    // Handle paths are SHARED across calls (no per-call suffix).
    // Each math op writes to its handle's storage and the next op
    // reads from it; calls run sequentially within a tick, so
    // sharing is safe. Per-call separation would force each call's
    // providers to reference a different storage, which can't be
    // expressed in a single shared provider file.
    handleStoragePathByHandle.set(
      handleName,
      buildHandleStoragePath(fn, handleName),
    )
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
  updates.forEach((u, i) => {
    lastUpdateIndexByHandle.set(u.handleName, i)
  })
  const finalIndex = returnHandleName
    ? lastUpdateIndexByHandle.get(returnHandleName)
    : undefined
  const foldResultIntoFinal = finalIndex !== undefined

  const plan: MultiStatementEmit = {
    commands: [],
    providers: new Map(),
    resultStoragePath: buildResultStoragePath(fn, callIdx, useCallNamespace),
    returnHandleName,
  }

  updates.forEach((u, i) => {
    const isFinalOnReturn = i === finalIndex
    const storagePath =
      isFinalOnReturn && foldResultIntoFinal
        ? plan.resultStoragePath
        : buildHandleStoragePath(fn, u.handleName)
    const providerName = buildProviderName(fn, `op_${i}`)
    const providerJson: JsonContextFloatProvider = u.isFirst
      ? compileMathExpressionToProvider(
          substituteRoots(u.expression, rootToId, u.statesBefore),
        )
      : compileIncrementalProvider(
          u.expression,
          u.handleName,
          ns,
          chainNodesByRoot,
          rootToId,
          // When folding into the result storage, the incremental
          // compile needs to read the chain's INTERMEDIATE storages
          // (which still exist at this point — earlier ops wrote them).
          // We pass the ORIGINAL handle storage path so reads resolve
          // to the right storage; the final write itself goes to
          // `resultStoragePath` instead.
          handleStoragePathByHandle,
          transients,
        )
    plan.commands.push({
      handleName: u.handleName,
      storagePath,
      providerName,
    })
    plan.providers.set(providerName, providerJson)
  })

  return plan
}

/**
 * For each root, gather every chain node reachable from the root via
 * forward `operands[0]`/`inputs[0]` propagation. Each handle's
 * chain nodes map lets the incremental emitter replace ANY node on
 * the chain with a `minecraft:storage` read of the handle's storage
 * — they were all written there in some prior op.
 */
function collectChainNodesByRoot(
  allNodes: readonly MathNode[],
  roots: Set<MathExpressionNode>,
): Map<MathExpressionNode, Set<MathExpressionNode>> {
  const map = new Map<MathExpressionNode, Set<MathExpressionNode>>()
  for (const root of roots) {
    map.set(root, new Set([root]))
  }
  let changed = true
  while (changed) {
    changed = false
    for (const node of allNodes) {
      if (BinaryOpNode.is(node) && node.operands[0]) {
        for (const nodes of map.values()) {
          if (nodes.has(node.operands[0]) && !nodes.has(node)) {
            nodes.add(node)
            changed = true
            break
          }
        }
      }
      if (AggregateNode.is(node) && node.inputs[0]) {
        for (const nodes of map.values()) {
          if (nodes.has(node.inputs[0]) && !nodes.has(node)) {
            nodes.add(node)
            changed = true
            break
          }
        }
      }
    }
  }
  return map
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
 */
function compileIncrementalProvider(
  expression: MathExpressionNode,
  targetHandle: string,
  ns: string,
  chainNodesByRoot: Map<MathExpressionNode, Set<MathExpressionNode>>,
  rootToId: Map<MathExpressionNode, string>,
  handleStoragePaths: Map<string, string>,
  transients: Set<MathExpressionNode>,
): JsonContextFloatProvider {
  void targetHandle
  // Compute each chain node's "owning root" — the FIRST root
  // reachable by walking backward through operands[0]/inputs[0],
  // stopping at the node itself if it IS a root. This gives every
  // node an unambiguous primary chain (BinOp[0] is funny's root
  // despite using CopyNode[0] in its construction; BinOp[1] is rx's
  // chain state).
  const owningRoot = new Map<MathExpressionNode, MathExpressionNode>()
  for (const root of rootToId.keys()) owningRoot.set(root, root)
  for (const node of chainNodesByRoot.values()) {
    for (const candidate of node) {
      if (owningRoot.has(candidate)) continue
      const or = owningRootOf(candidate, new Set(rootToId.keys()))
      if (or) owningRoot.set(candidate, or)
    }
  }

  const nodeToStorageRef = new Map<MathExpressionNode, JsonContextFloatProvider>()
  for (const [node, root] of owningRoot) {
    if (transients.has(node)) continue
    if (node === expression) continue
    const handle = rootToId.get(root)
    if (!handle) continue
    const path = handleStoragePaths.get(handle)
    if (!path) continue
    nodeToStorageRef.set(node, {
      type: 'storage',
      storage: ns as NamespacedString,
      path: path as NonEmptyString,
    } as JsonContextFloatProvider)
  }
  return compileWithChainReads(expression, nodeToStorageRef)
}

/**
 * Walk backward from `node` via `operands[0]` / `inputs[0]` to find
 * its owning root. Returns `node` itself if it IS a root (the chain
 * it owns), otherwise the root its chain fronts. Used to disambiguate
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

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Walk the return value via operands[0]/inputs[0] reverse chain
 * until reaching a chain root. The root maps to its handle id.
 */
function findReturnHandleName(
  returnValue: unknown,
  rootToId: Map<MathExpressionNode, string>,
): string | null {
  if (returnValue == null || typeof returnValue !== 'object') return null
  let current: unknown = returnValue
  const seen = new Set<unknown>()
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current)
    const ast = current as {
      operands?: unknown[]
      inputs?: unknown[]
    }
    if (Array.isArray(ast.operands) && ast.operands.length > 0) {
      current = ast.operands[0]
      const id = rootToId.get(current as MathExpressionNode)
      if (id) return id
      continue
    }
    if (Array.isArray(ast.inputs) && ast.inputs.length > 0) {
      current = ast.inputs[0]
      const id = rootToId.get(current as MathExpressionNode)
      if (id) return id
      continue
    }
    return null
  }
  return null
}

function buildHandleStoragePath(
  fn: MathFunctionNode,
  handleName: string,
): string {
  return `math_${fn.resourceName ?? '0'}_h_${handleName}`
}

function buildResultStoragePath(
  fn: MathFunctionNode,
  callIdx: number,
  useCallNamespace: boolean,
): string {
  const suffix = useCallNamespace ? `_${callIdx}` : ''
  return `math_${fn.resourceName ?? '0'}_result${suffix}`
}

function buildProviderName(fn: MathFunctionNode, suffix: string): string {
  return `default:math_${fn.resourceName ?? '0'}_${suffix}`
}

export function makeDeferredResultDataPoint(
  core: SandstoneCore,
  fn: MathFunctionNode,
  callIdx: number,
  useCallNamespace: boolean,
): DataPointClass<'storage'> {
  return core.pack.DataVariable(
    undefined,
    buildResultStoragePath(fn, callIdx, useCallNamespace),
  )
}
