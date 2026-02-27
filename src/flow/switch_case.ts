import type { NBTObject } from 'sandstone/arguments'
import type { DataPointPickClass, MCFunctionNode, SandstoneCore } from 'sandstone/core'
import { ContainerNode } from 'sandstone/core'
import type { DataPointClass } from 'sandstone/variables'
import { Score } from 'sandstone/variables'
import type { Condition } from './Flow'

/** A condition callback that receives the switch value and returns a condition */
export type ConditionCallback<ValueType> = (value: ValueType) => Condition

/** Widen literal types to their base types for better inference */
type Widen<T> = T extends number ? number : T

/** Static value case */
type StaticCaseEntry<CheckType> = { type: 'static'; value: Widen<CheckType>; callback: () => any }

/** Condition callback case */
type ConditionCaseEntry<ValueType> = { type: 'condition'; condition: ConditionCallback<ValueType>; callback: () => any }

/** Either a static or condition case entry */
type CaseEntry<ValueType, CheckType> = StaticCaseEntry<CheckType> | ConditionCaseEntry<ValueType>

/** Static value case tuple */
export type StaticCase<CheckType> = readonly ['case', Widen<CheckType>, () => any]

/** Condition callback case tuple */
export type ConditionCase<ValueType> = readonly ['case', ConditionCallback<ValueType>, () => any]

/** Either a static or condition case */
export type SwitchCase<ValueType, CheckType> = StaticCase<CheckType> | ConditionCase<ValueType>

export type DefaultType<ValueType extends number | NBTObject, SwitchValueType = unknown> = {
  entries: CaseEntry<SwitchValueType, ValueType>[]
  default: () => any
}

export class CaseStatement<ValueType extends number | NBTObject, SwitchValueType = unknown> {
  constructor(
    readonly entries: CaseEntry<SwitchValueType, ValueType>[] = [],
  ) {}

  /** @internal */
  getStaticCases(): StaticCaseEntry<ValueType>[] {
    return this.entries.filter((e): e is StaticCaseEntry<ValueType> => e.type === 'static')
  }

  /** @internal */
  getConditionCases(): ConditionCaseEntry<SwitchValueType>[] {
    return this.entries.filter((e): e is ConditionCaseEntry<SwitchValueType> => e.type === 'condition')
  }

  /** Add a static value case */
  case(value: ValueType, callback: () => any): CaseStatement<ValueType, SwitchValueType>

  /** Add a condition case - checked after static cases fail. Use generic to specify switch value type on first condition: `.case<Score>(v => ...)` */
  case<T = SwitchValueType>(condition: ConditionCallback<T>, callback: () => any): CaseStatement<ValueType, T>

  case<T = SwitchValueType>(
    valueOrCondition: ValueType | ConditionCallback<T>,
    callback: () => any,
  ) {
    if (typeof valueOrCondition === 'function') {
      return new CaseStatement<ValueType, T>([
        ...this.entries as CaseEntry<T, ValueType>[],
        { type: 'condition', condition: valueOrCondition, callback },
      ])
    }
    return new CaseStatement<ValueType, SwitchValueType>([
      ...this.entries,
      { type: 'static', value: valueOrCondition as Widen<ValueType>, callback },
    ])
  }

  default(callback: () => any): DefaultType<ValueType, SwitchValueType> {
    return {
      entries: this.entries,
      default: callback,
    }
  }
}

/**
 * AST node representing a switch statement.
 * Transformed into MCFunctions by SwitchTransformationVisitor during save().
 */
export class SwitchNode extends ContainerNode {
  parentMCFunction: MCFunctionNode

  constructor(
    sandstoneCore: SandstoneCore,
    public value: DataPointClass | DataPointPickClass | Score,
    public staticCases: StaticCaseNode[],
    public conditionCases: ConditionCaseNode[],
    public defaultCase: DefaultCaseNode | undefined,
  ) {
    super(sandstoneCore)
    this.parentMCFunction = sandstoneCore.getCurrentMCFunctionOrThrow()

    // Generate case bodies within switch context
    this.parentMCFunction.enterContext(this)
    for (const caseNode of [...staticCases, ...conditionCases]) {
      this.parentMCFunction.enterContext(caseNode)
      caseNode.callback()
      this.parentMCFunction.exitContext()
    }
    if (defaultCase) {
      this.parentMCFunction.enterContext(defaultCase)
      defaultCase.callback()
      this.parentMCFunction.exitContext()
    }
    this.parentMCFunction.exitContext()
  }

  getValue = () => {
    throw new Error('SwitchNode must be transformed by SwitchTransformationVisitor')
  }
}

/**
 * AST node representing a static value case in a switch statement.
 */
export class StaticCaseNode extends ContainerNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public value: number | NBTObject,
    public callback: () => any,
  ) {
    super(sandstoneCore)
  }

  getValue = () => null
}

/**
 * AST node representing a condition-based case in a switch statement.
 */
export class ConditionCaseNode extends ContainerNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public condition: ConditionCallback<any>,
    public callback: () => any,
  ) {
    super(sandstoneCore)
  }

  getValue = () => null
}

/**
 * AST node representing the default case in a switch statement.
 */
export class DefaultCaseNode extends ContainerNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public callback: () => any,
  ) {
    super(sandstoneCore)
  }

  getValue = () => null
}

function isConditionCase<ValueType>(
  c: ConditionCallback<ValueType> | NBTObject,
): c is ConditionCallback<ValueType> {
  return typeof c === 'function'
}

export function executeSwitch<
  ValueType extends DataPointClass | DataPointPickClass | Score,
  CheckType extends ValueType extends Score ? number : NBTObject,
>(
  sandstoneCore: SandstoneCore,
  value: ValueType,
  _cases: SwitchCase<ValueType, CheckType>[] | [...SwitchCase<ValueType, CheckType>[], ['default', () => any]] | CaseStatement<CheckType, ValueType> | DefaultType<CheckType, ValueType>,
) {
  let staticCaseEntries: StaticCaseEntry<CheckType>[] = []
  let conditionCaseEntries: ConditionCaseEntry<ValueType>[] = []

  let _default: ['default', () => {}] | undefined

  // Parse cases from the various input formats
  if (_cases instanceof CaseStatement) {
    staticCaseEntries = _cases.getStaticCases()
    conditionCaseEntries = _cases.getConditionCases() as ConditionCaseEntry<ValueType>[]
  } else if (Array.isArray(_cases)) {
    for (const _case of _cases) {
      if (_case[0] === 'default') {
        _default = _case
        continue
      }
      const [, condition, callback] = _case

      if (isConditionCase(condition)) {
        conditionCaseEntries.push({ type: 'condition' as const, condition, callback })
      } else {
        staticCaseEntries.push({ type: 'static' as const, value: condition, callback })
      }
    }
  } else {
    for (const _case of _cases.entries) {
      if (_case.type === 'condition') {
        conditionCaseEntries.push(_case)
      } else {
        staticCaseEntries.push(_case)
      }
    }
    if (_cases.default) {
      _default = ['default', _cases.default]
    }
  }

  // Create case nodes
  const staticCaseNodes = staticCaseEntries.map(
    (c) => new StaticCaseNode(sandstoneCore, c.value, c.callback),
  )
  const conditionCaseNodes = conditionCaseEntries.map(
    (c) => new ConditionCaseNode(sandstoneCore, c.condition, c.callback),
  )
  const defaultCaseNode = _default
    ? new DefaultCaseNode(sandstoneCore, _default[1])
    : undefined

  // Create SwitchNode (commits to current MCFunction context)
  // The node constructor executes callbacks to populate case body nodes
  // SwitchTransformationVisitor transforms this into MCFunctions during save()
  new SwitchNode(
    sandstoneCore,
    value,
    staticCaseNodes,
    conditionCaseNodes,
    defaultCaseNode,
  )
}
