import type { Atlas } from 'sandstone/arguments/generated/assets/atlas.ts'
import type { BlockStateDefinition } from 'sandstone/arguments/generated/assets/block_state_definition.ts'
import type { Credits } from 'sandstone/arguments/generated/assets/credits.ts'
import type { Equipment } from 'sandstone/arguments/generated/assets/equipment.ts'
import type { Font } from 'sandstone/arguments/generated/assets/font.ts'
import type { GpuWarnlist } from 'sandstone/arguments/generated/assets/gpu_warnlist.ts'
import type { ItemDefinition } from 'sandstone/arguments/generated/assets/item_definition.ts'
import type { Lang, LangDeprecated } from 'sandstone/arguments/generated/assets/lang.ts'
import type { Model } from 'sandstone/arguments/generated/assets/model.ts'
import type { Particle } from 'sandstone/arguments/generated/assets/particle.ts'
import type { RegionalCompliancies } from 'sandstone/arguments/generated/assets/regional_compliancies.ts'
import type { PostEffect } from 'sandstone/arguments/generated/assets/shader/post.ts'
import type { ShaderProgram } from 'sandstone/arguments/generated/assets/shader/program.ts'
import type { Sounds } from 'sandstone/arguments/generated/assets/sounds.ts'
import type { TextureMeta } from 'sandstone/arguments/generated/assets/texture_meta.ts'
import type { WaypointStyle } from 'sandstone/arguments/generated/assets/waypoint_style.ts'
import type { Advancement } from 'sandstone/arguments/generated/data/advancement.ts'
import type { ChatType } from 'sandstone/arguments/generated/data/chat_type.ts'
import type { DamageType } from 'sandstone/arguments/generated/data/damage_type.ts'
import type { Dialog } from 'sandstone/arguments/generated/data/dialog.ts'
import type { Enchantment } from 'sandstone/arguments/generated/data/enchantment.ts'
import type { EnchantmentProvider } from 'sandstone/arguments/generated/data/enchantment/provider.ts'
import type { TestEnvironment } from 'sandstone/arguments/generated/data/gametest/test_environment.ts'
import type { TestInstance } from 'sandstone/arguments/generated/data/gametest.ts'
import type { ItemModifier } from 'sandstone/arguments/generated/data/item_modifier.ts'
import type { LootTable } from 'sandstone/arguments/generated/data/loot.ts'
import type { Predicate } from 'sandstone/arguments/generated/data/predicate.ts'
import type { Recipe } from 'sandstone/arguments/generated/data/recipe.ts'
import type { Timeline } from 'sandstone/arguments/generated/data/timeline.ts'
import type { TradeSet } from 'sandstone/arguments/generated/data/trade_set.ts'
import type { TrialSpawnerConfig } from 'sandstone/arguments/generated/data/trial_spawner.ts'
import type { TrimMaterial, TrimPattern } from 'sandstone/arguments/generated/data/trim.ts'
import type { BannerPattern } from 'sandstone/arguments/generated/data/variants/banner_pattern.ts'
import type { CatSounds, CatVariant } from 'sandstone/arguments/generated/data/variants/cat.ts'
import type { ChickenSounds, ChickenVariant } from 'sandstone/arguments/generated/data/variants/chicken.ts'
import type { CowSounds, CowVariant } from 'sandstone/arguments/generated/data/variants/cow.ts'
import type { FrogVariant } from 'sandstone/arguments/generated/data/variants/frog.ts'
import type { Instrument } from 'sandstone/arguments/generated/data/variants/instrument.ts'
import type { JukeboxSong } from 'sandstone/arguments/generated/data/variants/jukebox_song.ts'
import type { PaintingVariant } from 'sandstone/arguments/generated/data/variants/painting.ts'
import type { PigSounds, PigVariant } from 'sandstone/arguments/generated/data/variants/pig.ts'
import type { SoundVariant } from 'sandstone/arguments/generated/data/variants.ts'
import type { WolfSounds, WolfVariant } from 'sandstone/arguments/generated/data/variants/wolf.ts'
import type { ZombieNautilusVariant } from 'sandstone/arguments/generated/data/variants/zombie_nautilus.ts'
import type { VillagerTrade } from 'sandstone/arguments/generated/data/villager_trade.ts'
import type { Biome } from 'sandstone/arguments/generated/data/worldgen/biome.ts'
import type { ConfiguredCarver } from 'sandstone/arguments/generated/data/worldgen/carver.ts'
import type { DensityFunction } from 'sandstone/arguments/generated/data/worldgen/density_function.ts'
import type {
  MultiNoiseBiomeSourceParameterList,
  NoiseParameters,
} from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source.ts'
import type { Dimension, DimensionType } from 'sandstone/arguments/generated/data/worldgen/dimension.ts'
import type { ConfiguredFeature } from 'sandstone/arguments/generated/data/worldgen/feature.ts'
import type { PlacedFeature } from 'sandstone/arguments/generated/data/worldgen/feature/placement.ts'
import type { NoiseGeneratorSettings } from 'sandstone/arguments/generated/data/worldgen/noise_settings.ts'
import type { ProcessorList } from 'sandstone/arguments/generated/data/worldgen/processor_list.ts'
import type { StructureSet } from 'sandstone/arguments/generated/data/worldgen/structure_set.ts'
import type { Structure } from 'sandstone/arguments/generated/data/worldgen/structure.ts'
import type { ConfiguredSurfaceBuilder } from 'sandstone/arguments/generated/data/worldgen/surface_builder.ts'
import type { TemplatePool } from 'sandstone/arguments/generated/data/worldgen/template_pool.ts'
import type { FlatGeneratorPreset, WorldPreset } from 'sandstone/arguments/generated/data/worldgen/world_preset.ts'

type ResourceDispatcherMap = {
  'advancement': ResourceAdvancement,
  'minecraft:advancement': ResourceAdvancement,
  'atlas': ResourceAtlas,
  'minecraft:atlas': ResourceAtlas,
  'banner_pattern': ResourceBannerPattern,
  'minecraft:banner_pattern': ResourceBannerPattern,
  'block_definition': ResourceBlockDefinition,
  'minecraft:block_definition': ResourceBlockDefinition,
  'cat_sound_variant': ResourceCatSoundVariant,
  'minecraft:cat_sound_variant': ResourceCatSoundVariant,
  'cat_variant': ResourceCatVariant,
  'minecraft:cat_variant': ResourceCatVariant,
  'chat_type': ResourceChatType,
  'minecraft:chat_type': ResourceChatType,
  'chicken_sound_variant': ResourceChickenSoundVariant,
  'minecraft:chicken_sound_variant': ResourceChickenSoundVariant,
  'chicken_variant': ResourceChickenVariant,
  'minecraft:chicken_variant': ResourceChickenVariant,
  'cow_sound_variant': ResourceCowSoundVariant,
  'minecraft:cow_sound_variant': ResourceCowSoundVariant,
  'cow_variant': ResourceCowVariant,
  'minecraft:cow_variant': ResourceCowVariant,
  'credits': ResourceCredits,
  'minecraft:credits': ResourceCredits,
  'damage_type': ResourceDamageType,
  'minecraft:damage_type': ResourceDamageType,
  'dialog': ResourceDialog,
  'minecraft:dialog': ResourceDialog,
  'dimension': ResourceDimension,
  'minecraft:dimension': ResourceDimension,
  'dimension_type': ResourceDimensionType,
  'minecraft:dimension_type': ResourceDimensionType,
  'enchantment': ResourceEnchantment,
  'minecraft:enchantment': ResourceEnchantment,
  'enchantment_provider': ResourceEnchantmentProvider,
  'minecraft:enchantment_provider': ResourceEnchantmentProvider,
  'equipment': ResourceEquipment,
  'minecraft:equipment': ResourceEquipment,
  'font': ResourceFont,
  'minecraft:font': ResourceFont,
  'frog_variant': ResourceFrogVariant,
  'minecraft:frog_variant': ResourceFrogVariant,
  'gpu_warnlist': ResourceGpuWarnlist,
  'minecraft:gpu_warnlist': ResourceGpuWarnlist,
  'instrument': ResourceInstrument,
  'minecraft:instrument': ResourceInstrument,
  'item_definition': ResourceItemDefinition,
  'minecraft:item_definition': ResourceItemDefinition,
  'item_modifier': ResourceItemModifier,
  'minecraft:item_modifier': ResourceItemModifier,
  'jukebox_song': ResourceJukeboxSong,
  'minecraft:jukebox_song': ResourceJukeboxSong,
  'lang': ResourceLang,
  'minecraft:lang': ResourceLang,
  'lang/deprecated': ResourceLangDeprecated,
  'minecraft:lang/deprecated': ResourceLangDeprecated,
  'loot_table': ResourceLootTable,
  'minecraft:loot_table': ResourceLootTable,
  'model': ResourceModel,
  'minecraft:model': ResourceModel,
  'painting_variant': ResourcePaintingVariant,
  'minecraft:painting_variant': ResourcePaintingVariant,
  'particle': ResourceParticle,
  'minecraft:particle': ResourceParticle,
  'pig_sound_variant': ResourcePigSoundVariant,
  'minecraft:pig_sound_variant': ResourcePigSoundVariant,
  'pig_variant': ResourcePigVariant,
  'minecraft:pig_variant': ResourcePigVariant,
  'post_effect': ResourcePostEffect,
  'minecraft:post_effect': ResourcePostEffect,
  'predicate': ResourcePredicate,
  'minecraft:predicate': ResourcePredicate,
  'recipe': ResourceRecipe,
  'minecraft:recipe': ResourceRecipe,
  'regional_compliancies': ResourceRegionalCompliancies,
  'minecraft:regional_compliancies': ResourceRegionalCompliancies,
  'shader': ResourceShader,
  'minecraft:shader': ResourceShader,
  'sounds': ResourceSounds,
  'minecraft:sounds': ResourceSounds,
  'test_environment': ResourceTestEnvironment,
  'minecraft:test_environment': ResourceTestEnvironment,
  'test_instance': ResourceTestInstance,
  'minecraft:test_instance': ResourceTestInstance,
  'texture_meta': ResourceTextureMeta,
  'minecraft:texture_meta': ResourceTextureMeta,
  'timeline': ResourceTimeline,
  'minecraft:timeline': ResourceTimeline,
  'trade_set': ResourceTradeSet,
  'minecraft:trade_set': ResourceTradeSet,
  'trial_spawner': ResourceTrialSpawner,
  'minecraft:trial_spawner': ResourceTrialSpawner,
  'trim_material': ResourceTrimMaterial,
  'minecraft:trim_material': ResourceTrimMaterial,
  'trim_pattern': ResourceTrimPattern,
  'minecraft:trim_pattern': ResourceTrimPattern,
  'villager_trade': ResourceVillagerTrade,
  'minecraft:villager_trade': ResourceVillagerTrade,
  'waypoint_style': ResourceWaypointStyle,
  'minecraft:waypoint_style': ResourceWaypointStyle,
  'wolf_sound_variant': ResourceWolfSoundVariant,
  'minecraft:wolf_sound_variant': ResourceWolfSoundVariant,
  'wolf_variant': ResourceWolfVariant,
  'minecraft:wolf_variant': ResourceWolfVariant,
  'world_clock': ResourceWorldClock,
  'minecraft:world_clock': ResourceWorldClock,
  'worldgen/biome': ResourceWorldgenBiome,
  'minecraft:worldgen/biome': ResourceWorldgenBiome,
  'worldgen/configured_carver': ResourceWorldgenConfiguredCarver,
  'minecraft:worldgen/configured_carver': ResourceWorldgenConfiguredCarver,
  'worldgen/configured_feature': ResourceWorldgenConfiguredFeature,
  'minecraft:worldgen/configured_feature': ResourceWorldgenConfiguredFeature,
  'worldgen/configured_structure_feature': ResourceWorldgenConfiguredStructureFeature,
  'minecraft:worldgen/configured_structure_feature': ResourceWorldgenConfiguredStructureFeature,
  'worldgen/configured_surface_builder': ResourceWorldgenConfiguredSurfaceBuilder,
  'minecraft:worldgen/configured_surface_builder': ResourceWorldgenConfiguredSurfaceBuilder,
  'worldgen/density_function': ResourceWorldgenDensityFunction,
  'minecraft:worldgen/density_function': ResourceWorldgenDensityFunction,
  'worldgen/flat_level_generator_preset': ResourceWorldgenFlatLevelGeneratorPreset,
  'minecraft:worldgen/flat_level_generator_preset': ResourceWorldgenFlatLevelGeneratorPreset,
  'worldgen/multi_noise_biome_source_parameter_list': ResourceWorldgenMultiNoiseBiomeSourceParameterList,
  'minecraft:worldgen/multi_noise_biome_source_parameter_list': ResourceWorldgenMultiNoiseBiomeSourceParameterList,
  'worldgen/noise': ResourceWorldgenNoise,
  'minecraft:worldgen/noise': ResourceWorldgenNoise,
  'worldgen/noise_settings': ResourceWorldgenNoiseSettings,
  'minecraft:worldgen/noise_settings': ResourceWorldgenNoiseSettings,
  'worldgen/placed_feature': ResourceWorldgenPlacedFeature,
  'minecraft:worldgen/placed_feature': ResourceWorldgenPlacedFeature,
  'worldgen/processor_list': ResourceWorldgenProcessorList,
  'minecraft:worldgen/processor_list': ResourceWorldgenProcessorList,
  'worldgen/structure': ResourceWorldgenStructure,
  'minecraft:worldgen/structure': ResourceWorldgenStructure,
  'worldgen/structure_set': ResourceWorldgenStructureSet,
  'minecraft:worldgen/structure_set': ResourceWorldgenStructureSet,
  'worldgen/template_pool': ResourceWorldgenTemplatePool,
  'minecraft:worldgen/template_pool': ResourceWorldgenTemplatePool,
  'worldgen/world_preset': ResourceWorldgenWorldPreset,
  'minecraft:worldgen/world_preset': ResourceWorldgenWorldPreset,
  'zombie_nautilus_variant': ResourceZombieNautilusVariant,
  'minecraft:zombie_nautilus_variant': ResourceZombieNautilusVariant,
}
type ResourceKeys = keyof ResourceDispatcherMap
type ResourceFallback = (
  | ResourceAdvancement
  | ResourceAtlas
  | ResourceBannerPattern
  | ResourceBlockDefinition
  | ResourceCatSoundVariant
  | ResourceCatVariant
  | ResourceChatType
  | ResourceChickenSoundVariant
  | ResourceChickenVariant
  | ResourceCowSoundVariant
  | ResourceCowVariant
  | ResourceCredits
  | ResourceDamageType
  | ResourceDialog
  | ResourceDimension
  | ResourceDimensionType
  | ResourceEnchantment
  | ResourceEnchantmentProvider
  | ResourceEquipment
  | ResourceFont
  | ResourceFrogVariant
  | ResourceGpuWarnlist
  | ResourceInstrument
  | ResourceItemDefinition
  | ResourceItemModifier
  | ResourceJukeboxSong
  | ResourceLang
  | ResourceLangDeprecated
  | ResourceLootTable
  | ResourceModel
  | ResourcePaintingVariant
  | ResourceParticle
  | ResourcePigSoundVariant
  | ResourcePigVariant
  | ResourcePostEffect
  | ResourcePredicate
  | ResourceRecipe
  | ResourceRegionalCompliancies
  | ResourceShader
  | ResourceSounds
  | ResourceTestEnvironment
  | ResourceTestInstance
  | ResourceTextureMeta
  | ResourceTimeline
  | ResourceTradeSet
  | ResourceTrialSpawner
  | ResourceTrimMaterial
  | ResourceTrimPattern
  | ResourceVillagerTrade
  | ResourceWaypointStyle
  | ResourceWolfSoundVariant
  | ResourceWolfVariant
  | ResourceWorldClock
  | ResourceWorldgenBiome
  | ResourceWorldgenConfiguredCarver
  | ResourceWorldgenConfiguredFeature
  | ResourceWorldgenConfiguredStructureFeature
  | ResourceWorldgenConfiguredSurfaceBuilder
  | ResourceWorldgenDensityFunction
  | ResourceWorldgenFlatLevelGeneratorPreset
  | ResourceWorldgenMultiNoiseBiomeSourceParameterList
  | ResourceWorldgenNoise
  | ResourceWorldgenNoiseSettings
  | ResourceWorldgenPlacedFeature
  | ResourceWorldgenProcessorList
  | ResourceWorldgenStructure
  | ResourceWorldgenStructureSet
  | ResourceWorldgenTemplatePool
  | ResourceWorldgenWorldPreset
  | ResourceZombieNautilusVariant)
type ResourceAdvancement = Advancement
type ResourceAtlas = Atlas
type ResourceBannerPattern = BannerPattern
type ResourceBlockDefinition = BlockStateDefinition
type ResourceCatSoundVariant = SoundVariant<CatSounds>
type ResourceCatVariant = CatVariant
type ResourceChatType = ChatType
type ResourceChickenSoundVariant = SoundVariant<ChickenSounds>
type ResourceChickenVariant = ChickenVariant
type ResourceCowSoundVariant = CowSounds
type ResourceCowVariant = CowVariant
type ResourceCredits = Credits
type ResourceDamageType = DamageType
type ResourceDialog = Dialog
type ResourceDimension = Dimension
type ResourceDimensionType = DimensionType
type ResourceEnchantment = Enchantment
type ResourceEnchantmentProvider = EnchantmentProvider
type ResourceEquipment = Equipment
type ResourceFont = Font
type ResourceFrogVariant = FrogVariant
type ResourceGpuWarnlist = GpuWarnlist
type ResourceInstrument = Instrument
type ResourceItemDefinition = ItemDefinition
type ResourceItemModifier = ItemModifier
type ResourceJukeboxSong = JukeboxSong
type ResourceLang = Lang
type ResourceLangDeprecated = LangDeprecated
type ResourceLootTable = LootTable
type ResourceModel = Model
type ResourcePaintingVariant = PaintingVariant
type ResourceParticle = Particle
type ResourcePigSoundVariant = SoundVariant<PigSounds>
type ResourcePigVariant = PigVariant
type ResourcePostEffect = PostEffect
type ResourcePredicate = Predicate
type ResourceRecipe = Recipe
type ResourceRegionalCompliancies = RegionalCompliancies
type ResourceShader = ShaderProgram
type ResourceSounds = Sounds
type ResourceTestEnvironment = TestEnvironment
type ResourceTestInstance = TestInstance
type ResourceTextureMeta = TextureMeta
type ResourceTimeline = Timeline
type ResourceTradeSet = TradeSet
type ResourceTrialSpawner = TrialSpawnerConfig
type ResourceTrimMaterial = TrimMaterial
type ResourceTrimPattern = TrimPattern
type ResourceVillagerTrade = VillagerTrade
type ResourceWaypointStyle = WaypointStyle
type ResourceWolfSoundVariant = SoundVariant<WolfSounds>
type ResourceWolfVariant = WolfVariant
type ResourceWorldClock = Record<string, never>
type ResourceWorldgenBiome = Biome
type ResourceWorldgenConfiguredCarver = ConfiguredCarver
type ResourceWorldgenConfiguredFeature = ConfiguredFeature
type ResourceWorldgenConfiguredStructureFeature = Structure
type ResourceWorldgenConfiguredSurfaceBuilder = ConfiguredSurfaceBuilder
type ResourceWorldgenDensityFunction = DensityFunction
type ResourceWorldgenFlatLevelGeneratorPreset = FlatGeneratorPreset
type ResourceWorldgenMultiNoiseBiomeSourceParameterList = MultiNoiseBiomeSourceParameterList
type ResourceWorldgenNoise = NoiseParameters
type ResourceWorldgenNoiseSettings = NoiseGeneratorSettings
type ResourceWorldgenPlacedFeature = PlacedFeature
type ResourceWorldgenProcessorList = ProcessorList
type ResourceWorldgenStructure = Structure
type ResourceWorldgenStructureSet = StructureSet
type ResourceWorldgenTemplatePool = TemplatePool
type ResourceWorldgenWorldPreset = WorldPreset
type ResourceZombieNautilusVariant = ZombieNautilusVariant
export type SymbolResource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ResourceDispatcherMap
  : CASE extends 'keys' ? ResourceKeys : CASE extends '%fallback' ? ResourceFallback : never
