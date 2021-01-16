import { ComponentClass } from '@variables/abstractClasses'
import { rangeParser } from '@variables/parsers'

import type {
  COMPARISON_OPERATORS, JsonTextComponent, MultipleEntitiesArgument, ObjectiveArgument, OPERATORS,
} from '@arguments'
import type { CommandsRoot } from '@commands'
import type { Datapack } from '@datapack'
import type { ConditionClass } from '@variables/abstractClasses'
import type { Range } from '..'
import type { ObjectiveClass } from './Objective'

type PlayersTarget = number | MultipleEntitiesArgument

type OperationArguments = (
  [amount: number] |
  [targets: PlayersTarget, objective?: ObjectiveArgument] |
  [targetScore: PlayerScore]
)

function createVariable(datapack: Datapack, amount: number): PlayerScore

function createVariable(datapack: Datapack, targets: MultipleEntitiesArgument, objective: ObjectiveArgument): PlayerScore

function createVariable(datapack: Datapack, amountOrTargets: PlayersTarget, objective?: ObjectiveArgument): PlayerScore {
  const anonymousScore = datapack.Variable()

  if (typeof amountOrTargets === 'number') {
    anonymousScore.set(amountOrTargets)
  } else {
    anonymousScore.set(amountOrTargets, objective)
  }

  return anonymousScore
}

export class PlayerScore extends ComponentClass implements ConditionClass {
  commandsRoot: CommandsRoot

  target: MultipleEntitiesArgument

  objective: ObjectiveClass

  constructor(commandsRoot: CommandsRoot, target: MultipleEntitiesArgument, objective: ObjectiveClass) {
    super()

    this.commandsRoot = commandsRoot
    this.target = target
    this.objective = objective
  }

  toString() {
    return `${this.target} ${this.objective}`
  }

  protected _toChatComponent(): JsonTextComponent {
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
    } else if (args[0] instanceof PlayerScore) {
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
    if (args[0] instanceof PlayerScore) {
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
   * Set the entity's score to a given amount.
   *
   * @param amount The amount to set the entity's score to.
   */
  set(amount: number): this

  /**
   * Set the current entity's score to other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  set(targets: PlayersTarget, objective?: ObjectiveArgument): this

  /**
   * Set the current entity's score to other entities's scores.
   *
   * @param targetScore The target to get the scores from
   */
  set(targetScore: PlayerScore): this

  set(...args: OperationArguments) {
    return this.unaryOperation('set', '=', ...args)
  }

  /**
   * Adds a constant amount to the entity's score.
   *
   * @param amount The amount to add to the entity's score.
   */
  add(amount: number): this

  /**
   * Adds other entities's scores to the current entity's score.
   *
   * @param targets The targets to add the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  add(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): this

  /**
   * Adds other target's scores to the current entity's score.
   *
   * @param targetScore The target to add the scores from
   */
  add(targetScore: PlayerScore): this

  add(...args: OperationArguments) {
    return this.unaryOperation('add', '+=', ...args)
  }

  /**
   * Substract a constant amount from the entity's score.
   *
   * @param amount The amount to substract to the entity's score.
   */
  remove(amount: number): this

  /**
   * Substract other target's scores from the current entity's score.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  remove(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): this

  /**
   * Substract other entities's scores from the current entity's score.
   *
   * @param targetScore The target to get the scores from
   */
  remove(targetScore: PlayerScore): this

  remove(...args: OperationArguments) {
    return this.unaryOperation('remove', '-=', ...args)
  }

  /**
   * Multiply the entity's score by a constant amount.
   *
   * @param amount The amount to multiply the entity's score by.
   */
  multiply(amount: number): this

  /**
   * Multiply the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multiply(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): this

  /**
   * Multiply the current entity's score by other target's scores.
   *
   * @param targetScore The target to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multiply(targetScore: PlayerScore): this

  multiply(...args: OperationArguments) {
    return this.binaryOperation('*=', ...args)
  }

  /**
   * Divide the entity's score by a constant amount.
   *
   * @param amount The amount to divide the entity's score by.
   */
  divide(amount: number): this

  /**
   * Divide the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  divide(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): this

  /**
   * Divide the current entity's score by other target's scores.
   *
   * @param targetScore The target to get the scores from
   */
  divide(targetScore: PlayerScore): this

  divide(...args: OperationArguments) {
    return this.binaryOperation('/=', ...args)
  }

  /**
   * Get the remainder of the division of the current entity's score by a constant amount.
   *
   * @param amount The amount to divide the entity's score by.
   */
  modulo(amount: number): this

  /**
   * Get the remainder of the division of the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  modulo(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): this

  /**
   * Divide the current entity's score by other target's scores.
   *
   * @param targetScore The target to modulo the scores with
   */
  modulo(targetScore: PlayerScore): this

  modulo(...args: OperationArguments) {
    return this.binaryOperation('%=', ...args)
  }

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
  swap(targetScore: PlayerScore): void

  swap(...args: OperationArguments) {
    this.binaryOperation('<>', ...args)
  }

  /** EFFECT-FREE OPERATORS */

  /**
   * Returns a new anonymous score, equal to the current score plus the given amount.
   *
   * @param amount The amount to add to the entity's score.
   */
  plus(amount: number): PlayerScore

  /**
   * Returns a new anonymous score, equal to the sum of the current score and the given targets' score.
   *
   * @param targets The targets to add the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  plus(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): PlayerScore

  /**
   * Returns a new anonymous score, equal to the sum of the current score and the given targets' score.
   *
   * @param targetScore The target to add the scores from
   */
  plus(targetScore: PlayerScore): PlayerScore

  plus(...args: OperationArguments): PlayerScore {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.unaryOperation('add', '+=', ...args)
    return anonymousScore
  }

  /**
   * Returns a new anonymous score, equal to the current score minus the given amount.
   *
   * @param amount The amount to substract from the entity's score.
   */
  minus(amount: number): PlayerScore

  /**
   * Returns a new anonymous score, equal to the difference between the current score and the given targets' score.
   *
   * @param targets The targets to substract the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  minus(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): PlayerScore

  /**
   * Returns a new anonymous score, equal to the difference between the current score and the given targets' score.
   *
   * @param targetScore The target to substract the scores from
   */
  minus(targetScore: PlayerScore): PlayerScore

  minus(...args: OperationArguments): PlayerScore {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.unaryOperation('remove', '-=', ...args)
    return anonymousScore
  }

  /**
   * Returns a new anonymous score, equal to the current score times the given amount.
   *
   * @param amount The amount to multiply the entity's score to.
   */
  multipliedBy(amount: number): PlayerScore

  /**
   * Returns a new anonymous score, equal to the product of the current score and the given targets' score.
   *
   * @param targets The targets to multiply the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multipliedBy(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): PlayerScore

  /**
   * Returns a new anonymous score, equal to the product of the current score and the given targets' score.
   *
   * @param targetScore The target to multiply the scores from
   */
  multipliedBy(targetScore: PlayerScore): PlayerScore

  multipliedBy(...args: OperationArguments): PlayerScore {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.binaryOperation('*=', ...args)
    return anonymousScore
  }

  /**
   * Returns a new anonymous score, equal to the current score divided by the given amount.
   *
   * @param amount The amount to divide the entity's score by.
   */
  dividedBy(amount: number): PlayerScore

  /**
   * Returns a new anonymous score, equal to the division of the current score and the given targets' score.
   *
   * @param targets The targets to divide the scores by
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  dividedBy(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): PlayerScore

  /**
   * Returns a new anonymous score, equal to the division of the current score and the given targets' score.
   *
   * @param targetScore The target to divide the scores by
   */
  dividedBy(targetScore: PlayerScore): PlayerScore

  dividedBy(...args: OperationArguments): PlayerScore {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.binaryOperation('/=', ...args)
    return anonymousScore
  }

  /**
   * Returns a new anonymous score, equal to the current score modulo the given amount.
   *
   * @param amount The amount to modulo the entity's score by.
   */
  moduloBy(amount: number): PlayerScore

  /**
   * Returns a new anonymous score, equal to the modulo of the current score and the given targets' score.
   *
   * @param targets The targets to modulo the scores by
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  moduloBy(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): PlayerScore

  /**
   * Returns a new anonymous score, equal to the modulo of the current score and the given targets' score.
   *
   * @param targetScore The target to divide the scores by
   */
  moduloBy(targetScore: PlayerScore): PlayerScore

  moduloBy(...args: OperationArguments): PlayerScore {
    const anonymousScore = createVariable(this.commandsRoot.Datapack, this.target, this.objective)
    anonymousScore.binaryOperation('%=', ...args)
    return anonymousScore
  }

  /** COMPARISONS OPERATORS */
  private comparison(
    operator: COMPARISON_OPERATORS,
    matchesRange: string,
    args: OperationArguments,
  ): ConditionClass {
    const playerScore = this

    if (typeof args[0] === 'number') {
      return {
        _toMinecraftCondition: () => ({ value: ['if', 'score', playerScore.target, playerScore.objective, 'matches', matchesRange] }),
      }
    }

    const endArgs = args[1] ? args : [args[0]]
    return {
      _toMinecraftCondition: () => ({ value: ['if', 'score', playerScore.target, playerScore.objective, operator, ...endArgs] }),
    }
  }

  /**
   * Check if the current score is strictly greater than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  greaterThan (amount: number) : ConditionClass

  /**
   * Check if the current score is strictly greater than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is strictly greater than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  greaterThan (targetScore: PlayerScore) : ConditionClass

  greaterThan(...args: OperationArguments) {
    return this.comparison('>', `${typeof args[0] === 'number' ? args[0] + 1 : null}..`, args)
  }

  /**
   * Check if the current score is greater or equal than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  greaterOrEqualThan (amount: number) : ConditionClass

  /**
   * Check if the current score is greater or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterOrEqualThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is greater or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  greaterOrEqualThan (targetScore: PlayerScore) : ConditionClass

  greaterOrEqualThan(...args: OperationArguments) {
    return this.comparison('>=', `${args[0]}..`, args)
  }

  /**
   * Check if the current score is strictly lower than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  lowerThan (amount: number) : ConditionClass

  /**
   * Check if the current score is strictly lower than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lowerThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is strictly lower than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  lowerThan (targetScore: PlayerScore) : ConditionClass

  lowerThan(...args: OperationArguments) {
    return this.comparison('<', `..${typeof args[0] === 'number' ? args[0] - 1 : null}`, args)
  }

  /**
   * Check if the current score is lower or equal than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  lowerOrEqualThan (amount: number) : ConditionClass

  /**
   * Check if the current score is lower or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lowerOrEqualThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is lower or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  lowerOrEqualThan (targetScore: PlayerScore) : ConditionClass

  lowerOrEqualThan(...args: OperationArguments) {
    return this.comparison('<=', `..${args[0]}`, args)
  }

  /**
   * Check if the current score is equal to than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  equalTo (amount: number) : ConditionClass

  /**
   * Check if the current score is equal to than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  equalTo (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): ConditionClass

  /**
   * Check if the current score is equal to the given score.
   *
   * @param targets The target to compare the current score against.
   */
  equalTo (targetScore: PlayerScore) : ConditionClass

  equalTo(...args: OperationArguments) {
    return this.comparison('=', args[0].toString(), args)
  }

  /**
   * Check if the current score matches a certain range.
   *
   * @param range The range to compare the current score against.
   */
  matches = (range: Range) => ({
    _toMinecraftCondition: () => ({ value: ['if', 'score', this.target, this.objective, 'matches', rangeParser(range)] }),
  })
}
