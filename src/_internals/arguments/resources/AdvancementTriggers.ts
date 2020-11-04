/* eslint-disable camelcase */
import type { LiteralUnion } from '@/generalTypes'
import type { ITEMS } from '@arguments'
import type {
  PlayerCriterion, BlockIdCriterion,
  EntityCriterion, PotionIdCriterion,
  DimensionCriterion, EffectCriterion,
  NumberOrMinMax, DamageCriterion,
  LocationCriterion, SlotCriterion,
  DistanceCriterion, ItemCriterion,
} from './criteria'
import type { ObjectOrArray } from './predicate'

// The advancement triggers
type Trigger<NAME extends string, CONDITIONS extends Record<string, unknown>> = {
  trigger: NAME

  /** All the conditions that need to be met when the trigger gets activated. */
  conditions: Partial<CONDITIONS> & {
    /** A list of loot table conditions that must pass in order for the trigger to activate.
     * The checks are applied to the player that would get the advancement. */
    player?: PlayerCriterion
  }
}

export type AdvancementTriggers = (
  Trigger<'minecraft:bee_nest_destroyed', {
    /** The block that was destroyed. Accepts block IDs. */
    block: BlockIdCriterion
    /** The item used to break the block. */
    item: ItemCriterion
    /** The number of bees that were inside the bee nest/beehive before it was broken. */
    nums_bees_inside: number

  }> | Trigger<'minecraft:bred_animals', {
    /** The child that results from the breeding. May also be a list of loot table conditions that must pass in order for the trigger to activate. */
    child: EntityCriterion
    /** The parent. May also be a list of loot table conditions that must pass in order for the trigger to activate. */
    parent: EntityCriterion
    /** The partner. (The entity the parent was bred with) May also be a list of loot table conditions that must pass in order for the trigger to activate. */
    partner: EntityCriterion

  }> | Trigger<'minecraft:brewed_potion', {
    potion: PotionIdCriterion
  }> | Trigger<'minecraft:changed_dimension', {
    /** The dimension the entity traveled from. */
    from: DimensionCriterion
    /** The dimension the entity traveled to. */
    to: DimensionCriterion

  }> | Trigger<'minecraft:channeled_lightning', {
    /** The victims hit by the lightning summoned by the Channeling enchantment.
     * All entities in this list must be hit.
     * Each entry may also be a list of loot table conditions that must pass in order for the trigger to activate.
     * The checks are applied to the victim hit by the enchanted trident. */
    victims: EntityCriterion[]

  }> | Trigger<'minecraft:construct_beacon', {
    /** The tier of the updated beacon structure. */
    level: number | {
      min?: number
      max?: number
    }

  }> | Trigger<'minecraft:consume_item', {
    /** The item that was consumed. */
    item: ItemCriterion
  }> | Trigger<'minecraft:cured_zombie_villager', {
    /** The villager that is the result of the conversion.
     * The 'type' tag is redundant since it will always be "villager".
     * May also be a list of loot table conditions that must pass in order for the trigger to activate. */
    villager: EntityCriterion
    /** The zombie villager right before the conversion is complete (not when it is initiated).
     * The `type` tag is redundant since it will always be `zombie_villager`.
     * May also be a list of loot table conditions that must pass in order for the trigger to activate. */
    zombie: EntityCriterion

  }> | Trigger<'minecraft:effects_changed', {
    /** A list of status effects the player has. */
    effects: EffectCriterion

  }> | Trigger<'minecraft:enchanted_item', {
    /** The item after it has been enchanted. */
    item: ItemCriterion

    /** The levels spent by the player on the enchantment. */
    levels: NumberOrMinMax
  }> | Trigger<'minecraft:entity_hurt_player', {
    /** Checks the damage done to the player. */
    damage: DamageCriterion
  }> | Trigger<'minecraft:entity_killed_player', {
    /** Checks the entity that was the source of the damage that killed the player (for example: The skeleton that shot the arrow).
     * May also be a list of loot table conditions that must pass in order for the trigger to activate.  */
    entity: EntityCriterion
    /** Checks the type of damage that killed the player. Missing corresponding list of loot table conditions for the direct entity. */
    killing_blow: DamageCriterion
  }> | Trigger<'minecraft:filled_bucket', {
    /** The item resulting from filling the bucket. */
    item: ItemCriterion
  }> | Trigger<'minecraft:fishing_rod_hooked', {
    /** The entity that was pulled. May also be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
    /** The item that was caught. */
    item: ItemCriterion
    /** The fishing rod used. */
    rod: ItemCriterion
  }> | Trigger<'minecraft:hero_of_the_village', {
    /** The location of the player. */
    location: LocationCriterion
  }> | {
    trigger: 'minecraft:impossible'
  } | Trigger<'minecraft:inventory_changed', {
    items: ItemCriterion[]
    slots: SlotCriterion
  }> | Trigger<'minecraft:item_durability_changed', {
    /** The change in durability (negative numbers are used to indicate a decrease in durability). */
    delta: NumberOrMinMax
    /** The remaining durability of the item. */
    durability: NumberOrMinMax
    /** The item before it was damaged, allows you to check the durability before the item was damaged. */
    item: ItemCriterion
  }> | Trigger<'minecraft:item_used_on_block', {
    /** The location at the center of the block the item was used on. */
    location: LocationCriterion
    /** The item used on the block. */
    item: ItemCriterion
  }> | Trigger<'minecraft:killed_by_crossbow', {
    /** The count of types of entities killed. */
    unique_entity_types: NumberOrMinMax
    /** A predicate for any of the killed entities. */
    victims: EntityCriterion
  }> | Trigger<'minecraft:levitation', {
    /** The distance of levitation. */
    distance: DistanceCriterion
    /** The duration of the levitation in ticks. */
    duration: NumberOrMinMax
  }> | Trigger<'minecraft:location', {
    /** The location of the player. */
    location: LocationCriterion
  }> | Trigger<'minecraft:nether_travel', {
    /** The location where the player entered the Nether. */
    entered: LocationCriterion
    /** The location where the player exited the Nether. */
    exited: LocationCriterion
    /** The overworld distance between where the player entered the Nether and where the player exited the Nether. */
    distance: DistanceCriterion
  }> | Trigger<'minecraft:placed_block', {
    /** The block that was placed. Accepts block IDs. */
    block: BlockIdCriterion
    /** The item that was used to place the block before the item was consumed. */
    item: ItemCriterion
    /** The location of the block that was placed. */
    location: LocationCriterion
    /** The block states of the block. */
    state: {
      /** A single block state, with the key name being the state name and the value being the required value of that state. */
      [state_name: string]: string
    }
  }> | Trigger<'minecraft:player_generates_container_loot', {
    /** The resource location of the generated loot table. */
    loot_table: string
  }> | Trigger<'minecraft:player_hurt_entity', {
    /** The damage that was dealt. Missing corresponding list of loot table conditions for the direct entity. */
    damage: DamageCriterion
    /** The entity that was damaged. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
  }> | Trigger<'minecraft:player_hurt_entity', {
    /** The damage that was dealt. Missing corresponding list of loot table conditions for the direct entity. */
    damage: DamageCriterion
    /** The entity that was damaged. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
  }> | Trigger<'minecraft:player_killed_entity', {
    /** The entity that was killed. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
    /** The type of damage that killed an entity. Missing corresponding list of loot table conditions for the direct entity. */
    killing_blow: DamageCriterion
  }> | Trigger<'minecraft:recipe_unlocked', {
    /** The recipe that was unlocked. */
    recipe: string
  }> | Trigger<'minecraft:shot_crossbow', {
    /** The item that was used. */
    item: ItemCriterion
  }> | Trigger<'minecraft:slept_in_bed', {
    /** The location of the player. */
    location: LocationCriterion
  }> | Trigger<'minecraft:slide_down_block', {
    /** The block that the player slid on. */
    block: BlockIdCriterion
  }> | Trigger<'minecraft:summoned_entity', {
    /** The summoned entity. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
  }> | Trigger<'minecraft:tame_animal', {
    /** Checks the entity that was tamed. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
  }> | Trigger<'minecraft:target_hit', {
    /** The redstone signal that will come out of the target block. */
    signal_strength: number
    /** The projectile used to hit the target block. */
    projectile: LiteralUnion<ITEMS>
    /** Entity predicate for the player who shot or threw the projectile. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    shooter: EntityCriterion
  }> | Trigger<'minecraft:thrown_item_picked_up_by_entity', {
    /** The thrown item which was picked up. */
    item: ItemCriterion
    /** The entity which picked up the item. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    entity: EntityCriterion
  // eslint-disable-next-line @typescript-eslint/ban-types
  }> | Trigger<'minecraft:tick', {}> | Trigger<'minecraft:used_ender_eye', {
    /** The horizontal distance between the player and the stronghold. */
    distance: NumberOrMinMax
  }> | Trigger<'minecraft:used_totem', {
    /** The item, only works with totem items. */
    item: ItemCriterion
  }> | Trigger<'minecraft:villager_trade', {
    /** The item that was purchased. The "count" tag checks the count from one trade, not multiple. */
    item: ItemCriterion
    /** The villager the item was purchased from. May be a list of loot table conditions that must pass in order for the trigger to activate. */
    villager: EntityCriterion
  }> | Trigger<'minecraft:villager_trade', {
    /** The location of the player. */
    location: LocationCriterion
  }>
)
