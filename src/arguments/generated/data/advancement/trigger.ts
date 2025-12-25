import type {
  DamagePredicate,
  DamageSourcePredicate,
  DistancePredicate,
  EntityPredicate,
  ItemPredicate,
  LocationPredicate,
  MobEffectPredicate,
} from 'sandstone/arguments/generated/data/advancement/predicate'
import type { LootCondition } from 'sandstone/arguments/generated/data/loot'
import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type AllayDropItemOnBlock = (TriggerBase & {
  location?: Array<LootCondition>
})

export type AnyBlockUse = (TriggerBase & {
  location?: Array<LootCondition>
})

export type BeeNestDestroyed = (TriggerBase & {
  block?: Registry['minecraft:block']
  /**
     * Number of bees that were inside the bee nest/beehive before it was broken.
     */
  num_bees_inside?: NBTInt
  /**
     * Item used to break the block.
     */
  item?: ItemPredicate
})

export type BredAnimals = (TriggerBase & {
  parent?: CompositeEntity
  partner?: CompositeEntity
  child?: CompositeEntity
})

export type BrewedPotion = (TriggerBase & {
  potion?: Registry['minecraft:potion']
})

export type ChangedDimension = (TriggerBase & {
  from?: Registry['minecraft:dimension']
  to?: Registry['minecraft:dimension']
})

export type ChanneledLightning = (TriggerBase & {
  victims?: Array<CompositeEntity>
})

export type CompositeEntity = (EntityPredicate | Array<LootCondition>)

export type Conditions<C> = {
  conditions?: C
}

export type ConstructBeacon = (TriggerBase & {
  /**
     * Tier of the updated beacon base.
     */
  level?: MinMaxBounds<NBTInt>
})

export type ConsumeItem = (TriggerBase & {
  item?: ItemPredicate
})

export type CuredZombieVillager = (TriggerBase & {
  villager?: CompositeEntity
  zombie?: CompositeEntity
})

export type DefaultBlockUse = (TriggerBase & {
  /**
     * The location of the block.
     */
  location?: Array<LootCondition>
})

export type EffectsChanged = (TriggerBase & {
  effects?: ({
    [Key in Extract<Registry['minecraft:mob_effect'], string>]?: MobEffectPredicate;
  })
  source?: CompositeEntity
})

export type EnchantedItem = (TriggerBase & {
  item?: ItemPredicate
  levels?: MinMaxBounds<NBTInt>
})

export type EnterBlock = ({
  [S in Extract<Registry['minecraft:block'], string>]?: (TriggerBase & {
    block?: S
    state?: (S extends undefined ? Dispatcher<'mcdoc:block_states', [
      '%none',
    ]> : (S extends keyof Dispatcher<'mcdoc:block_states'>
      ? Dispatcher<'mcdoc:block_states'>[S]
      : Record<string, unknown>))
  });
}[Registry['minecraft:block']])

export type EntityHurtPlayer = (TriggerBase & {
  damage?: DamagePredicate
})

export type EntityKilledPlayer = (TriggerBase & {
  entity?: CompositeEntity
  killing_blow?: DamageSourcePredicate
})

export type FallAfterExplosion = (TriggerBase & {
  start_position?: LocationPredicate
  distance?: DistancePredicate
  cause?: CompositeEntity
})

export type FallFromHeight = (TriggerBase & {
  start_position?: LocationPredicate
  distance?: DistancePredicate
})

export type FilledBucket = (TriggerBase & {
  item?: ItemPredicate
})

export type FishingRodHooked = (TriggerBase & {
  /**
     * Entity that was pulled.
     */
  entity?: CompositeEntity
  /**
     * Item that was caught.
     */
  item?: ItemPredicate
  /**
     * Fishing rod used.
     */
  rod?: ItemPredicate
})

export type InventoryChanged = (TriggerBase & {
  slots?: {
    /**
         * Amount of empty slots.
         */
    empty?: MinMaxBounds<NBTInt>
    /**
         * Amount of occupied slots.
         */
    occupied?: MinMaxBounds<NBTInt>
    /**
         * Amount of slots that are a full stack.
         */
    full?: MinMaxBounds<NBTInt>
  }
  items?: Array<ItemPredicate>
})

export type ItemDurabilityChanged = (TriggerBase & {
  /**
     * Change in durability (negative numbers are used to indicate a decrease in durability).
     */
  delta?: MinMaxBounds<NBTInt>
  /**
     * The resulting durability.
     */
  durability?: MinMaxBounds<NBTInt>
  /**
     * The item before its durability changed.
     */
  item?: ItemPredicate
})

export type ItemUsedOnBlock = (TriggerBase & {
  location?: Array<LootCondition>
})

export type KilledByArrow = (TriggerBase & {
  /**
     * How many different types of entities were killed.
     */
  unique_entity_types?: MinMaxBounds<NBTInt>
  /**
     * The weapon item that was used to fire the arrow.
     */
  fired_from_weapon?: ItemPredicate
  victims?: Array<CompositeEntity>
})

export type KilledByCrossbow = (TriggerBase & {
  /**
     * How many different types of entities were killed.
     */
  unique_entity_types?: MinMaxBounds<NBTInt>
  victims?: Array<CompositeEntity>
})

export type KillMobNearSculkCatalyst = (TriggerBase & {
  entity?: EntityPredicate
  killing_blow?: DamageSourcePredicate
})

export type Levitation = (TriggerBase & {
  distance?: DistancePredicate
  duration?: MinMaxBounds<NBTInt>
})

export type LightningStrike = (TriggerBase & {
  lightning?: CompositeEntity
  bystander?: CompositeEntity
})

export type Location = TriggerBase

export type NetherTravel = (TriggerBase & {
  /**
     * Where in the Overworld the player was when they travelled to the Nether.
     */
  start_position?: LocationPredicate
  /**
     * How far the player now is from the coordinate they started at in the Overworld before travelling.
     */
  distance?: DistancePredicate
})

export type PlacedBlock = (TriggerBase & {
  /**
     * Where the block was placed.
     */
  location?: Array<LootCondition>
})

export type PlayerGeneratesContainerLoot = (TriggerBase & {
  loot_table: Registry['minecraft:loot_table']
})

export type PlayerHurtEntity = (TriggerBase & {
  damage?: DamagePredicate
  entity?: CompositeEntity
})

export type PlayerInteract = (TriggerBase & {
  item?: ItemPredicate
  entity?: CompositeEntity
})

export type PlayerKilledEntity = (TriggerBase & {
  entity?: CompositeEntity
  killing_blow?: DamageSourcePredicate
})

export type RecipeCrafted = (TriggerBase & {
  recipe_id: Registry['minecraft:recipe']
  /**
     * Value:
     * List length range: 1..9
     */
  ingredients?: NBTList<ItemPredicate, {
    leftExclusive: false
    rightExclusive: false
    min: 1
    max: 9
  }>
})

export type RecipeUnlocked = (TriggerBase & {
  recipe: Registry['minecraft:recipe']
})

export type RequiredConditions<C> = {
  conditions: C
}

export type RideEntityInLava = (TriggerBase & {
  start_position?: LocationPredicate
  distance?: DistancePredicate
})

export type SafelyHarvestHoney = (TriggerBase & {
  block?: {
    block?: Registry['minecraft:block']
    tag?: (Registry['minecraft:tag/block'])
  }
  item?: ItemPredicate
})

export type ShotCrossbow = (TriggerBase & {
  /**
     * Crossbow that was used.
     */
  item?: ItemPredicate
})

export type SlideDownBlock = (TriggerBase & {
  block?: Registry['minecraft:block']
})

export type SpearMobs = (TriggerBase & {
  /**
     * Value:
     * Range: 1..
     */
  count?: NBTInt<{
    min: 1
  }>
})

export type SummonedEntity = (TriggerBase & {
  entity?: CompositeEntity
})

export type TameAnimal = (TriggerBase & {
  entity?: CompositeEntity
})

export type TargetHit = (TriggerBase & {
  projectile?: CompositeEntity
  shooter?: CompositeEntity
  signal_strength?: MinMaxBounds<NBTInt>
})

export type ThrownItemPickedUpByEntity = (TriggerBase & {
  item?: ItemPredicate
  entity?: CompositeEntity
})

export type ThrownItemPickedUpByPlayer = (TriggerBase & {
  item?: ItemPredicate
  entity?: CompositeEntity
})

export type TriggerBase = {
  player?: CompositeEntity
}

export type UsedEnderEye = (TriggerBase & {
  /**
     * Horizontal distance between the player and the stronghold.
     */
  distance?: MinMaxBounds<NBTFloat>
})

export type UsedTotem = (TriggerBase & {
  item?: ItemPredicate
})

export type UsingItem = (TriggerBase & {
  item?: ItemPredicate
})

export type VillagerTrade = (TriggerBase & {
  villager?: CompositeEntity
  /**
     * Item that was purchased. `count` tag checks the item count from one trade, not the total amount traded for.
     */
  item?: ItemPredicate
})
type TriggerDispatcherMap = {
  'allay_drop_item_on_block': TriggerAllayDropItemOnBlock
  'minecraft:allay_drop_item_on_block': TriggerAllayDropItemOnBlock
  'any_block_use': TriggerAnyBlockUse
  'minecraft:any_block_use': TriggerAnyBlockUse
  'bee_nest_destroyed': TriggerBeeNestDestroyed
  'minecraft:bee_nest_destroyed': TriggerBeeNestDestroyed
  'bred_animals': TriggerBredAnimals
  'minecraft:bred_animals': TriggerBredAnimals
  'brewed_potion': TriggerBrewedPotion
  'minecraft:brewed_potion': TriggerBrewedPotion
  'changed_dimension': TriggerChangedDimension
  'minecraft:changed_dimension': TriggerChangedDimension
  'channeled_lightning': TriggerChanneledLightning
  'minecraft:channeled_lightning': TriggerChanneledLightning
  'construct_beacon': TriggerConstructBeacon
  'minecraft:construct_beacon': TriggerConstructBeacon
  'consume_item': TriggerConsumeItem
  'minecraft:consume_item': TriggerConsumeItem
  'crafter_recipe_crafted': TriggerCrafterRecipeCrafted
  'minecraft:crafter_recipe_crafted': TriggerCrafterRecipeCrafted
  'cured_zombie_villager': TriggerCuredZombieVillager
  'minecraft:cured_zombie_villager': TriggerCuredZombieVillager
  'default_block_use': TriggerDefaultBlockUse
  'minecraft:default_block_use': TriggerDefaultBlockUse
  'effects_changed': TriggerEffectsChanged
  'minecraft:effects_changed': TriggerEffectsChanged
  'enchanted_item': TriggerEnchantedItem
  'minecraft:enchanted_item': TriggerEnchantedItem
  'enter_block': TriggerEnterBlock
  'minecraft:enter_block': TriggerEnterBlock
  'entity_hurt_player': TriggerEntityHurtPlayer
  'minecraft:entity_hurt_player': TriggerEntityHurtPlayer
  'entity_killed_player': TriggerEntityKilledPlayer
  'minecraft:entity_killed_player': TriggerEntityKilledPlayer
  'fall_after_explosion': TriggerFallAfterExplosion
  'minecraft:fall_after_explosion': TriggerFallAfterExplosion
  'fall_from_height': TriggerFallFromHeight
  'minecraft:fall_from_height': TriggerFallFromHeight
  'filled_bucket': TriggerFilledBucket
  'minecraft:filled_bucket': TriggerFilledBucket
  'fishing_rod_hooked': TriggerFishingRodHooked
  'minecraft:fishing_rod_hooked': TriggerFishingRodHooked
  'hero_of_the_village': TriggerHeroOfTheVillage
  'minecraft:hero_of_the_village': TriggerHeroOfTheVillage
  'impossible': TriggerImpossible
  'minecraft:impossible': TriggerImpossible
  'inventory_changed': TriggerInventoryChanged
  'minecraft:inventory_changed': TriggerInventoryChanged
  'item_durability_changed': TriggerItemDurabilityChanged
  'minecraft:item_durability_changed': TriggerItemDurabilityChanged
  'item_used_on_block': TriggerItemUsedOnBlock
  'minecraft:item_used_on_block': TriggerItemUsedOnBlock
  'kill_mob_near_sculk_catalyst': TriggerKillMobNearSculkCatalyst
  'minecraft:kill_mob_near_sculk_catalyst': TriggerKillMobNearSculkCatalyst
  'killed_by_arrow': TriggerKilledByArrow
  'minecraft:killed_by_arrow': TriggerKilledByArrow
  'killed_by_crossbow': TriggerKilledByCrossbow
  'minecraft:killed_by_crossbow': TriggerKilledByCrossbow
  'levitation': TriggerLevitation
  'minecraft:levitation': TriggerLevitation
  'lightning_strike': TriggerLightningStrike
  'minecraft:lightning_strike': TriggerLightningStrike
  'location': TriggerLocation
  'minecraft:location': TriggerLocation
  'nether_travel': TriggerNetherTravel
  'minecraft:nether_travel': TriggerNetherTravel
  'placed_block': TriggerPlacedBlock
  'minecraft:placed_block': TriggerPlacedBlock
  'player_generates_container_loot': TriggerPlayerGeneratesContainerLoot
  'minecraft:player_generates_container_loot': TriggerPlayerGeneratesContainerLoot
  'player_hurt_entity': TriggerPlayerHurtEntity
  'minecraft:player_hurt_entity': TriggerPlayerHurtEntity
  'player_interacted_with_entity': TriggerPlayerInteractedWithEntity
  'minecraft:player_interacted_with_entity': TriggerPlayerInteractedWithEntity
  'player_killed_entity': TriggerPlayerKilledEntity
  'minecraft:player_killed_entity': TriggerPlayerKilledEntity
  'player_sheared_equipment': TriggerPlayerShearedEquipment
  'minecraft:player_sheared_equipment': TriggerPlayerShearedEquipment
  'recipe_crafted': TriggerRecipeCrafted
  'minecraft:recipe_crafted': TriggerRecipeCrafted
  'recipe_unlocked': TriggerRecipeUnlocked
  'minecraft:recipe_unlocked': TriggerRecipeUnlocked
  'ride_entity_in_lava': TriggerRideEntityInLava
  'minecraft:ride_entity_in_lava': TriggerRideEntityInLava
  'safely_harvest_honey': TriggerSafelyHarvestHoney
  'minecraft:safely_harvest_honey': TriggerSafelyHarvestHoney
  'shot_crossbow': TriggerShotCrossbow
  'minecraft:shot_crossbow': TriggerShotCrossbow
  'slept_in_bed': TriggerSleptInBed
  'minecraft:slept_in_bed': TriggerSleptInBed
  'slide_down_block': TriggerSlideDownBlock
  'minecraft:slide_down_block': TriggerSlideDownBlock
  'spear_mobs': TriggerSpearMobs
  'minecraft:spear_mobs': TriggerSpearMobs
  'started_riding': TriggerStartedRiding
  'minecraft:started_riding': TriggerStartedRiding
  'summoned_entity': TriggerSummonedEntity
  'minecraft:summoned_entity': TriggerSummonedEntity
  'tame_animal': TriggerTameAnimal
  'minecraft:tame_animal': TriggerTameAnimal
  'target_hit': TriggerTargetHit
  'minecraft:target_hit': TriggerTargetHit
  'thrown_item_picked_up_by_entity': TriggerThrownItemPickedUpByEntity
  'minecraft:thrown_item_picked_up_by_entity': TriggerThrownItemPickedUpByEntity
  'thrown_item_picked_up_by_player': TriggerThrownItemPickedUpByPlayer
  'minecraft:thrown_item_picked_up_by_player': TriggerThrownItemPickedUpByPlayer
  'tick': TriggerTick
  'minecraft:tick': TriggerTick
  'used_ender_eye': TriggerUsedEnderEye
  'minecraft:used_ender_eye': TriggerUsedEnderEye
  'used_totem': TriggerUsedTotem
  'minecraft:used_totem': TriggerUsedTotem
  'using_item': TriggerUsingItem
  'minecraft:using_item': TriggerUsingItem
  'villager_trade': TriggerVillagerTrade
  'minecraft:villager_trade': TriggerVillagerTrade
  'voluntary_exile': TriggerVoluntaryExile
  'minecraft:voluntary_exile': TriggerVoluntaryExile
}
type TriggerKeys = keyof TriggerDispatcherMap
type TriggerFallback = (
  | TriggerAllayDropItemOnBlock
  | TriggerAnyBlockUse
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
  | TriggerKilledByCrossbow
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
  | TriggerSafelyHarvestHoney
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
type TriggerAllayDropItemOnBlock = Conditions<AllayDropItemOnBlock>
type TriggerAnyBlockUse = Conditions<AnyBlockUse>
type TriggerBeeNestDestroyed = Conditions<BeeNestDestroyed>
type TriggerBredAnimals = Conditions<BredAnimals>
type TriggerBrewedPotion = Conditions<BrewedPotion>
type TriggerChangedDimension = Conditions<ChangedDimension>
type TriggerChanneledLightning = Conditions<ChanneledLightning>
type TriggerConstructBeacon = Conditions<ConstructBeacon>
type TriggerConsumeItem = Conditions<ConsumeItem>
type TriggerCrafterRecipeCrafted = RequiredConditions<RecipeCrafted>
type TriggerCuredZombieVillager = Conditions<CuredZombieVillager>
type TriggerDefaultBlockUse = Conditions<DefaultBlockUse>
type TriggerEffectsChanged = Conditions<EffectsChanged>
type TriggerEnchantedItem = Conditions<EnchantedItem>
type TriggerEnterBlock = Conditions<EnterBlock>
type TriggerEntityHurtPlayer = Conditions<EntityHurtPlayer>
type TriggerEntityKilledPlayer = Conditions<EntityKilledPlayer>
type TriggerFallAfterExplosion = Conditions<FallAfterExplosion>
type TriggerFallFromHeight = Conditions<FallFromHeight>
type TriggerFilledBucket = Conditions<FilledBucket>
type TriggerFishingRodHooked = Conditions<FishingRodHooked>
type TriggerHeroOfTheVillage = Conditions<Location>
type TriggerImpossible = Conditions<TriggerBase>
type TriggerInventoryChanged = Conditions<InventoryChanged>
type TriggerItemDurabilityChanged = Conditions<ItemDurabilityChanged>
type TriggerItemUsedOnBlock = Conditions<ItemUsedOnBlock>
type TriggerKillMobNearSculkCatalyst = Conditions<KillMobNearSculkCatalyst>
type TriggerKilledByArrow = Conditions<KilledByArrow>
type TriggerKilledByCrossbow = Conditions<KilledByCrossbow>
type TriggerLevitation = Conditions<Levitation>
type TriggerLightningStrike = Conditions<LightningStrike>
type TriggerLocation = Conditions<Location>
type TriggerNetherTravel = Conditions<NetherTravel>
type TriggerPlacedBlock = Conditions<PlacedBlock>
type TriggerPlayerGeneratesContainerLoot = RequiredConditions<PlayerGeneratesContainerLoot>
type TriggerPlayerHurtEntity = Conditions<PlayerHurtEntity>
type TriggerPlayerInteractedWithEntity = Conditions<PlayerInteract>
type TriggerPlayerKilledEntity = Conditions<PlayerKilledEntity>
type TriggerPlayerShearedEquipment = Conditions<PlayerInteract>
type TriggerRecipeCrafted = RequiredConditions<RecipeCrafted>
type TriggerRecipeUnlocked = RequiredConditions<RecipeUnlocked>
type TriggerRideEntityInLava = Conditions<RideEntityInLava>
type TriggerSafelyHarvestHoney = Conditions<SafelyHarvestHoney>
type TriggerShotCrossbow = Conditions<ShotCrossbow>
type TriggerSleptInBed = Conditions<Location>
type TriggerSlideDownBlock = Conditions<SlideDownBlock>
type TriggerSpearMobs = Conditions<SpearMobs>
type TriggerStartedRiding = Conditions<TriggerBase>
type TriggerSummonedEntity = Conditions<SummonedEntity>
type TriggerTameAnimal = Conditions<TameAnimal>
type TriggerTargetHit = Conditions<TargetHit>
type TriggerThrownItemPickedUpByEntity = Conditions<ThrownItemPickedUpByEntity>
type TriggerThrownItemPickedUpByPlayer = Conditions<ThrownItemPickedUpByPlayer>
type TriggerTick = Conditions<TriggerBase>
type TriggerUsedEnderEye = Conditions<UsedEnderEye>
type TriggerUsedTotem = Conditions<UsedTotem>
type TriggerUsingItem = Conditions<UsingItem>
type TriggerVillagerTrade = Conditions<VillagerTrade>
type TriggerVoluntaryExile = Conditions<Location>
export type SymbolTrigger<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? TriggerDispatcherMap
  : CASE extends 'keys' ? TriggerKeys : CASE extends '%fallback' ? TriggerFallback : never
