import type { MathNode } from '../ast/MathNode'
import { MathContainerNode } from '../ast/MathContainerNode'
import { MathExpressionNode } from '../ast/MathExpressionNode'
import { MathFunctionNode } from '../ast/MathFunctionNode'
import {
  MathCaseNode,
  MathConditionCaseNode,
  MathDefaultCaseNode,
  MathElseIfNode,
  MathElseNode,
  MathIfNode,
  MathLoopNode,
  MathReturnNode,
  MathSwitchNode,
} from '../ast/nodes/control'
import { AggregateNode, ArcCosineNode, ArcSineNode, BinaryOpNode, UnaryOpNode } from '../ast/nodes/operators'
import {
  AndConditionNode,
  ComparisonConditionNode,
  ConstantConditionNode,
  McfunctionCheckConditionNode,
  NotConditionNode,
  OrConditionNode,
  PredicateRefConditionNode,
} from '../ast/nodes/conditions'
import {
  CopyNode,
  EnchantmentLevelNode,
  EnvironmentAttributeNode,
  LiteralNode,
  PickNode,
  RandomNode,
  ScoreboardRefNode,
  StorageRefNode,
} from '../ast/nodes/leaves'

/**
 * Base class for Math DSL optimizer/feature passes — mirrors
 * Sandstone's `GenericCoreVisitor` (`core/visitors.ts`).
 *
 * Each pass extends this class and overrides specific `visit*` methods
 * to transform the AST. `visit(node)` dispatches by concrete type.
 *
 * **Return convention:** each `visit*` method returns the node that
 * should replace the original in its parent. Pass-through visits return
 * the original; transformations return the new node. The parent's
 * `genericVisit` handles list updates.
 *
 * **Default behavior:** `genericVisit(node)` recurses into the node's
 * `body` array (for containers) and into operand/condition children
 * (for expressions/conditions). Subclasses override specific `visit*`
 * methods to transform particular shapes without disturbing the rest.
 *
 * **Optimizer vs lowering:** this is the optimizer side — passes that
 * analyze, fold, dedup, or otherwise transform the AST. Lowering (emit
 * to provider JSON / mcfunction commands) lives elsewhere.
 *
 * Example subclass:
 * ```ts
 * class ConstantFolder extends MathVisitor {
 *   override visitBinaryOpNode(node: BinaryOpNode): BinaryOpNode {
 *     const folded = node.evaluateAsConstant()
 *     if (folded !== undefined) {
 *       return new LiteralNode(node.sandstoneCore, folded)
 *     }
 *     return super.genericVisit(node)
 *   }
 * }
 * ```
 */
export abstract class MathVisitor {
  /**
   * Entry point — dispatch by concrete node type. Returns the
   * replacement node (same instance for pass-through).
   */
  visit(node: MathNode): MathNode {
    if (MathIfNode.is(node)) return this.visitIfNode(node)
    if (MathElseIfNode.is(node)) return this.visitElseIfNode(node)
    if (MathElseNode.is(node)) return this.visitElseNode(node)
    if (MathReturnNode.is(node)) return this.visitReturnNode(node)
    if (MathSwitchNode.is(node)) return this.visitSwitchNode(node)
    if (MathCaseNode.is(node)) return this.visitCaseNode(node)
    if (MathConditionCaseNode.is(node)) return this.visitConditionCaseNode(node)
    if (MathDefaultCaseNode.is(node)) return this.visitDefaultCaseNode(node)
    if (MathLoopNode.is(node)) return this.visitLoopNode(node)
    if (LiteralNode.is(node)) return this.visitLiteralNode(node)
    if (CopyNode.is(node)) return this.visitCopyNode(node)
    if (StorageRefNode.is(node)) return this.visitStorageRefNode(node)
    if (ScoreboardRefNode.is(node)) return this.visitScoreboardRefNode(node)
    if (RandomNode.is(node)) return this.visitRandomNode(node)
    if (PickNode.is(node)) return this.visitPickNode(node)
    if (EnchantmentLevelNode.is(node)) return this.visitEnchantmentLevelNode(node)
    if (EnvironmentAttributeNode.is(node)) return this.visitEnvironmentAttributeNode(node)
    if (BinaryOpNode.is(node)) return this.visitBinaryOpNode(node)
    if (AggregateNode.is(node)) return this.visitAggregateNode(node)
    if (UnaryOpNode.is(node)) return this.visitUnaryOpNode(node)
    if (ArcSineNode.is(node)) return this.visitArcSineNode(node)
    if (ArcCosineNode.is(node)) return this.visitArcCosineNode(node)
    if (ComparisonConditionNode.is(node)) return this.visitComparisonConditionNode(node)
    if (AndConditionNode.is(node)) return this.visitAndConditionNode(node)
    if (OrConditionNode.is(node)) return this.visitOrConditionNode(node)
    if (NotConditionNode.is(node)) return this.visitNotConditionNode(node)
    if (PredicateRefConditionNode.is(node)) return this.visitPredicateRefConditionNode(node)
    if (McfunctionCheckConditionNode.is(node)) return this.visitMcfunctionCheckConditionNode(node)
    if (ConstantConditionNode.is(node)) return this.visitConstantConditionNode(node)
    if (MathFunctionNode.is(node)) return this.visitMathFunctionNode(node)
    return node
  }

  /**
   * Default recursion into children. Replaces children in-place with
   * the result of `visit(child)` and returns the parent. Override to
   * change traversal order or skip subtrees.
   */
  genericVisit<N extends MathNode>(node: N): N {
    if (MathContainerNode.is(node)) {
      for (let i = 0; i < node.body.length; i++) {
        node.body[i] = this.visit(node.body[i])
      }
      return node
    }
    if (MathExpressionNode.is(node)) {
      // No body to recurse — leaf nodes (LiteralNode, StorageRefNode,
      // ScoreboardRefNode, ArcSineNode, etc.) return as-is. Operator
      // nodes recurse into operands via their own visit* override.
      return node
    }
    return node
  }

  // -------------------------------------------------------------------------
  // Control flow nodes — subclasses typically override these.
  // -------------------------------------------------------------------------

  visitIfNode(node: MathIfNode): MathNode {
    return this.genericVisit(node)
  }
  visitElseIfNode(node: MathElseIfNode): MathNode {
    return this.genericVisit(node)
  }
  visitElseNode(node: MathElseNode): MathNode {
    return this.genericVisit(node)
  }
  visitReturnNode(node: MathReturnNode): MathNode {
    return node
  }
  visitSwitchNode(node: MathSwitchNode): MathNode {
    return this.genericVisit(node)
  }
  visitCaseNode(node: MathCaseNode): MathNode {
    return this.genericVisit(node)
  }
  visitConditionCaseNode(node: MathConditionCaseNode): MathNode {
    return this.genericVisit(node)
  }
  visitDefaultCaseNode(node: MathDefaultCaseNode): MathNode {
    return this.genericVisit(node)
  }
  visitLoopNode(node: MathLoopNode): MathNode {
    return this.genericVisit(node)
  }
  visitMathFunctionNode(node: MathFunctionNode): MathNode {
    return this.genericVisit(node)
  }

  // -------------------------------------------------------------------------
  // Expression nodes — operator nodes recurse into operands.
  // -------------------------------------------------------------------------

  visitLiteralNode(_node: LiteralNode): MathNode {
    return _node
  }
  visitCopyNode(node: CopyNode): MathNode {
    const oldSource = node.source
    const newSource = this.visit(oldSource)
    if (newSource === oldSource) return node
    void newSource
    // CopyNode.source is readonly — caller must allocate a new CopyNode
    // if a real replacement is needed. Default pass-through.
    return node
  }
  visitStorageRefNode(node: StorageRefNode): MathNode {
    void node
    return node
  }
  visitScoreboardRefNode(node: ScoreboardRefNode): MathNode {
    void node
    return node
  }
  visitRandomNode(node: RandomNode): MathNode {
    void node
    return node
  }
  visitPickNode(node: PickNode): MathNode {
    void node
    return node
  }
  visitEnchantmentLevelNode(node: EnchantmentLevelNode): MathNode {
    void node
    return node
  }
  visitEnvironmentAttributeNode(node: EnvironmentAttributeNode): MathNode {
    void node
    return node
  }
  visitBinaryOpNode(node: BinaryOpNode): MathNode {
    const oldL = node.operands[0]
    const oldR = node.operands[1]
    const newL = this.visit(oldL) as MathExpressionNode
    const newR = this.visit(oldR) as MathExpressionNode
    if (newL === oldL && newR === oldR) return node
    return new BinaryOpNode(
      node.sandstoneCore,
      node.op,
      [newL, newR],
      node.kind,
    )
  }
  visitAggregateNode(node: AggregateNode): MathNode {
    const oldInputs = node.inputs
    const newInputs = oldInputs.map((i) => this.visit(i) as MathExpressionNode)
    if (newInputs.every((n, i) => n === oldInputs[i])) return node
    return new AggregateNode(node.sandstoneCore, node.op, newInputs, node.kind)
  }
  visitUnaryOpNode(node: UnaryOpNode): MathNode {
    const oldOperand = node.operand
    const newOperand = this.visit(oldOperand) as MathExpressionNode
    if (newOperand === oldOperand) return node
    return new UnaryOpNode(node.sandstoneCore, node.op, newOperand)
  }
  visitArcSineNode(node: ArcSineNode): MathNode {
    void node
    return node
  }
  visitArcCosineNode(node: ArcCosineNode): MathNode {
    void node
    return node
  }

  // -------------------------------------------------------------------------
  // Condition nodes — combinators recurse into children.
  // -------------------------------------------------------------------------

  visitComparisonConditionNode(_node: ComparisonConditionNode): MathNode {
    return _node
  }
  visitAndConditionNode(node: AndConditionNode): MathNode {
    void node
    return node
  }
  visitOrConditionNode(node: OrConditionNode): MathNode {
    void node
    return node
  }
  visitNotConditionNode(node: NotConditionNode): MathNode {
    void node
    return node
  }
  visitPredicateRefConditionNode(node: PredicateRefConditionNode): MathNode {
    void node
    return node
  }
  visitMcfunctionCheckConditionNode(node: McfunctionCheckConditionNode): MathNode {
    void node
    return node
  }
  visitConstantConditionNode(node: ConstantConditionNode): MathNode {
    void node
    return node
  }
}