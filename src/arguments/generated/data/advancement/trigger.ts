import type {
  DamagePredicate,
  DamageSourcePredicate,
  DistancePredicate,
  EntityEffectsPredicate,
  ItemPredicate,
  LocationPredicate,
} from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { LootTableListRef } from 'sandstone/arguments/generated/data/loot.ts'
import type { PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { RecipeListRef } from 'sandstone/arguments/generated/data/recipe.ts'
import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util.ts'
import type { SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockListRef } from 'sandstone/arguments/generated/util/registry_ref.ts'
import type { PotionsPredicate } from 'sandstone/arguments/generated/world/component/predicate.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'
import type { NBTDouble, NBTInt, NBTList } from 'sandstone'

export type AdvancementEntityPredicate = PredicateRef

export type AdvancementLocationPredicate = PredicateRef

export type AllOptional<C extends NBTObject> = {
  conditions?: C,
}

export type AnyBlockInteractionTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Location.
   */
  location?: AdvancementLocationPredicate,
})>

export type BeeNestDestroyedTrigger = AllOptional<NonNullable<({
  [S in Extract<Extract<BlockListRef, string>, string>]?: (PlayerConditions & {
    blocks?: S,
    state?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : SymbolMcdocBlockStates<'%unknown'>)),
    /**
     * Number of bees that were inside the bee nest/beehive before it was broken.
     */
    num_bees_inside?: NBTInt,
    /**
     * Item used to break the block.
     */
    item?: ItemPredicate,
  })
}[Extract<BlockListRef, string>])>>

export type BlockStateConditions = NonNullable<({
  [S in Extract<Extract<BlockListRef, string>, string>]?: {
    blocks?: S,
    state?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : SymbolMcdocBlockStates<'%unknown'>)),
  }
}[Extract<BlockListRef, string>])>

export type BredAnimalsTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  parent?: AdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  partner?: AdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  child?: AdvancementEntityPredicate,
})>

export type BrewedPotionTrigger = AllOptional<(PlayerConditions & {
  potion?: PotionsPredicate,
})>

export type ChangeDimensionTrigger = AllOptional<(PlayerConditions & {
  from?: Registry['minecraft:dimension'],
  to?: Registry['minecraft:dimension'],
})>

export type ChanneledLightningTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity. \
   * Evaluates to true if every predicate in the list matches some victims.
   */
  victims?: Array<AdvancementEntityPredicate>,
})>

export type ConstructBeaconTrigger = AllOptional<(PlayerConditions & {
  /**
   * Tier of the updated beacon base.
   */
  level?: MinMaxBounds<NBTInt>,
})>

export type ConsumeItemTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
})>

export type CuredZombieVillagerTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  zombie?: AdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  villager?: AdvancementEntityPredicate,
})>

export type DefaultBlockInteractionTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Block Use.
   */
  location?: AdvancementLocationPredicate,
})>

export type DistanceTrigger = AllOptional<(PlayerConditions & {
  /**
   * Where the player started to travel.
   */
  start_position?: LocationPredicate,
  /**
   * How far the player travels.
   */
  distance?: DistancePredicate,
})>

export type EffectsChangedTrigger = AllOptional<(PlayerConditions & {
  effects?: EntityEffectsPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  source?: AdvancementEntityPredicate,
})>

export type EnchantedItemTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
  levels?: MinMaxBounds<NBTInt>,
})>

export type EnterBlockTrigger = AllOptional<(PlayerConditions & BlockStateConditions)>

export type EntityHurtPlayerTrigger = AllOptional<(PlayerConditions & {
  damage?: DamagePredicate,
})>

export type FallAfterExplosionTrigger = AllOptional<(PlayerConditions & {
  start_position?: LocationPredicate,
  distance?: DistancePredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  cause?: AdvancementEntityPredicate,
})>

export type FilledBucketTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
})>

export type FishingRodHookedTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity. \
   * Entity that was pulled.
   * Or the hook itself if no entity was hooked.
   */
  entity?: AdvancementEntityPredicate,
  /**
   * Item that was caught.
   */
  item?: ItemPredicate,
  /**
   * Fishing rod used.
   */
  rod?: ItemPredicate,
})>

export type ImpossibleTrigger = AllOptional<Record<string, never>>

export type InventoryChangedSlots = {
  /**
   * Amount of empty slots.
   */
  empty?: MinMaxBounds<NBTInt>,
  /**
   * Amount of occupied slots.
   */
  occupied?: MinMaxBounds<NBTInt>,
  /**
   * Amount of slots that are a full stack.
   */
  full?: MinMaxBounds<NBTInt>,
}

export type InventoryChangeTrigger = AllOptional<(PlayerConditions & {
  slots?: {
    /**
     * Amount of empty slots.
     */
    empty?: MinMaxBounds<NBTInt>,
    /**
     * Amount of occupied slots.
     */
    occupied?: MinMaxBounds<NBTInt>,
    /**
     * Amount of slots that are a full stack.
     */
    full?: MinMaxBounds<NBTInt>,
  },
  items?: Array<ItemPredicate>,
})>

export type ItemDurabilityTrigger = AllOptional<(PlayerConditions & {
  /**
   * Change in durability (negative numbers are used to indicate a decrease in durability).
   */
  delta?: MinMaxBounds<NBTInt>,
  /**
   * The resulting durability.
   */
  durability?: MinMaxBounds<NBTInt>,
  /**
   * The item before its durability changed.
   */
  item?: ItemPredicate,
})>

export type ItemUesdOnLocationConditions = (PlayerConditions & {
  /**
   * Predicate context: Advancement Location.
   */
  location?: AdvancementLocationPredicate,
})

export type ItemUsedOnLocationTrigger = AllOptional<ItemUesdOnLocationConditions>

export type KilledByArrowTrigger = AllOptional<(PlayerConditions & {
  /**
   * How many different types of entities were killed.
   */
  unique_entity_types?: MinMaxBounds<NBTInt>,
  /**
   * The weapon item that was used to fire the arrow.
   */
  fired_from_weapon?: ItemPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Evaluates to true if every predicate in the list matches some victims.
   */
  victims?: Array<AdvancementEntityPredicate>,
})>

export type KilledTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: AdvancementEntityPredicate,
  killing_blow?: DamageSourcePredicate,
})>

export type LevitationTrigger = AllOptional<(PlayerConditions & {
  distance?: DistancePredicate,
  duration?: MinMaxBounds<NBTInt>,
})>

export type LightningStrikeTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  lightning?: AdvancementEntityPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Evaluates to false if no entities are nearby.
   */
  bystander?: AdvancementEntityPredicate,
})>

export type LocationTrigger = AllOptional<PlayerConditions>

export type LootTableTrigger = ParitalRequired<(PlayerConditions & {
  loot_tables: LootTableListRef,
})>

export type NetherTravelTrigger = AllOptional<(PlayerConditions & {
  /**
   * Where in the Overworld the player was when they travelled to the Nether.
   */
  start_position?: LocationPredicate,
  /**
   * How far the player now is from the coordinate they started at in the Overworld before travelling.
   */
  distance?: DistancePredicate,
})>

export type ParitalRequired<C extends NBTObject> = {
  conditions: C,
}

export type PickedUpItemTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
  /**
   * Predicate context: Advancement Entity. \
   * Entity may not exist.
   */
  entity?: AdvancementEntityPredicate,
})>

export type PlacedBlockConditions = (PlayerConditions & BlockStateConditions & {
  /**
   * Item that was used to place the block before the item was consumed.
   */
  item?: ItemPredicate,
  /**
   * Predicate context: Advancement Location.
   */
  location?: LocationPredicate,
})

export type PlacedBlockTrigger = AllOptional<ItemUesdOnLocationConditions>

export type PlayerConditions = {
  /**
   * Predicate context: Advancement Entity.
   */
  player?: AdvancementEntityPredicate,
}

export type PlayerHurtEntityTrigger = AllOptional<(PlayerConditions & {
  damage?: DamagePredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: AdvancementEntityPredicate,
})>

export type PlayerInteractTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: AdvancementEntityPredicate,
})>

export type PlayerTrigger = AllOptional<PlayerConditions>

export type RecipeCraftedTrigger = ParitalRequired<(PlayerConditions & {
  recipes: RecipeListRef,
  /**
   * Value:
   * List length range: 1..9
   */
  ingredients?: NBTList<ItemPredicate, {
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
    max: 9,
  }>,
})>

export type RecipeUnlockedTrigger = ParitalRequired<(PlayerConditions & {
  recipes: RecipeListRef,
})>

export type ShotCrossbowTrigger = AllOptional<(PlayerConditions & {
  /**
   * Crossbow that was used.
   */
  item?: ItemPredicate,
})>

export type SlideDownBlockTrigger = AllOptional<(PlayerConditions & BlockStateConditions)>

export type SpearMobsTrigger = AllOptional<(PlayerConditions & {
  /**
   * Minimum mob count required.
   *
   * Value:
   * Range: 1..
   */
  count?: NBTInt<{
    min: 1,
  }>,
})>

export type StartRidingTrigger = AllOptional<PlayerConditions>

export type SummonedEntityTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: AdvancementEntityPredicate,
})>

export type TameAnimalTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  entity?: AdvancementEntityPredicate,
})>

export type TargetBlockTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  projectile?: AdvancementEntityPredicate,
  signal_strength?: MinMaxBounds<NBTInt>,
})>

export type TradeTrigger = AllOptional<(PlayerConditions & {
  /**
   * Predicate context: Advancement Entity.
   */
  villager?: AdvancementEntityPredicate,
  /**
   * Item that was purchased. \
   * `count` tag checks the item count from one trade, not the total amount traded for.
   */
  item?: ItemPredicate,
})>

export type UsedEnderEyeTrigger = AllOptional<(PlayerConditions & {
  /**
   * Horizontal distance between the player and the stronghold.
   */
  distance?: MinMaxBounds<(NBTDouble | number)>,
})>

export type UsedTotemTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
})>

export type UsingItemTrigger = AllOptional<(PlayerConditions & {
  item?: ItemPredicate,
})>
type TriggerDispatcherMap = {
  'allay_drop_item_on_block': TriggerAllayDropItemOnBlock,
  'minecraft:allay_drop_item_on_block': TriggerAllayDropItemOnBlock,
  'any_block_use': TriggerAnyBlockUse,
  'minecraft:any_block_use': TriggerAnyBlockUse,
  'avoid_vibration': TriggerAvoidVibration,
  'minecraft:avoid_vibration': TriggerAvoidVibration,
  'bee_nest_destroyed': TriggerBeeNestDestroyed,
  'minecraft:bee_nest_destroyed': TriggerBeeNestDestroyed,
  'bred_animals': TriggerBredAnimals,
  'minecraft:bred_animals': TriggerBredAnimals,
  'brewed_potion': TriggerBrewedPotion,
  'minecraft:brewed_potion': TriggerBrewedPotion,
  'changed_dimension': TriggerChangedDimension,
  'minecraft:changed_dimension': TriggerChangedDimension,
  'channeled_lightning': TriggerChanneledLightning,
  'minecraft:channeled_lightning': TriggerChanneledLightning,
  'construct_beacon': TriggerConstructBeacon,
  'minecraft:construct_beacon': TriggerConstructBeacon,
  'consume_item': TriggerConsumeItem,
  'minecraft:consume_item': TriggerConsumeItem,
  'crafter_recipe_crafted': TriggerCrafterRecipeCrafted,
  'minecraft:crafter_recipe_crafted': TriggerCrafterRecipeCrafted,
  'cured_zombie_villager': TriggerCuredZombieVillager,
  'minecraft:cured_zombie_villager': TriggerCuredZombieVillager,
  'default_block_use': TriggerDefaultBlockUse,
  'minecraft:default_block_use': TriggerDefaultBlockUse,
  'effects_changed': TriggerEffectsChanged,
  'minecraft:effects_changed': TriggerEffectsChanged,
  'enchanted_item': TriggerEnchantedItem,
  'minecraft:enchanted_item': TriggerEnchantedItem,
  'enter_block': TriggerEnterBlock,
  'minecraft:enter_block': TriggerEnterBlock,
  'entity_hurt_player': TriggerEntityHurtPlayer,
  'minecraft:entity_hurt_player': TriggerEntityHurtPlayer,
  'entity_killed_player': TriggerEntityKilledPlayer,
  'minecraft:entity_killed_player': TriggerEntityKilledPlayer,
  'fall_after_explosion': TriggerFallAfterExplosion,
  'minecraft:fall_after_explosion': TriggerFallAfterExplosion,
  'fall_from_height': TriggerFallFromHeight,
  'minecraft:fall_from_height': TriggerFallFromHeight,
  'filled_bucket': TriggerFilledBucket,
  'minecraft:filled_bucket': TriggerFilledBucket,
  'fishing_rod_hooked': TriggerFishingRodHooked,
  'minecraft:fishing_rod_hooked': TriggerFishingRodHooked,
  'hero_of_the_village': TriggerHeroOfTheVillage,
  'minecraft:hero_of_the_village': TriggerHeroOfTheVillage,
  'impossible': TriggerImpossible,
  'minecraft:impossible': TriggerImpossible,
  'inventory_changed': TriggerInventoryChanged,
  'minecraft:inventory_changed': TriggerInventoryChanged,
  'item_durability_changed': TriggerItemDurabilityChanged,
  'minecraft:item_durability_changed': TriggerItemDurabilityChanged,
  'item_used_on_block': TriggerItemUsedOnBlock,
  'minecraft:item_used_on_block': TriggerItemUsedOnBlock,
  'kill_mob_near_sculk_catalyst': TriggerKillMobNearSculkCatalyst,
  'minecraft:kill_mob_near_sculk_catalyst': TriggerKillMobNearSculkCatalyst,
  'killed_by_arrow': TriggerKilledByArrow,
  'minecraft:killed_by_arrow': TriggerKilledByArrow,
  'levitation': TriggerLevitation,
  'minecraft:levitation': TriggerLevitation,
  'lightning_strike': TriggerLightningStrike,
  'minecraft:lightning_strike': TriggerLightningStrike,
  'location': TriggerLocation,
  'minecraft:location': TriggerLocation,
  'nether_travel': TriggerNetherTravel,
  'minecraft:nether_travel': TriggerNetherTravel,
  'placed_block': TriggerPlacedBlock,
  'minecraft:placed_block': TriggerPlacedBlock,
  'player_generates_container_loot': TriggerPlayerGeneratesContainerLoot,
  'minecraft:player_generates_container_loot': TriggerPlayerGeneratesContainerLoot,
  'player_hurt_entity': TriggerPlayerHurtEntity,
  'minecraft:player_hurt_entity': TriggerPlayerHurtEntity,
  'player_interacted_with_entity': TriggerPlayerInteractedWithEntity,
  'minecraft:player_interacted_with_entity': TriggerPlayerInteractedWithEntity,
  'player_killed_entity': TriggerPlayerKilledEntity,
  'minecraft:player_killed_entity': TriggerPlayerKilledEntity,
  'player_sheared_equipment': TriggerPlayerShearedEquipment,
  'minecraft:player_sheared_equipment': TriggerPlayerShearedEquipment,
  'recipe_crafted': TriggerRecipeCrafted,
  'minecraft:recipe_crafted': TriggerRecipeCrafted,
  'recipe_unlocked': TriggerRecipeUnlocked,
  'minecraft:recipe_unlocked': TriggerRecipeUnlocked,
  'ride_entity_in_lava': TriggerRideEntityInLava,
  'minecraft:ride_entity_in_lava': TriggerRideEntityInLava,
  'shot_crossbow': TriggerShotCrossbow,
  'minecraft:shot_crossbow': TriggerShotCrossbow,
  'slept_in_bed': TriggerSleptInBed,
  'minecraft:slept_in_bed': TriggerSleptInBed,
  'slide_down_block': TriggerSlideDownBlock,
  'minecraft:slide_down_block': TriggerSlideDownBlock,
  'spear_mobs': TriggerSpearMobs,
  'minecraft:spear_mobs': TriggerSpearMobs,
  'started_riding': TriggerStartedRiding,
  'minecraft:started_riding': TriggerStartedRiding,
  'summoned_entity': TriggerSummonedEntity,
  'minecraft:summoned_entity': TriggerSummonedEntity,
  'tame_animal': TriggerTameAnimal,
  'minecraft:tame_animal': TriggerTameAnimal,
  'target_hit': TriggerTargetHit,
  'minecraft:target_hit': TriggerTargetHit,
  'thrown_item_picked_up_by_entity': TriggerThrownItemPickedUpByEntity,
  'minecraft:thrown_item_picked_up_by_entity': TriggerThrownItemPickedUpByEntity,
  'thrown_item_picked_up_by_player': TriggerThrownItemPickedUpByPlayer,
  'minecraft:thrown_item_picked_up_by_player': TriggerThrownItemPickedUpByPlayer,
  'tick': TriggerTick,
  'minecraft:tick': TriggerTick,
  'used_ender_eye': TriggerUsedEnderEye,
  'minecraft:used_ender_eye': TriggerUsedEnderEye,
  'used_totem': TriggerUsedTotem,
  'minecraft:used_totem': TriggerUsedTotem,
  'using_item': TriggerUsingItem,
  'minecraft:using_item': TriggerUsingItem,
  'villager_trade': TriggerVillagerTrade,
  'minecraft:villager_trade': TriggerVillagerTrade,
  'voluntary_exile': TriggerVoluntaryExile,
  'minecraft:voluntary_exile': TriggerVoluntaryExile,
}
type TriggerKeys = keyof TriggerDispatcherMap
type TriggerFallback = (
  | TriggerAllayDropItemOnBlock
  | TriggerAnyBlockUse
  | TriggerAvoidVibration
  | TriggerBeeNestDestroyed
  | TriggerBredAnimals
  | TriggerBrewedPotion
  | TriggerChangedDimension
  | TriggerChanneledLightning
  | TriggerConstructBeacon
  | TriggerConsumeItem
  | TriggerCrafterRecipeCrafted
  | TriggerCuredZombieVillager
  | TriggerDefaultBlockUse
  | TriggerEffectsChanged
  | TriggerEnchantedItem
  | TriggerEnterBlock
  | TriggerEntityHurtPlayer
  | TriggerEntityKilledPlayer
  | TriggerFallAfterExplosion
  | TriggerFallFromHeight
  | TriggerFilledBucket
  | TriggerFishingRodHooked
  | TriggerHeroOfTheVillage
  | TriggerImpossible
  | TriggerInventoryChanged
  | TriggerItemDurabilityChanged
  | TriggerItemUsedOnBlock
  | TriggerKillMobNearSculkCatalyst
  | TriggerKilledByArrow
  | TriggerLevitation
  | TriggerLightningStrike
  | TriggerLocation
  | TriggerNetherTravel
  | TriggerPlacedBlock
  | TriggerPlayerGeneratesContainerLoot
  | TriggerPlayerHurtEntity
  | TriggerPlayerInteractedWithEntity
  | TriggerPlayerKilledEntity
  | TriggerPlayerShearedEquipment
  | TriggerRecipeCrafted
  | TriggerRecipeUnlocked
  | TriggerRideEntityInLava
  | TriggerShotCrossbow
  | TriggerSleptInBed
  | TriggerSlideDownBlock
  | TriggerSpearMobs
  | TriggerStartedRiding
  | TriggerSummonedEntity
  | TriggerTameAnimal
  | TriggerTargetHit
  | TriggerThrownItemPickedUpByEntity
  | TriggerThrownItemPickedUpByPlayer
  | TriggerTick
  | TriggerUsedEnderEye
  | TriggerUsedTotem
  | TriggerUsingItem
  | TriggerVillagerTrade
  | TriggerVoluntaryExile)
type TriggerAllayDropItemOnBlock = ItemUsedOnLocationTrigger
type TriggerAnyBlockUse = AnyBlockInteractionTrigger
type TriggerAvoidVibration = LocationTrigger
type TriggerBeeNestDestroyed = BeeNestDestroyedTrigger
type TriggerBredAnimals = BredAnimalsTrigger
type TriggerBrewedPotion = BrewedPotionTrigger
type TriggerChangedDimension = ChangeDimensionTrigger
type TriggerChanneledLightning = ChanneledLightningTrigger
type TriggerConstructBeacon = ConstructBeaconTrigger
type TriggerConsumeItem = ConsumeItemTrigger
type TriggerCrafterRecipeCrafted = RecipeCraftedTrigger
type TriggerCuredZombieVillager = CuredZombieVillagerTrigger
type TriggerDefaultBlockUse = DefaultBlockInteractionTrigger
type TriggerEffectsChanged = EffectsChangedTrigger
type TriggerEnchantedItem = EnchantedItemTrigger
type TriggerEnterBlock = EnterBlockTrigger
type TriggerEntityHurtPlayer = EntityHurtPlayerTrigger
type TriggerEntityKilledPlayer = KilledTrigger
type TriggerFallAfterExplosion = FallAfterExplosionTrigger
type TriggerFallFromHeight = DistanceTrigger
type TriggerFilledBucket = FilledBucketTrigger
type TriggerFishingRodHooked = FishingRodHookedTrigger
type TriggerHeroOfTheVillage = LocationTrigger
type TriggerImpossible = ImpossibleTrigger
type TriggerInventoryChanged = InventoryChangeTrigger
type TriggerItemDurabilityChanged = ItemDurabilityTrigger
type TriggerItemUsedOnBlock = ItemUsedOnLocationTrigger
type TriggerKillMobNearSculkCatalyst = KilledTrigger
type TriggerKilledByArrow = KilledByArrowTrigger
type TriggerLevitation = LevitationTrigger
type TriggerLightningStrike = LightningStrikeTrigger
type TriggerLocation = LocationTrigger
type TriggerNetherTravel = NetherTravelTrigger
type TriggerPlacedBlock = PlacedBlockTrigger
type TriggerPlayerGeneratesContainerLoot = LootTableTrigger
type TriggerPlayerHurtEntity = PlayerHurtEntityTrigger
type TriggerPlayerInteractedWithEntity = PlayerInteractTrigger
type TriggerPlayerKilledEntity = KilledTrigger
type TriggerPlayerShearedEquipment = PlayerInteractTrigger
type TriggerRecipeCrafted = RecipeCraftedTrigger
type TriggerRecipeUnlocked = RecipeUnlockedTrigger
type TriggerRideEntityInLava = DistanceTrigger
type TriggerShotCrossbow = ShotCrossbowTrigger
type TriggerSleptInBed = LocationTrigger
type TriggerSlideDownBlock = SlideDownBlockTrigger
type TriggerSpearMobs = SpearMobsTrigger
type TriggerStartedRiding = StartRidingTrigger
type TriggerSummonedEntity = SummonedEntityTrigger
type TriggerTameAnimal = TameAnimalTrigger
type TriggerTargetHit = TargetBlockTrigger
type TriggerThrownItemPickedUpByEntity = PickedUpItemTrigger
type TriggerThrownItemPickedUpByPlayer = PickedUpItemTrigger
type TriggerTick = PlayerTrigger
type TriggerUsedEnderEye = UsedEnderEyeTrigger
type TriggerUsedTotem = UsedTotemTrigger
type TriggerUsingItem = UsingItemTrigger
type TriggerVillagerTrade = TradeTrigger
type TriggerVoluntaryExile = LocationTrigger
export type SymbolTrigger<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? TriggerDispatcherMap
  : CASE extends 'keys' ? TriggerKeys : CASE extends '%fallback' ? TriggerFallback : never
