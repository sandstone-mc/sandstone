/* eslint-disable no-spaced-func */
/* eslint-disable func-call-spacing */
import type { Node, SandstoneCore } from 'sandstone/core'
import { MCFunctionClass } from 'sandstone/core'
import {
  ExecuteCommandNode,
  FunctionCommandNode,
  ReturnCommandNode,
  ReturnRunCommandNode,
  ScoreboardCommandNode,
} from 'sandstone/commands'
import type { SubCommand } from 'sandstone/commands'
import { AndNode, IfNode, NotNode } from 'sandstone/flow'
import { ElseNode } from 'sandstone/flow'
import type { DataPointClass, Score } from 'sandstone/variables'
import type { SandstonePack } from 'sandstone/pack'
import { GenericSandstoneVisitor } from './visitor'

function* flattenIfNode(node: IfNode): IterableIterator<IfNode | ElseNode> {
  yield node

  const next = node.nextFlowNode

  if (next instanceof IfNode) {
    yield* flattenIfNode(next)
  } else if (next) {
    yield next
  }
}

/**
 * Walk an `elseIf/else` chain starting AFTER the root node (excludes the root).
 * Yields each chain node in order.
 */
function* flattenChainOnly(start: IfNode | ElseNode | undefined): IterableIterator<IfNode | ElseNode> {
  let cursor: IfNode | ElseNode | undefined = start
  while (cursor) {
    yield cursor
    if (cursor instanceof IfNode) {
      cursor = cursor.nextFlowNode
    } else {
      break
    }
  }
}

function handleMultipleNodes(visitor: GenericSandstoneVisitor, nodes: (ElseNode | IfNode)[], macroStorage: DataPointClass | undefined) {
  return nodes.flatMap((node, i) => {
    // If we have a "If" node, add the condition
    if (node instanceof IfNode) {
      // Negate-AND inside the chain (root case is handled separately by
      // `visitIfNode` via `emitInlineNegateAnd`).
      //   - If this is the LAST elseIf before a plain else (no further elseIfs
      //     after), swap roles with the else node: new condition = positive
      //     AND with the ORIGINAL else body; new else = original elseIf body.
      //     The existing chain handler then emits the correct form without
      //     a flag score. This is more efficient when the chain has many
      //     negate-ANDs (only the last one needs the swap).
      //   - Otherwise (further elseIfs follow), emit inline flag-score commands.
      const negatedAnd = extractNegatedAnd(node.condition)
      if (negatedAnd) {
        const nextNode = nodes[i + 1]
        if (nextNode instanceof ElseNode) {
          // Swap: elseIf.condition = positive AND, elseIf.body = original else body;
          // else.body = original elseIf body.
          const originalElseIfBody = node.body.slice()
          const originalElseBody = nextNode.body.slice()
          node.condition = negatedAnd
          node.body = originalElseBody
          nextNode.body = originalElseIfBody
          // Fall through to normal chain handling with the swapped nodes.
        } else {
          const flag = visitor.core.pack.Variable(undefined, 'not_and_flag')
          const visitedBody: Node[] = node.body.flatMap((n) => {
            const visited = visitor.visit(n)
            return Array.isArray(visited) ? visited : [visited]
          })
          const parentMCFunction = (node as any).parentMCFunction ?? visitor.core.currentMCFunction
          return buildFlagScoreRestructure(visitor.pack, visitor.core, negatedAnd, visitedBody, flag, parentMCFunction)
        }
      }

      // Note: `_.not(_.or(...))` inside the chain is handled by the
      // OrTransformationVisitor via its `parseNotNode` path — see `visitIfNode`
      // for the full explanation.

      const { body } = node
      const callbackName = i === 0 ? 'if' : 'elseif'

      let actualBody = body

      if (body.length === 1) {
        const child = visitor.visit(body[0])

        if (Array.isArray(child)) {
          actualBody = child
        } else {
          return visitor.visit(new ExecuteCommandNode(visitor.pack, false, [[node.condition.getValue()]], {
            isSingleExecute: false,
            givenCallbackName: callbackName,
            body: [i === (nodes.length - 1) ? child : new ReturnRunCommandNode(visitor.pack, false, ['run'], {
              isSingleExecute: false,
              isFlowControl: true,
              body: [child],
            })],
            macroStorage,
          }))
        }
      }

      return visitor.visit(new ExecuteCommandNode(visitor.pack, false, [[node.condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: `${i}_${callbackName}`,
        body: [
          new ReturnRunCommandNode(visitor.pack, false, ['run'], {
            isSingleExecute: false,
            isFlowControl: true,
            body: actualBody,
          }),
        ],
        macroStorage,
      }))
    }
    // Else node, visit and add the body
    return node.body.flatMap((n) => visitor.visit(n))
  })
}

/**
 * Detects `_.not(_.and(A, B, ...))` — the only negation pattern MC can express
 * without `or`. Returns the inner `AndNode` so the visitor can restructure it
 * into a positive-AND flag-score chain. Returns null for any other shape.
 */
function extractNegatedAnd(condition: Node): AndNode | null {
  if (
    condition instanceof NotNode &&
    condition.condition instanceof AndNode &&
    condition.condition.conditions.length >= 2
  ) {
    return condition.condition
  }
  return null
}

/**
 * Build `execute if A if B ... run <bodyNode>` — the positive-AND chain that
 * sets the flag (when `bodyNode` is `scoreboard players set <flag> 1`) or
 * short-circuits (when `bodyNode` is `return 0`).
 */
function buildAndChainExecute(
  pack: SandstonePack,
  andNode: AndNode,
  bodyNode: Node,
  parentMCFunction: IfNode['parentMCFunction'],
): ExecuteCommandNode {
  const args: SubCommand[] = andNode.conditions.map((branch) => {
    const condStr = branch.getValue(false)
    const match = condStr.match(/^(if|unless)\s+([\s\S]+)$/)
    if (!match) {
      throw new Error(`IfElseTransformationVisitor: unexpected condition getValue() shape for negated-AND branch: ${condStr}`)
    }
    return [match[1], match[2]]
  })

  const executeNode = new ExecuteCommandNode(pack, false, args, {
    isSingleExecute: true,
  })
  // Visitors run outside the MCFunction context stack; use parentMCFunction.
  parentMCFunction.enterContext(executeNode, false)
  executeNode.body = [bodyNode]
  parentMCFunction.exitContext()
  return executeNode
}

/**
 * Emit the flag-score restructure:
 *   scoreboard players set <flag> 0
 *   execute if A if B ... run scoreboard players set <flag> 1
 *   execute if score <flag> matches 0 run return run <body>
 *
 * If `body` is multi-command, extract to a child mcfunction and use
 * `return run function <child>`. Single-command bodies inline directly.
 */
function buildFlagScoreRestructure(
  pack: SandstonePack,
  core: SandstoneCore,
  andNode: AndNode,
  body: Node[],
  flag: Score,
  parentMCFunction: IfNode['parentMCFunction'],
): Node[] {
  const nodes: Node[] = []

  nodes.push(new ScoreboardCommandNode(pack, 'players', 'set', flag, 0))
  nodes.push(
    buildAndChainExecute(
      pack,
      andNode,
      new ScoreboardCommandNode(pack, 'players', 'set', flag, 1),
      parentMCFunction,
    ),
  )

  // Gate: `execute if score <flag> matches 0 run return run <body>`
  const gate = new ExecuteCommandNode(
    pack,
    false,
    [['if', `score ${flag} matches 0`]],
    { isSingleExecute: true },
  )
  parentMCFunction.enterContext(gate, false)

  // ReturnRunCommandNode with body=[<single node>] (manually assigned to
  // avoid the constructor's append → exitContext firing during visitor time).
  const returnRun = new ReturnRunCommandNode(pack, false, ['run'], {
    isSingleExecute: true,
  })
  if (body.length === 1) {
    returnRun.body = body
  } else {
    // Multi-command: extract body to a child mcfunction and call it.
    const baseName = parentMCFunction.resource.name
    const thenFnName = `${baseName}/__not_and_then`
    const thenFn = new MCFunctionClass(core, thenFnName, {
      addToSandstoneCore: true,
      creator: 'sandstone',
      onConflict: 'rename',
    })
    parentMCFunction.transientChildMCFunctions.add(thenFn.node)
    core.enterMCFunction(thenFn)
    try {
      for (const n of body) thenFn.node.body.push(n)
    } finally {
      core.exitMCFunction()
    }
    returnRun.body = [new FunctionCommandNode(pack, thenFn)]
  }
  gate.body = [returnRun]
  parentMCFunction.exitContext()

  nodes.push(gate)
  return nodes
}

export class IfElseTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    // 1. We may be an elseIf node, if so, should exit
    if (node_._isElseIf) {
      return []
    }

    // Restructure `_.not(_.and(...))` (root IfNode).
    //
    // Three layouts depending on context:
    //   - `if -> else` (plain else, no elseIf):
    //       Swap roles: new condition = positive AND with the ORIGINAL else body;
    //       new else = original then body. Existing chain handler emits the
    //       correct `execute if A if B run return run <else>` + `<then>`.
    //   - Standalone negate-AND (no chain, tail of host):
    //       Simple inline `execute if A if B run return 0` + then body.
    //   - Negate-AND with elseIf/else chain OR mid-host:
    //       Flag-score restructure inlined into the host: each negate-AND
    //       (root + each elseIf) gets its own flag variable, set when the
    //       positive AND holds, gated to fire `return run <then>` when the
    //       negate-AND would have been true. This keeps every chain arm
    //       REACHABLE in MC's flat-execute model.
    const negatedAnd = extractNegatedAnd(node_.condition)
    if (negatedAnd) {
      if (node_.nextFlowNode instanceof ElseNode) {
        const originalElseNode = node_.nextFlowNode
        const originalThenBody = node_.body.slice()
        const originalElseBody = originalElseNode.body.slice()

        // Mutate in place: the IfNode now has the positive AND condition and
        // the original else body; the ElseNode now has the original then body.
        node_.condition = negatedAnd
        node_.body = originalElseBody
        originalElseNode.body = originalThenBody
        // Fall through to the existing visitor logic, which now sees a normal
        // `_.if(_.and(...), X).else(Y)` chain.
      } else {
        // Standalone OR has an elseIf chain: inline flag-score (or simple
        // prefix for tail-of-host no-chain case).
        return this.emitInlineNegateAnd(node_, negatedAnd)
      }
    }

    // Note: `_.not(_.or(...))` is handled by the OrTransformationVisitor via
    // its `parseNotNode` path — the visitor wraps the OR result sentinel in a
    // NotNode, and `FunctionReturnConditionNode.getValue(negated)` emits
    // `unless function <or_check>` (or `if function ...` for the positive
    // case). This naturally produces `!(A || B)` semantics via the
    // `function return-value` pattern, so no further handling is needed here.

    // Start by flattening all nodes
    const nodes = Array.from(flattenIfNode(node_))

    const { parentMCFunction, condition, givenCallbackName, body } = node_

    // Use givenCallbackName if set (e.g., 'loop'), otherwise default to 'if'
    const callbackName = givenCallbackName ?? 'if'

    const macroStorage = parentMCFunction.resource.macroPoint

    // 2. If we have a single if node. No need to store its result then.
    if (nodes.length === 1) {
      const executeNode = new ExecuteCommandNode(this.pack, false, [[condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: callbackName,
        body,
        macroStorage,
      })
      // Store reference for LoopArgument resolution
      node_.resultingExecuteNode = executeNode
      return this.visit(executeNode)
    }

    // 3. We have multiple nodes, if there isn't any tail nodes in the parent, we can use `return` safely without entering a new function

    if (nodes.at(-1) === parentMCFunction.body.at(-1)) {
      return handleMultipleNodes(this, nodes, macroStorage)
    }

    // 4. We have multiple nodes & there's tail nodes in the parent, entering a new function to allow for `return`

    const wrapper = new ExecuteCommandNode(this.pack, false, [], {
      isFake: true, // trolley
      isSingleExecute: false,
      givenCallbackName: callbackName,
      body: handleMultipleNodes(this, nodes, macroStorage),
      macroStorage: macroStorage,
    })
    // Store reference for LoopArgument resolution
    node_.resultingExecuteNode = wrapper
    return this.visit(wrapper)
  }

  /**
   * Inline restructure for a root `_.if(_.not(_.and(...)), then)`.
   * Emits commands directly into the host MCFunction body — no wrapping child
   * mcfunction needed.
   */
  private emitInlineNegateAnd = (ifNode: IfNode, andNode: AndNode): Node[] => {
    const isTail = ifNode.parentMCFunction.body[ifNode.parentMCFunction.body.length - 1] === ifNode
    const hasChain = ifNode.nextFlowNode !== undefined

    const visitedBody: Node[] = ifNode.body.flatMap((n) => {
      const visited = this.visit(n)
      return Array.isArray(visited) ? visited : [visited]
    })

    // Tail of host + no elseIf/else chain: simple prefix + body inline.
    // No flag needed since there's nothing after to keep reachable.
    if (isTail && !hasChain) {
      const prefix = buildAndChainExecute(
        this.pack,
        andNode,
        new ReturnCommandNode(this.pack, [0]),
        ifNode.parentMCFunction,
      )
      return [prefix, ...visitedBody]
    }

    // Mid-host (with or without chain): flag-score restructure. The flag is
    // set when the positive AND holds (= negate-AND false), and the gate
    // fires `return run <then>` when the flag is 0 (= negate-AND true). The
    // gate lives in the host so `return run` propagates and exits the host.
    // Each elseIf that itself has a negate-AND gets its own flag-score
    // inline via `handleMultipleNodes`.
    const flag = this.core.pack.Variable(undefined, 'not_and_flag')
    const gateNodes = buildFlagScoreRestructure(this.pack, this.core, andNode, visitedBody, flag, ifNode.parentMCFunction)

    if (!hasChain) return gateNodes

    const chainNodes = handleMultipleNodes(
      this,
      Array.from(flattenChainOnly(ifNode.nextFlowNode)),
      undefined,
    )
    return [...gateNodes, ...chainNodes]
  }
}
