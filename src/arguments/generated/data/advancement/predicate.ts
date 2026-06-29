import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util.ts'
import type {
  SymbolBlock,
  SymbolEntity,
  SymbolMcdocBlockStates,
  SymbolStatisticType,
} from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { EquipmentSlot } from 'sandstone/arguments/generated/util/slot.ts'
import type {
  DataComponentExactPredicate,
  DataComponentPredicate,
} from 'sandstone/arguments/generated/world/component.ts'
import type {
  AxolotlVariant,
  FoxType,
  HorseVariant,
  LlamaVariant,
  MooshroomType,
  ParrotVariant,
  RabbitVariant,
  TropicalFishPattern,
} from 'sandstone/arguments/generated/world/component/entity.ts'
import type { BoatType } from 'sandstone/arguments/generated/world/entity/boat.ts'
import type { ENTITY_SLOTS } from 'sandstone/arguments'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  EnchantmentClass,
  LabelClass,
  LiteralUnion,
  NBTClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  TagClass,
  VariantClass,
} from 'sandstone'

export type AxolotlPredicate = {
  /**
   * Value:
   *
   *  - Lucy(`lucy`)
   *  - Wild(`wild`)
   *  - Gold(`gold`)
   *  - Cyan(`cyan`)
   *  - Blue(`blue`): The rare variant.
   */
  variant: AxolotlVariant,
}

export type BlockPredicate<S = undefined> = {
  blocks?: ((
      | Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<Registry['minecraft:block']>),
  state?: BlockPredicateState,
  nbt?: ((`${any}${string}` | NBTClass) | (S extends keyof SymbolBlock ? SymbolBlock[S] : RootNBT)),
  /**
   * Match exact data component values on the block entity.
   */
  components?: DataComponentExactPredicate,
  /**
   * Test data component values on the block entity.
   */
  predicates?: DataComponentPredicate,
}

export type BlockPredicateState = SymbolMcdocBlockStates<'%unknown'>

export type BoatPredicate = {
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
  variant: BoatType,
}

export type CatPredicate = {
  variant: ((
      | Registry['minecraft:cat_variant'] | `#${string}:${string}` | TagClass<'cat_variant'> | VariantClass<'cat'>)
      | Array<(Registry['minecraft:cat_variant'] | VariantClass<'cat'>)>),
}

export type DamagePredicate = {
  /**
   * Amount of incoming damage before damage reduction.
   */
  dealt?: MinMaxBounds<NBTFloat>,
  /**
   * Amount of incoming damage after damage reduction.
   */
  taken?: MinMaxBounds<NBTFloat>,
  /**
   * Whether the damage was successfully blocked.
   */
  blocked?: boolean,
  /**
   * Source of the damage (eg: a skeleton shooting an arrow or player igniting tnt).
   */
  source_entity?: EntityPredicate,
  type?: DamageSourcePredicate,
}

export type DamageSourceFlags = {
  is_explosion?: boolean,
  is_fire?: boolean,
  is_magic?: boolean,
  is_projectile?: boolean,
  is_lightning?: boolean,
  bypasses_armor?: boolean,
  bypasses_invulnerability?: boolean,
  bypasses_magic?: boolean,
}

export type DamageSourcePredicate = {
  /**
   * Damage type tags that the damage type is in.
   */
  tags?: Array<DamageTagPredicate>,
  /**
   * Source of the damage (eg: a skeleton shooting an arrow or player igniting tnt).
   */
  source_entity?: EntityPredicate,
  /**
   * Direct entity responsible for the damage (eg: the arrow or tnt).
   */
  direct_entity?: EntityPredicate,
  /**
   * Damage is direct when its direct and source entities are the same.
   */
  is_direct?: boolean,
}

export type DamageTagPredicate = {
  id: (Registry['minecraft:tag/damage_type']),
  /**
   * Whether the damage is expected to have or not have the tag.
   */
  expected: boolean,
}

export type DistancePredicate = {
  x?: MinMaxBounds<NBTFloat>,
  y?: MinMaxBounds<NBTFloat>,
  z?: MinMaxBounds<NBTFloat>,
  absolute?: MinMaxBounds<NBTFloat>,
  horizontal?: MinMaxBounds<NBTFloat>,
}

export type EnchantmentPredicate = {
  enchantments?: ((
        | Registry['minecraft:enchantment']
        | `#${Registry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(Registry['minecraft:enchantment'] | EnchantmentClass)>),
  levels?: MinMaxBounds<NBTInt>,
}

export type EntityEffectsPredicate = ({
  [Key in Extract<Registry['minecraft:mob_effect'], string>]?: MobEffectPredicate
})

export type EntityEquipmentPredicate = ({
  [Key in Extract<EquipmentSlot, string>]?: ItemPredicate
})

export type EntityFlagsPredicate = {
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

export type EntityPredicate = EntitySubPredicateMap

export type EntitySlotsPredicate = ({
  [Key in Extract<LiteralUnion<ENTITY_SLOTS>, string>]?: ItemPredicate
})

export type EntitySubPredicate = NonNullable<({
  [S in Extract<Registry['minecraft:entity_sub_predicate_type'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolEntitySubPredicate ? SymbolEntitySubPredicate[S] : RootNBT))
}[Registry['minecraft:entity_sub_predicate_type']])>

export type EntitySubPredicateMap = ({
  [Key in Extract<Registry['minecraft:entity_sub_predicate_type'], string>]?: (Key extends keyof SymbolEntitySubPredicate
    ? SymbolEntitySubPredicate[Key]
    : RootNBT)
})

export type EntityTagPredicate = {
  /**
   * Must have at least one of the listed tags.
   */
  any_of?: Array<`${any}${string}` | LabelClass>,
  /**
   * Must have all the listed tags.
   */
  all_of?: Array<`${any}${string}` | LabelClass>,
  /**
   * Must have none of the listed tags.
   */
  none_of?: Array<`${any}${string}` | LabelClass>,
}

export type EntityTypePredicate = ((
  | Registry['minecraft:entity_type'] | `#${Registry['minecraft:tag/entity_type']}` | TagClass<'entity_type'>)
  | Array<Registry['minecraft:entity_type']>)

export type FishingHookPredicate = {
  in_open_water?: boolean,
}

export type FluidPredicate = {
  fluids?: ((
      | Registry['minecraft:fluid'] | `#${Registry['minecraft:tag/fluid']}` | TagClass<'fluid'>)
      | Array<Registry['minecraft:fluid']>),
  state?: ({
    [Key in `${any}${string}`]?: (MinMaxBounds<NBTInt> | boolean | string)
  }),
}

export type FluidPredicateState = ({
  [Key in `${any}${string}`]?: (MinMaxBounds<NBTInt> | boolean | string)
})

export type FoodPredicate = {
  level?: MinMaxBounds<NBTInt>,
  saturation?: MinMaxBounds<(NBTDouble | number)>,
}

export type FoxPredicate = {
  /**
   * Value:
   *
   *  - Red(`red`)
   *  - Snow(`snow`)
   */
  variant: FoxType,
}

export type FrogPredicate = {
  variant: ((
      | Registry['minecraft:frog_variant'] | `#${string}:${string}` | TagClass<'frog_variant'> | VariantClass<'frog'>)
      | Array<(Registry['minecraft:frog_variant'] | VariantClass<'frog'>)>),
}

export type GameMode = ('survival' | 'creative' | 'adventure' | 'spectator')

export type HorsePredicate = {
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
  variant: HorseVariant,
}

export type InputPredicate = {
  forward?: boolean,
  backward?: boolean,
  left?: boolean,
  right?: boolean,
  jump?: boolean,
  sneak?: boolean,
  sprint?: boolean,
}

export type ItemPredicate = {
  items?: ((
      | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<Registry['minecraft:item']>),
  count?: MinMaxBounds<NBTInt>,
  components?: DataComponentExactPredicate,
  predicates?: DataComponentPredicate,
}

export type LightningBoltPredicate = {
  blocks_set_on_fire?: MinMaxBounds<NBTInt>,
  entity_struck?: EntityPredicate,
}

export type LlamaPredicate = {
  /**
   * Value:
   *
   *  - Creamy(`creamy`)
   *  - White(`white`)
   *  - Brown(`brown`)
   *  - Gray(`gray`)
   */
  variant: LlamaVariant,
}

export type LocationPredicate = {
  position?: {
    x?: MinMaxBounds<NBTFloat>,
    y?: MinMaxBounds<NBTFloat>,
    z?: MinMaxBounds<NBTFloat>,
  },
  biomes?: ((
        | Registry['minecraft:worldgen/biome']
        | `#${Registry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)
      | Array<Registry['minecraft:worldgen/biome']>),
  structures?: ((
        | Registry['minecraft:worldgen/structure']
        | `#${Registry['minecraft:tag/worldgen/structure']}`
        | TagClass<'worldgen/structure'>)
      | Array<Registry['minecraft:worldgen/structure']>),
  dimension?: Registry['minecraft:dimension'],
  /**
   * Calculated using: `max(sky-darkening, block)`.
   */
  light?: {
    light?: MinMaxBounds<NBTInt<{
      min: 0,
      max: 15,
    }>>,
  },
  block?: BlockPredicate,
  fluid?: FluidPredicate,
  /**
   * Whether the block is above (5 blocks or less) a campfire or soul campfire.
   */
  smokey?: boolean,
  /**
   * Whether the location has the maximum possible level of sky light
   */
  can_see_sky?: boolean,
}

export type LocationPredicateLight = {
  light?: MinMaxBounds<NBTInt<{
    min: 0,
    max: 15,
  }>>,
}

export type LocationPredicatePosition = {
  x?: MinMaxBounds<NBTFloat>,
  y?: MinMaxBounds<NBTFloat>,
  z?: MinMaxBounds<NBTFloat>,
}

export type MobEffectPredicate = {
  amplifier?: MinMaxBounds<NBTInt>,
  duration?: MinMaxBounds<NBTInt>,
  ambient?: boolean,
  visible?: boolean,
}

export type MooshroomPredicate = {
  /**
   * Value:
   *
   *  - Red(`red`)
   *  - Brown(`brown`)
   */
  variant: MooshroomType,
}

export type MovementPredicate = {
  x?: MinMaxBounds<NBTFloat>,
  y?: MinMaxBounds<NBTFloat>,
  z?: MinMaxBounds<NBTFloat>,
  speed?: MinMaxBounds<NBTFloat>,
  horizontal_speed?: MinMaxBounds<NBTFloat>,
  vertical_speed?: MinMaxBounds<NBTFloat>,
  fall_distance?: MinMaxBounds<NBTFloat>,
}

export type PaintingPredicate = {
  variant: ((
        | Registry['minecraft:painting_variant']
        | `#${Registry['minecraft:tag/painting_variant']}`
        | TagClass<'painting_variant'>
        | VariantClass<'painting'>)
      | Array<(Registry['minecraft:painting_variant'] | VariantClass<'painting'>)>),
}

export type ParrotPredicate = {
  /**
   * Value:
   *
   *  - RedBlue(`red_blue`)
   *  - Blue(`blue`)
   *  - Green(`green`)
   *  - YellowBlue(`yellow_blue`)
   *  - Gray(`gray`)
   */
  variant: ParrotVariant,
}

export type PlayerAdvancementCriteria = ({
  [Key in `${any}${string}`]?: boolean
})

export type PlayerAdvancements = ({
  [Key in Extract<Registry['minecraft:advancement'], string>]?: (boolean | ({
    [Key in `${any}${string}`]?: boolean
  }))
})

export type PlayerPredicate = {
  advancements?: ({
    [Key in Extract<Registry['minecraft:advancement'], string>]?: (boolean | ({
      [Key in `${any}${string}`]?: boolean
    }))
  }),
  gamemode?: Array<GameMode>,
  /**
   * Experience/XP level.
   */
  level?: MinMaxBounds<NBTInt>,
  recipes?: ({
    [Key in Extract<Registry['minecraft:recipe'], string>]?: boolean
  }),
  stats?: Array<StatisticPredicate>,
  looking_at?: EntityPredicate,
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
    level?: MinMaxBounds<NBTInt>,
    saturation?: MinMaxBounds<(NBTDouble | number)>,
  },
}

export type PlayerRecipes = ({
  [Key in Extract<Registry['minecraft:recipe'], string>]?: boolean
})

export type PostComponentsItemPredicate = {
  items?: ((
      | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<Registry['minecraft:item']>),
  count?: MinMaxBounds<NBTInt>,
  components?: DataComponentExactPredicate,
  predicates?: DataComponentPredicate,
}

export type PreComponentsItemPredicate = {
  items?: Array<Registry['minecraft:item']>,
  tag?: (Registry['minecraft:tag/item']),
  durability?: MinMaxBounds<NBTInt>,
  potion?: Registry['minecraft:potion'],
  enchantments?: Array<EnchantmentPredicate>,
  stored_enchantments?: Array<EnchantmentPredicate>,
  nbt?: `${any}${string}` | NBTClass,
}

export type RabbitPredicate = {
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
  variant: RabbitVariant,
}

export type RaiderPredicate = {
  has_raid?: boolean,
  is_captain?: boolean,
}

export type SalmonPredicate = {
  /**
   * Value:
   *
   *  - Small(`small`)
   *  - Medium(`medium`)
   *  - Large(`large`)
   */
  variant?: SalmonVariant,
}

export type SalmonVariant = ('small' | 'medium' | 'large')

export type SheepPredicate = {
  sheared?: boolean,
}

export type SlimePredicate = {
  size?: MinMaxBounds<NBTInt>,
}

export type SpecificType = (
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

export type StatisticPredicate = NonNullable<({
  [S in Extract<Registry['minecraft:stat_type'], string>]?: {
    type: S,
    stat: (S extends keyof SymbolStatisticType ? SymbolStatisticType[S] : SymbolStatisticType<'%unknown'>),
    value: MinMaxBounds<NBTInt>,
  }
}[Registry['minecraft:stat_type']])>

export type TropicalFishPredicate = {
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
  variant: TropicalFishPattern,
}

export type VillagerPredicate = {
  variant: Registry['minecraft:villager_type'],
}

export type WolfPredicate = {
  variant: ((
      | Registry['minecraft:wolf_variant'] | `#${string}:${string}` | TagClass<'wolf_variant'> | VariantClass<'wolf'>)
      | Array<(Registry['minecraft:wolf_variant'] | VariantClass<'wolf'>)>),
}
type EntitySubPredicateDispatcherMap = {
  'axolotl': EntitySubPredicateAxolotl,
  'minecraft:axolotl': EntitySubPredicateAxolotl,
  'boat': EntitySubPredicateBoat,
  'minecraft:boat': EntitySubPredicateBoat,
  'cat': EntitySubPredicateCat,
  'minecraft:cat': EntitySubPredicateCat,
  'components': EntitySubPredicateComponents,
  'minecraft:components': EntitySubPredicateComponents,
  'distance': EntitySubPredicateDistance,
  'minecraft:distance': EntitySubPredicateDistance,
  'effects': EntitySubPredicateEffects,
  'minecraft:effects': EntitySubPredicateEffects,
  'entity_tags': EntitySubPredicateEntityTags,
  'minecraft:entity_tags': EntitySubPredicateEntityTags,
  'entity_type': EntitySubPredicateEntityType,
  'minecraft:entity_type': EntitySubPredicateEntityType,
  'equipment': EntitySubPredicateEquipment,
  'minecraft:equipment': EntitySubPredicateEquipment,
  'fishing_hook': EntitySubPredicateFishingHook,
  'minecraft:fishing_hook': EntitySubPredicateFishingHook,
  'flags': EntitySubPredicateFlags,
  'minecraft:flags': EntitySubPredicateFlags,
  'fox': EntitySubPredicateFox,
  'minecraft:fox': EntitySubPredicateFox,
  'frog': EntitySubPredicateFrog,
  'minecraft:frog': EntitySubPredicateFrog,
  'horse': EntitySubPredicateHorse,
  'minecraft:horse': EntitySubPredicateHorse,
  'lightning': EntitySubPredicateLightning,
  'minecraft:lightning': EntitySubPredicateLightning,
  'llama': EntitySubPredicateLlama,
  'minecraft:llama': EntitySubPredicateLlama,
  'location': EntitySubPredicateLocation,
  'minecraft:location': EntitySubPredicateLocation,
  'mooshroom': EntitySubPredicateMooshroom,
  'minecraft:mooshroom': EntitySubPredicateMooshroom,
  'movement': EntitySubPredicateMovement,
  'minecraft:movement': EntitySubPredicateMovement,
  'movement_affected_by': EntitySubPredicateMovementAffectedBy,
  'minecraft:movement_affected_by': EntitySubPredicateMovementAffectedBy,
  'nbt': EntitySubPredicateNbt,
  'minecraft:nbt': EntitySubPredicateNbt,
  'painting': EntitySubPredicatePainting,
  'minecraft:painting': EntitySubPredicatePainting,
  'parrot': EntitySubPredicateParrot,
  'minecraft:parrot': EntitySubPredicateParrot,
  'passenger': EntitySubPredicatePassenger,
  'minecraft:passenger': EntitySubPredicatePassenger,
  'periodic_tick': EntitySubPredicatePeriodicTick,
  'minecraft:periodic_tick': EntitySubPredicatePeriodicTick,
  'player': EntitySubPredicatePlayer,
  'minecraft:player': EntitySubPredicatePlayer,
  'predicates': EntitySubPredicatePredicates,
  'minecraft:predicates': EntitySubPredicatePredicates,
  'rabbit': EntitySubPredicateRabbit,
  'minecraft:rabbit': EntitySubPredicateRabbit,
  'raider': EntitySubPredicateRaider,
  'minecraft:raider': EntitySubPredicateRaider,
  'salmon': EntitySubPredicateSalmon,
  'minecraft:salmon': EntitySubPredicateSalmon,
  'sheep': EntitySubPredicateSheep,
  'minecraft:sheep': EntitySubPredicateSheep,
  'slime': EntitySubPredicateSlime,
  'minecraft:slime': EntitySubPredicateSlime,
  'slots': EntitySubPredicateSlots,
  'minecraft:slots': EntitySubPredicateSlots,
  'stepping_on': EntitySubPredicateSteppingOn,
  'minecraft:stepping_on': EntitySubPredicateSteppingOn,
  'targeted_entity': EntitySubPredicateTargetedEntity,
  'minecraft:targeted_entity': EntitySubPredicateTargetedEntity,
  'team': EntitySubPredicateTeam,
  'minecraft:team': EntitySubPredicateTeam,
  'tropical_fish': EntitySubPredicateTropicalFish,
  'minecraft:tropical_fish': EntitySubPredicateTropicalFish,
  'type_specific/cube_mob': EntitySubPredicateTypeSpecificCubeMob,
  'minecraft:type_specific/cube_mob': EntitySubPredicateTypeSpecificCubeMob,
  'type_specific/fishing_hook': EntitySubPredicateTypeSpecificFishingHook,
  'minecraft:type_specific/fishing_hook': EntitySubPredicateTypeSpecificFishingHook,
  'type_specific/lightning': EntitySubPredicateTypeSpecificLightning,
  'minecraft:type_specific/lightning': EntitySubPredicateTypeSpecificLightning,
  'type_specific/player': EntitySubPredicateTypeSpecificPlayer,
  'minecraft:type_specific/player': EntitySubPredicateTypeSpecificPlayer,
  'type_specific/raider': EntitySubPredicateTypeSpecificRaider,
  'minecraft:type_specific/raider': EntitySubPredicateTypeSpecificRaider,
  'type_specific/sheep': EntitySubPredicateTypeSpecificSheep,
  'minecraft:type_specific/sheep': EntitySubPredicateTypeSpecificSheep,
  'vehicle': EntitySubPredicateVehicle,
  'minecraft:vehicle': EntitySubPredicateVehicle,
  'villager': EntitySubPredicateVillager,
  'minecraft:villager': EntitySubPredicateVillager,
  'wolf': EntitySubPredicateWolf,
  'minecraft:wolf': EntitySubPredicateWolf,
}
type EntitySubPredicateKeys = keyof EntitySubPredicateDispatcherMap
type EntitySubPredicateFallback = (
  | EntitySubPredicateAxolotl
  | EntitySubPredicateBoat
  | EntitySubPredicateCat
  | EntitySubPredicateComponents
  | EntitySubPredicateDistance
  | EntitySubPredicateEffects
  | EntitySubPredicateEntityTags
  | EntitySubPredicateEntityType
  | EntitySubPredicateEquipment
  | EntitySubPredicateFishingHook
  | EntitySubPredicateFlags
  | EntitySubPredicateFox
  | EntitySubPredicateFrog
  | EntitySubPredicateHorse
  | EntitySubPredicateLightning
  | EntitySubPredicateLlama
  | EntitySubPredicateLocation
  | EntitySubPredicateMooshroom
  | EntitySubPredicateMovement
  | EntitySubPredicateMovementAffectedBy
  | EntitySubPredicateNbt
  | EntitySubPredicatePainting
  | EntitySubPredicateParrot
  | EntitySubPredicatePassenger
  | EntitySubPredicatePeriodicTick
  | EntitySubPredicatePlayer
  | EntitySubPredicatePredicates
  | EntitySubPredicateRabbit
  | EntitySubPredicateRaider
  | EntitySubPredicateSalmon
  | EntitySubPredicateSheep
  | EntitySubPredicateSlime
  | EntitySubPredicateSlots
  | EntitySubPredicateSteppingOn
  | EntitySubPredicateTargetedEntity
  | EntitySubPredicateTeam
  | EntitySubPredicateTropicalFish
  | EntitySubPredicateTypeSpecificCubeMob
  | EntitySubPredicateTypeSpecificFishingHook
  | EntitySubPredicateTypeSpecificLightning
  | EntitySubPredicateTypeSpecificPlayer
  | EntitySubPredicateTypeSpecificRaider
  | EntitySubPredicateTypeSpecificSheep
  | EntitySubPredicateVehicle
  | EntitySubPredicateVillager
  | EntitySubPredicateWolf)
type EntitySubPredicateAxolotl = AxolotlPredicate
type EntitySubPredicateBoat = BoatPredicate
type EntitySubPredicateCat = CatPredicate
type EntitySubPredicateComponents = DataComponentExactPredicate
type EntitySubPredicateDistance = DistancePredicate
type EntitySubPredicateEffects = EntityEffectsPredicate
type EntitySubPredicateEntityTags = EntityTagPredicate
type EntitySubPredicateEntityType = EntityTypePredicate
type EntitySubPredicateEquipment = EntityEquipmentPredicate
type EntitySubPredicateFishingHook = FishingHookPredicate
type EntitySubPredicateFlags = EntityFlagsPredicate
type EntitySubPredicateFox = FoxPredicate
type EntitySubPredicateFrog = FrogPredicate
type EntitySubPredicateHorse = HorsePredicate
type EntitySubPredicateLightning = LightningBoltPredicate
type EntitySubPredicateLlama = LlamaPredicate
type EntitySubPredicateLocation = LocationPredicate
type EntitySubPredicateMooshroom = MooshroomPredicate
type EntitySubPredicateMovement = MovementPredicate
type EntitySubPredicateMovementAffectedBy = LocationPredicate
type EntitySubPredicateNbt = ((`${any}${string}` | NBTClass) | SymbolEntity<'%fallback'>)
type EntitySubPredicatePainting = PaintingPredicate
type EntitySubPredicateParrot = ParrotPredicate
type EntitySubPredicatePassenger = EntityPredicate
type EntitySubPredicatePeriodicTick = NBTInt<{
  min: 1,
}>
type EntitySubPredicatePlayer = PlayerPredicate
type EntitySubPredicatePredicates = DataComponentPredicate
type EntitySubPredicateRabbit = RabbitPredicate
type EntitySubPredicateRaider = RaiderPredicate
type EntitySubPredicateSalmon = SalmonPredicate
type EntitySubPredicateSheep = SheepPredicate
type EntitySubPredicateSlime = SlimePredicate
type EntitySubPredicateSlots = EntitySlotsPredicate
type EntitySubPredicateSteppingOn = LocationPredicate
type EntitySubPredicateTargetedEntity = EntityPredicate
type EntitySubPredicateTeam = `${any}${string}`
type EntitySubPredicateTropicalFish = TropicalFishPredicate
type EntitySubPredicateTypeSpecificCubeMob = SlimePredicate
type EntitySubPredicateTypeSpecificFishingHook = FishingHookPredicate
type EntitySubPredicateTypeSpecificLightning = LightningBoltPredicate
type EntitySubPredicateTypeSpecificPlayer = PlayerPredicate
type EntitySubPredicateTypeSpecificRaider = RaiderPredicate
type EntitySubPredicateTypeSpecificSheep = SheepPredicate
type EntitySubPredicateVehicle = EntityPredicate
type EntitySubPredicateVillager = VillagerPredicate
type EntitySubPredicateWolf = WolfPredicate
export type SymbolEntitySubPredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? EntitySubPredicateDispatcherMap
  : CASE extends 'keys' ? EntitySubPredicateKeys : CASE extends '%fallback' ? EntitySubPredicateFallback : never
