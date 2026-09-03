import type { JsonAtlas } from 'sandstone/arguments/generated/_json/assets/atlas.ts'
import type { JsonBlockStateDefinition } from 'sandstone/arguments/generated/_json/assets/block_state_definition.ts'
import type { JsonCredits } from 'sandstone/arguments/generated/_json/assets/credits.ts'
import type { JsonEquipment } from 'sandstone/arguments/generated/_json/assets/equipment.ts'
import type { JsonFont } from 'sandstone/arguments/generated/_json/assets/font.ts'
import type { JsonGpuWarnlist } from 'sandstone/arguments/generated/_json/assets/gpu_warnlist.ts'
import type { JsonItemDefinition } from 'sandstone/arguments/generated/_json/assets/item_definition.ts'
import type { JsonLang, JsonLangDeprecated } from 'sandstone/arguments/generated/_json/assets/lang.ts'
import type { JsonModel } from 'sandstone/arguments/generated/_json/assets/model.ts'
import type { JsonParticle } from 'sandstone/arguments/generated/_json/assets/particle.ts'
import type { JsonRegionalCompliancies } from 'sandstone/arguments/generated/_json/assets/regional_compliancies.ts'
import type { JsonPostEffect } from 'sandstone/arguments/generated/_json/assets/shader/post.ts'
import type { JsonShaderProgram } from 'sandstone/arguments/generated/_json/assets/shader/program.ts'
import type { JsonSounds } from 'sandstone/arguments/generated/_json/assets/sounds.ts'
import type { JsonTextureMeta } from 'sandstone/arguments/generated/_json/assets/texture_meta.ts'
import type { JsonWaypointStyle } from 'sandstone/arguments/generated/_json/assets/waypoint_style.ts'
import type { JsonAdvancement } from 'sandstone/arguments/generated/_json/data/advancement.ts'
import type { JsonBlockTransformData } from 'sandstone/arguments/generated/_json/data/block_transformer.ts'
import type { JsonChatType } from 'sandstone/arguments/generated/_json/data/chat_type.ts'
import type { JsonDamageType } from 'sandstone/arguments/generated/_json/data/damage_type.ts'
import type { JsonDecoratedPotPattern } from 'sandstone/arguments/generated/_json/data/decorated_pot_pattern.ts'
import type { JsonDialog } from 'sandstone/arguments/generated/_json/data/dialog.ts'
import type { JsonEnchantment } from 'sandstone/arguments/generated/_json/data/enchantment.ts'
import type { JsonEnchantmentProvider } from 'sandstone/arguments/generated/_json/data/enchantment/provider.ts'
import type { JsonTestInstance } from 'sandstone/arguments/generated/_json/data/gametest.ts'
import type { JsonTestEnvironment } from 'sandstone/arguments/generated/_json/data/gametest/test_environment.ts'
import type { JsonItemModifierRoot } from 'sandstone/arguments/generated/_json/data/item_modifier.ts'
import type { JsonLootTable } from 'sandstone/arguments/generated/_json/data/loot.ts'
import type {
  JsonFloatNumberProvider,
} from 'sandstone/arguments/generated/_json/data/number_provider/contextual_float.ts'
import type {
  JsonIntegerNumberProvider,
} from 'sandstone/arguments/generated/_json/data/number_provider/contextual_integer.ts'
import type { JsonPredicate } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonRecipe } from 'sandstone/arguments/generated/_json/data/recipe.ts'
import type { JsonTypedSlotSource } from 'sandstone/arguments/generated/_json/data/slot_source.ts'
import type { JsonSulfurCubeArchetype } from 'sandstone/arguments/generated/_json/data/sulfur_cube_archetype.ts'
import type { JsonTimeline } from 'sandstone/arguments/generated/_json/data/timeline.ts'
import type { JsonTradeSet } from 'sandstone/arguments/generated/_json/data/trade_set.ts'
import type { JsonTrialSpawnerConfig } from 'sandstone/arguments/generated/_json/data/trial_spawner.ts'
import type { JsonTrimMaterial, JsonTrimPattern } from 'sandstone/arguments/generated/_json/data/trim.ts'
import type { JsonBannerPattern } from 'sandstone/arguments/generated/_json/data/variants/banner_pattern.ts'
import type { JsonCatSounds, JsonCatVariant } from 'sandstone/arguments/generated/_json/data/variants/cat.ts'
import type {
  JsonChickenSounds,
  JsonChickenVariant,
} from 'sandstone/arguments/generated/_json/data/variants/chicken.ts'
import type { JsonCowSounds, JsonCowVariant } from 'sandstone/arguments/generated/_json/data/variants/cow.ts'
import type { JsonFrogVariant } from 'sandstone/arguments/generated/_json/data/variants/frog.ts'
import type { JsonInstrument } from 'sandstone/arguments/generated/_json/data/variants/instrument.ts'
import type { JsonSoundVariant } from 'sandstone/arguments/generated/_json/data/variants.ts'
import type { JsonJukeboxSong } from 'sandstone/arguments/generated/_json/data/variants/jukebox_song.ts'
import type { JsonPaintingVariant } from 'sandstone/arguments/generated/_json/data/variants/painting.ts'
import type { JsonPigSounds, JsonPigVariant } from 'sandstone/arguments/generated/_json/data/variants/pig.ts'
import type { JsonWolfSounds, JsonWolfVariant } from 'sandstone/arguments/generated/_json/data/variants/wolf.ts'
import type { JsonZombieNautilusVariant } from 'sandstone/arguments/generated/_json/data/variants/zombie_nautilus.ts'
import type { JsonVillagerTrade } from 'sandstone/arguments/generated/_json/data/villager_trade.ts'
import type { JsonBiome } from 'sandstone/arguments/generated/_json/data/worldgen/biome.ts'
import type { JsonConfiguredCarver } from 'sandstone/arguments/generated/_json/data/worldgen/carver.ts'
import type { JsonDensityFunction } from 'sandstone/arguments/generated/_json/data/worldgen/density_function.ts'
import type {
  JsonMultiNoiseBiomeSourceParameterList,
  JsonNoiseParameters,
} from 'sandstone/arguments/generated/_json/data/worldgen/dimension/biome_source.ts'
import type { JsonDimension, JsonDimensionType } from 'sandstone/arguments/generated/_json/data/worldgen/dimension.ts'
import type {
  JsonBlockStateProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_state_provider.ts'
import type { JsonConfiguredFeature } from 'sandstone/arguments/generated/_json/data/worldgen/feature.ts'
import type { JsonPlacedFeature } from 'sandstone/arguments/generated/_json/data/worldgen/feature/placement.ts'
import type { JsonMaterialCondition } from 'sandstone/arguments/generated/_json/data/worldgen/material_condition.ts'
import type { JsonMaterialRule } from 'sandstone/arguments/generated/_json/data/worldgen/material_rule.ts'
import type { JsonNoiseGeneratorSettings } from 'sandstone/arguments/generated/_json/data/worldgen/noise_settings.ts'
import type { JsonProcessorList } from 'sandstone/arguments/generated/_json/data/worldgen/processor_list.ts'
import type { JsonStructure } from 'sandstone/arguments/generated/_json/data/worldgen/structure.ts'
import type { JsonStructureSet } from 'sandstone/arguments/generated/_json/data/worldgen/structure_set.ts'
import type { JsonTemplatePool } from 'sandstone/arguments/generated/_json/data/worldgen/template_pool.ts'
import type {
  JsonFlatGeneratorPreset,
  JsonWorldPreset,
} from 'sandstone/arguments/generated/_json/data/worldgen/world_preset.ts'
import type { JsonNBTList } from 'sandstone'

type JsonResourceDispatcherMap = {
  'advancement': JsonResourceAdvancement,
  'minecraft:advancement': JsonResourceAdvancement,
  'atlas': JsonResourceAtlas,
  'minecraft:atlas': JsonResourceAtlas,
  'banner_pattern': JsonResourceBannerPattern,
  'minecraft:banner_pattern': JsonResourceBannerPattern,
  'block_definition': JsonResourceBlockDefinition,
  'minecraft:block_definition': JsonResourceBlockDefinition,
  'block_transformer': JsonResourceBlockTransformer,
  'minecraft:block_transformer': JsonResourceBlockTransformer,
  'cat_sound_variant': JsonResourceCatSoundVariant,
  'minecraft:cat_sound_variant': JsonResourceCatSoundVariant,
  'cat_variant': JsonResourceCatVariant,
  'minecraft:cat_variant': JsonResourceCatVariant,
  'chat_type': JsonResourceChatType,
  'minecraft:chat_type': JsonResourceChatType,
  'chicken_sound_variant': JsonResourceChickenSoundVariant,
  'minecraft:chicken_sound_variant': JsonResourceChickenSoundVariant,
  'chicken_variant': JsonResourceChickenVariant,
  'minecraft:chicken_variant': JsonResourceChickenVariant,
  'context_float_provider': JsonResourceContextFloatProvider,
  'minecraft:context_float_provider': JsonResourceContextFloatProvider,
  'context_int_provider': JsonResourceContextIntProvider,
  'minecraft:context_int_provider': JsonResourceContextIntProvider,
  'cow_sound_variant': JsonResourceCowSoundVariant,
  'minecraft:cow_sound_variant': JsonResourceCowSoundVariant,
  'cow_variant': JsonResourceCowVariant,
  'minecraft:cow_variant': JsonResourceCowVariant,
  'credits': JsonResourceCredits,
  'minecraft:credits': JsonResourceCredits,
  'damage_type': JsonResourceDamageType,
  'minecraft:damage_type': JsonResourceDamageType,
  'decorated_pot_pattern': JsonResourceDecoratedPotPattern,
  'minecraft:decorated_pot_pattern': JsonResourceDecoratedPotPattern,
  'dialog': JsonResourceDialog,
  'minecraft:dialog': JsonResourceDialog,
  'dimension': JsonResourceDimension,
  'minecraft:dimension': JsonResourceDimension,
  'dimension_type': JsonResourceDimensionType,
  'minecraft:dimension_type': JsonResourceDimensionType,
  'enchantment': JsonResourceEnchantment,
  'minecraft:enchantment': JsonResourceEnchantment,
  'enchantment_provider': JsonResourceEnchantmentProvider,
  'minecraft:enchantment_provider': JsonResourceEnchantmentProvider,
  'equipment': JsonResourceEquipment,
  'minecraft:equipment': JsonResourceEquipment,
  'font': JsonResourceFont,
  'minecraft:font': JsonResourceFont,
  'frog_variant': JsonResourceFrogVariant,
  'minecraft:frog_variant': JsonResourceFrogVariant,
  'gpu_warnlist': JsonResourceGpuWarnlist,
  'minecraft:gpu_warnlist': JsonResourceGpuWarnlist,
  'instrument': JsonResourceInstrument,
  'minecraft:instrument': JsonResourceInstrument,
  'item_definition': JsonResourceItemDefinition,
  'minecraft:item_definition': JsonResourceItemDefinition,
  'item_modifier': JsonResourceItemModifier,
  'minecraft:item_modifier': JsonResourceItemModifier,
  'jukebox_song': JsonResourceJukeboxSong,
  'minecraft:jukebox_song': JsonResourceJukeboxSong,
  'lang': JsonResourceLang,
  'minecraft:lang': JsonResourceLang,
  'lang/deprecated': JsonResourceLangDeprecated,
  'minecraft:lang/deprecated': JsonResourceLangDeprecated,
  'loot_table': JsonResourceLootTable,
  'minecraft:loot_table': JsonResourceLootTable,
  'model': JsonResourceModel,
  'minecraft:model': JsonResourceModel,
  'painting_variant': JsonResourcePaintingVariant,
  'minecraft:painting_variant': JsonResourcePaintingVariant,
  'particle': JsonResourceParticle,
  'minecraft:particle': JsonResourceParticle,
  'pig_sound_variant': JsonResourcePigSoundVariant,
  'minecraft:pig_sound_variant': JsonResourcePigSoundVariant,
  'pig_variant': JsonResourcePigVariant,
  'minecraft:pig_variant': JsonResourcePigVariant,
  'post_effect': JsonResourcePostEffect,
  'minecraft:post_effect': JsonResourcePostEffect,
  'predicate': JsonResourcePredicate,
  'minecraft:predicate': JsonResourcePredicate,
  'recipe': JsonResourceRecipe,
  'minecraft:recipe': JsonResourceRecipe,
  'regional_compliancies': JsonResourceRegionalCompliancies,
  'minecraft:regional_compliancies': JsonResourceRegionalCompliancies,
  'shader': JsonResourceShader,
  'minecraft:shader': JsonResourceShader,
  'slot_source': JsonResourceSlotSource,
  'minecraft:slot_source': JsonResourceSlotSource,
  'sounds': JsonResourceSounds,
  'minecraft:sounds': JsonResourceSounds,
  'sulfur_cube_archetype': JsonResourceSulfurCubeArchetype,
  'minecraft:sulfur_cube_archetype': JsonResourceSulfurCubeArchetype,
  'test_environment': JsonResourceTestEnvironment,
  'minecraft:test_environment': JsonResourceTestEnvironment,
  'test_instance': JsonResourceTestInstance,
  'minecraft:test_instance': JsonResourceTestInstance,
  'texture_meta': JsonResourceTextureMeta,
  'minecraft:texture_meta': JsonResourceTextureMeta,
  'timeline': JsonResourceTimeline,
  'minecraft:timeline': JsonResourceTimeline,
  'trade_set': JsonResourceTradeSet,
  'minecraft:trade_set': JsonResourceTradeSet,
  'trial_spawner': JsonResourceTrialSpawner,
  'minecraft:trial_spawner': JsonResourceTrialSpawner,
  'trim_material': JsonResourceTrimMaterial,
  'minecraft:trim_material': JsonResourceTrimMaterial,
  'trim_pattern': JsonResourceTrimPattern,
  'minecraft:trim_pattern': JsonResourceTrimPattern,
  'villager_trade': JsonResourceVillagerTrade,
  'minecraft:villager_trade': JsonResourceVillagerTrade,
  'waypoint_style': JsonResourceWaypointStyle,
  'minecraft:waypoint_style': JsonResourceWaypointStyle,
  'wolf_sound_variant': JsonResourceWolfSoundVariant,
  'minecraft:wolf_sound_variant': JsonResourceWolfSoundVariant,
  'wolf_variant': JsonResourceWolfVariant,
  'minecraft:wolf_variant': JsonResourceWolfVariant,
  'world_clock': JsonResourceWorldClock,
  'minecraft:world_clock': JsonResourceWorldClock,
  'worldgen/biome': JsonResourceWorldgenBiome,
  'minecraft:worldgen/biome': JsonResourceWorldgenBiome,
  'worldgen/block_state_provider': JsonResourceWorldgenBlockStateProvider,
  'minecraft:worldgen/block_state_provider': JsonResourceWorldgenBlockStateProvider,
  'worldgen/carver': JsonResourceWorldgenCarver,
  'minecraft:worldgen/carver': JsonResourceWorldgenCarver,
  'worldgen/density_function': JsonResourceWorldgenDensityFunction,
  'minecraft:worldgen/density_function': JsonResourceWorldgenDensityFunction,
  'worldgen/feature': JsonResourceWorldgenFeature,
  'minecraft:worldgen/feature': JsonResourceWorldgenFeature,
  'worldgen/flat_level_generator_preset': JsonResourceWorldgenFlatLevelGeneratorPreset,
  'minecraft:worldgen/flat_level_generator_preset': JsonResourceWorldgenFlatLevelGeneratorPreset,
  'worldgen/material_condition': JsonResourceWorldgenMaterialCondition,
  'minecraft:worldgen/material_condition': JsonResourceWorldgenMaterialCondition,
  'worldgen/material_rule': JsonResourceWorldgenMaterialRule,
  'minecraft:worldgen/material_rule': JsonResourceWorldgenMaterialRule,
  'worldgen/multi_noise_biome_source_parameter_list': JsonResourceWorldgenMultiNoiseBiomeSourceParameterList,
  'minecraft:worldgen/multi_noise_biome_source_parameter_list': JsonResourceWorldgenMultiNoiseBiomeSourceParameterList,
  'worldgen/noise': JsonResourceWorldgenNoise,
  'minecraft:worldgen/noise': JsonResourceWorldgenNoise,
  'worldgen/noise_settings': JsonResourceWorldgenNoiseSettings,
  'minecraft:worldgen/noise_settings': JsonResourceWorldgenNoiseSettings,
  'worldgen/placed_feature': JsonResourceWorldgenPlacedFeature,
  'minecraft:worldgen/placed_feature': JsonResourceWorldgenPlacedFeature,
  'worldgen/processor_list': JsonResourceWorldgenProcessorList,
  'minecraft:worldgen/processor_list': JsonResourceWorldgenProcessorList,
  'worldgen/structure': JsonResourceWorldgenStructure,
  'minecraft:worldgen/structure': JsonResourceWorldgenStructure,
  'worldgen/structure_set': JsonResourceWorldgenStructureSet,
  'minecraft:worldgen/structure_set': JsonResourceWorldgenStructureSet,
  'worldgen/template_pool': JsonResourceWorldgenTemplatePool,
  'minecraft:worldgen/template_pool': JsonResourceWorldgenTemplatePool,
  'worldgen/world_preset': JsonResourceWorldgenWorldPreset,
  'minecraft:worldgen/world_preset': JsonResourceWorldgenWorldPreset,
  'zombie_nautilus_variant': JsonResourceZombieNautilusVariant,
  'minecraft:zombie_nautilus_variant': JsonResourceZombieNautilusVariant,
}
type JsonResourceKeys = keyof JsonResourceDispatcherMap
type JsonResourceFallback = (
  | JsonResourceAdvancement
  | JsonResourceAtlas
  | JsonResourceBannerPattern
  | JsonResourceBlockDefinition
  | JsonResourceBlockTransformer
  | JsonResourceCatSoundVariant
  | JsonResourceCatVariant
  | JsonResourceChatType
  | JsonResourceChickenSoundVariant
  | JsonResourceChickenVariant
  | JsonResourceContextFloatProvider
  | JsonResourceContextIntProvider
  | JsonResourceCowSoundVariant
  | JsonResourceCowVariant
  | JsonResourceCredits
  | JsonResourceDamageType
  | JsonResourceDecoratedPotPattern
  | JsonResourceDialog
  | JsonResourceDimension
  | JsonResourceDimensionType
  | JsonResourceEnchantment
  | JsonResourceEnchantmentProvider
  | JsonResourceEquipment
  | JsonResourceFont
  | JsonResourceFrogVariant
  | JsonResourceGpuWarnlist
  | JsonResourceInstrument
  | JsonResourceItemDefinition
  | JsonResourceItemModifier
  | JsonResourceJukeboxSong
  | JsonResourceLang
  | JsonResourceLangDeprecated
  | JsonResourceLootTable
  | JsonResourceModel
  | JsonResourcePaintingVariant
  | JsonResourceParticle
  | JsonResourcePigSoundVariant
  | JsonResourcePigVariant
  | JsonResourcePostEffect
  | JsonResourcePredicate
  | JsonResourceRecipe
  | JsonResourceRegionalCompliancies
  | JsonResourceShader
  | JsonResourceSlotSource
  | JsonResourceSounds
  | JsonResourceSulfurCubeArchetype
  | JsonResourceTestEnvironment
  | JsonResourceTestInstance
  | JsonResourceTextureMeta
  | JsonResourceTimeline
  | JsonResourceTradeSet
  | JsonResourceTrialSpawner
  | JsonResourceTrimMaterial
  | JsonResourceTrimPattern
  | JsonResourceVillagerTrade
  | JsonResourceWaypointStyle
  | JsonResourceWolfSoundVariant
  | JsonResourceWolfVariant
  | JsonResourceWorldClock
  | JsonResourceWorldgenBiome
  | JsonResourceWorldgenBlockStateProvider
  | JsonResourceWorldgenCarver
  | JsonResourceWorldgenDensityFunction
  | JsonResourceWorldgenFeature
  | JsonResourceWorldgenFlatLevelGeneratorPreset
  | JsonResourceWorldgenMaterialCondition
  | JsonResourceWorldgenMaterialRule
  | JsonResourceWorldgenMultiNoiseBiomeSourceParameterList
  | JsonResourceWorldgenNoise
  | JsonResourceWorldgenNoiseSettings
  | JsonResourceWorldgenPlacedFeature
  | JsonResourceWorldgenProcessorList
  | JsonResourceWorldgenStructure
  | JsonResourceWorldgenStructureSet
  | JsonResourceWorldgenTemplatePool
  | JsonResourceWorldgenWorldPreset
  | JsonResourceZombieNautilusVariant)
type JsonResourceAdvancement = JsonAdvancement
type JsonResourceAtlas = JsonAtlas
type JsonResourceBannerPattern = JsonBannerPattern
type JsonResourceBlockDefinition = JsonBlockStateDefinition
type JsonResourceBlockTransformer = JsonNBTList<JsonBlockTransformData, {
  leftExclusive: false,
  rightExclusive: false,
}>
type JsonResourceCatSoundVariant = JsonSoundVariant<JsonCatSounds>
type JsonResourceCatVariant = JsonCatVariant
type JsonResourceChatType = JsonChatType
type JsonResourceChickenSoundVariant = JsonSoundVariant<JsonChickenSounds>
type JsonResourceChickenVariant = JsonChickenVariant
type JsonResourceContextFloatProvider = JsonFloatNumberProvider
type JsonResourceContextIntProvider = JsonIntegerNumberProvider
type JsonResourceCowSoundVariant = JsonCowSounds
type JsonResourceCowVariant = JsonCowVariant
type JsonResourceCredits = JsonCredits
type JsonResourceDamageType = JsonDamageType
type JsonResourceDecoratedPotPattern = JsonDecoratedPotPattern
type JsonResourceDialog = JsonDialog
type JsonResourceDimension = JsonDimension
type JsonResourceDimensionType = JsonDimensionType
type JsonResourceEnchantment = JsonEnchantment
type JsonResourceEnchantmentProvider = JsonEnchantmentProvider
type JsonResourceEquipment = JsonEquipment
type JsonResourceFont = JsonFont
type JsonResourceFrogVariant = JsonFrogVariant
type JsonResourceGpuWarnlist = JsonGpuWarnlist
type JsonResourceInstrument = JsonInstrument
type JsonResourceItemDefinition = JsonItemDefinition
type JsonResourceItemModifier = JsonItemModifierRoot
type JsonResourceJukeboxSong = JsonJukeboxSong
type JsonResourceLang = JsonLang
type JsonResourceLangDeprecated = JsonLangDeprecated
type JsonResourceLootTable = JsonLootTable
type JsonResourceModel = JsonModel
type JsonResourcePaintingVariant = JsonPaintingVariant
type JsonResourceParticle = JsonParticle
type JsonResourcePigSoundVariant = JsonSoundVariant<JsonPigSounds>
type JsonResourcePigVariant = JsonPigVariant
type JsonResourcePostEffect = JsonPostEffect
type JsonResourcePredicate = JsonPredicate
type JsonResourceRecipe = JsonRecipe
type JsonResourceRegionalCompliancies = JsonRegionalCompliancies
type JsonResourceShader = JsonShaderProgram
type JsonResourceSlotSource = JsonTypedSlotSource
type JsonResourceSounds = JsonSounds
type JsonResourceSulfurCubeArchetype = JsonSulfurCubeArchetype
type JsonResourceTestEnvironment = JsonTestEnvironment
type JsonResourceTestInstance = JsonTestInstance
type JsonResourceTextureMeta = JsonTextureMeta
type JsonResourceTimeline = JsonTimeline
type JsonResourceTradeSet = JsonTradeSet
type JsonResourceTrialSpawner = JsonTrialSpawnerConfig
type JsonResourceTrimMaterial = JsonTrimMaterial
type JsonResourceTrimPattern = JsonTrimPattern
type JsonResourceVillagerTrade = JsonVillagerTrade
type JsonResourceWaypointStyle = JsonWaypointStyle
type JsonResourceWolfSoundVariant = JsonSoundVariant<JsonWolfSounds>
type JsonResourceWolfVariant = JsonWolfVariant
type JsonResourceWorldClock = Record<string, never>
type JsonResourceWorldgenBiome = JsonBiome
type JsonResourceWorldgenBlockStateProvider = JsonBlockStateProvider
type JsonResourceWorldgenCarver = JsonConfiguredCarver
type JsonResourceWorldgenDensityFunction = JsonDensityFunction
type JsonResourceWorldgenFeature = JsonConfiguredFeature
type JsonResourceWorldgenFlatLevelGeneratorPreset = JsonFlatGeneratorPreset
type JsonResourceWorldgenMaterialCondition = JsonMaterialCondition
type JsonResourceWorldgenMaterialRule = JsonMaterialRule
type JsonResourceWorldgenMultiNoiseBiomeSourceParameterList = JsonMultiNoiseBiomeSourceParameterList
type JsonResourceWorldgenNoise = JsonNoiseParameters
type JsonResourceWorldgenNoiseSettings = JsonNoiseGeneratorSettings
type JsonResourceWorldgenPlacedFeature = JsonPlacedFeature
type JsonResourceWorldgenProcessorList = JsonProcessorList
type JsonResourceWorldgenStructure = JsonStructure
type JsonResourceWorldgenStructureSet = JsonStructureSet
type JsonResourceWorldgenTemplatePool = JsonTemplatePool
type JsonResourceWorldgenWorldPreset = JsonWorldPreset
type JsonResourceZombieNautilusVariant = JsonZombieNautilusVariant
export type JsonSymbolResource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonResourceDispatcherMap
  : CASE extends 'keys' ? JsonResourceKeys : CASE extends '%fallback' ? JsonResourceFallback : never
