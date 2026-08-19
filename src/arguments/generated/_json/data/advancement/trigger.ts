import type {
  JsonDamagePredicate,
  JsonDamageSourcePredicate,
  JsonDistancePredicate,
  JsonEntityEffectsPredicate,
  JsonItemPredicate,
  JsonLocationPredicate,
} from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonLootTableListRef } from 'sandstone/arguments/generated/_json/data/loot.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonRecipeListRef } from 'sandstone/arguments/generated/_json/data/recipe.ts'
import type { JsonMinMaxBounds } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonSymbolMcdocBlockStates } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockListRef } from 'sandstone/arguments/generated/_json/util/registry_ref.ts'
import type { JsonPotionsPredicate } from 'sandstone/arguments/generated/_json/world/component/predicate.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTDouble, NBTInt } from 'sandstone'

export type JsonAdvancementEntityPredicate = JsonPredicateRef

export type JsonAdvancementLocationPredicate = JsonPredicateRef

export type JsonAllOptional<C extends JsonNBTObject> = {
  conditions?: C,
}

export type JsonAnyBlockInteractionTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Location.
   */
  location?: JsonAdvancementLocationPredicate,
})>

export type JsonBeeNestDestroyedTrigger = JsonAllOptional<NonNullable<({
  [S in Extract<Extract<JsonBlockListRef, string>, string>]?: (JsonPlayerConditions & {
    blocks?: S,
    state?: (S extends undefined
      ? JsonSymbolMcdocBlockStates<'%none'> :
      (S extends keyof JsonSymbolMcdocBlockStates
        ? JsonSymbolMcdocBlockStates[S]
        : JsonSymbolMcdocBlockStates<'%unknown'>)),
    /**
     * Number of bees that were inside the bee nest/beehive before it was broken.
     */
    num_bees_inside?: (NBTInt | number),
    /**
     * Item used to break the block.
     */
    item?: JsonItemPredicate,
  })
}[Extract<JsonBlockListRef, string>])>>

export type JsonBlockStateConditions = NonNullable<({
  [S in Extract<Extract<JsonBlockListRef, string>, string>]?: {
    blocks?: S,
    state?: (S extends undefined
      ? JsonSymbolMcdocBlockStates<'%none'> :
      (S extends keyof JsonSymbolMcdocBlockStates
        ? JsonSymbolMcdocBlockStates[S]
        : JsonSymbolMcdocBlockStates<'%unknown'>)),
  }
}[Extract<JsonBlockListRef, string>])>

export type JsonBredAnimalsTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  parent?: JsonAdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  partner?: JsonAdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  child?: JsonAdvancementEntityPredicate,
})>

export type JsonBrewedPotionTrigger = JsonAllOptional<(JsonPlayerConditions & {
  potion?: JsonPotionsPredicate,
})>

export type JsonChangeDimensionTrigger = JsonAllOptional<(JsonPlayerConditions & {
  from?: JsonRegistry['minecraft:dimension'],
  to?: JsonRegistry['minecraft:dimension'],
})>

export type JsonChanneledLightningTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity. \
   * Evaluates to true if every predicate in the list matches some victims.
   */
  victims?: Array<JsonAdvancementEntityPredicate>,
})>

export type JsonConstructBeaconTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Tier of the updated beacon base.
   */
  level?: JsonMinMaxBounds<(NBTInt | number)>,
})>

export type JsonConsumeItemTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
})>

export type JsonCuredZombieVillagerTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  zombie?: JsonAdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  villager?: JsonAdvancementEntityPredicate,
})>

export type JsonDefaultBlockInteractionTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Block Use.
   */
  location?: JsonAdvancementLocationPredicate,
})>

export type JsonDistanceTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Where the player started to travel.
   */
  start_position?: JsonLocationPredicate,
  /**
   * How far the player travels.
   */
  distance?: JsonDistancePredicate,
})>

export type JsonEffectsChangedTrigger = JsonAllOptional<(JsonPlayerConditions & {
  effects?: JsonEntityEffectsPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  source?: JsonAdvancementEntityPredicate,
})>

export type JsonEnchantedItemTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
  levels?: JsonMinMaxBounds<(NBTInt | number)>,
})>

export type JsonEnterBlockTrigger = JsonAllOptional<(JsonPlayerConditions & JsonBlockStateConditions)>

export type JsonEntityHurtPlayerTrigger = JsonAllOptional<(JsonPlayerConditions & {
  damage?: JsonDamagePredicate,
})>

export type JsonFallAfterExplosionTrigger = JsonAllOptional<(JsonPlayerConditions & {
  start_position?: JsonLocationPredicate,
  distance?: JsonDistancePredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  cause?: JsonAdvancementEntityPredicate,
})>

export type JsonFilledBucketTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
})>

export type JsonFishingRodHookedTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity. \
   * Entity that was pulled.
   * Or the hook itself if no entity was hooked.
   */
  entity?: JsonAdvancementEntityPredicate,
  /**
   * Item that was caught.
   */
  item?: JsonItemPredicate,
  /**
   * Fishing rod used.
   */
  rod?: JsonItemPredicate,
})>

export type JsonImpossibleTrigger = JsonAllOptional<Record<string, never>>

export type JsonInventoryChangedSlots = {
  /**
   * Amount of empty slots.
   */
  empty?: JsonMinMaxBounds<(NBTInt | number)>,
  /**
   * Amount of occupied slots.
   */
  occupied?: JsonMinMaxBounds<(NBTInt | number)>,
  /**
   * Amount of slots that are a full stack.
   */
  full?: JsonMinMaxBounds<(NBTInt | number)>,
}

export type JsonInventoryChangeTrigger = JsonAllOptional<(JsonPlayerConditions & {
  slots?: {
    /**
     * Amount of empty slots.
     */
    empty?: JsonMinMaxBounds<(NBTInt | number)>,
    /**
     * Amount of occupied slots.
     */
    occupied?: JsonMinMaxBounds<(NBTInt | number)>,
    /**
     * Amount of slots that are a full stack.
     */
    full?: JsonMinMaxBounds<(NBTInt | number)>,
  },
  items?: Array<JsonItemPredicate>,
})>

export type JsonItemDurabilityTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Change in durability (negative numbers are used to indicate a decrease in durability).
   */
  delta?: JsonMinMaxBounds<(NBTInt | number)>,
  /**
   * The resulting durability.
   */
  durability?: JsonMinMaxBounds<(NBTInt | number)>,
  /**
   * The item before its durability changed.
   */
  item?: JsonItemPredicate,
})>

export type JsonItemUesdOnLocationConditions = (JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Location.
   */
  location?: JsonAdvancementLocationPredicate,
})

export type JsonItemUsedOnLocationTrigger = JsonAllOptional<JsonItemUesdOnLocationConditions>

export type JsonKilledByArrowTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * How many different types of entities were killed.
   */
  unique_entity_types?: JsonMinMaxBounds<(NBTInt | number)>,
  /**
   * The weapon item that was used to fire the arrow.
   */
  fired_from_weapon?: JsonItemPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Evaluates to true if every predicate in the list matches some victims.
   */
  victims?: Array<JsonAdvancementEntityPredicate>,
})>

export type JsonKilledTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: JsonAdvancementEntityPredicate,
  killing_blow?: JsonDamageSourcePredicate,
})>

export type JsonLevitationTrigger = JsonAllOptional<(JsonPlayerConditions & {
  distance?: JsonDistancePredicate,
  duration?: JsonMinMaxBounds<(NBTInt | number)>,
})>

export type JsonLightningStrikeTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  lightning?: JsonAdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Evaluates to false if no entities are nearby.
   */
  bystander?: JsonAdvancementEntityPredicate,
})>

export type JsonLocationTrigger = JsonAllOptional<JsonPlayerConditions>

export type JsonLootTableTrigger = JsonParitalRequired<(JsonPlayerConditions & {
  loot_tables: JsonLootTableListRef,
})>

export type JsonNetherTravelTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Where in the Overworld the player was when they travelled to the Nether.
   */
  start_position?: JsonLocationPredicate,
  /**
   * How far the player now is from the coordinate they started at in the Overworld before travelling.
   */
  distance?: JsonDistancePredicate,
})>

export type JsonParitalRequired<C extends JsonNBTObject> = {
  conditions: C,
}

export type JsonPickedUpItemTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  entity?: JsonAdvancementEntityPredicate,
})>

export type JsonPlacedBlockConditions = (JsonPlayerConditions & JsonBlockStateConditions & {
  /**
   * Item that was used to place the block before the item was consumed.
   */
  item?: JsonItemPredicate,
  /**
   * Predicate context: Advancement Location.
   */
  location?: JsonLocationPredicate,
})

export type JsonPlacedBlockTrigger = JsonAllOptional<JsonItemUesdOnLocationConditions>

export type JsonPlayerConditions = {
  /**
   * Predicate context: Advancement Entity.
   */
  player?: JsonAdvancementEntityPredicate,
}

export type JsonPlayerHurtEntityTrigger = JsonAllOptional<(JsonPlayerConditions & {
  damage?: JsonDamagePredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: JsonAdvancementEntityPredicate,
})>

export type JsonPlayerInteractTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: JsonAdvancementEntityPredicate,
})>

export type JsonPlayerTrigger = JsonAllOptional<JsonPlayerConditions>

export type JsonRecipeCraftedTrigger = JsonParitalRequired<(JsonPlayerConditions & {
  recipes: JsonRecipeListRef,
  /**
   * Value:
   * List length range: 1..9
   */
  ingredients?: JsonNBTList<JsonItemPredicate, {
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
    max: 9,
  }>,
})>

export type JsonRecipeUnlockedTrigger = JsonParitalRequired<(JsonPlayerConditions & {
  recipes: JsonRecipeListRef,
})>

export type JsonShotCrossbowTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Crossbow that was used.
   */
  item?: JsonItemPredicate,
})>

export type JsonSlideDownBlockTrigger = JsonAllOptional<(JsonPlayerConditions & JsonBlockStateConditions)>

export type JsonSpearMobsTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Minimum mob count required.
   *
   * Value:
   * Range: 1..
   */
  count?: (NBTInt<{
    min: 1,
  }> | number),
})>

export type JsonStartRidingTrigger = JsonAllOptional<JsonPlayerConditions>

export type JsonSummonedEntityTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: JsonAdvancementEntityPredicate,
})>

export type JsonTameAnimalTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: JsonAdvancementEntityPredicate,
})>

export type JsonTargetBlockTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  projectile?: JsonAdvancementEntityPredicate,
  signal_strength?: JsonMinMaxBounds<(NBTInt | number)>,
})>

export type JsonTradeTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  villager?: JsonAdvancementEntityPredicate,
  /**
   * Item that was purchased. \
   * `count` tag checks the item count from one trade, not the total amount traded for.
   */
  item?: JsonItemPredicate,
})>

export type JsonUsedEnderEyeTrigger = JsonAllOptional<(JsonPlayerConditions & {
  /**
   * Horizontal distance between the player and the stronghold.
   */
  distance?: JsonMinMaxBounds<(NBTDouble | number)>,
})>

export type JsonUsedTotemTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
})>

export type JsonUsingItemTrigger = JsonAllOptional<(JsonPlayerConditions & {
  item?: JsonItemPredicate,
})>
type JsonTriggerDispatcherMap = {
  'allay_drop_item_on_block': JsonTriggerAllayDropItemOnBlock,
  'minecraft:allay_drop_item_on_block': JsonTriggerAllayDropItemOnBlock,
  'any_block_use': JsonTriggerAnyBlockUse,
  'minecraft:any_block_use': JsonTriggerAnyBlockUse,
  'avoid_vibration': JsonTriggerAvoidVibration,
  'minecraft:avoid_vibration': JsonTriggerAvoidVibration,
  'bee_nest_destroyed': JsonTriggerBeeNestDestroyed,
  'minecraft:bee_nest_destroyed': JsonTriggerBeeNestDestroyed,
  'bred_animals': JsonTriggerBredAnimals,
  'minecraft:bred_animals': JsonTriggerBredAnimals,
  'brewed_potion': JsonTriggerBrewedPotion,
  'minecraft:brewed_potion': JsonTriggerBrewedPotion,
  'changed_dimension': JsonTriggerChangedDimension,
  'minecraft:changed_dimension': JsonTriggerChangedDimension,
  'channeled_lightning': JsonTriggerChanneledLightning,
  'minecraft:channeled_lightning': JsonTriggerChanneledLightning,
  'construct_beacon': JsonTriggerConstructBeacon,
  'minecraft:construct_beacon': JsonTriggerConstructBeacon,
  'consume_item': JsonTriggerConsumeItem,
  'minecraft:consume_item': JsonTriggerConsumeItem,
  'crafter_recipe_crafted': JsonTriggerCrafterRecipeCrafted,
  'minecraft:crafter_recipe_crafted': JsonTriggerCrafterRecipeCrafted,
  'cured_zombie_villager': JsonTriggerCuredZombieVillager,
  'minecraft:cured_zombie_villager': JsonTriggerCuredZombieVillager,
  'default_block_use': JsonTriggerDefaultBlockUse,
  'minecraft:default_block_use': JsonTriggerDefaultBlockUse,
  'effects_changed': JsonTriggerEffectsChanged,
  'minecraft:effects_changed': JsonTriggerEffectsChanged,
  'enchanted_item': JsonTriggerEnchantedItem,
  'minecraft:enchanted_item': JsonTriggerEnchantedItem,
  'enter_block': JsonTriggerEnterBlock,
  'minecraft:enter_block': JsonTriggerEnterBlock,
  'entity_hurt_player': JsonTriggerEntityHurtPlayer,
  'minecraft:entity_hurt_player': JsonTriggerEntityHurtPlayer,
  'entity_killed_player': JsonTriggerEntityKilledPlayer,
  'minecraft:entity_killed_player': JsonTriggerEntityKilledPlayer,
  'fall_after_explosion': JsonTriggerFallAfterExplosion,
  'minecraft:fall_after_explosion': JsonTriggerFallAfterExplosion,
  'fall_from_height': JsonTriggerFallFromHeight,
  'minecraft:fall_from_height': JsonTriggerFallFromHeight,
  'filled_bucket': JsonTriggerFilledBucket,
  'minecraft:filled_bucket': JsonTriggerFilledBucket,
  'fishing_rod_hooked': JsonTriggerFishingRodHooked,
  'minecraft:fishing_rod_hooked': JsonTriggerFishingRodHooked,
  'hero_of_the_village': JsonTriggerHeroOfTheVillage,
  'minecraft:hero_of_the_village': JsonTriggerHeroOfTheVillage,
  'impossible': JsonTriggerImpossible,
  'minecraft:impossible': JsonTriggerImpossible,
  'inventory_changed': JsonTriggerInventoryChanged,
  'minecraft:inventory_changed': JsonTriggerInventoryChanged,
  'item_durability_changed': JsonTriggerItemDurabilityChanged,
  'minecraft:item_durability_changed': JsonTriggerItemDurabilityChanged,
  'item_used_on_block': JsonTriggerItemUsedOnBlock,
  'minecraft:item_used_on_block': JsonTriggerItemUsedOnBlock,
  'kill_mob_near_sculk_catalyst': JsonTriggerKillMobNearSculkCatalyst,
  'minecraft:kill_mob_near_sculk_catalyst': JsonTriggerKillMobNearSculkCatalyst,
  'killed_by_arrow': JsonTriggerKilledByArrow,
  'minecraft:killed_by_arrow': JsonTriggerKilledByArrow,
  'levitation': JsonTriggerLevitation,
  'minecraft:levitation': JsonTriggerLevitation,
  'lightning_strike': JsonTriggerLightningStrike,
  'minecraft:lightning_strike': JsonTriggerLightningStrike,
  'location': JsonTriggerLocation,
  'minecraft:location': JsonTriggerLocation,
  'nether_travel': JsonTriggerNetherTravel,
  'minecraft:nether_travel': JsonTriggerNetherTravel,
  'placed_block': JsonTriggerPlacedBlock,
  'minecraft:placed_block': JsonTriggerPlacedBlock,
  'player_generates_container_loot': JsonTriggerPlayerGeneratesContainerLoot,
  'minecraft:player_generates_container_loot': JsonTriggerPlayerGeneratesContainerLoot,
  'player_hurt_entity': JsonTriggerPlayerHurtEntity,
  'minecraft:player_hurt_entity': JsonTriggerPlayerHurtEntity,
  'player_interacted_with_entity': JsonTriggerPlayerInteractedWithEntity,
  'minecraft:player_interacted_with_entity': JsonTriggerPlayerInteractedWithEntity,
  'player_killed_entity': JsonTriggerPlayerKilledEntity,
  'minecraft:player_killed_entity': JsonTriggerPlayerKilledEntity,
  'player_sheared_equipment': JsonTriggerPlayerShearedEquipment,
  'minecraft:player_sheared_equipment': JsonTriggerPlayerShearedEquipment,
  'recipe_crafted': JsonTriggerRecipeCrafted,
  'minecraft:recipe_crafted': JsonTriggerRecipeCrafted,
  'recipe_unlocked': JsonTriggerRecipeUnlocked,
  'minecraft:recipe_unlocked': JsonTriggerRecipeUnlocked,
  'ride_entity_in_lava': JsonTriggerRideEntityInLava,
  'minecraft:ride_entity_in_lava': JsonTriggerRideEntityInLava,
  'shot_crossbow': JsonTriggerShotCrossbow,
  'minecraft:shot_crossbow': JsonTriggerShotCrossbow,
  'slept_in_bed': JsonTriggerSleptInBed,
  'minecraft:slept_in_bed': JsonTriggerSleptInBed,
  'slide_down_block': JsonTriggerSlideDownBlock,
  'minecraft:slide_down_block': JsonTriggerSlideDownBlock,
  'spear_mobs': JsonTriggerSpearMobs,
  'minecraft:spear_mobs': JsonTriggerSpearMobs,
  'started_riding': JsonTriggerStartedRiding,
  'minecraft:started_riding': JsonTriggerStartedRiding,
  'summoned_entity': JsonTriggerSummonedEntity,
  'minecraft:summoned_entity': JsonTriggerSummonedEntity,
  'tame_animal': JsonTriggerTameAnimal,
  'minecraft:tame_animal': JsonTriggerTameAnimal,
  'target_hit': JsonTriggerTargetHit,
  'minecraft:target_hit': JsonTriggerTargetHit,
  'thrown_item_picked_up_by_entity': JsonTriggerThrownItemPickedUpByEntity,
  'minecraft:thrown_item_picked_up_by_entity': JsonTriggerThrownItemPickedUpByEntity,
  'thrown_item_picked_up_by_player': JsonTriggerThrownItemPickedUpByPlayer,
  'minecraft:thrown_item_picked_up_by_player': JsonTriggerThrownItemPickedUpByPlayer,
  'tick': JsonTriggerTick,
  'minecraft:tick': JsonTriggerTick,
  'used_ender_eye': JsonTriggerUsedEnderEye,
  'minecraft:used_ender_eye': JsonTriggerUsedEnderEye,
  'used_totem': JsonTriggerUsedTotem,
  'minecraft:used_totem': JsonTriggerUsedTotem,
  'using_item': JsonTriggerUsingItem,
  'minecraft:using_item': JsonTriggerUsingItem,
  'villager_trade': JsonTriggerVillagerTrade,
  'minecraft:villager_trade': JsonTriggerVillagerTrade,
  'voluntary_exile': JsonTriggerVoluntaryExile,
  'minecraft:voluntary_exile': JsonTriggerVoluntaryExile,
}
type JsonTriggerKeys = keyof JsonTriggerDispatcherMap
type JsonTriggerFallback = (
  | JsonTriggerAllayDropItemOnBlock
  | JsonTriggerAnyBlockUse
  | JsonTriggerAvoidVibration
  | JsonTriggerBeeNestDestroyed
  | JsonTriggerBredAnimals
  | JsonTriggerBrewedPotion
  | JsonTriggerChangedDimension
  | JsonTriggerChanneledLightning
  | JsonTriggerConstructBeacon
  | JsonTriggerConsumeItem
  | JsonTriggerCrafterRecipeCrafted
  | JsonTriggerCuredZombieVillager
  | JsonTriggerDefaultBlockUse
  | JsonTriggerEffectsChanged
  | JsonTriggerEnchantedItem
  | JsonTriggerEnterBlock
  | JsonTriggerEntityHurtPlayer
  | JsonTriggerEntityKilledPlayer
  | JsonTriggerFallAfterExplosion
  | JsonTriggerFallFromHeight
  | JsonTriggerFilledBucket
  | JsonTriggerFishingRodHooked
  | JsonTriggerHeroOfTheVillage
  | JsonTriggerImpossible
  | JsonTriggerInventoryChanged
  | JsonTriggerItemDurabilityChanged
  | JsonTriggerItemUsedOnBlock
  | JsonTriggerKillMobNearSculkCatalyst
  | JsonTriggerKilledByArrow
  | JsonTriggerLevitation
  | JsonTriggerLightningStrike
  | JsonTriggerLocation
  | JsonTriggerNetherTravel
  | JsonTriggerPlacedBlock
  | JsonTriggerPlayerGeneratesContainerLoot
  | JsonTriggerPlayerHurtEntity
  | JsonTriggerPlayerInteractedWithEntity
  | JsonTriggerPlayerKilledEntity
  | JsonTriggerPlayerShearedEquipment
  | JsonTriggerRecipeCrafted
  | JsonTriggerRecipeUnlocked
  | JsonTriggerRideEntityInLava
  | JsonTriggerShotCrossbow
  | JsonTriggerSleptInBed
  | JsonTriggerSlideDownBlock
  | JsonTriggerSpearMobs
  | JsonTriggerStartedRiding
  | JsonTriggerSummonedEntity
  | JsonTriggerTameAnimal
  | JsonTriggerTargetHit
  | JsonTriggerThrownItemPickedUpByEntity
  | JsonTriggerThrownItemPickedUpByPlayer
  | JsonTriggerTick
  | JsonTriggerUsedEnderEye
  | JsonTriggerUsedTotem
  | JsonTriggerUsingItem
  | JsonTriggerVillagerTrade
  | JsonTriggerVoluntaryExile)
type JsonTriggerAllayDropItemOnBlock = JsonItemUsedOnLocationTrigger
type JsonTriggerAnyBlockUse = JsonAnyBlockInteractionTrigger
type JsonTriggerAvoidVibration = JsonLocationTrigger
type JsonTriggerBeeNestDestroyed = JsonBeeNestDestroyedTrigger
type JsonTriggerBredAnimals = JsonBredAnimalsTrigger
type JsonTriggerBrewedPotion = JsonBrewedPotionTrigger
type JsonTriggerChangedDimension = JsonChangeDimensionTrigger
type JsonTriggerChanneledLightning = JsonChanneledLightningTrigger
type JsonTriggerConstructBeacon = JsonConstructBeaconTrigger
type JsonTriggerConsumeItem = JsonConsumeItemTrigger
type JsonTriggerCrafterRecipeCrafted = JsonRecipeCraftedTrigger
type JsonTriggerCuredZombieVillager = JsonCuredZombieVillagerTrigger
type JsonTriggerDefaultBlockUse = JsonDefaultBlockInteractionTrigger
type JsonTriggerEffectsChanged = JsonEffectsChangedTrigger
type JsonTriggerEnchantedItem = JsonEnchantedItemTrigger
type JsonTriggerEnterBlock = JsonEnterBlockTrigger
type JsonTriggerEntityHurtPlayer = JsonEntityHurtPlayerTrigger
type JsonTriggerEntityKilledPlayer = JsonKilledTrigger
type JsonTriggerFallAfterExplosion = JsonFallAfterExplosionTrigger
type JsonTriggerFallFromHeight = JsonDistanceTrigger
type JsonTriggerFilledBucket = JsonFilledBucketTrigger
type JsonTriggerFishingRodHooked = JsonFishingRodHookedTrigger
type JsonTriggerHeroOfTheVillage = JsonLocationTrigger
type JsonTriggerImpossible = JsonImpossibleTrigger
type JsonTriggerInventoryChanged = JsonInventoryChangeTrigger
type JsonTriggerItemDurabilityChanged = JsonItemDurabilityTrigger
type JsonTriggerItemUsedOnBlock = JsonItemUsedOnLocationTrigger
type JsonTriggerKillMobNearSculkCatalyst = JsonKilledTrigger
type JsonTriggerKilledByArrow = JsonKilledByArrowTrigger
type JsonTriggerLevitation = JsonLevitationTrigger
type JsonTriggerLightningStrike = JsonLightningStrikeTrigger
type JsonTriggerLocation = JsonLocationTrigger
type JsonTriggerNetherTravel = JsonNetherTravelTrigger
type JsonTriggerPlacedBlock = JsonPlacedBlockTrigger
type JsonTriggerPlayerGeneratesContainerLoot = JsonLootTableTrigger
type JsonTriggerPlayerHurtEntity = JsonPlayerHurtEntityTrigger
type JsonTriggerPlayerInteractedWithEntity = JsonPlayerInteractTrigger
type JsonTriggerPlayerKilledEntity = JsonKilledTrigger
type JsonTriggerPlayerShearedEquipment = JsonPlayerInteractTrigger
type JsonTriggerRecipeCrafted = JsonRecipeCraftedTrigger
type JsonTriggerRecipeUnlocked = JsonRecipeUnlockedTrigger
type JsonTriggerRideEntityInLava = JsonDistanceTrigger
type JsonTriggerShotCrossbow = JsonShotCrossbowTrigger
type JsonTriggerSleptInBed = JsonLocationTrigger
type JsonTriggerSlideDownBlock = JsonSlideDownBlockTrigger
type JsonTriggerSpearMobs = JsonSpearMobsTrigger
type JsonTriggerStartedRiding = JsonStartRidingTrigger
type JsonTriggerSummonedEntity = JsonSummonedEntityTrigger
type JsonTriggerTameAnimal = JsonTameAnimalTrigger
type JsonTriggerTargetHit = JsonTargetBlockTrigger
type JsonTriggerThrownItemPickedUpByEntity = JsonPickedUpItemTrigger
type JsonTriggerThrownItemPickedUpByPlayer = JsonPickedUpItemTrigger
type JsonTriggerTick = JsonPlayerTrigger
type JsonTriggerUsedEnderEye = JsonUsedEnderEyeTrigger
type JsonTriggerUsedTotem = JsonUsedTotemTrigger
type JsonTriggerUsingItem = JsonUsingItemTrigger
type JsonTriggerVillagerTrade = JsonTradeTrigger
type JsonTriggerVoluntaryExile = JsonLocationTrigger
export type JsonSymbolTrigger<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTriggerDispatcherMap
  : CASE extends 'keys' ? JsonTriggerKeys : CASE extends '%fallback' ? JsonTriggerFallback : never
