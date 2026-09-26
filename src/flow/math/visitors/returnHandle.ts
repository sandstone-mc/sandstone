import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import { MathAnalysisVisitor } from './MathVisitor'

/**
 * `ReturnHandleVisitor` — walk `_.return(value)`'s value back to its
 * chain root. Returns the root's handle ID (used by the compiler
 * to fold the LAST update on that chain into the result storage),
 * or `null` if the return is unreachable / a literal.
 *
 * Replaces the inline `findReturnHandleName` helper that lived
 * inside `MathChainAnalysisVisitor`. Extracted so the return-handle
 * resolution can be tested / reused independently and doesn't add
 * another responsibility to the chain analysis visitor.
 *
 * **Storage**: result lives in
 * `fn.analyses.get('returnHandle')` as `string | null`.
 */
export class ReturnHandleVisitor extends MathAnalysisVisitor<string | null> {
  override readonly key = 'returnHandle'

  override analyze(fn: MathFunctionNode): string | null {
    // The chain analysis already classifies roots and assigns handle
    // IDs — pull its `rootToId` to translate the discovered root
    // into a stable handle name.
    const chainAnalysis = fn.analyses.get('chain') as
      | undefined
      | {
          rootToId: Map<MathExpressionNode, string>
        }
    if (!chainAnalysis) return null

    // The body's first (and usually only) entry is `MathReturnNode`.
    // For now the math layer only supports a single return at the
    // top level — multi-return is out of scope for v1.
    const ret = fn.body[0] as unknown as { value?: unknown } | undefined
    return this.walkReturn(ret?.value, chainAnalysis.rootToId)
  }

  /**
   * Walk a return value via `operands[0]`/`inputs[0]` reverse chain
   * until reaching a chain root. Returns the root's handle ID, or
   * null if no chain root is reachable (e.g. a return of a literal
   * or a RandomNode that isn't bound to a handle).
   */
  private walkReturn(
    returnValue: unknown,
    rootToId: Map<MathExpressionNode, string>,
  ): string | null {
    if (returnValue == null || typeof returnValue !== 'object') return null
    // `MathChainAnalysisVisitor` synthesizes a single update with
    // handle ID `'const_result'` when the entire chain folded to a
    // literal. Match it directly so the bridge writes to the
    // bridge's own result storage (not to a new
    // `h_const_result` intermediate).
    if (rootToId.get(returnValue as MathExpressionNode) === 'const_result') {
      return 'const_result'
    }
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
}