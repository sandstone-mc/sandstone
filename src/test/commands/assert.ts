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

// PackTest assert command — provided by the [PackTest](https://github.com/misode/packtest) server mod.
// Asserts a condition; if the condition fails the current test fails and the function returns.

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

export class AssertCommandNode extends ThrowableCommandNode {
  command = 'assert' as const
}

/**
 * Asserts a positive condition. If the condition is unsuccessful, the
 * current test fails and the function returns.
 *
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 */
export class AssertCommand extends CommandArguments {
  protected NodeType = AssertCommandNode

  /**
   * Wraps `CommandArguments.finalCommand` to capture the call site that
   * constructed the assertion and store it on the node as
   * `node.stackTrace`. Test runners use this to point users at the
   * line of `src/` that produced a failing assertion.
   */
  protected finalCommand = (
    args?: unknown[],
    currentNode?: unknown,
  ): FinalCommandOutput => {
    const command = this.finalCommandWithStackTrace(args, currentNode as never)
    setParentTestMCFunction(this.sandstoneCore, command.node)
    return command
  }

  /**
   * Compares the block at a given position to a given block.
   *
   * @param pos Position of a target block to test.
   * @param block Block to test for (can be a tag).
   * @param state Optional block state properties to match.
   *
   * @example
   * ```ts
   * assert.block(abs(0, 64, 0), 'minecraft:stone')
   * assert.block(abs(0, 64, 0), 'minecraft:oak_log', { axis: 'y' })
   * ```
   */
  block<BLOCK extends BlockStatic>(
    pos: Coordinates,
    block: BLOCK,
    state?: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number>,
  ): FinalCommandOutput

  /**
   * Compares the block at a given position to a given block with NBT data.
   *
   * @param pos Position of a target block to test.
   * @param block Block to test for (must be a block entity).
   * @param state Optional block state properties to match.
   * @param nbt NBT data to match against the block entity.
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
   * Checks whether one or more entities exist.
   *
   * @param targets The target entities to check.
   */
  entity = (targets: MultipleEntitiesArgument) =>
    this.finalCommand(['entity', targetParser(targets)])

  /**
   * Checks whether the `predicate` evaluates to a positive result.
   *
   * @param predicate The predicate to test.
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
   * Check a score against either another score or a given range.
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
   * Checks whether the targeted block, entity or storage has any data tag for a given path.
   *
   * @param data Data instance to check.
   */
  data = (data: DataPointClass) =>
    this.finalCommand(['data', data.type, data.currentTarget, data.path] as unknown as [string])

  /**
   * Checks whether a chat message was sent in the past tick matching a regex pattern.
   *
   * @param pattern Regex pattern to match against chat messages.
   * @param receivers Optional player selector to scope the check.
   */
  chat = (
    pattern: string,
    receivers?: MultipleEntitiesArgument,
  ) => this.finalCommand(['chat', pattern, receivers === undefined ? undefined : targetParser(receivers)] as unknown as [string])

  /**
   * Asserts the negative form — fails if the condition succeeds.
   */
  get not(): AssertNotCommand {
    return new AssertNotCommand(this.sandstonePack)
  }
}

/**
 * Asserts a negative condition. If the condition is successful, the
 * current test fails and the function returns.
 *
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 */
export class AssertNotCommand extends CommandArguments {
  protected NodeType = AssertCommandNode

  /**
   * Wraps `CommandArguments.finalCommand` to capture the call site for
   * the assertion's stack trace. See `AssertCommand.finalCommand`.
   */
  protected finalCommand = (
    args?: unknown[],
    currentNode?: unknown,
  ): FinalCommandOutput => {
    const command = this.finalCommandWithStackTrace(args, currentNode as never)
    setParentTestMCFunction(this.sandstoneCore, command.node)
    return command
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