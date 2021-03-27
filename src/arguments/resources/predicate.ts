/* eslint-disable camelcase */
import type { BLOCKS, ENCHANTMENTS } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'
import type {
  DamageCriterion, EntityCriterion, ItemCriterion, LocationCriterion,
  NumberOrMinMax,
} from './criteria'

type PredicateKind<NAME extends string, VALUES extends Record<string, unknown>> = {
    /**
     * The condition's ID.
     *
     * One of:
     * - `alternative`: Joins conditions from parameter terms with "or".
     *
     * - `block_state_property`: Check properties of a block state.
     *
     * - `damage_source_properties`: Check properties of damage source.
     *
     * - `entity_properties`: Test properties of an entity.
     *
     * - `entity_scores`: Test the scoreboard scores of an entity.
     *
     * - `inverted`: Inverts condition from parameter term.
     *
     * - `killed_by_player`: Test if a `killer_player` entity is available.
     *
     * - `location_check`:  Checks if the current location matches.
     *
     * - `match_tool`: Checks tool.
     *
     * - `random_chance`: Test if a random number 0.0–1.0 is less than a specified value.
     *
     * - `random_chance_with_looting`: Test if a random number 0.0–1.0 is less than a specified value, affected by the level of Looting on the `killer` entity.
     *
     * - `reference`: Test if another referred condition (predicate) passes.
     *
     * - `survives_explosion`: Returns true with 1/explosion radius probability.
     *
     * - `table_bonus`: Passes with probability picked from table, indexed by enchantment level.
     *
     * - `time_check`: Checks the current time
     *
     * - `weather_check `: Checks for a current weather state
     *
     * - `value_check`: Checks for range of value
     */
    condition: NAME
} & VALUES

export type ObjectOrArray<T> = T | T[]

export type PredicateCondition = (
  PredicateKind<'minecraft:alternative', {
      /**
       * A list of conditions to join using `or`.
       * @example
       * terms: [{  }]
       */
      terms: PredicateCondition[]
  }> | PredicateKind<'minecraft:block_state_property', {
      /** A block ID. The test fails if the block doesn't match. */
      block: LiteralUnion<BLOCKS>
      /** A map of block property names to values. All values are strings. The test fails if the block doesn't match. */
      properties?: Record<string, string>
  }> | PredicateKind<'minecraft:damage_source_properties', {
      /** Predicate applied to the damage source. */
      predicate: DamageCriterion
  }> | PredicateKind<'minecraft:entity_properties', {
      /**
       * Specifies the entity to check for the condition.
       * Set to `this` to use the entity that died or the player that gained the advancement, opened the container or broke the block.
       * `killer` for the killer.
       * `killer_player` for a killer that is a player.
       */
      entity: 'this' | 'killer' | 'killer_player'

      /** Predicate applied to entity. */
      predicate: EntityCriterion
  }> | PredicateKind<'minecraft:entity_scores', {
      /**
       * Specifies the entity to check for the condition.
       * Set to `this` to use the entity that died or the player that gained the advancement, opened the container or broke the block.
       * `killer` for the killer.
       * `killer_player` for a killer that is a player.
       */
      entity: 'this' | 'killer' | 'killer_player'

      /**
       * Scores to check. All specified scores must pass for the condition to pass.
       * Key name are the objectives, while the value are the required score.
       *
       * @example
       * scores: {
       *   'myscore': 0,
       *   'myscore2': {
       *     min: 5,
       *     max: 20,
       *   }
       * }
       */
      scores: Record<string, NumberOrMinMax>
  }> | PredicateKind<'minecraft:inverted', {
      /** The condition to be negated. */
      term: PredicateJSON
  }> | PredicateKind<'minecraft:killed_by_player', {
      /** If true, the condition passes if killer_player is not available. */
      inverse: boolean
  }> | PredicateKind<'minecraft:location_check', {
      /** Optional offsets to location on X axis. */
      offsetX?: number
      /** Optional offsets to location on Y axis. */
      offsetY?: number
      /** Optional offsets to location on Z axis. */
      offsetZ?: number

      /** Predicate applied to location. */
      predicate: LocationCriterion
  }> | PredicateKind<'minecraft:match_tool', {
      /** Predicate applied to item. */
      predicate: ItemCriterion
  }> | PredicateKind<'minecraft:random_chance', {
      /** Success rate as a number from 0.0 to 1.0. */
      chance: number
  }> | PredicateKind<'minecraft:random_chance', {
      /** Success rate as a number from 0.0 to 1.0. */
      chance: number
  }> | PredicateKind<'minecraft:random_chance_with_looting', {
      /** Base success rate, from 0.0 to 1.0. */
      chance: number

      /** Looting adjustment to the base success rate. Formula is `chance + (looting_level * looting_multiplier)` */
      looting_multiplier: number
  }> | PredicateKind<'minecraft:reference', {
      /** The namespaced ID of the condition (predicate) referred to. A cyclic reference causes a parsing failure. */
      name: string
  }> | PredicateKind<'minecraft:table_bonus', {
      /** Id of enchantment. */
      enchantment: LiteralUnion<ENCHANTMENTS>
      /** List of probabilities for enchantment level, indexed from 0. */
      chances: number[]
  }> | PredicateKind<'minecraft:time_check', {
      /** The time value in ticks. */
      value: NumberOrMinMax

      /**
       * If present, time gets modulo-divided by this value.
       *
       * For example, if set to 24000, value operates on a time period of days.
       */
      period?: number
  }> | PredicateKind<'minecraft:weather_check', {
      /**  If true, the condition evaluates to true only if it's raining. */
      raining?: boolean

      /** If true, the condition evaluates to true only if it's thundering. */
      thundering?: boolean
  }>
) |never

/**
 * A predicate, or a list of predicates.
 * You must specify a `condition` before anything else.
 *
 * @example
 *
 * {
 *   condition: '<any condition>',
 *   // ...
 * }
 *
 * [
 *   {
 *     condition: 'minecraft:match_tool',
 *     predicate: {
 *       item: 'minecraft:diamond_pickaxe',
 *     }
 *   },
 *   {
 *     condition: 'minecraft:random_chance',
 *     chance: 0.5,
 *   }
 * ]
 */
export type PredicateJSON = ObjectOrArray<PredicateCondition>
