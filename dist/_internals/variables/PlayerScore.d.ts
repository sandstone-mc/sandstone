import type { ObjectiveArgument, SelectorArgument } from '@arguments';
import { MinecraftCondition } from '@arguments/condition';
import type { CommandsRoot } from '@commands';
import type { ObjectiveClass } from './Objective';
declare type PlayersTarget = number | SelectorArgument<false>;
export declare class PlayerScore {
    static anonymousScoreId: number;
    commandsRoot: CommandsRoot;
    target: SelectorArgument<false>;
    objective: ObjectiveClass;
    constructor(commandsRoot: CommandsRoot, target: SelectorArgument<false>, objective: ObjectiveClass);
    toString(): string;
    private unaryOperation;
    private binaryOperation;
    /** INLINE OPERATORS */
    /**
     * Set the entity's score to a given amount.
     *
     * @param amount The amount to set the entity's score to.
     */
    set(amount: number): void;
    /**
     * Set the current entity's score to other entities's scores.
     *
     * @param targets The targets to get the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    set(targets: PlayersTarget, objective?: ObjectiveArgument): void;
    /**
     * Set the current entity's score to other entities's scores.
     *
     * @param targetScore The target to get the scores from
     */
    set(targetScore: PlayerScore): void;
    /**
     * Adds a constant amount to the entity's score.
     *
     * @param amount The amount to add to the entity's score.
    */
    add(amount: number): void;
    /**
     * Adds other entities's scores to the current entity's score.
     *
     * @param targets The targets to add the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    add(targets: SelectorArgument<false>, objective?: ObjectiveArgument): void;
    /**
     * Adds other target's scores to the current entity's score.
     *
     * @param targetScore The target to add the scores from
     */
    add(targetScore: PlayerScore): void;
    /**
     * Substract a constant amount from the entity's score.
     *
     * @param amount The amount to substract to the entity's score.
    */
    remove(amount: number): void;
    /**
    * Substract other target's scores from the current entity's score.
    *
    * @param targets The targets to get the scores from
    *
    * @param objective The related objective. If not specified, default to the same objective as the current target.
    */
    remove(targets: SelectorArgument<false>, objective?: ObjectiveArgument): void;
    /**
    * Substract other entities's scores from the current entity's score.
    *
    * @param targetScore The target to get the scores from
    */
    remove(targetScore: PlayerScore): void;
    /**
     * Multiply the entity's score by a constant amount.
     *
     * @param amount The amount to multiply the entity's score by.
     */
    multiply(amount: number): void;
    /**
     * Multiply the current entity's score by other entities's scores.
     *
     * @param targets The targets to get the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    multiply(targets: SelectorArgument<false>, objective?: ObjectiveArgument): void;
    /**
     * Multiply the current entity's score by other target's scores.
     *
     * @param targetScore The target to get the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    multiply(targetScore: PlayerScore): void;
    /**
     * Divide the entity's score by a constant amount.
     *
     * @param amount The amount to divide the entity's score by.
     */
    divide(amount: number): void;
    /**
     * Divide the current entity's score by other entities's scores.
     *
     * @param targets The targets to get the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    divide(targets: SelectorArgument<false>, objective?: ObjectiveArgument): void;
    /**
     * Divide the current entity's score by other target's scores.
     *
     * @param targetScore The target to get the scores from
     */
    divide(targetScore: PlayerScore): void;
    /**
     * Get the remainder of the division of the current entity's score by a constant amount.
     *
     * @param amount The amount to divide the entity's score by.
     */
    modulo(amount: number): void;
    /**
     * Get the remainder of the division of the current entity's score by other entities's scores.
     *
     * @param targets The targets to get the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    modulo(targets: SelectorArgument<false>, objective?: ObjectiveArgument): void;
    /**
     * Divide the current entity's score by other target's scores.
     *
     * @param targetScore The target to modulo the scores with
     */
    modulo(targetScore: PlayerScore): void;
    /**
     * Swap the current score with the other targets' scores.
     *
     * @param targets The targets to swap the scores with
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    swap(targets: SelectorArgument<false>, objective?: ObjectiveArgument): void;
    /**
     * Swap the current entity's score with the other target's scores.
     *
     * @param targetScore The target to swap the scores with
     */
    swap(targetScore: PlayerScore): void;
    /** EFFECT-FREE OPERATORS */
    protected createAnonymousScore(amount: number): PlayerScore;
    protected createAnonymousScore(targets: SelectorArgument<false>, objective?: ObjectiveArgument): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the current score plus the given amount.
     *
     * @param amount The amount to add to the entity's score.
     */
    plus(amount: number): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the sum of the current score and the given targets' score.
     *
     * @param targets The targets to add the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    plus(targets: SelectorArgument<false>, objective?: ObjectiveArgument): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the sum of the current score and the given targets' score.
     *
     * @param targetScore The target to add the scores from
     */
    plus(targetScore: PlayerScore): void;
    /**
     * Returns a new anonymous score, equal to the current score minus the given amount.
     *
     * @param amount The amount to substract from the entity's score.
     */
    minus(amount: number): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the difference between the current score and the given targets' score.
     *
     * @param targets The targets to substract the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    minus(targets: SelectorArgument<false>, objective?: ObjectiveArgument): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the difference between the current score and the given targets' score.
     *
     * @param targetScore The target to substract the scores from
     */
    minus(targetScore: PlayerScore): void;
    /**
     * Returns a new anonymous score, equal to the current score times the given amount.
     *
     * @param amount The amount to multiply the entity's score to.
     */
    multipliedBy(amount: number): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the product of the current score and the given targets' score.
     *
     * @param targets The targets to multiply the scores from
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    multipliedBy(targets: SelectorArgument<false>, objective?: ObjectiveArgument): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the product of the current score and the given targets' score.
     *
     * @param targetScore The target to multiply the scores from
     */
    multipliedBy(targetScore: PlayerScore): void;
    /**
     * Returns a new anonymous score, equal to the current score divided by the given amount.
     *
     * @param amount The amount to divide the entity's score by.
     */
    dividedBy(amount: number): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the division of the current score and the given targets' score.
     *
     * @param targets The targets to divide the scores by
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    dividedBy(targets: SelectorArgument<false>, objective?: ObjectiveArgument): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the division of the current score and the given targets' score.
     *
     * @param targetScore The target to divide the scores by
     */
    dividedBy(targetScore: PlayerScore): void;
    /**
     * Returns a new anonymous score, equal to the current score modulo the given amount.
     *
     * @param amount The amount to modulo the entity's score by.
     */
    moduloBy(amount: number): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the modulo of the current score and the given targets' score.
     *
     * @param targets The targets to modulo the scores by
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    moduloBy(targets: SelectorArgument<false>, objective?: ObjectiveArgument): PlayerScore;
    /**
     * Returns a new anonymous score, equal to the modulo of the current score and the given targets' score.
     *
     * @param targetScore The target to divide the scores by
     */
    moduloBy(targetScore: PlayerScore): void;
    /** COMPARISONS OPERATORS */
    private comparison;
    /**
     * Check if the current score is strictly greater than the given number.
     *
     * @param amount The number to compare the current score against.
     */
    greaterThan(amount: number): MinecraftCondition;
    /**
     * Check if the current score is strictly greater than the given score.
     *
     * @param targets The target to compare the current score against.
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    greaterThan(targets: SelectorArgument<false>, objective?: ObjectiveArgument): MinecraftCondition;
    /**
     * Check if the current score is strictly greater than the given score.
     *
     * @param targets The target to compare the current score against.
     */
    greaterThan(targetScore: PlayerScore): MinecraftCondition;
    /**
     * Check if the current score is greater or equal than the given number.
     *
     * @param amount The number to compare the current score against.
     */
    greaterOrEqualThan(amount: number): MinecraftCondition;
    /**
     * Check if the current score is greater or equal than the given score.
     *
     * @param targets The target to compare the current score against.
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    greaterOrEqualThan(targets: SelectorArgument<false>, objective?: ObjectiveArgument): MinecraftCondition;
    /**
     * Check if the current score is greater or equal than the given score.
     *
     * @param targets The target to compare the current score against.
     */
    greaterOrEqualThan(targetScore: PlayerScore): MinecraftCondition;
    /**
     * Check if the current score is strictly lower than the given number.
     *
     * @param amount The number to compare the current score against.
     */
    lowerThan(amount: number): MinecraftCondition;
    /**
     * Check if the current score is strictly lower than the given score.
     *
     * @param targets The target to compare the current score against.
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    lowerThan(targets: SelectorArgument<false>, objective?: ObjectiveArgument): MinecraftCondition;
    /**
     * Check if the current score is strictly lower than the given score.
     *
     * @param targets The target to compare the current score against.
     */
    lowerThan(targetScore: PlayerScore): MinecraftCondition;
    /**
     * Check if the current score is lower or equal than the given number.
     *
     * @param amount The number to compare the current score against.
     */
    lowerOrEqualThan(amount: number): MinecraftCondition;
    /**
     * Check if the current score is lower or equal than the given score.
     *
     * @param targets The target to compare the current score against.
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    lowerOrEqualThan(targets: SelectorArgument<false>, objective?: ObjectiveArgument): MinecraftCondition;
    /**
     * Check if the current score is lower or equal than the given score.
     *
     * @param targets The target to compare the current score against.
     */
    lowerOrEqualThan(targetScore: PlayerScore): MinecraftCondition;
    /**
     * Check if the current score is equal to than the given number.
     *
     * @param amount The number to compare the current score against.
     */
    equalTo(amount: number): MinecraftCondition;
    /**
     * Check if the current score is equal to than the given score.
     *
     * @param targets The target to compare the current score against.
     *
     * @param objective The related objective. If not specified, default to the same objective as the current target.
     */
    equalTo(targets: SelectorArgument<false>, objective?: ObjectiveArgument): MinecraftCondition;
    /**
     * Check if the current score is equal to the given score.
     *
     * @param targets The target to compare the current score against.
     */
    equalTo(targetScore: PlayerScore): MinecraftCondition;
}
export {};
