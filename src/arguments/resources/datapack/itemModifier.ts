// @ts-nocheck

/* eslint-disable camelcase */
import type { NumberProvider } from './criteria/utils.js'
import type { ObjectOrArray, PredicateCondition } from './predicate.js'
import type { JSONTextComponent, LootTableEntry } from 'sandstone/arguments'
import type { BASIC_COLORS, MAP_ICONS } from 'sandstone/arguments/basics'
import type {
  ATTRIBUTES, BLOCKS, ENCHANTMENTS, STRUCTURES,
} from 'sandstone/arguments/generated'
import type { LootTableClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { DataInstance } from 'sandstone/variables/Data'

type ItemModifierKind<TYPE extends string, VALUES extends Record<string, unknown>> = {
  /**
   * The function to apply. Must be one of the following:
   * - `apply_bonus`: Applies a predefined bonus formula.
   * - `copy_name`: For loot table type 'block', copies a block entity's `CustomName` tag into the item's `display.Name` tag.
   * - `copy_nbt`: Copies nbt to the item's `tag` tag.
   * - `copy_state`: Copies state properties from dropped block to the item's `BlockStateTag` tag.
   * - `enchant_randomly`: Enchants the item with one randomly-selected enchantment. The level of the enchantment, if applicable, is random.
   * - `enchant_with_levels`: Enchants the item, with the specified [enchantment level](https://minecraft.wiki/w/Enchantment_mechanics#How_Enchantments_Are_Chosen)`
   *   (roughly equivalent to using an `enchantment table` at that level).
   * - `exploration_map`: Converts an empty map into an `explorer map` leading to a nearby generated structure.
   * - `explosion_decay`: For loot tables of type 'block', removes some items from a stack, if there was an explosion. Each item has a chance of 1/explosion radius to be lost.
   * - `furnace_smelt`: Smelts the item as it would be in a furnace. Used in combination with the `entity_properties` condition to cook food from animals on death.
   * - `fill_player_head`: Adds required item tags of a player head
   * - `limit_count`: Limits the count of every item stack.
   * - `looting_enchant`: Adjusts the stack size based on the level of the `Looting` enchantment on the `killer` entity.
   * - `set_attributes`: Add `attribute` modifiers to the item.
   * - `set_banner_patterns`: Set the banners' patterns.
   * - `set_contents`: For loot tables of type 'block', sets the contents of a container block item to a list of entries.
   * - `set_count`: Sets the stack size.
   * - `set_damage`: Sets the item's damage value (durability) for tools.
   * - `set_enchantments`: Add `enchantments` to the item.
   * - `set_loot_table`: Sets the loot table for a container (chest etc.).
   * - `set_lore`: Adds lore to the item.
   * - `set_name`: Adds display name of the item.
   * - `set_nbt`: Adds NBT data to the item.
   * - `set_stew_effect`: Sets the status effects for `suspicious stew`.
   * - `sequence`: Runs multiple modifiers in sequence.
   */
  function: LiteralUnion<TYPE>
} & VALUES

type ATTRIBUTE_SLOTS = 'mainhand' | 'offhand' | 'feet' | 'legs' | 'chest' | 'head'

export type ItemModifierFunction = {
  /** Determines conditions for this function to be applied. If multiple conditions are specified, all must pass. */
  conditions?: PredicateCondition[]
} & (
    ItemModifierKind<'apply_bonus', {
      /** Enchantment ID used for level calculation. */
      enchantment: LiteralUnion<ENCHANTMENTS>
    } & ({
      /**
       * A special function used for ore drops in the vanilla game (`Count * (max(0; random(0..Level + 2) - 1)+1)`)
       */
      formula: 'ore_drops'
    } | {
      /**
       * A binomial distribution (with `n=level + extra`, `p=probability`),
       * - `uniform_bonus_count` for uniform distribution (from `0` to `level * bonusMultiplier`)
       */
      formula: 'binomial_with_bonus_count'

      /** Values required for the formula (except ore_drops). */
      parameters: {
        /** For formula `binomial_with_bonus_count`, the extra value. */
        extra: number
        /** For formula `binomial_with_bonus_count`, the probability. */
        probability: number
      }
    } | {
      /**
       * Can be:
       * - `binomial_with_bonus_count` for a binomial distribution (with `n=level + extra`, `p=probability`),
       * - `uniform_bonus_count` for uniform distribution (from `0` to `level * bonusMultiplier`)
       */
      formula: 'uniform_bonus_count'

      /** Values required for the formula (except ore_drops). */
      parameters: {
        /** For formula `uniform_bonus_count`, the bonus multiplier. */
        bonusMultiplier: number
      }
    })>
    | ItemModifierKind<'copy_name', {
      /**
       * Specifies the source. Must be one of:
       * - `block_entity` for the block entity of the destroyed block
       * - `this` to use the entity that died or the player that gained the loot table
       * - `opened` the container or broke the block,
       * - `killer` for the killer,
       * - `killer_player` for a killer that is a player.
       */
      source: 'block_entity' | 'this' | 'killer' | 'killer_player'
    }>
    | ItemModifierKind<'copy_nbt', {
      // TODO: update docs
      /**
       * Specifies the source. Must be one of:
       * - `block_entity` for the block entity of the destroyed block
       * - `this` to use the entity that died or the player that gained the loot table
       * - `opened` the container or broke the block,
       * - `killer` for the killer,
       * - `killer_player` for a killer that is a player.
       */
      source: 'block_entity' | 'this' | 'killer' | 'killer_player' | {
        type: 'minecraft:context'
        target: 'block_entity' | 'this' | 'killer' | 'killer_player'
      } | {
        type: 'minecraft:storage'
        source: string | DataInstance<'storage'>
      }

      /** A list of operations. */
      ops: {
        /** The nbt path to copy from. */
        source: string
        /** The nbt path to copy to, starting from the item's tag tag. */
        target: string
        /** Can be `replace` to replace any existing contents of the target, `append` to append to a list, or `merge` to merge into a compound tag. */
        op: 'replace' | 'append' | 'merge'
      }[]
    }>
    | ItemModifierKind<'copy_state', {
      /** A block ID. Function fails if the block doesn't match. */
      block?: LiteralUnion<BLOCKS>
      /** A list of property names to copy. */
      properties: string[]
    }>
    | ItemModifierKind<'enchant_randomly', {
      /** List of enchantment IDs to choose from. If omitted, all enchantments applicable to the item are possible. */
      enchantments?: LiteralUnion<ENCHANTMENTS>[]
    }>
    | ItemModifierKind<'enchant_with_levels', {
      /** Determines whether treasure enchantments are allowed on this item. */
      treasure?: boolean
      /** Specifies a random enchantment level, as an exact number or a range. */
      levels: NumberProvider
    }>
    | ItemModifierKind<'exploration_map', {
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
    | ItemModifierKind<'explosion_decay', {
      // No properties
    }>
    | ItemModifierKind<'furnace_smelt', {
      // No properties
    }>
    | ItemModifierKind<'fill_player_head', {
      /**
       * Specifies an entity to be used for the player head. Set to:
       * - `this` to use the entity that died or the player that gained the advancement,
       *   opened the container or broke the block
       * - `killer` for the killer
       * - `killer_player` for a killer that is a player.
       */
      entity: 'this' | 'killer' | 'killer_player'
    }>
    | ItemModifierKind<'limit_count', {
      /** Specify the count limit of every item stack. */
      limit: number | {
        min?: NumberProvider
        max?: NumberProvider
      }
    }>
    | ItemModifierKind<'looting_enchant', {
      /**
       * If a number is given, it specifies an exact number
       * of additional items per level of looting.
       *
       * If a range is given, it specifies a random number
       * (within a range) of additional items per level of looting.
       * Note the random number generated may be fractional, rounded after multiplying by the looting level.
       *
       */
      count?: NumberProvider
      /**
       * Specifies the maximum amount of items in the stack after the looting calculation.
       * If the value is `0`, no limit is applied.
       */
      limit?: number
    }>
    | ItemModifierKind<'set_attributes', {
      /** The modifiers to apply to the item. */
      modifiers: {
        name: string
        attribute: LiteralUnion<ATTRIBUTES>
        operation: 'addition' | 'multiply_base' | 'multiply_total'
        amount: NumberProvider
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
    | ItemModifierKind<'set_banner_pattern', {
      patterns: {
        pattern: string // TODO: add patterns type
        color: BASIC_COLORS
      }[]
      append?: boolean
    }>
    | ItemModifierKind<'set_contents', {
      /** For loot tables of type 'block', sets the contents of a container block item to a list of entries. */
      entries: LootTableEntry[]
    }>
    | ItemModifierKind<'set_count', {
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
    | ItemModifierKind<'set_damage', {
      /**
       * If a number is given, it specifies the damage fraction to set
       * (1.0 is undamaged, 0.0 is zero durability left).
       *
       * If a range is give, it specifies a random damage fraction within the given range.
       */
      damage: NumberProvider
      add?: boolean
    }>
    | ItemModifierKind<'set_enchantments', {
      enchantments: { [K in ENCHANTMENTS]?: NumberProvider }
      add?: boolean
    }>
    | ItemModifierKind<'set_loot_table', {
      /** Specifies the resource location of the loot table to be used. */
      name: string | LootTableClass
      /** Optional. Specifies the loot table seed. If absent or set to 0, a random seed will be used. */
      seed?: number
    }>
    | ItemModifierKind<'set_lore', {
      /** List of JSON text components. Each list entry represents one line of the lore. */
      lore: JSONTextComponent[]
      /**
       * Specifies the entity to act as the source @s in the JSON text component. Set to:
       * - `this` to use the entity that died or the player that gained the advancement, opened the container or broke the block
       * - `killer` for the killer
       * - `killer_player` for a killer that is a player.
       */
      entity?: 'this' | 'killer' | 'killer_player' | 'direct_killer'
      /** If true, replaces all existing lines of lore, if false appends the list. */
      replace?: boolean
    }>
    | ItemModifierKind<'set_name', {
      /** A JSON text component name, allowing color, translations, etc. */
      name: JSONTextComponent
      /**
       * Specifies the entity to act as the source @s in the JSON text component. Set to:
       * - `this` to use the entity that died or the player that gained the advancement, opened the container or broke the block
       * - `killer` for the killer
       * - `killer_player` for a killer that is a player.
       */
      entity?: 'this' | 'killer' | 'killer_player' | 'direct_killer'
    }>
    | ItemModifierKind<'set_nbt', {
      /**
       * Tag string to add, similar to those used by commands.
       * Note that the first bracket is required,
       * and quotation marks need to be escaped using a backslash.
       */
      tag: string
    }>
    | ItemModifierKind<'set_stew_effect', {
      /** The effects to apply. */
      effects: {
        /** The effect ID. */
        type: LiteralUnion<ENCHANTMENTS>
        /** The duration of the effect. */
        duration: NumberProvider
      }[]
    }>
    | ItemModifierKind<'sequence', {
      functions: ItemModifierFunction[]
    }>
  )

export type ItemModifierJSON = ObjectOrArray<ItemModifierFunction>
