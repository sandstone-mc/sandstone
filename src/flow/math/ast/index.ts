// Barrel for the Math DSL AST.
//
// The AST skeleton is intentionally minimal — base classes, handles,
// let-bindings, leaf/operator/control node types. No user-facing wiring
// to `SandstoneMath` and no compile pass yet. See `SandstoneMath.Math()`
// for the planned entry point.

export { MathNode } from './MathNode'
export { MathContainerNode } from './MathContainerNode'
export { MathExpressionNode, type MathKind } from './MathExpressionNode'
export { MathFunctionNode, type MathFunctionOutputs } from './MathFunctionNode'
export { BindingScope } from './BindingScope'
export {
  floatFromLiteral,
  integerFromLiteral,
  floatFromFloat,
  integerFromInteger,
  floatFromScore,
  integerFromScore,
  floatFromDataPoint,
  integerFromDataPoint,
  float,
  integer,
  handleFromKind,
  Float,
  Integer,
  type Float as FloatType,
  type Integer as IntegerType,
} from './handles'
export { MathFunction, type MathFunction as MathFunctionType } from './MathFunction'

export {
  BinaryOpNode,
  AggregateNode,
  UnaryOpNode,
  ArcSineNode,
  ArcCosineNode,
  type BinaryOp,
  type UnaryOp,
  type AggregateOp,
} from './nodes/operators'

export {
  LiteralNode,
  CopyNode,
  StorageRefNode,
  ScoreboardRefNode,
  RandomNode,
  PickNode,
  EnchantmentLevelNode,
  EnvironmentAttributeNode,
} from './nodes/leaves'

export {
  MathFlowClauseNode,
  MathIfNode,
  MathElseIfNode,
  MathElseNode,
  MathReturnNode,
  MathSwitchNode,
  MathCaseNode,
  MathConditionCaseNode,
  MathDefaultCaseNode,
  MathLoopNode,
} from './nodes/control'

export {
  MathIfStatement,
  MathElseStatement,
  MathIfReturnStatement,
  type MathReturnValue,
} from './MathIfStatement'

export {
  MathSwitchStatement,
  executeMathSwitchTuple,
  type MathSwitchCaseTuple,
} from './MathSwitchStatement'

export { MathConditionNode } from './MathConditionNode'
export { MathConditionContainerNode } from './MathConditionContainerNode'
export {
  ComparisonConditionNode,
  AndConditionNode,
  OrConditionNode,
  NotConditionNode,
  PredicateRefConditionNode,
  McfunctionCheckConditionNode,
  ConstantConditionNode,
  compare,
  andOf,
  orOf,
  notOf,
  type ComparisonOp,
} from './nodes/conditions'