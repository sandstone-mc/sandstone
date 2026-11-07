import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { Float, Integer } from './handles'
import type { MathConditionNode } from './MathConditionNode'
import type { MathOutputsSchema } from '../../math/Math'
import {
  snapshotMathValue,
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
  /** The clause this statement extends — created on first use. */
  protected _node?: MathFlowClauseNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected condition: MathConditionNode,
    /**
     * The body callback. OPTIONAL — `_.if(cond)` with no body is a
     * valid form; the body arrives with the first `.return(...)` /
     * `.elseIf(...)` / `.else(...)` call.
     */
    protected callback?: () => void,
    /**
     * An already-created clause to adopt, instead of creating one.
     *
     * `elseIf` creates the `MathElseIfNode` itself and then hands the
     * statement that node — so the statement must NOT create a second
     * clause (a `MathIfNode` would land in the math function's body as
     * a stray branch head).
     *
     * @internal
     */
    protected adoptedNode?: MathFlowClauseNode,
  ) {
    if (adoptedNode) {
      this._node = adoptedNode
      return
    }
    // A clause WITH a body is created EAGERLY: the body has to run
    // here, at the call site, so its statements land in the math
    // function's body in the right order.
    //
    // A clause WITHOUT a body is created lazily — the body arrives
    // with the `.return(...)` that follows it.
    if (this.callback) {
      this._node = new MathIfNode(this.sandstoneCore, this.condition, this.callback)
    }
  }

  /**
   * The clause this statement extends. Created on first access when
   * it wasn't created eagerly (the body-less form).
   */
  protected get node(): MathFlowClauseNode {
    if (!this._node) {
      this._node = new MathIfNode(this.sandstoneCore, this.condition, this.callback)
    }
    return this._node
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
      elseIfNode,
    )
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
    const returnNode = new MathReturnNode(this.sandstoneCore, snapshotMathValue(value))
    this.node.append(returnNode)
    return new MathIfReturnStatement<R>(
      this.sandstoneCore,
      this.node,
      this.elseIf.bind(this),
      () => this.else(() => {}),
    )
  }

}
/**
 * `_.if(cond)` with no body — the RETURN-ONLY form.
 *
 * A branch that just returns a value needs no body callback: the
 * return IS the body. The clause is created when the value is
 * returned, so the branch lands in the right place in the math
 * function's body.
 *
 * There is no else chain here — a return-only `if` is a single
 * branch. Use `_.if(cond, () => { ... })` for the chainable form.
 */
export class MathIfReturnOnlyStatement<R extends MathOutputsSchema = MathOutputsSchema> {
  /** The clause — created when the branch returns. */
  private _node?: MathIfNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected condition: MathConditionNode,
  ) {}

  /**
   * Return a value from the branch. The clause is created here, with
   * the return as its body.
   *
   * Value must match the schema — `V extends R`.
   */
  return<V extends MathReturnValue>(value: V): this {
    if (!this._node) {
      this._node = new MathIfNode(this.sandstoneCore, this.condition)
    }
    const returnNode = new MathReturnNode(this.sandstoneCore, snapshotMathValue(value))
    // The return belongs to the CLAUSE — the clause isn't on the math
    // stack (its body is the return), so the owner is set by hand.
    returnNode.owner = this._node
    this._node.append(returnNode)
    return this
  }

  /**
   * @internal — exposed for lowerer / tests.
   */
  getNode(): MathIfNode {
    if (!this._node) {
      this._node = new MathIfNode(this.sandstoneCore, this.condition)
    }
    return this._node
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