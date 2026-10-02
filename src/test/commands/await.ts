import type {
  COMPARISON_OPERATORS,
  Coordinates,
  MultipleEntitiesArgument,
  NBTObject,
  Range,
  Registry,
  SingleEntityArgumentOf,
  SymbolBlock,
  SymbolMcdocBlockStates,
  TimeArgument,
  RootNBT,
} from 'sandstone/arguments'
import type { ObjectiveClass } from 'sandstone/variables/Objective'
import type { PredicateClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { DataPointClass } from 'sandstone/variables/Data'
import { type AllowConst, type NamespacedLiteralUnion } from 'sandstone/utils'
import { nbtResolver } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser, rangeParser, targetParser } from 'sandstone/variables/parsers'
import { blockStateStringifier } from '../../commands/implementations/block/setblock'
import { CommandArguments, type FinalCommandOutput } from '../../commands/helpers'
import { setParentTestMCFunction, ThrowableCommandNode } from './_throwable'
import type { Score } from 'sandstone/variables/Score'

type ParseLiteral<T> = (
  T extends 'true' | 'false' ? boolean :
  T extends `${infer N extends number}` ? N :
  T
)

type ParseBlockState<T> = {
  [K in keyof T]: ParseLiteral<T[K]>
}

type BlockEntity = NamespacedLiteralUnion<keyof SymbolBlock>

type BlockStatic = NamespacedLiteralUnion<Exclude<keyof SymbolMcdocBlockStates, keyof SymbolBlock>>

const isObjective = (arg: any): arg is ObjectiveClass => typeof arg === 'object' && Object.hasOwn(arg, 'reset')

const isScore = (arg: any): arg is Score => typeof arg === 'object' && Object.hasOwn(arg, 'setDisplay')

export class AwaitCommandNode extends ThrowableCommandNode {
  command = 'await' as const
}

/**
 * Retries a positive condition every tick until the test times out or the
 * condition succeeds. If the timeout is reached the test fails and the
 * function returns.
 *
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 */
export class AwaitCommand extends CommandArguments {
  protected NodeType = AwaitCommandNode

  /**
   * Wraps `CommandArguments.finalCommand` to capture the call site for
   * the await's stack trace. See `AssertCommand.finalCommand`.
   */
  protected finalCommand = (
    args?: unknown[],
    currentNode?: unknown,
  ): FinalCommandOutput => {
    const out = this.finalCommandWithStackTrace(args, currentNode as never)
    setParentTestMCFunction(out, this.sandstoneCore.currentMCFunction)
    return out
  }

  /**
   * Waits for the block at a given position to match a given block.
   */
  block<BLOCK extends BlockStatic>(
    pos: Coordinates,
    block: BLOCK,
    state?: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number>,
  ): FinalCommandOutput

  /**
   * Waits for the block at a given position to match a given block with NBT data.
   */
  block<BLOCK extends BlockEntity>(
    pos: Coordinates,
    block: BLOCK,
    state: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number> | undefined,
    nbt: BLOCK extends keyof SymbolBlock
      ? NonNullable<AllowConst<SymbolBlock[BLOCK]>>
      : AllowConst<RootNBT>,
  ): FinalCommandOutput

  block(
    pos: Coordinates,
    block: Registry['minecraft:block'],
    state?: Record<string, string | boolean | number>,
    nbt?: AllowConst<RootNBT>,
  ) {
    const stateStr = state && typeof state === 'object' && Object.keys(state).length > 0
      ? blockStateStringifier(state as Record<string, string | number | boolean>)
      : ''
    const nbtStr = nbt ? nbtResolver(nbt as NBTObject).toString() : ''
    return this.finalCommand(['block', coordinatesParser(pos), `${block}${stateStr}${nbtStr}`])
  }

  /**
   * Waits for one or more entities to exist.
   */
  entity = (targets: MultipleEntitiesArgument) =>
    this.finalCommand(['entity', targetParser(targets)])

  /**
   * Waits for the `predicate` to evaluate to a positive result.
   */
  predicate(predicate: string | PredicateClass) {
    if (typeof predicate === 'string') {
      return this.finalCommand(['predicate', predicate])
    }
    if (Object.hasOwn(predicate, 'toMacro')) {
      return this.finalCommand(['predicate', predicate])
    }
    return this.finalCommand(['predicate', predicate.name])
  }

  /**
   * Wait for a score to match either another score or a given range.
   */
  score<T extends string>(
    firstTarget: SingleEntityArgumentOf<false, T>,
    firstObjective: string | ObjectiveClass,
    comparison: 'matches',
    value: Range,
  ): FinalCommandOutput

  score<T extends string, O extends string>(
    firstTarget: SingleEntityArgumentOf<false, T>,
    firstObjective: string | ObjectiveClass,
    comparison: COMPARISON_OPERATORS,
    otherTarget: SingleEntityArgumentOf<false, O>,
    otherObjective: string | ObjectiveClass,
  ): FinalCommandOutput

  score(firstScore: Score, comparison: 'matches', value: Range): FinalCommandOutput

  score(firstScore: Score, comparison: COMPARISON_OPERATORS, otherScore: Score): FinalCommandOutput

  score(...args: any[]) {
    const finalArgs: string[] = []

    if (isScore(args[0])) {
      finalArgs.push(args[0].target.toString(), args[0].objective.name, args[1])
      if (isScore(args[2])) {
        finalArgs.push(args[2].target.toString(), args[2].objective.name)
      } else {
        finalArgs.push(rangeParser(this.sandstoneCore, args[2]))
      }
    } else {
      finalArgs.push(targetParser(args[0]), isObjective(args[1]) ? args[1].name : args[1], args[2])
      if (args[4]) {
        finalArgs.push(targetParser(args[3]), isObjective(args[4]) ? args[4].name : args[4])
      } else {
        finalArgs.push(rangeParser(this.sandstoneCore, args[3]))
      }
    }
    return this.finalCommand(['score', ...finalArgs])
  }

  /**
   * Waits for the targeted block, entity or storage to have any data tag for a given path.
   */
  data = (data: DataPointClass) =>
    this.finalCommand(['data', data.type, data.currentTarget, data.path] as unknown as [string])

  /**
   * Waits for a chat message matching a regex pattern to be sent.
   */
  chat = (
    pattern: string,
    receivers?: MultipleEntitiesArgument,
  ) => this.finalCommand(['chat', pattern, receivers === undefined ? undefined : targetParser(receivers)] as unknown as [string])

  /**
   * Waits for a specified time before continuing.
   *
   * @param time Time to wait. A bare number is interpreted as ticks; suffix
   *             with `t` for ticks, `s` for seconds, or `d` for days.
   *
   * @example
   * ```ts
   * await.delay(40)       // 40 ticks
   * await.delay('1s')     // 1 second
   * await.delay('5t')     // 5 ticks
   * ```
   */
  delay = (time: TimeArgument) => this.finalCommand(['delay', time])

  /**
   * Awaits the negative form — succeeds if the condition fails.
   */
  get not(): AwaitNotCommand {
    return new AwaitNotCommand(this.sandstonePack)
  }
}

/**
 * Retries a negative condition every tick until the test times out or the
 * condition fails. If the timeout is reached the test fails and the
 * function returns.
 *
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 */
export class AwaitNotCommand extends CommandArguments {
  protected NodeType = AwaitCommandNode

  /**
   * Wraps `CommandArguments.finalCommand` to capture the call site for
   * the negated await's stack trace. See `AssertCommand.finalCommand`.
   */
  protected finalCommand = (
    args?: unknown[],
    currentNode?: unknown,
  ): FinalCommandOutput => {
    const out = this.finalCommandWithStackTrace(args, currentNode as never)
    setParentTestMCFunction(out, this.sandstoneCore.currentMCFunction)
    return out
  }

  block<BLOCK extends BlockStatic>(
    pos: Coordinates,
    block: BLOCK,
    state?: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number>,
  ): FinalCommandOutput

  block<BLOCK extends BlockEntity>(
    pos: Coordinates,
    block: BLOCK,
    state: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number> | undefined,
    nbt: BLOCK extends keyof SymbolBlock
      ? NonNullable<AllowConst<SymbolBlock[BLOCK]>>
      : AllowConst<RootNBT>,
  ): FinalCommandOutput

  block(
    pos: Coordinates,
    block: Registry['minecraft:block'],
    state?: Record<string, string | boolean | number>,
    nbt?: AllowConst<RootNBT>,
  ) {
    const stateStr = state && typeof state === 'object' && Object.keys(state).length > 0
      ? blockStateStringifier(state as Record<string, string | number | boolean>)
      : ''
    const nbtStr = nbt ? nbtResolver(nbt as NBTObject).toString() : ''
    return this.finalCommand(['not', 'block', coordinatesParser(pos), `${block}${stateStr}${nbtStr}`])
  }

  entity = (targets: MultipleEntitiesArgument) =>
    this.finalCommand(['not', 'entity', targetParser(targets)])

  predicate(predicate: string | PredicateClass) {
    if (typeof predicate === 'string') {
      return this.finalCommand(['not', 'predicate', predicate])
    }
    if (Object.hasOwn(predicate, 'toMacro')) {
      return this.finalCommand(['not', 'predicate', predicate])
    }
    return this.finalCommand(['not', 'predicate', predicate.name])
  }

  score<T extends string>(
    firstTarget: SingleEntityArgumentOf<false, T>,
    firstObjective: string | ObjectiveClass,
    comparison: 'matches',
    value: Range,
  ): FinalCommandOutput

  score<T extends string, O extends string>(
    firstTarget: SingleEntityArgumentOf<false, T>,
    firstObjective: string | ObjectiveClass,
    comparison: COMPARISON_OPERATORS,
    otherTarget: SingleEntityArgumentOf<false, O>,
    otherObjective: string | ObjectiveClass,
  ): FinalCommandOutput

  score(firstScore: Score, comparison: 'matches', value: Range): FinalCommandOutput

  score(firstScore: Score, comparison: COMPARISON_OPERATORS, otherScore: Score): FinalCommandOutput

  score(...args: any[]) {
    const finalArgs: string[] = []

    if (isScore(args[0])) {
      finalArgs.push(args[0].target.toString(), args[0].objective.name, args[1])
      if (isScore(args[2])) {
        finalArgs.push(args[2].target.toString(), args[2].objective.name)
      } else {
        finalArgs.push(rangeParser(this.sandstoneCore, args[2]))
      }
    } else {
      finalArgs.push(targetParser(args[0]), isObjective(args[1]) ? args[1].name : args[1], args[2])
      if (args[4]) {
        finalArgs.push(targetParser(args[3]), isObjective(args[4]) ? args[4].name : args[4])
      } else {
        finalArgs.push(rangeParser(this.sandstoneCore, args[3]))
      }
    }
    return this.finalCommand(['not', 'score', ...finalArgs])
  }

  data = (data: DataPointClass) =>
    this.finalCommand(['not', 'data', data.type, data.currentTarget, data.path] as unknown as [string])

  chat = (
    pattern: string,
    receivers?: MultipleEntitiesArgument,
  ) => this.finalCommand(['not', 'chat', pattern, receivers === undefined ? undefined : targetParser(receivers)] as unknown as [string])
}