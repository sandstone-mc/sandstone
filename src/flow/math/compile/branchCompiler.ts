import type {
  JsonContextFloatProvider,
} from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type {
  JsonContextIntProvider,
} from '../../../arguments/generated/_json/data/number_provider/context_int.ts'
import type { MathKind } from '../ast/MathExpressionNode'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import type { MathNode } from '../ast/MathNode'
import { ConversionNode } from '../ast/nodes/conversion'
import { LiteralNode } from '../ast/nodes/leaves'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import {
  MathElseIfNode,
  MathElseNode,
  MathFlowClauseNode,
  MathIfNode,
  MathReturnNode,
  MathSwitchNode,
} from '../ast/nodes/control'
import { compileCondition } from './conditionCompiler'
import { compileFloatProvider, compileIntProvider } from './mathProviderCompiler'
import { NBTPrimitive } from '../../../variables/nbt/NBTs'
import type { MathCaseValue } from '../ast/nodes/control'

/**
 * Compile a math block's control flow into a single number provider.
 *
 * MC's providers can't branch on a computed value — but they CAN
 * branch on a PREDICATE, and the predicates that fit a numeric test
 * (`minecraft:int_value_check` / `minecraft:float_value_check`)
 * evaluate their `value` as a provider. So a branch becomes:
 *
 *   - an `if` / `elseIf` / `else` chain → nested `conditional`
 *     providers (MC's `context_*_provider`'s `conditional` shape:
 *     `{condition, on_true, on_false}`), and
 *   - a `switch` / `case` → a `number_dispatcher`
 *     (`{cases: [{condition, value}], default}`).
 *
 * The whole control flow collapses into ONE provider, so the block's
 * result is a single value like any other — MC evaluates the
 * predicate and the matching branch lazily, at read time.
 *
 * ## The model
 *
 * A math block's body is a sequence of statements, and the block's
 * result is "the value of the first branch whose condition holds".
 * That is exactly the semantics of a straight-line sequence of early
 * returns, and it lowers to nested `conditional` providers:
 *
 * ```ts
 * _.if(c1, () => { _.return(v1) })
 *   .elseIf(c2, () => { _.return(v2) })
 *   .else(() => { _.return(v3) })
 * ```
 *
 * → `conditional(c1, v1, conditional(c2, v2, v3))` — the first
 * condition that holds wins.
 *
 * **Every path must produce a value.** The end of the block is not
 * one: a chain whose false path reaches the end — an `if` with no
 * `else`, an `elseIf` chain with no final `else`, a `switch` with no
 * `default` — is a compile error, not a silent zero. A zero would
 * hand the caller a number nobody chose, and the block's result would
 * quietly differ from what the source says.
 *
 * The rules, in full:
 *
 *   - A branch WITH a `_.return(...)` is **terminal**: its value is
 *     the returned expression, and the flow after it is not
 *     evaluated.
 *   - A branch WITHOUT a return but WITH a nested branch contributes
 *     the nested branch's value (the nested branch's own false path
 *     continues past the enclosing branch).
 *   - A branch with NEITHER contributes nothing: its body doesn't
 *     affect the result, so the condition is dropped and the flow
 *     continues as if the branch weren't there.
 *   - An `if` chain's false path moves to the next clause; an `else`
 *     clause is the chain's fallback, and a chain without an `else`
 *     continues into whatever follows the chain — the next branch
 *     structure, or the end of the block (a compile error).
 *   - Straight-line code that follows a branch can never affect the
 *     result — the branch's `else` (or the next structure) already
 *     covers the path that reaches the end. Such a chain update is a
 *     dead store, and the plan builder drops it.
 *
 * ## Branch values are snapshots
 *
 * A branch's value is the expression captured by its `_.return(...)`
 * — the handle's node AT THAT MOMENT. Compiling it directly (not
 * through the chain-read substitution) inlines the whole chain from
 * its root, so the branch's provider is self-contained: it doesn't
 * depend on a chain update having run first.
 *
 * That also means a branch's value sees the chain state as of the
 * branch, not as of the end of the block — the snapshot is the point.
 */

/**
 * A compiled provider — either numeric family. The concrete family
 * follows the block's kind, so the two never mix in one tree.
 */
type CompiledProvider = JsonContextFloatProvider | JsonContextIntProvider

/**
 * The end of the block — a path that reaches it has NO value.
 *
 * Every path through the block's control flow must produce one, so
 * this is never a valid provider: a branch that leaves a path
 * uncovered (an `if` with no `else`, a switch with no `default`) is a
 * compile error, not a silent zero. Falling through to a zero would
 * hand the caller a number nobody chose — the block's result would
 * quietly differ from what the source says.
 */
const NO_VALUE = Symbol('math-no-value')

/**
 * What follows a branch: the next branch structure's value, or
 * {@link NO_VALUE} when the block ends there.
 */
type Continuation = CompiledProvider | typeof NO_VALUE

/**
 * A branch body — an `if` / `elseIf` / `else` clause, or a switch
 * case. Both hold their statements in `body`.
 */
interface BranchBody {
  body: MathNode[]
  sandstoneCore: SandstoneCore
}

/**
 * A branch structure in a math body — an if-chain or a switch.
 */
type BranchStructure = MathIfNode | MathSwitchNode

/**
 * Compile a value into the given numeric context, bridging a kind
 * mismatch with MC's `from_int` / `from_float`.
 */
function compileValue(
  value: MathExpressionNode,
  kind: MathKind,
): CompiledProvider {
  const coerced = value.kind === kind
    ? value
    : new ConversionNode(value.sandstoneCore, value, kind)
  return kind === 'integer'
    ? compileIntProvider(coerced)
    : compileFloatProvider(coerced)
}

/**
 * The branch structures a math function's body holds — the if-chains
 * and switches, in the order they appear.
 *
 * Only the DIRECT children of the body count: a branch nested inside
 * another branch belongs to that branch, not to the block.
 */
export function findBranches(fn: MathFunctionNode): BranchStructure[] {
  const branches: BranchStructure[] = []
  for (const node of fn.body) {
    if (MathIfNode.is(node)) branches.push(node)
    else if (MathSwitchNode.is(node)) branches.push(node)
  }
  return branches
}

/**
 * Compile a math function's control flow into ONE provider.
 *
 * Returns `undefined` when the function has no branch structure —
 * the block's result then comes from its straight-line chain.
 */
export function compileBranchResult(
  fn: MathFunctionNode,
  kind: MathKind,
  field?: string,
): CompiledProvider | undefined {
  const branches = findBranches(fn)
  if (branches.length === 0) return undefined

  // Fold the structures from the last one backwards: each structure's
  // FALSE path continues into the next one, so the first structure
  // whose condition holds wins — the semantics of a straight-line
  // sequence of early returns.
  //
  // The block's END is the last structure's false path — and it has
  // no value. A structure that leaves its false path uncovered throws
  // (see `NO_VALUE`).
  let result: Continuation = NO_VALUE
  for (let i = branches.length - 1; i >= 0; i--) {
    result = compileStructure(branches[i], kind, result, field)
  }
  return result as CompiledProvider
}

/**
 * Compile one branch structure — an if-chain or a switch — with
 * `continuation` as the value of its false path.
 */
function compileStructure(
  structure: BranchStructure,
  kind: MathKind,
  continuation: Continuation,
  field?: string,
): Continuation {
  return MathIfNode.is(structure)
    ? compileIfChain(structure, kind, continuation, field)
    : compileSwitch(structure, kind, continuation, field)
}

/**
 * Compile an `if` / `elseIf` / `else` chain into nested `conditional`
 * providers.
 *
 * The chain is built from the tail backwards: the last clause is the
 * innermost `on_false`, and each clause wraps the rest.
 */
export function compileIfChain(
  head: MathIfNode,
  kind: MathKind,
  continuation: Continuation,
  field?: string,
): Continuation {
  // The chain: the head, its `elseIf`s, and the optional `else`.
  const conditionalClauses: Array<MathIfNode | MathElseIfNode> = [head]
  let elseClause: MathElseNode | undefined
  let cursor: MathFlowClauseNode | undefined = head
  while (cursor?.nextFlowNode) {
    const next: MathFlowClauseNode = cursor.nextFlowNode
    if (MathElseNode.is(next)) {
      elseClause = next
      break
    }
    conditionalClauses.push(next as MathElseIfNode)
    cursor = next
  }

  // Resolve statically-known conditions:
  //   - a clause whose condition is always FALSE never matches — it's
  //     skipped, and the chain continues with the next clause.
  //   - a clause whose condition is always TRUE always matches — the
  //     rest of the chain (and the `else`) is dead code.
  const liveClauses: Array<MathIfNode | MathElseIfNode> = []
  let alwaysTaken = false
  for (const clause of conditionalClauses) {
    const condValue = clause.condition.evaluateConstant()
    if (condValue === false) continue
    liveClauses.push(clause)
    if (condValue === true) {
      alwaysTaken = true
      break
    }
  }

  // The chain's FALSE path: the `else` clause's value, or — for a
  // chain without an `else` (or with an always-taken clause) — the
  // continuation (whatever follows the chain in the block).
  let result: Continuation = continuation
  if (elseClause && !alwaysTaken) {
    const elseValue = clauseValue(elseClause, kind, continuation, field)
    if (elseValue !== undefined) result = elseValue
  }

  // The chain's false path must have a value. An always-taken clause
  // makes the false path statically unreachable, so it doesn't need
  // one.
  if (!alwaysTaken && result === NO_VALUE) {
    throw new Error(
      'Math: the `if` chain in math block '
      + `'${head.parentMathFunction.resourceName ?? 'unknown'}' leaves a path `
      + 'with no value — a condition that does not hold reaches the end of '
      + 'the math block, and the end of the block is not a value. Every '
      + 'path must produce one: add an `else` (or a final `elseIf`) that '
      + 'returns a value.',
    )
  }

  // Build the nested conditionals from the tail backwards: each
  // clause's false path is the rest of the chain.
  for (let i = liveClauses.length - 1; i >= 0; i--) {
    const clause = liveClauses[i]
    const value = clauseValue(clause, kind, result, field)
    // A clause with neither a return nor a nested branch contributes
    // nothing — its body doesn't affect the result, so the condition
    // is dropped and the flow continues as if it weren't there.
    if (value === undefined) continue
    // An always-taken clause needs no predicate — its value IS the
    // chain's value.
    if (clause.condition.evaluateConstant() === true) {
      result = value
      continue
    }
    const condition = compileCondition(clause.condition)
    result = kind === 'integer'
      ? {
        type: 'conditional',
        condition,
        on_true: value as JsonContextIntProvider,
        on_false: result as JsonContextIntProvider,
      }
      : {
        type: 'conditional',
        condition,
        on_true: value as JsonContextFloatProvider,
        on_false: result as JsonContextFloatProvider,
      }
  }

  // The chain ended up with no value at all — every clause
  // contributed nothing, so the block produces nothing.
  if (result === NO_VALUE) {
    throw new Error(
      'Math: the `if` chain in math block '
      + `'${head.parentMathFunction.resourceName ?? 'unknown'}' leaves a path `
      + 'with no value — a condition that does not hold reaches the end of '
      + 'the math block, and the end of the block is not a value. Every '
      + 'path must produce one: add an `else` (or a final `elseIf`) that '
      + 'returns a value.',
    )
  }
  return result
}

/**
 * Compile a `switch` / `case` into a `number_dispatcher`.
 *
 * Each static case tests the dispatch value against the case's value
 * (`[v, v]` — an exact match); each condition case uses the
 * condition its callback returned; the default case (if any) becomes
 * the dispatcher's `default`.
 *
 * MC tests the cases in order and uses the first that passes — the
 * same "first match wins" rule the if-chain follows.
 */
export function compileSwitch(
  node: MathSwitchNode,
  kind: MathKind,
  continuation: Continuation,
  field?: string,
): Continuation {
  // The dispatch value is a handle (or an expression) — the provider
  // needs the expression it wraps.
  const dispatch = (node.dispatchValue as { node?: MathExpressionNode }).node
    ?? (node.dispatchValue as MathExpressionNode)
  const dispatchProvider = kind === 'integer'
    ? compileIntProvider(dispatch)
    : compileFloatProvider(dispatch)

  // The dispatcher's DEFAULT — the value of a dispatch that matches
  // no case. The default case supplies it; without one, whatever
  // follows the switch does — and if nothing does, the switch leaves
  // a path with no value.
  const defaultValue = node.defaultCase
    ? clauseValue(node.defaultCase, kind, continuation, field)
    : undefined
  const defaultProvider: Continuation = defaultValue ?? continuation
  if (defaultProvider === NO_VALUE) {
    throw new Error(
      'Math: the `switch` leaves a path with no value — a dispatch that '
      + 'matches no case reaches the end of the math block, and the end '
      + 'of the block is not a value. Every path must produce one: add a '
      + '`default` case that returns a value.',
    )
  }

  const cases: Array<{ condition: unknown, value: unknown }> = []

  for (const staticCase of node.staticCases) {
    // A case that contributes nothing falls back to the default — the
    // dispatch matched it, so the default IS its value.
    const value = clauseValue(staticCase, kind, defaultProvider, field) ?? defaultProvider
    const bound = compileCaseBound(staticCase.caseValue, kind)
    cases.push({
      condition: kind === 'integer'
        ? {
          type: 'minecraft:int_value_check',
          value: dispatchProvider,
          test: { min: bound, max: bound },
        }
        : {
          type: 'minecraft:float_value_check',
          value: dispatchProvider,
          test: { min: bound, max: bound },
        },
      value,
    })
  }

  for (const conditionCase of node.conditionCases) {
    const condition = conditionCase.conditionCallback(
      node.dispatchValue as never,
    )
    const value = clauseValue(conditionCase, kind, defaultProvider, field) ?? defaultProvider
    cases.push({ condition: compileCondition(condition), value })
  }

  const dispatcher = {
    type: 'number_dispatcher' as const,
    cases,
    default: defaultProvider,
  }

  return dispatcher as unknown as CompiledProvider
}

/**
 * The value a branch contributes — or `undefined` when the branch
 * contributes NOTHING.
 *
 * A branch contributes:
 *
 *   - its `_.return(...)` value, when it has one. The branch is
 *     TERMINAL: the flow after it isn't evaluated.
 *   - the value of a nested branch structure, when it contains one.
 *     The nested structure's own false path continues past the
 *     enclosing branch, into `continuation`.
 *   - nothing, when it has neither. Its body doesn't affect the
 *     result, so the branch is dropped and the flow continues.
 *
 * Throws when the branch returns more than one value, or returns a
 * record (a record return needs the per-field decomposition, which
 * the scalar path doesn't do).
 */
function clauseValue(
  clause: BranchBody,
  kind: MathKind,
  continuation: Continuation,
  field?: string,
): CompiledProvider | undefined {
  const returns = clause.body.filter((n) => MathReturnNode.is(n))
  if (returns.length > 1) {
    throw new Error(
      `Math: a branch has ${returns.length} returns. A branch returns `
      + 'exactly one value.',
    )
  }
  if (returns.length === 1) {
    return compileReturnValue((returns[0] as MathReturnNode).value, kind, field)
  }

  // No return — the branch's value comes from a nested branch
  // structure, if it has one.
  const nested = clause.body.filter((n) => MathIfNode.is(n) || MathSwitchNode.is(n))
  if (nested.length === 0) return undefined
  // Several nested structures in one branch: fold them like the top
  // level — the first one that matches wins.
  let result: Continuation = continuation
  for (let i = nested.length - 1; i >= 0; i--) {
    result = compileStructure(nested[i], kind, result, field)
  }
  return result as CompiledProvider
}

/**
 * Compile a branch's returned value.
 *
 * A SCALAR block returns a single expression. A RECORD block returns
 * a record of expressions — one per output field — and the branch is
 * compiled ONCE PER FIELD, so this picks the field's own expression
 * out of the returned record.
 */
function compileReturnValue(
  value: unknown,
  kind: MathKind,
  field?: string,
): CompiledProvider {
  if (value === null || typeof value !== 'object') {
    throw new Error('Math: a branch must return a value.')
  }
  if (field === undefined) {
    if (!('kind' in value)) {
      throw new Error(
        'Math: a branch must return a single value, not a record. '
        + 'A scalar math block cannot return a record from a branch.',
      )
    }
    return compileValue(value as MathExpressionNode, kind)
  }
  // A record return — take this field's expression out of it.
  const record = value as Record<string, unknown>
  const fieldValue = record[field]
  if (fieldValue === undefined) {
    throw new Error(
      `Math: the branch's returned record has no field '${field}'. `
      + 'A branch must return every field of the math block\'s output schema.',
    )
  }
  if (!('kind' in (fieldValue as object))) {
    throw new Error(
      `Math: the branch's returned record's field '${field}' is not a value.`,
    )
  }
  return compileValue(fieldValue as MathExpressionNode, kind)
}

/**
 * A constant bound in the given numeric context.
 *
 * The integer context truncates a fractional value toward zero —
 * the same rule MC's `from_float` bridge applies.
 */
function constantBound(
  value: number,
  kind: MathKind,
): JsonContextIntProvider | JsonContextFloatProvider {
  const bound = kind === 'integer' ? Math.trunc(value) : value
  return bound
}

/**
 * The bound a static case compares the dispatch value against.
 *
 * A case's value is a literal, an NBT numeric primitive, or a handle
 * — either way it compiles to a provider in the dispatcher's context,
 * and the range's bounds accept providers.
 */
function compileCaseBound(
  caseValue: MathCaseValue,
  kind: MathKind,
): JsonContextIntProvider | JsonContextFloatProvider {
  if (typeof caseValue === 'number') {
    return constantBound(caseValue, kind)
  }
  if (caseValue instanceof NBTPrimitive) {
    // An NBT primitive carries its number — `NBT.int(3)` is the
    // integer 3. In the integer context a float value is truncated
    // toward zero, exactly like MC's `from_float`.
    return constantBound(Number(caseValue.value), kind)
  }
  const node = caseValue.node
  return kind === 'integer'
    ? compileIntProvider(node)
    : compileFloatProvider(node)
}
