import { ExecuteCommandNode, type SubCommand } from 'sandstone/commands'
import type { MCFunctionNode, Node } from 'sandstone/core'
import { AndNode, ConditionNode, IfNode, NotNode, OrNode } from 'sandstone/flow'
import type { Score } from 'sandstone/variables'
import { TestMCFunctionNode } from 'sandstone/test/mcfunction'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Condition node whose `getValue()` returns `"if score <target> matches 1"`.
 * Used to inline OR/AND-with-side-effects for test mcfunction bodies —
 * the flag-score pattern in the parent body (set by `preNodes` upstream)
 * decides whether the if-body runs.
 */
class ScoreFlagConditionNode extends ConditionNode {
  constructor(
    sandstoneCore: ConditionNode['sandstoneCore'],
    public flag: Score,
  ) {
    super(sandstoneCore)
  }

  getValue = (negated = false) => {
    const keyword = negated ? 'unless' : 'if'
    return `${keyword} score ${this.flag} matches 1`
  }
}

/**
 * Restructure `OrNode` / `AndNode` / `NotNode` chains into inline
 * `execute store success score <flag> if <cond>` lines (one per branch)
 * + `execute if score <flag> matches 1 run <body>` at the IfNode.
 *
 * The flag ends up at 1 if any branch held (OR) or every batch held
 * (AND); in either case the body fires once, semantically equivalent
 * to the existing OrTransformationVisitor's child-mcfunction-with-return
 * approach — but with no helper mcfunction and no `return` command,
 * both of which break PackTest's per-test result tracking.
 *
 * Scoped via `instanceof TestMCFunctionNode` on the IfNode's
 * `parentMCFunction` — non-test mcfunctions fall through to the regular
 * `OrTransformationVisitor`.
 */
export class InlineOrTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    if (!node_.parentMCFunction?.useInlineTransforms) {
      return node_
    }

    const { preNodes, conditionNode } = this.parseConditionNode(node_.condition, node_.parentMCFunction)
    node_.condition = conditionNode
    return [...preNodes, this.genericVisit(node_)]
  }

  private parseConditionNode = (
    node: ConditionNode,
    parentMCFunction: MCFunctionNode | TestMCFunctionNode,
  ): { preNodes: Node[]; conditionNode: ConditionNode } => {
    if (node instanceof OrNode) {
      return this.parseOrNode(node, parentMCFunction)
    }
    if (node instanceof AndNode) {
      return this.parseAndNode(node, parentMCFunction)
    }
    if (node instanceof NotNode) {
      return this.parseNotNode(node, parentMCFunction)
    }

    return { preNodes: [...(node.preNodes ?? [])], conditionNode: node }
  }

  /**
   * Multi-branch OR — collapse to a single flag that any branch can set.
   *
   * Each branch becomes:
   *   execute if score <flag> matches 0 if <branchCond> store success score <flag>
   *
   * The leading `if score <flag> matches 0` short-circuits subsequent
   * branches once one fires: once the flag is 1, no later branch can
   * touch it (and the execute's `store success` would have reset it
   * to 0 on a failing condition, which would silently swallow earlier
   * successes). The trailing `if <branchCond>` gates the actual store
   * on this branch's condition.
   *
   * `execute if score <flag> matches 1 run <body>` is emitted by the
   * IfElseTransformationVisitor via the returned ScoreFlagConditionNode.
   */
  private parseOrNode = (
    node: OrNode,
    parentMCFunction: MCFunctionNode | TestMCFunctionNode,
  ): { preNodes: Node[]; conditionNode: ConditionNode } => {
    if (node.conditions.length === 1) {
      return this.parseConditionNode(node.conditions[0], parentMCFunction)
    }

    const flag = this.core.pack.Variable(undefined, 'or_flag')
    const preNodes: Node[] = []
    const flags: number[] = [] // populated alongside `flag` — indexes align

    // Each branch becomes ONE chained execute (no separate flag setter):
    //   execute
    //     unless score <flag_0> matches 1
    //     unless score <flag_1> matches 1
    //     …
    //     store success score <flag_i>
    //     if <branchCond>
    //
    // The leading `unless … matches 1` chain short-circuits the rest of
    // the modifiers once a previous branch set the flag to 1; without
    // it a failing `<branchCond>` later would reset the flag to 0 via
    // `store success` semantics and silently undo the earlier success.
    // `store success` MUST come BEFORE the `if <cond>` so it captures
    // the success of the subsequent condition.
    for (let i = 0; i < node.conditions.length; i++) {
      const cond = node.conditions[i]
      const inner = this.parseConditionNode(cond, parentMCFunction)
      preNodes.push(...inner.preNodes)

      const condStr = inner.conditionNode.getValue(false)
      const match = condStr.match(/^(if|unless)\s+([\s\S]+)$/)
      if (!match) {
        throw new Error(`InlineOrTransformationVisitor: unexpected OR-branch shape: ${condStr}`)
      }
      flags.push(i)

      const args: SubCommand[] = []
      for (let j = 0; j < i; j++) {
        args.push(['unless', `score ${flag} matches 1`])
      }
      args.push(['store', 'success', 'score', flag.toString()])
      args.push([match[1], match[2]])

      preNodes.push(this.makeChainedExecute(args))
    }

    return { preNodes, conditionNode: new ScoreFlagConditionNode(node.sandstoneCore, flag) }
  }

  /**
   * Build an ExecuteCommandNode from a list of chained SubCommand
   * tuples. Body is empty (no `run`), the node is marked
   * `isSingleExecute: true` so ContainerCommandsToMCFunctionVisitor
   * won't extract it into a child MCFunction.
   */
  private makeChainedExecute = (args: SubCommand[]): ExecuteCommandNode => {
    const exec = new ExecuteCommandNode(this.pack, false, args, {
      isSingleExecute: false,
      givenCallbackName: 'or_branch',
      body: [],
    })
    exec.isSingleExecute = true
    return exec
  }

  /**
   * Multi-branch AND — every condition must hold. MC's flat execute
   * chain natively expresses `if A if B …`, so a single execute with
   * all conditions concatenated is enough when none of the branches
   * carry side-effect commands.
   *
   * If any branch carries `preNodes`, fall back to the flag pattern: a
   * shared tracker flag, every batch sets it to 1 only when its entire
   * chain holds, and a trailing `unless score tracker matches 1` would
   * gate further actions (but for AND-as-condition we want the body to
   * fire when the flag IS 1, so the same flag doubles as the AND gate).
   */
  private parseAndNode = (
    node: AndNode,
    parentMCFunction: MCFunctionNode | TestMCFunctionNode,
  ): { preNodes: Node[]; conditionNode: ConditionNode } => {
    if (node.conditions.length === 1) {
      return this.parseConditionNode(node.conditions[0], parentMCFunction)
    }

    const parsed = node.conditions.map((c) => this.parseConditionNode(c, parentMCFunction))
    const anyHasCommands = parsed.some((p) => p.preNodes.length > 0)

    if (!anyHasCommands) {
      const preNodes: Node[] = []
      const conditionNode = new AndNode(
        node.sandstoneCore,
        parsed.map((p) => {
          preNodes.push(...p.preNodes)
          return p.conditionNode
        }),
      )
      return { preNodes, conditionNode }
    }

    const flag = this.core.pack.Variable(undefined, 'and_flag')
    const preNodes: Node[] = []
    const chainArgs: SubCommand[] = []

    for (const p of parsed) {
      preNodes.push(...p.preNodes)
      const condStr = p.conditionNode.getValue(false)
      const match = condStr.match(/^(if|unless)\s+([\s\S]+)$/)
      if (!match) {
        throw new Error(`InlineOrTransformationVisitor: unexpected AND-branch shape: ${condStr}`)
      }
      chainArgs.push([match[1], match[2]])
    }

    // `store success score <flag> if A if B …` — sets the flag to 1 only
    // when the whole AND holds; otherwise the chain aborts at the failing
    // `if` and the store doesn't run, leaving flag at 0.
    preNodes.push(
      this.makeFlagSetterWithArgs(flag, chainArgs),
    )

    return { preNodes, conditionNode: new ScoreFlagConditionNode(node.sandstoneCore, flag) }
  }

  /**
   * `_.not(_.or(A, B, …))` → De Morgan to `_.and(_.not(A), _.not(B), …)`,
   * matching the non-inline visitor. Otherwise wrap the inner condition
   * with a fresh NotNode so `getValue(negated)` flips the leading keyword.
   */
  private parseNotNode = (
    node: NotNode,
    parentMCFunction: MCFunctionNode | TestMCFunctionNode,
  ): { preNodes: Node[]; conditionNode: ConditionNode } => {
    if (node.condition instanceof OrNode && node.condition.conditions.length >= 2) {
      const orNode = node.condition
      const childConditions: ConditionNode[] = orNode.conditions.map(
        (branch: ConditionNode) => new NotNode(orNode.sandstoneCore, branch),
      )
      return this.parseConditionNode(
        new AndNode(orNode.sandstoneCore, childConditions),
        parentMCFunction,
      )
    }

    const inner = this.parseConditionNode(node.condition, parentMCFunction)
    return {
      preNodes: inner.preNodes,
      conditionNode: new NotNode(node.sandstoneCore, inner.conditionNode),
    }
  }

  /**
   * Build an `execute <args joined by spaces>` with no `run` — the
   * chained modifiers are the entire action. Marked `isSingleExecute: true`
   * so `ContainerCommandsToMCFunctionVisitor` won't extract it into a
   * child MCFunction. Used for AND's whole-chain store.
   */
  private makeFlagSetterWithArgs = (flag: Score, args: SubCommand[]): ExecuteCommandNode => {
    const setter = new ExecuteCommandNode(
      this.pack,
      false,
      [[`store success score ${flag.toString()}`, ...args.flatMap(([kw, body]) => [kw, body])]],
      {
        isSingleExecute: false,
        givenCallbackName: 'flag_setter',
        body: [],
      },
    )
    setter.isSingleExecute = true
    return setter
  }
}