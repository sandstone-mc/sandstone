/* eslint-disable camelcase */
import type { LootTableClass, TagClass } from 'sandstone/core'
import type { WithMCNamespace } from 'sandstone/utils'
import type { NumberProvider } from './criteria'
import type { ItemModifierFunction } from './itemModifier'
import type { PredicateCondition } from './predicate'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class XXXXAIJIA {}
type EntryType<TYPE extends string, VALUES extends Record<string, unknown>> = {
  /**
   * Type of entry.
   * Can be:
   * - `item` for item entries,
   * - `tag` for item tags,
   * - `loot_table` to produce items from another loot table,
   * - `group` for child entries,
   * - `alternatives` to select one sub-entry from a list,
   * - `sequence` to select sub-entries until one entry cannot be granted,
   * - `dynamic` to generate block specific drops,
   * - `empty` for an entry that generates nothing.
   */
  type: WithMCNamespace<TYPE>
} & VALUES

export type LootTableEntry = {
  /**
   * Determines conditions for this entry to be used. If multiple conditions are specified, all must pass.
   *
   * @example
   * conditions: [
   *   {
   *     condition: '<condition>',
   *     ...
   *   }
   * ]
   */
  conditions?: PredicateCondition[]

  /**
   * Applies functions to the item stack or item stacks being produced.
   * Functions are applied in order, so for example looting_enchant must be after set_count to work correctly.
   *
   * @example
   * functions: [
   *   {
   *     type: '<type>',
   *     ...,
   *   }
   * ]
   */
  functions?: ItemModifierFunction[]

  /**
   * Determines how often this entry is chosen out of all the entries in the pool.
   * Entries with higher weights are used more often (chance is `this entry's weight / total of all considered entries' weights`).
   */
  weight?: number

  /**
   * Modifies the entry's weight based on the killing/opening/fishing player's luck attribute.
   * Formula is `floor( weight + (quality * generic.luck))`.
   */
  quality?: number
} & (
  | EntryType<
      'item',
      {
        /**
         * ID name of the item to be produced, e.g. `diamond`.
         * The default, if not changed by functions, is a stack of 1 of the default instance of the item.
         */
        name: Registry['minecraft:item']
      }
    >
  | EntryType<
      'tag',
      {
        /** Tag to be used, e.g. `arrows`. */
        name: string | TagClass<'items'>

        /**
         * If set to `true`, it chooses one item of the tag, each with the same weight and quality.
         * If `false`, it generates one of each of the items in the tag.
         */
        expand?: boolean
      }
    >
  | EntryType<
      'loot_table',
      {
        /** Loot table to be used, e.g. `gameplay/fishing/junk` */
        name: string | LootTableClass
      }
    >
  | EntryType<
      'dynamic',
      {
        /** Can be contents for block entity contents or self for banners and player skulls. */
        name: 'contents' | 'self'
      }
    >
  | EntryType<
      'group',
      {
        /** A list of entries that are used to generate loot. Can be used for convenience, e.g. if one condition applies for multiple entries. */
        children: LootTableEntry[]
      }
    >
  | EntryType<
      'alternatives',
      {
        /** A list of entries of which the first, and only the first, successful entry gets generated. */
        children: LootTableEntry[]
      }
    >
  | EntryType<
      'sequence',
      {
        /** A list of entries that are used until the first entry fails. After an entry fails, no more entries of this list are generated */
        children: LootTableEntry[]
      }
    >
)

type LootTablePoll = {
  /**
   * Determines conditions for this pool to be used. If multiple conditions are specified, all must pass.
   *
   * @example
   * conditions: [
   *   {
   *     condition: '<condition>',
   *     ...
   *   }
   * ]
   */
  conditions?: PredicateCondition[]

  /**
   * Applies functions to all item stacks produced by this pool.
   * Functions are applied in order, so for example `looting_enchant` must be after `set_count` to work correctly.
   *
   * @example
   * functions: [
   *   {
   *     type: '<type>',
   *     ...,
   *   }
   * ]
   */
  functions?: ItemModifierFunction[]

  /** Specifies the number of rolls on the pool. */
  rolls: NumberProvider
  /** Specifies the number of rolls on the pool. */
  bonus_rolls?: NumberProvider

  /**
   * A list of all things that can be produced by this pool.
   * One entry is chosen per roll as a weighted random selection from all entries without failing conditions.
   *
   * @example
   * entries: [
   *   // First entry
   *   {
   *     type: '<type1>',
   *     ...
   *   },
   *   // Second entry
   *   {
   *     type: '<type2>',
   *     ...
   *   },
   * ]
   */
  entries: LootTableEntry[]
}

export type LootTableJSON = {
  /**
   * Optional type of the loot table.
   * Must be one of:
   * - `empty` if the loot table does not generate any loot
   * - `entity` for loot an entity drops
   * - `block` for loot a block drops
   * - `chest` for a treasure chest
   * - `fishing` for a fishing loot table
   * - `gift` for a cat or villager gift,
   * - `advancement_reward` if it's used as a reward for an advancement
   * - `barter` for loot from bartering with piglins
   * - `command` for loot from `/loot`
   * - `selector`,
   * - `advancement_entity`
   * - `generic` if none of the above apply.
   */
  type?: WithMCNamespace<
    | 'empty'
    | 'entity'
    | 'block'
    | 'chest'
    | 'fishing'
    | 'gift'
    | 'advancement_reward'
    | 'barter'
    | 'command'
    | 'selector'
    | 'advancement_entity'
    | 'generic'
  >

  /**
   * Applies functions to all item stacks produced by this table.
   * Functions are applied in order, so for example looting_enchant must be after set_count to work correctly.
   *
   * @example
   * functions: [
   *   {
   *     type: '<type>',
   *     ...,
   *   }
   * ]
   */
  functions?: ItemModifierFunction[]

  /**
   * A list of all pools for this loot table.
   * Each pool used generates items from its list of items based on the number of rolls.
   *
   * Pools are applied in order.
   *
   * @example
   * pools: [
   *   // First pool
   *   {
   *     entries: [{...}],
   *     conditions: [{...}],
   *     ...
   *   },
   *   // Second pool
   *   {
   *     entries: [{...}],
   *     conditions: [{...}],
   *     ...
   *   },
   * ]
   */
  pools?: LootTablePoll[]
}
