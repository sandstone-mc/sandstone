/* eslint-disable no-plusplus */
import { MacroArgument } from '../core/Macro.js'
import { SelectorPickClass } from './abstractClasses.js'
import { rangeParser } from './parsers.js'

import type {
  COMPARISON_OPERATORS, FormattingTags, JSONTextComponent, MultipleEntitiesArgument, ObjectiveArgument, OPERATORS, Range,
} from 'sandstone/arguments'
import type { SandstoneCommands } from 'sandstone/commands'
import type { NotNode } from 'sandstone/flow'
import type { ConditionClass } from 'sandstone/variables'
import type { SandstonePack } from '../pack/index.js'
import type { ComponentClass } from './abstractClasses.js'
import type { DATA_TYPES, DataPointClass } from './Data.js'
import type { ObjectiveClass } from './Objective.js'

type PlayersTarget = number | MultipleEntitiesArgument<false>

type OperationArguments = (
  [amountOrTargetScore: number | Score] |
  [targets: PlayersTarget, objective?: ObjectiveArgument]
)

let matchers = 0

function createVariable(pack: SandstonePack, amount: number): Score

function createVariable(pack: SandstonePack, targets: MultipleEntitiesArgument<false>, objective: ObjectiveArgument): Score

function createVariable(pack: SandstonePack, score: Score): Score

function createVariable(pack: SandstonePack, ...args: [number] | [Score] | [MultipleEntitiesArgument<false>, ObjectiveArgument]): Score {
  const anonymousScore = pack.Variable()

  if (typeof args[0] === 'number' || args[0] instanceof Score) {
    return anonymousScore.set(args[0])
  }

  return anonymousScore.set(args[0], args[1])
}

export type ScoreDisplay = {
  name?: JSONTextComponent,

  numberformat?: 'blank' | ['styled', FormattingTags] | ['fixed', JSONTextComponent]
}

export class Score extends MacroArgument implements ConditionClass, ComponentClass {
  commands: SandstoneCommands<false>

  constructor(public sandstonePack: SandstonePack, public target: MultipleEntitiesArgument<false>, public display: ScoreDisplay | undefined, public objective: ObjectiveClass) {
    super(sandstonePack.core)
    this.commands = sandstonePack.commands

    if (display !== undefined) {
      if (sandstonePack.core.currentMCFunction) {
        this.setDisplay(display)
      } else {
        sandstonePack.initMCFunction.push(() => this.setDisplay(display))
      }
    }
  }

  toString() {
    return `${this.target} ${this.objective}`
  }

  toJSON() {
    return {
      type: 'minecraft:score',
      target: {
        type: 'minecraft:fixed',
        name: this.target.toString(),
      },
      score: this.objective.toString(),
      scale: 1,
    } as const
  }

  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    return {
      score: { name: this.target, objective: this.objective.name },
    }
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => this.sandstonePack._.not(new this.sandstonePack.conditions.Score(this.sandstonePack.core, [`${this.target}`, `${this.objective}`, 'matches', '0']))

  private unaryOperation(
    operation: 'add' | 'remove' | 'set',
    operator: OPERATORS,
    ...args: OperationArguments
  ): this {
    if (typeof args[0] === 'number') {
      this.commands.scoreboard.players[operation](this, args[0])
    } else if (args[0] instanceof Score) {
      this.commands.scoreboard.players.operation(this, operator, args[0].target, args[0].objective)
    } else {
      this.commands.scoreboard.players.operation(this, operator, args[0], args[1] ?? this.objective)
    }

    return this
  }

  private binaryOperation(operator: OPERATORS, ...args: OperationArguments): this {
    if (args[0] instanceof Score) {
      this.commands.scoreboard.players.operation(this, operator, args[0].target, args[0].objective)
      return this
    }

    let objective = args[1] ?? this.objective
    if (typeof args[0] === 'number') {
      this.sandstonePack.registerNewConstant(args[0])
      objective = 'sandstone_const'
    }

    this.commands.scoreboard.players.operation(this, operator, args[0], objective)

    return this
  }

  setDisplay = (display: ScoreDisplay) => {
    if (display.name) {
      this.commands.scoreboard.players.display.name(this, display.name)
    }
    if (display.numberformat) {
      if (display.numberformat === 'blank') {
        this.commands.scoreboard.players.display.numberformat(this, 'blank')
      } else if (display.numberformat[0] === 'styled') {
        this.commands.scoreboard.players.display.numberformat(this, 'styled', display.numberformat[1])
      } else {
        this.commands.scoreboard.players.display.numberformat(this, 'fixed', display.numberformat[1])
      }
    }
    this.display = display
    return this
  }

  /** INLINE OPERATORS */
  /**
   * Reset the entity's score.
   */
  reset = () => {
    this.commands.scoreboard.players.reset(this)
  }

  /**
   * Set the current entity's score to other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  set(targets: PlayersTarget, objective?: ObjectiveArgument): Score

  /**
   * Set the current entity's score to the given value, or to the other target's score.
   *
   * @param amountOrTargetScore A value, or the target's score.
   */
  set(amountOrTargetScore: number | Score): Score

  /**
   * Set the current entity's score to the given NBT value, with the given scale.
   *
   * @param nbt The Data Point to set the score to.
   *
   * @param scale The scale factor.
   */
  set(nbt: DataPointClass, scale?: number): Score

  set(...args: OperationArguments | [DataPointClass, number?]) {
    if (typeof args[0] === 'object' && !(args[0] instanceof SelectorPickClass) && !(args[0] instanceof Score)) {
      const [data, scale] = args as [DataPointClass<DATA_TYPES>, number?]

      this.commands.execute.store.result.score(this).run.data.get[data.type](data.currentTarget as any, data.path, scale)

      return this
    }

    return this.unaryOperation('set', '=', ...args as OperationArguments)
  }

  '=' = this.set

  /**
   * Adds other entities's scores to the current entity's score.
   *
   * @param targets The targets to add the scores from.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  add(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Adds the given amount, or the other target's score, to the current entity's score.
   *
   * @param amountOrTargetScore The amount to add, or the target to add the scores from.
   */
  add(amountOrTargetScore: number | Score): Score

  add(...args: OperationArguments) {
    return this.unaryOperation('add', '+=', ...args)
  }

  '+=' = this.add

  /**
   * Subtract other target's scores from the current entity's score.
   *
   * @param targets The targets to get the scores from.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  remove(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Subtract the given amount, or the other target's score, from the current entity's score.
   *
   * @param targetScore The amount to subtract, or the target to get the score from.
   */
  remove(amountOrTargetScore: number | Score): Score

  remove(...args: OperationArguments) {
    return this.unaryOperation('remove', '-=', ...args)
  }

  '-=' = this.remove

  /**
   * Adds one to the current entity's score.
   */
  increase() {
    return this.add(1)
  }

  get '++'() {
    return this.increase()
  }

  /**
   * Subtracts one from the current entity's score.
   */
  decrease() {
    return this.remove(1)
  }

  get '--'() {
    return this.decrease()
  }

  /**
   * Multiply the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multiply(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Multiply the current entity's score by the given value, or other target's scores.
   *
   * @param amountOrTargetScore The value, or the target to get the scores from.
   */
  multiply(amountOrTargetScore: number | Score): Score

  multiply(...args: OperationArguments) {
    return this.binaryOperation('*=', ...args)
  }

  '*=' = this.multiply

  /**
   * Divide the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  divide(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Divide the current entity's score by the given value, or the other target's scores.
   *
   * @param amountOrTargetScore The value, or the target to get the scores from
   */
  divide(amountOrTargetScore: number | Score): Score

  divide(...args: OperationArguments) {
    return this.binaryOperation('/=', ...args)
  }

  '/=' = this.divide

  /**
   * Get the remainder of the division of the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  modulo(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Divide the current entity's score by other target's scores.
   *
   * @param amountOrTargetScore The value, or target's score to modulo the current score with.
   */
  modulo(amountOrTargetScore: number | Score): Score

  modulo(...args: OperationArguments) {
    return this.binaryOperation('%=', ...args)
  }

  '%=' = this.modulo

  /**
   * Swap the current score with the other targets' scores.
   *
   * @param targets The targets to swap the scores with
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  swap(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): void

  /**
   * Swap the current entity's score with the other target's scores.
   *
   * @param targetScore The target to swap the scores with
   */
  swap(targetScore: Score): void

  swap(...args: OperationArguments) {
    this.binaryOperation('><', ...args)
  }

  '><' = this.swap

  /** EFFECT-FREE OPERATORS */

  /**
   * Returns a new anonymous score, equal to the sum of the current score and the given targets' score.
   *
   * @param targets The targets to add the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  plus(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the sum of the current score and the given amount or target' score.
   *
   * @param amountOrTargetScore The value, or the target to add the score from.
   */
  plus(amountOrTargetScore: number | Score): Score

  plus(...args: OperationArguments): Score {
    return createVariable(this.sandstonePack, this).unaryOperation('add', '+=', ...args)
  }

  '+' = this.plus

  /**
   * Returns a new anonymous score, equal to the difference between the current score and the given targets' score.
   *
   * @param targets The targets to subtract the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  minus(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the difference between the current score and the given amount or target' score.
   *
   * @param amountOrTargetScore The amount to subtract, or the target to subtract the score from.
   */
  minus(amountOrTargetScore: number | Score): Score

  minus(...args: OperationArguments): Score {
    return createVariable(this.sandstonePack, this).unaryOperation('remove', '-=', ...args)
  }

  '-' = this.minus

  /**
   * Returns a new anonymous score, equal to the product of the current score and the given targets' score.
   *
   * @param targets The targets to multiply the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multipliedBy(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the product of the current score and the given amount or target's score.
   *
   * @param amountOrTargetScore The amount, or the target to multiply the scores from
   */
  multipliedBy(amountOrTargetScore: number | Score): Score

  multipliedBy(...args: OperationArguments): Score {
    return createVariable(this.sandstonePack, this).binaryOperation('*=', ...args)
  }

  '*' = this.multipliedBy

  /**
   * Returns a new anonymous score, equal to the division of the current score and the given targets' score.
   *
   * @param targets The targets to divide the scores by
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  dividedBy(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the division of the current score and the given amount or target's score.
   *
   * @param amountOrTargetScore The amount, or target's score to divide the current score by.
   */
  dividedBy(amountOrTargetScore: number | Score): Score

  dividedBy(...args: OperationArguments): Score {
    return createVariable(this.sandstonePack, this).binaryOperation('/=', ...args)
  }

  '/' = this.dividedBy

  /**
   * Returns a new anonymous score, equal to the modulo of the current score and the given targets' score.
   *
   * @param targets The targets to modulo the scores by
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  moduloBy(targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the modulo of the current score and the given value, or target's score.
   *
   * @param amountOrTargetScore The amount, or target's score to modulo the current score by.
   */
  moduloBy(amountOrTargetScore: number | Score): Score

  moduloBy(...args: OperationArguments): Score {
    return createVariable(this.sandstonePack, this).binaryOperation('%=', ...args)
  }

  '%' = this.moduloBy

  /** COMPARISONS OPERATORS */
  private comparison(
    operator: COMPARISON_OPERATORS,
    matchesRange: string,
    args: OperationArguments,
  ): ConditionClass {
    const playerScore = this

    if (typeof args[0] === 'number') {
      return {
        _toMinecraftCondition: () => new this.sandstonePack.conditions.Score(this.sandstonePack.core, [`${playerScore.target}`, `${playerScore.objective}`, 'matches', matchesRange]),
      }
    }

    const endArgs = args[1] ? args : [args[0]]
    return {
      // eslint-disable-next-line max-len
      _toMinecraftCondition: () => new this.sandstonePack.conditions.Score(this.sandstonePack.core, [`${playerScore.target}`, `${playerScore.objective}`, operator, ...(endArgs.map((arg) => (arg as any).toString()))]),
    }
  }

  /**
   * Check if the current score is strictly greater than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterThan (targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is strictly greater than the given amount or score.
   *
   * @param amountOrTargetScore The amount or score to compare the current score against.
   */
  greaterThan (amountOrTargetScore: number | Score) : ConditionClass

  greaterThan(...args: OperationArguments) {
    return this.comparison('>', `${typeof args[0] === 'number' ? args[0] + 1 : null}..`, args)
  }

  '>' = this.greaterThan

  /**
   * Check if the current score is greater or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterOrEqualThan (targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is greater or equal than the given amount or score.
   *
   * @param amountOrTargetScore The amount or score compare the current score against.
   */
  greaterOrEqualThan (amountOrTargetScore: number | Score) : ConditionClass

  greaterOrEqualThan(...args: OperationArguments) {
    return this.comparison('>=', `${args[0]}..`, args)
  }

  '>=' = this.greaterOrEqualThan

  /**
   * Check if the current score is strictly lower than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lessThan (targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is strictly lower than the given amount or score.
   *
   * @param amountOrTargetScore The amount or score to compare the current score against.
   */
  lessThan (amountOrTargetScore: number | Score) : ConditionClass

  lessThan(...args: OperationArguments) {
    return this.comparison('<', `..${typeof args[0] === 'number' ? args[0] - 1 : null}`, args)
  }

  '<' = this.lessThan

  /**
   * Check if the current score is lower or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lessOrEqualThan (targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is lower or equal than the given amount or score.
   *
   * @param amountOrTargetScore The amount or score target to compare the current score against.
   */
  lessOrEqualThan (amountOrTargetScore: number | Score) : ConditionClass

  lessOrEqualThan(...args: OperationArguments) {
    return this.comparison('<=', `..${args[0]}`, args)
  }

  '<=' = this.lessOrEqualThan

  /**
   * Check if the current score is equal to than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  equalTo (targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is equal to the given amount or score.
   *
   * @param amountOrTargetScore The amount or score to compare the current score against.
   */
  equalTo (amountOrTargetScore: number | Score) : ConditionClass

  equalTo(...args: OperationArguments) {
    return this.comparison('=', args[0].toString(), args)
  }

  '==' = this.equalTo

  /**
   * Check if the current score is not equal to than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  notEqualTo (targets: MultipleEntitiesArgument<false>, objective?: ObjectiveArgument): NotNode

  /**
   * Check if the current score is not equal to the given amount or score.
   *
   * @param amountOrTargetScore The amount or score to compare the current score against.
   */
  notEqualTo (amountOrTargetScore: number | Score) : NotNode

  notEqualTo(...args: OperationArguments) {
    return this.sandstonePack._.not(this.comparison('=', args[0].toString(), args))
  }

  '!=' = this.notEqualTo

  /**
   * Check if the current score matches a certain range.
   *
   * @param range The range to compare the current score against.
   */
  matches = (range: Range<false>) => ({
    _toMinecraftCondition: () => new this.sandstonePack.conditions.Score(this.sandstonePack.core, [`${this.target}`, `${this.objective}`, 'matches', rangeParser(this.sandstoneCore, range)]),
  })

  match = (minimum: number, maximum: number, callback: (num: number) => void) => {
    const { MCFunction, Macro } = this.sandstonePack

    if (maximum > 1000) {
      console.warn(
        `\nWarning: Score.match() will have to create ${maximum - minimum} mcfunction files, this *will* take a while. `
        + 'Consider only compiling this once and saving it to external resources.',
      )
    }

    const matcher = matchers++

    const score = this

    for (let i = minimum; i < maximum; i++) {
      MCFunction(`__sandstone:score_match/${matcher}/${i}`, () => callback(i))
    }

    return MCFunction(`__sandstone:score_match/${matcher}`, [score], () => Macro.returnCmd.run.functionCmd(Macro`__sandstone:score_match/${matcher}/${score}`))
  }
}
