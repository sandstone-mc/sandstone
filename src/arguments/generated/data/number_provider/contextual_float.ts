import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.ts'
import type { SingleInputInteger } from 'sandstone/arguments/generated/data/number_provider/contextual_integer.ts'
import type { PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { NumericalEnvironmentAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DataPointClass,
  FloatNumberProviderClass,
  NamespacedString,
  NBTFloat,
  NBTList,
  NonEmptyString,
} from 'sandstone'

export type AbsoluteFloatProvider = SingleInputFloat

export type AddFloatProvider = MultiInputFloat

export type AverageFloatProvider = MultiInputFloat

export type CeilingFloatProvider = SingleInputFloat

export type ConditionalFloatProvider = {
  condition: PredicateRef,
  on_true: FloatNumberProviderRef,
  /**
   * Defaults to `0.0`.
   */
  on_false?: FloatNumberProviderRef,
}

export type ConstantFloatProvider = {
  value: NBTFloat,
}

export type CosineFloatProvider = SingleInputFloat

export type DataStorageFloatProvider = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  fallback?: FloatNumberProviderRef,
}

export type DispatchedFloatProvider = {
  cases: Array<{
    condition: PredicateRef,
    value: FloatNumberProviderRef,
  }>,
  /**
   * Defaults to `0.0`.
   */
  default?: FloatNumberProviderRef,
}

export type DispatcherCase = {
  condition: PredicateRef,
  value: FloatNumberProviderRef,
}

export type DivideFloatProvider = SidedInputsFloat

export type EnchantmentLevelFloatProvider = {
  amount: LevelBasedValue,
}

export type EnvironmentAttributeFloatProvider = {
  /**
   * Value:
   *
   *  - CloudHeight(`visual/cloud_height`)
   *  - FogStartDistance(`visual/fog_start_distance`)
   *  - MoonAngle(`visual/moon_angle`)
   *  - StarAngle(`visual/star_angle`)
   *  - SunAngle(`visual/sun_angle`)
   *  - WaterFogStartDistance(`visual/water_fog_start_distance`)
   *  - CloudFogEndDistance(`visual/cloud_fog_end_distance`)
   *  - FogEndDistance(`visual/fog_end_distance`)
   *  - SkyFogEndDistance(`visual/sky_fog_end_distance`)
   *  - WaterFogEndDistance(`visual/water_fog_end_distance`)
   *  - SkyLightFactor(`visual/sky_light_factor`)
   *  - StarBrightness(`visual/star_brightness`)
   *  - MusicVolume(`audio/music_volume`)
   *  - CatWakingUpGiftChance(`gameplay/cat_waking_up_gift_chance`)
   *  - CreatureWorldgenSpawnProbability(`gameplay/creature_world_gen_spawn_probability`)
   *  - SurfaceSlimeSpawnChance(`gameplay/surface_slime_spawn_chance`)
   *  - TurtleEggHatchChance(`gameplay/turtle_egg_hatch_chance`)
   *  - SkyLightLevel(`gameplay/sky_light_level`)
   */
  attribute: NumericalEnvironmentAttribute,
}

export type ExponentiateFloatProvider = {
  base: FloatNumberProviderRef,
  exponent: FloatNumberProviderRef,
}

export type FloatNumberProvider = (NBTFloat | ({
  [S in Extract<Extract<Registry['minecraft:context_float_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolNumberProviderFloat ? SymbolNumberProviderFloat[S] : RootNBT))
}[Extract<Registry['minecraft:context_float_provider_type'], string>]))

export type FloatNumberProviderRef = ((
  | Registry['minecraft:context_float_provider'] | FloatNumberProviderClass)
  | FloatNumberProvider)

export type FloorFloatProvider = SingleInputFloat

export type MaxOfSetFloatProvider = MultiInputFloat

export type MinOfSetFloatProvider = MultiInputFloat

export type ModuloFloatProvider = SidedInputsFloat

export type MultiInputFloat = {
  /**
   * Value:
   * List length range: 2..
   */
  inputs: NBTList<FloatNumberProviderRef, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type MultiplyFloatProvider = MultiInputFloat

export type NegateFloatProvider = SingleInputFloat

export type RandomFloatProvider = {
  min?: FloatNumberProviderRef,
  max?: FloatNumberProviderRef,
}

export type RoundFloatProvider = SingleInputFloat

export type SidedInputsFloat = {
  left: FloatNumberProviderRef,
  right: FloatNumberProviderRef,
}

export type SineFloatProvider = SingleInputFloat

export type SingleInputFloat = {
  input: FloatNumberProviderRef,
}

export type SquareRootFloatProvider = SingleInputFloat

export type SubtractFloatProvider = SidedInputsFloat

export type TruncateFloatProvider = SingleInputFloat

export type VectorLengthFloatProvider = MultiInputFloat

export type WeightedListFloatProvider = {
  distribution: NonEmptyWeightedList<FloatNumberProviderRef>,
}
type NumberProviderFloatDispatcherMap = {
  'abs': NumberProviderFloatAbs,
  'minecraft:abs': NumberProviderFloatAbs,
  'add': NumberProviderFloatAdd,
  'minecraft:add': NumberProviderFloatAdd,
  'avg': NumberProviderFloatAvg,
  'minecraft:avg': NumberProviderFloatAvg,
  'ceil': NumberProviderFloatCeil,
  'minecraft:ceil': NumberProviderFloatCeil,
  'conditional': NumberProviderFloatConditional,
  'minecraft:conditional': NumberProviderFloatConditional,
  'constant': NumberProviderFloatConstant,
  'minecraft:constant': NumberProviderFloatConstant,
  'cos': NumberProviderFloatCos,
  'minecraft:cos': NumberProviderFloatCos,
  'div': NumberProviderFloatDiv,
  'minecraft:div': NumberProviderFloatDiv,
  'enchantment_level': NumberProviderFloatEnchantmentLevel,
  'minecraft:enchantment_level': NumberProviderFloatEnchantmentLevel,
  'environment_attribute': NumberProviderFloatEnvironmentAttribute,
  'minecraft:environment_attribute': NumberProviderFloatEnvironmentAttribute,
  'floor': NumberProviderFloatFloor,
  'minecraft:floor': NumberProviderFloatFloor,
  'from_int': NumberProviderFloatFromInt,
  'minecraft:from_int': NumberProviderFloatFromInt,
  'length': NumberProviderFloatLength,
  'minecraft:length': NumberProviderFloatLength,
  'max': NumberProviderFloatMax,
  'minecraft:max': NumberProviderFloatMax,
  'min': NumberProviderFloatMin,
  'minecraft:min': NumberProviderFloatMin,
  'mod': NumberProviderFloatMod,
  'minecraft:mod': NumberProviderFloatMod,
  'mul': NumberProviderFloatMul,
  'minecraft:mul': NumberProviderFloatMul,
  'negate': NumberProviderFloatNegate,
  'minecraft:negate': NumberProviderFloatNegate,
  'number_dispatcher': NumberProviderFloatNumberDispatcher,
  'minecraft:number_dispatcher': NumberProviderFloatNumberDispatcher,
  'pow': NumberProviderFloatPow,
  'minecraft:pow': NumberProviderFloatPow,
  'round': NumberProviderFloatRound,
  'minecraft:round': NumberProviderFloatRound,
  'sin': NumberProviderFloatSin,
  'minecraft:sin': NumberProviderFloatSin,
  'sqrt': NumberProviderFloatSqrt,
  'minecraft:sqrt': NumberProviderFloatSqrt,
  'storage': NumberProviderFloatStorage,
  'minecraft:storage': NumberProviderFloatStorage,
  'sub': NumberProviderFloatSub,
  'minecraft:sub': NumberProviderFloatSub,
  'truncate': NumberProviderFloatTruncate,
  'minecraft:truncate': NumberProviderFloatTruncate,
  'uniform': NumberProviderFloatUniform,
  'minecraft:uniform': NumberProviderFloatUniform,
  'weighted_list': NumberProviderFloatWeightedList,
  'minecraft:weighted_list': NumberProviderFloatWeightedList,
}
type NumberProviderFloatKeys = keyof NumberProviderFloatDispatcherMap
type NumberProviderFloatFallback = (
  | NumberProviderFloatAbs
  | NumberProviderFloatAdd
  | NumberProviderFloatAvg
  | NumberProviderFloatCeil
  | NumberProviderFloatConditional
  | NumberProviderFloatConstant
  | NumberProviderFloatCos
  | NumberProviderFloatDiv
  | NumberProviderFloatEnchantmentLevel
  | NumberProviderFloatEnvironmentAttribute
  | NumberProviderFloatFloor
  | NumberProviderFloatFromInt
  | NumberProviderFloatLength
  | NumberProviderFloatMax
  | NumberProviderFloatMin
  | NumberProviderFloatMod
  | NumberProviderFloatMul
  | NumberProviderFloatNegate
  | NumberProviderFloatNumberDispatcher
  | NumberProviderFloatPow
  | NumberProviderFloatRound
  | NumberProviderFloatSin
  | NumberProviderFloatSqrt
  | NumberProviderFloatStorage
  | NumberProviderFloatSub
  | NumberProviderFloatTruncate
  | NumberProviderFloatUniform
  | NumberProviderFloatWeightedList)
type NumberProviderFloatAbs = AbsoluteFloatProvider
type NumberProviderFloatAdd = AddFloatProvider
type NumberProviderFloatAvg = AverageFloatProvider
type NumberProviderFloatCeil = CeilingFloatProvider
type NumberProviderFloatConditional = ConditionalFloatProvider
type NumberProviderFloatConstant = ConstantFloatProvider
type NumberProviderFloatCos = CosineFloatProvider
type NumberProviderFloatDiv = DivideFloatProvider
type NumberProviderFloatEnchantmentLevel = EnchantmentLevelFloatProvider
type NumberProviderFloatEnvironmentAttribute = EnvironmentAttributeFloatProvider
type NumberProviderFloatFloor = FloorFloatProvider
type NumberProviderFloatFromInt = SingleInputInteger
type NumberProviderFloatLength = VectorLengthFloatProvider
type NumberProviderFloatMax = MaxOfSetFloatProvider
type NumberProviderFloatMin = MinOfSetFloatProvider
type NumberProviderFloatMod = ModuloFloatProvider
type NumberProviderFloatMul = MultiplyFloatProvider
type NumberProviderFloatNegate = NegateFloatProvider
type NumberProviderFloatNumberDispatcher = DispatchedFloatProvider
type NumberProviderFloatPow = ExponentiateFloatProvider
type NumberProviderFloatRound = RoundFloatProvider
type NumberProviderFloatSin = SineFloatProvider
type NumberProviderFloatSqrt = SquareRootFloatProvider
type NumberProviderFloatStorage = DataStorageFloatProvider
type NumberProviderFloatSub = SubtractFloatProvider
type NumberProviderFloatTruncate = TruncateFloatProvider
type NumberProviderFloatUniform = RandomFloatProvider
type NumberProviderFloatWeightedList = WeightedListFloatProvider
export type SymbolNumberProviderFloat<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? NumberProviderFloatDispatcherMap
  : CASE extends 'keys' ? NumberProviderFloatKeys : CASE extends '%fallback' ? NumberProviderFloatFallback : never
