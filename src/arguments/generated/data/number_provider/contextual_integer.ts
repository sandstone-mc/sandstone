import type {
  FloatNumberProviderRef,
  SingleInputFloat,
} from 'sandstone/arguments/generated/data/number_provider/contextual_float.ts'
import type { PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { ScoreProvider } from 'sandstone/arguments/generated/data/util.ts'
import type { NumericalEnvironmentAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { IntegerNumberProviderClass, NBTInt, NBTList, NonEmptyString, ObjectiveClass } from 'sandstone'

export type AbsoluteIntegerProvider = SingleInputInteger

export type AddIntegerProvider = MultiInputInteger

export type AverageIntegerProvider = MultiInputInteger

export type BinomialRandomIntegerProvider = {
  /**
   * Number of coin flips.
   */
  n: IntegerNumberProviderRef,
  /**
   * Probability of a single coin flip succeeding.
   */
  p: FloatNumberProviderRef,
}

export type ConditionalIntegerProvider = {
  conditions: PredicateRef,
  on_true: IntegerNumberProviderRef,
  /**
   * Defaults to `0`.
   */
  on_false?: IntegerNumberProviderRef,
}

export type ConstantIntegerProvider = {
  value: NBTInt,
}

export type DispatchedIntegerProvider = {
  cases: Array<{
    condition: PredicateRef,
    value: IntegerNumberProviderRef,
  }>,
  /**
   * Defaults to `0`.
   */
  default?: IntegerNumberProviderRef,
}

export type DispatcherCase = {
  condition: PredicateRef,
  value: IntegerNumberProviderRef,
}

export type DivideIntegerProvider = SidedInputsInteger

export type EnvironmentAttributeIntegerProvider = {
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

export type ExponentiateIntegerProvider = {
  base: IntegerNumberProviderRef,
  exponent: IntegerNumberProviderRef,
}

export type FlooredDivideIntegerProvider = SidedInputsInteger

export type FlooredModuloIntegerProvider = SidedInputsInteger

export type IntegerNumberProvider = (NBTInt | ({
  [S in Extract<Extract<Registry['minecraft:context_int_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolNumberProviderInteger ? SymbolNumberProviderInteger[S] : RootNBT))
}[Extract<Registry['minecraft:context_int_provider_type'], string>]))

export type IntegerNumberProviderRef = ((
  | Registry['minecraft:context_int_provider'] | IntegerNumberProviderClass)
  | IntegerNumberProvider)

export type MaxOfSetIntegerProvider = MultiInputInteger

export type MinOfSetIntegerProvider = MultiInputInteger

export type ModuloIntegerProvider = SidedInputsInteger

export type MultiInputInteger = {
  /**
   * Value:
   * List length range: 2..
   */
  inputs: NBTList<IntegerNumberProviderRef, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type MultiplyIntegerProvider = MultiInputInteger

export type NegateIntegerProvider = SingleInputInteger

export type RandomIntegerProvider = {
  min?: IntegerNumberProviderRef,
  max?: IntegerNumberProviderRef,
}

export type ScoreIntegerProvider = {
  target: ScoreProvider,
  score: NonEmptyString | ObjectiveClass,
  /**
   * Defaults to `0`.
   */
  fallback?: IntegerNumberProviderRef,
}

export type SidedInputsInteger = {
  left: IntegerNumberProviderRef,
  right: IntegerNumberProviderRef,
}

export type SingleInputInteger = {
  input: IntegerNumberProviderRef,
}

export type SubtractIntegerProvider = SidedInputsInteger

export type WeightedListIntegerProvider = {
  distribution: NonEmptyWeightedList<IntegerNumberProviderRef>,
}
type NumberProviderIntegerDispatcherMap = {
  'abs': NumberProviderIntegerAbs,
  'minecraft:abs': NumberProviderIntegerAbs,
  'add': NumberProviderIntegerAdd,
  'minecraft:add': NumberProviderIntegerAdd,
  'avg': NumberProviderIntegerAvg,
  'minecraft:avg': NumberProviderIntegerAvg,
  'binomial': NumberProviderIntegerBinomial,
  'minecraft:binomial': NumberProviderIntegerBinomial,
  'conditional': NumberProviderIntegerConditional,
  'minecraft:conditional': NumberProviderIntegerConditional,
  'constant': NumberProviderIntegerConstant,
  'minecraft:constant': NumberProviderIntegerConstant,
  'div': NumberProviderIntegerDiv,
  'minecraft:div': NumberProviderIntegerDiv,
  'environment_attribute': NumberProviderIntegerEnvironmentAttribute,
  'minecraft:environment_attribute': NumberProviderIntegerEnvironmentAttribute,
  'floor_div': NumberProviderIntegerFloorDiv,
  'minecraft:floor_div': NumberProviderIntegerFloorDiv,
  'floor_mod': NumberProviderIntegerFloorMod,
  'minecraft:floor_mod': NumberProviderIntegerFloorMod,
  'from_float': NumberProviderIntegerFromFloat,
  'minecraft:from_float': NumberProviderIntegerFromFloat,
  'max': NumberProviderIntegerMax,
  'minecraft:max': NumberProviderIntegerMax,
  'min': NumberProviderIntegerMin,
  'minecraft:min': NumberProviderIntegerMin,
  'mod': NumberProviderIntegerMod,
  'minecraft:mod': NumberProviderIntegerMod,
  'mul': NumberProviderIntegerMul,
  'minecraft:mul': NumberProviderIntegerMul,
  'negate': NumberProviderIntegerNegate,
  'minecraft:negate': NumberProviderIntegerNegate,
  'number_dispatcher': NumberProviderIntegerNumberDispatcher,
  'minecraft:number_dispatcher': NumberProviderIntegerNumberDispatcher,
  'pow': NumberProviderIntegerPow,
  'minecraft:pow': NumberProviderIntegerPow,
  'score': NumberProviderIntegerScore,
  'minecraft:score': NumberProviderIntegerScore,
  'sub': NumberProviderIntegerSub,
  'minecraft:sub': NumberProviderIntegerSub,
  'uniform': NumberProviderIntegerUniform,
  'minecraft:uniform': NumberProviderIntegerUniform,
  'weighted_list': NumberProviderIntegerWeightedList,
  'minecraft:weighted_list': NumberProviderIntegerWeightedList,
}
type NumberProviderIntegerKeys = keyof NumberProviderIntegerDispatcherMap
type NumberProviderIntegerFallback = (
  | NumberProviderIntegerAbs
  | NumberProviderIntegerAdd
  | NumberProviderIntegerAvg
  | NumberProviderIntegerBinomial
  | NumberProviderIntegerConditional
  | NumberProviderIntegerConstant
  | NumberProviderIntegerDiv
  | NumberProviderIntegerEnvironmentAttribute
  | NumberProviderIntegerFloorDiv
  | NumberProviderIntegerFloorMod
  | NumberProviderIntegerFromFloat
  | NumberProviderIntegerMax
  | NumberProviderIntegerMin
  | NumberProviderIntegerMod
  | NumberProviderIntegerMul
  | NumberProviderIntegerNegate
  | NumberProviderIntegerNumberDispatcher
  | NumberProviderIntegerPow
  | NumberProviderIntegerScore
  | NumberProviderIntegerSub
  | NumberProviderIntegerUniform
  | NumberProviderIntegerWeightedList)
type NumberProviderIntegerAbs = AbsoluteIntegerProvider
type NumberProviderIntegerAdd = AddIntegerProvider
type NumberProviderIntegerAvg = AverageIntegerProvider
type NumberProviderIntegerBinomial = BinomialRandomIntegerProvider
type NumberProviderIntegerConditional = ConditionalIntegerProvider
type NumberProviderIntegerConstant = ConstantIntegerProvider
type NumberProviderIntegerDiv = DivideIntegerProvider
type NumberProviderIntegerEnvironmentAttribute = EnvironmentAttributeIntegerProvider
type NumberProviderIntegerFloorDiv = FlooredDivideIntegerProvider
type NumberProviderIntegerFloorMod = FlooredModuloIntegerProvider
type NumberProviderIntegerFromFloat = SingleInputFloat
type NumberProviderIntegerMax = MaxOfSetIntegerProvider
type NumberProviderIntegerMin = MinOfSetIntegerProvider
type NumberProviderIntegerMod = ModuloIntegerProvider
type NumberProviderIntegerMul = MultiplyIntegerProvider
type NumberProviderIntegerNegate = NegateIntegerProvider
type NumberProviderIntegerNumberDispatcher = DispatchedIntegerProvider
type NumberProviderIntegerPow = ExponentiateIntegerProvider
type NumberProviderIntegerScore = ScoreIntegerProvider
type NumberProviderIntegerSub = SubtractIntegerProvider
type NumberProviderIntegerUniform = RandomIntegerProvider
type NumberProviderIntegerWeightedList = WeightedListIntegerProvider
export type SymbolNumberProviderInteger<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? NumberProviderIntegerDispatcherMap
  : CASE extends 'keys' ? NumberProviderIntegerKeys : CASE extends '%fallback' ? NumberProviderIntegerFallback : never
