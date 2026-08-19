import type { JsonMinMaxBounds } from 'sandstone/arguments/generated/_json/data/util.ts'
import type {
  JsonSymbolBlock,
  JsonSymbolEntity,
  JsonSymbolMcdocBlockStates,
  JsonSymbolStatisticType,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonEquipmentSlot } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type {
  JsonAxolotlVariant,
  JsonFoxType,
  JsonHorseVariant,
  JsonLlamaVariant,
  JsonMooshroomType,
  JsonParrotVariant,
  JsonRabbitVariant,
  JsonTropicalFishPattern,
} from 'sandstone/arguments/generated/_json/world/component/entity.ts'
import type {
  JsonDataComponentExactPredicate,
  JsonDataComponentPredicate,
} from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonBoatType } from 'sandstone/arguments/generated/_json/world/entity/boat.ts'
import type { ENTITY_SLOTS } from 'sandstone/arguments'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DamageTypeClass,
  EnchantmentClass,
  LabelClass,
  LiteralUnion,
  NBTClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NonEmptyString,
  TagClass,
  VariantClass,
} from 'sandstone'

export type JsonAxolotlPredicate = {
  /**
   * Value:
   *
   *  - Lucy(`lucy`)
   *  - Wild(`wild`)
   *  - Gold(`gold`)
   *  - Cyan(`cyan`)
   *  - Blue(`blue`): The rare variant.
   */
  variant: JsonAxolotlVariant,
}

export type JsonBlockPredicate<S = undefined> = {
  blocks?: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  state?: JsonBlockPredicateState,
  nbt?: ((
      | NonEmptyString | NBTClass) | (
      S extends keyof JsonSymbolBlock ? JsonSymbolBlock[S] : JsonSymbolBlock<'%unknown'>)),
  /**
   * Match exact data component values on the block entity.
   */
  components?: JsonDataComponentExactPredicate,
  /**
   * Test data component values on the block entity.
   */
  predicates?: JsonDataComponentPredicate,
}

export type JsonBlockPredicateState = JsonSymbolMcdocBlockStates<'%unknown'>

export type JsonBoatPredicate = {
  /**
   * Value:
   *
   *  - Oak(`oak`)
   *  - Spruce(`spruce`)
   *  - Birch(`birch`)
   *  - Jungle(`jungle`)
   *  - Acacia(`acacia`)
   *  - DarkOak(`dark_oak`)
   *  - Mangrove(`mangrove`)
   *  - Bamboo(`bamboo`)
   *  - Cherry(`cherry`)
   */
  variant: JsonBoatType,
}

export type JsonCatPredicate = {
  variant: ((
      | JsonRegistry['minecraft:cat_variant'] | `#${string}:${string}` | TagClass<'cat_variant'> | VariantClass<'cat'>)
      | Array<(JsonRegistry['minecraft:cat_variant'] | VariantClass<'cat'>)>),
}

export type JsonDamagePredicate = {
  /**
   * Amount of incoming damage before damage reduction.
   */
  dealt?: JsonMinMaxBounds<(NBTFloat | number)>,
  /**
   * Amount of incoming damage after damage reduction.
   */
  taken?: JsonMinMaxBounds<(NBTFloat | number)>,
  /**
   * Whether the damage was successfully blocked.
   */
  blocked?: boolean,
  /**
   * Source of the damage (eg: a skeleton shooting an arrow or player igniting tnt).
   */
  source_entity?: JsonEntityPredicate,
  type?: JsonDamageSourcePredicate,
}

export type JsonDamageSourceFlags = {
  is_explosion?: boolean,
  is_fire?: boolean,
  is_magic?: boolean,
  is_projectile?: boolean,
  is_lightning?: boolean,
  bypasses_armor?: boolean,
  bypasses_invulnerability?: boolean,
  bypasses_magic?: boolean,
}

export type JsonDamageSourcePredicate = {
  /**
   * Damage type tags that the damage type is in.
   */
  tags?: Array<JsonDamageTagPredicate>,
  /**
   * Source of the damage (eg: a skeleton shooting an arrow or player igniting tnt).
   */
  source_entity?: JsonEntityPredicate,
  /**
   * Direct entity responsible for the damage (eg: the arrow or tnt).
   */
  direct_entity?: JsonEntityPredicate,
  /**
   * Damage is direct when its direct and source entities are the same.
   */
  is_direct?: boolean,
}

export type JsonDamageTagPredicate = {
  id: ((
        | JsonRegistry['minecraft:damage_type']
        | `#${JsonRegistry['minecraft:tag/damage_type']}`
        | TagClass<'damage_type'>
        | DamageTypeClass)
      | Array<(JsonRegistry['minecraft:damage_type'] | DamageTypeClass)>),
  /**
   * Whether the damage is expected to have or not have the tag.
   */
  expected: boolean,
}

export type JsonDistancePredicate = {
  x?: JsonMinMaxBounds<(NBTFloat | number)>,
  y?: JsonMinMaxBounds<(NBTFloat | number)>,
  z?: JsonMinMaxBounds<(NBTFloat | number)>,
  absolute?: JsonMinMaxBounds<(NBTFloat | number)>,
  horizontal?: JsonMinMaxBounds<(NBTFloat | number)>,
}

export type JsonEnchantmentPredicate = {
  enchantments?: ((
        | JsonRegistry['minecraft:enchantment']
        | `#${JsonRegistry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(JsonRegistry['minecraft:enchantment'] | EnchantmentClass)>),
  levels?: JsonMinMaxBounds<(NBTInt | number)>,
}

export type JsonEntityEffectsPredicate = ({
  [Key in Extract<JsonRegistry['minecraft:mob_effect'], string>]?: JsonMobEffectPredicate
})

export type JsonEntityEquipmentPredicate = ({
  [Key in Extract<JsonEquipmentSlot, string>]?: JsonItemPredicate
})

export type JsonEntityFlagsPredicate = {
  is_on_fire?: boolean,
  is_sneaking?: boolean,
  is_sprinting?: boolean,
  is_swimming?: boolean,
  is_baby?: boolean,
  is_on_ground?: boolean,
  is_flying?: boolean,
  is_in_water?: boolean,
  is_fall_flying?: boolean,
}

export type JsonEntityPredicate = JsonEntitySubPredicateMap

export type JsonEntitySlotsPredicate = ({
  [Key in Extract<LiteralUnion<ENTITY_SLOTS>, string>]?: JsonItemPredicate
})

export type JsonEntitySubPredicate = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:entity_sub_predicate_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolEntitySubPredicate ? JsonSymbolEntitySubPredicate[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:entity_sub_predicate_type'], string>])>

export type JsonEntitySubPredicateMap = ({
  [Key in Extract<JsonRegistry['minecraft:entity_sub_predicate_type'], string>]?: (Key extends keyof JsonSymbolEntitySubPredicate
    ? JsonSymbolEntitySubPredicate[Key]
    : JsonRootNBT)
})

export type JsonEntityTagPredicate = {
  /**
   * Must have at least one of the listed tags.
   */
  any_of?: Array<NonEmptyString | LabelClass>,
  /**
   * Must have all the listed tags.
   */
  all_of?: Array<NonEmptyString | LabelClass>,
  /**
   * Must have none of the listed tags.
   */
  none_of?: Array<NonEmptyString | LabelClass>,
}

export type JsonEntityTypePredicate = ((
  | JsonRegistry['minecraft:entity_type'] | `#${JsonRegistry['minecraft:tag/entity_type']}` | TagClass<'entity_type'>)
  | Array<JsonRegistry['minecraft:entity_type']>)

export type JsonFishingHookPredicate = {
  in_open_water?: boolean,
}

export type JsonFluidPredicate = {
  fluids?: ((
      | JsonRegistry['minecraft:fluid'] | `#${JsonRegistry['minecraft:tag/fluid']}` | TagClass<'fluid'>)
      | Array<JsonRegistry['minecraft:fluid']>),
  state?: ({
    [Key in NonEmptyString]?: (JsonMinMaxBounds<(NBTInt | number)> | boolean | string)
  }),
}

export type JsonFluidPredicateState = ({
  [Key in NonEmptyString]?: (JsonMinMaxBounds<(NBTInt | number)> | boolean | string)
})

export type JsonFoodPredicate = {
  level?: JsonMinMaxBounds<(NBTInt | number)>,
  saturation?: JsonMinMaxBounds<(NBTDouble | number)>,
}

export type JsonFoxPredicate = {
  /**
   * Value:
   *
   *  - Red(`red`)
   *  - Snow(`snow`)
   */
  variant: JsonFoxType,
}

export type JsonFrogPredicate = {
  variant: ((
        | JsonRegistry['minecraft:frog_variant']
        | `#${string}:${string}`
        | TagClass<'frog_variant'>
        | VariantClass<'frog'>)
      | Array<(JsonRegistry['minecraft:frog_variant'] | VariantClass<'frog'>)>),
}

export type JsonGameMode = ('survival' | 'creative' | 'adventure' | 'spectator')

export type JsonHorsePredicate = {
  /**
   * Value:
   *
   *  - White(`white`)
   *  - Creamy(`creamy`)
   *  - Chestnut(`chestnut`)
   *  - Brown(`brown`)
   *  - Black(`black`)
   *  - Gray(`gray`)
   *  - DarkBrown(`dark_brown`)
   */
  variant: JsonHorseVariant,
}

export type JsonInputPredicate = {
  forward?: boolean,
  backward?: boolean,
  left?: boolean,
  right?: boolean,
  jump?: boolean,
  sneak?: boolean,
  sprint?: boolean,
}

export type JsonItemPredicate = {
  items?: ((
      | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<JsonRegistry['minecraft:item']>),
  count?: JsonMinMaxBounds<(NBTInt | number)>,
  components?: JsonDataComponentExactPredicate,
  predicates?: JsonDataComponentPredicate,
}

export type JsonLightningBoltPredicate = {
  blocks_set_on_fire?: JsonMinMaxBounds<(NBTInt | number)>,
  entity_struck?: JsonEntityPredicate,
}

export type JsonLlamaPredicate = {
  /**
   * Value:
   *
   *  - Creamy(`creamy`)
   *  - White(`white`)
   *  - Brown(`brown`)
   *  - Gray(`gray`)
   */
  variant: JsonLlamaVariant,
}

export type JsonLocationPredicate = {
  position?: {
    x?: JsonMinMaxBounds<(NBTFloat | number)>,
    y?: JsonMinMaxBounds<(NBTFloat | number)>,
    z?: JsonMinMaxBounds<(NBTFloat | number)>,
  },
  biomes?: ((
        | JsonRegistry['minecraft:worldgen/biome']
        | `#${JsonRegistry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)
      | Array<JsonRegistry['minecraft:worldgen/biome']>),
  structures?: ((
        | JsonRegistry['minecraft:worldgen/structure']
        | `#${JsonRegistry['minecraft:tag/worldgen/structure']}`
        | TagClass<'worldgen/structure'>)
      | Array<JsonRegistry['minecraft:worldgen/structure']>),
  dimension?: JsonRegistry['minecraft:dimension'],
  /**
   * Calculated using: `max(sky-darkening, block)`.
   */
  light?: {
    light?: JsonMinMaxBounds<(NBTInt<{
      min: 0,
      max: 15,
    }> | number)>,
  },
  block?: JsonBlockPredicate,
  fluid?: JsonFluidPredicate,
  /**
   * Whether the block is above (5 blocks or less) a campfire or soul campfire.
   */
  smokey?: boolean,
  /**
   * Whether the location has the maximum possible level of sky light
   */
  can_see_sky?: boolean,
}

export type JsonLocationPredicateLight = {
  light?: JsonMinMaxBounds<(NBTInt<{
    min: 0,
    max: 15,
  }> | number)>,
}

export type JsonLocationPredicatePosition = {
  x?: JsonMinMaxBounds<(NBTFloat | number)>,
  y?: JsonMinMaxBounds<(NBTFloat | number)>,
  z?: JsonMinMaxBounds<(NBTFloat | number)>,
}

export type JsonMobEffectPredicate = {
  amplifier?: JsonMinMaxBounds<(NBTInt | number)>,
  duration?: JsonMinMaxBounds<(NBTInt | number)>,
  ambient?: boolean,
  visible?: boolean,
}

export type JsonMooshroomPredicate = {
  /**
   * Value:
   *
   *  - Red(`red`)
   *  - Brown(`brown`)
   */
  variant: JsonMooshroomType,
}

export type JsonMovementPredicate = {
  x?: JsonMinMaxBounds<(NBTFloat | number)>,
  y?: JsonMinMaxBounds<(NBTFloat | number)>,
  z?: JsonMinMaxBounds<(NBTFloat | number)>,
  speed?: JsonMinMaxBounds<(NBTFloat | number)>,
  horizontal_speed?: JsonMinMaxBounds<(NBTFloat | number)>,
  vertical_speed?: JsonMinMaxBounds<(NBTFloat | number)>,
  fall_distance?: JsonMinMaxBounds<(NBTFloat | number)>,
}

export type JsonOldEntityPredicate = NonNullable<({
  [S in Extract<Extract<JsonEntityTypePredicate, string>, string>]?: {
    type?: S,
    type_specific?: JsonEntitySubPredicate,
    team?: NonEmptyString,
    nbt?: ((NonEmptyString | NBTClass) | (S extends keyof JsonSymbolEntity ? JsonSymbolEntity[S] : JsonRootNBT)),
    location?: JsonLocationPredicate,
    distance?: JsonDistancePredicate,
    flags?: JsonEntityFlagsPredicate,
    equipment?: JsonEntityEquipmentPredicate,
    vehicle?: JsonEntityPredicate,
    passenger?: JsonEntityPredicate,
    stepping_on?: JsonLocationPredicate,
    /**
     * Entity that a mob's AI/aggro is targeting.
     */
    targeted_entity?: JsonEntityPredicate,
    effects?: JsonEntityEffectsPredicate,
    slots?: JsonEntitySlotsPredicate,
    movement?: JsonMovementPredicate,
    /**
     * True every `n` ticks of an entity's lifetime.
     *
     * Value:
     * Range: 1..
     */
    periodic_tick?: (NBTInt<{
      min: 1,
    }> | number),
    /**
     * Whether the block at most 0.5 blocks below the entity is present which can affect its movement.
     */
    movement_affected_by?: JsonLocationPredicate,
    /**
     * Match exact data component values on the entity.
     */
    components?: JsonDataComponentExactPredicate,
    /**
     * Test data component values on the entity.
     */
    predicates?: JsonDataComponentPredicate,
  }
}[Extract<JsonEntityTypePredicate, string>])>

export type JsonPaintingPredicate = {
  variant: ((
        | JsonRegistry['minecraft:painting_variant']
        | `#${JsonRegistry['minecraft:tag/painting_variant']}`
        | TagClass<'painting_variant'>
        | VariantClass<'painting'>)
      | Array<(JsonRegistry['minecraft:painting_variant'] | VariantClass<'painting'>)>),
}

export type JsonParrotPredicate = {
  /**
   * Value:
   *
   *  - RedBlue(`red_blue`)
   *  - Blue(`blue`)
   *  - Green(`green`)
   *  - YellowBlue(`yellow_blue`)
   *  - Gray(`gray`)
   */
  variant: JsonParrotVariant,
}

export type JsonPlayerAdvancementCriteria = ({
  [Key in NonEmptyString]?: boolean
})

export type JsonPlayerAdvancements = ({
  [Key in Extract<JsonRegistry['minecraft:advancement'], string>]?: (boolean | ({
    [Key in NonEmptyString]?: boolean
  }))
})

export type JsonPlayerPredicate = {
  advancements?: ({
    [Key in Extract<JsonRegistry['minecraft:advancement'], string>]?: (boolean | ({
      [Key in NonEmptyString]?: boolean
    }))
  }),
  gamemode?: Array<JsonGameMode>,
  /**
   * Experience/XP level.
   */
  level?: JsonMinMaxBounds<(NBTInt | number)>,
  recipes?: ({
    [Key in Extract<JsonRegistry['minecraft:recipe'], string>]?: boolean
  }),
  stats?: Array<JsonStatisticPredicate>,
  looking_at?: JsonEntityPredicate,
  /**
   * Checks the movement keys of the player.
   */
  input?: {
    forward?: boolean,
    backward?: boolean,
    left?: boolean,
    right?: boolean,
    jump?: boolean,
    sneak?: boolean,
    sprint?: boolean,
  },
  food?: {
    level?: JsonMinMaxBounds<(NBTInt | number)>,
    saturation?: JsonMinMaxBounds<(NBTDouble | number)>,
  },
}

export type JsonPlayerRecipes = ({
  [Key in Extract<JsonRegistry['minecraft:recipe'], string>]?: boolean
})

export type JsonPostComponentsItemPredicate = {
  items?: ((
      | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<JsonRegistry['minecraft:item']>),
  count?: JsonMinMaxBounds<(NBTInt | number)>,
  components?: JsonDataComponentExactPredicate,
  predicates?: JsonDataComponentPredicate,
}

export type JsonPreComponentsItemPredicate = {
  items?: Array<JsonRegistry['minecraft:item']>,
  tag?: (JsonRegistry['minecraft:tag/item']),
  durability?: JsonMinMaxBounds<(NBTInt | number)>,
  potion?: JsonRegistry['minecraft:potion'],
  enchantments?: Array<JsonEnchantmentPredicate>,
  stored_enchantments?: Array<JsonEnchantmentPredicate>,
  nbt?: NonEmptyString | NBTClass,
}

export type JsonRabbitPredicate = {
  /**
   * Value:
   *
   *  - Brown(`brown`)
   *  - White(`white`)
   *  - Black(`black`)
   *  - WhiteSplotched(`white_splotched`)
   *  - Gold(`gold`)
   *  - Salt(`salt`)
   *  - Evil(`evil`): Killer rabbit
   */
  variant: JsonRabbitVariant,
}

export type JsonRaiderPredicate = {
  has_raid?: boolean,
  is_captain?: boolean,
}

export type JsonSalmonPredicate = {
  /**
   * Value:
   *
   *  - Small(`small`)
   *  - Medium(`medium`)
   *  - Large(`large`)
   */
  variant?: JsonSalmonVariant,
}

export type JsonSalmonVariant = ('small' | 'medium' | 'large')

export type JsonSheepPredicate = {
  sheared?: boolean,
}

export type JsonSlimePredicate = {
  size?: JsonMinMaxBounds<(NBTInt | number)>,
}

export type JsonSpecificType = (
  | 'any'
  | 'axolotl'
  | 'boat'
  | 'cat'
  | 'fishing_hook'
  | 'fox'
  | 'frog'
  | 'horse'
  | 'lightning'
  | 'llama'
  | 'mooshroom'
  | 'painting'
  | 'parrot'
  | 'player'
  | 'rabbit'
  | 'slime'
  | 'tropical_fish'
  | 'villager')

export type JsonStatisticPredicate = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:stat_type'], string>, string>]?: {
    type: S,
    stat: (S extends keyof JsonSymbolStatisticType
      ? JsonSymbolStatisticType[S]
      : JsonSymbolStatisticType<'%unknown'>),
    value: JsonMinMaxBounds<(NBTInt | number)>,
  }
}[Extract<JsonRegistry['minecraft:stat_type'], string>])>

export type JsonTropicalFishPredicate = {
  /**
   * Value:
   *
   *  - Kob(`kob`)
   *  - Sunstreak(`sunstreak`)
   *  - Snooper(`snooper`)
   *  - Dasher(`dasher`)
   *  - Brinely(`brinely`)
   *  - Spotty(`spotty`)
   *  - Flopper(`flopper`)
   *  - Stripey(`stripey`)
   *  - Glitter(`glitter`)
   *  - Blockfish(`blockfish`)
   *  - Betty(`betty`)
   *  - Clayfish(`clayfish`)
   */
  variant: JsonTropicalFishPattern,
}

export type JsonVillagerPredicate = {
  variant: JsonRegistry['minecraft:villager_type'],
}

export type JsonWolfPredicate = {
  variant: ((
        | JsonRegistry['minecraft:wolf_variant']
        | `#${string}:${string}`
        | TagClass<'wolf_variant'>
        | VariantClass<'wolf'>)
      | Array<(JsonRegistry['minecraft:wolf_variant'] | VariantClass<'wolf'>)>),
}
type JsonEntitySubPredicateDispatcherMap = {
  'components': JsonEntitySubPredicateComponents,
  'minecraft:components': JsonEntitySubPredicateComponents,
  'distance': JsonEntitySubPredicateDistance,
  'minecraft:distance': JsonEntitySubPredicateDistance,
  'effects': JsonEntitySubPredicateEffects,
  'minecraft:effects': JsonEntitySubPredicateEffects,
  'entity_tags': JsonEntitySubPredicateEntityTags,
  'minecraft:entity_tags': JsonEntitySubPredicateEntityTags,
  'entity_type': JsonEntitySubPredicateEntityType,
  'minecraft:entity_type': JsonEntitySubPredicateEntityType,
  'equipment': JsonEntitySubPredicateEquipment,
  'minecraft:equipment': JsonEntitySubPredicateEquipment,
  'flags': JsonEntitySubPredicateFlags,
  'minecraft:flags': JsonEntitySubPredicateFlags,
  'location': JsonEntitySubPredicateLocation,
  'minecraft:location': JsonEntitySubPredicateLocation,
  'movement': JsonEntitySubPredicateMovement,
  'minecraft:movement': JsonEntitySubPredicateMovement,
  'movement_affected_by': JsonEntitySubPredicateMovementAffectedBy,
  'minecraft:movement_affected_by': JsonEntitySubPredicateMovementAffectedBy,
  'nbt': JsonEntitySubPredicateNbt,
  'minecraft:nbt': JsonEntitySubPredicateNbt,
  'passenger': JsonEntitySubPredicatePassenger,
  'minecraft:passenger': JsonEntitySubPredicatePassenger,
  'periodic_tick': JsonEntitySubPredicatePeriodicTick,
  'minecraft:periodic_tick': JsonEntitySubPredicatePeriodicTick,
  'predicates': JsonEntitySubPredicatePredicates,
  'minecraft:predicates': JsonEntitySubPredicatePredicates,
  'slots': JsonEntitySubPredicateSlots,
  'minecraft:slots': JsonEntitySubPredicateSlots,
  'stepping_on': JsonEntitySubPredicateSteppingOn,
  'minecraft:stepping_on': JsonEntitySubPredicateSteppingOn,
  'targeted_entity': JsonEntitySubPredicateTargetedEntity,
  'minecraft:targeted_entity': JsonEntitySubPredicateTargetedEntity,
  'team': JsonEntitySubPredicateTeam,
  'minecraft:team': JsonEntitySubPredicateTeam,
  'type_specific/cube_mob': JsonEntitySubPredicateTypeSpecificCubeMob,
  'minecraft:type_specific/cube_mob': JsonEntitySubPredicateTypeSpecificCubeMob,
  'type_specific/fishing_hook': JsonEntitySubPredicateTypeSpecificFishingHook,
  'minecraft:type_specific/fishing_hook': JsonEntitySubPredicateTypeSpecificFishingHook,
  'type_specific/lightning': JsonEntitySubPredicateTypeSpecificLightning,
  'minecraft:type_specific/lightning': JsonEntitySubPredicateTypeSpecificLightning,
  'type_specific/player': JsonEntitySubPredicateTypeSpecificPlayer,
  'minecraft:type_specific/player': JsonEntitySubPredicateTypeSpecificPlayer,
  'type_specific/raider': JsonEntitySubPredicateTypeSpecificRaider,
  'minecraft:type_specific/raider': JsonEntitySubPredicateTypeSpecificRaider,
  'type_specific/sheep': JsonEntitySubPredicateTypeSpecificSheep,
  'minecraft:type_specific/sheep': JsonEntitySubPredicateTypeSpecificSheep,
  'vehicle': JsonEntitySubPredicateVehicle,
  'minecraft:vehicle': JsonEntitySubPredicateVehicle,
}
type JsonEntitySubPredicateKeys = keyof JsonEntitySubPredicateDispatcherMap
type JsonEntitySubPredicateFallback = (
  | JsonEntitySubPredicateComponents
  | JsonEntitySubPredicateDistance
  | JsonEntitySubPredicateEffects
  | JsonEntitySubPredicateEntityTags
  | JsonEntitySubPredicateEntityType
  | JsonEntitySubPredicateEquipment
  | JsonEntitySubPredicateFlags
  | JsonEntitySubPredicateLocation
  | JsonEntitySubPredicateMovement
  | JsonEntitySubPredicateMovementAffectedBy
  | JsonEntitySubPredicateNbt
  | JsonEntitySubPredicatePassenger
  | JsonEntitySubPredicatePeriodicTick
  | JsonEntitySubPredicatePredicates
  | JsonEntitySubPredicateSlots
  | JsonEntitySubPredicateSteppingOn
  | JsonEntitySubPredicateTargetedEntity
  | JsonEntitySubPredicateTeam
  | JsonEntitySubPredicateTypeSpecificCubeMob
  | JsonEntitySubPredicateTypeSpecificFishingHook
  | JsonEntitySubPredicateTypeSpecificLightning
  | JsonEntitySubPredicateTypeSpecificPlayer
  | JsonEntitySubPredicateTypeSpecificRaider
  | JsonEntitySubPredicateTypeSpecificSheep
  | JsonEntitySubPredicateVehicle)
type JsonEntitySubPredicateComponents = JsonDataComponentExactPredicate
type JsonEntitySubPredicateDistance = JsonDistancePredicate
type JsonEntitySubPredicateEffects = JsonEntityEffectsPredicate
type JsonEntitySubPredicateEntityTags = JsonEntityTagPredicate
type JsonEntitySubPredicateEntityType = JsonEntityTypePredicate
type JsonEntitySubPredicateEquipment = JsonEntityEquipmentPredicate
type JsonEntitySubPredicateFlags = JsonEntityFlagsPredicate
type JsonEntitySubPredicateLocation = JsonLocationPredicate
type JsonEntitySubPredicateMovement = JsonMovementPredicate
type JsonEntitySubPredicateMovementAffectedBy = JsonLocationPredicate
type JsonEntitySubPredicateNbt = ((NonEmptyString | NBTClass) | JsonSymbolEntity<'%fallback'>)
type JsonEntitySubPredicatePassenger = JsonEntityPredicate
type JsonEntitySubPredicatePeriodicTick = (NBTInt<{
  min: 1,
}> | number)
type JsonEntitySubPredicatePredicates = JsonDataComponentPredicate
type JsonEntitySubPredicateSlots = JsonEntitySlotsPredicate
type JsonEntitySubPredicateSteppingOn = JsonLocationPredicate
type JsonEntitySubPredicateTargetedEntity = JsonEntityPredicate
type JsonEntitySubPredicateTeam = NonEmptyString
type JsonEntitySubPredicateTypeSpecificCubeMob = JsonSlimePredicate
type JsonEntitySubPredicateTypeSpecificFishingHook = JsonFishingHookPredicate
type JsonEntitySubPredicateTypeSpecificLightning = JsonLightningBoltPredicate
type JsonEntitySubPredicateTypeSpecificPlayer = JsonPlayerPredicate
type JsonEntitySubPredicateTypeSpecificRaider = JsonRaiderPredicate
type JsonEntitySubPredicateTypeSpecificSheep = JsonSheepPredicate
type JsonEntitySubPredicateVehicle = JsonEntityPredicate
export type JsonSymbolEntitySubPredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEntitySubPredicateDispatcherMap
  : CASE extends 'keys'
    ? JsonEntitySubPredicateKeys
    : CASE extends '%fallback' ? JsonEntitySubPredicateFallback : never
