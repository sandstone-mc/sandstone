import type { JsonLootTableListRef } from 'sandstone/arguments/generated/_json/data/loot.ts'
import type {
  JsonSymbolMcdocAdvancementDisplay,
  JsonSymbolTrigger,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonItemStackTemplate } from 'sandstone/arguments/generated/_json/world/item.ts'
import type {
  AdvancementClass,
  JsonNBTList,
  MCFunctionClass,
  NamespacedString,
  NBTClass,
  NBTInt,
  NonEmptyString,
  RecipeClass,
  TextureClass,
} from 'sandstone'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { TextureType } from 'sandstone/arguments'

export type JsonAdvancement<S = undefined> = {
  /**
   * If this field is absent, this advancement is a root advancement.
   * Circular references cause a loading failure.
   */
  parent?: (JsonRegistry['minecraft:advancement'] | AdvancementClass),
  /**
   * If present, advancement will be visible in the advancement tabs.
   */
  display?: (S extends undefined
    ? JsonSymbolMcdocAdvancementDisplay<'%none'> :
    (S extends keyof JsonSymbolMcdocAdvancementDisplay
      ? JsonSymbolMcdocAdvancementDisplay[S]
      : JsonSymbolMcdocAdvancementDisplay<'%unknown'>)),
  /**
   * If `requirements` is not defined, all defined criteria will be required.
   */
  criteria: ({
    [Key in NonEmptyString]?: JsonAdvancementCriterion
  }),
  /**
   * If all criteria are required at once, this may be omitted.
   *
   * Contains all of the `criteria` keys.
   *
   * If all of the lists each have at least one criteria met, the advancement is complete (basically AND grouping of OR groups).
   *
   * Value:
   * List length range: 1..
   */
  requirements?: JsonNBTList<JsonNBTList<NonEmptyString, {
    leftExclusive: false,
    min: 1,
  }>, {
    leftExclusive: false,
    min: 1,
  }>,
  /**
   * Provided to the player when this advancement is obtained.
   */
  rewards?: JsonAdvancementRewards,
  /**
   * Defaults to `false`. The vanilla game client only reads this for advancements from the `minecraft` namespace.
   */
  sends_telemetry_event?: boolean,
}

export type JsonAdvancementCriteriaMap = ({
  [Key in NonEmptyString]?: JsonAdvancementCriterion
})

export type JsonAdvancementCriterion = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:trigger_type'], string>, string>]?: ({
    /**
     * Many triggers can occur multiple times, however, the reward will only be provided multiple times if the advancement is first revoked, which is often done within the function reward.
     */
    trigger: S,
  } & (S extends keyof JsonSymbolTrigger ? JsonSymbolTrigger[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:trigger_type'], string>])>

export type JsonAdvancementDisplay = {
  icon: JsonItemStackTemplate,
  title: JsonText,
  description: JsonText,
  /**
   * Controls the advancement tile frame. Defaults to `task`.
   *
   * Value:
   *
   *  - Task(`task`): Normal border.
   *  - Challenge(`challenge`): Fancy spiked border (used for the kill all mobs advancement).
   *  - Goal(`goal`): Rounded border (used for the full beacon advancement).
   */
  frame?: JsonAdvancementFrame,
  /**
   * Whether to show the toast pop up after completing this advancement. Defaults to `true`.
   */
  show_toast?: boolean,
  /**
   * Whether to announce in the chat when this advancement has been completed. Defaults to `true`.
   */
  announce_to_chat?: boolean,
  /**
   * Whether or not to hide this advancement and all its children from the advancement screen,
   * until this advancement have been completed.
   * Has no effect on root advancements themselves, but still affects all their children.
   * Defaults to `false`.
   */
  hidden?: boolean,
}

export type JsonAdvancementFrame = ('task' | 'challenge' | 'goal')

export type JsonAdvancementIcon = {
  item: JsonRegistry['minecraft:item'],
  nbt?: NonEmptyString | NBTClass,
}

export type JsonAdvancementRewards = {
  /**
   * XP to add.
   */
  experience?: (NBTInt | number),
  /**
   * Loot tables to give.
   */
  loot?: JsonLootTableListRef,
  /**
   * Recipes to unlock.
   */
  recipes?: Array<(JsonRegistry['minecraft:recipe'] | RecipeClass)>,
  /**
   * Function to run as and at the player. Function tags are not allowed.
   */
  function?: (NamespacedString | MCFunctionClass),
}

export type JsonRootAdvancementDisplay = (JsonAdvancementDisplay & {
  /**
   * Used for the advancement tab.
   */
  background: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
})

export type JsonTrigger = (
  | 'allay_drop_item_on_block'
  | 'avoid_vibration'
  | 'bee_nest_destroyed'
  | 'bred_animals'
  | 'brewed_potion'
  | 'changed_dimension'
  | 'channeled_lightning'
  | 'construct_beacon'
  | 'consume_item'
  | 'cured_zombie_villager'
  | 'effects_changed'
  | 'enchanted_item'
  | 'enter_block'
  | 'entity_hurt_player'
  | 'entity_killed_player'
  | 'fall_from_height'
  | 'filled_bucket'
  | 'fishing_rod_hooked'
  | 'hero_of_the_village'
  | 'impossible'
  | 'inventory_changed'
  | 'item_durability_changed'
  | 'item_used_on_block'
  | 'kill_mob_near_sculk_catalyst'
  | 'killed_by_crossbow'
  | 'levitation'
  | 'lightning_strike'
  | 'location'
  | 'nether_travel'
  | 'placed_block'
  | 'player_generates_container_loot'
  | 'player_hurt_entity'
  | 'player_interacted_with_entity'
  | 'player_killed_entity'
  | 'recipe_crafted'
  | 'recipe_unlocked'
  | 'ride_entity_in_lava'
  | 'shot_crossbow'
  | 'safely_harvest_honey'
  | 'slept_in_bed'
  | 'slide_down_block'
  | 'started_riding'
  | 'summoned_entity'
  | 'tame_animal'
  | 'target_hit'
  | 'thrown_item_picked_up_by_entity'
  | 'thrown_item_picked_up_by_player'
  | 'tick'
  | 'used_ender_eye'
  | 'used_totem'
  | 'using_item'
  | 'villager_trade'
  | 'voluntary_exile')
