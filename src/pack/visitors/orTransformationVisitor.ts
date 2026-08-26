import { ExecuteCommandNode, type SubCommand, ReturnCommandNode, ScoreboardCommandNode } from '../../commands'
import { MCFunctionClass, type MCFunctionNode, type Node, type SandstoneCore } from '../../core'
import type { Score } from '../../variables'
import { AndNode, ConditionNode, IfNode, NotNode, OrNode } from '../../flow'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Condition node whose `getValue()` returns `"if function <name>"`.
 * Used to make an IfNode's existing `IfElseTransformationVisitor` emit
 * `execute if function <child> run <body>`, which succeeds exactly when the
 * child MCFunction returns a positive value (e.g. via an early `return 1`).
 */
class FunctionReturnConditionNode extends ConditionNode {
  constructor(
    public sandstoneCore: SandstoneCore,
    public functionName: string,
  ) {
    super(sandstoneCore)
  }

  getValue = () => `if function ${this.functionName}`
}

export class OrTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    const { preNodes, conditionNode } = this.parseConditionNode(node_.condition, node_.parentMCFunction)
    node_.condition = conditionNode
    return [...preNodes, this.genericVisit(node_)]
  }

  parseConditionNode = (node: ConditionNode, parentMCFunction?: MCFunctionNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    if (node instanceof OrNode) {
      return this.parseOrNode(node, parentMCFunction)
    }
    if (node instanceof AndNode) {
      return this.parseAndNode(node, parentMCFunction)
    }
    if (node instanceof NotNode) {
      return this.parseNotNode(node, parentMCFunction)
    }

    // `preNodes` is optional on ConditionNode. Side-effecting conditions (those that
    // commit commands at construction, e.g. `data.equals`, `Label.equals`, any
    // `CommandCondition`) populate it; pure predicates leave it unset.
    return { preNodes: [...(node.preNodes ?? [])], conditionNode: node }
  }

  parseOrNode = (node: OrNode, parentMCFunction?: MCFunctionNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    // Single branch: collapse through so the IfNode behaves as if it had the inner condition.
    if (node.conditions.length === 1) {
      return this.parseConditionNode(node.conditions[0], parentMCFunction)
    }

    // Multiple branches: extract to a child MCFunction with execute-if-return-1 short-circuit.
    // Inside the child: `execute if <c1> run return 1`, `execute if <c2> run return 1`, ..., `return 0`.
    // The first matching branch returns 1 and exits the function immediately; the rest are skipped.
    // The caller uses `execute if function <child>` to test whether any branch matched.
    const parentName = parentMCFunction?.resource.name ?? '__sandstone'
    const orMCFunction = new MCFunctionClass(
      this.core,
      `${parentName}/or_check`,
      {
        addToSandstoneCore: true,
        creator: 'sandstone',
        onConflict: 'rename',
      },
    )

    // Register the parent/child relationship so `AwaitBodyVisitor`'s
    // `collectTransientHelpers` can iterate a single MCFunction's
    // children in O(n) instead of scanning `core.resourceNodes` (O(n²)).
    // `or_check` was created directly here rather than via
    // `ContainerCommandsToMCFunctionVisitor.createMCFunction`, so it
    // bypasses that visitor's child registration.
    if (parentMCFunction) {
      parentMCFunction.transientChildMCFunctions.add(orMCFunction.node)
    }

    this.core.enterMCFunction(orMCFunction)

    try {
      for (const condition of node.conditions) {
        this.pushCheckBranch(orMCFunction.node, this.parseConditionNode(condition, orMCFunction.node), false, new ReturnCommandNode(this.pack, [1]))
      }

      // Default return: no branch matched.
      orMCFunction.node.body.push(new ReturnCommandNode(this.pack, [0]))
    } finally {
      this.core.exitMCFunction()
    }

    return {
      preNodes: [],
      conditionNode: new FunctionReturnConditionNode(this.core, orMCFunction.name),
    }
  }

  parseAndNode = (node: AndNode, parentMCFunction?: MCFunctionNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    // Single branch: collapse through so the IfNode behaves as if it had the inner condition.
    if (node.conditions.length === 1) {
      return this.parseConditionNode(node.conditions[0], parentMCFunction)
    }

    // Parse every condition to learn whether it carries commands (preNodes) that must run
    // before the predicate is evaluated. Pure-predicate conditions chain cleanly inside a
    // single execute — those are batched. Command-needing conditions force the AND into a
    // child MCFunction so commands can run inline before their check.
    const parsed = node.conditions.map((condition) => this.parseConditionNode(condition, parentMCFunction))
    const anyHasCommands = parsed.some((p) => (p.preNodes ?? []).length > 0)

    if (!anyHasCommands) {
      // Inline: pure conditions chain via the existing AndNode behavior. Order is preserved
      // by `Array.prototype.map`. No child function needed.
      const finalPreNodes: Node[] = []
      const conditionNode = new AndNode(
        node.sandstoneCore,
        parsed.map((p) => {
          finalPreNodes.push(...p.preNodes)
          return p.conditionNode
        }),
      )
      return { preNodes: finalPreNodes, conditionNode }
    }

    // At least one condition needs to run commands. Extract to a child MCFunction:
    //   - Pure-predicate runs are batched into `execute <pos-c1> <pos-c2> ... run return 1`
    //     (positive form, NOT flipped — chain fires `return 1` only when the whole batch
    //     holds; otherwise we fall through to the next check).
    //   - Command-needing conditions emit their stashed side-effects inline, then a flipped
    //     `execute if <failure-form> run return 0` so the function returns 0 as soon as a
    //     side-effecting check fails to hold.
    //   - Default `return 0` reaches the end only when no command-needing check failed and
    //     no pure batch all-held; the function returns 1 only via a pure-batch success path,
    //     signalled to the caller by `execute if function <and>`.
    const parentName = parentMCFunction?.resource.name ?? '__sandstone'
    const andMCFunction = new MCFunctionClass(
      this.core,
      `${parentName}/and_check`,
      {
        addToSandstoneCore: true,
        creator: 'sandstone',
        onConflict: 'rename',
      },
    )

    // See `or_check` above — register parent/child for the
    // `AwaitBodyVisitor`'s `collectTransientHelpers`.
    if (parentMCFunction) {
      parentMCFunction.transientChildMCFunctions.add(andMCFunction.node)
    }

    this.core.enterMCFunction(andMCFunction)

    try {
      let batch: { preNodes: Node[][]; conditionNodes: ConditionNode[] } = { preNodes: [], conditionNodes: [] }

      const flushBatch = () => {
        if (batch.conditionNodes.length === 0 && batch.preNodes.every((pn) => pn.length === 0)) {
          batch = { preNodes: [], conditionNodes: [] }
          return
        }
        // Per-batch tracker-var pattern: reset the tracker, run the chained execute to set
        // the tracker to 1 only when the entire batch holds, then check the tracker and
        // `return 0` if any condition failed (var != 1). Each batch uses its own tracker var
        // so concurrent/sequential batches stay independent.
        const tracker = this.core.pack.Variable(undefined, 'and_batch')
        this.pushBatchedCheckBranch(
          andMCFunction.node,
          batch.preNodes.flat(),
          batch.conditionNodes,
          tracker,
        )
        batch = { preNodes: [], conditionNodes: [] }
      }

      for (const p of parsed) {
        if (p.preNodes.length === 0) {
          // Pure predicate: extend the current batch (still in declared order).
          batch.preNodes.push(p.preNodes)
          batch.conditionNodes.push(p.conditionNode)
        } else {
          // Command-needing condition: flush any pending batch first (preserving order),
          // then emit this condition's commands followed by its own fail-fast check.
          flushBatch()
          this.pushFailFastBranch(
            andMCFunction.node,
            p,
            new ReturnCommandNode(this.pack, [0]),
          )
        }
      }
      flushBatch()

      // Default return: every check ran without success.
      andMCFunction.node.body.push(new ReturnCommandNode(this.pack, [1]))
    } finally {
      this.core.exitMCFunction()
    }

    return {
      preNodes: [],
      conditionNode: new FunctionReturnConditionNode(this.core, andMCFunction.name),
    }
  }

  /**
   * Pushes a batched check into `targetMCFunction.body` using the tracker-var pattern:
   *   <preNodes...>
   *   scoreboard players reset <tracker>
   *   execute <if|unless> <c1> <if|unless> <c2> ... run scoreboard players set <tracker> 1
   *   execute unless score <tracker> matches 1 run return 0
   *
   * Consecutive pure-predicate conditions from the AND list coalesce into a single chained
   * execute that sets the tracker to 1 only when the entire batch holds. The trailing
   * fail-check returns 0 from the child MCFunction when any condition failed (var != 1).
   * Using a tracker var avoids the "execute-chain only fires on ALL-pass" limitation of
   * pure MC chains while keeping the body tight.
   */
  private pushBatchedCheckBranch = (
    targetMCFunction: MCFunctionNode,
    preNodes: Node[],
    conditionNodes: ConditionNode[],
    tracker: Score,
  ) => {
    for (const n of preNodes) {
      targetMCFunction.body.push(n)
    }

    targetMCFunction.body.push(new ScoreboardCommandNode(this.pack, 'players', 'reset', tracker))

    const args: SubCommand[] = []
    for (const c of conditionNodes) {
      const condStr = c.getValue(false)
      const match = condStr.match(/^(if|unless)\s+([\s\S]+)$/)
      if (!match) {
        throw new Error(`OrTransformationVisitor: unexpected condition getValue() shape: ${condStr}`)
      }
      const [, keyword, condBody] = match
      args.push([keyword, condBody])
    }

    if (args.length === 0) {
      // No conditions but preNodes ran — push an unconditional set so the trailing check
      // doesn't fire on a stale tracker.
      targetMCFunction.body.push(new ScoreboardCommandNode(this.pack, 'players', 'set', tracker, 1))
    } else {
      const executeNode = new ExecuteCommandNode(this.pack, false, args, {
        isSingleExecute: true,
        body: [],
      })
      targetMCFunction.enterContext(executeNode, false)
      executeNode.body = [new ScoreboardCommandNode(this.pack, 'players', 'set', tracker, 1)]
      targetMCFunction.body.push(executeNode)
      targetMCFunction.exitContext()
    }

    const failCheckNode = new ExecuteCommandNode(
      this.pack,
      false,
      [['unless', `score ${tracker} matches 1`]],
      {
        isSingleExecute: true,
        body: [],
      },
    )
    targetMCFunction.enterContext(failCheckNode, false)
    failCheckNode.body = [new ReturnCommandNode(this.pack, [0])]
    targetMCFunction.body.push(failCheckNode)
    targetMCFunction.exitContext()
  }

  /**
   * Pushes a single check branch into `targetMCFunction.body`:
   *   <preNodes...> (side-effect commands that must run before checking)
   *   execute <if|unless> <condBody> run <bodyNode>
   *
   * When `negated` is false, the helper uses the condition's positive form
   * (`getValue(false)`); when true, it uses the failure form (`getValue(true)`).
   * For OR semantics: pass `negated=false` with `bodyNode = return 1` (exit on first match).
   */
  private pushCheckBranch = (
    targetMCFunction: MCFunctionNode,
    parsed: { preNodes: Node[]; conditionNode: ConditionNode },
    negated: boolean,
    bodyNode: Node,
  ) => {
    // Any nested preNodes (e.g. nested or/and reset+score commands, or the inner
    // condition's side-effect commands) run inside the child function body in order.
    for (const n of parsed.preNodes) {
      targetMCFunction.body.push(n)
    }

    // Extract the chain keyword ("if" or "unless") and the condition body from `getValue()`.
    // SingleConditionNode returns "if <body>"; NotNode-wrapped conditions return "unless <body>".
    // AndNode already produces execute-chain strings; a nested FunctionReturnConditionNode
    // returns "if function <name>" which fits the same shape.
    const condStr = parsed.conditionNode.getValue(negated)
    const match = condStr.match(/^(if|unless)\s+([\s\S]+)$/)
    if (!match) {
      throw new Error(`OrTransformationVisitor: unexpected condition getValue() shape: ${condStr}`)
    }
    const [, keyword, condBody] = match

    // Construct ExecuteCommandNode for `execute <keyword> <condBody> run <bodyNode>`.
    // The constructor's append() calls exitContext, so we first push an empty executeNode
    // into the MCFunction context stack (addNode=false) so the exit succeeds.
    const executeNode = new ExecuteCommandNode(this.pack, false, [[keyword, condBody]], {
      isSingleExecute: true,
      body: [],
    })
    targetMCFunction.enterContext(executeNode, false)
    executeNode.body = [bodyNode]
    targetMCFunction.body.push(executeNode)
    targetMCFunction.exitContext()
  }

  /**
   * Pushes a fail-fast check for an AND command-needing condition into `targetMCFunction.body`:
   *   <preNodes...>
   *   execute <if|unless> <condBody> run <bodyNode>
   *
   * Uses the condition's FAILURE form (`getValue(true)`) and flips the leading
   * `if`/`unless` keyword so the execute fires when the condition fails to hold. The
   * `bodyNode` (typically `return 0`) exits the child MCFunction immediately. When the
   * condition holds, the chain doesn't fire and we fall through to the next check.
   */
  private pushFailFastBranch = (
    targetMCFunction: MCFunctionNode,
    parsed: { preNodes: Node[]; conditionNode: ConditionNode },
    bodyNode: Node,
  ) => {
    for (const n of parsed.preNodes) {
      targetMCFunction.body.push(n)
    }

    const condStr = parsed.conditionNode.getValue(true)
    const match = condStr.match(/^(if|unless)\s+([\s\S]+)$/)
    if (!match) {
      throw new Error(`OrTransformationVisitor: unexpected condition getValue() shape: ${condStr}`)
    }
    // Flip the leading keyword so the execute fires on failure rather than success.
    const flippedKeyword = match[1] === 'if' ? 'unless' : 'if'
    const condBody = match[2]

    const executeNode = new ExecuteCommandNode(this.pack, false, [[flippedKeyword, condBody]], {
      isSingleExecute: true,
      body: [],
    })
    targetMCFunction.enterContext(executeNode, false)
    executeNode.body = [bodyNode]
    targetMCFunction.body.push(executeNode)
    targetMCFunction.exitContext()
  }

  parseNotNode = (node: NotNode, parentMCFunction?: MCFunctionNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    const { preNodes, conditionNode } = this.parseConditionNode(node.condition, parentMCFunction)
    return {
      preNodes,
      conditionNode: new NotNode(node.sandstoneCore, conditionNode),
    }
  }
}
