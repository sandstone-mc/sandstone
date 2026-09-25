import * as util from 'util'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import { MathNode } from './MathNode'
import {
  MATH_NODE_DEFAULT_DEPTH,
  formatMath,
  getIndent,
} from './inspectHelpers'

/**
 * A math node that contains a body of other math nodes.
 *
 * Mirrors `core/nodes.ts#ContainerNode` — same `body: MathNode[]` storage,
 * same `append`/`prepend` semantics. Standalone: does NOT share state with
 * the MCFunction context stack.
 *
 * Body generation (`generateBody`) pushes/pops `this` on the Math DSL's
 * own context stack (see `MathFunctionNode`). The Math DSL runs commands
 * via the surrounding MCFunction context where applicable; containers just
 * track math-AST children.
 */
export abstract class MathContainerNode extends MathNode {
  /** Type guard. */
  static is(node: unknown): node is MathContainerNode {
    return node instanceof MathContainerNode
  }

  _body: MathNode[] = []

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
  }

  get body(): MathNode[] {
    return this._body
  }

  set body(body: MathNode[]) {
    this._body = body
  }

  /**
   * Run `callback` with `this` as the active math container (so any
   * math nodes created during the callback land in `this.body`). The
   * Math DSL's own context stack tracks which container is active; this
   * method pushes/pops it locally so it does not touch the surrounding
   * MCFunction stack.
   */
  generateBody(callback: () => void): MathNode[] {
    const stack = this.sandstoneCore.mathStack
    stack.push(this)
    try {
      callback()
    } finally {
      stack.pop()
    }
    return this.body
  }

  append<NODE extends MathNode>(node: NODE): NODE
  append<NODES extends MathNode[]>(...nodes: NODES): NODES
  append(...nodes: MathNode[]) {
    for (const node of nodes) {
      node.parent = this
    }
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  prepend<NODE extends MathNode>(node: NODE): NODE
  prepend<NODES extends MathNode[]>(...nodes: NODES): NODES
  prepend(...nodes: MathNode[]) {
    for (const node of nodes) {
      node.parent = this
    }
    this.body.unshift(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  /**
   * Children render via `util.inspect(child, options)` so Bun tracks
   * depth + seen-set uniformly — same protocol as `formatDebugString`'s
   * MCFunction inspector. At `depth <= 0` returns a static body-count
   * placeholder so output stays bounded.
   */
  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, this.body, depth, getIndent(options), this)
  }
}