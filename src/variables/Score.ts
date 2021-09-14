import { ComponentClass } from '@variables/abstractClasses'
import { rangeParser } from '@variables/parsers'

import { SelectorClass } from './Selector'

import type {
  COMPARISON_OPERATORS, JSONTextComponent, MultipleEntitiesArgument, ObjectiveArgument, OPERATORS, Range,
} from '@arguments'
import type { CommandsRoot } from '@commands'
import type { Datapack } from '@datapack'
import type { ConditionClass } from '@variables'
import type { DATA_TYPES, DataPointInstance } from './Data'
import type { ObjectiveClass } from './Objective'

type PlayersTarget = number | MultipleEntitiesArgument

type OperationArguments = (
  [amountOrTargetScore: number | Score] |
  [targets: PlayersTarget, objective?: ObjectiveArgument]
)

function createVariable(datapack: Datapack, amount: number): Score

function createVariable(datapack: Datapack, targets: MultipleEntitiesArgument, objective: ObjectiveArgument): Score

function createVariable(datapack: Datapack, amountOrTargets: PlayersTarget, objective?: ObjectiveArgument): Score {
  const anonymousScore = datapack.Variable()

  if (typeof amountOrTargets === 'number') {
    anonymousScore.set(amountOrTargets)
  } else {
    anonymousScore.set(amountOrTargets, objective)
  }

  return anonymousScore
}

export class Score<OBJ_CRITERION extends string | undefined = string | undefined> extends ComponentClass implements ConditionClass {
  commandsRoot: CommandsRoot

  target: MultipleEntitiesArgument

  objective: ObjectiveClass<OBJ_CRITERION>

  constructor(commandsRoot: CommandsRoot, target: MultipleEntitiesArgument, objective: ObjectiveClass<OBJ_CRITERION>) {
    super()

    this.commandsRoot = commandsRoot
    this.target = target
    this.objective = objective
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

  protected _toChatComponent(): JSONTextComponent {
    return {
      score: { name: this.target, objective: this.objective.name },
    }
  }

  _toMinecraftCondition = () => ({
    value: ['unless', 'score', this.target, this.objective.name, 'matches', 0],
  })

  private unaryOperation(
    operation: 'add' | 'remove' | 'set',
    operator: OPERATORS,
    ...args: OperationArguments
  ): this {
    if (typeof args[0] === 'number') {
      this.commandsRoot.scoreboard.players[operation](this.target, this.objective, args[0])
    } else if (args[0] instanceof Score) {
      this.commandsRoot.scoreboard.players.operation(
        this.target, this.objective, operator, args[0].target, args[0].objective,
      )
    } else {
      this.commandsRoot.scoreboard.players.operation(
        this.target, this.objective, operator, args[0], args[1] ?? this.objective,
      )
    }

    return this
  }

  private binaryOperation(operator: OPERATORS, ...args: OperationArguments): this {
    if (args[0] instanceof Score) {
      this.commandsRoot.scoreboard.players.operation(
        this.target, this.objective, operator, args[0].target, args[0].objective,
      )
      return this
    }

    let objective = args[1] ?? this.objective
    if (typeof args[0] === 'number') {
      this.commandsRoot.Datapack.registerNewConstant(args[0])
      objective = 'sandstone_const'
    }

    this.commandsRoot.scoreboard.players.operation(
      this.target, this.objective, operator, args[0], objective,
    )

    return this
  }

  /** INLINE OPERATORS */
  /**
   * Reset the entity's score.
   */
  reset = () => {
    this.commandsRoot.scoreboard.players.reset(this.target, this.objective)
  }

  /**
   * Set the current entity's score to other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  set(targets: PlayersTarget, objective?: ObjectiveArgument): Score<OBJ_CRITERION>

  /**
   * Set the current entity's score to the given value, or to the other target's score.
   *
   * @param amountOrTargetScore A value, or the target's score.
   */
  set(amountOrTargetScore: number | Score): Score<OBJ_CRITERION>

  /**
   * Set the current entity's score to the given NBT value, with the given scale.
   *
   * @param nbt The Data Point to set the score to.
   *
   * @param scale The scale factor.
   */
  set(nbt: DataPointInstance, scale?: number): Score<OBJ_CRITERION>

  set(...args: OperationArguments | [DataPointInstance, number?]) {
    if (typeof args[0] === 'object' && !(args[0] instanceof SelectorClass) && !(args[0] instanceof Score)) {
      const [data, scale] = args as [DataPointInstance<DATA_TYPES>, number?]

      this.commandsRoot.execute.store.result.score(this).run.data.get[data.type](data.currentTarget as any, data.path, scale)

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
  add(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score<OBJ_CRITERION>

  /**
   * Adds the given amount, or the other target's score, to the current entity's score.
   *
   * @param amountOrTargetScore The amount to add, or the target to add the scores from.
   */
  add(amountOrTargetScore: number | Score): Score<OBJ_CRITERION>

  add(...args: OperationArguments) {
    return this.unaryOperation('add', '+=', ...args)
  }

  '+=' = this.add

  /**
   * Substract other target's scores from the current entity's score.
   *
   * @param targets The targets to get the scores from.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  remove(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score<OBJ_CRITERION>

  /**
   * Substract the given amount, or the other target's score, from the current entity's score.
   *
   * @param targetScore The amount to substract, or the target to get the score from.
   */
  remove(amountOrTargetScore: number | Score): Score<OBJ_CRITERION>

  remove(...args: OperationArguments) {
    return this.unaryOperation('remove', '-=', ...args)
  }

  '-=' = this.remove

  /**
   * Multiply the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multiply(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score<OBJ_CRITERION>

  /**
   * Multiply the current entity's score by the given value, or other target's scores.
   *
   * @param amountOrTargetScore The value, or the target to get the scores from.
   */
  multiply(amountOrTargetScore: number | Score): Score<OBJ_CRITERION>

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
  divide(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score<OBJ_CRITERION>

  /**
   * Divide the current entity's score by the given value, or the other target's scores.
   *
   * @param amountOrTargetScore The value, or the target to get the scores from
   */
  divide(amountOrTargetScore: number | Score): Score<OBJ_CRITERION>

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
  modulo(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score<OBJ_CRITERION>

  /**
   * Divide the current entity's score by other target's scores.
   *
   * @param amountOrTargetScore The value, or target's score to modulo the current score with.
   */
  modulo(amountOrTargetScore: number | Score): Score<OBJ_CRITERION>

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
  swap(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): void

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
  plus(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the sum of the current score and the given amount or target' score.
   *
   * @param amountOrTargetScore The value, or the target to add the score from.
   */
  plus(amountOrTargetScore: number | Score): Score

  plus(...args: OperationArguments): Score {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.unaryOperation('add', '+=', ...args)
    return anonymousScore
  }

  '+' = this.plus

  /**
   * Returns a new anonymous score, equal to the difference between the current score and the given targets' score.
   *
   * @param targets The targets to substract the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  minus(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the difference between the current score and the given amount or target' score.
   *
   * @param amountOrTargetScore The amount to substract, or the target to substract the score from.
   */
  minus(amountOrTargetScore: number | Score): Score

  minus(...args: OperationArguments): Score {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.unaryOperation('remove', '-=', ...args)
    return anonymousScore
  }

  '-' = this.minus

  /**
   * Returns a new anonymous score, equal to the product of the current score and the given targets' score.
   *
   * @param targets The targets to multiply the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multipliedBy(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the product of the current score and the given amount or target's score.
   *
   * @param amountOrTargetScore The amount, or the target to multiply the scores from
   */
  multipliedBy(amountOrTargetScore: number | Score): Score

  multipliedBy(...args: OperationArguments): Score {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.binaryOperation('*=', ...args)
    return anonymousScore
  }

  '*' = this.multipliedBy

  /**
   * Returns a new anonymous score, equal to the division of the current score and the given targets' score.
   *
   * @param targets The targets to divide the scores by
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  dividedBy(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the division of the current score and the given amount or target's score.
   *
   * @param amountOrTargetScore The amount, or target's score to divide the current score by.
   */
  dividedBy(amountOrTargetScore: number | Score): Score

  dividedBy(...args: OperationArguments): Score {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.binaryOperation('/=', ...args)
    return anonymousScore
  }

  '/' = this.divide

  /**
   * Returns a new anonymous score, equal to the modulo of the current score and the given targets' score.
   *
   * @param targets The targets to modulo the scores by
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  moduloBy(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): Score

  /**
   * Returns a new anonymous score, equal to the modulo of the current score and the given value, or target's score.
   *
   * @param amountOrTargetScore The amount, or target's score to modulo the current score by.
   */
  moduloBy(amountOrTargetScore: number | Score): Score

  moduloBy(...args: OperationArguments): Score {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.binaryOperation('%=', ...args)
    return anonymousScore
  }

  '%' = this.modulo

  /** COMPARISONS OPERATORS */
  private comparison(
    operator: COMPARISON_OPERATORS,
    matchesRange: string,
    args: OperationArguments,
    invert = false,
  ): ConditionClass {
    const playerScore = this

    const ifOrUnless = invert ? 'unless' : 'if'

    if (typeof args[0] === 'number') {
      return {
        _toMinecraftCondition: () => ({ value: [ifOrUnless, 'score', playerScore.target, playerScore.objective, 'matches', matchesRange] }),
      }
    }

    const endArgs = args[1] ? args : [args[0]]
    return {
      _toMinecraftCondition: () => ({ value: [ifOrUnless, 'score', playerScore.target, playerScore.objective, operator, ...endArgs] }),
    }
  }

  /**
   * Check if the current score is strictly greater than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

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
  greaterOrEqualThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

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
  lowerThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is strictly lower than the given amount or score.
   *
   * @param amountOrTargetScore The amount or score to compare the current score against.
   */
  lowerThan (amountOrTargetScore: number | Score) : ConditionClass

  lowerThan(...args: OperationArguments) {
    return this.comparison('<', `..${typeof args[0] === 'number' ? args[0] - 1 : null}`, args)
  }

  '<' = this.lowerThan

  /**
   * Check if the current score is lower or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lowerOrEqualThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is lower or equal than the given amount or score.
   *
   * @param amountOrTargetScore The amount or score target to compare the current score against.
   */
  lowerOrEqualThan (amountOrTargetScore: number | Score) : ConditionClass

  lowerOrEqualThan(...args: OperationArguments) {
    return this.comparison('<=', `..${args[0]}`, args)
  }

  '<=' = this.lowerOrEqualThan

  /**
   * Check if the current score is equal to than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  equalTo (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

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
  notEqualTo (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is not equal to the given amount or score.
   *
   * @param amountOrTargetScore The amount or score to compare the current score against.
   */
  notEqualTo (amountOrTargetScore: number | Score) : ConditionClass

  notEqualTo(...args: OperationArguments) {
    return this.comparison('=', args[0].toString(), args, true)
  }

  '!=' = this.notEqualTo

  /**
   * Check if the current score matches a certain range.
   *
   * @param range The range to compare the current score against.
   */
  matches = (range: Range) => ({
    _toMinecraftCondition: () => ({ value: ['if', 'score', this.target, this.objective, 'matches', rangeParser(range)] }),
  })
}
