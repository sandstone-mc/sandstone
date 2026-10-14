import type { Node } from 'sandstone/core'
import { ExecuteCommandNode, type SubCommand } from 'sandstone/commands'
import { conditionToNode, ConditionCaseNode, StaticCaseNode, SwitchNode } from 'sandstone/flow'
import { Score } from 'sandstone/variables'
import type { SandstonePack } from 'sandstone/pack'
import { TestMCFunctionNode } from 'sandstone/test/mcfunction'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Build an ExecuteCommandNode and mark it `isSingleExecute: true` so
 * `ContainerCommandsToMCFunctionVisitor` doesn't extract its body into a
 * child MCFunction. Body is assigned post-construction (not via the
 * constructor's `body` option) to avoid `append → exitContext` firing
 * during visitor time.
 */
const flatExecute = (
  pack: SandstonePack,
  args: SubCommand[],
  givenCallbackName: string,
  body: Node[],
): ExecuteCommandNode => {
  const node = new ExecuteCommandNode(pack, false, args, {
    isSingleExecute: false,
    givenCallbackName,
    body: [],
  })
  node.body = body
  node.isSingleExecute = true
  return node
}

/**
 * Alternative switch transform used only inside `TestMCFunctionNode` bodies.
 *
 * Unlike `SwitchTransformationVisitor`, this never extracts cases into
 * child MCFunctions and never emits `return` — both break PackTest's
 * per-test result tracking.
 *
 * For each case (static or condition):
 *   1. The condition becomes `execute if <cond>` — a single execute that
 *      MC runs directly.
 *   2. If the case body is one command, it's emitted as
 *      `execute if <cond> run <cmd>` — no flag needed.
 *   3. If the body has multiple commands, the condition result is first
 *      stored into an anonymous flag score, then each body command runs
 *      as `execute if score <flag> matches 1 run <cmd>` — re-using the
 *      same flag across the body avoids re-evaluating the condition per
 *      command and keeps the output flat (no child MCFunction).
 *
 * The default case (if any) runs after every preceding case fails — it's
 * emitted as `execute unless <cond_0> unless <cond_1> … run <body>` for
 * a single-cmd body, or via the flag pattern when the body is multi-cmd.
 */
export class InlineSwitchTransformationVisitor extends GenericSandstoneVisitor {
  visitSwitchNode = (node: SwitchNode): Node | Node[] => {
    if (!node.parentMCFunction?.useInlineTransforms) {
      return node
    }

    const cases = [...node.staticCases, ...node.conditionCases]
    const result: Node[] = []

    cases.forEach((caseNode) => {
      const { positive } = this.getCaseCondition(caseNode, node)
      const visitedBody = caseNode.body.flatMap((n) => {
        const visited = this.visit(n)
        return Array.isArray(visited) ? visited : [visited]
      })

      result.push(...this.emitCase(positive, visitedBody))
    })

    if (node.defaultCase) {
      const visitedBody = node.defaultCase.body.flatMap((n) => {
        const visited = this.visit(n)
        return Array.isArray(visited) ? visited : [visited]
      })
      result.push(...this.emitDefault(node, visitedBody))
    }

    return result
  }

  private getCaseCondition(caseNode: StaticCaseNode | ConditionCaseNode, node: SwitchNode): { positive: string; negated: string } {
    if (caseNode instanceof StaticCaseNode) {
      if (node.value instanceof Score) {
        const positive = `if score ${node.value} matches ${JSON.stringify(caseNode.value)}`
        const negated = `unless score ${node.value} matches ${JSON.stringify(caseNode.value)}`
        return { positive, negated }
      }
      const equals = (node.value as any).equals?.(caseNode.value)
      if (!equals || typeof equals.getValue !== 'function') {
        throw new Error(`InlineSwitchTransformationVisitor: cannot build equality condition for static case`)
      }
      return { positive: equals.getValue(false), negated: equals.getValue(true) }
    }
    const condition = (caseNode as ConditionCaseNode).condition(node.value)
    const conditionNode = conditionToNode(condition)
    if (typeof conditionNode.getValue !== 'function') {
      throw new Error(`InlineSwitchTransformationVisitor: condition node is missing getValue`)
    }
    return { positive: conditionNode.getValue(false), negated: conditionNode.getValue(true) }
  }

  /**
   * Emit a single case's commands. Body of length 1 uses a direct
   * `execute if <cond> run <cmd>`; body of length >1 stores the
   * condition result in a per-case flag and gates each command on
   * `if score <flag> matches 1`.
   */
  private emitCase(cond: string, body: Node[]): Node[] {
    if (body.length === 0) return []

    if (body.length === 1) {
      const exec = flatExecute(this.pack, [[cond]], 'switch_body', body)
      const visited = this.visit(exec)
      return Array.isArray(visited) ? visited : [visited]
    }

    const flag = this.core.pack.Variable(undefined, 'switch_flag')
    const setter = flatExecute(this.pack, [[`store success score ${flag.toString()}`, cond]], 'switch_flag_set', [])
    const setterVisited = this.visit(setter)
    const setterNodes = Array.isArray(setterVisited) ? setterVisited : [setterVisited]

    const bodyExecutes = body.flatMap((cmd) => {
      const exec = flatExecute(this.pack, [[`if score ${flag} matches 1`]], 'switch_body', [cmd])
      const visited = this.visit(exec)
      return Array.isArray(visited) ? visited : [visited]
    })

    return [...setterNodes, ...bodyExecutes]
  }

  /**
   * Emit the default case. Runs only when every preceding case's
   * condition was false. Single-cmd body uses one
   * `unless <cond_0> unless <cond_1> … run <cmd>` chain. Multi-cmd
   * uses a flag (set when the chain of `unless` passes, i.e. every
   * preceding case failed) and gates each command on it.
   */
  private emitDefault(node: SwitchNode, body: Node[]): Node[] {
    if (body.length === 0) return []

    const gateParts: string[] = []
    for (const caseNode of [...node.staticCases, ...node.conditionCases]) {
      gateParts.push(this.getCaseCondition(caseNode, node).negated)
    }

    if (body.length === 1) {
      const exec = flatExecute(this.pack, [[gateParts.join(' ')]], 'switch_default_body', body)
      const visited = this.visit(exec)
      return Array.isArray(visited) ? visited : [visited]
    }

    const flag = this.core.pack.Variable(undefined, 'switch_default_flag')
    const setter = flatExecute(
      this.pack,
      [[`store success score ${flag.toString()}`, ...gateParts]],
      'switch_default_flag_set',
      [],
    )
    const setterVisited = this.visit(setter)
    const setterNodes = Array.isArray(setterVisited) ? setterVisited : [setterVisited]

    const bodyExecutes = body.flatMap((cmd) => {
      const exec = flatExecute(this.pack, [[`if score ${flag} matches 1`]], 'switch_default_body', [cmd])
      const visited = this.visit(exec)
      return Array.isArray(visited) ? visited : [visited]
    })

    return [...setterNodes, ...bodyExecutes]
  }
}