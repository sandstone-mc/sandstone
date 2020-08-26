import type {
  COMPARISON_OPERATORS, MultipleEntitiesArgument, ObjectiveArgument, OPERATORS,
} from '@arguments'
import { MinecraftCondition } from '@arguments/condition'
import type { CommandsRoot } from '@commands'
import type { ObjectiveClass } from './Objective'

type PlayersTarget = number | MultipleEntitiesArgument

type OperationArguments = (
  [amount: number] |
  [targets: PlayersTarget, objective?: ObjectiveArgument] |
  [targetScore: PlayerScore]
)

export class PlayerScore {
  static anonymousScoreId = 0

  commandsRoot: CommandsRoot

  target: MultipleEntitiesArgument

  objective: ObjectiveClass

  constructor(commandsRoot: CommandsRoot, target: MultipleEntitiesArgument, objective: ObjectiveClass) {
    this.commandsRoot = commandsRoot
    this.target = target
    this.objective = objective
  }

  toString() {
    return `${this.target} ${this.objective}`
  }

  private unaryOperation(
    operation: 'add' | 'remove' | 'set',
    operator: OPERATORS,
    ...args: OperationArguments
  ) {
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
  }

  private binaryOperation(operator: OPERATORS, ...args: OperationArguments) {
    if (args[0] instanceof PlayerScore) {
      this.commandsRoot.scoreboard.players.operation(
        this.target, this.objective, operator, args[0].target, args[0].objective,
      )
      return
    }

    if (typeof args[0] === 'number') {
      this.commandsRoot.Datapack.registerNewConstant(args[0])
    }

    this.commandsRoot.scoreboard.players.operation(
      this.target, this.objective, operator, args[0], args[1] ?? this.objective,
    )
  }

  /** INLINE OPERATORS */
  /**
   * Set the entity's score to a given amount.
   *
   * @param amount The amount to set the entity's score to.
   */
  set(amount: number): void

  /**
   * Set the current entity's score to other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  set(targets: PlayersTarget, objective?: ObjectiveArgument): void

  /**
   * Set the current entity's score to other entities's scores.
   *
   * @param targetScore The target to get the scores from
   */
  set(targetScore: PlayerScore): void

  set(...args: OperationArguments) {
    this.unaryOperation('set', '=', ...args)
  }

  /**
   * Adds a constant amount to the entity's score.
   *
   * @param amount The amount to add to the entity's score.
  */
  add(amount: number): void

  /**
   * Adds other entities's scores to the current entity's score.
   *
   * @param targets The targets to add the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  add(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): void

  /**
   * Adds other target's scores to the current entity's score.
   *
   * @param targetScore The target to add the scores from
   */
  add(targetScore: PlayerScore): void

  add(...args: OperationArguments) {
    this.unaryOperation('add', '+=', ...args)
  }

  /**
   * Substract a constant amount from the entity's score.
   *
   * @param amount The amount to substract to the entity's score.
  */
  remove(amount: number): void

  /**
  * Substract other target's scores from the current entity's score.
  *
  * @param targets The targets to get the scores from
  *
  * @param objective The related objective. If not specified, default to the same objective as the current target.
  */
  remove(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): void

  /**
  * Substract other entities's scores from the current entity's score.
  *
  * @param targetScore The target to get the scores from
  */
  remove(targetScore: PlayerScore): void

  remove(...args: OperationArguments) {
    this.unaryOperation('remove', '-=', ...args)
  }

  /**
   * Multiply the entity's score by a constant amount.
   *
   * @param amount The amount to multiply the entity's score by.
   */
  multiply(amount: number): void

  /**
   * Multiply the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multiply(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): void

  /**
   * Multiply the current entity's score by other target's scores.
   *
   * @param targetScore The target to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  multiply(targetScore: PlayerScore): void

  multiply(...args: OperationArguments) {
    this.binaryOperation('*=', ...args)
  }

  /**
   * Divide the entity's score by a constant amount.
   *
   * @param amount The amount to divide the entity's score by.
   */
  divide(amount: number): void

  /**
   * Divide the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  divide(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): void

  /**
   * Divide the current entity's score by other target's scores.
   *
   * @param targetScore The target to get the scores from
   */
  divide(targetScore: PlayerScore): void

  divide(...args: OperationArguments) {
    this.binaryOperation('/=', ...args)
  }

  /**
   * Get the remainder of the division of the current entity's score by a constant amount.
   *
   * @param amount The amount to divide the entity's score by.
   */
  modulo(amount: number): void

  /**
   * Get the remainder of the division of the current entity's score by other entities's scores.
   *
   * @param targets The targets to get the scores from
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  modulo(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): void

  /**
   * Divide the current entity's score by other target's scores.
   *
   * @param targetScore The target to modulo the scores with
   */
  modulo(targetScore: PlayerScore): void

  modulo(...args: OperationArguments) {
    this.binaryOperation('%=', ...args)
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
  protected createAnonymousScore(amount: number): PlayerScore

  protected createAnonymousScore(targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): PlayerScore

  protected createAnonymousScore(amountOrTargets: PlayersTarget, objective: ObjectiveArgument = this.objective): PlayerScore {
    const anonymousScore = new PlayerScore(
      this.commandsRoot,
      `#__anonymous_${PlayerScore.anonymousScoreId}__`,
      this.objective,
    )
    if (typeof amountOrTargets === 'number') {
      anonymousScore.set(amountOrTargets)
    } else {
      anonymousScore.set(amountOrTargets, objective)
    }

    PlayerScore.anonymousScoreId += 1

    return anonymousScore
  }

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
  plus(targetScore: PlayerScore): void

  plus(...args: OperationArguments): PlayerScore {
    const anonymousScore = this.createAnonymousScore(this.target, this.objective)
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
  minus(targetScore: PlayerScore): void

  minus(...args: OperationArguments): PlayerScore {
    const anonymousScore = this.createAnonymousScore(this.target, this.objective)
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
  multipliedBy(targetScore: PlayerScore): void

  multipliedBy(...args: OperationArguments): PlayerScore {
    const anonymousScore = this.createAnonymousScore(this.target, this.objective)
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
  dividedBy(targetScore: PlayerScore): void

  dividedBy(...args: OperationArguments): PlayerScore {
    const anonymousScore = this.createAnonymousScore(this.target, this.objective)
    anonymousScore.binaryOperation('*=', ...args)
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
  moduloBy(targetScore: PlayerScore): void

  moduloBy(...args: OperationArguments): PlayerScore {
    const anonymousScore = this.createAnonymousScore(this.target, this.objective)
    anonymousScore.binaryOperation('%=', ...args)
    return anonymousScore
  }

  /** COMPARISONS OPERATORS */
  private comparison(
    operator: COMPARISON_OPERATORS,
    matchesRange: string,
    args: OperationArguments,
  ): MinecraftCondition {
    if (typeof args[0] === 'number') {
      return {
        value: ['score', this.target, this.objective, 'matches', matchesRange],
      }
    }

    const endArgs = args[1] ? args : [args[0]]
    return {
      value: ['score', this.target, this.objective, operator, ...endArgs],
    }
  }

  /**
   * Check if the current score is strictly greater than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  greaterThan (amount: number) : MinecraftCondition

  /**
   * Check if the current score is strictly greater than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): MinecraftCondition

  /**
   * Check if the current score is strictly greater than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  greaterThan (targetScore: PlayerScore) : MinecraftCondition

  greaterThan(...args: OperationArguments) {
    return this.comparison('>', `${typeof args[0] === 'number' ? args[0] + 1 : null}..`, args)
  }

  /**
   * Check if the current score is greater or equal than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  greaterOrEqualThan (amount: number) : MinecraftCondition

  /**
   * Check if the current score is greater or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  greaterOrEqualThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): MinecraftCondition

  /**
   * Check if the current score is greater or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  greaterOrEqualThan (targetScore: PlayerScore) : MinecraftCondition

  greaterOrEqualThan(...args: OperationArguments) {
    return this.comparison('>=', `${args[0]}..`, args)
  }

  /**
   * Check if the current score is strictly lower than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  lowerThan (amount: number) : MinecraftCondition

  /**
   * Check if the current score is strictly lower than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lowerThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): MinecraftCondition

  /**
   * Check if the current score is strictly lower than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  lowerThan (targetScore: PlayerScore) : MinecraftCondition

  lowerThan(...args: OperationArguments) {
    return this.comparison('<', `..${typeof args[0] === 'number' ? args[0] - 1 : null}`, args)
  }

  /**
   * Check if the current score is lower or equal than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  lowerOrEqualThan (amount: number) : MinecraftCondition

  /**
   * Check if the current score is lower or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  lowerOrEqualThan (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): MinecraftCondition

  /**
   * Check if the current score is lower or equal than the given score.
   *
   * @param targets The target to compare the current score against.
   */
  lowerOrEqualThan (targetScore: PlayerScore) : MinecraftCondition

  lowerOrEqualThan(...args: OperationArguments) {
    return this.comparison('<=', `..${args[0]}`, args)
  }

  /**
   * Check if the current score is equal to than the given number.
   *
   * @param amount The number to compare the current score against.
   */
  equalTo (amount: number) : MinecraftCondition

  /**
   * Check if the current score is equal to than the given score.
   *
   * @param targets The target to compare the current score against.
   *
   * @param objective The related objective. If not specified, default to the same objective as the current target.
   */
  equalTo (targets: MultipleEntitiesArgument, objective?: ObjectiveArgument): MinecraftCondition

  /**
   * Check if the current score is equal to the given score.
   *
   * @param targets The target to compare the current score against.
   */
  equalTo (targetScore: PlayerScore) : MinecraftCondition

  equalTo(...args: OperationArguments) {
    return this.comparison('=', args[0].toString(), args)
  }
}
