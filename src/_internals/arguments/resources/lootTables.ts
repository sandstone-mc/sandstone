/* eslint-disable camelcase */
import type { LiteralUnion } from '@/generalTypes'
import type { MAP_ICONS } from '@arguments/basics'
import type {
  BLOCKS, ENCHANTMENTS, ITEMS, STRUCTURES,
} from '@arguments/generated'
import type { JsonTextComponent } from '@arguments/jsonTextComponent'
import type { NumberOrMinMax } from './criteria'
import type { ObjectOrArray, PredicateCondition } from './predicate'

type FunctionType<TYPE extends string, VALUES extends Record<string, unknown>> = {
  /**
   * The function to apply. Must be one of the following:
   * - `apply_bonus`: Applies a predefined bonus formula.
   * - `copy_name`: For loot table type 'block', copies a block entity's `CustomName` tag into the item's `display.Name` tag.
   * - `copy_nbt`: Copies nbt to the item's `tag` tag.
   * - `copy_state`: Copies state properties from dropped block to the item's `BlockStateTag` tag.
   * - `enchant_randomly`: Enchants the item with one randomly-selected enchantment. The level of the enchantment, if applicable, is random.
   * - `enchant_with_levels`: Enchants the item, with the specified [enchantment level](https://minecraft.gamepedia.com/Enchantment_mechanics#How_Enchantments_Are_Chosen)`
   *   (roughly equivalent to using an `enchantment table` at that level).
   * - `exploration_map`: Converts an empty map into an `explorer map` leading to a nearby generated structure.
   * - `explosion_decay`: For loot tables of type 'block', removes some items from a stack, if there was an explosion. Each item has a chance of 1/explosion radius to be lost.
   * - `furnace_smelt`: Smelts the item as it would be in a furnace. Used in combination with the `entity_properties` condition to cook food from animals on death.
   * - `fill_player_head`: Adds required item tags of a player head
   * - `limit_count`: Limits the count of every item stack.
   * - `looting_enchant`: Adjusts the stack size based on the level of the `Looting` enchantment on the `killer` entity.
   * - `set_attributes`: Add `attribute` modifiers to the item.
   * - `set_contents`: For loot tables of type 'block', sets the contents of a container block item to a list of entries.
   * - `set_count`: Sets the stack size.
   * - `set_damage`: Sets the item's damage value (durability) for tools.
   * - `set_loot_table`: Sets the loot table for a container (chest etc.).
   * - `set_lore`: Adds lore to the item
   * - `set_name`: Adds display name of the item.
   * - `set_nbt`: Adds NBT data to the item.
   * - `set_stew_effect`: Sets the status effects for `suspicious stew`.
   */
  function: TYPE
} & VALUES

type ATTRIBUTE_SLOTS = 'mainhand' | 'offhand' | 'feet' | 'legs' | 'chest' | 'head'

type LootTableFunction = {
  /** Determines conditions for this function to be applied. If multiple conditions are specified, all must pass. */
  conditions?: PredicateCondition[]
} & (
  FunctionType<'apply_bonus', {
    /** Enchantment ID used for level calculation. */
    enchantment: LiteralUnion<ENCHANTMENTS>
  } & ({
    /**
     * Can be:
     * - `binomial_with_bonus_count` for a binomial distribution (with `n=level + extra`, `p=probability`),
     * - `uniform_bonus_count` for uniform distribution (from `0` to `level * bonusMultiplier`)
     * - `ore_drops` for a special function used for ore drops in the vanilla game (`Count * (max(0; random(0..Level + 2) - 1)+1)`)
     */
    formula: 'binomial_with_bonus_count' | 'uniform_bonus_count' | 'ore_rops'

    /** Values required for the formula. */
    parameters: {
      /** For formula `binomial_with_bonus_count`, the extra value. */
      extra?: number
      /** For formula `binomial_with_bonus_count`, the probability. */
      probability?: number
      /** For formula `uniform_bonus_count`, the bonus multiplier. */
      bonusMultiplier?: number
    }
  })>
  | FunctionType<'copy_name', {
    /** Needs to be set to `block_entity`. */
    source: 'block_entity'
  }>
  | FunctionType<'copy_nbt', {
    /**
     * Specifies the source. Must be one of:
     * - `block_entity` for the block entity of the destroyed block
     * - `this` to use the entity that died or the player that gained the loot table
     * - `opened` the container or broke the block,
     * - `killer` for the killer,
     * - `killer_player` for a killer that is a player.
     */
    source: 'block_entity' | 'this' | 'killer' | 'killer_player'

    /** An operation, or a list of operations. */
    ops: ObjectOrArray<{
      /** The nbt path to copy from. */
      source: string
      /** The nbt path to copy to, starting from the item's tag tag. */
     target: string
     /** Can be `replace` to replace any existing contents of the target, `append` to append to a list, or `merge` to merge into a compound tag. */
     op: 'replace' | 'append' | 'merge'
    }>
  }>
  | FunctionType<'copy_state', {
    /** A block ID. Function fails if the block doesn't match. */
    block?: LiteralUnion<BLOCKS>
    /** A list of property names to copy. */
    properties: string[]
  }>
  | FunctionType<'enchant_randomly', {
    /** List of enchantment IDs to choose from. If omitted, all enchantments applicable to the item are possible. */
    enchantments: LiteralUnion<ENCHANTMENTS>[]
  }>
  | FunctionType<'enchant_with_levels', {
    /** Determines whether treasure enchantments are allowed on this item. */
    treasure?: boolean
    /** Specifies a random enchantment level, as an exact number or a range. */
    levels: NumberOrMinMax
  }>
  | FunctionType<'exploration_map', {
    /** The type of generated structure to locate. Accepts any of the StructureTypes used by the `/locate` command (case insensitive). */
    destination: LiteralUnion<STRUCTURES>
    /**
     * The icon used to mark the destination on the map. Accepts any of the map icon text IDs (case insensitive).
     * If `mansion` or `monument` is used, the color of the lines on the item texture changes to match the corresponding explorer map.
     */
    decoration?: LiteralUnion<MAP_ICONS>
    /** The zoom level of the resulting map. Defaults to 2. */
    zoom?: number
    /**
     * The size, in chunks, of the area to search for structures.
     * The area checked is square, not circular.
     * Radius `0` causes only the current chunk to be searched,
     * radius `1` causes the current chunk and eight adjacent chunks to be searched, and so on.
     * Defaults to `50`.
     */
    search_radius?: number
    /** Don't search in chunks that have already been generated. Defaults to `true`. */
    skip_existing_chunks?: boolean
  }>
  | FunctionType<'explosion_decay', {
    // No properties
  }>
  | FunctionType<'furnace_smelt', {
    // No properties
  }>
  | FunctionType<'fill_player_head', {
    /**
     * Specifies an entity to be used for the player head. Set to:
     * - `this` to use the entity that died or the player that gained the advancement,
     *   opened the container or broke the block
     * - `killer` for the killer
     * - `killer_player` for a killer that is a player.
     */
    entity: 'this' | 'killer' | 'killer_player'
  }>
  | FunctionType<'limit_count', {
    /** Specify the count limit of every item stack. */
    limit: NumberOrMinMax
  }>
  | FunctionType<'looting_enchant', {
    /**
     * If a number is given, it specifies an exact number
     * of additional items per level of looting.
     *
     * If a range is given, it specifies a random number
     * (within a range) of additional items per level of looting.
     * Note the random number generated may be fractional, rounded after multiplying by the looting level.
     *
     */
    count?: NumberOrMinMax
    /**
     * Specifies the maximum amount of items in the stack after the looting calculation.
     * If the value is `0`, no limit is applied.
     */
    limit?: number
  }>
  | FunctionType<'set_attributes', {
    /** The modifiers to apply to the item. */
    modifiers: {
      name: string
      attribute: string
      operation: 'addition' | 'multiply_base' | 'multiply_total'
      amount: NumberOrMinMax
      id?: string

      /**
       * Slots the item must be in for the modifier to take effect.
       * This value can be one of the following : `mainhand`, `offhand`, `feet`, `legs`, `chest`, or `head`.
       *
       * If a list is given, one of the listed slots will be chosen randomly.
       *
       */
      slot?: ATTRIBUTE_SLOTS | ATTRIBUTE_SLOTS[]
    }[]
  }>
  | FunctionType<'set_contents', {
    /** For loot tables of type 'block', sets the contents of a container block item to a list of entries. */
    entries: LootTableEntry[]
  }>
  | FunctionType<'set_count', {
    /** Specifies the exact stack size to set, or a random stack size within a range. */
    count: number | {
      /**
       * The distribution type. Must be:
       * - `uniform`: Uniform distribution. A random integer is chosen with probability of each number being equal.
       * - `binomial`: Binomial distribution. Roll a number of times, each having a chance of adding 1 to the stack size.
       */
      type: 'uniform'
      /** Minimum stack size. */
      min: number
      /** Maximum stack size. */
      max: number
    } | {
      /**
       * The distribution type. Must be:
       * - `uniform`: Uniform distribution. A random integer is chosen with probability of each number being equal.
       * - `binomial`: Binomial distribution. Roll a number of times, each having a chance of adding 1 to the stack size.
       */
      type: 'binomial'
      /** Number of rolls. */
      n: number
      /** Chance of each roll. */
      p: number
    }
  }>
  | FunctionType<'set_damage', {
    /**
     * If a number is given, it specifies the damage fraction to set
     * (1.0 is undamaged, 0.0 is zero durability left).
     *
     * If a range is give, it specifies a random damage fraction within the given range.
     */
    damage: NumberOrMinMax
  }>
  | FunctionType<'set_loot_table', {
    /** Specifies the resource location of the loot table to be used. */
    name: string
    /** Optional. Specifies the loot table seed. If absent or set to 0, a random seed will be used. */
    seed?: number
  }>
  | FunctionType<'set_lore', {
    /** List of JSON text components. Each list entry represents one line of the lore. */
    lore: JsonTextComponent[]
    /**
     * Specifies the entity to act as the source @s in the JSON text component. Set to:
     * - `this` to use the entity that died or the player that gained the advancement, opened the container or broke the block
     * - `killer` for the killer
     * - `killer_player` for a killer that is a player.
     */
    entity: 'this' | 'killer' | 'killer_player'
    /** If true, replaces all existing lines of lore, if false appends the list. */
    replace?: boolean
  }>
  | FunctionType<'set_name', {
    /** A JSON text component name, allowing color, translations, etc. */
    name: JsonTextComponent
    /**
     * Specifies the entity to act as the source @s in the JSON text component. Set to:
     * - `this` to use the entity that died or the player that gained the advancement, opened the container or broke the block
     * - `killer` for the killer
     * - `killer_player` for a killer that is a player.
     */
    entity: 'this' | 'killer' | 'killer_player'
  }>
  | FunctionType<'set_nbt', {
    /**
     * Tag string to add, similar to those used by commands.
     * Note that the first bracket is required,
     * and quotation marks need to be escaped using a backslash.
     */
    tag: string
  }>
  | FunctionType<'set_stew_effect', {
    /** The effects to apply. */
    effects: {
      /** The effect ID. */
      type: LiteralUnion<ENCHANTMENTS>
      /** The duration of the effect. */
      duration: number
    }[]
  }>

)

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
  type: `${'minecraft:' | ''}${TYPE}`
} & VALUES

type LootTableEntry = {
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
  functions?: LootTableFunction[]

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
  EntryType<'item', {
    /**
     * ID name of the item to be produced, e.g. `diamond`.
     * The default, if not changed by functions, is a stack of 1 of the default instance of the item.
     */
    name: LiteralUnion<ITEMS>
  }>
  | EntryType<'tag', {
    /** Tag to be used, e.g. `arrows`. */
    name: string

    /**
     * If set to `true`, it chooses one item of the tag, each with the same weight and quality.
     * If `false`, it generates one of each of the items in the tag.
     */
    expand: boolean
  }>
  | EntryType<'loot_table', {
    /** Loot table to be used, e.g. `gameplay/fishing/junk` */
    name: string
  }>
  | EntryType<'dynamic', {
    /** Can be contents for block entity contents or self for banners and player skulls. */
    name: 'contents' | 'self'
  }>
  | EntryType<'group', {
    /** A list of entries that are used to generate loot. Can be used for convenience, e.g. if one condition applies for multiple entries. */
    children: LootTableEntry[]
  }>
  | EntryType<'alternatives', {
    /** A list of entries of which the first, and only the first, successful entry gets generated. */
    children: LootTableEntry[]
  }>
  | EntryType<'sequence', {
    /** A list of entries that are used until the first entry fails. After an entry fails, no more entries of this list are generated */
    children: LootTableEntry[]
  }>
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
  functions?: LootTableFunction[]

  /** Specifies the number of rolls on the pool. Can be either an exact number, a uniform range, or a binomial distribution. */
  rolls: number | {
    /**
     * Type of the distribution. Must be one of:
     * - "uniform" (default), for a uniform probability between a min and a max
     * - "binomial", for a binomial distribution
     * @default "uniform"
     */
    type: 'binomial'
    /** The number of tries. The number of successful tries will be the number of rolls. */
    n: number,
    /** The probability for one try to succeed. */
    p: number
  } | {
    /**
     * Type of the distribution. Must be one of:
     * - "uniform" (default), for a uniform probability between a min and a max
     * - "binomial", for a binomial distribution
     * @default "uniform"
     */
    type?: 'uniform'
    /** The minimum value. */
    min: number
    /** The maximum value. */
    max: number
  }

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

export type LootTableType = {
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
  type?: (
    'empty' | 'entity' |
    'block' | 'chest' |
    'fishing' | 'gift' |
    'advancement_reward' | 'barter' |
    'command' | 'selector' |
    'advancement_entity' | 'generic'
  ),

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
  functions?: LootTableFunction[]

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
