import type { SandstoneCore } from '../../../core/sandstoneCore'
import { MathContainerNode } from './MathContainerNode'
import { BindingScope } from './BindingScope'
import type { Float, Integer } from './handles'

/**
 * Top-level Math DSL container — the analog of `MCFunctionNode` for math.
 *
 * One `MathFunctionNode` is created per `_.Math(...)` call. It owns:
 *   - `body`: the math AST (expression nodes, container nodes like
 *     `MathIfNode`, return markers, etc.). Imperative commands emitted
 *     by math nodes (`MathCommandNode` subclasses) commit themselves to
 *     whichever MCFunction is currently active — at top level the
 *     `MathFunction` registers a wrapper MCFunction for this purpose.
 *   - `bindings`: let-binding scope for `const rx = ...; rx['*='](...)`.
 *   - `outputs`: the return-shape schema (scalar or record of fields).
 *     Discriminated union avoids `result` key collisions with user-defined
 *     record schemas. The compile pass uses this to emit one provider
 *     resource per field (or one for scalar).
 *   - `currentReturn`: a per-frame "pending return value" handle. Set by
 *     `MathReturnNode`; merged into the final output DAG by the compiler.
 *
 * Context stack (`sandstoneCore.mathStack`) lets nested math containers
 * (`MathIfNode`, `MathSwitchNode`, ...) push/pop their own body context
 * without touching the MCFunction stack.
 */
export type MathFunctionOutputs =
  | { kind: 'scalar'; value: 'float' | 'integer' }
  | { kind: 'record'; fields: Record<string, 'float' | 'integer'> }

export class MathFunctionNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathFunctionNode {
    return node instanceof MathFunctionNode
  }

  readonly bindings = new BindingScope()
  readonly outputs: MathFunctionOutputs

  /**
   * Per-frame pending return value, if any. `_.return(v)` sets it;
   * subsequent nodes until the next control-flow boundary read from it
   * (or it is captured by the compile pass as one branch of a
   * `number_dispatcher` provider).
   */
  currentReturn: Float | Integer | undefined = undefined

  /**
   * Resource identity. Set by the Math DSL entry-point (`SandstoneMath.Math`)
   * once the name is known. Used by the compile pass to derive provider
   * resource names (`<ns>/<name>/<field>`).
   */
  resourceName: string | undefined = undefined

  constructor(sandstoneCore: SandstoneCore, outputs: MathFunctionOutputs = { kind: 'scalar', value: 'float' }) {
    super(sandstoneCore)
    this.outputs = outputs
    sandstoneCore.mathStack.push(this)
  }

  /**
   * Pop the active math function off the stack. Called by the entry-point
   * after the user callback returns. Idempotent if the stack is empty.
   */
  dispose(): void {
    const stack = this.sandstoneCore.mathStack
    const idx = stack.lastIndexOf(this)
    if (idx >= 0) stack.splice(idx, 1)
  }

  /**
   * Run `callback` with `node` as the active math container (so any math
   * nodes created during the callback land in `node.body`). If the
   * callback pushes additional containers onto `mathStack` (nested ifs,
   * case bodies, awaits), pop them all back to where we started — same
   * invariant as `MCFunctionNode.balanceContext`.
   *
   * Math DSL bodies are sync at compile time (no sleep/schedule), so the
   * "nested context leaks" case is narrower than MCFunction flow — but
   * condition-side sub-nodes can still construct combinator containers
   * (`MathConditionContainerNode`) without pushing the math stack. The
   * stack push/pop is for expression-side containers only.
   */
  balanceContext = (node: MathContainerNode, callback: () => void): void => {
    const stack = this.sandstoneCore.mathStack
    const depthBefore = stack.length
    node.generateBody(callback)
    while (stack.length > depthBefore) {
      stack.pop()
    }
  }

  /**
   * Skeleton. Real serialization compiles each output to a provider
   * resource (and possibly a wrapper mcfunction for imperative commands).
   */
  getValue(): unknown {
    return {
      type: 'MathFunction',
      outputs: this.outputs,
      body: this.body.map((n) => n.getValue()),
      bindings: [...this.bindings.names()],
    }
  }
}