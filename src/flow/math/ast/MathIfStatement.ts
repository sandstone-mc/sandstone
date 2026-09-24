import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { Float, Integer } from './handles'
import type { MathConditionNode } from './MathConditionNode'
import type { MathOutputsSchema } from '../../math/Math'
import {
  MathElseNode,
  MathElseIfNode,
  MathFlowClauseNode,
  MathIfNode,
  MathReturnNode,
} from './nodes/control'

/**
 * Return shape accepted by `_.return(value)` and `ifStatement.return(value)`.
 *   - A single `Float` / `Integer` handle for scalar returns.
 *   - A record keyed by output name when the math function was declared
 *     with a record outputs schema (`_.Math({x:Float,y:Float}, ...)`).
 *     Each value must be a handle of the matching kind.
 */
export type MathReturnValue =
  | Float
  | Integer
  | Record<string, Float | Integer>

/**
 * User-facing wrapper for an `_.if(cond, cb)` call (and its chain).
 *
 * Mirrors `flow/if_else.ts#IfStatement<R>` shape:
 *   - Holds the head `MathIfNode` in `node`.
 *   - `.elseIf(cond, cb)` / `.else(cb)` link the next clause via
 *     `nextFlowNode` and hand back a new `MathIfStatement` (or
 *     `MathElseStatement`) so the chain can keep growing.
 *   - `.return(value)` appends a `MathReturnNode` to the current
 *     clause's body, then hands back a chain-extending subset so
 *     `.else(...)` / `.elseIf(...)` can follow the return (parallel
 *     to MCFunction flow's `IfStatement.return`).
 *
 * Differs from MCFunction flow:
 *   - No `.run` getter — math bodies don't proxy commands.
 *   - No `R` generic — callback form is the only form (math bodies must
 *     be statement lists, never deferred).
 */
/**
 * Generic over the outputs schema `R`. Threaded through `.elseIf` /
 * `.else` / `.return` so the chain preserves the schema type — every
 * `return(value: V extends R)` along the chain is checked against the
 * same `R` the user declared at `_.Math<R>(schema, cb)`.
 *
 * The R is phantom: it has no runtime effect on the AST. Only the TS
 * signatures use it.
 */
export class MathIfStatement<R extends MathOutputsSchema = MathOutputsSchema> {
  protected node: MathFlowClauseNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected condition: MathConditionNode,
    protected callback: () => void,
  ) {
    this.node = new MathIfNode(sandstoneCore, condition, callback)
  }

  /**
   * Append an `elseIf` clause to the chain. The previous clause's
   * `nextFlowNode` is set to the new `MathElseIfNode`. Returns the
   * new statement so further `.elseIf` / `.else` / `.return` calls
   * extend from there. R is preserved.
   */
  elseIf(condition: MathConditionNode, callback: () => void): MathIfStatement<R> {
    const elseIfNode = new MathElseIfNode(this.sandstoneCore, condition, callback)
    this.node.nextFlowNode = elseIfNode
    return new MathIfStatement<R>(
      this.sandstoneCore,
      condition,
      callback,
    )._adoptNode(elseIfNode)
  }

  /**
   * Terminal else clause. Links via `nextFlowNode`, returns an
   * `MathElseStatement<R>` (no further `.elseIf`; chain terminus).
   */
  else(callback: () => void): MathElseStatement<R> {
    const elseNode = new MathElseNode(this.sandstoneCore, callback)
    this.node.nextFlowNode = elseNode
    return new MathElseStatement<R>(this.sandstoneCore, elseNode)
  }

  /**
   * Append a `MathReturnNode` with `value` to the current clause's body.
   * Returns a chain-extending subset (`elseIf` + `else`) so the user can
   * keep building the chain after an early return. R is preserved.
   *
   * Value must match the schema — `V extends R`.
   */
  return<V extends MathReturnValue>(value: V): MathIfReturnStatement<R> {
    const returnNode = new MathReturnNode(this.sandstoneCore, value)
    this.node.append(returnNode)
    return new MathIfReturnStatement<R>(
      this.sandstoneCore,
      this.node,
      this.elseIf.bind(this),
      () => this.else(() => {}),
    )
  }

  /**
   * @internal — used by `elseIf` to hand back a statement whose `node`
   * points at the just-created `MathElseIfNode` (so further chain
   * extensions link from there, not from a fresh head).
   */
  protected _adoptNode(node: MathFlowClauseNode): this {
    this.node = node
    return this
  }
}

/**
 * Returned by `ifStatement.else(cb)`. Terminal — no further `.elseIf`
 * or `.else` methods (the else branch is the chain terminus). Holds
 * the `MathElseNode` for lowerer consumption.
 */
export class MathElseStatement<R extends MathOutputsSchema = MathOutputsSchema> {
  constructor(
    protected sandstoneCore: SandstoneCore,
    protected node: MathElseNode,
  ) {
    void sandstoneCore
  }

  /**
   * @internal — exposed for lowerer / tests.
   */
  getNode(): MathElseNode {
    return this.node
  }
}

/**
 * Returned by `ifStatement.return(value)`. Callable + property hybrid:
 *   - Calling `chainable()` is a no-op (return already committed).
 *   - `.elseIf(cond, cb)` continues the chain with an elseIf clause.
 *   - `.else(cb)` adds the terminal else clause.
 *
 * Mirrors the shape of MCFunction `IfReturnInterface` minus the `.run`
 * and `.fail` (math returns aren't commands).
 */
export class MathIfReturnStatement<R extends MathOutputsSchema = MathOutputsSchema> {
  private elseIfFn: (condition: MathConditionNode, callback: () => void) => MathIfStatement<R>
  private elseFn: (callback: () => void) => MathElseStatement<R>

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected node: MathFlowClauseNode,
    elseIfFn: (condition: MathConditionNode, callback: () => void) => MathIfStatement<R>,
    elseFn: (callback: () => void) => MathElseStatement<R>,
  ) {
    this.elseIfFn = elseIfFn
    this.elseFn = elseFn
  }

  elseIf(condition: MathConditionNode, callback: () => void): MathIfStatement<R> {
    return this.elseIfFn(condition, callback)
  }

  else(callback: () => void): MathElseStatement<R> {
    return this.elseFn(callback)
  }
}